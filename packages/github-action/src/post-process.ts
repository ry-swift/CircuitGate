import { readFile } from "node:fs/promises";

type Severity = "critical" | "high" | "medium" | "low" | "info";

interface ReportFinding {
  id: string;
  severity: Severity;
  status: string;
  ruleId: string;
  title: string;
  recommendation: string;
}

interface ReportModel {
  project: { inputPath: string };
  profile: string;
  summary: {
    totalFindings: number;
    bySeverity: Record<Severity, number>;
  };
  findings: ReportFinding[];
}

interface Args {
  reportJson: string;
  reportMarkdown?: string;
  comment: boolean;
  failOnSeverity: Severity | "none";
  artifactName: string;
}

const severityRank: Record<Severity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1
};

async function main(argv: string[]): Promise<void> {
  const args = parseArgs(argv);
  const report = JSON.parse(await readFile(args.reportJson, "utf8")) as ReportModel;
  const commentBody = buildComment(report, args);

  process.stdout.write(`${commentBody}\n`);

  if (args.comment) {
    await postPullRequestComment(commentBody);
  }

  if (shouldFail(report, args.failOnSeverity)) {
    throw new Error(`CircuitGate found findings at or above ${args.failOnSeverity}.`);
  }
}

function parseArgs(argv: string[]): Args {
  const flags = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith("--")) continue;
    const [key, inlineValue] = token.slice(2).split("=", 2);
    const value = inlineValue ?? argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}.`);
    }
    flags.set(key, value);
    if (inlineValue === undefined) index += 1;
  }

  const reportJson = flags.get("report-json");
  if (!reportJson) {
    throw new Error("Missing --report-json.");
  }

  const failOnSeverity = flags.get("fail-on-severity") ?? "critical";
  if (!isFailSeverity(failOnSeverity)) {
    throw new Error(`Unsupported --fail-on-severity "${failOnSeverity}".`);
  }

  return {
    reportJson,
    reportMarkdown: flags.get("report-markdown"),
    comment: (flags.get("comment") ?? "false").toLowerCase() === "true",
    failOnSeverity,
    artifactName: flags.get("artifact-name") ?? "circuitgate-review"
  };
}

function buildComment(report: ReportModel, args: Args): string {
  const highRisk = report.findings.filter((finding) => finding.severity === "critical" || finding.severity === "high");
  const lines = [
    "## CircuitGate Review",
    "",
    `Project: \`${report.project.inputPath}\``,
    `Profile: \`${report.profile}\``,
    "",
    "| Severity | Count |",
    "| --- | ---: |",
    `| Critical | ${report.summary.bySeverity.critical} |`,
    `| High | ${report.summary.bySeverity.high} |`,
    `| Medium | ${report.summary.bySeverity.medium} |`,
    `| Low | ${report.summary.bySeverity.low} |`,
    `| Info | ${report.summary.bySeverity.info} |`,
    "",
    `Artifact: \`${args.artifactName}\``
  ];

  if (args.reportMarkdown) {
    lines.push(`Markdown report: \`${args.reportMarkdown}\``);
  }

  lines.push("", "### Critical/High Findings", "");
  if (highRisk.length === 0) {
    lines.push("No critical or high findings.");
  } else {
    for (const finding of highRisk.slice(0, 10)) {
      lines.push(`- **${finding.severity.toUpperCase()} ${finding.id}** (${finding.ruleId}, ${finding.status}): ${finding.title}`);
      lines.push(`  - ${finding.recommendation}`);
    }
    if (highRisk.length > 10) {
      lines.push(`- ${highRisk.length - 10} additional critical/high findings are in the artifact.`);
    }
  }

  return lines.join("\n");
}

async function postPullRequestComment(body: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const apiUrl = process.env.GITHUB_API_URL ?? "https://api.github.com";
  if (!token || !repository || !eventPath) {
    process.stdout.write("Skipping PR comment because GitHub token, repository, or event path is missing.\n");
    return;
  }

  const event = JSON.parse(await readFile(eventPath, "utf8")) as { pull_request?: { number?: number } };
  const pullNumber = event.pull_request?.number;
  if (!pullNumber) {
    process.stdout.write("Skipping PR comment because this event is not a pull request.\n");
    return;
  }

  const response = await fetch(`${apiUrl}/repos/${repository}/issues/${pullNumber}/comments`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "circuitgate-action"
    },
    body: JSON.stringify({ body })
  });

  if (!response.ok) {
    throw new Error(`GitHub comment failed: ${response.status} ${await response.text()}`);
  }
}

function shouldFail(report: ReportModel, threshold: Args["failOnSeverity"]): boolean {
  if (threshold === "none") return false;
  const thresholdRank = severityRank[threshold];
  return report.findings.some((finding) => severityRank[finding.severity] >= thresholdRank);
}

function isFailSeverity(value: string): value is Args["failOnSeverity"] {
  return value === "none" || value === "critical" || value === "high" || value === "medium" || value === "low" || value === "info";
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`CircuitGate action error: ${message}\n`);
  process.exitCode = 1;
});
