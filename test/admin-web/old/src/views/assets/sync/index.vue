<template>
  <div>
    <StatusItem
      :statusList="statusList"
      :currentstatus="currentstatus"
      @changeStasus="changeStasus"
    />
    <div class="searchFromBox search" style="padding: 20px">
      <el-form
        ref="searchFrom"
        class="df_align_center searchFrom"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item label="关键词" style="width: 160px">
          <el-input
            v-model="searchFrom.keyword"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="资产编码" style="width: 160px">
          <el-input v-model="searchFrom.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" style="width: 160px">
          <el-select v-model="searchFrom.ownCompany" placeholder="请选择">
            <el-option
              :key="k"
              v-for="(i, k) in companyList"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
          <!-- <el-input
            v-model="searchFrom.ownCompany"
            placeholder="请输入"
          ></el-input> -->
        </el-form-item>
        <el-form-item label="流水号" style="width: 160px">
          <el-input
            v-model="searchFrom.serialNo"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="采购方式" style="width: 160px">
          <el-select
            multiple
            v-model="searchFrom.purchaseMethod"
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
        <el-form-item label="资产状态" style="width: 160px">
          <el-select multiple v-model="searchFrom.status" placeholder="请选择">
            <el-option
              :key="k"
              v-for="(i, k) in assetsSyncStatus"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 110px; margin-right: 0;margin-left:auto;">
          <el-button
            class="el-button-icon"
            type="primary"
            size="large"
            icon="el-icon-search"
            @click="search"
          ></el-button>
          <el-button
            class="el-button-icon"
            type="defult"
            size="large"
            icon="el-icon-delete"
            @click="clear"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox" style="padding-top: 0;">
      <div class="df_sb">
        <el-button
          type="primary"
          size="medium"
          @click="playBtn('confirm')"
          v-if="permissions['asset_sync_confirm_batch'] && currentstatus == '1'"
          >同步</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click="playBtn('cancel')"
          v-if="permissions['asset_sync_cancel_batch'] && currentstatus == '1'"
          >不同步</el-button
        >
      </div>
      <div class="df_sb">
        <PaginationInfo :paginationTotal="paginationTotal" />
        <SelectTabletMenu
          type="syncTableTitle"
          @resetTableTitle="resetTableTitle"
        />
      </div>
    </div>
    <div class="tableBox" :key="pagination['current']">
      <Table
        ref="Table"
        :tabelKey="pagination['current']"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="currentstatus == '1' && showSelection"
        @playTab="playTab"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <AssetsType ref="AssetsType" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
