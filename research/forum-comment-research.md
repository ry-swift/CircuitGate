# CircuitGate 公开论坛与评论区代理调研

**调研日期**: 2026-05-11  
**证据窗口**: 2017-12 至 2026-05  
**用途**: 在真实用户访谈尚未完成前，用公开论坛、Reddit 评论、KiCad 论坛和制造商文档补足 Phase 1 的问题发现线索。  
**边界**: 本文件不是 30 位真实访谈，不能把 DISC-01 标记为完成。它只能作为访谈前的 voice-of-customer proxy，用于修正访谈问题、样本优先级和规则候选排序。

## 问题定义

- **研究对象**: KiCad-first 小团队、开源硬件作者、PCB 初学者、JLCPCB/PCBWay 装配用户在下单前遇到的审查、BOM、CPL、Gerber、Drill 和 DFM 问题。
- **层级**: 原理图与 PCB 文件、制造输出、BOM/CPL 装配数据、规则检查与人工 review 工作流。
- **目标指标**:
  - 发现可转成 CircuitGate 规则的高频痛点。
  - 明确哪些场景需要本地 CLI/CI 审查，哪些必须人工确认。
  - 找到 3 个更可能付费或试用的细分场景。
- **主要限制**:
  - 公开帖子偏向出问题后求助，不能代表总体发生率。
  - 评论区证据多数是 C 级，只能支持假设，不支持商业结论。
  - 付费意愿仍需真实访谈或付费试点验证。

## 证据表

| ID | 来源 | 日期/窗口 | 类型 | 等级 | 相关性 |
| --- | --- | --- | --- | --- | --- |
| SRC-01 | KiCad 官方 PCB Editor 文档 | KiCad 9.0 文档 | 官方文档 | A | 定义 Gerber、Drill、BOM、placement files 与可检查属性。 |
| SRC-02 | JLCPCB KiCad Gerber/Drill 文件说明 | 2025-04-24 | 官方制造商文档 | A | 明确制造前应设定厂商规则、运行 DRC、核对 outline/drill/slot/silkscreen。 |
| SRC-03 | JLCPCB BOM/CPL 文件准备建议 | 2026-01-19 | 官方制造商文档 | A | 明确 BOM/CPL refdes、单位、列名、重复项和规格一致性风险。 |
| SRC-04 | PCBWay KiCad 9 输出说明 | 2025-11-09 | 官方制造商文档 | A | 明确 Gerber、Drill、BOM、pick-and-place 的制造交付流程。 |
| SRC-05 | PCBWay Fabrication Toolkit for KiCad | 2023-10-11 | 官方制造商博客 | B | 说明一键导出生产文件和装配时 MPN 信息的重要性。 |
| SRC-06 | KiCad Forum: JLCPCB placement not lining up | 2021-06 | 论坛求助 | C | 反复出现 CPL/placement 与 Gerber 对齐、缩放、origin 问题。 |
| SRC-07 | KiCad Forum: no standard for pick-and-place | 2021-10 | 论坛讨论 | C | 反映 rotation/pin 1/厂商实现差异导致装配前人工检查。 |
| SRC-08 | Reddit r/KiCad: CPL coordinates off | 2023-05 | 评论区求助 | C | 反映 JLCPCB/KiCad footprint orientation、非 ASCII、手动修正痛点。 |
| SRC-09 | Reddit r/PCB: BOM/CPL beginner | 2025-03 | 评论区求助 | C | 反映首次 PCBA 用户不知道 BOM/CPL 格式是否正确。 |
| SRC-10 | Reddit r/PCB: JLCPCB parts selection hell | 2025-08 | 评论区求助 | C | 反映 BOM 上传后元器件匹配、THT/SMD、LCSC/JLC 料号选择痛点。 |
| SRC-11 | Reddit r/PCB: assembly without CPL | 2025-11 | 评论区求助 | C | 反映开源项目只有 Gerber/BOM、缺 CPL 时无法顺利装配。 |
| SRC-12 | Reddit r/PCB: evaluate before printing | 2026-02 | 评论区讨论 | C | 反映 PCB 不像软件可直接运行，用户需要审查基线和 peer review。 |
| SRC-13 | Reddit r/KiCad: BOM/MPN workflow experience | 2026-05 | 评论区经验 | C | 反映先补 manufacturer/MPN、查库存和生命周期能避免后期坑。 |
| SRC-14 | Reddit r/PrintedCircuitBoard: common PCB mistakes | 2020-11 | 评论区经验 | C | 汇总 footprint、pin、orientation、drill、clearance、ESD、polarity 等常见错误。 |
| SRC-15 | KiCad Forum: invalid drill file in Seeed viewer | 2017-12 | 论坛求助 | C | 反映 drill zeros format/viewer 兼容性导致孔位异常。 |
| SRC-16 | KiCad Forum: drill holes not showing in JLCPCB | 2023-10 | 论坛求助 | C | 反映 NPTH/PTH、drill 文件生成和上传文件完整性问题。 |
| SRC-17 | KiCad Forum: Gerber files not recognized | 2023-03 | 论坛求助 | C | 反映用户把 KiCad board file、drill map、非 ASCII 文件名等误当制造输出。 |
| SRC-18 | KiCad Forum: DRC error exporting Gerber | 2024-11 | 论坛求助 | C | 反映初学者混淆 DRC violation 与 Gerber 输出错误，且不知能否忽略。 |
| SRC-19 | KiCad Forum: missing connection/island | 2022-11 | 论坛求助 | C | 反映 zone island、thermal relief、net highlight 等 DRC 解释痛点。 |
| SRC-20 | EEVblog: PCB design tips | 2015-2026 可检索 | 论坛经验 | C | 反映 mounting holes、fab rules、Gerber/drill viewer、checklist 的持续需求。 |
| SRC-21 | EEVblog: fail at PCB manufacture | 2020-08 | 论坛/视频讨论 | C | 反映单位、trace/space、Gerber resolution 等制造拒单原因。 |

