<template>
  <el-scrollbar class="formgenerator_form_right">
    <!-- <div class="formgenerator_form_right_title">页面布局预览</div> -->
    <div class="draggable">
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="formArrValue"
        :rules="formArrRules"
        ref="formArr"
      >
        <draggable
          style="padding-top: 20px"
          class="list-group"
          :list="formArr"
          group="people"
        >
          <transition-group tag="div" name="list-complete">
            <div
              :style="`position: relative;width:100%;`"
              v-for="(item, index) in formArr"
              :key="item.fontId"
            >
              <div>
                <div class="formItemBtn" v-if="setform.fontId == item.fontId">
                  <i
                    style="color: #ba8e62; margin-right: 10px; cursor: pointer"
                    class="el-icon-copy-document"
                    @click.stop="copyThisForm(item)"
                  ></i>
                  <i
                    style="color: #ee1212; cursor: pointer"
                    class="el-icon-delete"
                    @click.stop="delThisForm(index)"
                  ></i>
                </div>
                <el-form-item
                  @click.native="getCurrentItemForm(item)"
                  :ref="item.fontId"
                  :id="item.fontId"
                  :style="`width:100%`"
                  :class="[
                    'list-complete-item',
                    {
                      is_activeItem: setform.fontId == item.fontId,
                    },
                    {
                      'is-required': item.required,
                    },
                    {
                      'is-title': item.type == 'title',
                    },
                  ]"
                  :label="item.label + (item.isHidden ? '(隐藏)' : '')"
                  :prop="item.fontId"
                >
                  <!-- 单文本输入框 -->
                  <el-input
                    style="width: 100%"
                    v-if="item.type == 'input'"
                    class="styleclass dargDiv"
                    v-model="formArrValue[item.fontId]"
                    :placeholder="item.properties.placeholder"
                    :type="item.properties.ciphertext ? 'password' : 'text'"
                    :show-password="item.properties.ciphertext"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                  ></el-input>
                  <!-- 多文本输入框 -->
                  <el-input
                    style="width: 100%"
                    v-if="item.type == 'textarea'"
                    class="styleclass dargDiv"
                    type="textarea"
                    v-model="formArrValue[item.fontId]"
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
                    v-model="formArrValue[item.fontId]"
                  >
                    <el-radio
                      v-for="(i, k) in filterOption(item.properties.option)"
                      :key="k"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      :label="i.id"
                      >{{ i.label }}</el-radio
                    >
                  </el-radio-group>
                  <!-- 复选框 -->
                  <el-checkbox-group
                    v-if="item.type == 'checkbox'"
                    v-model="formArrValue[item.fontId]"
                  >
                    <el-checkbox
                      v-for="(i, k) in filterOption(item.properties.option)"
                      :key="k"
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
                    v-model="formArrValue[item.fontId]"
                    :multiple="item.properties.option_multi"
                    :disabled="item.readonly"
                    :filterable="item.properties.searchable"
                    :placeholder="item.properties.placeholder"
                  >
                    <div v-for="(i, k) in item.properties.option" :key="k">
                      <el-option :label="i.label" :value="i.id"> </el-option>
                    </div>
                  </el-select>
                  <!-- 时间选择器 -->
                  <el-date-picker
                    style="width: 100%"
                    v-if="item.type == 'datetimepicker'"
                    v-model="formArrValue[item.fontId]"
                    :type="item.datetime_type"
                    :readonly="item.readonly"
                    :placeholder="item.properties.placeholder"
                    :value-format="item.properties.datetime_pattern"
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
                            Date.parse(
                              new Date(item.properties.datetime_begin)
                            ) <= time.getTime() &&
                            time.getTime() <=
                              Date.parse(new Date(item.properties.datetime_end))
                          );
                        }
                      },
                    }"
                  >
                  </el-date-picker>

                  <!-- 上传组件 -->
                  <el-upload
                    v-if="item.type == 'upload'"
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
                    :file-list="fileList"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或<em>点击上传</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">
                      {{ getuploadwarntext(item) }}
                    </div>
                  </el-upload>
                  <!-- 签名组件 -->
                  <div class="signform" v-if="item.type == 'sign'">
                    <div class="signform-img"></div>
                    <div class="signform-text">
                      {{ item.properties.placeholder }}
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
                      <img
                        style="width: 100%; height: 100%"
                        :src="banner.url"
                        alt=""
                      />
                    </el-carousel-item>
                  </el-carousel>
                  <div
                    class="protocol-container"
                    v-if="item.type == 'protocol'"
                  >
                    <el-checkbox v-model="checked"> </el-checkbox>
                    <p class="protocol">
                      <span class="protocol-text">
                        {{ item.properties.placeholder }}</span
                      >
                      <span
                        class="protocol-item"
                        @click.stop.native="handleProtocolClick(protocol)"
                        v-for="protocol in item.properties.option"
                        >《{{ protocol.name }}》</span
                      >
                    </p>
                  </div>
                  <!-- <el-select
                    style="width: 100%"
                    v-if="item.type == 'autoFill'"
                    v-model="value"
                    clearable
                    :placeholder="item.properties.placeholder"
                  >
                  </el-select> -->
                  <div v-if="item.type == 'autoFill'">
                    <el-input
                      v-model="formArrValue[item.id]"
                      :placeholder="item.properties.placeholder"
                    ></el-input>
                    <div class="df_sb" style="width: 100%; margin-top: 10px">
                      <el-input
                        v-model="code"
                        placeholder="请输入验证码"
                      ></el-input>
                      <el-button
                        size="default"
                        style="margin-left: 10px"
                        type="primary"
                        plain
                      >
                        验证码</el-button
                      >
                    </div>
                    <div class="df_sb" style="width: 100%; margin-top: 10px">
                      <el-select
                        style="flex: 1"
                        v-model="studentId"
                        placeholder="请选择学生"
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
                        size="default"
                        style="margin-left: 10px"
                        type="primary"
                        plain
                      >
                        搜索</el-button
                      >
                    </div>
                  </div>
                  <!-- 国籍组件 -->
                  <el-select
                    class="selectform"
                    v-if="item.type == 'nationality'"
                    style="width: 100%"
                    v-model="formArrValue[item.fontId]"
                    :filterable="true"
                    :placeholder="item.properties.placeholder"
                  >
                    <div v-for="(i, k) in countryList" :key="i.value">
                      <el-option :key="i.value" :label="i.name" :value="i.name">
                      </el-option>
                    </div>
                  </el-select>
                  <el-select
                    class="selectform"
                    v-if="item.type == 'language'"
                    style="width: 100%"
                    v-model="formArrValue[item.fontId]"
                    :filterable="true"
                    :placeholder="item.properties.placeholder"
                  >
                    <div v-for="item in languageList" :key="item.code">
                      <el-option
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </div>
                  </el-select>
                  <el-cascader
                    v-if="item.type == 'region'"
                    v-model="formArrValue[item.fontId]"
                    :options="chinaAreaOptions"
                    placeholder="请选择省/市/区"
                    :props="{ checkStrictly: true }"
                    style="width: 100%"
                  />
                  <p
                    style="
                      line-height: 20px !important;
                      padding: 5px 0;
                      margin: 0;
                    "
                    class="formgenerator-placeholder"
                    v-if="item.type == 'title'"
                  >
                    {{ item.properties.placeholder }}
                  </p>
                  <!-- 子表单组件 -->
                  <ChildForm
                    v-if="item.type == 'guardian'"
                    :ref="`childForm${item.id}`"
                    :childTemplateId="item.childTemplateId"
                    :template="item"
                  />
                </el-form-item>
              </div>
            </div>
          </transition-group>
        </draggable>
      </el-form>
    </div>
  </el-scrollbar>
