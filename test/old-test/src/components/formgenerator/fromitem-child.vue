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
          v-if="!item.showHidden"
          :label="item.type == 'banner' ? '' : item.label"
          :prop="item.id"
          :ref="item.id"
          :style="`width:100%`"
          :class="[
            'list-complete-item',
            {
              'is-required': item.required,
            },
            {
              'is-title': item.type == 'title',
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
            @change="resetFields($event, item)"
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
            @change="resetFields($event, item)"
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
            @change="resetFields($event, item)"
          >
            <div v-for="(i, k) in item.properties.option" :key="k">
              <el-option v-if="!i.isHide" :label="i.label" :value="i.id">
              </el-option>
            </div>
          </el-select>
          <!-- 时间选择器 -->
          <el-date-picker
            v-if="item.type == 'datetimepicker'"
            popper-class="questionnaire-datetime-picker"
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
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                {{ getuploadwarntext(item) }}
              </div>
            </el-upload>
          </div>
          <div class="signform" v-if="item.type == 'sign'">
            <div class="signform-img" @click="signatureCurrent(item)">
              <img
                v-if="signature[item.id]"
                :src="signature[item.id]"
                style="width: 100%; height: 100%"
              />
            </div>
            <div class="signform-text">
              {{ item.properties.placeholder }}
            </div>
            <div class="signform-btn">
              <el-button
                @click="cleatSignatureCurrent(item)"
                type="text"
                size="small"
              >
                Clear清除
              </el-button>
              <el-button
                @click="signatureCurrent(item)"
                round
                type="primary"
                size="small"
              >
                Signature签名
              </el-button>
            </div>
          </div>
          <!-- banner组件 -->
          <el-carousel
            v-if="item.type == 'banner'"
            height="200px"
            direction="horizontal"
            :autoplay="true"
            :loop="true"
            :interval="1500"
          >
            <el-carousel-item
              v-for="banner in item.properties.option"
              :key="banner.id"
            >
              <img style="width: 100%; height: 100%" :src="banner.url" alt="" />
            </el-carousel-item>
          </el-carousel>
          <div class="protocol-container" v-if="item.type == 'protocol'">
            <el-checkbox
              v-model="formArrValue[item.id]"
              true-label="1"
              false-label="0"
              @change="handleChangeProtocol($event, item)"
            >
            </el-checkbox>
            <p class="protocol">
              <span class="protocol-text">{{
                item.properties.placeholder
              }}</span>
              <span
                class="protocol-item"
                @click="showProtocolDialog(protocol.url)"
                v-for="protocol in item.properties.option"
                :key="protocol.id"
                >《{{ protocol.label }}》</span
              >
            </p>
          </div>
          <div v-if="item.type == 'autoFill'">
            <el-input
              v-model="formArrValue[item.id]"
              :placeholder="item.properties.placeholder"
            ></el-input>
            <div class="df_sb" style="width: 100%; margin-top: 10px">
              <el-input v-model="code" placeholder="请输入验证码"></el-input>
              <el-button
                class="questionnaire-info"
                size="default"
                style="margin-left: 10px"
                type="primary"
                @click="getCode(item.id)"
                :loading="codeLoading"
                :disabled="codeLoading"
              >
                {{ !codeLoading ? "验证码" : codeCountDown + "S" }}</el-button
              >
            </div>
            <div class="df_sb" style="width: 100%; margin-top: 10px">
              <el-select
                style="flex: 1"
                v-model="studentId"
                placeholder="请选择学生"
                @change="handleChangeStudent"
              >
                <el-option
                  v-for="item in studentInfo"
                  :key="item.studentId"
                  :label="item.name"
                  :value="item.studentId"
                >
                </el-option>
              </el-select>
              <el-button
                class="questionnaire-info"
                size="default"
                style="margin-left: 10px"
                type="primary"
                @click="getStudentList(item.id)"
              >
                搜索</el-button
              >
            </div>
          </div>
          <!-- 国籍组件 -->
          <el-select
            class="selectform"
            popper-class="questionnaire-select-picker"
            v-if="item.type == 'nationality'"
            style="width: 100%"
            v-model="formArrValue[item.id]"
            :filterable="true"
            :placeholder="item.properties.placeholder"
          >
            <div v-for="(i, k) in countryList" :key="i.value">
              <el-option :key="i.value" :label="i.name" :value="i.name">
              </el-option>
            </div>
          </el-select>
          <!-- 语言组件 -->
          <el-select
            class="selectform"
            popper-class="questionnaire-select-picker"
            v-if="item.type == 'language'"
            style="width: 100%"
            v-model="formArrValue[item.id]"
            :filterable="true"
            :placeholder="item.properties.placeholder"
          >
            <div v-for="(i, k) in languageList" :key="i.code">
              <el-option :key="i.code" :label="i.name" :value="i.code">
              </el-option>
            </div>
          </el-select>
          <el-cascader
            popper-class="questionnaire-cascader-picker"
            v-if="item.type == 'region'"
            v-model="formArrValue[item.id]"
            :options="chinaAreaOptions"
            placeholder="请选择省/市/区"
            :props="{ checkStrictly: true }"
            style="width: 100%"
          />
          <p class="formgenerator-placeholder" v-if="item.type == 'title'">
            {{ item.properties.placeholder }}
          </p>
        </el-form-item>
      </div>
    </el-form>
    <!-- 签名组件 -->
    <SignatureH5 ref="SignatureH5" @confirmEvent="confirmEvent" />
    <el-dialog
      width="96%"
      title="协议内容/Agreement Content"
      custom-class="protocol-dialog"
      :visible.sync="showProtocol"
      :before-close="closeProtocol"
    >
      <div class="protocol-content">
        <el-image
          style="width: 100%"
          :src="protocolContent"
          fit="fill"
        ></el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeProtocol"
          >confirm/确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 动态模板
import {
  addDynamic,
  editDynamic,
  getDynamicDetail,
} from "@/api/space/templatedynamic.js";
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
import {
  getFiles,
  downloadFile,
  uploadOuterFile,
  getOuterFile,
  getOuterFileName,
} from "@/api/upload/index.js";
import {
  getStudentByPhone,
  autoFill,
  getPhoneCode,
  getViewCollection,
  signUpCollection,
} from "@/api/consult/collection.js";
import { download } from "@/util/download.js";
import { regeList } from "@/const/space/regex.js";
import { deepClone } from "@/util/util";
import SignatureH5 from "@/components/signature/signatureH5.vue";
import countryList from "country-list";
import { getLanguageList, formatChinaArea } from "@/util/jsondata.js";
import _ from "lodash";
export default {
  props: {
    template: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    SignatureH5,
  },
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
      // 签名
      signature: {},
      // 协议弹窗
      showProtocol: false,
      protocolContent: "",
      // 自动填充
      studentInfo: [],
      loading: false,
      autoFillinfo: {
        guardianId: "",
        phone: null,
        collectionId: "",
        studentId: "",
        code: null,
      },
      // 国籍
      countryList: countryList.getData(),
      // 语言
      languageList: getLanguageList(),
      // 中国省市区
      chinaAreaOptions: formatChinaArea(),
      // 验证码加载中
      codeLoading: false,
      showCode: false,
      // 倒计时
      codeCountDown: 60,
      codeTimer: null,
      code: null,
      hasAutoFill: false,
    };
  },
  created() {
    this.$nextTick(() => {
      console.log("this.template", this.template);
      this.reSetForm(this.template.childTemplate, this.template.fieldId);
    });
  },
  beforeDestroy() {},
  methods: {
    clear() {
      this.formArrValue = {};
      this.formRules = {};
      this.formArr = [];
    },
    getList(id) {
      if (!template) return;
      let formData = {
        id: this.templateFormId,
        template: this.template.id,
      };
      getViewCollection(formData).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let data = res.data.data;
            this.reSetForm(res.data.data.template, id);
          });
        }
      });
    },
    // 保存提交数据
    saveFormArrValue() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (this.checkData()) {
              const fields = [];
              const formDataClone = deepClone(this.formArrValue);
              Object.keys(formDataClone).forEach(async (fieldId) => {
                const obj = { fieldId };
                const formItem = this.formArr.find(
                  (item) => item.id === fieldId
                );
                if (!formItem) return;

                const value = this.transformValue(
                  formItem,
                  formDataClone[fieldId]
                );
                obj.value = value === null ? "" : value;
                fields.push(obj);
              });
              console.log("saveFormArrValue", fields);
              resolve({ status: true, childTemplates: fields || [] });
            } else {
              resolve({ status: false, childTemplates: [] });
            }
          }
        });
      });
    },
    transformValue(formItem, value) {
      if (formItem.type === "select" && !formItem.properties.option_multi) {
        return JSON.stringify([value]);
      }
      if (formItem.type === "datetimepicker" && typeof value === "string") {
        return JSON.stringify([value]);
      }
      if (formItem.type === "upload") {
        const ids = value.map((s) => s.id);
        return JSON.stringify(ids);
      }
      if (formItem.type === "protocol") {
        return value;
      }
      if (formItem.type === "region") {
        return value.join("/");
      }
      if (formItem.type === "autoFill") {
        return value;
      }
      return typeof value !== "string" ? JSON.stringify(value) : value;
    },
    // 初始化数据
    async reSetForm(template, collectionId = "") {
      this.templateFormId = collectionId;
      const data = _.cloneDeep(template.templateFields);
      console.log("reSetForm", data);
      this.formArr = [];
      this.formArrValue = {}; // 初始化formArrValue

      // 合并筛选和排序操作
      const filteredAndSortedData = data
        .filter((item) => item.type !== "association")
        .sort((a, b) => a.sort - b.sort);

      for (const item of filteredAndSortedData) {
        const properties = {};
        let option = [];
        const option_default = [];

        item.label = item.fieldName;
        item.type = item.fieldType;
        item.fieldId = item.fieldId;
        item.id = item.fieldId;
        item.readonly = item.readonly ? true : false;
        item.disabled = item.disabled ? true : false;
        item.showHidden = item.isHidden;
        item.properties = item.properties || [];

        // 提取创建option数组的逻辑到单独函数
        option = await this.createOptionArray(item);

        for (const res of item.properties) {
          if (res.key === "option_default") {
            option_default.push(res.value);
          } else {
            properties[res.key] = res.value;
            if (res.key === "datetime_type") {
              const date = dateTimeType.filter(
                (d) => d.datetime_type === res.value
              );
              properties[res.key] = date[0].type;
              properties["datetime_pattern"] = date[0].format;
            }
            if (res.key === "upload_file_type") {
              properties[res.key] = res.value.split("+");
            }
            if (res.key === "upload_size_min") {
              properties[res.key] = res.value / 1024;
            }
            if (res.key === "upload_size_max") {
              properties[res.key] = res.value / 1024 / 1024;
            }
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
        if (item.type === "upload" || item.type === "sign") {
          this.formArrValue[item.id] = [];
        }
        item.properties = properties;

        this.formArr.push(item);
        this.setCurrentItemForm(item);
      }
    },

    async createOptionArray(item) {
      console.log("createOptionArray", item, item.properties);
      let option = [];
      for (const res of item.properties) {
        if (res.key === "option" && !res.isHide) {
          if (item.type === "banner" || item.type === "protocol") {
            const file = await getOuterFile(res.label);
            const fileName = await getOuterFileName({
              ids: [res.label],
              tenantId: 2,
            });
            const localUrl = URL.createObjectURL(file);
            option.push({
              label: fileName,
              id: res.id,
              url: localUrl,
            });
          } else {
            option.push({
              label: res.label,
              id: res.id,
              isHide: res.isHide,
            });
          }
        }
      }
      return option;
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
        requireMsg = "请输入/Please input";
      } else if (data.type == "upload") {
        requireMsg = "请上传/Please upload";
      } else if (data.type == "sign") {
        requireMsg = "请签名/Please sign";
      } else if (data.type == "protocol") {
        requireMsg = "请同意协议/Please agree to the protocol";
      } else {
        requireMsg = "请选择/Please select";
      }
      // 设置校验规则
      regexes.push({
        required: data.required && !data.isHidden,
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
    // 动态控制组件的显示与隐藏
    resetFields(event, item) {
      console.log("resetFields", event, item);

      let visibleCondition = item.visibleCondition || [];
      if (visibleCondition.length == 0) return;
      let formValue = Array.isArray(event) ? event : [event];

      visibleCondition.forEach((i) => {
        let shouldShow = false;
        let triggerFieldId = i.triggerFieldId;
        let triggerPropertyIds = i.triggerPropertyIds || [];
        // 根据匹配模式判断是否显示formValue对比triggerPropertyIds
        switch (i.matchMode) {
          case 0:
            // 等于模式
            shouldShow = formValue.some((v) => triggerPropertyIds.includes(v));
            this.resetFieldsHide(triggerFieldId, shouldShow);
            break;
          case 1:
            // 包含模式
            shouldShow = formValue.some((v) =>
              triggerPropertyIds.some((id) => v.includes(id))
            );
            this.resetFieldsHide(triggerFieldId, shouldShow);
            break;
          case 2:
            // 不等于模式
            shouldShow = !formValue.some((v) => triggerPropertyIds.includes(v));
            this.resetFieldsHide(triggerFieldId, shouldShow);
            break;
          case 3:
            // 大于模式
            shouldShow = formValue.some((v) => v > triggerPropertyIds[0]);
            this.resetFieldsHide(triggerFieldId, shouldShow);
            break;
          case 4:
            // 小于模式
            shouldShow = formValue.some((v) => v < triggerPropertyIds[0]);
            this.resetFieldsHide(triggerFieldId, shouldShow);
            break;
        }
      });
    },
    resetFieldsHide(id, shouldShow) {
      let index = this.formArr.findIndex((item) => item.id == id);
      this.$set(this.formArr, index, {
        ...this.formArr[index],
        // isHidden: shouldShow,
        showHidden: shouldShow
          ? !this.formArr[index].isHidden
          : this.formArr[index].isHidden,
      });
      console.log("resetFieldsHide", this.formArr, shouldShow);
    },
    // 签名组件
    signatureCurrent(item) {
      this.$refs.SignatureH5.showSignature(item);
    },
    cleatSignatureCurrent(item) {
      this.signature[item.id] = "";
      this.$set(this.formArrValue, item.id, []);
    },
    confirmEvent(uploadResult, imgUrlRes, item) {
      console.log("confirmEvent", uploadResult, imgUrlRes);
      this.$set(this.signature, item.id, imgUrlRes);
      this.$set(this.formArrValue, item.id, [uploadResult]);
    },
    // 显示协议弹窗
    showProtocolDialog(url) {
      console.log("showProtocolDialog", url);
      this.showProtocol = true;
      this.protocolContent = url;
    },
    closeProtocol() {
      this.showProtocol = false;
    },
    // 协议同意
    handleChangeProtocol(val, item) {
      if (val == "0") {
        delete this.formArrValue[item.id];
      }
    },
    // 自动填充
    async getStudentList(id) {
      let phone = this.formArrValue[id];
      if (!phone) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.code) {
        this.$message.error("请输入验证码");
        return;
      }
      const res = await getStudentByPhone({
        phone: phone,
        code: this.code,
      });
      if (res.data.success) {
        if (res.data.data.guardians.length > 0) {
          let { guardianId, students } = res.data.data.guardians[0];
          this.studentInfo = students;
          this.autoFillinfo = {
            ...this.autoFillinfo,
            guardianId,
            phone: phone,
            code: this.code,
          };
          if (students.length > 0) {
            this.studentId = students[0].studentId;
            this.autoFillinfo = {
              ...this.autoFillinfo,
              studentId: this.studentId,
            };
          }

          this.$message.success("请选择学生");
        }
      }
    },

    async getCode(id) {
      let phone = this.formArrValue[id];
      if (!phone) {
        this.$message.error("请输入手机号");
        return;
      }
      await getPhoneCode({
        phone: phone,
      });
      this.codeLoading = true;
      this.codeCountDown = 60;
      this.codeTimer = setInterval(() => {
        this.codeCountDown--;
        if (this.codeCountDown <= 0) {
          clearInterval(this.codeTimer);
          this.codeLoading = false;
        }
      }, 1000);
    },
    handleChangeStudent(val) {
      this.autoFillinfo = {
        ...this.autoFillinfo,
        studentId: val,
      };
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