import {
  getAssetList,
  noSynchronization,
  batchSynchronization,
  batchNoSynchronization
} from "@/api/assets/sync/index.js";
import {
  assetsSyncType,
  purchaseMethodList,
  assetsSyncStatus
} from "@/const/assets/index.js";
import { selectSyncTableTitle } from "@/const/assets/tablelist.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
// import Table from "@/components/common/Table.vue";
import Table from "./components/Table.vue";
import StatusItem from "@/components/common/StatusItem.vue";
import SelectTabletMenu from "@/components/common/omsselect/selecttabletmenu.vue";
import AssetsType from "./modal/assetstype.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    StatusItem,
    SelectTabletMenu,
    AssetsType
  },
  data() {
    return {
      showSelection: true,
      statusList: assetsSyncType,
      purchaseMethodList: purchaseMethodList,
      assetsSyncStatus: assetsSyncStatus,
      currentstatus: "1",
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {
        // serialNo: "ZCDAK-WLC-20240711-008"
      },
      tableTitle: [],
      tableData: [],
      tableBtn: [],
      btnList: [
        {
          name: "同步",
          type: "isSynchronization",
          permissions: "asset_sync_confirm_single",
          icon: "el-icon-view"
        },
        {
          name: "不同步",
          type: "noSynchronization",
          permissions: "asset_sync_cancel_single",
          icon: "el-icon-view"
        }
      ],
      selectionIds: [],
      companyList: []
    };
  },
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions"])
  },

  created() {
    this.fetchTypeList();
    this.getList();
    this.resetTableTitle();
  },

  watch: {},
  mounted() {},
  activated() {
    this.getList();
    this.resetTableTitle();
  },
  methods: {
    fetchTypeList() {
      fetchTypeList("asset_yzj_own_company").then(res => {
        console.log("res.data", res.data);
        let data = res.data.data;
        this.companyList = data;
      });
    },
    resetTableTitle() {
      let thePool_LocalCache = this.$store.getters.thePool_LocalCache;
      if (thePool_LocalCache["syncTableTitle"]) {
        this.tableTitle = thePool_LocalCache["syncTableTitle"].filter(item => {
          return item["show"];
        });
      } else {
        this.tableTitle = selectSyncTableTitle.filter(item => {
          return item["show"];
        });
      }
    },
    getList() {
      let formData = {
        ...this.pagination,
        ...this.searchFrom
      };
      if (this.currentstatus != "4") {
        formData["syncStatus"] = this.currentstatus;
      }
      this.tableData = [];
      getAssetList(formData).then(res => {
        console.log("res", res);
        if (res.data.success) {
          if (this.currentstatus == "1") {
            this.tableBtn = this.btnList;
          } else {
            this.tableBtn = [];
          }
          let { data, total } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.tableData.map((item, index) => {
            item["statusLabel"] = this.getDataLabel(
              item["status"],
              this.assetsSyncStatus
            );
            item["ownCompany"] = this.getDataLabel(
              item["ownCompany"],
              this.companyList
            );
            item["purchaseMethodLabel"] = this.getDataLabel(
              item["purchaseMethod"],
              this.purchaseMethodList
            );
            // item["pictureList"] = this.getPictureList(item["pictureIdMap"]);
            this.$set(this.tableData, index, {
              ...item,
              pictureList: this.getPictureList(item["pictureIdMap"])
            });
          });
        }
      });
    },
    getPictureList(map) {
      let list = [];
      if (!map) return list;
      Object.keys(map).forEach((res, index) => {
        if (index == 0) {
          list.push({
            min: res,
            max: map[res]
          });
        }
      });
      return list;
    },
    // 表格操作
    playTab(name, item, scope) {
      console.log(6666, name, item);
      switch (name) {
        case "isSynchronization":
          this.$refs["AssetsType"].show = true;
          this.$refs["AssetsType"].type = "single";
          this.$refs["AssetsType"].assetId = item.id;
          break;
        case "noSynchronization":
          this.$confirm("确认不同步吗？")
            .then(_ => {
              noSynchronization(item.id).then(res => {
                if (res.data.success) {
                  this.$message.success("操作成功");
                  this.getList();
                }
              });
              done();
            })
            .catch(_ => {});
          break;
      }
    },
    playBtn(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId.length > 0) {
        this.selectionIds = selectionId;
        switch (type) {
          case "confirm":
            this.$refs["AssetsType"].show = true;
            this.$refs["AssetsType"].type = "batch";
            this.$refs["AssetsType"].assetId = selectionId;
            break;
          case "cancel":
            this.$confirm("确认不同步吗？")
              .then(_ => {
                batchNoSynchronization(selectionIds).then(res => {
                  if (res.data.success) {
                    this.$message.success("操作成功");
                    this.getList();
                  }
                });
                done();
              })
              .catch(_ => {});
            break;
        }
      } else {
        this.$message.warning("请先选择数据");
        return;
      }
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getList();
    },
    // 清除搜索
    clear() {
      this.searchFrom = {};
      this.pagination["current"] = 1;
      this.getList();
    },
    // 状态切换
    changeStasus(item, index) {
      console.log("item, index", item, index);
      this.currentstatus = item.type;
      this.pagination["current"] = 1;
      this.getList();
    },
    initData() {
      this.changeModal(false);
      this.getList();
    },
    changeModal(type) {},
    getDataLabel(value, data) {
      let str = "";
      data.map(item => {
        if (item.value == value) {
          str = item.label;
        }
      });
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
