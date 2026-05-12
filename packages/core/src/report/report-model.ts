import type { Finding, FindingSeverity } from "../findings/finding.js";
import type { DesignManifest } from "../intake/design-manifest.js";
import type { KiCadRawOutput } from "../kicad/kicad-cli.js";

export type ReportFindingStatus = "automated" | "needs-human-review" | "blocked-by-missing-input";

export interface ReportArtifact {
  kind: string;
  path: string;
  command?: string[];
  exitCode?: number | null;
}

export interface ReportFinding {
  id: string;
  source: Finding["source"];
  severity: FindingSeverity;
  status: ReportFindingStatus;
  ruleId: string;
  title: string;
  message: string;
  impact?: string;
  evidence: Finding["evidence"];
  recommendation: string;
  waiver: Finding["waiver"];
}

export interface ReportModel {
  schemaVersion: "0.1.0";
  project: {
    inputPath: string;
    inferredProjectType: DesignManifest["inferredProjectType"];
  };
  profile: DesignManifest["profile"];
  runMetadata: {
    generatedAt: string;
    tool: "circuitgate";
    ruleSummary?: {
      loaded: number;
      executed: number;
      failures: Array<{ ruleId: string; title: string; message: string }>;
    };
  };
  summary: {
    totalFindings: number;
    bySeverity: Record<FindingSeverity, number>;
    byStatus: Record<ReportFindingStatus, number>;
    blockingCount: number;
    humanReviewCount: number;
    missingInputCount: number;
  };
  findings: ReportFinding[];
  findingsBySeverity: Record<FindingSeverity, ReportFinding[]>;
  blockingFindings: ReportFinding[];
  waivers: Array<{
    findingId: string;
    allowed: boolean;
    reason?: string;
  }>;
  rawArtifacts: ReportArtifact[];
}

export interface CreateReportModelInput {
  manifest: DesignManifest;
  findings: Finding[];
  rawOutputs: KiCadRawOutput[];
  generatedAt?: string;
  ruleSummary?: ReportModel["runMetadata"]["ruleSummary"];
}

const severities: FindingSeverity[] = ["critical", "high", "medium", "low", "info"];
const statuses: ReportFindingStatus[] = ["automated", "needs-human-review", "blocked-by-missing-input"];

export function createReportModel(input: CreateReportModelInput): ReportModel {
  const findings = input.findings.map(toReportFinding);
  const findingsBySeverity = emptyFindingBuckets();
  const bySeverity = zeroSeverityCounts();
  const byStatus = zeroStatusCounts();

  for (const finding of findings) {
    bySeverity[finding.severity] += 1;
    byStatus[finding.status] += 1;
    findingsBySeverity[finding.severity].push(finding);
  }

  return {
    schemaVersion: "0.1.0",
    project: {
      inputPath: input.manifest.inputPath,
      inferredProjectType: input.manifest.inferredProjectType
    },
    profile: input.manifest.profile,
    runMetadata: {
      generatedAt: input.generatedAt ?? new Date().toISOString(),
      tool: "circuitgate",
      ruleSummary: input.ruleSummary
    },
    summary: {
      totalFindings: findings.length,
      bySeverity,
      byStatus,
      blockingCount: bySeverity.critical + bySeverity.high,
      humanReviewCount: byStatus["needs-human-review"],
      missingInputCount: byStatus["blocked-by-missing-input"]
    },
    findings,
    findingsBySeverity,
    blockingFindings: findings.filter((finding) => finding.severity === "critical" || finding.severity === "high"),
    waivers: findings.map((finding) => ({
      findingId: finding.id,
      allowed: finding.waiver.allowed,
      reason: finding.waiver.reason
    })),
    rawArtifacts: input.rawOutputs.map((output) => ({
      kind: `kicad-${output.kind}`,
      path: output.outputPath,
      command: output.command,
      exitCode: output.exitCode
    }))
  };
}

export function toReportFinding(finding: Finding): ReportFinding {
  return {
    id: finding.id,
    source: finding.source,
    severity: finding.severity,
    status: normalizeFindingStatus(finding),
    ruleId: finding.ruleId,
    title: finding.title,
    message: finding.message,
    impact: finding.impact,
    evidence: finding.evidence,
    recommendation: finding.recommendation,
    waiver: finding.waiver
  };
}

export function normalizeFindingStatus(finding: Finding): ReportFindingStatus {
  if (finding.status === "needs-human-review" || finding.status === "blocked-by-missing-input") {
    return finding.status;
  }
  return "automated";
}

function zeroSeverityCounts(): Record<FindingSeverity, number> {
  return {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  };
}

function zeroStatusCounts(): Record<ReportFindingStatus, number> {
  return {
    automated: 0,
    "needs-human-review": 0,
    "blocked-by-missing-input": 0
  };
}

function emptyFindingBuckets(): Record<FindingSeverity, ReportFinding[]> {
  return {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: []
  };
}
