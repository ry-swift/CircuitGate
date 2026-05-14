# Requirements: CircuitGate

**Defined:** 2026-05-11
**Updated:** 2026-05-14
**Core Value:** 在硬件打样前，用可追溯证据帮助工程师发现会导致返板、制造失败或 BOM 风险的明显问题。
**Validation Policy:** 不再要求用户做真人访谈。需求发现以公开网络 VOC、制造商官方文档、公开 KiCad 样本、竞品资料和后续真实项目/付费试点为验证来源。

## v1 Requirements

### Discovery

- [x] **DISC-01**: 建立公开网络 VOC 证据库，覆盖制造商官方文档、KiCad 官方文档、KiCad Forum、Reddit/公开社区、竞品公开资料，并提炼高频打样前痛点。
- [x] **DISC-02**: 收集至少 20 个公开 KiCad 项目作为规则和报告样本。当前已有 24 个公开 KiCad 样本候选。
- [x] **DISC-03**: 形成不少于 50 条规则候选，并按返板风险、可检测性、实现成本排序。当前已有 55 条规则候选，top 20 已补充公开 VOC 证据映射。
- [x] **DISC-04**: 形成产品文档，明确目标用户、首批场景、MVP 范围、规则优先级、商业包装和不承诺范围。

### Discovery Evidence Status

| Requirement | Evidence | Status | Source |
| --- | --- | --- | --- |
| DISC-01 | 30 条论坛/评论区 public VOC signals | Evidence ready | `.planning/research/forum-comment-research.md` |
| DISC-01 | 2026-05-12 公开网络 VOC 与竞品调研 | Evidence ready | `.planning/research/public-voc-2026-05-12.md` |
| DISC-02 | 24 个公开 KiCad 样本项目 | Evidence ready | `.planning/research/sample-projects.md` |
| DISC-03 | 55 条规则候选和 top 20 排序 | Evidence ready, commercial priority waits for paid pilot | `.planning/rules/rule-candidates.md` |
| DISC-04 | 产品文档 v0.2 | Evidence ready | `.planning/PRODUCT.md` |

### Sample Report and Paid Pilot Landing

- [x] **PILOT-00**: 完成 1 份公开 KiCad 项目的样板 `Pre-order Review Report`。
- [x] **PILOT-01**: 提供半自动审查服务交付模板和 Lite/Standard/Pro 服务说明。
- [ ] **PILOT-02**: 至少完成 10 个真实项目审查。
- [ ] **PILOT-03**: 至少获得 2 个付费客户或等价预售承诺。

### Intake

- [x] **INTK-01**: CLI 可以识别 `.kicad_pro`、`.kicad_sch`、`.kicad_pcb` 项目结构。
- [x] **INTK-02**: CLI 可以接收 Gerber zip、BOM CSV 和 pick-and-place CSV 作为输入。
- [x] **INTK-03**: 系统可以生成 `DesignManifest`，列出设计文件、制造文件、BOM、CPL、drill、assembly drawing 和缺失项。
- [x] **INTK-04**: 系统可以选择 `jlcpcb`、`pcbway`、`generic` 制造商 profile。

### KiCad Analysis

- [x] **KICD-01**: 系统可以调用 KiCad CLI 执行 ERC。
- [x] **KICD-02**: 系统可以调用 KiCad CLI 执行 DRC。
- [x] **KICD-03**: 系统可以解析 ERC/DRC 输出并归一化为 `Finding`。
- [x] **KICD-04**: 系统可以保存原始工具输出，供报告追溯。

### Rule Engine

- [x] **RULE-01**: 规则以 YAML/JSON 形式定义，并通过 schema 校验。
- [x] **RULE-02**: 首批 P0 规则覆盖制造输出、BOM/CPL 和 manufacturer profile gate。
- [x] **RULE-03**: 每条规则必须包含 ID、severity、适用对象、证据要求、风险说明和建议。
- [x] **RULE-04**: 规则执行结果可以合并 KiCad 工具输出和自定义检查结果。
- [x] **RULE-05**: 深电路语义规则首版降级为 `needs-human-review` checklist，不作为 blocking 自动结论。

### Reporting

