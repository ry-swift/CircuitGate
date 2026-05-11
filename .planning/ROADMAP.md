# Roadmap: CircuitGate

## Overview

CircuitGate 从一个可人工复核的 KiCad 审查服务开始，先验证目标用户、规则价值和付费意愿，再沉淀为 CLI、规则引擎、报告和 GitHub Action。v1 的终点不是完整 SaaS，而是一个能在真实硬件项目中运行、能生成可复核报告、能获得早期收入的技术驱动产品。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Problem Discovery** - 找到真实硬件审查痛点、样本项目和首批规则候选。
- [ ] **Phase 2: KiCad Intake and Analysis Core** - 做出可运行的本地 CLI，能识别 KiCad 项目并调用 ERC/DRC。
- [ ] **Phase 3: Rule Engine and Knowledge Base** - 建立规则 DSL、规则 schema 和首批高价值规则库。
- [ ] **Phase 4: Reporting and CI Integration** - 生成工程可复核报告，并接入 GitHub PR 工作流。
- [ ] **Phase 5: AI Review Assistant** - 在证据链之上增加 AI 摘要和风险解释。
- [ ] **Phase 6: Paid Pilot Operations** - 用半自动审查服务验证收费和交付闭环。
- [ ] **Phase 7: Web Console** - 在有付费信号后构建轻量 Web 报告和团队 waiver 管理。
- [ ] **Phase 8: Scale and Defensibility** - 建立制造 profile、匿名化规则数据和扩展 EDA 入口。

## Phase Details

### Phase 1: Problem Discovery
**Goal**: 证明目标用户确实愿意在打样前使用审查工具，并形成第一版规则和样本数据。
**Depends on**: Nothing (first phase)
**Requirements**: [DISC-01, DISC-02, DISC-03]
**Success Criteria** (what must be TRUE):
  1. 至少 30 位目标用户访谈完成，并提炼出高频返板/审查痛点。
  2. 至少 20 个公开 KiCad 项目被归档为样本池。
  3. 至少 50 条规则候选被按价值和实现难度排序。
  4. 明确 3 个最容易付费的细分场景。
**Plans**: 1 plan

Plans:
- [ ] 01-01: 用户访谈、样本项目和规则候选沉淀

### Phase 2: KiCad Intake and Analysis Core
**Goal**: 做出第一个能在本地运行的 `circuitgate review` CLI，识别项目并执行 KiCad ERC/DRC。
**Depends on**: Phase 1
**Requirements**: [INTK-01, INTK-02, INTK-03, KICD-01, KICD-02, KICD-03, KICD-04]
**Success Criteria** (what must be TRUE):
  1. 用户可以对示例 KiCad 项目运行 `circuitgate review examples/blinky`。
  2. CLI 可以输出 `DesignManifest`。
  3. CLI 可以调用 KiCad ERC/DRC，并保存原始输出。
  4. ERC/DRC 结果被转换成统一 `Finding` 结构。
**Plans**: 1 plan

Plans:
- [ ] 02-01: CLI 骨架、输入归一化和 KiCad 工具调用

### Phase 3: Rule Engine and Knowledge Base
**Goal**: 建立可扩展规则系统，首批覆盖电源、接口、PCB、BOM 和制造输出风险。
**Depends on**: Phase 2
**Requirements**: [RULE-01, RULE-02, RULE-03, RULE-04]
**Success Criteria** (what must be TRUE):
  1. 规则可以用 YAML/JSON 定义并通过 schema 校验。
  2. 至少 20 条规则可以在样本项目上运行。
  3. 每条规则输出都包含 severity、证据、影响和建议。
  4. 规则结果可以和 KiCad ERC/DRC finding 合并。
**Plans**: 1 plan

Plans:
- [ ] 03-01: 规则 DSL、schema、runner 和首批规则库

### Phase 4: Reporting and CI Integration
**Goal**: 让 CircuitGate 从本地工具变成工程工作流，能生成报告并在 GitHub PR 中提示风险。
**Depends on**: Phase 3
**Requirements**: [RPT-01, RPT-02, RPT-03, RPT-04, CI-01, CI-02, CI-03, CI-04]
**Success Criteria** (what must be TRUE):
  1. CLI 可以生成 Markdown 和 JSON 报告。
  2. 报告按 severity 汇总，并保留原始证据链接。
  3. GitHub Action 可以在 PR 中运行并上传 artifact。
  4. PR comment 可以显示新增 critical/high 风险摘要。
**Plans**: 1 plan

Plans:
- [ ] 04-01: 报告渲染、GitHub Action 和 PR comment

### Phase 5: AI Review Assistant
**Goal**: 在规则和工具证据基础上提供 AI 摘要、风险解释和审查问答，但不让 AI 成为事实来源。
**Depends on**: Phase 4
**Requirements**: [AI-01, AI-02, AI-03]
**Success Criteria** (what must be TRUE):
  1. AI 摘要只引用已有 finding、规则说明和工具输出。
  2. 用户关闭 AI 后，CLI、规则和报告仍然完整工作。
  3. AI 输出明确标注为辅助解释，并保留证据引用。
  4. 至少 10 个样本报告经过人工检查，没有未绑定证据的关键结论。
**Plans**: 1 plan

Plans:
- [ ] 05-01: AI adapter、证据约束 prompt 和可关闭摘要

### Phase 6: Paid Pilot Operations
**Goal**: 把工具包装成可收费的半自动审查服务，验证真实客户和交付流程。
**Depends on**: Phase 5
**Requirements**: [PILOT-01, PILOT-02, PILOT-03]
**Success Criteria** (what must be TRUE):
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
**Success Criteria** (what must be TRUE):
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
**Success Criteria** (what must be TRUE):
  1. 至少 5 个制造商 profile 可配置。
  2. 匿名化规则命中数据可以用于规则优先级调整。
  3. 至少验证一个 KiCad 以外的输入来源。
  4. 有清晰的企业/数据/生态收费路径。
**Plans**: 1 plan

Plans:
- [ ] 08-01: 制造 profile、匿名化数据资产和扩展 EDA 入口

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Problem Discovery | 0/1 | Not started | - |
| 2. KiCad Intake and Analysis Core | 0/1 | Not started | - |
| 3. Rule Engine and Knowledge Base | 0/1 | Not started | - |
| 4. Reporting and CI Integration | 0/1 | Not started | - |
| 5. AI Review Assistant | 0/1 | Not started | - |
| 6. Paid Pilot Operations | 0/1 | Not started | - |
| 7. Web Console | 0/1 | Not started | - |
| 8. Scale and Defensibility | 0/1 | Not started | - |
