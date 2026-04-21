/**
 * 案例：GET 拉取列表数据（支持 query.limit 截取条数）
 * 前端：useFetch('/api/example/posts') / useExamplePosts()
 */
import { mockPosts } from '../../utils/mock-posts'

export default defineEventHandler((event) => {
  const q = getQuery(event)
  const raw = q.limit
  const limit =
    typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN
  const list =
    Number.isFinite(limit) && limit > 0
      ? mockPosts.slice(0, limit)
      : mockPosts

  return {
    items: list,
    total: mockPosts.length
  }
})
