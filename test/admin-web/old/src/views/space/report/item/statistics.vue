<template>
  <div class="report_userate">
    <div class="df_sb">
      <h4 style="font-size: 18px; color: #333333; font-family: AlibabaPuHuiTiM">
        空间资产统计
      </h4>
      <div class="df_sb">
        <el-select
          clearable
          v-model="searchFrom.spaceName"
          placeholder="请筛选空间信息"
          @clear="clearFilterPid"
        >
          <el-option :value="searchFrom.spaceName">
            <el-tree
              ref="tree"
              show-checkbox
              :props="defaultProps"
              :data="spaceTree"
              node-key="id"
              highlight-current
              @check="getTreeValue"
            ></el-tree>
          </el-option>
        </el-select>
        <el-select
          clearable
          v-model="searchFrom.type"
          placeholder="请选择空间类型"
          @change="changeType"
          @clear="clearFilter"
        >
          <el-option
            :key="k"
            v-for="(i, k) in spaceType"
            :label="i.name"
            :value="i.id"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="df_fa statistics">
      <div class="statistics_left">
        <div class="statistics_left_echarts" v-if="showTypeLarge">
          <h4 class="echartstitle">大类占比</h4>
          <div class="statistics_left_echartsitem" ref="typeLarge"></div>
        </div>
        <div class="statistics_left_echarts" v-if="showTypeMiddle">
          <h4 class="echartstitle">中类占比</h4>
          <div class="statistics_left_echartsitem" ref="typeMiddle"></div>
        </div>
        <div class="statistics_left_echarts" v-if="showTypeSmall">
          <h4 class="echartstitle">小类占比</h4>
          <div class="statistics_left_echartsitem" ref="typeSmall"></div>
        </div>
      </div>
      <div class="statistics_right">
        <h4 class="echartstitle">资产明细</h4>
        <div class="statistics_right_table" style="margin-top: 20px">
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="headercellstyle"
            :cell-style="rowstyle"
            tooltip-effect="dark"
          >
            <el-table-column
              v-for="(item, index) in tableColumn"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <p
            v-if="maxNum < assetInfo.length && assetInfo.length > 0"
            class="more"
            @click="lookMore"
          >
            查看更多>>>
          </p>
        </div>
      </div>
    </div>
    <el-dialog
      title="更多资产明细"
      :visible.sync="dialogVisible"
      width="80%"
      top="5vh"
      :before-close="closeModal"
    >
      <el-table
        :data="currentPageTableData"
        style="width: 100%"
        :header-cell-style="headercellstyle"
        :cell-style="rowstyle"
        tooltip-effect="dark"
        :align="'center'"
      >
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page="currentPage"
        :total="assetInfo.length"
        @current-change="getCurrentPageTable"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getSpaceStatistics } from "@/api/space/spacetype.js";
