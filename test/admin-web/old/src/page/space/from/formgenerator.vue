<template>
  <div class="formgenerator df_sb" style="height: 100%">
    <el-scrollbar class="formgenerator_left">
      <div class="formgenerator_template">
        <div class="formgenerator_title">{{ $route.name }}</div>
        <slot name="templateFrom"></slot>
        <div class="formgenerator_item" v-if="hasTemplateFrom">
          <div class="formgenerator_itemname">基本属性</div>

          <el-form
            :label-position="'top'"
            :inline="true"
            :model="templateFrom"
            :rules="templateRule"
            ref="templateFrom"
          >
            <el-form-item label="名称" prop="templateName" style="margin: 0">
              <el-input
                style="width: 380px"
                v-model="templateFrom.templateName"
                placeholder="请输入名称"
                :maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="$route.path == `/spacelevel/formgenerator`"
              label="备注"
              prop="remark"
              style="margin: 20px 0 0; width: 100%"
            >
              <el-input
                style="width: 50%"
                type="textarea"
                v-model="templateFrom.remark"
                placeholder="请输入"
                :maxlength="300"
              ></el-input>
            </el-form-item>
            <div v-if="$route.path == `/assets/formgenerator`">
              <el-form-item
                label="编码"
                prop="code"
                style="width: 380px; margin: 20px 20px 0 0"
              >
                <el-input
                  style="width: 380px"
                  v-model="templateFrom.code"
                  placeholder="请输入名称"
                  :maxlength="30"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="
                  routeData['level'] > 2 &&
                  assetsLevels.includes(Number(routeData['level']) - 1)
                "
                :label="`${assetsLevel[Number(routeData['level']) - 1]}`"
                prop="pid"
                style="width: 380px; margin: 20px 20px 0 0"
              >
                <el-select
                  filterable
                  clearable
                  style="width: 100%"
                  v-model="templateFrom.pid"
                  placeholder="请选择"
                >
                  <el-option
                    :disabled="!i.status"
                    :key="k"
                    v-for="(i, k) in assetsTypeList"
                    :label="i.name"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="
                  routeData['level'] < 4 &&
                  assetsLevels.includes(Number(routeData['level']) + 1)
                "
                :label="`${assetsLevel[Number(routeData['level']) + 1]}`"
                prop="childIds"
                style="width: 380px; margin: 20px 0 0"
              >
                <el-select
                  filterable
                  clearable
                  multiple
                  style="width: 100%"
                  v-model="templateFrom.childIds"
                  placeholder="请选择"
                >
                  <el-option
                    :disabled="!i.status"
                    :key="k"
                    v-for="(i, k) in assetsTypeListUnbind"
                    :label="i.name"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="formgenerator_item" style="margin-bottom: 0">
          <div class="formgenerator_itemname">表单编辑</div>
        </div>
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
        <div style="margin-top: 20px; text-align: right">
          <el-button type="default" size="medium" @click="reset"
            >重置</el-button
          >
          <el-button type="primary" size="medium" @click="saveTemplate"
            >保存</el-button
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
</template>

