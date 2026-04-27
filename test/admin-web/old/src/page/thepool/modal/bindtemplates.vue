<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.关联表属性')"
      :visible="showModal"
      width="1000px"
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
            <!-- <el-form-item label="写入规则" prop="approval" style="width: 50%">
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
            </el-form-item> -->
            <el-form-item :label="$t('consult.字段匹配')" style="width: 100%">
              <div
                class="fieldListItem"
                v-for="(item, index) in selectFormArr"
                :key="index"
              >
                <el-input
                  :readonly="true"
                  style="width: 200px"
                  v-model="item['label']"
                  :placeholder="$t('consult.请输入')"
                ></el-input>
                --
                <el-cascader
                  class="selectchannlemultiple"
                  style="width: 480px; height: 32px"
                  collapse-tags
                  :props="{
                    multiple: true,
                    checkStrictly: true,
                  }"
                  :options="cascaderData[item['id']]"
                  v-model="cascaderValue[item['id']]"
                  @change="changeCascader"
                  @visible-change="visibleChange($event, item['id'])"
                ></el-cascader>
                <i
                  style="margin-left: 10px; color: red"
                  class="el-icon-delete"
                  @click="deleteForm(item['id'])"
                ></i>
                <!-- <el-button
                  circle
                  style="margin-left: 10px"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteForm(item['id'])"
                ></el-button> -->
              </div>
              <el-button type="primary" round @click="innerVisible = true">{{
                $t("consult.添加")
              }}</el-button>
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
      <el-dialog
        width="50%"
        :title="$t('consult.添加表单')"
        :visible="innerVisible"
        :before-close="closDialog"
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="moadlFromBox">
          <el-form
            :label-position="'top'"
            :inline="true"
            :model="innerForm"
            :rules="innerRules"
            ref="innerForm"
          >
            <div
              class="df_center_wrap"
              style="max-height: 500px; overflow-y: auto; padding-bottom: 100px"
            >
              <el-form-item
                :label="$t('consult.表单')"
                prop="approval"
                style="width: 100%"
              >
                <el-select
                  multiple
                  v-model="innerForm.formId"
                  :placeholder="$t('consult.请选择')"
                  style="width: 100%"
                >
                  <div v-for="item in formArr" :key="item.id">
                    <el-option
                      v-if="item.type != 'upload'"
                      :label="item.label"
                      :value="item.id"
                      :disabled="selectFormId.includes(item.id)"
                    >
                    </el-option>
                  </div>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="modalFromBtn">
              <el-button type="primary" size="medium" @click="confirmInnerData">{{
                $t("consult.保存")
              }}</el-button>
              <el-button type="default" size="medium" @click="innerVisible = false">{{
                $t("consult.取消")
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { deepClone } from "@/util/util.js";
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
import { getRelatedInfoTable } from "@/api/consult/collection.js";
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
      fieldFormData: {
        label: "关联表",
        type: "association",
        properties: [],
      },
      cascaderOptions: [],
      cascaderValue: {},
      cascaderData: {},
      selectFormArr: [],
      selectFormId: [],
      innerForm: {
        formId: [], // 初始化formId为数组
      },
      innerRules: {
        formId: [{ required: true, message: that.$t("consult.请选择"), trigger: "blur" }],
      },
      innerVisible: false,
    };
  },
  created() {
    // this.getTemplateList();
    this.getRelatedInfoTable();
  },
  mounted() {},
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
    },
    getRelatedInfoTable() {
      let dictAll = [];
      this.pooldictpermissions.map((item) => {
        dictAll.push(getRelatedInfoTable({ outerId: item.id }, item));
      });
      Promise.all(dictAll).then((list) => {
        list.map((item, index) => {
          if (index == 0) {
            this.cascaderOptions.push(item["clue"]);
            this.cascaderOptions.push(item["student"]);
            this.cascaderOptions.push(item["guardian"]);
          }
          this.cascaderOptions.push({
            label: item["school"]["label"],
            type: item["school"]["type"],
            value: item["school"]["value"],
            disabled: true,
            children: item["list"],
          });
          //   console.log("222getRelatedInfoTable", this.cascaderOptions);
        });

        // resolve();
      });
    },
    submitForm(collectionId) {
      //   if (!this.checkForm()) return;
      this.fieldFormData["properties"] = [];
      let hasValue = false;
      Object.keys(this.cascaderValue).forEach((res) => {
        this.cascaderValue[res].map((item) => {
          if (this.cascaderValue[res].length > 0) {
            hasValue = true;
            let formValue = item[item["length"] - 1].split("@");
            this.fieldFormData["properties"].push({
              key: formValue[0],
              value: res + "@" + formValue[1] + "@" + formValue[2],
            });
          }
        });
      });
      if (hasValue) {
        this.fieldFormData["properties"].push({
          key: "approval",
          // value: this.ruleForm["approval"] + "_" + collectionId,
          value: (hasValue ? "0" : "1") + "_" + collectionId,
        });
      }

      console.log("this.cascaderValue", this.cascaderValue);
      console.log("this.fieldFormData", this.fieldFormData);
      this.showModal = false;
    },

    confirmInnerData() {
      this.$refs["innerForm"].validate((valid) => {
        if (valid) {
          // 修改为处理多选的情况
          if (Array.isArray(this.innerForm.formId)) {
            this.innerForm.formId.forEach((formId) => {
              const selectedForm = this.formArr.find((item) => item.id === formId);
              if (selectedForm && !this.selectFormId.includes(formId)) {
                this.selectFormId.push(formId);
                this.selectFormArr.push(selectedForm);
                this.cascaderData[formId] = deepClone(this.cascaderOptions);
                this.cascaderValue[formId] = [];
              }
            });
          }
          this.innerVisible = false;
          this.innerForm.formId = []; // 重置为数组
        } else {
          return false;
        }
      });
    },
    changeCascader(event) {
      //   console.log("changeCascader", event, this.cascaderValue);
    },
    visibleChange(event, id) {
      if (event) {
        this.resetCascaderOptions(id);
      } else {
        this.cascaderData[id] = deepClone(this.cascaderOptions);
      }
    },
    deleteForm(id) {
      delete this.cascaderValue[id];
      this.selectFormArr = this.selectFormArr.filter((item) => item.id !== id);
      this.selectFormId = this.selectFormId.filter((item) => item !== id);
    },
    resetCascaderOptions(id) {
      Object.keys(this.cascaderValue).forEach((res) => {
        if (res != id) {
          this.cascaderValue[res].map((item) => {
            this.setDisable(this.cascaderData[id], item[item["length"] - 1]);
          });
        }
      });
      this.cascaderData = JSON.parse(JSON.stringify(this.cascaderData));
    },
    // 递归设置禁用状态
    setDisable(nodes, targetId) {
      nodes.forEach((node) => {
        const disabled = node.value === targetId;
        if (disabled) {
          this.$set(node, "disabled", disabled);
        }

        if (node.children) this.setDisable(node.children, targetId);
      });
    },
    // 校验
    checkForm() {
      let isPass = false;
      if (!isPass) {
        this.$message.warning("请至少匹配一个关联表属性");
      }
      return isPass;
    },
    setAssociation(data) {
      //   this.show();
      this.selectFormArr = [];
      this.selectFormId = [];
      let { id, properties } = data;
      properties.map((item) => {
        let arr = [];
        if (item["key"] == "approval") {
          arr = item["value"].split("_");
          this.ruleForm["approval"] = String(arr[0]);
        } else if (item["key"] == "unique_field" || item["key"] == "other_field") {
          arr = item["value"].split("@");
          this.cascaderData[arr[0]] = deepClone(this.cascaderOptions);
          let newId = item["key"] + "@" + arr[1] + "@" + arr[2];
          console.log("newId", newId);
          if (!this.selectFormId.includes(arr[0])) {
            this.formArr.map((form) => {
              if (form.id == arr[0]) {
                this.selectFormArr.push(form);
              }
            });
            this.selectFormId.push(arr[0]);
          }
          this.getCascaderIds(this.cascaderOptions, newId, arr[0]);
          console.log("this.cascaderValue", this.cascaderValue);
        }
      });
    },
    getCascaderIds(data, selectId, cascaderId, value = []) {
      data.map((item) => {
        if (item["value"] == selectId) {
          let lastValue = [...value, item["value"]];
          if (this.cascaderValue[cascaderId]) {
            this.cascaderValue[cascaderId].push(lastValue);
          } else {
            this.cascaderValue[cascaderId] = [lastValue];
          }
          return lastValue;
        } else {
          if (item["children"]) {
            let values = [...value, item["value"]];
            return this.getCascaderIds(item["children"], selectId, cascaderId, values);
          }
        }
      });
    },
    confirmData() {
      //   if (!this.checkForm()) return;
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    closDialog() {
      this.innerVisible = false;
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
