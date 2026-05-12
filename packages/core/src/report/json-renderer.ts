import type { ReportModel } from "./report-model.js";

export function renderJsonReport(model: ReportModel): string {
  return `${JSON.stringify(model, null, 2)}\n`;
}
