<template>
  <el-card shadow="hover" class="dorm-bed-card">
    <template #header>
      <div class="dorm-bed-card__header">
        <div class="dorm-bed-card__header-left">
          <span class="dorm-bed-card__label">{{ bed.label }}</span>
          <span
            class="dorm-bed-card__status"
            :class="bed.student ? 'dorm-bed-card__status--occupied' : 'dorm-bed-card__status--empty'"
          >
            {{ bed.student ? $t('dorm.roomAssign.statusOccupied') : $t('dorm.roomAssign.statusVacant') }}
          </span>
        </div>
        <div v-if="bed.student" class="dorm-bed-card__student">
          <span>{{ bed.student.en_name }}</span>
        </div>
        <el-button
          v-else
          type="danger"
          link
          @click="emit('delete', bed)"
        >
          {{ $t('dorm.common.delete') }}
        </el-button>
      </div>
    </template>

    <template v-if="bed.student">
      <div class="dorm-bed-card__body">
        <div class="dorm-bed-card__row">
          <span>{{ $t('dorm.room.fieldCampus') }}：</span>
          <span>{{ bed.schoolName || '—' }}</span>
        </div>
        <div class="dorm-bed-card__row dorm-bed-card__row--split">
          <span>{{ $t('dorm.roomAssign.fieldAdmissionNo') }}：{{ bed.student.admission_no || '—' }}</span>
          <span>{{ $t('dorm.roomAssign.fieldGrade') }}：{{ bed.student.grade_code || '—' }}</span>
          <span>{{ $t('dorm.roomAssign.fieldClass') }}：{{ bed.student.form_code || '—' }}</span>
        </div>
      </div>
      <div class="dorm-bed-card__footer">
        <el-button type="primary" link @click="emit('change', bed)">
          {{ $t('dorm.roomAssign.changeRoom') }}
        </el-button>
        <el-button type="danger" link @click="emit('checkout', bed)">
          {{ $t('dorm.roomAssign.checkout') }}
        </el-button>
      </div>
    </template>

    <template v-else>
      <div class="dorm-bed-card__empty">
        <span class="dorm-bed-card__empty-icon" />
      </div>
      <div class="dorm-bed-card__footer dorm-bed-card__footer--vacant">
        <el-button type="primary" @click="emit('checkin', bed)">
          {{ $t('dorm.roomAssign.checkin') }}
        </el-button>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import type { DormBedRecord } from '@/types/modules/dorm-bed'

defineProps<{
  bed: DormBedRecord
}>()

const emit = defineEmits<{
  checkin: [bed: DormBedRecord]
  change: [bed: DormBedRecord]
  checkout: [bed: DormBedRecord]
  delete: [bed: DormBedRecord]
}>()
</script>

<style scoped lang="scss">
.dorm-bed-card {
  width: 320px;
  border-radius: 12px;
}

.dorm-bed-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dorm-bed-card__header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dorm-bed-card__label {
  font-size: 16px;
  font-weight: 500;
}

.dorm-bed-card__status {
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 6px;
}

.dorm-bed-card__status--occupied {
  color: #3b82f6;
  background-color: rgba(205, 233, 253, 1);
}

.dorm-bed-card__status--empty {
  color: #10b981;
  background-color: rgba(156, 209, 160, 0.21);
}

.dorm-bed-card__student {
  font-size: 14px;
  color: #303133;
}

.dorm-bed-card__body {
  font-size: 14px;
}

.dorm-bed-card__row {
  margin-bottom: 12px;

  &--split {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
  }
}

.dorm-bed-card__empty {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
}

.dorm-bed-card__empty-icon {
  display: block;
  width: 97px;
  height: 66px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: #fafafa;
}

.dorm-bed-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f2f6fc;

  &--vacant {
    justify-content: center;
    padding-bottom: 4px;
  }
}
</style>
