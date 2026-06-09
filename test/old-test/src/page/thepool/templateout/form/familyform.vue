<template>
  <div>
    <el-form label-position="top" ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('consult.和学生关系')" prop="relationType">
        <el-select
          style="width: 100%"
          v-model="form.relationType"
          :placeholder="$t('consult.请选择')"
        >
          <div v-for="(i, k) in relationTypeList" :key="i.value">
            <el-option :key="i.value" :label="i.label" :value="i.value">
            </el-option>
          </div>
        </el-select>
      </el-form-item>
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

      <el-form-item :label="$t('consult.身份证/护照号')" prop="idNumber">
        <el-input
          v-model="form.idNumber"
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
      <div class="form_item_title">
        {{ $t("consult.护照全名") }}
      </div>
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
      <!-- <el-form-item :label="$t('consult.第三语言')" prop="thirdLanguage">
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
      </el-form-item> -->

      <el-form-item :label="$t('consult.手机号')" prop="phone">
        <el-input
          v-model="form.phone"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.邮箱')" prop="email">
        <div
          class="form-item-remark"
          v-html="$t('consult.此邮箱地址是家长登录招生系统家长端的用户名')"
        ></div>
        <el-input
          v-model="form.email"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.在职单位名称')" prop="employer">
        <el-input
          v-model="form.employer"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.职位名称')" prop="jobTitle">
        <el-input
          v-model="form.jobTitle"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <div v-if="showAddress">
        <div class="form_item_title">
          {{ $t("consult.中国家庭住址 (如果和孩子不同。)") }}
        </div>
        <el-form-item :label="$t('consult.街道地址1')" prop="address">
          <el-input
            v-model="form.address"
            :placeholder="$t('consult.请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.街道地址2')" prop="addressIi">
          <el-input
            v-model="form.addressIi"
            :placeholder="$t('consult.请输入')"
          ></el-input>
        </el-form-item>
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
    relationTypeList: {
      type: Array,
      default: () => [],
    },
    showAddress: {
      type: Boolean,
      default: true,
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
        photoId: "",
        idNumber: "",
        lastName: "",
        firstName: "",
        otherName: "",
        sex: "",
        relationType: "",
        phone: "",
        email: "",
        employer: "",
        jobTitle: "",
        nationality: "",
        state: "",
        city: "",
        address: "",
        addressIi: "",
        language: "",
        secondLanguage: "",
        thirdLanguage: "",
      },
      rules: {
        relationType: [
          {
            required: true,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        lastName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        firstName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
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
        phone: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        employer: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        jobTitle: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
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
            required: false,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        city: [
          {
            required: false,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        address: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        addressIi: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        photoId: [
          {
            required: true,
            message: "请上传/Please upload",
            trigger: "change",
          },
        ],
        idNumber: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
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
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
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
    resetForm(data) {
      this.form = {
        ...this.form,
        ...data,
      };
      this.getOuterFile(data.photoId, "photoUrl");
    },
    async getOuterFile(id, type) {
      if (!id) return;
      const file = await getOuterFile(id);
      let photoUrl = window.URL.createObjectURL(file);
      this.$nextTick(() => {
        this.$set(this.form, type, photoUrl);
      });
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
