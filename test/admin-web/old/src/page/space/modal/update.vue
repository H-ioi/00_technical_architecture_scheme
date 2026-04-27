<template>
  <el-dialog
    title="批量新增"
    :visible.sync="showUpdate"
    width="650px"
    :before-close="closeModal"
  >
    <div
      class="batchupload"
      @click="innerVisible = true"
      style="margin-bottom: 20px"
    >
      <div class="el-upload">
        <div class="df_sb el-upload-dragger">
          <!-- <i class="el-icon-upload"></i> -->
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
    </div>
    <el-upload
      class="upload-demo batchupload"
      drag
      accept=".xlsx,.xls"
      action=""
      :before-upload="beforeUpload"
    >
      <div class="df_sb">
        <!-- <i class="el-icon-upload"></i> -->
        <img src="/svg/other/shangchuan.svg" alt="" />
        <div class="batchupload_text">
          <div class="batchupload_title">上传填好的模板</div>
          <div class="batchupload_prompt">
            文件后缀名必须为Excel格式，文件大小不得大于10M
          </div>
          <div class="batchupload_btn">点击上传</div>
        </div>
      </div>
      <!-- <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div> -->
    </el-upload>
    <!-- <span slot="footer" class="modalFromBtn">
      <el-button size="medium" @click="closeModal">取 消</el-button>
      <el-button type="primary" size="medium" @click="closeModal"
        >确 定</el-button
      >
    </span> -->
    <el-dialog
      width="30%"
      title="请先选择空间类型"
      :visible.sync="innerVisible"
      append-to-body
      :before-close="closeInnerVisible"
    >
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="fromrules"
        ref="from"
      >
        <el-form-item label="空间类型" prop="type" style="width: 100%">
          <el-select
            style="width: 100%"
            clearable
            multiple
            v-model="from.type"
            placeholder="请选择"
          >
            <el-option
              :key="k"
              v-for="(i, k) in spaceType"
              :label="i.name"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeInnerVisible">取 消</el-button>
        <el-button type="primary" @click="handleOk" :loading="downloading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  downloadSpaceTemplate,
  importSpaceTemplate,
} from "@/api/space/spacelist.js";
import { getAllSpaceType } from "@/api/space/spacetype.js";
import { download } from "@/util/download.js";
export default {
  props: {
    spaceId: String,
    showUpdate: {
      require: true,
      type: Boolean,
    },
  },
  data() {
    return {
      innerVisible: false,
      downloading: false,
      spaceType: [],
      from: {},
      fromrules: {
        type: [{ required: false, message: "请选择", trigger: "blur" }],
      },
    };
  },
  methods: {
    downloadSpaceTemplate(data) {
      let _this = this;
      this.downloading = true;
      downloadSpaceTemplate(data)
        .then((res) => {
          console.log("res", res);
          this.downloading = false;
          if (res.status == 500) {
            console.log("res.status", res.status);
            let reader = new FileReader();
            reader.onload = function (e) {
              let readerres = reader.result;
              let msg = JSON.parse(readerres);
              _this.$message.warning(msg.msg);
            };
            reader.readAsText(res.data, "utf-8");
          } else {
            download(res.data, res.headers["content-disposition"]);
          }
        })
        .catch(() => {
          this.downloading = false;
        });
    },
    importSpaceTemplate(data) {
      importSpaceTemplate(data)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            this.$message.success("新增成功");
            this.$emit("initData");
            this.closeModal();
          } else {
            this.$message.warning("出错了，请重新上传");
          }
        })
        .catch((error) => {
          console.log("error", error.response);
          if (error.response.status === 600) {
            download(
              error.response.data,
              error.response.headers["content-disposition"]
            );
            this.$message.warning(
              "数据填写有误！请根据下载的错误说明，修改文件后重新上传"
            );
          }
        });
    },
    getAllSpaceType() {
      getAllSpaceType(this.spaceId).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.spaceType = data.filter((item) => {
            return item.status;
          });
        }
      });
    },
    beforeUpload(file) {
      console.log("beforeUpload", file);
      let name = file.name.split(".");
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (name[1] !== "xls" && name[1] !== "xlsx") {
        this.$message.warning("文件上传只能是 xls、xlsx 格式!");
        return;
      }
      if (!isLt10M) {
        this.$message.warning("文件上传不能超过10M!");
        return;
      }
      let obj = new FormData();
      obj.append("pid", this.spaceId);
      obj.append("file", file);
      this.importSpaceTemplate(obj);
    },
    handleOk() {
      this.$refs["from"].validate((valid) => {
        if (valid) {
          console.log("from", this.from);
          let obj = {
            pid: this.spaceId,
            typeIds: this.from.type,
          };
          this.downloadSpaceTemplate(obj);
        } else {
          return false;
        }
      });
    },
    closeInnerVisible() {
      this.innerVisible = false;
      this.from = {};
    },
    closeModal() {
      this.$emit("closeModal", false);
    },
  },
};
</script>
 
<style lang = "scss" scoped>
</style>