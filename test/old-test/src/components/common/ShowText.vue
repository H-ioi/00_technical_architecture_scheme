<template>
  <div class="showText" ref="showText">
    <div
      :class="['showTextWord', { morethen_3: isEllipsis }]"
      ref="showTextWord"
    >
      <div
        v-show="showTextBtn"
        @click="changeLineClamp"
        class="showTextBtn"
        ref="showTextBtn"
      >
        {{ btnText }}
      </div>
      {{ label }}
      <span
        v-show="closeTextBtn"
        @click="changeLineClamp"
        style="color: #175E67; cursor: pointer"
      >
        收起
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "H5InternalShowText",
  props: {
    label: String,
  },
  data() {
    return {
      showTextBtn: false,
      closeTextBtn: false,
      isEllipsis: false,
      btnText: "展开",
    };
  },
  computed: {},
  watch: {
    label() {
      this.$nextTick(() => {
        this.isShow();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow();
    });
  },

  methods: {
    isShow() {
      const showTextWordHeight = window
        .getComputedStyle(this.$refs["showTextWord"])
        .height.replace("px", "");
      const showTextBtnHeight = window
        .getComputedStyle(this.$refs["showTextBtn"])
        .height.replace("px", "");
      const showTextHeight = window
        .getComputedStyle(this.$refs["showText"])
        .height.replace("px", "");

      let lineClamp = Number(showTextWordHeight) / Number(showTextBtnHeight);
      console.log("lineClamp", lineClamp);
      if (lineClamp > 3) {
        this.showTextBtn = true;
        this.isEllipsis = true;
      } else {
        this.showTextBtn = false;
        this.isEllipsis = false;
      }
    },
    changeLineClamp() {
      this.isEllipsis = !this.isEllipsis;
      this.showTextBtn = !this.showTextBtn;
      this.closeTextBtn = !this.closeTextBtn;
    },
  },
};
</script>
<style lang="scss" scoped>
.showText {
  display: flex;
  .showTextWord {
    font-size: 14px;
    color: #0D0D0D;
    line-height: 24px;
    word-break: break-all; //只对英文起作用，以字母作为换行依据
    word-wrap: break-word; //只对英文起作用，以单词作为换行依据
    white-space: normal; //只对中文起作用，强制换行
  }

  .showTextWord::before {
    content: "";
    float: right;
    width: 0;
    height: 100%;
    margin-bottom: -24px;
  }

  .showTextBtn {
    float: right;
    clear: both;
    font-size: 14px;
    color: #175E67;
    height: 24px;
    padding: 0 5px;
    cursor: pointer;
  }
  .morethen_3 {
    max-height: 72px;
    overflow: hidden;
  }
}
</style>