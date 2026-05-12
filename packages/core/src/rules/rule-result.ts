import type { Finding } from "../findings/finding.js";
import type { RuleDefinition } from "./rule-schema.js";

export interface RuleFailure {
  ruleId: string;
  title: string;
  message: string;
}

export interface RuleExecutionResult {
  loaded: number;
  executed: number;
  findings: Finding[];
  failures: RuleFailure[];
}

export interface RuleLoadOptions {
  root: string;
  categories?: RuleDefinition["category"][];
  severities?: RuleDefinition["severity"][];
  profile?: string;
}

export interface RuleRunFilters {
  categories?: RuleDefinition["category"][];
  severities?: RuleDefinition["severity"][];
  profile?: string;
}
