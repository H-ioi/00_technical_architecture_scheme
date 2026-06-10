<template>
  <div class="archive-vaccine-tab">
    <div v-if="cards.length" class="archive-vaccine-tab__grid">
      <div v-for="item in cards" :key="item.key" class="archive-vaccine-tab__card">
        <div class="archive-vaccine-tab__tag">{{ item.tag }}</div>
        <div class="archive-vaccine-tab__title">{{ item.title }}</div>
        <div class="archive-vaccine-tab__status">
          {{ $t('schoolDoctor.studentRecord.fileLoaded') }}：{{ item.fileName }}
        </div>
        <el-button plain class="archive-vaccine-tab__btn" @click="previewFile(item.url)">
          {{ item.buttonText }}
        </el-button>
      </div>
    </div>
    <el-empty v-else :description="$t('schoolDoctor.common.noData')" />
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { MedicalArchiveVaccineExam } from '@/types/modules/medical-archive'

const props = defineProps<{
  vaccineExam: MedicalArchiveVaccineExam
}>()

const { t } = useUniI18n()

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim() !== ''
}

function fileNameFromUrl(url: string) {
  try {
    const pathname = url.split('?')[0]
    const parts = pathname.split('/')
    return decodeURIComponent(parts[parts.length - 1] || '')
  } catch {
    return url
  }
}

const cards = computed(() => {
  const exam = props.vaccineExam || {}
  const items: Array<{
    key: string
    tag: string
    title: string
    fileName: string
    url: string
    buttonText: string
  }> = []

  const vaccineUrl = exam.latestVaccine?.attachUrl
  if (hasText(vaccineUrl)) {
    items.push({
      key: 'vaccine',
      tag: t('schoolDoctor.studentRecord.vaccineUpload'),
      title: t('schoolDoctor.studentRecord.vaccineStatus'),
      fileName: fileNameFromUrl(vaccineUrl!) || t('schoolDoctor.common.viewAttachment'),
      url: vaccineUrl!,
      buttonText: t('schoolDoctor.studentRecord.previewVaccine')
    })
  }

  const examUrl = exam.latestHealthExam?.attachUrl
  if (hasText(examUrl)) {
    items.push({
      key: 'exam',
      tag: t('schoolDoctor.studentRecord.examUpload'),
      title: t('schoolDoctor.studentRecord.examRecord'),
      fileName: fileNameFromUrl(examUrl!) || t('schoolDoctor.common.viewAttachment'),
      url: examUrl!,
      buttonText: t('schoolDoctor.studentRecord.previewExam')
    })
  }

  return items
})

function previewFile(url?: string) {
  if (!url) {
    return
  }
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.archive-vaccine-tab {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__card {
    padding: 24px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
  }

  &__tag {
    margin-bottom: 10px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__title {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 600;
  }

  &__status {
    margin-bottom: 20px;
    padding: 10px 12px;
    background: var(--el-color-success-light-9);
    border-radius: 8px;
    font-size: 13px;
    color: var(--el-color-success);
  }

  &__btn {
    width: 100%;
  }
}
</style>
