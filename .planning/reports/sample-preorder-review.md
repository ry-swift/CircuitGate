# CircuitGate Sample Pre-order Review Report

**样本项目**: Soldered Electronics USB-C female connector breakout  
**公开仓库**: https://github.com/SolderedElectronics/USB-C-female-connector-breakout-hardware-design  
**样本来源 ID**: S20 in `.planning/research/sample-projects.md`  
**报告日期**: 2026-05-12  
**目标制造场景**: KiCad + JLCPCB/PCBWay pre-order review  
**审查方式**: 公开仓库静态审查样板，不包含本地 clone、KiCad ERC/DRC 实际运行或 Gerber zip 解包验证。

## 1. Executive Summary

This sample report shows the first commercial shape of CircuitGate: a traceable pre-order review that separates blocking production issues, assembly data risks, KiCad tool findings, and human review items.

**Order readiness**: Conditional. The public repository is strong for a demo because it exposes KiCad CAD folders and production outputs. For a real PCBA order, the latest public output set should still provide or confirm a CPL/centroid file, exact BOM supplier fields, drill contents inside the Gerber package, and a manufacturer profile before release.

**Highest-value findings**:

| Severity | Rule | Finding | Status |
| --- | --- | --- | --- |
| High | MFG-002 | Latest public `OUTPUTS/V1.3.0` listing does not expose a separate CPL/centroid file. | Action required for PCBA |
| High | BOM-001, BOM-008 | BOM has reference, value, footprint, quantity and DNP, but lacks explicit manufacturer, MPN, supplier part number or LCSC/JLC columns. | Action required for turnkey sourcing |
| Medium | MFG-001, MFG-003 | Gerber zip is published, but drill, board outline and slot contents were not inspected in this static review. | Verify before fabrication |
| Medium | MFG-005 | No order profile is captured in the reviewed artifacts. | Select `jlcpcb` or `pcbway` profile |
| Human review | IF-001 | CC1/CC2 are intentionally broken out; downstream use must add correct USB-C role resistors. | Review in integrating design |

## 2. Scope and Evidence

### Inputs Reviewed

| Input | Evidence | Notes |
| --- | --- | --- |
| Repository root | https://github.com/SolderedElectronics/USB-C-female-connector-breakout-hardware-design | README states the repo contains CAD and OUTPUTS folders. |
| CAD folder | `CAD/V1.0.0`, `CAD/V1.1.1`, `CAD/V1.2.0` visible in GitHub tree | Confirms versioned KiCad design source is published. |
| Production output folder | `OUTPUTS/V1.3.0` visible in GitHub tree | Contains Gerber zip, BOM CSV, schematic PDF, iBOM, pinout and 3D model. |
| BOM CSV | Raw BOM: `Reference, Value, Datasheet, Footprint, Qty, DNP` | Enough for a basic open hardware bill, incomplete for turnkey PCBA sourcing. |
| Manufacturer requirements | JLCPCB BOM/CPL preparation guide and PCBWay assembly file requirements | Used to evaluate BOM/CPL readiness. |
| KiCad tool expectation | KiCad CLI docs for `sch erc` and `pcb drc` | Defines how CircuitGate will later run ERC/DRC. |

### Limitations

- This sample does not claim the board is electrically correct.
- This sample does not certify manufacturability, safety, EMC, USB compliance or legal compliance.
- Gerber zip contents were not decompressed in this review; drill and outline status are therefore treated as a verification item, not as a proved failure.
- ERC/DRC were not executed because the plan is a public static sample report, not Phase 2 CLI execution.

## 3. Project Overview

The selected project is a compact USB-C female connector breakout. The repository description and README indicate that the board breaks out GND, CC2, SBU2, D-, D+, SBU1, CC1 and VUSB to plated through holes. That makes it useful as a simple interface board and a good CircuitGate sample because the board is small, public and has both design and production artifacts.

**Observed artifact model**:

