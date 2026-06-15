import path from 'node:path'

import fs from 'fs-extra'
import prompts from 'prompts'

import { getTemplateById, TEMPLATE_OPTIONS } from './config/templates.js'
import type { CreateContext, CreateOptions, TemplateId } from './types.js'
import { copyTemplate, patchProjectName, resolveTemplateSourceDir, validateProjectName } from './utils/file.js'
import { printError, printSuccessGuide, printTemplateDetail, printWelcome } from './utils/logger.js'

const promptOptions = {
  onCancel: () => {
    printError('已取消创建。')
    process.exit(0)
  }
}

/** 交互式收集创建参数 */
export async function collectCreateContext(options: CreateOptions): Promise<CreateContext | null> {
  printWelcome()

  const templateId = await resolveTemplateId(options.template)
  const template = getTemplateById(templateId)
  printTemplateDetail(template)

  const projectName = await resolveProjectName(options.projectName)
  const targetPath = await resolveTargetPath(projectName, options.targetDir)

  if (await fs.pathExists(targetPath)) {
    const files = await fs.readdir(targetPath)
    if (files.length > 0 && !options.force) {
      const { overwrite } = await prompts(
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目录 ${path.basename(targetPath)} 已存在且非空，是否覆盖？`,
          initial: false
        },
        promptOptions
      )

      if (!overwrite) {
        printError('已取消创建，请换一个项目名称或目录。')
        return null
      }
    }

    await fs.remove(targetPath)
  }

  const { confirmed } = await prompts(
    {
      type: 'confirm',
      name: 'confirmed',
      message: `确认创建 ${template.shortName} 项目「${projectName}」？`,
      initial: true
    },
    promptOptions
  )

  if (!confirmed) {
    printError('已取消创建。')
    return null
  }

  return {
    projectName,
    templateId,
    targetPath
  }
}

/** 执行模版复制与后处理 */
export async function runCreate(context: CreateContext): Promise<void> {
  const template = getTemplateById(context.templateId)
  const sourceDir = await resolveTemplateSourceDir(template.dirName)

  process.stdout.write(`\n  正在创建 ${template.shortName} 项目...\n`)

  await copyTemplate(sourceDir, context.targetPath)
  await patchProjectName(context.targetPath, context.projectName, template.dirName)
  printSuccessGuide(context.projectName, context.targetPath, template)
}

async function resolveTemplateId(preset?: TemplateId): Promise<TemplateId> {
  if (preset) {
    return preset
  }

  const response = await prompts(
    {
      type: 'select',
      name: 'templateId',
      message: '请选择要创建的项目类型',
      choices: TEMPLATE_OPTIONS.map((item) => ({
        title: item.label,
        description: `${item.description} · ${item.scene}`,
        value: item.id
      }))
    },
    promptOptions
  )

  return response.templateId as TemplateId
}

async function resolveProjectName(preset?: string): Promise<string> {
  if (preset) {
    const result = validateProjectName(preset)
    if (result !== true) {
      throw new Error(result)
    }
    return preset
  }

  const response = await prompts(
    {
      type: 'text',
      name: 'projectName',
      message: '请输入项目名称（将作为目录名与 package name）',
      initial: 'my-project',
      validate(value) {
        const result = validateProjectName(value)
        return result === true ? true : result
      }
    },
    promptOptions
  )

  return response.projectName as string
}

async function resolveTargetPath(projectName: string, preset?: string): Promise<string> {
  if (preset) {
    return path.resolve(preset)
  }

  return path.resolve(process.cwd(), projectName)
}

/** 非交互模式创建 */
export async function runCreateWithOptions(options: CreateOptions): Promise<void> {
  if (!options.template || !options.projectName) {
    throw new Error('非交互模式需要同时提供 --template 与项目名称')
  }

  const projectName = options.projectName
  const nameCheck = validateProjectName(projectName)
  if (nameCheck !== true) {
    throw new Error(nameCheck)
  }

  const targetPath = path.resolve(options.targetDir ?? path.join(process.cwd(), projectName))

  if (await fs.pathExists(targetPath)) {
    const files = await fs.readdir(targetPath)
    if (files.length > 0 && !options.force) {
      throw new Error(`目标目录已存在且非空: ${targetPath}`)
    }
    await fs.remove(targetPath)
  }

  await runCreate({
    projectName,
    templateId: options.template,
    targetPath
  })
}
