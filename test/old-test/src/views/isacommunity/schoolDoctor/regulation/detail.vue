<template>
  <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="720px" :before-close="closeModal" class="drawer-body regulation-drawer">
    <div class="drawer-content regulation-content" v-if="showDialog" v-loading="detailLoading">
      <el-form class="drawer-form" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('schoolDoctor.学校')" prop="schoolId">
          <el-select v-model="ruleForm.schoolId" style="width: 100%" :placeholder="$t('common.请选择')" clearable :disabled="readonly">
            <el-option v-for="(item, index) in schoolSelectList" :key="index" :label="schoolDropdownLabel(item)" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('schoolDoctor.中文标题')" prop="cnTitle">
          <el-input v-model="ruleForm.cnTitle" :placeholder="$t('schoolDoctor.请输入中文标题')" :disabled="readonly" />
        </el-form-item>
        <el-form-item :label="$t('schoolDoctor.英文标题')" prop="enTitle">
          <el-input v-model="ruleForm.enTitle" :placeholder="$t('schoolDoctor.请输入英文标题')" :disabled="readonly" />
        </el-form-item>
        <el-form-item :label="$t('schoolDoctor.中文简介')" prop="cnIntro">
          <el-input v-model="ruleForm.cnIntro" type="textarea" :rows="3" :placeholder="$t('schoolDoctor.请输入备注')" :disabled="readonly" />
        </el-form-item>
        <el-form-item :label="$t('schoolDoctor.英文简介')" prop="enIntro">
          <el-input v-model="ruleForm.enIntro" type="textarea" :rows="3" :placeholder="$t('schoolDoctor.请输入备注')" :disabled="readonly" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.类别')" prop="type">
              <el-select v-model="ruleForm.type" style="width: 100%" :placeholder="$t('schoolDoctor.请选择类别')" clearable :disabled="readonly">
                <el-option :label="$t('schoolDoctor.规章制度')" :value="1" />
                <el-option :label="$t('schoolDoctor.知情同意')" :value="2" />
                <el-option :label="$t('schoolDoctor.授权同意')" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.状态')" prop="status">
              <el-select v-model="ruleForm.status" style="width: 100%" :placeholder="$t('schoolDoctor.请选择状态')" clearable :disabled="readonly">
                <el-option :label="$t('schoolDoctor.启用')" :value="1" />
                <el-option :label="$t('schoolDoctor.禁用')" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="attachment">
          <span slot="label" class="field-label field-label--between">
            <span>{{ $t('schoolDoctor.附件') }}</span>
            <span class="field-tip is-danger">{{ $t('schoolDoctor.仅支持PDF文件') }}</span>
          </span>
          <div class="attachment-upload-card">
            <div v-if="ruleForm.attachmentUrl" class="uploaded-file">
              <el-link type="primary" :underline="false" :href="ruleForm.attachmentUrl" target="_blank" class="uploaded-file__name">
                {{ displayFileName }}
              </el-link>
              <el-button v-if="!readonly" type="text" class="remove-btn" @click="handleDeleteAttachment">
                {{ $t('schoolDoctor.移除') }}
              </el-button>
            </div>
            <el-upload
              v-if="!readonly && !ruleForm.attachmentUrl"
              class="upload-trigger-wrap"
              action="#"
              :show-file-list="false"
              :http-request="handleCustomUpload"
              :before-upload="beforePdfUpload"
              accept=".pdf,application/pdf">
              <div class="upload-trigger" :class="{ 'is-loading': uploading }">
                <i class="el-icon-upload2 upload-trigger__icon"></i>
                <span>{{ $t('schoolDoctor.点击上传') }}</span>
              </div>
            </el-upload>
            <span v-if="readonly && !ruleForm.attachmentUrl" class="empty-text">-</span>
          </div>
        </el-form-item>

        <el-form-item :label="$t('schoolDoctor.备注')" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="3" :placeholder="$t('schoolDoctor.请输入备注')" :disabled="readonly" />
        </el-form-item>
      </el-form>

      <div class="drawer-footer" v-if="!readonly">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="isSubmitting">{{ $t('schoolDoctor.确认') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { addRegulation, editRegulation, getRegulationDetail } from '@/api/isacommunity/regulation'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import myRequest from '@/router/axiosother.js'

export default {
  name: 'RegulationDetail',
  mixins: [schoolListBuscommonMixin],
  props: {
    title: { type: String, default: '' }
  },
  data() {
    return {
      modalType: 'look',
      showDialog: false,
      detailLoading: false,
      ruleForm: this.createEmptyForm(),
      rules: {},
      isSubmitting: false,
      uploading: false
    }
  },
  created() {
    this.rules = {
      schoolId: [{ required: true, message: this.$t('schoolDoctor.请选择学校'), trigger: 'change' }],
      cnTitle: [{ required: true, message: this.$t('schoolDoctor.请输入中文标题'), trigger: 'blur' }],
      enTitle: [{ required: true, message: this.$t('schoolDoctor.请输入英文标题'), trigger: 'blur' }],
      type: [{ required: true, message: this.$t('schoolDoctor.请选择类别'), trigger: 'change' }],
      status: [{ required: true, message: this.$t('schoolDoctor.请选择状态'), trigger: 'change' }]
    }
  },
  computed: {
    drawerTitle() {
      const typeMap = {
        add: this.$t('schoolDoctor.新增规章制度'),
        edit: this.$t('schoolDoctor.编辑规章制度'),
        look: this.$t('schoolDoctor.规章制度详情')
      }
      return typeMap[this.modalType] || this.title || this.$t('schoolDoctor.详情')
    },
    readonly() {
      return this.modalType === 'look'
    },
    displayFileName() {
      const name = this.ruleForm.attachmentName || ''
      if (name) return name.length > 40 ? `${name.slice(0, 40)}...` : name
      const url = this.ruleForm.attachmentUrl || ''
      const matched = url.match(/[^/?#]+(?=[?#]|$)/)
      return matched ? decodeURIComponent(matched[0]) : this.$t('schoolDoctor.查看附件')
    }
  },
  methods: {
    createEmptyForm() {
      return {
        id: undefined,
        schoolId: undefined,
        cnTitle: '',
        enTitle: '',
        cnIntro: '',
        enIntro: '',
        type: undefined,
        status: 1,
        remark: '',
        attachmentUrl: '',
        attachmentName: ''
      }
    },

    async showModal(type = 'add', item = {}) {
      this.modalType = type
      this.showDialog = true
      this.ruleForm = this.createEmptyForm()
      const tasks = [() => this.fetchSchoolListBuscommon()]
      if (type !== 'add') tasks.push(() => this.getDetail(item.id))
      this.detailLoading = true
      try {
        for (let i = 0; i < tasks.length; i++) {
          await tasks[i]()
        }
      } finally {
        this.detailLoading = false
      }
    },

    getDetail(id) {
      return getRegulationDetail(id).then((res) => {
        if (!res.data.success) return
        this.ruleForm = {
          ...this.createEmptyForm(),
          ...res.data.data,
          id
        }
      })
    },

    beforePdfUpload(file) {
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
      if (!isPdf) {
        this.$message.warning(this.$t('schoolDoctor.仅支持PDF文件'))
        return false
      }
      return true
    },

    async handleCustomUpload({ file }) {
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('prefix', 'parent_weapp_upload')
        formData.append('file', file)
        const response = await myRequest.upload(formData)
        this.ruleForm.attachmentUrl = response.data.url
        this.ruleForm.attachmentName = file.name
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.uploading = false
      }
    },

    handleDeleteAttachment() {
      this.ruleForm.attachmentUrl = ''
      this.ruleForm.attachmentName = ''
    },

    submitForm() {
      if (this.isSubmitting) return
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.isSubmitting = true
        const data = { ...this.ruleForm }
        const request = this.modalType === 'add' ? addRegulation(data) : editRegulation(data)
        request
          .then((res) => {
            if (res.data.success) {
              this.$message.success(this.modalType === 'add' ? this.$t('schoolDoctor.新增成功') : this.$t('schoolDoctor.编辑成功'))
              this.$emit('getList')
              this.closeModal()
            }
          })
          .finally(() => {
            this.isSubmitting = false
          })
      })
    },

    closeModal() {
      this.showDialog = false
      this.ruleForm = this.createEmptyForm()
      this.isSubmitting = false
      this.uploading = false
      this.detailLoading = false
      if (this.$refs.ruleForm) this.$refs.ruleForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.regulation-drawer {
  ::v-deep .el-drawer__body {
    padding: 0;
    background: #f5f7fa;
  }
}

.regulation-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f5f7fa;
}

.drawer-form {
  flex: 1;
  padding: 20px;
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px rgba(31, 45, 61, 0.04);

  ::v-deep .el-form-item__label {
    padding-bottom: 6px;
    line-height: 1.4;
    color: #606266;
  }
}

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

  &.is-danger {
    color: #f56c6c;
  }
}

.attachment-upload-card {
  width: 100%;
  padding: 14px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafafa;
  box-sizing: border-box;
}

.upload-trigger-wrap {
  display: block;
  width: 100%;
  max-width: 100%;
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
    min-height: 44px;
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

  ::v-deep .upload-trigger__icon {
    font-size: 18px;
    color: #ba8e62;
  }
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;

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
  color: #f56c6c !important;
}

.empty-text {
  color: #909399;
}

.drawer-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #ebeef5;
  box-shadow: 0 -2px 8px rgba(31, 45, 61, 0.06);
}
</style>
