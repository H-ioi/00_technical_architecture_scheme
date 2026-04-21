/**
 * 案例：GET 按 id 拉取单条数据（不存在则 404）
 * 前端：useFetch(`/api/example/posts/${id}`)
 */
import { getRouterParam } from 'h3'
import { mockPosts } from '~/server/utils/mock-posts'

export default defineEventHandler((event) => {
  const id = Number.parseInt(getRouterParam(event, 'id') ?? '', 10)
  const post = mockPosts.find((p) => p.id === id)

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: '未找到该条数据'
    })
  }

  return post
})
