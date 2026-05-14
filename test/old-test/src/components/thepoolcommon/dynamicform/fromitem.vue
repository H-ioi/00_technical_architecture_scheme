<template>
  <el-form
    class="thepool_page"
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
      :style="`width:${
        item.type == 'input' || item.type == 'select' ? '25%' : '100%'
      }`"
      :class="[
        'list-complete-item',
        {
          'is-required': item.required,
        },
      ]"
    >
      <!-- 单文本输入框 -->
      <el-input
        v-if="item.type == 'input'"
        class="styleclass dargDiv"
        v-model="formArrValue[item.id]"
        :placeholder="item.properties.placeholder"
        :type="item.properties.ciphertext == 'true' ? 'password' : 'text'"
        :show-password="item.properties.ciphertext == 'true'"
        :disabled="item.disabled"
        :readonly="item.readonly"
      ></el-input>
      <!-- 多文本输入框 -->
      <el-input
        v-if="item.type == 'textarea'"
        class="styleclass dargDiv"
        type="textarea"
        v-model="formArrValue[item.id]"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :placeholder="item.properties.placeholder"
        :rows="item.properties.text_num_line"
        :maxlength="item.properties.text_num_column"
        show-word-limit
      ></el-input>
      <!-- 单选框 -->
      <el-radio-group
        v-if="item.type == 'radio'"
        v-model="formArrValue[item.id]"
        @change="resetFields"
      >
        <el-radio
          v-for="i in item.properties.option || []"
          :key="i.id"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :label="i.id"
          >{{ i.label }}</el-radio
        >
      </el-radio-group>

      <!-- 复选框 -->
      <el-checkbox-group
        v-if="item.type == 'checkbox'"
        v-model="formArrValue[item.id]"
        @change="resetFields"
      >
        <el-checkbox
          v-for="i in item.properties.option || []"
          :key="i.id"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :label="i.id"
          >{{ i.label }}</el-checkbox
        >
      </el-checkbox-group>

      <!-- 下拉选框 -->
      <el-select
        class="selectform"
        v-if="item.type == 'select'"
        style="width: 100%"
        v-model="formArrValue[item.id]"
        :multiple="item.properties.option_multi"
        :disabled="item.readonly"
        :filterable="item.properties.searchable"
        :placeholder="item.properties.placeholder"
        @change="resetFields"
      >
        <el-option
          v-for="i in item.properties.option || []"
          :key="i.id"
          :label="i.label"
          :value="i.id"
        ></el-option>
      </el-select>
      <!-- 时间选择器 -->
      <el-date-picker
        v-if="item.type == 'datetimepicker'"
        @change="resetFields"
        v-model="formArrValue[item.id]"
        :type="item.properties.datetime_type"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :placeholder="item.properties.placeholder"
        :value-format="item.properties.datetime_pattern"
        :format="item.properties.datetime_pattern"
        range-separator="至"
        start-placeholder="开始"
        end-placeholder="结束"
        :picker-options="{
          disabledDate: (time) => {
            if (
              !item.properties.datetime_begin &&
              !item.properties.datetime_end
            ) {
              return false;
            } else if (
              !item.properties.datetime_begin &&
              item.properties.datetime_end
            ) {
              return (
                time.getTime() >=
                Date.parse(new Date(item.properties.datetime_end))
              );
            } else if (
              item.properties.datetime_begin &&
              !item.properties.datetime_end
            ) {
              return (
                time.getTime() <=
                Date.parse(new Date(item.properties.datetime_begin))
              );
            } else {
              return !(
                Date.parse(new Date(item.properties.datetime_begin)) <=
                  time.getTime() &&
                time.getTime() <=
                  Date.parse(new Date(item.properties.datetime_end))
              );
            }
          },
        }"
      >
      </el-date-picker>
      <!-- 上传组件 -->
      <div class="formupload" v-if="item.type == 'upload'">
        <el-upload
          @click.native="getCurrentUpload(item)"
          @mouseover.native="getCurrentUpload(item)"
          class="upload-demo"
          drag
          action=""
          multiple
          :disabled="item.disabled"
          :readonly="item.readonly"
          :accept="String(item.properties.upload_file_type)"
          :limit="Number(item.properties.upload_num)"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
          :on-remove="removeFile"
          :on-preview="downFile"
          :file-list="formArrValue[item.id]"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            {{ getuploadwarntext(item) }}
          </div>
        </el-upload>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
// 动态模板
import {
  addDynamic,
  editDynamic,
  getDynamicDetail,
  getDynamicDetailList,
} from "@/api/space/templatedynamic.js";
import {
  getTemplateInfo,
  addTemplateData,
  editTemplateData,
} from "@/api/consult/template.js";
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
import {
  uploadFile,
  deleteFiles,
  getFiles,
  downloadFile,
} from "@/api/upload/index.js";
import { download } from "@/util/download.js";
import { regeList } from "@/const/space/regex.js";
import { deepClone } from "@/util/util";
import {
  getOuterFile,
  getOuterFileInfos,
  uploadOuterFile,
} from "@/api/upload/index.js";
export default {
  props: {},

  data() {
    return {
      formArrValue: {},
      formRules: {},
      formArr: [],
      templateFormId: "",
      type: "add",
      formDataId: "",
      // 上传
      fileList: {},
      currentUpload: {},
      loadingFrom: false,
      regeList: regeList,
    };
  },
  beforeDestroy() {},
  methods: {
    clear() {
      this.formArrValue = {};
      this.formRules = {};
      this.formArr = [];
    },
    addDynamic(data) {
      return new Promise((resolve, reject) => {
        addDynamic(data).then((res) => {
          if (res.data.success) {
            let obj = {
              formId: res.data.data,
              templateFormId: data.templateFormId,
            };
            resolve(obj);
          }
        });
      });
    },
    editDynamic(data) {
      let obj = {
        ...data,
        id: this.formDataId,
      };
      return new Promise((resolve, reject) => {
        editDynamic(obj).then((res) => {
          if (res.data.success) {
            // resolve(res.data.success);
            let data = {
              formId: obj.id,
              templateFormId: obj.templateFormId,
            };
            resolve(data);
          }
        });
      });
    },

    saveFormArrValue() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (!this.checkData()) return;
            let fieldData = [];
            let fromData = deepClone(this.formArrValue);
            // 如果fromData为空则return
            if (!fromData || Object.keys(fromData).length == 0) {
              resolve([]);
              return;
            }
            Object.keys(fromData).forEach((res) => {
              let obj = {};
              obj["templateFieldId"] = res;
              let item = this.formArr.filter((item) => {
                return item.id == res;
              });
              console.log("item[0].type", item);
              if (item.length === 0) return;
              if (
                item[0].type == "select" &&
                !item[0].properties.option_multi
              ) {
                fromData[res] = [fromData[res]];
              }
              if (
                item[0].type == "datetimepicker" &&
                typeof fromData[res] == "string"
              ) {
                fromData[res] = [fromData[res]];
              } else {
                obj["submitValue"] = JSON.stringify(fromData[res]);
              }
              if (item[0].type == "upload") {
                let ids = [];
                fromData[res].map((s) => {
                  ids.push(s.id);
                });
                obj["submitValue"] = JSON.stringify(ids);
              } else {
                obj["submitValue"] =
                  typeof fromData[res] != "string"
                    ? JSON.stringify(fromData[res])
                    : fromData[res];
              }
              console.log("obj", obj);
              obj["submitValue"] =
                obj["submitValue"] == "null" ? "" : obj["submitValue"];
              fieldData.push(obj);
            });
            console.log("fieldData", fieldData);
            resolve(fieldData);
          }
        });
      });
    },

    //获取动态表单模板详情
    getDynamicDetail(templateVlue) {
      this.type = "edit";
      console.log("getDynamicDetail", this.formArr, templateVlue);
      let { fields } = templateVlue;

      // 创建formArr的fieldId映射，避免多次filter操作
      const formArrMap = new Map();
      this.formArr.forEach((item) => {
        formArrMap.set(item.fieldId, item);
      });

      // 处理每个字段
      fields.forEach(async (item) => {
        const fromItem = formArrMap.get(item.fieldId);
        console.log("fromItem", fromItem);

        if (!fromItem) return; // 容错处理

        // 确保字段ID匹配：使用item.id作为键名，与模板中的绑定一致
        const fieldId = fromItem.id;
        const type = fromItem.fieldType;

        // 根据字段类型处理不同的数据
        let values = null;
        console.log("item.properties", item);
        switch (type) {
          case "select":
            const option_multi = fromItem.properties["option_multi"] || false;
            values = JSON.parse(item.value);
            values = values ? (option_multi ? values : values[0]) : null;
            console.log("select values", item, values);

            this.$set(this.formArrValue, fieldId, values);
          case "checkbox":
            values = item.value ? JSON.parse(item.value) : [];
            console.log("checkbox values", item, values);
            this.$set(this.formArrValue, fieldId, values);
            break;

          case "datetimepicker": {
            const datetime_type = fromItem.properties.datetime_type;
            // 直接查找对应的日期类型配置，避免多次遍历
            const dateConfig = dateTimeType.find(
              (d) => d.type === datetime_type
            );
            const isArr = dateConfig ? dateConfig.isArr : false;

            try {
              const date = item.value ? JSON.parse(item.value) : null;
              this.$set(
                this.formArrValue,
                fieldId,
                isArr ? date : String(date || "")
              );
            } catch (e) {
              console.error("解析日期值失败:", e);
              this.$set(this.formArrValue, fieldId, isArr ? [] : "");
            }
            break;
          }

          case "upload": {
            try {
              console.log("upload values", item, values);
              const ids = item.value ? JSON.parse(item.value || "[]") : [];
              if (ids.length > 0) {
                const fileInfos = await getOuterFileInfos({
                  ids: ids,
                  tenantId: 2,
                });
                const filelist = fileInfos.map((file) => ({
                  name: file.originalName,
                  id: file.id,
                }));
                this.$set(this.formArrValue, fieldId, filelist);
                // getFiles({ ids })
                //   .then((res) => {
                //     if (res.data.success) {
                //       const list = res.data.data.map((file) => ({
                //         name: file.originalName,
                //         id: file.id,
                //       }));
                //       this.$set(this.formArrValue, fieldId, list);
                //     }
                //   })
                //   .catch((error) => {
                //     console.error("获取上传文件信息失败:", error);
                //     this.$set(this.formArrValue, fieldId, []);
                //   });
              } else {
                this.$set(this.formArrValue, fieldId, []);
              }
            } catch (e) {
              console.error("解析上传文件ID失败:", e);
              this.$set(this.formArrValue, fieldId, []);
            }
            break;
          }

          default:
            // 处理文本输入等简单类型
            this.$set(this.formArrValue, fieldId, item.value || "");
        }
      });
    },
    // 获取模板详情
    getTemplateDetail(template, templateVlue = {}) {
      console.log("getTemplateDetail", template, templateVlue);

      if (!template) return;

      this.templateFormId = template.templateId;
      this.formArr = [];

      // 获取字段数据并深拷贝，避免修改原始数据
      const fields = [...(template.templateFields || template.fields || [])];
      const newFields = fields.filter((item) => {
        return item.fieldType !== "sign" && item.fieldType !== "protocol";
      });
      // 按sort字段排序
      const sortedFields = newFields.sort(
        (a, b) => (a.sort || 0) - (b.sort || 0)
      );

      // 创建日期类型映射表，避免多次遍历
      const dateTimeTypeMap = new Map();
      dateTimeType.forEach((d) =>
        dateTimeTypeMap.set(d.datetime_type, { type: d.type, format: d.format })
      );

      // 处理每个字段
      sortedFields.forEach((field) => {
        // 创建新对象，避免修改原始数据
        const formItem = {
          label: field.fieldName || "",
          type: field.fieldType || "",
          fieldType: field.fieldType || "",
          id: field.fieldId || "",
          fieldId: field.fieldId || "",
          readonly: Boolean(field.readonly),
          disabled: Boolean(field.disabled),
          properties: {},
        };

        const properties = {};
        const options = [];
        const optionDefault = [];

        // 处理字段属性
        if (Array.isArray(field.properties)) {
          field.properties.forEach((prop) => {
            switch (prop.key) {
              case "option":
                options.push({
                  label: prop.label || "",
                  id: prop.id || "",
                });
                break;
              case "option_default":
                optionDefault.push(prop.value);
                break;
              case "datetime_type": {
                const dateConfig = dateTimeTypeMap.get(prop.value);
                if (dateConfig) {
                  properties[prop.key] = dateConfig.type;
                  properties.datetime_pattern = dateConfig.format;
                }
                break;
              }
              case "upload_file_type":
                properties[prop.key] = prop.value ? prop.value.split("+") : [];
                break;
              case "upload_size_min":
                properties[prop.key] = prop.value
                  ? Number(prop.value) / 1024
                  : 0;
                break;
              case "upload_size_max":
                properties[prop.key] = prop.value
                  ? Number(prop.value) / 1024 / 1024
                  : 0;
                break;
              default:
                properties[prop.key] = prop.value;
            }
          });
        }

        // 设置选项
        properties.option = options;

        // 处理默认值
        switch (formItem.type) {
          case "checkbox":
            properties.option_default = optionDefault;
            // 初始化checkbox的值为数组
            this.$set(this.formArrValue, formItem.id, optionDefault);
            break;
          case "radio":
            properties.option_default = String(optionDefault[0] || "");
            // 初始化radio的值
            this.$set(
              this.formArrValue,
              formItem.id,
              properties.option_default
            );
            break;
          case "select":
            properties.option_multi = properties.option_multi == "true";
            properties.searchable = properties.searchable == "true";
            properties.option_default = properties.option_multi
              ? optionDefault
              : String(optionDefault[0] || "");
            // 初始化select的值
            this.$set(
              this.formArrValue,
              formItem.id,
              properties.option_default
            );
            break;
          case "upload":
            this.$set(this.formArrValue, formItem.id, []);
            break;
        }

        // 设置上传类型默认值
        if (formItem.type === "upload") {
          this.$set(this.formArrValue, formItem.id, []);
        }

        formItem.properties = properties;
        this.formArr.push(formItem);
        // console.log("formArr", this.formArr);
      });
      this.$nextTick(() => {
        if (templateVlue && templateVlue.fields) {
          this.getDynamicDetail(templateVlue);
        }
      });
    },
    getCurrentUpload(item) {
      console.log("getCurrentUpload", item);
      this.currentUpload = item;
    },
    // 上传前限制条件
    beforeUpload(file) {
      console.log("file", file);
      const size = file.size / 1024;
      let isTrue = true;
      if (this.currentUpload.properties.upload_size_min) {
        isTrue = size >= this.currentUpload.properties.upload_size_min;
      }
      if (this.currentUpload.properties.upload_size_max) {
        isTrue = size <= this.currentUpload.properties.upload_size_max * 1024;
      }
      if (
        this.currentUpload.properties.upload_size_min &&
        this.currentUpload.properties.upload_size_max
      ) {
        isTrue =
          this.currentUpload.properties.upload_size_max * 1024 >= size &&
          size >= this.currentUpload.properties.upload_size_min;
      }

      if (!isTrue) {
        this.$message.warning(this.getuploadwarntext(this.currentUpload));
        return;
      } else {
        let data = new FormData();
        data.append("file", file);
        data.append("tenantId", "2");
        uploadOuterFile(data).then((res) => {
          if (res.data.success) {
            console.log("uploadFile", res);
            let obj = {
              name: file.name,
              id: res.data.data,
            };
            this.formArrValue[this.currentUpload.id].push(obj);
            console.log(" this.formArrValue", this.formArrValue);
            this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
          }
        });
      }
    },
    async downFile(file) {
      // const res = await getOuterFile(file.id);
      // console.log(res);
      // download(res.data, file.name);
      // downloadFile(file.id).then((res) => {
      //   download(res.data, res.headers["content-disposition"]);
      // });
    },
    // 删除文件
    removeFile(file, fileList) {
      let data = { ids: [file.id] };
      this.formArrValue[this.currentUpload.id] = this.formArrValue[
        this.currentUpload.id
      ].filter((item) => {
        return item.id != file.id;
      });
      // deleteFiles(data).then((res) => {
      //   if (res.data.success == "true") {
      //     console.log("deleteFiles", res);
      //   }
      // });
    },
    //文件超出个数限制时的钩子
    onExceed(files, fileList) {
      this.$message.warning(
        `单次上传数量不超过${this.currentUpload.properties.upload_num}个`
      );
    },
    getuploadwarntext(item) {
      let upload_file_type = item.properties.upload_file_type
        ? item.properties.upload_file_type
        : [];
      let uploadAcceptList = [];
      uploadAccept.map((i) => {
        if (upload_file_type.includes(i.type)) {
          uploadAcceptList.push(i.list);
        }
      });
      return `请上传${String(uploadAcceptList)}文件，单文件体积不小于${
        item.properties.upload_size_min
      }KB${
        item.properties.upload_size_max != null
          ? ",不大于" + item.properties.upload_size_max + "M"
          : ""
      }`;
    },
    // 校验动态表单
    checkData() {
      let isCheck = true;
      this.formArr.map((item) => {
        console.log("item", item);
        let id = item.id;
        switch (item.type) {
          case "radio":
            break;
          case "checkbox":
            if (item.properties.option_min) {
              if (this.formArrValue[id].length < item.properties.option_min) {
                isCheck = false;
                this.$message.warning(
                  `${item.label}中的选项应不小于最小可选数量${item.properties.option_min}`
                );
              }
            }
            if (item.properties.option_max) {
              if (this.formArrValue[id].length > item.properties.option_max) {
                isCheck = false;
                this.$message.warning(
                  `${item.label}中的选项应不大于最大可选数量${item.properties.option_max}`
                );
              }
            }
            break;
          case "select":
            break;
        }
      });
      return isCheck;
    },
    resetFields(e) {
      // this.$nextTick(() => {
      //   this.$refs["form"].resetFields();
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.selectform {
  /deep/.el-input.is-disabled .el-input__inner {
    cursor: default;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: default;
  }
}
</style>
>