| Artifact class | Observed public artifact | CircuitGate interpretation |
| --- | --- | --- |
| KiCad design source | Versioned CAD folders | Good source for future `DesignManifest` generation |
| Fabrication package | `333011 176x188 64 USB-C female connector breakout gerber.zip` | Needs unzip scan for layers, drill and board outline |
| BOM | `USB-C female connector breakout BOM.csv` | Present but supplier fields are thin |
| Placement/CPL | Not visible as a standalone file in `OUTPUTS/V1.3.0` | PCBA risk until provided or generated |
| Schematic | `USB-C female connector breakout Schematic.pdf` | Useful for human review and report appendix |
| Assembly reference | iBOM and pinout files | Helpful, but not a replacement for CPL when using automated assembly |

## 4. Manufacturing Blockers

### CG-MFG-002-001: CPL/centroid file is not visible in latest output set

**Severity**: High  
**Rule**: MFG-002, MFG-004  
**Status**: Action required before PCBA order  
**Evidence**: The public `OUTPUTS/V1.3.0` tree lists Gerber zip, BOM CSV, pinout, schematic PDF and iBOM, but no standalone CPL, centroid, XYRS or pick-and-place CSV. PCBWay requests BOM, Gerbers and centroid/XY data for assembly. JLCPCB recommends exact BOM/CPL designator consistency.

**Impact**: Fabrication-only may proceed with Gerber/drill verification, but turnkey assembly cannot be reliably quoted or programmed without placement coordinates, side and rotation data.

**Recommended action**:

1. Export a KiCad position file for all SMT parts.
2. Normalize headers to the target manufacturer profile.
3. Verify BOM and CPL reference designators match exactly, including case.
4. Include the CPL file in the release output directory alongside BOM and Gerber zip.

### CG-MFG-001-001: Gerber package exists, but drill and outline contents need unpack verification

**Severity**: Medium  
**Rule**: MFG-001, MFG-003  
**Status**: Needs tool verification  
**Evidence**: The output folder includes a Gerber zip, but this static report did not inspect the archive contents.

**Impact**: If NC drill, board outline, plated/non-plated hole distinction or slot data are missing, a PCB order can be delayed, misquoted or rejected.

**Recommended action**:

```bash
unzip -l "333011 176x188 64 USB-C female connector breakout gerber.zip"
```

CircuitGate Phase 2 should classify the archive into copper layers, solder mask, silkscreen, paste, board outline, drill, drill map and mechanical documentation.

### CG-MFG-005-001: Manufacturer profile is not captured with reviewed outputs

**Severity**: Medium  
**Rule**: MFG-005  
**Status**: Required before order-specific pass/fail  
**Evidence**: The public output tree contains production files but no CircuitGate-style profile metadata.

**Impact**: Clearance, drill, castellated/slot, file naming and assembly expectations vary by fab. Without profile context, any automated finding can only be generic.

**Recommended action**: Run the review with an explicit target:

```bash
circuitgate review ./USB-C-female-connector-breakout --profile jlcpcb
circuitgate review ./USB-C-female-connector-breakout --profile pcbway
```

## 5. BOM/CPL Risks

### CG-BOM-001-001: BOM is present but not turnkey sourcing-ready

**Severity**: High  
**Rule**: BOM-001, BOM-008  
**Status**: Action required for turnkey assembly  
**Evidence**: The raw BOM columns are `Reference`, `Value`, `Datasheet`, `Footprint`, `Qty`, `DNP`. Rows include `DM1`, `K1` and `K2`, with footprint and quantity, but no explicit manufacturer, MPN, distributor part number or LCSC/JLC part number.

**Impact**: Consigned/kitted assembly may still work if the customer provides parts, but turnkey sourcing will need manual part mapping. This creates avoidable back-and-forth and substitution risk.

**Recommended action**:

- Add manufacturer and MPN for each sourced component.
- Add supplier part number or LCSC/JLC fields when targeting JLCPCB.
- Keep DNP status explicit and machine-readable.
- Add a sourcing note for custom or in-house items such as board-only or packaging references.

### CG-BOM-005-001: BOM quantity should be reconciled against placement output

**Severity**: Medium  
**Rule**: BOM-005, MFG-002  
**Status**: Blocked by missing CPL  
**Evidence**: BOM quantity exists, but no CPL is visible in the latest output folder.

