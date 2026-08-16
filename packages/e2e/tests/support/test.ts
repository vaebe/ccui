import { expect, test as base } from '@playwright/test'

export const test = base.extend<{ browserErrors: string[] }>({
  browserErrors: [
    async ({ page }, use) => {
      const browserErrors: string[] = []
      page.on('pageerror', (error) => browserErrors.push(error.stack ?? error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') {
          const location = message.location()
          browserErrors.push(`${message.text()} (${location.url}:${location.lineNumber}:${location.columnNumber})`)
        }
      })
      page.on('requestfailed', (request) => {
        if (['document', 'script', 'stylesheet'].includes(request.resourceType())) {
          browserErrors.push(
            `${request.resourceType()} request failed: ${request.url()} (${request.failure()?.errorText})`,
          )
        }
      })
      page.on('response', (response) => {
        if (
          response.status() >= 400 &&
          ['document', 'script', 'stylesheet'].includes(response.request().resourceType())
        ) {
          browserErrors.push(`${response.status()} response for ${response.url()}`)
        }
      })

      await use(browserErrors)
      if (!page.isClosed()) {
        await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())))
      }
      expect(browserErrors, 'unexpected browser errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
