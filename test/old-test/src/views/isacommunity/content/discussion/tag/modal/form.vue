<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="600px"
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
              style="width: 50%"
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
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
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
  addDiscussionTag,
  editDiscussionTag,
  getDiscussionTagDetail,
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
      };
    },
    // 打开
    async showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    // 新增
    addData(data) {
      addDiscussionTag(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editDiscussionTag(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getDiscussionTagDetail(id).then(async (res) => {
        if (res.data.success) {
          let { cnName, enName } = res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnName,
              enName,
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
      addDiscussionTag(data)
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
      editDiscussionTag(data)
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
      this.ruleForm = {
        cnName: "",
        enName: "",
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
