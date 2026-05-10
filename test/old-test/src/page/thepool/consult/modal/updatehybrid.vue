<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.批量新增')"
      :visible.sync="showUpdate"
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
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <div
      class="batchupload"
      @click="innerVisible = true"
      style="margin-bottom: 20px"
    >
      <div class="el-upload">
        <div class="df_sb el-upload-dragger">
          <img src="/svg/other/xiazai.svg" alt="" />
          <div class="batchupload_text">
            <div class="batchupload_title">填写导入信息</div>
            <div class="batchupload_prompt">
              请按照模板格式准备导入数据，模板中的表头名称不可更改，表头行不能删除。
            </div>
            <div class="batchupload_btn">下载模板</div>
          </div>
        </div>
      </div>
    </div> -->
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
                    <div class="batchupload_btn" @click.stop="downloadTemplate">
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
import { importHybridList, downloadHybridTemplate } from "@/api/consult/index.js";
import { download } from "@/util/download.js";
export default {
  props: {
    showUpdate: {
      require: true,
      type: Boolean,
    },
    canDownload: {
      require: false,
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
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        file: [{ required: true, message: that.$t("consult.请上传"), trigger: "blur" }],
      },
      fileList: [],
      fileName: "",
      submitting: false,
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
      downloadHybridTemplate(data).then((res) => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 导入用户
    importList(data) {
      importHybridList(data)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            this.$emit("showErrList", res.data.data);
            this.$emit("initData");
          }
          // this.$message.success(this.$t("consult.成功"));
          // this.$emit("initData");
          // if (res.status == 200) {
          //   this.$message.success(this.$t("consult.成功"));
          //   this.$emit("initData");
          // }
          //    else {
          //     if (res.data.code == "601") {
          //       this.$emit("showErrorData", res.data.data);
          //       this.$emit("initData");
          //     } else {
          //       this.$message.error(this.$t("consult.失败"));
          //       this.$emit("initData");
          //     }
          //   }
        })
        .catch((error) => {
          // 处理错误情况
          console.error("Import error:", error);
        })
        .finally(() => {
          // 无论成功或失败，都重置提交状态
          setTimeout(() => {
            this.submitting = false;
          }, 500);
        });
      // .catch(error => {
      //   if (error.response.status === 600) {
      //     download(
      //       error.response.data,
      //       error.response.headers["content-disposition"]
      //     );
      //     this.$message.warning(
      //       "数据填写有误！请根据下载的错误说明，修改文件后重新上传"
      //     );
      //   }
      // });
    },
    submitForm(formName) {
      // 防止重复提交
      if (this.submitting) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置提交中状态
          this.submitting = true;
          let data = new FormData();
          data.append("applySchool", String(this.from.applySchool));
          data.append("file", this.from.file);
          this.importList(data);
        } else {
          return false;
        }
      });
    },
    beforeUpload(file) {
      let name = file.name.split(".");
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
    },
    closeModal() {
      this.submitting = false;
      this.$emit("closeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.modalFromBtn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
