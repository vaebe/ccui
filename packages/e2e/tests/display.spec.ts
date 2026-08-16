import { expect, test } from './support/test'
import { openFixture } from './support/open-fixture'

test.beforeEach(async ({ page }) => {
  await openFixture(page, 'display', 'display-fixtures')
})

test('[Alert] renders warning message, description, and live alert semantics', async ({ page }) => {
  const alert = page.getByRole('alert')
  await expect(alert).toHaveClass(/ccui-alert--warning/)
  await expect(alert).toContainText('Storage almost fullRemove unused files')
})

test('[Alert] emits close and removes itself from the document', async ({ page }) => {
  // 精确匹配 Alert 的关闭按钮，避免同时命中“关闭标签”等其他控件。
  await page.getByRole('button', { name: '关闭', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByTestId('alert-close-count')).toHaveText('1')
})

test('[Avatar] derives initials from a multi-part name', async ({ page }) => {
  await expect(page.locator('.ccui-avatar')).toContainText('AL')
})

test('[Avatar] applies requested square geometry to its text surface', async ({ page }) => {
  const avatar = page.locator('.ccui-avatar__style')
  await expect(avatar).toHaveCSS('width', '48px')
  await expect(avatar).toHaveCSS('height', '48px')
})

test('[Badge] truncates counts above overflowCount', async ({ page }) => {
  await expect(page.locator('.ccui-badge').filter({ hasText: 'Inbox' })).toContainText('99+')
})

test('[Badge] preserves the exact count as an accessible title', async ({ page }) => {
  await expect(page.locator('.ccui-badge__sup')).toHaveAttribute('title', '120')
})

test('[BadgeRibbon] renders ribbon and wrapped slot content', async ({ page }) => {
  const ribbon = page.locator('.ccui-badge-ribbon')
  await expect(ribbon).toContainText('Featured')
  await expect(page.getByText('Ribbon content')).toBeVisible()
})

test('[BadgeRibbon] applies end placement state', async ({ page }) => {
  await expect(page.locator('.ccui-badge-ribbon')).toHaveClass(/end/)
})

test('[BorderBeam] renders its decorative layer as hidden from assistive technology', async ({ page }) => {
  await expect(page.locator('.ccui-border-beam__effect').first()).toHaveAttribute('aria-hidden', 'true')
})

test('[BorderBeam] exposes configured animation geometry and content', async ({ page }) => {
  const beam = page.locator('.ccui-border-beam')
  await expect(beam).toContainText('Beam content')
  await expect(beam).toHaveCSS('--ccui-bb-border-width', '1px')
})

test('[BorderBeam] keeps evenly delayed effects inside a clipping asChild host', async ({ page }) => {
  const host = page.getByTestId('border-beam-child-host')
  const effects = host.locator('.ccui-border-beam__effect--child')
  await expect(effects).toHaveCount(3)
  await expect(effects.nth(1)).toHaveCSS('--ccui-bb-delay', '-2s')
  await expect(effects.first()).toHaveCSS('--ccui-bb-inset-offset', '0px')
  await expect(effects.first()).toHaveCSS('border-radius', '12px 12px 0px 0px')
})

test('[BorderBeam] refreshes inferred inset when an ancestor class changes the border box', async ({ page }) => {
  const host = page.getByTestId('border-beam-dynamic-host')
  const effect = host.locator('.ccui-border-beam__effect--child')
  await expect(host).toHaveCSS('border-top-width', '2px')
  await expect(effect).toHaveCSS('--ccui-bb-inset-offset', '-2px -2px -2px -2px')

  await page.getByRole('button', { name: 'Widen beam border' }).click()
  await expect(host).toHaveCSS('border-top-width', '6px')
  await expect(effect).toHaveCSS('--ccui-bb-inset-offset', '-6px -6px -6px -6px')
})

test('[Breadcrumb] renders a labelled navigation landmark', async ({ page }) => {
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
})

test('[Breadcrumb] renders separators between supplied items', async ({ page }) => {
  // 两个面包屑项目之间只应渲染一个分隔符，末项不追加分隔符。
  await expect(page.locator('.ccui-breadcrumb__separator')).toHaveCount(1)
})

test('[BreadcrumbItem] renders linked items with their href', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home')
})

test('[BreadcrumbItem] marks the terminal item as the current page', async ({ page }) => {
  await expect(page.getByText('Components', { exact: true })).toHaveAttribute('aria-current', 'page')
})

test('[Button] emits a click through the native button surface', async ({ page }) => {
  await page.getByRole('button', { name: 'Primary action' }).click()
  await expect(page.getByTestId('display-button-clicks')).toHaveText('1')
})

test('[Button] maps disabled state to native semantics', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Unavailable action' })).toBeDisabled()
})

