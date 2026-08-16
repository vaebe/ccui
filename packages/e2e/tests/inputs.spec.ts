import { openFixture } from './support/open-fixture'
import { expect, test } from './support/test'
import type { Locator, Page } from '@playwright/test'

/** 根据触发器的 aria-controls 定位弹层，兼容内联渲染与 Teleport。 */
async function getControlledPopup(page: Page, trigger: Locator) {
  const popupId = await trigger.getAttribute('aria-controls')
  expect(popupId).toBeTruthy()
  return page.locator(`#${popupId}`)
}

test.beforeEach(async ({ page }) => {
  await openFixture(page, 'inputs', 'input-fixtures')
})

test('[AutoComplete] exposes combobox defaults', async ({ page }) => {
  const input = page.getByTestId('auto-complete-fixture').getByPlaceholder('Find fruit')
  await expect(input).toHaveAttribute('role', 'combobox')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
})

test('[AutoComplete] filters and selects with the keyboard', async ({ page }) => {
  const fixture = page.getByTestId('auto-complete-fixture')
  const input = fixture.getByPlaceholder('Find fruit')
  await input.fill('ban')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(fixture.getByTestId('auto-complete-value')).toHaveText('Banana')
})

test('[AutoComplete] closes suggestions with Escape', async ({ page }) => {
  const input = page.getByTestId('auto-complete-fixture').getByPlaceholder('Find fruit')
  await input.fill('a')
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await input.press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
})

test('[AutoComplete] follows an external controlled update', async ({ page }) => {
  const fixture = page.getByTestId('auto-complete-fixture')
  await fixture.getByTestId('auto-complete-external').click()
  await expect(fixture.getByPlaceholder('Find fruit')).toHaveValue('Cherry')
  await expect(fixture.getByTestId('auto-complete-value')).toHaveText('Cherry')
})

test('[AutoComplete] disables native editing', async ({ page }) => {
  await expect(page.getByPlaceholder('Disabled fruit')).toBeDisabled()
})

test('[Cascader] renders a controlled label path', async ({ page }) => {
  await expect(page.getByTestId('cascader-fixture').locator('input').first()).toHaveValue('Asia / China / Shanghai')
})

test('[Cascader] opens and exposes expanded state', async ({ page }) => {
  const input = page.getByTestId('cascader-fixture').locator('input').first()
  await input.click()
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('cascader-fixture').getByText('Asia', { exact: true })).toBeVisible()
})

test('[Cascader] clears a selected path', async ({ page }) => {
  const fixture = page.getByTestId('cascader-fixture')
  await fixture.locator('.ccui-cascader').first().hover()
  await fixture.locator('.ccui-cascader__clear').click()
  await expect(fixture.getByTestId('cascader-value')).toHaveText('null')
})

test('[Cascader] follows an external reset', async ({ page }) => {
  const fixture = page.getByTestId('cascader-fixture')
  await fixture.locator('.ccui-cascader').first().hover()
  await fixture.locator('.ccui-cascader__clear').click()
  await fixture.getByTestId('cascader-external').click()
  await expect(fixture.locator('input').first()).toHaveValue('Asia / China / Shanghai')
})

test('[Cascader] prevents opening while disabled', async ({ page }) => {
  const fixture = page.getByTestId('cascader-fixture')
  const input = page.getByPlaceholder('Disabled cascader')
  await expect(input).toBeDisabled()
  await input.dispatchEvent('click')
  await input.dispatchEvent('keydown', { key: 'ArrowDown' })
  await expect(input).toHaveAttribute('aria-expanded', 'false')
  await expect(fixture.locator('.ccui-cascader__dropdown')).toHaveCount(0)
  await expect(fixture.getByTestId('disabled-cascader-value')).toHaveText('null')
  await expect(fixture.getByTestId('disabled-cascader-changes')).toHaveText('0')
})

test('[CheckBox] toggles its controlled boolean', async ({ page }) => {
  const fixture = page.getByTestId('checkbox-fixture')
  await fixture.getByText('Accept terms', { exact: true }).click()
  await expect(fixture.getByTestId('checkbox-value')).toHaveText('true')
})

test('[CheckBox] reflects checked ARIA state', async ({ page }) => {
  const fixture = page.getByTestId('checkbox-fixture')
  const checkbox = fixture.getByRole('checkbox', { name: 'Accept terms' })
  await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  await fixture.getByTestId('checkbox-external').click()
  await expect(checkbox).toHaveAttribute('aria-checked', 'true')
})

test('[CheckBox] preserves state while disabled', async ({ page }) => {
  const fixture = page.getByTestId('checkbox-fixture')
  const checkbox = fixture.getByRole('checkbox', { name: 'Disabled checkbox' })
  await expect(checkbox).toBeDisabled()
  await checkbox.dispatchEvent('change')
  await expect(checkbox).not.toBeChecked()
  await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  await expect(fixture.getByTestId('disabled-checkbox-value')).toHaveText('false')
  await expect(fixture.getByTestId('disabled-checkbox-changes')).toHaveText('0')
})

test('[CheckableTag] toggles on pointer activation', async ({ page }) => {
  const fixture = page.getByTestId('checkable-tag-fixture')
  const tag = fixture.getByRole('checkbox', { name: 'Standalone tag' })
  await tag.click()
  await expect(tag).toHaveAttribute('aria-checked', 'true')
  await expect(fixture.getByTestId('tag-value')).toHaveText('true')
})

test('[CheckableTag] toggles with Space', async ({ page }) => {
  const tag = page.getByRole('checkbox', { name: 'Standalone tag' })
  await tag.press('Space')
  await expect(tag).toHaveAttribute('aria-checked', 'true')
})

test('[CheckableTag] exposes disabled semantics', async ({ page }) => {
  const tag = page.getByRole('checkbox', { name: 'Disabled tag' })
  await expect(tag).toHaveAttribute('aria-disabled', 'true')
  await expect(tag).toHaveAttribute('tabindex', '-1')
})

test('[CheckableTagGroup] renders the controlled initial selection', async ({ page }) => {
  const fixture = page.getByTestId('checkable-tag-fixture')
  await expect(fixture.getByRole('checkbox', { name: 'Vue' })).toHaveAttribute('aria-checked', 'true')
  await expect(fixture.getByTestId('tag-group-value')).toHaveText('["vue"]')
})

