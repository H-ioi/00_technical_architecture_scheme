<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="schoolIds"
              style="width: 49%"
              v-if="dictionary['school'].length > 1"
            >
              <el-select
                clearable
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in dictionary['school']"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.中文名')" prop="cnName" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.英文名')" prop="enName" style="width: 49%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.协议类型')"
              prop="protocolType"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['protocolType']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in protocolDict['protocolTypeList']"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.所属模块')"
              prop="module"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['module']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in protocolDict['moduleList']"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否需要签名')"
              prop="needSign"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['needSign']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['isOrNo']"
                  :label="i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.状态')" prop="status" style="width: 49%">
              <el-select
                style="width: 100%"
                v-model="ruleForm['status']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['statusType']"
                  :label="$t('isagroup.' + i.label)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.文档')"
              prop="documentUrl"
              style="width: 100%"
            >
              <el-upload
                :class="[
                  'upload-demo',
                  {
                    showUpload: fileList.length > 0,
                  },
                ]"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                accept=".pdf"
                :limit="1"
                :file-list="fileList"
                :before-upload="beforeUpload"
                :before-remove="removeUpload"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <em>{{ $t("isagroup.拖拽或点击上传") }}</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  {{ $t("isagroup.只能上传pdf文件，且不超过10M") }}
                </div>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("isagroup.确认")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getProtocolDetail,
  addProtocol,
  editProtocol,
} from "@/api/isacommunity/protocol.js";
import myRequest from "@/router/axiosother.js";
import consts from "@/const/isacommunity/consts.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
export default {
  name: "operation",
  components: { uploadFile },
  props: {
    protocolDict: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        protocolType: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        module: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        needSign: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        status: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        documentUrl: [
          { required: true, message: that.$t("isagroup.请上传"), trigger: "blur" },
        ],
      },
      fileList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    // 打开
    showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      } else {
        if (this.dictionary["school"].length == 1) {
          let schoolId = this.dictionary["school"][0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolIds: [schoolId],
          };
        }
      }
    },
    // 新增
    addData(data) {
      addProtocol(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editProtocol(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getProtocolDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            cnName,
            enName,
            protocolType,
            module,
            needSign,
            status,
            documentUrl,
          } = res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              schoolIds,
              cnName,
              enName,
              protocolType,
              module,
              needSign,
              status,
              documentUrl,
            };
            if (documentUrl) {
              this.fileList = [
                {
                  name: this.i18nlocel == "en" ? enName : cnName,
                  url: documentUrl,
                },
              ];
            }
          });
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submitForm", valid, this.modalType);
          let data = {
            ...this.ruleForm,
          };

          if (this.modalType == "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        } else {
          console.log("this.ruleForm", this.ruleForm);
        }
      });
    },
    // 文件大小验证方法
    validateFileSize(file) {
      return file.size <= 10 * 1024 * 1024;
    },
    async beforeUpload(file) {
      console.log("beforeUpload", file);
      // 文件大小验证
      if (!this.validateFileSize(file)) {
        this.$message.error(`文件大小不能超过 ${this.maxSize / (1024 * 1024)}MB`);
        return false;
      }
      const formData = new FormData();
      formData.append("file", file); // 将文件添加到 FormData 对象

      try {
        const response = await myRequest.upload(formData);
        // 上传成功，通过 $emit 通知父组件
        console.log("response", response.data);
        this.ruleForm = {
          ...this.ruleForm,
          documentUrl: response.data.url,
        };
        this.fileList = [
          {
            name: file["name"],
            url: response.data.url,
          },
        ];
        console.log("this.ruleForm", this.ruleForm);
        return true;
      } catch (error) {
        console.error("文件上传失败", error);
        // 上传失败，通过 $emit 通知父组件
        return false;
      }
    },
    removeUpload(file, fileList) {
      console.log("file", file);
      console.log("fileList", fileList);
      this.fileList = [];
      delete this.ruleForm["documentUrl"];
    },
    // 处理文件列表变化
    handleFileChange(file, fileList) {
      console.log("file", file);
      console.log("fileList", fileList);
      if (fileList.length > 1) {
        // 移除旧文件
        fileList.shift();
      }
    },
    // 关闭
    closeModal() {
      this.ruleForm = {};
      this.fileList = [];
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
