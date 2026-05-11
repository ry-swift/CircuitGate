# CircuitGate

## What This Is

CircuitGate 是一个 KiCad-first 的硬件设计审查与 EDA CI 产品，面向小型硬件团队、机器人/IoT/工业控制创业团队和开源硬件项目。它通过 CLI、GitHub Action 和后续 Web 报告，自动检查 KiCad 项目、Gerber、BOM 和制造输出，在打样前发现高风险问题。

第一阶段采用 review-first 模式，不做完整 EDA 编辑器、不做自动生成 PCB、不替代资深硬件工程师，而是把可解释规则、工具输出和 AI 报告整合成可复核的审查流程。

## Core Value

在硬件打样前，用可追溯证据帮助工程师发现会导致返板、制造失败或 BOM 风险的明显问题。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 用户可以用 CLI 对 KiCad 项目运行本地审查。
- [ ] 系统可以调用 KiCad ERC/DRC/jobset，并把结果归一化为结构化 finding。
- [ ] 系统可以解析 BOM CSV，并识别 MPN、数量、封装、DNP、替代料等字段缺失风险。
- [ ] 系统可以用规则库检查电源、接口、PCB、BOM 和制造输出中的常见风险。
- [ ] 系统可以生成 Markdown/JSON 报告，每条 finding 都有证据、影响、建议和 waiver 状态。
- [ ] 用户可以在 GitHub PR 中自动看到 CircuitGate 审查评论。
- [ ] AI 只能解释和总结已有证据，不能作为事实来源或自动改设计。
- [ ] 早期产品必须支持半自动付费审查服务，让工具能力和商业验证同步推进。

### Out of Scope

- 完整在线原理图/PCB 编辑器 — 工程量过大，且不是白手起家的最短商业路径。
- 自动布线和自动 PCB 生成 — 可靠性、责任边界和竞争强度都不适合 MVP。
- 正式安规/EMC/车规认证 — 需要资质、实验室和法律责任，MVP 只做风险提示。
- 晶圆厂良率、先进封装、芯片签核 EDA — 数据、客户和信任门槛过高，作为远期方向观察。
- 强依赖付费元器件数据 API — 早期先使用用户 BOM 字段、公开数据和可选手动链接，避免现金流压力。

## Context

证据窗口为 2025-02 至 2026-05。公开资料显示，半导体大盘受 AI、先进节点、HBM、先进封装和区域化供应链推动持续增长；Cadence、Synopsys、Siemens 都在推进 AI/agentic EDA，但完整芯片 EDA 高度垄断。KiCad 9 的 jobsets、命令行输出和开源生态为轻量 EDA CI 提供了可落地入口。

本项目选择 PCB/硬件审查切口，是因为它能在没有资金和行业背景的情况下拿到公开输入工件、快速做 CLI 原型、通过服务先收费，并逐步积累规则库和真实风险样本。

## Constraints

- **Budget**: 初始按个人/小团队零资金推进 — 优先 CLI、本地运行、开源基础版和服务收入。
- **Scope**: v1 只支持 KiCad-first — 避免一开始兼容 Altium、EasyEDA、OrCAD 导致范围失控。
- **Trust**: 所有 AI 结论必须绑定规则或工具证据 — 防止工业软件中不可接受的幻觉风险。
- **Security**: 默认支持本地运行，不强制上传设计文件 — 降低客户 IP 顾虑。
- **Business**: 产品和服务并行 — 工具未成熟前用人工复核保证交付质量。
- **Liability**: 报告是 design review assistance，不是制造、认证或安全合规保证。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 选择 review-first，而不是 schematic-first 或完整 Web EDA | 白手起家需要更短交付路径，审查比编辑器更容易证明价值 | — Pending |
| 首发支持 KiCad | 开源、命令行能力成熟、公开项目多、用户可触达 | — Pending |
| 先做 CLI 和 GitHub Action，Web 后置 | 工程师工作流更直接，成本更低，信任阻力更小 | — Pending |
| 规则引擎先于 AI | 工业软件必须有证据链，AI 只做解释和摘要 | — Pending |
| 同步提供半自动审查服务 | 早期靠服务验证付费意愿，并沉淀规则库 | — Pending |

---
*Last updated: 2026-05-11 after initial GSD product planning*
