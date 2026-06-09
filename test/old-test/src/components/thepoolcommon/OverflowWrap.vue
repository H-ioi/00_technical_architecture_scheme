<template>
  <div class="overflow-wrap" ref="container">
    <!-- 内容插槽：支持任意内容 -->
    <div class="content-wrap" :class="{ expanded: !isExpanded }">
      <div class="content" ref="content"><slot></slot></div>
    </div>

    <!-- 更多/收起 按钮 -->
    <span v-if="showMore" class="more-btn" @click="toggle">
      {{ isExpanded ? "更多" : "收起" }}
      <i class="el-icon-arrow-up" v-if="!isExpanded"></i>
      <i class="el-icon-arrow-right" v-else=""></i>
    </span>
  </div>
</template>

<script>
/*
  通用溢出折叠公共组件
  功能：内容超过一行自动隐藏，显示更多/收起按钮
  使用：<OverflowWrap> 任意内容 </OverflowWrap>
*/
export default {
  name: "OverflowWrap",
  data() {
    return {
      isExpanded: false, // 是否展开
      showMore: false, // 是否显示更多按钮
      resizeObserver: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkOverflow();
      this.initObserver();
    });
  },
  beforeDestroy() {
    // 销毁监听
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    // 监听容器尺寸变化，自动重新判断溢出
    initObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkOverflow();
      });
      this.resizeObserver.observe(this.$refs.container);
    },

    // 检测内容是否溢出一行
    checkOverflow() {
      this.$nextTick(() => {
        const content = this.$refs.content;
        if (!content) return;
        // 检测容器高度是否超过16px,则意味着换行了，显示更多按钮
        this.showMore = content.clientHeight > 32;
      });
    },

    // 切换展开/收起
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style lang="scss" scoped>
.overflow-wrap {
  display: flex;
  align-items: flex-start;
  flex: 1;
  position: relative;
  flex-wrap: wrap;
}

/* 内容容器：默认一行隐藏，展开后自动换行 */
.content-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  max-height: 30px;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.2s ease;
  opacity: 1;
  .content {
    display: flex;
    align-items: flex-start;
  }
  ::v-deep .el-checkbox {
    line-height: 16px;
    margin-bottom: 10px;
    .el-checkbox__label {
      font-size: 14px;
      color: #666666;
      font-weight: 400;
      line-height: 16px !important;
    }
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
  }
}

/* 展开状态：允许换行、显示全部 */
.content-wrap.expanded {
  max-height: 500px;
  overflow: visible;
  ::v-deep .el-checkbox {
    margin-bottom: 0;
  }
}

/* 更多按钮样式（和你UI保持一致：金色） */
.more-btn {
  color: #c49a6c;
  cursor: pointer;
  user-select: none;
  margin-left: 8px;
  line-height: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease, transform 0.2s ease;
}
.more-btn:hover {
  color: #b08355;
  transform: translateY(-1px);
}

/* 箭头图标动画 */
.more-btn i {
  transition: transform 0.3s ease;
  font-size: 12px;
}

.more-btn.expanded i {
  transform: rotate(180deg);
}
</style>
