import { openFixture } from './support/open-fixture'
import { expect, test } from './support/test'

test.beforeEach(async ({ page }) => {
  await openFixture(page, 'core', 'form-fixture')
})

test('[Input,Form] forwards native name and autocomplete attributes', async ({ page }) => {
  const input = page.getByLabel('Email')
  await expect(input).toHaveAttribute('name', 'email')
  await expect(input).toHaveAttribute('autocomplete', 'email')
})

test('[Input,Form] associates its visible label with the native control', async ({ page }) => {
  const input = page.getByLabel('Email')
  await page.getByText('Email', { exact: true }).click()
  await expect(input).toBeFocused()
})

test('[Input,Form] exposes validation state and error descriptions after blur', async ({ page }) => {
  const input = page.getByLabel('Email')
  await input.focus()
  await input.blur()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  const messageId = await input.getAttribute('aria-describedby')
  expect(messageId).toBeTruthy()
  for (const id of messageId!.split(/\s+/)) {
    await expect(page.locator(`[id="${id}"]`)).toContainText('Email is required')
  }
})

test('[Input] keeps typed text through its controlled v-model binding', async ({ page }) => {
  const input = page.getByLabel('Email')
  await input.fill('person@example.com')
  await expect(input).toHaveValue('person@example.com')
  await input.blur()
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
})

test('[Input,Form,FormItem] starts without an error description before interaction', async ({ page }) => {
  const input = page.getByLabel('Email')
  await expect(input).not.toHaveAttribute('aria-invalid', /.+/)
  await expect(input).not.toHaveAttribute('aria-describedby', /.+/)
})

