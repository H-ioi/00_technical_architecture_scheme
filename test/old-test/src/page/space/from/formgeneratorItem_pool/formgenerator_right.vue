<template>
  <div class="formgenerator_right">
    <div class="formgenerator_right_title">
      {{ $t("consult.字段内容编辑") }}
    </div>

    <el-scrollbar class="formgenerator_right_scrollbar">
      <el-form
        v-show="isActiveForm"
        :label-position="'top'"
        :inline="true"
        :model="setform"
        :rules="setformrules"
        ref="setform"
      >
        <div v-if="setform.type != undefined">
          <el-form-item :label="$t('consult.标题')" prop="label">
            <el-input
              v-model="setform.label"
              :placeholder="$t('consult.请输入')"
            ></el-input
          ></el-form-item>
          <el-form-item
            v-if="setform.type != 'title'"
            :label="$t('consult.英文名')"
            prop="fieldNameEn"
          >
            <el-input
              v-model="setform.fieldNameEn"
              :placeholder="$t('consult.请输入')"
            ></el-input
          ></el-form-item>
          <el-form-item
            v-if="setform.type != 'title'"
            :label="$t('consult.字段编码')"
            prop="fieldCode"
          >
            <el-input
              v-model="setform.fieldCode"
              :placeholder="$t('consult.请输入')"
            ></el-input
          ></el-form-item>
          <el-form-item
            v-if="
              setform.type == 'input' ||
              setform.type == 'textarea' ||
              setform.type == 'select' ||
              setform.type == 'sign'
            "
            :label="$t('consult.占位文本')"
            prop="placeholder"
          >
            <el-input
              v-model="setform.properties.placeholder"
              :placeholder="$t('consult.请输入')"
            ></el-input
          ></el-form-item>
          <el-form-item
            v-if="setform.type == 'protocol'"
            :label="$t('consult.协议内容')"
            prop="placeholder"
          >
            <el-input
              v-model="setform.properties.placeholder"
              :placeholder="$t('consult.请输入')"
              type="textarea"
              rows="20"
            ></el-input
          ></el-form-item>
          <el-form-item
            v-if="setform.type != 'title'"
            label="是否必填"
            prop="require"
          >
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="setform.required"
              @change="changeRequired"
            >
            </el-switch
          ></el-form-item>
          <el-form-item
            v-if="setform.type != 'title'"
            :label="$t('consult.是否隐藏')"
            prop="isHidden"
          >
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="setform.isHidden"
            >
            </el-switch
          ></el-form-item>
        </div>

        <div v-if="setform.type == 'textarea'">
          <el-form-item :label="$t('consult.显示行数')" prop="rows">
            <el-input-number
              controls-position="right"
              :min="2"
              v-model="setform.properties.text_num_line"
              label="显示行数"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item :="最大输入长度" prop="maxlength">
            <el-input-number
              label="最大输入长度"
              controls-position="right"
              :min="0"
              v-model="setform.properties.text_num_column"
            >
            </el-input-number
          ></el-form-item>
        </div>

        <div
          v-if="
            setform.type == 'radio' ||
            setform.type == 'checkbox' ||
            setform.type == 'select'
          "
        >
          <el-form-item :label="$t('consult.默认选项')" prop="default">
            <el-select
              style="width: 100%"
              clearable
              @change="changeOptionDefault"
              :multiple="
                setform.type == 'radio'
                  ? false
                  : setform.type == 'checkbox'
                  ? true
                  : setform.properties.option_multi
              "
              v-model="setform.properties.option_default"
              :placeholder="$t('consult.请选择')"
            >
              <el-option
                v-for="(i, k) in setform.properties.option"
                :key="k"
                :label="i.label"
                :value="i.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('consult.选项配置')" prop="option">
            <el-input
              style="margin-bottom: 10px"
              v-for="(i, k) in setform.properties.option"
              :key="k"
              v-model="setform.properties.option[k].label"
              :placeholder="$t('consult.请输入')"
            >
              <i
                slot="suffix"
                @click="deloption(i, k)"
                v-if="setform.properties.option.length > 1"
                style="color: #ee1212; font-size: 24px"
                class="el-input__icon el-icon-remove"
              ></i>
            </el-input>
            <span class="addoption" @click="addoption">{{
              $t("consult.添加选项")
            }}</span>
          </el-form-item>
        </div>
        <div v-if="setform.type == 'checkbox'">
          <el-form-item :label="$t('consult.最小复选数')" prop="min">
            <el-input-number
              :label="$t('consult.最小复选数')"
              controls-position="right"
              min="0"
              v-model="setform.properties.option_min"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item :label="$t('consult.最大复选数')" prop="max">
            <el-input-number
              :label="$t('consult.最大复选数')"
              controls-position="right"
              min="0"
              v-model="setform.properties.option_max"
            >
            </el-input-number>
          </el-form-item>
        </div>
        <div v-if="setform.type == 'datetimepicker'">
          <el-form-item :label="$t('consult.选择器类型')" prop="datepickerType">
            <el-select
              v-model="setform.datetime_type"
              :placeholder="$t('consult.请选择')"
              @change="changeDatetimepicker"
            >
              <el-option
                v-for="item in dateTimeType"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('consult.可选起始时间')"
            prop="datetime_begin"
          >
            <el-date-picker
              v-model="setform.properties.datetime_begin"
              type="datetime"
              :placeholder="$t('consult.开始')"
              :value-format="'yyyy-MM-dd HH:mm'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('consult.可选结束时间')" prop="datetime_end">
            <el-date-picker
              v-model="setform.properties.datetime_end"
              type="datetime"
              :placeholder="$t('consult.结束')"
              :value-format="'yyyy-MM-dd HH:mm'"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="setform.type == 'upload'">
          <el-form-item :label="$t('consult.接收文件类型')" prop="accept">
            <el-select
              v-model="setform.properties.upload_file_type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in uploadAccept"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('consult.上传总数量')" prop="limit">
            <el-input-number
              controls-position="right"
              :min="1"
              v-model="setform.properties.upload_num"
              label="上传总数量"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item :label="$t('consult.单个最小体积(KB)')" prop="minsize">
            <el-input-number
              controls-position="right"
              :min="0.000001"
              v-model="setform.properties.upload_size_min"
              label="单个最小体积"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item :label="$t('consult.单个最大体积(M)')" prop="maxsize">
            <el-input-number
              controls-position="right"
              :min="1"
              v-model="setform.properties.upload_size_max"
              label="单个最大体积"
            >
            </el-input-number>
          </el-form-item>
        </div>
        <div v-if="setform.type == 'input' || setform.type == 'textarea'">
          <el-form-item :label="$t('consult.正则校验')" prop="regexes">
            <el-select
              style="width: 100%"
              v-model="setform.regex"
              filterable
              clearable
              :placeholder="$t('consult.请选择')"
              @clear="clearableRegexes"
            >
              <el-option
                v-for="(item, index) in regeList"
                :key="index"
                :label="item.label"
                :value="item.pattern"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div
          v-if="
            setform.type != 'upload' &&
            queryInfo['scene'] == '1' &&
            setform.type != 'protocol' &&
            setform.type != 'sign' &&
            setform.type != 'title'
          "
        >
          <el-form-item label="映射属性" prop="fieldMapping">
            <el-select
              style="width: 100%"
              clearable
              filterable
              v-model="fieldMapping"
              :placeholder="$t('consult.请选择')"
              @change="changeFieldMapping"
            >
              <el-option
                v-for="(i, k) in mappingFieldInfo"
                :key="k"
                :label="i.fieldName"
                :value="i.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="queryInfo['scene'] == '8' || setform.type != 'title'">
          <el-form-item label="关联属性" prop="fieldMappings">
            <el-cascader
              ref="cascader"
              class="selectchannlemultiple"
              style="width: 100%; height: 32px"
              collapse-tags
              :props="{
                multiple: true,
                checkStrictly: true,
                label: 'fieldName',
                children: 'fieldList',
                value: 'id',
                emitPath: false,
              }"
              :options="cascaderOptions"
              v-model="cascaderValue"
              @change="changeCascader()"
              @clear="clearCascader"
            ></el-cascader>
          </el-form-item>
        </div>
        <div v-if="setform.type == 'banner'">
          <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :limit="10"
            :file-list="setform.properties.option"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过20M
            </div>
          </el-upload>
        </div>
        <el-form-item :label="$t('consult.备注')" prop="placeholder">
          <el-input
            v-model="setform.placeholder"
            :placeholder="$t('consult.请输入')"
            type="textarea"
            rows="20"
          ></el-input
        ></el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
