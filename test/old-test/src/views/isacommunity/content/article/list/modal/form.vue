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
              :label="$t('isagroup.中文标题')"
              prop="cnTitle"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnTitle"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文标题')"
              prop="enTitle"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.enTitle"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
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
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.内容分类')"
              prop="categoryId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.categoryId"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in categoryList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.重要等级')"
              prop="importanceLevel"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.importanceLevel"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in consts['articleImportent']"
                  :label="i18nlocel == 'en' ? i.enLabel : i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.主图')"
              prop="mainImage"
              style="width: 100%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="ruleForm['mainImage']"
                  :src="ruleForm['mainImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
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
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否Banner')"
              prop="isBanner"
              style="width: 33.33%"
            >
              <el-radio-group
                style="width: 100%"
                v-model="ruleForm['isBanner']"
              >
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否推荐')"
              prop="recommended"
              style="width: 33.33%"
            >
              <el-radio-group
                style="width: 100%"
                v-model="ruleForm['recommended']"
              >
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.微信选项')"
              prop="wechatOption"
              style="width: 100%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.wechatOption"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in consts['wechatOption']"
                  :label="i18nlocel == 'en' ? i.enLabel : i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.微信链接')"
              prop="wechatUrl"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.wechatUrl"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.内容')"
              prop="content"
              style="width: 100%"
            >
              <!-- 富文本输入 -->
              <TinymceCn
                ref="TinymceCn"
                :editor-id="'tinymce-cn'"
                language="zh_CN"
              />
            </el-form-item>
            <!-- <el-form-item
              :label="$t('isagroup.英文内容')"
              prop="enContent"
              style="width: 100%"
            >
              <TinymceEn
                ref="TinymceEn"
                :editor-id="'tinymce-en'"
                language="en"
              />
            </el-form-item> -->
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
  getContentCategoryList,
  addContentArticle,
  editContentArticle,
  getContentArticleDetail,
} from "@/api/isacommunity/content.js";
import myRequest from "@/router/axiosother.js";
import consts from "@/const/isacommunity/consts.js";
import TinymceCn from "@/components/tinymce/isatinymce.vue";
import TinymceEn from "@/components/tinymce/isatinymce.vue";
export default {
  name: "operation",
  components: { TinymceCn, TinymceEn },
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {
        cnTitle: "",
        enTitle: "",
        content: "",
        enContent: "",
        schoolId: "",
        mainImage: "",
        importanceLevel: 1,
        visible: true,
        isBanner: false,
        recommended: false,
        wechatOption: "",
        wechatUrl: "",
      },
      rules: {},
      isSubmitting: false,
      schoolList: [],
      categoryList: [],
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
        cnTitle: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        enTitle: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        content: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        enContent: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        mainImage: [
          {
            required: false,
            message: that.$t("isagroup.请上传"),
            trigger: "blur",
          },
        ],
        importanceLevel: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        schoolId: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        categoryId: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
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
        isBanner: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        recommended: [
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
      this.categoryList = await getContentCategoryList();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    getDetail(id) {
      getContentArticleDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            cnTitle,
            enTitle,
            content,
            enContent,
            schoolId,
            categoryId,
            mainImage,
            importanceLevel,
            visible,
            isBanner,
            recommended,
            wechatOption,
            wechatUrl,
          } = res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnTitle,
              enTitle,
              content,
              enContent,
              schoolId,
              categoryId,
              mainImage,
              importanceLevel,
              visible,
              isBanner,
              recommended,
              wechatOption,
              wechatUrl,
            };
            this.$refs.TinymceCn.value = content;
            // this.$refs.TinymceEn.value = enContent;
          });
        }
      });
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }
      this.$set(this.ruleForm, "content", this.$refs.TinymceCn.value);
      this.$set(this.ruleForm, "enContent", this.$refs.TinymceCn.value);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置提交状态为true
          this.isSubmitting = true;
          let fromData = {
            ...this.ruleForm,
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
      addContentArticle(data)
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
      editContentArticle(data)
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
        this.ruleForm = {
          ...this.ruleForm,
          mainImage: await this.uploadfile(file),
        };
      }
    },
    async uploadfile(file) {
      let formData = new FormData();
      formData.append("prefix", "parent_weapp_upload");
      formData.append("file", file);
      const response = await myRequest.upload(formData);
      return response.data.url;
    },
    // 关闭
    closeModal() {
      this.$refs.ruleForm.resetFields();
      this.showModal = false;
      this.ruleForm = {
        cnTitle: "",
        enTitle: "",
        content: "",
        enContent: "",
        schoolId: "",
        categoryId: "",
        mainImage: "",
        importanceLevel: 1,
        visible: true,
        isBanner: false,
        recommended: false,
        wechatOption: "",
        wechatUrl: "",
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
