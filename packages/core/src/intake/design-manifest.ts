import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createFinding, type Finding, type FindingSeverity } from "../findings/finding.js";

export type ManufacturerProfile = "generic" | "jlcpcb" | "pcbway";

export type ArtifactKind =
  | "kicad-project"
  | "kicad-schematic"
  | "kicad-board"
  | "gerber-archive"
  | "gerber-file"
  | "drill-file"
  | "bom-csv"
  | "placement-csv"
  | "assembly-drawing"
  | "manufacturer-profile";

export type MissingCategory = "manufacturing-blocker" | "assembly-risk" | "human-review";

export interface DesignArtifact {
  kind: ArtifactKind;
  path: string;
  relativePath: string;
  name: string;
  sizeBytes: number;
}

export interface MissingArtifact {
  kind: ArtifactKind;
  category: MissingCategory;
  severity: FindingSeverity;
  message: string;
  recommendation: string;
}

export interface ManifestWarning {
  code: string;
  message: string;
  severity: FindingSeverity;
  artifact?: string;
}

export interface FileNameSafety {
  path: string;
  safe: boolean;
  reason?: string;
}

export interface DesignManifest {
  schemaVersion: "0.1.0";
  inputPath: string;
  profile: ManufacturerProfile;
  inferredProjectType: "kicad-project" | "manufacturing-package" | "mixed-kicad-package" | "unknown";
  found: Record<ArtifactKind, DesignArtifact[]>;
  missing: MissingArtifact[];
  warnings: ManifestWarning[];
  fileNameSafety: FileNameSafety[];
  scannedAt: string;
}

export interface CreateDesignManifestOptions {
  cwd?: string;
  profile?: string;
}

const artifactKinds: ArtifactKind[] = [
  "kicad-project",
  "kicad-schematic",
  "kicad-board",
  "gerber-archive",
  "gerber-file",
  "drill-file",
  "bom-csv",
  "placement-csv",
  "assembly-drawing",
  "manufacturer-profile"
];

export async function createDesignManifest(
  inputPath: string,
  options: CreateDesignManifestOptions = {}
): Promise<DesignManifest> {
  const cwd = options.cwd ?? process.cwd();
  const absoluteInput = path.resolve(cwd, inputPath);
  const inputStat = await stat(absoluteInput);
  const files = inputStat.isDirectory() ? await collectFiles(absoluteInput) : [absoluteInput];
  const found = emptyFoundMap();
  const warnings: ManifestWarning[] = [];

  for (const filePath of files) {
    const fileStat = await stat(filePath);
    const artifact = classifyArtifact(filePath, absoluteInput, fileStat.size);
    if (artifact) {
      found[artifact.kind].push(artifact);
    }
  }

  const profile = normalizeProfile(options.profile, warnings);
  const missing = inferMissingArtifacts(found, profile);
  const fileNameSafety = files.map((file) => inspectFileName(file, absoluteInput));

  for (const unsafe of fileNameSafety.filter((item) => !item.safe)) {
    warnings.push({
      code: "UNSAFE_FILE_NAME",
      severity: "low",
      artifact: unsafe.path,
      message: unsafe.reason ?? "File name may need normalization for manufacturer upload."
    });
  }

  return {
    schemaVersion: "0.1.0",
    inputPath: absoluteInput,
    profile,
    inferredProjectType: inferProjectType(found),
    found,
    missing,
    warnings,
    fileNameSafety,
    scannedAt: new Date().toISOString()
  };
}

export function findingsFromManifest(manifest: DesignManifest): Finding[] {
  const missingFindings = manifest.missing.map((missing, index) =>
    createFinding({
      id: `CG-INTAKE-${String(index + 1).padStart(3, "0")}`,
      source: "intake",
      severity: missing.severity,
      ruleId: missing.kind.toUpperCase().replaceAll("-", "_"),
      title: missing.message,
      message: `${missing.category}: ${missing.message}`,
      evidence: [{ type: "manifest", data: { kind: missing.kind, profile: manifest.profile } }],
      recommendation: missing.recommendation,
      waiver: { allowed: missing.category !== "manufacturing-blocker" }
    })
  );

  const warningFindings = manifest.warnings.map((warning, index) =>
    createFinding({
      id: `CG-INTAKE-WARN-${String(index + 1).padStart(3, "0")}`,
      source: "intake",
      severity: warning.severity,
      ruleId: warning.code,
      title: warning.message,
      message: warning.artifact ? `${warning.message} (${warning.artifact})` : warning.message,
      evidence: [{ type: "manifest", path: warning.artifact }],
      recommendation: "Normalize the release package before uploading to a manufacturer portal.",
      waiver: { allowed: true }
    })
  );

  return [...missingFindings, ...warningFindings];
}

function emptyFoundMap(): Record<ArtifactKind, DesignArtifact[]> {
  const found = {} as Record<ArtifactKind, DesignArtifact[]>;
  for (const kind of artifactKinds) {
    found[kind] = [];
  }
  return found;
}

async function collectFiles(root: string): Promise<string[]> {
  const ignored = new Set([".git", "node_modules", "dist", ".circuitgate"]);
  const result: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (ignored.has(entry.name) || shouldIgnoreFile(entry.name)) {
        continue;
      }
      const next = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(next);
      } else if (entry.isFile()) {
        result.push(next);
      }
    }
  }

  await walk(root);
  return result;
}

function shouldIgnoreFile(name: string): boolean {
  return (
    name === ".DS_Store" ||
    name.endsWith(".kicad_prl") ||
    (name.startsWith("~") && name.endsWith(".lck"))
  );
}

