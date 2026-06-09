<template>
  <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="600px" :before-close="closeModal"
    class="drawer-body">
    <div class="drawer-content" v-if="showDialog" v-loading="detailLoading">
      <el-form class="drawer-form" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleForm">
        <StudentRemoteSelect ref="studentSelect" field-type="infectiousDisease" :readonly="modalType === 'look'"
          :school-select-list="schoolSelectList" @select="handleStudentSelect" @clear="handleStudentClear" />

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.传染病名称')" prop="diseaseName">
              <el-input v-model="ruleForm.diseaseName" :placeholder="$t('schoolDoctor.请输入传染病名称')"
                :disabled="modalType === 'look'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.发现日期')" prop="discoveryDate">
              <el-date-picker v-model="ruleForm.discoveryDate" type="datetime" :placeholder="$t('schoolDoctor.请选择发现日期')"
                style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" :disabled="modalType === 'look'" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('schoolDoctor.状态')" prop="status">
          <el-select v-model="ruleForm.status" style="width: 100%" :placeholder="$t('schoolDoctor.请选择状态')" clearable
            :disabled="modalType === 'look'">
            <el-option :label="$t('schoolDoctor.痊愈')" :value="1" />
            <el-option :label="$t('schoolDoctor.病假中')" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('schoolDoctor.疾病附件')" prop="attachmentList">
          <el-upload list-type="picture-card" action="#" :file-list="pictureFileList" :http-request="handleCustomUpload"
            :before-upload="beforeImageUpload" :on-remove="handleRemovePicture" :on-preview="handlePicturePreview"
            :disabled="modalType === 'look' || uploading" :class="{ 'hide-upload': modalType === 'look' }"
            accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div v-if="modalType !== 'look'" class="upload-tip">{{ $t('schoolDoctor.仅支持图片文件') }}</div>
        </el-form-item>

        <el-form-item :label="$t('schoolDoctor.备注')" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="3" :placeholder="$t('schoolDoctor.请输入备注')"
            :disabled="modalType === 'look'" />
        </el-form-item>
      </el-form>

      <div class="drawer-footer" v-if="modalType !== 'look'">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="isSubmitting">{{ $t('schoolDoctor.确认')
          }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  addInfectiousDisease,
  editInfectiousDisease,
  getInfectiousDiseaseDetail,
} from "@/api/isacommunity/infectiousDisease";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import myRequest from "@/router/axiosother.js";
import StudentRemoteSelect from "../components/StudentRemoteSelect.vue";

