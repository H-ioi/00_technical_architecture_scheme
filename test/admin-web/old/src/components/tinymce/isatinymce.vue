<template>
  <div>
    <Editor :id="editorId" v-model="value" :init="init"></Editor>
  </div>
</template>

<script>
import myRequest from "@/router/axiosother.js";
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce";
import "tinymce/icons/default";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/preview";
import "tinymce/plugins/textcolor";
import "tinymce/themes/silver/theme";

if (typeof window !== "undefined") {
  window.tinymce = tinymce;
}

export default {
  name: "isatinymce",
  components: { Editor },
  props: {
    scene: String,
    language: {
      type: String,
      default: "zh_CN",
    },
    editorId: {
      type: String,
      default: "tinymce",
    },
  },
  data() {
    const _this = this;
    return {
      url: process.env.VUE_APP_BASE_URL,
      value: "",
      init: {
        selector: `#${this.editorId}`,
        language: this.language === "en" ? "en" : "zh_CN",
        skin_url: "/skins/ui/oxide",
        height: 600,
        resize: false,
        elementpath: false,
        browser_spellcheck: true,
        statusbar: false,
        paste_data_images: true,
        menubar: false,
        branding: false,
        plugins: "lists link image code fullscreen preview textcolor",
        toolbar:
          "fontselect fontsizeselect | forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image link numlist bullist preview fullscreen",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        content_style: "img {width:100%;}",
        file_picker_types: "image",
        image_dimensions: false,
        automatic_uploads: false,
        images_upload_url: "http://172.16.32.63:9998",
        images_upload_handler: function (blobInfo, success, failure) {
          var file = blobInfo.blob();
          success(_this.uploadfile(file));
        },
      },
    };
  },
  created() {
    // 组件创建时更新selector
    this.init.selector = `#${this.editorId}`;
    if (this.language === "en") {
      this.init.language = "en";
      delete this.init.language_url;
    } else {
      this.init.language = "zh_CN";
      this.init.language_url =
        "https://cdn.tiny.cloud/1/no-api-key/tinymce/5/langs/zh_CN.js";
    }
  },
  activated() {},
  computed: {},
  methods: {
    async uploadfile(file) {
      let formData = new FormData();
      formData.append("prefix", "parent_weapp_upload");
      formData.append("file", file);
      const response = await myRequest.upload(formData);
      return response.data.url;
    },
  },
};
</script>

<style lang="scss" scoped></style>