test('[ButtonGroup] wraps its two related buttons', async ({ page }) => {
  await expect(page.locator('.ccui-button-group').getByRole('button')).toHaveCount(2)
})

test('[ButtonGroup] propagates the small size to grouped buttons', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Primary action' })).toHaveClass(/small/)
})

test('[Button3d] emits click events from the front control', async ({ page }) => {
  await page.getByRole('button', { name: '3D action' }).click()
  await expect(page.getByTestId('display-button-clicks')).toHaveText('1')
})

test('[Button3d] applies the success visual state and button semantics', async ({ page }) => {
  const button = page.getByRole('button', { name: '3D action' })
  await expect(button).toHaveClass(/ccui-button-3d--success/)
  await expect(button).toBeEnabled()
})

test('[Card] renders configured header and default body slots', async ({ page }) => {
  const card = page.locator('.ccui-card')
  await expect(card.locator('.ccui-card__header')).toHaveText('Release notes')
  await expect(card.locator('.ccui-card__body')).toContainText('Version 2')
})

test('[Card] applies the default always-shadow state', async ({ page }) => {
  await expect(page.locator('.ccui-card')).toHaveClass(/ccui-card--always-shadow/)
})

test('[CardMeta] renders its title slot surface', async ({ page }) => {
  await expect(page.locator('.ccui-card-meta__title')).toHaveText('Version 2')
})

test('[CardMeta] renders its description surface', async ({ page }) => {
  await expect(page.locator('.ccui-card-meta__description')).toHaveText('A stable release')
})

test('[Descriptions] renders title and bordered state', async ({ page }) => {
  const descriptions = page.locator('.ccui-descriptions')
  await expect(descriptions).toHaveClass(/bordered/)
  await expect(descriptions.locator('.ccui-descriptions__title')).toHaveText('User profile')
})

test('[Descriptions] lays out supplied data in a semantic table', async ({ page }) => {
  await expect(page.locator('.ccui-descriptions table')).toBeVisible()
  await expect(page.locator('.ccui-descriptions__row')).toHaveCount(1)
})

test('[DescriptionsItem] exposes Name through a row header', async ({ page }) => {
  await expect(page.getByRole('rowheader', { name: 'Name' })).toBeVisible()
})

test('[DescriptionsItem] renders the matching item value in a cell', async ({ page }) => {
  await expect(page.getByRole('cell', { name: 'Grace Hopper' })).toBeVisible()
})

test('[Divider] renders slotted divider content', async ({ page }) => {
  await expect(page.locator('.ccui-divider')).toContainText('More content')
})

test('[Divider] uses the default horizontal solid border', async ({ page }) => {
  const divider = page.locator('.ccui-divider')
  await expect(divider).toHaveCSS('border-top-style', 'solid')
})

test('[Empty] renders an explicit empty-state description', async ({ page }) => {
  await expect(page.locator('.ccui-empty')).toContainText('Nothing to display')
})

test('[Empty] supplies a decorative default illustration', async ({ page }) => {
  await expect(page.locator('.ccui-empty svg')).toHaveAttribute('aria-hidden', 'true')
})

test('[Flex] applies flex layout and requested justification', async ({ page }) => {
  const flex = page.locator('.ccui-flex')
  await expect(flex).toHaveCSS('display', 'flex')
  await expect(flex).toHaveCSS('justify-content', 'space-between')
})

test('[Flex] applies numeric gap geometry', async ({ page }) => {
  await expect(page.locator('.ccui-flex')).toHaveCSS('gap', '12px')
})

test('[Row] renders both provided grid columns', async ({ page }) => {
  await expect(page.locator('.ccui-row > .ccui-col')).toHaveCount(2)
})

test('[Row] applies half-gutter negative inline margins', async ({ page }) => {
  const row = page.locator('.ccui-row')
  await expect(row).toHaveCSS('margin-left', '-8px')
  await expect(row).toHaveCSS('margin-right', '-8px')
})

test('[Col] maps span values to modifier classes', async ({ page }) => {
  await expect(page.locator('.ccui-col').first()).toHaveClass(/ccui-col--span-8/)
  await expect(page.locator('.ccui-col').nth(1)).toHaveClass(/ccui-col--span-16/)
})

test('[Col] inherits half of the Row gutter as padding', async ({ page }) => {
  await expect(page.locator('.ccui-col').first()).toHaveCSS('padding-left', '8px')
})

test('[Icon] exposes labelled noninteractive icons as images', async ({ page }) => {
  const icon = page.getByRole('img', { name: 'Settings icon' })
  await expect(icon).toHaveCSS('font-size', '24px')
  await expect(icon.locator('svg')).toBeVisible()
})

test('[Icon] supports keyboard activation when clickable', async ({ page }) => {
  const icon = page.getByRole('button', { name: 'Clickable icon' })
  await icon.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('icon-click-count')).toHaveText('1')
})