test('[CheckableTagGroup] appends another option', async ({ page }) => {
  const fixture = page.getByTestId('checkable-tag-fixture')
  await fixture.getByRole('checkbox', { name: 'React' }).click()
  await expect(fixture.getByTestId('tag-group-value')).toHaveText('["vue","react"]')
})

test('[CheckableTagGroup] rejects a disabled option', async ({ page }) => {
  const fixture = page.getByTestId('checkable-tag-fixture')
  const angular = fixture.getByRole('checkbox', { name: 'Angular' })
  await expect(angular).toHaveAttribute('aria-disabled', 'true')
  await angular.dispatchEvent('click')
  await angular.dispatchEvent('keydown', { key: 'Enter' })
  await expect(angular).toHaveAttribute('aria-checked', 'false')
  await expect(fixture.getByTestId('tag-group-value')).toHaveText('["vue"]')
})

test('[ColorPicker] opens an accessible color dialog', async ({ page }) => {
  const trigger = page.getByTestId('color-picker-fixture').locator('.ccui-color-picker__trigger').first()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('dialog', { name: '选择颜色' })).toBeVisible()
})

test('[ColorPicker] changes hue with an arrow key', async ({ page }) => {
  const fixture = page.getByTestId('color-picker-fixture')
  await fixture.locator('.ccui-color-picker__trigger').first().click()
  const hue = page.getByRole('slider', { name: 'hue' })
  await expect(hue).toHaveAttribute('aria-valuenow', '0')
  await hue.press('ArrowRight')
  await expect(hue).toHaveAttribute('aria-valuenow', '1')
  await expect(fixture.getByTestId('color-value')).not.toHaveText('#ff0000')
})

test('[ColorPicker] clears a controlled color', async ({ page }) => {
  const fixture = page.getByTestId('color-picker-fixture')
  await fixture.getByRole('button', { name: '清空颜色', exact: true }).click()
  await expect(fixture.getByTestId('color-value')).toHaveText('empty')
})

test('[ColorPicker] follows an external color update', async ({ page }) => {
  const fixture = page.getByTestId('color-picker-fixture')
  await fixture.getByTestId('color-external').click()
  await expect(fixture.getByTestId('color-value')).toHaveText('#0000ff')
  await expect(fixture.locator('.ccui-color-picker__value-text')).toHaveText('#0000FF')
})

test('[ColorPicker] disables its trigger', async ({ page }) => {
  await expect(page.getByTestId('color-picker-fixture').locator('.ccui-color-picker__trigger').nth(1)).toBeDisabled()
})

test('[DatePicker] displays a formatted controlled date', async ({ page }) => {
  await expect(page.getByTestId('date-fixture').locator('.ccui-date-picker__input').first()).toHaveValue('2026-07-21')
})

test('[DatePicker] opens and closes with Escape', async ({ page }) => {
  const input = page.getByTestId('date-fixture').locator('.ccui-date-picker__input').first()
  await input.click()
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await input.press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
})

test('[DatePicker] clears a date', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  await fixture.locator('.ccui-date-picker').first().hover()
  await fixture.locator('.ccui-date-picker__clear').first().click()
  await expect(fixture.getByTestId('date-value')).toHaveText('empty')
})

test('[DatePicker] follows an external date update', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  await fixture.getByTestId('date-external').click()
  await expect(fixture.locator('.ccui-date-picker__input').first()).toHaveValue('2026-08-01')
})

test('[DatePicker] disables date entry', async ({ page }) => {
  await expect(page.getByPlaceholder('Disabled date')).toBeDisabled()
})

test('[RangePicker] displays both controlled endpoints', async ({ page }) => {
  const inputs = page.getByTestId('date-fixture').locator('.ccui-range-picker').first().locator('input')
  await expect(inputs.nth(0)).toHaveValue('2026-07-20')
  await expect(inputs.nth(1)).toHaveValue('2026-07-22')
})

test('[RangePicker] exposes two date comboboxes', async ({ page }) => {
  const inputs = page.getByTestId('date-fixture').locator('.ccui-range-picker').first().locator('input')
  await expect(inputs).toHaveCount(2)
  await expect(inputs.nth(0)).toHaveAttribute('aria-haspopup', 'dialog')
  await expect(inputs.nth(1)).toHaveAttribute('aria-haspopup', 'dialog')
})

test('[RangePicker] clears both endpoints', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  await fixture.locator('.ccui-range-picker').first().hover()
  await fixture.locator('.ccui-range-picker__clear').first().click()
  await expect(fixture.getByTestId('range-value')).toHaveText('null')
})

test('[RangePicker] follows an external range update', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  await fixture.getByTestId('range-external').click()
  await expect(fixture.getByTestId('range-value')).toHaveText('["2026-08-01","2026-08-05"]')
  const inputs = fixture.locator('.ccui-range-picker').first().locator('input')
  await expect(inputs.nth(0)).toHaveValue('2026-08-01')
  await expect(inputs.nth(1)).toHaveValue('2026-08-05')
})

test('[RangePicker] disables both endpoints', async ({ page }) => {
  await expect(page.getByPlaceholder('Disabled start')).toBeDisabled()
  await expect(page.getByPlaceholder('Disabled end')).toBeDisabled()
})

test('[FormList] initializes a stable first row', async ({ page }) => {
  const fixture = page.getByTestId('form-list-fixture')
  await expect(fixture.getByTestId('form-list-row')).toHaveCount(1)
  await expect(fixture.getByTestId('form-list-value')).toHaveText('[{"value":"first"}]')
})

test('[FormList] edits a nested list value', async ({ page }) => {
  const fixture = page.getByTestId('form-list-fixture')
  await fixture.getByTestId('form-list-row').locator('input').fill('edited')
  await expect(fixture.getByTestId('form-list-value')).toHaveText('[{"value":"edited"}]')
})

test('[FormList] appends a row', async ({ page }) => {
  const fixture = page.getByTestId('form-list-fixture')
  await fixture.getByTestId('form-list-add').click()
  await expect(fixture.getByTestId('form-list-row')).toHaveCount(2)
  await expect(fixture.getByTestId('form-list-value')).toHaveText('[{"value":"first"},{"value":"new"}]')
})

