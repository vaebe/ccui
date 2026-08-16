import { openFixture } from './support/open-fixture'
import { expect, test } from './support/test'

test.beforeEach(async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
})

test('[ConfigProvider] applies RTL direction to its subtree', async ({ page }) => {
  await expect(page.locator('.ccui-config-provider')).toHaveAttribute('dir', 'rtl')
})

test('[ConfigProvider] applies the configured primary color token', async ({ page }) => {
  await expect(page.locator('.ccui-config-provider')).toHaveCSS('--ccui-color-primary', '#123456')
})

test('[ConfigProvider] applies the compact control height token', async ({ page }) => {
  await expect(page.locator('.ccui-config-provider')).toHaveCSS('--ccui-control-height', '24px')
})

test('[Modal] opens with dialog semantics and an accessible title', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  const dialog = page.getByRole('dialog', { name: 'Basic modal' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
})

test('[Modal] exposes title and body through labelledby and describedby', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  const dialog = page.getByRole('dialog', { name: 'Basic modal' })
  const labelledBy = await dialog.getAttribute('aria-labelledby')
  const describedBy = await dialog.getAttribute('aria-describedby')
  await expect(page.locator(`#${labelledBy}`)).toHaveText('Basic modal')
  await expect(page.locator(`#${describedBy}`)).toContainText('Modal first action')
})

test('[Modal] updates v-model when the close button is used', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  await page.getByRole('dialog', { name: 'Basic modal' }).getByLabel('Close').click()
  await expect(page.getByTestId('modal-visible')).toHaveText('false')
})

test('[Modal] emits ok from the primary footer action', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  await page.getByRole('button', { name: 'Save modal' }).click()
  await expect(page.getByTestId('modal-result')).toHaveText('ok')
})

test('[Modal] emits cancel from the secondary footer action', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  await page.getByRole('button', { name: 'Cancel modal' }).click()
  await expect(page.getByTestId('modal-result')).toHaveText('cancel')
})

test('[Modal] closes when its mask is clicked', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  await page.locator('.ccui-modal__mask').click({ position: { x: 4, y: 4 } })
  await expect(page.getByRole('dialog', { name: 'Basic modal' })).toBeHidden()
})

test('[Modal] ignores mask clicks when maskClosable is false', async ({ page }) => {
  await page.getByTestId('open-strict-modal').click()
  await page.locator('.ccui-modal__mask').click({ position: { x: 4, y: 4 } })
  await expect(page.getByRole('dialog', { name: 'Strict modal' })).toBeVisible()
})

test('[Modal] ignores Escape when closeOnEsc is false', async ({ page }) => {
  await page.getByTestId('open-strict-modal').click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Strict modal' })).toBeVisible()
})

test('[Modal] hides both the close button and footer when configured', async ({ page }) => {
  await page.getByTestId('open-strict-modal').click()
  const dialog = page.getByRole('dialog', { name: 'Strict modal' })
  await expect(dialog.getByLabel('Close')).toHaveCount(0)
  await expect(dialog.locator('.ccui-modal__footer')).toHaveCount(0)
})

test('[Modal] destroyOnClose removes child state from the DOM', async ({ page }) => {
  await page.getByTestId('open-destroy-modal').click()
  await page.getByTestId('destroy-modal-input').fill('ephemeral')
  await page.getByRole('button', { name: 'Close destroy modal' }).click()
  await expect(page.getByTestId('destroy-modal-input')).toHaveCount(0)
})

test('[Modal] moves focus into the newly opened dialog', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  const dialog = page.getByRole('dialog', { name: 'Basic modal' })
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
})

test('[Modal] traps forward Tab navigation inside the dialog', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  const dialog = page.getByRole('dialog', { name: 'Basic modal' })
  await dialog.getByRole('button', { name: 'Save modal' }).focus()
  await page.keyboard.press('Tab')
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
})

test('[Modal] restores focus to a marked trigger after close', async ({ page }) => {
  const trigger = page.getByTestId('open-basic-modal')
  await trigger.click()
  await page.getByRole('dialog', { name: 'Basic modal' }).getByLabel('Close').click()
  await expect(trigger).toBeFocused()
})

