<template>
  <view class="page">
    <view class="toolbar">
      <input
        class="search"
        type="text"
        placeholder="关键词过滤标题 / 副标题 / 标签"
        :value="keyword"
        @input="onKeywordInput"
      />
      <scroll-view scroll-x class="tabs" :show-scrollbar="false">
        <view
          v-for="(name, idx) in categoryNames"
          :key="idx"
          class="tab"
          :class="{ active: categoryIndex === idx }"
          @click="categoryIndex = idx"
        >
          {{ name }}
        </view>
      </scroll-view>
      <view class="filters">
        <view
          v-for="opt in statusOptions"
          :key="opt.value"
          class="chip"
          :class="{ on: statusFilter === opt.value }"
          @click="statusFilter = opt.value"
        >
          {{ opt.label }}
        </view>
      </view>
      <view class="sort-row">
        <text class="sort-label">排序</text>
        <picker mode="selector" :range="sortLabels" :value="sortPickerIndex" @change="onSortPick">
          <view class="sort-value">{{ sortLabels[sortPickerIndex] }}</view>
        </picker>
      </view>
    </view>

    <scroll-view scroll-y class="list-scroll" :scroll-with-animation="true">
      <view class="stats-bar">
        <text>{{ statsLine }}</text>
      </view>

      <view v-for="block in groupedBlocks" :key="block.key" class="group">
        <view class="group-title">{{ block.title }} · {{ block.items.length }} 条</view>
        <view
          v-for="item in block.items"
          :key="item.id"
          class="card"
          :class="'pri-' + item.priority"
        >
          <view class="card-top">
            <view class="card-title-row">
              <text class="card-title">{{ item.title }}</text>
              <text class="badge" :class="'st-' + item.status">{{ statusLabel(item.status) }}</text>
            </view>
            <text class="card-sub">{{ item.subtitle }}</text>
          </view>

          <view class="tag-row">
            <text v-for="(t, ti) in item.tags" :key="ti" class="tag">{{ t }}</text>
            <text class="prio">P{{ item.priority }}</text>
          </view>

          <view class="meta-row">
            <text class="amount">{{ formatAmount(item.amountCents) }}</text>
            <text class="date">{{ item.createdAt }}</text>
            <text class="cc">评 {{ item.commentCount }}</text>
          </view>

          <view class="card-actions">
            <view class="star" :class="{ on: item.star }" @click.stop="toggleStar(item.id)">
              {{ item.star ? '★ 已关注' : '☆ 关注' }}
            </view>
            <view class="link" @click.stop="cycleStatus(item.id)">流转状态</view>
            <view class="link" @click.stop="bumpComment(item.id)">+评论</view>
          </view>

          <view v-if="expandedId === item.id" class="detail-extra">
            <text v-for="(line, li) in detailLines(item)" :key="li" class="extra-line">{{ line }}</text>
          </view>
          <view class="expand-toggle" @click="toggleExpand(item.id)">
            {{ expandedId === item.id ? '收起详情' : '展开详情' }}
          </view>
        </view>
      </view>

      <view v-if="filteredItems.length === 0" class="empty">无匹配数据，请调整筛选条件</view>
    </scroll-view>

    <view class="footer">
      <button class="btn" @click="goBack">返回首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived'

interface ListRow {
  id: number
  title: string
  subtitle: string
  status: Status
  priority: 1 | 2 | 3
  categoryId: number
  tags: string[]
  amountCents: number
  createdAt: string
  star: boolean
  commentCount: number
}

const categoryNames = ['全部', '营销', '订单', '客服', '供应链', '财务'] as const

const STATUS_META: Record<Status, { label: string }> = {
  draft: { label: '草稿' },
  pending: { label: '待审' },
  approved: { label: '通过' },
  rejected: { label: '驳回' },
  archived: { label: '归档' },
}

const STATUSES: Status[] = ['draft', 'pending', 'approved', 'rejected', 'archived']

const statusOptions = [
  { label: '全部', value: 'all' as const },
  ...STATUSES.map((s) => ({ label: STATUS_META[s].label, value: s })),
]

