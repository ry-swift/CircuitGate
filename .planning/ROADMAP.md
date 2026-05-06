# Roadmap: Hardware Design CI

## Overview

路线图采用 review-first、local-first、evidence-first 的冷启动路径：先做能拿去见客户的销售型 Demo，再用真实或脱敏项目交付 Concierge Review 服务，随后把重复审查动作沉淀成本地 CLI，最后用付费试点验证是否值得进入 Design CI 和团队工作台。整个 v1.0 不追求完整 EDA 平台，只追求真实 B 端客户愿意给文件、认可报告、付费试点并进入固定流程。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Product Offer and Report Contract** - 定义销售型 Demo、报告模板、审查边界、客户话术和证据标准。
- [ ] **Phase 2: Local Demo and Rule MVP** - 做出本地可运行 Demo，生成 Markdown/HTML 报告和结构化 finding。
- [ ] **Phase 3: Customer Discovery and Concierge Reviews** - 建立 B 端名单、完成访谈、拿真实/脱敏工程包并交付样例报告。
- [ ] **Phase 4: Paid Pilot and Design CI Decision** - 推进付费试点，验证是否进入 CLI/CI/Web 工作台产品化。

## Phase Details

### Phase 1: Product Offer and Report Contract
**Goal**: 让产品方向变成客户能理解、工程师能复核、后续工具能实现的具体交付合同。
**Depends on**: Nothing (first phase)
**Requirements**: [CUST-01, CUST-02, RPT-01, RPT-02, RPT-03, RPT-04, SAFE-01, SAFE-02, SAFE-03, SAFE-04]
**Success Criteria** (what must be TRUE):
  1. 客户能在 2 分钟内理解输入是什么、输出是什么、为什么能降低返板/生产沟通风险。
  2. 报告模板明确包含风险等级、证据、影响说明、整改建议、复核状态和免责边界。
  3. 本地处理、脱敏文件、数据保留和不上传第三方云的承诺能被标准话术解释清楚。
  4. Demo 和 Concierge Review 的首批报价、交付周期、输入清单和输出清单已经明确。
**Plans**: 3 plans

Plans:
- [ ] 01-01: 编写一页产品说明、客户话术和首批 offer。
- [ ] 01-02: 设计中文审查报告模板、finding schema 和 severity 标准。
- [ ] 01-03: 编写安全边界、免责说明、脱敏建议和文件处理流程。

### Phase 2: Local Demo and Rule MVP
**Goal**: 做出一个本地可运行的销售型 Demo，让示例工程能生成高质量中文审查报告。
**Depends on**: Phase 1
**Requirements**: [DEMO-01, DEMO-02, DEMO-03, DEMO-04, DEMO-05, RPT-05, CLI-01, CLI-02, CLI-03, CLI-04, CLI-05, CLI-06, SAFE-05]
**Success Criteria** (what must be TRUE):
  1. 用户可以运行一个本地命令或极简入口，对示例工程生成 Markdown/HTML 报告。
  2. Demo 报告至少包含 10 条可解释 finding，并覆盖 BOM、Gerber/CPL、位号一致性、封装或 Datasheet 相关风险。
  3. 每条 finding 都有结构化 JSON、severity、evidence 和 recommendation。
  4. Demo 有 90 秒以内演示视频或可复述脚本，可用于陌生客户约访。
**Plans**: 4 plans

Plans:
- [ ] 02-01: 准备脱敏示例工程和输入文件结构。
- [ ] 02-02: 实现本地 CLI 骨架、项目扫描和配置文件。
- [ ] 02-03: 实现首批规则：BOM 字段、Gerber/CPL 完整性、BOM/CPL 位号一致性。
- [ ] 02-04: 实现报告生成、Demo 脚本和演示视频材料。

### Phase 3: Customer Discovery and Concierge Reviews
**Goal**: 用 Demo 和报告样例找到真实 B 端客户，拿到工程包并交付样例审查。
**Depends on**: Phase 2
**Requirements**: [CUST-03, CUST-04, CUST-05, BIZ-01, BIZ-02]
**Success Criteria** (what must be TRUE):
  1. 至少建立 150 家 B 端潜在客户名单，并标注行业、城市、联系人、渠道和跟进状态。
  2. 至少完成 10 次有效访谈，访谈记录能回答返板、BOM、封装、制造文件、审查流程和付费意愿。
  3. 至少拿到 3 个真实或脱敏工程包。
  4. 至少交付 2 份真实或脱敏项目样例审查报告。
**Plans**: 4 plans

Plans:
- [ ] 03-01: 建立 B 端客户名单和渠道伙伴名单。
- [ ] 03-02: 执行首轮外呼/私信/展会/渠道约访，并记录 CRM。
- [ ] 03-03: 对真实或脱敏工程包执行 Concierge Review。
- [ ] 03-04: 汇总 finding、客户反馈、复用规则和付费信号。

### Phase 4: Paid Pilot and Design CI Decision
**Goal**: 验证客户是否愿意为下一次审查或流程化试点付费，并决定是否进入 Design CI 产品化。
**Depends on**: Phase 3
**Requirements**: [BIZ-03, BIZ-04]
**Success Criteria** (what must be TRUE):
  1. 至少获得 1 个付费试点或明确预付意向。
  2. 每个样例客户都记录是否认可 finding、是否愿意下次付费、是否愿意放入固定流程。
  3. 已形成继续、收窄或转向的决策：Design CI、BOM 风险、Layout/PCBA 渠道白标或暂停。
  4. 如果继续产品化，Phase 5 范围明确为 CLI/CI/Web 报告中的最小必要能力。
**Plans**: 3 plans

Plans:
- [ ] 04-01: 设计付费试点报价、合同/确认单要点和交付边界。
- [ ] 04-02: 向样例客户推进复盘会、付费转化和下一项目预付。
- [ ] 04-03: 召开阶段复盘，基于指标决定 Phase 5 产品化方向。

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Product Offer and Report Contract | 0/3 | Not started | - |
| 2. Local Demo and Rule MVP | 0/4 | Not started | - |
| 3. Customer Discovery and Concierge Reviews | 0/4 | Not started | - |
| 4. Paid Pilot and Design CI Decision | 0/3 | Not started | - |