## 公开痛点样本

| VOC | 来源 | 用户处境 | 公开痛点 | 可转规则/产品信号 |
| --- | --- | --- | --- | --- |
| VOC-01 | SRC-06 | KiCad 用户准备 JLCPCB 装配 | placement 文件与 Gerber 预览不对齐，用户花数小时尝试 origin、Y 方向和缩放。 | `MFG-002`: BOM/CPL 与 Gerber 坐标一致性；报告中解释 drill/place origin。 |
| VOC-02 | SRC-07 | JLCPCB 装配用户 | 元件 rotation/pin 1 需要人工修正，用户不确定是否有通用标准。 | `MFG-004`, `IF-012`: pin 1、极性、assembly drawing 和 CPL rotation 风险。 |
| VOC-03 | SRC-08 | KiCad 到 JLCPCB 用户 | 自动 CPL 文件不能被读取或部分坐标/角度不对，需要手动输入或网页修正。 | `MFG-002`: CPL 格式、单位、ASCII、rotation 预检。 |
| VOC-04 | SRC-09 | 第一次做 PCBA 的用户 | 不知道 BOM/CPL 样例列名、格式和字段是否能被 JLCPCB 正确解析。 | `BOM-001`, `MFG-002`: BOM/CPL schema 校验和制造商 profile。 |
| VOC-05 | SRC-10 | JLCPCB BOM 上传后的用户 | 最简单的阻容和 JST 连接器也难匹配到合适库存料号。 | `BOM-004`, `BOM-008`: LCSC/JLC part 字段、basic/extended、替代料。 |
| VOC-06 | SRC-11 | 复刻开源硬件的用户 | 开源项目只有 Gerber 和 BOM，没有 CPL，装配几乎无法自动化。 | `MFG-002`, `MFG-007`: 缺失 CPL/assembly drawing 作为阻塞项。 |
| VOC-07 | SRC-12 | 软件背景转 PCB 用户 | 不知道如何在下单前验证“有效”，寻找仿真或标准评估流程。 | 产品信号: CircuitGate 报告应给出 pre-order review baseline，而不是只输出错误表。 |
| VOC-08 | SRC-12 | 首版板卡设计者 | 评论中反馈错 footprint、标签位移、stitching via 层错误等首板常见问题。 | `BOM-003`, `PCB-005`, `MFG-001`: footprint、label/metadata、via/layer 检查。 |
| VOC-09 | SRC-12 | 经验用户回复初学者 | 即使有仿真，很多问题仍靠人工 review 发现，首板应留调试/返工余地。 | 产品信号: 报告必须区分“自动阻塞项”和“人工复核建议”。 |
| VOC-10 | SRC-13 | KiCad 经验用户 | 在进入 PCB 前先补 manufacturer 和 MPN，并查库存、生命周期、替代料。 | `BOM-001`, `BOM-004`, `BOM-009`: MPN/生命周期/替代料字段。 |
| VOC-11 | SRC-14 | PCB 设计者汇总经验 | footprint 与实际订购器件不匹配、旋转/镜像/单位错误经常导致装配失败。 | `BOM-003`, `IF-012`: datasheet land pattern、unit、orientation check。 |
| VOC-12 | SRC-14 | PCB 设计者汇总经验 | TX/RX 接反、连接器极性、DB9/RS232 等接口 pinout 容易错。 | `IF-006`, `IF-012`: connector pinout 和接口方向规则。 |
| VOC-13 | SRC-14 | PCB 设计者汇总经验 | drill hole 尺寸、mounting hole keepout、铜皮 clearance 常见出错。 | `PCB-006`, `PCB-007`, `PCB-001`: hole/keepout/fab clearance。 |
| VOC-14 | SRC-14 | PCB 设计者汇总经验 | ESD 器件离接口太远、差分对缺参考地、极性丝印缺失。 | `IF-011`, `IF-005`, `PCB-004`: ESD proximity、return path、silkscreen。 |
| VOC-15 | SRC-15 | SeeedStudio 打样用户 | KiCad drill 文件在不同 viewer 中孔位异常，用户手动改文件才继续。 | `MFG-003`: drill format、zeros format、viewer cross-check。 |
| VOC-16 | SRC-16 | JLCPCB 打样用户 | 3D 视图有孔，但上传后孔没出现，最终指向 JLC 要求和 drill 文件设置。 | `MFG-003`: PTH/NPTH drill completeness、slot/cutout 检查。 |
| VOC-17 | SRC-17 | KiCad 偶尔用户 | 厂商提示 zip 中没有 Gerber 或没有 drill，用户实际上传了错误文件或 drill map。 | `MFG-001`, `MFG-003`: 输出包内容检查和文件类型分类。 |
| VOC-18 | SRC-17 | KiCad 用户 | 非 ASCII 文件名、空格、特殊字符可能引发厂商识别问题。 | `MFG-009`: artifact naming、revision、ASCII-safe package。 |
| VOC-19 | SRC-18 | 首次导出 Gerber 用户 | 把 DRC violation 当作 Gerber 导出问题，不知道该修还是忽略。 | 产品信号: 报告应解释 DRC 结果影响和下一步动作。 |
| VOC-20 | SRC-18 | 初学者 PCB 用户 | thermal relief incomplete、孤岛连接和地平面连续性难理解。 | `PCB-005`, `PCB-009`: zone island、thermal relief、ground continuity。 |
| VOC-21 | SRC-19 | KiCad 用户 | DRC 报 missing connection，但视觉上像已经连接；根因是另一区域孤岛。 | `PCB-005`: net highlight、zone island、hidden unconnected copper。 |
| VOC-22 | SRC-19 | 论坛回复 | zone/trace/via 参数应与板厂能力相关，不能只用默认值。 | `PCB-001`, `MFG-005`: manufacturing profile 与 board setup 对齐。 |
| VOC-23 | SRC-20 | EEVblog 经验讨论 | 忘记 mounting holes、没有按 fab rules 设置 DRC、下单前没看 Gerber/drill viewer。 | `PCB-006`, `MFG-001`, `MFG-003`: checklist 和 viewer gate。 |
| VOC-24 | SRC-21 | EEVblog 制造失败讨论 | 单位转换、trace/space 规格和 Gerber resolution 可导致制造拒单。 | `PCB-001`, `MFG-008`: units、clearance、Gerber format lint。 |
| VOC-25 | SRC-02 | JLCPCB 官方流程 | 厂商明确建议生成 Gerber 前按能力设置规则并再次运行 DRC。 | `MFG-005`, `PCB-001`: profile required + DRC-before-export。 |
| VOC-26 | SRC-02 | JLCPCB 官方流程 | 文件验证要看 outline、cutout/slot、drill 对齐、via cover、silkscreen。 | `MFG-001`, `MFG-003`, `PCB-004`: pre-upload viewer checklist。 |
| VOC-27 | SRC-03 | JLCPCB 官方 PCBA | BOM 和 CPL refdes 必须一致，大小写不一致也会导致识别失败。 | `MFG-002`, `BOM-005`: refdes join、case-sensitive lint。 |
| VOC-28 | SRC-03 | JLCPCB 官方 PCBA | BOM 信息必须匹配实际器件规格，坐标单位和最小间距需要一致。 | `BOM-003`, `MFG-002`, `PCB-012`: part spec + CPL unit/spacing check。 |
| VOC-29 | SRC-01 | KiCad 官方文档 | placement file 包含元件中心位置和方向，DNP/exclude 属性会影响输出。 | `BOM-002`, `MFG-002`: DNP/exclude state consistency。 |
| VOC-30 | SRC-05 | PCBWay 官方插件说明 | 装配订单需要设计文件中有 MPN 信息以提高报价和采购准确性。 | `BOM-001`, `BOM-004`: MPN required、sourcing confidence。 |

