<template>
  <el-dialog
    :title="$t('schoolDoctor.手写签名')"
    :visible.sync="visible"
    width="720px"
    append-to-body
    :close-on-click-modal="false"
    class="visit-signature-dialog"
    @opened="initCanvas"
    @close="handleClose">
    <div class="signature-dialog">
      <div class="signature-dialog__tip">{{ $t('schoolDoctor.签名板提示') }}</div>
      <div ref="canvasWrap" class="signature-dialog__canvas-wrap">
        <canvas ref="canvas"></canvas>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleClose">{{ $t('btn.取消') }}</el-button>
      <el-button @click="clearCanvas">{{ $t('schoolDoctor.清除签名') }}</el-button>
      <el-button type="primary" :loading="uploading" @click="saveSignature">{{ $t('btn.保存') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SignaturePad from "signature_pad";
import myRequest from "@/router/axiosother.js";

export default {
  name: "VisitRecordSignatureDialog",
  data() {
    return {
      visible: false,
      signaturePad: null,
      uploading: false,
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initCanvas);
    this.signaturePad = null;
  },
  methods: {
    open() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
      this.clearCanvas();
    },
    destroyPad() {
      this.signaturePad = null;
    },
    initCanvas() {
      this.$nextTick(() => {
        const wrap = this.$refs.canvasWrap;
        const canvas = this.$refs.canvas;
        if (!wrap || !canvas) return;

        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const width = wrap.clientWidth;
        const height = wrap.clientHeight;
        if (!width || !height) return;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);

        this.destroyPad();
        this.signaturePad = new SignaturePad(canvas, {
          minWidth: 1.5,
          maxWidth: 3,
          penColor: "#303133",
          backgroundColor: "rgb(255, 255, 255)",
        });

        window.removeEventListener("resize", this.initCanvas);
        window.addEventListener("resize", this.initCanvas);
      });
    },
    clearCanvas() {
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    },
    async saveSignature() {
      if (!this.signaturePad || this.signaturePad.isEmpty()) {
        this.$message.warning(this.$t("schoolDoctor.请完成手写签名"));
        return;
      }
      this.uploading = true;
      try {
        const dataUrl = this.signaturePad.toDataURL("image/png");
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "parent-signature.png", { type: "image/png" });
        const formData = new FormData();
        formData.append("prefix", "parent_weapp_upload");
        formData.append("file", file);
        const response = await myRequest.upload(formData);
        const url = response.data.url || dataUrl;
        this.$emit("confirm", url);
        this.$message.success(this.$t("schoolDoctor.上传成功"));
        this.handleClose();
      } catch (error) {
        this.$message.error(this.$t("schoolDoctor.上传失败"));
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.signature-dialog__tip {
  margin-bottom: 12px;
  padding: 8px 12px;
  font-size: 13px;
  color: #e6a23c;
  background: #fdf6ec;
  border-radius: 6px;
}

.signature-dialog__canvas-wrap {
  width: 100%;
  height: 280px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;

  canvas {
    display: block;
    touch-action: none;
    cursor: crosshair;
  }
}
</style>