</template>

<script>
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
import draggable from "vuedraggable";
import { deepClone } from "@/util/util.js";
import countryList from "country-list";
import { getLanguageList, formatChinaArea } from "@/util/jsondata.js";
import ChildForm from "./child_form.vue";
export default {
  components: {
    draggable,
    ChildForm,
  },
  props: {
    formArr: Array,
    setform: Object,
    formArrValue: Object,
    formArrRules: Object,
    formType: {
      type: String,
      default: "view",
    },
  },
  data() {
    return {
      // 时间选择期类型
      dateTimeType: dateTimeType,
      // 上传类型类型
      uploadAccept: uploadAccept,
      // 上传
      fileList: [],
      currentUpload: {},
      // 国籍
      countryList: countryList.getData(),
      languageList: getLanguageList(),
      // 中国省市区
      chinaAreaOptions: formatChinaArea(),
      studentId: "",
      studentInfo: [],
      code: "",
    };
  },
  watch: {
    formArr: {
      handler(newVal, oldVal) {
        this.formArr.map((item, index) => {
          this.$nextTick(() => {
            let currentItem = document.getElementById(item.fontId);
            if (!item.required) {
              currentItem.classList.remove("is-required");
            } else {
              currentItem.classList.add("is-required");
            }
          });
        });
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    // 点击当前组件
    getCurrentItemForm(data) {
      this.$emit("getCurrentItemForm", data);
    },
    // 复制
    async copyThisForm(item) {
      console.log("item8888", item);
      let data = await this.resetThisForm(item);
      this.$emit("addform", { ...data });
    },
    resetThisForm(item) {
      let data = deepClone(item);
      data["id"] = "";
      data["fieldId"] = "";
      if (data["properties"]["option"]) {
        data["properties"]["option"].map((o) => {
          if (o["id"] > 0) {
            o["id"] = Number(`-${o["id"]}`);
          }
        });
      }
      if (data["properties"]["option_default"]) {
        if (
          data["type"] == "checkbox" ||
          (data["type"] == "select" && data["properties"]["option_multi"])
        ) {
          let arr = [];
          data["properties"]["option_default"].map((o) => {
            if (Number(o) > 0) {
              arr.push(Number(`-${o}`));
            } else {
              arr.push(o);
            }
          });
          data["properties"]["option_default"] = arr;
        }
        if (
          data["type"] == "radio" ||
          (data["type"] == "select" && !data["properties"]["option_multi"])
        ) {
          if (Number(data["properties"]["option_default"]) > 0) {
            data["properties"]["option_default"] = Number(
              `-${data["properties"]["option_default"]}`
            );
          }
        }
      }
      return data;
    },
    // 删除
    delThisForm(index, id) {
      this.$emit("delThisForm", { index, id });
    },
    // 提交
    submitForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("formArrValue", this.formArrValue);
          }
        });
      });
    },
    //文件超出个数限制时的钩子
    onExceed(files, fileList) {
      this.$message.warning(`上传总数量不超过${this.setform.limit}个`);
    },
    // 获取当前的上传组件
    getCurrentUpload(item) {
      this.currentUpload = item;
    },
    // 上传前限制条件
    beforeUpload(file) {
      console.log("beforeUpload", file);
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
        this.$message.warning(this.getuploadwarntext(this.setform));
        return;
      }
    },
    // 删除文件
    removeFile(file, fileList) {
      let data = { ids: [file.id] };
      deleteFiles(data).then((res) => {
        if (res.data.success == "true") {
          console.log("deleteFiles", res);
          this.fileList = this.fileList.filter((item) => {
            return item.id != file.id;
          });
        }
      });
    },
    getuploadwarntext(item) {
      let uploadAcceptList = [];
      if (item.properties.upload_file_type) {
        this.uploadAccept.map((i) => {
          if (item.properties.upload_file_type.includes(i.type)) {
            uploadAcceptList.push(i.list);
          }
        });
      }

      return `请上传${String(uploadAcceptList)}文件，单文件体积不小于${
        item.properties.upload_size_min
      }KB${
        item.properties.upload_size_max != null
          ? ",不大于" + item.properties.upload_size_max + "M"
          : ""
      }`;
    },
    filterOption(option) {
      return option.filter((i) => {
        return !i.isHide;
      });
    },
    // 处理协议点击事件
    handleProtocolClick(protocol) {
      console.log("handleProtocolClick", protocol);

      window.open(protocol.url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.formgenerator_form_right {
  flex: 1;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  height: 100%;
  .formgenerator_form_right_title {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    -webkit-background-clip: text;
    padding: 20px 30px;
  }
  .draggable {
    flex: 1;
    padding: 0 30px 20px;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      padding: 10px 10px 20px 10px;
      position: relative;
    }
    .is_activeItem {
      background: #f2fbfc;
    }
  }
  .signform {
    .signform-img {
      width: 100%;
      height: 120px;
      background-color: #fff;
      border: 1px dashed #d4d4d4;
    }
    .signform-text {
      margin-top: 5px;
      font-size: 14px;
      color: #ba8e62;
      -webkit-background-clip: text;
      line-height: 16px;
    }
  }
  .protocol-container {
    display: flex;
    align-items: flex-start;
    .protocol {
      flex: 1;
      margin: 0;
      padding: 5px 0 0 5px;
      .protocol-text {
        font-weight: 400;
        font-size: 14px;
        cursor: default;
        line-height: 16px;
        color: #999999;
      }
      .protocol-item {
        font-weight: 400;
        font-size: 14px;
        color: #ba8e62;
        cursor: pointer;
        line-height: 16px;
      }
    }
  }
}
.formItemBtn {
  position: absolute;
  top: -12px;
  right: 5px;
  z-index: 10;
  .el-button {
    min-width: auto !important;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    padding: 0 !important;
    .el-icon-copy-document {
    }
  }
  .el-button--info {
    color: #175e67;
    border-color: #175e67;
  }
  .el-button--danger {
    color: #f56c6c;
    border-color: #f56c6c;
  }
}
</style>
