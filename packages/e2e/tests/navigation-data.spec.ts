import { expect, test } from './support/test'
import { openFixture } from './support/open-fixture'

test.beforeEach(async ({ page }) => {
  await openFixture(page, 'navigation-data', 'navigation-data-fixtures')
})

test('[Affix] starts in normal flow before its target scrolls', async ({ page }) => {
  const inner = page.getByTestId('affix-fixture').locator('.ccui-affix__inner')
  await expect(inner).not.toHaveClass(/fixed/)
  await expect(inner).not.toHaveCSS('position', 'fixed')
})

test('[Affix] pins to the viewport after crossing the configured offset', async ({ page }) => {
  const fixture = page.getByTestId('affix-fixture')
  await fixture.locator('#e2e-affix-scroll').evaluate((element) => {
    element.scrollTop = 210
    element.dispatchEvent(new Event('scroll'))
  })
  const inner = fixture.locator('.ccui-affix__inner')
  await expect(inner).toHaveClass(/fixed/)
  await expect(inner).toHaveCSS('position', 'fixed')
})

test('[Anchor] renders configured destinations as links', async ({ page }) => {
  const fixture = page.getByTestId('anchor-fixture')
  await expect(fixture.getByRole('link')).toHaveCount(2)
  await expect(fixture.getByRole('link', { name: 'Anchor section A' })).toHaveAttribute('href', '#e2e-anchor-a')
})

test('[Anchor] activates and scrolls to a clicked local target', async ({ page }) => {
  const fixture = page.getByTestId('anchor-fixture')
  const target = fixture.getByRole('link', { name: 'Anchor section B' })
  await target.click()
  await expect(target).toHaveClass(/active/)
  await expect
    .poll(() => fixture.locator('#e2e-anchor-scroll').evaluate((element) => element.scrollTop))
    .toBeGreaterThan(100)
})

test('[Calendar] exposes the controlled initial month and selected date', async ({ page }) => {
  const fixture = page.getByTestId('calendar-fixture')
  await expect(fixture.getByTestId('calendar-month')).toHaveText('2026-03')
  await expect(fixture.getByTestId('calendar-value')).toHaveText('2026-03-15')
})

test('[Calendar] updates month and selected day through its header and grid', async ({ page }) => {
  const fixture = page.getByTestId('calendar-fixture')
  await fixture.getByTestId('calendar-next').click()
  await expect(fixture.getByTestId('calendar-value')).toHaveText('2026-04-01')
  await fixture.locator('.current-month').filter({ hasText: /^20$/ }).click()
  await expect(fixture.getByTestId('calendar-value')).toHaveText('2026-04-20')
})

test('[Carousel] exposes region, tabs, and the initial visible panel', async ({ page }) => {
  const fixture = page.getByTestId('carousel-fixture')
  await expect(fixture.getByRole('region', { name: 'Carousel' })).toBeVisible()
  await expect(fixture.locator('[role="tabpanel"]').filter({ hasText: 'Carousel slide one' })).toHaveAttribute(
    'aria-hidden',
    'false',
  )
})

test('[Carousel] advances and synchronizes its controlled model', async ({ page }) => {
  const fixture = page.getByTestId('carousel-fixture')
  await fixture.getByRole('button', { name: 'Next slide' }).click()
  await expect(fixture.locator('[role="tabpanel"]').filter({ hasText: 'Carousel slide two' })).toHaveAttribute(
    'aria-hidden',
    'false',
  )
  await expect(fixture.getByTestId('carousel-value')).toHaveText('1')
})

test('[Carousel] wraps to the previous slide from the controlled first slide', async ({ page }) => {
  const fixture = page.getByTestId('carousel-fixture')
  await fixture.getByRole('button', { name: 'Previous slide' }).click()
  await expect(fixture.getByTestId('carousel-value')).toHaveText('2')
  await expect(fixture.locator('[role="tabpanel"]').filter({ hasText: 'Carousel slide three' })).toHaveAttribute(
    'aria-hidden',
    'false',
  )
})

test('[Carousel] indicator activation selects a specific slide', async ({ page }) => {
  const fixture = page.getByTestId('carousel-fixture')
  const third = fixture.getByRole('button', { name: 'Go to slide 3' })
  await third.click()
  await expect(third).toHaveAttribute('aria-current', 'true')
  await expect(fixture.getByTestId('carousel-value')).toHaveText('2')
})

