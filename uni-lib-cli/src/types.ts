/** 脚手架模版标识 */
export type TemplateId = 'admin-web' | 'customer-web' | 'customer-mobile' | 'native-app'

export interface CreateOptions {
  projectName?: string
  template?: TemplateId
  targetDir?: string
  force?: boolean
}

export interface CreateContext {
  projectName: string
  templateId: TemplateId
  targetPath: string
}
