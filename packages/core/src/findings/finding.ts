export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export type FindingSource =
  | "intake"
  | "rule"
  | "kicad-cli"
  | "kicad-erc"
  | "kicad-drc"
  | "system";

export interface FindingEvidence {
  type: "file" | "command" | "tool-output" | "manifest" | "diagnostic" | "rule" | "bom-row" | "cpl-row";
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
  status?: "open" | "needs-human-review" | "blocked-by-missing-input";
  impact?: string;
  evidence: FindingEvidence[];
  recommendation: string;
  waiver: FindingWaiver;
}

export function createFinding(finding: Finding): Finding {
  return finding;
}
