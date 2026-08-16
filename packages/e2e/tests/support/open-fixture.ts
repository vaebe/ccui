import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export type FixtureName = 'core' | 'display' | 'inputs' | 'navigation-data' | 'overlays'

export async function openFixture(page: Page, fixture: FixtureName, readyTestId: string) {
  await page.goto(`/?fixture=${fixture}`)
  await expect(page.getByTestId(readyTestId)).toBeVisible()
}
