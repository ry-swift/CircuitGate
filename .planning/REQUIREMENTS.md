# Requirements: CircuitGate

**Defined:** 2026-05-11  
**Core Value:** 在硬件打样前，用可追溯证据帮助工程师发现会导致返板、制造失败或 BOM 风险的明显问题。

## v1 Requirements

### Discovery

- [ ] **DISC-01**: 完成至少 30 位目标硬件工程师访谈，并记录真实打样前审查痛点。
- [ ] **DISC-02**: 收集至少 20 个公开 KiCad 项目作为规则和报告样本。
- [ ] **DISC-03**: 形成不少于 50 条规则候选，并按返板风险、可检测性、实现成本排序。

### Intake

- [ ] **INTK-01**: CLI 可以识别 `.kicad_pro`、`.kicad_sch`、`.kicad_pcb` 项目结构。
- [ ] **INTK-02**: CLI 可以接收 Gerber zip、BOM CSV 和 pick-and-place CSV 作为输入。
- [ ] **INTK-03**: 系统可以生成 `DesignManifest`，列出设计文件、制造文件、BOM 和缺失项。

### KiCad Analysis

- [ ] **KICD-01**: 系统可以调用 KiCad CLI 执行 ERC。
- [ ] **KICD-02**: 系统可以调用 KiCad CLI 执行 DRC。
- [ ] **KICD-03**: 系统可以解析 ERC/DRC 输出并归一化为 `Finding`。
- [ ] **KICD-04**: 系统可以保存原始工具输出，供报告追溯。

### Rule Engine

- [ ] **RULE-01**: 规则以 YAML/JSON 形式定义，并通过 schema 校验。
- [ ] **RULE-02**: 首批规则覆盖电源、接口、PCB、BOM、制造输出五类风险。
- [ ] **RULE-03**: 每条规则必须包含 ID、severity、适用对象、证据要求、风险说明和建议。
- [ ] **RULE-04**: 规则执行结果可以合并 KiCad 工具输出和自定义检查结果。

### Reporting

- [ ] **RPT-01**: 系统可以生成 Markdown 报告。
- [ ] **RPT-02**: 系统可以生成 JSON 报告。
- [ ] **RPT-03**: 每条 finding 包含 severity、rule ID、证据、影响、建议和 waiver 状态。
- [ ] **RPT-04**: 报告包含项目概览、风险汇总、阻塞项、建议复查清单和原始工具输出链接。

### CI Integration

- [ ] **CI-01**: 提供 GitHub Action，可以在 PR 中运行 CircuitGate 审查。
- [ ] **CI-02**: GitHub Action 可以上传 Markdown/JSON 报告 artifact。
- [ ] **CI-03**: GitHub Action 可以在 PR comment 中总结新增 critical/high 风险。
- [ ] **CI-04**: 用户可以通过配置选择制造 profile 和报告失败阈值。

### AI Review

- [ ] **AI-01**: AI 只能基于已有 finding、规则说明和工具输出生成解释。
- [ ] **AI-02**: AI 输出必须标记为辅助解释，不得覆盖规则 severity 和证据链。
- [ ] **AI-03**: 用户可以关闭 AI 摘要，系统仍然能完整运行。

### Paid Pilot

- [ ] **PILOT-01**: 提供半自动审查服务交付模板。
- [ ] **PILOT-02**: 至少完成 10 个真实项目审查。
- [ ] **PILOT-03**: 至少获得 2 个付费客户或等价预售承诺。

## v2 Requirements

### Web Console

- **WEB-01**: 用户可以通过 Web 上传项目并查看报告历史。
- **WEB-02**: 用户可以管理 waiver 和团队规则配置。
- **WEB-03**: 用户可以比较两个版本之间新增和解决的风险。

### Extended EDA

- **EXT-01**: 支持 Altium 或 EasyEDA 导出的中间文件。
- **EXT-02**: 支持 PDF 原理图辅助解析。
- **EXT-03**: 支持 Yosys/OpenROAD 前端日志审查。

### Data Products

- **DATA-01**: 建立制造商 profile 市场。
- **DATA-02**: 建立匿名化规则命中和返板案例数据库。
- **DATA-03**: 与元器件数据供应商集成生命周期和库存风险。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 完整在线 PCB 编辑器 | 工程量大、竞争强、与首要付费场景不一致 |
| 自动布线 | 可靠性和责任边界不适合 MVP |
| 自动修改设计文件 | 容易破坏客户 IP 和设计意图，先只做建议 |
| 正式认证报告 | 需要资质和法律责任，MVP 只做辅助审查 |
| 企业私有部署 | v1 先用本地 CLI 满足隐私需求，私有部署放到 v2+ |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DISC-01 | Phase 1 | Pending |
| DISC-02 | Phase 1 | Pending |
| DISC-03 | Phase 1 | Pending |
| INTK-01 | Phase 2 | Pending |
| INTK-02 | Phase 2 | Pending |
| INTK-03 | Phase 2 | Pending |
| KICD-01 | Phase 2 | Pending |
| KICD-02 | Phase 2 | Pending |
| KICD-03 | Phase 2 | Pending |
| KICD-04 | Phase 2 | Pending |
| RULE-01 | Phase 3 | Pending |
| RULE-02 | Phase 3 | Pending |
| RULE-03 | Phase 3 | Pending |
| RULE-04 | Phase 3 | Pending |
| RPT-01 | Phase 4 | Pending |
| RPT-02 | Phase 4 | Pending |
| RPT-03 | Phase 4 | Pending |
| RPT-04 | Phase 4 | Pending |
| CI-01 | Phase 4 | Pending |
| CI-02 | Phase 4 | Pending |
| CI-03 | Phase 4 | Pending |
| CI-04 | Phase 4 | Pending |
| AI-01 | Phase 5 | Pending |
| AI-02 | Phase 5 | Pending |
| AI-03 | Phase 5 | Pending |
| PILOT-01 | Phase 6 | Pending |
| PILOT-02 | Phase 6 | Pending |
| PILOT-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-05-11*
*Last updated: 2026-05-11 after initial GSD product planning*
