# CircuitGate Pilot Tracker

**版本**: v0.1  
**日期**: 2026-05-12  
**目标**: 记录 Phase 1.5 和 Phase 6 的真实项目提交、交付、客户反馈、付费信号和规则回流。

## 1. Success Gate

Phase 1.5/6 的商业验证不再依赖真人访谈 gate，而依赖真实项目行为。

| Metric | Target | Current |
| --- | ---: | ---: |
| Real project submissions | 10 | 0 |
| Completed reviews | 10 | 0 |
| Paid customers or equivalent pre-sale commitments | 2 | 0 |
| Public sample reports | 1 | 1 |
| New or corrected rule candidates from reviews | 10 | 0 |

## 2. Project Tracker

Status values:

- `lead`: potential customer identified.
- `submitted`: customer sent enough material for triage.
- `in-review`: review started.
- `delivered`: report delivered.
- `paid`: paid or pre-sale commitment received.
- `declined`: customer declined or no response.
- `blocked`: waiting for files, NDA, payment, clarification or tooling.

| ID | Status | Source | Board type | Input package | Package | Tool findings | Human findings | Customer feedback | Paid/pre-sale | Rule feedback | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P00 | delivered | Public sample: Soldered USB-C breakout | USB-C breakout | Public repo, BOM, Gerber zip, schematic PDF | Sample | Missing visible CPL, BOM sourcing fields thin | USB-C CC role belongs to downstream design | Internal sample only | No | MFG-002, BOM-001, MFG-005 reinforced | Use as sales demo |
| P01 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P02 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P03 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P04 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P05 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P06 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P07 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P08 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P09 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |
| P10 | lead | TBD |  |  | Lite / Standard / Pro |  |  |  |  |  | Qualify target manufacturer |

## 3. Lead Sources

| Channel | Target | Message angle | Evidence to collect |
| --- | --- | --- | --- |
| KiCad Forum / public makers | KiCad users preparing JLCPCB/PCBWay order | "I can review your manufacturing package before order." | Objections, file gaps, willingness to submit project |
| GitHub open hardware maintainers | Projects with BOM/Gerber but no CI | "Free public sample review in exchange for permission to publish redacted report." | Report usefulness, maintainers' response |
| Indie hardware founders | Early robotics/IoT/industrial boards | "Avoid obvious PCBA delays before first paid prototype." | Price sensitivity, confidentiality concerns |
| Local hardware communities | Small teams without senior reviewer | "Pre-order checklist plus actionable report." | Paid conversion and repeat request |

## 4. Feedback Taxonomy

Customer feedback should be categorized consistently:

| Category | Meaning | Example |
| --- | --- | --- |
| Price | Customer values review but rejects cost | "Useful, but not for USD 299." |
| Trust | Customer worries about file confidentiality or reviewer competence | "Can you run locally only?" |
| Scope | Customer expected deeper circuit review, simulation or redesign | "Can you verify power integrity?" |
| Speed | Customer needs review faster than available | "I need to order tonight." |
| Value | Report changed order decision or prevented issue | "We found missing CPL before upload." |
| No pain | Customer does not see this as urgent | "The fab usually catches it." |

## 5. Rule Backflow Log

Every delivered review should add at least one entry.

| Date | Project ID | Finding/checklist item | Rule action | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-12 | P00 | Missing visible CPL in public output | Reinforce MFG-002 | Should be an early blocking/high rule for PCBA mode |
| 2026-05-12 | P00 | BOM lacks MPN/LCSC supplier fields | Reinforce BOM-001/BOM-008 | Distinguish open hardware BOM from turnkey sourcing-ready BOM |
| 2026-05-12 | P00 | Manufacturer profile absent | Reinforce MFG-005 | Review severity depends on target fab profile |

## 6. Operating Rhythm

- Weekly: add at least 5 qualified leads or public candidate projects.
- Weekly: publish or prepare 1 public/redacted sample report.
- Per delivery: update project tracker, feedback taxonomy and rule backflow.
- After 10 completed reviews: decide whether to accelerate CLI implementation, narrow offer, adjust pricing or stop.
