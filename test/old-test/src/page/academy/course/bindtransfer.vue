<template>
  <el-transfer
    style="width: 100%;"
    filterable
    :filter-method="filterMethod"
    filter-placeholder="请输入名称"
    v-model="transferValue"
    :data="transferData"
  >
  </el-transfer>
</template>

<script>
import { mapGetters } from "vuex";
import { tablestyle } from "@/const/tabledata/index";
import moment from "moment";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import course from "@/const/academy/course.js";
import { resetData } from "@/util/util.js";
import { getCourseChild, getAllCourse } from "@/api/academy/course.js";
import { getActivityChild, getAllActivity } from "@/api/academy/activity.js";
import {
  getCompetitionChild,
  getAllCompetition
} from "@/api/academy/competition.js";
import { download } from "@/util/download.js";

export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table
  },
  props: {
    bindCourseType: {
      type: Number,
      default: 1
    },
    courseType: {
      type: String,
      require: true
    },
    type: {
      type: String,
      default: "add"
    },
    ignoreId: {
      type: String,
      default: ""
    }
  },
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      transferData:generateData(),
      transferValue: []
    };
  },
  created() {
    // this.getTabelData();
  },

  mounted() {},
  activated() {},
  computed: {
    ...mapGetters(["permissions", "currentstatus"])
  },
  methods: {
    initData(data) {},
    getTabelData() {
      switch (this.bindCourseType) {
        case 1:
          if (this.courseType == "club") {
            getAllCourse().then(res => {
              if (res.data.success) {
                this.resetData(res);
              }
            });
          } else {
            getCourseChild(
              this.courseType == "course" ? this.ignoreId : ""
            ).then(res => {
              if (res.data.success) {
                this.resetData(res);
              }
            });
          }

          break;
        case 2:
          if (this.courseType == "club") {
            getAllActivity().then(res => {
              if (res.data.success) {
                this.resetData(res);
              }
            });
          } else {
            getActivityChild(
              this.courseType == "activity" ? this.ignoreId : ""
            ).then(res => {
              if (res.data.success) {
                this.resetData(res);
              }
            });
          }

          break;
        case 3:
          if (this.courseType == "club") {
            getAllCompetition().then(res => {
              if (res.data.success) {
                this.resetData(res);
              }
            });
          } else {
            getCompetitionChild(
              this.courseType == "competition" ? this.ignoreId : ""
            ).then(res => {
              if (res.data.success) {
                this.resetData(res);
              }
            });
          }

          break;
      }
    },
    resetData(res) {
      this.$nextTick(() => {
        let data = res.data.data;
        console.log("resetData", data);
        data.map(item => {
          this.transferData.push({
            label: item["nameCn"],
            key: Number(item["id"])
          });
        });
        console.log("  this.transferData", this.transferData);
      });
    },
    bindCourseConfirm() {},
    filterMethod(query, item) {
      console.log(" this.search", this.search, !this.search);
      if (!this.search) {
        this.tableData = this.tableDataAll;
      } else {
        this.tableData = this.tableDataAll.filter(data => {
          return (
            data.nameCn.indexOf(this.search) != -1 ||
            data.nameEn.indexOf(this.search) != -1
          );
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bindtable {
  width: 100%;
  text-align: right;
  .tableBox {
    padding: 20px 0;
  }
}
.tableRow {
  display: block;
  width: 100%;
  white-space: nowrap; //不换行
  overflow: hidden; //超出部分隐藏
  text-overflow: ellipsis; //文本溢出显示省略号
}
/deep/.el-table__fixed-body-wrapper {
  top: 60px !important;
}
</style>
