<template>
  <section class="uni-list-page dorm-room-assign-page">
    <div class="uni-list-page__header">
      <div>
        <h1 class="dorm-room-assign-page__title">
          <el-button class="dorm-room-assign-page__back" link @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          {{ $t('dorm.roomAssign.pageTitle') }}
          <span v-if="roomNumber" class="dorm-room-assign-page__room-no">{{ roomNumber }}</span>
        </h1>
        <p>{{ $t('dorm.roomAssign.pageDesc') }}</p>
      </div>
      <div class="uni-list-page__header-actions">
        <el-button type="primary" @click="addBedVisible = true">
          {{ $t('dorm.roomAssign.addBed') }}
        </el-button>
      </div>
    </div>

    <div v-loading="listLoading" class="dorm-room-assign-page__content">
      <div class="dorm-room-assign-page__cards">
        <BedCard
          v-for="bed in beds"
          :key="bed.id"
          :bed="bed"
          @checkin="openCheckin"
          @change="openChange"
          @checkout="confirmCheckout"
          @delete="confirmDeleteBed"
        />
      </div>
      <el-empty v-if="!listLoading && beds.length === 0" />
    </div>

    <AddBedDialog v-model:visible="addBedVisible" :room-id="roomId" @saved="fetchBeds" />

    <CheckinDialog
      v-model:visible="checkinVisible"
      :room-id="roomId"
      :bed-label="activeBed?.label"
      :gender="genderQuery"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="fetchBeds"
    />

    <ChangeDialog
      v-model:visible="changeVisible"
      :admission-no="activeAdmissionNo"
      :school-options="schoolOptions"
      :default-school-id="defaultSchoolId ?? undefined"
      @saved="fetchBeds"
    />
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import AddBedDialog from './components/add-bed-dialog.vue'
import BedCard from './components/bed-card.vue'
import ChangeDialog from './components/change-dialog.vue'
import CheckinDialog from './components/checkin-dialog.vue'
import { dormBedApi, dormRoomApi, membershipApi } from '@/api'
import type { DormBedRecord, DormRoomWithBeds } from '@/types/modules/dorm-bed'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeArray, normalizePayload } from '@/utils/api-response-normalize'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUniI18n, toUniOptions } from 'uni-ui-lib'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Loose = Record<string, unknown>

const route = useRoute()
const router = useRouter()
const { t } = useUniI18n()

const roomId = computed(() => String(route.params.id ?? ''))
const genderQuery = computed(() => String(route.query.gender ?? ''))
const schoolIdQuery = computed(() => {
  const raw = route.query.schoolId
  if (raw == null || raw === '') {
    return undefined
  }
  return Array.isArray(raw) ? raw[0] : raw
})

const schoolRecords = ref<SchoolOptionRecord[]>([])
const roomDetail = ref<DormRoomWithBeds>({})
const listLoading = ref(false)

const addBedVisible = ref(false)
const checkinVisible = ref(false)
const changeVisible = ref(false)
const activeBed = ref<DormBedRecord | null>(null)
const activeAdmissionNo = ref('')

const schoolOptions = computed(() =>
  toUniOptions(schoolRecords.value, {
    labelKeys: ['enName', 'cnName', 'name'],
    valueKey: 'externId'
  }).map((item, index) => ({
    ...item,
    value: item.value ?? schoolRecords.value[index]?.id
  }))
)

const defaultSchoolId = computed(() => {
  if (schoolIdQuery.value != null && schoolIdQuery.value !== '') {
    return schoolIdQuery.value
  }
  if (schoolRecords.value.length !== 1) {
    return null
  }
  const school = schoolRecords.value[0]
  return school.externId ?? school.id
})

const beds = computed(() => roomDetail.value.beds ?? [])
const roomNumber = computed(() => roomDetail.value.number ?? '')

function goBack() {
  router.back()
}

async function fetchBeds() {
  if (!roomId.value) {
    return
  }
  listLoading.value = true
  try {
    const raw = await dormRoomApi.detail.get(roomId.value)
    const payload = normalizePayload(raw) as Loose
    roomDetail.value = payload as DormRoomWithBeds
  } finally {
    listLoading.value = false
  }
}

function openCheckin(bed: DormBedRecord) {
  activeBed.value = bed
  checkinVisible.value = true
}

function openChange(bed: DormBedRecord) {
  activeAdmissionNo.value = bed.admissionNo ?? bed.student?.admission_no ?? ''
  changeVisible.value = true
}

async function confirmCheckout(bed: DormBedRecord) {
  const admissionNo = bed.admissionNo ?? bed.student?.admission_no
  if (!admissionNo) {
    return
  }

  try {
    await ElMessageBox.confirm(
      t('dorm.roomAssign.confirmCheckout'),
      t('dorm.roomAssign.confirmTitle'),
      {
        confirmButtonText: t('dorm.common.submit'),
        cancelButtonText: t('dorm.common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  await dormBedApi.checkout.post({
    bed_id: Number(bed.id),
    admission_no: admissionNo
  })
  ElMessage.success(t('dorm.roomAssign.checkoutSuccess'))
  void fetchBeds()
}

async function confirmDeleteBed(bed: DormBedRecord) {
  try {
    await ElMessageBox.confirm(
      t('dorm.roomAssign.confirmDeleteBed'),
      t('dorm.roomAssign.confirmTitle'),
      {
        confirmButtonText: t('dorm.common.delete'),
        cancelButtonText: t('dorm.common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  await dormBedApi.delete.post({ id: bed.id })
  ElMessage.success(t('dorm.common.deleteSuccess'))
  void fetchBeds()
}

onMounted(async () => {
  const raw = await membershipApi.school.get()
  schoolRecords.value = normalizeArray<SchoolOptionRecord>(raw)
  void fetchBeds()
})
</script>

<style scoped lang="scss">
.dorm-room-assign-page__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.dorm-room-assign-page__back {
  padding: 0;
  font-size: 18px;
}

.dorm-room-assign-page__room-no {
  font-size: 16px;
  font-weight: 400;
  color: #606266;
}

.dorm-room-assign-page__content {
  min-height: 120px;
}

.dorm-room-assign-page__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
