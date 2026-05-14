import type { ReportModel } from "../report/report-model.js";
import { createEvidencePack, type EvidencePack } from "./evidence-pack.js";

export interface AiReviewSummaryItem {
  title: string;
  explanation: string;
  referencedFindingIds: string[];
}

export interface AiReviewSummary {
  generatedAt: string;
  provider: string;
  model?: string;
  headline: string;
  items: AiReviewSummaryItem[];
}

export type ReviewSummaryResult =
  | { status: "generated"; summary: AiReviewSummary }
  | { status: "skipped"; reason: string };

export interface AiProviderInput {
  evidencePack: EvidencePack;
  prompt: string;
}

export interface AiProvider {
  name: string;
  model?: string;
  disabledReason?: string;
  generateSummary(input: AiProviderInput): Promise<string>;
}

export interface OpenAiCompatibleProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  fetch?: FetchFunction;
}

type FetchFunction = (url: string | URL, init?: RequestInit) => Promise<Response>;

const defaultOpenAiBaseUrl = "https://api.openai.com/v1";
const defaultOpenAiModel = "gpt-5.4";

export function createDisabledAiProvider(reason = "AI provider disabled"): AiProvider {
  return {
    name: "disabled",
    disabledReason: reason,
    async generateSummary() {
      throw new Error(reason);
    }
  };
}

export function createOpenAiCompatibleProvider(config: OpenAiCompatibleProviderConfig): AiProvider {
  if (!config.apiKey) {
    return createDisabledAiProvider("missing API key");
  }

  const baseUrl = (config.baseUrl ?? defaultOpenAiBaseUrl).replace(/\/+$/, "");
  const model = config.model ?? defaultOpenAiModel;
  const fetchImpl = config.fetch ?? fetch;

  return {
    name: "openai-compatible",
    model,
    async generateSummary(input) {
      const response = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${config.apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: input.prompt
            },
            {
              role: "user",
              content: `Evidence pack JSON:\n${JSON.stringify(input.evidencePack)}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`AI provider request failed: ${response.status} ${await response.text()}`);
      }

      const body = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const content = body.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("AI provider returned an empty message.");
      }
      return content;
    }
  };
}

export async function generateReviewSummary(report: ReportModel, provider: AiProvider): Promise<ReviewSummaryResult> {
  if (provider.disabledReason) {
    return { status: "skipped", reason: provider.disabledReason };
  }

  const evidencePack = createEvidencePack(report);
  let rawOutput: string;
  try {
    rawOutput = await provider.generateSummary({
      evidencePack,
      prompt: buildReviewSummaryPrompt()
    });
  } catch {
    return { status: "skipped", reason: "provider-error" };
  }

  const parsed = parseSummaryJson(rawOutput);
  if (!parsed) {
    return { status: "skipped", reason: "invalid-ai-output" };
  }

  const validFindingIds = new Set(evidencePack.findings.map((finding) => finding.findingId));
  if (!isValidSummaryShape(parsed, validFindingIds)) {
    return { status: "skipped", reason: "invalid-ai-output" };
  }

  return {
    status: "generated",
    summary: {
      generatedAt: new Date().toISOString(),
      provider: provider.name,
      model: provider.model,
      headline: parsed.headline,
      items: parsed.items
    }
  };
}

function buildReviewSummaryPrompt(): string {
  return [
    "You summarize CircuitGate hardware review findings.",
    "Return JSON only with this shape:",
    '{"headline":"short summary","items":[{"title":"short title","explanation":"evidence-bound explanation","referencedFindingIds":["CG-..."]}]}',
    "Every item must include at least one referencedFindingIds value from the evidence pack.",
    "Do not introduce critical claims, severity changes, waiver decisions, design facts, or remediation details that are not present in the evidence pack.",
    "Treat rule and tool findings as the source of truth."
  ].join("\n");
}

function parseSummaryJson(rawOutput: string): unknown {
  try {
    return JSON.parse(rawOutput);
  } catch {
    return null;
  }
}

function isValidSummaryShape(value: unknown, validFindingIds: Set<string>): value is Pick<AiReviewSummary, "headline" | "items"> {
  if (!isRecord(value)) return false;
  if (typeof value.headline !== "string" || value.headline.trim().length === 0) return false;
  if (!Array.isArray(value.items) || value.items.length === 0) return false;

  return value.items.every((item) => {
    if (!isRecord(item)) return false;
    if (typeof item.title !== "string" || item.title.trim().length === 0) return false;
    if (typeof item.explanation !== "string" || item.explanation.trim().length === 0) return false;
    if (!Array.isArray(item.referencedFindingIds) || item.referencedFindingIds.length === 0) return false;
    return item.referencedFindingIds.every((id) => typeof id === "string" && validFindingIds.has(id));
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
