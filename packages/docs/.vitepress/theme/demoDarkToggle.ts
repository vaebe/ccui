// 给每个 demo 容器（@vitepress-code-preview/container 渲染的 [class*='_example-showcase_']）
// 注入一个浮动「浅色 / 深色」开关。点击只 toggle 该容器自身的 `.dark` 类，
// darkTheme.css 的规则全部 scope 在 `.dark` 下、组件全走 CSS 变量，
// 因此该容器内的 ccui 组件即就地变深色，而不触碰 VitePress 全站 appearance（html.dark）。
//
// 仅客户端执行：本模块只在 onMounted / 浏览器环境里被调用。

// 标记位：避免对同一容器重复注入按钮。
const INJECTED_FLAG = 'data-ccui-dark-toggle'
const SHOWCASE_SELECTOR = "[class*='_example-showcase_']"

function createToggleButton(container: HTMLElement): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'ccui-demo-dark-toggle'
  btn.setAttribute('aria-pressed', 'false')

  const sync = () => {
    const isDark = container.classList.contains('dark')
    btn.setAttribute('aria-pressed', String(isDark))
    btn.title = isDark ? '切换为浅色' : '切换为深色'
    btn.setAttribute('aria-label', btn.title)
    // 用文字图标，零依赖、不需要额外资源
    btn.textContent = isDark ? '☀' : '☾'
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    container.classList.toggle('dark')
    sync()
  })

  sync()
  return btn
}

function enhanceShowcase(container: HTMLElement) {
  if (container.hasAttribute(INJECTED_FLAG)) return
  container.setAttribute(INJECTED_FLAG, '')

  // 容器默认 position 未必是 relative（active 规则里没设），
  // 绝对定位按钮前确保有定位上下文。
  const pos = getComputedStyle(container).position
  if (pos === 'static') container.style.position = 'relative'

  container.appendChild(createToggleButton(container))
}

function scan(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(SHOWCASE_SELECTOR).forEach(enhanceShowcase)
}

let observer: MutationObserver | null = null

/**
 * 在客户端启动 demo 深色开关注入。多次调用安全（幂等）。
 */
export function setupDemoDarkToggle() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // 首屏 + 后续懒加载的 demo（VitePress SPA 路由切换会换页面内容）。
  scan()

  if (observer) return

  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        if (node.matches(SHOWCASE_SELECTOR)) enhanceShowcase(node)
        scan(node)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
