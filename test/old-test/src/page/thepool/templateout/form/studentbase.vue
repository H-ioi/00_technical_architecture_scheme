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
      <el-form-item :label="$t('consult.证件照(非白底)')" prop="otherPhotoId">
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
      <el-form-item :label="$t('consult.身份证/护照号')" prop="identityCard">
        <el-input
          v-model="form.identityCard"
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

      <el-form-item :label="$t('consult.英文姓名')" prop="studentNameEn">
        <el-input
          v-model="form.studentNameEn"
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
      <el-form-item :label="$t('consult.在读学校')" prop="atSchool">
        <el-input
          v-model="form.atSchool"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('consult.入学年份')" prop="enrollYear">
        <el-date-picker
          type="year"
          placeholder="选择日期"
          v-model="form.enrollYear"
          style="width: 100%"
          value-format="yyyy"
          format="yyyy"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('consult.入学年级')" prop="enrollLevel">
        <el-select
          style="width: 100%"
          v-model="form.enrollLevel"
          :placeholder="$t('consult.请选择')"
        >
          <div v-for="(i, k) in enrollLevelList" :key="i.value">
            <el-option :key="i.value" :label="i.label" :value="i.value">
            </el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.国籍')" prop="nationality">
        <el-select
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
      <el-form-item :label="$t('consult.详细地址')" prop="address">
        <el-input
          v-model="form.address"
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
    enrollLevelList: {
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
      },
      rules: {
        lastName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        firstName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        studentNameEn: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
        ],
        otherName: [
          { required: true, message: "请输入/Please input", trigger: "blur" },
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
          { required: true, message: "请输入/Please input", trigger: "blur" },
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
  },
};
</script>

<style lang="scss" scoped></style>
