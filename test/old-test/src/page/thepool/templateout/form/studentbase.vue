<template>
  <div>
    <el-form label-position="top" ref="form" :model="form" :rules="rules">
      <div class="form_item_title">
        {{ $t("consult.学生护照全名") }}
      </div>
      <el-form-item :label="$t('consult.证件照/小一寸(白底)')" prop="photoId">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforePhotoUpload"
        >
          <img v-if="form.photoUrl" :src="form.photoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        :label="$t('consult.证件照/小一寸(非白底)')"
        prop="otherPhotoId"
      >
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeOtherPhotoUpload"
        >
          <img
            v-if="form.otherPhotoUrl"
            :src="form.otherPhotoUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item :label="$t('consult.姓')" prop="lastName">
        <div
          class="form-item-remark"
          v-html="
            $t('consult.请用中文拼音录入，首字母为大写，如：彭，请输入Peng')
          "
        ></div>
        <el-input
          v-model="form.lastName"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.名')" prop="firstName">
        <div
          class="form-item-remark"
          v-html="
            $t('consult.请用中文拼音录入，首字母为大写，如：爱莎，请输入Aisha')
          "
        ></div>
        <el-input
          v-model="form.firstName"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.其他姓名')" prop="otherName">
        <div
          class="form-item-remark"
          v-html="$t('consult.请输入中文姓名')"
        ></div>
        <el-input
          v-model="form.otherName"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.英文姓名')" prop="studentNameEn">
        <div
          class="form-item-remark"
          v-html="$t('consult.请输入英文名，比如：Apple')"
        ></div>
        <el-input
          v-model="form.studentNameEn"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$t('consult.性别')" prop="sex">
        <el-select
          style="width: 100%"
          v-model="form.sex"
          :placeholder="$t('consult.请选择')"
        >
          <el-option :label="$t('consult.男')" :value="1"></el-option>
          <el-option :label="$t('consult.女')" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.出生日期')" prop="birthday">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="form.birthday"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('consult.国籍')" prop="nationality">
        <div class="form-item-remark" v-html="'As in Passport / 同护照'"></div>
        <el-select
          popper-class="questionnaire-select-picker"
          filterable
          style="width: 100%"
          v-model="form.nationality"
          :placeholder="$t('consult.请选择')"
        >
          <el-option
            v-for="(i, k) in countryList"
            :key="i.value"
            :label="i18nlocel == 'en' ? i.en : i.cn"
            :value="i18nlocel == 'en' ? i.en : i.cn"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('consult.身份证/护照号')" prop="identityCard">
        <el-input
          v-model="form.identityCard"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.入学年份')" prop="enrollYear">
        <el-select
          style="width: 100%"
          v-model="form.enrollYear"
          :placeholder="$t('consult.请选择')"
        >
          <el-option
            v-for="i in enrollYearList"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.入学年级')" prop="enrollLevel">
        <el-select
          style="width: 100%"
          v-model="form.enrollLevel"
          :placeholder="$t('consult.请选择')"
          @change="changeEnrollLevel"
        >
          <div v-for="(i, k) in enrollLevelList" :key="i.value">
            <el-option :key="i.value" :label="i.label" :value="i.value">
            </el-option>
          </div>
        </el-select>
      </el-form-item>

      <!-- <el-form-item :label="$t('consult.在读学校')" prop="atSchool">
        <el-input
          v-model="form.atSchool"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item> -->
      <div class="form_item_title">
        {{ $t("consult.中国家庭住址") }}
      </div>
      <el-form-item :label="$t('consult.省份')" prop="state">
        <el-select
          filterable
          style="width: 100%"
          v-model="form.state"
          :placeholder="$t('consult.请选择')"
          @change="changeState"
        >
          <el-option
            v-for="i in chinaAreaOptions"
            :key="i.label"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.城市')" prop="city">
        <el-select
          filterable
          style="width: 100%"
          v-model="form.city"
          :placeholder="$t('consult.请选择')"
        >
          <el-option
            v-for="i in cityList"
            :key="i.label"
            :label="i.label"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.详细地址')" prop="address">
        <div
          class="form-item-remark"
          v-html="
            '请具体到街道、社区、楼栋、门牌号 Please specify Street Address, Building and Room No.'
          "
        ></div>
        <el-input
          v-model="form.address"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <div v-if="queryInfo['value'] == '5' || queryInfo['value'] == '6'">
        <el-form-item :label="$t('consult.母语')" prop="language">
          <el-input
            v-model="form.language"
            :placeholder="$t('consult.请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.第二语言')" prop="secondLanguage">
          <el-input
            v-model="form.secondLanguage"
            :placeholder="$t('consult.请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.第三语言')" prop="thirdLanguage">
          <el-input
            v-model="form.thirdLanguage"
            :placeholder="$t('consult.请输入')"
          ></el-input>
        </el-form-item>
      </div>
      <div v-if="queryInfo['value'] == '7'">
        <div class="form_item_title">
          {{ $t("consult.语言信息") }}
        </div>
        <el-form-item :label="$t('consult.母语')" prop="language">
          <el-select
            filterable
            style="width: 100%"
            v-model="form.language"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="(i, k) in languageList"
              :key="i.value"
              :label="i18nlocel == 'en' ? i.en : i.cn"
              :value="i18nlocel == 'en' ? i.en : i.cn"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.第二语言')" prop="secondLanguage">
          <el-select
            filterable
            style="width: 100%"
            v-model="form.secondLanguage"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="(i, k) in languageList"
              :key="i.value"
              :label="i18nlocel == 'en' ? i.en : i.cn"
              :value="i18nlocel == 'en' ? i.en : i.cn"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="form_item_title">
          {{ $t("consult.其他语言") }}
        </div>
        <el-form-item :label="$t('consult.第三语言')" prop="thirdLanguage">
          <el-select
            filterable
            style="width: 100%"
            v-model="form.thirdLanguage"
            :placeholder="$t('consult.请选择')"
          >
            <el-option
              v-for="(i, k) in languageList"
              :key="i.value"
              :label="i18nlocel == 'en' ? i.en : i.cn"
              :value="i18nlocel == 'en' ? i.en : i.cn"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { upOuterFile } from "@/api/upload/index.js";
