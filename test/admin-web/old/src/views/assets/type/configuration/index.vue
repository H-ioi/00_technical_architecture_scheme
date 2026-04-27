<template>
  <div class="space">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">资产启用配置</div>
      <div class="df_fa" style="height: calc(100% - 54px)">
        <el-scrollbar class="areaList">
          <div
            @click="changeSchool(i)"
            :class="[
              'areaItem',
              {
                areaItem_active: currentSchool == i.id,
              },
            ]"
            v-for="(i, k) in spaceTop"
            :key="k"
          >
            {{ i.name }}
          </div>
        </el-scrollbar>
        <div style="flex: 1; height: 100%">
          <!-- 动态表单 -->
          <Formgenerator
            ref="Formgenerator"
            class="assetFormgenerator"
            :hasTemplateFrom="false"
            @saveAssetForm="saveAssetForm"
          >
            <template slot="templateFrom">
              <el-form
                :label-position="'top'"
                :inline="true"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
              >
                <div class="df_center_wrap">
                  <el-form-item
                    label="校区编码"
                    style="width: 100%"
                    prop="code"
                  >
                    <el-input
                      style="width: 300px"
                      v-model="ruleForm.code"
                      placeholder="请输入"
                      maxlength="7"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="启用类型信息"
                    style="width: 100%"
                    prop="levels"
                  >
                    <el-select
                      style="width: 300px"
                      multiple
                      clearable
                      v-model="ruleForm.levels"
                      placeholder="请选择"
                      @click="changeLevels"
                    >
                      <el-option
                        v-for="(i, k) in assetsType"
                        :key="k"
                        :label="i.name"
                        :value="i.type"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item
                  class="modalFromBtn"
                  style="margin-top: 20px"
                  v-if="permissions['asset_type_conf_add']"
                >
                  <el-button
                    type="primary"
                    size="medium"
                    @click="submitForm('ruleForm')"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form></template
            >
          </Formgenerator>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
    
<script>
import { mapGetters } from "vuex";
import { assetsType } from "@/const/assets/index.js";
import { getAssetTypeTop } from "@/api/assets/type/index.js";
import {
  getAssetTypeConf,
  saveAssetTypeConf,
} from "@/api/assets/type/index.js";
import { getAssetForm, saveAssetForm } from "@/api/assets/form/index.js";
import Formgenerator from "@/page/space/from/formgenerator";
export default {
  components: {
    Formgenerator,
  },
  data() {
    return {
      assetsType: assetsType,
      spaceTop: [],
      currentSchool: "",
      ruleForm: {
        code: "",
        levels: [],
      },
      rules: {
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        levels: [{ required: true, message: "请选择", trigger: "blur" }],
      },
    };
  },

  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },

  created() {
    this.getAssetTypeTop();
  },
  activated() {},
  methods: {
    getAssetTypeTop() {
      getAssetTypeTop().then((res) => {
        if (res.data.success) {
          this.spaceTop = res.data.data;
          this.changeSchool(this.spaceTop[0]);
        }
      });
    },
    getAssetTypeConf() {
      getAssetTypeConf({ typeId: this.currentSchool }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { code, levels } = res.data.data;
          this.ruleForm = {
            code,
            levels,
          };
        }
      });
    },
    saveAssetTypeConf(data) {
      saveAssetTypeConf(data).then((res) => {
        if (res.data.success) {
          this.$message.success("保存成功");
          this.getAssetTypeConf();
        }
      });
    },
    saveAssetForm(templateFormId) {
      let path = `?menuTypeId=${this.currentSchool}&templateFormId=${templateFormId}`;
      saveAssetForm(path).then((res) => {
        if (res.data.success) {
          this.$message.success("保存成功");
          this.getAssetForm();
        }
      });
    },
    getAssetForm() {
      getAssetForm({ menuTypeId: this.currentSchool }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let data = res.data.data;
          this.$nextTick(() => {
            if (data != null) {
              this.$refs["Formgenerator"].routeData["type"] = "edit";
              this.$refs["Formgenerator"].templateData["templateFormId"] =
                data.id;
              this.$refs["Formgenerator"].getTemplateDetail(data.id);
            } else {
              this.$refs["Formgenerator"].routeData["type"] = "add";
              this.$refs["Formgenerator"].setform = {};
              this.$refs["Formgenerator"].formArr = [];
            }
          });
        }
      });
    },
    changeSchool(i) {
      this.currentSchool = i.id;
      this.getAssetTypeConf();
      this.getAssetForm();
      this.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { code, levels } = this.ruleForm;
          if (String(levels) == "2,4" || String(levels) == "4,2") {
            this.getAssetTypeTop();
            this.$message.warning("不可选择大类+小类的组合，请重新选择");
          } else {
            let data = {
              ...this.ruleForm,
              topTypeId: this.currentSchool,
            };
            console.log("ruleForm", data);
            this.saveAssetTypeConf(data);
          }
        } else {
          return false;
        }
      });
    },
    changeLevels(e) {
      this.resetFields();
    },
    resetFields() {
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
  },
};
</script>
<style  lang="scss">
.assetFormgenerator {
  .formgenerator_left {
    padding: 0 30px 0 0 !important;
  }
}
</style>