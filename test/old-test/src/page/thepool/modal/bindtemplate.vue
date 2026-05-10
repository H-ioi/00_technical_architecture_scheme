<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.关联表属性')"
      :visible="showModal"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div
            class="df_center_wrap"
            style="max-height: 500px; overflow-y: auto; padding-bottom: 100px"
          >
            <el-form-item label="信息字段匹配" style="width: 100%">
              <div
                class="fieldListItem"
                v-for="(item, index) in uniqueFieldList"
                :key="index"
              >
                <el-input
                  :readonly="true"
                  style="width: 100px"
                  v-model="item['label']"
                  :placeholder="$t('consult.请输入')"
                  maxlength="20"
                ></el-input>
                --
                <el-select
                  clearable
                  @clear="clearUniqueField($event, item['value'])"
                  @change="changeUniqueField($event, item['value'])"
                  v-model="uniqueFieldForm[item['value']]"
                  :placeholder="$t('consult.请选择')"
                  style="width: 50%"
                >
                  <el-option
                    v-for="form in formArr"
                    :key="form.id"
                    :label="form.label"
                    :value="form.id"
                    :disabled="
                      item['value'] == 'applySchool'
                        ? form['mark'] != 'applyschool' || isSelectIds.includes(form.id)
                        : isSelectIds.includes(form.id)
                    "
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="其他字段匹配" style="width: 100%">
              <div
                class="fieldListItem"
                v-for="(item, index) in otherFieldList"
                :key="index"
              >
                <el-input
                  :readonly="true"
                  style="width: 100px"
                  v-model="item['label']"
                  :placeholder="$t('consult.请输入')"
                  maxlength="20"
                ></el-input>
                --
                <el-select
                  clearable
                  @clear="clearOtherField($event, item['value'])"
                  @change="changeOtherField($event, item['value'])"
                  v-model="otherFieldForm[item['value']]"
                  :placeholder="$t('consult.请选择')"
                  style="width: 50%"
                >
                  <el-option
                    v-for="form in formArr"
                    :key="form.id"
                    :label="form.label"
                    :value="form.id"
                    :disabled="
                      item['value'] == 'applySchool'
                        ? form['mark'] != 'applyschool' || isSelectIds.includes(form.id)
                        : isSelectIds.includes(form.id)
                    "
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="写入规则" prop="approval" style="width: 50%">
              <el-select
                v-model="ruleForm.approval"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in approvalRules"
                  :key="item.value"
                  :label="item.label"
                  :value="String(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" round @click="confirmData">{{
              $t("consult.保存")
            }}</el-button>
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "guardians",
  components: {},
  props: {
    formArr: {
      default: () => [],
      type: Array,
    },
    templateList: {
      default: () => [],
      type: Array,
    },
    templateId: {
      value: "",
      type: String,
    },
    collectionId: {
      value: "",
      type: String,
    },
  },
  data() {
    let that = this;
    return {
      showModal: false,
      ruleForm: {
        approval: "1",
      },
      rules: {
        approval: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
      },
      approvalRules: [
        { label: "自动写入", value: "1" },
        { label: "审核写入", value: "0" },
      ],
      uniqueFieldList: [],
      otherFieldList: [],
      uniqueFieldForm: {},
      otherFieldForm: {},
      uniqueFieldData: {},
      otherFieldData: {},
      fieldFormData: {
        label: "关联表",
        type: "association",
        properties: [{ key: "placeholder", value: "guardian info" }],
      },
      isSelectIds: [],
    };
  },
  created() {},
  mounted() {
    console.log("formArr", this.formArr);
  },
  computed: {
    ...mapGetters([
      "pooldictpermissions",
      "permissions",
      "dictionary",
      "i18nlocel",
      "userList",
    ]),
  },
  methods: {
    show() {
      this.showModal = true;
      this.$nextTick(() => {
        this.setList(this.templateId);
      });
    },
    clearData() {
      this.isSelectIds = [];
      this.uniqueFieldForm = {};
      this.uniqueFieldData = {};
      this.otherFieldForm = {};
      this.otherFieldData = {};
      this.uniqueFieldList = [];
      this.otherFieldList = [];
      console.log("clearData", "清空数据");
    },
    setList(templateId = null) {
      if (templateId) {
        this.templateList.map((item) => {
          if (item.value == templateId) {
            this.uniqueFieldList = item.unique_field;
            this.otherFieldList = item.other_field;
          }
        });
      } else {
        this.clearData();
      }
    },
    changeUniqueField(e, type) {
      if (e != "" && e != undefined && e != null) {
        console.log("changeUniqueField", e);
        this.uniqueFieldForm[type] = e;
        if (this.uniqueFieldData[type] != e) {
          this.isSelectIds = this.isSelectIds.filter((item) => {
            return item != this.uniqueFieldData[type];
          });
          this.isSelectIds.push(e);
          this.uniqueFieldData[type] = e;
        }
      }
    },
    changeOtherField(e, type) {
      if (e != "" && e != undefined && e != null) {
        this.otherFieldForm[type] = e;
        if (this.otherFieldData[type] != e) {
          this.isSelectIds = this.isSelectIds.filter((item) => {
            return item != this.otherFieldData[type];
          });
          this.isSelectIds.push(e);
          this.otherFieldData[type] = e;
        }
      }
    },
    clearUniqueField(e, type) {
      this.isSelectIds = this.isSelectIds.filter((item) => {
        return item != this.uniqueFieldData[type];
      });
      delete this.uniqueFieldForm[type];
      delete this.uniqueFieldData[type];
    },
    clearOtherField(e, type) {
      this.isSelectIds = this.isSelectIds.filter((item) => {
        return item != this.otherFieldData[type];
      });
      delete this.otherFieldForm[type];
      delete this.otherFieldData[type];
    },
    resetSelectId() {},
    checkForm() {
      let isPass = false;
      let formList = [...this.uniqueFieldList, ...this.otherFieldList];
      let formData = {
        ...this.uniqueFieldForm,
        ...this.otherFieldForm,
      };
      formList.map((item) => {
        if (formData[item["value"]] && !isPass) {
          isPass = true;
        }
      });
      if (!isPass) {
        this.$message.warning("请至少匹配一个关联表属性");
      }
      return isPass;
    },
    submitForm(collectionId) {
      if (!this.checkForm()) return;
      //   console.log("this.fieldFormData", this.uniqueFieldForm, this.otherFieldForm);
      this.fieldFormData["properties"] = [];
      this.fieldFormData["properties"].push({
        key: "placeholder",
        value: this.templateId,
      });
      this.fieldFormData["properties"].push({
        key: "approval",
        value: this.ruleForm["approval"] + "_" + collectionId,
      });
      Object.keys(this.uniqueFieldForm).forEach((res) => {
        this.fieldFormData["properties"].push({
          key: "unique_field",
          value: this.uniqueFieldForm[res] + "@" + res,
        });
      });
      Object.keys(this.otherFieldForm).forEach((res) => {
        this.fieldFormData["properties"].push({
          key: "other_field",
          value: this.otherFieldForm[res] + "@" + res,
        });
      });
      console.log("this.fieldFormData", this.fieldFormData);
      this.showModal = false;
    },
    confirmData() {
      if (!this.checkForm()) return;
      this.showModal = false;
    },
    closeModal() {
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
.fieldListItem {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