test('[Carousel] supports ArrowRight and Home keyboard navigation', async ({ page }) => {
  const fixture = page.getByTestId('carousel-fixture')
  const carousel = fixture.getByRole('region', { name: 'Carousel' })
  await carousel.focus()
  await page.keyboard.press('ArrowRight')
  await expect(fixture.getByTestId('carousel-value')).toHaveText('1')
  await page.keyboard.press('Home')
  await expect(fixture.getByTestId('carousel-value')).toHaveText('0')
})

test('[Collapse] exposes collapsed headers as accessible buttons', async ({ page }) => {
  const fixture = page.getByTestId('regular-collapse')
  await expect(fixture.getByRole('button')).toHaveCount(3)
  await expect(fixture.getByRole('button', { name: 'Collapse panel one' })).toHaveAttribute('aria-expanded', 'false')
})

test('[Collapse] keeps a keyboard-expanded item controlled and visible', async ({ page }) => {
  const fixture = page.getByTestId('regular-collapse')
  const header = fixture.getByRole('button', { name: 'Collapse panel one' })
  await header.focus()
  await page.keyboard.press('Enter')
  await expect(header).toHaveAttribute('aria-expanded', 'true')
})

test('[CollapseItem] links each item header to its panel', async ({ page }) => {
  const fixture = page.getByTestId('regular-collapse')
  const header = fixture.getByRole('button', { name: 'Collapse panel one' })
  const controls = await header.getAttribute('aria-controls')
  expect(controls).toBeTruthy()
  await header.click()
  await expect(fixture.locator(`#${controls}`)).toHaveAttribute('role', 'region')
  await expect(fixture.locator(`#${controls}`)).toHaveAttribute('aria-labelledby', 'c-collapse-header-one')
})

test('[CollapseItem] reveals slotted item content after activation', async ({ page }) => {
  const fixture = page.getByTestId('regular-collapse')
  await fixture.getByRole('button', { name: 'Collapse panel two' }).click()
  await expect(fixture.getByRole('region', { name: 'Collapse panel two' })).toContainText('Collapse content two')
})

test('[Collapse] accordion mode closes the previous item', async ({ page }) => {
  const fixture = page.getByTestId('accordion-collapse')
  const first = fixture.getByRole('button', { name: 'Accordion one' })
  const second = fixture.getByRole('button', { name: 'Accordion two' })
  await first.click()
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await second.click()
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
})

test('[CollapseItem] disabled item ignores pointer and keyboard activation', async ({ page }) => {
  const item = page.getByTestId('regular-collapse').getByRole('button', { name: 'Collapse disabled' })
  await expect(item).toHaveAttribute('aria-disabled', 'true')
  await item.click({ force: true })
  await item.focus()
  await page.keyboard.press('Enter')
  await expect(item).toHaveAttribute('aria-expanded', 'false')
})

test('[Collapse] external model updates replace the expanded set', async ({ page }) => {
  const fixture = page.getByTestId('collapse-fixture')
  await fixture.getByTestId('regular-collapse').getByRole('button', { name: 'Collapse panel one' }).click()
  await fixture.getByTestId('collapse-external').click()
  await expect(fixture.getByRole('button', { name: 'Collapse panel one' })).toHaveAttribute('aria-expanded', 'false')
  await expect(fixture.getByRole('button', { name: 'Collapse panel two' })).toHaveAttribute('aria-expanded', 'true')
})

test('[FloatButton] renders its description and badge count', async ({ page }) => {
  const fixture = page.getByTestId('float-button-fixture')
  await expect(fixture.getByRole('button', { name: 'Fixture action' })).toBeVisible()
  await expect(fixture.locator('.ccui-float-button')).toContainText('2')
})

test('[FloatButton] emits clicks through its button semantics', async ({ page }) => {
  const fixture = page.getByTestId('float-button-fixture')
  await fixture.getByRole('button', { name: 'Fixture action' }).click()
  await expect(fixture.getByTestId('float-button-clicks')).toHaveText('1')
})

test('[BackTop] remains hidden below its visibility threshold', async ({ page }) => {
  await expect(page.getByTestId('float-button-fixture').getByRole('button', { name: 'Back to top' })).toBeHidden()
})

