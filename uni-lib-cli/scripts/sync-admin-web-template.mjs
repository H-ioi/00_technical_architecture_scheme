/**
 * 将 admin-web 同步到 uni-lib-cli/templates/admin-web
 * 业务页保留：工作台 dashboard、路线规划、协议管理、学生档案（含登录与基础工程配置）
 *
 * 用法（仓库根目录或 uni-lib-cli 下）：
 *   node uni-lib-cli/scripts/sync-admin-web-template.mjs
 *   npm run sync:template:admin-web --prefix uni-lib-cli
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLI_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(CLI_ROOT, '..')
const SOURCE_ROOT = path.resolve(REPO_ROOT, 'admin-web')
const TARGET_ROOT = path.resolve(CLI_ROOT, 'templates', 'admin-web')
const STATIC_DASHBOARD_DIR = path.resolve(__dirname, 'template-admin-web', 'dashboard')

/** 根目录配置文件（相对 admin-web） */
const ROOT_FILES = [
  '.env.development',
  '.env.production',
  '.env.test',
  '.gitignore',
  '.nvmrc',
  '.prettierignore',
  '.prettierrc',
  '.stylelintrc.cjs',
  'commitlint.config.cjs',
  'eslint.config.mjs',
  'index.html',
  'package.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'vite.config.local.ts',
  'vite.config.shared.ts',
  'vitest.config.ts',
  'playwright.config.ts',
  '.env.e2e.example'
]

const ROOT_DIRS = ['public', '.vscode']

const E2E_FILES = ['e2e/auth.setup.ts', 'e2e/helpers/auth.ts']

const SCRIPTS_FILES = ['scripts/scan-locale-duplicate-values.mjs', 'scripts/nest-views-scss-bem.mjs']

/** src 整目录复制 */
const SRC_DIRS = [
  'src/layouts',
  'src/views/login',
  'src/assets',
  'src/components/list-table-empty'
]

/** src 单文件 */
const SRC_FILES = [
  'src/main.ts',
  'src/App.vue',
  'src/uni.ts',
  'src/router/index.ts',
  'src/router/routes.ts',
  'src/router/modules/constant.ts',
  'src/router/modules/dashboard.ts',
  'src/locales/index.ts'
]

/** 业务示例页（整目录） */
const BUSINESS_VIEW_DIRS = [
  'src/views/school-bus/route/plan',
  'src/views/school-doctor/student-record'
]

/** 协议管理（排除未引用的 panel.vue） */
const PROTOCOL_VIEW_FILES = [
  'src/views/protocol/list.vue',
  'src/views/protocol/detail.vue',
  'src/views/protocol/dict-options.ts',
  'src/views/protocol/list.config.ts',
  'src/views/protocol/components/form.vue'
]

const API_MODULES = [
  'auth',
  'captcha',
  'menu',
  'membership',
  'school-bus-line',
  'school-bus-station',
  'school-bus-section',
  'school-bus-common',
  'protocol',
  'medical-archive',
  'medical-info',
  'school-doctor-disease-setting'
]

const TYPE_FILES = [
  'src/types/api.ts',
  'src/types/env.d.ts',
  'src/types/i18n.ts',
  'src/types/route.ts',
  'src/types/vue-router.d.ts',
  'src/types/list-table-empty.ts',
  'src/types/permission.ts',
  'src/types/modules/captcha.ts',
  'src/types/modules/menu.ts',
  'src/types/modules/membership.ts',
  'src/types/modules/school-bus-line.ts',
  'src/types/modules/school-bus-section.ts',
  'src/types/modules/school-bus-station.ts',
  'src/types/modules/protocol.ts',
  'src/types/modules/medical-archive.ts',
  'src/types/modules/medical-info.ts',
  'src/types/modules/school-doctor-disease-setting.ts',
  'src/types/components/protocol-form.ts'
]

const UTIL_FILES = [
  'src/utils/api-response-normalize.ts',
  'src/utils/school-bus.ts',
  'src/utils/download.ts'
]

