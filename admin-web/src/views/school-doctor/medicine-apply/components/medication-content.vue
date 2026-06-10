<template>
  <div class="medication-content">
    <div v-for="(item, index) in contentList" :key="index" class="medication-content__card">
      <div class="medication-content__head">
        <span>{{ index + 1 }}. {{ $t('schoolDoctor.medicineApply.contentTitle') }}</span>
        <el-button v-if="!readonly && contentList.length > 1" type="danger" link @click="removeItem(index)">
          {{ $t('schoolDoctor.medicineApply.removeGroup') }}
        </el-button>
      </div>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldMedicineName')">
            <el-input v-model="item.medicineName" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldBringQty')">
            <el-input v-model="item.bringQuantity" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldDosage')">
            <el-input v-model="item.dosage" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldStartDate')">
            <el-date-picker v-model="item.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldEndDate')">
            <el-date-picker v-model="item.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldAdminTime')">
            <el-select v-model="item.administrationTimeType" clearable style="width: 100%" :disabled="readonly">
              <el-option v-for="opt in adminTimeOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldFrequency')">
            <el-select v-model="item.frequencyType" clearable style="width: 100%" :disabled="readonly">
              <el-option v-for="opt in frequencyOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="item.frequencyType === 5" :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldFrequencyOther')">
            <el-input v-model="item.frequencyOther" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldRoute')">
            <el-select v-model="item.routeType" clearable style="width: 100%" :disabled="readonly">
              <el-option v-for="opt in routeOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="item.routeType === 5" :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldRouteOther')">
            <el-input v-model="item.routeOther" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldMealTiming')">
            <el-select v-model="item.mealTiming" clearable style="width: 100%" :disabled="readonly">
              <el-option v-for="opt in mealOpts" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('schoolDoctor.medicineApply.fieldSideEffects')">
            <el-input v-model="item.sideEffects" type="textarea" :rows="2" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-button v-if="!readonly" class="medication-content__add" @click="addItem">
      {{ $t('schoolDoctor.medicineApply.addContent') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { computed } from 'vue'

import type { MedicineApplyContentItem } from '@/types/modules/school-doctor-medicine-apply'

import { emptyContentItem } from '../list.config'

defineProps<{ readonly?: boolean }>()

const contentList = defineModel<MedicineApplyContentItem[]>('contentList', { required: true })

const { t } = useUniI18n()

const adminTimeOpts = computed(() => [
  { label: t('schoolDoctor.medicineApply.adminTimeNormal'), value: 1 },
  { label: t('schoolDoctor.medicineApply.adminTimeFreq'), value: 2 },
  { label: t('schoolDoctor.medicineApply.adminTimeStrict'), value: 3 }
])
const frequencyOpts = computed(() => [
  { label: t('schoolDoctor.medicineApply.freqOnce'), value: 1 },
  { label: t('schoolDoctor.medicineApply.freqTwice'), value: 2 },
  { label: t('schoolDoctor.medicineApply.freqThrice'), value: 3 },
  { label: t('schoolDoctor.medicineApply.freqSixHours'), value: 4 },
  { label: t('schoolDoctor.medicineApply.freqOther'), value: 5 }
])
const routeOpts = computed(() => [
  { label: t('schoolDoctor.medicineApply.routeOral'), value: 1 },
  { label: t('schoolDoctor.medicineApply.routeTopical'), value: 2 },
  { label: t('schoolDoctor.medicineApply.routeInhale'), value: 3 },
  { label: t('schoolDoctor.medicineApply.routeEye'), value: 4 },
  { label: t('schoolDoctor.medicineApply.routeOther'), value: 5 }
])
const mealOpts = computed(() => [
  { label: t('schoolDoctor.medicineApply.mealBefore'), value: 1 },
  { label: t('schoolDoctor.medicineApply.mealAfter'), value: 2 }
])

function addItem() {
  contentList.value.push(emptyContentItem())
}

function removeItem(index: number) {
  contentList.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
.medication-content {
  &__card {
    margin-bottom: 12px;
    padding: 14px;
    background: var(--el-fill-color-light);
    border-radius: 10px;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: 600;
  }

  &__add {
    width: 100%;
  }
}
</style>
