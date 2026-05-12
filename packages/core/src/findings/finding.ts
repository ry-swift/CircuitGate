export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export type FindingSource =
  | "intake"
  | "kicad-cli"
  | "kicad-erc"
  | "kicad-drc"
  | "system";

export interface FindingEvidence {
  type: "file" | "command" | "tool-output" | "manifest" | "diagnostic";
  path?: string;
  command?: string;
  excerpt?: string;
  data?: unknown;
}

export interface FindingWaiver {
  allowed: boolean;
  reason?: string;
}

export interface Finding {
  id: string;
  source: FindingSource;
  severity: FindingSeverity;
  ruleId: string;
  title: string;
  message: string;
  evidence: FindingEvidence[];
  recommendation: string;
  waiver: FindingWaiver;
}

export function createFinding(finding: Finding): Finding {
  return finding;
}