const COMPOSABLE_FILES = [
  'src/composables/use-list-table-empty.ts',
  'src/composables/use-tab-query-sync.ts',
  'src/composables/use-dialog-detail-loading.ts'
]

const LOCALE_FILES = [
  'src/locales/lang/zh-CN/common.ts',
  'src/locales/lang/en/common.ts',
  'src/locales/lang/zh-CN/route.ts',
  'src/locales/lang/en/route.ts',
  'src/locales/lang/zh-CN/dashboard.ts',
  'src/locales/lang/en/dashboard.ts',
  'src/locales/lang/zh-CN/modules/school-bus.ts',
  'src/locales/lang/en/modules/school-bus.ts',
  'src/locales/lang/zh-CN/modules/protocol.ts',
  'src/locales/lang/en/modules/protocol.ts',
  'src/locales/lang/zh-CN/modules/school-doctor.ts',
  'src/locales/lang/en/modules/school-doctor.ts'
]

const TEST_FILES = [
  'src/__tests__/setup.ts',
  'src/__tests__/composables/use-list-table-empty.test.ts',
  'src/__tests__/composables/use-tab-query-sync.test.ts',
  'src/__tests__/composables/use-dialog-detail-loading.test.ts',
  'src/__tests__/utils/api-response-normalize.test.ts',
  'src/__tests__/utils/download.test.ts',
  'src/__tests__/views/protocol/dict-options.test.ts'
]

const GENERATED_STORES_INDEX = `//组件库配套的 store
export {
  defineStore,
  pinia,
  useAppStore,
  useMenuStore,
  usePermissionCodeStore,
  useRouteAccessStore,
  useUniTagsViewStore,
  useUserStore
} from 'uni-ui-lib'
`

const DASHBOARD_STATS_HINT_ZH =
  '本页为模版演示数据，仅用于 UI 展示，不发起接口请求。图表与 KPI 数值可在 static-demo-stats.ts 中调整。'
const DASHBOARD_STATS_HINT_EN =
  'Demo metrics for the template UI only — no API calls. Edit values in static-demo-stats.ts.'

const GENERATED_SMOKE_SPEC = `import { expect, test } from '@playwright/test'

test.describe('public shell', () => {
  test('login page renders username and password fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByPlaceholder('请输入账号')).toBeVisible()
    await expect(page.getByPlaceholder('请输入密码')).toBeVisible()
    await expect(page.getByRole('button', { name: /登录|login/i })).toBeVisible()
  })

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/protocol')

    await expect(page).toHaveURL(/\\/login/)
    await expect(page).toHaveURL(/redirect=/)
  })
})
`

const GENERATED_SHELL_SPEC = `import fs from 'node:fs'
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

    await expect(page).toHaveURL(/\\/dashboard/)
    await expect(page.locator('.uni-layout').first()).toBeVisible()
  })

  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-e2e')

    await expect(page.getByText('访问的页面不存在或已被移除')).toBeVisible()
  })

  test('protocol list route is reachable', async ({ page }) => {
    await page.goto('/protocol')

    await expect(page).toHaveURL(/\\/protocol/)
    await expect(page.locator('.uni-layout').first()).toBeVisible()
  })

  test('school bus route plan is reachable', async ({ page }) => {
    await page.goto('/school-bus/route/plan')

    await expect(page).toHaveURL(/\\/school-bus\\/route\\/plan/)
    await expect(page.locator('.uni-layout').first()).toBeVisible()
  })
})
`

const GENERATED_LAYOUT = `import Layout from '@/layouts/index.vue'
import type { AppRouteRecord } from '@/types/route'

import { dashboardRoute } from './dashboard'
import { protocolRoutes } from './protocol'
import { schoolBusRoute } from './school-bus'
import { schoolDoctorRoute } from './school-doctor'

/** 模版布局：工作台 + 三个业务示例页 */
export const layoutRoute: AppRouteRecord = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  meta: {
    title: '首页',
    titleKey: 'common.home',
    hidden: true
  },
  children: [dashboardRoute, schoolBusRoute, schoolDoctorRoute, ...protocolRoutes]
}
`

