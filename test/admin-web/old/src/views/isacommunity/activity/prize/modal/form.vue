<template>
  <div class="community_page">
    <el-dialog :title="$t('isagroup')[typeObj[modalType]]" :visible.sync="showModal" width="1000px"
      :before-close="closeModal" :close-on-click-modal="false">
      <div class="moadlFromBox" v-if="showModal">
        <el-form :label-position="'top'" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="df_center_wrap">
            <el-form-item :label="$t('isagroup.中文名')" prop="cnName" style="width: 50%">
              <el-input style="width: 100%" v-model="ruleForm.cnName" :placeholder="$t('consult.请输入')"
                maxlength="100"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.英文名')" prop="enName" style="width: 50%">
              <el-input style="width: 100%" v-model="ruleForm.enName" :placeholder="$t('consult.请输入')"
                maxlength="100"></el-input>
            </el-form-item>
            <el-form-item v-if="!isBind" :label="$t('isagroup.活动项目')" prop="programId" style="width: 50%">
              <el-select clearable style="width: 100%" v-model="ruleForm['programId']"
                :placeholder="$t('isagroup.请选择')">
                <el-option v-for="(i, k) in programlist" :key="i.id" :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.金额')" prop="amount" style="width: 50%">
              <el-input-number style="width: 100%" v-model="ruleForm.amount" :precision="0" :step="0.01" :min="0"
                :placeholder="$t('consult.请输入')"></el-input-number>
            </el-form-item>
            <!-- 数量 prizeCount 字段暂时隐藏 -->
            <!-- <el-form-item :label="$t('isagroup.数量')" prop="prizeCount" style="width: 50%">
              <el-input-number style="width: 100%" v-model="ruleForm.prizeCount" :precision="0" :step="1" :min="0"
                :placeholder="$t('consult.请输入')"></el-input-number>
            </el-form-item> -->
            <el-form-item :label="$t('isagroup.图片')" prop="imageUrl" style="width: 100%">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeUpload">
                <img v-if="ruleForm['imageUrl']" :src="ruleForm['imageUrl']" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
import { getActivityProgramlist } from "@/api/isacommunity/activityprogram.js";
import { addPrize, editPrize, getPrizeDetail } from "@/api/isacommunity/prize.js";
import consts from "@/const/isacommunity/consts.js";
import myRequest from "@/router/axiosother.js";
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
      isSubmitting: false,
    };
  },
  created() {
    this.rules = this.initRules();
    this.initData();
  },
  mounted() { },
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
    async initData() { },
    initRules() {
      let that = this;
      return {
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        amount: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        // prizeCount 字段暂时隐藏，校验一并关闭
        // prizeCount: [
        //   { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        // ],
        imageUrl: [
          { required: true, message: that.$t("isagroup.请上传"), trigger: "blur" },
        ],
        programId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      };
    },
    async showForm(type = "add", item = {}) {
      if (type === "add") {
        this.ruleForm = {};
        if (this.isBind) {
          this.ruleForm.programId = this.bindProgramId;
        }
      }
      if (!this.isBind) {
        this.programlist = await getActivityProgramlist({ programTypes: ["1"] });
      }
      this.modalType = type;
      this.showModal = true;
      if (type !== "add" && item.id) {
        this.getDetail(item.id);
      }
    },
    // 新增
    addData(data) {
      addPrize(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editPrize(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getPrizeDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let {
              cnName,
              enName,
              amount,
              prizeCount,
              imageUrl,
              programId,
            } = res.data.data;
            this.ruleForm = {
              id,
              cnName,
              enName,
              amount,
              prizeCount,
              imageUrl,
              programId,
            };
          });
        }
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
          imageUrl: await this.uploadfile(file),
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
    /** 数量字段界面隐藏时仍给后端默认数量，避免新增/编辑参数不完整 */
    buildSubmitPayload() {
      const p = { ...this.ruleForm };
      if (p.prizeCount == null || p.prizeCount === "") {
        p.prizeCount = 1;
      }
      return p;
    },
    submitForm() {
      if (this.isSubmitting) {
        return;
      }

      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // 设置提交状态为true
          this.isSubmitting = true;

          try {
            const payload = this.buildSubmitPayload();
            if (this.modalType == "add") {
              this.addData(payload);
            } else {
              this.editData(payload);
            }
          } catch (error) {
            // 捕获异常并重置提交状态
            this.isSubmitting = false;
          }
        }
      });
    },

    addData(data) {
      addPrize(data)
        .then((res) => {
          this.isSubmitting = false;

          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch((error) => {
          // 捕获Promise错误并重置提交状态
          this.isSubmitting = false;
          console.error("添加数据出错:", error);
        });
    },

    editData(data) {
      editPrize(data)
        .then((res) => {
          this.isSubmitting = false;

          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch((error) => {
          // 捕获Promise错误并重置提交状态
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
