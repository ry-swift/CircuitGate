# CircuitGate Review Delivery Template

**用途**: 每次半自动审查交付时复制本模板，生成客户项目的 `Pre-order Review Report`。  
**适用范围**: KiCad + JLCPCB/PCBWay/generic pre-order review。  
**原则**: 所有 finding 必须绑定证据、规则、工具输出或明确假设；不能把 AI 或人工猜测写成事实。

## 1. Report Metadata

| Field | Value |
| --- | --- |
| Customer / Project |  |
| Review package | Lite / Standard / Pro |
| Review date |  |
| Reviewer |  |
| Target manufacturer profile | jlcpcb / pcbway / generic |
| Order intent | Fabrication-only / Turnkey PCBA / Consigned PCBA |
| Design revision | Git commit, zip checksum or customer-provided version |
| Input status | Complete / Missing files / Needs clarification |
| Confidentiality status | Public / Customer-confidential / Redacted case study allowed |

## 2. Input Checklist

| Input | Received | Evidence path or checksum | Notes |
| --- | --- | --- | --- |
| KiCad project | Yes / No / N/A |  |  |
| Gerber zip | Yes / No / N/A |  |  |
| Drill files | Yes / No / N/A |  |  |
| BOM | Yes / No / N/A |  |  |
| CPL / centroid / pick-and-place | Yes / No / N/A |  |  |
| Schematic PDF | Yes / No / N/A |  |  |
| Assembly drawing / iBOM | Yes / No / N/A |  |  |
| Manufacturer settings | Yes / No / N/A |  |  |
| Customer constraints | Yes / No / N/A |  |  |

## 3. Executive Summary

**Order readiness**: Pass / Conditional pass / Hold order / Insufficient input

Summary:

- Blocking findings:
- High-risk findings:
- Most important customer action:
- What was verified:
- What still needs human judgment:

## 4. Findings

Use one block per finding.

### CG-[CATEGORY]-[NNN]: [Finding title]

| Field | Value |
| --- | --- |
| Severity | Blocking / High / Medium / Low / Human review |
| Rule ID |  |
| Status | Open / Fixed by customer / Waived / Not applicable |
| Evidence | File path, line, object, refdes, tool output or public source |
| Impact |  |
| Suggested action |  |
| Waiver allowed | Yes / No |
| Waiver conditions |  |
| Rule feedback | Existing rule / New rule candidate / Human checklist only |

## 5. Manufacturing Package Review

| Check | Result | Evidence | Action |
| --- | --- | --- | --- |
| Gerber zip present | Pass / Fail / N/A |  |  |
| Copper layers present | Pass / Fail / Needs unzip |  |  |
| Solder mask layers present | Pass / Fail / Needs unzip |  |  |
| Silkscreen layers present | Pass / Fail / Needs unzip |  |  |
| Paste layers present for assembly | Pass / Fail / N/A |  |  |
| Board outline present | Pass / Fail / Needs unzip |  |  |
| Drill present | Pass / Fail / Needs unzip |  |  |
| NPTH/PTH distinction clear | Pass / Fail / Needs review |  |  |
| Slots/mechanical holes clear | Pass / Fail / N/A |  |  |
| Assembly drawing or iBOM present | Pass / Fail / N/A |  |  |

## 6. BOM/CPL Review

| Check | Result | Evidence | Action |
| --- | --- | --- | --- |
| BOM present | Pass / Fail |  |  |
| BOM required columns present | Pass / Fail |  |  |
| Supplier/MPN/LCSC fields present | Pass / Fail / N/A |  |  |
| DNP/exclude status structured | Pass / Fail / N/A |  |  |
| CPL present for assembly | Pass / Fail / N/A |  |  |
| BOM refdes set matches CPL | Pass / Fail / Not run |  |  |
| Quantities match expanded refdes | Pass / Fail / Not run |  |  |
| CPL includes X/Y/rotation/side | Pass / Fail / N/A |  |  |
| Case consistency verified | Pass / Fail / Not run |  |  |

## 7. KiCad ERC/DRC Review

| Tool step | Status | Evidence | Notes |
| --- | --- | --- | --- |
| `kicad-cli sch erc` | Not run / Pass / Findings |  |  |
| `kicad-cli pcb drc` | Not run / Pass / Findings |  |  |
| Raw outputs saved | Yes / No / N/A |  |  |
| Findings normalized | Yes / No / N/A |  |  |

Command log:

```bash
# Paste exact commands and output paths here.
```

## 8. Manual Review Checklist

| Area | Review question | Result | Notes |
| --- | --- | --- | --- |
| Power entry | Are protection, current and connector assumptions explicit? |  |  |
| External interfaces | Are pinout, role, ESD and polarity clear? |  |  |
| USB-C | Are CC/Rp/Rd role assumptions correct? |  |  |
| CAN/RS485 | Are termination, bias and ESD assumptions reviewed? |  |  |
| Battery/charging | Are protection and thermal assumptions reviewed? |  |  |
| Debug/bring-up | Are SWD/JTAG/UART/test points accessible? |  |  |
| Mechanical | Are connector, mounting and enclosure constraints reviewed? |  |  |
| Silkscreen | Are polarity and pin-1 marks readable? |  |  |

## 9. Waivers

| Finding ID | Waiver decision | Customer rationale | Reviewer note |
| --- | --- | --- | --- |
|  |  |  |  |

## 10. Customer Action List

| Priority | Action | Owner | Due before order |
| --- | --- | --- | --- |
| 1 |  | Customer / CircuitGate | Yes / No |
| 2 |  | Customer / CircuitGate | Yes / No |
| 3 |  | Customer / CircuitGate | Yes / No |

## 11. Rule Feedback

| Finding or checklist item | Rule outcome | Reason |
| --- | --- | --- |
|  | Promote to P0/P1/P2 / Keep human-only / Drop |  |

## 12. Delivery Disclaimer

This report is design review assistance. It is not a guarantee of manufacturability, assembly success, circuit correctness, safety, EMC, USB compliance or regulatory approval. The customer remains responsible for final design release and manufacturer order settings.