test('[Modal] locks and restores body scrolling', async ({ page }) => {
  await page.getByTestId('open-basic-modal').click()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await page.getByRole('dialog', { name: 'Basic modal' }).getByLabel('Close').click()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('[Modal] Escape closes only the top child dialog', async ({ page }) => {
  await page.getByTestId('open-parent-modal').click()
  await page.getByRole('button', { name: 'Open child modal' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Child modal' })).toBeHidden()
  await expect(page.getByRole('dialog', { name: 'Parent modal' })).toBeVisible()
})

test('[Modal] nested dialogs keep body scroll locked after the child closes', async ({ page }) => {
  await page.getByTestId('open-parent-modal').click()
  await page.getByRole('button', { name: 'Open child modal' }).click()
  await page.keyboard.press('Escape')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
})

test('[Drawer] opens with dialog semantics and an accessible title', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  await expect(page.getByRole('dialog', { name: 'Basic drawer' })).toHaveAttribute('aria-modal', 'true')
})

test('[Drawer] applies its left placement modifier', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  await expect(page.getByRole('dialog', { name: 'Basic drawer' })).toHaveClass(/ccui-drawer--left/)
})

test('[Drawer] renders string footer content', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  await expect(page.getByRole('dialog', { name: 'Basic drawer' }).locator('.ccui-drawer__footer')).toHaveText(
    'Drawer footer',
  )
})

test('[Drawer] updates v-model when the close button is used', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  await page.getByRole('dialog', { name: 'Basic drawer' }).getByLabel('Close').click()
  await expect(page.getByTestId('drawer-visible')).toHaveText('false')
})

test('[Drawer] closes when its mask is clicked', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  await page.locator('.ccui-drawer__mask').click({ position: { x: 1200, y: 20 } })
  await expect(page.getByRole('dialog', { name: 'Basic drawer' })).toBeHidden()
})

test('[Drawer] ignores mask clicks when maskClosable is false', async ({ page }) => {
  await page.getByTestId('open-strict-drawer').click()
  // 右侧抽屉会覆盖遮罩右侧区域，应点击真实暴露的左侧遮罩。
  await page.locator('.ccui-drawer__mask').click({ position: { x: 20, y: 20 } })
  await expect(page.getByRole('dialog', { name: 'Strict drawer' })).toBeVisible()
})

test('[Drawer] ignores Escape when closeOnEsc is false', async ({ page }) => {
  await page.getByTestId('open-strict-drawer').click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Strict drawer' })).toBeVisible()
})

test('[Drawer] hides both close affordance and footer when configured', async ({ page }) => {
  await page.getByTestId('open-strict-drawer').click()
  const dialog = page.getByRole('dialog', { name: 'Strict drawer' })
  await expect(dialog.getByLabel('Close')).toHaveCount(0)
  await expect(dialog.locator('.ccui-drawer__footer')).toHaveCount(0)
})

test('[Drawer] destroyOnClose removes child state from the DOM', async ({ page }) => {
  await page.getByTestId('open-destroy-drawer').click()
  await page.getByTestId('destroy-drawer-input').fill('ephemeral')
  await page.getByRole('button', { name: 'Close destroy drawer' }).click()
  await expect(page.getByTestId('destroy-drawer-input')).toHaveCount(0)
})

test('[Drawer] moves focus into the newly opened panel', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  const dialog = page.getByRole('dialog', { name: 'Basic drawer' })
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
})

test('[Drawer] locks and restores body scrolling', async ({ page }) => {
  await page.getByTestId('open-basic-drawer').click()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await page.getByRole('dialog', { name: 'Basic drawer' }).getByLabel('Close').click()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('[Drawer] Escape closes only the top nested drawer', async ({ page }) => {
  await page.getByTestId('open-parent-drawer').click()
  await page.getByRole('button', { name: 'Open child drawer' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Child drawer' })).toBeHidden()
  await expect(page.getByRole('dialog', { name: 'Parent drawer' })).toBeVisible()
})

test('[Drawer] nested drawers retain body scroll lock after child close', async ({ page }) => {
  await page.getByTestId('open-parent-drawer').click()
  await page.getByRole('button', { name: 'Open child drawer' }).click()
  await page.keyboard.press('Escape')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
})

test('[Dropdown] exposes menu popup state from its trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open dropdown' })
  await trigger.click()
  // Popover 会把 ARIA 状态合并到实际可交互触发器。
  await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
})

test('[Dropdown] selects an item and closes its menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dropdown' }).click()
  await page.getByRole('menuitem', { name: 'Edit record' }).click()
  await expect(page.getByTestId('dropdown-selection')).toHaveText('edit')
  await expect(page.getByRole('menuitem', { name: 'Edit record' })).toBeHidden()
})

test('[Dropdown] supports keyboard item selection', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dropdown' }).click()
  const item = page.getByRole('menuitem', { name: 'Delete record' })
  await item.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('dropdown-selection')).toHaveText('delete')
})