test('[BackTop] becomes visible and restores its element scroll target', async ({ page }) => {
  const fixture = page.getByTestId('float-button-fixture')
  const scroller = fixture.locator('#e2e-backtop-scroll')
  await scroller.evaluate((element) => {
    element.scrollTop = 160
    element.dispatchEvent(new Event('scroll'))
  })
  const backTop = fixture.getByRole('button', { name: 'Back to top' })
  await expect(backTop).toBeVisible()
  await backTop.click()
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBe(0)
})

test('[Image] loads its data source with explicit dimensions and alt text', async ({ page }) => {
  const image = page.getByTestId('image-fixture').getByRole('img', { name: 'Fixture image' })
  await expect(image).toHaveCSS('width', '160px')
  await expect
    .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
    .toBe(true)
})

test('[Image] opens its own preview and supports toolbar zoom', async ({ page }) => {
  await page.getByRole('img', { name: 'Fixture image' }).click()
  const overlay = page.locator('.ccui-image__preview-mask')
  await expect(overlay).toBeVisible()
  await overlay.getByRole('button', { name: 'zoom in' }).click()
  await expect(overlay.locator('.ccui-image__preview-img')).toHaveCSS('transform', /matrix\(1\.25/)
})

test('[Image] replaces a failed source with the configured fallback image', async ({ page }) => {
  const image = page.getByTestId('image-fixture').getByRole('img', { name: 'Fallback image' })
  await expect.poll(() => image.getAttribute('src')).toContain('data:image/svg+xml')
  await expect
    .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
    .toBe(true)
})

test('[ImagePreview] opens at the selected item and reports its counter', async ({ page }) => {
  const fixture = page.getByTestId('image-fixture')
  await fixture.getByRole('button', { name: 'Preview B' }).click()
  await expect(page.locator('.ccui-image-preview__counter')).toHaveText('2 / 3')
})

test('[ImagePreview] supports keyboard navigation and Escape dismissal', async ({ page }) => {
  await page.getByRole('button', { name: 'Preview B' }).click()
  const overlay = page.locator('.ccui-image-preview__mask')
  await page.keyboard.press('ArrowRight')
  await expect(overlay.locator('.ccui-image-preview__img')).toHaveAttribute('alt', 'Preview C')
  await page.keyboard.press('Escape')
  await expect(overlay).toBeHidden()
})

test('[ImagePreview] renders every supplied item as a keyboard-reachable thumbnail', async ({ page }) => {
  const thumbnails = page.getByTestId('image-fixture').locator('.ccui-image-preview__thumb')
  await expect(thumbnails).toHaveCount(3)
  await expect(thumbnails.first()).toHaveAttribute('tabindex', '0')
})

test('[ImagePreview] opens a thumbnail through Enter keyboard activation', async ({ page }) => {
  const thumbnail = page.getByRole('button', { name: 'Preview A' })
  await thumbnail.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.ccui-image-preview__img')).toHaveAttribute('alt', 'Preview A')
})

test('[ImagePreview] resets zoom after toolbar zoom changes', async ({ page }) => {
  await page.getByRole('button', { name: 'Preview A' }).click()
  const overlay = page.locator('.ccui-image-preview__mask')
  await overlay.getByRole('button', { name: 'zoom in' }).click()
  await overlay.getByRole('button', { name: 'reset' }).click()
  await expect(overlay.locator('.ccui-image-preview__img')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
})

test('[Masonry] distributes all items across configured columns', async ({ page }) => {
  const fixture = page.getByTestId('masonry-fixture')
  await expect(fixture.locator('.ccui-masonry__column')).toHaveCount(3)
  await expect(fixture.locator('.ccui-masonry__item')).toHaveCount(7)
})

test('[Masonry] creates three distinct nonzero geometric columns', async ({ page }) => {
  const geometry = await page
    .getByTestId('masonry-fixture')
    .locator('.ccui-masonry__column')
    .evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()).map(({ x, width }) => ({ x, width })),
    )
  expect(new Set(geometry.map(({ x }) => Math.round(x))).size).toBe(3)
  expect(geometry.every(({ width }) => width > 0)).toBe(true)
})