## 核心判断

证据支持：

- **制造输出完整性是最强早期切口。** Gerber、drill、outline、slot、BOM、CPL、assembly drawing 的缺失或不一致，在官方文档和论坛求助中都反复出现。
- **BOM/CPL 是 PCBA 用户的高摩擦区。** 初学者不知道字段格式，进阶用户也会遇到 refdes、rotation、MPN、LCSC/JLC 料号、DNP 和替代料问题。
- **KiCad-first 合理，但必须尊重厂商 profile。** 官方文档和论坛都说明默认 KiCad 输出不等于厂商可接受输出，必须按 JLCPCB/PCBWay 等 profile 设置 DRC 和导出选项。
- **AI 不是首要诉求。** 公开痛点集中在可解释文件检查、规则解释、制造商兼容和人工 review 辅助；不应把 Phase 1 访谈引导成“你需要 AI 吗”。

基于这些证据推断：

- **最可能付费/试用的 3 个细分场景**:
  1. KiCad + JLCPCB/PCBWay 的小团队 PCBA 用户，下单前愿意用一次性审查避免 BOM/CPL/placement 返工。
  2. 机器人、IoT、工业控制和开源硬件团队，项目里有 USB/CAN/RS485、电源入口、高电流或外部连接器，愿意要可复核 pre-order report。
  3. 开源硬件维护者和复刻者，需要把公开项目补齐 BOM/CPL/MPN/制造输出，降低他人复刻失败率。
