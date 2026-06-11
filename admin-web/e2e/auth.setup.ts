import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test as setup, type Browser } from '@playwright/test'

import { getE2eCredentials, loginViaUi } from './helpers/auth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authDir = path.join(__dirname, '.auth')
const authFile = path.join(authDir, 'user.json')
const AUTH_MAX_AGE_MS = 4 * 60 * 60 * 1000

const canReuseAuthFile = () => {
  if (process.env.E2E_FORCE_LOGIN === 'true' || !fs.existsSync(authFile)) {
    return false
  }

  return Date.now() - fs.statSync(authFile).mtimeMs < AUTH_MAX_AGE_MS
}

const sessionStillValid = async (browser: Browser) => {
  const context = await browser.newContext({ storageState: authFile })
  const page = await context.newPage()

  try {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    return !page.url().includes('/login')
  } finally {
    await context.close()
  }
}

setup('authenticate', async ({ browser }) => {
  setup.setTimeout(600_000)
  fs.mkdirSync(authDir, { recursive: true })

  const credentials = getE2eCredentials()

  if (!credentials) {
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('/login')
    await context.storageState({ path: authFile })
    await context.close()
    setup.skip(true, '未设置 E2E_USERNAME / E2E_PASSWORD，跳过需登录用例')
    return
  }

  if (canReuseAuthFile() && (await sessionStillValid(browser))) {
    return
  }

  const context = await browser.newContext()
  const page = await context.newPage()

  await loginViaUi(page, credentials)
  await expect(page).not.toHaveURL(/\/login/)
  await context.storageState({ path: authFile })
  await context.close()
})
