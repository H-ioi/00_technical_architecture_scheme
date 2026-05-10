<template>
  <el-dialog
    :title="$t('isagroup.批量新增')"
    :visible.sync="showUpload"
    width="650px"
    :before-close="closeModal"
    :close-on-click-modal="false"
  >
    <el-form
      ref="from"
      class="df_align_center"
      :label-position="'top'"
      :inline="true"
      :model="from"
      :rules="rules"
    >
      <div class="moadlFromBox">
        <el-form-item :label="$t('isagroup.模板')" prop="file" style="width: 100%">
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
                <div class="batchupload_title">{{ $t("isagroup.上传填好的模板") }}</div>
                <div class="batchupload_prompt">
                  {{ $t("isagroup.文件上传只能是 xls、xlsx 格式!") }}
                  {{ $t("isagroup.文件上传不能超过10M!") }}
                </div>
                <div class="batchupload_btn_box">
                  <div
                    class="batchupload_btn"
                    v-if="permissions['busline_download']"
                    @click.stop="downloadTemplate"
                  >
                    {{ $t("consult.下载模板") }}
                  </div>
                  <div class="batchupload_btn">{{ $t("isagroup.点击上传") }}</div>
                </div>
                <div class="batchupload_prompt">{{ fileName }}</div>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item class="modalFromBtn">
          <el-button type="primary" size="medium" @click="submitForm('from')">{{
            $t("isagroup.提交")
          }}</el-button>
          <el-button type="default" size="medium" @click="closeModal">{{
            $t("isagroup.取消")
          }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { importRoute, downloadRouteTemplate } from "@/api/isacommunity/route.js";
import { download } from "@/util/download.js";
export default {
  props: {},
  data() {
    let that = this;
    return {
      showUpload: false,
      downloading: false,
      from: { file: "" },
      rules: {
        file: [{ required: true, message: that.$t("isagroup.请上传"), trigger: "blur" }],
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
  created() {},
  methods: {
    submitForm(formName) {
      console.log("submitForm", this.from);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new FormData();
          data.append("file", this.from.file);
          this.importData(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 上传填好的模板
    importData(data) {
      importRoute(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 下载模板
    downloadTemplate() {
      downloadRouteTemplate().then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("isagroup.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    beforeUpload(file) {
      console.log("beforeUpload", file);
      let name = file.name.split(".");
      console.log("beforeUpload", name);
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (name[name.length - 1] !== "xls" && name[name.length - 1] !== "xlsx") {
        this.$message.warning(this.$t("isagroup.文件上传只能是 xls、xlsx 格式!"));
        return;
      }
      if (!isLt10M) {
        this.$message.warning(this.$t("isagroup.文件上传不能超过10M!"));
        return;
      }
      this.fileName = file.name;
      this.from.file = file;
      console.log("beforeUpload", this.from);
    },
    closeModal() {
      this.fileList = [];
      this.fileName = "";
      this.from = { file: "" };
      this.showUpload = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.batchupload_btn_box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .batchupload_btn {
    margin-right: 30px;
  }
}
</style>
