<template>
  <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="600px" :before-close="closeModal" class="drawer-body">
    <div class="drawer-content" v-if="showDialog" v-loading="detailLoading">
      <el-form class="drawer-form" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleForm">
        <StudentRemoteSelect
          ref="studentSelect"
          field-type="healthReport"
          :readonly="modalType === 'look'"
          :school-select-list="schoolSelectList"
          @select="handleStudentSelect"
          @clear="handleStudentClear" />

        <el-form-item :label="$t('schoolDoctor.报告类型')" prop="reportType">
          <el-select
            v-model="ruleForm.reportType"
            style="width: 100%"
            :placeholder="$t('schoolDoctor.请选择报告类型')"
            clearable
            :disabled="modalType === 'look'">
            <el-option :label="$t('schoolDoctor.入校体检')" :value="1" />
            <el-option :label="$t('schoolDoctor.年度体检')" :value="2" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.体检年度')" prop="examYear">
              <el-date-picker
                v-model="ruleForm.examYear"
                type="year"
                :placeholder="$t('schoolDoctor.请选择体检年度')"
                style="width: 100%"
                value-format="yyyy"
                :disabled="modalType === 'look'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.体检报告日期')" prop="examDate">
              <el-date-picker
                v-model="ruleForm.examDate"
                type="date"
                :placeholder="$t('schoolDoctor.请选择体检报告日期')"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                :disabled="modalType === 'look'" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('schoolDoctor.体检机构')" prop="examOrg">
          <el-input v-model="ruleForm.examOrg" :placeholder="$t('schoolDoctor.请输入体检机构')" :disabled="modalType === 'look'" />
        </el-form-item>

        <el-form-item :label="$t('schoolDoctor.报告附件')" prop="attachmentList">
          <div v-if="ruleForm.attachmentList.length" class="attachment-list">
            <div v-for="(item, index) in ruleForm.attachmentList" :key="item.id || item.attachmentUrl || index" class="uploaded-file">
              <el-link type="primary" :underline="false" :href="item.attachmentUrl" target="_blank">
                {{ getAttachmentName(item, index) }}
              </el-link>
              <el-icon v-if="modalType !== 'look'" class="delete-btn" name="close" @click="handleDeleteAttachment(index)"></el-icon>
            </div>
          </div>
          <el-upload
            v-if="modalType !== 'look'"
            ref="upload"
            action="#"
            :show-file-list="false"
            :http-request="handleCustomUpload"
            :before-upload="beforeAttachmentUpload"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg">
            <el-button size="small" :loading="uploading">{{ $t('schoolDoctor.点击上传') }}</el-button>
            <div slot="tip" class="upload-tip">{{ $t('schoolDoctor.支持图片和PDF文件') }}</div>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('schoolDoctor.备注')" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="3" :placeholder="$t('schoolDoctor.请输入备注')" :disabled="modalType === 'look'" />
        </el-form-item>
      </el-form>

      <div class="drawer-footer" v-if="modalType !== 'look'">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="isSubmitting">{{ $t('schoolDoctor.确认') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { addHealthReport, editHealthReport, getHealthReportDetail } from '@/api/isacommunity/healthReport'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import myRequest from '@/router/axiosother.js'
import StudentRemoteSelect from '../components/StudentRemoteSelect.vue'

export default {
  name: 'HealthReportDetail',
  components: { StudentRemoteSelect },
  mixins: [schoolListBuscommonMixin],
  props: {
    title: { type: String, default: '' }
  },
  data() {
    return {
      modalType: 'look',
      showDialog: false,
      detailLoading: false,
      ruleForm: {
        id: undefined,
        admissionNo: '',
        studentName: '',
        schoolId: undefined,
        gradeName: '',
        className: '',
        formCode: '',
        reportType: undefined,
        examYear: '',
        examDate: '',
        examOrg: '',
        remark: '',
        attachmentList: []
      },
      rules: {},
      isSubmitting: false,
      uploading: false
    }
  },
  created() {
    this.rules = this.initRules()
  },
  computed: {
    drawerTitle() {
      const typeMap = {
        add: this.$t('schoolDoctor.新增体检报告'),
        edit: this.$t('schoolDoctor.编辑体检报告'),
        look: this.$t('schoolDoctor.体检报告详情')
      }
      return typeMap[this.modalType] || this.title || this.$t('schoolDoctor.详情')
    }
  },
  methods: {
    initRules() {
      return {
        admissionNo: [{ required: true, message: this.$t('schoolDoctor.请输入学号'), trigger: 'blur' }],
        studentName: [{ required: true, message: this.$t('schoolDoctor.请输入姓名'), trigger: 'blur' }],
        schoolId: [{ required: true, message: this.$t('schoolDoctor.请选择学校'), trigger: 'change' }],
        reportType: [{ required: true, message: this.$t('schoolDoctor.请选择报告类型'), trigger: 'change' }],
        examYear: [{ required: true, message: this.$t('schoolDoctor.请选择体检年度'), trigger: 'change' }],
        examDate: [{ required: true, message: this.$t('schoolDoctor.请选择体检报告日期'), trigger: 'change' }]
      }
    },

    handleStudentSelect(mappedFields) {
      Object.assign(this.ruleForm, mappedFields)
    },

    handleStudentClear() {
      this.ruleForm.admissionNo = ''
      this.ruleForm.studentName = ''
      this.ruleForm.schoolId = undefined
      this.ruleForm.gradeName = ''
      this.ruleForm.className = ''
      this.ruleForm.formCode = ''
    },

    async showModal(type = 'add', item = {}) {
      this.modalType = type
      this.showDialog = true
      const tasks = [() => this.fetchSchoolListBuscommon()]
      if (type !== 'add') {
        tasks.push(() => this.getDetail(item.id))
      }
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
      return getHealthReportDetail(id).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            const data = res.data.data || {}
            this.ruleForm = {
              ...this.ruleForm,
              ...data,
              id,
              admissionNo: data.admissionNo || data.admissonNo || '',
              studentName: data.studentName || data.fullName || data.cnFullName || '',
              gradeName: data.gradeName || data.grade || '',
              className: data.className || data.formCode || '',
              formCode: data.formCode || data.className || '',
              examYear: data.examYear != null && data.examYear !== '' ? String(data.examYear) : '',
              examDate: data.examDate ? String(data.examDate).slice(0, 10) : '',
              examOrg: data.examOrg || data.institution || '',
              attachmentList: Array.isArray(data.attachmentList) ? data.attachmentList : []
            }
            if (this.$refs.studentSelect) {
              this.$refs.studentSelect.setDisplayFromForm(this.ruleForm)
            }
          })
        }
      })
    },

    /** 附件展示名称 */
    getAttachmentName(item, index) {
      if (item.name) return item.name
      const url = item.attachmentUrl || ''
      const fileName = url.split('/').pop()
      if (fileName) return decodeURIComponent(fileName)
      return `${this.$t('schoolDoctor.查看附件')} ${index + 1}`
    },

    /** 校验允许图片和 PDF */
    beforeAttachmentUpload(file) {
      const allowed = /^image\//.test(file.type) || file.type === 'application/pdf' || /\.(pdf|png|jpe?g)$/i.test(file.name || '')
      if (!allowed) {
        this.$message.warning(this.$t('schoolDoctor.请上传图片或PDF格式文件'))
        return false
      }
      return true
    },

    /** 上传报告附件 */
    async handleCustomUpload({ file }) {
      if (!this.beforeAttachmentUpload(file)) return
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('prefix', 'parent_weapp_upload')
        formData.append('file', file)
        const response = await myRequest.upload(formData)
        this.ruleForm.attachmentList.push({
          attachmentUrl: response.data.url,
          name: file.name
        })
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.uploading = false
      }
    },

    /** 删除单个附件 */
    handleDeleteAttachment(index) {
      this.ruleForm.attachmentList.splice(index, 1)
    },

    /** 提交前整理附件字段 */
    buildSubmitData() {
      const data = { ...this.ruleForm }
      data.formCode = data.formCode || data.className || ''
      data.attachmentList = (data.attachmentList || []).map((item) => ({
        id: item.id,
        reportId: item.reportId,
        attachmentUrl: item.attachmentUrl
      }))
      return data
    },

    submitForm(formName) {
      if (this.isSubmitting) return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSubmitting = true
          const data = this.buildSubmitData()
          if (this.modalType === 'add') {
            this.addData(data)
          } else {
            this.editData(data)
          }
        }
      })
    },

    addData(data) {
      addHealthReport(data)
        .then((res) => {
          this.isSubmitting = false
          if (res.data.success) {
            this.$message.success(this.$t('schoolDoctor.新增成功'))
            this.$emit('getList')
            this.closeModal()
          }
        })
        .catch(() => {
          this.isSubmitting = false
        })
    },

    editData(data) {
      editHealthReport(data)
        .then((res) => {
          this.isSubmitting = false
          if (res.data.success) {
            this.$message.success(this.$t('schoolDoctor.编辑成功'))
            this.$emit('getList')
            this.closeModal()
          }
        })
        .catch(() => {
          this.isSubmitting = false
        })
    },

    closeModal() {
      this.$refs.ruleForm.resetFields()
      if (this.$refs.studentSelect) {
        this.$refs.studentSelect.reset()
      }
      this.showDialog = false
      this.ruleForm = {
        id: undefined,
        admissionNo: '',
        studentName: '',
        schoolId: undefined,
        gradeName: '',
        className: '',
        formCode: '',
        reportType: undefined,
        examYear: '',
        examDate: '',
        examOrg: '',
        remark: '',
        attachmentList: []
      }
      this.isSubmitting = false
      this.uploading = false
      this.detailLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-list {
  margin-bottom: 8px;
}

.uploaded-file {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  margin: 0 8px 8px 0;
  background: #f5f7fa;
  border-radius: 4px;
  height: 32px;

  .delete-btn {
    margin-left: 8px;
    color: #f56c6c;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #f78989;
    }
  }
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
