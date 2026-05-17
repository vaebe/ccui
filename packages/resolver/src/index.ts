import type { ComponentEntry } from './components'
import { componentMap } from './components'

/**
 * Minimal subset of `unplugin-vue-components`'s `ComponentResolver` shape.
 * Replicated locally so this package does not need to import the upstream
 * type at runtime — the structural contract is what matters.
 */
export interface ComponentInfo {
  /** Imported export name. */
  name?: string
  /** Module to import from. */
  from: string
  /** Side-effect imports (style files) to be added alongside the component. */
  sideEffects?: SideEffectsInfo
}

export type SideEffectsInfo = ImportInfo | ImportInfo[] | string | undefined

export interface ImportInfo {
  name?: string
  as?: string
  from: string
}

export interface ComponentResolver {
  type: 'component' | 'directive'
  resolve: (name: string) => ComponentResolveResult | Promise<ComponentResolveResult>
}

export type ComponentResolveResult = ComponentInfo | string | null | undefined | void

/**
 * Resolver options.
 */
export interface Vue3CCUIResolverOptions {
  /**
   * Whether and how to import component styles.
   *
   * - `'css'`  — import the pre-compiled CSS bundle (single global file).
   *              Pulled in once and de-duped by `unplugin-vue-components`.
   *              Best for production: no Sass build step required.
   * - `'scss'` — import each component's source `.scss` per usage.
   *              Required if you want to override theme variables in your
   *              own Sass entry. Needs a Sass-capable build chain.
   * - `false`  — do nothing. You handle styles yourself (e.g. a single
   *              `import '@vaebe/ccui/style.css'` at app entry).
   *
   * @default 'css'
   */
  importStyle?: 'css' | 'scss' | false
  /**
   * Component prefix used in templates. Defaults to `'C'` matching the
   * `name: 'C<Name>'` convention used by every @vaebe/ccui component.
   *
   * Override only if you've registered components under a different prefix
   * via a custom installer.
   *
   * @default 'C'
   */
  prefix?: string
  /**
   * Skip resolving these component names. Useful if a name collides with
   * another library you're using together with @vaebe/ccui.
   */
  exclude?: string | RegExp | (string | RegExp)[]
  /**
   * Override the package name to import from. Mostly an escape hatch for
   * monorepos that re-export `@vaebe/ccui` under a different alias.
   *
   * @default '@vaebe/ccui'
   */
  importFrom?: string
  /**
   * Path of the global CSS bundle inside the imported package, used when
   * `importStyle: 'css'`. Override if your build customises the bundle name.
   *
   * @default '@vaebe/ccui/style.css'
   */
  cssBundlePath?: string
}

const DEFAULT_PREFIX = 'C'
const DEFAULT_PACKAGE = '@vaebe/ccui'
const DEFAULT_CSS_BUNDLE = '@vaebe/ccui/style.css'

function shouldExclude(name: string, exclude: Vue3CCUIResolverOptions['exclude']): boolean {
  if (!exclude) return false
  const list = Array.isArray(exclude) ? exclude : [exclude]
  return list.some((pat) => (typeof pat === 'string' ? pat === name : pat.test(name)))
}

function resolveStylePath(
  entry: ComponentEntry,
  importStyle: Vue3CCUIResolverOptions['importStyle'],
  pkg: string,
  cssBundle: string,
): string | undefined {
  if (importStyle === false) return undefined
  // hasStyle:false 的组件（如 ConfigProvider）没有 .scss / .css 资产，
  // 跳过 side-effect 注入避免 resolver 制造一个不存在的导入路径。
  // 'css' 模式注入的是全局 bundle，不受单组件 hasStyle 影响。
  if (importStyle === 'scss') {
    if (entry.hasStyle === false) return undefined
    // Source SCSS is shipped under `<pkg>/ui/<dir>/src/<dir>.scss`.
    return `${pkg}/ui/${entry.styleDir}/src/${entry.styleDir}.scss`
  }
  // 'css' — single global bundle (deduped by unplugin-vue-components).
  return cssBundle.startsWith(pkg) || cssBundle.startsWith('.') || cssBundle.startsWith('/')
    ? cssBundle
    : `${pkg}/${cssBundle}`
}

/**
 * Vue3CCUIResolver — register on `unplugin-vue-components` to auto-import
 * `@vaebe/ccui` components on demand.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import { Vue3CCUIResolver } from '@vaebe/unplugin-vue-components-ccui'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [Vue3CCUIResolver({ importStyle: 'css' })],
 *     }),
 *   ],
 * })
 * ```
 */
export function Vue3CCUIResolver(options: Vue3CCUIResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? DEFAULT_PREFIX
  const importStyle = options.importStyle ?? 'css'
  const pkg = options.importFrom ?? DEFAULT_PACKAGE
  const cssBundle = options.cssBundlePath ?? DEFAULT_CSS_BUNDLE

  return {
    type: 'component',
    resolve(name) {
      if (!name.startsWith(prefix)) return
      if (shouldExclude(name, options.exclude)) return

      const entry = componentMap[name]
      if (!entry) return

      const stylePath = resolveStylePath(entry, importStyle, pkg, cssBundle)

      return {
        name: entry.exportName,
        from: pkg,
        sideEffects: stylePath,
      }
    },
  }
}

export { componentMap, componentNames } from './components'
export type { ComponentEntry } from './components'
