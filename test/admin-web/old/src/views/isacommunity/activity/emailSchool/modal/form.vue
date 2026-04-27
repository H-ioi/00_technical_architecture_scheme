<template>
  <div class="community_page">
    <el-dialog :title="$t('isagroup')[typeObj[modalType]]" :visible.sync="showModal" width="640px"
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
            <el-form-item :label="$t('isagroup.邮箱地址')" prop="email" style="width: 100%">
              <el-input style="width: 100%" v-model="ruleForm.email" :placeholder="$t('consult.请输入')"
                maxlength="200"></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.应用模块')" prop="appModule" style="width: 100%">
              <el-select clearable style="width: 100%" v-model="ruleForm['appModule']"
                :placeholder="$t('isagroup.请选择')">
                <el-option v-for="(opt, idx) in appModuleOptions" :key="idx" :label="opt.label"
                  :value="opt.value"></el-option>
              </el-select>
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
  addSchoolEmailConfig,
  editSchoolEmailConfig,
  getSchoolEmailConfigDetail,
  getAppModules,
} from "@/api/isacommunity/schoolEmailConfig.js";
export default {
  name: "emailSchoolForm",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "change" },
        ],
        email: [{ required: true, message: that.$t("isagroup.请输入"), trigger: "blur" }],
        appModule: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "change" },
        ],
      },
      appModuleOptions: [],
    };
  },
  created() {
    this.loadAppModuleOptions();
  },
  computed: {
    ...mapGetters(["dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel() {
      this.loadAppModuleOptions();
    },
  },
  methods: {
    normalizeAppModules(rawArr) {
      const opts = [];
      const seen = new Set();
      (rawArr || []).forEach((item) => {
        const value =
          item.value != null
            ? item.value
            : item.moduleCode != null
              ? item.moduleCode
              : item.code != null
                ? item.code
                : item.key != null
                  ? item.key
                  : item.id;
        const label =
          item.label != null
            ? item.label
            : item.name != null
              ? item.name
              : item.desc != null
                ? item.desc
                : item.moduleName != null
                  ? item.moduleName
                  : value != null
                    ? String(value)
                    : "";
        if (value == null || label === "") return;
        const sv = String(value);
        if (seen.has(sv)) return;
        seen.add(sv);
        opts.push({ value: sv, label });
      });
      if (!opts.some((o) => o.value === "1")) {
        opts.unshift({ value: "1", label: this.$t("isagroup.活动") });
      }
      return opts;
    },
    loadAppModuleOptions() {
      return getAppModules()
        .then((res) => {
          if (res.data.success) {
            const raw = res.data.data;
            const list = Array.isArray(raw) ? raw : raw && (raw.list || raw.data || raw.records);
            this.appModuleOptions = this.normalizeAppModules(Array.isArray(list) ? list : []);
          } else {
            this.appModuleOptions = this.normalizeAppModules([]);
          }
        })
        .catch(() => {
          this.appModuleOptions = this.normalizeAppModules([]);
        });
    },
    /** 编辑时接口返回的模块 code 若不在下拉中，补一条否则 el-select 显示为空 */
    ensureAppModuleOption(val) {
      const s = val != null && val !== "" ? String(val) : "";
      if (!s) return;
      if (!this.appModuleOptions.some((o) => o.value === s)) {
        this.appModuleOptions.push({ value: s, label: s });
      }
    },
    /** 与校区下拉的 option value 类型保持一致，避免数字/字符串不一致导致不回显 */
    normalizeSchoolIdForSelect(schoolId) {
      if (schoolId == null || schoolId === "") return undefined;
      const schools = this.dictionary["school"] || [];
      const match = schools.find((s) => String(s.id) === String(schoolId));
      return match ? match.id : schoolId;
    },
    async showForm(type = "add", item = {}) {
      await this.loadAppModuleOptions();
      this.modalType = type;
      if (type === "add") {
        this.ruleForm = {
          schoolId: undefined,
          email: "",
          appModule: "1",
        };
        this.showModal = true;
        this.$nextTick(() => {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate();
          }
        });
        return;
      }
      if (item.id) {
        await this.fetchDetail(item.id);
        this.showModal = true;
        this.$nextTick(() => {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate();
          }
        });
      }
    },
    addData(data) {
      addSchoolEmailConfig(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    editData(data) {
      editSchoolEmailConfig(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    fetchDetail(id) {
      return getSchoolEmailConfigDetail(id).then((res) => {
        if (!res.data.success) return;
        const d = res.data.data || {};
        const appModule =
          d.appModule != null && d.appModule !== "" ? String(d.appModule) : "1";
        this.ensureAppModuleOption(appModule);
        this.ruleForm = {
          id: d.id,
          schoolId: this.normalizeSchoolIdForSelect(d.schoolId),
          email: d.email || "",
          appModule,
        };
      });
    },
    buildPayload() {
      return {
        schoolId: this.ruleForm.schoolId,
        email: this.ruleForm.email,
        appModule: this.ruleForm.appModule,
        ...(this.modalType !== "add" && this.ruleForm.id != null ? { id: this.ruleForm.id } : {}),
      };
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