const GENERATED_SCHOOL_BUS = `import type { AppRouteRecord } from '@/types/route'

/** 校车管理（模版仅保留路线规划） */
export const schoolBusRoute: AppRouteRecord = {
  path: 'school-bus',
  name: 'SchoolBus',
  redirect: '/school-bus/route/plan',
  meta: {
    title: '校车管理',
    titleKey: 'route.schoolBus',
    icon: 'Van'
  },
  children: [
    {
      path: 'route',
      name: 'SchoolBusRoute',
      redirect: '/school-bus/route/plan',
      meta: {
        title: '路线管理',
        titleKey: 'route.schoolBusRoute'
      },
      children: [
        {
          path: 'plan',
          name: 'SchoolBusRoutePlan',
          component: () => import('@/views/school-bus/route/plan/tab.vue'),
          meta: {
            title: '路线规划',
            titleKey: 'route.schoolBusRoutePlan'
          }
        }
      ]
    }
  ]
}
`

const GENERATED_SCHOOL_DOCTOR = `import type { AppRouteRecord } from '@/types/route'

/** 校医管理（模版仅保留学生档案） */
export const schoolDoctorRoute: AppRouteRecord = {
  path: 'school-doctor',
  name: 'SchoolDoctor',
  redirect: '/school-doctor/student-record',
  meta: {
    title: '校医管理',
    titleKey: 'route.schoolDoctor',
    icon: 'FirstAidKit'
  },
  children: [
    {
      path: 'student-record',
      name: 'SchoolDoctorStudentRecord',
      component: () => import('@/views/school-doctor/student-record/list.vue'),
      meta: {
        title: '学生档案',
        titleKey: 'route.schoolDoctorStudentRecord'
      }
    }
  ]
}
`

const GENERATED_PROTOCOL = `import type { AppRouteRecord } from '@/types/route'

/** 协议管理（列表 + 隐藏详情） */
export const protocolRoutes: AppRouteRecord[] = [
  {
    path: 'protocol',
    name: 'Protocol',
    component: () => import('@/views/protocol/list.vue'),
    meta: {
      title: '协议管理',
      titleKey: 'route.protocol',
      icon: 'Document'
    }
  },
  {
    path: 'protocol/detail/:id',
    name: 'ProtocolDetail',
    component: () => import('@/views/protocol/detail.vue'),
    meta: {
      title: '协议详情',
      titleKey: 'route.protocolDetail',
      hidden: true,
      activeMenu: '/protocol',
      tagDetailParam: 'id'
    }
  }
]
`

function buildApiIndex() {
  const imports = API_MODULES.map((name) => {
    const varName = toCamelApiVar(name)
    return `import ${varName} from './modules/${name}'`
  })
  const exports = API_MODULES.map((name) => toCamelApiVar(name)).join(',\n  ')
  return `${imports.join('\n')}

export {
  ${exports}
}
export type { CaptchaImageData } from '@/types/modules/captcha'
`
}

function toCamelApiVar(moduleName) {
  return moduleName
    .split('-')
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('') + 'Api'
}

const GENERATED_LOCALE_ZH = `import common from './common'
import dashboard from './dashboard'
import protocol from './modules/protocol'
import schoolBus from './modules/school-bus'
import schoolDoctor from './modules/school-doctor'
import route from './route'

export default {
  app: {
    title: '智慧校园管理后台'
  },
  common,
  route,
  dashboard,
  protocol,
  schoolBus,
  schoolDoctor
}
`

