<template>
  <section class="activity-program-edit uni-list-page">
    <div class="activity-program-edit__header uni-list-page__header">
      <div>
        <h1>{{ pageTitle }}</h1>
      </div>
      <div class="uni-list-page__header-actions activity-program-edit__actions">
        <template v-if="canSubmit">
          <el-button type="primary" :loading="saving" @click="submit">
            {{ $t('common.submit') }}
          </el-button>
          <el-divider direction="vertical" class="activity-program-edit__divider" />
        </template>
        <el-button
          v-else-if="detailId && canEdit"
          v-uni-permission="'busdriver_edit'"
          type="primary"
          @click="goEdit"
        >
          {{ $t('activity.entryEdit') }}
        </el-button>
        <el-button @click="goBack">{{ $t('activity.back') }}</el-button>
      </div>
    </div>

    <div v-loading="loading" class="activity-program-edit__body">
      <UniForm
        ref="uniFormRef"
        v-model="formModel"
        :mode="uniMode"
        class="activity-program-edit__form"
        :config="formConfig"
      >
        <template #field-backgroundImage>
          <div class="activity-program-edit__cover">
            <el-upload
              v-if="uniMode === 'edit' && !bodyLocked"
              class="activity-program-edit__cover-upload"
              accept="image/*"
              :show-file-list="false"
              :before-upload="onCoverBeforeUpload"
            >
              <el-button type="primary">{{ $t('activity.pickCover') }}</el-button>
            </el-upload>
            <div v-if="form.backgroundImage" class="activity-program-edit__cover-preview">
              <img :src="form.backgroundImage" alt="">
            </div>
          </div>
        </template>
        <template #field-programQuotasMarker>
          <div v-if="form.programType === '1'" class="activity-program-edit__quotas">
            <div
              v-for="item in quotasList"
              :key="item.roundNo"
              class="activity-program-edit__quota-row"
            >
              <span class="activity-program-edit__quota-label">{{ item.roundNo }}:</span>
              <el-input-number
                v-if="uniMode === 'edit'"
                v-model="item.quotaCount"
                :disabled="bodyLocked"
                :min="1"
                :max="getQuotaMax(item)"
                :step="1"
                :precision="0"
                controls-position="right"
                style="width: 200px"
                @change="normalizeQuotaRow(item)"
              />
              <span v-else>{{ item.quotaCount }}</span>
            </div>
          </div>
        </template>
      </UniForm>
    </div>
  </section>
</template>

<script setup lang="ts">
import { UniForm } from 'uni-ui-lib'

import { useProgramEditPage } from './use-program-edit'

const {
  bodyLocked,
  canEdit,
  canSubmit,
  detailId,
  form,
  formModel,
  formConfig,
  getQuotaMax,
  goBack,
  goEdit,
  loading,
  onCoverBeforeUpload,
  normalizeQuotaRow,
  pageTitle,
  quotasList,
  saving,
  submit,
  uniFormRef,
  uniMode
} = useProgramEditPage()
</script>

<style scoped lang="scss">
.activity-program-edit {
  &__header {
    align-items: flex-start;
  }

  &__actions {
    align-items: center;
  }

  &__divider {
    margin: 0 8px;
  }

  &__body {
    min-height: 120px;
    background: var(--el-fill-color-blank);
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-border-color-lighter);
    padding: 20px 16px 0;
  }

  &__form {
    margin-bottom: 16px;
  }

  &__cover {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 12px;
  }

  &__cover-preview img {
    display: block;
    max-width: 240px;
    max-height: 160px;
    border-radius: 4px;
    object-fit: contain;
  }

  &__quotas {
    width: 100%;
  }

  &__quota-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  &__quota-label {
    min-width: 28px;
    color: var(--el-text-color-regular);
  }
}
</style>
