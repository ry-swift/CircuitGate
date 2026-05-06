# State: Hardware Design CI

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-06)

**Core value:** 在硬件错误进入打板、采购、SMT 或客户交付前，用本地可复核的证据报告帮团队提前拦截高风险问题。
**Current focus:** Phase 1: Product Offer and Report Contract

## Current Status

- GSD 项目已初始化。
- 已从两份市场调研报告承接产品方向。
- 当前不是代码实现阶段，下一步应先计划 Phase 1，明确销售型 Demo、报告合同、finding schema、客户话术和数据安全边界。

## Next Command

Run:

```bash
$gsd-plan-phase 1
```

## Important Context

- 你目前是一个人 + Codex 创业，没有注册公司，早期应避免大企业正式采购路线。
- B 端客户开发应以低风险试点为主：样例报告、一次性审查、下一个项目预付。
- 技术实现必须服务客户验证，Demo 最多 7-14 天，不能闭门开发完整平台。
- 所有报告 finding 必须证据优先，AI 不能作为唯一判断来源。

## Open Questions

- 首个 Demo 是否使用公开 KiCad 项目、自己构造的示例板，还是已有脱敏工程。
- 第一版 CLI 技术栈是否使用 TypeScript/Node.js。
- 是否需要先生成一页 landing page 和标准私信模板作为 Phase 1 的第一份交付。

---
*Last updated: 2026-05-06 after initial GSD product direction planning*