test('[Layout] renders nested layout sections', async ({ page }) => {
  await expect(page.locator('.ccui-layout')).toHaveCount(2)
})

test('[Layout] detects its registered Sider child', async ({ page }) => {
  await expect(page.locator('.ccui-layout').nth(1)).toHaveClass(/has-sider/)
})

test('[Header] renders a semantic header element', async ({ page }) => {
  await expect(page.locator('header.ccui-layout-header')).toHaveText('Site header')
})

test('[Header] remains inside the outer Layout', async ({ page }) => {
  await expect(page.locator('.ccui-layout').first().locator('header')).toHaveCount(1)
})

test('[Content] renders a semantic main element', async ({ page }) => {
  await expect(page.locator('main.ccui-layout-content')).toHaveText('Page content')
})

test('[Content] occupies the nested content branch', async ({ page }) => {
  await expect(page.locator('.ccui-layout').nth(1).locator('main')).toHaveCount(1)
})

test('[Footer] renders a semantic footer element', async ({ page }) => {
  await expect(page.locator('footer.ccui-layout-footer')).toHaveText('Site footer')
})

test('[Footer] remains inside the outer Layout', async ({ page }) => {
  await expect(page.locator('.ccui-layout').first().locator('footer')).toHaveCount(1)
})

test('[Sider] uses configured expanded width and expansion ARIA', async ({ page }) => {
  const sider = page.locator('aside.ccui-layout-sider')
  await expect(sider).toHaveCSS('width', '160px')
  await expect(sider.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
})

test('[Sider] keeps default dark content readable', async ({ page }) => {
  await expect(page.locator('aside.ccui-layout-sider')).toHaveCSS('color', 'rgba(255, 255, 255, 0.85)')
})

test('[Sider] preserves controlled state at a narrow responsive breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 })
  await page.reload()
  await expect(page.getByTestId('display-fixtures')).toBeVisible()
  const sider = page.locator('aside.ccui-layout-sider')
  expect(await page.evaluate(() => window.matchMedia('(max-width: 767px)').matches)).toBe(true)
  await expect(sider).toHaveCSS('width', '160px')
  await expect(page.getByTestId('sider-collapsed')).toHaveText('false')
})

test('[Progress] renders its numeric percentage information', async ({ page }) => {
  await expect(page.locator('.ccui-progress__text')).toHaveText('42%')
})

test('[Progress] maps percent to line width geometry', async ({ page }) => {
  const ratio = await page.locator('.ccui-progress__bg').evaluate((element) => {
    const inner = element.parentElement!
    return element.getBoundingClientRect().width / inner.getBoundingClientRect().width
  })
  expect(ratio).toBeCloseTo(0.42, 2)
})

test('[Result] renders success title and subtitle', async ({ page }) => {
  const result = page.locator('.ccui-result')
  await expect(result).toContainText('Payment complete')
  await expect(result).toContainText('Receipt is ready')
})

test('[Result] applies success state and renders its status icon', async ({ page }) => {
  const result = page.locator('.ccui-result')
  await expect(result).toHaveClass(/ccui-result--success/)
  await expect(result.locator('svg')).toBeVisible()
})

test('[Skeleton] renders the requested avatar placeholder', async ({ page }) => {
  await expect(page.locator('.ccui-skeleton__avatar')).toBeVisible()
})

test('[Skeleton] renders exactly two requested paragraph rows', async ({ page }) => {
  await expect(page.locator('.ccui-skeleton__paragraph-row')).toHaveCount(2)
})

test('[SkeletonNode] exposes busy and decorative ARIA state', async ({ page }) => {
  const node = page.locator('.ccui-skeleton-node')
  await expect(node).toHaveAttribute('aria-busy', 'true')
  await expect(node).toHaveAttribute('aria-hidden', 'true')
})

test('[SkeletonNode] applies explicit width and height geometry', async ({ page }) => {
  const node = page.locator('.ccui-skeleton-node')
  await expect(node).toHaveCSS('width', '80px')
  await expect(node).toHaveCSS('height', '24px')
})

test('[Space] wraps each slotted child in an item', async ({ page }) => {
  await expect(page.locator('.ccui-space__item')).toHaveCount(2)
})

test('[Space] applies vertical direction and numeric row gap', async ({ page }) => {
  const space = page.locator('.ccui-space')
  await expect(space).toHaveClass(/vertical/)
  await expect(space).toHaveCSS('row-gap', '12px')
})

test('[SpaceCompact] renders a compact grouping root', async ({ page }) => {
  await expect(page.locator('.ccui-space-compact')).toBeVisible()
})

test('[SpaceCompact] preserves both compact child controls', async ({ page }) => {
  await expect(page.locator('.ccui-space-compact').getByRole('button')).toHaveCount(2)
})

