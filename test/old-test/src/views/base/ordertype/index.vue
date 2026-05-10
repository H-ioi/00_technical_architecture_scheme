<template>
  <div>
    <div class="f_sb" style="background-color: #fff">
      <div class="schoolBox">
        <div
          :class="['schoolItem', { currentItem: currentSchoolId == i.value }]"
          v-for="(i, k) in schoolData"
          :key="k"
          @click="changeSchool(i)"
        >
          {{ i.label }}
        </div>
      </div>
      <div class="treeTable">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="tablestyle.headercellstyle"
          :row-style="tablestyle.rowstyle"
        >
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableTitle"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200px">
            <template slot-scope="scope" class="df_center">
              <div class="df_align_center table_textbtn">
                <el-button
                  v-if="scope.row.status === 1"
                  @click="editSchoolOrderType(scope.row, 'status', '禁用')"
                  style="padding: 0"
                  type="text"
                  size="small"
                >
                  禁用
                </el-button>
                <el-button
                  v-if="!scope.row.status"
                  @click="editSchoolOrderType(scope.row, 'status', '启用')"
                  style="padding: 0"
                  type="text"
                  size="small"
                >
                  启用
                </el-button>
                <el-button
                  v-if="scope.row.isClientShow"
                  @click="
                    editSchoolOrderType(scope.row, 'isClientShow', '禁止对外')
                  "
                  style="padding: 0"
                  type="text"
                  size="small"
                >
                  禁止对外
                </el-button>
                <el-button
                  v-if="!scope.row.isClientShow"
                  @click="
                    editSchoolOrderType(scope.row, 'isClientShow', '对外')
                  "
                  style="padding: 0"
                  type="text"
                  size="small"
                >
                  对外
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
import {
  getOrderTypeList,
  getSchoolOrderType,
  editSchoolOrderType
} from "@/api/workorder/order/ordertype.js";
import { tableObj } from "@/const/tabledata/index";
import { order } from "@/const/order/index.js";
import Modal from "../modal";
export default {
  name: "UniUiIndex",
  components: {
    Modal
  },
  data() {
    return {
      tablestyle: tableObj,
      contentType: "order_school",
      allList: [],
      currentSchoolId: "",
      currentRow: {},
      tableTitle: [
        { prop: "label", label: "工单类型" },
        { prop: "statusLabel", label: "是否启用" },
        { prop: "isClientShowLabel", label: "是否显示" }
      ],
      tableData: [],
      playBtn: ["启用", "对外"],
      schoolData: []
    };
  },
  created() {
    this.getOrderTypeList();
  },
  mounted() {},

  methods: {
    // 获取全部工单类型
    getOrderTypeList() {
      getOrderTypeList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.allList = res.data.data;
        } else {
          this.allList = [];
        }
        this.allList.map(item => {
          item["statusLabel"] = item["status"] === 1 ? "是" : "否";
          item["isClientShowLabel"] = item["isClientShow"] ? "是" : "否";
          order["orderType"].map(type => {
            if (item["orderType"] == type["value"]) {
              item["label"] = type["label"];
            }
          });
        });
        console.log("this.allList", this.allList);
        if (this.currentSchoolId != "") {
          this.setTableData();
        } else {
          this.fetchtypelist();
        }
      });
    },
    // 获取学校
    fetchtypelist() {
      fetchTypeList(this.contentType).then(res => {
        console.log("res.data", res.data);
        if (res.data.success) {
          this.schoolData = res.data.data;
          this.currentSchoolId = this.schoolData[0].value;
          this.setTableData();
        } else {
          this.tableData = [];
          this.schoolData = [];
        }
      });
    },
    // 获取学校关联的工单类型
    getSchoolOrderType() {
      getSchoolOrderType(this.currentSchoolId).then(res => {
        console.log("res", res);
        if (res.data.success) {
          let list = res.data.data;
          this.tableData = allList.filter(item => {
            return list.includes(item["id"]);
          });
        } else {
          this.tableData = [];
        }
      });
    },
    // 编辑学校关联的工单类型
    editSchoolOrderType(item, type, str) {
      this.$confirm(`确认${str}吗?`)
        .then(_ => {
          let data = {
            id: item["id"],
            status:
              type == "status" ? (!item["status"] ? 1 : 0) : item["status"],
            isClientShow:
              type == "isClientShow"
                ? !item["isClientShow"]
                : item["isClientShow"]
          };
          editSchoolOrderType(data).then(res => {
            console.log("res", res);
            if (res.data.success) {
              this.getOrderTypeList();
            }
            done();
          });
        })
        .catch(_ => {});
    },
    setTableData() {
      this.tableData = this.allList.filter(item => {
        return this.currentSchoolId == item["school"];
      });
      console.log("this.tableData ", this.tableData);
    },
    PlayCurrentItem(s, row) {
      console.log("666", s, row);
      this.currentRow = row;
    },
    changeSchool(item) {
      this.currentSchoolId = item.value;
      this.setTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.schoolBox {
  width: 20%;
  background-color: #fff;
  padding: 20px;
  .schoolItem {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .currentItem {
    color: #2c88f5;
    background-color: #f5f7fe;
  }
}
.treeTable {
  background-color: #fff;
  flex: 1;
  padding: 20px;
}
.pagination {
  padding: 20px;
  text-align: right;
  width: 100%;
}
</style>
