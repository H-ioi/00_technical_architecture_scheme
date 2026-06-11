<template>
  <el-dialog
    v-model="visible"
    width="400px"
    append-to-body
    :title="personDialogTitle"
    destroy-on-close
    @closed="resetPersonForm">
    <UniForm
      ref="personUniFormRef"
      v-model="personForm"
      mode="edit"
      :config="personDialogFormConfig">
      <template #field-pickupImageUrl>
        <div class="bus-order-form__upload-row">
          <el-button @click="triggerPersonPick">{{ $t('schoolBus.car.pickImage') }}</el-button>
          <span v-if="personForm.pickupImageUrl" class="bus-order-form__url">{{
            personForm.pickupImageUrl
          }}</span>
        </div>
        <input
          ref="personFileRef"
          type="file"
          accept="image/*"
          class="bus-order-form__hidden-file"
          @change="onPersonFile" />
      </template>
    </UniForm>
    <template #footer>
      <el-button @click="visible = false">{{ $t('schoolBus.cancel') }}</el-button>
      <el-button type="primary" @click="submitPerson">{{ $t('schoolBus.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm } from 'uni-ui-lib'
import { ref } from 'vue'

import type { PersonRow } from '../bus-order-form-types'

const visible = defineModel<boolean>('visible', { required: true })
const personForm = defineModel<PersonRow>('personForm', { required: true })

defineProps<{
  personDialogTitle: string
  personDialogFormConfig: UniFormConfig
  resetPersonForm: () => void
  submitPerson: () => void | Promise<void>
  onPersonFile: (e: Event) => void
}>()

const personUniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const personFileRef = ref<HTMLInputElement | null>(null)

const triggerPersonPick = () => personFileRef.value?.click()

defineExpose({ personUniFormRef })
</script>