test('[Masonry] recomputes responsive columns after a narrow viewport resize', async ({ page }) => {
  const fixture = page.getByTestId('masonry-fixture')
  await expect(fixture.locator('.ccui-masonry__column')).toHaveCount(3)
  await page.setViewportSize({ width: 500, height: 800 })
  await expect(fixture.locator('.ccui-masonry__column')).toHaveCount(1)
  await expect(fixture.locator('.ccui-masonry__item')).toHaveCount(7)
})

test('[Masonry] keeps item rectangles non-overlapping within each column', async ({ page }) => {
  const overlaps = await page
    .getByTestId('masonry-fixture')
    .locator('.ccui-masonry__column')
    .evaluateAll((columns) =>
      columns.flatMap((column) => {
        const rects = Array.from(column.querySelectorAll('.ccui-masonry__item')).map((item) =>
          item.getBoundingClientRect(),
        )
        return rects.slice(1).map((rect, index) => rect.top < rects[index].bottom)
      }),
    )
  expect(overlaps).not.toContain(true)
})

test('[Menu] exposes vertical menu orientation and initially unselected items', async ({ page }) => {
  const fixture = page.getByTestId('menu-fixture')
  await expect(fixture.getByRole('menu').first()).toHaveAttribute('aria-orientation', 'vertical')
  await expect(fixture.getByRole('menuitem', { name: 'Menu Home' })).toHaveAttribute('aria-selected', 'false')
})

test('[Menu] synchronizes item selection and submenu expansion', async ({ page }) => {
  const fixture = page.getByTestId('menu-fixture')
  await fixture.getByRole('menuitem', { name: 'Menu Group' }).click()
  await expect(fixture.getByRole('menuitem', { name: 'Menu Group' })).toHaveAttribute('aria-expanded', 'true')
  await fixture.getByRole('menuitem', { name: 'Sub One' }).click()
  await expect(fixture.getByTestId('menu-selection')).toHaveText('sub-one')
})

test('[Menu] exposes disabled submenu items to assistive technology', async ({ page }) => {
  const fixture = page.getByTestId('menu-fixture')
  await fixture.getByRole('menuitem', { name: 'Menu Group' }).click()
  await expect(fixture.getByRole('menuitem', { name: 'Sub Disabled' })).toHaveAttribute('aria-disabled', 'true')
})

test('[Menu] selects a top-level item and updates its controlled output', async ({ page }) => {
  const fixture = page.getByTestId('menu-fixture')
  const home = fixture.getByRole('menuitem', { name: 'Menu Home' })
  await home.click()
  await expect(home).toHaveAttribute('aria-selected', 'true')
  await expect(fixture.getByTestId('menu-selection')).toHaveText('home')
})

test('[Menu] moves keyboard focus between enabled top-level items', async ({ page }) => {
  const fixture = page.getByTestId('menu-fixture')
  const home = fixture.getByRole('menuitem', { name: 'Menu Home' })
  await home.focus()
  await page.keyboard.press('ArrowDown')
  await expect(fixture.getByRole('menuitem', { name: 'Menu Group' })).toBeFocused()
})

test('[Menu] expands the focused submenu with ArrowRight', async ({ page }) => {
  const group = page.getByTestId('menu-fixture').getByRole('menuitem', { name: 'Menu Group' })
  await group.focus()
  await page.keyboard.press('ArrowRight')
  await expect(group).toHaveAttribute('aria-expanded', 'true')
})

test('[Pagination] marks the controlled current page in its navigation landmark', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  await expect(fixture.getByRole('navigation')).toBeVisible()
  await expect(fixture.getByRole('button', { name: '1', exact: true })).toHaveAttribute('aria-current', 'page')
})

test('[Pagination] updates controlled state when a page button is activated', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  await fixture.getByRole('button', { name: '3', exact: true }).click()
  await expect(fixture.getByTestId('pagination-value')).toHaveText('3')
  await expect(fixture.getByRole('button', { name: '3', exact: true })).toHaveAttribute('aria-current', 'page')
})

test('[Pagination] exposes disabled previous control at the first-page boundary', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  const previous = fixture.getByRole('button', { name: '上一页' })
  await expect(previous).toHaveAttribute('aria-disabled', 'true')
  await expect(previous).toHaveAttribute('tabindex', '-1')
})

