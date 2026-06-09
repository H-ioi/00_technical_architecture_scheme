<template>
  <div class="content-block">
    <div v-for="(item, index) in list" :key="index" class="medication-card">
      <div class="medication-card__header">
        <span class="medication-card__title">
          <span class="medication-card__index">{{ index + 1 }}</span>
          {{ $t('schoolDoctor.用药内容明细') }}
        </span>
        <el-button v-if="!readonly && list.length > 1" type="text" class="danger-text" @click="removeItem(index)">
          <i class="el-icon-delete"></i>
          {{ $t('schoolDoctor.删除组') }}
        </el-button>
      </div>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.药物名称')">
            <el-input v-model="item.medicineName" :disabled="readonly" :placeholder="$t('schoolDoctor.药物名称示例')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.带到学校的数量')">
            <el-input v-model="item.bringQuantity" :disabled="readonly" :placeholder="$t('schoolDoctor.带到学校数量示例')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.用药剂量')">
            <el-input v-model="item.dosage" :disabled="readonly" :placeholder="$t('schoolDoctor.用药剂量示例')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.用药开始日期')">
            <el-date-picker
              v-model="item.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              :placeholder="$t('schoolDoctor.请选择年月日')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.用药结束日期')">
            <el-date-picker
              v-model="item.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="readonly"
              :placeholder="$t('schoolDoctor.请选择年月日')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.给药时间')">
            <el-select v-model="item.administrationTimeType" style="width: 100%" clearable :disabled="readonly" :placeholder="$t('schoolDoctor.请选择')">
              <el-option v-for="opt in administrationTimeOptions" :key="opt.value" :label="$t(`schoolDoctor.${opt.labelKey}`)" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.用药频率')">
            <el-select v-model="item.frequencyType" style="width: 100%" clearable :disabled="readonly" :placeholder="$t('schoolDoctor.请选择')">
              <el-option v-for="opt in frequencyOptions" :key="opt.value" :label="$t(`schoolDoctor.${opt.labelKey}`)" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="item.frequencyType === 5" :span="8">
          <el-form-item :label="$t('schoolDoctor.用药频率其他')">
            <el-input v-model="item.frequencyOther" :disabled="readonly" :placeholder="$t('schoolDoctor.请输入备注')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.用药途径')">
            <el-select v-model="item.routeType" style="width: 100%" clearable :disabled="readonly" :placeholder="$t('schoolDoctor.请选择')">
              <el-option v-for="opt in routeOptions" :key="opt.value" :label="$t(`schoolDoctor.${opt.labelKey}`)" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="item.routeType === 5" :span="8">
          <el-form-item :label="$t('schoolDoctor.用药途径其他')">
            <el-input v-model="item.routeOther" :disabled="readonly" :placeholder="$t('schoolDoctor.请输入备注')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('schoolDoctor.餐前餐后')">
            <el-select v-model="item.mealTiming" style="width: 100%" clearable :disabled="readonly" :placeholder="$t('schoolDoctor.请选择')">
              <el-option v-for="opt in mealTimingOptions" :key="opt.value" :label="$t(`schoolDoctor.${opt.labelKey}`)" :value="opt.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('schoolDoctor.副作用及其他重要事宜')">
            <el-input v-model="item.sideEffects" type="textarea" :rows="3" :disabled="readonly" :placeholder="$t('schoolDoctor.副作用填写提示')" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-button v-if="!readonly" class="add-medication-btn" @click="addItem">
      <i class="el-icon-plus"></i>
      {{ $t('schoolDoctor.新增用药内容') }}
    </el-button>
  </div>
</template>

<script>
import {
  ADMINISTRATION_TIME_OPTIONS,
  createEmptyContentItem,
  FREQUENCY_OPTIONS,
  MEAL_TIMING_OPTIONS,
  ROUTE_OPTIONS
} from '../utils/medicationApplyOptions.js'

export default {
  name: 'MedicationContentBlock',
  props: {
    list: { type: Array, default: () => [] },
    readonly: { type: Boolean, default: false }
  },
  data() {
    return {
      administrationTimeOptions: ADMINISTRATION_TIME_OPTIONS,
      frequencyOptions: FREQUENCY_OPTIONS,
      routeOptions: ROUTE_OPTIONS,
      mealTimingOptions: MEAL_TIMING_OPTIONS
    }
  },
  methods: {
    addItem() {
      this.list.push(createEmptyContentItem())
    },
    removeItem(index) {
      this.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #ba8e62;

.content-block {
  margin-bottom: 8px;
}

.medication-card {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafafa;
}

.medication-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.medication-card__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: $theme-color;
}

.medication-card__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  color: #fff;
  background: $theme-color;
  border-radius: 50%;
}

.danger-text {
  padding: 0;
  color: #f56c6c !important;
}

.add-medication-btn {
  width: 100%;
  height: 40px;
  border: 1px dashed $theme-color !important;
  color: $theme-color !important;
  background: #fff !important;

  i {
    margin-right: 4px;
    font-weight: 700;
  }

  &:hover {
    color: #fff !important;
    border-color: $theme-color !important;
    background: $theme-color !important;
  }
}
</style>
