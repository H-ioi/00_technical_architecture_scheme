<template>
  <div class="form-questionnaire">
    <el-form
      v-loading="loadingFrom"
      :label-position="'top'"
      :inline="true"
      :model="formArrValue"
      :rules="formRules"
      ref="form"
    >
      <div style="width: 100%" v-for="(item, index) in formArr" :key="index">
        <el-form-item
          v-if="!item.isHide"
          :label="item.label"
          :prop="item.id"
          :ref="item.id"
          :style="`width:100%`"
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
            :maxlength="200"
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
              v-for="i in item.properties.option"
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
              v-for="i in item.properties.option"
              :key="i.id"
              :disabled="item.disabled"
              :readonly="item.readonly"
              :label="i.id"
              >{{ i.label }}</el-checkbox
            >
          </el-checkbox-group>
          <!-- 下拉选框 -->
          <el-select
            popper-class="questionnaire-select-picker"
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
            <div v-for="(i, k) in item.properties.option" :key="k">
              <el-option v-if="!i.isHide" :label="i.label" :value="i.id"> </el-option>
            </div>
          </el-select>
          <!-- 时间选择器 -->
          <el-date-picker
            v-if="item.type == 'datetimepicker'"
            popper-class="questionnaire-datetime-picker"
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
                if (!item.properties.datetime_begin && !item.properties.datetime_end) {
                  return false;
                } else if (
                  !item.properties.datetime_begin &&
                  item.properties.datetime_end
                ) {
                  return (
                    time.getTime() >= Date.parse(new Date(item.properties.datetime_end))
                  );
                } else if (
                  item.properties.datetime_begin &&
                  !item.properties.datetime_end
                ) {
                  return (
                    time.getTime() <= Date.parse(new Date(item.properties.datetime_begin))
                  );
                } else {
                  return !(
                    Date.parse(new Date(item.properties.datetime_begin)) <=
                      time.getTime() &&
                    time.getTime() <= Date.parse(new Date(item.properties.datetime_end))
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
              class="upload-demo uploadH5"
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
      </div>
    </el-form>
  </div>
</template>

<script>
// 动态模板
import {
  getTemplateDetail,
  addDynamic,
  editDynamic,
  getDynamicDetail,
  getDynamicDetailList,
} from "@/api/space/templatedynamic.js";
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
import {
  uploadFile,
  getFiles,
  downloadFile,
  uploadOuterFile,
  downloadOuterFile,
} from "@/api/upload/index.js";
import { download } from "@/util/download.js";
import { regeList } from "@/const/space/regex.js";
import { deepClone } from "@/util/util";
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
    getDynamicDetail(id) {
      if (id == null) return;
      this.type = "edit";
      this.formDataId = id;
      getDynamicDetail(id).then((res) => {
        if (res.data.success) {
          this.reSetDynamic(res.data.data);
        }
      });
    },
    reSetDynamic(data) {
      let { fields, id, templateFormId } = data;
      let dynamicFields = fields.filter((item) => {
        return item["type"] != "association";
      });
      dynamicFields.map((item) => {
        let fromItem = this.formArr.filter((k) => {
          return k.id == item.templateFormFieldId;
        });
        if (fromItem.length === 0) return;
        console.log("fromItem", fromItem);
        let option_multi = fromItem[0].properties.option_multi;
        let option = fromItem[0].properties.option;
        let idArr = [];
        let type = fromItem[0].type;
        if (type == "select" || type == "checkbox") {
          if (type == "checkbox") {
            option_multi = true;
          }
          // 截取id字符串专换成数组
          let value = item.value.substring(1, item.value.length - 1).split(",");
          //查询id值是否在可选择值中
          option.map((o) => {
            if (value.includes(o.id) && !o.isHide) {
              idArr.push(o.id);
            }
          });
          this.formArrValue[item.templateFormFieldId] = option_multi
            ? idArr
            : String(idArr);
        } else if (type == "datetimepicker") {
          let date = JSON.parse(item.value);
          let datetime_type = fromItem[0].properties.datetime_type;
          let isArr = false;
          dateTimeType.map((d) => {
            if (datetime_type == d.type) {
              isArr = d.isArr;
            }
          });
          this.formArrValue[item.templateFormFieldId] = isArr ? date : String(date);
        } else if (type == "upload") {
          let ids = JSON.parse(item.value);
          if (ids.length === 0) return;
          getFiles({ ids }).then((res) => {
            console.log("res", res);
            if (res.data.success) {
              let data = res.data.data;
              let list = [];
              data.map((file) => {
                let obj = {
                  name: file.originalName,
                  id: file.id,
                };
                list.push(obj);
              });
              this.formArrValue[item.templateFormFieldId] = list;
              this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
            }
          });
        } else {
          this.formArrValue[item.templateFormFieldId] = item.value;
        }
        this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
        console.log("  this.formArrValue ", this.formArrValue);
      });
    },
    saveFormArrValue() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (!this.checkData()) return;
            let fields = [];
            let fromData = deepClone(this.formArrValue);
            Object.keys(fromData).forEach((res) => {
              let obj = {};
              obj["templateFormFieldId"] = res;
              let item = this.formArr.filter((item) => {
                return item.id == res;
              });
              if (item[0].type == "select" && !item[0].properties.option_multi) {
                fromData[res] = [fromData[res]];
              }
              if (item[0].type == "datetimepicker" && typeof fromData[res] == "string") {
                fromData[res] = [fromData[res]];
              } else {
                obj["value"] = JSON.stringify(fromData[res]);
              }
              if (item[0].type == "upload") {
                let ids = [];
                fromData[res].map((s) => {
                  ids.push(s.id);
                });
                obj["value"] = JSON.stringify(ids);
              } else {
                obj["value"] =
                  typeof fromData[res] != "string"
                    ? JSON.stringify(fromData[res])
                    : fromData[res];
              }
              console.log("obj", obj);
              obj["value"] = obj["value"] == "null" ? "" : obj["value"];
              fields.push(obj);
            });
            let data = {
              fields,
              templateFormId: this.templateFormId,
            };
            console.log("data", data);
            // return;
            if (this.type == "add") {
              resolve(await this.addDynamic(data));
            } else if (this.type == "edit") {
              resolve(await this.editDynamic(data));
            } else if (this.type == "questionnaire") {
              this.$emit("signUpCollection", data);
            }
          }
        });
      });
    },
    //获取动态表单模板详情
    getTemplateDetail(id, fromId) {
      if (id == null) return;
      this.loadingFrom = true;
      this.templateFormId = id;
      //   this.clear();
      getTemplateDetail(id)
        .then((res) => {
          if (res.data.success) {
            this.loadingFrom = false;
            this.reSetForm(res);
          } else {
            this.loadingFrom = false;
          }
        })
        .catch(() => {
          this.loadingFrom = false;
        });
    },
    reSetForm(res) {
      let data = res.data.data.fields;
      this.formArr = [];
      let sortData = data.sort((a, b) => {
        return a.sort - b.sort;
      });
      sortData = data.filter((item) => {
        return item["type"] != "association";
      });
      sortData.map((item) => {
        // this.setFormArrRules(item);
        let properties = {};
        let option = [];
        let option_default = [];
        item.properties.map((res) => {
          if (res.key == "option" && !res.isHide) {
            option.push({
              label: res.label,
              id: res.id,
              isHide: res.isHide,
            });
          } else {
            if (res.key == "option_default") {
              option_default.push(res.value);
            } else {
              properties[res.key] = res.value;
            }
            if (res.key == "datetime_type") {
              let date = dateTimeType.filter((d) => {
                return res.value == d.datetime_type;
              });
              properties[res.key] = date[0].type;
              properties["datetime_pattern"] = date[0].format;
            }
            if (res.key == "upload_file_type") {
              properties[res.key] = res.value.split("+");
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
        if (item.type == "upload") {
          this.formArrValue[item.id] = [];
        }
        item["properties"] = properties;

        console.log("item", item);
        this.formArr.push(item);
        this.setCurrentItemForm(item);
      });
    },
    // 设置当前的点击的组件信息
    setCurrentItemForm(data) {
      // console.log("data", data);
      // 设置默认值
      if (data.properties.option_default) {
        this.formArrValue[data.id] = data.properties.option_default;
        this.formArrValue = JSON.parse(JSON.stringify(this.formArrValue));
      }
      let requireMsg = "";
      let regexes = [];
      if (data.type == "input" || data.type == "textarea") {
        requireMsg = "请输入";
      } else if (data.type == "upload") {
        requireMsg = "请上传";
      } else {
        requireMsg = "请选择";
      }
      // 设置校验规则
      regexes.push({
        required: data.required && !data.isHide,
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
      this.formRules[data.id] = regexes;
    },
    getRegexes(data) {
      let arr = [];
      arr = this.regeList.filter((item) => {
        return data.includes(item.pattern);
      });

      return arr;
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
    downFile(file) {
      downloadFile(file.id).then((res) => {
        download(res.data, res.headers["content-disposition"]);
      });
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