const sortKeys = ['time', 'amount', 'priority'] as const
type SortKey = (typeof sortKeys)[number]
const sortLabels = ['按时间', '按金额', '按优先级']

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function buildMock(count: number): ListRow[] {
  const rows: ListRow[] = []
  for (let i = 1; i <= count; i++) {
    const si = i % STATUSES.length
    const status = STATUSES[si]!
    const cat = (i % 5) + 1
    const pri = ((i % 3) + 1) as 1 | 2 | 3
    const tags = [`渠道-${(i % 7) + 1}`, `项目-${(i % 11) + 1}`, i % 2 === 0 ? '加急' : '常规']
    const m = 1 + (i % 28)
    const d = 1 + (i % 27)
    rows.push({
      id: 10000 + i,
      title: `业务单据 #${i} · ${categoryNames[cat]}`,
      subtitle: `关联单号 SX-${202400 + i}，责任人 ${(i % 9) + 1} 号坐席，备注批次 ${(i % 13) + 1}`,
      status,
      priority: pri,
      categoryId: cat,
      tags,
      amountCents: 1000 * (i % 200) + (i % 97) * 100,
      createdAt: `2026-${pad(m)}-${pad(d)} ${pad((i * 3) % 24)}:${pad((i * 7) % 60)}`,
      star: i % 5 === 0,
      commentCount: (i * 17) % 42,
    })
  }
  return rows
}

const keyword = ref('')
const categoryIndex = ref(0)
const statusFilter = ref<'all' | Status>('all')
const sortKey = ref<SortKey>('time')
const expandedId = ref<number | null>(null)

const rawItems = ref<ListRow[]>(buildMock(96))

function onKeywordInput(e: { detail: { value: string } }) {
  keyword.value = e.detail.value
}

function statusLabel(s: Status) {
  return STATUS_META[s].label
}

function formatAmount(cents: number) {
  return `¥ ${(cents / 100).toFixed(2)}`
}

function detailLines(item: ListRow): string[] {
  return [
    `内部流水 ${item.id} · 分类 ${categoryNames[item.categoryId]}`,
    `标签聚合: ${item.tags.join(' / ')}`,
    `风险评分 ${(item.id % 99) + 1} · 附件 ${item.commentCount % 5} 个`,
    `上一操作: ${item.status === 'approved' ? '主管签字' : '系统校验'} · SLA ${20 - (item.id % 15)}h`,
  ]
}

const filteredItems = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  let list = rawItems.value.filter((row) => {
    if (categoryIndex.value > 0 && row.categoryId !== categoryIndex.value) return false
    if (statusFilter.value !== 'all' && row.status !== statusFilter.value) return false
    if (!kw) return true
    const blob = `${row.title} ${row.subtitle} ${row.tags.join(' ')}`.toLowerCase()
    return blob.includes(kw)
  })

  const sk = sortKey.value
  list = [...list].sort((a, b) => {
    if (sk === 'amount') return b.amountCents - a.amountCents
    if (sk === 'priority') return b.priority - a.priority
    return b.id - a.id
  })
  return list
})

const groupedBlocks = computed(() => {
  const map = new Map<number, ListRow[]>()
  for (const row of filteredItems.value) {
    const arr = map.get(row.categoryId) ?? []
    arr.push(row)
    map.set(row.categoryId, arr)
  }
  const keys = [...map.keys()].sort((a, b) => a - b)
  return keys.map((k) => ({
    key: `c-${k}`,
    title: categoryNames[k],
    items: map.get(k)!,
  }))
})

const statsLine = computed(() => {
  const list = filteredItems.value
  const sum = list.reduce((s, r) => s + r.amountCents, 0)
  const stars = list.filter((r) => r.star).length
  return `共 ${list.length} 条 · 金额合计 ${formatAmount(sum)} · 关注 ${stars}`
})

const sortPickerIndex = computed(() => sortKeys.indexOf(sortKey.value))

function onSortPick(e: { detail: { value: string } }) {
  const i = Number(e.detail.value)
  sortKey.value = sortKeys[i] ?? 'time'
}

function toggleStar(id: number) {
  rawItems.value = rawItems.value.map((r) => (r.id === id ? { ...r, star: !r.star } : r))
}

