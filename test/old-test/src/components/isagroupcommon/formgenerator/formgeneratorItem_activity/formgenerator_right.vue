<template>
  <div class="formgenerator_right">
    <div class="formgenerator_right_title">{{ $t("consult.字段内容编辑") }}</div>

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
              :maxlength="255"
            ></el-input
          ></el-form-item>
          <el-form-item
            v-if="
              setform.type == 'input' ||
              setform.type == 'textarea' ||
              setform.type == 'select'
            "
            :label="$t('consult.占位文本')"
            prop="placeholder"
          >
            <el-input
              v-model="setform.properties.placeholder"
              :placeholder="$t('consult.请输入')"
              :maxlength="255"
            ></el-input
          ></el-form-item>
          <el-form-item :label="$t('consult.是否必填')" prop="require">
            <el-switch v-model="setform.required" @change="changeRequired"> </el-switch
          ></el-form-item>
          <el-form-item :label="$t('consult.是否隐藏')" prop="require">
            <el-switch :active-value="1" :inactive-value="0" v-model="setform.isHide">
            </el-switch
          ></el-form-item>
          <!-- <el-form-item
            label="是否只读"
            prop="readonly"
            v-if="setform.type != 'upload'"
          >
            <el-switch v-model="setform.readonly" @change="changeReadonly">
            </el-switch
          ></el-form-item> -->
          <!-- <el-form-item label="是否禁用" prop="disabled">
              <el-switch v-model="setform.disabled"> </el-switch
            ></el-form-item> -->
        </div>
        <!-- <div v-if="setform.type == 'input'">
          <el-form-item label="是否密文" prop="ciphertext">
            <el-switch v-model="setform.properties.ciphertext"> </el-switch
          ></el-form-item>
        </div> -->
        <div v-if="setform.type == 'textarea'">
          <el-form-item :label="$t('consult.显示行数')" prop="rows">
            <el-input-number
              controls-position="right"
              :min="2"
              v-model="setform.properties.text_num_line"
              :label="$t('consult.显示行数')"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item :label="$t('consult.最大输入长度')" prop="maxlength">
            <el-input-number
              :label="$t('consult.最大输入长度')"
              controls-position="right"
              :min="0"
              v-model="setform.properties.text_num_column"
            >
            </el-input-number
          ></el-form-item>
        </div>
        <!-- <div v-if="setform.type == 'select'">
          <el-form-item label="是否多选" prop="option_multi">
            <el-switch
              @change="changeSelectMulti"
              v-model="setform.properties.option_multi"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="是否支持搜索" prop="searchable">
            <el-switch v-model="setform.properties.searchable"> </el-switch>
          </el-form-item>
        </div> -->
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
            <div class="df_sb" v-for="(i, k) in setform.properties.option">
              <el-input
                style="margin-bottom: 10px"
                :key="k"
                v-model="setform.properties.option[k].label"
                :placeholder="$t('consult.请输入')"
                :maxlength="255"
              >
                <i
                  v-if="setform.properties.option.length > 1"
                  @click="deloption(i, k)"
                  slot="suffix"
                  style="color: #ee1212; font-size: 24px"
                  class="el-input__icon el-icon-remove"
                ></i>
              </el-input>
              <div
                style="margin-bottom: 10px; padding-left: 10px"
                v-if="
                  setform.type == 'radio' ||
                  setform.type == 'checkbox' ||
                  setform.type == 'select'
                "
              >
                <img
                  @click="setform.properties.option[k].isHide = 0"
                  v-if="setform.properties.option[k].isHide"
                  src="/thepool/other/icon_Invisible.png"
                />
                <img
                  @click="setform.properties.option[k].isHide = 1"
                  v-else
                  src="/thepool/other/icon_Visible.png"
                />
              </div>
              <!-- <el-switch
                style="margin-left: 10px"
                v-if="
                  setform.type == 'radio' ||
                  setform.type == 'checkbox' ||
                  setform.type == 'select'
                "
                :active-value="1"
                :inactive-value="0"
                v-model="setform.properties.option[k].isHide"
              >
              </el-switch> -->
            </div>
            <span
              v-if="setform.mark != 'applyschool'"
              class="addoption"
              @click="addoption"
              >{{ $t("consult.添加选项") }}</span
            >
          </el-form-item>
        </div>
        <div v-if="setform.type == 'checkbox'">
          <el-form-item :label="$t('consult.最小复选数')" prop="min">
            <el-input-number
              :label="$t('consult.最小复选数')"
              :placeholder="$t('consult.请输入')"
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
          <el-form-item :label="$t('consult.可选起始时间')" prop="datetime_begin">
            <el-date-picker
              v-model="setform.properties.datetime_begin"
              type="datetime"
              :placeholder="$t('consult.开始')"
              :value-format="'yyyy-MM-dd HH:mm'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="可选结束时间" prop="datetime_end">
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
            <el-select v-model="setform.properties.upload_file_type" placeholder="请选择">
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
        <!-- <div v-if="setform.type == 'input' || setform.type == 'textarea'">
          <el-form-item label="正则校验" prop="regexes">
            <el-select
              style="width: 100%"
              v-model="setform.regex"
              filterable
              clearable
              placeholder="请选择"
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
        </div> -->
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
import { regeList } from "@/const/space/regex.js";
import { createCode, deepClone } from "@/util/util.js";
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
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
    };
  },
  methods: {
    // 增加字典值
    addoption() {
      let obj = {
        label: `选项`,
        id: Number(`-${createCode()}`),
        isHide: false,
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

.option::before {
  padding: 1px 2px;
  background: #f56c6c;
  cursor: pointer;
}
.addoption {
  font-size: 14px;
  font-weight: 400;
  color: #26919f;
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
