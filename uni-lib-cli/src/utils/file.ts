import path from 'node:path'

import fs from 'fs-extra'

import { CLI_ROOT, REPO_ROOT } from '../constants.js'

const COPY_IGNORE = new Set([
  'node_modules',
  'dist',
  'dist-ssr',
  '.git',
  '.idea',
  '.DS_Store',
  'coverage',
  '.nuxt',
  '.output',
  '.vite',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
])

/**
 * 获取模版源目录：优先 monorepo 同级目录，其次包内 templates/
 */
export async function resolveTemplateSourceDir(templateDirName: string): Promise<string> {
  const monorepoDir = path.resolve(REPO_ROOT, templateDirName)
  const bundledDir = path.resolve(CLI_ROOT, 'templates', templateDirName)

  if (await fs.pathExists(monorepoDir)) {
    return monorepoDir
  }

  if (await fs.pathExists(bundledDir)) {
    return bundledDir
  }

  throw new Error(`未找到模版目录: ${templateDirName}`)
}

/** 判断路径是否应跳过复制 */
export function shouldSkipCopyEntry(relativePath: string): boolean {
  const segments = relativePath.split(/[/\\]/)
  return segments.some((segment) => COPY_IGNORE.has(segment))
}

/** 复制模版目录到目标路径 */
export async function copyTemplate(sourceDir: string, targetDir: string): Promise<void> {
  await fs.ensureDir(targetDir)
  await fs.copy(sourceDir, targetDir, {
    filter(src) {
      const relativePath = path.relative(sourceDir, src)
      if (!relativePath) {
        return true
      }
      return !shouldSkipCopyEntry(relativePath)
    }
  })
}

/** 写入 package.json / pubspec.yaml 中的项目名称 */
export async function patchProjectName(
  targetDir: string,
  projectName: string,
  templateDirName: string
): Promise<void> {
  if (templateDirName === 'native-app') {
    await patchPubspecName(targetDir, projectName)
    return
  }

  const packageJsonPath = path.join(targetDir, 'package.json')
  if (!(await fs.pathExists(packageJsonPath))) {
    return
  }

  const packageJson = await fs.readJson(packageJsonPath)
  packageJson.name = projectName
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
}

async function patchPubspecName(targetDir: string, projectName: string): Promise<void> {
  const pubspecPath = path.join(targetDir, 'pubspec.yaml')
  if (!(await fs.pathExists(pubspecPath))) {
    return
  }

  const content = await fs.readFile(pubspecPath, 'utf8')
  const nextContent = content.replace(/^name:\s*.+$/m, `name: ${projectName}`)
  await fs.writeFile(pubspecPath, nextContent, 'utf8')
}

/** 校验项目名称 */
export function validateProjectName(name: string): string | true {
  if (!name.trim()) {
    return '项目名称不能为空'
  }

  if (!/^[a-z0-9][a-z0-9-]*$/i.test(name)) {
    return '项目名称仅支持字母、数字和中划线，且不能以中划线开头'
  }

  if (name.length > 64) {
    return '项目名称长度不能超过 64 个字符'
  }

  return true
}
