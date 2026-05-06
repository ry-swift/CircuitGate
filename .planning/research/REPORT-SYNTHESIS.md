# Research Synthesis: Hardware Design CI

## Source Reports

- `reports/china-ai-eda-hardware-design-ci-market-research.md`
- `reports/codex-ai-eda-startup-market-research.md`

## Core Synthesis

两份报告结论一致：国内和海外 AI/EDA 趋势真实，但个人创始人当前不应从完整 EDA、自动 PCB layout、免费 DFM 或 OpenAI/Codex 套壳 SaaS 切入。最现实的创业方向是面向硬件团队的本地化打板前审查与 Design CI，以审查报告服务冷启动，再逐步产品化为 CLI、CI、Web 工作台和私有化规则库。

## Evidence-Carried Decisions

| Decision | Evidence from reports | Product implication |
|----------|----------------------|---------------------|
| review-first | 两份报告都建议从审查、报告、CI、BOM、DFM、Datasheet 证据切入 | v1 只做审查闭环，不做编辑器 |
| local-first | 国内硬件文件涉及 IP，客户不愿轻易上传公有云 | Demo 和 CLI 默认本地运行 |
| evidence-first | AI 输出在硬件场景必须可复核、可追责 | 每条 finding 必须绑定 evidence |
| service-first | 报告建议先用人工 + 半自动工具换真实样本、痛点和付款 | 先做 Concierge Review，不先做 SaaS |
| mid-market B2B | 中小硬件公司、方案公司、Layout 服务商更适合 MVP | 优先 10-200 人硬件团队和渠道伙伴 |
| model-agnostic | 国内不应强依赖 OpenAI API/Codex 云能力 | AI 层可插拔，Codex 主要用于研发提效 |

## Recommended Product Wedge

第一款可售卖产品：

> 本地版 PCB / BOM / Datasheet 打板前审查报告工具。

第一阶段交付：

> 用户给一份工程包，创始人用本地工具 + 人工复核，在 48-72 小时内返回中文风险审查报告。

## 30-Day Validation Bar

- 150 家潜在 B 端名单。
- 100 家触达。
- 10-15 次有效访谈。
- 3-5 个真实或脱敏工程包。
- 2-5 份样例审查报告。
- 1-2 个付费试点或明确预付意向。

## Known Risks

- 客户不给文件：需要本地处理、脱敏流程、NDA、渠道背书和样例报告降低信任门槛。
- 客户只说有兴趣但不付费：报告 finding 必须足够贴近返板、延期、BOM 和生产沟通成本。
- 免费 DFM 生态压价：不能卖基础 DFM，要卖项目级证据链、流程门禁和规则沉淀。
- AI 幻觉：AI 只做解释和报告辅助，确定性规则与人工复核优先。
- 创始人交付能力瓶颈：早期服务是为了验证和积累规则，不是长期外包模式。
