<template>
  <div style="text-align: center">
    <div class="qrcode" ref="qrCodeUrl" id="qrcode"></div>
    <!-- <div class="df_sb" style="width: 120px">
      <el-button type="primary" size="small" @click="downloadClick">二维码</el-button>
      <el-button type="primary" size="small" @click="onCopy">链接</el-button>
    </div> -->
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import VueClipBoard from "vue-clipboard2";
export default {
  name: "TestUniWel",
  props: {
    codeId: {
      type: String,
      value: "",
    },
  },
  mounted() {
    this.creatQrCode();
  },
  methods: {
    creatQrCode() {
      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: `${process.env.VUE_APP_BASE_COMMUNITY}/#/isacommunity/activity/questionnaire/signup?id=${this.codeId}`,
        width: 120,
        height: 120,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    onCopy() {
      this.$copyText(
        `${process.env.VUE_APP_BASE_COMMUNITY}/#/isacommunity/activity/questionnaire/signup?id=${this.codeId}`
      ).then(
        (e) => {
          console.log("复制成功：", e);
        },
        (e) => {
          console.log("复制失败：", e);
        }
      );
    },
    // 下载二维码
    downloadClick() {
      // 先找到canvas节点下的二维码图片
      const myCanvas = document.getElementById("qrcode").getElementsByTagName("canvas");
      const img = document.getElementById("qrcode").getElementsByTagName("img");
      // 创建一个a节点
      const a = document.createElement("a");
      // 设置a的href属性将canvas变成png格式
      const imgURL = myCanvas[0].toDataURL("image/jpg");
      const ua = navigator.userAgent;
      if (ua.indexOf("Trident") !== -1 && ua.indexOf("Windows") !== -1) {
        // IE内核 并且  windows系统 情况下 才执行;
        var bstr = atob(imgURL.split(",")[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, "下载" + "." + "png");
      } else if (ua.indexOf("Firefox") > -1) {
        // 火狐兼容下载
        const blob = this.base64ToBlob(imgURL); //new Blob([content]);
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        a.download = " "; //下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
        a.href = URL.createObjectURL(blob);
        a.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      } else {
        // 谷歌兼容下载
        img.src = myCanvas[0].toDataURL("image/jpg");
        a.href = img.src;
        // 设置下载文件的名字
        a.download = this.form.title + this.form.w_type_title + "二维码";
        // 点击
        a.click();

        this.$message({
          message: "下载成功，已保存到桌面",
          type: "success",
        });
      }
    },

    // base64转blob
    base64ToBlob(code) {
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {
        type: contentType,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qrcode {
  display: inline-block;
  img {
    width: 120px;
    height: 120px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
    box-sizing: border-box;
  }
}
</style>