**Impact**: Refdes and quantity cannot be cross-checked against placement coordinates. Missing, extra or duplicate designators may only be caught by a human or manufacturer review.

**Recommended action**: After CPL export, run:

```text
expanded BOM refdes set == CPL designator set
quantity per BOM line == count(expanded refdes)
each CPL row has side, X, Y, rotation and footprint context
```

## 6. KiCad ERC/DRC Interpretation

**Tool status**: Not run in this sample.  
**Reason**: Phase 1.5 is a commercial sample package; Phase 2 will implement local intake and KiCad CLI execution.

Future CircuitGate execution should run:

```bash
kicad-cli sch erc --format json --output circuitgate-erc.json path/to/project.kicad_sch
kicad-cli pcb drc --format json --output circuitgate-drc.json path/to/project.kicad_pcb
```

The report should then normalize raw KiCad output into `Finding` records with severity, evidence, impact, suggested action and waiver status.

## 7. Manual Review Checklist

| Area | Check | Why it matters | Status |
| --- | --- | --- | --- |
| USB-C role | Confirm downstream design adds correct CC pull-up or pull-down behavior | The breakout exposes CC pins; the integrating circuit defines source/sink role | Needs human review |
| VBUS current | Confirm trace/header path is rated for expected current | Breakout boards are often reused outside original assumptions | Needs profile/data |
| ESD | Confirm external ESD strategy if used in a customer-facing connector | USB connectors are exposed interfaces | Advisory |
| Mechanical | Confirm connector overhang, board edge and mating cable clearance | Prevents assembly and enclosure interference | Needs 3D/mechanical review |
| Silkscreen | Confirm pinout and orientation marks remain readable after assembly | Reduces bring-up wiring mistakes | Advisory |
| DNP handling | Confirm no implicit DNP rows are lost during export | Avoids assembly mismatch | Needs BOM/CPL join |

## 8. Waiver Table

| Finding | Waiver allowed | Suggested waiver reason |
| --- | --- | --- |
| Missing standalone CPL in public output | No for turnkey PCBA; yes for fabrication-only | Fabrication-only order, no assembly requested |
| BOM lacks MPN/LCSC fields | Yes for consigned assembly | Customer supplies all parts and accepts sourcing responsibility |
| Gerber zip not unpacked in static sample | No for real order | Must be verified before release |
| USB-C CC behavior delegated to downstream design | Yes | This is intentionally a breakout, not a complete sink/source device |

## 9. Evidence Appendix

### Public URLs

- Project repository: https://github.com/SolderedElectronics/USB-C-female-connector-breakout-hardware-design
- Production outputs: https://github.com/SolderedElectronics/USB-C-female-connector-breakout-hardware-design/tree/main/OUTPUTS/V1.3.0
- Raw BOM CSV: https://raw.githubusercontent.com/SolderedElectronics/USB-C-female-connector-breakout-hardware-design/refs/heads/main/OUTPUTS/V1.3.0/USB-C%20female%20connector%20breakout%20BOM.csv
- JLCPCB BOM/CPL preparation guidance: https://jlcpcb.com/help/article/advice-for-bom-and-cpl-files-preparation
- PCBWay assembly file requirements: https://www.pcbway.com/assembly-file-requirements.html
- KiCad CLI ERC/DRC documentation: https://docs.kicad.org/9.0/en/cli/cli.html

### Rule Backflow

This sample reinforces the first P0 rule priorities:

- MFG-002 must detect missing CPL before assembly order.
- BOM-001 and BOM-008 must flag BOMs that are human-readable but not sourcing-ready.
- MFG-001 and MFG-003 must unzip Gerber packages and prove drill/outline presence.
- MFG-005 must require an explicit manufacturer profile before order-specific severity.

## 10. Customer-Facing Disclaimer

This report is design review assistance. It helps identify likely fabrication, assembly and documentation risks before ordering. It is not a manufacturing guarantee, formal certification, safety approval, EMC approval, USB compliance test, or proof that the circuit is correct.