test('[Input,Form,FormItem] clears required validation after a valid value is entered', async ({ page }) => {
  const input = page.getByLabel('Email')
  await input.focus()
  await input.blur()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await input.fill('valid@example.com')
  await input.blur()
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('[Form,FormItem] revalidates when a previously valid field is cleared', async ({ page }) => {
  const input = page.getByLabel('Email')
  await input.fill('valid@example.com')
  await input.blur()
  await input.fill('')
  await input.blur()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
})

test('[Form,FormItem] error message is exposed as an alert after validation', async ({ page }) => {
  const input = page.getByLabel('Email')
  await input.focus()
  await input.blur()
  await expect(page.getByRole('alert')).toHaveText('Email is required')
})

test('[Form,FormItem] label for points at the concrete input id', async ({ page }) => {
  await expect(page.getByText('Email', { exact: true })).toHaveAttribute('for', 'email-input')
  await expect(page.getByLabel('Email')).toHaveAttribute('id', 'email-input')
})

test('[Form,FormItem] failed submit exposes validation DOM and failure events', async ({ page }) => {
  const fixture = page.getByTestId('workflow-form-fixture')
  const input = fixture.getByLabel('Workflow name')
  await input.fill('')
  await fixture.getByRole('button', { name: 'Submit workflow form' }).click()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await expect(fixture.getByRole('alert')).toHaveText('Name is required')
  await expect(fixture.getByTestId('workflow-submit-result')).toHaveText('failed')
  await expect(fixture.getByTestId('workflow-failure-count')).toHaveText('1')
})

test('[Form,FormItem] successful submit emits valid with the current model', async ({ page }) => {
  const fixture = page.getByTestId('workflow-form-fixture')
  const input = fixture.getByLabel('Workflow name')
  await input.fill('Released workflow')
  await fixture.getByRole('button', { name: 'Submit workflow form' }).click()
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await expect(fixture.getByRole('alert')).toHaveCount(0)
  await expect(fixture.getByTestId('workflow-model-name')).toHaveText('Released workflow')
  await expect(fixture.getByTestId('workflow-submit-result')).toHaveText('success:Released workflow')
})

test('[Form,FormItem] resetFields restores the initial model and clears validation DOM', async ({ page }) => {
  const fixture = page.getByTestId('workflow-form-fixture')
  const input = fixture.getByLabel('Workflow name')
  await input.fill('')
  await input.blur()
  await expect(fixture.getByRole('alert')).toHaveText('Name is required')
  await fixture.getByRole('button', { name: 'Reset workflow form' }).click()
  await expect(input).toHaveValue('Initial name')
  await expect(fixture.getByTestId('workflow-model-name')).toHaveText('Initial name')
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await expect(fixture.getByRole('alert')).toHaveCount(0)
})

test('[Form,FormItem] clearValidate removes error DOM without changing the model', async ({ page }) => {
  const fixture = page.getByTestId('workflow-form-fixture')
  const input = fixture.getByLabel('Workflow name')
  await input.fill('')
  await input.blur()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await fixture.getByRole('button', { name: 'Clear workflow validation' }).click()
  await expect(input).toHaveValue('')
  await expect(fixture.getByTestId('workflow-model-name')).toHaveText('')
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await expect(fixture.getByRole('alert')).toHaveCount(0)
})

test('[Form,FormItem] async rule reports rejection and later success through DOM and events', async ({ page }) => {
  const fixture = page.getByTestId('async-form-fixture')
  const input = fixture.getByLabel('Approval code')
  await input.fill('denied')
  await input.blur()
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  await expect(fixture.getByRole('alert')).toHaveText('Code rejected asynchronously')
  await expect(fixture.getByTestId('async-validation-event')).toHaveText('code:false:Code rejected asynchronously')
  await input.fill('approved')
  await input.blur()
  await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  await expect(fixture.getByRole('alert')).toHaveCount(0)
  await expect(fixture.getByTestId('async-validation-event')).toHaveText('code:true:none')
})

test('[Form,FormItem] change and blur triggers select different validation rules', async ({ page }) => {
  const fixture = page.getByTestId('trigger-form-fixture')
  const input = fixture.getByLabel('Triggered value')
  await input.fill('letters')
  await input.dispatchEvent('change')
  await expect(fixture.getByRole('alert')).toHaveText('Change requires digits')
  await expect(fixture.getByTestId('trigger-validation-event')).toHaveText('value:false:Change requires digits')
  await input.fill('')
  await input.blur()
  await expect(fixture.getByRole('alert')).toHaveText('Blur requires a value')
  await expect(fixture.getByTestId('trigger-validation-event')).toHaveText('value:false:Blur requires a value')
})

test('[Modal,Drawer] shares scroll locking and moves focus into the top overlay', async ({ page }) => {
  await page.getByTestId('open-overlays').click()
  const drawer = page.getByRole('dialog', { name: 'E2E drawer' })
  await expect(drawer).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await expect.poll(() => drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true)
})

test('[Modal,Drawer] closes only the top overlay on Escape and preserves underlying state', async ({ page }) => {
  await page.getByTestId('open-overlays').click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'E2E drawer' })).toBeHidden()
  await expect(page.getByRole('dialog', { name: 'E2E modal' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
})

test('[Table] sortable header starts with aria-sort none', async ({ page }) => {
  const ageHeader = page.getByTestId('table-fixture').getByRole('columnheader', { name: 'Age' })
  await expect(ageHeader).toHaveAttribute('tabindex', '0')
  await expect(ageHeader).toHaveAttribute('aria-sort', 'none')
})

test('[Table] Enter sorts ascending and orders rows at the lower boundary first', async ({ page }) => {
  const fixture = page.getByTestId('table-fixture')
  const ageHeader = fixture.getByRole('columnheader', { name: 'Age' })
  await ageHeader.focus()
  await page.keyboard.press('Enter')
  await expect(ageHeader).toHaveAttribute('aria-sort', 'ascending')
  await expect(fixture.locator('tbody tr td:nth-child(2)')).toHaveText(['10', '20', '30'])
})

test('[Table] repeated keyboard sorting reaches descending order', async ({ page }) => {
  const fixture = page.getByTestId('table-fixture')
  const ageHeader = fixture.getByRole('columnheader', { name: 'Age' })
  await ageHeader.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')
  await expect(ageHeader).toHaveAttribute('aria-sort', 'descending')
  await expect(fixture.locator('tbody tr td:nth-child(2)')).toHaveText(['30', '20', '10'])
})

test('[Table] third sort activation resets order and row sequence', async ({ page }) => {
  const fixture = page.getByTestId('table-fixture')
  const ageHeader = fixture.getByRole('columnheader', { name: 'Age' })
  await ageHeader.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')
  await expect(ageHeader).toHaveAttribute('aria-sort', 'none')
  await expect(fixture.locator('tbody tr td:nth-child(2)')).toHaveText(['30', '10', '20'])
})

test('[Table] renders the configured header columns', async ({ page }) => {
  const fixture = page.getByTestId('table-fixture')
  await expect(fixture.getByRole('columnheader')).toHaveCount(2)
  await expect(fixture.getByRole('columnheader', { name: 'Name' })).toBeVisible()
  await expect(fixture.getByRole('columnheader', { name: 'Age' })).toBeVisible()
})

test('[Table] renders one body row for every data source record', async ({ page }) => {
  await expect(page.getByTestId('table-fixture').locator('tbody tr')).toHaveCount(3)
})

test('[Table] preserves record-to-cell text mapping', async ({ page }) => {
  const rows = page.getByTestId('table-fixture').locator('tbody tr')
  await expect(rows.nth(0)).toContainText('Alice30')
  await expect(rows.nth(1)).toContainText('Bob10')
  await expect(rows.nth(2)).toContainText('Carol20')
})

test('[Table] mouse activation follows the same ascending sort contract', async ({ page }) => {
  const fixture = page.getByTestId('table-fixture')
  await fixture.getByRole('columnheader', { name: 'Age' }).click()
  await expect(fixture.locator('tbody tr').first()).toContainText('Bob10')
})

test('[Table] controlled row selection updates checkbox DOM, row state, and change payload', async ({ page }) => {
  const fixture = page.getByTestId('selection-table-fixture')
  const firstRowCheckbox = fixture.getByRole('checkbox', { name: 'Select row' }).first()
  await firstRowCheckbox.check()
  await expect(firstRowCheckbox).toBeChecked()
  await expect(fixture.locator('tbody tr').first()).toHaveClass(/selected/)
  await expect(fixture.getByTestId('selected-row-event')).toHaveText('1:Alice')
})

test('[Table] controlled row expansion renders details and emits record state', async ({ page }) => {
  const fixture = page.getByTestId('expandable-table-fixture')
  const expand = fixture.getByRole('button', { name: 'Expand row' }).first()
  await expand.click()
  await expect(fixture.getByRole('button', { name: 'Collapse row' }).first()).toHaveAttribute('aria-expanded', 'true')
  await expect(fixture.locator('.ccui-table__expanded-row')).toContainText('Alice profile')
  await expect(fixture.getByTestId('expanded-row-event')).toHaveText('true:Alice')
})

test('[Table] custom empty state is rendered in the table body', async ({ page }) => {
  const fixture = page.getByTestId('state-table-fixture')
  const empty = fixture.locator('.ccui-table__empty')
  await expect(empty).toBeVisible()
  await expect(empty).toHaveText('No matching records')
  await expect(empty).toHaveAttribute('colspan', '2')
})

test('[Table] loading overlay coexists with rows and can be removed', async ({ page }) => {
  const fixture = page.getByTestId('state-table-fixture')
  await fixture.getByRole('button', { name: 'Load table rows' }).click()
  await expect(fixture.locator('.ccui-table__loading')).toBeVisible()
  await expect(fixture.locator('tbody tr')).toHaveCount(3)
  await expect(fixture.locator('tbody tr').first()).toContainText('Alice30')
  await fixture.getByRole('button', { name: 'Stop table loading' }).click()
  await expect(fixture.locator('.ccui-table__loading')).toHaveCount(0)
})

test('[Table] controlled sorter updates aria, row order, and emitted sorter model', async ({ page }) => {
  const fixture = page.getByTestId('controlled-table-fixture')
  const ageHeader = fixture.getByRole('columnheader', { name: 'Controlled age' })
  await expect(ageHeader).toHaveAttribute('aria-sort', 'descending')
  await expect(fixture.locator('tbody tr td:last-child')).toHaveText(['30', '20', '10'])
  await ageHeader.click()
  await expect(ageHeader).toHaveAttribute('aria-sort', 'none')
  await expect(fixture.locator('tbody tr td:last-child')).toHaveText(['30', '10', '20'])
  await expect(fixture.getByTestId('controlled-sort-event')).toHaveText('age:null')
  await ageHeader.click()
  await expect(ageHeader).toHaveAttribute('aria-sort', 'ascending')
  await expect(fixture.locator('tbody tr td:last-child')).toHaveText(['10', '20', '30'])
  await expect(fixture.getByTestId('controlled-sort-event')).toHaveText('age:ascend')
})

test('[Table] fixed columns and scroll dimensions reach sticky component DOM', async ({ page }) => {
  const fixture = page.getByTestId('controlled-table-fixture')
  const table = fixture.locator('table')
  const headers = fixture.getByRole('columnheader')
  await expect(fixture.locator('.ccui-table')).toHaveClass(/has-fixed-left/)
  await expect(fixture.locator('.ccui-table')).toHaveClass(/has-fixed-right/)
  await expect(fixture.locator('.ccui-table__container')).toHaveCSS('max-height', '120px')
  await expect(table).toHaveCSS('min-width', '640px')
  await expect(headers.first()).toHaveCSS('position', 'sticky')
  await expect(headers.first()).toHaveCSS('left', '0px')
  await expect(headers.last()).toHaveCSS('position', 'sticky')
  await expect(headers.last()).toHaveCSS('right', '0px')
})

test('[Tabs] disabled tabs remain unavailable and cannot activate', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  const tabs = fixture.getByRole('tab')
  await expect(tabs.nth(1)).toBeDisabled()
  await tabs.nth(1).click({ force: true })
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
  await expect(fixture.getByTestId('tab-one-panel')).toBeVisible()
})

test('[Tabs] ArrowRight skips a disabled tab and updates the panel', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  const tabs = fixture.getByRole('tab')
  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
  await expect(fixture.getByTestId('tab-three-panel')).toBeVisible()
})

