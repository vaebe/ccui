// 给每个 demo 容器（@vitepress-code-preview/container 渲染的 [class*='_example-showcase_']）
// 注入一个浮动「浅色 / 深色」开关，只影响该容器自身，不触碰 VitePress 全站 appearance。
//
// 为什么不能只 toggle 容器的 `.dark`：`.dark` 会从**任意祖先**级联下来。当全站
// 处于深色（html.dark）时，容器即便不带 `.dark` 也会继承深色，单纯增删容器自己的
// `.dark` 根本切不回浅色。darkTheme.css 同时产出了对称的 `.dark` / `.light` 作用域类
// （CSS 自定义属性按元素就近解析，离得最近的祖先声明胜出），因此这里改为给容器挂
// **显式**的 `.dark` 或 `.light`，无论全站是浅是深都能就地反向覆盖。
//
// 仅客户端执行：本模块只在浏览器环境里被调用。

// 标记位：避免对同一容器重复注入按钮。
const INJECTED_FLAG = 'data-ccui-dark-toggle'
// 记录用户对该容器的显式选择：'dark' | 'light' | 不存在（跟随全站）。
const FORCED_ATTR = 'data-ccui-theme'
const SHOWCASE_SELECTOR = "[class*='_example-showcase_']"

// 全站是否深色：VitePress 的 appearance 切换挂在 <html>.dark 上。
function ambientIsDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

// 容器当前实际渲染为深色与否：有显式选择则以选择为准，否则跟随全站。
function effectiveIsDark(container: HTMLElement): boolean {
  const forced = container.getAttribute(FORCED_ATTR)
  if (forced === 'dark') return true
  if (forced === 'light') return false
  return ambientIsDark()
}

// 把目标模式落到容器上：互斥地挂 `.dark` / `.light`，并记录显式选择。
function applyForced(container: HTMLElement, dark: boolean) {
  container.setAttribute(FORCED_ATTR, dark ? 'dark' : 'light')
  container.classList.toggle('dark', dark)
  container.classList.toggle('light', !dark)
}

const buttons = new Set<{ container: HTMLElement; btn: HTMLButtonElement }>()

function syncButton(container: HTMLElement, btn: HTMLButtonElement) {
  const isDark = effectiveIsDark(container)
  btn.setAttribute('aria-pressed', String(isDark))
  // 图标表示「点一下会切到」的目标：当前深色就给太阳（切浅），反之给月亮（切深）。
  btn.title = isDark ? '切换为浅色' : '切换为深色'
  btn.setAttribute('aria-label', btn.title)
  btn.textContent = isDark ? '☀' : '☾'
}

function createToggleButton(container: HTMLElement): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'ccui-demo-dark-toggle'

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    // 以「当前实际效果」为基准取反，保证首次点击在任何全站模式下都正确翻转。
    applyForced(container, !effectiveIsDark(container))
    syncButton(container, btn)
  })

  syncButton(container, btn)
  return btn
}

function enhanceShowcase(container: HTMLElement) {
  if (container.hasAttribute(INJECTED_FLAG)) return
  container.setAttribute(INJECTED_FLAG, '')

  // 容器默认 position 未必是 relative，绝对定位按钮前确保有定位上下文。
  const pos = getComputedStyle(container).position
  if (pos === 'static') container.style.position = 'relative'

  const btn = createToggleButton(container)
  container.appendChild(btn)
  buttons.add({ container, btn })
}

function scan(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(SHOWCASE_SELECTOR).forEach(enhanceShowcase)
}

let observer: MutationObserver | null = null
let htmlObserver: MutationObserver | null = null

/**
 * 在客户端启动 demo 深色开关注入。多次调用安全（幂等）。
 */
export function setupDemoDarkToggle() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // 首屏 + 后续懒加载的 demo（VitePress SPA 路由切换会换页面内容）。
  scan()

  if (!observer) {
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

  // 全站 appearance 变化时，未做过显式选择的容器要跟着更新按钮图标
  // （它们没挂 .dark/.light，视觉本就跟随全站，只是按钮文案需同步）。
  if (!htmlObserver) {
    htmlObserver = new MutationObserver(() => {
      buttons.forEach(({ container, btn }) => {
        if (!container.getAttribute(FORCED_ATTR)) syncButton(container, btn)
      })
    })
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }
}
