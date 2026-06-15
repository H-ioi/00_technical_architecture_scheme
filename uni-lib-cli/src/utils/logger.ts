import pc from 'picocolors'

import type { TemplateOption } from '../config/templates.js'

/** 打印欢迎信息 */
export function printWelcome(): void {
  console.log('')
  console.log(pc.bold(pc.cyan('  uni-lib-cli')))
  console.log(pc.dim('  多端前端项目脚手架 · 统一工程规范 · 开箱即用'))
  console.log('')
}

/** 打印模版详情说明 */
export function printTemplateDetail(template: TemplateOption): void {
  console.log('')
  console.log(pc.bold(`  ${template.shortName}`))
  console.log(pc.dim(`  ${template.description}`))
  console.log('')
  console.log(`  ${pc.dim('技术栈')}  ${template.techStack}`)
  console.log(`  ${pc.dim('适用场景')}  ${template.scene}`)
  console.log('')
}

/** 打印创建成功后的指引 */
export function printSuccessGuide(
  projectName: string,
  targetPath: string,
  template: TemplateOption
): void {
  console.log('')
  console.log(pc.green('  ✔ 项目创建成功'))
  console.log('')
  console.log(`  ${pc.dim('项目类型')}  ${template.label}`)
  console.log(`  ${pc.dim('项目目录')}  ${targetPath}`)
  console.log('')
  console.log(pc.bold('  接下来你可以：'))
  console.log('')
  console.log(`  ${pc.cyan('1.')} 进入项目目录`)
  console.log(`     ${pc.dim('cd')} ${projectName}`)
  console.log('')
  console.log(`  ${pc.cyan('2.')} 安装依赖`)
  console.log(`     ${pc.dim(template.installCommand)}`)
  console.log('')
  console.log(`  ${pc.cyan('3.')} 启动开发服务`)
  console.log(`     ${pc.dim(template.devCommand)}`)
  console.log('')
  console.log(pc.dim('  更多说明请查看项目 README.md 与仓库内对应构建方案文档。'))
  console.log('')
}

/** 打印错误信息 */
export function printError(message: string): void {
  console.error('')
  console.error(pc.red(`  ✖ ${message}`))
  console.error('')
}
