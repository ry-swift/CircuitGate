# CircuitGate CLI 使用指南

CircuitGate 是一个面向 PCB 制造资料包的命令行审查工具。当前 CLI 会扫描 KiCad 项目和制造输出文件，生成结构化报告，并在本机安装了 `kicad-cli` 时自动运行 KiCad ERC/DRC 检查。

## 当前能力

- 识别 KiCad 源文件：`.kicad_pro`、`.kicad_sch`、`.kicad_pcb`
- 识别制造文件：Gerber 压缩包、Gerber 层文件、钻孔文件、BOM CSV、CPL/贴片坐标 CSV、装配图
- 按厂家 profile 检查资料包缺失项：`generic`、`jlcpcb`、`pcbway`
- 调用 KiCad CLI 生成 ERC/DRC 原始 JSON 报告
- 输出 JSON 或 Markdown 审查报告

## 环境要求

- Node.js：建议使用支持 ES2022 的现代 Node.js 版本
- pnpm：仓库声明版本为 `pnpm@10.33.0`
- KiCad CLI：可选；如果需要 ERC/DRC 检查，确保 `kicad-cli` 在 PATH 中

检查 KiCad CLI：

```bash
kicad-cli --version
```

如果没有安装或 PATH 中找不到 `kicad-cli`，CircuitGate 仍会执行资料包扫描，但会在报告中记录 `CG-KICAD-CLI-MISSING`，并跳过 ERC/DRC。

## 安装与构建

首次使用先安装依赖：

```bash
pnpm install
```

从干净仓库构建 CLI：

```bash
pnpm build
```

查看 CLI 帮助：

```bash
pnpm circuitgate --help
```

## 基本用法

当前只有一个子命令：`review`。

```bash
pnpm circuitgate review <项目目录> [--profile generic|jlcpcb|pcbway] [--format json|markdown] [--output file]
```

建议传入 KiCad 项目或制造资料包所在的目录，例如：

```bash
pnpm circuitgate review examples/blinky --profile jlcpcb --format markdown
```

## 参数说明

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `<项目目录>` | 必填 | 待审查的 KiCad 项目目录或制造资料包目录 |
| `--profile` | `generic` | 厂家/场景配置，支持 `generic`、`jlcpcb`、`pcbway` |
| `--format` | `json` | 报告输出格式，支持 `json`、`markdown` |
| `--output` | 不写文件 | 把报告写入指定文件；不传则输出到终端 |

未知 profile 会回退到 `generic`，并在报告中产生中等级别警告。

## 常用示例

输出 JSON 到终端：

```bash
pnpm circuitgate review examples/blinky --profile generic --format json
```

输出 Markdown 到终端：

```bash
pnpm circuitgate review examples/blinky --profile jlcpcb --format markdown
```

输出 Markdown 到文件：

```bash
pnpm circuitgate review examples/blinky --profile pcbway --format markdown --output report.md
```

## 输入文件识别规则

CircuitGate 会递归扫描输入目录，并忽略 `.git`、`node_modules`、`dist`、`.circuitgate`、`.DS_Store`、KiCad 锁文件和 `.kicad_prl`。

主要识别规则如下：

| 类型 | 识别方式 |
| --- | --- |
| KiCad 项目 | `.kicad_pro` |
| KiCad 原理图 | `.kicad_sch` |
| KiCad PCB | `.kicad_pcb` |
| Gerber 压缩包 | 文件名或路径包含 `gerber`、`fabrication`、`fab`、`plot` 的 `.zip` |
| Gerber 层文件 | `.gbr`、`.gtl`、`.gbl`、`.gto`、`.gbo`、`.gts`、`.gbs`、`.gko`、`.gm1`、`.gml` |
| 钻孔文件 | `.drl`、`.xln`、`.drill`，或文件名包含 `drill` |
| BOM | 文件名包含 `bom` 或 `bill of materials` 的 `.csv` |
| CPL/贴片坐标 | 文件名包含 `cpl`、`centroid`、`position`、`pos`、`pick-and-place`、`pnp`、`xyrs` 的 `.csv` |
| 装配图 | 文件名包含 `assembly`、`assy`、`ibom`、`placement` 的 `.pdf`、`.html`、`.png`、`.jpg`、`.jpeg` |
| 厂家 profile 文件 | 路径包含 `profile` 的 `.json` |

