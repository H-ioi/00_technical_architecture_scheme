<template>
  <el-form
    v-loading="loadingFrom"
    :label-position="'top'"
    :inline="true"
    :model="formArrValue"
    :rules="formRules"
    ref="form"
  >
    <el-form-item
      v-for="(item, index) in formArr"
      :key="index"
      :label="item.label"
      :prop="item.id"
      :ref="item.id"
      :style="
        `width:${
          item.type == 'input' || item.type == 'select' ? '25%' : '100%'
        }`
      "
      class="formItem"
    >
      <span
        v-if="item.type != 'upload'"
        :class="item.type != 'textarea' ? 'tips' : 'breakAll'"
        style="color: #0d0d0d; line-height: 18px"
        :title="formArrValue[item.id]"
        >{{
          formArrValue[item.id] == undefined ? "--" : formArrValue[item.id]
        }}</span
      >
      <div v-else>
        <FileList :ref="`filelist${item.id}`" :isDisabled="true" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
// 动态模板
import {
  getTemplateDetail,
  getDynamicDetail
} from "@/api/space/templatedynamic.js";
import { getFiles, downloadFile } from "@/api/upload/index.js";
import { download } from "@/util/download.js";
import FileList from "../modal/fileList.vue";
export default {
  components: {
    FileList
  },
  data() {
    return {
      formArrValue: {},
      formRules: {},
      formArr: [],
      templateFormId: "",
      loadingFrom: false
    };
  },
  methods: {
    clearData() {
      this.formArrValue = {};
      this.formRules = {};
      this.formArr = [];
      this.templateFormId = "";
    },
    getDynamicDetail(id) {
      if (id == null) return;
      getDynamicDetail(id).then(res => {
        if (res.data.success) {
          let { fields, id, templateFormId } = res.data.data;
          fields.map(item => {
            let dataItem = this.formArr.filter(s => {
              return s.id == item.templateFormFieldId;
            });
            let itemValue = [];
            let type = dataItem[0].type;
            let option = dataItem[0].properties;
            if (type == "radio") {
              option.map(o => {
                if (o.id == item.value && o.key == "option") {
                  itemValue.push(o.value);
                }
              });
              this.formArrValue[item.templateFormFieldId] = String(itemValue);
            } else if (type == "checkbox") {
              // 截取id字符串专成数组
              let ids = item.value
                .substring(1, item.value.length - 1)
                .split(",");
              option.map(o => {
                if (ids.includes(o.id) && o.key == "option") {
                  itemValue.push(o.value);
                }
              });
              this.formArrValue[item.templateFormFieldId] = String(itemValue);
            } else if (type == "select") {
              let ids = item.value
                .substring(1, item.value.length - 1)
                .split(",");
              option.map(o => {
                if (ids.includes(o.id) && o.key == "option") {
                  itemValue.push(o.value);
                }
              });

              this.formArrValue[item.templateFormFieldId] = String(itemValue);
            } else if (type == "datetimepicker") {
              let date = JSON.parse(item.value);
              if (date.length > 1) {
                this.formArrValue[item.templateFormFieldId] =
                  date[0] + "至" + date[1];
              } else {
                this.formArrValue[item.templateFormFieldId] = String(date);
              }
              console.log("item.value", item.value);
            } else if (type == "upload") {
              let ids = JSON.parse(item.value);
              if (ids.length === 0) return;
              this.formArrValue[item.templateFormFieldId] = ids;
              this.$nextTick(() => {
                getFiles({ ids }).then(res => {
                  if (res.data.success) {
                    let refId = `filelist${item.templateFormFieldId}`;
                    this.$refs[refId][0].filelistobj = [];
                    this.$refs[refId][0].filelist = ids;
                    let data = res.data.data;
                    // console.log("filelistobj",  this.$refs[refId][0]);
                    data.map(file => {
                      let obj = {
                        id: file.id,
                        type: file.contentType,
                        file: "",
                        name: file.originalName
                      };

                      this.$refs[refId][0].getFile(file.id, obj);
                    });
                  }
                });
              });
            } else {
              this.formArrValue[item.templateFormFieldId] = item.value;
            }
          });
          this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
        }
      });
    },
    //获取动态表单模板详情
    getTemplateDetail(id, formId) {
      if (id == null) return;
      this.loadingFrom = true;
      getTemplateDetail(id)
        .then(res => {
          if (res.data.success) {
            let data = res.data.data.fields;
            this.formArr = data.sort((a, b) => {
              return a.sort - b.sort;
            });
            this.getDynamicDetail(formId);
            this.loadingFrom = false;
          } else {
            this.loadingFrom = false;
          }
        })
        .catch(() => {
          this.loadingFrom = false;
        });
    },
    // 下载文件
    downFile(file) {
      downloadFile(file.id).then(res => {
        download(res.data, res.headers["content-disposition"]);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.formItem {
  /deep/.el-form-item__label {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #999999 !important;
  }
}
.breakAll {
  word-break: break-all; //只对英文起作用，以字母作为换行依据
  word-wrap: break-word; //只对英文起作用，以单词作为换行依据
  white-space: normal;
}
.fileItem {
  text-decoration: underline;
  cursor: pointer;
  margin-right: 10px;
  line-height: 24px;
  &:hover {
    color: #175e67;
  }
}
</style>