import { regeList } from "@/const/space/regex.js";
import { createCode, deepClone } from "@/util/util.js";
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
import { getMappingFieldInfo } from "@/api/consult/template.js";
import { upOuterFile } from "@/api/upload/index.js";
export default {
  props: {
    setform: Object,
    setformrules: Object,
    isActiveForm: Boolean,
  },
  data() {
    return {
      regeList: regeList,
      dateTimeType: dateTimeType,
      uploadAccept: uploadAccept,
      formlist: formlist,
      fieldMapping: "",
      mappingFieldInfo: [],
      queryInfo: { scene: null, typeId: null },
      // 子表单关联属性
      cascaderFieldInfo: {},
      cascaderOptions: [],
      cascaderValue: [],
    };
  },
  created() {
    this.getMappingFieldInfo();
    // this.getchildFieldInfo();
  },
  methods: {
    async getchildFieldInfo() {
      this.cascaderFieldInfo = await getMappingFieldInfo();
      this.cascaderFieldInfo.map((item) => {
        let firstLeave = {};
        let infoList = item["infoList"];
        if (item["schoolId"] == "0") {
          infoList.map((info) => {
            let baseForm = {};
            let fieldList = info["fieldList"].map((field) => {
              return {
                ...field,
                type: info["fieldType"],
              };
            });
            if (info["fieldType"] == "2" && info["type"] == "2") {
              baseForm = {
                fieldName: "家长动态表单",
                type: "parentForm",
                value: "parentForm",
                disabled: true,
                fieldType: "parentForm",
                formType: "parentForm",
                fieldList: fieldList,
              };
              this.cascaderOptions.push(baseForm);
            } else {
              switch (info["type"]) {
                case 2:
                  baseForm = {
                    fieldName: "家长基础字段",
                    type: "baseParentForm",
                    value: "baseParentForm",
                    disabled: true,
                    fieldType: "baseParentForm",
                    formType: "baseParentForm",
                    fieldList: fieldList,
                  };
                  this.cascaderOptions.push(baseForm);
                  break;
              }
            }
          });
        }
      });
      console.log(" this.cascaderOptions", this.cascaderOptions);
    },
    async getMappingFieldInfo() {
      console.log("this.$route", this.$route);
      let { query, path, fullPath } = this.$route;
      if (fullPath == "/thepool/activity/guardianchild") {
        this.queryInfo["scene"] = "8";
        this.queryInfo["typeId"] = "0";
      } else {
        this.queryInfo = query;
      }

      if (this.queryInfo["scene"] == "1") {
        let list = await getMappingFieldInfo(this.queryInfo["scene"]);
        list.forEach((item) => {
          if (item["schoolId"] == this.queryInfo["typeId"]) {
            const infoList = item["infoList"];
            infoList.map((info) => {
              if (info["type"] == this.queryInfo["scene"]) {
                this.mappingFieldInfo = [
                  ...this.mappingFieldInfo,
                  ...info["fieldList"],
                ];
              }
            });
          }
        });
      }
      if (this.queryInfo["scene"] == "8") {
        this.getchildFieldInfo();
      }
    },
    // 增加字典值
    addoption() {
      let obj = {
        label: `选项`,
        id: Number(`-${createCode()}`),
      };

      this.setform.properties.option.push(obj);
    },
    // 删除字典值
    deloption(i, k) {
      this.setform.properties.option.splice(k, 1);
      let data = this.setform.properties.option_default;
      switch (this.setform.type) {
        case "radio":
          if (data == i.id) {
            this.setform.properties.option_default = "";
          }
          break;
        case "checkbox":
          this.setform.properties.option_default = [];
          break;
        case "select":
          let option_multi = this.setform.properties.option_multi;
          if (option_multi) {
            this.setform.properties.option_default = [];
          } else {
            this.setform.properties.option_default = "";
          }
          break;
      }
    },
    // 是否只读
    changeReadonly(e) {
      if (this.setform.required && e) {
        this.setform.required = false;
        this.$nextTick(() => {
          let currentItem = document.getElementById(this.setform.fontId);
          currentItem.classList.remove("is-required");
        });
      }
    },
    // 是否必填
    changeRequired(e) {
      console.log("e", e);
      if (this.setform.readonly && e) {
        this.setform.readonly = false;
      }
      if (!e) {
        this.$nextTick(() => {
          let currentItem = document.getElementById(this.setform.fontId);
          currentItem.classList.remove("is-required");
        });
      }
    },

    // 是否多选
    changeSelectMulti(e) {
      this.$emit("changeSelectMulti", e);
    },
    // 改变日期选择器类型
    changeDatetimepicker(e) {
      console.log("changeDatetimepicker", e);
      let data = this.dateTimeType.filter((item) => {
        return item.type == e;
      });
      this.setform.properties.datetime_pattern = data[0].format;
      this.setform.properties.datetime_type = data[0].datetime_type;
      this.setform.datetime_type = data[0].type;
      console.log("  this.setform", this.setform);
    },
    clearableRegexes() {
      this.setform.regex = "";
      this.setform.regexHint = "";
    },
    changeFieldMapping(e) {
      this.$emit("setFieldMapping", e ? [{ type: 1, typeId: e }] : []);
    },
    setFieldMapping(data) {
      if (this.queryInfo["scene"] == "8") {
        this.$nextTick(() => {
          if (data.length > 0) {
            this.cascaderValue = data.map((item) => item.typeId);
          } else {
            this.cascaderValue = [];
          }
        });
      } else {
        if (data.length == 0) {
          this.fieldMapping = "";
        } else {
          this.fieldMapping = data[0].typeId;
        }
      }
    },
    changeCascader(event) {
      let checkedNodes = this.$refs.cascader.getCheckedNodes();
      let fieldMappings = [];
      if (checkedNodes.length > 0) {
        checkedNodes.map((item) => {
          fieldMappings.push({
            type: item["data"]["type"], //0-基础字段  1-oa 2-动态模板
            typeId: item["data"]["id"], //绑定id
          });
        });
      }
      this.$emit("changeCascader", fieldMappings);
      console.log("changeCascader", fieldMappings, checkedNodes);
    },
    clearCascader() {},
    // 上传文件
    async beforeUpload(file) {
      console.log("beforeUpload", file);

      let isJPGOrPNG = file.type == "image/jpeg" || file.type == "image/png";
      if (!isJPGOrPNG) {
        this.$message.error("只能上传jpg/png文件");
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        this.$message.error("上传文件大小不能超过20MB");
        return false;
      }
      let formData = new FormData();
      formData.append("tenantId", "2");
      formData.append("file", file);
      const res = await upOuterFile(formData);
      if (res.data.success) {
        const localUrl = URL.createObjectURL(file);
        console.log("uploadFile", res, localUrl);
        let obj = {
          label: res.data.data,
          name: file.name,
          id: null,
          url: localUrl,
        };
        this.setform.properties.option.push(obj);
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.setform.properties.option = fileList;
    },
    handlePreview(file) {
      window.open(file.url, "_blank");
    },
    changeOptionDefault(e) {
      switch (this.setform.type) {
        case "radio":
          this.setOddOptionDefault(e);
          break;
        case "checkbox":
          this.setMultipleOptionDefault(e);
          break;
        case "select":
          if (this.setform.properties.option_multi) {
            this.setMultipleOptionDefault(e);
          } else {
            this.setOddOptionDefault(e);
          }
          break;
      }
    },
    setOddOptionDefault(e) {
      let id = e || "";
      this.setform.properties.option.forEach((item, index) => {
        if (id == item.id) {
          this.$set(this.setform.properties.option, index, {
            ...item,
            optionDefault: 1,
          });
        } else {
          this.$set(this.setform.properties.option, index, {
            ...item,
            optionDefault: 0,
          });
        }
      });
    },
    setMultipleOptionDefault(e) {
      let ids = e || [];
      this.setform.properties.option.forEach((item, index) => {
        if (ids.includes(item.id)) {
          this.$set(this.setform.properties.option, index, {
            ...item,
            optionDefault: 1,
          });
        } else {
          this.$set(this.setform.properties.option, index, {
            ...item,
            optionDefault: 0,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formgenerator_right {
  width: 360px;
  padding-bottom: 20px;
  height: 100%;
  background: #fcfcfc;
  box-shadow: rgba(23, 94, 103, 0.2) 26px 0px 32px -30px inset;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .formgenerator_right_title {
    font-size: 16px;
    font-weight: bold;
    color: #666666;
    padding: 20px 30px;
    border-bottom: 1px solid #cccccc;
  }
  .formgenerator_right_scrollbar {
    flex: 1;
    padding: 40px 30px 0;
    .el-form {
      .el-form-item {
        width: 100%;
        margin-right: 0;
      }
    }
  }
}

// .option::before {
//   text-align: center;
//   padding: 2px;
//   box-sizing: border-box;
//   background: #ee1212;
//   cursor: pointer;
//   border-radius: 50%;
//    font-size: 16px;
// }
.addoption {
  font-size: 14px;
  font-weight: 400;
  color: #ba8e62;
  cursor: pointer;
}
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
