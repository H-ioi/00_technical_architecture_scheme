<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1100px"
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
              :label="$t('isagroup.中文名')"
              prop="cnName"
              style="width: 25%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文名')"
              prop="enName"
              style="width: 25%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('isagroup.排序')"
              prop="index"
              style="width: 25%"
            >
              <el-input-number
                style="width: 100%"
                v-model="ruleForm['index']"
                :precision="0"
                :step="1"
                :min="0"
                :placeholder="$t('consult.请输入')"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否激活')"
              prop="active"
              style="width: 25%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['active']">
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
              :label="$t('isagroup.图标')"
              prop="icon"
              style="width: 100%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="ruleForm['icon']"
                  :src="ruleForm['icon']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.关联文章')"
              prop="chosenArticleId"
              style="width: 100%"
            >
              <el-transfer
                :titles="['文章列表', '已关联文章']"
                style="width: 100%; height: 500px"
                filterable
                v-model="ruleForm.chosenArticleId"
                :data="articleList"
              ></el-transfer>
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
  getContentArticleList,
  addNavigateButton,
  editNavigateButton,
  getNavigateButtonDetail,
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
        cnName: "",
        enName: "",
        icon: "",
        index: 0,
        active: false,
        chosenArticleId: [],
      },
      rules: {},
      isSubmitting: false,
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
        cnName: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        enName: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],

        icon: [
          {
            required: true,
            message: that.$t("isagroup.请上传"),
            trigger: "blur",
          },
        ],
        index: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        active: [
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
      this.articleList = await getContentArticleList();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    getDetail(id) {
      getNavigateButtonDetail(id).then(async (res) => {
        if (res.data.success) {
          let { cnName, enName, icon, index, active, chosenArticleId } =
            res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnName,
              enName,
              icon,
              index,
              active,
              chosenArticleId: chosenArticleId
                ? chosenArticleId.split(",")
                : [],
            };
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
            chosenArticleId: this.ruleForm.chosenArticleId
              ? this.ruleForm.chosenArticleId.join(",")
              : "",
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
      addNavigateButton(data)
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
      editNavigateButton(data)
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
        this.$message.error("上传图片大小不能超过20MB!");
      }
      if (isJPG && isLt20M) {
        this.ruleForm = {
          ...this.ruleForm,
          icon: await this.uploadfile(file),
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
      this.ruleForm = {};
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
