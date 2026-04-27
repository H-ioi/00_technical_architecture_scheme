<template>
  <div class="report">
    <div class="df_sb">
      <div class="df_sb">
        <h3 style="font-size: 20px; margin: 0; font-family: AlibabaPuHuiTiM">
          空间简报
        </h3>
        <el-select
          class="schoolselect"
          v-model="schoolId"
          placeholder=""
          @change="changeSchool"
          style="width: 100px; text-align: right"
        >
          <el-option
            :key="k"
            v-for="(i, k) in schoolData"
            :label="i.name"
            :value="i.id"
          ></el-option>
        </el-select>
      </div>
      <div class="df_sb searchselect">
        <el-select
          clearable
          v-model="searchFrom.spaceName"
          placeholder="请筛选空间信息"
          @clear="clearFilterPid"
        >
          <el-option :value="searchFrom.spaceName">
            <el-tree
              ref="tree"
              :props="defaultProps"
              :data="spaceTree"
              node-key="id"
              highlight-current
              @node-click="getTreeValue"
            ></el-tree>
          </el-option>
        </el-select>
        <el-select
          clearable
          v-model="searchFrom.type"
          placeholder="请选择空间类型"
          @change="changeType"
        >
          <el-option
            :key="k"
            v-for="(i, k) in spaceType"
            :label="i.name"
            :value="i.id"
          ></el-option>
        </el-select>
        <el-date-picker
          @change="changeDate"
          v-model="searchFrom.date"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始"
          end-placeholder="结束"
          :value-format="'yyyy-MM-dd'"
          :format="'yyyy-MM-dd'"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="report_list df_sb">
      <div class="report_list_item df_align_center">
        <img src="/img/space/spacetotal.png" alt="" />
        <div class="report_list_item_right">
          <div class="label">空间总数量（个）</div>
          <div
            class="num tips"
            :title="reportData['totalNum'] ? reportData['totalNum'] : 0"
          >
            {{ reportData["totalNum"] ? reportData["totalNum"] : 0 }}
          </div>
        </div>
      </div>
      <div class="report_list_item df_align_center">
        <img src="/img/space/spacenum.png" alt="" />
        <div class="report_list_item_right">
          <div class="label">占用数量（个）</div>
          <div
            class="num tips"
            :title="reportData['occupyNum'] ? reportData['occupyNum'] : 0"
          >
            {{ reportData["occupyNum"] ? reportData["occupyNum"] : 0 }}
          </div>
        </div>
      </div>
      <div class="report_list_item df_align_center">
        <img src="/img/space/spaceratetotal.png" alt="" />
        <div class="report_list_item_right">
          <div class="label">总面积（m²）</div>
          <div
            class="num tips"
            :title="
              reportData['totalArea'] ? fixedNum(reportData['totalArea']) : 0
            "
          >
            {{
              reportData["totalArea"] ? fixedNum(reportData["totalArea"]) : 0
            }}
          </div>
        </div>
      </div>
      <div class="report_list_item df_align_center">
        <img src="/img/space/spaceratenum.png" alt="" />
        <div class="report_list_item_right">
          <div class="label">占用面积（m²）</div>
          <div
            class="num tips"
            :title="
              reportData['occupyArea'] ? fixedNum(reportData['occupyArea']) : 0
            "
          >
            {{
              reportData["occupyArea"] ? fixedNum(reportData["occupyArea"]) : 0
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- 空间占用率 -->
    <Rate
      ref="Rate"
      :spaceType="spaceType"
      :schoolId="schoolId"
      :spaceTree="spaceTree"
    />
    <!-- 空间统计-->
    <Statistics
      ref="Statistics"
      :spaceType="spaceType"
      :schoolId="schoolId"
      :spaceTree="spaceTree"
    />
  </div>
</template>

<script>
import Rate from "./item/rate.vue";
import Statistics from "./item/statistics.vue";
import {
  getSpaceTop,
  getSpaceBriefing,
  getSpaceTypeList
} from "@/api/space/spacetype.js";
import { getSpaceTree } from "@/api/space/spacelist.js";
import { HXtimeSlotChange } from "@/util/date.js";

export default {
  components: {
    Rate,
    Statistics
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf"
      },
      spaceType: [],
      searchFrom: { date: [], type: "" },
      schoolId: "",
      schoolData: [],
      reportData: {},
      // 分页
      pagination: {
        size: 100,
        current: 1
      },
      currentDate: [],
      spaceTree: []
    };
  },
  created() {
    this.getSpaceTop();
    this.searchFrom["date"] = HXtimeSlotChange("本月");
  },
  methods: {
    getSpaceTop() {
      getSpaceTop().then(res => {
        if (res.data.success) {
          this.schoolData = res.data.data;
          this.schoolId = this.schoolData[0].id;
          this.getSpaceTypeList();
          this.getSpaceTree();
          this.getSpaceBriefing();

          this.$nextTick(() => {
            this.$refs["Rate"].getSpaceBriefing(this.schoolId);
            this.$refs["Statistics"].reset();
          });
        }
      });
    },
    getSpaceTree() {
      getSpaceTree({ pid: this.schoolId }).then(res => {
        console.log("res", res.data.data);
        if (res.data.success) {
          if (res.data.data != null) {
            this.spaceTree = res.data.data;
          } else {
            this.spaceTree = [];
          }
        }
      });
    },
    getSpaceTypeList() {
      getSpaceTypeList(this.pagination, this.schoolId).then(res => {
        if (res.data.success) {
          this.spaceType = res.data.data.records;
        }
      });
    },
    getSpaceBriefing() {
      let data = {
        topId: this.schoolId,
        type: this.searchFrom.type,
        pid: this.searchFrom["pid"],
        begin:
          this.searchFrom["date"].length > 0 ? this.searchFrom["date"][0] : "",
        end:
          this.searchFrom["date"].length > 0 ? this.searchFrom["date"][1] : ""
      };
      getSpaceBriefing(data).then(res => {
        console.log("this.reportData", res.data);
        if (res.data.success) {
          this.reportData = res.data.data;
          console.log("this.reportData", this.reportData);
        }
      });
    },
    changeSchool(e) {
      console.log("changeSchool", e);
      this.searchFrom["type"] = "";
      this.clearFilterPid();
      this.getSpaceTypeList();
      this.getSpaceTree();
      this.$nextTick(() => {
        this.$refs["Rate"].reset();
        this.$refs["Statistics"].reset();
      });
    },
    changeType(e) {
      console.log("changeType", e);
      this.getSpaceBriefing();
    },
    changeDate(e) {
      console.log("changeDate", e);
      this.getSpaceBriefing();
    },
    getTreeValue(data, Node, tree) {
      console.log(9999, data, Node, tree);
      this.searchFrom["spaceName"] = data.name;
      this.searchFrom["pid"] = data.id;
      this.getSpaceBriefing();
    },
    clearFilterPid() {
      this.searchFrom["spaceName"] = "";
      this.searchFrom["pid"] = "";
      this.getSpaceBriefing();
    },
    fixedNum(data) {
      return data.toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.report {
  .report_list {
    width: 100%;
    margin: 10px 0 15px 0;
    border-radius: 4px;
    .report_list_item {
      width: 24%;
      padding: 30px 40px;
      // margin-right: 10px;
      background-color: #fff;
      &:last-child {
        margin-right: 0px;
      }
      img {
        width: 107px;
        height: 107px;
        margin-right: 30px;
      }
      .report_list_item_right {
        width: 65%;
        text-align: left;
        .label {
          font-size: 20px;
          color: #666666;
          line-height: 22px;
        }
        .num {
          font-size: 36px;
          color: #333333;
          line-height: 54px;
          font-family: Biotif-ExtraBold, Biotif;
          font-weight: 800;
        }
      }
    }
  }
}
.searchselect {
  /deep/.el-select,
  /deep/.el-date-editor {
    margin-left: 20px;
    border-radius: 2px !important;
  }
  /deep/.el-input__inner {
    border: none;
    background: #ffffff !important;
    font-size: 16px !important;
    color: #999999;
  }
  /deep/.el-range-editor--small .el-range-input {
    background: #ffffff;
    font-size: 16px !important;
    color: #999999;
  }
}

.schoolselect {
  /deep/ .el-input__inner {
    border: none;
    background: #edf5f6 !important;
    text-align: right;
    font-size: 16px !important;
  }
}
</style>