const GENERATED_LOCALE_EN = `import type zhCN from '../zh-CN'

import common from './common'
import dashboard from './dashboard'
import protocol from './modules/protocol'
import schoolBus from './modules/school-bus'
import schoolDoctor from './modules/school-doctor'
import route from './route'

const en: typeof zhCN = {
  app: {
    title: 'Smart Campus Admin'
  },
  common,
  route,
  dashboard,
  protocol,
  schoolBus,
  schoolDoctor
}

export default en
`

const GENERATED_README = `# admin-web

管理后台模版项目（由 \`uni-lib-cli/scripts/sync-admin-web-template.mjs\` 从主工程同步）。

## 模版说明

保留 **工作台** + **3 个业务示例页** + 登录与基础工程配置：

| 模块 | 路由 | 说明 |
| --- | --- | --- |
| 工作台 | \`/dashboard\` | 静态演示 KPI、图表与模版页快捷入口 |
| 路线规划 | \`/school-bus/route/plan\` | 校车路线 / 学期 / 站点 Tab 列表 |
| 协议管理 | \`/protocol\` | 协议列表与详情 |
| 学生档案 | \`/school-doctor/student-record\` | 校医学生档案与抽屉详情 |

默认首页重定向至 \`/dashboard\`。

## 同步模版

在仓库根目录执行：

\`\`\`bash
npm run sync:template:admin-web --prefix uni-lib-cli
\`\`\`

## 开发

\`\`\`bash
npm install
npm run dev
npm run dev:force   # 联调 sibling uni-lib/dist
npm run type-check
npm run test:run
\`\`\`

## E2E（Playwright）

\`\`\`bash
cp .env.e2e.example .env.e2e.local   # 填写 E2E_USERNAME / E2E_PASSWORD
npm run test:e2e                      # smoke 无需账号；shell 需登录态
npm run test:e2e:ui
\`\`\`

无测试账号时仍会跑 \`smoke\` 用例；需登录的 \`shell\` 用例会自动 skip。

更多规范见仓库《前端管理后台(admin-web)构建方案.md》与 Cursor Skill **uni-review-web**。
`

async function copyRel(relPath) {
  const src = path.join(SOURCE_ROOT, relPath)
  const dest = path.join(TARGET_ROOT, relPath)
  if (!(await fs.pathExists(src))) {
    throw new Error(`源文件不存在: ${relPath}`)
  }
  await fs.ensureDir(path.dirname(dest))
  await fs.copy(src, dest)
}

async function cleanTarget() {
  if (!(await fs.pathExists(TARGET_ROOT))) {
    await fs.ensureDir(TARGET_ROOT)
    return
  }

  const preserved = new Set(['.npmrc'])
  const entries = await fs.readdir(TARGET_ROOT)

  for (const entry of entries) {
    if (preserved.has(entry)) {
      continue
    }
    await fs.remove(path.join(TARGET_ROOT, entry))
  }
}

async function writeGenerated(relativePath, content) {
  const dest = path.join(TARGET_ROOT, relativePath)
  await fs.ensureDir(path.dirname(dest))
  await fs.writeFile(dest, content, 'utf8')
}

async function copyStaticDashboard() {
  const destDir = path.join(TARGET_ROOT, 'src/views/dashboard')
  await fs.remove(destDir)
  await fs.copy(STATIC_DASHBOARD_DIR, destDir)
}