- **最小可承诺产品能力**不是“发现所有硬件问题”，而是“在下单前识别会阻塞制造/装配或导致明显返工的文件、BOM、CPL、DFM 和低阶电气风险”。
- **第一版付费包装**更适合 `CLI report + 人工复核服务`，而不是直接 Web SaaS；公开证据显示用户在下单前会临时求助，服务型交付更贴近当前行为。

## 规则与约束

优先转成自动规则：

| 优先级 | 规则方向 | 证据 | 检查输入 | 输出要求 |
| ---: | --- | --- | --- | --- |
| 1 | 制造输出包完整性 | VOC-16, VOC-17, VOC-26 | Gerber zip, drill, board file | 明确缺什么文件、对应制造影响、如何重新导出。 |
| 2 | BOM/CPL refdes join | VOC-03, VOC-04, VOC-27 | BOM CSV, CPL CSV | 标出 missing/extra/refdes case mismatch。 |
| 3 | CPL 坐标、单位、origin、rotation 风险 | VOC-01, VOC-02, VOC-03, VOC-28 | CPL, KiCad PCB | 标出异常坐标、重复坐标、非 ASCII、单位疑点。 |
| 4 | MPN/manufacturer/part sourcing 字段 | VOC-05, VOC-10, VOC-30 | BOM | 缺字段、空值、疑似 generic value、无替代料。 |
| 5 | drill/PTH/NPTH/slot 完整性 | VOC-15, VOC-16, VOC-17 | drill, PCB, Gerber | 区分 drill file 和 drill map，检查孔位与 outline 对齐。 |
| 6 | 厂商 profile 与 DRC 设置 | VOC-22, VOC-25 | KiCad board setup, profile | 检查 profile 是否存在、最小线宽/间距/孔径是否可解释。 |
| 7 | zone island / thermal relief / ground continuity | VOC-20, VOC-21 | KiCad DRC, PCB | 把 KiCad DRC 映射成工程影响和复核建议。 |
| 8 | footprint/package/pin 1/极性 | VOC-11, VOC-12, VOC-14 | schematic, PCB, BOM | 标出需要 datasheet 或人工确认的高风险器件。 |
| 9 | silkscreen/assembly polarity | VOC-02, VOC-14, VOC-26 | PCB, Gerber | 检查丝印压焊盘、极性标记、assembly side。 |
| 10 | review-before-order checklist | VOC-07, VOC-09, VOC-23 | report config | 把阻塞项、人工复核项、可忽略 warning 分层输出。 |

