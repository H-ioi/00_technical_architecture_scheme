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
          <div
            class="df_center_wrap"
            style="max-height: 600px; overflow-y: auto"
          >
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="schoolId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.schoolId"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in schoolList"
                  :key="k"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.类型')"
              prop="type"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.type"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in momentTypeList"
                  :key="k"
                  :label="i18nlocel == 'en' ? i.enName : i.name"
                  :value="i.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.标题')"
              prop="title"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.title"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.内容')"
              prop="content"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.content"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否可见')"
              prop="visible"
              style="width: 33.33%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['visible']">
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.value"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否需要推送')"
              prop="push"
              style="width: 33.33%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['push']">
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item
              :label="$t('isagroup.是否发送短信')"
              prop="sendSms"
              style="width: 33.33%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['sendSms']">
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item> -->

            <el-form-item
              :label="$t('isagroup.图片')"
              prop="images"
              style="width: 100%"
            >
              <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :before-upload="beforeUpload"
                :on-remove="handleRemoveUpload"
                multiple
                :limit="10"
                :file-list="ruleForm['images']"
              >
                <el-button size="small" type="primary">
                  {{ $t("isagroup.点击上传") }}
                </el-button>
                <div slot="tip" class="el-upload__tip">
                  {{ $t("isagroup.只能上传png/jpg文件，且不超过20M") }}
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="PDF" prop="pdfs" style="width: 100%">
              <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :before-upload="beforeUploadPdf"
                :on-remove="handleRemoveUploadPdf"
                multiple
                :limit="10"
                :file-list="ruleForm['pdfs']"
              >
                <el-button size="small" type="primary">
                  {{ $t("isagroup.点击上传") }}</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  {{ $t("isagroup.只能上传pdf文件，且不超过20M") }}
                </div>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >{{ $t("isagroup.确认") }}</el-button
            >
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
  getContentSchoolList,
  getContentMomentTypeList,
  addContentMoment,
  editContentMoment,
  getContentMomentDetail,
} from "@/api/isacommunity/content.js";
import myRequest from "@/router/axiosother.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {
        schoolId: "",
        type: "",
        title: "",
        content: "",
        push: true,
        sendSms: false,
        images: [],
        pdfs: [],
        visible: "1",
      },
      rules: {},
      isSubmitting: false,
      schoolList: [],
      momentTypeList: [],
    };
  },
  created() {
    this.rules = this.initRules();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.rules = this.initRules();
      },
    },
  },
  methods: {
    initRules() {
      let that = this;
      return {
        schoolId: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        push: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        sendSms: [
          {
            required: false,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        images: [
          {
            required: false,
            message: that.$t("isagroup.请上传"),
            trigger: "blur",
          },
        ],
        visible: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
      };
    },
    // 打开
    async showForm(type = "add", item = {}) {
      this.schoolList = await getContentSchoolList();
      this.momentTypeList = await getContentMomentTypeList();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    getDetail(id) {
      getContentMomentDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolId,
            type,
            title,
            content,
            push,
            sendSms,
            images,
            pdfs,
            visible,
          } = res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              schoolId,
              type,
              title,
              content,
              push,
              sendSms,
              visible: String(visible),
              images: [],
              pdfs: [],
            };
            if (images && images.length > 0) {
              this.ruleForm["images"] = images.map((item) => {
                return {
                  name: item["image"],
                  url: item["url"],
                };
              });
            }
            if (pdfs && pdfs.length > 0) {
              this.ruleForm["pdfs"] = pdfs.map((item) => {
                return {
                  name: item["pdf"],
                  url: item["url"],
                  pdf: item["pdf"],
                };
              });
            }
          });
        }
      });
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置提交状态为true
          this.isSubmitting = true;
          let fromData = {
            ...this.ruleForm,
            images: this.ruleForm["images"].map((item) => {
              return {
                image: item["name"],
                url: item["url"],
              };
            }),
            pdfs: this.ruleForm["pdfs"].map((item) => {
              return {
                pdf: item["name"],
                url: item["url"],
              };
            }),
          };
          if (this.modalType == "add") {
            this.addData(fromData);
          } else {
            this.editData(fromData);
          }
        }
      });
    },
    // 修改addData方法，确保重置提交状态
    addData(data) {
      addContentMoment(data)
        .then((res) => {
          this.isSubmitting = false; // 重置提交状态
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false; // 错误时也要重置提交状态
        });
    },

    editData(data) {
      editContentMoment(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    async beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传图片大小不能超过 20MB!");
      }
      if (isJPG && isLt20M) {
        let url = await this.uploadfile(file);
        let obj = {
          name: file.name,
          url,
        };
        this.ruleForm.images.push(obj);
      }
    },

    async uploadfile(file) {
      let formData = new FormData();
      formData.append("prefix", "parent_weapp_upload");
      formData.append("file", file);
      const response = await myRequest.upload(formData);
      return response.data.url;
    },
    // pdf 上传
    async beforeUploadPdf(file) {
      const isPDF = file.type === "application/pdf";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isPDF) {
        this.$message.error("上传 PDF 文件只能是 PDF 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传 PDF 文件大小不能超过 20MB!");
      }
      if (isPDF && isLt20M) {
        let url = await this.uploadfile(file);
        let pdfObj = {
          name: file.name,
          url,
          pdf: file.name,
        };
        this.ruleForm.pdfs.push(pdfObj);
      }
    },
    // 删除图片
    handleRemoveUpload(file, fileList) {
      this.ruleForm.images = fileList;
    },
    // 删除PDF
    handleRemoveUploadPdf(file, fileList) {
      this.ruleForm.pdfs = fileList;
    },
    handlePreview(file) {
      console.log(file);
      window.open(file.url, "_blank");
    },
    // 关闭
    closeModal() {
      this.$refs.ruleForm.resetFields();
      this.showModal = false;
      this.ruleForm = {
        schoolId: "",
        type: "",
        title: "",
        content: "",
        push: true,
        sendSms: false,
        images: [],
        pdfs: [],
        visible: "1",
      };
      this.isSubmitting = false;
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
