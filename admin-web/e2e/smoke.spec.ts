import { expect, test } from '@playwright/test'

test.describe('public shell', () => {
  test('login page renders username and password fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByPlaceholder('请输入账号')).toBeVisible()
    await expect(page.getByPlaceholder('请输入密码')).toBeVisible()
    await expect(page.getByRole('button', { name: /登录|login/i })).toBeVisible()
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/member/student')

    await expect(page).toHaveURL(/\/login/)
    await expect(page).toHaveURL(/redirect=/)
  })
})
