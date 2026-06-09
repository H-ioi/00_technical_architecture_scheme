<template>
  <div class="section-card">
    <div class="section-card__header">
      <div class="section-card__header-main">
        <span class="section-card__title has-icon">
          <i class="el-icon-folder-opened section-card__title-icon"></i>
          {{ $t('schoolDoctor.附件信息') }}
        </span>
        <p class="section-card__subtitle">{{ $t('schoolDoctor.附件信息说明') }}</p>
      </div>
    </div>

    <div class="upload-row">
      <div v-for="group in fileGroups" :key="group.type" class="upload-card">
        <div class="upload-card__head">
          <span class="upload-card__title">{{ $t(`schoolDoctor.${group.label}`) }}</span>
          <span class="upload-card__tip" :class="{ 'is-danger': group.type === 4 }">
            {{ $t(`schoolDoctor.${group.tipKey}`) }}
          </span>
        </div>
        <el-upload
          v-if="!readonly"
          class="upload-trigger-wrap"
          action="#"
          :show-file-list="false"
          :http-request="(opt) => $emit('upload', opt, group.type)"
          :accept="getUploadAccept(group.type)"
          :before-upload="(file) => $emit('before-upload', file, group.type)">
          <div class="upload-trigger" :class="{ 'is-loading': uploading }">
            <i class="el-icon-upload2 upload-trigger__icon"></i>
            <span>{{ $t('schoolDoctor.点击上传') }}</span>
          </div>
        </el-upload>
        <div v-if="getAttachments(group.type).length" class="uploaded-file-list">
          <div v-for="(file, fileIndex) in getAttachments(group.type)" :key="`${group.type}-${fileIndex}`" class="uploaded-file">
            <el-link type="primary" :underline="false" :href="file.attachUrl" target="_blank" class="uploaded-file__name">
              {{ getFileName(file, fileIndex) }}
            </el-link>
            <el-button v-if="!readonly" type="text" class="remove-btn" @click="$emit('remove-attachment', group.type, fileIndex)">
              {{ $t('schoolDoctor.移除') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="proof-block">
      <div class="proof-block__title">{{ $t('schoolDoctor.医疗特殊证明') }}</div>
      <el-input
        class="proof-input"
        :value="specialProofRemark"
        :disabled="readonly"
        :placeholder="$t('schoolDoctor.请输入医疗特殊证明说明')"
        @input="$emit('update:specialProofRemark', $event)">
        <template v-if="!readonly" slot="append">
          <el-upload
            class="proof-upload-append"
            action="#"
            :show-file-list="false"
            :http-request="(opt) => $emit('upload', opt, 2)"
            :before-upload="(file) => $emit('before-upload', file, 2)">
            <span class="proof-upload-btn" :class="{ 'is-loading': uploading }">
              <i class="el-icon-upload2"></i>
              {{ $t('schoolDoctor.点击上传') }}
            </span>
          </el-upload>
        </template>
      </el-input>
      <div v-if="getAttachments(2).length" class="uploaded-file-list">
        <div v-for="(file, fileIndex) in getAttachments(2)" :key="`proof-${fileIndex}`" class="uploaded-file">
          <el-link type="primary" :underline="false" :href="file.attachUrl" target="_blank" class="uploaded-file__name">
            {{ getFileName(file, fileIndex) }}
          </el-link>
          <el-button v-if="!readonly" type="text" class="remove-btn" @click="$emit('remove-attachment', 2, fileIndex)">
            {{ $t('schoolDoctor.移除') }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="sign-block">
      <div class="sign-block__head">
        <span class="sign-block__title">
          <i class="el-icon-edit-outline sign-block__title-icon"></i>
          {{ $t('schoolDoctor.家长签名') }}
        </span>
        <div v-if="!readonly" class="signature-mode">
          <el-radio-group :value="parentSignMode" size="small" @input="$emit('update:parentSignMode', $event)">
            <el-radio-button label="draw">{{ $t('schoolDoctor.手写签字') }}</el-radio-button>
            <el-radio-button label="upload">{{ $t('schoolDoctor.上传图片签名') }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="signature-box">
        <div class="signature-box__label">
          <span>{{ $t('schoolDoctor.家长签字') }}</span>
          <el-button v-if="!readonly && parentSignatureUrl" type="text" class="clear-btn" @click="$emit('clear-signature')">
            <i class="el-icon-refresh-left"></i>
            {{ $t('schoolDoctor.清除签名') }}
          </el-button>
        </div>
        <template v-if="parentSignatureUrl">
          <div class="signature-preview">
            <el-image :src="parentSignatureUrl" fit="contain" />
          </div>
        </template>
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
            :http-request="(opt) => $emit('upload-sign', opt)"
            :before-upload="(file) => $emit('before-image', file)">
            <div class="upload-trigger upload-trigger--compact" :class="{ 'is-loading': uploading }">
              <i class="el-icon-upload2 upload-trigger__icon"></i>
              <span>{{ $t('schoolDoctor.点击上传') }}</span>
            </div>
          </el-upload>
        </template>
        <span v-else class="signature-empty">-</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MedicalInfoAttachmentSection',
  props: {
    attachmentList: { type: Array, default: () => [] },
    fileGroups: { type: Array, default: () => [] },
    specialProofRemark: { type: String, default: '' },
    parentSignMode: { type: String, default: 'draw' },
    parentSignatureUrl: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    uploading: { type: Boolean, default: false },
    getUploadAccept: { type: Function, required: true }
  },
  methods: {
    getAttachments(type) {
      return (this.attachmentList || []).filter((item) => item.attachType === type)
    },
    getFileName(file, index) {
      const url = file.attachUrl || ''
      const matched = url.match(/[^/?#]+(?=[?#]|$)/)
      const name = matched ? decodeURIComponent(matched[0]) : `${this.$t('schoolDoctor.查看附件')}${index + 1}`
      return name.length > 36 ? `${name.slice(0, 36)}...` : name
    }
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.section-card__header-main {
  flex: 1;
  min-width: 0;
}

.section-card__title {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;

  &.has-icon {
    padding-left: 0;
  }
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

.upload-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.upload-card {
  flex: 1;
  min-width: 0;
  padding: 14px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafafa;
  box-sizing: border-box;
}

.upload-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.upload-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.upload-card__tip {
  font-size: 12px;
  color: #909399;

  &.is-danger {
    color: #f56c6c;
  }
}

.upload-trigger-wrap {
  display: block;
  width: 100%;
  max-width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;

  ::v-deep .el-upload {
    display: block;
    width: 100%;
    color: inherit;
    text-align: inherit;
  }

  ::v-deep .upload-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 10px 16px;
    color: #606266;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;

    &:hover {
      color: #ba8e62;
      border-color: #ba8e62;
    }

    &.is-loading {
      opacity: 0.75;
      pointer-events: none;
    }
  }

  ::v-deep .upload-trigger--compact {
    min-height: 120px;
    flex-direction: column;
  }

  ::v-deep .upload-trigger__icon {
    font-size: 18px;
    color: #ba8e62;
  }
}

.proof-block {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #ebeef5;
  overflow: hidden;
}

.proof-block__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.proof-input {
  width: 100%;

  ::v-deep .el-input-group__append {
    padding: 0;
    overflow: hidden;
    background: #ba8e62;
    border-color: #ba8e62;
  }
}

.proof-upload-append {
  display: block;
  height: 100%;

  ::v-deep .el-upload {
    display: block;
    height: 100%;
    color: inherit;
  }

  ::v-deep .proof-upload-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 100%;
    min-height: 38px;
    padding: 0 14px;
    color: #fff;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;

    i {
      font-size: 15px;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }

    &.is-loading {
      opacity: 0.75;
      pointer-events: none;
    }
  }
}

.uploaded-file-list {
  margin-top: 4px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 40px;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f2f5;
  background-color: #efefef;
  border-radius: 4px;
  margin-bottom: 5px;

  &:last-child {
    border-bottom: none;
  }

  ::v-deep .uploaded-file__name {
    flex: 1;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    line-height: 22px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.remove-btn {
  flex-shrink: 0;
  padding: 0;
  line-height: 1;
  color: #f56c6c !important;
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

  ::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 4px;
  }

  ::v-deep .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 4px;
  }

  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #303133;
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

.clear-btn {
  padding: 0;
  line-height: 1;
  color: #f56c6c !important;
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
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
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
</style>
