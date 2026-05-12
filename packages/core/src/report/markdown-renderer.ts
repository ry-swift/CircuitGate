import type { FindingEvidence } from "../findings/finding.js";
import type { ReportFinding, ReportModel } from "./report-model.js";

export function renderMarkdownReport(model: ReportModel): string {
  const lines = [
    "# CircuitGate Pre-order Review",
    "",
    `Generated: ${model.runMetadata.generatedAt}`,
    `Profile: ${model.profile}`,
    `Project type: ${model.project.inferredProjectType}`,
    `Project path: ${model.project.inputPath}`,
    "",
    "## Risk Summary",
    "",
    `- Total findings: ${model.summary.totalFindings}`,
    `- Critical: ${model.summary.bySeverity.critical}`,
    `- High: ${model.summary.bySeverity.high}`,
    `- Medium: ${model.summary.bySeverity.medium}`,
    `- Low: ${model.summary.bySeverity.low}`,
    `- Info: ${model.summary.bySeverity.info}`,
    `- Automated: ${model.summary.byStatus.automated}`,
    `- Needs human review: ${model.summary.byStatus["needs-human-review"]}`,
    `- Blocked by missing input: ${model.summary.byStatus["blocked-by-missing-input"]}`,
    ""
  ];

  appendSection(lines, "Manufacturing Blockers", manufacturingBlockers(model));
  appendSection(lines, "BOM/CPL Assembly Risks", bomAssemblyRisks(model));
  appendSection(lines, "KiCad ERC/DRC Interpretation", kicadFindings(model));
  appendSection(lines, "Manual Review Checklist", manualReviewFindings(model));
  appendSection(lines, "Blocked by Missing Input", missingInputFindings(model));
  appendSection(lines, "Complete Finding List", model.findings);
  appendWaiverGuide(lines);
  appendEvidenceAppendix(lines, model);
  appendRecheckChecklist(lines);

  return `${lines.join("\n")}\n`;
}

function appendSection(lines: string[], title: string, findings: ReportFinding[]): void {
  lines.push(`## ${title}`, "");
  if (findings.length === 0) {
    lines.push("No findings in this section.", "");
    return;
  }
  for (const finding of findings) {
    appendFinding(lines, finding);
  }
}

function appendFinding(lines: string[], finding: ReportFinding): void {
  lines.push(
    `### ${finding.severity.toUpperCase()} ${finding.id}: ${finding.title}`,
    "",
    `- Rule: ${finding.ruleId}`,
    `- Source: ${finding.source}`,
    `- Status: ${finding.status}`,
    `- Message: ${finding.message}`,
    `- Impact: ${finding.impact ?? "Review the evidence and recommendation before release."}`,
    `- Recommendation: ${finding.recommendation}`,
    `- Waiver: ${finding.waiver.allowed ? "Allowed" : "Not allowed"}${finding.waiver.reason ? ` - ${finding.waiver.reason}` : ""}`,
    "",
    "Evidence:",
    ...finding.evidence.map((item) => `- ${formatEvidence(item)}`),
    ""
  );
}

function appendWaiverGuide(lines: string[]): void {
  lines.push(
    "## Waiver Guide",
    "",
    "Only waive findings when the evidence is understood, the design intent is documented, and the reviewer can explain why the risk is acceptable for this build.",
    "",
    "Waiver table:",
    "",
    "| Finding | Allowed | Reason |",
    "| --- | --- | --- |"
  );
}

function appendEvidenceAppendix(lines: string[], model: ReportModel): void {
  lines.push("", "## Evidence Appendix", "");
  if (model.rawArtifacts.length === 0) {
    lines.push("No raw tool artifacts were produced.", "");
    return;
  }
  for (const artifact of model.rawArtifacts) {
    lines.push(`- ${artifact.kind}: ${artifact.path}${artifact.exitCode === undefined ? "" : ` (exit ${artifact.exitCode})`}`);
  }
  lines.push("");
}

function appendRecheckChecklist(lines: string[]): void {
  lines.push(
    "## Recheck Checklist",
    "",
    "- Regenerate Gerbers, drill, BOM and CPL from the same source revision after fixes.",
    "- Rerun `circuitgate review` with the intended manufacturer profile.",
    "- Review every critical/high automated finding before ordering.",
    "- Review every `needs-human-review` checklist item before treating the report as release-ready.",
    ""
  );
}

function manufacturingBlockers(model: ReportModel): ReportFinding[] {
  return model.findings.filter(
    (finding) =>
      (finding.ruleId.startsWith("MFG-") || finding.status === "blocked-by-missing-input") &&
      (finding.severity === "critical" || finding.severity === "high")
  );
}

function bomAssemblyRisks(model: ReportModel): ReportFinding[] {
  return model.findings.filter((finding) => finding.ruleId.startsWith("BOM-") || finding.ruleId.startsWith("MFG-002"));
}

function kicadFindings(model: ReportModel): ReportFinding[] {
  return model.findings.filter((finding) => finding.source === "kicad-erc" || finding.source === "kicad-drc" || finding.source === "kicad-cli");
}

function manualReviewFindings(model: ReportModel): ReportFinding[] {
  return model.findings.filter((finding) => finding.status === "needs-human-review");
}

function missingInputFindings(model: ReportModel): ReportFinding[] {
  return model.findings.filter((finding) => finding.status === "blocked-by-missing-input");
}

function formatEvidence(evidence: FindingEvidence): string {
  const parts = [`type=${evidence.type}`];
  if (evidence.path) parts.push(`path=${evidence.path}`);
  if (evidence.command) parts.push(`command=${evidence.command}`);
  if (evidence.excerpt) parts.push(`excerpt=${singleLine(evidence.excerpt)}`);
  if (evidence.data !== undefined) parts.push(`data=${singleLine(JSON.stringify(evidence.data))}`);
  return parts.join("; ");
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").slice(0, 500);
}
