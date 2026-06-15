import { Command } from 'commander'

import { collectCreateContext, runCreate, runCreateWithOptions } from './create.js'
import type { CreateOptions, TemplateId } from './types.js'
import { printError } from './utils/logger.js'

/** 注册并启动 CLI 命令 */
export function startCli(): void {
  const program = new Command()

  program.name('uni-lib-cli').description('uni-lib 多端项目脚手架').version('0.1.1')

  program
    .command('create')
    .description('交互式创建项目（默认命令）')
    .argument('[project-name]', '项目名称')
    .option('-t, --template <type>', '模版类型: admin-web | customer-web | customer-mobile | native-app')
    .option('-d, --dir <path>', '目标目录（默认在当前目录下创建）')
    .option('-f, --force', '目标目录非空时强制覆盖')
    .action(async (projectName: string | undefined, flags: Record<string, unknown>) => {
      const options: CreateOptions = {
        projectName,
        template: flags.template as TemplateId | undefined,
        targetDir: flags.dir as string | undefined,
        force: Boolean(flags.force)
      }

      try {
        if (options.template && options.projectName) {
          await runCreateWithOptions(options)
          return
        }

        const context = await collectCreateContext(options)
        if (!context) {
          process.exitCode = 1
          return
        }

        await runCreate(context)
      } catch (error) {
        const message = error instanceof Error ? error.message : '创建失败'
        printError(message)
        process.exitCode = 1
      }
    })

  /** 无子命令时默认进入 create 交互 */
  program.action(async () => {
    try {
      const context = await collectCreateContext({})
      if (!context) {
        process.exitCode = 1
        return
      }

      await runCreate(context)
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建失败'
      printError(message)
      process.exitCode = 1
    }
  })

  program.parse()
}
