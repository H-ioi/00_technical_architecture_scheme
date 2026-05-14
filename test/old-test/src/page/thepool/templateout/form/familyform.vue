<template>
  <div>
    <el-form label-position="top" ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('consult.证件照(白底)')" prop="photoId">
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
      <el-form-item :label="$t('consult.姓')" prop="lastName">
        <el-input
          v-model="form.lastName"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.名')" prop="firstName">
        <el-input
          v-model="form.firstName"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.其他姓名')" prop="otherName">
        <el-input
          v-model="form.otherName"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.性别')" prop="sex">
        <el-select
          style="width: 100%"
          v-model="form.sex"
          :placeholder="$t('consult.请选择')"
        >
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item :label="$t('consult.手机号')" prop="phone">
        <el-input
          v-model="form.phone"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.邮箱')" prop="email">
        <el-input
          v-model="form.email"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.工作单位')" prop="employer">
        <el-input
          v-model="form.employer"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.职务')" prop="jobTitle">
        <el-input
          v-model="form.jobTitle"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.国籍')" prop="nationality">
        <el-select
          filterable
          style="width: 100%"
          v-model="form.nationality"
          :placeholder="$t('consult.请选择')"
        >
          <div v-for="(i, k) in countryList" :key="i.value">
            <el-option :key="i.value" :label="i.name" :value="i.name">
            </el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.省')" prop="state">
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
      <el-form-item :label="$t('consult.市')" prop="city">
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
      <el-form-item :label="$t('consult.地址第一行')" prop="address">
        <el-input
          v-model="form.address"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.地址第二行')" prop="addressIi">
        <el-input
          v-model="form.addressIi"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.母语')" prop="language">
        <el-select
          filterable
          style="width: 100%"
          v-model="form.language"
          :placeholder="$t('consult.请选择')"
        >
          <div v-for="(i, k) in languageList" :key="i.code">
            <el-option :key="i.code" :label="i.name" :value="i.code">
            </el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.第二语言')" prop="secondLanguage">
        <el-select
          filterable
          style="width: 100%"
          v-model="form.secondLanguage"
          :placeholder="$t('consult.请选择')"
        >
          <div v-for="(i, k) in languageList" :key="i.code">
            <el-option :key="i.code" :label="i.name" :value="i.code">
            </el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.第三语言')" prop="thirdLanguage">
        <el-select
          filterable
          style="width: 100%"
          v-model="form.thirdLanguage"
          :placeholder="$t('consult.请选择')"
        >
          <div v-for="(i, k) in languageList" :key="i.code">
            <el-option :key="i.code" :label="i.name" :value="i.code">
            </el-option>
          </div>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { upOuterFile } from "@/api/upload/index.js";
import countryList from "country-list";
import { getLanguageList, formatChinaArea } from "@/util/jsondata.js";
export default {
  props: {
    relationTypeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 国籍
      countryList: countryList.getData(),
      // 语言
      languageList: getLanguageList(),
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
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        jobTitle: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
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
        addressIi: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
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
  },
};
</script>

<style lang="scss" scoped></style>
