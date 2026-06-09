<template>
  <div class="section-card">
    <div class="medication-detail-head">
      <div class="medication-detail-head__main">
        <span class="medication-detail-head__title">
          <i class="el-icon-first-aid-kit medication-detail-head__icon"></i>
          {{ $t('schoolDoctor.药物和给药明细') }}
        </span>
        <p class="medication-detail-head__subtitle">{{ $t('schoolDoctor.药物和给药明细说明') }}</p>
      </div>
      <span class="medication-detail-head__badge">
        {{ $t('schoolDoctor.共录入') }} {{ form.contentList.length }} {{ $t('schoolDoctor.种药物') }}
      </span>
    </div>

    <MedicationContentBlock :list="form.contentList" :readonly="readonly" />

    <el-row :gutter="16" class="footer-fields-row">
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.剩余药物处理')">
          <el-select v-model="form.leftoverDisposal" style="width: 100%" clearable :disabled="readonly" :placeholder="$t('schoolDoctor.请选择')">
            <el-option v-for="opt in leftoverOptions" :key="opt.value" :label="$t(`schoolDoctor.${opt.labelKey}`)" :value="opt.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item class="diagnosis-item" :label="$t('schoolDoctor.诊断及药物使用说明图片')">
          <el-upload
            list-type="picture-card"
            action="#"
            :file-list="pictureFileList"
            :http-request="(opt) => $emit('diagnosis-upload', opt)"
            :before-upload="(file) => $emit('before-image', file)"
            :on-remove="(file) => $emit('remove-diagnosis-image', file)"
            :on-preview="(file) => $emit('preview-diagnosis-image', file)"
            :disabled="readonly || uploading"
            :class="{ 'hide-upload': readonly }"
            accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div v-if="!readonly" class="upload-tip">{{ $t('schoolDoctor.仅支持图片文件') }}</div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MedicationContentBlock from './MedicationContentBlock.vue'
import { LEFTOVER_DISPOSAL_OPTIONS } from '../utils/medicationApplyOptions.js'

export default {
  name: 'MedicationApplyAuthSection',
  components: { MedicationContentBlock },
  props: {
    form: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    uploading: { type: Boolean, default: false }
  },
  data() {
    return {
      leftoverOptions: LEFTOVER_DISPOSAL_OPTIONS
    }
  },
  computed: {
    pictureFileList() {
      return (this.form.diagnosisImageList || []).map((item, index) => ({
        name: this.getImageName(item, index),
        url: item.imagePath,
        uid: item.id || item.imagePath || `diagnosis-${index}`
      }))
    }
  },
  methods: {
    getImageName(item, index) {
      if (item.name) return item.name
      const url = item.imagePath || ''
      const fileName = url.split('/').pop()
      if (fileName) return decodeURIComponent(fileName)
      return `${this.$t('schoolDoctor.查看附件')} ${index + 1}`
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #ba8e62;
$theme-color-light: #faf6f0;

.section-card {
  margin-bottom: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(31, 45, 61, 0.04);
  min-width: 0;
  overflow: hidden;
}

.medication-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.medication-detail-head__main {
  flex: 1;
  min-width: 0;
}

.medication-detail-head__title {
  display: inline-flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.medication-detail-head__icon {
  margin-right: 8px;
  font-size: 18px;
  color: $theme-color;
}

.medication-detail-head__subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}

.medication-detail-head__badge {
  flex-shrink: 0;
  padding: 4px 12px;
  font-size: 12px;
  color: $theme-color;
  background: $theme-color-light;
  border-radius: 999px;
  white-space: nowrap;
}

.footer-fields-row {
  margin-top: 8px;

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}

.diagnosis-item {
  margin-bottom: 0;

  ::v-deep .el-form-item__content {
    min-width: 0;
  }
}

.hide-upload ::v-deep .el-upload--picture-card {
  display: none;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.diagnosis-item ::v-deep .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  object-fit: contain;
}
</style>
