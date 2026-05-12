import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createFinding, type Finding } from "../findings/finding.js";
import type { ArtifactKind, DesignArtifact, DesignManifest, ManufacturerProfile } from "../intake/design-manifest.js";
import { assertValidRuleDefinition, validateRuleDefinition, type RuleDefinition } from "./rule-schema.js";
import type { RuleExecutionResult, RuleFailure, RuleLoadOptions, RuleRunFilters } from "./rule-result.js";

interface RuleRunInput {
  manifest: DesignManifest;
  rules: RuleDefinition[];
  existingFindings?: Finding[];
  filters?: RuleRunFilters;
}

interface CsvTable {
  path: string;
  rows: CsvRow[];
}

type CsvRow = Record<string, string>;

export async function validateRuleDirectory(root: string): Promise<{ valid: boolean; errors: string[]; count: number }> {
  const files = await findRuleFiles(root);
  const errors: string[] = [];
  let count = 0;
  for (const file of files) {
    const parsed = await parseRuleFile(file);
    const candidates = Array.isArray(parsed) ? parsed : [parsed];
    for (const candidate of candidates) {
      count += 1;
      errors.push(...validateRuleDefinition(candidate, file).errors);
    }
  }
  return { valid: errors.length === 0, errors, count };
}

export async function loadRuleDefinitions(options: RuleLoadOptions): Promise<RuleDefinition[]> {
  const files = await findRuleFiles(options.root);
  const rules: RuleDefinition[] = [];
  for (const file of files) {
    const parsed = await parseRuleFile(file);
    const candidates = Array.isArray(parsed) ? parsed : [parsed];
    for (const candidate of candidates) {
      rules.push(assertValidRuleDefinition(candidate, file));
    }
  }
  return filterRules(rules, options);
}

