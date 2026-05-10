import type { PageQuery } from '@/types/api'

/** 学期列表查询（`/bussection/getSectionPage`），字段与后端不一致时只改此处。 */
export interface SectionListParams extends PageQuery {
  schoolIds?: string | number | Array<string | number>
  /** 学期名称（模糊，常见字段 `cnName`/`keyword`） */
  cnName?: string
}
