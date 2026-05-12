# Roadmap: CircuitGate

## Overview

CircuitGate 从一个可人工复核的 KiCad 打样前审查服务开始，先用公开网络 VOC 明确需求，再用样板报告和付费试点验证商业价值，随后沉淀为 CLI、规则引擎、报告和 GitHub Action。v1 的终点不是完整 SaaS，而是一个能在真实硬件项目中运行、能生成可复核报告、能获得早期收入的技术驱动产品。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (1.5, 2.1): Urgent insertions or validation loops

- [x] **Phase 1: Public VOC and Product Definition** - 用公开网络证据确认痛点、样本项目、规则候选和产品文档，不再要求真人访谈。
- [x] **Phase 1.5: Sample Report and Paid Pilot Landing** - 做公开样板报告、服务说明和首批真实项目获取，提前验证商业价值。
- [ ] **Phase 2: KiCad Intake and Analysis Core** - 做出可运行的本地 CLI，能识别 KiCad 项目、制造输出并调用 ERC/DRC。
- [ ] **Phase 3: Rule Engine and Knowledge Base** - 建立规则 DSL、规则 schema 和首批 P0 制造/BOM/CPL 规则库。
- [ ] **Phase 4: Reporting and CI Integration** - 生成工程可复核报告，并接入 GitHub PR 工作流。
- [ ] **Phase 5: Evidence-bound AI Review Assistant** - 在证据链之上增加 AI 摘要和风险解释。
- [ ] **Phase 6: Paid Pilot Operations** - 用半自动审查服务验证收费、交付和规则反馈闭环。
- [ ] **Phase 7: Web Console** - 在有付费信号后构建轻量 Web 报告和团队 waiver 管理。
- [ ] **Phase 8: Scale and Defensibility** - 建立制造 profile、匿名化规则数据和扩展 EDA 入口。

## Phase Details

### Phase 1: Public VOC and Product Definition

**Goal**: 用公开网络证据确认打样前审查痛点，形成样本池、规则候选和产品文档。
**Depends on**: Nothing
**Requirements**: [DISC-01, DISC-02, DISC-03, DISC-04]
**Current Evidence**: 已纳入 2026-05-11 公开论坛/评论区代理调研、2026-05-12 公开网络 VOC 与竞品调研、24 个公开 KiCad 样本项目、55 条规则候选和产品文档 v0.2。
**Success Criteria**:

1. 公开 VOC 证据覆盖官方文档、KiCad Forum、Reddit/公开社区、竞品和公开样本。
2. 至少 20 个公开 KiCad 项目被归档为样本池。
3. 至少 50 条规则候选被按价值和实现难度排序。
4. `.planning/PRODUCT.md` 明确产品定位、MVP、规则优先级、商业包装和不承诺范围。

**Plans**: 1 plan

Plans:
- [x] 01-01: 公开 VOC、样本项目、规则候选和产品定义

### Phase 1.5: Sample Report and Paid Pilot Landing

**Goal**: 在大规模开发前，用 1 份公开样板报告和服务页验证“客户愿意提交真实项目并为审查结果付费”的商业信号。
**Depends on**: Phase 1
**Requirements**: [PILOT-00, PILOT-01]
**Evidence Input**: 公开 VOC 显示最强早期切口是 KiCad + JLCPCB/PCBWay pre-order review，尤其是制造输出完整性、BOM/CPL/refdes join、drill 和 profile gate。
**Execution Output**: 样板报告、Lite/Standard/Pro 服务说明、交付模板和 pilot tracker 已完成；真实项目提交和付费信号仍需继续收集。
**Success Criteria**:

1. 至少 1 个公开 KiCad 项目生成完整样板报告。
2. 服务说明包含 Lite/Standard/Pro 范围、交付物、免责声明和输入要求。
3. 试点 tracker 能记录真实项目提交意向、明确拒绝原因、付费/预售信号和规则回流；实际信号继续在 Phase 6 收集。
4. 样板报告能反向校正 P0 规则和报告结构。

**Plans**: 1 plan

Plans:
- [x] 01-50: 样板报告、服务说明和付费试点入口

### Phase 2: KiCad Intake and Analysis Core

**Goal**: 做出第一个能在本地运行的 `circuitgate review` CLI，识别项目、制造文件并执行 KiCad ERC/DRC。
**Depends on**: Phase 1
**Requirements**: [INTK-01, INTK-02, INTK-03, INTK-04, KICD-01, KICD-02, KICD-03, KICD-04]
**Evidence Input**: Phase 1 公开 VOC 指向制造输出包、BOM/CPL、drill 和厂商 profile 是首批 intake 必须显式建模的对象。
**Success Criteria**:

1. 用户可以对示例 KiCad 项目运行 `circuitgate review examples/blinky --profile jlcpcb`。
2. CLI 可以输出 `DesignManifest` 和 `ArtifactIndex`。
3. CLI 可以调用 KiCad ERC/DRC，并保存原始输出。
4. ERC/DRC 结果被转换成统一 `Finding` 结构。

**Execution Output**: TypeScript pnpm workspace、`circuitgate review` CLI、DesignManifest、KiCad ERC/DRC adapter、Finding 结构和 `examples/blinky` smoke fixture 已完成；Phase 2 进入验证。

**Plans**: 1 plan

Plans:
- [x] 02-01: CLI 骨架、输入归一化和 KiCad 工具调用

### Phase 3: Rule Engine and Knowledge Base

