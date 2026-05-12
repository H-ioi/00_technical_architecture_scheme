import common from './common'
import dataTable from './data-table'
import layout from './layout'
import login from './login'
import relativeTime from './relative-time'
import searchForm from './search-form'
import upload from './upload'

export const enMessagesNested = {
  common,
  dataTable,
  layout,
  login,
  relativeTime,
  searchForm,
  upload
} as const

export type EnMessagesNested = typeof enMessagesNested

export default enMessagesNested