test('[FormList] inserts at index zero', async ({ page }) => {
  const fixture = page.getByTestId('form-list-fixture')
  await fixture.getByTestId('form-list-insert').click()
  await expect(fixture.getByTestId('form-list-value')).toHaveText('[{"value":"inserted"},{"value":"first"}]')
})

test('[FormList] removes and reindexes rows', async ({ page }) => {
  const fixture = page.getByTestId('form-list-fixture')
  await fixture.getByTestId('form-list-add').click()
  await fixture.getByRole('button', { name: 'Remove row 1' }).click()
  await expect(fixture.getByTestId('form-list-value')).toHaveText('[{"value":"new"}]')
  await expect(fixture.getByRole('button', { name: 'Remove row 1' })).toBeVisible()
})

test('[FormList] moves a row without losing its value', async ({ page }) => {
  const fixture = page.getByTestId('form-list-fixture')
  await fixture.getByTestId('form-list-add').click()
  await fixture.getByTestId('form-list-move').click()
  await expect(fixture.getByTestId('form-list-value')).toHaveText('[{"value":"new"},{"value":"first"}]')
})

test('[FormProvider] receives a named form finish', async ({ page }) => {
  const fixture = page.getByTestId('form-provider-fixture')
  await fixture.getByRole('button', { name: 'Submit provider form' }).click()
  await expect(fixture.getByTestId('provider-value')).toHaveText('profile:{"name":"Ready"}')
})

test('[FormProvider] receives a child value change', async ({ page }) => {
  const fixture = page.getByTestId('form-provider-fixture')
  await fixture.getByLabel('Provider name').fill('Changed')
  await fixture.getByLabel('Provider name').press('Tab')
  await expect(fixture.getByTestId('provider-change')).toContainText('profile:')
  await expect(fixture.getByTestId('provider-change')).toContainText('Changed')
})

test('[FormProvider] does not finish an invalid child form', async ({ page }) => {
  const fixture = page.getByTestId('form-provider-fixture')
  await fixture.getByTestId('provider-clear').click()
  await fixture.getByRole('button', { name: 'Submit provider form' }).click()
  await expect(fixture.getByTestId('provider-value')).toHaveText('not-submitted')
  await expect(fixture.getByRole('alert')).toHaveText('Provider name required')
})

test('[FormProvider] submits externally updated child values', async ({ page }) => {
  const fixture = page.getByTestId('form-provider-fixture')
  await fixture.getByLabel('Provider name').fill('Browser')
  await fixture.getByRole('button', { name: 'Submit provider form' }).click()
  await expect(fixture.getByTestId('provider-value')).toHaveText('profile:{"name":"Browser"}')
})

test('[InputNumber] increments with ArrowUp', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await fixture.locator('.ccui-input-number').first().locator('input').press('ArrowUp')
  await expect(fixture.getByTestId('number-value')).toHaveText('3')
})

test('[InputNumber] decrements with ArrowDown', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await fixture.locator('.ccui-input-number').first().locator('input').press('ArrowDown')
  await expect(fixture.getByTestId('number-value')).toHaveText('1')
})

test('[InputNumber] clamps typed input at maximum', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  const input = fixture.locator('.ccui-input-number').first().locator('input')
  await input.fill('99')
  await input.press('Tab')
  await expect(fixture.getByTestId('number-value')).toHaveText('5')
})

test('[InputNumber] follows an external maximum update', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await fixture.getByTestId('number-external').click()
  await expect(fixture.locator('.ccui-input-number').first().locator('input')).toHaveValue('5')
})

test('[InputNumber] distinguishes disabled and readonly inputs', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await expect(fixture.locator('.ccui-input-number').nth(1).locator('input')).toBeDisabled()
  await expect(fixture.locator('.ccui-input-number').nth(2).locator('input')).toHaveAttribute('readonly', '')
})

test('[InputOtp] labels every OTP cell', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await expect(fixture.getByRole('group', { name: 'OTP input' }).first().locator('input')).toHaveCount(4)
  await expect(fixture.getByRole('textbox', { name: 'OTP input, cell 1 of 4', exact: true }).first()).toHaveAttribute(
    'autocomplete',
    'one-time-code',
  )
})

test('[InputOtp] fills and emits the complete code', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  for (let index = 1; index <= 4; index++) {
    await fixture
      .getByRole('textbox', { name: `OTP input, cell ${index} of 4`, exact: true })
      .first()
      .fill(String(index))
  }
  await expect(fixture.getByTestId('otp-value')).toHaveText('1234')
})

test('[InputOtp] advances focus after input', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await fixture.getByRole('textbox', { name: 'OTP input, cell 1 of 4', exact: true }).first().fill('1')
  await expect(fixture.getByRole('textbox', { name: 'OTP input, cell 2 of 4', exact: true }).first()).toBeFocused()
})

test('[InputOtp] follows an external code update', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await fixture.getByTestId('otp-external').click()
  await expect(fixture.getByTestId('otp-value')).toHaveText('9876')
  await expect(fixture.getByRole('textbox', { name: 'OTP input, cell 1 of 4', exact: true }).first()).toHaveValue('9')
})

test('[InputOtp] disables every OTP cell', async ({ page }) => {
  const disabledGroup = page.getByTestId('number-otp-search-fixture').getByRole('group', { name: 'OTP input' }).nth(1)
  for (const input of await disabledGroup.locator('input').all()) await expect(input).toBeDisabled()
})

test('[InputSearch] searches with Enter', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  const input = fixture.locator('.ccui-input-search').first().locator('input')
  await input.fill('browser tests')
  await input.press('Enter')
  await expect(fixture.getByTestId('search-value')).toHaveText('browser tests')
})

test('[InputSearch] searches with its button', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  await fixture.locator('.ccui-input-search').first().locator('input').fill('button query')
  await fixture.getByRole('button', { name: 'Search', exact: true }).click()
  await expect(fixture.getByTestId('search-value')).toHaveText('button query')
})

test('[InputSearch] clears its value and emits an empty search', async ({ page }) => {
  const fixture = page.getByTestId('number-otp-search-fixture')
  const input = fixture.locator('.ccui-input-search').first().locator('input')
  await input.fill('clear me')
  await fixture.getByRole('button', { name: '清除输入', exact: true }).click()
  await expect(input).toHaveValue('')
  await expect(fixture.getByTestId('search-value')).toHaveText('')
})

