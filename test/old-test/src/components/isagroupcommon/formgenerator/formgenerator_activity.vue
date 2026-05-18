<template>
  <div>
    <div class="formgenerator df_sb" style="height: 700px">
      <div class="df_sb formgenerator_box" style="width: 100%; height: 700px">
        <el-scrollbar class="formgenerator_left">
          <div class="formgenerator_template">
            <div class="formgenerator_form df_fa">
              <!-- 左侧点击添加表单组件 -->
              <FormLeft @addform="addform" />
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
                :disabled="isSubmitting"
                :loading="isSubmitting"
                >{{ $t("consult.保存") }}</el-button
              >
            </div>
          </div>
        </el-scrollbar>
        <!-- 表单属性配置 -->
        <formgeneratorRight
          :setform="setform"
          :setformrules="setformrules"
          :isActiveForm="isActiveForm"
          @changeSelectMulti="changeSelectMulti"
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
import { regeList } from "@/const/space/regex.js";
import { createCode } from "@/util/util.js";
import { rule } from "@/util/validateRules.js";
import {
  dateTimeType,
  setformrules,
  uploadAccept,
} from "./formgeneratorItem_activity/form.js";
// 动态模板
import {
  addTemplate,
  editTemplate,
  getTemplateDetail,
} from "@/api/space/templatedynamic.js";
import { formrules } from "@/util/form.js";
import FormLeft from "./formgeneratorItem_activity/form_left.vue";
import FormRight from "./formgeneratorItem_activity/form_right.vue";
import formgeneratorRight from "./formgeneratorItem_activity/formgenerator_right.vue";
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
      collectionId: "",
      showModal: false,
      previewData: {},
      isSubmitting: false, // 添加防重提交状态
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
  },
  methods: {
    // 初始化数据
    async initData(templateType, id) {
      this.templateType = templateType || "add";
    },

    // 添加动态表单模板
    addTemplateDynamic(data, outerId = null) {
      this.isSubmitting = true;
      addTemplate(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            // this.$message.success("添加成功");
            if (outerId) {
              this.$emit("bindTemplate", res.data.data, outerId);
            } else {
              this.$emit("submitForm", res.data.data);
            }
          } else {
            this.$message.success("添加模板失败");
          }
        })
        .catch((e) => {
          this.isSubmitting = false;
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    //编辑动态表单模板
    editTemplate(data) {
      this.isSubmitting = true;
      editTemplate(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$emit("submitForm", res.data.data);
            //   this.$message.success("已保存编辑");
          }
        })
        .catch((e) => {
          this.isSubmitting = false;
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    //获取动态表单模板详情
    getTemplateDetail(id) {
      if (id == null) return;
      getTemplateDetail(id).then((res) => {
        if (res.data.success) {
          this.templateData.templateFormId = id;
          this.setform = {};
          this.formArr = [];
          let data = res.data.data.fields;
          let sortData = data.sort((a, b) => {
            return a.sort - b.sort;
          });
          sortData.map((item) => {
            let properties = {};
            let option = [];
            let option_default = [];
            item.properties.map((res) => {
              if (res.key == "option") {
                option.push({
                  label: res.label,
                  value: res.value,
                  id: res.id,
                  isHide: res.isHide || 0,
                  fontId: createCode(),
                });
              } else {
                properties[res.key] = res.value;
                if (res.key == "ciphertext") {
                  properties[res.key] = res.value == "true";
                }
                if (res.key == "option_default") {
                  option_default.push(res.value);
                }
                if (res.key == "datetime_type") {
                  let date = dateTimeType.filter((d) => {
                    return res.value == d.datetime_type;
                  });
                  item[res.key] = date[0].type;
                  properties["datetime_pattern"] = date[0].format;
                }
                if (res.key == "upload_file_type") {
                  properties[res.key] = res.value;
                }
                if (res.key == "upload_size_min") {
                  properties[res.key] = res.value / 1024;
                }
                if (res.key == "upload_size_max") {
                  properties[res.key] = res.value / 1024 / 1024;
                }
              }
            });

            properties["option"] = option;
            if (item.type == "checkbox") {
              properties["option_default"] = option_default;
            }
            if (item.type == "radio") {
              properties["option_default"] = String(option_default);
            }
            if (item.type == "select") {
              properties.option_multi = properties.option_multi == "true";
              properties.searchable = properties.searchable == "true";
              properties["option_default"] = !properties.option_multi
                ? String(option_default)
                : option_default;
            }
            item["properties"] = properties;
            this.addform(item);
          });
        }
      });
    },

    // 保存模板
    saveTemplate() {
      if (this.isSubmitting) return; // 防重提交检查

      if (this.formArr.length == 0) {
        this.$message.warning("请至少添加一个组件");
        return;
      }

      if (this.hasTemplateFrom) {
        this.$refs["templateFrom"].validate((valid) => {
          if (valid) {
            this.isSubmitting = true; // 设置提交状态
            this.setFormgeneratorData();
          }
        });
      } else {
        if (this.templateType == "add") {
          // 由父级表单校验通过后再设置 isSubmitting，避免校验未通过时按钮一直 loading
          this.$emit("submitForm");
        } else {
          this.isSubmitting = true; // 设置提交状态
          this.setFormgeneratorData();
        }
      }
    },
    setFormgeneratorData(outerId = null) {
      if (outerId) {
        this.collectionId = outerId;
      }
      let templateArr = [];
      let checkItem = true;
      this.formArr.map((item, index) => {
        if (!this.checkData(item)) {
          checkItem = false;
        }
        if (!checkItem) return;
        let properties = [];
        Object.keys(item.properties).forEach((res) => {
          if (res == "option") {
            if (item.properties[res].length > 0) {
              item.properties[res].map((option) => {
                properties.push({
                  key: res,
                  label: option.label,
                  id: option.id,
                  isHide: option.isHide ? option.isHide : 0,
                  //   value: option.label,
                  value:
                    item["mark"] == "applyschool" ? option.value : option.label,
                });
              });
            }
          } else if (res == "option_default") {
            let isNumber = typeof item.properties[res] != "object";
            let data = isNumber ? [item.properties[res]] : item.properties[res];
            if (data.length === 0) return;
            item.properties["option"].map((option) => {
              data.map((i) => {
                if (i == option.id) {
                  properties.push({
                    key: res,
                    value: option.id,
                  });
                }
              });
            });
          } else if (res == "upload_file_type") {
            properties.push({
              key: res,
              value: item.properties[res],
            });
          } else if (res == "upload_size_min") {
            properties.push({
              key: res,
              value: item.properties[res] * 1024,
            });
          } else if (res == "upload_size_max") {
            properties.push({
              key: res,
              value: item.properties[res] * 1024 * 1024,
            });
          } else {
            properties.push({
              key: res,
              value: item.properties[res],
            });
          }
        });
        if (item.regex) {
          let regexes = this.getRegexes([item.regex]);
          item["regex"] = regexes[0].pattern;
          item["regexHint"] = regexes[0].hint;
        }
        let obj = {
          ...item,
          sort: index,
          properties: properties,
        };
        delete obj.fontId;
        delete obj.outerType;
        templateArr.push(obj);
      });
      if (!checkItem) {
        this.isSubmitting = false; // 校验失败，重置提交状态
        return;
      }

      let data = {
        label: this.templateFrom.templateName,
        fields: templateArr,
        structure: "top",
      };
      // return;
      if (this.templateType == "add") {
        this.addTemplateDynamic(data, outerId);
      } else if (this.templateType == "edit") {
        if (this.templateData.templateFormId) {
          data["id"] = this.templateData.templateFormId;
          this.editTemplate(data);
        } else {
          this.addTemplateDynamic(data);
        }
      }
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
    addform(i) {
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
        this.getCurrentItemForm(obj);
        this.setFormArrRules(obj);
      }
    },

    getCurrentItemForm(data) {
      if (JSON.stringify(this.setform) === JSON.stringify(data)) return;
      this.isActiveForm = true;
      this.setform = data;
      this.setform = JSON.parse(JSON.stringify(this.setform));
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
            if (data.properties.option_min === 0) {
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

    closeModal() {
      this.showModal = false;
    },
    previewForm() {
      this.previewData = this.formArr.filter((item) => {
        return !item.isHide;
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
