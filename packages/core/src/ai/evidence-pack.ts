import path from "node:path";
import type { FindingEvidence, FindingSeverity } from "../findings/finding.js";
import type { ReportFindingStatus, ReportModel } from "../report/report-model.js";

export interface EvidencePack {
  schemaVersion: "0.1.0";
  project: {
    inferredProjectType: ReportModel["project"]["inferredProjectType"];
  };
  profile: ReportModel["profile"];
  summary: {
    totalFindings: number;
    bySeverity: Record<FindingSeverity, number>;
    byStatus: Record<ReportFindingStatus, number>;
  };
  findings: EvidencePackFinding[];
  rawArtifacts: EvidencePackArtifact[];
}

export interface EvidencePackFinding {
  findingId: string;
  severity: FindingSeverity;
  status: ReportFindingStatus;
  ruleId: string;
  title: string;
  message: string;
  impact?: string;
  recommendation: string;
  evidence: EvidencePackEvidence[];
}

export interface EvidencePackEvidence {
  type: FindingEvidence["type"];
  path?: string;
  command?: string;
  excerpt?: string;
  dataSummary?: string;
}

export interface EvidencePackArtifact {
  kind: string;
  path: string;
  exitCode?: number | null;
}

const maxTextLength = 240;
const safeDataKeys = [
  "Reference",
  "Designator",
  "Ref",
  "Value",
  "Footprint",
  "Qty",
  "MPN",
  "LCSC",
  "DNP",
  "Layer",
  "Rotation"
];

export function createEvidencePack(report: ReportModel): EvidencePack {
  const projectRoot = path.resolve(report.project.inputPath);

  return {
    schemaVersion: "0.1.0",
    project: {
      inferredProjectType: report.project.inferredProjectType
    },
    profile: report.profile,
    summary: {
      totalFindings: report.summary.totalFindings,
      bySeverity: report.summary.bySeverity,
      byStatus: report.summary.byStatus
    },
    findings: report.findings.map((finding) => ({
      findingId: finding.id,
      severity: finding.severity,
      status: finding.status,
      ruleId: finding.ruleId,
      title: finding.title,
      message: finding.message,
      impact: finding.impact,
      recommendation: finding.recommendation,
      evidence: finding.evidence.map((evidence) => summarizeEvidence(evidence, projectRoot))
    })),
    rawArtifacts: report.rawArtifacts.map((artifact) => ({
      kind: artifact.kind,
      path: summarizePath(artifact.path, projectRoot),
      exitCode: artifact.exitCode
    }))
  };
}

function summarizeEvidence(evidence: FindingEvidence, projectRoot: string): EvidencePackEvidence {
  return {
    type: evidence.type,
    path: evidence.path ? summarizePath(evidence.path, projectRoot) : undefined,
    command: evidence.command,
    excerpt: evidence.excerpt ? singleLine(evidence.excerpt) : undefined,
    dataSummary: summarizeEvidenceData(evidence.data)
  };
}

function summarizeEvidenceData(data: unknown): string | undefined {
  if (data === undefined) return undefined;
  if (data === null) return "null";
  if (typeof data !== "object") return singleLine(String(data));
  if (Array.isArray(data)) return `array(${data.length})`;

  const record = data as Record<string, unknown>;
  const safeSubset: Record<string, unknown> = {};
  for (const key of safeDataKeys) {
    if (key in record) safeSubset[key] = record[key];
  }

  if (Object.keys(safeSubset).length > 0) {
    return singleLine(JSON.stringify(safeSubset));
  }

  return `object keys: ${Object.keys(record).slice(0, 12).join(", ")}`;
}

function summarizePath(filePath: string, projectRoot: string): string {
  const normalizedPath = path.isAbsolute(filePath) ? path.normalize(filePath) : path.resolve(projectRoot, filePath);
  const relativePath = path.relative(projectRoot, normalizedPath);
  if (isProjectRelativePath(relativePath)) {
    return toPortablePath(relativePath);
  }

  return path.basename(normalizedPath);
}

function isProjectRelativePath(relativePath: string): boolean {
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

function toPortablePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").slice(0, maxTextLength);
}