test('[Spin] exposes a polite status with configured tip', async ({ page }) => {
  const spin = page.getByRole('status', { name: 'Loading preview' })
  await expect(spin).toHaveAttribute('aria-live', 'polite')
})

test('[Spin] marks nested content busy while spinning', async ({ page }) => {
  await expect(page.locator('.ccui-spin__container')).toHaveAttribute('aria-busy', 'true')
})

test('[Steps] identifies the controlled current step', async ({ page }) => {
  await expect(page.locator('[aria-current="step"]')).toContainText('Profile')
})

test('[Steps] updates controlled state through keyboard activation', async ({ page }) => {
  const done = page.getByLabel(/Done/)
  await done.focus()
  await page.keyboard.press('Enter')
  await expect(done).toHaveAttribute('aria-current', 'step')
})

test('[Steps] stacks navigation items without title overlap on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()

  const steps = page.locator('.ccui-steps--navigation')
  await expect(steps).toHaveCSS('flex-direction', 'column')

  const boxes = await steps.locator('.ccui-steps__item').evaluateAll((items) =>
    items.map((item) => {
      const rect = item.getBoundingClientRect()
      return { top: rect.top, bottom: rect.bottom }
    }),
  )
  expect(boxes).toHaveLength(3)
  expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom)
  expect(boxes[2].top).toBeGreaterThanOrEqual(boxes[1].bottom)
})

test('[Tag] applies success and outlined state classes', async ({ page }) => {
  const tag = page.locator('.ccui-tag')
  await expect(tag).toHaveClass(/success/)
  await expect(tag).toHaveClass(/outlined/)
})

test('[Tag] emits close and allows its controlled removal', async ({ page }) => {
  await page.locator('.ccui-tag__close').click()
  await expect(page.locator('.ccui-tag')).toHaveCount(0)
})

test('[Timeline] renders a timeline root containing all entries', async ({ page }) => {
  await expect(page.locator('.ccui-timeline')).toContainText('Project createdReview requested')
})

test('[Timeline] preserves the declared item order', async ({ page }) => {
  await expect(page.locator('.ccui-timeline-item')).toHaveText(['Project created', 'Review requested'])
})

test('[TimelineItem] applies a custom green dot color', async ({ page }) => {
  await expect(page.locator('.ccui-timeline-item').first().locator('.ccui-timeline-item__node')).toHaveCSS(
    'border-color',
    'rgb(0, 128, 0)',
  )
})

test('[TimelineItem] applies warning type state', async ({ page }) => {
  await expect(page.locator('.ccui-timeline-item').nth(1).locator('.ccui-timeline-item__node')).toHaveClass(/warning/)
})

test('[Typography] renders its article landmark wrapper', async ({ page }) => {
  await expect(page.locator('article.ccui-typography')).toBeVisible()
})

test('[Typography] groups all four typography subcomponents', async ({ page }) => {
  await expect(page.locator('article.ccui-typography').locator('.ccui-typography')).toHaveCount(4)
})

test('[Title] maps level three to an h3 element', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 3, name: 'Typography title' })).toBeVisible()
})

test('[Title] retains the shared typography class', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Typography title' })).toHaveClass(/ccui-typography/)
})

test('[Text] renders strong decoration around its content', async ({ page }) => {
  await expect(page.locator('strong')).toHaveText('Strong text')
})

test('[Text] uses an inline span host', async ({ page }) => {
  await expect(page.locator('span.ccui-typography').filter({ hasText: 'Strong text' })).toBeVisible()
})

test('[Paragraph] renders the paragraph variant host', async ({ page }) => {
  await expect(page.locator('div.ccui-typography--paragraph')).toContainText('const answer = 42')
})

test('[Paragraph] wraps content in code decoration', async ({ page }) => {
  await expect(page.locator('.ccui-typography--paragraph code')).toHaveText('const answer = 42')
})

test('[Link] renders its configured target href', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Documentation link' })).toHaveAttribute('href', '#display-target')
})

test('[Link] preserves an explicit same-context target', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Documentation link' })).toHaveAttribute('target', '_self')
})

test('[Watermark] inserts a noninteractive overlay above slotted content', async ({ page }) => {
  const fixture = page.getByTestId('display-watermark')
  await expect(fixture.getByText('Protected document')).toBeVisible()
  await expect(fixture.locator('[data-ccui-watermark="1"]')).toHaveCSS('pointer-events', 'none')
})

test('[Watermark] repairs its overlay after external DOM removal', async ({ page }) => {
  const fixture = page.getByTestId('display-watermark')
  await fixture.locator('[data-ccui-watermark="1"]').evaluate((element) => element.remove())
  await expect(fixture.locator('[data-ccui-watermark="1"]')).toHaveCount(1)
})
