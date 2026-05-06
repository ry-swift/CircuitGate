# Requirements: Hardware Design CI

**Defined:** 2026-05-06
**Core Value:** 在硬件错误进入打板、采购、SMT 或客户交付前，用本地可复核的证据报告帮团队提前拦截高风险问题。

## v1 Requirements

### Customer Validation

- [ ] **CUST-01**: 用户可以看到一页清晰的产品说明，理解“打板前 48 小时硬件设计审查”的输入、输出、交付周期和边界。
- [ ] **CUST-02**: 创始人可以用标准话术向 B 端客户解释本地处理、脱敏文件、审查范围和不承诺事项。
- [ ] **CUST-03**: 系统性记录至少 150 家潜在 B 端公司名单、联系人、行业、渠道来源和跟进状态。
- [ ] **CUST-04**: 至少完成 10 次有效客户访谈，并记录返板、BOM、封装、制造文件、审查流程和付费意愿事实。
- [ ] **CUST-05**: 至少拿到 3 个真实或脱敏工程包用于样例审查。

### Demo

- [ ] **DEMO-01**: Demo 包含一个可公开演示的脱敏示例工程。
- [ ] **DEMO-02**: 用户可以通过一个本地命令或极简入口触发审查流程。
- [ ] **DEMO-03**: Demo 能生成 Markdown 和 HTML 中文审查报告。
- [ ] **DEMO-04**: Demo 报告包含至少 10 条典型 finding，覆盖 BOM、Gerber/CPL 完整性、位号一致性、封装、极性件、测试点或 Datasheet 约束。
- [ ] **DEMO-05**: Demo 有一段 90 秒以内的演示视频或可复述演示脚本。

### Review Report

- [ ] **RPT-01**: 每条 finding 包含标题、严重等级、影响说明、证据、整改建议和复核状态。
- [ ] **RPT-02**: 报告能区分 Critical、High、Medium、Low 和 Info 风险等级。
- [ ] **RPT-03**: 报告首页能展示项目摘要、输入文件、风险统计和投板前 checklist。
- [ ] **RPT-04**: 报告必须明确审查边界和免责说明，不承诺发现所有问题。
- [ ] **RPT-05**: 高严重度 finding 必须支持人工复核标记。

### Local CLI

- [ ] **CLI-01**: CLI 可以读取项目目录并识别 BOM、Gerber、CPL、KiCad 工程文件和附件。
- [ ] **CLI-02**: CLI 支持 BOM CSV/XLSX 的基础字段校验，包括 MPN、数量、封装、位号和 DNP。
- [ ] **CLI-03**: CLI 支持 Gerber/CPL 文件完整性和命名检查。
- [ ] **CLI-04**: CLI 支持 BOM 与 CPL 位号一致性检查。
- [ ] **CLI-05**: CLI 支持 YAML/JSON 规则配置。
- [ ] **CLI-06**: CLI 输出结构化 finding JSON，供报告层和后续 CI 使用。

### Evidence and Safety

- [ ] **SAFE-01**: 默认审查流程在本地运行，不要求客户上传完整工程文件到第三方云。
- [ ] **SAFE-02**: 每条 finding 至少绑定一个 evidence 来源。
- [ ] **SAFE-03**: AI 生成内容不得作为唯一证据来源。
- [ ] **SAFE-04**: 客户文件处理流程包含脱敏建议和本地删除/保留策略说明。
- [ ] **SAFE-05**: 报告中不得编造 datasheet 参数、制造规则或供应链状态。

### Business Pilot

- [ ] **BIZ-01**: 首批 offer 明确包含样例价、正式单价、交付周期、输入清单和输出清单。
- [ ] **BIZ-02**: 至少输出 2 份真实或脱敏项目样例审查报告。
- [ ] **BIZ-03**: 至少获得 1 个付费试点或明确预付意向。
- [ ] **BIZ-04**: 每次样例审查后记录客户是否认可 finding、是否愿意下次付费、是否愿意纳入固定流程。

## v2 Requirements

### Design CI

- **CI-01**: 支持 GitLab/Gitee/GitHub Action 集成。
- **CI-02**: 支持 PR/MR comment 输出高风险 finding。
- **CI-03**: 支持版本化 finding diff。
- **CI-04**: 支持 waiver 豁免机制和审查历史。
- **CI-05**: 支持飞书/企业微信通知。

### Team Workspace

- **TEAM-01**: 支持项目、版本、报告、finding 和复核状态管理。
- **TEAM-02**: 支持团队评论、责任人和整改状态。
- **TEAM-03**: 支持企业规则包配置。
- **TEAM-04**: 支持客户自有 AVL/BOM 规则导入。

### Private Deployment

- **PRIV-01**: 支持 Docker 内网部署。
- **PRIV-02**: 支持权限、审计日志和数据保留策略。
- **PRIV-03**: 支持国产模型、私有模型和 OpenAI 兼容 API 网关。
- **PRIV-04**: 支持行业规则包：机器人、工控、电源、仪器仪表。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 完整在线原理图/PCB 编辑器 | 冷启动工程量大，且不是付费验证最短路径 |
| 自动布局布线 | 技术和责任边界过重，不适合 v1 |
| 高频/RF/DDR/PCIe 深度仿真 | 需要专业仿真能力和强验证，先不承诺 |
| 直接解析所有 Altium 私有格式 | 私有格式成本高，先通过导出文件接入 |
| 自助注册 SaaS 和支付系统 | 早期客户需要信任和人工交付，不依赖自助转化 |
| 大企业正式采购流程 | 当前阶段缺少公司主体、资质、案例和交付体系 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CUST-01 | Phase 1 | Pending |
| CUST-02 | Phase 1 | Pending |
| CUST-03 | Phase 3 | Pending |
| CUST-04 | Phase 3 | Pending |
| CUST-05 | Phase 3 | Pending |
| DEMO-01 | Phase 2 | Pending |
| DEMO-02 | Phase 2 | Pending |
| DEMO-03 | Phase 2 | Pending |
| DEMO-04 | Phase 2 | Pending |
| DEMO-05 | Phase 2 | Pending |
| RPT-01 | Phase 1 | Pending |
| RPT-02 | Phase 1 | Pending |
| RPT-03 | Phase 1 | Pending |
| RPT-04 | Phase 1 | Pending |
| RPT-05 | Phase 2 | Pending |
| CLI-01 | Phase 2 | Pending |
| CLI-02 | Phase 2 | Pending |
| CLI-03 | Phase 2 | Pending |
| CLI-04 | Phase 2 | Pending |
| CLI-05 | Phase 2 | Pending |
| CLI-06 | Phase 2 | Pending |
| SAFE-01 | Phase 1 | Pending |
| SAFE-02 | Phase 1 | Pending |
| SAFE-03 | Phase 1 | Pending |
| SAFE-04 | Phase 1 | Pending |
| SAFE-05 | Phase 2 | Pending |
| BIZ-01 | Phase 3 | Pending |
| BIZ-02 | Phase 3 | Pending |
| BIZ-03 | Phase 4 | Pending |
| BIZ-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-06 after initial GSD product direction planning*