**Goal**: 建立可扩展规则系统，首批覆盖制造输出、BOM/CPL 和 profile gate。
**Depends on**: Phase 2
**Requirements**: [RULE-01, RULE-02, RULE-03, RULE-04, RULE-05]
**Evidence Input**: 首批规则优先覆盖 `MFG-001`、`MFG-002`、`MFG-003`、`MFG-005`、`BOM-001`、`BOM-002`、`BOM-005` 和 `BOM-008`。
**Success Criteria**:

1. 规则可以用 YAML/JSON 定义并通过 schema 校验。
2. P0 规则可以在样本项目或 fixture 上运行。
3. 每条规则输出都包含 severity、证据、影响和建议。
4. 深电路语义规则被降级为人工 checklist 或 beta，不作为首版 blocking 自动判断。

**Plans**: 1 plan

Plans:
- [ ] 03-01: 规则 DSL、schema、runner 和首批规则库

### Phase 4: Reporting and CI Integration

**Goal**: 让 CircuitGate 从本地工具变成工程工作流，能生成报告并在 GitHub PR 中提示风险。
**Depends on**: Phase 3
**Requirements**: [RPT-01, RPT-02, RPT-03, RPT-04, CI-01, CI-02, CI-03, CI-04]
**Success Criteria**:

1. CLI 可以生成 Markdown 和 JSON 报告。
2. 报告按 severity 汇总，并保留原始证据链接。
3. GitHub Action 可以在 PR 中运行并上传 artifact。
4. PR comment 可以显示新增 critical/high 风险摘要。

**Plans**: 1 plan

Plans:
- [ ] 04-01: 报告渲染、GitHub Action 和 PR comment

### Phase 5: Evidence-bound AI Review Assistant

**Goal**: 在规则和工具证据基础上提供 AI 摘要、风险解释和审查问答，但不让 AI 成为事实来源。
**Depends on**: Phase 4
**Requirements**: [AI-01, AI-02, AI-03]
**Success Criteria**:

1. AI 摘要只引用已有 finding、规则说明和工具输出。
2. 用户关闭 AI 后，CLI、规则和报告仍然完整工作。
3. AI 输出明确标注为辅助解释，并保留证据引用。
4. 至少 10 个样本报告经过人工检查，没有未绑定证据的关键结论。

**Plans**: 1 plan

Plans:
- [ ] 05-01: AI adapter、证据约束 prompt 和可关闭摘要

### Phase 6: Paid Pilot Operations

**Goal**: 把工具包装成可收费的半自动审查服务，验证真实客户和交付流程。
**Depends on**: Phase 4
**Requirements**: [PILOT-01, PILOT-02, PILOT-03]
**Evidence Input**: 公开 VOC 支持把首个服务包装为 KiCad + JLCPCB/PCBWay pre-order review；价格、成交和复购必须由真实项目和付费试点验证。
**Success Criteria**:

1. 有 Lite/Standard/Pro 三档审查服务说明和交付模板。
2. 至少 10 个真实项目完成审查。
3. 至少 2 个客户付费或签下等价预售承诺。
4. 每次人工复核都能回流新增规则或规则修正。

**Plans**: 1 plan

Plans:
- [ ] 06-01: 付费试点、交付模板、案例和规则反馈闭环

### Phase 7: Web Console

**Goal**: 在确认付费意愿后，提供轻量 Web 报告历史、上传和 waiver 管理。
**Depends on**: Phase 6
**Requirements**: [WEB-01, WEB-02, WEB-03]
**Success Criteria**:

1. 用户可以上传项目或查看 CI 生成的报告历史。
2. 用户可以给 finding 添加 waiver 原因。
3. 用户可以比较两个报告版本的新增/解决风险。
4. Web 不替代 CLI，本地和 CI 工作流仍然是主入口。

**Plans**: 1 plan

Plans:
- [ ] 07-01: Web 报告控制台和团队 waiver 流程

### Phase 8: Scale and Defensibility

**Goal**: 把工具从单点审查扩展成可防守的数据和生态产品。
**Depends on**: Phase 7
**Requirements**: [EXT-01, EXT-02, EXT-03, DATA-01, DATA-02, DATA-03]
**Success Criteria**:

1. 至少 5 个制造商 profile 可配置。
2. 匿名化规则命中数据可以用于规则优先级调整。
3. 至少验证一个 KiCad 以外的输入来源。
4. 有清晰的企业/数据/生态收费路径。

**Plans**: 1 plan

Plans:
- [ ] 08-01: 制造 profile、匿名化数据资产和扩展 EDA 入口

## Progress

**Execution Order:** 1 -> 1.5 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
| --- | --- | --- | --- |
| 1. Public VOC and Product Definition | 1/1 | Complete | 2026-05-12 |
| 1.5 Sample Report and Paid Pilot Landing | 1/1 | Complete; pilot validation continues in Phase 6 | 2026-05-12 |
| 2. KiCad Intake and Analysis Core | 1/1 | Plan complete; verification pending | - |
| 3. Rule Engine and Knowledge Base | 0/1 | Next after Phase 2 verification | - |
| 4. Reporting and CI Integration | 0/1 | Not started | - |
| 5. Evidence-bound AI Review Assistant | 0/1 | Not started | - |
| 6. Paid Pilot Operations | 0/1 | Not started | - |
| 7. Web Console | 0/1 | Not started | - |
| 8. Scale and Defensibility | 0/1 | Not started | - |
