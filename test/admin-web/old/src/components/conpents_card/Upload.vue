<template>
  <el-dialog
    :center="true"
    title="批量导入联系人"
    :visible.sync="dialogVisible"
    :before-close="changeModal"
    :close-on-click-modal="false"
  >
    <div class="df_center">
      <el-upload
        action=""
        class="upload-demo"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        multiple
        :limit="10"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <div class="df_dc" v-if="fileList.length == 0">
          <el-button style="width: 100%" size="small" type="primary"
            ><i class="el-icon-upload2"></i>点击上传</el-button
          >
          <el-button
            @click.stop="downtemplate"
            size="small"
            type="text"
            class="tiptext downtemplate"
            ><u>Excel模板下载</u></el-button
          >
        </div>
        <div v-else>
          <el-button slot="trigger" size="small" type="primary"
            ><i class="el-icon-upload2"></i>重新上传</el-button
          >

          <el-button size="small" type="primary" @click.stop="importPerson"
            ><i class="el-icon-circle-check"></i>导入数据</el-button
          >
        </div>

        <div slot="tip" class="el-upload__tip">
          <div v-if="fileList.length == 0">
            <p class="tiptext">温馨提示：</p>
            <p class="tiptext">1、请使用系统提供模板进行填写后上传;</p>
            <p class="tiptext">2、文件大小不能超过5M,不超过100条;</p>
          </div>
          <div v-else>
            <!-- <p class="tiptext">上传成功，共识别到x条正确数据</p> -->
          </div>
        </div>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
import {
  getPersonDownload,
  importPerson,
} from "@/api/card/organization/person.js";
import { download } from "@/util/download.js";
export default {
  name: "UniUiUpload",
  props: {
    dialogVisible: Boolean,
  },
  data() {
    return {
      fileList: [],
      fileData: [],
    };
  },

  mounted() {},

  methods: {
    getPersonDownload() {
      getPersonDownload().then((res) => {
        console.log("res", res);
        let index = res.headers["content-disposition"].indexOf("=");
        let name = decodeURIComponent(
          res.headers["content-disposition"].substring(index + 1)
        );
        console.log("name", name);
        download(res.data, name);
      });
    },
    importPerson() {
      let data = new FormData();
      data.append("file", this.fileData[0]);
      importPerson(data).then((res) => {
        console.log("res", res);
        this.$message.success("导入成功");
        this.changeModal();
        this.clear();
        this.$emit("filterlist");
      });
    },
    clear() {
      this.fileList = [];
      this.fileData = [];
    },
    beforeUpload(file) {
      console.log("beforeUpload", file);
      this.fileList = [];
      let name = file.name.split(".");
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (name[1] !== "xls" && name[1] !== "xlsx") {
        this.$message.warning("文件上传只能是 xls、xlsx 格式!");
        return;
      }
      if (!isLt5M) {
        this.$message.warning("文件上传不能超过5M!");
        return;
      }
      let obj = {
        name: file.name,
        url: "",
      };
      this.fileList.push(obj);
      this.fileData[0] = file;
    },
    handleRemove(file, fileList) {
      console.log("Remove", file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log("Preview", file);
    },
    handleExceed(files, fileList) {
      console.log("handleExceed", file, fileList);
      this.$message.warning(
        `当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    downtemplate() {
      console.log("下载模板");
      this.getPersonDownload();
    },
    changeModal() {
      this.$emit("changeModal", false);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-upload {
  width: 100%;
}
.tiptext {
  color: #999999;
}
.downtemplate {
  &:active {
    font-weight: 600;
  }
}
</style>