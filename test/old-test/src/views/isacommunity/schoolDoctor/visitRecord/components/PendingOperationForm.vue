<template>
  <el-form :model="operationForm" :rules="operationRules" ref="operationForm" label-position="top" :disabled="readonly">
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.操作时间')" prop="operateTime">
          <div class="datetime-field">
            <el-date-picker v-model="operationForm.operateTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
            <el-button v-if="!readonly" type="text" class="now-btn" @click="setNow('operateTime')">{{ $t('schoolDoctor.此刻') }}</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.操作人')">
          <el-input v-model="operationForm.operator" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.操作情况')" prop="operateStatus">
          <el-radio-group v-model="operationForm.operateStatus">
            <el-radio v-for="item in operateStatusOptions" :key="item.value" :label="item.value">{{ $t(`schoolDoctor.${item.labelKey}`) }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.通知家长')">
          <el-radio-group v-model="operationForm.notifyParent">
            <el-radio :label="1">{{ $t('schoolDoctor.是') }}</el-radio>
            <el-radio :label="0">{{ $t('schoolDoctor.否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('schoolDoctor.具体情况')" prop="specificSituation">
          <el-input
            v-model="operationForm.specificSituation"
            type="textarea"
            :rows="3"
            maxlength="300"
            show-word-limit
            :placeholder="$t('schoolDoctor.待用药操作情况提示')" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.离开时间')">
          <div class="datetime-field">
            <el-date-picker v-model="operationForm.leaveTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
            <el-button v-if="!readonly" type="text" class="now-btn" @click="setNow('leaveTime')">{{ $t('schoolDoctor.此刻') }}</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('schoolDoctor.离开去向')">
          <el-select v-model="operationForm.leaveDestination" clearable style="width: 100%" :placeholder="$t('schoolDoctor.请选择去向')">
            <el-option v-for="item in leaveOptions" :key="item.value" :label="$t(`schoolDoctor.${item.labelKey}`)" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <span slot="label" class="field-label field-label--between">
            <span>{{ $t('schoolDoctor.附件上传') }}</span>
            <span class="field-tip">{{ $t('schoolDoctor.附件上传格式提示') }}</span>
          </span>
          <div v-if="operationForm.attachmentList.length" class="attachment-list">
            <div v-for="(file, index) in operationForm.attachmentList" :key="file.attachmentUrl || file.url || index" class="attachment-item">
              <el-link type="primary" :href="file.attachmentUrl || file.url" target="_blank">
                {{ file.name || `${$t('schoolDoctor.查看附件')}${index + 1}` }}
              </el-link>
              <i v-if="!readonly" class="el-icon-close delete-btn" @click="removeAttachment(index)" />
            </div>
          </div>
          <el-upload v-if="!readonly" action="#" :show-file-list="false" :http-request="handleUpload" :before-upload="beforeUpload">
            <el-button size="small" :loading="uploading">{{ $t('schoolDoctor.点击上传') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import myRequest from '@/router/axiosother.js'
import { getNowDateTime, LEAVE_DESTINATION_OPTIONS, OPERATE_STATUS_OPTIONS } from '../utils/visitRecordOptions.js'

export default {
  name: 'PendingOperationForm',
  props: {
    operationForm: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
  },
  data() {
    return {
      uploading: false,
      operateStatusOptions: OPERATE_STATUS_OPTIONS,
      leaveOptions: LEAVE_DESTINATION_OPTIONS,
      operationRules: {}
    }
  },
  created() {
    // 操作表单校验规则
    this.operationRules = {
      operateTime: [{ required: true, message: this.$t('schoolDoctor.请选择操作时间'), trigger: 'change' }],
      operateStatus: [{ required: true, message: this.$t('schoolDoctor.请选择操作情况'), trigger: 'change' }],
      specificSituation: [{ required: true, message: this.$t('schoolDoctor.请输入具体情况'), trigger: 'blur' }]
    }
  },
  methods: {
    validateOperationForm() {
      return new Promise((resolve) => {
        if (!this.$refs.operationForm) {
          resolve(true)
          return
        }
        this.$refs.operationForm.validate((valid) => resolve(valid))
      })
    },
    setNow(field) {
      this.operationForm[field] = getNowDateTime()
    },
    beforeUpload() {
      return true
    },
    async handleUpload(option) {
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('file', option.file)
        formData.append('prefix', 'parent_weapp_upload')
        const response = await myRequest.upload(formData)
        const attachmentUrl = response.data.url
        this.operationForm.attachmentList.push({
          name: option.file.name,
          url: attachmentUrl,
          attachmentUrl
        })
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.uploading = false
      }
    },
    removeAttachment(index) {
      this.operationForm.attachmentList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.field-label {
  display: inline-flex;
  align-items: center;

  &--between {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

.field-tip {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
}

.datetime-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.now-btn {
  flex-shrink: 0;
  padding: 0 4px;
  color: #ba8e62;
  font-weight: 500;
  min-width: 0;
}

.attachment-list {
  margin-bottom: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.delete-btn {
  cursor: pointer;
  color: #909399;
}

::v-deep .el-form-item__label {
  padding-bottom: 6px;
  line-height: 1.4;
  color: #606266;
}

/deep/ .el-button {
  min-width: 0 !important;
}
</style>
