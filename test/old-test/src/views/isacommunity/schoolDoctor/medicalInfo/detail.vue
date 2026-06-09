<template>
  <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="1120px" :before-close="closeModal" class="drawer-body medical-info-drawer">
    <div class="drawer-content medical-info-content" v-if="showDialog" v-loading="detailLoading">
      <MedicalInfoFormPanel
        ref="formPanel"
        :form="ruleForm"
        :rules="rules"
        :disease-rules="diseaseRules"
        :readonly="readonly"
        :school-select-list="schoolSelectList"
        :disease-options="diseaseOptions"
        :health-fields="healthFields"
        :allergy-fields="allergyFields"
        :file-groups="fileAttachmentGroups"
        :special-proof-remark.sync="specialProofRemark"
        :parent-sign-mode.sync="parentSignMode"
        :parent-signature-url="parentSignatureUrl"
        :uploading="uploading"
        :get-upload-accept="getUploadAccept"
        :is-other-disease="isOtherDisease"
        @student-select="handleStudentSelect"
        @student-clear="handleStudentClear"
        @add-disease="addDisease"
        @remove-disease="removeDisease"
        @disease-change="handleDiseaseChange"
        @upload="handleUpload"
        @before-upload="beforeAttachmentUpload"
        @remove-attachment="removeAttachment"
        @open-signature="openSignature"
        @clear-signature="clearParentSignature"
        @upload-sign="handleParentSignUpload"
        @before-image="beforeImageUpload" />

      <div class="drawer-footer" v-if="!readonly">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="isSubmitting">{{ $t('schoolDoctor.确认') }}</el-button>
      </div>
    </div>

    <VisitRecordSignatureDialog ref="signatureDialog" @confirm="handleSignatureConfirm" />
  </el-drawer>
</template>

<script>
import { getDiseaseSettingPage } from '@/api/isacommunity/diseaseSetting'
import { addMedicalInfo, editMedicalInfo, getMedicalInfoDetail } from '@/api/isacommunity/medicalInfo'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import myRequest from '@/router/axiosother.js'
import VisitRecordSignatureDialog from '../visitRecord/components/VisitRecordSignatureDialog.vue'
import MedicalInfoFormPanel from './components/MedicalInfoFormPanel.vue'

const FILE_ATTACHMENT_GROUPS = [
  { type: 1, label: '疫苗', tipKey: '疫苗上传提示' },
  { type: 4, label: '入学体检', tipKey: '仅支持PDF文件' }
]

