# CircuitGate 公开 KiCad 样本项目池

**证据窗口**: 2026-05-11 初始收集。  
**用途**: 为 Phase 2-4 的 KiCad intake、ERC/DRC、规则引擎和报告演示提供公开样本。  
**完整性说明**: 当前为公开项目候选池，已记录项目 URL、领域、可用文件线索和规则价值。层数、BOM 完整度和制造输出需在 Phase 2 通过 clone + KiCad parser 实测确认。

## 选择标准

- 优先 KiCad-first 或明确包含 `.kicad_pro`、`.kicad_pcb`、`.kicad_sch` 的公开硬件项目。
- 覆盖机器人、IoT、电源、传感器、工业接口、开发板、相机/高速接口、开源仪器等场景。
- 优先有 BOM、Gerber、pick-and-place、装配资料或制造说明的项目。
- 适合提炼可解释、可追溯、可自动检测的规则候选。

## 样本清单

| ID | 项目 | URL | 场景 | KiCad/文件线索 | BOM/制造线索 | 层数状态 | 规则价值 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S01 | Antmicro Jetson Nano Baseboard | https://github.com/antmicro/jetson-nano-baseboard | 边缘 AI 载板 | Antmicro KiCad 硬件仓库 | 载板通常含装配/制造输出 | 待实测 | 高速接口、供电、连接器、制造输出 |
| S02 | Antmicro Jetson Orin Baseboard | https://github.com/antmicro/jetson-orin-baseboard | 边缘 AI 载板 | KiCad 载板设计 | 适合检查多接口制造资料 | 待实测 | 高速接口、M.2、相机、BOM 风险 |
| S03 | Antmicro Kria K26 Devboard | https://github.com/antmicro/kria-k26-devboard | FPGA/SoM 载板 | KiCad 项目线索 | 适合复杂板卡样本 | 待实测 | 多电源轨、DDR/高速、连接器 |
| S04 | Antmicro GMSL Deserializer | https://github.com/antmicro/gmsl-deserializer | 相机/汽车高速接口 | KiCad 硬件项目 | 高速串行/连接器项目 | 待实测 | GMSL、PoC、电源滤波、ESD |
| S05 | Antmicro GMSL Serializer | https://github.com/antmicro/gmsl-serializer | 相机/汽车高速接口 | KiCad 硬件项目 | 高速串行/连接器项目 | 待实测 | GMSL、接口配对、连接器方向 |
| S06 | Antmicro OV9281 Camera Board | https://github.com/antmicro/ov9281-camera-board | 图像传感器 | KiCad 相机板项目 | 适合传感器/连接器样本 | 待实测 | MIPI CSI、时钟、供电、ESD |
| S07 | Antmicro Flickerless LED Driver | https://github.com/antmicro/flickerless-led-driver | 电源/LED 驱动 | KiCad 电源类项目 | 适合电源与热风险 | 待实测 | 电源入口、功率器件、散热、BOM |
| S08 | Antmicro LPDDR4 Testbed | https://github.com/antmicro/lpddr4-testbed | 存储/高速测试 | KiCad 高速测试板 | 复杂 layout 样本 | 待实测 | 高速约束、阻抗、长度匹配 |
| S09 | Antmicro LPDDR5 Testbed | https://github.com/antmicro/lpddr5-testbed | 存储/高速测试 | KiCad 高速测试板 | 复杂 layout 样本 | 待实测 | DDR、制造能力、BOM 精度 |
| S10 | Antmicro SoDIMM DDR5 Tester | https://github.com/antmicro/sodimm-ddr5-tester | 存储测试 | KiCad 硬件项目 | 复杂连接器样本 | 待实测 | 连接器、DDR、电源完整性 |
| S11 | Speeduino Hardware | https://github.com/speeduino/Hardware | 汽车/ECU | 开源硬件 KiCad/PCB 文件线索 | 多板卡与 BOM 线索 | 待实测 | 汽车接口、保护、电源、连接器 |
| S12 | OpenInverter HW Mainboard Mini | https://github.com/llange/openinverter-hw-mainboard-mini | 电机/逆变器控制 | KiCad 硬件仓库 | 控制板制造资料线索 | 待实测 | 高压边界、隔离、接口保护 |
| S13 | CandleLight FD | https://github.com/linux-automation/candleLightFD | CAN/CAN-FD 接口 | 开源硬件 KiCad 项目线索 | USB/CAN 适配器样本 | 待实测 | USB、CAN 终端、ESD、连接器 |
| S14 | OpenLST Hardware | https://github.com/OpenLST/openlst-hw | 无线/航天追踪 | KiCad 硬件项目线索 | 射频/嵌入式样本 | 待实测 | RF、连接器、BOM、制造输出 |
| S15 | TinyFPGA A-Series | https://github.com/tinyfpga/TinyFPGA-A-Series | FPGA 开发板 | KiCad board 文件线索 | 开源制造资料线索 | 待实测 | USB、电源、FPGA IO、BOM |
| S16 | ESP Rust Board | https://github.com/esp-rs/esp-rust-board | ESP32 开发板 | KiCad 硬件文件线索 | 开发板 BOM/制造线索 | 待实测 | USB-UART、电源、boot strap |
| S17 | OLIMEX ESP32-DevKit-LiPo | https://github.com/OLIMEX/ESP32-DevKit-LiPo | IoT/电池供电 | 开源硬件 KiCad/EDA 文件线索 | LiPo/充电/制造资料线索 | 待实测 | 电池充电、电源保护、USB |
| S18 | Inkplate 10 Hardware | https://github.com/SolderedElectronics/Inkplate-10-hardware-design | 显示/低功耗 IoT | Soldered 硬件设计仓库 | BOM/制造资料线索 | 待实测 | 电源、显示接口、连接器、BOM |
| S19 | Soldered Li-ion Charger | https://github.com/SolderedElectronics/Li-ion-charger-hardware-design | 电源/充电模块 | 硬件设计仓库 | BOM/制造资料线索 | 待实测 | 充电安全、热、保护、电源入口 |
| S20 | USB-C Female Connector Breakout | https://github.com/SolderedElectronics/USB-C-female-connector-breakout-hardware-design | USB-C/接口 | 硬件设计仓库 | 简单制造样本 | 待实测 | USB-C CC、电气方向、ESD、BOM |
| S21 | AnyLeaf ELRS Hardware | https://github.com/AnyLeaf/elrs-hardware | 无线/RC | KiCad 硬件项目线索 | 射频/小板样本 | 待实测 | RF、供电、连接器、制造尺寸 |
| S22 | Stormduino | https://github.com/Chromico/stormduino | Arduino 兼容板 | KiCad 开源硬件线索 | 开发板制造样本 | 待实测 | MCU、电源、接口、silkscreen |
| S23 | OpenPSU | https://github.com/mrkindustries/openPSU | 电源仪器 | KiCad/硬件项目线索 | 电源板样本 | 待实测 | 电源安全、散热、电流路径 |
| S24 | TeleSTERN | https://github.com/shorlee/TeleSTERN | 通信/嵌入式 | KiCad 硬件项目线索 | 嵌入式通信样本 | 待实测 | 通信接口、电源、制造输出 |

