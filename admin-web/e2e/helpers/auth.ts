import CryptoJS from 'crypto-js'

import type { Page } from '@playwright/test'

const LOGIN_PASSWORD_KEY = 'unixunixunixunix'
const CAPTCHA_TYPE = 'blockPuzzle'
const CAPTCHA_MAX_DRAG = 282
const CAPTCHA_DRAG_STEP = 2

const encPwd = (password: string) => {
  const key = CryptoJS.enc.Latin1.parse(LOGIN_PASSWORD_KEY)

  return CryptoJS.AES.encrypt(password, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  }).toString()
}

export const getE2eCredentials = () => {
  const username = process.env.E2E_USERNAME ?? process.env.E2E_USER
  const password = process.env.E2E_PASSWORD ?? process.env.E2E_PASS

  if (!username || !password) {
    return null
  }

  return { username, password }
}

export const STORAGE_PREFIX = 'uni-admin-web:'

const dragCaptchaHandle = async (page: Page, dragLeft: number) => {
  const handle = page.locator('.security-verify__handle')
  const box = await handle.boundingBox()

  if (!box) {
    throw new Error('Captcha handle not visible')
  }

  const startX = box.x + box.width / 2
  const y = box.y + box.height / 2

  await page.mouse.move(startX, y)
  await page.mouse.down()
  await page.mouse.move(startX + dragLeft, y, { steps: 12 })
  await page.mouse.up()
}

/** 登录页 UI + 滑块 brute-force（每次失败会自动刷新验证码） */
export const loginViaUi = async (
  page: Page,
  credentials: { username: string; password: string }
) => {
  await page.goto('/login')
  await page.getByPlaceholder('请输入账号').fill(credentials.username)
  await page.getByPlaceholder('请输入密码').fill(credentials.password)
  await page.getByRole('button', { name: '登录' }).click()

  await page.locator('.security-verify').waitFor({ state: 'visible', timeout: 15_000 })
  await page.locator('.security-verify__handle').waitFor({ state: 'visible' })

  for (let dragLeft = 0; dragLeft <= CAPTCHA_MAX_DRAG; dragLeft += CAPTCHA_DRAG_STEP) {
    await page.waitForFunction(
      () => !document.querySelector('.security-verify .el-loading-parent--relative')
    )
    await dragCaptchaHandle(page, dragLeft)

    const leftLogin = await page
      .waitForURL((url) => !url.pathname.includes('/login'), { timeout: 4_000 })
      .then(() => true)
      .catch(() => false)

    if (leftLogin) {
      return
    }

    await page.waitForTimeout(650)
  }

  throw new Error('UI login failed: captcha not solved')
}

/** 供非 UI 场景：滑块 + OAuth（与 `src/api/modules/auth.ts` 一致） */
export const fetchAccessToken = async (options: {
  baseURL: string
  username: string
  password: string
  captchaVerification: string
}) => {
  const apiBase = `${options.baseURL.replace(/\/$/, '')}/api`
  const body = new URLSearchParams()

  body.append('username', options.username)
  body.append('password', encPwd(options.password))

  const query = new URLSearchParams({
    grant_type: 'password',
    code: options.captchaVerification,
    randomStr: CAPTCHA_TYPE
  })

  const response = await fetch(`${apiBase}/auth/oauth/token?${query.toString()}`, {
    method: 'POST',
    headers: {
      isToken: 'false',
      Authorization: 'Basic dW5pOnVuaQ==',
      'Content-Type': 'application/x-www-form-urlencoded',
      version: process.env.VITE_API_VERSION ?? 'B',
      'TENANT-ID': process.env.VITE_TENANT_ID ?? '5'
    },
    body
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OAuth login failed (${response.status}): ${detail.slice(0, 200)}`)
  }

  const result = (await response.json()) as { access_token?: string }

  if (!result.access_token) {
    throw new Error('OAuth login response missing access_token')
  }

  return result.access_token
}
