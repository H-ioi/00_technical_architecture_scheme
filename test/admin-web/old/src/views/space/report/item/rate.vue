<template>
  <div class="report_userate">
    <div class="df_sb">
      <h4 style="font-size: 18px; color: #333333; font-family: AlibabaPuHuiTiM">
        空间利用率
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
          @clear="clearFilter"
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
    <div class="report_userate_eachart df_sb">
      <div class="df_center" style="width: 50%; text-align: center">
        <div
          class="report_userate_eachart_liquidfill"
          ref="liquidfill_left"
        ></div>
        <div>
          <div class="report_userate_eachart_label">空间数量利用率</div>
          <div class="report_userate_eachart_num">
            {{ liquidfillData["num"] }}%
          </div>
        </div>
      </div>
      <div class="df_center" style="width: 50%; text-align: center">
        <div
          class="report_userate_eachart_liquidfill"
          ref="liquidfill_right"
        ></div>
        <div>
          <div class="report_userate_eachart_label">空间面积利用率</div>
          <div class="report_userate_eachart_num">
            {{ liquidfillData["area"] }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-liquidfill";
import { getSpaceBriefing } from "@/api/space/spacetype.js";
import { HXtimeSlotChange } from "@/util/date.js";
export default {
  props: {
    spaceType: Array,
    spaceTree: Array,
    schoolId: String
  },
  data() {
    return {
      currentPid: "",
      liquidfillData: {},
      searchFrom: { spaceName: "", type: "", date: [] },
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf"
      },
      liquidfill_left: null,
      liquidfill_right: null,
      liquidfillOption_left: {
        series: [
          {
            type: "liquidFill",
            waveAnimation: true, //波动动画，默认true
            animationDuration: 0, // 动画时间
            amplitude: 10, //波动幅度
            animationDurationUpdate: 0, // 动画更新时间
            radius: "95%",
            backgroundStyle: {
              //背景样式
              borderWidth: 10,
              borderColor: "#ffffff",
              color: "#ffffff",
              shadowBlur: 0
            },
            outline: {
              show: true,
              borderDistance: 5, // 外部轮廓与图表的距离 数字
              itemStyle: {
                borderWidth: 5,
                borderColor: "#ACC0C0",
                shadowBlur: 0, //外部轮廓的阴影范围 一旦设置了内外都有阴影
                shadowColor: "#ffffff" //外部轮廓的阴影颜色
              }
            },
            itemStyle: {
              opacity: 1, // 波浪的透明度
              shadowBlur: 0 // 波浪的阴影范围
            },
            label: {
              opacity: 0
            },
            color: ["#C4EEEE", "#FFFFFF", "#FFFFFF"],
            data: [
              {
                value: 0,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0, //0%时的颜色 从上往下看 最上面是0%
                        color: "#C4EEEE"
                      },
                      {
                        offset: 1, //100%时的颜色 从上往下看 最上面是0%
                        color: "#ACC0C0"
                      }
                    ])
                  }
                }
              }
            ]
          }
        ]
      },
      liquidfillOption_right: {
        series: [
          {
            type: "liquidFill",
            waveAnimation: true, //波动动画，默认true
            animationDuration: 0, // 动画时间
            amplitude: 10, //波动幅度
            animationDurationUpdate: 0, // 动画更新时间
            radius: "95%",
            backgroundStyle: {
              //背景样式
              borderWidth: 10,
              borderColor: "#ffffff",
              color: "#ffffff",
              shadowBlur: 0
            },
            outline: {
              show: true,
              borderDistance: 5, // 外部轮廓与图表的距离 数字
              itemStyle: {
                borderWidth: 5,
                borderColor: "#CEA474",
                shadowBlur: 0, //外部轮廓的阴影范围 一旦设置了内外都有阴影
                shadowColor: "#ffffff" //外部轮廓的阴影颜色
              }
            },
            itemStyle: {
              opacity: 1, // 波浪的透明度
              shadowBlur: 0 // 波浪的阴影范围
            },
            label: {
              opacity: 0
            },
            color: ["#F2C797", "#FFFFFF", "#FFFFFF"],
            data: [
              {
                value: 0,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0, //0%时的颜色 从上往下看 最上面是0%
                        color: "#F2C797"
                      },
                      {
                        offset: 1, //100%时的颜色 从上往下看 最上面是0%
                        color: "#CEA474"
                      }
                    ])
                  }
                }
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    this.searchFrom["date"] = HXtimeSlotChange("本月");
  },
  mounted() {
    this.initLiquidfill();
  },
  methods: {
    initLiquidfill() {
      this.liquidfill_left = echarts.init(this.$refs["liquidfill_left"]);
      this.liquidfill_right = echarts.init(this.$refs["liquidfill_right"]);
      this.setLiquidfill();
    },
    setLiquidfill() {
      this.liquidfill_left.setOption(this.liquidfillOption_left);
      this.liquidfill_right.setOption(this.liquidfillOption_right);
    },
    getSpaceBriefing() {
      let data = {
        rate: true,
        topId: this.schoolId,
        type: this.searchFrom.type,
        pid: this.searchFrom["pid"],
        begin:
          this.searchFrom["date"].length > 0 ? this.searchFrom["date"][0] : "",
        end:
          this.searchFrom["date"].length > 0 ? this.searchFrom["date"][1] : ""
      };
      getSpaceBriefing(data).then(res => {
        if (res.data.success) {
          console.log("getSpaceBriefing", res);
          let { totalNum, occupyNum, totalArea, occupyArea } = res.data.data;
          this.liquidfillData = {
            num: this.getRate(totalNum, occupyNum),
            area: this.getRate(totalArea, occupyArea)
          };
          this.$set(this.liquidfillOption_left["series"][0]["data"], 0, {
            ...this.liquidfillOption_left["series"][0]["data"][0],
            value: this.getRate(totalNum, occupyNum) / 100
          });
          this.$set(this.liquidfillOption_right["series"][0]["data"], 0, {
            ...this.liquidfillOption_right["series"][0]["data"][0],
            value: this.getRate(totalArea, occupyArea) / 100
          });
          console.log("this.liquidfillOption_left", this.liquidfillOption_left);
          this.setLiquidfill();
        }
      });
    },
    getRate(total, num) {
      let rate = 0;
      if (total && num) {
        rate = (((num ? num : 0) / (total ? total : 0)) * 100).toFixed(2);
      }
      console.log("rate", rate, rate ? rate : 0);
      return rate;
    },
    getTreeValue(data, Node, tree) {
      console.log(9999, data, Node, tree);
      this.searchFrom["spaceName"] = data.name;
      this.searchFrom["pid"] = data.id;
      this.getSpaceBriefing();
    },
    changeType(e) {
      this.getSpaceBriefing();
    },
    changeDate(e) {
      this.getSpaceBriefing();
    },
    clearFilter() {
      this.getSpaceBriefing();
    },
    clearFilterPid() {
      this.searchFrom["spaceName"] = "";
      this.searchFrom["pid"] = "";
      this.getSpaceBriefing();
    },
    reset() {
      this.searchFrom["type"] = "";
      this.searchFrom["spaceName"] = "";
      this.searchFrom["pid"] = "";
      this.getSpaceBriefing();
    }
  }
};
</script>

<style lang="scss" scoped>
.report_userate {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  h4 {
    margin: 0;
  }
  .report_userate_eachart {
    padding: 60px;
    .report_userate_eachart_liquidfill {
      width: 200px;
      height: 200px;
      margin-right: 25px;
    }
    .report_userate_eachart_label {
      font-size: 20px;
      color: #666666;
      line-height: 22px;
      text-align: left;
    }
    .report_userate_eachart_num {
      font-size: 36px;
      color: #333333;
      line-height: 54px;
      font-family: Biotif-ExtraBold, Biotif;
      font-weight: 800;
      text-align: left;
    }
  }
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
  background: #edf5f6;
  font-size: 16px !important;
  color: #999999;
}
</style>
