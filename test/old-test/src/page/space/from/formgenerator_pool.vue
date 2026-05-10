<template>
  <el-scrollbar style="height: 100%">
    <div class="formgenerator thepool_page" style="height: 100%">
      <div class="formgenerator_item" v-if="hasTemplateFrom">
        <!-- <div class="formgenerator_itemname">基本属性</div> -->
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="templateFrom"
          :rules="templateRule"
          ref="templateFrom"
        >
          <el-form-item
            :label="$t('consult.中文名')"
            prop="label"
            style="margin: 0 20px 0 0 !important"
          >
            <el-input
              style="width: 380px"
              v-model="templateFrom.label"
              :placeholder="$t('consult.请输入')"
              :maxlength="32"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('consult.英文名')"
            prop="enlabel"
            style="margin: 0"
          >
            <el-input
              style="width: 380px"
              v-model="templateFrom.enlabel"
              :placeholder="$t('consult.请输入')"
              :maxlength="32"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="备注" prop="mark" style="margin: 0; width: 100%">
            <el-input
              type="textarea"
              :rows="4"
              style="width: 100%"
              v-model="templateFrom.mark"
              :placeholder="$t('consult.请输入')"
              :maxlength="300"
            ></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <div
        class="df_sb formgenerator_box"
        :style="`height:${!hasTemplateFrom ? '100%' : 'calc(100% - 80px)'}; `"
      >
        <div class="formgenerator_left">
          <div class="formgenerator_template">
            <div class="formgenerator_form df_fa" style="margin-left: 0">
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
                type="primary"
                size="medium"
                round
                @click="saveTemplate"
                >{{ $t("consult.保存") }}</el-button
              >
            </div>
          </div>
        </div>
        <!-- 表单属性配置 -->
        <formgeneratorRight
          ref="formgeneratorRight"
          :setform="setform"
          :setformrules="setformrules"
          :isActiveForm="isActiveForm"
          @changeSelectMulti="changeSelectMulti"
          @setFieldMapping="setFieldMapping"
          @changeCascader="changeCascader"
        />
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import {
  formlist,
  dateTimeType,
  uploadAccept,
  setformrules,
} from "./formgeneratorItem_pool/form.js";
import { regeList } from "@/const/space/regex.js";
import { createCode, deepClone } from "@/util/util.js";
import { rule } from "@/util/validateRules.js";
// 动态模板
import {
  addCollection,
  getTemplateDetail,
  getTemplateRegex,
} from "@/api/space/templatedynamic.js";
import {
  addTemplate,
  editTemplate,
  getTemplateInfo,
} from "@/api/consult/template.js";
import FormLeft from "./formgeneratorItem_pool/form_left.vue";
import FormRight from "./formgeneratorItem_pool/form_right.vue";
import formgeneratorRight from "./formgeneratorItem_pool/formgenerator_right.vue";
import { formrules } from "@/util/form.js";

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
    formData: {
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
      templateFrom: { label: "", enlabel: "", mark: "" },
      templateRule: {
        label: [{ required: true, message: "请输入", trigger: "blur" }],
        enlabel: [{ required: true, message: "请输入", trigger: "blur" }],
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
    this.init();
  },
  methods: {
    // 初始化数据
    async init() {},

    // 添加动态表单模板
    addTemplateDynamic(data) {
      addTemplate(data).then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功");
          if (this.formData["scene"] == "3") {
            this.templateType = "edit";
            this.templateData.templateFormId = res.data.data;
          } else {
            this.blackPath();
          }
        } else {
          this.$message.success("添加模板失败");
        }
      });
    },
    //编辑动态表单模板
    editTemplate(data) {
      editTemplate(data).then((res) => {
        if (res.data.success) {
          this.$message.success("已保存编辑");
          this.blackPath();
        }
      });
    },
    blackPath() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      switch (this.formData["scene"]) {
        case "3":
          this.$router.push("/thepool/template/clue");
          break;
        case "1":
          this.$router.push("/thepool/template/student");
          break;
        case "2":
          this.$router.push("/thepool/template/guardian");
          break;
      }
    },
    //获取动态表单模板详情
    getTemplateDetail(id) {
      if (id == null) return;

      getTemplateInfo({ templateId: id }).then((res) => {
        if (res.data.success) {
          this.templateData.templateFormId = id;
          this.setform = {};
          this.formArr = [];
          let { templateName, templateNameEn } = res.data.data;
          this.templateFrom = {
            ...this.templateFrom,
            label: templateName || "模板表单",
            enlabel: templateNameEn || "Template Form",
          };
          let data = res.data.data.templateFields;
          let sortData = data.sort((a, b) => {
            return a.sort - b.sort;
          });
          sortData.map((item) => {
            let properties = {};
            let option = [];
            let option_default = [];
            item["label"] = item.fieldName;
            item["type"] = item.fieldType;
            item["fieldId"] = item.fieldId;
            item["fieldNameEn"] = item.fieldNameEn;
            item["fieldCode"] = item.fieldCode;
            item["readonly"] = item.readonly ? true : false;
            item["disabled"] = item.disabled ? true : false;
            item["fieldMappings"] = item["fieldMappings"] || [];
            item.properties = item.properties || [];
            item.properties.map((res) => {
              if (res.key == "option") {
                option.push({
                  label: res.label,
                  value: res.value,
                  id: res.id,
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
            this.addform(item, false);
          });
        }
      });
    },

    // 保存模板
    saveTemplate() {
      if (this.formArr.length == 0) {
        this.$message.warning("请至少添加一个组件");
        return;
      }
      console.log("this.hasTemplateFrom", this.hasTemplateFrom);

      if (this.hasTemplateFrom) {
        this.$refs["templateFrom"].validate((valid) => {
          if (valid) {
            this.setFormgeneratorData();
          }
        });
      } else {
        this.setFormgeneratorData();
      }
    },
    setFormgeneratorData() {
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
                console.log("option", option);

                let customId =
                  String(option.id).indexOf("-") > -1 ? null : option.id;
                properties.push({
                  key: res,
                  label: option.label,
                  id: customId,
                  value: option.label,
                });
              });
            }
          } else if (res == "option_default") {
            let isNumber = typeof item.properties[res] != "object";
            let data = isNumber ? [item.properties[res]] : item.properties[res];
            if (data.length == 0) return;
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
          //   ...item,
          fieldName: item.label,
          fieldType: item.type,
          fieldId: item.fieldId || "",
          fieldNameEn: item.fieldNameEn || "",
          fieldCode: item.fieldCode || "",
          labelVisible: item.labelVisible,
          readonly: item.readonly ? 1 : 0,
          required: item.required ? 1 : 0,
          sort: index,
          properties: properties,
          fieldMappings: item["fieldMappings"] || [],
        };
        delete obj.fontId;
        templateArr.push(obj);
      });
      if (!checkItem) return;
      let data = {
        type: this.formData["scene"], //场景 0-普通模板 1-学生模板 2-家长模板 3-线索模板 4-学生 5-家长 6-线索 7-信息收集表
        typeId: this.formData["typeId"], //关联类型id 如校区id，学生id，线索id
        templateName: this.templateFrom.label
          ? this.templateFrom.label
          : "模板表单",
        templateNameEn: this.templateFrom.enlabel
          ? this.templateFrom.enlabel
          : "Template Form",
        templateFields: templateArr,
        structure: "top",
      };
      if (this.templateType == "add") {
        this.addTemplateDynamic(data);
      } else if (this.templateType == "edit") {
        data["templateId"] = this.templateData.templateFormId;
        this.editTemplate(data);
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
    addform(i, type = true) {
      // 检查 this.formArr是否重复添加autoFill组件
      let hasAutoFill = false;
      this.formArr.map((item) => {
        if (item.type == "autoFill") {
          hasAutoFill = true;
        }
      });
      if (hasAutoFill) {
        this.$message.error("不能重复添加手机号组件");
        return;
      }
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
      console.log("data", data, this.formArr);
      if (JSON.stringify(this.setform) == JSON.stringify(data)) return;
      this.isActiveForm = true;
      this.setform = data;
      this.setform = JSON.parse(JSON.stringify(this.setform));
      if (this.setform["type"] != "upload") {
        this.$refs["formgeneratorRight"].setFieldMapping(
          this.setform["fieldMappings"] || []
        );
      }
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
    delThisForm(index) {
      this.formArr.splice(index, 1);
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
    setFieldMapping(data) {
      this.setform = {
        ...this.setform,
        fieldMappings: data,
      };
    },
    changeCascader(data) {
      this.setform = {
        ...this.setform,
        fieldMappings: data,
      };
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
      //   display: flex;
      //   flex-direction: column;
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
      //   flex: 1;
      //   max-height: auto !important;
      border: 1px solid #c5d0cf;
      margin-left: 20px;
      background-color: #fff;
      height: calc(100% - 60px);
    }
  }
}
</style>