export default {
  name: "InfectiousDiseaseDetail",
  components: { StudentRemoteSelect },
  mixins: [schoolListBuscommonMixin],
  props: {
    title: { type: String, default: "" },
  },
  data() {
    return {
      modalType: "look",
      showDialog: false,
      detailLoading: false,
      ruleForm: {
        id: undefined,
        admissionNo: "",
        studentName: "",
        schoolId: undefined,
        gradeName: "",
        className: "",
        diseaseName: "",
        discoveryDate: "",
        status: undefined,
        remark: "",
        attachmentList: [],
      },
      rules: {},
      isSubmitting: false,
      uploading: false,
    };
  },
  created() {
    this.rules = this.initRules();
  },
  computed: {
    drawerTitle() {
      const typeMap = {
        add: this.$t("schoolDoctor.新增传染病"),
        edit: this.$t("schoolDoctor.编辑传染病"),
        look: this.$t("schoolDoctor.传染病详情"),
      };
      return typeMap[this.modalType] || this.title || this.$t("schoolDoctor.详情");
    },
    /** 照片墙 file-list */
    pictureFileList() {
      return (this.ruleForm.attachmentList || []).map((item, index) => ({
        name: this.getAttachmentName(item, index),
        url: item.attachmentUrl,
        uid: item.id || item.attachmentUrl || `picture-${index}`,
      }));
    },
  },
  methods: {
    initRules() {
      return {
        admissionNo: [{ required: true, message: this.$t("schoolDoctor.请输入学号"), trigger: "blur" }],
        studentName: [{ required: true, message: this.$t("schoolDoctor.请输入姓名"), trigger: "blur" }],
        schoolId: [{ required: true, message: this.$t("schoolDoctor.请选择学校"), trigger: "change" }],
        diseaseName: [{ required: true, message: this.$t("schoolDoctor.请输入传染病名称"), trigger: "blur" }],
        discoveryDate: [{ required: true, message: this.$t("schoolDoctor.请选择发现日期"), trigger: "change" }],
        status: [{ required: true, message: this.$t("schoolDoctor.请选择状态"), trigger: "change" }],
      };
    },

    handleStudentSelect(mappedFields) {
      Object.assign(this.ruleForm, mappedFields);
    },

    handleStudentClear() {
      this.ruleForm.admissionNo = "";
      this.ruleForm.studentName = "";
      this.ruleForm.schoolId = undefined;
      this.ruleForm.gradeName = "";
      this.ruleForm.className = "";
    },

    async showModal(type = "add", item = {}) {
      this.modalType = type;
      this.showDialog = true;
      const tasks = [() => this.fetchSchoolListBuscommon()];
      if (type !== "add") {
        tasks.push(() => this.getDetail(item.id));
      }
      this.detailLoading = true;
      try {
        for (let i = 0; i < tasks.length; i++) {
          await tasks[i]();
        }
      } finally {
        this.detailLoading = false;
      }
    },

    getDetail(id) {
      return getInfectiousDiseaseDetail(id).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            const data = res.data.data || {};
            this.ruleForm = {
              ...this.ruleForm,
              ...data,
              id,
              admissionNo: data.admissionNo || data.admissonNo || "",
              studentName: data.studentName || data.fullName || data.cnFullName || "",
              gradeName: data.gradeName || data.grade || "",
              className: data.className || data.formCode || "",
              attachmentList: Array.isArray(data.attachmentList) ? data.attachmentList : [],
            };
            if (this.$refs.studentSelect) {
              this.$refs.studentSelect.setDisplayFromForm(this.ruleForm);
            }
          });
        }
      });
    },

    /** 附件展示名称 */
    getAttachmentName(item, index) {
      if (item.name) return item.name;
      const url = item.attachmentUrl || "";
      const fileName = url.split("/").pop();
      if (fileName) return decodeURIComponent(fileName);
      return `${this.$t("schoolDoctor.查看附件")} ${index + 1}`;
    },

    /** 校验仅允许图片 */
    beforeImageUpload(file) {
      const isImage =
        /^image\//.test(file.type) ||
        /\.(jpe?g|png|gif|webp)$/i.test(file.name || "");
      if (!isImage) {
        this.$message.warning(this.$t("schoolDoctor.请上传图片格式文件"));
        return false;
      }
      return true;
    },

    /** 上传疾病附件 */
    async handleCustomUpload({ file }) {
      if (!this.beforeImageUpload(file)) return;
      this.uploading = true;
      try {
        const formData = new FormData();
        formData.append("prefix", "parent_weapp_upload");
        formData.append("file", file);
        const response = await myRequest.upload(formData);
        this.ruleForm.attachmentList.push({
          attachmentUrl: response.data.url,
          name: file.name,
        });
        this.$message.success(this.$t("schoolDoctor.上传成功"));
      } catch (error) {
        this.$message.error(this.$t("schoolDoctor.上传失败"));
      } finally {
        this.uploading = false;
      }
    },

    /** 删除照片墙图片 */
    handleRemovePicture(file) {
      const index = this.ruleForm.attachmentList.findIndex(
        (item) => item.attachmentUrl === file.url
      );
      if (index > -1) {
        this.ruleForm.attachmentList.splice(index, 1);
      }
    },

    /** 预览照片墙图片 */
    handlePicturePreview(file) {
      if (file.url) {
        window.open(file.url, "_blank");
      }
    },

    /** 提交前整理附件字段 */
    buildSubmitData() {
      const data = { ...this.ruleForm };
      data.attachmentList = (data.attachmentList || []).map((item) => ({
        id: item.id,
        infectiousDiseaseId: item.infectiousDiseaseId,
        attachmentUrl: item.attachmentUrl,
      }));
      return data;
    },

    submitForm(formName) {
      if (this.isSubmitting) return;
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        if (!this.ruleForm.attachmentList || !this.ruleForm.attachmentList.length) {
          this.$message.warning(this.$t("schoolDoctor.请上传附件"));
          return;
        }
        this.isSubmitting = true;
        const data = this.buildSubmitData();
        if (this.modalType === "add") {
          this.addData(data);
        } else {
          this.editData(data);
        }
      });
    },

    addData(data) {
      addInfectiousDisease(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("schoolDoctor.新增成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    editData(data) {
      editInfectiousDisease(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("schoolDoctor.编辑成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    closeModal() {
      this.$refs.ruleForm.resetFields();
      if (this.$refs.studentSelect) {
        this.$refs.studentSelect.reset();
      }
      this.showDialog = false;
      this.ruleForm = {
        id: undefined,
        admissionNo: "",
        studentName: "",
        schoolId: undefined,
        gradeName: "",
        className: "",
        diseaseName: "",
        discoveryDate: "",
        status: undefined,
        remark: "",
        attachmentList: [],
      };
      this.isSubmitting = false;
      this.uploading = false;
      this.detailLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.hide-upload ::v-deep .el-upload--picture-card {
  display: none;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  object-fit: contain;
}
</style>
