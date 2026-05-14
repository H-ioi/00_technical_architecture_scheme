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
        automatic_uploads: true,
        images_upload_handler: this.handleImageUpload,
        images_reuse_filename: true, // 重用图片文件名
        file_picker_callback: function (callback, value, meta) {
          // 处理文件选择器回调
          if (meta.filetype === "image") {
            // 创建临时输入元素
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = function () {
              const file = this.files[0];
              if (file) {
                // 调用上传方法
                this.handleImageUpload(
                  {
                    blob: function () {
                      return file;
                    },
                    filename: function () {
                      return file.name;
                    },
                  },
                  callback,
                  function () {}
                );
              }
            }.bind(this);
            input.click();
          }
        }.bind(this),
        // 支持拖拽上传
        setup: function (editor) {
          editor.on("dragover", function (e) {
            e.preventDefault();
          });
          editor.on(
            "drop",
            function (e) {
              e.preventDefault();
              if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.indexOf("image/") === 0) {
                  // 调用上传方法
                  this.handleImageUpload(
                    {
                      blob: function () {
                        return file;
                      },
                      filename: function () {
                        return file.name;
                      },
                    },
                    function (url) {
                      editor.insertContent('<img src="' + url + '" />');
                    },
                    function () {}
                  );
                }
              }
            }.bind(this)
          );

          // 监听粘贴事件，处理base64图片
          editor.on(
            "paste",
            function (e) {
              const clipboardData = e.clipboardData || window.clipboardData;
              const items = clipboardData.items;

              // 检查是否有图片数据
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image/") === 0) {
                  e.preventDefault();
                  const file = items[i].getAsFile();
                  // 调用上传方法
                  this.handleImageUpload(
                    {
                      blob: function () {
                        return file;
                      },
                      filename: function () {
                        return file.name;
                      },
                    },
                    function (url) {
                      editor.insertContent('<img src="' + url + '" />');
                    },
                    function () {}
                  );
                  break;
                }
              }

              // 检查是否有base64数据
              const text = clipboardData.getData("text");
              if (text && text.indexOf("data:image/") === 0) {
                e.preventDefault();
                // 调用上传方法处理base64
                this.handleImageUpload(
                  {
                    base64: text,
                  },
                  function (url) {
                    editor.insertContent('<img src="' + url + '" />');
                  },
                  function () {}
                );
              }
            }.bind(this)
          );
        }.bind(this),
      },
    };
  },
  created() {
    // 组件创建时更新selector
    this.init.selector = `#${this.editorId}`;
    this.init.language_url =
      this.language === "en" ? "/skins/langs/en.js" : "/skins/langs/zh-CN.js";
    this.init.language = this.language === "en" ? "en" : "zh_CN";
  },
  mounted() {
    // tinymce.init({});
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
    async handleImageUpload(blobInfo, success, failure) {
      try {
        var file = blobInfo.blob();
        const url = await this.uploadfile(file);
        success(url);
      } catch (error) {
        console.error("图片上传失败", error);
        failure("图片上传失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
