import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

import { getE2eCredentials } from './helpers/auth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(__dirname, '.auth/user.json')

const hasAuthenticatedState = () => {
  if (!getE2eCredentials()) {
    return false
  }

  return fs.existsSync(authFile)
}

test.describe('authenticated shell', () => {
  test.beforeEach(() => {
    test.skip(!hasAuthenticatedState(), '需配置 E2E_USERNAME / E2E_PASSWORD 并成功执行 auth.setup')
  })

  test('dashboard loads after login', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('.uni-layout').first()).toBeVisible()
  })

  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-e2e')

    await expect(page.getByText('访问的页面不存在或已被移除')).toBeVisible()
  })

  test('legacy attendance holiday flow bookmark redirects', async ({ page }) => {
    await page.goto('/attendance/holiday/flow')

    await expect(page).toHaveURL(/\/attendance\/flow/)
  })

  test('activity questionnaire design bookmark redirects to edit', async ({ page }) => {
    await page.goto('/activity/questionnaire/design/demo-id')

    await expect(page).toHaveURL(/\/activity\/questionnaire\/edit\/demo-id/)
  })
})
