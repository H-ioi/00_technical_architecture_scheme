<template>
  <div id="bus-order-persons" class="bus-order-form__block bus-order-form__anchor-target">
    <div class="bus-order-form__block-head">
      <span>{{ $t('schoolBus.studentApply.detailPersonTitle') }}</span>
      <el-button type="primary" link @click="openPersonAdd">
        {{ $t('schoolBus.studentOrder.formAddPerson') }}
      </el-button>
    </div>
    <div class="bus-order-form__table-wrap">
      <el-table :data="personTableData" border size="small">
        <el-table-column
          prop="pickupRelationships"
          :label="$t('schoolBus.studentApply.detailRelation')" />
        <el-table-column
          prop="pickupPhone"
          :label="$t('schoolBus.studentApply.detailPhone')"
          width="140" />
        <el-table-column :label="$t('schoolBus.studentApply.detailPhoto')" min-width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.pickupImageUrl"
              :src="String(row.pickupImageUrl)"
              class="bus-order-form__thumb" />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('schoolBus.studentOrder.formOps')" width="140">
          <template #default="{ row, $index }">
            <el-button type="primary" link @click="openPersonEdit(row, $index)">
              {{ $t('schoolBus.edit') }}
            </el-button>
            <el-button type="danger" link @click="removePerson($index)">
              {{ $t('schoolBus.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PersonRow } from '../bus-order-form-types'

defineProps<{
  personTableData: PersonRow[]
  openPersonAdd: () => void
  openPersonEdit: (row: PersonRow, index: number) => void
  removePerson: (index: number) => void
}>()
</script>
