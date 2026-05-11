# CircuitGate 产品文档

**版本**: v0.1  
**日期**: 2026-05-11  
**定位**: KiCad-first 的硬件设计审查与 EDA CI 平台  
**创业假设**: 零资金、零背景、零行业资源，从可售卖的工业软件小切口开始，先做能减少返板和审查成本的工具与服务，再逐步进入更深的半导体/EDA 工具链。

## 1. 产品一句话

CircuitGate 是硬件工程里的 `GitHub Actions + AI Reviewer`：自动检查 KiCad 项目、Gerber、BOM 和制造输出，给出可追溯、可解释、可复核的设计审查报告，帮助小型硬件团队在打样前发现高风险问题。

## 2. 为什么这个产品可落地

完整 EDA、晶圆厂软件、先进封装平台都需要强资金、强客户背书和长期行业数据，不适合白手起家。PCB/硬件审查的优势是：

- 输入工件可获得：KiCad 项目、Gerber、BOM、PDF 原理图、制造规则都能从公开项目和早期客户中拿到。
- 开源生态成熟：KiCad 9 支持命令行 jobsets、ERC/DRC、可复用输出流程；OpenROAD/Yosys 等证明开源 EDA 工作流正在成熟。
- 痛点明确：硬件团队最怕返板、BOM 缺货、制造输出错误、电源/接口/连接器细节出错。
- 第一笔收入容易：可以先卖“半自动设计审查服务”，工具内部使用，客户买结果，不要求 SaaS 一开始完美。
- 技术壁垒可积累：规则库、风险样本、waiver 数据、报告模板、真实返板案例会形成长期资产。

## 3. 目标用户

### 第一批用户

- 机器人、IoT、工业控制、传感器、开源硬件团队。
- 用 KiCad 或愿意导出 Gerber/BOM 的 1-10 人硬件团队。
- 没有资深硬件 reviewer，但需要在打样前降低明显错误。

### 暂不服务

- 先进芯片设计团队。
- 晶圆厂、封装厂、车规认证项目。
- 需要正式合规认证签字的客户。
- 已有完整 Altium 365/企业 PLM/资深硬件评审流程的大团队。

## 4. 核心用户场景

### 场景 A：打样前审查

用户上传 KiCad 项目或 Gerber zip + BOM，选择制造 profile，例如 `JLCPCB 2-layer`、`PCBWay 4-layer`。系统运行 ERC/DRC、BOM 风险检查、制造文件完整性检查和规则库检查，输出风险清单。

### 场景 B：GitHub PR 审查

硬件项目每次修改 PCB 文件或 BOM 后触发 GitHub Action。CircuitGate 在 PR 下评论新增风险、已解决风险和需要人工确认的 waiver。

### 场景 C：人工审查服务

早期客户提交项目，系统先自动跑检查，再由创始人按报告模板人工复核，最终交付 `Review Report`。这个服务反哺规则库和真实付费验证。

## 5. MVP 范围

### 必须有

- CLI：`circuitgate review ./project --profile jlcpcb-2layer`
- KiCad 项目识别：`.kicad_pro`、`.kicad_sch`、`.kicad_pcb`
- ERC/DRC/jobset 调用与结果解析
- BOM CSV 解析：MPN、数量、封装、DNP、替代料字段
- 制造输出检查：Gerber、drill、position、BOM、assembly 文件是否齐全
- 规则库 v0：20-30 条高价值规则
- 报告输出：Markdown + JSON，后续再加 PDF
- GitHub Action：PR comment + artifact
- AI 解释层：只解释风险和生成报告摘要，不直接判定电路一定正确

### 明确不做

- 不做完整在线原理图/PCB 编辑器。
- 不自动布线、不自动生成 PCB。
- 不承诺“零返板”。
- 不做正式安规、EMC、车规认证。
- 不接触客户机密数据训练模型，除非客户明确授权。

## 6. 核心功能模块

### 6.1 Intake 输入层

负责识别项目类型、解压上传文件、归一化输入。

输入：
- KiCad project directory
- Gerber zip
- BOM CSV
- Pick-and-place CSV
- 可选 PDF 原理图

输出：
- `DesignManifest`
- `ArtifactIndex`
- `InputWarnings`

### 6.2 Analyzer 分析层

负责调用外部工具和解析结果。

第一阶段只依赖：
- KiCad CLI：ERC/DRC/jobset
- 内置 BOM parser
- 内置 Gerber/drill 文件完整性检查

后续再接入：
- `kicad-cli pcb export`
- `gerbv`/`pcb-tools`
- `ngspice`
- `OpenROAD/Yosys` 用于 RTL 阶段扩展

### 6.3 Rule Engine 规则层

规则用结构化 DSL 表达，避免把知识写死在代码里。

示例：

```yaml
id: PWR-001
title: Regulator input/output capacitors should be close and present
severity: high
applies_to: schematic
evidence:
  - symbol_role: regulator
  - required_caps: input, output
message: 稳压芯片输入/输出电容缺失或未能从设计中确认，可能导致上电不稳定。
```

