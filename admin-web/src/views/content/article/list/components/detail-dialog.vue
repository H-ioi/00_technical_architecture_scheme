<template>
  <el-dialog
    v-model="visible"
    :title="$t('content.article.formLook')"
    width="min(900px, 96vw)"
    destroy-on-close
  >
    <div v-loading="loading" class="content-article-detail">
      <dl v-if="detail.id != null" class="content-article-detail__grid">
        <template v-for="item in fields" :key="item.key">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </template>
      </dl>
      <div v-if="detail.mainImage" class="content-article-detail__image">
        <p class="content-article-detail__label">{{ $t('content.article.fieldMainImage') }}</p>
        <el-image :src="detail.mainImage" fit="contain" style="max-width: 240px" />
      </div>
      <div v-if="detail.content" class="content-article-detail__html">
        <p class="content-article-detail__label">{{ $t('content.article.fieldContent') }}</p>
        <!-- eslint-disable-next-line vue/no-v-html -- CMS article body preview -->
        <div class="content-article-detail__body" v-html="detail.content" />
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

import { contentArticleApi } from '@/api'
import type { ContentArticleRecord } from '@/types/modules/content-article'
import { normalizePayload } from '@/utils/api-response-normalize'

import { importanceLevelOpts } from '../list.config'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  recordId: string | number | null
}>()

const { locale, t } = useUniI18n()
const loading = ref(false)
const detail = ref<ContentArticleRecord>({ id: '' })

function yesNo(value: boolean | undefined) {
  return value ? t('content.yes') : t('content.no')
}

function importanceLabel(level: number | undefined) {
  const hit = importanceLevelOpts(t).find((item) => item.value === level)
  return hit?.label ?? '—'
}

const fields = computed(() => {
  const row = detail.value
  const schoolName =
    locale() === 'en'
      ? row.schoolEnNames || row.schoolNames || '—'
      : row.schoolNames || row.schoolEnNames || '—'

  return [
    { key: 'id', label: 'ID', value: String(row.id ?? '—') },
    { key: 'school', label: t('content.article.fieldSchool'), value: schoolName },
    { key: 'cnTitle', label: t('content.article.fieldCnTitle'), value: row.cnTitle || '—' },
    { key: 'enTitle', label: t('content.article.fieldEnTitle'), value: row.enTitle || '—' },
    {
      key: 'category',
      label: t('content.article.fieldCategory'),
      value: row.categoryName || '—'
    },
    {
      key: 'importance',
      label: t('content.article.fieldImportance'),
      value: importanceLabel(row.importanceLevel)
    },
    {
      key: 'publish',
      label: t('content.article.fieldPublishStatus'),
      value: yesNo(row.publishStatus)
    },
    { key: 'visible', label: t('content.article.fieldVisible'), value: yesNo(row.visible) },
    { key: 'banner', label: t('content.article.fieldBanner'), value: yesNo(row.isBanner) },
    {
      key: 'recommended',
      label: t('content.article.fieldRecommended'),
      value: yesNo(row.recommended)
    },
    {
      key: 'wechatPushed',
      label: t('content.article.fieldWechatPushed'),
      value: yesNo(row.isWechatPushed)
    },
    {
      key: 'wechatUrl',
      label: t('content.article.fieldWechatUrl'),
      value: row.wechatUrl || '—'
    },
    {
      key: 'updatedAt',
      label: t('content.article.fieldUpdatedAt'),
      value: row.updatedAt || '—'
    }
  ]
})

watch(
  () => visible.value,
  (open) => {
    if (!open || props.recordId == null) {
      detail.value = { id: '' }
      return
    }

    loading.value = true
    void contentArticleApi.detail
      .get(props.recordId)
      .then((raw) => {
        detail.value = normalizePayload(raw) as ContentArticleRecord
      })
      .finally(() => {
        loading.value = false
      })
  }
)
</script>

<style scoped lang="scss">
.content-article-detail {
  &__grid {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 8px 16px;
    margin: 0 0 16px;

    dt {
      margin: 0;
      color: var(--el-text-color-secondary);
    }

    dd {
      margin: 0;
      word-break: break-word;
    }
  }

  &__label {
    margin: 0 0 8px;
    color: var(--el-text-color-secondary);
  }

  &__image,
  &__html {
    margin-top: 16px;
  }

  &__body {
    padding: 12px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    max-height: 360px;
    overflow: auto;
  }
}
</style>
