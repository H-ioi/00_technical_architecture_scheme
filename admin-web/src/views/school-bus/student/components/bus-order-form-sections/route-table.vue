<template>
  <div id="bus-order-routes" class="bus-order-form__block bus-order-form__anchor-target">
    <div class="bus-order-form__block-head">
      <span>{{ $t('schoolBus.studentOrder.formRoutes') }}</span>
      <el-button
        v-if="!mainDisabled && routeTableData.length < 2"
        type="primary"
        link
        @click="openRouteAdd">
        {{ $t('schoolBus.studentOrder.formAddRoute') }}
      </el-button>
    </div>
    <div class="bus-order-form__table-wrap">
      <el-table :data="routeTableData" border size="small">
        <el-table-column
          prop="lineName"
          :label="$t('schoolBus.studentApply.detailRouteLine')"
          min-width="100" />
        <el-table-column
          prop="stationName"
          :label="$t('schoolBus.studentApply.detailRouteStation')"
          min-width="100" />
        <el-table-column
          prop="lineTypeName"
          :label="$t('schoolBus.studentApply.detailLineType')"
          width="120" />
        <el-table-column
          prop="weekDaysLabel"
          :label="$t('schoolBus.studentOrder.formDateOption')"
          width="100" />
        <el-table-column
          prop="ridingWeekDay"
          :label="$t('schoolBus.studentApply.detailRidingWeekDay')"
          min-width="100" />
        <el-table-column
          prop="ridingRange"
          :label="$t('schoolBus.studentOrder.formRideRange')"
          width="200" />
        <el-table-column
          prop="carNumber"
          :label="$t('schoolBus.studentOrder.formPlate')"
          width="100" />
        <el-table-column :label="$t('schoolBus.studentOrder.formOps')" width="140">
          <template #default="{ row, $index }">
            <el-button type="primary" link @click="openRouteEdit(row, $index)">
              {{ $t('schoolBus.edit') }}
            </el-button>
            <el-button v-if="!mainDisabled" type="danger" link @click="removeRoute($index)">
              {{ $t('schoolBus.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteRow } from '../bus-order-form-types'

defineProps<{
  routeTableData: RouteRow[]
  mainDisabled: boolean
  openRouteAdd: () => void
  openRouteEdit: (row: RouteRow, index: number) => void
  removeRoute: (index: number) => void
}>()
</script>