首批规则类型：
- 电源：LDO/DC-DC、去耦、电源入口、保险丝、反接保护。
- 接口：USB、UART、I2C、SPI、CAN、RS485。
- PCB：最小线宽/间距、过孔、板框、丝印、差分线、测试点。
- BOM：DNP、封装不一致、MPN 缺失、生命周期/替代料字段缺失。
- 制造：Gerber 层缺失、钻孔文件缺失、坐标文件缺失、装配输出缺失。

### 6.4 Report 报告层

报告必须做到工程师能复核，而不是只给 AI 结论。

每条发现包含：
- 风险等级：critical/high/medium/low/info
- 证据：文件、对象、坐标、规则 ID、工具原始输出
- 影响：为什么可能导致返板或制造问题
- 建议：如何检查或修复
- waiver：是否允许用户标记为已知风险

### 6.5 CI 集成层

GitHub Action 最先做，因为它直接进入工程师工作流。

示例：

```yaml
name: CircuitGate Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: circuitgate/circuitgate-action@v0
        with:
          profile: jlcpcb-2layer
          project: hardware/main.kicad_pro
```

### 6.6 AI Assistant 层

AI 只做三件事：
- 把工具输出翻译成工程师能理解的中文/英文报告。
- 根据规则证据生成审查摘要。
- 对用户问题做上下文问答，例如“为什么这个 high 风险需要修？”。

AI 不做：
- 不直接修改设计。
- 不声称已证明电路正确。
- 不覆盖规则引擎的证据链。

## 7. 技术架构建议

### v1 技术栈

- CLI/核心：TypeScript + Node.js 22。
- 包管理：pnpm workspace。
- 规则 DSL：YAML + JSON Schema。
- 报告：Markdown、JSON，后续 PDF。
- CI：GitHub Action wrapper。
- Web v2：Next.js + Postgres + object storage。
- AI：Provider adapter，先支持 OpenAI-compatible API，保留本地模型接口。

### 关键设计原则

- `IR first`：内部先形成 `DesignManifest` 和 `Finding`，报告只是投影。
- `Rules before AI`：规则和工具结果是事实来源，AI 是解释层。
- `CLI before SaaS`：先让产品在本地和 CI 中可用，再做 Web。
- `Review-first`：先审查，不做完整编辑器。
- `Human override`：所有风险都能被 waiver，但 waiver 必须有原因。

## 8. 商业模式

### 第 1 阶段收入

半自动硬件审查服务：
- Lite：199 美元/板，适合 2 层简单板。
- Standard：499 美元/板，适合 4 层 IoT/工业控制板。
- Pro：999 美元/板，包含一次复审。

### 第 2 阶段收入

工具订阅：
- Free：本地 CLI + 基础规则。
- Pro：19-49 美元/月，GitHub Action、报告历史、AI 摘要。
- Team：199-499 美元/月，私有规则、waiver 流程、团队报告。

### 第 3 阶段收入

企业与生态：
- 私有部署。
- 制造商 profile 订阅。
- 元器件库/BOM 风险数据增强。
- 与设计服务公司合作分成。

## 9. 获客路径

第一批不要做泛营销，做工程师信任：

- 每周拆解 1 个公开 KiCad 项目，发布“打样前审查报告”。
- 开源 `circuitgate-cli` 基础版。
- 写 20 篇高质量硬件审查文章：USB-C、DC-DC、RS485、ESD、BOM、Gerber、JLCPCB 输出。
- 到 KiCad、Hackaday、Reddit r/PrintedCircuitBoard、开源硬件社区找设计 partner。
- 用“免费审查 10 块板”换真实反馈和案例。

## 10. 成功指标

### 30 天

- 访谈 30 位硬件工程师。
- 收集 20 个公开项目。
- 整理 50 条规则候选。
- 完成 CLI 假报告原型。

### 90 天

- CLI 可以跑 KiCad ERC/DRC 并生成 Markdown 报告。
- GitHub Action 可用于公开仓库。
- 10 个真实项目跑过报告。
- 至少 2 个付费审查客户。

### 180 天

- 规则库达到 100 条。
- 形成 5 个制造 profile。
- 有 10 个付费客户或 3000 美元以上累计收入。
- 明确是否继续 SaaS 化。

## 11. 最大风险与对策

| 风险 | 对策 |
|------|------|
| 检查结果误报太多 | 每条规则必须有 severity、证据、waiver 和测试样例 |
| AI 产生幻觉 | AI 不作为事实来源，只解释规则和工具输出 |
| 用户不愿上传私密设计 | 先做本地 CLI 和 GitHub Action，Web 后置 |
| KiCad 文件格式复杂 | MVP 先调用 KiCad CLI，少量解析只做 manifest |
| 规则库不够专业 | 用付费审查服务、公开设计复盘、专家访谈持续沉淀 |
| 竞争对手做完整 AI PCB | 避开“全自动设计”叙事，主打审查、证据链、CI 和工程流程 |

## 12. 当前最推荐的第一步

不要先写 Web 页面。先做一个可演示的 CLI：

```bash
circuitgate review examples/blinky \
  --profile jlcpcb-2layer \
  --format markdown \
  --output review.md
```

输出一份看起来像真实资深工程师写的报告。只要这份报告能让硬件工程师说“这个我愿意在打样前跑一下”，产品就有机会。
