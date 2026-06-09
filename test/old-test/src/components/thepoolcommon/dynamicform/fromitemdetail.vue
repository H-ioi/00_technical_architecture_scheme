<template>
  <div>
    <div class="formTitle" @click="showForm = !showForm">
      <div class="name">
        {{ i18nlocel == "en" ? templateName.enName : templateName.zhName }}
      </div>
      <i v-if="showForm" class="el-icon-arrow-down"></i>
      <i v-else class="el-icon-arrow-up"></i>
    </div>
    <el-form
      v-show="!showForm"
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
        :label="item.fieldName"
        :prop="item.fieldId"
        :ref="item.fieldId"
        :style="`width:${
          item.fieldType == 'input' || item.fieldType == 'select'
            ? '25%'
            : '100%'
        }`"
        class="formItem"
      >
        <div
          v-if="item.fieldType == 'protocol'"
          class="protocol-content-text"
          v-html="getplaceholder(item)"
        ></div>
        <span
          v-if="item.fieldType != 'upload' && item.fieldType != 'sign'"
          :class="item.fieldType != 'textarea' ? 'tips' : 'breakAll'"
          style="color: #0d0d0d; line-height: 18px"
          :title="formArrValue[item.fieldId]"
          >{{
            formArrValue[item.fieldId] == undefined ||
            formArrValue[item.fieldId] == "" ||
            formArrValue[item.fieldId] == []
              ? "--"
              : formArrValue[item.fieldId]
          }}</span
        >
        <div v-else>
          <FileList :ref="`filelist${item.fieldId}`" :isDisabled="true" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 动态模板
import {
  getTemplateDetail,
  getDynamicDetail,
} from "@/api/space/templatedynamic.js";
import { getFiles, downloadFile } from "@/api/upload/index.js";
import { download } from "@/util/download.js";
import FileList from "./poolfileList.vue";
import { getOuterFile, getOuterFileInfos } from "@/api/upload/index.js";
export default {
  components: {
    FileList,
  },
  data() {
    return {
      formArrValue: {},
      formRules: {},
      formArr: [],
      templateFormId: "",
      loadingFrom: false,
      templateName: {
        zhName: "模板表单",
        enName: "Template Form",
      },
      showForm: false,
    };
  },
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
    clearData() {
      this.formArrValue = {};
      this.formRules = {};
      this.formArr = [];
      this.templateFormId = "";
    },
    // 优化后的getDynamicDetail方法
    getDynamicDetail(dynamicInfoItem) {
      if (!dynamicInfoItem || !dynamicInfoItem["fields"]) return;
      let { fields } = dynamicInfoItem;
      let newFields = fields || [];
      if (newFields.length == 0) return;

      // 创建fieldId映射表，避免重复过滤
      const fieldIdMap = this.formArr.reduce((map, item) => {
        map[item.fieldId] = item;
        return map;
      }, {});

      // 辅助函数：处理选项类型字段
      const processOptions = (optionItems, selectedIds) => {
        return optionItems
          .filter((o) => selectedIds.includes(o.id) && o.key === "option")
          .map((o) => o.value);
      };

      // 辅助函数：从字符串中提取ID数组
      const extractIds = (value) => {
        if (!value || typeof value !== "string") return [];
        try {
          // 尝试直接解析JSON
          return JSON.parse(value);
        } catch {
          // 如果不是JSON格式，尝试处理为"[id1,id2,...]"格式
          if (value.startsWith("[") && value.endsWith("]")) {
            return value
              .slice(1, -1)
              .split(",")
              .map((id) => id.trim());
          }
          return [value];
        }
      };

      newFields.forEach((item) => {
        const dataItem = fieldIdMap[item.fieldId];
        if (!dataItem) return; // 如果找不到对应的字段，跳过处理

        const type = dataItem.fieldType;
        const option = dataItem.properties;

        try {
          switch (type) {
            case "radio":
              const radioIds = [item.value];
              const radioValues = processOptions(option || [], radioIds);
              this.formArrValue[item.fieldId] = radioValues.join("");
              break;

            case "checkbox":
              const checkboxTds = extractIds(item.value);
              const checkboxValues = processOptions(option || [], checkboxTds);
              this.formArrValue[item.fieldId] = checkboxValues.join(",");
              break;
            case "select":
              const selectIds = extractIds(item.value);
              const selectValues = processOptions(option || [], selectIds);
              this.formArrValue[item.fieldId] = selectValues.join(",");
              break;

            case "datetimepicker":
              try {
                const date = JSON.parse(item.value);
                if (Array.isArray(date) && date.length > 1) {
                  this.formArrValue[item.fieldId] = `${date[0]}至${date[1]}`;
                } else {
                  this.formArrValue[item.fieldId] = String(date);
                }
              } catch {
                this.formArrValue[item.fieldId] = item.value || "--";
              }
              break;

            case "upload":
              try {
                const fileIds = JSON.parse(item.value) || [];
                this.formArrValue[item.fieldId] = fileIds;

                if (fileIds.length > 0) {
                  this.$nextTick(async () => {
                    const fileInfos = await getOuterFileInfos({
                      ids: fileIds,
                      tenantId: 2,
                    });
                    console.log("fileInfos", fileInfos);

                    const refId = `filelist${item.fieldId}`;
                    const fileListRef = this.$refs[refId][0];
                    if (fileListRef) {
                      fileListRef.filelistobj = [];
                      fileListRef.filelist = fileIds;

                      fileInfos.forEach((file) => {
                        const obj = {
                          id: file.id,
                          type: file.contentType,
                          file: "",
                          name: file.originalName,
                        };
                        fileListRef.getFile(file.id, obj);
                      });
                    }
                  });
                }
              } catch {
                this.formArrValue[item.fieldId] = [];
              }
              break;
            case "sign":
              try {
                const fileValue = JSON.parse(item.value) || [];
                const fileIds = [fileValue[0].id];
                this.formArrValue[item.fieldId] = fileIds;

                if (fileIds.length > 0) {
                  this.$nextTick(async () => {
                    const fileInfos = await getOuterFileInfos({
                      ids: fileIds,
                      tenantId: 2,
                    });
                    console.log("fileInfos", fileInfos);

                    const refId = `filelist${item.fieldId}`;
                    const fileListRef = this.$refs[refId][0];
                    if (fileListRef) {
                      fileListRef.filelistobj = [];
                      fileListRef.filelist = fileIds;

                      fileInfos.forEach((file) => {
                        const obj = {
                          id: file.id,
                          type: file.contentType,
                          file: "",
                          name: file.originalName,
                        };
                        fileListRef.getFile(file.id, obj);
                      });
                    }
                  });
                }
              } catch {
                this.formArrValue[item.fieldId] = [];
              }
              break;
            case "protocol":
              this.formArrValue[item.fieldId] =
                item.value == "1" ? "已同意/Agreed" : "--";
              break;
            default:
              console.log("88888888", item.value);

              this.formArrValue[item.fieldId] = item.value;
          }
        } catch (error) {
          console.error(`处理字段${item.fieldId}时出错:`, error);
          this.formArrValue[item.fieldId] = "--";
        }
      });
    },
    //获取动态表单模板详情
    getTemplateDetail(template, dynamicInfoItem) {
      let data = template.templateFields;
      this.templateName = {
        zhName: template["templateName"] || "模板表单",
        enName: template["templateNameEn"] || "Template Form",
      };
      this.formArr = data.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.formArr = this.formArr.filter((item) => {
        return !item.isHidden;
      });
      // this.formArr = this.formArr.filter((item) => {
      //   return item.fieldType !== "sign" && item.fieldType !== "protocol";
      // });
      this.getDynamicDetail(dynamicInfoItem);
    },
    // 下载文件
    downFile(file) {
      downloadFile(file.id).then((res) => {
        download(res.data, res.headers["content-disposition"]);
      });
    },
    getplaceholder(item) {
      let placeholder = "";
      let properties = item.properties || [];
      properties.forEach((property) => {
        if (property.key == "placeholder") {
          placeholder = property.value;
        }
      });
      return placeholder;
    },
  },
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
.formTitle {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  .name {
    color: #333333;
    font-weight: 400;
    font-size: 16px;
    line-height: 32px;
    margin-right: 5px;
  }
  i {
    color: #999999;
    font-size: 16px;
    line-height: 32px;
  }
}
.protocol-content-text {
  padding: 5px 0 10px;
  max-height: 400px;
  overflow-y: auto;
  font-weight: 400;
  font-size: 12px;
  cursor: default;
  line-height: 18px;
  color: #999999;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