## 场景覆盖

- 边缘 AI/SoM 载板: S01, S02, S03
- 相机/高速串行: S04, S05, S06
- 存储/高速约束: S08, S09, S10
- 电源/充电/功率: S07, S19, S23
- 汽车/工业接口: S11, S12, S13
- 无线/RF: S14, S21, S24
- IoT/开发板: S15, S16, S17, S22
- 显示/低功耗: S18
- USB-C/连接器: S20

## Phase 2 实测计划

1. clone 每个仓库，扫描 `.kicad_pro`、`.kicad_pcb`、`.kicad_sch`、Gerber、BOM、position 文件。
2. 使用 KiCad CLI 或轻量 parser 提取板层数、网络数量、元件数量和缺失工件。
3. 按可运行性分级：
   - A: 可直接运行 ERC/DRC，有 BOM 和制造输出。
   - B: 可解析 KiCad 项目，但 BOM 或制造输出不完整。
   - C: 只适合作为规则讨论样本，不能作为自动化回归样本。
4. 把最高价值 8-10 个项目复制为受控测试 fixtures 或记录 commit hash，避免上游变化破坏回归。

## 证据表

| 来源 | 日期 | 等级 | 用途 |
| --- | --- | --- | --- |
| GitHub 公开硬件仓库 | 2026-05-11 | B | 验证 KiCad 公开样本可获得性和场景覆盖 |
| 项目 README / 文件树线索 | 2026-05-11 | B/C | 初步判断 BOM、制造输出和接口类型 |
| 后续本地 clone + KiCad parser | 待执行 | A/B | 确认层数、文件完整度和规则可运行性 |
