<template>
  <div v-loading="loading">
    <Table
      height="500"
      :tableTitle="tabletitle"
      :tableData="tableData"
      @sortChange="sortChange"
    />
    <Pagination
      :total="paginationTotal"
      :pagination="pagination"
      @handleCurrentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  getClassMbList,
  getClassCAT4List,
  getClassPassList,
  getClassProgressList,
  getCombineCLASSTable,
} from "@/api/isa/science/class.js";
import { mapGetters } from "vuex";
import tabletitle from "@/const/isagroup/tabletitle.js";
import Table from "@/components/isagroupcommon/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
export default {
  name: "student",
  components: { Table, Pagination },
  props: {
    tableType: {
      require: true,
      type: String,
    },
    searchFrom: {
      default: () => {
        return {};
      },
      type: Object,
    },
    schoolList: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  data() {
    return {
      tabletitle: [],
      pagination: {
        size: 100,
        current: 1,
      },
      paginationTotal: 0,
      tableData: [],
      sortFrom: {},
      loading: false,
      //   wuHanSchool: ["CL6-0001", "CL6-0002", "CL6-0003"],
      wuHanSchool: ["CL6-0002"],
    };
  },
  created() {},
  mounted() {},
  activated() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    // 修改排序
    sortChange(data) {
      console.log("sortChange", data);
      if (data["order"]) {
        this.sortFrom = {
          ...this.sortFrom,
          "orders.asc": data["order"] == "ascending" ? 1 : 0,
          "orders.column": data["prop"],
        };
      } else {
        this.sortFrom = {};
      }

      this.getList();
    },
    resetTitle() {
      this.tabletitle = tabletitle[this.tableType];
      //   let externId = "";

      //   if (this.searchFrom["schoolIds"]) {
      //     this.schoolList.map((item) => {
      //       if (item["id"] == this.searchFrom["schoolIds"]) {
      //         externId = item["externId"];
      //       }
      //     });
      //     if (this.wuHanSchool.includes(externId)) {
      //       this.tabletitle = tabletitle[this.tableType].filter((item) => {
      //         return item["prop"] != "form";
      //       });
      //     } else {
      //       this.tabletitle = tabletitle[this.tableType];
      //     }
      //   } else {
      //     this.tabletitle = tabletitle[this.tableType];
      //   }
    },
    getList() {
      this.resetTitle();
      this.loading = true;
      switch (this.tableType) {
        case "classManageBac":
          getClassMbList({
            ...this.searchFrom,
            ...this.pagination,
            ...this.sortFrom,
          })
            .then((res) => {
              console.log("getClassMbList", res);
              if (res.data.success) {
                let data = res.data.data;
                if (data) {
                  this.paginationTotal = data.total;
                  this.tableData = data.data;
                  this.tableData.map((item) => {
                    item["cellType"] = "mb";
                  });
                } else {
                  this.tableData = [];
                }
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
        case "cat":
          getClassCAT4List({
            ...this.searchFrom,
            ...this.pagination,
          })
            .then((res) => {
              console.log("getClassCAT4List", res);
              if (res.data.success) {
                let data = res.data.data;
                if (data) {
                  this.paginationTotal = data.total;
                  this.tableData = data.data;
                  this.tableData.map((item) => {
                    item["cellType"] = "cat";
                  });
                } else {
                  this.tableData = [];
                }
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
        case "classPass":
          getClassPassList({
            ...this.searchFrom,
            ...this.pagination,
          })
            .then((res) => {
              console.log("getClassPassList", res);
              if (res.data.success) {
                let data = res.data.data;
                if (data) {
                  this.paginationTotal = data.total;
                  this.tableData = data.data;
                  this.tableData.map((item) => {
                    item["cellType"] = "pass";
                  });
                } else {
                  this.tableData = [];
                }
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
        case "classProgress":
          getClassProgressList({
            ...this.searchFrom,
            ...this.pagination,
          })
            .then((res) => {
              console.log("getClassProgressList", res);
              if (res.data.success) {
                let data = res.data.data;
                if (data) {
                  this.paginationTotal = data.total;
                  this.tableData = data.data;
                  this.tableData.map((item) => {
                    item["cellType"] = "progress";
                  });
                } else {
                  this.tableData = [];
                }
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
        case "classCombine":
          getCombineCLASSTable({
            ...this.searchFrom,
            ...this.pagination,
            ...this.sortFrom,
          })
            .then((res) => {
              // console.log("getCombineCLASSTable",  res.data.data);
              if (res.data.success) {
                let data = res.data.data;
                if (data) {
                  console.log("getCombineCLASSTable", data.data);
                  this.paginationTotal = data.total;
                  this.tableData = data.data;
                  this.tableData.map((item) => {
                    item["cellType"] = "classCombine";
                  });
                } else {
                  this.tableData = [];
                }
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
          break;
      }
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