- [x] **RPT-01**: 系统可以生成 Markdown 报告。
- [x] **RPT-02**: 系统可以生成 JSON 报告。
- [x] **RPT-03**: 每条 finding 包含 severity、rule ID、证据、影响、建议和 waiver 状态。
- [x] **RPT-04**: 报告包含项目概览、制造阻塞项、BOM/CPL 装配风险、KiCad ERC/DRC 解释、人工复核清单和证据附录。

### CI Integration

- [x] **CI-01**: 提供 GitHub Action，可以在 PR 中运行 CircuitGate 审查。
- [x] **CI-02**: GitHub Action 可以上传 Markdown/JSON 报告 artifact。
- [x] **CI-03**: GitHub Action 可以在 PR comment 中总结新增 critical/high 风险。
- [x] **CI-04**: 用户可以通过配置选择制造 profile 和报告失败阈值。

### AI Review

- [ ] **AI-01**: AI 只能基于已有 finding、规则说明和工具输出生成解释。
- [ ] **AI-02**: AI 输出必须标记为辅助解释，不得覆盖规则 severity 和证据链。
- [ ] **AI-03**: 用户可以关闭 AI 摘要，系统仍然能完整运行。

## v2 Requirements

### Web Console

- **WEB-01**: 用户可以通过 Web 上传项目并查看报告历史。
- **WEB-02**: 用户可以管理 waiver 和团队规则配置。
- **WEB-03**: 用户可以比较两个版本之间新增和解决的风险。

### Extended EDA

- **EXT-01**: 支持 Altium、EasyEDA 或其他 ECAD 导出的中间文件。
- **EXT-02**: 支持 PDF 原理图辅助解析。
- **EXT-03**: 支持 Yosys/OpenROAD 前端日志审查。

### Data Products

- **DATA-01**: 建立制造商 profile 市场。
- **DATA-02**: 建立匿名化规则命中和返板案例数据库。
- **DATA-03**: 与元器件数据供应商集成生命周期和库存风险。

## Out of Scope

| Feature | Reason |
| --- | --- |
| 完整在线 PCB 编辑器 | 工程量大、竞争强、与首要付费场景不一致 |
| 自动布线 | 可靠性和责任边界不适合 MVP |
| 自动修改设计文件 | 容易破坏客户 IP 和设计意图，先只做建议 |
| 正式认证报告 | 需要资质和法律责任，MVP 只做辅助审查 |
| 企业私有部署 | v1 先用本地 CLI 满足隐私需求，私有部署放到 v2+ |
| 纯 AI 自动硬件设计 | 资金、数据、竞品和责任边界都不适合当前阶段 |

## Traceability

| Requirement | Phase | Status |
| --- | --- | --- |
| DISC-01 | Phase 1 | Public VOC evidence ready; no interview gate |
| DISC-02 | Phase 1 | Evidence ready |
| DISC-03 | Phase 1 | Evidence ready; commercial priority waits for paid pilot |
| DISC-04 | Phase 1 | Product doc v0.2 ready |
| PILOT-00 | Phase 1.5 | Complete |
| PILOT-01 | Phase 1.5 / Phase 6 | Complete |
| PILOT-02 | Phase 6 | Pending |
| PILOT-03 | Phase 6 | Pending |
| INTK-01 | Phase 2 | Complete |
| INTK-02 | Phase 2 | Complete |
| INTK-03 | Phase 2 | Complete |
| INTK-04 | Phase 2 | Complete |
| KICD-01 | Phase 2 | Complete |
| KICD-02 | Phase 2 | Complete |
| KICD-03 | Phase 2 | Complete |
| KICD-04 | Phase 2 | Complete |
| RULE-01 | Phase 3 | Complete |
| RULE-02 | Phase 3 | Complete |
| RULE-03 | Phase 3 | Complete |
| RULE-04 | Phase 3 | Complete |
| RULE-05 | Phase 3 | Complete |
| RPT-01 | Phase 4 | Complete |
| RPT-02 | Phase 4 | Complete |
| RPT-03 | Phase 4 | Complete |
| RPT-04 | Phase 4 | Complete |
| CI-01 | Phase 4 | Complete |
| CI-02 | Phase 4 | Complete |
| CI-03 | Phase 4 | Complete |
| CI-04 | Phase 4 | Complete |
| AI-01 | Phase 5 | Pending |
| AI-02 | Phase 5 | Pending |
| AI-03 | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0

---
*Last updated: 2026-05-14 after Phase 4 reporting and CI execution*
