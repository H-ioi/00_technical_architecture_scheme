<template>
  <div class="bus-order-form__sign-block">
    <div class="bus-order-form__upload-row">
      <el-button :disabled="mainDisabled" @click="triggerSignPick">
        {{ $t('schoolBus.car.pickImage') }}
      </el-button>
    </div>
    <el-image
      v-if="ruleForm.signImageUrl"
      :src="String(ruleForm.signImageUrl)"
      fit="contain"
      class="bus-order-form__sign-image"
      :preview-src-list="[String(ruleForm.signImageUrl)]"
      preview-teleported />
  </div>
  <input
    ref="signFileRef"
    type="file"
    accept="image/*"
    class="bus-order-form__hidden-file"
    @change="onSignFile" />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'

import { busOrderRuleFormKey } from '../bus-order-form-types'

const ruleForm = inject(busOrderRuleFormKey)!

defineProps<{
  mainDisabled: boolean
  onSignFile: (e: Event) => void
}>()

const signFileRef = ref<HTMLInputElement | null>(null)

const triggerSignPick = () => signFileRef.value?.click()
</script>
