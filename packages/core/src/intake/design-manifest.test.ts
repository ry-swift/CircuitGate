import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createDesignManifest } from "./design-manifest.js";

test("creates a manifest for a KiCad project with manufacturing outputs", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "circuitgate-kicad-"));
  await writeFile(path.join(root, "demo.kicad_pro"), "{}");
  await writeFile(path.join(root, "demo.kicad_sch"), "(kicad_sch)");
  await writeFile(path.join(root, "demo.kicad_pcb"), "(kicad_pcb)");
  await writeFile(path.join(root, "demo-gerber.zip"), "zip");
  await writeFile(path.join(root, "demo.drl"), "drill");
  await writeFile(path.join(root, "demo-bom.csv"), "Reference,Qty\nR1,1\n");
  await writeFile(path.join(root, "demo-cpl.csv"), "Designator,Mid X,Mid Y\nR1,0,0\n");

  const manifest = await createDesignManifest(root, { profile: "jlcpcb" });

  assert.equal(manifest.inferredProjectType, "mixed-kicad-package");
  assert.equal(manifest.found["kicad-project"].length, 1);
  assert.equal(manifest.found["placement-csv"].length, 1);
  assert.equal(manifest.missing.some((item) => item.kind === "placement-csv"), false);
});

test("classifies a manufacturing-only Gerber package", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "circuitgate-gerber-"));
  await writeFile(path.join(root, "release-gerber.zip"), "zip");
  await writeFile(path.join(root, "release.drl"), "drill");

  const manifest = await createDesignManifest(root);

  assert.equal(manifest.inferredProjectType, "manufacturing-package");
  assert.equal(manifest.found["gerber-archive"].length, 1);
  assert.equal(manifest.missing.some((item) => item.kind === "kicad-project"), true);
});

test("reports missing artifacts without throwing", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "circuitgate-empty-"));
  await writeFile(path.join(root, "notes.txt"), "bringup notes");

  const manifest = await createDesignManifest(root, { profile: "pcbway" });

  assert.equal(manifest.inferredProjectType, "unknown");
  assert.equal(manifest.missing.some((item) => item.kind === "gerber-archive"), true);
  assert.equal(manifest.missing.some((item) => item.kind === "placement-csv"), true);
});
