<template>
  <div>
    <el-dialog
      width="40%"
      title="同步资产"
      :visible.sync="show"
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
              v-if="dictpermissions['order_school'].length > 1"
              label="校区"
              style="width: 100%"
              prop="school"
            >
              <el-select
                v-model="ruleForm['school']"
                placeholder="请选择"
                style="width: 100%"
                @change="changeSchool"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="showCascader"
              style="width: 100%"
              label="资产类型"
              prop="type"
            >
              <el-cascader
                style="width: 100%"
                ref="cascader"
                v-model="ruleForm['type']"
                :props="cascaderOptions"
                :options="options"
                @change="changeCascader"
              ></el-cascader>
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
import { getAssetTypeList } from "@/api/assets/list/index.js";
import {
  isSynchronization,
  batchSynchronization
} from "@/api/assets/sync/index.js";
import { getAssetTypeTop } from "@/api/assets/type/index.js";
export default {
  name: "PCOrderAddorder",
  props: {},
  data() {
    let _this = this;
    return {
      schoolList: [],
      assetId: "",
      show: false,
      type: "",
      ruleForm: { school: "", type: "" },
      rules: {
        school: [{ required: true, message: "请选择", trigger: "blur" }],
        type: [{ required: false, message: "请选择", trigger: "blur" }]
      },
      showCascader: false,
      options: [],
      cascaderOptions: {
        lazy: true,
        value: "showValue",
        label: "name",
        leaf: "leaf",
        children: "child",
        checkStrictly: true,
        async lazyLoad(node, resolve) {
          let list = await _this.getAssetTypeList(node);
          resolve(list);
        }
      }
    };
  },
  created() {
    this.getAssetTypeTop();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictpermissions"])
  },
  methods: {
    getAssetTypeTop() {
      getAssetTypeTop().then(res => {
        if (res.data.success) {
          this.defaultExpanded = [];
          let data = res.data.data;
          this.schoolList = data;
          if (this.schoolList.length == 1) {
            this.changeSchool(this.schoolList[0].id);
          }
        }
      });
    },
    isSynchronization(data) {
      isSynchronization(this.assetId, data).then(res => {
        if (res.data.success) {
          this.$message.success("同步成功");
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    batchSynchronization(data) {
      batchSynchronization(this.assetId, data).then(res => {
        if (res.data.success) {
          this.$message.success("同步成功");
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          let assetType = this.ruleForm["type"];
          let dataForm = new FormData();
          // dataForm.append("school", this.ruleForm["school"]);
          dataForm.append("menuTypeId", this.ruleForm["school"]);
          if (assetType) {
            assetType.map(item => {
              let type = JSON.parse(item);
              Object.keys(type).forEach(res => {
                dataForm.append(res, type[res]);
              });
            });
          }

          console.log("submitForm", dataForm);
          if (this.type == "single") {
            this.isSynchronization(dataForm);
          }
          if (this.type == "batch") {
            this.batchSynchronization(dataForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 懒加载资产类型
    async getAssetTypeList(node) {
      const { level, value, id, children, data } = node;
      console.log("node", node);
      let obj = {};
      obj["menuTypeId"] = this.ruleForm["school"];
      if (level == 0) {
      } else {
        obj["pid"] = data.id;
      }
      let assetTypeList = await this.setAssetTypeList(obj, level, data);
      console.log("assetTypeList", assetTypeList);
      return assetTypeList;
    },
    setAssetTypeList(obj, level, child) {
      return new Promise((resolve, reject) => {
        getAssetTypeList(obj).then(res => {
          if (res.data.success) {
            let childId = "";
            let hasChild = false;
            if (child && child["child"]) {
              hasChild = true;
              if (child["child"].length > 0) {
                childId = child["child"][0].id;
              }
            }
            let data = res.data.data.filter(item => {
              item["leaf"] = !item["hasEnableStatusChild"];
              switch (item["level"]) {
                case 2:
                  item["showValue"] = JSON.stringify({
                    typeIdLarge: item["id"]
                  });
                  break;
                case 3:
                  item["showValue"] = JSON.stringify({
                    typeIdMiddle: item["id"]
                  });
                  break;
                case 4:
                  item["showValue"] = JSON.stringify({
                    typeIdSmall: item["id"]
                  });
                  break;
              }
              return hasChild ? item.status && item.id != childId : item.status;
            });
            console.log("getAssetTypeList", data);
            resolve(data);
          }
        });
      });
    },

    changeSchool(e) {
      this.ruleForm["school"] = e;
      this.ruleForm["type"] = "";
      this.showCascader = false;
      setTimeout(() => {
        this.showCascader = true;
      }, 300);
    },
    // 获取选取的资产类型详情
    changeCascader(e) {
      let list = this.$refs["cascader"].getCheckedNodes(true);
      console.log("changeCascader", list);
    },
    closeModal() {
      this.type = "";
      this.assetId = "";
      this.show = false;
      this.showCascader = false;
      this.ruleForm = {
        school: "",
        type: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