function cycleStatus(id: number) {
  rawItems.value = rawItems.value.map((r) => {
    if (r.id !== id) return r
    const ix = STATUSES.indexOf(r.status)
    const next = STATUSES[(ix + 1) % STATUSES.length]!
    return { ...r, status: next }
  })
}

function bumpComment(id: number) {
  rawItems.value = rawItems.value.map((r) =>
    r.id === id ? { ...r, commentCount: r.commentCount + 1 } : r
  )
}

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6f8;
}

.toolbar {
  flex-shrink: 0;
  padding: 16rpx 20rpx 12rpx;
  background: #fff;
  border-bottom: 1rpx solid #e8e8e8;
}

.search {
  box-sizing: border-box;
  height: 72rpx;
  padding: 0 20rpx;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  background: #f0f2f5;
  border-radius: 8rpx;
}

.tabs {
  white-space: nowrap;
  margin-bottom: 12rpx;
}

.tab {
  display: inline-block;
  padding: 10rpx 22rpx;
  margin-right: 12rpx;
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  border-radius: 999rpx;
}

.tab.active {
  color: #fff;
  background: #1677ff;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 8rpx;
}

.chip {
  padding: 6rpx 16rpx;
  font-size: 22rpx;
  color: #555;
  background: #eee;
  border-radius: 6rpx;
}

.chip.on {
  color: #1677ff;
  background: #e6f4ff;
}

.sort-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8rpx;
}

.sort-label {
  font-size: 24rpx;
  color: #888;
}

.sort-value {
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  color: #1677ff;
  background: #f0f5ff;
  border-radius: 6rpx;
}

.list-scroll {
  flex: 1;
  height: 0;
}

.stats-bar {
  padding: 12rpx 20rpx;
  font-size: 22rpx;
  color: #666;
}

.group-title {
  padding: 12rpx 20rpx 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #333;
}

.card {
  margin: 0 16rpx 16rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.card.pri-3 {
  border-left: 6rpx solid #ff4d4f;
}

.card.pri-2 {
  border-left: 6rpx solid #faad14;
}

.card.pri-1 {
  border-left: 6rpx solid #52c41a;
}

.card-top {
  margin-bottom: 12rpx;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.card-title {
  flex: 1;
  margin-right: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.card-sub {
  font-size: 22rpx;
  line-height: 1.5;
  color: #888;
}

.badge {
  flex-shrink: 0;
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  border-radius: 4rpx;
}

.st-draft {
  color: #999;
  background: #f0f0f0;
}

.st-pending {
  color: #d48806;
  background: #fff7e6;
}

.st-approved {
  color: #389e0d;
  background: #f6ffed;
}

.st-rejected {
  color: #cf1322;
  background: #fff1f0;
}

.st-archived {
  color: #595959;
  background: #fafafa;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10rpx;
}

.tag {
  padding: 4rpx 10rpx;
  margin-right: 8rpx;
  margin-bottom: 4rpx;
  font-size: 20rpx;
  color: #1677ff;
  background: #e6f4ff;
  border-radius: 4rpx;
}

.prio {
  margin-left: auto;
  font-size: 20rpx;
  color: #999;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 22rpx;
}

.amount {
  margin-right: 20rpx;
  font-weight: 600;
  color: #cf1322;
}

.date {
  margin-right: 16rpx;
  color: #666;
}

.cc {
  color: #999;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding-top: 8rpx;
  border-top: 1rpx solid #f0f0f0;
}

.star,
.link {
  font-size: 22rpx;
  color: #1677ff;
}

.star.on {
  color: #faad14;
}

.detail-extra {
  margin-top: 12rpx;
  padding: 12rpx;
  background: #fafafa;
  border-radius: 8rpx;
}

.extra-line {
  display: block;
  margin-bottom: 6rpx;
  font-size: 20rpx;
  line-height: 1.45;
  color: #666;
}

.expand-toggle {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #1677ff;
  text-align: center;
}

.empty {
  padding: 80rpx 40rpx;
  font-size: 26rpx;
  color: #999;
  text-align: center;
}

.footer {
  flex-shrink: 0;
  padding: 12rpx 20rpx 24rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
}

.btn {
  font-size: 28rpx;
}
</style>
