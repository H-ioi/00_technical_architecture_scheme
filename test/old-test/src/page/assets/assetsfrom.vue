<template>
  <div class="detail spacefrom">
    <div class="detail_content">
      <div class="df_sb detail_top" v-if="showTop">
        <BackItem />
      </div>
      <el-scrollbar class="spacefrom_content">
        <div class="detail_item">
          <div class="detail_item_title">
            {{ "基础信息" + assetsTypeName }}
          </div>
          <div class="detail_baseinfo basefrom">
            <el-form
              :label-position="'top'"
              :inline="true"
              :model="basefrom"
              :rules="baserules"
              ref="basefrom"
            >
              <div class="df_center_wrap">
                <el-form-item label="资产名称" prop="name">
                  <el-input
                    v-model="basefrom.name"
                    placeholder="请输入"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="资产编码"
                  prop="code"
                  v-if="currentCheckObj['type'] == 'edit'"
                >
                  <el-input
                    v-model="basefrom.code"
                    placeholder="请输入"
                    :maxlength="200"
                  ></el-input>
                </el-form-item>
                <el-form-item label="资产状态" prop="status">
                  <el-select
                    style="width: 100%"
                    clearable
                    v-model="basefrom.status"
                    placeholder="请选择"
                    @change="changeStatus"
                  >
                    <el-option
                      :key="k"
                      v-for="(i, k) in assetsStatus"
                      :label="i.name"
                      :value="i.type"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="资产类型" prop="type">
                  <el-cascader
                    style="width: 100%"
                    ref="cascader"
                    v-model="basefrom.type"
                    :props="cascaderOptions"
                    :options="options"
                    @change="changeCascader"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="财务编码" prop="financeCode">
                  <el-input
                    v-model="basefrom.financeCode"
                    placeholder="请输入"
                    :maxlength="32"
                  ></el-input>
                </el-form-item>
                <el-form-item label="教育编码" prop="educationCode">
                  <el-input
                    v-model="basefrom.educationCode"
                    placeholder="请输入"
                    :maxlength="32"
                  ></el-input>
                </el-form-item>
                <el-form-item label="采购日期" prop="educationCode">
                  <el-date-picker
                    style="width: 100%"
                    v-model="basefrom.purchaseTime"
                    type="date"
                    placeholder="选择采购日期"
                    :value-format="'yyyy-MM-dd'"
                    :format="'yyyy-MM-dd'"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-if="!isBindSpace" label="所属空间" prop="space">
                  <el-input
                    v-model="basefrom.space"
                    placeholder="请输入"
                    :maxlength="32"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="!isBindSpace"
                  label="空间名称"
                  prop="spaceId"
                >
                  <SpaceTree
                    ref="SpaceTree"
                    :schoolId="spaceDictValue"
                    @setSpace="setSpace"
                  />
                </el-form-item>
                <el-form-item label="采购方式" prop="purchaseMethod">
                  <el-select
                    style="width: 100%"
                    clearable
                    v-model="basefrom.purchaseMethod"
                    placeholder="请选择"
                  >
                    <el-option
                      :key="k"
                      v-for="(i, k) in purchaseMethodList"
                      :label="i.label"
                      :value="i.type"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="金额(RMB)" prop="price">
                  <el-input-number
                    style="width: 100%;"
                    placeholder="请输入"
                    v-model="basefrom.price"
                    :precision="2"
                    :step="0.1"
                  ></el-input-number>
                  <!-- <el-input
                    v-model="basefrom.price"
                    placeholder="请输入"
                    :maxlength="32"
                  ></el-input> -->
                </el-form-item>
                <el-form-item label="流水号" prop="syncSerialNo">
                  <el-input
                    v-model="basefrom.syncSerialNo"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                  <el-input
                    v-model="basefrom.brand"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="计量单位" prop="unit">
                  <el-input
                    v-model="basefrom.unit"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="规格型号" prop="model">
                  <el-input
                    v-model="basefrom.model"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所在仓库" prop="warehouseName">
                  <el-input
                    v-model="basefrom.warehouseName"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="入库日期" prop="warehouseDate">
                  <el-date-picker
                    style="width: 100%;"
                    v-model="basefrom.warehouseDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="使用人" prop="operateUser">
                  <el-input
                    v-model="basefrom.operateUser"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="使用部门" prop="operateDepartment">
                  <el-input
                    v-model="basefrom.operateDepartment"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属公司" prop="ownCompany">
                  <el-input
                    v-model="basefrom.ownCompany"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="ownDepartment">
                  <el-input
                    v-model="basefrom.ownDepartment"
                    placeholder="请输入"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="资产图片"
                  prop="fileIds"
                  style="width: 100% !important;"
                >
                  <FileList ref="FileList" :scene="'asset_file'" />
                </el-form-item>
                <el-form-item
                  label="存放位置"
                  prop="depositLocation"
                  style="width: 100% !important;"
                >
                  <el-input
                    v-model="basefrom.depositLocation"
                    placeholder="请输入"
                    :maxlength="50"
                    :rows="1"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="备注"
                  prop="note"
                  style="width: 100% !important;"
                >
                  <el-input
                    v-model="basefrom.note"
                    placeholder="请输入"
                    :maxlength="300"
                    type="textarea"
                    :rows="4"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
            <FromItem :ref="`assetsFrom`" />
          </div>
        </div>
        <div class="detail_item" v-for="item in assetsTypeList" :key="item.id">
          <div class="detail_item_title">{{ item.name }}</div>
          <div class="detail_baseinfo basefrom">
            <FromItem
              :ref="`assetstype${item.id}`"
              :id="`assetstype${item.id}`"
            />
          </div>
        </div>
      </el-scrollbar>
      <div style="margin-top: 20px; text-align: right">
        <el-button type="primary" size="medium" @click="saveAssets"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getAssetTypeList,
  saveAsset,
  editAsset,
  getAssetDetail
} from "@/api/assets/list/index.js";
import { getAssetForm } from "@/api/assets/form/index.js";
import {
  getAssetTypeDetail,
  getAssetTypeConf
} from "@/api/assets/type/index.js";
import { assetsStatus, purchaseMethodList } from "@/const/assets/index.js";
import { formrules } from "@/util/form.js";
import BackItem from "@/components/common/detailItem/BackItem.vue";
import FromItem from "@/page/space/from/fromitem.vue";
import SpaceTree from "@/page/order/modal/spacetree";
import FileList from "@/components/common/FileList";
export default {
  components: {
    BackItem,
    FromItem,
    SpaceTree,
    FileList
  },
  props: {
    isBindSpace: {
      default: false,
      type: Boolean
    },
    showTop: {
      default: true,
      type: Boolean
    },
    spaceMenuTypeId: {
      default: "",
      type: String
    },
    spaceId: {
      default: "",
      type: String
    }
  },
  data() {
    let _this = this;
    return {
      purchaseMethodList: purchaseMethodList,
      assetsStatus: assetsStatus,
      basefrom: {
        space: ""
      },
      baserules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: formrules["checkAssetsName"],

            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            validator: formrules["checkAssetsCode"],
            trigger: "blur"
          }
        ],
        status: [{ required: true, message: "请选择", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      assetsTypeList: [],
      assetsTypeName: "",
      options: [],
      cascaderOptions: {
        lazy: true,
        value: "id",
        label: "name",
        leaf: "leaf",
        children: "child",
        checkStrictly: true,
        async lazyLoad(node, resolve) {
          let list = await _this.getAssetTypeList(node);
          resolve(list);
        }
      },
      currentCheckObj: {},
      assetsFromId: "",
      spaceDictValue: ""
    };
  },
  created() {
    if (this.$route.path == "/assets/edit") {
      this.spaceDictValue = this.$route.query.dictValue;
      this.getAssetDetail(this.$route.query.assetId);
      this.setBaserules(
        "edit",
        this.$route.query.checkTypeId,
        this.$route.query.assetId
      );
    }
    if (this.$route.path == "/assets/add") {
      this.spaceDictValue = this.$route.query.dictValue;
      let status = Number(this.$route.query.assetsStatus);
      if (status) {
        this.basefrom["status"] = status;
      }

      this.getAssetForm();
      this.setBaserules("add", this.$route.query.checkTypeId, null);
    }
    if (this.$route.path == "/space/detail") {
      this.getAssetForm();
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    setBaserules(type, checkTypeId, id) {
      this.currentCheckObj = { type: type, checkTypeId: checkTypeId, id: id };
      this.$set(this.baserules["name"], 1, {
        ...this.baserules["name"][1],
        checkObj: {
          type,
          checkTypeId,
          id
        }
      });
      this.$set(this.baserules["code"], 1, {
        ...this.baserules["code"][1],
        checkObj: {
          type,
          checkTypeId,
          id
        }
      });
    },
    getAssetForm(fromId = null) {
      getAssetForm({
        menuTypeId: this.$route.query.checkTypeId
          ? this.$route.query.checkTypeId
          : this.spaceMenuTypeId
      }).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.$nextTick(() => {
            if (data != null) {
              this.assetsFromId = data.id;
              this.$refs["assetsFrom"].getTemplateDetail(data.id, fromId);
            }
          });
        }
      });
    },
    saveAsset(data) {
      saveAsset(data).then(res => {
        if (res.data.success) {
          this.$message.success("新增成功");
          if (this.isBindSpace) {
            this.$emit("refreshData");
          } else {
            this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
            this.$router.back();
          }
        }
      });
    },
    editAsset(data) {
      editAsset(data).then(res => {
        if (res.data.success) {
          this.$message.success("编辑成功");
          if (this.isBindSpace) {
            this.$emit("refreshData");
          } else {
            this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
            this.$router.back();
          }
        }
      });
    },
    getAssetDetail(id) {
      getAssetDetail(id).then(res => {
        if (res.data.success) {
          let {
            code,
            educationCode,
            financeCode,
            name,
            status,
            purchaseTime,
            assetForm,
            typeFormLarge,
            typeFormMiddle,
            typeFormSmall,
            space,
            // 金蝶增加字段
            purchaseMethod,
            price,
            syncSerialNo,
            brand,
            unit,
            model,
            warehouseName,
            warehouseDate,
            operateUser,
            operateDepartment,
            ownCompany,
            ownDepartment,
            depositLocation,
            note,
            spaceName,
            spaceId
          } = res.data.data;
          this.basefrom = {
            ...this.basefrom,
            code,
            educationCode,
            financeCode,
            name,
            status,
            purchaseTime,
            space,
            // 金蝶增加字段
            purchaseMethod,
            price: price ? price / 100 : 0,
            syncSerialNo,
            brand,
            unit,
            model,
            warehouseName,
            warehouseDate,
            operateUser,
            operateDepartment,
            ownCompany,
            ownDepartment,
            depositLocation,
            note
          };
          console.log("this.basefrom", this.basefrom);
          this.getAssetTypeConf(typeFormLarge, typeFormMiddle, typeFormSmall);
          this.getAssetForm(assetForm["formId"]);
          this.$nextTick(() => {
            this.$refs["SpaceTree"].labelModel = spaceName ? spaceName : "";
            this.$refs["SpaceTree"].defaultCheckedKeys = spaceId
              ? [spaceId]
              : [];
            let data = { outerId: id, scene: "asset_file" };
            this.$refs["FileList"].getFileList(data);
          });
        }
      });
    },
    getAssetTypeConf(typeFormLarge, typeFormMiddle, typeFormSmall) {
      getAssetTypeConf({
        typeId: this.$route.query.checkTypeId
          ? this.$route.query.checkTypeId
          : this.spaceMenuTypeId
      }).then(res => {
        console.log("getAssetTypeConf", res);
        if (res.data.success) {
          let { code, levels } = res.data.data;
          this.setCascaderOptions(
            typeFormLarge,
            typeFormMiddle,
            typeFormSmall,
            levels
          );
          if (levels.includes(2) && typeFormLarge["status"]) {
            this.gettypeItem(typeFormLarge, 2);
          }
          if (levels.includes(3) && typeFormMiddle["status"]) {
            this.gettypeItem(typeFormMiddle, 3);
          }
          if (levels.includes(4) && typeFormSmall["status"]) {
            this.gettypeItem(typeFormSmall, 4);
          }
          this.getTypeName();
        }
      });
    },
    async setCascaderOptions(
      typeFormLarge,
      typeFormMiddle,
      typeFormSmall,
      levels
    ) {
      let typeIds = [];
      let obj = {};
      let formLarge = {};
      let formMiddle = {};
      let formSmall = {};
      let hasFormLarge =
        typeFormLarge["typeId"] != null &&
        typeFormLarge["status"] &&
        levels.includes(2);
      let hasFormMiddle =
        typeFormMiddle["typeId"] != null &&
        typeFormMiddle["status"] &&
        levels.includes(3);
      let hasFormSmall =
        typeFormSmall["typeId"] != null &&
        typeFormSmall["status"] &&
        levels.includes(4);
      if (hasFormLarge) {
        typeIds.push(typeFormLarge["typeId"]);
        formLarge = {
          name: typeFormLarge["typeName"],
          id: typeFormLarge["typeId"],
          leaf: !(levels.includes(3) && typeFormLarge["hasEnableStatusChild"]),
          child: []
        };
        obj = formLarge;
      }
      if (hasFormMiddle) {
        typeIds.push(typeFormMiddle["typeId"]);
        formMiddle = {
          name: typeFormMiddle["typeName"],
          id: typeFormMiddle["typeId"],
          leaf: !(levels.includes(4) && typeFormMiddle["hasEnableStatusChild"]),
          child: []
        };
        if (hasFormLarge) {
          obj["child"] = [formMiddle];
        } else {
          obj = formMiddle;
        }
      }
      if (hasFormSmall) {
        typeIds.push(typeFormSmall["typeId"]);
        formSmall = {
          name: typeFormSmall["typeName"],
          id: typeFormSmall["typeId"],
          leaf: true,
          child: []
        };
        if (hasFormMiddle) {
          formMiddle["child"] = [formSmall];
        } else {
          obj = formSmall;
        }
      }
      this.basefrom["type"] = typeIds;
      console.log("obj", obj);
      if (Object.keys(obj).length > 0) {
        this.options = [];
        this.options.push(obj);
        let assetTypeList = await this.setAssetTypeList({
          menuTypeId: this.$route.query.checkTypeId
            ? this.$route.query.checkTypeId
            : this.spaceMenuTypeId
        });
        assetTypeList.map(res => {
          if (res.id != obj.id) {
            this.options.push(res);
          }
        });
      }

      console.log("this.options", this.options);
    },
    gettypeItem(data, level) {
      let { formId, templateFormId, typeId, typeName } = data;
      if (typeId != null) {
        this.assetsTypeList.push({
          ...data,
          id: typeId,
          name: typeName,
          level
        });
        this.$nextTick(() => {
          let refsId = `assetstype${typeId}`;
          this.$refs[refsId][0].getTemplateDetail(templateFormId, formId);
        });
      }
    },
    // 懒加载资产类型
    async getAssetTypeList(node) {
      const { level, value, children, data } = node;
      console.log("node", node);
      let obj = {};
      let menuTypeId = this.$route.query.checkTypeId
        ? this.$route.query.checkTypeId
        : this.spaceMenuTypeId;
      obj["menuTypeId"] = menuTypeId;
      if (level == 0) {
        // obj["id"] = menuTypeId;
      } else {
        obj["pid"] = value;
      }
      let assetTypeList = await this.setAssetTypeList(obj, level, data);
      console.log("assetTypeList", assetTypeList);
      return assetTypeList;
    },
    setAssetTypeList(obj, level, child) {
      return new Promise((resolve, reject) => {
        getAssetTypeList(obj).then(res => {
          if (res.data.success) {
            let childId = "";
            let hasChild = false;
            if (child && child["child"]) {
              hasChild = true;
              if (child["child"].length > 0) {
                childId = child["child"][0].id;
              }
            }
            let data = res.data.data.filter(item => {
              item["leaf"] = !item["hasEnableStatusChild"];
              return hasChild ? item.status && item.id != childId : item.status;
            });
            resolve(data);
          }
        });
      });
    },
    async saveAssets() {
      let isCheck = await this.validateForm();
      console.log(9999, isCheck);
      if (!isCheck) {
        this.$message.warning("请检查表单内容!");
      } else {
        this.getFormData();
      }
    },
    getFormData() {
      let assetstype = [];
      this.assetsTypeList.map(item => {
        let refsId = `assetstype${item.id}`;
        assetstype.push(this.$refs[refsId][0].saveFormArrValue());
      });
      if (this.assetsFromId != "") {
        assetstype.push(this.$refs["assetsFrom"].saveFormArrValue());
      }
      Promise.all([...assetstype])
        .then(result => {
          let assetsFromDataId = "";
          let data = {
            ...this.basefrom,
            price: this.basefrom["price"] ? this.basefrom["price"] * 100 : 0
          };
          result.map(item => {
            if (item.templateFormId == this.assetsFromId) {
              assetsFromDataId = item.formId;
            }
            this.assetsTypeList.map(i => {
              if (item.templateFormId == i.templateFormId) {
                let obj = {
                  ...item,
                  typeId: i.id,
                  typeName: i.name
                };
                switch (i.level) {
                  case 2:
                    data["typeFormLarge"] = obj;
                    break;
                  case 3:
                    data["typeFormMiddle"] = obj;
                    break;
                  case 4:
                    data["typeFormSmall"] = obj;
                    break;
                }
              }
            });
          });
          delete data.type;
          if (this.isBindSpace) {
            data["spaceId"] = this.spaceId;
          }
          data["formId"] = assetsFromDataId;
          data["fileIds"] = this.$refs["FileList"].filelist;
          if (this.currentCheckObj["type"] == "add") {
            data["menuTypeId"] = this.currentCheckObj["checkTypeId"];
            this.saveAsset(data);
          } else if (this.currentCheckObj["type"] == "edit") {
            data["id"] = this.currentCheckObj["id"];
            this.editAsset(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    validateForm() {
      let isCheck = true;
      let formValid = {};
      return new Promise((resolve, reject) => {
        this.$refs["basefrom"].validate(valid => {
          formValid["basefrom"] = valid;
          this.$refs["assetsFrom"].$refs["form"].validate(valid => {
            formValid["assetsFrom"] = valid;
          });
          this.assetsTypeList.map(item => {
            let refsId = `assetstype${item.id}`;
            this.$refs[refsId][0].$refs["form"].validate(valid => {
              formValid[refsId] = valid;
            });
          });
          Object.keys(formValid).forEach(res => {
            if (!formValid[res]) {
              isCheck = false;
            }
          });
          resolve(isCheck);
        });
      });
    },
    getValidateForm(data) {
      return new Promise((resolve, reject) => {
        data.validate(valid => {
          resolve(valid);
        });
      });
    },
    // 获取选取的资产类型详情
    changeCascader(e) {
      const panelRefs = this.$refs["cascader"].$refs.panel;
      console.log("getCheckedNodes", panelRefs.getCheckedNodes()[0]);
      let Nodes = panelRefs.getCheckedNodes()[0];
      if (Nodes["children"].length == 0) {
        panelRefs.lazyLoad(panelRefs.getCheckedNodes()[0]);
      }

      let list = this.$refs["cascader"].getCheckedNodes(true);
      this.assetsTypeName = `(资产类型：${list[0]["pathLabels"].join("-")})`;
      this.assetsTypeList = [];
      e.map(async item => {
        let data = await this.getAssetTypeDetail(item);
        this.assetsTypeList.push({
          ...data,
          typeName: data["name"]
        });
        this.$nextTick(() => {
          let refsId = `assetstype${data.id}`;
          this.$refs[refsId][0].getTemplateDetail(
            data.templateFormId,
            data.formId
          );
        });
      });
      this.$nextTick(() => {
        this.$refs.basefrom.validateField("type");
        const dom = document.getElementsByClassName("el-radio is-checked")[0];
        const brother = dom.nextElementSibling;
        brother.click();
      });
    },
    getAssetTypeDetail(id) {
      return new Promise((resolve, reject) => {
        getAssetTypeDetail(id).then(res => {
          if (res.data.success) {
            resolve(res.data.data);
          }
        });
      });
    },
    changeStatus(e) {
      this.$refs.basefrom.validateField("status");
    },
    getTypeName() {
      this.assetsTypeName = "";
      let list = [];
      this.assetsTypeList.map(item => {
        list.push(item.typeName);
      });
      this.assetsTypeName = `(资产类型：${list.join("-")})`;
    },
    // 设置空间id
    setSpace(spaceId) {
      this.basefrom["spaceId"] = spaceId;
    }
  }
};
</script>

<style lang="scss" scoped>
.df_center_wrap {
  align-items: flex-start;
}
</style>
