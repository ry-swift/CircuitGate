import type { FindingSeverity } from "../findings/finding.js";
import type { ArtifactKind, ManufacturerProfile } from "../intake/design-manifest.js";

export type RuleCategory = "power" | "interface" | "pcb" | "bom" | "manufacturing";

export type RuleCheckDefinition =
  | {
      type: "artifact-present";
      anyOf: ArtifactKind[];
      status?: "blocked-by-missing-input" | "open";
    }
  | {
      type: "profile-required";
      allowedProfiles: ManufacturerProfile[];
    }
  | {
      type: "bom-required-values";
      columns: string[][];
      exemptDnp?: boolean;
    }
  | {
      type: "bom-quantity-matches-refdes";
      referenceColumns: string[];
      quantityColumns: string[];
    }
  | {
      type: "bom-dnp-structured";
      columns: string[];
    }
  | {
      type: "cpl-refdes-match-bom";
      bomReferenceColumns: string[];
      cplReferenceColumns: string[];
    }
  | {
      type: "cpl-required-values";
      columns: string[][];
    }
  | {
      type: "cpl-coordinate-values";
      xColumns: string[];
      yColumns: string[];
    }
  | {
      type: "cpl-side-values";
      columns: string[];
      allowedValues: string[];
    }
  | {
      type: "checklist";
      status: "needs-human-review";
    }
  | {
      type: "throw";
      reason: string;
    };

export interface RuleEvidenceRequirement {
  type: "file" | "manifest" | "bom-row" | "cpl-row" | "tool-output" | "rule";
  required: boolean;
  description: string;
}

export interface RuleApplicability {
  artifacts?: ArtifactKind[];
  profiles?: ManufacturerProfile[];
}

export interface RuleDefinition {
  id: string;
  title: string;
  category: RuleCategory;
  severity: FindingSeverity;
  appliesTo: RuleApplicability;
  inputs: ArtifactKind[];
  evidence: RuleEvidenceRequirement[];
  message: string;
  recommendation: string;
  falsePositiveNotes: string;
  impact?: string;
  check: RuleCheckDefinition;
}

export interface RuleValidationResult {
  valid: boolean;
  errors: string[];
}

const categories = new Set<RuleCategory>(["power", "interface", "pcb", "bom", "manufacturing"]);
const severities = new Set<FindingSeverity>(["critical", "high", "medium", "low", "info"]);
const profiles = new Set<ManufacturerProfile>(["generic", "jlcpcb", "pcbway"]);

export function validateRuleDefinition(value: unknown, sourcePath = "<inline>"): RuleValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return { valid: false, errors: [`${sourcePath}: rule must be an object.`] };
  }

  const id = stringValue(value.id) ?? sourcePath;
  requireString(value, "id", id, errors);
  requireString(value, "title", id, errors);
  requireString(value, "message", id, errors);
  requireString(value, "recommendation", id, errors);
  requireString(value, "falsePositiveNotes", id, errors);

  if (!stringValue(value.severity) || !severities.has(value.severity as FindingSeverity)) {
    errors.push(`${id}: severity must be one of ${Array.from(severities).join(", ")}.`);
  }
  if (!stringValue(value.category) || !categories.has(value.category as RuleCategory)) {
    errors.push(`${id}: category must be one of ${Array.from(categories).join(", ")}.`);
  }
  if (!Array.isArray(value.inputs) || value.inputs.length === 0 || !value.inputs.every((item) => typeof item === "string")) {
    errors.push(`${id}: inputs must be a non-empty string array.`);
  }
  if (!Array.isArray(value.evidence) || value.evidence.length === 0) {
    errors.push(`${id}: evidence must contain at least one requirement.`);
  } else {
    for (const [index, item] of value.evidence.entries()) {
      if (!isRecord(item)) {
        errors.push(`${id}: evidence[${index}] must be an object.`);
        continue;
      }
      requireString(item, "type", id, errors, `evidence[${index}].`);
      requireString(item, "description", id, errors, `evidence[${index}].`);
      if (typeof item.required !== "boolean") {
        errors.push(`${id}: evidence[${index}].required must be boolean.`);
      }
    }
  }

  validateAppliesTo(value.appliesTo, id, errors);
  validateCheck(value.check, id, errors);

  return { valid: errors.length === 0, errors };
}

export function assertValidRuleDefinition(value: unknown, sourcePath = "<inline>"): RuleDefinition {
  const result = validateRuleDefinition(value, sourcePath);
  if (!result.valid) {
    throw new Error(result.errors.join("\n"));
  }
  return value as RuleDefinition;
}

function validateAppliesTo(value: unknown, id: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${id}: appliesTo must be an object.`);
    return;
  }
  if (value.profiles !== undefined) {
    if (!Array.isArray(value.profiles) || !value.profiles.every((item) => profiles.has(item as ManufacturerProfile))) {
      errors.push(`${id}: appliesTo.profiles contains an unsupported profile.`);
    }
  }
  if (value.artifacts !== undefined && (!Array.isArray(value.artifacts) || !value.artifacts.every((item) => typeof item === "string"))) {
    errors.push(`${id}: appliesTo.artifacts must be a string array.`);
  }
}

function validateCheck(value: unknown, id: string, errors: string[]): void {
  if (!isRecord(value) || !stringValue(value.type)) {
    errors.push(`${id}: check.type is required.`);
    return;
  }
  switch (value.type) {
    case "artifact-present":
      if (!Array.isArray(value.anyOf) || value.anyOf.length === 0) {
        errors.push(`${id}: artifact-present.anyOf must be non-empty.`);
      }
      break;
    case "profile-required":
      if (!Array.isArray(value.allowedProfiles) || value.allowedProfiles.length === 0) {
        errors.push(`${id}: profile-required.allowedProfiles must be non-empty.`);
      }
      break;
    case "bom-required-values":
    case "cpl-required-values":
      if (!Array.isArray(value.columns) || value.columns.length === 0) {
        errors.push(`${id}: ${value.type}.columns must be non-empty.`);
      }
      break;
    case "bom-quantity-matches-refdes":
      requireStringArray(value.referenceColumns, id, "referenceColumns", errors);
      requireStringArray(value.quantityColumns, id, "quantityColumns", errors);
      break;
    case "bom-dnp-structured":
    case "cpl-side-values":
      requireStringArray(value.columns, id, "columns", errors);
      break;
    case "cpl-refdes-match-bom":
      requireStringArray(value.bomReferenceColumns, id, "bomReferenceColumns", errors);
      requireStringArray(value.cplReferenceColumns, id, "cplReferenceColumns", errors);
      break;
    case "cpl-coordinate-values":
      requireStringArray(value.xColumns, id, "xColumns", errors);
      requireStringArray(value.yColumns, id, "yColumns", errors);
      break;
    case "checklist":
      if (value.status !== "needs-human-review") {
        errors.push(`${id}: checklist.status must be needs-human-review.`);
      }
      break;
    case "throw":
      requireString(value, "reason", id, errors);
      break;
    default:
      errors.push(`${id}: unsupported check.type "${String(value.type)}".`);
  }
}

function requireString(record: Record<string, unknown>, key: string, id: string, errors: string[], prefix = ""): void {
  if (!stringValue(record[key])) {
    errors.push(`${id}: ${prefix}${key} is required.`);
  }
}

function requireStringArray(value: unknown, id: string, key: string, errors: string[]): void {
  if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string")) {
    errors.push(`${id}: ${key} must be a non-empty string array.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}
