<template>
  <div class="df_aw">
    <el-form-item
      class="headform"
      label="头像"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <div class="avatarbox">
        <el-upload
          class="avatar-uploader head"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img
            @mouseenter="changeAvatar = true"
            @mouseleave="changeAvatar = false"
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div
            @mouseenter="changeAvatar = true"
            @mouseleave="changeAvatar = false"
            class="changeAvatar df_center"
            v-show="changeAvatar"
          >
            点击替换
          </div>
        </el-upload>
        <div class="heddenavatar" v-if="isDisabled"></div>
      </div>
    </el-form-item>
    <el-form-item
      label="姓名"
      prop="name"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.name"
        placeholder="请输入姓名"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>

    <el-form-item
      label="邮箱"
      prop="email"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.email"
        placeholder="请输入邮箱"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="微信号"
      prop="wechar"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <el-input
        v-model="ruleForm.wechar"
        placeholder="请输入微信号"
        :disabled="isDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in phonearr"
      :key="index"
      label="手机号"
      :prop="index == 0 ? 'phone' : `phone${index + 1}`"
      :style="`width:${inputwidth}; padding-right: 25px`"
    >
      <div class="df_sb">
        <i
          class="el-icon-remove-outline phonicon"
          @click="removephone(index)"
          v-if="index !== 0 && !isDisabled"
        ></i
        ><el-input
          v-model="phones[index + 1]"
          placeholder="请输入手机号"
          :disabled="isDisabled"
        ></el-input>
      </div>
    </el-form-item>
    <el-form-item
      :style="`width:${inputwidth}; padding-right: 25px`"
      v-if="!isDisabled ? phonearr.length < 5 : false"
    >
      <div class="addphonebox" @click="addphone">
        <i class="el-icon-circle-plus-outline phonicon"></i><span>添加</span>
      </div>
    </el-form-item>
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
  name: "UniUiInfoBase",
  props: {
    ruleForm: Object,
    inputwidth: String,
    isDisabled: Boolean,
    avatarFileData: Object,
    isAddContacter: Boolean,
  },
  data() {
    return {
      changeAvatar: false,
      imageUrl: "",
      phonearr: [1],
      phones: {},
      currentfileimg: "",
      avatarFile: "",
    };
  },

  mounted() {},

  methods: {
    clearData() {
      this.imageUrl = "";
      this.currentfileimg = "";
      this.avatarFile = "";
    },
    addphone() {
      this.phonearr.push(this.phonearr.length + 1);
    },
    removephone(index) {
      this.phonearr.splice(index, 1);
    },
    handlePreview(e) {
      console.log("e", e);
    },
    uploadCardFile(data) {
      uploadCardFile(data).then((res) => {
        this.$message.success("上传成功");
      });
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      const filetype = file.type === "image/jpeg" || file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      const name = file.name;
      if (!filetype) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
        return;
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
        return;
      }

      if (
        this.$route.path == "/card/cloud/contacter/index" &&
        this.isAddContacter
      ) {
        this.imageUrl = URL.createObjectURL(file);
        this.avatarFile = file;
      } else {
        let obj = new FormData();
        obj.append("file", file);
        Object.keys(this.avatarFileData).forEach((res) => {
          obj.append(res, this.avatarFileData[res]);
        });
        this.uploadCardFile(obj, file);
      }
    },
    uploadCardFile(data, file) {
      uploadCardFile(data).then((res) => {
        this.$message.success("上传成功");
        this.imageUrl = URL.createObjectURL(file);
        this.$emit("setAvatar", res.data.data);
      });
    },
    getCardFileDetail(id) {
      getCardFileDetail(id, this.avatarFileData).then((res) => {
        console.log("res", res);
        let file = new File([res.data], "头像", {
          type: "",
          lastModified: Date.now(),
        });
        console.log("file", file);
        this.imageUrl = URL.createObjectURL(file);
      });
    },
    mouseenterAvatar() {
      console.log(6666666);
    },
  },
};
</script>

<style lang="scss" scoped>
.headform {
  /deep/.el-form-item__content {
    position: relative;
    .head {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #ccc;
      // background-color: blue;
      overflow: hidden;
      .upload-demo {
        position: absolute;
        right: -40px;
        top: 50%;
        transform: translate(0, -50%);
        .text {
          font-size: 16px;
          font-family: Source Han Sans CN-Normal, Source Han Sans CN;
          font-weight: 400;
          color: #175E67;
          line-height: 48px;
        }
      }
    }
  }
}
/deep/.avatar-uploader .el-upload {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #fff;
}
/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}
/deep/.avatar {
  width: 100px !important;
  height: 100px !important;
  display: block;
}
/deep/.avatar-uploader .el-upload {
  border-color: #fff;
}
.heddenavatar {
  width: 120px !important;
  height: 120px !important;
  // border-radius: 50%;
  background-color: #fff;
  position: absolute;
  z-index: 99;
  top: -36px;
  left: 50%;
  transform: translate(-50%, 0);
  opacity: 0;
}
.changeAvatar {
  width: 100px !important;
  height: 40px !important;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  background-color: #000000;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.6;
}
</style>