export default {
  name: 'MedicalInfoDetail',
  components: { VisitRecordSignatureDialog, MedicalInfoFormPanel },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      modalType: 'look',
      showDialog: false,
      detailLoading: false,
      ruleForm: this.createEmptyForm(),
      rules: {},
      diseaseRules: {},
      diseaseOptions: [],
      specialProofRemark: '',
      parentSignMode: 'draw',
      isSubmitting: false,
      uploading: false,
      fileAttachmentGroups: FILE_ATTACHMENT_GROUPS,
      healthFields: [
        { prop: 'height', label: '身高', unit: 'cm', placeholder: 'schoolDoctor.请输入身高', icon: 'el-icon-sort' },
        { prop: 'weight', label: '体重', unit: 'kg', placeholder: 'schoolDoctor.请输入体重', icon: 'el-icon-c-scale-to-original' },
        { prop: 'leftVision', label: '左视力', placeholder: 'schoolDoctor.请输入左眼视力', icon: 'el-icon-view' },
        { prop: 'rightVision', label: '右视力', placeholder: 'schoolDoctor.请输入右眼视力', icon: 'el-icon-view' },
        { prop: 'leftEar', label: '左耳', placeholder: 'schoolDoctor.请输入左耳情况', icon: 'el-icon-headset' },
        { prop: 'rightEar', label: '右耳', placeholder: 'schoolDoctor.请输入右耳情况', icon: 'el-icon-headset' }
      ],
      allergyFields: [
        { prop: 'foodAllergy', label: '食物过敏', placeholderKey: '食物过敏提示' },
        { prop: 'drugAllergy', label: '药物过敏', placeholderKey: '药物过敏提示' },
        { prop: 'contactAllergy', label: '接触过敏', placeholderKey: '接触过敏提示' },
        { prop: 'otherAllergy', label: '其他过敏', placeholderKey: '其他过敏提示' }
      ]
    }
  },
  created() {
    this.rules = {
      admissionNo: [{ required: true, message: this.$t('schoolDoctor.请输入学号'), trigger: 'blur' }],
      schoolId: [{ required: true, message: this.$t('schoolDoctor.请选择学校'), trigger: 'change' }]
    }
    this.diseaseRules = {
      conditionStatus: [{ required: true, message: this.$t('schoolDoctor.请选择目前病情'), trigger: 'change' }],
      needRegularMedicationSchool: [{ required: true, message: this.$t('schoolDoctor.请选择'), trigger: 'change' }]
    }
  },
  computed: {
    drawerTitle() {
      const typeMap = {
        add: this.$t('schoolDoctor.新增医疗信息'),
        edit: this.$t('schoolDoctor.编辑医疗信息'),
        look: this.$t('schoolDoctor.医疗信息详情')
      }
      return typeMap[this.modalType] || this.$t('schoolDoctor.详情')
    },
    readonly() {
      return this.modalType === 'look'
    },
    parentSignatureUrl() {
      const list = this.getAttachments(3)
      return list.length ? list[0].attachUrl : ''
    }
  },
  methods: {
    createEmptyForm() {
      return {
        id: undefined,
        schoolId: undefined,
        schoolName: '',
        admissionNo: '',
        fullName: '',
        grade: '',
        formCode: '',
        dormitoryStatus: undefined,
        height: '',
        weight: '',
        leftVision: '',
        rightVision: '',
        leftEar: '',
        rightEar: '',
        foodAllergy: '',
        drugAllergy: '',
        contactAllergy: '',
        otherAllergy: '',
        diseaseList: [],
        attachmentList: []
      }
    },

    handleStudentSelect(mappedFields) {
      Object.assign(this.ruleForm, mappedFields)
    },

    handleStudentClear() {
      this.ruleForm.admissionNo = ''
      this.ruleForm.fullName = ''
      this.ruleForm.schoolId = undefined
      this.ruleForm.grade = ''
      this.ruleForm.formCode = ''
      this.ruleForm.dormitoryStatus = undefined
    },

    async showModal(type = 'add', item = {}) {
      this.modalType = type
      this.showDialog = true
      this.ruleForm = this.createEmptyForm()
      this.specialProofRemark = ''
      this.parentSignMode = 'draw'
      const tasks = [() => this.fetchSchoolListBuscommon(), () => this.loadDiseaseOptions()]
      if (type !== 'add') tasks.push(() => this.loadDetail(item.id))
      this.detailLoading = true
      try {
        for (let i = 0; i < tasks.length; i++) {
          await tasks[i]()
        }
      } finally {
        this.detailLoading = false
        this.$nextTick(() => {
          if (!this.$refs.formPanel) return
          if (type === 'add') {
            this.$refs.formPanel.resetStudentSelect()
          } else {
            this.$refs.formPanel.setDisplayFromForm(this.ruleForm)
          }
        })
      }
    },

    loadDiseaseOptions() {
      return getDiseaseSettingPage({ current: 1, size: 500, status: 1 }).then((res) => {
        if (res.data.success) {
          this.diseaseOptions = (res.data.data && res.data.data.data) || []
        }
      })
    },

    loadDetail(id) {
      return getMedicalInfoDetail(id).then((res) => {
        if (!res.data.success) return
        const data = res.data.data || {}
        this.ruleForm = {
          ...this.createEmptyForm(),
          ...data,
          diseaseList: Array.isArray(data.diseaseList) ? data.diseaseList : [],
          attachmentList: Array.isArray(data.attachmentList) ? data.attachmentList : []
        }
        const proof = this.getAttachments(2)[0]
        this.specialProofRemark = (proof && proof.remark) || ''
      })
    },

    addDisease() {
      this.ruleForm.diseaseList.push({
        diseaseId: undefined,
        diseaseNameOther: '',
        conditionStatus: undefined,
        needRegularMedicationSchool: undefined,
        medicationUsage: '',
        attackTimeDetail: '',
        measures: '',
        diagnosisAndTreatment: ''
      })
    },

    removeDisease(index) {
      this.ruleForm.diseaseList.splice(index, 1)
    },

    isOtherDisease(disease) {
      const option = this.diseaseOptions.find((item) => item.id === disease.diseaseId)
      const name = (option && (option.cnName || option.name)) || ''
      return /其他|other/i.test(name)
    },

    handleDiseaseChange(disease) {
      if (!this.isOtherDisease(disease)) disease.diseaseNameOther = ''
    },

    getAttachments(type) {
      return (this.ruleForm.attachmentList || []).filter((item) => item.attachType === type)
    },

    removeAttachment(type, index) {
      const files = this.getAttachments(type)
      const target = files[index]
      const realIndex = this.ruleForm.attachmentList.indexOf(target)
      if (realIndex > -1) this.ruleForm.attachmentList.splice(realIndex, 1)
    },

    /** 入学体检(4)仅允许 PDF；疫苗(1)支持图片/PDF */
    beforeAttachmentUpload(file, attachType) {
      if (attachType === 4) {
        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
        if (!isPdf) {
          this.$message.warning(this.$t('schoolDoctor.请上传PDF格式文件'))
          return false
        }
      }
      if (attachType === 1) {
        const allowed = /^image\//.test(file.type) || /\.(pdf|png|jpe?g)$/i.test(file.name || '')
        if (!allowed) {
          this.$message.warning(this.$t('schoolDoctor.疫苗上传提示'))
          return false
        }
      }
      return true
    },

    beforeImageUpload(file) {
      const isImage = /^image\//.test(file.type) || /\.(png|jpe?g|gif|webp)$/i.test(file.name || '')
      if (!isImage) {
        this.$message.warning(this.$t('schoolDoctor.请上传图片格式文件'))
        return false
      }
      return true
    },

    getUploadAccept(attachType) {
      if (attachType === 4) return '.pdf,application/pdf'
      if (attachType === 1) return '.pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg'
      return ''
    },

    async handleUpload(option, attachType) {
      if (!this.beforeAttachmentUpload(option.file, attachType)) return
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('file', option.file)
        formData.append('prefix', 'parent_weapp_upload')
        const response = await myRequest.upload(formData)
        this.ruleForm.attachmentList.push({
          attachType,
          attachUrl: response.data.url,
          remark: attachType === 2 ? this.specialProofRemark : ''
        })
        this.$message.success(this.$t('schoolDoctor.上传成功'))
      } catch (error) {
        this.$message.error(this.$t('schoolDoctor.上传失败'))
      } finally {
        this.uploading = false
      }
    },

    handleParentSignUpload(option) {
      if (!this.beforeImageUpload(option.file)) return
      this.setParentSignatureUrl(null)
      this.handleUpload(option, 3)
    },

    openSignature() {
      if (this.readonly) return
      this.parentSignMode = 'draw'
      this.$refs.signatureDialog.open()
    },

    handleSignatureConfirm(url) {
      this.setParentSignatureUrl(url)
    },

    setParentSignatureUrl(url) {
      this.ruleForm.attachmentList = (this.ruleForm.attachmentList || []).filter((item) => item.attachType !== 3)
      if (url) {
        this.ruleForm.attachmentList.push({ attachType: 3, attachUrl: url })
      }
    },

    clearParentSignature() {
      this.setParentSignatureUrl('')
    },

    buildSubmitData() {
      const data = { ...this.ruleForm }
      data.attachmentList = (data.attachmentList || []).map((item) => ({
        ...item,
        remark: item.attachType === 2 ? this.specialProofRemark : item.remark
      }))
      const hasAllergen = [data.foodAllergy, data.drugAllergy, data.contactAllergy, data.otherAllergy].some(Boolean)
      data.hasAllergen = hasAllergen ? 1 : 0
      data.hasDisease = (data.diseaseList || []).length ? 1 : 0
      data.regularMedication = (data.diseaseList || []).some((item) => item.needRegularMedicationSchool === 1) ? 1 : 0
      return data
    },

    async submitForm() {
      if (this.isSubmitting) return
      const valid = await this.$refs.formPanel.validateForm()
      if (!valid) return
      const invalidMedication = (this.ruleForm.diseaseList || []).find(
        (item) => item.needRegularMedicationSchool === 1 && !String(item.medicationUsage || '').trim()
      )
      if (invalidMedication) {
        this.$message.warning(this.$t('schoolDoctor.请填写服用药物及方式'))
        return
      }
      this.isSubmitting = true
      const data = this.buildSubmitData()
      const request = this.modalType === 'add' ? addMedicalInfo(data) : editMedicalInfo(data)
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
    },

    closeModal() {
      this.showDialog = false
      this.ruleForm = this.createEmptyForm()
      this.specialProofRemark = ''
      this.parentSignMode = 'draw'
      this.isSubmitting = false
      this.uploading = false
      this.detailLoading = false
      if (this.$refs.formPanel) this.$refs.formPanel.resetStudentSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
.medical-info-drawer {
  ::v-deep .el-drawer__body {
    padding: 0;
    background: #f5f7fa;
  }
}

.medical-info-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f5f7fa;
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
