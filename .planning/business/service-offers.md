# CircuitGate Service Offers

**版本**: v0.1  
**日期**: 2026-05-12  
**首个包装**: KiCad + JLCPCB/PCBWay Pre-order Review  
**目标**: 在完整 CLI 和 SaaS 之前，用半自动审查服务验证真实项目提交和付费意愿。

## 1. Positioning

CircuitGate sells an evidence-backed pre-order review, not an automated hardware guarantee. The customer gets a concrete report before fabrication or PCBA order; CircuitGate gets real design artifacts, rule feedback and early revenue.

Best-fit customers:

- 1-10 person hardware teams using KiCad or KiCad-exported manufacturing files.
- Robotics, IoT, sensor, industrial interface, maker product and open hardware teams.
- Software-heavy founders preparing a first or second PCB order.
- Teams ordering through JLCPCB, PCBWay or similar prototype manufacturers.

Not a fit:

- Designs requiring formal safety, EMC, automotive, medical or compliance certification.
- Enterprise PLM workflows with existing professional hardware signoff.
- Customers expecting CircuitGate to prove full circuit correctness.
- Customers asking for automatic redesign, autorouting or component substitution without review.

## 2. Required Inputs

Minimum input package:

| Input | Lite | Standard | Pro | Notes |
| --- | --- | --- | --- | --- |
| KiCad project or Gerber zip | Required | Required | Required | `.kicad_pro`, `.kicad_sch`, `.kicad_pcb` preferred |
| Target manufacturer | Required | Required | Required | `jlcpcb`, `pcbway` or `generic` |
| BOM CSV/XLSX | Required for PCBA | Required | Required | Must include refdes and quantity |
| CPL / centroid / pick-and-place | Required for PCBA | Required | Required | Must include designator, X, Y, rotation and side |
| Assembly drawing or iBOM | Optional | Recommended | Required when polarity matters | Helps resolve ambiguous placement |
| Schematic PDF | Optional | Required | Required | Used for manual checklist |
| Order intent | Required | Required | Required | Fabrication-only, turnkey PCBA or consigned assembly |
| Known constraints | Optional | Required | Required | Board thickness, layer count, current assumptions, enclosure limits |

## 3. Packages

### Lite: Manufacturing Package Check

**Price**: USD 99-199 per board  
**Turnaround**: 2 business days after valid input  
**Best for**: Simple 2-layer boards, breakouts, small modules, early order sanity check.

Scope:

- File inventory and revision consistency check.
- Gerber/drill/outline/paste/silkscreen presence check.
- Manufacturer profile gate for JLCPCB, PCBWay or generic.
- BOM/CPL presence check when assembly is requested.
- Short Markdown report with blocking and high-risk items.

Deliverables:

- `Pre-order Review Report` in Markdown/PDF-ready format.
- Finding table with severity, evidence, impact and suggested action.
- Missing input checklist.

Not included:

- Deep schematic review.
- Full ERC/DRC interpretation.
- Component sourcing verification beyond required field presence.
- Follow-up re-review after customer edits.

### Standard: Assembly Readiness Review

**Price**: USD 299-499 per board  
**Turnaround**: 3-5 business days after valid input  
**Best for**: 2-4 layer IoT, robotics, sensor and industrial control boards preparing PCBA.

Scope:

- Everything in Lite.
- BOM/CPL refdes join, quantity consistency, side and rotation risk screening.
- KiCad ERC/DRC raw output collection when KiCad project files are provided.
- Manual review checklist for power entry, external connectors, polarity, DNP handling, debug access and obvious assembly ambiguity.
- One clarification round with the customer.

Deliverables:

- Full `Pre-order Review Report`.
- JSON-style finding appendix for future CLI regression.
- Waiver table and customer action list.
- One revised report after the customer confirms fixes or waivers.

Not included:

- Formal power integrity, signal integrity, thermal simulation or EMC review.
- Datasheet-by-datasheet footprint validation for every component.
- Component lifecycle, stock or price guarantee.

### Pro: Pilot Design Review with Rule Feedback

**Price**: USD 799-999 per board  
**Turnaround**: 5-7 business days after valid input  
**Best for**: First production prototype, customer-facing pilot hardware, higher-cost PCBA, or teams without a senior hardware reviewer.

Scope:

- Everything in Standard.
- Deeper manual review on selected high-risk areas agreed up front, such as USB-C, CAN/RS485, battery charging, power entry, high-current paths or debug/bring-up access.
- One post-fix re-review.
- Private rule feedback note: which issues should become automated checks, which should remain human checklist.
- 30-minute async or call-based report walkthrough.

Deliverables:

- Full report plus executive risk summary.
- Fix verification pass or explicit unresolved-risk list.
- Rule feedback memo for CircuitGate and customer reuse.
- Redacted case-study option if customer approves.

Not included:

- Design ownership transfer or engineering signoff.
- Legal compliance certification.
- Layout edits, schematic edits or procurement execution unless quoted separately.

## 4. Report Severity Policy

| Severity | Meaning | Customer expectation |
| --- | --- | --- |
| Blocking | Likely prevents fabrication, assembly, quote acceptance or traceable review | Fix before order or explicitly waive only for non-applicable order type |
| High | Likely causes assembly delay, part sourcing ambiguity, bring-up failure or avoidable rework | Fix before PCBA unless business risk is accepted |
| Medium | Important ambiguity or manufacturability concern | Review and decide before order |
| Low | Hygiene, traceability or maintainability improvement | Fix when convenient |
| Human review | Not safe to automate as a blocking finding in v1 | Customer or reviewer must inspect context |

## 5. Customer Promise

CircuitGate promises:

- Findings are tied to files, rules, public manufacturer guidance, KiCad tool output or clearly marked assumptions.
- AI-generated prose, if used later, never becomes the source of truth.
- Customer design files are not used to train a public model.
- Reports distinguish what was verified from what still needs human judgment.

CircuitGate does not promise:

- Zero respins.
- Circuit correctness.
- Safety, EMC, USB, automotive, medical or regulatory certification.
- Manufacturer acceptance under every ordering option.
- Full component sourcing correctness without supplier-approved BOM fields.

## 6. Intake Email Template

Subject: CircuitGate Pre-order Review input package

Please send:

1. KiCad project folder or Gerber zip.
2. Target manufacturer and order mode: fabrication-only, turnkey PCBA or consigned PCBA.
3. BOM and CPL files if assembly is requested.
4. Schematic PDF and assembly drawing or iBOM if available.
5. Known constraints: layer count, board thickness, copper weight, special holes/slots, current limits, enclosure restrictions.
6. The top three risks you want checked.

We will confirm whether the input is sufficient before the review starts. Missing files may pause delivery time.

## 7. Commercial Validation Metrics

Phase 1.5 and Phase 6 should track:

- Number of real projects submitted.
- Number of qualified reviews delivered.
- Number of paid or pre-sale commitments.
- Time from inquiry to valid input package.
- Findings per project by severity and category.
- Customer objections: price, trust, confidentiality, scope, speed or perceived value.
- Rules created or changed from each review.

Success threshold before scaling:

- 10 real project reviews completed.
- At least 2 paid customers or equivalent pre-sale commitments.
- At least 5 repeatable P0 rules confirmed by real artifacts.