文件名只包含英文字母、数字、点、下划线、斜杠和连字符时会被视为自动上传更安全。包含空格、中文或其他特殊字符的文件名会产生低等级提示，建议在提交给厂家前规范化。

## Profile 差异

`generic` 适合通用制造资料包检查：

- 缺少 Gerber 会报高等级制造阻塞项
- 缺少钻孔文件会报高等级制造阻塞项
- 缺少 BOM 会报中等级装配风险
- 不强制要求 CPL/贴片坐标
- 如果没有厂家 profile 文件，会提示使用 `jlcpcb` 或 `pcbway` 做订单场景检查

`jlcpcb` 和 `pcbway` 适合装配订单检查：

- 继承通用制造资料包检查
- 缺少 CPL/贴片坐标 CSV 会报高等级装配风险

## KiCad ERC/DRC 输出

如果目录中存在 `.kicad_sch`，CircuitGate 会运行：

```bash
kicad-cli sch erc --format json --severity-all --output <项目目录>/.circuitgate/kicad-erc.json <原理图文件>
```

如果目录中存在 `.kicad_pcb`，CircuitGate 会运行：

```bash
kicad-cli pcb drc --format json --severity-all --output <项目目录>/.circuitgate/kicad-drc.json <PCB 文件>
```

原始 KiCad 报告会保存在输入目录下的 `.circuitgate/` 中：

- `.circuitgate/kicad-erc.json`
- `.circuitgate/kicad-drc.json`

这些文件用于审计追踪和后续问题定位。

## 报告内容

JSON 报告包含：

- `schemaVersion`：报告结构版本
- `generatedAt`：报告生成时间
- `manifest`：扫描到的文件、缺失项、文件名安全性和项目类型推断
- `findings`：规范化后的问题列表
- `rawOutputs`：KiCad ERC/DRC 命令、输出路径、退出码、stdout/stderr

Markdown 报告包含：

- 生成时间
- 使用的 profile
- 推断的项目类型
- 已识别文件摘要
- findings 列表和修复建议

## 常见问题

### 提示 `Unknown command`

当前只支持 `review` 子命令。请使用：

```bash
pnpm circuitgate review <项目目录>
```

### 提示 `Missing project path`

没有传入待审查目录。示例：

```bash
pnpm circuitgate review examples/blinky --profile jlcpcb
```

### 报告里出现 `CG-KICAD-CLI-MISSING`

说明系统找不到 `kicad-cli`。安装 KiCad CLI，或把它加入 PATH 后重新运行。

### 没有生成 ERC/DRC 报告

通常有三类原因：

- 没有安装或无法找到 `kicad-cli`
- 输入目录中没有 `.kicad_sch` 或 `.kicad_pcb`
- KiCad 文件与当前安装的 KiCad CLI 版本不兼容

### JLCPCB/PCBWay profile 报缺少 CPL

`jlcpcb` 和 `pcbway` profile 会把 CPL/贴片坐标作为装配审查输入。请从 EDA 工具导出 placement、position、pick-and-place 或 CPL CSV，并确认 BOM 中的位号与 CPL 中的位号一致。

## 开发命令

构建全部 workspace：

```bash
pnpm build
```

类型检查：

```bash
pnpm lint
```

运行测试：

```bash
pnpm test
```

本地修改 CLI 后，先运行构建，再用示例项目验证：

```bash
pnpm build
pnpm circuitgate review examples/blinky --profile jlcpcb --format markdown
```
