<template>
  <div class="community_page">
    <el-dialog :title="$t('isagroup')[typeObj[modalType]]" :visible.sync="showModal" width="720px"
      :before-close="closeModal" :close-on-click-modal="false">
      <div class="moadlFromBox" v-if="showModal">
        <el-form :label-position="'top'" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="df_center_wrap">
            <el-form-item :label="$t('isagroup.校区')" prop="schoolId" style="width: 100%">
              <el-select clearable filterable style="width: 100%" v-model="ruleForm['schoolId']"
                :placeholder="$t('isagroup.请选择')">
                <el-option v-for="(i, k) in dictionary['school']" :key="k"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName || i.enName" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.微信AppID')" prop="wechatAppid" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.wechatAppid" :placeholder="$t('consult.请输入')"
                maxlength="200"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.微信Secret')" prop="wechatSecret" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.wechatSecret" type="password" show-password
                :placeholder="$t('consult.请输入')" maxlength="500"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.推送模板')" prop="msgTemplateId" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.msgTemplateId" :placeholder="$t('consult.请输入')"
                maxlength="200"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup')['Token值']" prop="verifyToken" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.verifyToken" :placeholder="$t('consult.请输入')"
                maxlength="500"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.激活状态')" prop="active" style="width: 100%">
              <el-radio-group v-model="ruleForm.active">
                <el-radio v-for="(i, k) in consts['yesOrno']" :key="k" :label="i.id">{{ i18nlocel == "en" ? i.enLabel :
                  i.label }}</el-radio>
              </el-radio-group>
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
  addWechatSchoolInfo,
  editWechatSchoolInfo,
  getWechatSchoolDetail,
} from "@/api/isacommunity/wechatSchoolInfo.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "wechatSchoolForm",
  components: {},
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
    };
  },
  created() {
    this.rules = this.initRules();
  },
  computed: {
    ...mapGetters(["dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel() {
      this.rules = this.initRules();
    },
  },
  methods: {
    initRules() {
      let that = this;
      return {
        schoolId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "change" },
        ],
        wechatAppid: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        wechatSecret: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        msgTemplateId: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        verifyToken: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        active: [{ required: true, message: that.$t("isagroup.请选择"), trigger: "change" }],
      };
    },
    async showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type === "add") {
        this.ruleForm = {
          active: "1",
        };
      } else if (item.id) {
        this.getDetail(item.id);
      }
    },
    addData(data) {
      addWechatSchoolInfo(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    editData(data) {
      editWechatSchoolInfo(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getWechatSchoolDetail(id).then((res) => {
        if (res.data.success) {
          const d = res.data.data || {};
          this.$nextTick(() => {
            this.ruleForm = {
              id: d.id,
              schoolId: d.schoolId,
              wechatAppid: d.wechatAppid,
              wechatSecret: d.wechatSecret,
              msgTemplateId: d.msgTemplateId,
              verifyToken: d.verifyToken,
              active: String(d.active != null ? d.active : "1"),
            };
          });
        }
      });
    },
    buildPayload() {
      const activeNum =
        this.ruleForm.active !== undefined && this.ruleForm.active !== ""
          ? Number(this.ruleForm.active)
          : 1;
      const payload = {
        schoolId: this.ruleForm.schoolId,
        wechatAppid: this.ruleForm.wechatAppid,
        wechatSecret: this.ruleForm.wechatSecret,
        msgTemplateId: this.ruleForm.msgTemplateId,
        verifyToken: this.ruleForm.verifyToken,
        active: Number.isFinite(activeNum) ? activeNum : 1,
      };
      if (this.modalType !== "add" && this.ruleForm.id != null) {
        payload.id = this.ruleForm.id;
      }
      return payload;
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          const payload = this.buildPayload();
          if (this.modalType === "add") {
            this.addData(payload);
          } else {
            this.editData(payload);
          }
        }
      });
    },
    closeModal() {
      this.ruleForm = {};
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      this.showModal = false;
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
