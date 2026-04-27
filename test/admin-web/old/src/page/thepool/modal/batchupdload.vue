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
          <!-- <el-form-item
          :label="$t('consult.校区')"
          prop="applySchool"
          style="width: 50%"
        >
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
        </el-form-item> -->
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
                  <div class="batchupload_btn">{{ $t("consult.点击上传") }}</div>
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
import { importList } from "@/api/consult/index.js";
import { download } from "@/util/download.js";
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
      from: { applySchool: "", file: "" },
      rules: {
        applySchool: [
          { required: false, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        file: [{ required: true, message: "请上传", trigger: "blur" }],
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
  methods: {
    submitForm(formName) {
      console.log("submitForm", this.from);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new FormData();
          data.append("file", this.from.file);
          console.log("submitForm", data);
          this.$emit("importList", data);
        } else {
          console.log("error submit!!");
          return false;
        }
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
</style>
