---
phase: 04-reporting-ci
plan: 01
subsystem: reporting-ci
tags: [report-model, markdown-report, json-report, github-action, pr-comment]
requires:
  - phase: 03-rule-engine
    provides: Finding model, rule runner output, KiCad raw artifact paths, CLI review flow
provides:
  - Shared ReportModel used by JSON, Markdown and CI comment outputs
  - Markdown pre-order review report with risk summary, evidence appendix and recheck checklist
  - JSON report format for CI, future Web reading and AI evidence binding
  - GitHub composite action with artifact upload, PR comment and fail-on-severity threshold
affects: [ai-review-assistant, paid-pilot-ops, web-console]
tech-stack:
  added: []
  patterns: [single ReportModel source, renderer separation, composite action post-processing]
key-files:
  created:
    - packages/core/src/report/report-model.ts
    - packages/core/src/report/markdown-renderer.ts
    - packages/core/src/report/json-renderer.ts
    - packages/github-action/src/post-process.ts
    - action.yml
  modified:
    - packages/core/src/index.ts
    - packages/cli/src/index.ts
    - pnpm-lock.yaml
key-decisions:
  - "ReportModel 是所有输出格式和 CI 注释的唯一来源，避免本地 CLI 与 GitHub Action 结果分叉。"
  - "Markdown 报告只基于 finding、规则说明和工具证据，不生成未绑定证据的 AI 式泛化结论。"
  - "GitHub composite action 在 github.action_path 构建工具，在 github.workspace 审查调用方项目，便于后续作为远程 action 发布。"
patterns-established:
  - "报告层先聚合 Finding，再由 renderer 输出 Markdown 或 JSON。"
  - "CI post-process 读取同一份 JSON report，负责 PR summary、artifact 链接和失败阈值。"
requirements-completed: [RPT-01, RPT-02, RPT-03, RPT-04, CI-01, CI-02, CI-03, CI-04]
duration: 35 min active across 2 sessions
completed: 2026-05-14
---

# Phase 04 Plan 01: Reporting and CI Summary

**统一 ReportModel 驱动的 Markdown/JSON 报告和 GitHub PR 审查工作流**

## Performance

- **Duration:** 35 min active across 2 sessions
- **Started:** 2026-05-12T08:56:28Z
- **Completed:** 2026-05-14T08:36:17Z
- **Tasks:** 3
- **Files modified:** 10 production/planning-relevant files

## Accomplishments

- 新增 `ReportModel`，聚合项目、profile、运行元数据、severity/status 统计、raw artifacts、waiver 和完整 finding 列表。
- CLI 的 `review` 输出改为从同一份 `ReportModel` 渲染 JSON 或 Markdown，报告包含制造阻塞、BOM/CPL 风险、KiCad ERC/DRC、人工复核、缺输入、证据附录和复查清单。
- 新增 GitHub composite action，支持 `project`、`profile`、`fail-on-severity`、`comment`、`upload-artifact`、`artifact-name` 和 `report-dir` 输入。
- 新增 action post-process，读取 JSON report 输出 PR comment 摘要，并按 configured severity threshold 控制 CI 失败。
- 生成 `04-USER-SETUP.md`，记录发布为可复用 GitHub Action 前需要用户完成的 release/tag 配置。

## Task Commits

1. **Task 1: 设计 ReportModel** - `a888f83` (feat)
2. **Task 2: 实现 Markdown 和 JSON 报告** - `16cb8a4` (feat)
3. **Task 3: 实现 GitHub Action** - `573cd9b` (feat)

## Files Created/Modified

- `packages/core/src/report/report-model.ts` - 报告中间模型、severity/status 聚合、raw artifact 链接和 Finding 状态归一化。
- `packages/core/src/report/markdown-renderer.ts` - 工程可读 Markdown 报告渲染。
- `packages/core/src/report/json-renderer.ts` - CI/Web 可读取 JSON 输出。
- `packages/core/src/index.ts` - 导出报告模型和 renderer。
- `packages/cli/src/index.ts` - `review` 命令生成 ReportModel 并支持 `--format json|markdown`。
- `action.yml` - GitHub composite action wrapper，负责构建、报告生成、artifact 上传和 post-process。
- `packages/github-action/src/post-process.ts` - PR comment 摘要和 fail-on-severity enforcement。
- `packages/github-action/package.json` / `tsconfig.json` - action post-process 构建配置。
- `pnpm-lock.yaml` - 加入 `packages/github-action` workspace importer。
- `.planning/phases/04-reporting-ci/04-USER-SETUP.md` - 发布 action 前的用户配置事项。

