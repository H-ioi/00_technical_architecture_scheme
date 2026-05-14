<template>
  <div class="student-templateout">
    <!-- 导航栏 -->
    <div class="student-templateout-nav">
      <div class="student-templateout-nav_text">爱莎荔湾学校</div>
      <div class="language" @click="changeLanguage">
        {{ $i18n.locale == "zh" ? "EN" : "ZH" }}
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="student-templateout-content">
      <div class="student-templateout-form">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('consult.学生基本信息')" name="first">
            <div class="student-templateout-form_item">
              <!-- 学生基本信息表单 -->
              <StudentBase
                ref="studentBase"
                :countryList="countryList"
                :languageList="languageList"
                :enrollLevelList="enrollLevelList"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('consult.家长信息')" name="second">
            <div class="student-templateout-form_item">
              <!-- 家长信息表单 -->
              <Family
                ref="family"
                :countryList="countryList"
                :languageList="languageList"
                :relationTypeList="relationTypeList"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('consult.兄弟姐妹信息')" name="third">
            <div class="student-templateout-form_item">
              <!-- 兄弟姐妹信息表单 -->
              <Sibling ref="sibling" />
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-for="item in studentTemplate"
            :key="item.templateId"
            :label="
              i18nlocel == 'en'
                ? item.templateNameEn || item.templateName
                : item.templateName || item.templateNameEn
            "
            :name="item.templateId"
          >
            <!-- 动态渲染表单 -->
            <div class="student-templateout-form_item">
              <FromitemActivity
                :templateType="'templateout'"
                :ref="`fromitemActivity${item.templateId}`"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 底部提交按钮 -->
    <div class="student-templateout-footer">
      <div class="student-templateout-footer_item">
        <div class="student-templateout-footer_tips">
          <span style="color: #e94b35">*</span> {{ $t("consult.表示") }}
          {{ $t("consult.必填") }}
          <span style="color: #e94b35">{{ $t("consult.字段") }}</span
          >。
        </div>
        <el-button
          style="margin-left: 20px"
          type="primary"
          size="large"
          :loading="loading"
          @click="submitForm"
          >{{ $t("consult.确认提交") }}</el-button
        >
      </div>
    </div>
    <el-dialog
      class="student-templateout-dialog"
      :title="$t('consult.手机号验证')"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <el-form-item :label="$t('consult.手机号')" prop="phone">
          <div class="student-templateout-dialog_item">
            <el-input
              style="flex: 1; margin-right: 10px"
              v-model="ruleForm.phone"
              placeholder="请输入手机号"
            ></el-input>
            <el-button type="primary" @click="getCode">{{
              codeLoading ? codeCountDown + "s" : $t("consult.验证码")
            }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('consult.验证码')" prop="code">
          <el-input
            style="flex: 1"
            v-model="ruleForm.code"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('consult.选择学生')" prop="studentId">
          <div class="student-templateout-dialog_item">
            <el-select
              style="flex: 1; margin-right: 10px"
              v-model="ruleForm.studentId"
              placeholder="请选择学生"
            >
              <el-option
                v-for="item in studentInfo"
                :key="item.studentId"
                :label="item.name"
                :value="item.studentId"
              >
              </el-option>
            </el-select>
            <el-button type="primary" @click="getStudentList">{{
              $t("consult.查询")
            }}</el-button>
          </div>
        </el-form-item> -->
        <el-form-item>
          <div class="student-templateout-dialog_footer">
            <el-button type="primary" @click="getStudentList">{{
              $t("consult.确定")
            }}</el-button>
            <el-button @click="handleClose">{{ $t("consult.跳过") }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  getStudentTemplate,
  fillStudentTemplate,
  getOutDictItem,
  getStudentByPhone,
  getPhoneCode,
} from "@/api/consult/collection.js";
import countryList from "country-list";
import { getLanguageList, formatChinaArea } from "@/util/jsondata.js";
import StudentBase from "./form/studentbase.vue";
import Family from "./form/family.vue";
import Sibling from "./form/sibling.vue";
import FromitemActivity from "@/components/formgenerator/fromitem-activity-pool.vue";

export default {
  components: {
    StudentBase,
    Family,
    Sibling,
    FromitemActivity,
  },
  beforeRouteEnter(to, form, next) {
    document.title = "The Pool";
    next();
  },

  data() {
    return {
      loading: false,
      activeName: "first",
      studentTemplate: [],
      // 国籍
      countryList: countryList.getData(),
      // 语言
      languageList: getLanguageList(),
      // 中国省市区
      chinaAreaOptions: formatChinaArea(),
      // 字典数据
      relationTypeList: [], //关系类型
      enrollLevelList: [], //入学年级
      // 手机号验证弹窗
      dialogVisible: true,

      ruleForm: {
        phone: "",
        code: "",
        studentId: "",
      },
      rules: {
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        studentId: [
          { required: false, message: "请选择学生", trigger: "blur" },
        ],
      },
      studentInfo: [],
      // 倒计时定时器
      codeTimer: null,
      codeLoading: false,
      codeCountDown: 60,
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  created() {
    this.getStudentTemplate();
  },
  methods: {
    // 获取学生表模板，暂时写死荔湾校区id==5，后续根据学校id获取
    async getStudentTemplate() {
      // 获取字典数据
      let dictItem = await getOutDictItem(5);
      dictItem.forEach((item) => {
        switch (item["type"]) {
          case "enquiry_enroll_level":
            this.enrollLevelList = item["dictItems"] || [];
            break;
          case "enquiry_relation_type":
            this.relationTypeList = item["dictItems"] || [];
            break;
        }
      });
      console.log("relationTypeList", this.relationTypeList);

      let data = await getStudentTemplate({
        applySchool: 5,
      });
      console.log("getStudentTemplate", data);
      this.studentTemplate = data || [];
      if (this.studentTemplate.length > 0) {
        this.$nextTick(() => {
          this.studentTemplate.forEach((item) => {
            this.$refs[`fromitemActivity${item.templateId}`][0].reSetForm(
              item,
              item.templateId
            );
          });
        });
      }
    },
    // 提交表单
    async submitForm() {
      //获取学生表
      let studentBase = await this.$refs.studentBase.onSubmit();
      console.log("studentBase", studentBase);
      // 获取家长表
      let familyList = await this.$refs.family.getFamilyList();
      console.log("familyList", familyList);
      // 获取兄弟姐妹表
      let siblingList = await this.$refs.sibling.getSiblingList();
      console.log("siblingList", siblingList);
      // 获取动态表单
      let dynamicFormList = await this.getDynamicFormList();
      console.log("dynamicFormList", dynamicFormList);
      // 检验是否全部通过
      let isPass = true;
      if (!studentBase["status"]) {
        this.$message.error(this.$t("consult.请填写完整学生信息"));
        isPass = false;
        return;
      }
      familyList.forEach((item) => {
        if (!item.status) {
          isPass = false;
          this.$message.error(this.$t("consult.请填写完整家长信息"));
          return;
        }
      });
      siblingList.forEach((item) => {
        if (!item.status) {
          isPass = false;
          this.$message.error(this.$t("consult.请填写完整兄弟姐妹信息"));
          return;
        }
      });
      dynamicFormList.forEach((item) => {
        if (!item.status) {
          isPass = false;
          this.$message.error(this.$t("consult.请填写完整表单信息"));
          return;
        }
      });

      if (!isPass) {
        this.$message.error(this.$t("consult.请填写完整信息"));
        return;
      }
      // 正在提交中
      if (this.loading) {
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "正在提交中，请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.loading = true;
      try {
        // 提交表单
        let formData = {
          phone: this.ruleForm["phone"] || "",
          studentInfo: {},
          guardianInfos: [],
          studentSiblings: [],
          dynamicInfos: [],
        };
        formData["studentInfo"] = studentBase["data"];
        formData["guardianInfos"] = familyList.map((item) => item["data"]);
        formData["studentSiblings"] = siblingList.map((item) => item["data"]);
        formData["dynamicInfos"] = dynamicFormList.map((item) => item["data"]);
        console.log("formData", formData);
        let res = await fillStudentTemplate(formData);
        console.log("fillStudentTemplate", res);
        this.loading = false;
        loading.close();
        this.$router.push("/thepool/questionnaire/success");
      } catch (error) {
        this.loading = false;
        loading.close();
        console.error("提交表单失败:", error);
      }
    },
    getDynamicFormList() {
      let resultList = [];
      this.studentTemplate.forEach((item) => {
        resultList.push(
          this.$refs[`fromitemActivity${item.templateId}`][0].getFormArrValue()
        );
      });
      // 等待所有动态表单获取完成
      return new Promise((resolve, reject) => {
        // 等待所有动态表单获取完成
        Promise.all(resultList)
          .then((item) => {
            console.log("获取到的动态表单", item);
            resolve(item);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 切换tab
    handleClick(tab) {
      this.activeName = tab.name;
    },
    // 获取验证码
    async getCode() {
      if (!this.ruleForm["phone"] || this.ruleForm["phone"] == "") {
        this.$message.error("请输入手机号/Please input phone number");
        return;
      }
      await getPhoneCode({
        phone: this.ruleForm["phone"],
      });
      this.codeLoading = true;
      this.codeCountDown = 60;
      this.codeTimer = setInterval(() => {
        this.codeCountDown--;
        if (this.codeCountDown <= 0) {
          clearInterval(this.codeTimer);
          this.codeLoading = false;
        }
      }, 1000);
    },
    // 自动填充
    async getStudentList(id) {
      if (!this.ruleForm["phone"] || this.ruleForm["phone"] == "") {
        this.$message.error("请输入手机号/Please input phone number");
        return;
      }
      if (!this.ruleForm["code"] || this.ruleForm["code"] == "") {
        this.$message.error("请输入验证码/Please input verification code");
        return;
      }
      const res = await getStudentByPhone({
        phone: this.ruleForm["phone"],
        code: this.ruleForm["code"],
      });
      if (res.data.success) {
        this.dialogVisible = false;
        // if (res.data.data.guardians.length > 0) {
        //   let { guardianId, students } = res.data.data.guardians[0];
        //   this.studentInfo = students.map((item) => ({
        //     studentId: item.studentId,
        //     name: item.name || item.studentId,
        //   }));
        //   if (students.length > 0) {
        //     this.studentId = students[0].studentId;
        //     this.ruleForm["studentId"] = this.studentId;
        //   }
        //   this.$message.success("请选择学生");
        // }
      }
    },
    handleClose() {
      this.ruleForm = {
        phone: "",
        code: "",
        studentId: "",
      };
      this.dialogVisible = false;
    },
    ...mapMutations(["SET_I18NLOCALE"]),
    changeLanguage() {
      let locale = this.$i18n.locale;
      this.$i18n.locale = locale == "en" ? "zh" : "en";
      this.SET_I18NLOCALE(locale == "en" ? "zh" : "en");
    },
  },
};
</script>

<style lang="scss" scoped></style>
