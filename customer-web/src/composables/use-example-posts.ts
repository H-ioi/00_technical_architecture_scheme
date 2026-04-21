import type { ExamplePostsListPayload } from '~/types/example-post'

/**
 * 封装列表接口请求，对应 `src/server/api/example/posts.get.ts`
 */
export function useExamplePosts (opts?: { limit?: number }) {
  const query = opts?.limit != null ? { limit: String(opts.limit) } : {}
  const key = `example-posts-${opts?.limit ?? 'all'}`

  return useFetch<ExamplePostsListPayload>('/api/example/posts', {
    query,
    key
  })
}