import countryList from "country-list";
import {
  getLanguageList,
  formatChinaArea,
  languages,
  nationalities,
} from "@/util/jsondata.js";
import { getOuterFile, uploadOuterFile } from "@/api/upload/index.js";
export default {
  props: {
    enrollLevelList: {
      type: Array,
      default: () => [],
    },
    queryInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 国籍
      countryList: nationalities,
      // 语言
      languageList: languages,
      // 中国省市区
      chinaAreaOptions: formatChinaArea(),
      // 省
      stateList: [],
      // 市
      cityList: [],
      form: {
        lastName: "",
        firstName: "",
        studentNameEn: "",
        otherName: "",
        sex: "",
        birthday: "",
        atSchool: "",
        enrollYear: "",
        enrollLevel: "",
        nationality: "",
        state: "",
        city: "",
        address: "",
        identityCard: "",
        photoId: "",
        otherPhotoId: "",
        language: "",
        secondLanguage: "",
        thirdLanguage: "",
        direction: "",
      },
      rules: {
        lastName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        firstName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        studentNameEn: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        otherName: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        sex: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        birthday: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        atSchool: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        enrollYear: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        nationality: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        state: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        city: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        address: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        identityCard: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        photoId: [
          { required: true, message: "请上传/Please upload", trigger: "blur" },
        ],
        otherPhotoId: [
          { required: false, message: "请上传/Please upload", trigger: "blur" },
        ],
        language: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        secondLanguage: [
          {
            required: false,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        thirdLanguage: [
          {
            required: false,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
      },
      // 入学年份
      enrollYearList: [],
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  created() {
    this.getEnrollYear();
  },
  methods: {
    getEnrollYear() {
      // 获取当前年份
      const currentYear = new Date().getFullYear();
      // 生成入学年份列表,从当前年份往前推5年
      this.enrollYearList = [];
      for (let i = currentYear - 5; i <= currentYear; i++) {
        this.enrollYearList.push({
          value: i,
          label: `${i}-${i + 1} Academic Year`,
        });
      }
      console.log("getEnrollYear", this.enrollYearList);
    },
    onSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log("提交表单数据:", this.form);
            resolve({
              status: true,
              data: this.form,
            });
          } else {
            resolve({
              status: false,
              data: {},
            });
          }
        });
      });
    },
    // 省改变时，更新市
    changeState(e) {
      this.form.city = "";
      this.chinaAreaOptions.forEach((item) => {
        if (item.value === e) {
          if (item.children.length == 1) {
            this.cityList = item.children[0].children;
          } else {
            this.cityList = item.children;
          }
        }
      });
    },
    // 处理上传头像
    async beforePhotoUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      if (isJPG && isLt20M) {
        let formData = new FormData();
        formData.append("tenantId", "2");
        formData.append("file", file);
        const res = await upOuterFile(formData);
        if (res.data.success) {
          const localUrl = URL.createObjectURL(file);
          console.log("uploadFile", res, localUrl);
          this.$set(this.form, "photoUrl", localUrl);
          this.$set(this.form, "photoId", res.data.data);
        }
      }
    },
    async beforeOtherPhotoUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      if (isJPG && isLt20M) {
        let formData = new FormData();
        formData.append("tenantId", "2");
        formData.append("file", file);
        const res = await upOuterFile(formData);
        if (res.data.success) {
          const localUrl = URL.createObjectURL(file);
          console.log("uploadFile", res, localUrl);
          this.$set(this.form, "otherPhotoUrl", localUrl);
          this.$set(this.form, "otherPhotoId", res.data.data);
        }
      }
    },
    resetForm(data) {
      this.form = {
        ...this.form,
        ...data,
        enrollYear: String(data.enrollYear) || "",
        photoUrl: data.photoUrl || "",
        otherPhotoUrl: data.otherPhotoUrl || "",
      };

      this.getOuterFile(data.photoId, "photoUrl");
      this.getOuterFile(data.otherPhotoId, "otherPhotoUrl");
    },
    async getOuterFile(id, type) {
      if (!id) return;
      const file = await getOuterFile(id);
      let photoUrl = window.URL.createObjectURL(file);
      this.$nextTick(() => {
        this.$set(this.form, type, photoUrl);
      });
    },
    changeEnrollLevel(e) {
      console.log("changeEnrollLevel", e, this.queryInfo["value"]);

      let direction = {};
      switch (this.queryInfo["value"]) {
        // 广州荔湾爱莎文华学校（国内部）,G1-G6-文化国内小学，G7-G9-文化国内初中，G10-G12-文化国内高中
        case "5":
          direction = {
            5: 5,
            6: 5,
            7: 5,
            8: 5,
            9: 5,
            10: 5,
            11: 6,
            12: 6,
            13: 6,
            14: 7,
            15: 7,
            16: 7,
          };
          this.form["direction"] = direction[e] || "";
          console.log(' this.form["direction"]', e, direction[e], this.form);
          break;
        // 广州荔湾爱莎文华学校（国际部）,G1-G5-文化国际小学，G6-G8-文化国际初中，G9-G12-文化国际高中
        case "6":
          direction = {
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 3,
            11: 3,
            12: 3,
            13: 4,
            14: 4,
            15: 4,
            16: 4,
          };
          this.form["direction"] = direction[e] || "";
          console.log(' this.form["direction"]', e, direction[e], this.form);
          break;
        // 广州荔湾爱莎外籍人员,ey1-ey4-幼儿园,G1-G6-外籍小学，G7-G9-外籍初中，G10-G12-外籍高中
        case "7":
          direction = {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 19,
            6: 19,
            7: 19,
            8: 19,
            9: 19,
            10: 19,
            11: 20,
            12: 20,
            13: 20,
            14: 21,
            15: 21,
            16: 21,
          };
          this.form["direction"] = direction[e] || "";
          console.log(' this.form["direction"]', e, direction[e], this.form);

          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-remark {
  font-size: 12px;
  color: #999999;
  line-height: 16px;
  margin-bottom: 10px;
  // 识别换行符号换行
  white-space: pre-wrap;
}
.form_item_title {
  color: #000000;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
