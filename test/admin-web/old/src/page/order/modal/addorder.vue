<template>
  <div>
    <el-dialog
      width="40%"
      title="新建工单"
      :visible.sync="showAdd"
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
                  v-for="item in dictpermissions['order_school']"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="orderTypeList.length > 0"
              label="工单类型"
              style="width: 100%"
              prop="type"
            >
              <el-select
                v-model="ruleForm['type']"
                placeholder="请选择"
                style="width: 100%"
                @change="changeOrderType"
              >
                <el-option
                  v-for="item in orderTypeList"
                  :key="item.orderType"
                  :label="item.label"
                  :value="item.orderType"
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
  getOrderTypeList,
  getSchoolOrderType
} from "@/api/workorder/order/ordertype.js";
import { order } from "@/const/order/index.js";
export default {
  name: "PCOrderAddorder",
  props: {
    showAdd: Boolean,
    isMy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orderTypeAll: [],
      orderTypeList: [],
      ruleForm: { school: "", type: "" },
      rules: {
        school: [{ required: true, message: "请选择", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "blur" }]
      }
    };
  },
  created() {
    console.log("res", this.dictpermissions);
    this.getOrderTypeList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictpermissions"])
  },
  methods: {
    // 获取全部工单类型
    getOrderTypeList() {
      getOrderTypeList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.orderTypeAll = res.data.data;
          this.orderTypeAll.map(item => {
            order["orderType"].map(type => {
              if (item["orderType"] == type["value"]) {
                item["label"] = type["label"];
              }
            });
          });
          if (this.dictpermissions["order_school"].length == 1) {
            this.ruleForm["school"] = this.dictpermissions["order_school"][0][
              "value"
            ];
            this.getSchoolOrderType(
              this.dictpermissions["order_school"][0]["value"]
            );
          }
        }
      });
    },
    // 获取学校关联的工单类型
    getSchoolOrderType(schoolId) {
      getSchoolOrderType(schoolId).then(res => {
        console.log("res", res);
        if (res.data.success) {
          let list = res.data.data;
          this.orderTypeList = this.orderTypeAll.filter(item => {
            return (
              list.includes(Number(item["orderType"])) &&
              item["status"] &&
              schoolId == item["school"] &&
              this.permissions[
                order["orderTypePermissions"][Number(item["orderType"])]
              ]
            );
          });
        } else {
          this.orderTypeList = [];
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          switch (this.ruleForm["type"]) {
            case 1:
              this.$router.push(
                "/order/service/add?schoolId=" +
                  this.ruleForm["school"] +
                  "&isMy=" +
                  this.isMy
              );
              break;
            case 2:
              this.$router.push(
                "/order/carry/add?schoolId=" +
                  this.ruleForm["school"] +
                  "&isMy=" +
                  this.isMy
              );
              break;
            case 3:
              this.$router.push(
                "/order/inspect/add?schoolId=" +
                  this.ruleForm["school"] +
                  "&isMy=" +
                  this.isMy
              );
              break;
            case 4:
              this.$router.push(
                "/order/repair/add?schoolId=" +
                  this.ruleForm["school"] +
                  "&isMy=" +
                  this.isMy
              );
              break;
            case 5:
              this.$router.push(
                "/order/spotcheck/add?schoolId=" +
                  this.ruleForm["school"] +
                  "&isMy=" +
                  this.isMy
              );
              break;
            case 6:
              this.$router.push(
                "/order/upkeep/add?schoolId=" +
                  this.ruleForm["school"] +
                  "&isMy=" +
                  this.isMy
              );
              break;
          }

          this.closeModal();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeSchool(e) {
      // console.log("changeSchool", e);
      this.ruleForm["school"] = e;
      this.ruleForm["type"] = "";
      this.getSchoolOrderType(e);
    },
    changeOrderType(e) {
      console.log("changeOrderType", e);
      this.ruleForm["type"] = e;
    },
    closeModal() {
      this.ruleForm = {
        school: "",
        type: ""
      };
      this.$emit("changeModal", false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
