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
            <el-form-item
              label="接口名"
              style="width: 100%"
              prop="interfaceName"
            >
              <el-input
                v-model="ruleForm['interfaceName']"
                placeholder="请输入"
                maxlength="200"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="对接系统"
              style="width: 100%"
              prop="dockingSystem"
            >
              <el-input
                v-model="ruleForm['dockingSystem']"
                placeholder="请输入"
                maxlength="200"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="申请内容"
              style="width: 100%"
              prop="applyContent"
            >
              <el-input
                type="textarea"
                :rows="5"
                maxlength="500"
                show-word-limit
                v-model="ruleForm['applyContent']"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="状态"
              style="width: 100%"
              prop="interfaceStatus"
            >
              <el-select
                style="width: 100%;"
                v-model="ruleForm['interfaceStatus']"
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
import {
  addInterfaceSub,
  editInterfaceSub,
  checkSubName
} from "@/api/isa/interfacemanager.js";
export default {
  name: "maskingModal",
  components: {},
  props: {
    statusList: {
      default: function() {
        return [];
      },
      type: Array
    }
  },
  data() {
    const valifname = async (rule, value, callback) => {
      let data = await checkSubName(value, this.type, this.ruleForm);
      if (!data) {
        callback();
      } else {
        callback(new Error("接口名重复，请重新输入"));
      }
    };
    return {
      show: false,
      type: "add",
      typeTitel: {
        add: "新增接口订阅",
        edit: "编辑接口订阅"
      },
      ruleForm: {
        interfaceName: "",
        dockingSystem: "",
        applyContent: "",
        interfaceStatus: []
      },
      rules: {
        interfaceName: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: valifname, trigger: "blur" }
        ],
        dockingSystem: [{ required: true, message: "请输入", trigger: "blur" }],
        applyContent: [{ required: true, message: "请输入", trigger: "blur" }],
        interfaceStatus: [
          { required: false, message: "请选择", trigger: "blur" }
        ]
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
              addInterfaceSub({
                ...this.ruleForm
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
              editInterfaceSub({
                ...this.ruleForm
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
              interfaceName: item["interfaceName"],
              dockingSystem: item["dockingSystem"],
              applyContent: item["applyContent"],
              interfaceStatus: item["interfaceStatus"],
              id: item["id"]
            };
          });
          break;
      }
    },
    closeModal() {
      this.show = false;
      this.ruleForm = {
        interfaceName: "",
        dockingSystem: "",
        applyContent: "",
        interfaceStatus: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
