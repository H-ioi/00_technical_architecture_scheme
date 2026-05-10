<template>
  <div>
    <Editor
      style="z-index: 3000"
      id="tinymce"
      v-model="value"
      :init="init"
    ></Editor>
  </div>
</template>

<script>
import tinymce from "tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/icons/default";
import { uploadFile } from "@/api/academy/file.js";
export default {
  name: "tinymce",
  components: { Editor },
  props: {
    scene: String,
  },
  data() {
    const _this = this;
    return {
      url: process.env.VUE_APP_BASE_URL,
      value: "",
      contenyt: {},
      init: {
        selector: "#tinymce", //tinymce的id
        language_url: "/skins/langs/zh-CN.js", // 语言包位置，因为放在public下所以可以省略public
        language: "zh_CN", //语言类型
        skin_url: "/skins/ui/oxide",
        height: 600, //编辑器高度
        resize: false, //调整编辑器大小工具
        elementpath: false, //隐藏底栏的元素路径
        browser_spellcheck: true, // 拼写检查
        elementpath: true, //禁用编辑器底部的状态栏
        statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: false, // 允许粘贴图像
        menubar: false, //最顶部文字信息
        branding: false, //是否禁用“Powered by TinyMCE”
        plugins: "image  code fullscreen", //就可以增加上面引入的插件，加入下面这一行就可以在toolbar栏显示相应插件。
        toolbar:
          "fontselect fontsizeselect  lineheight forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify", //工具栏

        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        content_style: "img {width:100%;}",
        file_picker_types: "image",
        image_dimensions: false,
        automatic_uploads: false,
        images_upload_url: "http://172.16.32.63:9998",
        images_upload_handler: function (blobInfo, success, failure) {
          var file = blobInfo.blob(); // 转化为易于理解的file对象
          // var formData;
          // formData = new FormData();
          // formData.append("file", file, file.name); // 添加formData
          // console.log(33333333333);
          success(_this.uploadfile(file));
          //我项目封装的提交接口，此处写你自己的提交
          //   appRequestFile("xxx/xx", formData, "post").then(res => {
          //     console.log(res.data.data.filePath);
          //     //上传成功，成功回调，设置服务端返回的图片路径，设置成功以后，点击弹出框保存。图片就会显示在编辑器框里，图片的src就是接口返回的filePath
          //     success(res.data.data.filePath);
          //   });
        },
      },
    };
  },
  created() {},
  mounted() {
    tinymce.init({});
    // this.$refs["tinymce"].init(this.init);
  },
  activated() {},
  computed: {},
  methods: {
    uploadfile(file) {
      let _this = this;
      let formData = new FormData();
      formData.append("scene", this.scene);
      formData.append("file", file);
      return new Promise((resolve) => {
        uploadFile(formData).then((res) => {
          this.$message.success("上传成功");
          let id = res.data.data;
          let imgPath = `${_this.url}/isaic/mobile/public/file/download/${id}?scene=${this.scene}`;
          console.log("imgPath", imgPath);
          // 3204
          resolve(imgPath);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
