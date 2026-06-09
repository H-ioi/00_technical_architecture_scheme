<template>
  <div class="student-templateout">
    <!-- 导航栏 -->
    <div class="student-templateout-nav">
      <div class="student-templateout-nav_text">
        {{ $i18n.locale == "zh" ? queryInfo["label"] : queryInfo["enLabel"] }}
      </div>
      <div class="language" @click="changeLanguage">
        {{ $i18n.locale == "zh" ? "EN" : "ZH" }}
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="student-templateout-content">
      <div class="student-templateout-form">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 广州荔湾爱莎外籍 -->
          <template v-if="queryInfo['value'] == '7'">
            <el-tab-pane
              :label="`1.${$t('consult.学生基本信息')}`"
              name="first"
            >
              <div class="student-templateout-form_item">
                <!-- 学生基本信息表单 -->
                <StudentBase
                  ref="studentBase"
                  :countryList="countryList"
                  :languageList="languageList"
                  :enrollLevelList="enrollLevelList"
                  :queryInfo="queryInfo"
                />
                <!-- <div class="form_item_title">
                  {{ $t("consult.兄弟姐妹信息") }}
                </div> -->
                <!-- 兄弟姐妹信息表单 -->
                <Sibling ref="sibling" />
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`2.${$t('consult.家长信息')}`" name="second">
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

            <el-tab-pane
              :label="`3.${$t('consult.学历背景')}`"
              name="EducationHistory"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_title">
                  {{ $t("consult.以前的学校") }}
                </div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${395}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${387}`"
                />
                <div class="form_item_title">
                  {{
                    $t(
                      "consult.注意：如您在任何一项具体的特殊教育需求打勾，请提供详细的报告或文件。"
                    )
                  }}
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`4.${$t('consult.学校服务')}`"
              name="SchoolServices"
            >
              <div class="student-templateout-form_item">
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${377}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${389}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${388}`"
                />
              </div>
            </el-tab-pane>

            <el-tab-pane
              :label="`5.${$t('consult.学生医疗信息')}`"
              name="MedicalCondition"
            >
              <div class="student-templateout-form_item">
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${380}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${392}`"
                />
                <!-- <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${393}`"
                /> -->
                <div class="form_item_note" v-html="note1"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`6.${$t('consult.声明及协定')}`"
              name="Agreement"
            >
              <div class="student-templateout-form_item">
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${378}`"
                />
              </div>
            </el-tab-pane>
          </template>
          <!-- 广州荔湾爱莎文华学校（国内部） -->
          <template v-if="queryInfo['value'] == '5'">
            <el-tab-pane
              :label="`1.${$t('consult.学生基本信息')}`"
              name="first"
            >
              <div class="student-templateout-form_item">
                <!-- 学生基本信息表单 -->
                <StudentOther
                  ref="studentBase"
                  :countryList="countryList"
                  :languageList="languageList"
                  :enrollLevelList="enrollLevelList"
                  :queryInfo="queryInfo"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`2.${$t('consult.家长信息')}`" name="second">
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
            <el-tab-pane
              :label="`3.${$t('consult.兄弟姐妹信息')}`"
              name="third"
            >
              <div class="student-templateout-form_item">
                <!-- 兄弟姐妹信息表单 -->
                <Sibling ref="sibling" />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`4.${$t('consult.学历背景')}`"
              name="EducationHistory"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <div class="form_item_title">
                  {{ $t("consult.以前的学校") }}
                </div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${379}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`5.${$t('consult.义务段学生学籍信息')}`"
              name="CompulsoryEducation"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${382}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`6.${$t('consult.校车服务')}`"
              name="SchoolBusService"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${377}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`7.${$t('consult.寄宿服务')}`"
              name="BoardingService"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${389}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`8.${$t('consult.餐食服务')}`"
              name="MealsService"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${388}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`9.${$t('consult.学生医疗信息')}`"
              name="MedicalCondition"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${380}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${391}`"
                />
                <div class="form_item_note" v-html="note2"></div>
                <div class="form_item_note" v-html="note1"></div>
                <!-- <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${394}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${393}`"
                /> -->
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`10.${$t('consult.声明及协定')}`"
              name="Agreement"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${385}`"
                />
              </div>
            </el-tab-pane>
          </template>
          <!-- 广州荔湾爱莎文华学校（国际部） -->
          <template v-if="queryInfo['value'] == '6'">
            <el-tab-pane
              :label="`1.${$t('consult.学生基本信息')}`"
              name="first"
            >
              <div class="student-templateout-form_item">
                <!-- 学生基本信息表单 -->
                <StudentOther
                  ref="studentBase"
                  :countryList="countryList"
                  :languageList="languageList"
                  :enrollLevelList="enrollLevelList"
                  :queryInfo="queryInfo"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`2.${$t('consult.家长信息')}`" name="second">
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
            <el-tab-pane
              :label="`3.${$t('consult.兄弟姐妹信息')}`"
              name="third"
            >
              <div class="student-templateout-form_item">
                <!-- 兄弟姐妹信息表单 -->
                <Sibling ref="sibling" />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`4.${$t('consult.学历背景')}`"
              name="EducationHistory"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <div class="form_item_title">
                  {{ $t("consult.以前的学校") }}
                </div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${379}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`5.${$t('consult.义务段学生学籍信息')}`"
              name="CompulsoryEducation"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${382}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`6.${$t('consult.校车服务')}`"
              name="SchoolBusService"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${377}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`7.${$t('consult.寄宿服务')}`"
              name="BoardingService"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${389}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`8.${$t('consult.餐食服务')}`"
              name="MealsService"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${388}`"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`9.${$t('consult.学生医疗信息')}`"
              name="MedicalCondition"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${387}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${380}`"
                />
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${392}`"
                />
                <div class="form_item_note" v-html="note1"></div>
                <!-- <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${393}`"
                /> -->
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`10.${$t('consult.声明及协定')}`"
              name="Agreement"
            >
              <div class="student-templateout-form_item">
                <div class="form_item_tips">{{ tips }}</div>
                <FromitemActivity
                  :templateType="'templateout'"
                  codeType="student_fill_in_info"
                  :ref="`fromitemActivity${386}`"
                />
              </div>
            </el-tab-pane>
          </template>
          <!-- <el-tab-pane
            v-for="item in studentTemplate"
            :key="item.templateId"
            :label="
              i18nlocel == 'en'
                ? item.templateNameEn || item.templateName
                : item.templateName || item.templateNameEn
            "
            :name="item.templateId"
          >
            <div class="student-templateout-form_item" style="padding-top: 0">
              <FromitemActivity
                :templateType="'templateout'"
                codeType="student_fill_in_info"
                :ref="`fromitemActivity${item.templateId}`"
              />
            </div>
          </el-tab-pane> -->
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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
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
        <el-form-item :label="$t('consult.选择学生')" prop="studentId">
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
        </el-form-item>
        <el-form-item>
          <div class="student-templateout-dialog_footer">
            <el-button type="primary" @click="handleSubmitForm">{{
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
  getStudentFormByPhone,
  getPhoneCode,
  getStudentfillOutInfo,
} from "@/api/consult/collection.js";
import countryList from "country-list";
import { getLanguageList, formatChinaArea } from "@/util/jsondata.js";
import { consult } from "@/const/consult/index.js";
import StudentBase from "./form/studentbase.vue";
import StudentOther from "./form/studentother.vue";
import Family from "./form/family.vue";
import Sibling from "./form/sibling.vue";
import FromitemActivity from "@/components/formgenerator/fromitem-activity-pool.vue";

export default {
  components: {
    StudentBase,
    StudentOther,
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
      consult: consult,
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
      paySubjectList: [], //缴费主体
      directionList: [], //方向类型
      // 手机号验证弹窗
      dialogVisible: true,
      // 是否跳过手机号验证
      skipCode: false,

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
      queryInfo: {},
      // 家长信息
      selectFamily: {},
      // 学生信息
      selectStudent: {},
      // 配置写死的固定的模板id，学校服务377，声明协定378，学历背景379，医疗信息380,义务学生信息382
      paySubjectTemplate: {
        5: [379, 382, 377, 389, 388, 380, 385, 391],
        6: [379, 382, 377, 389, 388, 387, 380, 386, 392],
        7: [395, 387, 377, 388, 389, 380, 378, 392], //爱莎外籍
      },
      tips: "*Please fill in this form in English. 请您用英文填写此表格。",
      note1:
        "Note:\n1. Specific physical and mental condition include: heart disease, blood disease, chondrosis, asthma, epilepsy, hepatitis, tuberculosis, kidney disease, prone to nosebleed, hernia, tumor, allergy, prone to nosebleed, physical disability, previous surgery or fracture sites, etc; Allergic food, drugs and others; Depression, paranoia, anxiety and other psychological diseases; Sleepwalking and other problems that need to be explained.\n2. Please provide contact number as more as possible and it must be true and easy to contact. If there is any change, please inform the head teacher in time.\n3. If the filled information needs to be kept confidential by the school, please indicate: ________\n注:\n1. 学生身心特异体质、特定疾病和心理异常情况包括：心脏疾病、血液病、软骨病、哮喘、癫痫、肝炎、结核病、肾病、易流鼻血、疝气、肿瘤、过敏情况、易流鼻血、肢体残障、曾经手术或骨折部位等；过敏的食物、药物及其他；抑郁、多疑、焦虑等心理疾患；梦游等其他需要说明的问题疾病。\n2. 联系号码尽可能多些并务必真实有效,如有改动请及时告知班主任以及招生老师。\n3. 若所填信息需要学校予以保密，请予以注明：_______________",
      note2:
        "Note:\nIf there is no designated special hospital, in order to save more time in emergency situation, it will be regard as the parents (guardians)alraady had authorized school office to decide which hospital to send in emergency situation.\n如无指定专科医院，为了节省更多时间，在紧急情况下，将视家长（监护人）已授权学校办公室决定送往哪家医院。",
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  created() {
    this.queryInfo = this.$route.query.formType
      ? JSON.parse(decodeURIComponent(this.$route.query.formType))
      : {};
    console.log(" this.queryInfo ", this.queryInfo);

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
          case "enquiry_pay_subject":
            this.paySubjectList = item["dictItems"] || [];
            break;
          case "enquiry_direction":
            this.directionList = item["dictItems"] || [];
            break;
        }
      });
      consult["liWanTemplateName"].forEach((item) => {
        if (item.value == this.queryInfo.value) {
          this.queryInfo = {
            ...this.queryInfo,
            label: item.label,
            enLabel: item.enLabel,
          };
        }
      });
      let data = await getStudentTemplate({
        applySchool: 5,
      });
      if (
        process.env.NODE_ENV == "production" ||
        process.env.NODE_ENV == "local"
      ) {
        // 配置固定的模板id;
        this.studentTemplate = data.filter((item) => {
          return this.paySubjectTemplate[this.queryInfo.value].includes(
            Number(item.templateId)
          );
        });
      } else {
        this.studentTemplate = data || [];
      }
      console.log("111 this.studentTemplate", this.studentTemplate);
      if (this.studentTemplate.length > 0) {
        this.$nextTick(() => {
          this.studentTemplate.forEach((item) => {
            console.log(
              " this.studentTemplate",
              this.$refs[`fromitemActivity${item.templateId}`]
            );

            this.$refs[`fromitemActivity${item.templateId}`].reSetForm(
              item,
              item.templateId
            );
          });
          // this.resetFillStudentTemplate();
        });
      }
    },
    // 提交表单
    async submitForm() {
      // 检验是否全部通过
      let isPass = true;
      //获取学生表
      let studentBase = await this.$refs.studentBase.onSubmit();
      console.log("111studentBase", studentBase);
      console.log(1111, studentBase["status"], !studentBase["status"]);
      if (!studentBase["status"]) {
        this.$message.warning(this.$t("consult.请填写完整学生信息"));
        isPass = false;
        return;
      }
      // 获取家长表
      let familyList = await this.$refs.family.getFamilyList();
      console.log("familyList", familyList);
      familyList.forEach((item) => {
        if (!item.status) {
          isPass = false;
          this.$message.warning(this.$t("consult.请填写完整家长信息"));
          return;
        }
      });
      // 获取兄弟姐妹表
      let siblingList = await this.$refs.sibling.getSiblingList();
      console.log("siblingList", siblingList);
      siblingList.forEach((item) => {
        if (!item.status) {
          isPass = false;
          this.$message.warning(this.$t("consult.请填写完整兄弟姐妹信息"));
          return;
        }
      });
      // 获取动态表单
      let dynamicFormList = await this.getDynamicFormList();
      console.log("dynamicFormList", dynamicFormList);

      dynamicFormList.forEach((item) => {
        if (!item.status) {
          isPass = false;
          this.$message.warning(this.$t("consult.请填写完整表单信息"));
          return;
        }
      });

      if (!isPass) {
        this.$message.warning(this.$t("consult.请填写完整信息"));
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
          code: this.ruleForm["code"] || "",
          skipCode: this.skipCode || false,
          studentInfo: {},
          guardianInfos: [],
          studentSiblings: [],
          dynamicInfos: [],
        };
        formData["studentInfo"] = {
          ...studentBase["data"],
          formType: this.queryInfo["value"],
        };
        formData["guardianInfos"] = familyList.map((item) => item["data"]);
        formData["studentSiblings"] = siblingList.map((item) => item["data"]);
        formData["dynamicInfos"] = dynamicFormList.map((item) => item["data"]);
        console.log("formData", formData);
        // return;
        let res = await fillStudentTemplate(formData);
        console.log("fillStudentTemplate", res);
        if (res.data.success) {
          this.loading = false;
          loading.close();
          this.$router.push("/thepool/questionnaire/success");
        } else {
          if (res.data.code == 201) {
            this.$message.error(
              "验证码已过期，请重新获取\n The verification code has expired. Please re-obtain it."
            );
            setTimeout(() => {
              this.loading = false;
              loading.close();
              this.dialogVisible = true;
            }, 1000);
          } else {
            // 其他错误
            this.$message.error(res.data.msg || "提交表单失败");
            this.loading = false;
            loading.close();
          }
        }
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
          this.$refs[`fromitemActivity${item.templateId}`].getFormArrValue()
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
        type: "student_fill_in_info",
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
      const res = await getStudentFormByPhone({
        phone: this.ruleForm["phone"],
        code: this.ruleForm["code"],
      });
      if (res.data.success) {
        // this.dialogVisible = false;
        if (res.data.data.guardians.length > 0) {
          let { guardianId, students, name } = res.data.data.guardians[0];
          this.selectFamily = {
            guardianId,
            name,
          };
          this.studentInfo = students.map((item) => ({
            studentId: item.studentId,
            name: item.name || item.studentId,
          }));
          if (students.length > 0) {
            this.ruleForm["studentId"] = students[0].studentId;
            this.selectStudent = students[0];
            this.$message.success("请选择学生");
          } else {
            this.$message.error("暂无绑定学生");
          }
        }
      }
    },
    async handleSubmitForm() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.resetFillStudentTemplate();
        } else {
        }
      });
    },
    // 回填学生模板表单信息
    async resetFillStudentTemplate() {
      let res = await getStudentfillOutInfo({
        studentId: this.ruleForm["studentId"],
        // studentId: "25607",
      });
      console.log("getStudentfillOutInfo", res);
      if (res.data.success) {
        this.dialogVisible = false;
        let {
          phone,
          studentInfo,
          guardianInfos,
          studentSiblings,
          dynamicInfos,
        } = res.data.data;
        let studentSiblingsList = studentSiblings || [];
        let guardianInfosList = guardianInfos || [];
        let dynamicInfosList = dynamicInfos || [];
        this.$nextTick(() => {
          this.$refs.studentBase.resetForm(studentInfo);
          this.$refs.family.resetInfo(guardianInfosList);
          this.$refs.sibling.resetInfo(studentSiblingsList);
          this.studentTemplate.forEach((item) => {
            dynamicInfosList.forEach((dynamicItem) => {
              if (dynamicItem.templateId == item.templateId) {
                this.$refs[`fromitemActivity${item.templateId}`].resetFormData(
                  item,
                  dynamicItem
                );
              }
            });
          });
        });
      }
    },
    handleClose() {
      this.ruleForm = {
        phone: "",
        code: "",
        studentId: "",
      };
      this.skipCode = true;
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

<style lang="scss" scoped>
.student-templateout-form_direction {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  line-height: 18px;
  margin-bottom: 10px;
}
.form_item_tips {
  color: #37023c;
  font-size: 12px;
  line-height: 16px;
  background-color: #f0ebeb;
  padding: 5px;
  margin-bottom: 10px;
}
.form_item_title {
  color: #000000;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 10px;
  font-weight: bold;
}
.form_item_note {
  color: #999999;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 10px;
  white-space: pre-wrap;
}
</style>
