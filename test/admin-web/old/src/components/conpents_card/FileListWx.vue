<template>
  <div class="filebox df_aw">
    <div class="fileboxitem" v-for="(item, index) in filelistobj" :key="index">
      <div class="playfilebox">
        <i
          class="el-icon-zoom-in"
          @click="showimg(item['img'])"
          v-if="item['isimg']"
        ></i>
        <i
          class="el-icon-download"
          @click="downloadFile(item.id, item.name)"
        ></i>
        <i
          v-if="!isDisabled"
          class="el-icon-delete"
          @click="deleteFiles({ id: item.id }, index)"
        ></i>
      </div>
      <img :src="item['img']" :alt="item.name" />
      <el-tooltip :content="item.name" effect="dark" placement="bottom">
        <span class="tips">{{ item.name }}</span>
      </el-tooltip>
    </div>
    <el-upload
      v-if="!isDisabled && filelistobj.length < 9"
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :top="'10vh'"
      width="30%"
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { download } from "@/util/download.js";
import {
  getCardFileDetail,
  uploadCardFile,
  uploadBatchCardFile,
  getCarListInfo,
} from "@/api/card/file/index.js";
export default {
  name: "UniUiFilelist",
  props: {
    isShowOne: Boolean,
    isDisabled: Boolean,
    fileData: Object,
    isAddContacter: Boolean,
  },
  data() {
    return {
      filelist: [],
      filelistobj: [],
      currentfile: "",
      dialogImageUrl: "",
      dialogVisible: false,
      fileArr: [],
      currentfileimg: "",
    };
  },

  mounted() {},
  methods: {
    clearData() {
      console.log("clear");
      this.filelist = [];
      this.filelistobj = [];
      this.currentfile = "";
      this.dialogImageUrl = "";
      this.fileArr = [];
      this.currentfileimg = "";
    },
    uploadCardFile(data, name) {
      uploadCardFile(data).then((res) => {
        this.$message.success("上传成功");
        this.filelist.push(res.data.data);
        this.setfilelist();
        this.setfilename(name, res.data.data);
      });
    },
    deleteFiles(data, index) {
      this.$message.success("已删除");
      this.filelistobj.splice(index, 1);
      this.filelist.splice(index, 1);
      this.setfilelist();
      if (this.isAddContacter) {
        this.fileArr.splice(index, 1);
      }
    },
    downloadFile(id, name) {
      getCardFileDetail(id, this.fileData).then((res) => {
        // this.$message.success("下载");
        download(res.data, name);
      });
    },
    getCarListInfo(data) {
      console.log("666data", data);
      // debugger
      getCarListInfo(data).then((res) => {
        console.log("res333", res);
        // return;
        let data = res.data.data;
        this.filelist = [];
        this.filelistobj = [];
        data.map((item, index) => {
          this.filelist.push(item.id);
          let obj = {};
          let originalName = item["originalName"].split(".");
          let type = originalName[originalName.length - 1];
          obj = {
            type,
            name: item["originalName"],
            id: item.id,
          };
          if (
            type === "jpeg" ||
            type === "png" ||
            type === "jpg" ||
            type === "JEPG" ||
            type === "PNG" ||
            type === "JPG"
          ) {
            obj["img"] = "";
            obj["isimg"] = true;
            this.filelistobj.push(obj);
            getCardFileDetail(item.id, this.fileData).then((res) => {
              let blob = new Blob([res.data]); // 返回的文件流数据
              let url = window.URL.createObjectURL(blob); // 将他转化为路径
              console.log("url", url);
              this.filelistobj[index]["img"] = url;
            });
          } else {
            // obj["img"] = `/menu_icon/fileimg/${type}.png`;
            obj["img"] = `/menu_icon/fileimg/default.png`;
            obj["isimg"] = false;
            this.filelistobj.push(obj);
          }
        });
      });
    },
    getFileInfo(id) {
      getFileInfo(id).then((info) => {
        console.log("info", info);
        this.filelistobj = [];
        let obj = {
          img: "",
          isimg: true,
          name: info.data.data.originalName,
        };
        getCardFileDetail(id).then((res) => {
          console.log("res66", res);

          let blob = new Blob([res.data]); // 返回的文件流数据
          let url = window.URL.createObjectURL(blob); // 将他转化为路径
          console.log("url", url);
          obj["img"] = url;
          console.log("obj", obj);
          this.filelistobj.push(obj);
        });
      });
    },
    getFiles(id) {
      getFiles(id).then((res) => {
        console.log("res", res);
      });
    },
    setfilename(name, id) {
      console.log("name", name);
      let fileName = name.split(".");
      let type = fileName[fileName.length - 1];
      let obj = {
        name,
        type,
        id,
      };
      if (
        type === "jpeg" ||
        type === "png" ||
        type === "jpg" ||
        type === "JEPG" ||
        type === "PNG" ||
        type === "JPG"
      ) {
        obj["img"] = this.currentfileimg;
        obj["isimg"] = true;
      } else {
        obj["img"] = `/menu_icon/fileimg/${type}.png`;
        obj["isimg"] = false;
      }
      this.filelistobj.push(obj);
    },
    showimg(img) {
      this.dialogImageUrl = img;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      const filetype = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const name = file.name;
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        this.$message.warning("只能上传图片格式");
        return;
      }
      this.getBase64(file).then((res) => {
        this.currentfileimg = res;
        if (
          this.$route.path == "/card/cloud/contacter/index" &&
          this.isAddContacter
        ) {
          this.fileArr.push(file);
          this.setfilename(name, "");
        } else {
          let obj = new FormData();
          obj.append("file", file);
          Object.keys(this.fileData).forEach((res) => {
            obj.append(res, this.fileData[res]);
          });
          this.uploadCardFile(obj, name);
        }
      });
    },
    setfilelist() {
      this.$emit("setfilelist", this.filelist);
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.avatar-uploader-icon {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
  margin: 0 auto;
}
.fileboxitem {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-bottom: 25px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  &:hover {
    .playfilebox {
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: #175E67;
    text-align: center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: -25px;
    padding: 5px;
  }
  .playfilebox {
    display: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #000000;
    color: #fff;
    font-size: 18px;
    opacity: 0.4;
    border-radius: 6px;
    i {
      padding: 5px;
      box-sizing: border-box;
    }
  }
}
</style>