test('[Tabs] external model changes update selected tab and roving tabindex', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  const tabs = fixture.getByRole('tab')
  await fixture.getByTestId('activate-third-tab').click()
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.nth(2)).toHaveAttribute('tabindex', '0')
  await expect(tabs.nth(0)).toHaveAttribute('tabindex', '-1')
})

test('[Tabs,Tab] exposes a tablist containing every declared tab', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  await expect(fixture.getByRole('tablist')).toBeVisible()
  await expect(fixture.getByRole('tab')).toHaveCount(3)
})

test('[Tabs,Tab] associates the selected tab with its tabpanel', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  const tab = fixture.getByRole('tab', { name: 'One' })
  const panelId = await tab.getAttribute('aria-controls')
  expect(panelId).toBeTruthy()
  await expect(fixture.locator(`#${panelId}`)).toHaveAttribute('role', 'tabpanel')
})

test('[Tabs,Tab] End moves selection to the last enabled tab', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  await fixture.getByRole('tab', { name: 'One' }).focus()
  await page.keyboard.press('End')
  await expect(fixture.getByRole('tab', { name: 'Three' })).toHaveAttribute('aria-selected', 'true')
})

test('[Tabs,Tab] clicking an enabled tab updates selected and panel state', async ({ page }) => {
  const fixture = page.getByTestId('tabs-fixture')
  await fixture.getByRole('tab', { name: 'Three' }).click()
  await expect(fixture.getByRole('tab', { name: 'Three' })).toHaveAttribute('aria-selected', 'true')
  await expect(fixture.getByTestId('tab-three-panel')).toBeVisible()
})

