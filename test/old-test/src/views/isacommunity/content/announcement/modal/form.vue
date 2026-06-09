<template>
  <div class="community_page">
    <el-dialog :title="$t('isagroup')[typeObj[modalType]]" :visible.sync="showModal" width="600px"
      :before-close="closeModal" :close-on-click-modal="false">
      <div class="moadlFromBox" v-if="showModal">
        <el-form :label-position="'top'" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item :label="$t('isagroup.校区')" prop="schoolId" style="width: 100%">
              <el-select clearable style="width: 100%" v-model="ruleForm.schoolId" :placeholder="$t('isagroup.请选择')">
                <el-option v-for="(i, k) in schoolList" :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.中文内容')" prop="cnContent" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.cnContent" :placeholder="$t('consult.请输入')"
                maxlength="200" type="textarea" rows="5"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.英文内容')" prop="enContent" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.enContent" :placeholder="$t('consult.请输入')"
                maxlength="200" type="textarea" rows="5"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.紧急程度')" prop="urgencyLevel" style="width: 100%">
              <el-radio-group style="width: 100%" v-model="ruleForm['urgencyLevel']">
                <el-radio :key="k" v-for="(i, k) in consts['urgencyLevel']" :label="i.id" style="color: 999999">{{
                  i18nlocel == "en" ? i.enLabel : i.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('isagroup.是否可见')" prop="active" style="width: 100%">
              <el-radio-group style="width: 100%" v-model="ruleForm['active']">
                <el-radio :key="k" v-for="(i, k) in consts['yesOrno']" :label="i.id" style="color: 999999">{{ i18nlocel
                  == "en" ? i.enLabel : i.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{ $t("isagroup.确认") }}</el-button>
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
  addContentAnnouncement,
  editContentAnnouncement,
  getContentAnnouncementDetail,
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
        cnContent: "",
        enContent: "",
        urgencyLevel: 1,
        active: "0",
      },
      rules: {},
      isSubmitting: false,
      schoolList: [],
    };
  },
  created() {
    this.rules = this.initRules();
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
    initRules() {
      let that = this;
      return {
        cnContent: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        enContent: [
          {
            required: true,
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
        urgencyLevel: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
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
      this.schoolList = await getContentSchoolList();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    getDetail(id) {
      getContentAnnouncementDetail(id).then(async (res) => {
        if (res.data.success) {
          let { cnContent, enContent, schoolId, urgencyLevel, active } =
            res.data.data;
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnContent,
              enContent,
              schoolId,
              urgencyLevel,
              active: active ? "1" : "0",
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
            active: this.ruleForm.active == "1" ? true : false,
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
      addContentAnnouncement(data)
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
      editContentAnnouncement(data)
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
        schoolId: "",
        cnContent: "",
        enContent: "",
        urgencyLevel: 1,
        active: "0",
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