test('[InputSearch] disables search input and button', async ({ page }) => {
  const search = page.getByTestId('number-otp-search-fixture').locator('.ccui-input-search').nth(1)
  await expect(search.locator('input')).toBeDisabled()
})

test('[Textarea] updates multiline controlled text', async ({ page }) => {
  const fixture = page.getByTestId('textarea-mentions-fixture')
  await fixture.getByPlaceholder('Write notes').fill('one\ntwo')
  await expect(fixture.getByTestId('textarea-value')).toHaveText('one\ntwo')
})

test('[Textarea] enforces maxlength and reports count', async ({ page }) => {
  const fixture = page.getByTestId('textarea-mentions-fixture')
  const textarea = fixture.getByPlaceholder('Write notes')
  await textarea.fill('123456789012345')
  await expect(textarea).toHaveValue('123456789012')
  await expect(fixture.locator('.ccui-textarea__count')).toHaveText('12 / 12')
})

test('[Textarea] clears entered text', async ({ page }) => {
  const fixture = page.getByTestId('textarea-mentions-fixture')
  await fixture.getByPlaceholder('Write notes').fill('clear')
  await fixture.locator('.ccui-textarea').first().hover()
  await fixture.locator('.ccui-textarea__clear').click()
  await expect(fixture.getByTestId('textarea-value')).toHaveText('')
})

test('[Textarea] follows an external update', async ({ page }) => {
  const fixture = page.getByTestId('textarea-mentions-fixture')
  await fixture.getByTestId('textarea-external').click()
  await expect(fixture.getByPlaceholder('Write notes')).toHaveValue('external')
})

test('[Textarea] prevents editing while readonly', async ({ page }) => {
  const textarea = page.getByPlaceholder('Readonly notes')
  await expect(textarea).toHaveAttribute('readonly', '')
  await expect(textarea).toHaveValue('fixed')
})

test('[Mentions] exposes combobox ARIA', async ({ page }) => {
  const mentions = page.getByPlaceholder('Mention a person')
  await expect(mentions).toHaveAttribute('role', 'combobox')
  await expect(mentions).toHaveAttribute('aria-expanded', 'false')
})

test('[Mentions] filters and inserts a mention', async ({ page }) => {
  const fixture = page.getByTestId('textarea-mentions-fixture')
  const mentions = fixture.getByPlaceholder('Mention a person')
  await mentions.fill('@a')
  await mentions.press('ArrowDown')
  await mentions.press('Enter')
  await expect(fixture.getByTestId('mentions-value')).toHaveText('@alice ')
})

test('[Mentions] closes its listbox on an outside pointer', async ({ page }) => {
  const mentions = page.getByPlaceholder('Mention a person')
  await mentions.fill('@')
  await expect(mentions).toHaveAttribute('aria-expanded', 'true')
  await page.getByTestId('textarea-mentions-fixture').getByRole('heading').click()
  await expect(mentions).toHaveAttribute('aria-expanded', 'false')
})

test('[Mentions] follows an external controlled update', async ({ page }) => {
  const fixture = page.getByTestId('textarea-mentions-fixture')
  await fixture.getByTestId('mentions-external').click()
  await expect(fixture.getByPlaceholder('Mention a person')).toHaveValue('@bob ')
})

test('[Mentions] disables the textarea', async ({ page }) => {
  await expect(page.getByPlaceholder('Disabled mentions')).toBeDisabled()
})

test('[Radio] activates a standalone radio', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByText('Standalone radio', { exact: true }).click()
  await expect(fixture.getByTestId('standalone-radio-value')).toHaveText('Standalone radio')
})

test('[Radio] exposes native checked state', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const radio = fixture.getByRole('radio', { name: 'Standalone radio' })
  await fixture.getByText('Standalone radio', { exact: true }).click()
  await expect(radio).toBeChecked()
})

test('[RadioGroup] renders the initial group selection', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await expect(fixture.getByRole('radio', { name: 'Alpha' })).toBeChecked()
  await expect(fixture.getByTestId('radio-value')).toHaveText('alpha')
})

test('[RadioGroup] changes group selection', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByText('Beta', { exact: true }).click()
  await expect(fixture.getByRole('radio', { name: 'Beta' })).toBeChecked()
  await expect(fixture.getByTestId('radio-value')).toHaveText('beta')
})

test('[RadioGroup] rejects a disabled radio', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const gamma = fixture.getByRole('radio', { name: 'Gamma' })
  await expect(gamma).toBeDisabled()
  await gamma.dispatchEvent('change')
  await expect(gamma).not.toBeChecked()
  await expect(fixture.getByTestId('radio-value')).toHaveText('alpha')
})

test('[Rate] selects a star rating', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByRole('radiogroup', { name: 'rate' }).first().getByRole('radio', { name: '3 stars' }).click()
  await expect(fixture.getByTestId('rate-value')).toHaveText('3')
})

test('[Rate] follows an external rating update', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByTestId('rate-external').click()
  await expect(fixture.getByTestId('rate-value')).toHaveText('5')
  await expect(
    fixture.getByRole('radiogroup', { name: 'rate' }).first().getByRole('radio', { name: '5 stars' }),
  ).toHaveAttribute('aria-checked', 'true')
})

test('[Rate] marks readonly stars as disabled', async ({ page }) => {
  const readonly = page.getByTestId('choice-fixture').getByRole('radiogroup', { name: 'rate' }).nth(1)
  await expect(readonly).toHaveAttribute('aria-readonly', 'true')
  await expect(readonly.getByRole('radio', { name: '4 stars' })).toHaveAttribute('aria-disabled', 'true')
})

test('[Segmented] renders an initial checked option', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await expect(fixture.locator('.ccui-segmented').getByRole('radio', { name: 'daily' })).toBeChecked()
})

test('[Segmented] switches options by visible label', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByText('weekly', { exact: true }).click()
  await expect(fixture.getByTestId('segmented-value')).toHaveText('weekly')
})

test('[Segmented] disables an individual option', async ({ page }) => {
  await expect(
    page.getByTestId('choice-fixture').locator('.ccui-segmented').getByRole('radio', { name: 'monthly' }),
  ).toBeDisabled()
})

