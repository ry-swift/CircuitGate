# Hardware Design CI

## What This Is

Hardware Design CI 是面向中小硬件团队、方案公司、PCB Layout 服务商和 PCBA/SMT 工厂的本地版打板前设计审查产品。第一阶段不做完整 EDA、不做自动画板，而是读取 BOM、Gerber、CPL、PDF 原理图、KiCad 工程和 Datasheet 证据，输出可复核、可整改、可归档的中文风险审查报告。

长期方向是把一次性审查服务产品化为硬件研发 Design CI：让硬件项目像软件项目一样具备规则检查、版本 diff、质量门禁、审查记录、豁免机制和团队流程集成。

## Core Value

在硬件错误进入打板、采购、SMT 或客户交付前，用本地可复核的证据报告帮团队提前拦截高风险问题。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 销售型 Demo 能用一个示例工程生成高质量中文审查报告，帮助陌生 B 端客户在 2 分钟内理解产品价值。
- [ ] Concierge Review 服务能承接真实或脱敏工程包，并在 48-72 小时内交付审查报告。
- [ ] 本地 CLI 能完成 BOM、Gerber/CPL 完整性、位号一致性和基础规则检查。
- [ ] 每条 finding 必须包含严重等级、证据来源、影响说明、整改建议和人工复核状态。
- [ ] 产品必须默认本地优先，不强依赖 OpenAI/Codex 云能力，后续可接国产模型、私有模型或 OpenAI 兼容接口。
- [ ] 30 天内必须验证真实客户是否愿意给文件、认可报告、愿意付费和愿意进入固定流程。

### Out of Scope

- 完整在线 EDA 编辑器 — 冷启动工程量过大，且会正面竞争嘉立创 EDA、Flux、Altium 等成熟工具。
- AI 一句话自动画 PCB — 演示效果强但工程可信度、责任边界和首批 B 端付费都不稳定。
- 免费 DFM 上传检查平台 — 华秋、嘉立创等已有低价或免费能力，创业壁垒不足。
- 高频/RF/DDR/PCIe/SI/PI 深度自动仿真 — 第一阶段专业责任重、验证慢，不适合作为冷启动承诺。
- 大企业私有化正式采购 — 当前一个人 + Codex 阶段资质和交付体系不足，先做中小 B 端低风险试点。
- 国内产品强绑定 OpenAI/Codex API — 中国大陆商业连续性和合规风险较高，Codex 只作为创始人研发提效与可选海外能力。

## Context

- 两份市场调研报告均指向同一结论：需求真实，但切口应是 review-first 的硬件设计审查与 Design CI，而不是大而全 EDA。
- 起步客户应优先选择 10-200 人的机器人、工控、智能硬件、仪器仪表、IoT、BMS、电机控制团队，以及方案公司、PCB Layout 外包团队和 PCBA/SMT 小厂。
- 早期商业形态应是“人工 + 半自动工具”的审查服务，用真实项目、真实 finding 和真实付款反推产品化能力。
- 产品差异化来自本地优先、证据链、中文报告、企业规则库、版本化审查、BOM/供应链风险和制造交付流程，而不是“AI 生成内容”。
- Codex 应主要用于创始人研发提效、规则脚本生成、报告模板迭代、CI/MCP 原型开发和海外版能力探索。

## Constraints

- **Timeline**: 销售型 Demo 最多 7-14 天完成 — 防止闭门开发过久，尽快拿客户反馈。
- **Go-to-market**: 前 30 天优先验证付费和文件信任 — 不用泛流量替代创始人直销。
- **Security**: 默认本地处理、支持脱敏文件、不上传第三方云 — 降低 B 端 IP 顾虑。
- **Reliability**: 确定性规则优先，AI 只做解释、归因、排序和报告辅助 — 降低硬件领域 AI 幻觉风险。
- **Format Scope**: v1 优先支持 KiCad、BOM CSV/XLSX、Gerber、CPL 和 PDF 原理图；Altium 先通过导出文件接入 — 避免私有格式解析拖慢 MVP。
- **Business Scope**: 首批只卖一次性审查报告和低风险试点 — 不进入复杂采购、招投标和大企业年度合同。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 采用 review-first 产品模式 | 两份报告都显示“打板前审查、报告、CI、BOM 风险、证据链”比完整 EDA 更适合冷启动 | — Pending |
| 第一阶段做销售型 Demo + Concierge Review | 一个无公司主体的个人创始人更容易成交小额服务试点，而非企业级平台采购 | — Pending |
| 本地优先、模型无关 | 国内 B 端硬件文件敏感，且 OpenAI/Codex 不适合作为国内唯一底层 | — Pending |
| 确定性规则优先于 AI 判断 | 硬件错误代价高，finding 必须可复核、可回归、可解释 | — Pending |
| 优先中小 B 端和渠道伙伴 | 大企业周期长，中小团队、方案公司、Layout 服务商、PCBA 工厂更适合早期验证 | — Pending |

---
*Last updated: 2026-05-06 after initial GSD product direction planning*