async function patchDashboardLocale() {
  for (const [rel, hint] of [
    ['src/locales/lang/zh-CN/dashboard.ts', DASHBOARD_STATS_HINT_ZH],
    ['src/locales/lang/en/dashboard.ts', DASHBOARD_STATS_HINT_EN]
  ]) {
    const filePath = path.join(TARGET_ROOT, rel)
    let content = await fs.readFile(filePath, 'utf8')
    content = content.replace(
      /statsHintBody:\s*\n\s*(['"])[\s\S]*?\1,/,
      `statsHintBody:\n    '${hint.replace(/'/g, "\\'")}',`
    )
    await fs.writeFile(filePath, content, 'utf8')
  }
}

async function patchPackageJson() {
  const pkgPath = path.join(TARGET_ROOT, 'package.json')
  const pkg = await fs.readJson(pkgPath)
  if (pkg.scripts?.['extract:legacy-isacommunity-base']) {
    delete pkg.scripts['extract:legacy-isacommunity-base']
    await fs.writeJson(pkgPath, pkg, { spaces: 2 })
  }
}

async function patchTemplateGitignore() {
  const gitignorePath = path.join(TARGET_ROOT, '.gitignore')
  let content = await fs.readFile(gitignorePath, 'utf8')
  if (!content.includes('.npmrc')) {
    content = `${content.trimEnd()}\n\n# CLI 模版本地 npm 凭据（勿提交）\n.npmrc\n`
    await fs.writeFile(gitignorePath, content, 'utf8')
  }
}

async function main() {
  if (!(await fs.pathExists(SOURCE_ROOT))) {
    throw new Error(`未找到 admin-web 源目录: ${SOURCE_ROOT}`)
  }

  console.log('清理模版目录...')
  await cleanTarget()

  console.log('复制根配置...')
  for (const file of ROOT_FILES) {
    await copyRel(file)
  }
  for (const dir of ROOT_DIRS) {
    await copyRel(dir)
  }
  for (const file of E2E_FILES) {
    await copyRel(file)
  }
  for (const file of SCRIPTS_FILES) {
    await copyRel(file)
  }

  console.log('复制 src 基础代码...')
  for (const dir of SRC_DIRS) {
    await copyRel(dir)
  }
  for (const file of SRC_FILES) {
    await copyRel(file)
  }

  console.log('复制业务示例页...')
  for (const dir of BUSINESS_VIEW_DIRS) {
    await copyRel(dir)
  }
  for (const file of PROTOCOL_VIEW_FILES) {
    await copyRel(file)
  }

  console.log('写入静态工作台...')
  await copyStaticDashboard()

  console.log('复制 API / 类型 / 工具 / composables / 国际化...')
  for (const name of API_MODULES) {
    await copyRel(`src/api/modules/${name}.ts`)
  }
  for (const file of [...TYPE_FILES, ...UTIL_FILES, ...COMPOSABLE_FILES, ...LOCALE_FILES]) {
    await copyRel(file)
  }

  console.log('复制测试与 E2E...')
  for (const file of TEST_FILES) {
    if (await fs.pathExists(path.join(SOURCE_ROOT, file))) {
      await copyRel(file)
    }
  }
  await writeGenerated('e2e/smoke.spec.ts', GENERATED_SMOKE_SPEC)
  await writeGenerated('e2e/shell.spec.ts', GENERATED_SHELL_SPEC)

  console.log('生成路由 / API / 国际化聚合...')
  await writeGenerated('src/router/modules/layout.ts', GENERATED_LAYOUT)
  await writeGenerated('src/router/modules/school-bus.ts', GENERATED_SCHOOL_BUS)
  await writeGenerated('src/router/modules/school-doctor.ts', GENERATED_SCHOOL_DOCTOR)
  await writeGenerated('src/router/modules/protocol.ts', GENERATED_PROTOCOL)
  await writeGenerated('src/api/index.ts', buildApiIndex())
  await writeGenerated('src/stores/index.ts', GENERATED_STORES_INDEX)
  await writeGenerated('src/locales/lang/zh-CN/index.ts', GENERATED_LOCALE_ZH)
  await writeGenerated('src/locales/lang/en/index.ts', GENERATED_LOCALE_EN)
  await writeGenerated('README.md', GENERATED_README)

  await patchDashboardLocale()
  await patchPackageJson()
  await patchTemplateGitignore()

  console.log('')
  console.log('✔ 同步完成')
  console.log(`  源: ${SOURCE_ROOT}`)
  console.log(`  目标: ${TARGET_ROOT}`)
  console.log('  页面: 静态工作台 · 路线规划 · 协议管理 · 学生档案')
  console.log('  测试: vitest 样例 + playwright e2e')
  console.log('')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