## 实验与评测

- **Baseline**: KiCad ERC/DRC 原始输出 + JLCPCB/PCBWay 官方导出 checklist。
- **样本**:
  - `research/sample-projects.md` 中 24 个公开 KiCad 项目。
  - 本文件 VOC-01 至 VOC-30 对应的痛点类型。
- **指标**:
  - 每条规则是否能给出文件、refdes、net、坐标、层名或字段证据。
  - 对官方 checklist 项目，召回率是否覆盖 outline、drill、BOM、CPL、refdes、MPN 等关键项。
  - 对论坛痛点，报告是否能解释“为什么危险”和“下一步怎么修”，而不只是贴原始 DRC。
- **终止条件**:
  - 规则无法绑定具体输入文件或对象时，降级为人工 checklist。
  - 无法从公开样本复现的商业价值排序，不进入“已验证”结论。

## 产品化接口

- `DesignManifest`: 记录 KiCad project、Gerber、drill、BOM、CPL、assembly drawing、profile、文件名安全性。
- `ManufacturerProfile`: `jlcpcb`, `pcbway`, `seeed`, `generic`，包含导出选项、文件命名、最小线宽/间距/孔径、BOM/CPL schema。
- `Finding`: 必须包含 `rule_id`, `severity`, `evidence`, `impact`, `suggested_action`, `waiver_reason_required`。
- `Report sections`:
  - Manufacturing blockers
  - BOM/CPL assembly risks
  - KiCad ERC/DRC interpretation
  - Manual review checklist
  - Evidence appendix
