import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createFinding, type Finding, type FindingSeverity, type FindingSource } from "../findings/finding.js";
import type { DesignManifest } from "../intake/design-manifest.js";

export interface KiCadRawOutput {
  kind: "erc" | "drc";
  command: string[];
  outputPath: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

export interface KiCadCheckResult {
  toolAvailable: boolean;
  rawOutputs: KiCadRawOutput[];
  findings: Finding[];
}

export interface RunKiCadChecksOptions {
  command?: string;
  outputDir?: string;
  timeoutMs?: number;
}

export async function runKiCadChecks(
  manifest: DesignManifest,
  options: RunKiCadChecksOptions = {}
): Promise<KiCadCheckResult> {
  const command = options.command ?? "kicad-cli";
  const outputDir = options.outputDir ?? path.join(manifest.inputPath, ".circuitgate");
  const timeoutMs = options.timeoutMs ?? 30_000;
  const available = await commandExists(command, timeoutMs);

  if (!available) {
    return {
      toolAvailable: false,
      rawOutputs: [],
      findings: [
        createFinding({
          id: "CG-KICAD-CLI-MISSING",
          source: "kicad-cli",
          severity: "medium",
          ruleId: "KICD-CLI",
          title: "KiCad CLI is not available",
          message: "`kicad-cli` was not found on PATH, so ERC/DRC could not run.",
          evidence: [{ type: "diagnostic", command }],
          recommendation: "Install KiCad CLI or add it to PATH, then rerun CircuitGate.",
          waiver: { allowed: true, reason: "Local environment prerequisite" }
        })
      ]
    };
  }

  await mkdir(outputDir, { recursive: true });
  const rawOutputs: KiCadRawOutput[] = [];
  const findings: Finding[] = [];
  const schematic = manifest.found["kicad-schematic"][0];
  const board = manifest.found["kicad-board"][0];

  if (schematic) {
    const outputPath = path.join(outputDir, "kicad-erc.json");
    const raw = await runKiCadCommand(
      command,
      ["sch", "erc", "--format", "json", "--severity-all", "--output", outputPath, schematic.path],
      outputPath,
      "erc",
      timeoutMs
    );
    rawOutputs.push(raw);
    findings.push(...(await findingsFromRawOutput(raw, "kicad-erc")));
  }

  if (board) {
    const outputPath = path.join(outputDir, "kicad-drc.json");
    const raw = await runKiCadCommand(
      command,
      ["pcb", "drc", "--format", "json", "--severity-all", "--output", outputPath, board.path],
      outputPath,
      "drc",
      timeoutMs
    );
    rawOutputs.push(raw);
    findings.push(...(await findingsFromRawOutput(raw, "kicad-drc")));
  }

  if (!schematic && !board) {
    findings.push(
      createFinding({
        id: "CG-KICAD-NO-SOURCE",
        source: "kicad-cli",
        severity: "low",
        ruleId: "KICD-SOURCE",
        title: "No KiCad schematic or board file found",
        message: "ERC/DRC were skipped because the input package does not include KiCad source files.",
        evidence: [{ type: "manifest", data: { inputPath: manifest.inputPath } }],
        recommendation: "Provide `.kicad_sch` and `.kicad_pcb` files when source-level checks are required.",
        waiver: { allowed: true }
      })
    );
  }

  return { toolAvailable: true, rawOutputs, findings };
}

export function normalizeKiCadReport(
  report: unknown,
  source: Extract<FindingSource, "kicad-erc" | "kicad-drc">,
  outputPath: string
): Finding[] {
  const records = collectViolationRecords(report);
  if (records.length === 0) {
    return [
      createFinding({
        id: `CG-${source.toUpperCase()}-000`,
        source,
        severity: "info",
        ruleId: source === "kicad-erc" ? "KICD-ERC" : "KICD-DRC",
        title: "No KiCad violations found in parsed output",
        message: "The KiCad JSON report did not contain recognizable violation records.",
        evidence: [{ type: "tool-output", path: outputPath, data: report }],
        recommendation: "Keep the raw KiCad output for traceability.",
        waiver: { allowed: true }
      })
    ];
  }

  return records.map((record, index) =>
    createFinding({
      id: `CG-${source.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      source,
      severity: mapKiCadSeverity(record.severity),
      ruleId: String(record.ruleId ?? (source === "kicad-erc" ? "KICD-ERC" : "KICD-DRC")),
      title: String(record.title ?? record.message ?? "KiCad violation"),
      message: String(record.message ?? record.description ?? record.title ?? "KiCad reported a violation."),
      evidence: [{ type: "tool-output", path: outputPath, data: record }],
      recommendation: "Open the KiCad report, inspect the referenced object, and resolve or explicitly waive it.",
      waiver: { allowed: true }
    })
  );
}

async function findingsFromRawOutput(
  raw: KiCadRawOutput,
  source: Extract<FindingSource, "kicad-erc" | "kicad-drc">
): Promise<Finding[]> {
  if (raw.exitCode !== 0 && raw.exitCode !== 5) {
    return [
      createFinding({
        id: `CG-${source.toUpperCase()}-COMMAND`,
        source,
        severity: "high",
        ruleId: source === "kicad-erc" ? "KICD-ERC" : "KICD-DRC",
        title: `KiCad ${raw.kind.toUpperCase()} command failed`,
        message: raw.stderr || raw.stdout || `KiCad exited with code ${raw.exitCode}.`,
        evidence: [
          { type: "command", command: raw.command.join(" ") },
          { type: "tool-output", path: raw.outputPath, excerpt: raw.stderr || raw.stdout }
        ],
        recommendation: "Verify the KiCad source file is valid for the installed KiCad version.",
        waiver: { allowed: true, reason: "Tool execution failure" }
      })
    ];
  }

  try {
    const output = await readFile(raw.outputPath, "utf8");
    return normalizeKiCadReport(JSON.parse(output), source, raw.outputPath);
  } catch {
    return [
      createFinding({
        id: `CG-${source.toUpperCase()}-RAW`,
        source,
        severity: "info",
        ruleId: source === "kicad-erc" ? "KICD-ERC" : "KICD-DRC",
        title: `KiCad ${raw.kind.toUpperCase()} raw output captured`,
        message: "KiCad completed, but CircuitGate could not parse a JSON report from the output path.",
        evidence: [
          { type: "command", command: raw.command.join(" ") },
          { type: "tool-output", path: raw.outputPath, excerpt: raw.stdout || raw.stderr }
        ],
        recommendation: "Inspect the raw output and update the parser if the KiCad JSON schema changed.",
        waiver: { allowed: true }
      })
    ];
  }
}

async function commandExists(command: string, timeoutMs: number): Promise<boolean> {
  const result = await runProcess(command, ["--version"], timeoutMs);
  return result.errorCode !== "ENOENT";
}

async function runKiCadCommand(
  command: string,
  args: string[],
  outputPath: string,
  kind: "erc" | "drc",
  timeoutMs: number
): Promise<KiCadRawOutput> {
  const result = await runProcess(command, args, timeoutMs);
  return {
    kind,
    command: [command, ...args],
    outputPath,
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

interface ProcessResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  errorCode?: string;
}

function runProcess(command: string, args: string[], timeoutMs: number): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), timeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      resolve({ exitCode: null, stdout, stderr: error.message, errorCode: error.code });
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ exitCode, stdout, stderr });
    });
  });
}

interface ViolationRecord {
  severity?: unknown;
  ruleId?: unknown;
  title?: unknown;
  message?: unknown;
  description?: unknown;
  [key: string]: unknown;
}

function collectViolationRecords(value: unknown): ViolationRecord[] {
  const result: ViolationRecord[] = [];

  function visit(node: unknown): void {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!node || typeof node !== "object") {
      return;
    }

    const record = node as ViolationRecord;
    const hasText = record.message || record.description || record.title;
    const hasSeverity = record.severity || record.severities || record.type;
    if (hasText && hasSeverity) {
      result.push(record);
      return;
    }

    for (const item of Object.values(record)) {
      visit(item);
    }
  }

  visit(value);
  return result;
}

function mapKiCadSeverity(severity: unknown): FindingSeverity {
  const normalized = String(severity ?? "").toLowerCase();
  if (normalized.includes("critical") || normalized.includes("error")) return "high";
  if (normalized.includes("warning")) return "medium";
  if (normalized.includes("excluded") || normalized.includes("ignore")) return "low";
  return "info";
}
