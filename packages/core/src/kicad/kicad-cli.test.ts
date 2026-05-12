import test from "node:test";
import assert from "node:assert/strict";
import { normalizeKiCadReport } from "./kicad-cli.js";

test("normalizes KiCad JSON violation records into findings", () => {
  const findings = normalizeKiCadReport(
    {
      violations: [
        {
          severity: "error",
          ruleId: "clearance",
          title: "Clearance violation",
          message: "Track clearance is below minimum"
        }
      ]
    },
    "kicad-drc",
    "/tmp/kicad-drc.json"
  );

  assert.equal(findings.length, 1);
  assert.equal(findings[0]?.severity, "high");
  assert.equal(findings[0]?.ruleId, "clearance");
  assert.equal(findings[0]?.evidence[0]?.path, "/tmp/kicad-drc.json");
});

test("returns an info finding when the KiCad report has no recognizable violations", () => {
  const findings = normalizeKiCadReport({ violations: [] }, "kicad-erc", "/tmp/kicad-erc.json");

  assert.equal(findings.length, 1);
  assert.equal(findings[0]?.severity, "info");
});