## Decisions Made

- ReportModel 放在 core 层，CLI 和 GitHub Action 只消费该模型，保证本地、CI 和后续 Web/AI 阶段的数据结构一致。
- Markdown 报告不做未证据绑定的风险推断，只展示 Finding 中已有的 severity、rule ID、evidence、impact、recommendation 和 waiver。
- GitHub Action 构建目录和审查目录分离：`github.action_path` 用于 action 自身源码，`github.workspace` 用于调用方项目，避免远程 action 在消费者仓库中找不到 `packages/cli`。

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Composite action working directory split**
- **Found during:** Task 3 (实现 GitHub Action)
- **Issue:** 初版 action 在默认工作目录中安装和运行 `packages/cli`，远程 action 被调用时会落到调用方仓库，导致工具路径和项目路径混淆。
- **Fix:** `Install dependencies`、`Build CircuitGate`、report generation 和 post-process 均设置 `working-directory: ${{ github.action_path }}`；`Prepare report paths` 将相对 `project` 和 `report-dir` 解析到 `$GITHUB_WORKSPACE`。
- **Files modified:** `action.yml`
- **Verification:** `pnpm lint`、`pnpm test`、本地 JSON/Markdown review 和 post-process smoke 均通过。
- **Committed in:** `573cd9b`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** 修复后 action 更接近真实 GitHub PR 使用场景，没有扩大功能范围。

## Issues Encountered

- 没有运行真实 GitHub-hosted workflow 或 `act`，因为当前环境没有已配置的测试仓库/runner；已用本地 CLI、report output 和 post-process threshold 行为覆盖 action 核心逻辑。

## Verification

- `pnpm lint` - PASS。
- `pnpm test` - PASS，14 个 Node test 通过。
- `node packages/cli/dist/index.js review examples/blinky --profile jlcpcb --format markdown --output /private/tmp/circuitgate-review.md` - PASS，生成 Markdown 报告。
- `node packages/cli/dist/index.js review examples/blinky --profile jlcpcb --format json --output /private/tmp/circuitgate-review.json` - PASS，生成 JSON 报告。
- `node packages/github-action/dist/post-process.js --report-json /private/tmp/circuitgate-review.json --report-markdown /private/tmp/circuitgate-review.md --comment false --fail-on-severity none --artifact-name circuitgate-review` - PASS，输出 PR comment 摘要。
- `node packages/github-action/dist/post-process.js --report-json /private/tmp/circuitgate-review.json --report-markdown /private/tmp/circuitgate-review.md --comment false --fail-on-severity high --artifact-name circuitgate-review` - PASS for enforcement behavior，预期以 exit 1 失败并报告 high findings 达到阈值。
- Report smoke summary: `totalFindings=21`，`high=2`，`rawArtifacts=2`，`needs-human-review=15`。

## User Setup Required

External release configuration is required before publishing the reusable action. See `04-USER-SETUP.md` for:
- GitHub repository/release tag setup
- Optional Marketplace metadata
- Test-repository verification workflow

## Next Phase Readiness

Phase 5 可以基于 JSON ReportModel 和 Markdown 报告增加 evidence-bound AI 摘要。AI 阶段必须继续保持“finding 和证据是事实来源”的边界，不能让 AI 改写 severity、证据链或 waiver 状态。

## Self-Check: PASSED

Plan must-haves satisfied:

- CLI 可以输出 Markdown 和 JSON 报告。
- 报告包含 summary、findings、evidence、recommendations。
- GitHub Action 可以在 PR 中运行所需的构建、报告生成、artifact 上传、comment 和失败阈值步骤。

---
*Phase: 04-reporting-ci*
*Completed: 2026-05-14*