test('[Pagination] next and previous controls synchronize the current page', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  await fixture.getByRole('button', { name: '下一页' }).click()
  await expect(fixture.getByTestId('pagination-value')).toHaveText('2')
  await fixture.getByRole('button', { name: '上一页' }).click()
  await expect(fixture.getByTestId('pagination-value')).toHaveText('1')
})

test('[Pagination] disables next at the final page boundary', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  await fixture.getByRole('button', { name: '5', exact: true }).click()
  const next = fixture.getByRole('button', { name: '下一页' })
  await expect(next).toHaveAttribute('aria-disabled', 'true')
  await expect(next).toHaveAttribute('tabindex', '-1')
})

test('[Pagination] page-size selection updates controlled size and page count', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  await fixture.locator('.ccui-pagination__size-select').selectOption('20')
  await expect(fixture.getByTestId('pagination-size')).toHaveText('20')
  await expect(fixture.getByRole('button', { name: '3', exact: true })).toBeVisible()
  await expect(fixture.getByRole('button', { name: '4', exact: true })).toHaveCount(0)
})

test('[Pagination] quick jumper clamps values to the final page', async ({ page }) => {
  const fixture = page.getByTestId('pagination-fixture')
  const jumper = fixture.locator('.ccui-pagination__jumper-input')
  await jumper.fill('99')
  await jumper.press('Enter')
  await expect(fixture.getByTestId('pagination-value')).toHaveText('5')
  await expect(jumper).toHaveValue('5')
})

test('[Table] renders body rows from its data source', async ({ page }) => {
  const fixture = page.getByTestId('declarative-table-fixture')
  await expect(fixture.locator('tbody tr')).toHaveCount(3)
  await expect(fixture.locator('tbody tr').first()).toContainText('AliceAdams30')
})

test('[Table] sorts rows and updates aria-sort through its sortable header', async ({ page }) => {
  const fixture = page.getByTestId('declarative-table-fixture')
  const age = fixture.getByRole('columnheader', { name: 'Age' })
  await age.click()
  await expect(age).toHaveAttribute('aria-sort', 'ascending')
  await expect(fixture.locator('tbody tr').first()).toContainText('BobBrown10')
})

test('[TableColumn] renders each leaf declaration as a column header', async ({ page }) => {
  const fixture = page.getByTestId('declarative-table-fixture')
  await expect(fixture.getByRole('columnheader', { name: 'First name' })).toBeVisible()
  await expect(fixture.getByRole('columnheader', { name: 'Last name' })).toBeVisible()
})

test('[TableColumn] resolves declared data indexes into cells', async ({ page }) => {
  const row = page.getByTestId('declarative-table-fixture').locator('tbody tr').nth(1)
  await expect(row.locator('td')).toHaveText(['Bob', 'Brown', '10'])
})

test('[TableColumnGroup] spans its two declared child columns', async ({ page }) => {
  await expect(page.getByRole('columnheader', { name: 'Person' })).toHaveAttribute('colspan', '2')
})

test('[TableColumnGroup] produces a two-row grouped table header', async ({ page }) => {
  await expect(page.getByTestId('declarative-table-fixture').locator('thead tr')).toHaveCount(2)
})

test('[TableSummary] renders slotted summary content after body rows', async ({ page }) => {
  const summary = page.getByTestId('table-summary-row')
  await expect(summary).toContainText('Total age60')
  await expect(summary.locator('td')).toHaveCount(2)
})

test('[TableSummary] remains stable when the body is sorted', async ({ page }) => {
  const fixture = page.getByTestId('declarative-table-fixture')
  await fixture.getByRole('columnheader', { name: 'Age' }).click()
  await expect(fixture.getByTestId('table-summary-row')).toContainText('Total age60')
})

test('[Tree] exposes tree and collapsed root treeitem semantics', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  await expect(fixture.getByRole('tree')).toBeVisible()
  await expect(fixture.getByRole('treeitem', { name: 'Tree Root' })).toHaveAttribute('aria-expanded', 'false')
})

test('[Tree] expands by keyboard and synchronizes selected child state', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  await fixture.getByRole('tree').focus()
  await page.keyboard.press('ArrowRight')
  const child = fixture.getByRole('treeitem', { name: 'Tree Child One' })
  await child.locator('.ccui-tree__content').click()
  await expect(child).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByTestId('tree-selection')).toHaveText('child-one')
})