test('[Upload] native file selection exposes the active file in the list', async ({ page }) => {
  const fixture = page.getByTestId('basic-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles({
    name: 'report.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('e2e upload'),
  })
  await expect(fixture.getByText('report.txt')).toBeVisible()
  await expect(fixture.getByRole('button', { name: '删除' })).toBeVisible()
})

test('[Upload] removing a file aborts its active custom request', async ({ page }) => {
  const fixture = page.getByTestId('basic-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles({
    name: 'report.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('e2e upload'),
  })
  await fixture.getByRole('button', { name: '删除' }).click()
  await expect(fixture.getByText('report.txt')).toBeHidden()
  await expect(fixture.getByTestId('upload-abort-count')).toHaveText('1')
})

test('[Upload] custom request success updates component DOM and emitted file model', async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
  const fixture = page.getByTestId('successful-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles({
    name: 'success.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('success'),
  })
  await expect(fixture.getByRole('listitem', { name: 'success.txt' })).toHaveClass(/status-done/)
  await expect(fixture.getByTestId('successful-upload-state')).toHaveText('success.txt:done:100:fixture-success')
  await expect(fixture.getByTestId('successful-request')).toHaveText('success.txt:text/plain')
})

test('[Upload] custom request failure exposes error DOM and response state', async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
  const fixture = page.getByTestId('failed-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles({
    name: 'failure.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('failure'),
  })
  await expect(fixture.getByRole('listitem', { name: 'failure.txt' })).toHaveClass(/status-error/)
  await expect(fixture.getByTestId('failed-upload-state')).toHaveText('failure.txt:error:0:fixture upload failed')
})

test('[Upload] custom request progress updates visible percentage and emitted model state', async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
  const fixture = page.getByTestId('progressing-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles({
    name: 'progress.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('progress'),
  })
  const item = fixture.getByRole('listitem', { name: 'progress.txt' })
  await expect(item).toHaveClass(/status-uploading/)
  await expect(item).toContainText('42%')
  await expect(fixture.getByTestId('progressing-upload-state')).toHaveText('progress.txt:uploading:42:')
})

