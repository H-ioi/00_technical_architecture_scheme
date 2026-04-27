<template>
  <el-dialog
    class="signatureCanvas"
    title="手写签名"
    :visible.sync="dialogVisible"
    width="80vw"
    :fullscreen="true"
    :before-close="handleClose"
  >
    <div class="recruit-canvas">
      <div class="text-box">请在横屏方向进行签名</div>
      <div class="canvas-box" ref="canvasRef">
        <canvas ref="canvasMapRef" id="canvas-map" width="100" height="100" />
      </div>

      <slot name="default" :signatrue="canvasNode">
        <div class="btn-box flex-row">
          <el-button @click="handleClose" type="danger">关闭 Close</el-button>
          <el-button @click="clearHandle" type="info">清除 Clear</el-button>
          <el-button @click="confirmHandle" type="warning">保存 Save</el-button>
        </div>
      </slot>
    </div>
  </el-dialog>
</template>
<script>
import SignaturePad from "signature_pad";
import { uploadOuterFile } from "@/api/upload/index.js";
export default {
  data() {
    return {
      dialogVisible: false,
      canvasNode: "",
      currentSignature: {},
    };
  },
  created() {
    this.$nextTick(() => {
      this.initalHandle();
      window.addEventListener("resize", this.initalHandle, false);
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.initalHandle, false);
  },
  methods: {
    showSignature(item) {
      this.currentSignature = item;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.initalHandle();
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.clearHandle();
    },
    initalHandle() {
      const _canvasBox = this.$refs.canvasRef;
      const _canvas = this.$refs.canvasMapRef;
      if (!_canvasBox || !_canvas) {
        console.warn("DOM节点初始化失败");
        return false;
      }

      _canvas.width = _canvasBox.clientWidth;
      _canvas.height = _canvasBox.clientHeight;
      const computedOpt = Object.assign(
        {},
        {
          dotSize: 5,
          minWidth: 5, //因为有笔锋的效果的，鼠标压力不同显示粗细不同
          maxWidth: 7,
          penColor: "rgb(0, 0, 0)",
        }
      );

      this.clearHandle();
      this.canvasNode = new SignaturePad(_canvas, computedOpt); //这里设置笔的宽度和颜色的样式
    },

    clearHandle() {
      const hasNode = this.canvasNode;
      if (hasNode) {
        hasNode.clear();
        this.$emit("cancelEvent", hasNode);
      }
    },

    async confirmHandle() {
      // 重新初始化画布
      const canvasNode = this.canvasNode;
      if (!canvasNode) {
        this.initalHandle();
      }

      // 是否签字
      if (canvasNode.isEmpty()) {
        console.warn("您还没有签名");
        this.$message.warning("您还没有签名");
        return false;
      }

      // 图像旋转二次处理
      const _boxWidth = window.innerWidth;
      const _boxHeight = window.innerHeight;
      // let _signImg = null;
      const _signImg = canvasNode.toDataURL("image/png", 0.6) || null; //不旋转就是手机横屏
      if (_boxWidth < _boxHeight) {
        await this.rotateBase64Img(_signImg, -90, async (imgUrlRes) => {
          console.log("旋转后的base64", imgUrlRes);
          const file = await this.base64ToFile(imgUrlRes, "signature.png");
          try {
            const uploadResult = await this.uploadFile(file);
            console.log("上传成功", uploadResult);

            this.$emit(
              "confirmEvent",
              uploadResult,
              imgUrlRes,
              this.currentSignature
            ); //在这里修改逻辑，返回的是旋转后的database
            this.handleClose();
          } catch (error) {
            console.error("上传失败", error);
          }
        });
      } else {
        await this.rotateBase64Img(_signImg, 0, async (imgUrlRes) => {
          console.log("旋转后的base64", imgUrlRes);
          const file = await this.base64ToFile(imgUrlRes, "signature.png");
          try {
            const uploadResult = await this.uploadFile(file);
            console.log("上传成功", uploadResult);

            this.$emit(
              "confirmEvent",
              uploadResult,
              imgUrlRes,
              this.currentSignature
            ); //在这里修改逻辑，返回的是旋转后的database
            this.handleClose();
          } catch (error) {
            console.error("上传失败", error);
          }
        });
      }
    },

    // 上传文件到服务器
    uploadFile(fileImg) {
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("tenantId", "2");
        formData.append("file", fileImg);
        // 验证 FormData 内容
        for (let pair of formData.entries()) {
          console.log("FormData entry:", pair[0], pair[1]);
        }
        console.log("uploadFile--data", formData);
        uploadOuterFile(formData).then((res) => {
          if (res.data.success) {
            console.log("uploadFile", res);
            let obj = {
              name: fileImg.name,
              id: res.data.data,
            };
            resolve(obj);
          } else {
            reject(new Error("上传失败"));
          }
        });
      });
    },
    base64ToFile(base64String, fileName) {
      return new Promise((resolve, reject) => {
        try {
          // 检查 base64 字符串格式
          if (!base64String || typeof base64String !== "string") {
            throw new Error("Invalid base64 string");
          }

          // 处理不同格式的 base64 字符串
          const arr = base64String.split(",");
          let mime = "image/png"; // 默认类型
          let bstr = base64String;

          if (arr.length > 1) {
            // 标准格式: data:image/png;base64,...
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (mimeMatch && mimeMatch[1]) {
              mime = mimeMatch[1];
            }
            bstr = arr[1];
          }

          // 解码 base64 数据
          const decodedData = atob(bstr);
          const n = decodedData.length;
          const u8arr = new Uint8Array(n);

          for (let i = 0; i < n; i++) {
            u8arr[i] = decodedData.charCodeAt(i);
          }

          // 创建 Blob 对象
          const blob = new Blob([u8arr], { type: mime });

          // 创建 File 对象
          const file = new File([blob], fileName, { type: mime });
          console.log("Created file:", file);
          resolve(file);
        } catch (error) {
          console.error("Error converting base64 to file:", error);
          reject(error);
        }
      });
    },
    rotateBase64Img(src, edg, callback) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let imgW = 0; // 图片宽度
        let imgH = 0; // 图片高度
        let size = 0; // canvas初始大小

        if (edg % 90 !== 0) {
          throw new Error("旋转角度必须是90的倍数!");
        }

        edg < 0 && (edg = (edg % 360) + 360);
        const quadrant = (edg / 90) % 4; // 旋转象限
        const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; // 裁剪坐标

        const image = new Image();
        image.src = src;
        image.crossOrigin = "anonymous";

        image.onload = function () {
          imgW = image.width;
          imgH = image.height;
          size = imgW > imgH ? imgW : imgH;

          canvas.width = size * 2;
          canvas.height = size * 2;
          switch (quadrant) {
            case 0:
              cutCoor.sx = size;
              cutCoor.sy = size;
              cutCoor.ex = size + imgW;
              cutCoor.ey = size + imgH;
              break;
            case 1:
              cutCoor.sx = size - imgH;
              cutCoor.sy = size;
              cutCoor.ex = size;
              cutCoor.ey = size + imgW;
              break;
            case 2:
              cutCoor.sx = size - imgW;
              cutCoor.sy = size - imgH;
              cutCoor.ex = size;
              cutCoor.ey = size;
              break;
            case 3:
              cutCoor.sx = size;
              cutCoor.sy = size - imgW;
              cutCoor.ex = size + imgH;
              cutCoor.ey = size + imgW;
              break;
          }

          ctx.translate(size, size);
          ctx.rotate((edg * Math.PI) / 180);
          ctx.drawImage(image, 0, 0);

          const imgData = ctx.getImageData(
            cutCoor.sx,
            cutCoor.sy,
            cutCoor.ex,
            cutCoor.ey
          );
          if (quadrant % 2 === 0) {
            canvas.width = imgW;
            canvas.height = imgH;
          } else {
            canvas.width = imgH;
            canvas.height = imgW;
          }
          ctx.putImageData(imgData, 0, 0);

          if (typeof callback === "function") {
            callback(canvas.toDataURL("image/png", 0.7));
          }

          return new Promise((resolve) => {
            // 异步操作...
            resolve(canvas.toDataURL("image/png", 0.7));
          });
        };
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.recruit-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .canvas-box,
  .btn-box,
  .text-box {
    position: absolute;
    top: 50%;
    z-index: 100;
  }

  .canvas-box {
    left: 20%;
    width: 67vw;
    height: 80vh;
    overflow: hidden;
    transform: translateY(-50%);
    background-color: #fff;
    border: 1px dashed #d4d4d4;

    #canvas-map {
      width: 100%;
      height: 100%;
    }
  }
  .text-box {
    background-color: #ffbc0124;
    color: #e6a23c;
    right: -105% !important;
    height: 30px;
    line-height: 30px;
  }
  .btn-box,
  .text-box {
    left: -15%;
    z-index: 1000;
    text-align: center;
    transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -webkit-transform: rotate(90deg);

    .del-btn,
    .sure-btn {
      display: inline-block;
      width: 100px;
      height: 24px;
      margin: 0 10px;
      line-height: 24px;
      border-radius: 6px;
      background-color: #fff;
    }

    .del-btn {
      color: #ff5e00;
    }

    .sure-btn {
      color: #fff;
      background: linear-gradient(100deg, #ff4e01 0%, #ffbc01 100%);
    }
  }
}

@media screen and (orientation: portrait) {
  /*竖屏 css*/
  .btn-box {
    left: -28% !important;
  }
}

@media screen and (orientation: landscape) {
  /*横屏 css*/
  .recruit-canvas {
    .canvas-box {
      top: 12%;
      left: 10%;
      width: 80vw;
      height: 70vh;
      transform: translateY(0);
    }

    .btn-box {
      width: 80%;
      top: 86%;
      left: 20%;
      transform: rotate(0);
    }
    .text-box {
      width: 130%;
      top: 0;
      transform: rotate(0);
    }
  }
}
</style>
