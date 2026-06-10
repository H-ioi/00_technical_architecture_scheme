<template>
  <el-card
    shadow="hover"
    class="dorm-room-card"
    :class="genderCardBgClass(room.gender)"
  >
    <template #header>
      <div class="dorm-room-card__header">
        <span class="dorm-room-card__title">
          {{ room.number }}
          <span
            v-if="[0, 1, 2].includes(Number(room.occupancy_status))"
            class="dorm-room-card__occupancy"
            :class="`dorm-room-card__occupancy--${room.occupancy_status}`"
          >
            {{ occupancyStatusText(room.occupancy_status) }}
          </span>
        </span>
        <el-switch
          :model-value="room.is_active"
          :active-value="1"
          :inactive-value="0"
          active-color="#9CD1A0"
          @change="onStatusChange"
        />
      </div>
    </template>

    <div class="dorm-room-card__body">
      <div class="dorm-room-card__row dorm-room-card__row--split">
        <span>{{ $t('dorm.room.fieldCreatedAt') }}：{{ room.created_at || '--' }}</span>
        <span>{{ $t('dorm.room.fieldUpdatedAt') }}：{{ room.updated_at || '--' }}</span>
      </div>
      <div class="dorm-room-card__row">
        <span>{{ $t('dorm.room.fieldCampus') }}：</span>
        <span>{{ campusName }}</span>
      </div>
      <div class="dorm-room-card__row dorm-room-card__row--split">
        <span>
          {{ $t('dorm.room.fieldProject') }}：
          <el-tooltip
            v-if="room.project?.name && room.project.name.length > 30"
            :content="room.project.name"
            placement="top"
          >
            <span>{{ room.project.name.slice(0, 30) }}...</span>
          </el-tooltip>
          <span v-else>{{ room.project?.name || '--' }}</span>
        </span>
        <span>{{ $t('dorm.room.fieldBedCount') }}：{{ room.bed_usage_ratio || '--' }}</span>
      </div>
      <div class="dorm-room-card__row">
        <span>{{ $t('dorm.room.fieldStudents') }}：</span>
        <el-tooltip
          v-if="room.student_names && room.student_names.length > 60"
          :content="room.student_names"
          placement="top"
        >
          <span>{{ room.student_names.slice(0, 60) }}...</span>
        </el-tooltip>
        <span v-else>{{ room.student_names || '--' }}</span>
      </div>
    </div>

    <div class="dorm-room-card__footer" :class="genderFooterBgClass(room.gender)">
      <el-button
        v-if="room.is_active === 1"
        v-uni-permission="'room-assignment'"
        type="primary"
        link
        @click="emit('assign', room)"
      >
        {{ $t('dorm.room.assignBeds') }}
      </el-button>
      <el-button v-uni-permission="'room-edit'" type="warning" link @click="emit('edit', room)">
        {{ $t('dorm.common.edit') }}
      </el-button>
      <el-button v-uni-permission="'room-delete'" type="danger" link @click="emit('delete', room)">
        {{ $t('dorm.common.delete') }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { DormFloorWithRooms, DormRoomRecord } from '@/types/modules/dorm-room'

const props = defineProps<{
  room: DormRoomRecord
  floor: DormFloorWithRooms
}>()

const emit = defineEmits<{
  'status-change': [room: DormRoomRecord]
  edit: [room: DormRoomRecord]
  delete: [room: DormRoomRecord]
  assign: [room: DormRoomRecord]
}>()

const { t } = useUniI18n()

const campusName = computed(
  () =>
    props.floor.building?.school?.en_name || props.floor.building?.school?.cn_name || '--'
)

/** 与旧版一致：gender 1/2 与卡片底部 class 映射与表单标签相反 */
function genderCardBgClass(gender?: string | number) {
  if (String(gender) === '1') {
    return 'dorm-room-card--female-bg'
  }
  if (String(gender) === '2') {
    return 'dorm-room-card--male-bg'
  }
  return ''
}

function genderFooterBgClass(gender?: string | number) {
  if (String(gender) === '1') {
    return 'dorm-room-card__footer--male-bg'
  }
  if (String(gender) === '2') {
    return 'dorm-room-card__footer--female-bg'
  }
  return ''
}

function occupancyStatusText(status?: number) {
  if (status === 0) {
    return t('dorm.room.occupancyFree')
  }
  if (status === 1) {
    return t('dorm.room.occupancyPartial')
  }
  if (status === 2) {
    return t('dorm.room.occupancyFull')
  }
  return ''
}

function onStatusChange(val: string | number | boolean) {
  emit('status-change', { ...props.room, is_active: Number(val) })
}
</script>

<style scoped lang="scss">
.dorm-room-card {
  width: 360px;
  border-radius: 12px;
}

.dorm-room-card--male-bg {
  background-color: rgba(250, 241, 241, 1);
}

.dorm-room-card--female-bg {
  background-color: rgba(233, 244, 249, 1);
}

.dorm-room-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dorm-room-card__title {
  font-size: 16px;
  font-weight: 500;
}

.dorm-room-card__occupancy {
  margin-left: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: normal;
  border-radius: 6px;
}

.dorm-room-card__occupancy--0 {
  color: #10b981;
  background-color: rgba(156, 209, 160, 0.21);
}

.dorm-room-card__occupancy--1 {
  color: #3b82f6;
  background-color: rgba(205, 233, 253, 1);
}

.dorm-room-card__occupancy--2 {
  color: #ef4444;
  background-color: rgba(224, 162, 162, 0.21);
}

.dorm-room-card__body {
  padding-top: 8px;
  font-size: 14px;
  border-top: 1px solid #f2f6fc;
}

.dorm-room-card__row {
  margin-bottom: 12px;
  color: #303133;

  &--split {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
}

.dorm-room-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 20px;
  background-color: #fafafa;
  border-top: 1px solid #f2f6fc;
  border-radius: 0 0 12px 12px;
}

.dorm-room-card__footer--male-bg {
  background-color: rgba(218, 238, 245, 1);
}

.dorm-room-card__footer--female-bg {
  background-color: rgba(250, 230, 230, 1);
}
</style>
