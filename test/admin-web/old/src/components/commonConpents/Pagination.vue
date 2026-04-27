<template>
  <div :class="['pagination', 'df_fe']">
    <el-pagination
      background
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination['current']"
      :page-sizes="pageSizes"
      :page-size="pagination['size']"
      layout="slot,prev, pager, next, jumper"
      :total="total"
    >
      <span>{{
        `共有信息 ${total} 条 目前显示${pagination["size"]}条`
      }}</span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "UniUiPagination",
  props: {
    currentfilterObj: Object,
    Status: Array,
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 40],
      total: 0,
      pagination: {
        size: 10,
        current: 1,
      },
    };
  },
  created() {
    if (this.$route.name == "我的线索") {
      this.pagination["status"] = 7;
    } else if (
      this.$route.name == "我的商机" ||
      this.$route.name == "线索公海"
    ) {
      this.pagination["status"] = 1;
    } else if (this.$route.name == "团队管理") {
      this.pagination["size"] = 12;
    } else if (this.$route.name == "消息中心") {
      this.pagination["isRead"] = 0;
    }
    console.log("this.Status", this.Status);
    let statusName = this.$route.query.statusName;
    if (this.Status !== undefined) {
      this.Status.map((item, index) => {
        if (statusName === item.name) {
          this.pagination["status"] = item.status;
        }
      });
    }
    this.$emit("getDataList", this.pagination);
  },
  mounted() {},

  methods: {
    changepagination(e) {
      let obj = {
        ...this.currentfilterObj,
        current: e,
      };
      this.$emit("getDataList", obj);
    },
    handleCurrentChange(e) {
      this.pagination["current"] = e;
      this.changepagination(e);
    },
    handleSizeChange(e) {
      this.pagination["size"] = e;
      this.changepagination();
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  padding: 30px 10px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 16px;
  span,
  /deep/.el-pager,
  /deep/.el-pagination__jump,
  /deep/.el-pagination__sizes,
  /deep/.el-input__inner {
    font-size: 16px;
    font-family: Noto Sans S Chinese;
    font-weight: 600;
    color: #667e9e;
  }
  /deep/.el-pager li {
    font-size: 16px;
  }
  /deep/.el-icon {
    font-size: 16px !important;
  }
  /deep/.el-pagination__sizes {
    margin-right: 0;
  }
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
</style>