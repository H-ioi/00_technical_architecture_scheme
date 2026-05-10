<template>
  <div>
    <!-- <i
      @click="showImgMax"
      type="primary"
      style="font-size: 26px;color: #175E67;"
      class="el-icon-picture-outline"
    ></i> -->
    <el-image
      lazy
      style="width: 26px; height: 26px;margin-right: 5px;"
      :src="firstUrl"
      :preview-src-list="imgSrcList"
      @error="loadError"
    >
      <div slot="error" class="image-slot">
        <i
          type="primary"
          style="font-size: 26px;color: #175E67;"
          class="el-icon-picture-outline"
        ></i>
      </div>
    </el-image>
    <el-dialog
      :visible.sync="dialogVisible"
      :top="'10vh'"
      width="50%"
      title="图片"
    >
      <img width="100%" :src="imgSrcList[0]" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
import { downloadFile } from "@/api/upload/index.js";
export default {
  name: "PCOrderTable",
  props: {
    imgItem: {
      type: Object,
      require: true
    },
    rowIndex: Number
  },
  data() {
    return {
      dialogVisible: false,
      firstUrl: "",
      imgSrcList: []
    };
  },
  created() {},
  mounted() {
    this.getImgMin();
    this.getImgMax();
  },

  methods: {
    showImg() {},
    loadError(e) {
      // console.log("loadError", e);
      // this.getImgMin();
      // this.getImgMax();
    },
    getImgMin() {
      downloadFile(this.imgItem["min"], {
        scene: "asset_sync_file_uni",
        rowIndex: this.rowIndex
      }).then(res => {
        let blob = new Blob([res.data]); // 返回的文件流数据
        this.firstUrl = window.URL.createObjectURL(blob); // 将他转化为路径
      });
    },
    getImgMax() {
      downloadFile(this.imgItem["max"], {
        scene: "asset_sync_file_uni",
        rowIndex: this.rowIndex
      }).then(res => {
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径
        this.imgSrcList = [url];
      });
    },
    showImgMax() {
      downloadFile(this.imgItem["max"], {
        scene: "asset_sync_file_uni",
        rowIndex: this.rowIndex
      }).then(res => {
        this.dialogVisible = true;
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径
        this.imgSrcList = [url];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.isEnable {
  font-size: 14px;
  padding: 4px 10px;
  box-sizing: border-box;
  color: #447777;
  background: rgba(23, 103, 103, 0.15);
}

.isDisable {
  font-size: 14px;
  padding: 4px 10px;
  box-sizing: border-box;
  color: #666666;
  background: rgba(153, 153, 153, 0.15);
}

.tableColumnSpan {
  display: inline-block;
  width: 100%;
  height: 54px;
  line-height: 54px;
}
</style>