test('[Dropdown] exposes disabled menu items and refuses their selection', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dropdown' }).click()
  const item = page.getByRole('menuitem', { name: 'Disabled record' })
  await expect(item).toHaveAttribute('aria-disabled', 'true')
  await item.click({ force: true })
  await expect(page.getByTestId('dropdown-selection')).toHaveText('none')
})

test('[Dropdown] disabled triggers do not open a menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Disabled dropdown' }).click({ force: true })
  await expect(page.getByRole('menuitem', { name: 'Edit record' })).toHaveCount(0)
})

test('[Dropdown] hover trigger opens its menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Hover dropdown' }).hover()
  await expect(page.getByRole('menuitem', { name: 'Edit record' })).toBeVisible()
})

test('[Dropdown] hideOnClick false preserves the menu after selection', async ({ page }) => {
  await page.getByRole('button', { name: 'Persistent dropdown' }).click()
  await page.getByRole('menuitem', { name: 'Edit record' }).click()
  await expect(page.getByTestId('persistent-dropdown-selection')).toHaveText('edit')
  await expect(page.getByRole('menuitem', { name: 'Edit record' })).toBeVisible()
})

test('[Dropdown] Escape closes an open dropdown', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dropdown' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menuitem', { name: 'Edit record' })).toBeHidden()
})

test('[Popover] click trigger opens an accessible dialog', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open popover' })
  await trigger.click()
  await expect(page.getByRole('dialog').filter({ hasText: 'Popover body' })).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
})

test('[Popover] follows dark-theme feedback overlay text tokens', async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--ccui-feedback-overlay-bg', 'rgba(255, 255, 255, 0.85)')
    document.documentElement.style.setProperty('--ccui-feedback-overlay-text', '#000000')
  })
  await page.getByRole('button', { name: 'Open popover' }).click()
  const popover = page.getByRole('dialog').filter({ hasText: 'Popover body' })
  await expect(popover).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.85)')
  await expect(popover).toHaveCSS('color', 'rgb(0, 0, 0)')
  await expect(popover.locator('.ccui-popover__header')).toHaveCSS('color', 'rgb(0, 0, 0)')
})

test('[Popover] Escape closes a click popover', async ({ page }) => {
  await page.getByRole('button', { name: 'Open popover' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByText('Popover body', { exact: true })).toBeHidden()
})

test('[Popover] outside click closes a click popover', async ({ page }) => {
  await page.getByRole('button', { name: 'Open popover' }).click()
  await page.getByRole('heading', { name: 'Overlay and provider components' }).click()
  await expect(page.getByText('Popover body', { exact: true })).toBeHidden()
})

test('[Popover] focus trigger opens and blur closes content', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Focus popover trigger' })
  await trigger.focus()
  await expect(page.getByText('Focus popover body', { exact: true })).toBeVisible()
  await page.getByRole('heading', { name: 'Overlay and provider components' }).click()
  await expect(page.getByText('Focus popover body', { exact: true })).toBeHidden()
})

test('[Popover] disabled trigger never opens content', async ({ page }) => {
  await page.getByRole('button', { name: 'Disabled popover trigger' }).click({ force: true })
  await expect(page.getByText('Disabled popover body', { exact: true })).toHaveCount(0)
})

test('[Popover] manual v-model opens content', async ({ page }) => {
  await page.getByRole('button', { name: 'Toggle manual popover' }).click()
  await expect(page.getByText('Manual popover body', { exact: true })).toBeVisible()
})

test('[Popover] manual v-model closes content on the second toggle', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Toggle manual popover' })
  await toggle.click()
  await toggle.click()
  await expect(page.getByText('Manual popover body', { exact: true })).toBeHidden()
})

test('[Tooltip] hover exposes a tooltip role', async ({ page }) => {
  await page.getByRole('button', { name: 'Hover for tooltip' }).hover()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Helpful tooltip' })).toBeVisible()
})

test('[Tooltip] follows dark-theme feedback overlay text tokens', async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--ccui-feedback-overlay-bg', 'rgba(255, 255, 255, 0.85)')
    document.documentElement.style.setProperty('--ccui-feedback-overlay-text', '#000000')
  })
  await page.getByRole('button', { name: 'Hover for tooltip' }).hover()
  const tooltip = page.getByRole('tooltip').filter({ hasText: 'Helpful tooltip' })
  await expect(tooltip).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.85)')
  await expect(tooltip).toHaveCSS('color', 'rgb(0, 0, 0)')
})

test('[Tooltip] trigger references the visible tooltip through describedby', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Hover for tooltip' })
  await trigger.hover()
  const tooltip = page.getByRole('tooltip').filter({ hasText: 'Helpful tooltip' })
  const tooltipId = await tooltip.getAttribute('id')
  expect(tooltipId).toBeTruthy()
  await expect(trigger.locator('..')).toHaveAttribute('aria-describedby', tooltipId!)
})

