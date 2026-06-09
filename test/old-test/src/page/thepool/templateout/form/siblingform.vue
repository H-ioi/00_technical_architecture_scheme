<template>
  <div>
    <el-form label-position="top" ref="form" :model="form" :rules="rules">
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
            $t('consult.请用中文拼音录入，首字母为大写，如：彭，请输入Peng')
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
      <el-form-item :label="$t('consult.性别')" prop="sex">
        <el-select
          style="width: 100%"
          v-model="form.sex"
          :placeholder="$t('consult.请选择')"
        >
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('consult.在读学校')" prop="atSchool">
        <el-input
          v-model="form.atSchool"
          :placeholder="$t('consult.请输入')"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        lastName: "",
        firstName: "",
        otherName: "",
        sex: "",
        atSchool: "",
      },
      rules: {
        lastName: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        firstName: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        otherName: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
        sex: [
          {
            required: false,
            message: "请选择/Please select",
            trigger: "change",
          },
        ],
        atSchool: [
          { required: false, message: "请输入/Please input", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetForm(data) {
      this.form = {
        ...this.form,
        ...data,
      };
    },
    onSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 如果this.form里面值均为空则返回null
            if (
              Object.values(this.form).every((value) => value.trim() === "")
            ) {
              resolve({
                status: false,
                data: null,
              });
              return;
            } else {
              resolve({
                status: true,
                data: this.form,
              });
            }
            console.log("提交兄弟姐妹表单数据:", this.form);
          } else {
            resolve({
              status: false,
              data: {},
            });
          }
        });
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
</style>
