# CircuitGate 规则候选池

**状态日期**: 2026-05-11  
**规则数量**: 55  
**来源边界**: 当前规则候选来自产品假设、公开 KiCad 样本池和常见工程审查经验。真实用户访谈尚未完成，因此商业优先级是初始排序，不是已验证结论。每条 top 20 规则在进入 Phase 3 前必须补充至少一个真实访谈痛点、公开项目证据或工程规则证据。

## 排序方法

- **商业价值**: 是否直接降低返板、装配失败、BOM 风险或审查成本。
- **可检测性**: 是否能从 KiCad、Gerber、BOM、position、制造 profile 或规则配置中检测。
- **误报风险**: 是否容易误判设计意图，需要 waiver 或人工确认。
- **实现难度**: S 代表首批容易做，M 代表需要解析或 profile，L 代表需要更深设计语义。

## Top 20 首批优先级

| Top | ID | 类别 | 风险描述 | 主要证据 | 可检测输入 | 检测方法 | 误报风险 | 难度 | 价值 |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | MFG-001 | manufacturing | Gerber、drill、board outline 或 edge cuts 缺失导致无法制造 | S01-S24 制造输出需求 | Gerber zip, KiCad project | 文件清单 + 必需层 profile | 低 | S | 高 |
| 2 | BOM-001 | bom | BOM 缺失 manufacturer 或 MPN，采购和替代料不可追溯 | S11, S17, S19 | BOM CSV | 字段存在性与空值检查 | 低 | S | 高 |
| 3 | PWR-001 | power | 稳压器输入/输出电容缺失或离得过远，导致上电不稳定 | S07, S17, S19 | schematic, PCB | regulator symbol + cap proximity | 中 | M | 高 |
| 4 | IF-001 | interface | USB-C receptacle 缺失 CC 下拉/上拉或方向相关连接错误 | S20, S16, S17 | schematic | USB-C connector pin rule | 中 | M | 高 |
| 5 | PCB-001 | pcb | 板框、孔、铜皮或元件违反制造商最小间距 | S01-S24 | PCB, manufacturing profile | 几何 clearance profile | 低 | M | 高 |
| 6 | IF-002 | interface | CAN/RS485 缺少终端、偏置或 ESD 保护，现场通信不稳定 | S11, S12, S13 | schematic | transceiver + connector topology | 中 | M | 高 |
| 7 | BOM-002 | bom | DNP、optional、fitted 状态未结构化，装配清单容易出错 | S18-S20 | BOM, schematic fields | DNP 字段一致性检查 | 中 | S | 高 |
| 8 | MFG-002 | manufacturing | pick-and-place 坐标文件缺失或与 BOM reference 不匹配 | S18-S20 | BOM, CPL | refdes join + side check | 低 | S | 高 |
| 9 | PWR-002 | power | 电源入口缺少保险丝、反接保护、TVS 或浪涌保护候选 | S11, S12, S23 | schematic | power input pattern check | 中 | M | 高 |
| 10 | PCB-002 | pcb | 高电流网络线宽/铜厚不满足 profile，存在发热风险 | S07, S19, S23 | PCB, net class, profile | net class + width threshold | 中 | M | 高 |
| 11 | IF-003 | interface | I2C 总线缺失 pull-up 或多个电压域 pull-up 冲突 | S16-S18 | schematic | bus label + resistor topology | 中 | M | 中高 |
| 12 | BOM-003 | bom | 封装字段与 footprint 或 MPN 封装不一致，导致采购/装配错误 | S15-S20 | BOM, footprint | package normalization | 中 | M | 高 |
| 13 | MFG-003 | manufacturing | 钻孔文件、NPTH/PTH 分类或 slot 输出缺失 | S01-S24 | drill files, PCB | drill set completeness | 低 | S | 高 |
| 14 | PCB-003 | pcb | 测试点覆盖不足，Bring-up 和量产排查成本上升 | S15-S23 | schematic, PCB | power/interface nets + TP rule | 中 | M | 中高 |
| 15 | IF-004 | interface | SWD/JTAG/boot strap 缺失或不可访问，导致调试和量产烧录困难 | S15-S17, S22 | schematic, PCB | MCU debug pins + connector/TP | 中 | M | 高 |
| 16 | PWR-003 | power | Li-ion 充电电路缺少热、保护或电池连接风险检查 | S17, S19 | schematic, BOM | charger IC pattern + protection | 中 | L | 高 |
| 17 | MFG-004 | manufacturing | solder paste、assembly side 或 centroid 与装配需求不一致 | S18-S20 | Gerber, CPL, BOM | paste layer + side/refdes check | 低 | M | 高 |
| 18 | PCB-004 | pcb | 丝印压焊盘、极性标记缺失或连接器方向不清 | S18-S22 | PCB | silkscreen/pad overlap + marker | 中 | M | 中 |
| 19 | IF-005 | interface | 高速差分对缺少长度/阻抗/间距约束，报告不可复核 | S04-S10 | PCB, constraints | differential pair net class check | 中 | L | 高 |
| 20 | BOM-004 | bom | 单一来源器件无替代料或生命周期字段，早期采购风险高 | S11-S23 | BOM | alt/lifecycle/vendor fields | 中 | S | 中高 |