<script>
import { formlist, dateTimeType, uploadAccept, setformrules } from "./form.js";
import { regeList } from "@/const/space/regex.js";
import { createCode, deepClone } from "@/util/util.js";
import { rule } from "@/util/validateRules.js";
// 动态模板
import {
  addTemplate,
  getTemplateDetail,
  editTemplate,
  getTemplateRegex,
} from "@/api/space/templatedynamic.js";
// 空间类型
import {
  addSpaceType,
  getSpaceTypeDetail,
  editSpaceType,
} from "@/api/space/spacetype.js";
// 空间层级
import {
  addSpaceHierarchy,
  getSpaceHierarchyDeatil,
  editSpaceHierarchy,
} from "@/api/space/spacehierarchy.js";
// 资产类型
import {
  addAssetType,
  editAssetType,
  getAssetTypeDetail,
  getAssetTypeList,
  getAssetTypeunbind,
  getAssetTypePage,
  getAssetTypeLarge,
  getAssetTypeMiddle,
  getAssetTypeSmall,
} from "@/api/assets/type/index.js";
import { getAssetTypeConf } from "@/api/assets/type/index.js";
import FormLeft from "./formgeneratorItem/form_left.vue";
import FormRight from "./formgeneratorItem/form_right.vue";
import formgeneratorRight from "./formgeneratorItem/formgenerator_right.vue";
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
      assetsTypeList: [],
      assetsTypeListUnbind: [],
      assetsLevel: {
        2: "绑定大类",
        3: "绑定中类",
        4: "绑定小类",
      },
      assetsLevels: [],
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
    // this.getTemplateRegex();
  },
  methods: {
    // 初始化数据
    async init() {
      this.routeData = this.$route.query;
      if (this.$route.path == "/assets/formgenerator") {
        this.getAssetTypeConf();
        let { level, menuTypeId, assetTypeId } = this.routeData;
        console.log("level", level);
        switch (String(level)) {
          case "2":
            this.getAssetTypeunbind({
              level: Number(level) + 1,
              menuTypeId,
              pid: assetTypeId,
            });
            break;
          case "3":
            this.getAssetTypeunbind({
              level: Number(level) + 1,
              menuTypeId,
              pid: assetTypeId,
            });
            this.getAssetTypeLarge({
              level: Number(level) - 1,
              menuTypeId,
              size: 1000,
            });
            break;
          case "4":
            this.getAssetTypeMiddle({
              level: Number(level) - 1,
              menuTypeId,
              size: 1000,
            });
            break;
        }
      }
      if (this.routeData.type == "edit") {
        if (this.$route.path == "/spacetype/formgenerator") {
          this.getSpaceTypeDetail(this.routeData.spaceTypeId);
        } else if (this.$route.path == "/spacelevel/formgenerator") {
          this.getSpaceHierarchyDeatil(this.routeData.spaceLevelId);
        } else if (this.$route.path == "/assets/formgenerator") {
          this.getAssetTypeDetail(this.routeData.assetTypeId);
        }
      }
    },

    // //模板正则列表
    // getTemplateRegex() {
    //   getTemplateRegex({ size: 100 }).then((res) => {
    //     if (res.data.success) {
    //       this.regexes = res.data.data.data;
    //     }
    //   });
    // },

    //新增资产类型
    addAssetType(data) {
      addAssetType(data).then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功");
          this.backList("asset");
        }
      });
    },
    //编辑资产类型
    editAssetType(data) {
      editAssetType(data).then((res) => {
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.backList("asset");
        }
      });
    },
    //资产类型列表
    getAssetTypeList(data) {
      getAssetTypeList(data).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.assetsTypeList = data;
        }
      });
    },
    getAssetTypeConf() {
      getAssetTypeConf({ typeId: this.$route.query.menuTypeId }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { code, levels } = res.data.data;
          this.assetsLevels = levels;
        }
      });
    },
    getAssetTypeLarge(data) {
      getAssetTypeLarge(data).then((res) => {
        if (res.data.success) {
          this.assetsTypeList = res.data.data.records;
        }
      });
    },
    getAssetTypeMiddle(data) {
      getAssetTypeMiddle(data).then((res) => {
        if (res.data.success) {
          this.assetsTypeList = res.data.data.records;
        }
      });
    },
    //资产类型列表未绑定过的
    getAssetTypeunbind(data, type) {
      getAssetTypeunbind(data).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.assetsTypeListUnbind = data;
        }
      });
    },
    //查看资产类型
    getAssetTypeDetail(data) {
      getAssetTypeDetail(data).then((res) => {
        if (res.data.success) {
          this.templateData = res.data.data;
          this.templateFrom["templateName"] = res.data.data.name;
          this.templateFrom["code"] = res.data.data.code;
          this.templateFrom["pid"] = res.data.data.pid;
          this.templateFrom["childIds"] = res.data.data.childIds;
          this.getTemplateDetail(res.data.data.templateFormId);
        }
      });
    },
    //新增空间类型
    addSpaceType(data) {
      addSpaceType(data).then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功");
          this.backList("type");
        }
      });
    },
    //编辑空间类型
    editSpaceType(data) {
      editSpaceType(data).then((res) => {
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.backList("type");
        }
      });
    },
    //空间类型详情
    getSpaceTypeDetail(id) {
      getSpaceTypeDetail(id).then((res) => {
        if (res.data.success) {
          this.templateData = res.data.data;
          this.templateFrom["templateName"] = res.data.data.name;
          this.getTemplateDetail(res.data.data.templateFormId);
        }
      });
    },
    //新增空间层级
    addSpaceHierarchy(data) {
      addSpaceHierarchy(data).then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功");
          this.backList("level");
        }
      });
    },
    //编辑空间层级
    editSpaceHierarchy(data) {
      editSpaceHierarchy(data).then((res) => {
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.backList("level");
        }
      });
    },
    //空间层级详情
    getSpaceHierarchyDeatil(id) {
      getSpaceHierarchyDeatil(id).then((res) => {
        if (res.data.success) {
          this.templateData = res.data.data;
          this.templateFrom["templateName"] = res.data.data.name;
          this.templateFrom["remark"] = res.data.data.remark;
          this.getTemplateDetail(res.data.data.templateFormId);
        }
      });
    },
    // 添加动态表单模板
    addTemplateDynamic(data) {
      addTemplate(data).then((res) => {
        if (res.data.success) {
          // this.$message.success("添加成功");
          if (this.$route.path == "/spacetype/formgenerator") {
            let obj = {
              name: data.label,
              spaceTopId: this.$route.query.spaceTopId,
              templateFormId: res.data.data,
            };
            this.addSpaceType(obj);
          } else if (this.$route.path == "/spacelevel/formgenerator") {
            let obj = {
              name: data.label,
              spaceTopId: this.$route.query.spaceTopId,
              templateFormId: res.data.data,
              remark: this.templateFrom.remark,
            };
            this.addSpaceHierarchy(obj);
          } else if (this.$route.path == "/assets/formgenerator") {
            let level = this.$route.query.level;
            let obj = {
              name: data.label,
              menuTypeId: this.$route.query.menuTypeId,
              level: level,
              code: this.templateFrom.code,
              pid:
                level == 2
                  ? this.$route.query.menuTypeId
                  : this.templateFrom.pid,
              childIds: this.templateFrom.childIds,
              templateFormId: res.data.data,
            };
            this.addAssetType(obj);
          } else if (this.$route.path == "/assets/type/configuration/index") {
            this.$emit("saveAssetForm", res.data.data);
          }
        }
      });
    },
    //编辑动态表单模板
    editTemplate(data) {
      editTemplate(data).then((res) => {
        if (res.data.success) {
          if (this.$route.path == "/spacetype/formgenerator") {
            let obj = {
              name: data.label,
              id: this.$route.query.spaceTypeId,
            };
            this.editSpaceType(obj);
          } else if (this.$route.path == "/spacelevel/formgenerator") {
            let obj = {
              name: data.label,
              remark: this.templateFrom.remark,
              id: this.$route.query.spaceLevelId,
            };
            this.editSpaceHierarchy(obj);
          } else if (this.$route.path == "/assets/formgenerator") {
            let level = this.$route.query.level;
            let obj = {
              name: data.label,
              menuTypeId: this.$route.query.menuTypeId,
              level: this.$route.query.level,
              code: this.templateFrom.code,
              pid:
                level == 2
                  ? this.$route.query.menuTypeId
                  : this.templateFrom.pid,
              childIds: this.templateFrom.childIds,
              id: this.$route.query.assetTypeId,
            };
            this.editAssetType(obj);
          } else if (this.$route.path == "/assets/type/configuration/index") {
            this.$message.success("保存成功");
          }
        }
      });
    },
    //获取动态表单模板详情
    getTemplateDetail(id) {
      if (id == null) return;
      getTemplateDetail(id).then((res) => {
        if (res.data.success) {
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
            item["properties"] = properties;
            this.addform(item);
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
                properties.push({
                  key: res,
                  label: option.label,
                  id: option.id,
                  value: option.label,
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
              value: item.properties[res].join("+"),
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
        templateArr.push(obj);
      });
      if (!checkItem) return;
      let data = {
        label: this.templateFrom.templateName,
        fields: templateArr,
        structure: "top",
      };
      // return;
      if (this.routeData.type == "add") {
        this.addTemplateDynamic(data);
      } else if (this.routeData.type == "edit") {
        data["id"] = this.templateData.templateFormId;
        this.editTemplate(data);
      }
    },
    backList(type) {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      switch (type) {
        case "type":
          this.$router.push("/space/attribute/type/index");
          break;
        case "level":
          this.$router.push("/space/attribute/level/index");
          break;
        case "asset":
          switch (this.$route.query.level) {
            case "2":
              this.$router.push("/assets/type/large/index");
              break;
            case "3":
              this.$router.push("/assets/type/middle/index");
              break;
            case "4":
              this.$router.push("/assets/type/small/index");
              break;
          }
          break;
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
      console.log("data", data, this.formArr);
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
  },
};
</script>
 
<style lang = "scss" scoped>
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
    padding: 30px;
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
      max-height: 450px;
      border: 1px solid #c5d0cf;
      margin-left: 20px;
      background-color: #fff;
    }
  }
}
</style>