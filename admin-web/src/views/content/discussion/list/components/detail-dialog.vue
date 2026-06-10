<template>
  <el-dialog
    v-model="visible"
    :title="$t('content.discussion.formLook')"
    width="min(900px, 96vw)"
    destroy-on-close
  >
    <div v-loading="loading" class="content-discussion-detail">
      <dl v-if="detail.id != null" class="content-discussion-detail__grid">
        <template v-for="item in fields" :key="item.key">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </template>
      </dl>
      <div v-if="imageItems.length" class="content-discussion-detail__images">
        <p class="content-discussion-detail__section-title">{{ $t('content.discussion.fieldImages') }}</p>
        <div class="content-discussion-detail__image-list">
          <el-image
            v-for="item in imageItems"
            :key="item.field"
            :src="item.url"
            fit="contain"
            class="content-discussion-detail__image"
          />
        </div>
      </div>
      <div v-if="pdfItems.length" class="content-discussion-detail__pdfs">
        <p class="content-discussion-detail__section-title">PDF</p>
        <ul>
          <li v-for="(item, index) in pdfItems" :key="index">
            <el-link type="primary" :href="item.url" target="_blank">{{ item.name }}</el-link>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { contentDiscussionApi } from '@/api'
import type { ContentDiscussionRecord } from '@/types/modules/content-discussion'
import { normalizePayload } from '@/utils/api-response-normalize'

import { scopeOpts } from '../list.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  recordId: string | number | null
}>()

const { locale, t } = useUniI18n()
const loading = ref(false)
const detail = ref<ContentDiscussionRecord>({ id: '' })

function yesNo(value: boolean | undefined) {
  return value ? t('content.yes') : t('content.no')
}

function scopeLabel(scope: number | undefined) {
  const hit = scopeOpts(t).find((item) => item.value === scope)
  return hit?.label ?? '—'
}

const fields = computed(() => {
  const row = detail.value
  const schoolName =
    locale() === 'en'
      ? row.schoolEnNames || row.schoolNames || '—'
      : row.schoolNames || row.schoolEnNames || '—'
  const tags = row.tagList || []
  const tagName =
    tags.length > 0
      ? locale() === 'en'
        ? tags[0].enName || tags[0].cnName || '—'
        : tags[0].cnName || tags[0].enName || '—'
      : row.tagName || '—'

  return [
    { key: 'id', label: 'ID', value: String(row.id ?? '—') },
    { key: 'school', label: t('content.discussion.fieldSchool'), value: schoolName },
    { key: 'cnContent', label: t('content.discussion.fieldCnContent'), value: row.cnContent || '—' },
    { key: 'enContent', label: t('content.discussion.fieldEnContent'), value: row.enContent || '—' },
    { key: 'tag', label: t('content.discussion.fieldTag'), value: tagName },
    { key: 'scope', label: t('content.discussion.fieldScope'), value: scopeLabel(row.scope) },
    { key: 'recommended', label: t('content.discussion.fieldRecommended'), value: yesNo(row.recommended) },
    { key: 'active', label: t('content.discussion.fieldVisible'), value: yesNo(row.active) },
    { key: 'top', label: t('content.discussion.fieldTop'), value: yesNo(row.top) },
    { key: 'createdAt', label: t('content.discussion.fieldCreatedAt'), value: row.createdAt || '—' },
    { key: 'updatedAt', label: t('content.discussion.fieldUpdatedAt'), value: row.updatedAt || '—' }
  ]
})

const imageItems = computed(() => {
  const row = detail.value
  const pairs: Array<{ field: string; url?: string }> = [
    { field: 'mainImg', url: row.mainImg },
    { field: 'secondImg', url: row.secondImg },
    { field: 'thirdImg', url: row.thirdImg },
    { field: 'fourthImage', url: row.fourthImage },
    { field: 'fifthImage', url: row.fifthImage },
    { field: 'sixthImage', url: row.sixthImage },
    { field: 'seventhImage', url: row.seventhImage },
    { field: 'eighthImage', url: row.eighthImage },
    { field: 'ninthImage', url: row.ninthImage }
  ]
  return pairs.filter((item) => Boolean(item.url)) as Array<{ field: string; url: string }>
})

const pdfItems = computed(() =>
  (detail.value.pdfList || [])
    .map((item, index) => ({
      name: String(item.name || item.pdf || `PDF ${index + 1}`),
      url: String(item.pdf || item.url || '')
    }))
    .filter((item) => item.url)
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      detail.value = { id: '' }
      return
    }
    if (props.recordId == null) {
      return
    }

    loading.value = true
    void contentDiscussionApi.detail
      .get(props.recordId)
      .then((raw) => {
        detail.value = normalizePayload(raw) as ContentDiscussionRecord
      })
      .finally(() => {
        loading.value = false
      })
  }
)
</script>

<style scoped lang="scss">
.content-discussion-detail__grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px 16px;
  margin: 0;

  dt {
    margin: 0;
    color: var(--el-text-color-secondary);
  }

  dd {
    margin: 0;
    overflow-wrap: break-word;
  }
}

.content-discussion-detail__section-title {
  margin: 20px 0 12px;
  font-weight: 600;
}

.content-discussion-detail__image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.content-discussion-detail__image {
  width: 160px;
  height: 160px;
}
</style>
