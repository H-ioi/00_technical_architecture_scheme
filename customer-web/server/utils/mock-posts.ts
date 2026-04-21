/** 模拟列表数据（根 server 目录供 Nitro 路由使用） */
export const mockPosts = [
  {
    id: 1,
    title: '模拟文章一',
    excerpt: '这是通过 Nitro 接口返回的占位内容。',
    body: '正文段落：演示 GET /api/example/posts 与 GET /api/example/posts/:id。'
  },
  {
    id: 2,
    title: '模拟文章二',
    excerpt: '可在 composable 或页面里用 useFetch / useAsyncData 拉取。',
    body: '替换此文件或改为请求真实后端即可迁移。'
  },
  {
    id: 3,
    title: '模拟文章三',
    excerpt: '支持查询参数，例如 ?limit=2。',
    body: '列表接口会根据 limit 截取返回条数。'
  }
]
