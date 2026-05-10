<template>
  <div class="thepool_page">
    <el-form
      :label-position="'top'"
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
    >
      <div class="df_center_wrap">
        <!-- <el-form-item :label="$t('consult.MDId')" prop="mbId" style="width: 25%">
          <el-input
            v-model.trim="ruleForm.mbId"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.自定义ID')" prop="customId" style="width: 25%">
          <el-input
            v-model.trim="ruleForm.customId"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.Managebac学生ID')"
          prop="managebacStudentId"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.managebacStudentId"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item> -->
        <el-form-item
          :label="$t('consult.姓名')"
          prop="name"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.name"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item :label="$t('consult.其他名称')" prop="otherName" style="width: 25%">
          <el-input
            v-model.trim="ruleForm.otherName"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item
          :label="$t('consult.偏好称呼的名字')"
          prop="preferredName"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.preferredName"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item> -->
        <el-form-item
          :label="$t('consult.代表人信息')"
          prop="representative"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.representative"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.来源营销活动信息')"
          prop="sourceCampaign"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.sourceCampaign"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.学校')"
          prop="campus"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.campus"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.州/省')"
          prop="state"
          style="width: 25%"
        >
          <!-- <el-input
            v-model.trim="ruleForm.state"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input> -->
          <el-cascader
            style="width: 100%; line-height: 12px"
            v-model.trim="ruleForm.state"
            :options="regionData"
            :props="cascaderProps"
            :placeholder="$t('consult.请选择')"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          :label="$t('consult.城市')"
          prop="city"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.city"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.邮政编码')"
          prop="postalCode"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.postalCode"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.地址第一行')"
          prop="address"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.address"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.地址第二行')"
          prop="address_ii"
          style="width: 25%"
        >
          <el-input
            v-model.trim="ruleForm.address_ii"
            :placeholder="$t('consult.请输入')"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.申请日期')"
          prop="appliedDate"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.appliedDate"
            type="date"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.申请时间')"
          prop="appliedAt"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.appliedAt"
            type="datetime"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.注册日期')"
          prop="enrolledDate"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.enrolledDate"
            type="date"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.注册时间')"
          prop="enrolledAt"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.enrolledAt"
            type="datetime"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.拒绝日期')"
          prop="declinedDate"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.declinedDate"
            type="date"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.毕业日期')"
          prop="graduatedDate"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.graduatedDate"
            type="date"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.咨询日期')"
          prop="inquiredDate"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.inquiredDate"
            type="date"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.咨询时间')"
          prop="inquiredAt"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.inquiredAt"
            type="datetime"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('consult.退学日期')"
          prop="withdrawnDate"
          style="width: 25%"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.withdrawnDate"
            type="date"
            :placeholder="$t('consult.请选择')"
            :value-format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import {
  regionData, // 省市区三级完整数据（最常用）
  provinceAndCityData, // 省市二级数据（无需区县时用）
  provinceData, // 纯省级数据（仅省份）
  CodeToText, // 区域编码转名称的映射对象（关键！存编码后快速转名称）
} from "element-china-area-data";
export default {
  name: "addStudent",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      ruleForm: {},
      rules: {
        mbId: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        customId: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        managebacStudentId: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        name: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        otherName: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        preferredName: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        representative: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        sourceCampaign: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        campus: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        state: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        city: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        postalCode: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        city: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        address: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        address_ii: [
          {
            required: false,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        appliedDate: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        appliedAt: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        declinedDate: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        graduatedDate: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        inquiredDate: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        withdrawnDate: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        enrolledDate: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        enrolledAt: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
      },
      regionData: regionData,
      cascaderProps: {
        value: "label", // 选项的value为区域编码
        label: "label", // 选项的显示标签为区域名称
        children: "children", // 子级数据的字段名
        expandTrigger: "hover", // 鼠标悬浮展开子级（可选，也可设为click）
      },
    };
  },
  created() {
    console.log("regionData", regionData);
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "dictpermissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  methods: {
    setFormData(data) {
      if (data) {
        this.ruleForm = {
          ...this.ruleForm,
          ...data,
          state: data.state && data.state != "" ? data.state.split("/") : [],
        };
      }
    },
    async submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate((valid) => {
          this.ruleForm.state = this.ruleForm.state
            ? this.ruleForm.state.join("/")
            : "";
          resolve({
            isPass: valid,
            data: this.ruleForm,
          });
        });
      });
    },
    closeModal() {
      this.ruleForm = {};
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
