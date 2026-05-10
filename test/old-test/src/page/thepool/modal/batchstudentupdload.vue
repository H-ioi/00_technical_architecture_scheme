<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.批量新增')"
      :visible.sync="showUpload"
      width="650px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <el-form
        ref="from"
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="rules"
      >
        <div>
          <el-form-item :label="$t('consult.校区')" prop="applySchool" style="width: 60%">
            <el-select
              style="width: 100%"
              clearable
              v-model="from.applySchool"
              :placeholder="$t('consult.请选择')"
            >
              <el-option
                v-for="item in pooldictpermissions"
                :key="item.value"
                :label="i18nlocel == 'en' ? item.enLabel : item.label"
                :value="item.value"
                :disabled="!item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('consult.状态')" prop="status" style="width: 60%">
            <el-select
              style="width: 100%"
              clearable
              v-model="from.status"
              :placeholder="$t('consult.请选择')"
            >
              <el-option
                v-for="item in enrolledStatus"
                :key="item.value"
                :label="$t('consult')[item.label]"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('consult.模板')" prop="file" style="width: 100%">
            <el-upload
              class="upload-demo batchupload"
              drag
              accept=".xlsx,.xls"
              action=""
              :before-upload="beforeUpload"
            >
              <div class="df_sb">
                <img src="/svg/other/shangchuan.svg" alt="" />
                <div class="batchupload_text">
                  <div class="batchupload_title">{{ $t("consult.上传填好的模板") }}</div>
                  <div class="batchupload_prompt">
                    {{ $t("consult.文件只支持上传Excel文件格式，且不能超过10MB") }}
                  </div>
                  <div class="batchupload_btn_box">
                    <div
                      class="batchupload_btn"
                      v-if="permissions['thepool_user_student_downloadtemplate']"
                      @click.stop="downloadTemplate"
                    >
                      {{ $t("consult.下载模板") }}
                    </div>
                    <div class="batchupload_btn">{{ $t("consult.点击上传") }}</div>
                  </div>
                  <div class="batchupload_prompt">{{ fileName }}</div>
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" round @click="submitForm('from')">{{
              $t("consult.保存")
            }}</el-button>
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { downloadStudentTemplate } from "@/api/consult/student.js";
import { download } from "@/util/download.js";
import { consult } from "@/const/consult/index.js";
export default {
  props: {
    showUpload: {
      require: true,
      type: Boolean,
    },
  },
  data() {
    let that = this;
    return {
      innerVisible: false,
      downloading: false,
      enrolledStatus: consult["enrolledStatus"],
      from: { applySchool: "", status: "", file: "" },
      rules: {
        file: [{ required: true, message: that.$t("consult.请上传"), trigger: "blur" }],
        applySchool: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        status: [{ required: true, message: that.$t("consult.请选择"), trigger: "blur" }],
      },
      fileList: [],
      fileName: "",
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictpermissions",
    ]),
  },
  created() {
    this.$nextTick(() => {
      if (this.pooldictpermissions.length == 1) {
        this.from["applySchool"] = this.pooldictpermissions[0].value;
      }
    });
  },
  methods: {
    submitForm(formName) {
      console.log("submitForm", this.from);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new FormData();
          data.append("file", this.from.file);
          data.append("applySchool", this.from.applySchool);
          data.append("status", this.from.status);
          console.log("submitForm", data);
          this.$emit("importList", data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 下载模板
    downloadTemplate() {
      if (!this.from.applySchool) {
        this.$message.error(
          this.$t("consult.请选择") +
            (this.i18nlocel == "en" ? "\n" : "") +
            this.$t("consult.校区")
        );
        return;
      }
      let data = { applySchool: this.from.applySchool };
      downloadStudentTemplate(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    beforeUpload(file) {
      console.log("beforeUpload", file);
      let name = file.name.split(".");
      console.log("beforeUpload", name);
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (name[name.length - 1] !== "xls" && name[name.length - 1] !== "xlsx") {
        this.$message.warning("文件上传只能是 xls、xlsx 格式!");
        return;
      }
      if (!isLt10M) {
        this.$message.warning("文件上传不能超过10M!");
        return;
      }
      this.fileName = file.name;
      this.from.file = file;
      console.log("beforeUpload", this.from);
    },
    closeModal() {
      this.from = { applySchool: "", file: "" };
      this.$emit("closeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.modalFromBtn {
  // width: 100%;
  margin-bottom: 0 !important;
  .el-form-item__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.batchupload_btn_box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .batchupload_btn {
    margin-right: 30px;
  }
}
</style>
