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
          <div class="df_center_wrap">
            <el-form-item :label="$t('isagroup.中文名')" prop="cnName" style="width: 50%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.英文名')" prop="enName" style="width: 50%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="!isBind"
              :label="$t('isagroup.活动项目')"
              prop="programId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['programId']"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in programlist"
                  :key="i.id"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.表演者')"
              prop="performer"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.performer"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="4"
                maxlength="200"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item
              :label="$t('isagroup.中文内容')"
              prop="contentCn"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.contentCn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="4"
              ></el-input>
            </el-form-item> -->
            <!-- <el-form-item
              :label="$t('isagroup.英文内容')"
              prop="contentEn"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.contentEn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="4"
              ></el-input>
            </el-form-item> -->
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
import { getActivityProgramlist } from "@/api/isacommunity/activityprogram.js";
import {
  addVoteProgram,
  editVoteProgram,
  getVoteProgramDetail,
} from "@/api/isacommunity/voteprogram.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "operation",
  components: {},
  props: {
    isBind: {
      type: Boolean,
      default: false,
    },
    bindProgramId: {
      type: String,
      default: "",
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
      rules: {},
      programlist: [],
      isSubmitting: false, // 添加提交状态标记
    };
  },
  created() {
    this.rules = this.initRules();
    this.initData();
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
    async initData() {},
    initRules() {
      let that = this;
      return {
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        performer: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        programId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      };
    },
    async showForm(type = "add", item = {}) {
      if (this.isBind) {
        this.ruleForm = {
          ...this.ruleForm,
          programId: this.bindProgramId,
        };
      } else {
        this.programlist = await getActivityProgramlist({ programTypes: ["2"] });
      }
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    getDetail(id) {
      getVoteProgramDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let { cnName, enName, performer, programId } = res.data.data;
            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnName,
              enName,
              performer,
              programId,
            };
          });
        }
      });
    },
    submitForm() {
      if (this.isSubmitting) {
        return;
      }

      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.isSubmitting = true;

          try {
            if (this.modalType == "add") {
              this.addData(this.ruleForm);
            } else {
              this.editData(this.ruleForm);
            }
          } catch (error) {
            this.isSubmitting = false;
          }
        }
      });
    },

    addData(data) {
      addVoteProgram(data)
        .then((res) => {
          this.isSubmitting = false;

          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch((error) => {
          this.isSubmitting = false;
          console.error("添加数据出错:", error);
        });
    },

    editData(data) {
      editVoteProgram(data)
        .then((res) => {
          this.isSubmitting = false;

          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          } else {
            this.$message.error(res.data.message || this.$t("isagroup.编辑失败"));
          }
        })
        .catch((error) => {
          this.isSubmitting = false;
        });
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
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
