<template>
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__header-main">
        <span class="section-card__title has-icon">
          <i class="el-icon-document section-card__title-icon"></i>
          {{ $t('schoolDoctor.委托家长信息及签名验证') }}
        </span>
        <p class="section-card__subtitle">{{ $t('schoolDoctor.委托家长签名说明') }}</p>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.家长姓名')">
          <el-input v-model="form.parentName" :disabled="readonly" :placeholder="$t('schoolDoctor.请输入委派家长全名')" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.家长联系方式')">
          <el-input v-model="form.parentContact" :disabled="readonly" :placeholder="$t('schoolDoctor.请输入家长移动电话')" />
        </el-form-item>
      </el-col>
    </el-row>

    <div class="sign-block">
      <div class="sign-block__head">
        <span class="sign-block__title">
          <i class="el-icon-mobile-phone sign-block__title-icon"></i>
          {{ $t('schoolDoctor.家长签名英文') }}
        </span>
        <div v-if="!readonly" class="signature-mode">
          <el-radio-group :value="parentSignMode" size="small" @input="$emit('update:parentSignMode', $event)">
            <el-radio-button label="draw">{{ $t('schoolDoctor.在线手写') }}</el-radio-button>
            <el-radio-button label="upload">{{ $t('schoolDoctor.上传静态签名') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="signature-box">
        <div class="signature-box__label">
          <span>{{ $t('schoolDoctor.家长签字') }}</span>
          <el-button
            v-if="!readonly && parentSignMode === 'draw' && !form.parentSignaturePath"
            type="text"
            class="sign-link-btn"
            @click="$emit('open-signature')">
            <i class="el-icon-edit-outline"></i>
            {{ $t('schoolDoctor.去签字') }}
          </el-button>
          <el-button v-if="!readonly && form.parentSignaturePath" type="text" class="clear-btn" @click="$emit('clear-signature')">
            <i class="el-icon-refresh-left"></i>
            {{ $t('schoolDoctor.清除签名') }}
          </el-button>
        </div>

        <div v-if="form.parentSignaturePath" class="signature-preview">
          <el-image :src="form.parentSignaturePath" fit="contain" />
        </div>
        <template v-else-if="!readonly">
          <div v-if="parentSignMode === 'draw'" class="signature-panel" @click="$emit('open-signature')">
            <i class="el-icon-edit-outline"></i>
            <span>{{ $t('schoolDoctor.点击开始手写签名') }}</span>
          </div>
          <el-upload
            v-else
            class="upload-trigger-wrap"
            action="#"
            :show-file-list="false"
            accept="image/*"
            :http-request="(opt) => $emit('signature-upload', opt)"
            :before-upload="(file) => $emit('before-image', file)">
            <div class="upload-trigger upload-trigger--compact" :class="{ 'is-loading': signatureUploading }">
              <i class="el-icon-upload2 upload-trigger__icon"></i>
              <span>{{ $t('schoolDoctor.点击上传') }}</span>
            </div>
          </el-upload>
        </template>
        <span v-else class="signature-empty">-</span>
      </div>
    </div>

    <div v-if="modalType === 'add'" class="consent-box">
      <el-form-item prop="informedConsent" class="consent-item">
        <div class="consent-box__inner">
          <el-checkbox v-model="form.informedConsent" :true-label="1" :false-label="0" />
          <div class="consent-box__text">
            <div class="consent-box__main">{{ $t('schoolDoctor.知悉同意勾选') }}</div>
            <div class="consent-box__sub">{{ $t('schoolDoctor.知悉同意补充说明') }}</div>
          </div>
        </div>
      </el-form-item>
    </div>
    <div v-else-if="form.informedConsent === 1" class="consent-box consent-box--readonly">
      <div class="consent-box__inner">
        <i class="el-icon-success consent-box__icon"></i>
        <div class="consent-box__text">
          <div class="consent-box__main">{{ $t('schoolDoctor.知悉同意勾选') }}</div>
          <div class="consent-box__sub">{{ $t('schoolDoctor.知悉同意补充说明') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicationApplyParentSection',
  props: {
    form: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    modalType: { type: String, default: 'look' },
    parentSignMode: { type: String, default: 'draw' },
    signatureUploading: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.section-card {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(31, 45, 61, 0.04);
}

.section-card__header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.section-card__title {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-card__title-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #ba8e62;
}

.section-card__subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}

.sign-block {
  margin-top: 4px;
}

.sign-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sign-block__title {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.sign-block__title-icon {
  margin-right: 6px;
  font-size: 16px;
  color: #ba8e62;
}

.signature-mode {
  flex-shrink: 0;

  ::v-deep .el-radio-group {
    padding: 2px;
    background: #f0f2f5;
    border-radius: 6px;
  }

  ::v-deep .el-radio-button__inner {
    padding: 7px 12px;
    color: #909399;
    background: transparent;
    border: none !important;
    box-shadow: none !important;
  }

  ::v-deep .el-radio-button:first-child .el-radio-button__inner,
  ::v-deep .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 4px;
  }

  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #ba8e62;
    background: #fff;
    box-shadow: 0 1px 4px rgba(31, 45, 61, 0.12) !important;
  }
}

.signature-box {
  padding: 14px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafafa;
}

.signature-box__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.sign-link-btn {
  padding: 0;
  color: #ba8e62 !important;
}

.clear-btn {
  padding: 0;
  color: #909399 !important;
}

.signature-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: #fff;
  color: #909399;
  cursor: pointer;

  i {
    margin-bottom: 8px;
    font-size: 28px;
    color: #c0c4cc;
  }

  &:hover {
    border-color: #ba8e62;
    color: #ba8e62;

    i {
      color: #ba8e62;
    }
  }
}

.signature-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  padding: 12px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;

  ::v-deep .el-image {
    display: block;
    width: 100%;
    height: 160px;
  }

  ::v-deep .el-image__inner {
    width: 100%;
    height: 100%;
  }
}

.signature-empty {
  color: #909399;
}

.upload-trigger-wrap {
  display: block;
  width: 100%;

  ::v-deep .el-upload {
    display: block;
    width: 100%;
    color: inherit;
  }

  ::v-deep .upload-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 140px;
    flex-direction: column;
    color: #606266;
    background: #fff;
    border: 1px dashed #dcdfe6;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      color: #ba8e62;
      border-color: #ba8e62;
    }

    &.is-loading {
      opacity: 0.75;
      pointer-events: none;
    }
  }

  ::v-deep .upload-trigger__icon {
    font-size: 28px;
    color: #ba8e62;
  }
}

.consent-box {
  margin-top: 16px;
  padding: 14px 16px;
  background: #faf6f0;
  border: 1px solid #f0e6d8;
  border-radius: 10px;

  &--readonly {
    padding: 14px 16px;
  }
}

.consent-box__inner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.consent-box__icon {
  margin-top: 2px;
  font-size: 18px;
  color: #67c23a;
}

.consent-box__text {
  flex: 1;
  min-width: 0;
}

.consent-box__main {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: #303133;
}

.consent-box__sub {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: #909399;
}

.consent-item {
  margin-bottom: 0;

  ::v-deep .el-form-item__content {
    line-height: 1.4;
  }
}
</style>
