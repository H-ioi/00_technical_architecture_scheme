<template>
  <el-dialog
    title="批量新增"
    :visible.sync="showUpdate"
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
      <div>
        <el-form-item
          :label="$t('consult.校区')"
          prop="applySchool"
          style="width: 100%"
        >
          <el-select
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
        <el-form-item
          :label="$t('consult.模板')"
          prop="file"
          style="width: 100%"
        >
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
                <div class="batchupload_title">上传填好的模板</div>
                <div class="batchupload_prompt">
                  文件后缀名必须为Excel格式，文件大小不得大于10M
                </div>
                <div class="batchupload_btn">点击上传</div>
                <div class="batchupload_prompt">{{ fileName }}</div>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item class="modalFromBtn">
          <el-button type="primary" size="medium" @click="submitForm('from')">{{
            $t("consult.保存")
          }}</el-button>
          <el-button type="default" size="medium" @click="closeModal">{{
            $t("consult.取消")
          }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { importList } from "@/api/consult/index.js";
import { download } from "@/util/download.js";
export default {
  props: {
    showUpdate: {
      require: true,
      type: Boolean
    }
  },
  data() {
    return {
      innerVisible: false,
      downloading: false,
      from: { applySchool: "", file: "" },
      rules: {
        applySchool: [{ required: true, message: "请选择", trigger: "blur" }],
        file: [{ required: true, message: "请上传", trigger: "blur" }]
      },
      fileList: [],
      fileName: ""
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictpermissions"
    ])
  },
  methods: {
    // 导入用户
    importList(applySchool, data) {
      importList(applySchool, data).then(res => {
        console.log("res", res);
        this.$message.success(this.$t("consult.成功"));
        this.$emit("initData");
      });
    },
    submitForm(formName) {
      console.log("submitForm", this.from);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = new FormData();
          // data.append("applySchool ", this.from.applySchool);
          data.append("file", this.from.file);
          console.log("submitForm", data);
          this.importList(this.from.applySchool, data);
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
      if (name[name.length-1] !== "xls" && name[name.length-1] !== "xlsx") {
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
      this.$emit("closeModal", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.modalFromBtn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