test('[Tooltip] moving away hides hover content', async ({ page }) => {
  await page.getByRole('button', { name: 'Hover for tooltip' }).hover()
  await page.getByRole('heading', { name: 'Overlay and provider components' }).hover()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Helpful tooltip' })).toBeHidden()
})

test('[Tooltip] focus trigger opens a tooltip', async ({ page }) => {
  await page.getByRole('button', { name: 'Focus tooltip trigger' }).locator('..').focus()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Focus tooltip' })).toBeVisible()
})

test('[Tooltip] click trigger toggles a tooltip', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Click tooltip trigger' })
  await trigger.click()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Click tooltip' })).toBeVisible()
  await trigger.click()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Click tooltip' })).toBeHidden()
})

test('[Tooltip] disabled trigger never opens content', async ({ page }) => {
  await page.getByRole('button', { name: 'Disabled tooltip trigger' }).hover({ force: true })
  await expect(page.getByText('Disabled tooltip', { exact: true })).toHaveCount(0)
})

test('[Tooltip] manual v-model controls visibility', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Toggle manual tooltip' })
  await toggle.click()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Manual tooltip' })).toBeVisible()
  await toggle.click()
  await expect(page.getByRole('tooltip').filter({ hasText: 'Manual tooltip' })).toBeHidden()
})

test('[Popconfirm] opens with title and description', async ({ page }) => {
  await page.getByRole('button', { name: 'Open confirmation' }).click()
  await expect(page.getByText('Delete this item?', { exact: true })).toBeVisible()
  await expect(page.getByText('This cannot be undone', { exact: true })).toBeVisible()
})

test('[Popconfirm] confirm action emits and closes', async ({ page }) => {
  await page.getByRole('button', { name: 'Open confirmation' }).click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByTestId('confirmation-result')).toHaveText('confirmed')
  await expect(page.getByText('Delete this item?', { exact: true })).toBeHidden()
})

test('[Popconfirm] cancel action emits and closes', async ({ page }) => {
  await page.getByRole('button', { name: 'Open confirmation' }).click()
  await page.getByRole('button', { name: 'Keep', exact: true }).click()
  await expect(page.getByTestId('confirmation-result')).toHaveText('cancelled')
  await expect(page.getByText('Delete this item?', { exact: true })).toBeHidden()
})

test('[Popconfirm] disabled trigger never opens confirmation', async ({ page }) => {
  await page.getByRole('button', { name: 'Disabled confirmation trigger' }).click({ force: true })
  await expect(page.getByText('Disabled confirmation', { exact: true })).toHaveCount(0)
})

test('[Popconfirm] focus trigger confirms through its action', async ({ page }) => {
  await page.getByRole('button', { name: 'Focus confirmation trigger' }).focus()
  await page.getByRole('button', { name: 'Accept focus confirmation' }).click()
  await expect(page.getByTestId('focus-confirmation-result')).toHaveText('confirmed')
})

test('[Popconfirm] focus trigger cancels through its action', async ({ page }) => {
  await page.getByRole('button', { name: 'Focus confirmation trigger' }).focus()
  await page.getByRole('button', { name: 'Reject focus confirmation' }).click()
  await expect(page.getByTestId('focus-confirmation-result')).toHaveText('cancelled')
})

for (const type of ['info', 'success', 'warning', 'error', 'loading'] as const) {
  test(`[Message] ${type} shortcut renders its typed item`, async ({ page }) => {
    await page.getByRole('button', { name: `Show ${type} message` }).click()
    await expect(page.getByText(`E2E ${type} message`, { exact: true }).locator('..').locator('..')).toHaveClass(
      new RegExp(`ccui-message__item--${type}`),
    )
  })
}

test('[Message] defaults to an assertive alert live region', async ({ page }) => {
  await page.getByRole('button', { name: 'Show info message' }).click()
  const item = page.getByRole('alert').filter({ hasText: 'E2E info message' })
  await expect(item).toHaveAttribute('aria-live', 'assertive')
})

