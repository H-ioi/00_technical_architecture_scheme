/** 首页状态（示例接口响应 data） */
export interface HomeStatusVO {
  ready: boolean;
  version?: string;
}

/** 首页配置查询参数 */
export interface HomeConfigQuery {
  platform?: string;
}

/** 首页配置（示例接口响应 data） */
export interface HomeConfigVO {
  title: string;
  localeDefault?: string;
}