test('[Segmented] follows an external selected value', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByTestId('segmented-external').click()
  await expect(fixture.locator('.ccui-segmented').getByRole('radio', { name: 'weekly' })).toBeChecked()
})

test('[Select] exposes collapsed combobox semantics', async ({ page }) => {
  const select = page.getByTestId('choice-fixture').locator('.ccui-select').first()
  await expect(select).toHaveAttribute('role', 'combobox')
  await expect(select).toHaveAttribute('aria-expanded', 'false')
})

test('[Select] opens and selects an option', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const select = fixture.locator('.ccui-select').first()
  await select.click()
  await expect(select).toHaveAttribute('aria-expanded', 'true')
  await fixture.getByRole('option', { name: 'Large' }).click()
  await expect(fixture.getByTestId('select-value')).toHaveText('large')
})

test('[Select] rejects a disabled option', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const select = fixture.locator('.ccui-select').first()
  await select.click()
  const option = fixture.getByRole('option', { name: 'Medium disabled' })
  await expect(option).toHaveAttribute('aria-disabled', 'true')
  await option.dispatchEvent('click')
  await expect(fixture.getByTestId('select-value')).toHaveText('')
  await expect(select).toHaveAttribute('aria-expanded', 'true')
})

test('[Select] follows an external controlled update', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByTestId('select-external').click()
  await expect(fixture.getByTestId('select-value')).toHaveText('small')
  await expect(fixture.locator('.ccui-select').first().locator('.ccui-select__selection')).toContainText('Small')
})

test('[Select] clears a selected option', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByTestId('select-external').click()
  await fixture.locator('.ccui-select').first().hover()
  await fixture.locator('.ccui-select__clear').click()
  await expect(fixture.getByTestId('select-value')).toHaveText('')
})

test('[Select] prevents focus interaction while disabled', async ({ page }) => {
  const select = page.getByTestId('choice-fixture').locator('.ccui-select[aria-disabled="true"]')
  await expect(select).toHaveAttribute('aria-disabled', 'true')
  await expect(select).not.toHaveAttribute('tabindex', '0')
})

test('[Select] navigates enabled options with the keyboard', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const select = fixture.locator('.ccui-select').first()
  await select.focus()
  await select.press('ArrowDown')
  await expect(select).toHaveAttribute('aria-expanded', 'true')
  const largeOption = fixture.getByRole('option', { name: 'Large' })
  expect(await select.getAttribute('aria-activedescendant')).toBe(await largeOption.getAttribute('id'))
  await select.press('Enter')
  await expect(select).toHaveAttribute('aria-expanded', 'false')
  await expect(fixture.getByTestId('select-value')).toHaveText('large')
})

test('[Select] filters searchable options and commits the result', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const select = fixture.getByTestId('searchable-select').locator('.ccui-select')
  await select.click()
  await select.locator('.ccui-select__search').fill('bet')
  await expect(select.getByRole('option')).toHaveCount(1)
  await expect(select.getByRole('option', { name: 'Beta choice' })).toBeVisible()
  await expect(select.getByRole('option', { name: 'Alpha choice' })).toHaveCount(0)
  await select.getByRole('option', { name: 'Beta choice' }).click()
  await expect(fixture.getByTestId('searchable-select-value')).toHaveText('beta')
})

test('[Select] keeps multiple user selections in its controlled array', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const select = fixture.getByTestId('multiple-select').locator('.ccui-select')
  await select.click()
  await select.getByRole('option', { name: 'Alpha choice' }).click()
  await select.getByRole('option', { name: 'Beta choice' }).click()
  await expect(fixture.getByTestId('multiple-select-value')).toHaveText('["alpha","beta"]')
  await expect(select.locator('.ccui-select__tag-label')).toHaveText(['Alpha choice', 'Beta choice'])
  await expect(select.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')
})

test('[Slider] exposes value and range ARIA', async ({ page }) => {
  const slider = page.getByTestId('choice-fixture').getByRole('slider', { name: 'Volume' })
  await expect(slider).toHaveAttribute('aria-valuemin', '0')
  await expect(slider).toHaveAttribute('aria-valuemax', '100')
  await expect(slider).toHaveAttribute('aria-valuenow', '20')
})

test('[Slider] increments by step with ArrowRight', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByRole('slider', { name: 'Volume' }).press('ArrowRight')
  await expect(fixture.getByTestId('slider-value')).toHaveText('30')
})

test('[Slider] decrements by step with ArrowLeft', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByRole('slider', { name: 'Volume' }).press('ArrowLeft')
  await expect(fixture.getByTestId('slider-value')).toHaveText('10')
})

test('[Slider] follows external boundary updates', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const thumb = fixture.getByRole('slider', { name: 'Volume' })
  const thumbWrapper = fixture.locator('.ccui-slider').first().locator('.ccui-slider__button-wrapper').first()
  await fixture.getByTestId('slider-min').click()
  await expect(fixture.getByTestId('slider-value')).toHaveText('0')
  await expect(thumb).toHaveAttribute('aria-valuenow', '0')
  await expect(thumbWrapper).toHaveCSS('left', '0px')
  await fixture.getByTestId('slider-max').click()
  await expect(fixture.getByTestId('slider-value')).toHaveText('100')
  await expect(thumb).toHaveAttribute('aria-valuenow', '100')
  const trackWidth = await fixture
    .locator('.ccui-slider')
    .first()
    .locator('.ccui-slider__wrapper')
    .evaluate((el) => el.getBoundingClientRect().width)
  const thumbLeft = await thumbWrapper.evaluate((el) => Number.parseFloat(getComputedStyle(el).left))
  expect(thumbLeft).toBeCloseTo(trackWidth, 0)
})

test('[Slider] exposes disabled semantics', async ({ page }) => {
  const disabled = page.getByTestId('choice-fixture').locator('.ccui-slider').nth(1)
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
})

test('[Switch] toggles checked state', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  const control = fixture.getByRole('switch').first()
  await control.click()
  await expect(control).toHaveAttribute('aria-checked', 'true')
  await expect(fixture.getByTestId('switch-value')).toHaveText('true')
})

