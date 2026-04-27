<template>
  <div>
    <el-dialog
      :title="typeTitel[type]"
      :visible.sync="show"
      width="40%"
      :before-close="closeModal"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item label="字段名" style="width: 100%" prop="fname">
              <el-input
                v-model="ruleForm['fname']"
                placeholder="请输入"
                maxlength="200"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="脱敏规则"
              style="width: 100%"
              prop="maskingRule"
            >
              <el-input
                type="textarea"
                :rows="5"
                v-model="ruleForm['maskingRule']"
                placeholder="请输入"
                maxlength="500"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              label="脱敏方式"
              style="width: 100%"
              prop="maskingMethod"
            >
              <el-select
                style="width: 100%;"
                v-model="ruleForm['maskingMethod']"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in maskingMethodList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="应用场景"
              style="width: 100%"
              prop="appScenario"
            >
              <el-select
                style="width: 100%;"
                multiple
                v-model="ruleForm['appScenario']"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in appScenarioList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" style="width: 100%" prop="maskingStatus">
              <el-select
                style="width: 100%;"
                v-model="ruleForm['maskingStatus']"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="default" size="medium" @click="closeModal"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addMaskingRules, editMaskingRules } from "@/api/isa/maskingRules.js";
export default {
  name: "maskingModal",
  components: {},
  props: {
    maskingMethodList: {
      default: function() {
        return [];
      },
      type: Array
    },
    statusList: {
      default: function() {
        return [];
      },
      type: Array
    },
    appScenarioList: {
      default: function() {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      show: false,
      type: "add",
      typeTitel: {
        add: "新增脱敏规则",
        edit: "编辑脱敏规则"
      },
      ruleForm: {
        fname: "",
        maskingRule: "",
        maskingMethod: "",
        appScenario: [],
        maskingStatus: ""
      },
      rules: {
        fname: [{ required: true, message: "请输入", trigger: "blur" }],
        maskingRule: [{ required: true, message: "请输入", trigger: "blur" }],
        maskingMethod: [{ required: true, message: "请选择", trigger: "blur" }],
        appScenario: [{ required: true, message: "请选择", trigger: "blur" }]
      }
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (this.type) {
            case "add":
              addMaskingRules({
                ...this.ruleForm,
                appScenario: String(this.ruleForm["appScenario"])
              }).then(res => {
                this.$emit("resetPageList");
                this.$message({
                  type: "success",
                  message: "成功!"
                });
                this.closeModal();
              });
              break;
            case "edit":
              editMaskingRules({
                ...this.ruleForm,
                appScenario: String(this.ruleForm["appScenario"])
              }).then(res => {
                this.$emit("resetPageList");
                this.$message({
                  type: "success",
                  message: "成功!"
                });
                this.closeModal();
              });
              break;
          }
        } else {
          return false;
        }
      });
    },
    initData(type, item = {}) {
      this.show = true;
      this.type = type;
      switch (type) {
        case "add":
          break;
        case "edit":
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              fname: item["fname"],
              maskingRule: item["maskingRule"],
              maskingMethod: String(item["maskingMethod"]),
              appScenario: item["appScenario"].split(","),
              maskingStatus: item["maskingStatus"],
              id: item["id"]
            };
          });
          break;
      }
    },
    closeModal() {
      this.show = false;
      this.ruleForm = {
        fname: "",
        maskingRule: "",
        maskingMethod: "",
        appScenario: "",
        maskingStatus: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