test('[Tree] assigns correct hierarchy levels to roots and children', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  const root = fixture.getByRole('treeitem', { name: 'Tree Root' })
  await expect(root).toHaveAttribute('aria-level', '1')
  await root.focus()
  await page.keyboard.press('ArrowRight')
  await expect(fixture.getByRole('treeitem', { name: 'Tree Child One' })).toHaveAttribute('aria-level', '2')
})

test('[Tree] omits expansion state from leaf nodes', async ({ page }) => {
  await expect(page.getByTestId('basic-tree').getByRole('treeitem', { name: 'Tree Leaf' })).not.toHaveAttribute(
    'aria-expanded',
    /.+/,
  )
})

test('[Tree] moves focus to the last visible node with End', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  await fixture.getByRole('tree').focus()
  await page.keyboard.press('End')
  await expect(fixture.getByRole('treeitem', { name: 'Tree Leaf' })).toBeFocused()
})

test('[Tree] returns focus to the first node with Home', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  await fixture.getByRole('tree').focus()
  await page.keyboard.press('End')
  await page.keyboard.press('Home')
  await expect(fixture.getByRole('treeitem', { name: 'Tree Root' })).toBeFocused()
})

test('[Tree] moves into the first child when ArrowRight is pressed twice', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  const root = fixture.getByRole('treeitem', { name: 'Tree Root' })
  await root.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(fixture.getByRole('treeitem', { name: 'Tree Child One' })).toBeFocused()
})

test('[Tree] collapses an expanded parent with ArrowLeft', async ({ page }) => {
  const fixture = page.getByTestId('basic-tree')
  const root = fixture.getByRole('treeitem', { name: 'Tree Root' })
  await root.focus()
  await page.keyboard.press('ArrowRight')
  await expect(root).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('ArrowLeft')
  await expect(root).toHaveAttribute('aria-expanded', 'false')
})

test('[Tree] checkable mode updates checked state and controlled keys', async ({ page }) => {
  const fixture = page.getByTestId('advanced-tree')
  const item = fixture.getByRole('treeitem', { name: 'Check One' })
  await item.getByRole('checkbox').click()
  await expect(item.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('advanced-tree-checked')).toContainText('check-one')
})

test('[Tree] disabled nodes ignore selection and checkbox operations', async ({ page }) => {
  const fixture = page.getByTestId('advanced-tree')
  const item = fixture.getByRole('treeitem', { name: 'Check Disabled' })
  await expect(item).toHaveAttribute('aria-disabled', 'true')
  await item.locator('.ccui-tree__content').click()
  await item.getByRole('checkbox').click({ force: true })
  await expect(item).toHaveAttribute('aria-selected', 'false')
  await expect(item.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
})

test('[Tree] lazy nodes load children on first expansion only', async ({ page }) => {
  const fixture = page.getByTestId('advanced-tree')
  const lazy = fixture.getByRole('treeitem', { name: 'Lazy Root' })
  await lazy.locator('.ccui-tree__content').click()
  await expect(fixture.getByRole('treeitem', { name: 'Lazy Child' })).toBeVisible()
  await expect(page.getByTestId('tree-load-count')).toHaveText('1')
  await lazy.locator('.ccui-tree__content').click()
  await lazy.locator('.ccui-tree__content').click()
  await expect(page.getByTestId('tree-load-count')).toHaveText('1')
})

test('[Tree] filter predicate retains matching nodes and their ancestors', async ({ page }) => {
  const fixture = page.getByTestId('advanced-tree')
  await page.getByTestId('tree-filter').click()
  await expect(fixture.getByRole('treeitem', { name: 'Advanced Root' })).toBeVisible()
  await expect(fixture.getByRole('treeitem', { name: 'Filter Match' })).toBeVisible()
  await expect(fixture.getByRole('treeitem', { name: 'Check One' })).toHaveCount(0)
})

test('[Tree] external controlled updates synchronize selection and checks', async ({ page }) => {
  const fixture = page.getByTestId('advanced-tree')
  await page.getByTestId('tree-external-update').click()
  const selected = fixture.getByRole('treeitem', { name: 'Filter Match' })
  const checked = fixture.getByRole('treeitem', { name: 'Check One' }).getByRole('checkbox')
  await expect(selected).toHaveAttribute('aria-selected', 'true')
  await expect(checked).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('advanced-tree-checked')).toContainText('check-one')
})