test('[Switch] toggles with Space', async ({ page }) => {
  const control = page.getByTestId('choice-fixture').getByRole('switch').first()
  await control.press('Space')
  await expect(control).toHaveAttribute('aria-checked', 'true')
})

test('[Switch] follows an external update', async ({ page }) => {
  const fixture = page.getByTestId('choice-fixture')
  await fixture.getByTestId('switch-external').click()
  await expect(fixture.getByRole('switch').first()).toHaveAttribute('aria-checked', 'true')
})

test('[Switch] disables native activation', async ({ page }) => {
  await expect(page.getByTestId('choice-fixture').getByRole('switch').nth(1)).toBeDisabled()
})

test('[TimePicker] displays a controlled time', async ({ page }) => {
  await expect(page.getByTestId('time-fixture').locator('.ccui-time-picker__input').first()).toHaveValue('09:30:00')
})

test('[TimePicker] opens and closes with Escape', async ({ page }) => {
  const input = page.getByTestId('time-fixture').locator('.ccui-time-picker__input').first()
  await input.click()
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await page
    .getByTestId('time-fixture')
    .locator('.ccui-time-picker')
    .first()
    .locator('[role="option"][aria-selected="true"]')
    .first()
    .press('Escape')
  await expect(input).toHaveAttribute('aria-expanded', 'false')
})

test('[TimePicker] clears a selected time', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture')
  await fixture.locator('.ccui-time-picker').first().hover()
  await fixture.locator('.ccui-time-picker__clear').first().click()
  await expect(fixture.getByTestId('time-value')).toHaveText('empty')
})

test('[TimePicker] follows an external update', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture')
  await fixture.getByTestId('time-external').click()
  await expect(fixture.locator('.ccui-time-picker__input').first()).toHaveValue('10:45:30')
})

test('[TimePicker] disables time entry', async ({ page }) => {
  await expect(page.getByPlaceholder('Disabled time', { exact: true })).toBeDisabled()
})

test('[TimeRangePicker] displays both controlled endpoints', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture').locator('.ccui-time-range-picker').first()
  await expect(fixture.locator('.ccui-time-range-picker__start input')).toHaveValue('09:00:00')
  await expect(fixture.locator('.ccui-time-range-picker__end input')).toHaveValue('18:00:00')
})

test('[TimeRangePicker] exposes a separator between endpoints', async ({ page }) => {
  await expect(
    page
      .getByTestId('time-fixture')
      .locator('.ccui-time-range-picker')
      .first()
      .locator('.ccui-time-range-picker__separator'),
  ).toHaveText('~')
})

test('[TimeRangePicker] clears both endpoints', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture')
  await fixture.locator('.ccui-time-range-picker').first().hover()
  await fixture.locator('.ccui-time-range-picker__clear').first().click()
  await expect(fixture.getByTestId('time-range-value')).toHaveText('null')
})

test('[TimeRangePicker] follows an external update', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture')
  await fixture.getByTestId('time-range-external').click()
  await expect(fixture.getByTestId('time-range-value')).toHaveText('["08:00:00","12:00:00"]')
  const range = fixture.locator('.ccui-time-range-picker').first()
  await expect(range.locator('.ccui-time-range-picker__start input')).toHaveValue('08:00:00')
  await expect(range.locator('.ccui-time-range-picker__end input')).toHaveValue('12:00:00')
})

test('[TimeRangePicker] disables both endpoint inputs', async ({ page }) => {
  const disabled = page.getByPlaceholder('Disabled time range')
  await expect(disabled).toHaveCount(2)
  await expect(disabled.nth(0)).toBeDisabled()
  await expect(disabled.nth(1)).toBeDisabled()
})

test('[Transfer] exposes listbox semantics for its populated side', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.locator('.ccui-transfer').first()
  await expect(transfer.getByRole('listbox')).toHaveCount(1)
  await expect(transfer.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')
  await expect(transfer.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false')
})

test('[Transfer] selects and moves an item right', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.locator('.ccui-transfer').first()
  await transfer.getByRole('option', { name: 'Apple' }).click()
  await transfer.locator('.ccui-transfer__operation--right').click()
  await expect(fixture.getByTestId('transfer-value')).toHaveText('["apple"]')
})

test('[Transfer] moves a chosen item back left', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.locator('.ccui-transfer').first()
  await fixture.getByTestId('transfer-prepare-left').click()
  await expect(transfer.locator('.ccui-transfer__operation--left')).toBeEnabled()
  await transfer.locator('.ccui-transfer__operation--left').click()
  await expect(fixture.getByTestId('transfer-value')).toHaveText('[]')
})

test('[Transfer] follows an external target update', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  await fixture.getByTestId('transfer-external').click()
  await expect(fixture.getByTestId('transfer-value')).toHaveText('["banana"]')
  const columns = fixture.locator('.ccui-transfer').first().locator('.ccui-transfer__column')
  await expect(columns.nth(1).getByRole('option', { name: 'Banana' })).toBeVisible()
  await expect(columns.nth(0).getByRole('option', { name: 'Banana' })).toHaveCount(0)
})

test('[Transfer] prevents selecting a disabled item', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const cherry = fixture.locator('.ccui-transfer').first().getByRole('option', { name: 'Cherry' })
  await expect(cherry).toHaveAttribute('aria-disabled', 'true')
  await expect(cherry).toHaveAttribute('aria-selected', 'false')
})

test('[Transfer] filters the available list with search', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.locator('.ccui-transfer').first()
  const left = transfer.locator('.ccui-transfer__column').first()
  await transfer.locator('.ccui-transfer__search-input').first().fill('ban')
  await expect(left.getByRole('option')).toHaveCount(1)
  await expect(left.getByRole('option', { name: 'Banana' })).toBeVisible()
  await expect(left.getByRole('option', { name: 'Apple' })).toHaveCount(0)
})

