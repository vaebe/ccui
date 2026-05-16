import type { CSSProperties } from 'vue'

/**
 * classNames / styles 语义化 DOM 钩子。
 *
 * 用法约定：每组件 types 文件用本通用类型暴露 `classNames` / `styles` 两个 prop；
 * tsx 在每个语义化区域用 Vue class array binding 注入：
 *
 * ```tsx
 * <div class={[ns.b(), props.classNames?.root]} style={props.styles?.root}>
 *   <div class={[ns.e('inner'), props.classNames?.inner]} style={props.styles?.inner} />
 * </div>
 * ```
 *
 * 每组件可用 region key 在该组件 docs 列出（不强类型约束，避免每组件单独定义 union 类型）。
 */
export type CcSemanticClasses = Record<string, string | undefined>
export type CcSemanticStyles = Record<string, CSSProperties | undefined>
