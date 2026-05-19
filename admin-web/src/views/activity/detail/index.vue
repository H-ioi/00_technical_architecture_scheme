<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="activity-event-detail uni-list-page">
    <div class="activity-event-detail__header uni-list-page__header">
      <div>
        <h1>{{ pageTitle }}</h1>
        <p v-if="form.magicNo" class="uni-list-page__description">
          {{ $t('activity.colMagicNo') }}：{{ form.magicNo }}
        </p>
      </div>
      <div class="uni-list-page__header-actions activity-event-detail__actions">
        <template v-if="canSubmit">
          <el-button type="primary" :loading="saving" @click="submit">
            {{ $t('common.submit') }}
          </el-button>
          <el-divider direction="vertical" class="activity-event-detail__divider" />
        </template>
        <el-button
          v-else-if="!isEditRoute && detailId && canEdit"
          v-uni-permission="'busdriver_edit'"
          type="primary"
          @click="goEdit"
        >
          {{ $t('activity.entryEdit') }}
        </el-button>
        <el-button @click="goBack">{{ $t('activity.back') }}</el-button>
      </div>
    </div>

    <el-tabs
      v-model="activeDetailTab"
      class="activity-event-detail__tabs"
      @tab-change="handleDetailTabChange"
    >
      <el-tab-pane :label="$t('activity.activityBaseInfo')" name="base">
        <div v-loading="loading" class="activity-event-detail__body">
          <UniForm
            ref="uniFormRef"
            v-model="formModel"
            :mode="uniMode"
            class="activity-event-detail__form"
            :config="formConfig"
          >
            <template #field-imageUrl>
              <div class="activity-event-detail__cover">
                <el-upload
                  v-if="uniMode === 'edit'"
                  class="activity-event-detail__cover-upload"
                  accept="image/*"
                  :show-file-list="false"
                  :before-upload="onCoverBeforeUpload"
                >
                  <el-button type="primary">{{ $t('activity.coverPick') }}</el-button>
                </el-upload>
                <div v-if="form.imageUrl" class="activity-event-detail__cover-preview">
                  <img :src="form.imageUrl" alt="">
                </div>
              </div>
            </template>
            <template #field-registrationLimit>
              <div class="activity-event-detail__reg">
                <el-radio-group v-if="uniMode === 'edit'" v-model="form.registrationUnlimited">
                  <el-radio :label="true">{{ $t('activity.regUnlimited') }}</el-radio>
                  <el-radio :label="false">{{ $t('activity.regLimited') }}</el-radio>
                </el-radio-group>
                <span v-else class="activity-event-detail__reg-view">
                  {{
                    form.registrationUnlimited
                      ? $t('activity.regUnlimited')
                      : String(form.registrationLimit ?? '')
                  }}
                </span>
                <el-input-number
                  v-if="uniMode === 'edit' && !form.registrationUnlimited"
                  v-model="form.registrationLimit"
                  :min="1"
                  :step="1"
                  :precision="0"
                  controls-position="right"
                  class="activity-event-detail__reg-cap"
                />
              </div>
            </template>
            <template #field-detailCn>
              <UniEditor
                v-if="uniMode === 'edit'"
                v-model="form.detailCn"
                class="activity-event-detail__uni-editor"
                height="min(280px, 32vh)"
                :placeholder="$t('activity.detailCnPh')"
              />
              <div
                v-else-if="detailHtmlCn"
                class="activity-event-detail__html-body"
                v-html="detailHtmlCn"
              />
              <span v-else class="activity-event-detail__html-empty">—</span>
            </template>
            <template #field-detailEn>
              <UniEditor
                v-if="uniMode === 'edit'"
                v-model="form.detailEn"
                class="activity-event-detail__uni-editor"
                height="min(280px, 32vh)"
                :placeholder="$t('activity.detailEnPh')"
              />
              <div
                v-else-if="detailHtmlEn"
                class="activity-event-detail__html-body"
                v-html="detailHtmlEn"
              />
              <span v-else class="activity-event-detail__html-empty">—</span>
            </template>
          </UniForm>

          <el-card
            v-if="Number(form.visibleScope) === 1 && detailId && canSubmit"
            shadow="never"
            class="activity-event-detail__scope-card"
          >
            <template #header>
              <span>{{ $t('activity.visibleScopeBlock') }}</span>
            </template>
            <p class="activity-event-detail__scope-tip">{{ $t('activity.visibleScopeHint') }}</p>
            <div class="activity-event-detail__scope-actions">
              <el-button type="primary" plain @click="downloadVisibleTpl">
                {{ $t('activity.visibleScopeTpl') }}
              </el-button>
              <el-upload
                accept=".xlsx,.xls"
                :show-file-list="false"
                :before-upload="
                  (raw) => {
                    void onVisibleScopeFile(raw as File)
                    return false
                  }
                "
              >
                <el-button plain>{{ $t('activity.visibleScopeUpload') }}</el-button>
              </el-upload>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.programListTitle')" name="program">
        <ActivityProgramCards
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.program}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.questionnaireContentTitle')" name="questionnaire">
        <ActivityQuestionnaireContent
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.questionnaire}`"
          :activity-id="detailId"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.registrationListTitle')" name="registration">
        <ActivityRegistrationTab
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.registration}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) === '3'"
          :show-export-ended="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.checkinListTitle')" name="checkin">
        <ActivityCheckinTab
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.checkin}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) === '3'"
          :show-export-ended="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.winnerListTitle')" name="winner">
        <ActivityWinnerTab
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.winner}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) !== '2'"
          :show-export-ended="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.voteInfoTitle')" name="voteInfo">
        <ActivityVoteInfoTab
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.voteInfo}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) !== '2'"
          :show-export-ended="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.blessingListTitle')" name="blessing">
        <ActivityBlessingTab
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.blessing}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) !== '2'"
          :show-export-ended="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('activity.feedbackListTitle')" name="feedback">
        <ActivityFeedbackTab
          v-if="detailId"
          :key="`${detailId}-${tabRefreshKeys.feedback}`"
          :activity-id="detailId"
          :read-only="String(form.activityStatus) !== '2'"
          :show-export-ended="String(form.activityStatus) === '3'"
        />
      </el-tab-pane>
      <el-tab-pane
        v-for="entry in relatedEntries"
        :key="entry.name"
        :label="entry.label"
        :name="entry.name"
      >
        <el-empty :description="$t('activity.detailTabPending')" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script setup lang="ts">
import { UniForm } from 'uni-ui-lib'

import UniEditor from '@/components/uni-editor/index.vue'

import ActivityBlessingTab from './tabs/blessing.vue'
import ActivityCheckinTab from './tabs/checkin.vue'
import ActivityFeedbackTab from './tabs/feedback.vue'
import ActivityProgramCards from './tabs/program-cards.vue'
import ActivityQuestionnaireContent from './tabs/questionnaire-content.vue'
import ActivityRegistrationTab from './tabs/registration.vue'
import ActivityVoteInfoTab from './tabs/vote-info.vue'
import ActivityWinnerTab from './tabs/winner.vue'
import { useActivityDetailPage } from './use-activity-detail-page'

const {
  detailHtmlCn,
  detailHtmlEn,
  canEdit,
  canSubmit,
  detailId,
  form,
  formModel,
  formConfig,
  activeDetailTab,
  tabRefreshKeys,
  goBack,
  goEdit,
  handleDetailTabChange,
  isEditRoute,
  loading,
  onCoverBeforeUpload,
  onVisibleScopeFile,
  relatedEntries,
  downloadVisibleTpl,
  pageTitle,
  saving,
  submit,
  uniFormRef,
  uniMode
} = useActivityDetailPage()
</script>

<style scoped lang="scss">
.activity-event-detail {
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
  }

  &__tabs {
    padding: 0 16px 16px;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
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

  &__reg {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  &__reg-cap {
    width: 200px;
  }

  &__reg-view {
    color: var(--el-text-color-regular);
  }

  &__scope-card {
    margin-top: 8px;
  }

  &__scope-tip {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__scope-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__uni-editor {
    width: 100%;
  }

  &__html-body {
    box-sizing: border-box;
    min-height: 80px;
    padding: 12px;
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-blank);
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;

    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }

  &__html-empty {
    color: var(--el-text-color-secondary);
  }

  :deep(.activity-detail-form__detail-cn-slot .el-form-item__content .el-input),
  :deep(.activity-detail-form__detail-en-slot .el-form-item__content .el-input) {
    display: none;
  }

  :deep(.activity-detail-form__cover-slot .el-form-item__content .el-input) {
    display: none;
  }

  :deep(.activity-detail-form__reg-slot .el-form-item__content .el-input-number) {
    display: none;
  }
}
</style>
