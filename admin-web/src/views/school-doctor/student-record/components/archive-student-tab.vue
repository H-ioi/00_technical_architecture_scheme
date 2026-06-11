<template>
  <div class="archive-student-tab">
    <div class="archive-student-tab__card">
      <div v-if="basicFields.length" class="archive-student-tab__grid">
        <div v-for="item in basicFields" :key="item.key" class="archive-student-tab__cell">
          <div class="archive-student-tab__label">{{ item.label }}</div>
          <div class="archive-student-tab__value">
            <el-tag v-if="item.tag" size="small" type="info" effect="plain">{{
              item.value
            }}</el-tag>
            <span v-else>{{ item.value }}</span>
          </div>
        </div>
      </div>
      <el-empty v-else :description="$t('schoolDoctor.common.noData')" :image-size="72" />
    </div>

    <div v-if="showParentSection" class="archive-student-tab__card archive-student-tab__parent">
      <div class="archive-student-tab__parent-header">
        <div class="archive-student-tab__parent-title">
          <span>{{ $t('schoolDoctor.studentRecord.parentSection') }}</span>
          <el-tag size="small" type="danger" effect="plain">
            {{ $t('schoolDoctor.studentRecord.parentPrivacyTag') }}
          </el-tag>
        </div>
        <el-button
          v-if="!parentUnlocked && canViewParentInfo"
          size="small"
          plain
          @click="parentUnlocked = true">
          {{ $t('schoolDoctor.studentRecord.parentUnlock') }}
        </el-button>
      </div>

      <div v-if="!parentUnlocked" class="archive-student-tab__parent-mask">
        <p>{{ $t('schoolDoctor.studentRecord.parentPrivacyHint') }}</p>
      </div>

      <div v-else-if="visibleParents.length" class="archive-student-tab__parent-list">
        <div
          v-for="(parent, index) in visibleParents"
          :key="index"
          class="archive-student-tab__parent-item">
          <div v-if="hasText(parent.relationships)" class="archive-student-tab__parent-row">
            <span>{{ $t('schoolDoctor.studentRecord.fieldRelationship') }}</span>
            <span>{{ parent.relationships }}</span>
          </div>
          <div v-if="hasText(parent.mobilePhoneNumber)" class="archive-student-tab__parent-row">
            <span>{{ $t('schoolDoctor.studentRecord.fieldMobile') }}</span>
            <span>{{ parent.mobilePhoneNumber }}</span>
          </div>
          <div v-if="hasText(parent.emailAddress)" class="archive-student-tab__parent-row">
            <span>{{ $t('schoolDoctor.studentRecord.fieldEmail') }}</span>
            <span>{{ parent.emailAddress }}</span>
          </div>
        </div>
      </div>
      <el-empty v-else :description="$t('schoolDoctor.common.noData')" :image-size="72" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUniI18n, useUniPermission } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import type {
  MedicalArchiveParentInfo,
  MedicalArchiveStudentInfo
} from '@/types/modules/medical-archive'

const props = defineProps<{
  studentInfo: MedicalArchiveStudentInfo
  archiveMeta: {
    creator?: string
    createTime?: string
    updateTime?: string
  }
}>()

const { t } = useUniI18n()
const { hasPermission } = useUniPermission()
const canViewParentInfo = computed(() => hasPermission('medicalarchive_parent_info'))
const parentUnlocked = ref(false)

function hasText(value: unknown) {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  return true
}

const basicFields = computed(() => {
  const student = props.studentInfo || {}
  const meta = props.archiveMeta || {}
  const fields: Array<{ key: string; label: string; value: string; tag?: boolean }> = []

  if (hasText(student.schoolName)) {
    fields.push({
      key: 'schoolName',
      label: t('schoolDoctor.studentRecord.fieldSchoolCampus'),
      value: String(student.schoolName)
    })
  }
  if (hasText(student.admissionNo)) {
    fields.push({
      key: 'admissionNo',
      label: t('schoolDoctor.studentRecord.fieldStudentId'),
      value: String(student.admissionNo)
    })
  }
  if (hasText(student.fullName)) {
    fields.push({
      key: 'fullName',
      label: t('schoolDoctor.studentRecord.fieldStudentName'),
      value: String(student.fullName)
    })
  }

  const gradeClass = [student.grade, student.formCode].filter((item) => hasText(item)).join(' ')
  if (gradeClass) {
    fields.push({
      key: 'gradeClass',
      label: t('schoolDoctor.studentRecord.fieldGradeClass'),
      value: gradeClass
    })
  }

  if (student.dormitoryStatus === 0 || student.dormitoryStatus === 1) {
    fields.push({
      key: 'dormitoryStatus',
      label: t('schoolDoctor.studentRecord.fieldBoardingStatus'),
      value:
        student.dormitoryStatus === 1
          ? t('schoolDoctor.studentRecord.boardingStudent')
          : t('schoolDoctor.studentRecord.dayStudent'),
      tag: true
    })
  }

  if (hasText(student.roomNum)) {
    fields.push({
      key: 'roomNum',
      label: t('schoolDoctor.studentRecord.fieldRoomNo'),
      value: String(student.roomNum)
    })
  }
  if (hasText(student.busInfo)) {
    fields.push({
      key: 'busInfo',
      label: t('schoolDoctor.studentRecord.fieldBusRoute'),
      value: String(student.busInfo)
    })
  }
  if (hasText(meta.creator)) {
    fields.push({
      key: 'creator',
      label: t('schoolDoctor.studentRecord.fieldApprover'),
      value: String(meta.creator)
    })
  }

  const timeLines: string[] = []
  if (hasText(meta.createTime)) {
    timeLines.push(`${t('schoolDoctor.studentRecord.archiveCreated')}: ${meta.createTime}`)
  }
  if (hasText(meta.updateTime)) {
    timeLines.push(`${t('schoolDoctor.studentRecord.archiveUpdated')}: ${meta.updateTime}`)
  }
  if (timeLines.length) {
    fields.push({
      key: 'archiveTime',
      label: t('schoolDoctor.studentRecord.fieldArchiveTime'),
      value: timeLines.join('\n')
    })
  }

  return fields
})

const showParentSection = computed(() => Array.isArray(props.studentInfo.parents))

const visibleParents = computed(() =>
  (props.studentInfo.parents || []).filter(
    (item: MedicalArchiveParentInfo) =>
      hasText(item.relationships) || hasText(item.mobilePhoneNumber) || hasText(item.emailAddress)
  )
)

watch(
  () => props.studentInfo,
  () => {
    parentUnlocked.value = false
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.archive-student-tab {
  &__card {
    padding: 20px;
    background: #fff;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 24px;
  }

  &__label {
    margin-bottom: 6px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.6;
    white-space: pre-line;
  }

  &__parent {
    margin-top: 16px;
  }

  &__parent-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__parent-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
  }

  &__parent-mask {
    padding: 36px 24px;
    text-align: center;
    background: var(--el-fill-color-light);
    border: 1px dashed var(--el-border-color);
    border-radius: 10px;

    p {
      margin: 0;
      font-size: 13px;
      line-height: 1.7;
      color: var(--el-text-color-secondary);
    }
  }

  &__parent-list {
    display: grid;
    gap: 12px;
  }

  &__parent-item {
    padding: 12px 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
  }

  &__parent-row {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    span:first-child {
      flex-shrink: 0;
      width: 72px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
