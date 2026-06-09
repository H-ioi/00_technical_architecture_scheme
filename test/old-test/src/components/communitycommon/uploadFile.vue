<template>
  <div :class="rootClass" :style="rootStyle">
    <el-upload
      :class="uploadClass"
      action="https://jsonplaceholder.typicode.com/posts/"
      :accept="types"
      :show-file-list="false"
      :disabled="disabled"
      :before-upload="beforeUpload">
      <img v-if="imageUrl" :src="imageUrl" :class="previewClass" />
      <img v-else-if="showDefaultIcon" class="upload-photo-icon" src="/community/upload_picture.png" />
    </el-upload>
    <div v-if="showPlaceholderLayer" class="upload-photo__placeholder">
      <img class="upload-photo__placeholder-icon" src="/community/upload_picture.png" alt="" />
      <p class="upload-photo__placeholder-text">{{ placeholder }}</p>
    </div>
  </div>
</template>

<script>
import myRequest from '@/router/axiosother.js'

/** 社区通用单图上传：默认 100×100 缩略图；layout=fill 时可铺满容器并自定义占位文案 */
export default {
  name: 'UniUiFilelist',
  props: {
    limit: {
      type: Number,
      default: 1,
      require: false
    },
    types: {
      type: String,
      default: 'image/*'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024
    },
    /** 展示模式：thumb 保持原 100×100；fill 铺满父容器 */
    layout: {
      type: String,
      default: 'thumb',
      validator: (v) => ['thumb', 'fill'].includes(v)
    },
    /** fill 模式下的区域高度（数字为 px） */
    boxHeight: {
      type: [Number, String],
      default: 168
    },
    /** fill 模式空态提示文案；有值时显示占位层并隐藏默认小图标 */
    placeholder: {
      type: String,
      default: ''
    },
    /** fill 模式下是否去掉上传框自带虚线边框（外层容器已有边框时使用） */
    hideBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: ''
    }
  },
  computed: {
    isFillLayout() {
      return this.layout === 'fill'
    },
    rootClass() {
      return {
        'community-upload-file': true,
        'community-upload-file--fill': this.isFillLayout,
        'community-upload-file--hide-border': this.isFillLayout && this.hideBorder
      }
    },
    rootStyle() {
      if (!this.isFillLayout) {
        return {}
      }
      const height = typeof this.boxHeight === 'number' ? `${this.boxHeight}px` : this.boxHeight
      return { minHeight: height, height }
    },
    uploadClass() {
      const list = ['avatar-uploader', 'upload-photo']
      if (this.isFillLayout) {
        list.push('upload-photo--fill')
      }
      return list.join(' ')
    },
    previewClass() {
      return this.isFillLayout ? 'avatar avatar--fill' : 'avatar'
    },
    showDefaultIcon() {
      if (this.imageUrl) {
        return false
      }
      if (this.isFillLayout && this.placeholder) {
        return false
      }
      return true
    },
    showPlaceholderLayer() {
      return this.isFillLayout && !!this.placeholder && !this.imageUrl
    }
  },
  methods: {
    async beforeUpload(file) {
      if (!this.validateFileSize(file)) {
        this.$message.error(`文件大小不能超过 ${this.maxSize / (1024 * 1024)}MB`)
        return false
      }
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await myRequest.upload(formData)
        this.imageUrl = response.data.url
        this.$emit('upload-success', response.data.url)
        return true
      } catch (error) {
        console.error('文件上传失败', error)
        this.$emit('upload-error', error)
        return false
      }
    },
    validateFileSize(file) {
      return file.size <= this.maxSize
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.community-upload-file--fill {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  .upload-photo--fill {
    width: 100% !important;
    height: 100% !important;
    min-height: inherit;
    border-radius: 0;
    position: relative;
    z-index: 2;
    overflow: hidden;

    ::v-deep .el-upload {
      width: 100% !important;
      height: 100% !important;
      min-height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &.community-upload-file--hide-border .upload-photo--fill {
    border: none !important;
    background: transparent;
  }

  .avatar--fill {
    width: auto !important;
    height: auto !important;
    max-width: calc(100% - 32px);
    max-height: calc(100% - 18px);
    object-fit: contain;
  }

  .upload-photo__placeholder {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    pointer-events: none;
    box-sizing: border-box;
  }

  .upload-photo__placeholder-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .upload-photo__placeholder-text {
    margin: 0;
    text-align: center;
    font-size: 14px;
    color: #909399;
    line-height: 1.5;
  }
}
</style>
