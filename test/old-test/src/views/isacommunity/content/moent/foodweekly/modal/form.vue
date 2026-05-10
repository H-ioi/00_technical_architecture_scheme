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
              style="width: 100%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.schoolId"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in schoolList"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.公众号链接')"
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
              prop="cnContent"
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
  addFoodWeekly,
  editFoodWeekly,
  getFoodWeeklyDetail,
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
      ruleForm: {},
      rules: {},
      isSubmitting: false,
      schoolList: [],
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
        cnContent: [
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
        schoolId: [
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
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    // 新增
    addData(data) {
      addFoodWeekly(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editFoodWeekly(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getFoodWeeklyDetail(id).then(async (res) => {
        if (res.data.success) {
          let { cnContent, enContent, schoolId, wechatUrl } = res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnContent,
              enContent,
              schoolId,
              wechatUrl,
            };
            this.$refs.TinymceCn.value = cnContent;
            // this.$refs.TinymceEn.value = enContent;
          });
        }
      });
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }

      this.$set(this.ruleForm, "cnContent", this.$refs.TinymceCn.value);
      this.$set(this.ruleForm, "enContent", this.$refs.TinymceCn.value);
      console.log("submitForm", this.ruleForm);
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
      addFoodWeekly(data)
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
      editFoodWeekly(data)
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