test('[Transfer] selects every enabled available item from the header', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.locator('.ccui-transfer').first()
  await transfer.locator('.ccui-transfer__header-checkbox').first().check()
  await expect(fixture.getByTestId('transfer-selected-value')).toHaveText('["apple","banana"]')
  await expect(transfer.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true')
  await expect(transfer.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true')
  await expect(transfer.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-selected', 'false')
})

test('[Transfer] preserves lists models and events while disabled', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.getByTestId('disabled-transfer').locator('.ccui-transfer')
  const columns = transfer.locator('.ccui-transfer__column')
  const item = columns.nth(0).getByRole('option', { name: 'Locked item' })
  await expect(item).toHaveAttribute('aria-disabled', 'true')
  await item.dispatchEvent('click')
  await transfer.locator('.ccui-transfer__header-checkbox').first().dispatchEvent('change')
  await transfer.locator('.ccui-transfer__operation--right').dispatchEvent('click')
  await expect(fixture.getByTestId('disabled-transfer-value')).toHaveText('[]')
  await expect(fixture.getByTestId('disabled-transfer-selected-value')).toHaveText('[]')
  await expect(fixture.getByTestId('disabled-transfer-changes')).toHaveText('0')
  await expect(fixture.getByTestId('disabled-transfer-select-changes')).toHaveText('0')
  await expect(columns.nth(0).getByRole('option', { name: 'Locked item' })).toBeVisible()
  await expect(columns.nth(1).getByRole('option', { name: 'Locked item' })).toHaveCount(0)
})

test('[TreeSelect] displays a controlled tree label', async ({ page }) => {
  await expect(page.getByTestId('tree-select-fixture').locator('input').first()).toHaveValue('Leaf A')
})

test('[TreeSelect] opens an accessible tree popup', async ({ page }) => {
  const input = page.getByTestId('tree-select-fixture').locator('input').first()
  await input.click()
  await expect(input).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('tree-select-fixture').getByRole('tree')).toBeVisible()
})

test('[TreeSelect] selects another tree node', async ({ page }) => {
  const fixture = page.getByTestId('tree-select-fixture')
  await fixture.locator('input').first().click()
  await fixture.getByText('Leaf B', { exact: true }).click()
  await expect(fixture.getByTestId('tree-value')).toHaveText('leaf-b')
})

test('[TreeSelect] clears a selected node', async ({ page }) => {
  const fixture = page.getByTestId('tree-select-fixture')
  await fixture.locator('.ccui-tree-select').first().hover()
  await fixture.locator('.ccui-tree-select__clear').first().click()
  await expect(fixture.getByTestId('tree-value')).toHaveText('empty')
})

test('[TreeSelect] follows an external controlled update', async ({ page }) => {
  const fixture = page.getByTestId('tree-select-fixture')
  await fixture.getByTestId('tree-external').click()
  await expect(fixture.locator('input').first()).toHaveValue('Leaf B')
})

test('[TreeSelect] exposes disabled control semantics', async ({ page }) => {
  await expect(page.getByPlaceholder('Disabled tree')).toBeDisabled()
})

test('[TreeSelect] prevents selecting a disabled node', async ({ page }) => {
  const fixture = page.getByTestId('tree-select-fixture')
  await fixture.locator('input').first().click()
  const disabledNode = fixture.getByRole('treeitem').filter({ hasText: 'Leaf Disabled' })
  await expect(disabledNode).toHaveAttribute('aria-disabled', 'true')
  await disabledNode.locator('.ccui-tree__content').dispatchEvent('click')
  await disabledNode.focus()
  await disabledNode.press('Enter')
  await expect(fixture.getByTestId('tree-value')).toHaveText('leaf-a')
  await expect(fixture.locator('input').first()).toHaveValue('Leaf A')
})

test('[Cascader] selects a complete leaf path through columns', async ({ page }) => {
  const fixture = page.getByTestId('cascader-fixture')
  await fixture.locator('.ccui-cascader').first().hover()
  await fixture.locator('.ccui-cascader__clear').click()
  await fixture.locator('input').first().click()
  await fixture.getByText('Asia', { exact: true }).click()
  await fixture.getByText('China', { exact: true }).click()
  await fixture.getByText('Shanghai', { exact: true }).click()
  await expect(fixture.getByTestId('cascader-value')).toHaveText('["asia","china","shanghai"]')
})

test('[DatePicker] marks the controlled day selected in its grid', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  await fixture.locator('.ccui-date-picker__input').first().click()
  const selected = fixture.locator('.ccui-date-picker__cell[aria-selected="true"]')
  await expect(selected).toHaveCount(1)
  await expect(selected).toContainText('21')
})

test('[RangePicker] renders the configured separator', async ({ page }) => {
  await expect(
    page.getByTestId('date-fixture').locator('.ccui-range-picker').first().locator('.ccui-range-picker__separator'),
  ).toHaveText('~')
})

test('[Select] closes its listbox with Escape', async ({ page }) => {
  const select = page.getByTestId('choice-fixture').locator('.ccui-select').first()
  await select.click()
  await expect(select).toHaveAttribute('aria-expanded', 'true')
  await select.press('Escape')
  await expect(select).toHaveAttribute('aria-expanded', 'false')
})

test('[TimePicker] renders hour minute and second listboxes', async ({ page }) => {
  const scope = page.getByTestId('time-fixture').locator('.ccui-time-picker').first()
  const input = scope.locator('input')
  await input.click()
  const popup = await getControlledPopup(page, input)
  await expect(popup.getByRole('listbox', { name: '小时' })).toBeVisible()
  await expect(popup.getByRole('listbox', { name: '分钟' })).toBeVisible()
  await expect(popup.getByRole('listbox', { name: '秒' })).toBeVisible()
})

test('[TimeRangePicker] gives both endpoints dialog popup semantics', async ({ page }) => {
  const range = page.getByTestId('time-fixture').locator('.ccui-time-range-picker').first()
  await expect(range.locator('input')).toHaveCount(2)
  await expect(range.locator('input').nth(0)).toHaveAttribute('aria-haspopup', 'dialog')
  await expect(range.locator('input').nth(1)).toHaveAttribute('aria-haspopup', 'dialog')
})

test('[RangePicker] keeps its dual calendar panel inside a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  const range = page.getByTestId('date-fixture').locator('.ccui-range-picker').first()
  await range.locator('input').first().click()

  const geometry = await range.locator('.ccui-range-picker__panel').evaluate((panel) => {
    const rect = panel.getBoundingClientRect()
    return {
      left: rect.left,
      right: rect.right,
      viewportWidth: window.innerWidth,
      clientWidth: panel.clientWidth,
      scrollWidth: panel.scrollWidth,
    }
  })
  expect(geometry.left).toBeGreaterThanOrEqual(8)
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth - 8)
  expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth)
})