import { deepClone } from "@/util/util.js";
export default {
  props: {
    spaceType: Array,
    spaceTree: Array,
    schoolId: String,
  },
  data() {
    return {
      dialogVisible: false,
      headercellstyle: {
        background: "#F8F8F8",
        color: " #999999",
        "font-size": "20px",
        "font-weight": "400",
        height: "40px",
        "text-align": "center",
      },
      rowstyle: {
        color: " #333333",
        "font-size": "20px",
        "font-weight": "400",
        height: "54px",
        border: "none",
        padding: "0px",
        height: "54px",
      },
      maxNum: 0,
      typeLarge: null,
      typeMiddle: null,
      typeSmall: null,
      showTypeLarge: false,
      showTypeMiddle: false,
      showTypeSmall: false,
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf",
      },
      searchFrom: {
        type: "",
        spaceIds: [],
      },
      tableColumn: [
        { prop: "name", label: "资产名称", with: "" },
        { prop: "code", label: "资产编号", with: "" },
        { prop: "space", label: "所属空间", with: "" },
      ],
      tableData: [],
      assetInfo: [],
      currentPageTableData: [],
      currentPage: 1,
      option: {
        legend: {
          bottom: "2%",
          left: "center",
          icon: "circle",
          textStyle: {
            fontSize: 16,
            lineHeight: 56,
            color: "#333",
          },
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "65%"],
            width: 500,
            center: ["50%", "40%"], //饼状图位置
            left: "center",
            label: {
              alignTo: "edge",
              formatter: "{name|{b}}\n{rate|{c}%}",
              minMargin: 10,
              edgeDistance: 10,
              lineHeight: 25,
              rich: {
                rate: {
                  fontSize: 14,
                  color: "#999",
                  padding: 4,
                },
                name: {
                  fontSize: 14,
                  color: "#000",
                  padding: 4,
                },
              },
            },
            labelLine: {
              length: 25,
              length2: 0,
              maxSurfaceAngle: 180,
            },
            color: ["#62B1C6", "#E8BE8C", "#B3A0A6","#ADD9EA"],
            labelLayout: function (params) {
              const isLeft = params.labelRect.x;
              const points = params.labelLinePoints;
              // Update the end point.
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points,
              };
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    // this.initEcharts();
  },
  methods: {
    getSpaceStatistics() {
      let data = {
        type: this.searchFrom["type"],
        spaceIds: this.searchFrom["spaceIds"],
        topId: this.schoolId,
      };
      getSpaceStatistics(data).then((res) => {
        if (res.data.success) {
          console.log("getSpaceStatistics", res);
          let { assetInfo, typeLarge, typeMiddle, typeSmall } = res.data.data;
          let num = 0;

          this.assetInfo = assetInfo == null ? [] : assetInfo;
          if (typeLarge) {
            num += 1;
            this.showTypeLarge = true;
            let data = deepClone(this.option);
            this.$set(data["series"], 0, {
              ...data["series"][0],
              data: this.getEchartData(typeLarge),
            });
            this.$nextTick(() => {
              this.typeLarge = echarts.init(this.$refs["typeLarge"]);
              this.typeLarge.setOption(data);
            });
          } else {
            this.showTypeLarge = false;
          }
          if (typeMiddle) {
            num += 1;
            this.showTypeMiddle = true;
            let data = deepClone(this.option);
            this.$set(data["series"], 0, {
              ...data["series"][0],
              data: this.getEchartData(typeMiddle),
            });
            this.$nextTick(() => {
              this.typeMiddle = echarts.init(this.$refs["typeMiddle"]);
              this.typeMiddle.setOption(data);
            });
          } else {
            this.showTypeMiddle = false;
          }
          if (typeSmall) {
            num += 1;
            this.showTypeSmall = true;
            let data = deepClone(this.option);
            this.$set(data["series"], 0, {
              ...data["series"][0],
              data: this.getEchartData(typeSmall),
            });
            this.$nextTick(() => {
              this.typeSmall = echarts.init(this.$refs["typeSmall"]);
              this.typeSmall.setOption(data);
            });
          } else {
            this.showTypeSmall = false;
          }
          console.log("num * 6 - 1", num * 6 - 1, num);
          this.maxNum = num * 6 - 1;
          this.tableData = this.assetInfo.filter((item, index) => {
            return index < num * 8 - 1;
          });
          this.getCurrentPageTable(1);
        }
      });
    },
    lookMore() {
      this.getCurrentPageTable(1);
      this.dialogVisible = true;
    },
    getCurrentPageTable(val) {
      this.currentPageTableData = [];
      this.currentPage = val;
      this.currentPageTableData = this.assetInfo.filter((item, index) => {
        return (
          (this.currentPage - 1) * 10 - 1 < index &&
          index <= this.currentPage * 10 - 1
        );
      });
    },
    getEchartData(data) {
      let total = 0;
      let arr = [];
      data.map((item) => {
        total += item.num;
      });
      data.map((item) => {
        arr.push({
          name: item.name,
          value: ((item.num / total) * 100).toFixed(2),
        });
      });
      return arr;
    },
    initEcharts() {
      this.$nextTick(() => {
        this.typeLarge = echarts.init(this.$refs["typeLarge"]);
        this.typeMiddle = echarts.init(this.$refs["typeMiddle"]);
        this.typeSmall = echarts.init(this.$refs["typeSmall"]);
        this.serEcharts();
      });
    },
    serEcharts() {
      this.typeLarge.setOption(this.option);
      this.typeMiddle.setOption(this.option);
      this.typeSmall.setOption(this.option);
    },
    changeType(e) {
      console.log("changeType", e);
      this.getSpaceStatistics();
    },
    getTreeValue(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      console.log("checkedKeys", checkedKeys);
      let spaceNames = [];
      checkedKeys.checkedNodes.map((item) => {
        spaceNames.push(item.name);
      });
      this.searchFrom["spaceName"] = String(spaceNames);
      this.searchFrom["spaceIds"] = checkedKeys.checkedKeys;
      this.getSpaceStatistics();
    },
    clearFilter() {
      this.getSpaceStatistics();
    },
    clearFilterPid() {
      this.searchFrom["spaceName"] = "";
      this.searchFrom["spaceIds"] = [];
      this.getSpaceStatistics();
      this.resetTree();
    },
    reset() {
      this.searchFrom = {
        type: "",
        spaceIds: [],
        spaceName: "",
      };
      this.getSpaceStatistics();
      this.resetTree();
    },
    closeModal() {
      this.dialogVisible = false;
    },
    resetTree() {
      this.$nextTick(() => {
        this.$refs["tree"].setCheckedNodes([]);
      });
    },
  },
};
</script>
 
<style lang = "scss" scoped>
.report_userate {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  h4 {
    margin: 0;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
  }
  .statistics {
    .statistics_left {
      width: 50%;
      padding-left: 30px;
      .statistics_left_echarts {
        margin: 20px 0;
        .statistics_left_echartsitem {
          height: 400px;
        }
      }
    }
    .statistics_right {
      width: 50%;
      margin: 20px 0;
    }
  }
}
.echartstitle {
  font-size: 16px !important;
  padding-left: 10px;
  border-left: 3px solid #134d5c;
  line-height: 16px;
}
/deep/.el-select,
/deep/.el-date-editor {
  margin-left: 20px;
}
/deep/.el-input__inner {
  border: none;
  background: #edf5f6 !important;
  font-size: 16px !important;
  color: #999999;
}
/deep/.el-range-editor--small .el-range-input {
  background: #edf5f6 !important;
  font-size: 16px !important;
  color: #999999;
}
.more {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #134d5c;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
}
/deep/.el-table th > .cell {
  font-size: 18px;
  color: #999999;
  font-family: AlibabaPuHuiTiM;
}
/deep/.el-table .cell.el-tooltip {
    font-size: 16px;
    color: #333333;
    font-family: AlibabaPuHuiTiM;
}
</style>