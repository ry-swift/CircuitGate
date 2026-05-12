#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createReportModel,
  createDesignManifest,
  findingsFromManifest,
  loadRuleDefinitions,
  renderJsonReport,
  renderMarkdownReport,
  runKiCadChecks,
  runRules,
  validateRuleDirectory,
  type ReportModel
} from "@circuitgate/core";

type OutputFormat = "json" | "markdown";

interface ReviewArgs {
  projectPath: string;
  profile: string;
  format: OutputFormat;
  output?: string;
  rulesRoot: string;
}

async function main(argv: string[]): Promise<void> {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  const [command, ...rest] = argv;
  if (command === "rules") {
    await runRulesCommand(rest);
    return;
  }

  if (command !== "review") {
    throw new Error(`Unknown command "${command}". Run circuitgate --help.`);
  }

  const args = parseReviewArgs(rest);
  const report = await review(args);
  const rendered = args.format === "json" ? renderJsonReport(report) : renderMarkdownReport(report);

  if (args.output) {
    await mkdir(path.dirname(path.resolve(args.output)), { recursive: true });
    await writeFile(args.output, rendered, "utf8");
  } else {
    process.stdout.write(rendered);
  }
}

async function review(args: ReviewArgs): Promise<ReportModel> {
  const manifest = await createDesignManifest(args.projectPath, { profile: args.profile });
  const intakeFindings = findingsFromManifest(manifest);
  const rawOutputDir = path.join(manifest.inputPath, ".circuitgate");
  const kicadResult = await runKiCadChecks(manifest, { outputDir: rawOutputDir });
  const rules = await loadRuleDefinitions({ root: args.rulesRoot, profile: manifest.profile });
  const ruleResult = await runRules({ manifest, rules });
  const findings = [...intakeFindings, ...kicadResult.findings, ...ruleResult.findings];

  return createReportModel({
    manifest,
    rawOutputs: kicadResult.rawOutputs,
    findings,
    ruleSummary: {
      loaded: ruleResult.loaded,
      executed: ruleResult.executed,
      failures: ruleResult.failures
    }
  });
}

async function runRulesCommand(argv: string[]): Promise<void> {
  const [subcommand, ...rest] = argv;
  if (subcommand !== "validate") {
    throw new Error(`Unknown rules command "${subcommand ?? ""}". Use: circuitgate rules validate.`);
  }
  const flags = parseFlags(rest);
  const rulesRoot = path.resolve(flags.get("rules") ?? "rules");
  const result = await validateRuleDirectory(rulesRoot);
  if (!result.valid) {
    throw new Error(`Rule validation failed:\n${result.errors.join("\n")}`);
  }
  process.stdout.write(`Validated ${result.count} CircuitGate rules in ${rulesRoot}\n`);
}

function parseReviewArgs(argv: string[]): ReviewArgs {
  const positional: string[] = [];
  const flags = parseFlags(argv, positional);
  const projectPath = positional[0];
  if (!projectPath) {
    throw new Error("Missing project path. Example: circuitgate review examples/blinky --profile jlcpcb");
  }

  const format = flags.get("format") ?? "json";
  if (format !== "json" && format !== "markdown") {
    throw new Error(`Unsupported --format "${format}". Use json or markdown.`);
  }

  return {
    projectPath,
    profile: flags.get("profile") ?? "generic",
    format,
    output: flags.get("output"),
    rulesRoot: path.resolve(flags.get("rules") ?? "rules")
  };
}

function parseFlags(argv: string[], positional: string[] = []): Map<string, string> {
  const flags = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token) continue;
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const value = inlineValue ?? argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${rawKey}.`);
    }
    flags.set(rawKey, value);
    if (inlineValue === undefined) {
      index += 1;
    }
  }

  return flags;
}

function printHelp(): void {
  process.stdout.write(`CircuitGate CLI

Usage:
  circuitgate review <path> [--profile generic|jlcpcb|pcbway] [--format json|markdown] [--output file]
  circuitgate rules validate [--rules rules]

Examples:
  circuitgate review examples/blinky --profile jlcpcb --format json
  circuitgate review examples/blinky --profile pcbway --format markdown --output report.md
  circuitgate rules validate
`);
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`CircuitGate error: ${message}\n`);
  process.exitCode = 1;
});