test('[Message] supports a polite status live region', async ({ page }) => {
  await page.getByRole('button', { name: 'Show status message' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Polite message' })).toHaveAttribute('aria-live', 'polite')
})

test('[Message] supports independent top-left and bottom-right placements', async ({ page }) => {
  await page.getByRole('button', { name: 'Show message placements' }).click()
  await expect(page.locator('.ccui-message--topLeft')).toContainText('Message top left')
  await expect(page.locator('.ccui-message--bottomRight')).toContainText('Message bottom right')
})

test('[Message] maxCount ejects the oldest item', async ({ page }) => {
  await page.getByRole('button', { name: 'Show message max count' }).click()
  await expect(page.getByText('Message oldest', { exact: true })).toHaveCount(0)
  await expect(page.locator('.ccui-message__item')).toHaveCount(2)
})

test('[Message] close button invokes onClose and removes the item', async ({ page }) => {
  await page.getByRole('button', { name: 'Show closable message' }).click()
  const item = page.getByRole('alert').filter({ hasText: 'Closable message' })
  await item.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByTestId('message-close-result')).toHaveText('closed')
  await expect(item).toBeHidden()
})

test('[Message] returned handle closes only its own item', async ({ page }) => {
  await page.getByRole('button', { name: 'Show saved message' }).click()
  await page.getByRole('button', { name: 'Show success message' }).click()
  await page.getByRole('button', { name: 'Close saved message' }).click()
  await expect(page.getByText('Saved handle message', { exact: true })).toHaveCount(0)
  await expect(page.getByText('E2E success message', { exact: true })).toBeVisible()
})

test('[Message] destroy removes all placement containers', async ({ page }) => {
  await page.getByRole('button', { name: 'Show message placements' }).click()
  await page.getByRole('button', { name: 'Destroy messages' }).click()
  await expect(page.locator('.ccui-message')).toHaveCount(0)
})

for (const type of ['info', 'success', 'warning', 'error'] as const) {
  test(`[Notification] ${type} shortcut renders title and description`, async ({ page }) => {
    await page.getByRole('button', { name: `Show ${type} notification` }).click()
    const item = page.getByRole('alert').filter({ hasText: `E2E ${type} notification` })
    await expect(item).toContainText(`${type} notification body`)
    await expect(item).toHaveClass(new RegExp(`ccui-notification__item--${type}`))
  })
}

test('[Notification] defaults to an assertive atomic live region', async ({ page }) => {
  await page.getByRole('button', { name: 'Show info notification' }).click()
  const item = page.getByRole('alert').filter({ hasText: 'E2E info notification' })
  await expect(item).toHaveAttribute('aria-live', 'assertive')
  await expect(item).toHaveAttribute('aria-atomic', 'true')
})

test('[Notification] keeps symmetric inline margins on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await page.getByRole('button', { name: 'Show info notification' }).click()

  const box = await page.locator('.ccui-notification--topRight').evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return { left: rect.left, right: window.innerWidth - rect.right }
  })
  expect(box.left).toBeCloseTo(16, 0)
  expect(box.right).toBeCloseTo(16, 0)
})

test('[Notification] supports a polite status live region', async ({ page }) => {
  await page.getByRole('button', { name: 'Show status notification' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Polite notification' })).toHaveAttribute(
    'aria-live',
    'polite',
  )
})

test('[Notification] supports top-left and bottom placements', async ({ page }) => {
  await page.getByRole('button', { name: 'Show notification placements' }).click()
  await expect(page.locator('.ccui-notification--topLeft')).toContainText('Notification top left')
  await expect(page.locator('.ccui-notification--bottom')).toContainText('Notification bottom')
})

test('[Notification] maxCount ejects the oldest item', async ({ page }) => {
  await page.getByRole('button', { name: 'Show notification max count' }).click()
  await expect(page.getByText('Notification oldest', { exact: true })).toHaveCount(0)
  await expect(page.locator('.ccui-notification__item')).toHaveCount(2)
})

test('[Notification] close button invokes onClose and removes the item', async ({ page }) => {
  await page.getByRole('button', { name: 'Show closable notification' }).click()
  const item = page.getByRole('alert').filter({ hasText: 'Closable notification' })
  await item.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByTestId('notification-close-result')).toHaveText('closed')
  await expect(item).toBeHidden()
})

test('[Notification] returned handle closes only its own item', async ({ page }) => {
  await page.getByRole('button', { name: 'Show saved notification' }).click()
  await page.getByRole('button', { name: 'Show success notification' }).click()
  await page.getByRole('button', { name: 'Close saved notification' }).click()
  await expect(page.getByText('Saved handle notification', { exact: true })).toHaveCount(0)
  await expect(page.getByText('E2E success notification', { exact: true })).toBeVisible()
})

test('[Notification] destroy removes all placement containers', async ({ page }) => {
  await page.getByRole('button', { name: 'Show notification placements' }).click()
  await page.getByRole('button', { name: 'Destroy notifications' }).click()
  await expect(page.locator('.ccui-notification')).toHaveCount(0)
})
