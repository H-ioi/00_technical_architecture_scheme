<template>
  <div class="detail">
    <div class="detail_content">
      <div class="df_sb detail_top" v-if="!isSpaceAssets">
        <BackItem />
        <div>
          <el-button
            v-if="permissions['asset_edit']"
            type="primary"
            size="mini"
            @click="toEdit"
            >编辑</el-button
          >
          <el-button
            v-if="currentStatus != 1 && permissions['asset_status']"
            type="primary"
            size="mini"
            @click="changeAssetStatus(1)"
            >闲置</el-button
          >
          <el-button
            v-if="currentStatus != 2 && permissions['asset_status']"
            type="primary"
            size="mini"
            @click="changeAssetStatus(2)"
            >使用</el-button
          >
          <el-button
            v-if="currentStatus != 3 && permissions['asset_status']"
            type="primary"
            size="mini"
            @click="changeAssetStatus(3)"
            >报废</el-button
          >
        </div>
      </div>
      <div class="detail_item">
        <div class="detail_item_title">资产详情</div>
        <div class="detail_baseinfo">
          <div class="detail_baseinfo_item">
            <span>资产名称</span>
            <span :title="setDefault(baseInfo['name'])">{{
              setDefault(baseInfo["name"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>资产状态</span>
            <span :title="getAssetsStatus(baseInfo['status'])">{{
              getAssetsStatus(baseInfo["status"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>资产编码</span>
            <span :title="setDefault(baseInfo['code'])">{{
              setDefault(baseInfo["code"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>资产类型</span>
            <span :title="assetsTypeName.join('-')">{{
              assetsTypeName.join("-")
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>财务编码</span>
            <span :title="setDefault(baseInfo['financeCode'])">{{
              setDefault(baseInfo["financeCode"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>教育编码</span>
            <span :title="setDefault(baseInfo['educationCode'])">{{
              setDefault(baseInfo["educationCode"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>采购时间</span>
            <span :title="setDefault(baseInfo['purchaseTime'])">{{
              setDefault(baseInfo["purchaseTime"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>所属空间</span>
            <span :title="setDefault(baseInfo['space'])">{{
              setDefault(baseInfo["space"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>空间名称</span>
            <span :title="setDefault(baseInfo['spaceName'])">{{
              setDefault(baseInfo["spaceName"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>采购方式</span>
            <span :title="setDefault(baseInfo['purchaseMethod'])">{{
              setDefault(baseInfo["purchaseMethod"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>金额(RMB)</span>
            <span :title="setDefault(baseInfo['price'])">{{
              setDefault(baseInfo["price"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>流水号</span>
            <span :title="setDefault(baseInfo['syncSerialNo'])">{{
              setDefault(baseInfo["syncSerialNo"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>品牌</span>
            <span :title="setDefault(baseInfo['brand'])">{{
              setDefault(baseInfo["brand"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>计量单位</span>
            <span :title="setDefault(baseInfo['unit'])">{{
              setDefault(baseInfo["unit"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>规格型号</span>
            <span :title="setDefault(baseInfo['model'])">{{
              setDefault(baseInfo["model"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>所在仓库</span>
            <span :title="setDefault(baseInfo['warehouseName'])">{{
              setDefault(baseInfo["warehouseName"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>入库日期</span>
            <span :title="setDefault(baseInfo['warehouseDate'])">{{
              setDefault(baseInfo["warehouseDate"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>使用人</span>
            <span :title="setDefault(baseInfo['operateUser'])">{{
              setDefault(baseInfo["operateUser"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>使用部门</span>
            <span :title="setDefault(baseInfo['operateDepartment'])">{{
              setDefault(baseInfo["operateDepartment"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>所属公司</span>
            <span :title="setDefault(baseInfo['ownCompany'])">{{
              setDefault(baseInfo["ownCompany"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>所属部门</span>
            <span :title="setDefault(baseInfo['ownDepartment'])">{{
              setDefault(baseInfo["ownDepartment"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>存放位置</span>
            <span :title="setDefault(baseInfo['depositLocation'])">{{
              setDefault(baseInfo["depositLocation"])
            }}</span>
          </div>

          <div style="width: 100% !important;" class="detail_baseinfo_item">
            <span>备注</span>
            <span :title="setDefault(baseInfo['note'])">{{
              setDefault(baseInfo["note"])
            }}</span>
          </div>
          <div style="width: 100% !important;" class="detail_baseinfo_item">
            <span>资产图片</span>
            <FileList
              ref="FileList"
              :scene="'asset_file'"
              :isDisabled="true"
              :showDownload="true"
            />
          </div>
          <FromItemDetail :ref="`assetsFrom`" />
        </div>
      </div>
      <!-- 绑定的工单 -->
      <div class="detail_item" v-if="orderTableData.length > 0">
        <div class="detail_item_title">工单列表</div>
        <div class="detail_baseinfo">
          <Table
            ref="Table"
            :tableTitle="orderTableTitle"
            :tableData="orderTableData"
            :tableBtn="[]"
            :showSelection="false"
          />
        </div>
      </div>
      <div
        class="detail_item"
        v-for="item in assetsTypeList"
        :key="item.typeId"
      >
        <div class="detail_item_title">{{ item.typeName }}</div>
        <div class="detail_baseinfo">
          <FromItemDetail :ref="`assetstype${item.typeId}`" />
        </div>
      </div>
      <div class="detail_item" v-if="false">
        <div class="detail_item_title">资产工单记录</div>
        <div class="detail_baseinfo">
          <Table
            ref="Table"
            :showSelection="false"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="tableBtn"
            @playTab="playTab"
          />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import BackItem from "@/components/common/detailItem/BackItem.vue";
import { getAssetDetail, changeAssetStatus } from "@/api/assets/list/index.js";
import {
  getAssetTypeDetail,
  getAssetTypeConf
} from "@/api/assets/type/index.js";
import { getAssetForm } from "@/api/assets/form/index.js";
import { assetsStatus, purchaseMethodList } from "@/const/assets/index.js";
import { order } from "@/const/order/index.js";
import { getOrderAssetList } from "@/api/workorder/order/index.js";
import FromItemDetail from "@/page/space/from/fromitemdetail.vue";
import FileList from "@/components/common/FileList";
export default {
  components: {
    BackItem,
    Table,
    Pagination,
    FromItemDetail,
    FileList
  },
  props: {
    isSpaceAssets: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      baseInfo: {},
      assetsTypeList: [],
      assetsTypeName: [],
      pagination: {
        size: 10,
        status: 1,
        current: 1
      },
      paginationTotal: 0,
      tableTitle: "",
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: ""
        }
      ],
      currentStatus: "",
      menuTypeId: "",
      orderTableTitle: order["orderTitle"],
      orderTableData: [],
      dictValue:""
    };
  },
  created() {
    if (!this.isSpaceAssets) {
      this.getAssetDetail(this.$route.query.assetId);
      this.menuTypeId = this.$route.query.checkTypeId;
      this.dictValue = this.$route.query.dictValue;
      this.getOrderAssetList();
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getOrderAssetList() {
      getOrderAssetList(this.$route.query.assetId).then(res => {
        if (res.data.success) {
          console.log("res", res);
          this.orderTableData = res.data.data;
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
            spaceName,
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
            note
          } = res.data.data;
          this.currentStatus = status;
          this.baseInfo = {
            code,
            educationCode,
            financeCode,
            name,
            status,
            purchaseTime,
            space,
            spaceName,
            // 金蝶增加字段
            purchaseMethod: this.getDataLabel(
              purchaseMethod,
              purchaseMethodList
            ),
            price: price / 100,
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
            type: [
              typeFormLarge["typeId"],
              typeFormMiddle["typeId"],
              typeFormSmall["typeId"]
            ]
          };
          console.log(" this.basefrom", this.basefrom);
          this.getAssetTypeConf(typeFormLarge, typeFormMiddle, typeFormSmall);
          this.getAssetForm(assetForm["formId"]);
          this.$nextTick(() => {
            let data = { outerId: id, scene: "asset_file" };
            this.$refs["FileList"].getFileList(data);
          });
        }
      });
    },
    getAssetTypeConf(typeFormLarge, typeFormMiddle, typeFormSmall) {
      getAssetTypeConf({ typeId: this.menuTypeId }).then(res => {
        console.log("getAssetTypeConf", res);
        if (res.data.success) {
          let { code, levels } = res.data.data;
          if (levels.includes(2) && typeFormLarge["status"]) {
            this.gettypeItem(typeFormLarge, 2);
          }
          if (levels.includes(3) && typeFormMiddle["status"]) {
            this.gettypeItem(typeFormMiddle, 3);
          }
          if (levels.includes(4) && typeFormSmall["status"]) {
            this.gettypeItem(typeFormSmall, 4);
          }
          // this.getTypeName();
        }
      });
    },
    getAssetForm(fromId = null) {
      getAssetForm({ menuTypeId: this.menuTypeId }).then(res => {
        console.log("res", res);
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
    changeAssetStatus(status) {
      changeAssetStatus(status, this.$route.query.assetId).then(res => {
        if (res.data.success) {
          this.$message.success("已修改状态");
          this.currentStatus = status;
          this.baseInfo["status"] = status;
        }
      });
    },
    gettypeItem(data) {
      let { formId, templateFormId, typeId, typeName } = data;
      if (typeId != null) {
        this.assetsTypeName.push(typeName);
        this.assetsTypeList.push({
          ...data,
          id: typeId,
          name: typeName
        });
        this.$nextTick(() => {
          let refsId = `assetstype${typeId}`;
          this.$refs[refsId][0].getTemplateDetail(templateFormId, formId);
        });
      }
    },
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          break;
      }
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      //   this.getOrderList();
    },
    toEdit() {
      this.$router.push({
        path: "/assets/edit",
        query: {
          ...this.$route.query,
          type: "edit"
        }
      });
    },
    setDefault(data) {
      return data && data != "" ? data : "--";
    },
    getAssetsStatus(status) {
      let statusName = "--";
      assetsStatus.map(item => {
        if (item.type == status) {
          statusName = item.name;
        }
      });
      return statusName;
    },
    getDataLabel(value, data) {
      console.log("getDataLabel", value, data);
      let str = "";
      data.map(item => {
        if (item.type == value) {
          str = item.label;
        }
      });
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.detail_baseinfo_item {
  width: 25% !important;
  margin-bottom: 20px;
}
.detail_baseinfo {
  .el-form {
    width: 100% !important;
  }
}
</style>