test('[Upload] beforeUpload rejection emits its reason and excludes the blocked file', async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
  const fixture = page.getByTestId('guarded-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles([
    { name: 'allowed.txt', mimeType: 'text/plain', buffer: Buffer.from('allowed') },
    { name: 'secret.blocked', mimeType: 'text/plain', buffer: Buffer.from('blocked') },
  ])
  await expect(fixture.getByRole('listitem', { name: 'allowed.txt' })).toBeVisible()
  await expect(fixture.getByRole('listitem', { name: 'secret.blocked' })).toHaveCount(0)
  await expect(fixture.getByTestId('guarded-upload-count')).toHaveText('1')
  await expect(fixture.getByTestId('guarded-upload-reject')).toHaveText('secret.blocked:beforeUpload')
})

test('[Upload] maxCount keeps accepted files and emits the rejected overflow file', async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
  const fixture = page.getByTestId('limited-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles([
    { name: 'one.txt', mimeType: 'text/plain', buffer: Buffer.from('one') },
    { name: 'two.txt', mimeType: 'text/plain', buffer: Buffer.from('two') },
    { name: 'three.txt', mimeType: 'text/plain', buffer: Buffer.from('three') },
  ])
  await expect(fixture.getByRole('listitem')).toHaveCount(2)
  await expect(fixture.getByRole('listitem', { name: 'three.txt' })).toHaveCount(0)
  await expect(fixture.getByTestId('limited-upload-count')).toHaveText('2')
  await expect(fixture.getByTestId('limited-upload-reject')).toHaveText('three.txt:maxCount')
})

test('[Upload] forwards accept and multiple while preserving selected MIME types', async ({ page }) => {
  await openFixture(page, 'overlays', 'overlay-components-fixture')
  const fixture = page.getByTestId('accepted-upload-fixture')
  const input = fixture.locator('input[type="file"]')
  await expect(input).toHaveAttribute('accept', 'image/png,.txt')
  await expect(input).toHaveAttribute('multiple', '')
  await input.setInputFiles([
    { name: 'image.png', mimeType: 'image/png', buffer: Buffer.from('png') },
    { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('text') },
  ])
  await expect(fixture.getByRole('listitem')).toHaveCount(2)
  await expect(fixture.getByTestId('accepted-upload-types')).toHaveText('image/png,text/plain')
})

test('[Upload] controlled fileList survives synchronous custom request state callbacks', async ({ page }) => {
  const fixture = page.getByTestId('controlled-upload-fixture')
  await fixture.locator('input[type="file"]').setInputFiles({
    name: 'controlled.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('controlled'),
  })
  await expect(fixture.getByRole('listitem', { name: 'controlled.txt' })).toHaveClass(/status-done/)
  await expect(fixture.getByTestId('controlled-upload-state')).toHaveText('controlled.txt:done:100:controlled-success')
})

test('[Splitter,Panel] separator exposes orientation and numeric range semantics', async ({ page }) => {
  const separator = page.getByTestId('splitter-fixture').getByRole('separator').first()
  await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
  await expect(separator).toHaveAttribute('aria-valuemin', '100')
  await expect(separator).toHaveAttribute('aria-valuemax', '300')
  await expect(separator).toHaveAttribute('aria-valuenow', '200')
})

test('[Splitter,Panel] ArrowRight performs a keyboard resize step', async ({ page }) => {
  const fixture = page.getByTestId('splitter-fixture')
  const separator = fixture.getByRole('separator').first()
  await separator.focus()
  await page.keyboard.press('ArrowRight')
  await expect(separator).toHaveAttribute('aria-valuenow', '210')
  await expect(fixture.locator('.ccui-splitter-panel').first()).toHaveCSS('width', '210px')
})

test('[Splitter] Home clamps the leading panel to its minimum boundary', async ({ page }) => {
  const fixture = page.getByTestId('splitter-fixture')
  const separator = fixture.getByRole('separator').first()
  await separator.focus()
  await page.keyboard.press('Home')
  await expect(separator).toHaveAttribute('aria-valuenow', '100')
  await expect(fixture.locator('.ccui-splitter-panel').first()).toHaveCSS('width', '100px')
})

test('[Splitter] End clamps the leading panel to its maximum boundary', async ({ page }) => {
  const fixture = page.getByTestId('splitter-fixture')
  const separator = fixture.getByRole('separator').first()
  await separator.focus()
  await page.keyboard.press('End')
  await expect(separator).toHaveAttribute('aria-valuenow', '300')
  await expect(fixture.locator('.ccui-splitter-panel').first()).toHaveCSS('width', '300px')
})

test('[Splitter] separator remains keyboard focusable at panel boundaries', async ({ page }) => {
  const separator = page.getByTestId('splitter-fixture').getByRole('separator').first()
  await expect(separator).toHaveAttribute('tabindex', '0')
  await separator.focus()
  await expect(separator).toBeFocused()
})
