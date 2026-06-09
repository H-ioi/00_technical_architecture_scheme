<template>
  <div>
    <div class="formgenerator df_sb" style="height: 700px">
      <div class="df_sb formgenerator_box" style="width: 100%; height: 700px">
        <el-scrollbar class="formgenerator_left">
          <div class="formgenerator_template">
            <div class="formgenerator_form df_fa">
              <!-- 左侧点击添加表单组件 -->
              <FormLeft
                @addform="addform"
                :childTemplateId="guardianChildTemplateId"
              />
              <!-- 表单预览 -->
              <FormRight
                :formArr="formArr"
                :setform="setform"
                :formArrValue="formArrValue"
                :formArrRules="formArrRules"
                @addform="addform"
                @delThisForm="delThisForm"
                @getCurrentItemForm="getCurrentItemForm"
              />
            </div>
            <div style="padding: 20px 20px 0; text-align: right">
              <el-button type="default" size="medium" round @click="reset">{{
                $t("consult.重置")
              }}</el-button>
              <el-button
                type="default"
                size="medium"
                round
                @click="previewForm"
                >{{ $t("consult.预览") }}</el-button
              >
              <el-button
                type="primary"
                size="medium"
                round
                @click="saveTemplate"
                >{{ $t("consult.保存") }}</el-button
              >
            </div>
          </div>
        </el-scrollbar>
        <!-- 表单属性配置 -->
        <formgeneratorRight
          ref="formgeneratorRight"
          :setform="setform"
          :setformrules="setformrules"
          :isActiveForm="isActiveForm"
          @changeSelectMulti="changeSelectMulti"
          @changeCascader="changeCascader"
        />
      </div>
    </div>
    <el-dialog
      title="预览"
      width="500px"
      :visible.sync="showModal"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div style="border: 1px solid #2a3f54">
        <div class="questionnaire" style="width: 100%; height: 700px">
          <div class="questionnaire-nav">
            {{ collectionData["collectionName"] }}
          </div>
          <el-scrollbar class="questionnaire-content">
            <div class="questionnaire-content-scroll">
              <FormRight
                :formArr="previewData"
                :setform="setform"
                :formArrValue="formArrValue"
                :formArrRules="formArrRules"
                :formType="'preview'"
                @addform="addform"
                @delThisForm="delThisForm"
                @getCurrentItemForm="getCurrentItemForm"
              />
            </div>
          </el-scrollbar>
          <div class="questionnaire-footter">
            <div class="questionnaire-confirm">确认提交</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  formlist,
  dateTimeType,
  uploadAccept,
  setformrules,
} from "./formgeneratorItem_activity/form.js";
import { regeList } from "@/const/space/regex.js";
import { createCode, deepClone } from "@/util/util.js";
import { rule } from "@/util/validateRules.js";
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
// 动态模板
import {
  addTemplate,
  getTemplateDetail,
  editTemplate,
  getTemplateRegex,
} from "@/api/space/templatedynamic.js";
import { getOuterFile, getOuterFileName } from "@/api/upload/index.js";
import FormLeft from "./formgeneratorItem_activity/form_left.vue";
import FormRight from "./formgeneratorItem_activity/form_right.vue";
import formgeneratorRight from "./formgeneratorItem_activity/formgenerator_right.vue";
import { formrules } from "@/util/form.js";
import { getTemplateList, getTemplateInfo } from "@/api/consult/template.js";
export default {
  components: {
    FormLeft,
    FormRight,
    formgeneratorRight,
  },
  props: {
    hasTemplateFrom: {
      default: true,
      type: Boolean,
    },
    templateStr: {
      default: "",
      type: String,
    },
    collectionData: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      fullPath: "",
      // 路由携带参数
      routeData: {},
      templateData: {},
      // 时间选择期类型
      dateTimeType: dateTimeType,
      // 上传类型类型
      uploadAccept: uploadAccept,
      // 正则校验
      regeList: regeList,
      // 模板名称
      templateFrom: { templateName: "", remark: "", pid: "", code: "" },
      templateRule: {
        templateName: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: rule.validatorNameCn, trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrules["checkAssetsTypeCode"], trigger: "blur" },
        ],
      },
      // 表单组件列表
      formArr: [],
      // 中间预览表单
      formArrValue: {},
      formArrRules: {},
      // 右侧表单
      isActiveForm: false,
      setform: { label: "" },
      // 基础字段的校验
      setformrules: setformrules,
      templateType: "add",
      templateList: [],
      templateId: "",
      association: [],
      collectionId: "",
      showModal: false,
      previewData: {},
      // 获取固定子模板---家长
      formData: {
        scene: "8",
        type: "8",
        pageNum: 1,
        pageSize: 100,
      },
      guardianChildTemplateId: "",
    };
  },
  watch: {
    setform: {
      handler(newVal, oldVal) {
        this.formArr.map((item, index) => {
          if (item.fontId == this.setform.fontId) {
            this.$set(this.formArr, index, {
              ...item,
              ...newVal,
            });
            // 处理默认选项
            this.setFormArrValus(newVal);
            // 添加校验，正则
            this.setFormArrRules(newVal);
          }
        });
      },
      deep: true,
    },
  },
  created() {
    this.fullPath = this.$route.fullPath;
    this.getChildTemplateList();
    // this.initData();
  },
  methods: {
    // 初始化数据
    async initData(templateType, id) {
      this.templateType = templateType;
    },
    // 获取模板
    getChildTemplateList() {
      getTemplateList(this.formData).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let list = res.data.data.data || [];
            if (list.length == 0) {
              // this.$message.success("暂无模板");
            } else {
              let templateId = list[0].templateId;
              this.guardianChildTemplateId = templateId;
            }
          });
        }
      });
    },
    // 添加动态表单模板
    addTemplateDynamic(data, outerId) {
      addTemplate(data).then((res) => {
        if (res.data.success) {
          this.$emit("bindTemplate", res.data.data, outerId);
          // this.$message.success("添加成功");
        } else {
          this.$message.success("添加模板失败");
        }
      });
    },
    //编辑动态表单模板
    editTemplate(data) {
      editTemplate(data).then((res) => {
        if (res.data.success) {
          this.$emit("submitForm", res.data.data);
          //   this.$message.success("已保存编辑");
        }
      });
    },
    async getTemplateDetail(template) {
      this.setform = {};
      this.formArr = [];
      this.templateId = template.templateId;
      let data = template.templateFields;
      let sortData = data.filter((item) => item.type !== "association");
      sortData = sortData.sort((a, b) => a.sort - b.sort);

      for (let item of sortData) {
        let properties = {};
        let option = [];
        let option_default = [];

        item.label = item.fieldName;
        item.type = item.fieldType;
        item.fieldId = item.fieldId;
        item.remark = item.remark || "";
        item.readonly = item.readonly ? true : false;
        item.disabled = item.disabled ? true : false;
        item.properties = item.properties ? item.properties : [];

        // 提取创建option数组的逻辑到单独函数
        option = await this.createOptionArray(item);

        for (let res of item.properties) {
          properties[res.key] = res.value;
          if (res.key === "ciphertext") {
            properties[res.key] = res.value === "true";
          }
          if (res.key === "option_default") {
            // option_default.push(res.value);
            option_default = [];
            option.forEach((op) => {
              if (op.optionDefault) {
                option_default.push(op.id);
              }
            });
          }
          if (res.key === "datetime_type") {
            let date = dateTimeType.filter(
              (d) => res.value === d.datetime_type
            );
            item[res.key] = date[0].type;
            properties["datetime_pattern"] = date[0].format;
          }
          if (res.key === "upload_file_type") {
            properties[res.key] = res.value;
          }
          if (res.key === "upload_size_min") {
            properties[res.key] = res.value / 1024;
          }
          if (res.key === "upload_size_max") {
            properties[res.key] = res.value / 1024 / 1024;
          }
        }

        properties.option = option;
        if (item.type === "checkbox") {
          properties.option_default = option_default;
        }
        if (item.type === "radio") {
          properties.option_default = String(option_default);
        }
        if (item.type === "select") {
          properties.option_multi = properties.option_multi === "true";
          properties.searchable = properties.searchable === "true";
          properties.option_default = !properties.option_multi
            ? String(option_default)
            : option_default;
        }
        item.properties = properties;
        this.addform(item, false);
      }
    },

    async createOptionArray(item) {
      let option = [];

      for (let res of item.properties) {
        if (res.key === "option") {
          if (item.type === "banner" || item.type === "protocol") {
            const file = await getOuterFile(res.label);
            const fileName = await getOuterFileName({
              ids: [res.label],
              tenantId: 2,
            });
            const localUrl = URL.createObjectURL(file);
            option.push({
              label: res.label,
              value: res.value,
              id: res.id,
              isHide: res.isHide || 0,
              fontId: createCode(),
              url: localUrl,
              name: fileName,
            });
          } else {
            option.push({
              label: res.label,
              value: res.value,
              id: res.id,
              isHide: res.isHide || 0,
              fontId: createCode(),
              optionDefault: res.optionDefault,
            });
          }
        }
      }
      return option;
    },

    // 保存模板
    saveTemplate() {
      if (this.formArr.length == 0) {
        this.$message.warning("请至少添加一个组件");
        return;
      }
      console.log("this.hasTemplateFrom", this.hasTemplateFrom);
      //   this.setFormgeneratorData();
      if (this.hasTemplateFrom) {
        this.$refs["templateFrom"].validate((valid) => {
          if (valid) {
            this.setFormgeneratorData();
          }
        });
      } else {
        if (this.templateType == "add") {
          this.$emit("submitForm");
        } else {
          this.setFormgeneratorData();
        }
      }
    },
    setFormgeneratorData() {
      let templateArr = [];
      let checkItem = true;
      let returnData = {
        isPass: false,
        data: {},
      };
      // 辅助函数：处理选项类型字段
      const processOption = (option, mark) => {
        // console.log("option", option);
        let customId = String(option.id).indexOf("-") > -1 ? null : option.id;
        return {
          key: "option",
          label: option.label,
          id: customId,
          isHide: option.isHide || 0,
          value: mark == "applyschool" ? option.value : option.label,
          optionDefault: option.optionDefault,
        };
      };

      // 辅助函数：处理默认选项
      const processOptionDefault = (options, optionDefault) => {
        const properties = [];
        const selectedIds = Array.isArray(optionDefault)
          ? optionDefault
          : [optionDefault];

        if (selectedIds.length == 0) return properties;

        selectedIds.forEach((selectedId) => {
          const matchedOption = options.find(
            (option) => option.id == selectedId
          );
          if (matchedOption) {
            properties.push({
              key: "option_default",
              value: matchedOption.id,
            });
          }
        });

        return properties;
      };

      // 辅助函数：处理上传文件大小转换
      const processUploadSize = (key, value) => {
        if (key == "upload_size_min") {
          return value * 1024;
        } else if (key == "upload_size_max") {
          return value * 1024 * 1024;
        }
        return value;
      };

      this.formArr.forEach((item, index) => {
        if (!checkItem) return;

        if (!this.checkData(item)) {
          checkItem = false;
          return;
        }

        let properties = [];
        const itemProps = item.properties || {};
        const options = itemProps.option || [];

        // 遍历所有属性键
        Object.keys(itemProps).forEach((res) => {
          const propValue = itemProps[res];

          switch (res) {
            case "option":
              if (Array.isArray(propValue) && propValue.length > 0) {
                propValue.forEach((option) => {
                  // console.log("option", option, item.mark);
                  properties.push(processOption(option, item.mark));
                });
              }
              break;

            case "option_default":
              if (propValue != undefined && propValue != null) {
                const defaultProps = processOptionDefault(options, propValue);
                properties = properties.concat(defaultProps);
              }
              break;
            case "option_min":
            case "option_max":
              console.log("option_min", propValue);

              properties.push({
                key: res,
                value:
                  !propValue || propValue == "0" || propValue == 0
                    ? null
                    : propValue,
              });
              break;
            case "upload_size_min":
            case "upload_size_max":
              properties.push({
                key: res,
                value: processUploadSize(res, propValue),
              });
              break;

            default:
              properties.push({
                key: res,
                value: propValue,
              });
          }
        });

        // 处理正则表达式
        let regexPattern = null;
        let regexHint = null;
        if (item.regex) {
          const regexes = this.getRegexes([item.regex]);
          if (regexes && regexes.length > 0) {
            regexPattern = regexes[0].pattern;
            regexHint = regexes[0].hint;
          }
        }

        // 创建字段对象
        const fieldObj = {
          ...item,
          fieldName: item.label,
          fieldType: item.type || null,
          fieldId: item.fieldId || null,
          readonly: item.readonly ? 1 : 0,
          required: item.required ? 1 : 0,
          sort: index,
          properties: properties,
          fieldMappings: item["fieldMappings"] || [],
          childTemplateId: item["childTemplateId"] || null,
        };

        // 添加正则信息（如果有）
        if (regexPattern) {
          fieldObj.regex = regexPattern;
          fieldObj.regexHint = regexHint;
        }

        // 删除不需要的属性
        delete fieldObj.fontId;
        delete fieldObj.outerType;

        templateArr.push(fieldObj);
      });

      if (!checkItem) return returnData;
      returnData = {
        isPass: true,
        data: {
          templateName: this.templateFrom.templateName,
          templateFields: templateArr,
          templateId: this.templateId || null,
          status: 1,
          type: 7,
          structure: "top",
        },
      };
      return returnData;
    },
    // 重置
    reset() {
      this.$confirm("重置后数据将会丢失，确认重置吗？")
        .then((_) => {
          this.setform = {};
          this.formArr = [];
          done();
        })
        .catch((_) => {});
    },
    clearData() {
      this.setform = {};
      this.formArr = [];
      this.templateData = {};
    },
    // 添加表单组件
    addform(i, type = true) {
      console.log("111addform", i);

      let isRepeat = false;
      // 随机生成Id
      let code = createCode();
      this.formArr.map((item) => {
        if (item.fontId == code) {
          isRepeat = true;
        }
      });
      if (isRepeat) {
        this.addform(i);
      } else {
        let obj = {
          ...i,
          fontId: code,
        };

        this.formArr.push(obj);
        this.formArr = JSON.parse(JSON.stringify(this.formArr));
        this.setFormArrValus(obj);
        this.setFormArrRules(obj);
        if (type) {
          this.getCurrentItemForm(obj);
        }
      }
    },

    getCurrentItemForm(data) {
      console.log("getCurrentItemForm", data);

      if (JSON.stringify(this.setform) == JSON.stringify(data)) return;
      this.isActiveForm = true;
      this.setform = data;
      this.setform = JSON.parse(JSON.stringify(this.setform));
      this.$refs["formgeneratorRight"].setFormArrValus(
        this.setform["fieldMappings"] || []
      );
    },
    // 设置模板默认值
    setFormArrValus(data) {
      if (
        data.properties.option_default != undefined &&
        data.type != "datetimepicker"
      ) {
        this.formArrValue[data.fontId] = data.properties.option_default;
        this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
      }
    },
    // 设置模板校验规则
    setFormArrRules(data) {
      // 是否必填,文字
      let regexes = [];
      let requireMsg = "";
      if (data.type == "input" || data.type == "textarea") {
        requireMsg = "请输入";
      } else if (data.type == "upload") {
        requireMsg = "请上传";
      } else {
        requireMsg = "请选择";
      }
      regexes.push({
        required: data.required,
        message: requireMsg,
        trigger: "blur",
      });

      // 设置校验正则
      if (data.regex) {
        let regexesArr = this.getRegexes([data.regex]);
        regexesArr.map((item) => {
          let obj = {
            pattern: item.pattern,
            message: item.hint,
            trigger: "blur",
          };
          regexes.push(obj);
        });
      }
      this.formArrRules[data.fontId] = regexes;
    },
    // 重置
    resetValidate(prop) {
      this.$refs.formArr.validateField(prop);
    },
    //删除
    delThisForm(data) {
      this.formArr.splice(data["index"], 1);
      this.setform = {};
    },
    // 是否多选
    changeSelectMulti(e) {
      console.log("e", e);
      let fontId = this.setform.fontId;
      if (e) {
        this.formArrValue[fontId] = [];
        this.setform.properties.option_default = [];
      } else {
        this.formArrValue[fontId] = "";
        this.setform.properties.option_default = "";
      }
      this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
    },
    // 是否多选
    changeCascader(data) {
      this.setform = {
        ...this.setform,
        fieldMappings: data,
      };
    },
    // 校验动态表单
    checkData(data) {
      let isCheck = true;
      let optionFontId = [];
      if (data.label == "") {
        isCheck = false;
        this.$message.warning(`存在未填写标题,请检查!`);
      }
      switch (data.type) {
        case "radio":
          if (data.properties.option_default != "") {
            optionFontId = this.geoptionFontId(data.properties.option);
            if (!optionFontId.includes(data.properties.option_default)) {
              isCheck = false;
              this.$message.warning(`${data.label}中的默认项需在可选项中选取`);
            }
          }

          break;
        case "checkbox":
          optionFontId = this.geoptionFontId(data.properties.option);
          if (data.properties.option_default != "") {
            data.properties.option_default.map((item) => {
              if (!optionFontId.includes(item)) {
                isCheck = false;
                this.$message.warning(
                  `${data.label}中的默认项需在可选项中选取`
                );
              }
            });
          }
          if (data.properties.option_min && data.properties.option_max) {
            if (data.properties.option_max < data.properties.option_min) {
              isCheck = false;
              this.$message.warning(`${data.label}中的最大数量应大于最小数量`);
            }
          }
          if (data.required) {
            if (data.properties.option_min == 0) {
              isCheck = false;
              this.$message.warning(
                `${data.label}为必填状态时最小复选数应不能为0`
              );
            }
          }

          break;
        case "select":
          if (data.properties.option_multi) {
            if (data.properties.option_default != "") {
              optionFontId = this.geoptionFontId(data.properties.option);
              data.properties.option_default.map((item) => {
                if (!optionFontId.includes(item)) {
                  isCheck = false;
                  this.$message.warning(
                    `${data.label}中的默认项需在可选项中选取`
                  );
                }
              });
            } else {
              if (data.properties.option_default != "") {
                optionFontId = this.geoptionFontId(data.properties.option);
                if (!optionFontId.includes(data.properties.option_default)) {
                  isCheck = false;
                  this.$message.warning(
                    `${data.label}中的默认项需在可选项中选取`
                  );
                }
              }
            }
          }
          break;

        case "upload":
          if (
            data.properties.upload_size_min > data.properties.upload_size_max
          ) {
            isCheck = false;
            this.$message.warning(
              `${data.label}中的单个最小体积应小于单个最大体积`
            );
          }
          if (
            data.properties.upload_size_max > data.properties.upload_size_total
          ) {
            isCheck = false;
            this.$message.warning(
              `${data.label}中的单个最大体积应小于单次最大体积`
            );
          }
          break;
      }
      return isCheck;
    },
    getRegexes(data) {
      let arr = [];
      arr = this.regeList.filter((item) => {
        return data.includes(item.pattern);
      });

      return arr;
    },
    geoptionFontId(data) {
      let arr = [];
      data.map((item) => {
        arr.push(item.id);
      });
      return arr;
    },

    getTemplateList() {
      fetchTypeList("association_table").then((res) => {
        console.log("res.data", res.data);
        let data = res.data.data;
        if (data == null) return;
        let arr = [];
        data.map((item) => {
          if (!item.archived && !item.pid) {
            arr.push(item);
          }
        });
        this.templateList = arr;
        this.templateList.map((item) => {
          item["unique_field"] = data.filter((child) => {
            return item["id"] == child["pid"] && child["remark"] == "1";
          });
          item["other_field"] = data.filter((child) => {
            return item["id"] == child["pid"] && !child["remark"];
          });
        });
        console.log("this.templateList", this.templateList);
      });
    },
    clearTemplate(e) {
      this.templateId = e;
    },
    changeTemplate(e) {
      console.log("changeTemplate", e);
    },
    closeModal() {
      this.showModal = false;
    },
    previewForm() {
      this.previewData = this.formArr.filter((item) => {
        return !item.isHidden;
      });
      this.showModal = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-upload__tip {
  line-height: 16px;
}
/deep/.el-input-number__decrease {
  display: none;
}
/deep/.el-input-number__increase {
  display: none;
}
.formgenerator {
  .formgenerator_left {
    height: 100%;
    flex: 1;
    padding: 0 10px 10px;
    background-color: #fff;
    box-sizing: border-box;
    .formgenerator_template {
      height: 100%;
      display: flex;
      flex-direction: column;
      .formgenerator_title {
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        -webkit-background-clip: text;
        margin-bottom: 20px;
      }
      .formgenerator_item {
        margin-left: 10px;
        margin-bottom: 20px;
        .formgenerator_itemname {
          font-size: 16px;
          line-height: 16px;
          font-weight: 300;
          color: #175e67;
          -webkit-background-clip: text;
          padding-left: 10px;
          position: relative;
          margin-bottom: 20px;
          &::before {
            position: absolute;
            content: "";
            top: 0;
            bottom: 0;
            left: 0;
            width: 2px;
            background: #175e67;
          }
        }
      }
    }
    .formgenerator_form {
      flex: 1;
      height: 580px;
      border: 1px solid #c5d0cf;
      margin-left: 20px;
      background-color: #fff;
      box-sizing: border-box;
    }
  }
}
.template_form {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
