<template>
  <div class="filebox df_aw">
    <div class="fileboxitem" v-for="(item, index) in filelistobj" :key="index">
      <div class="playfilebox">
        <i
          class="el-icon-zoom-in"
          @click="showFile(item)"
          v-if="setFileType(item) == 'isImg' || setFileType(item) == 'isVideo'"
        ></i>
        <i
          class="el-icon-download"
          v-if="showDownload"
          @click="downloadCurrentFile(item)"
        ></i>
        <i
          v-if="!isDisabled"
          class="el-icon-delete"
          @click="deleteFiles({ ids: [item.id] }, index)"
        ></i>
      </div>
      <img :ref="`IMG_${item.id}`" :src="setFileImg(item)" alt="" />
      <el-tooltip
        v-if="showName"
        :content="item.name"
        effect="dark"
        placement="bottom"
      >
        <span class="tips">{{ item.name }}</span>
      </el-tooltip>
    </div>
    <div>
      <el-upload
        v-if="!isDisabled && filelistobj.length < limit"
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :accept="types"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <p class="tips_text" v-if="!isDisabled">
      文件只支持上传/jpg/png文件格式，且不能超过20MB
    </p>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :top="'10vh'"
      :title="currentFile.name"
      width="60%"
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
import { updateFile } from "@/api/consult/index.js";
import {
  downloadFile,
  uploadFile,
  getFileList,
  deleteFile,
  getFiles
} from "@/api/upload/index.js";
export default {
  name: "UniUiFilelist",
  props: {
    isDisabled: Boolean,
    scene: String,
    types: {
      type: String,
      default: "image/jpeg,image/png",
      require: false
    },
    limit: {
      type: Number,
      default: 20,
      require: false
    },
    showDownload: {
      type: Boolean,
      default: false,
      require: false
    },
    showName: {
      type: Boolean,
      default: true,
      require: false
    }
  },
  data() {
    return {
      defaultImg: "/img/other/default.png",
      filelist: [],
      filelistobj: [],
      currentFile: "",
      dialogImageUrl: "",
      dialogVisible: false,
      currentName: "",
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
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径
        this.filelistobj.map((i, k) => {
          if (i.id == id) {
            this.$set(this.filelistobj, k, {
              ...this.filelistobj[k],
              file: res.data,
              id,
              url
            });
          }
        });
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
      });
    },

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
    updateFile(outerId) {
      let obj = new FormData();
      obj.append("scene", this.scene);
      obj.append("ids", this.filelist);
      obj.append("outerId", outerId);
      updateFile(obj).then(res => {
        if (res.data.success) {
          // this.$message.success("成功");
        }
      });
    },
    getFileList(outerId) {
      let data = {
        outerId: outerId,
        scene: this.scene
      };
      getFileList(data).then(res => {
        let data = res.data.data;
        this.filelist = [];
        this.filelistobj = [];
        if (data.length > 0) {
          data.map((item, index) => {
            this.filelist.push(item.id);
            let obj = {
              id: item.id,
              type: item.contentType,
              file: "",
              name: item.originalName
            };
            this.filelistobj.push(obj);
            this.getFile(item.id, obj);
            if (data.length == 1) {
            }
          });
        } else {
          // this.$message.warning("没有可用的文件，请上传！");
        }
      });
    },
    getAllFiles(data) {
      getFiles(data).then(res => {
        let data = res.data.data;
        this.filelist = [];
        this.filelistobj = [];
        if (data.length > 0) {
          data.map((item, index) => {
            this.filelist.push(item.id);
            let obj = {
              id: item.id,
              type: item.contentType,
              file: "",
              name: item.originalName
            };
            this.filelistobj.push(obj);
            this.getFile(item.id, obj);
            if (data.length == 1) {
            }
          });
        } else {
          // this.$message.warning("没有可用的文件，请上传！");
        }
      });
    },
    openFileSaver(outerId) {
      let data = {
        outerId: outerId,
        scene: this.scene
      };
      getFileList(data).then(res => {
        let data = res.data.data;
        if (data.length > 0) {
          let obj = {
            id: data[0]["id"],
            type: data[0]["contentType"],
            file: "",
            name: data[0]["originalName"]
          };
          downloadFile(data[0]["id"], obj).then(file => {
            let blob = new Blob([file.data], { type: obj["type"] }); // 返回的文件流数据
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            window.open(url);
          });
        } else {
          this.$message.warning("没有可用的文件，请上传！");
        }
      });
    },
    setfilename(name, id) {
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
      const filetype = file.type === "image/jpeg";
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.warning("文件大小不能超过20M");
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
      this.filelistobj.push(fileObj);
      let obj = new FormData();
      obj.append("file", file);
      // obj.append("scene", this.scene);
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
      return /(mp4|rmvb|avi|ts)$/.test(fileType);
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
    },
    closeDialogVisible() {
      this.dialogVisible = false;
      this.currentFile = {};
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
  margin-bottom: 40px;
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
.tips_text {
  display: block;
  width: 100%;
  font-size: 12px;
  line-height: 28px;
  margin-top: 10px;
  text-align: left;
}
</style>