test('[Cascader] keeps all three menu levels accessible inside a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  const cascader = page.getByTestId('cascader-fixture').locator('.ccui-cascader').first()
  await cascader.locator('input').click()

  const geometry = await cascader.locator('.ccui-cascader__panel').evaluate((panel) => {
    const rect = panel.getBoundingClientRect()
    return {
      left: rect.left,
      right: rect.right,
      viewportWidth: window.innerWidth,
      clientWidth: panel.clientWidth,
      scrollWidth: panel.scrollWidth,
      columns: panel.querySelectorAll('.ccui-cascader__column').length,
    }
  })
  expect(geometry.columns).toBe(3)
  expect(geometry.left).toBeGreaterThanOrEqual(8)
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth - 8)
  expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth)
})

test('[TimeRangePicker] shrinks to the available width in a narrow form column', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.reload()

  const geometry = await page
    .getByTestId('time-fixture')
    .locator('.ccui-time-range-picker')
    .first()
    .evaluate((root) => {
      const rect = root.getBoundingClientRect()
      const parent = root.parentElement!
      const parentRect = parent.getBoundingClientRect()
      const style = getComputedStyle(parent)
      const contentRight = parentRect.right - Number.parseFloat(style.paddingRight)
      return { left: rect.left, right: rect.right, contentRight, width: rect.width }
    })
  expect(geometry.right).toBeLessThanOrEqual(geometry.contentRight)
  expect(geometry.width).toBeLessThan(320)
})

test('[Transfer] disables move operations until an item is selected', async ({ page }) => {
  const fixture = page.getByTestId('transfer-fixture')
  const transfer = fixture.locator('.ccui-transfer').first()
  await expect(transfer.locator('.ccui-transfer__operation--right')).toBeDisabled()
  await expect(transfer.locator('.ccui-transfer__operation--left')).toBeDisabled()
})

test('[Transfer] stacks its columns within the available narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()

  const transfer = page.getByTestId('transfer-fixture').locator('.ccui-transfer').first()
  await expect(transfer.locator('.ccui-transfer__operations')).toHaveCSS('flex-direction', 'row')

  const geometry = await transfer.evaluate((element) => {
    const root = element.getBoundingClientRect()
    const parent = element.parentElement!.getBoundingClientRect()
    const columns = Array.from(element.querySelectorAll('.ccui-transfer__column')).map((column) =>
      column.getBoundingClientRect(),
    )
    return {
      rootLeft: root.left,
      rootRight: root.right,
      rootWidth: root.width,
      parentWidth: parent.width,
      firstBottom: columns[0].bottom,
      secondTop: columns[1].top,
      columns: columns.map((column) => ({ left: column.left, right: column.right })),
    }
  })

  expect(geometry.rootWidth).toBeLessThanOrEqual(geometry.parentWidth)
  expect(geometry.secondTop).toBeGreaterThanOrEqual(geometry.firstBottom)
  for (const column of geometry.columns) {
    expect(column.left).toBeGreaterThanOrEqual(geometry.rootLeft)
    expect(column.right).toBeLessThanOrEqual(geometry.rootRight)
  }
})

test('[DatePicker] selects a new day and commits input plus model', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  const input = fixture.locator('.ccui-date-picker__input').first()
  await input.click()
  const day22 = fixture
    .locator('.ccui-date-picker__cell:not(.ccui-date-picker__cell--outside)')
    .filter({ hasText: /^22$/ })
    .first()
  await day22.click()
  await expect(input).toHaveValue('2026-07-22')
  await expect(fixture.getByTestId('date-value')).toHaveText('2026-07-22')
})

test('[RangePicker] selects a new complete range and commits both inputs', async ({ page }) => {
  const fixture = page.getByTestId('date-fixture')
  const range = fixture.locator('.ccui-range-picker').first()
  await range.locator('input').first().click()
  const leftPanel = range.locator('.ccui-range-picker__panel-side--left')
  await leftPanel
    .locator('.ccui-range-picker__cell:not(.ccui-range-picker__cell--outside)')
    .filter({ hasText: /^23$/ })
    .click()
  await leftPanel
    .locator('.ccui-range-picker__cell:not(.ccui-range-picker__cell--outside)')
    .filter({ hasText: /^25$/ })
    .click()
  await expect(range.locator('input').nth(0)).toHaveValue('2026-07-23')
  await expect(range.locator('input').nth(1)).toHaveValue('2026-07-25')
  await expect(fixture.getByTestId('range-value')).toHaveText('["2026-07-23","2026-07-25"]')
})

test('[TimePicker] selects a new time and commits input plus model', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture')
  const picker = fixture.locator('.ccui-time-picker').first()
  const input = picker.locator('input')
  await input.click()
  const popup = await getControlledPopup(page, input)
  await popup.getByRole('listbox', { name: '小时' }).getByRole('option', { name: '10', exact: true }).click()
  await popup.getByRole('listbox', { name: '分钟' }).getByRole('option', { name: '45', exact: true }).click()
  await popup.getByRole('listbox', { name: '秒' }).getByRole('option', { name: '30', exact: true }).click()
  await popup.locator('.ccui-time-picker__footer-btn--ok').click()
  await expect(picker.locator('input')).toHaveValue('10:45:30')
  await expect(fixture.getByTestId('time-value')).toHaveText('10:45:30')
})

test('[TimeRangePicker] selects a new start time and commits both endpoints', async ({ page }) => {
  const fixture = page.getByTestId('time-fixture')
  const range = fixture.locator('.ccui-time-range-picker').first()
  const start = range.locator('.ccui-time-range-picker__start')
  const input = start.locator('input')
  await input.click()
  const popup = await getControlledPopup(page, input)
  await popup.getByRole('listbox', { name: '小时' }).getByRole('option', { name: '10', exact: true }).click()
  await popup.locator('.ccui-time-picker__footer-btn--ok').click()
  await expect(range.locator('.ccui-time-range-picker__start input')).toHaveValue('10:00:00')
  await expect(range.locator('.ccui-time-range-picker__end input')).toHaveValue('18:00:00')
  await expect(fixture.getByTestId('time-range-value')).toHaveText('["10:00:00","18:00:00"]')
})
