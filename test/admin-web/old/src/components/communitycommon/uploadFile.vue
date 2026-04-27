<template>
  <div>
    <el-upload
      class="avatar-uploader upload-photo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :accept="types"
      :show-file-list="false"
      :disabled="disabled"
      :before-upload="beforeUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <img v-else class="upload-photo-icon" src="/community/upload_picture.png" />
    </el-upload>
  </div>
</template>

<script>
import { communityUpload } from "@/api/isacommunity/upload.js";
import myRequest from "@/router/axiosother.js";
export default {
  name: "UniUiFilelist",
  props: {
    limit: {
      type: Number,
      default: 1,
      require: false,
    },
    types: {
      type: String,
      default: "image/*",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxSize: {
      type: Number,
      // 默认最大文件大小为 5MB
      default: 10 * 1024 * 1024,
    },
  },
  data() {
    return {
      imageUrl: "",
    };
  },

  mounted() {},

  methods: {
    async beforeUpload(file) {
      // 文件大小验证
      if (!this.validateFileSize(file)) {
        this.$message.error(`文件大小不能超过 ${this.maxSize / (1024 * 1024)}MB`);
        return false;
      }
      const formData = new FormData();
      formData.append("file", file); // 将文件添加到 FormData 对象

      try {
        const response = await myRequest.upload(formData);
        // 上传成功，通过 $emit 通知父组件
        console.log("response", response.data);
        this.imageUrl = response.data.url;
        this.$emit("upload-success", response.data.url);
        return true;
      } catch (error) {
        console.error("文件上传失败", error);
        // 上传失败，通过 $emit 通知父组件
        this.$emit("upload-error", error);
        return false;
      }
    },
    // 文件大小验证方法
    validateFileSize(file) {
      return file.size <= this.maxSize;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
