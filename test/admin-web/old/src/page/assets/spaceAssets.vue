<template>
  <div class="detail_item">
    <div class="detail_item_title df_sb">
      <span>资产信息</span>
      <div>
        <el-button
          v-if="permissions['asset_add']"
          type="primary"
          size="mini"
          @click="handleAssets('add')"
          >新增资产信息</el-button
        >
        <el-button
          v-if="permissions['asset_import']"
          type="primary"
          size="mini"
          @click="showUpdate = true"
          >导入资产信息</el-button
        >
        <el-button
          v-if="permissions['asset_binging_space']"
          type="primary"
          size="mini"
          @click="bindSpace"
          >绑定资产信息</el-button
        >
      </div>
    </div>
    <div style="padding: 30px">
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
    <!-- 导入资产信息 -->
    <Update
      ref="update"
      :spaceId="$route.query.id"
      :menuTypeId="menuTypeId"
      :showUpdate="showUpdate"
      @closeModal="closeModal"
      @getAssetPage="getAssetPage"
    />
    <!-- 新增资产 -->
    <el-dialog
      v-if="showAssets"
      :title="assetsTitle[currentType]"
      :visible.sync="showAssets"
      width="80%"
      :before-close="beforeClose"
    >
      <Assets
        v-if="currentType != 'look'"
        :isBindSpace="true"
        :spaceMenuTypeId="menuTypeId"
        :spaceId="$route.query.id"
        :showTop="false"
        @beforeClose="beforeClose"
        @refreshData="refreshData"
        ref="assets"
      />
      <AssetsDetail v-else ref="assetsDetail" :isSpaceAssets="true" />
    </el-dialog>
    <BandSpace
      v-if="showBindSpace"
      ref="BandSpace"
      :spaceId="$route.query.id"
      :showBindSpace="showBindSpace"
      @closeModal="closeModal"
      @refreshData="refreshData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSpaceAssetList,
  getAssetPage,
  changeAssetStatus,
  bindSpaceAsset,
} from "@/api/assets/list/index.js";
import { getSpaceTop } from "@/api/assets/type/index.js";
import Assets from "@/page/assets/assetsfrom.vue";
import AssetsDetail from "@/page/assets/assetsdetail.vue";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import Update from "@/page/assets/modal/update.vue";
import BandSpace from "@/page/assets/modal/bandSpace.vue";
import { assetsStatus } from "@/const/assets/index.js";
export default {
  components: {
    Assets,
    Table,
    Update,
    BandSpace,
    Pagination,
    AssetsDetail,
  },
  props: {
    sapceName: {
      type: String,
      default: "",
      require: false,
    },
  },
  data() {
    return {
      showUpdate: false,
      showBindSpace: false,
      // 分页
      pagination: {
        size: 10,
        current: 1,
        keywords: "",
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "资产名称", prop: "name", width: "" },
        { label: "资产类型", prop: "typeNames", width: "" },
        { label: "资产编码", prop: "code", width: "" },
        { label: "采购日期", prop: "purchaseTime", width: "" },
        { label: "资产状态", prop: "assetsStatus", width: "" },
      ],
      tableData: [],
      tableBtn: [
        {
          name: "闲置",
          type: "idle",
          permissions: "asset_status",
          color: "#",
          assetStatus: 1,
        },
        {
          name: "使用",
          type: "use",
          permissions: "asset_status",
          color: "",
          assetStatus: 2,
        },
        {
          name: "报废",
          type: "scrap",
          permissions: "asset_status",
          color: "",
          assetStatus: 3,
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "asset_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
      ],
      showAssets: false,
      menuTypeId: "",
      assetsStatus: assetsStatus,
      currentType: "",
      assetsTitle: {
        add: "新增资产",
        edit: "编辑资产",
        look: "查看资产",
      },
    };
  },
  created() {
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
    this.getAssetPage();
    this.getSpaceTop();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    refreshData() {
      this.getAssetPage();
      this.closeModal(false);
    },
    getSpaceTop() {
      getSpaceTop({ spaceId: this.$route.query.id }).then((res) => {
        if (res.data.success) {
          console.log("res", res);
          this.menuTypeId = res.data.data.id;
        }
      });
    },
    getAssetPage() {
      getAssetPage({
        ...this.pagination,
        spaceId: this.$route.query.id,
      }).then((res) => {
        if (res.data.success) {
          console.log("res", res);
          this.tableData = res.data.data.records;
          this.paginationTotal = res.data.data.total;
          this.tableData.map((item) => {
            item["assetsStatus"] = this.getAssetsStatus(item.status);
          });
        }
      });
    },

    changeAssetStatus(id, status) {
      changeAssetStatus(status, id).then((res) => {
        if (res.data.success) {
          this.$message.success("已修改状态");
          this.getAssetPage();
        }
      });
    },
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getAssetPage();
    },
    handleAssets(type, id) {
      this.showAssets = true;
      this.currentType = type;
      this.$nextTick(() => {
        this.$refs["assets"].setBaserules(type, this.menuTypeId, id);
        if (type == "edit") {
          this.$refs["assets"].getAssetDetail(id);
        } else {
          this.$refs["assets"].basefrom["space"] = this.sapceName;
        }
      });
    },
    lookAssets(item) {
      this.showAssets = true;
      this.currentType = "look";
      this.$nextTick(() => {
        console.log(6666, this.$refs["assetsDetail"]);
        this.$refs["assetsDetail"].menuTypeId = this.menuTypeId;
        this.$refs["assetsDetail"].getAssetDetail(item.id);
      });
    },
    bindSpace() {
      this.showBindSpace = true;
    },
    playTab(name, item, scope) {
      switch (name) {
        case "idle":
          this.changeAssetStatus(item.id, 1);
          break;
        case "use":
          this.changeAssetStatus(item.id, 2);
          break;
        case "scrap":
          this.changeAssetStatus(item.id, 3);
          break;
        case "edit":
          this.handleAssets("edit", item.id);
          break;
        case "look":
          this.lookAssets(item);
          break;
      }
    },
    getAssetsStatus(status) {
      let statusName = "--";
      this.assetsStatus.map((item) => {
        if (item.type == status) {
          statusName = item.name;
        }
      });
      return statusName;
    },
    beforeClose() {
      // this.$refs.assets.clear();
      this.showAssets = false;
    },
    closeModal(type) {
      this.showUpdate = type;
      this.showBindSpace = type;
      this.showAssets = type;
    },
  },
};
</script>