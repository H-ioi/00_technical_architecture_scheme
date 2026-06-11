<template>
  <div class="archive-visit-tab">
    <div v-if="records.length" class="archive-visit-tab__list">
      <div class="archive-visit-tab__title">
        {{ $t('schoolDoctor.studentRecord.visitSection') }}
      </div>
      <div v-for="item in records" :key="item.id || item.visitTime" class="archive-visit-tab__card">
        <div class="archive-visit-tab__header">
          <span v-if="item.visitCode">{{ item.visitCode }}</span>
          <span v-if="item.visitTime">
            {{ $t('schoolDoctor.studentRecord.visitDate') }}: {{ item.visitTime }}
          </span>
        </div>

        <div class="archive-visit-tab__body">
          <div class="archive-visit-tab__column">
            <div v-if="hasText(item.chiefComplaint)" class="archive-visit-tab__field">
              <div class="archive-visit-tab__label">
                {{ $t('schoolDoctor.studentRecord.visitComplaint') }}
              </div>
              <div>{{ item.chiefComplaint }}</div>
            </div>
            <div
              v-if="hasText(item.remark)"
              class="archive-visit-tab__field archive-visit-tab__field--box">
              <div class="archive-visit-tab__label">
                {{ $t('schoolDoctor.studentRecord.visitTreatment') }}
              </div>
              <div>{{ item.remark }}</div>
            </div>
          </div>

          <div class="archive-visit-tab__column">
            <div v-if="hasText(item.physicalExam)" class="archive-visit-tab__field">
              <div class="archive-visit-tab__label">
                {{ $t('schoolDoctor.studentRecord.visitPhysical') }}
              </div>
              <div>{{ item.physicalExam }}</div>
            </div>
            <div v-if="hasText(item.diagnosisAdvice)" class="archive-visit-tab__field">
              <div class="archive-visit-tab__label">
                {{ $t('schoolDoctor.studentRecord.visitDiagnosis') }}
              </div>
              <div>{{ item.diagnosisAdvice }}</div>
            </div>
            <div v-if="item.metaText" class="archive-visit-tab__field">
              <div class="archive-visit-tab__label">
                {{ $t('schoolDoctor.studentRecord.visitParentContact') }}
              </div>
              <div>{{ item.metaText }}</div>
            </div>
          </div>
        </div>

        <div v-if="item.footerText" class="archive-visit-tab__footer">{{ item.footerText }}</div>
      </div>
    </div>
    <el-empty v-else :description="$t('schoolDoctor.common.noData')" />
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { MedicalArchiveVisitRecord } from '@/types/modules/medical-archive'

const props = defineProps<{
  visitRecords: MedicalArchiveVisitRecord[]
}>()

const { t } = useUniI18n()

function hasText(value: unknown) {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  return true
}

const records = computed(() => {
  const destMap: Record<number, string> = {
    1: t('schoolDoctor.studentRecord.destClassroom'),
    2: t('schoolDoctor.studentRecord.destHome'),
    3: t('schoolDoctor.studentRecord.destHospital')
  }

  return (props.visitRecords || [])
    .map((item) => {
      const metaParts: string[] = []
      if (hasText(item.leaveDestination)) {
        metaParts.push(
          `${t('schoolDoctor.studentRecord.leaveDestination')}：${
            destMap[Number(item.leaveDestination)] || String(item.leaveDestination)
          }`
        )
      }
      if (item.contactParent === 0 || item.contactParent === 1) {
        metaParts.push(
          `${t('schoolDoctor.studentRecord.contactParent')}：${
            item.contactParent === 1
              ? t('schoolDoctor.studentRecord.contacted')
              : t('schoolDoctor.common.no')
          }`
        )
      }

      const footerParts: string[] = []
      if (hasText(item.creator)) {
        footerParts.push(`${t('schoolDoctor.studentRecord.visitDoctor')}: ${item.creator}`)
      }
      if (hasText(item.createTime)) {
        footerParts.push(`${t('schoolDoctor.studentRecord.visitRecordTime')}: ${item.createTime}`)
      }

      return {
        ...item,
        visitCode: hasText(item.id) ? `[VIS${String(item.id).padStart(3, '0')}]` : '',
        metaText: metaParts.join(' | '),
        footerText: footerParts.join(' | ')
      }
    })
    .filter(
      (item) =>
        hasText(item.visitCode) ||
        hasText(item.visitTime) ||
        hasText(item.chiefComplaint) ||
        hasText(item.remark) ||
        hasText(item.physicalExam) ||
        hasText(item.diagnosisAdvice) ||
        hasText(item.metaText) ||
        hasText(item.footerText)
    )
})
</script>

<style scoped lang="scss">
.archive-visit-tab {
  &__title {
    margin-bottom: 16px;
    font-size: 15px;
    font-weight: 600;
  }

  &__card {
    margin-bottom: 16px;
    padding: 20px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
  }

  &__header {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__field {
    margin-bottom: 14px;
    font-size: 14px;
    line-height: 1.8;

    &--box {
      padding: 12px;
      background: var(--el-fill-color-light);
      border-radius: 8px;
    }
  }

  &__label {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }

  &__footer {
    margin-top: 12px;
    text-align: right;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