## 全量候选

| ID | 类别 | 风险描述 | 可检测输入 | 检测方法 | 证据/样本 | 误报风险 | 难度 | 商业价值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PWR-001 | power | 稳压器输入/输出电容缺失或离得过远 | schematic, PCB | regulator symbol + cap proximity | S07, S17, S19 | 中 | M | 高 |
| PWR-002 | power | 电源入口缺少保险丝、反接保护、TVS 或浪涌保护 | schematic | power input topology | S11, S12, S23 | 中 | M | 高 |
| PWR-003 | power | Li-ion 充电电路缺少热、保护或电池连接风险检查 | schematic, BOM | charger IC + thermistor/protection pattern | S17, S19 | 中 | L | 高 |
| PWR-004 | power | 多电源轨没有清晰 enable、PGOOD 或时序约束 | schematic | regulator dependency graph | S01-S03 | 高 | L | 中高 |
| PWR-005 | power | 电源网络命名混乱，输入/输出/负载域难以追踪 | schematic | net label normalization | S01-S24 | 中 | S | 中 |
| PWR-006 | power | 关键负载附近缺少 bulk/decoupling 电容候选 | schematic, PCB | IC power pins + capacitor distance | S03, S06, S15 | 中 | M | 高 |
| PWR-007 | power | 高电流路径未使用足够线宽、过孔或铜皮 | PCB, profile | net class + current annotation | S07, S19, S23 | 中 | M | 高 |
| PWR-008 | power | PoC/PoE/外部供电滤波与保护缺失 | schematic | connector + power injection pattern | S04, S05 | 中 | L | 中高 |
| PWR-009 | power | 电池项目缺少欠压、过流或充电状态指示 | schematic | battery connector + charger/protection | S17, S19 | 中 | L | 中高 |
| PWR-010 | power | 电源指示 LED 或测试点缺失，Bring-up 诊断困难 | schematic, PCB | rail nets + LED/TP check | S15-S23 | 中 | S | 中 |
| PWR-011 | power | LDO 压差和热耗散未被标注，存在过热风险 | BOM, schematic | voltage/current annotation | S07, S17, S19 | 高 | L | 中 |
| IF-001 | interface | USB-C receptacle 缺少 CC 电阻或连接错误 | schematic | connector pin rule | S20, S16, S17 | 中 | M | 高 |
| IF-002 | interface | CAN/RS485 缺少终端、偏置或 ESD 保护 | schematic | transceiver + connector topology | S11, S12, S13 | 中 | M | 高 |
| IF-003 | interface | I2C pull-up 缺失或电压域冲突 | schematic | bus topology + resistor rail | S16-S18 | 中 | M | 中高 |
| IF-004 | interface | SWD/JTAG/boot strap 不可访问 | schematic, PCB | MCU pins + connector/TP | S15-S17, S22 | 中 | M | 高 |
| IF-005 | interface | 高速差分对缺少 net class、长度或阻抗约束 | PCB | differential pair rule check | S04-S10 | 中 | L | 高 |
| IF-006 | interface | UART/调试串口电平不匹配或未标注 | schematic | connector + MCU IO voltage | S15-S17 | 中 | M | 中 |
| IF-007 | interface | SPI 设备缺少独立 CS 或上拉/下拉状态不清 | schematic | SPI bus topology | S15-S18 | 中 | M | 中 |
| IF-008 | interface | MIPI CSI lane、clock 或连接器方向风险 | schematic, PCB | connector lane mapping | S06 | 高 | L | 中高 |
| IF-009 | interface | GMSL serializer/deserializer 供电、同轴或 PoC 连接未满足 pattern | schematic | GMSL IC + connector pattern | S04, S05 | 高 | L | 中高 |
| IF-010 | interface | PCIe/M.2/高速接口缺少 AC coupling 或 reference clock 检查 | schematic | interface-specific rule | S01-S03 | 高 | L | 中高 |
| IF-011 | interface | 外部连接器没有 ESD/TVS 或输入保护候选 | schematic | connector-to-IC path | S11-S24 | 中 | M | 高 |
| IF-012 | interface | 接口丝印、pin 1、极性或方向标记不清 | PCB | connector footprint + silk check | S18-S22 | 中 | M | 中 |
| PCB-001 | pcb | 板框、孔、铜皮或元件违反制造商最小间距 | PCB, profile | geometry clearance | S01-S24 | 低 | M | 高 |
| PCB-002 | pcb | 高电流网络线宽/铜厚不满足 profile | PCB, profile | net width threshold | S07, S19, S23 | 中 | M | 高 |
| PCB-003 | pcb | 测试点覆盖不足 | schematic, PCB | important nets + TP count | S15-S23 | 中 | M | 中高 |
| PCB-004 | pcb | 丝印压焊盘或极性标记缺失 | PCB | silk/pad overlap + marker | S18-S22 | 中 | M | 中 |
| PCB-005 | pcb | 未连接网络、孤岛铜皮或 dangling trace 未处理 | PCB, ERC/DRC | KiCad DRC + custom net check | S01-S24 | 低 | S | 高 |
| PCB-006 | pcb | mounting hole 附近铜皮、走线或器件间距不足 | PCB | footprint class + keepout | S01-S24 | 中 | M | 中 |
| PCB-007 | pcb | 过孔尺寸、annular ring 或 drill profile 不满足制造商要求 | PCB, profile | via/drill threshold | S01-S24 | 低 | M | 高 |
| PCB-008 | pcb | 差分对间距、长度匹配或层切换未记录 | PCB | net class + route stats | S04-S10 | 中 | L | 高 |
| PCB-009 | pcb | 大面积铜皮缺少 stitching via 或回流路径风险 | PCB | zone + via density heuristic | S01-S10 | 高 | L | 中 |
| PCB-010 | pcb | 天线/RF 区域缺少 keepout 或地处理约束 | PCB | RF connector/module pattern | S14, S21, S24 | 高 | L | 中高 |
| PCB-011 | pcb | footprint courtyard/3D/机械边界与连接器外形冲突 | PCB | courtyard + board edge | S01-S24 | 中 | M | 中 |
| PCB-012 | pcb | fiducial、tooling hole 或 panelization 需求缺失 | PCB, profile | assembly profile check | S18-S20 | 中 | M | 中 |
| BOM-001 | bom | BOM 缺失 manufacturer 或 MPN | BOM | required columns + empty values | S11, S17, S19 | 低 | S | 高 |
| BOM-002 | bom | DNP/optional/fitted 状态未结构化 | BOM, schematic | DNP field consistency | S18-S20 | 中 | S | 高 |
| BOM-003 | bom | 封装字段与 footprint 或 MPN 封装不一致 | BOM, schematic | package normalization | S15-S20 | 中 | M | 高 |
| BOM-004 | bom | 单一来源器件无替代料或生命周期字段 | BOM | alt/lifecycle/vendor fields | S11-S23 | 中 | S | 中高 |
| BOM-005 | bom | 数量与 refdes 展开不一致 | BOM | quantity vs refdes count | S01-S24 | 低 | S | 高 |
| BOM-006 | bom | 被动件值、容差、耐压或封装字段缺失 | BOM | passive field completeness | S01-S24 | 低 | S | 中高 |
| BOM-007 | bom | 连接器、开关、机械件缺少装配说明或方向 | BOM, PCB | mechanical part flag | S01-S24 | 中 | M | 中 |
| BOM-008 | bom | JLCPCB/LCSC basic/extended 或可贴装性未记录 | BOM | supplier-specific fields | S18-S20 | 中 | S | 中 |
| BOM-009 | bom | BOM 中出现 EOL/NRND/obsolete 标记或未知生命周期 | BOM, optional API | lifecycle field check | S11-S23 | 中 | M | 中高 |
| BOM-010 | bom | 多个 BOM 版本或 schematic/PCB revision 不一致 | BOM, project files | revision and checksum check | S01-S24 | 中 | M | 高 |
| MFG-001 | manufacturing | Gerber、drill、board outline 或 edge cuts 缺失 | Gerber, KiCad | required artifact profile | S01-S24 | 低 | S | 高 |
| MFG-002 | manufacturing | pick-and-place 坐标与 BOM refdes 不匹配 | BOM, CPL | refdes join + side check | S18-S20 | 低 | S | 高 |
| MFG-003 | manufacturing | 钻孔文件、NPTH/PTH 分类或 slot 输出缺失 | drill, PCB | drill set completeness | S01-S24 | 低 | S | 高 |
| MFG-004 | manufacturing | solder paste、assembly side 或 centroid 与装配需求不一致 | Gerber, CPL, BOM | paste layer + side/refdes check | S18-S20 | 低 | M | 高 |
| MFG-005 | manufacturing | 制造 profile 未指定，规则阈值不可解释 | config, CLI args | profile required check | S01-S24 | 低 | S | 高 |
| MFG-006 | manufacturing | 板厚、铜厚、阻焊颜色、表面处理等制造参数缺失 | jobset, config | fabrication field check | S01-S24 | 中 | S | 中 |
| MFG-007 | manufacturing | assembly drawing、polarity drawing 或 placement preview 缺失 | files | assembly package check | S18-S20 | 中 | S | 中 |
| MFG-008 | manufacturing | Gerber 文件命名无法映射到制造商层定义 | Gerber | filename/layer classifier | S01-S24 | 中 | M | 中 |
| MFG-009 | manufacturing | 输出文件没有 commit hash、日期或 design revision，追溯困难 | files, git | revision metadata check | S01-S24 | 低 | S | 中 |
| MFG-010 | manufacturing | 原理图 PDF、BOM、Gerber 来自不同版本 | files, git | checksum/revision compare | S01-S24 | 中 | M | 高 |

## 规则证据链要求

进入 Phase 3 前，每条规则至少补齐以下之一：

- 一条真实访谈痛点记录，格式为 `Uxx`。
- 一个公开 KiCad 样本项目证据，格式为 `Sxx + 文件路径/commit hash`。
- 一个可引用的工程规范、制造商 rule、datasheet 或官方文档。

## 实验与评测

- baseline: KiCad ERC/DRC 原始输出。
- 样本: `research/sample-projects.md` 中 A/B 级项目。
- 指标:
  - 规则命中是否有文件、对象、坐标或 refdes 证据。
  - 误报是否可解释并可 waiver。
  - 每条 top 20 规则至少在 3 个样本上跑通，或明确为什么只适用于特定类型。
- 终止条件:
  - top 20 规则中任意一条无法提供可检测输入，应降级为人工 checklist，不进入自动规则首批。
