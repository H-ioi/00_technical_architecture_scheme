<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="min(1000px, 96vw)"
    destroy-on-close
    class="content-food-weekly-form-dialog">
    <div
      v-loading="detailLoading"
      class="content-food-weekly-form-dialog__body"
      :element-loading-text="$t('common.loading')">
      <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="dialogFormCfg">
        <template #field-cnContent>
          <UniEditor v-model="editorHtml" height="320px" />
        </template>
      </UniForm>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ $t('content.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        {{ $t('content.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { UniForm, useUniI18n } from 'uni-ui-lib'
import type { UniFormConfig } from 'uni-ui-lib'
import { computed, ref, watch } from 'vue'

import { contentFoodWeeklyApi } from '@/api'
import UniEditor from '@/components/uni-editor/index.vue'
import type { FoodWeeklyFormModel } from '@/types/modules/content-food-weekly'
import { normalizePayload } from '@/utils/api-response-normalize'

import { dialogFormConfig, dialogFormRules, emptyFormModel } from '../list.config'

import { useDialogDetailLoading } from '@/composables/use-dialog-detail-loading'

type Loose = Record<string, unknown>

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  mode: 'add' | 'edit'
  recordId: string | number | null
  schoolOptions: Array<{ label: string; value: string | number }>
}>()

const emit = defineEmits<{
  saved: []
}>()

const { t } = useUniI18n()
const { detailLoading, runWithDetailLoading } = useDialogDetailLoading()

const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const submitting = ref(false)
const formModel = ref<FoodWeeklyFormModel>(emptyFormModel())
const editorHtml = ref('')

const dialogFormCfg = computed<UniFormConfig>(() => ({
  ...dialogFormConfig(t, props.schoolOptions),
  rules: dialogFormRules(t)
}))

const title = computed(() =>
  t(props.mode === 'add' ? 'content.foodWeekly.formAdd' : 'content.foodWeekly.formEdit')
)

watch(
  () => visible.value,
  (open) => {
    if (!open) {
      formModel.value = emptyFormModel()
      editorHtml.value = ''
      return
    }

    void runWithDetailLoading(async () => {
      formModel.value = emptyFormModel()
      editorHtml.value = ''
      if (props.mode === 'edit' && props.recordId != null) {
        const raw = await contentFoodWeeklyApi.detail.get(props.recordId)
        const row = normalizePayload(raw) as Loose
        formModel.value = {
          id: row.id as string | number,
          schoolId: row.schoolId as string | number | undefined,
          wechatUrl: String(row.wechatUrl || ''),
          cnContent: String(row.cnContent || '')
        }
        editorHtml.value = String(row.cnContent || '')
      }
    })
  }
)

const submit = async () => {
  const valid = await uniFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitting.value = true
  try {
    const html = editorHtml.value
    const payload: FoodWeeklyFormModel = {
      ...formModel.value,
      cnContent: html,
      enContent: html
    }

    if (props.mode === 'add') {
      await contentFoodWeeklyApi.create.post(payload)
    } else {
      await contentFoodWeeklyApi.update.post(payload)
    }

    ElMessage.success(t('content.saveSuccess'))
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.content-food-weekly-form-dialog__body {
  min-height: 200px;
  max-height: min(70vh, 640px);
  overflow: auto;
}
</style>