function classifyArtifact(filePath: string, inputRoot: string, sizeBytes: number): DesignArtifact | null {
  const name = path.basename(filePath);
  const lowerName = name.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  const relativePath = path.relative(inputRoot, filePath) || name;
  const base = { path: filePath, relativePath, name, sizeBytes };

  if (lowerName.endsWith(".kicad_pro")) return { ...base, kind: "kicad-project" };
  if (lowerName.endsWith(".kicad_sch")) return { ...base, kind: "kicad-schematic" };
  if (lowerName.endsWith(".kicad_pcb")) return { ...base, kind: "kicad-board" };
  if (lowerName.endsWith(".json") && lowerPath.includes("profile")) {
    return { ...base, kind: "manufacturer-profile" };
  }
  if (lowerName.endsWith(".zip") && /(gerber|fabrication|fab|plot)/i.test(lowerPath)) {
    return { ...base, kind: "gerber-archive" };
  }
  if (/\.(gbr|gtl|gbl|gto|gbo|gts|gbs|gko|gm1|gml)$/i.test(lowerName)) {
    return { ...base, kind: "gerber-file" };
  }
  if (/\.(drl|xln|drill)$/i.test(lowerName) || /drill/i.test(lowerName)) {
    return { ...base, kind: "drill-file" };
  }
  if (lowerName.endsWith(".csv") && /\bbom\b|bill[-_ ]?of[-_ ]?materials/i.test(lowerName)) {
    return { ...base, kind: "bom-csv" };
  }
  if (
    lowerName.endsWith(".csv") &&
    /(cpl|centroid|position|pos|pick[-_ ]?and[-_ ]?place|pnp|xyrs)/i.test(lowerName)
  ) {
    return { ...base, kind: "placement-csv" };
  }
  if (/(assembly|assy|ibom|placement).*\.(pdf|html|png|jpg|jpeg)$/i.test(lowerName)) {
    return { ...base, kind: "assembly-drawing" };
  }

  return null;
}

function normalizeProfile(profile: string | undefined, warnings: ManifestWarning[]): ManufacturerProfile {
  if (profile === "jlcpcb" || profile === "pcbway" || profile === "generic") {
    return profile;
  }

  if (profile) {
    warnings.push({
      code: "UNKNOWN_PROFILE",
      severity: "medium",
      message: `Unknown manufacturer profile "${profile}", falling back to generic.`
    });
  }

  return "generic";
}

function inferMissingArtifacts(
  found: Record<ArtifactKind, DesignArtifact[]>,
  profile: ManufacturerProfile
): MissingArtifact[] {
  const missing: MissingArtifact[] = [];
  const hasGerbers = found["gerber-archive"].length > 0 || found["gerber-file"].length > 0;

  if (found["kicad-project"].length === 0 && found["kicad-schematic"].length === 0) {
    missing.push({
      kind: "kicad-project",
      category: "human-review",
      severity: "low",
      message: "No KiCad project or schematic file was found.",
      recommendation: "Provide the KiCad source when ERC, DRC, or source-level review is expected."
    });
  }
  if (!hasGerbers) {
    missing.push({
      kind: "gerber-archive",
      category: "manufacturing-blocker",
      severity: "high",
      message: "No Gerber archive or Gerber layer files were found.",
      recommendation: "Export and include the fabrication Gerber package before ordering PCBs."
    });
  }
  if (found["drill-file"].length === 0) {
    missing.push({
      kind: "drill-file",
      category: "manufacturing-blocker",
      severity: "high",
      message: "No drill file was found.",
      recommendation: "Include NC drill output and verify plated/non-plated hole handling."
    });
  }
  if (found["bom-csv"].length === 0) {
    missing.push({
      kind: "bom-csv",
      category: "assembly-risk",
      severity: "medium",
      message: "No BOM CSV was found.",
      recommendation: "Provide a machine-readable BOM with references, quantities, manufacturer and part numbers."
    });
  }
  if (found["placement-csv"].length === 0 && profile !== "generic") {
    missing.push({
      kind: "placement-csv",
      category: "assembly-risk",
      severity: "high",
      message: `No CPL or pick-and-place CSV was found for ${profile} assembly review.`,
      recommendation: "Export placement coordinates and reconcile reference designators with the BOM."
    });
  }
  if (found["manufacturer-profile"].length === 0 && profile === "generic") {
    missing.push({
      kind: "manufacturer-profile",
      category: "human-review",
      severity: "low",
      message: "No manufacturer profile file was found and the review is using the generic profile.",
      recommendation: "Run with --profile jlcpcb or --profile pcbway when checking order-specific requirements."
    });
  }

  return missing;
}

function inspectFileName(filePath: string, inputRoot: string): FileNameSafety {
  const relativePath = path.relative(inputRoot, filePath) || path.basename(filePath);
  if (/^[A-Za-z0-9._/\-]+$/.test(relativePath)) {
    return { path: relativePath, safe: true };
  }
  return {
    path: relativePath,
    safe: false,
    reason: "File name contains spaces or characters that may need normalization for automated upload."
  };
}

function inferProjectType(found: Record<ArtifactKind, DesignArtifact[]>): DesignManifest["inferredProjectType"] {
  const hasKiCad =
    found["kicad-project"].length > 0 ||
    found["kicad-schematic"].length > 0 ||
    found["kicad-board"].length > 0;
  const hasManufacturing =
    found["gerber-archive"].length > 0 ||
    found["gerber-file"].length > 0 ||
    found["drill-file"].length > 0 ||
    found["bom-csv"].length > 0 ||
    found["placement-csv"].length > 0;

  if (hasKiCad && hasManufacturing) return "mixed-kicad-package";
  if (hasKiCad) return "kicad-project";
  if (hasManufacturing) return "manufacturing-package";
  return "unknown";
}