- `Service mode`: 支持 `automated`、`needs-human-review`、`blocked-by-missing-input` 三种状态。

## 下一步

1. 用本文件更新 `rules/rule-candidates.md` 的证据链，把 top 20 至少绑定一个 `VOC-xx` 或 `Sxx`。
2. Phase 2 clone 样本项目时，优先验证 `MFG-001`, `MFG-002`, `MFG-003`, `BOM-001`, `BOM-005`。
3. 真实访谈仍需完成，重点验证：
   - 用户是否愿意为一次性 pre-order review 付费。
   - 哪些 warning 会被认为是噪音。
   - 私有项目能否接受本地 CLI 或 GitHub Action。
   - 报告中什么证据足以让硬件 reviewer 采取行动。

## 来源链接

- KiCad PCB Editor documentation: https://docs.kicad.org/9.0/en/pcbnew/pcbnew.html
- JLCPCB KiCad Gerber/Drill: https://jlcpcb.com/help/article/How-to-generate-Gerber-and-Drill-files-in-KiCad-8
- JLCPCB BOM/CPL preparation: https://jlcpcb.com/help/article/advice-for-bom-and-cpl-files-preparation
- PCBWay KiCad 9 export: https://www.pcbway.com/helpcenter/generate_gerber/How_to_Export_Gerber__BOM__and_Pick_and_Place_Files_in_KiCad_9_0.html
- PCBWay Fabrication Toolkit: https://www.pcbway.com/blog/News/PCBWay_Fabrication_Toolkit_for_Kicad_23c41e77.html
- KiCad Forum placement/JLCPCB: https://forum.kicad.info/t/position-placement-file-not-lining-up-with-gerbers-in-jlcpcb-review-parts-placement/29902
- KiCad Forum pick-and-place standard: https://forum.kicad.info/t/is-there-no-standard-for-pick-and-place/31608
- KiCad Forum invalid drill viewer: https://forum.kicad.info/t/invalid-drill-file-at-the-seeedstudio-gerberviewer/9085
- KiCad Forum drill holes/JLCPCB: https://forum.kicad.info/t/drill-holes-not-showing-up-in-gerber-view/45338
- KiCad Forum Gerber not recognized: https://forum.kicad.info/t/gerber-files-not-recognized-by-the-manufacturer/41400
- KiCad Forum DRC/Gerber confusion: https://forum.kicad.info/t/drc-error-exporting-gerber-files/56108
- KiCad Forum missing connection/island: https://forum.kicad.info/t/wrong-error-missing-connection-between-items/38669
- Reddit CPL coordinates: https://www.reddit.com/r/KiCad/comments/13lp24s/cpl_coordinates_of_some_parts_are_off_jlcpcb/
- Reddit BOM/CPL beginner: https://www.reddit.com/r/PCB/comments/1j7vyn7/how_to_prepare_bom_cpl_files_beginner/
- Reddit JLCPCB parts selection: https://www.reddit.com/r/PCB/comments/1mznzz8/jlcpcb_parts_selection_hell/
- Reddit assembly without CPL: https://www.reddit.com/r/PCB/comments/1onhxq8/jlcpcb_assembly_without_cpl_file/
- Reddit design evaluation before printing: https://www.reddit.com/r/PCB/comments/1qvzr3r/as_pcb_designers_how_do_you_evaluate_your_design/
- Reddit KiCad BOM/MPN workflow: https://www.reddit.com/r/KiCad/comments/1t2i1vq/kicad_sharing_a_bit_of_my_experience/
- Reddit common PCB mistakes: https://www.reddit.com/r/PrintedCircuitBoard/comments/jqk24f/common_pcb_mistakes/
- EEVblog PCB design tips: https://www.eevblog.com/forum/projects/pcb-design-tips-64168/
- EEVblog PCB manufacture failure: https://www.eevblog.com/forum/blog/eevblog-1327-3-ways-to-fail-at-pcb-manufacture/
