<template>
  <div class="filebox df_aw">
    <div class="fileboxitem" v-for="(item, index) in filelistobj" :key="index">
      <div class="playfilebox">
        <i
          class="el-icon-zoom-in"
          @click="showFile(item)"
          v-if="setFileType(item) == 'isImg' || setFileType(item) == 'isVideo'"
        ></i>
        <i class="el-icon-download" @click="downloadCurrentFile(item)"></i>
        <i
          v-if="!isDisabled"
          class="el-icon-delete"
          @click="deleteFiles({ ids: [item.id] }, index)"
        ></i>
      </div>
      <img :ref="`IMG_${item.id}`" :src="setFileImg(item)" alt="" />
      <el-tooltip :content="item.name" effect="dark" placement="bottom">
        <span class="tips">{{ item.name }}</span>
      </el-tooltip>
    </div>
    <el-upload
      v-if="!isDisabled && filelistobj.length < 100"
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
      :title="currentFile.name"
    >
      <img
        v-if="setFileType(currentFile) == 'isImg'"
        width="100%"
        :src="currentFile.url"
        alt=""
      />
      <video
        v-if="setFileType(currentFile) == 'isVideo'"
        :src="currentFile.url"
        width="100%"
        autoplay
        controls
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import { download } from "@/util/download.js";
import {
  downloadFile,
  uploadFile,
  uploadFiles,
  deleteFile
} from "@/api/workorder/upload/index.js";
export default {
  name: "UniUiFilelist",
  props: {
    scene: String,
    isDisabled: Boolean
  },
  data() {
    return {
      defaultImg: "/img/other/default.png",
      filelist: [],
      filelistobj: [],
      currentFile: "",
      dialogImageUrl: "",
      dialogVisible: false,
      imgType: [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "webp",
        "psd",
        "svg",
        "tiff"
      ]
    };
  },

  mounted() {},

  methods: {
    clearData() {
      this.filelist = [];
      this.filelistobj = [];
      this.currentFile = "";
      this.currentfileimg = "";
      this.dialogImageUrl = "";
    },
    getFile(id, data) {
      downloadFile(id, data).then(res => {
        console.log("downloadFile", res);
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径

        this.filelistobj.map((i, k) => {
          console.log("lll", i, data);
          if (i.id == id) {
            this.$set(this.filelistobj, k, {
              ...this.filelistobj[k],
              file: res.data,
              id,
              url
            });
          }
        });
        // this.filelistobj.push(obj);
      });
    },
    uploadfile(data, index) {
      uploadFile(data).then(res => {
        this.$message.success("上传成功");
        let id = res.data.data;
        this.filelist.push(id);
        this.$set(this.filelistobj, index, {
          ...this.filelistobj[index],
          id
        });
        console.log("filelistobj11", this.filelistobj, index);
      });
    },
    // deleteFiles(data, index) {
    //   deleteFiles(data).then((res) => {
    //     this.$message.success("已删除");
    //     this.filelistobj.splice(index, 1);
    //     this.filelist.splice(index, 1);
    //     this.setfilelist();
    //   });
    // },
    deleteFiles(data, index) {
      // this.$message.success("已删除");
      this.filelistobj.splice(index, 1);
      this.filelist.splice(index, 1);
      // this.setfilelist();
    },
    downloadCurrentFile(item) {
      var a = document.createElement("a");
      a.href = item.url;
      a.style.display = "none";
      a.setAttribute("download", item.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(item.url);
    },

    getFileList(data) {
      getFileList(data).then(res => {
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
            id: item.id
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
            downloadFile(item.id).then(res => {
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
    setfilename(name, id) {
      console.log("name", name);
      let fileName = name.split(".");
      let type = fileName[fileName.length - 1];
      let obj = {
        name,
        type,
        id
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

    async beforeAvatarUpload(file) {
      console.log("beforeAvatarUpload", file);
      const filetype = file.type === "image/jpeg";
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.warning("文件大小不能超过50M");
        return;
      }
      const name = file.name;
      let fileObj = await {
        id: "11111",
        type: file.type,
        file: file,
        name: file.name
      };
      fileObj["url"] = this.setFileUrl(file);
      console.log("fileObj", fileObj);
      this.filelistobj.push(fileObj);
      let obj = new FormData();
      obj.append("file", file);
      obj.append("scene", this.scene);
      this.uploadfile(obj, this.filelistobj.length - 1);
    },
    setfilelist() {
      this.$emit("setfilelist", this.filelist);
    },

    showFile(item) {
      this.currentFile = item;
      this.dialogVisible = true;
    },
    setFileUrl(file) {
      if (!file) return;
      let uploadUrl = window.URL.createObjectURL(file);
      return uploadUrl;
    },
    setFileType(file) {
      if (!file) return;
      let fileType = this.getFileType(file);
      if (this.isVideo(fileType)) {
        return "isVideo";
      } else if (this.isImageType(fileType)) {
        return "isImg";
      } else {
        return "isFile";
      }
    },
    // 设置文件列表展示图片
    setFileImg(file) {
      let fileType = this.getFileType(file);
      if (this.isVideo(fileType)) {
        this.getVideoBase64(file);
        return;
      } else if (this.isImageType(fileType)) {
        console.log("fileType", 222);
        return this.setFileUrl(file.file);
      } else {
        return this.defaultImg;
      }
    },
    // 获取文件类型
    getFileType(file) {
      if (!file.type) return;
      let index = file.type.indexOf("/");
      let length = file.type.split("").length;
      let fileType = file.type.substring(index + 1, length);
      return fileType;
    },
    // 是否是视频
    isVideo(fileType) {
      if (!fileType) return;
      return /(mp4|rmvb|avi|ts|mov|MOV|quicktime)$/.test(fileType);
    },
    // 是否是图片
    isImageType(fileType) {
      // toLowerCase() 将字符串转换为小写，返回一个新的字符串
      if (!fileType) return;
      return this.imgType.indexOf(fileType.toLowerCase()) !== -1;
    },
    getVideoBase64(file) {
      if (file.file == "") return;
      let url = this.setFileUrl(file.file);
      let dataURL = "";
      let video = document.createElement("video");
      video.setAttribute("crossOrigin", "anonymous"); //处理跨域
      video.setAttribute("src", url);
      video.setAttribute("width", 640);
      video.setAttribute("height", 640);
      video.pause();
      video.currentTime = 1;
      video.pause();
      video.addEventListener("loadeddata", () => {
        video.pause();
        let canvas = document.createElement("canvas");
        let width = video.width; //canvas的尺寸和图片一样
        let height = video.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
        dataURL = canvas.toDataURL("image/jpeg"); //转换为base64
        this.$refs[`IMG_${file.id}`][0].src = dataURL;
      });
    }
  }
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
  border-radius: 6px;
  // overflow: hidden;
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
    color: #175e67;
    text-align: center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: -30px;
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
    font-size: 20px;
    opacity: 0.6;
    border-radius: 6px;
    font-weight: 500;
    i {
      padding: 5px;
      box-sizing: border-box;
    }
  }
}
</style>