export async function runRules(input: RuleRunInput): Promise<RuleExecutionResult> {
  const rules = filterRules(input.rules, {
    ...input.filters,
    profile: input.filters?.profile ?? input.manifest.profile
  });
  const bomTables = await readTables(input.manifest.found["bom-csv"]);
  const cplTables = await readTables(input.manifest.found["placement-csv"]);
  const findings: Finding[] = [];
  const failures: RuleFailure[] = [];

  for (const rule of rules) {
    try {
      findings.push(...evaluateRule(rule, input.manifest, bomTables, cplTables));
    } catch (error) {
      failures.push({
        ruleId: rule.id,
        title: rule.title,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return {
    loaded: input.rules.length,
    executed: rules.length,
    findings: mergeRuleFindings(findings, input.existingFindings ?? []),
    failures
  };
}

export function mergeRuleFindings(ruleFindings: Finding[], otherFindings: Finding[]): Finding[] {
  return [...ruleFindings, ...otherFindings];
}

function evaluateRule(rule: RuleDefinition, manifest: DesignManifest, bomTables: CsvTable[], cplTables: CsvTable[]): Finding[] {
  switch (rule.check.type) {
    case "artifact-present":
      return hasAnyArtifact(manifest, rule.check.anyOf)
        ? []
        : [findingForRule(rule, [{ type: "manifest", data: { expectedAnyOf: rule.check.anyOf } }], rule.check.status ?? "blocked-by-missing-input")];
    case "profile-required":
      return rule.check.allowedProfiles.includes(manifest.profile)
        ? []
        : [findingForRule(rule, [{ type: "manifest", data: { profile: manifest.profile } }], "blocked-by-missing-input")];
    case "bom-required-values":
      return findingsForMissingCsvValues(rule, bomTables, rule.check.columns, "bom-row", rule.check.exemptDnp);
    case "bom-quantity-matches-refdes":
      return findingsForQuantityMismatch(rule, bomTables, rule.check.referenceColumns, rule.check.quantityColumns);
    case "bom-dnp-structured":
      return findingsForMissingColumns(rule, bomTables, rule.check.columns, "bom-row");
    case "cpl-refdes-match-bom":
      return findingsForCplMismatch(rule, bomTables, cplTables, rule.check.bomReferenceColumns, rule.check.cplReferenceColumns);
    case "cpl-required-values":
      return findingsForMissingCsvValues(rule, cplTables, rule.check.columns, "cpl-row");
    case "cpl-coordinate-values":
      return findingsForInvalidCoordinates(rule, cplTables, rule.check.xColumns, rule.check.yColumns);
    case "cpl-side-values":
      return findingsForInvalidSide(rule, cplTables, rule.check.columns, rule.check.allowedValues);
    case "checklist":
      return [findingForRule(rule, [{ type: "rule", data: { checklist: true } }], "needs-human-review")];
    case "throw":
      throw new Error(rule.check.reason);
  }
}

async function findRuleFiles(root: string): Promise<string[]> {
  const result: string[] = [];
  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const next = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(next);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        result.push(next);
      }
    }
  }
  await walk(root);
  return result.sort();
}

async function parseRuleFile(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8")) as unknown;
}

function filterRules(rules: RuleDefinition[], filters: RuleRunFilters): RuleDefinition[] {
  const profile = filters.profile as ManufacturerProfile | undefined;
  return rules.filter((rule) => {
    if (filters.categories?.length && !filters.categories.includes(rule.category)) return false;
    if (filters.severities?.length && !filters.severities.includes(rule.severity)) return false;
    if (profile && rule.appliesTo.profiles?.length && !rule.appliesTo.profiles.includes(profile)) return false;
    return true;
  });
}

function hasAnyArtifact(manifest: DesignManifest, kinds: ArtifactKind[]): boolean {
  return kinds.some((kind) => manifest.found[kind]?.length > 0);
}

async function readTables(artifacts: DesignArtifact[]): Promise<CsvTable[]> {
  const tables: CsvTable[] = [];
  for (const artifact of artifacts) {
    tables.push({ path: artifact.path, rows: parseCsv(await readFile(artifact.path, "utf8")) });
  }
  return tables;
}

function findingsForMissingCsvValues(
  rule: RuleDefinition,
  tables: CsvTable[],
  columnGroups: string[][],
  evidenceType: "bom-row" | "cpl-row",
  exemptDnp = false
): Finding[] {
  if (tables.length === 0) {
    return [findingForRule(rule, [{ type: "manifest", data: { missingInput: rule.inputs } }], "blocked-by-missing-input")];
  }
  const rows = findRows(tables, (row) => {
    if (exemptDnp && isTruthy(firstValue(row, ["DNP", "Do Not Populate", "Exclude", "Fitted"]) ?? "")) return false;
    return columnGroups.some((group) => !firstValue(row, group));
  });
  return rows.map((row, index) => findingForRule(rule, [{ type: evidenceType, path: row.path, data: row.row }], "open", index + 1));
}

function findingsForMissingColumns(rule: RuleDefinition, tables: CsvTable[], columns: string[], evidenceType: "bom-row" | "cpl-row"): Finding[] {
  if (tables.length === 0) {
    return [findingForRule(rule, [{ type: "manifest", data: { missingInput: rule.inputs } }], "blocked-by-missing-input")];
  }
  const missing = tables.filter((table) => table.rows.length === 0 || !columns.some((column) => column in table.rows[0]!));
  return missing.map((table, index) =>
    findingForRule(rule, [{ type: evidenceType, path: table.path, data: { missingColumns: columns } }], "open", index + 1)
  );
}

function findingsForQuantityMismatch(rule: RuleDefinition, tables: CsvTable[], referenceColumns: string[], quantityColumns: string[]): Finding[] {
  const rows = findRows(tables, (row) => {
    const references = splitRefdes(firstValue(row, referenceColumns) ?? "");
    const quantity = Number(firstValue(row, quantityColumns));
    return references.length > 0 && Number.isFinite(quantity) && quantity !== references.length;
  });
  return rows.map((row, index) => findingForRule(rule, [{ type: "bom-row", path: row.path, data: row.row }], "open", index + 1));
}

function findingsForCplMismatch(
  rule: RuleDefinition,
  bomTables: CsvTable[],
  cplTables: CsvTable[],
  bomReferenceColumns: string[],
  cplReferenceColumns: string[]
): Finding[] {
  if (bomTables.length === 0 || cplTables.length === 0) {
    return [findingForRule(rule, [{ type: "manifest", data: { missingInput: rule.inputs } }], "blocked-by-missing-input")];
  }
  const bomRefs = new Set(findRows(bomTables, () => true).flatMap((item) => splitRefdes(firstValue(item.row, bomReferenceColumns) ?? "")));
  const cplRefs = new Set(findRows(cplTables, () => true).flatMap((item) => splitRefdes(firstValue(item.row, cplReferenceColumns) ?? "")));
  const missingFromCpl = [...bomRefs].filter((ref) => !cplRefs.has(ref));
  const missingFromBom = [...cplRefs].filter((ref) => !bomRefs.has(ref));
  return missingFromCpl.length || missingFromBom.length
    ? [findingForRule(rule, [{ type: "rule", data: { missingFromCpl, missingFromBom } }], "open")]
    : [];
}

function findingsForInvalidCoordinates(rule: RuleDefinition, tables: CsvTable[], xColumns: string[], yColumns: string[]): Finding[] {
  const rows = findRows(tables, (row) => !isNumeric(firstValue(row, xColumns)) || !isNumeric(firstValue(row, yColumns)));
  return rows.map((row, index) => findingForRule(rule, [{ type: "cpl-row", path: row.path, data: row.row }], "open", index + 1));
}

function findingsForInvalidSide(rule: RuleDefinition, tables: CsvTable[], columns: string[], allowedValues: string[]): Finding[] {
  const allowed = new Set(allowedValues.map((value) => value.toLowerCase()));
  const rows = findRows(tables, (row) => {
    const value = firstValue(row, columns);
    return value !== undefined && !allowed.has(value.toLowerCase());
  });
  return rows.map((row, index) => findingForRule(rule, [{ type: "cpl-row", path: row.path, data: row.row }], "open", index + 1));
}

function findingForRule(
  rule: RuleDefinition,
  evidence: Finding["evidence"],
  status: NonNullable<Finding["status"]>,
  occurrence?: number
): Finding {
  return createFinding({
    id: occurrence ? `CG-RULE-${rule.id}-${String(occurrence).padStart(3, "0")}` : `CG-RULE-${rule.id}`,
    source: "rule",
    severity: rule.severity,
    ruleId: rule.id,
    title: rule.title,
    message: rule.message,
    status,
    impact: rule.impact,
    evidence,
    recommendation: rule.recommendation,
    waiver: { allowed: status !== "blocked-by-missing-input", reason: rule.falsePositiveNotes }
  });
}

function findRows(tables: CsvTable[], predicate: (row: CsvRow) => boolean): Array<{ path: string; row: CsvRow }> {
  return tables.flatMap((table) => table.rows.filter(predicate).map((row) => ({ path: table.path, row })));
}

function firstValue(row: CsvRow, columns: string[]): string | undefined {
  for (const column of columns) {
    const value = row[column];
    if (value?.trim()) return value.trim();
  }
  return undefined;
}

function splitRefdes(value: string): string[] {
  return value
    .split(/[,\s;]+/)
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
}

function isTruthy(value: string): boolean {
  return ["1", "true", "yes", "y", "dnp", "exclude", "excluded"].includes(value.trim().toLowerCase());
}

function isNumeric(value: string | undefined): boolean {
  return value !== undefined && value.trim() !== "" && Number.isFinite(Number(value));
}

function parseCsv(input: string): CsvRow[] {
  const records = parseCsvRecords(input);
  const headers = records.shift()?.map((header) => header.trim()) ?? [];
  return records
    .filter((record) => record.some((value) => value.trim()))
    .map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index]?.trim() ?? ""])));
}

function parseCsvRecords(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value || row.length > 0) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}
