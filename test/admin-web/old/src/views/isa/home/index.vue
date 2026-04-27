<template>
  <div class="home">
    <div class="home_top df_sb">
      <div class="home_top_left df_sb">
        <div class="df_center home_top_card">
          <div
            class="home_top_card_icon"
            style=" background: url('/img/isa/home_data.png') no-repeat;"
          ></div>
          <div>
            <div class="home_top_card_label">数据源总数</div>
            <div class="home_top_card_num">{{ totalSource }}</div>
          </div>
        </div>
        <div class="df_center home_top_card">
          <div
            class="home_top_card_icon"
            style=" background: url('/img/isa/home_num.png') no-repeat;"
          ></div>
          <div>
            <div class="home_top_card_label">API接口总数</div>
            <div class="home_top_card_num">{{ totalApi }}</div>
          </div>
        </div>
      </div>
      <div class="home_top_right">
        <div class="home_titel">
          今日数据源变动
          <span
            class="more"
            @click="showMore"
            v-if="sourceChangeData.length > 2"
            >更多</span
          >
        </div>
        <el-empty
          :image-size="60"
          description="暂无数据"
          v-if="todaySourceData.length == 0"
        ></el-empty>
        <div class="timeline" v-else>
          <div
            class="timeline_item"
            v-for="(item, key) in todaySourceData"
            :key="key"
          >
            <span
              class="dot"
              :style="`border-color:${sourceChangeColor[key]}`"
            ></span>
            <span class="time">{{ item.createTime }}</span>
            <span class="description">{{
              `${types[item.type]}数据新增${item.dataCount}条`
            }}</span>
            <div class="progress">
              <span
                class="percentage"
                :style="`color:${sourceChangeColor[key]}`"
                >+{{ item.dataCount }}</span
              >
              <el-progress
                :percentage="100"
                :color="sourceChangeColor[key]"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="df_sb">
      <div class="echarts">
        <div class="home_titel">角色类型统计</div>
        <div class="echarts_box" ref="source"></div>
      </div>
      <div class="echarts">
        <div class="home_titel">近5天登录趋势</div>
        <div class="echarts_box" ref="login"></div>
      </div>
    </div>
    <el-dialog
      title="今日数据源变动"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="timeline">
        <div
          class="timeline_item"
          v-for="(item, key) in sourceChangeData"
          :key="key"
        >
          <span class="dot" style="border-color:#2A3F54"></span>
          <span class="time">{{ item.createTime }}</span>
          <span class="description" style="width:300px;">{{
            `${types[item.type]}数据新增${item.dataCount}条`
          }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts";
import {
  getAPINum,
  getDataSoucesChange,
  getDataSourcesNum,
  getListLonginLog,
  getListRoleNames
} from "@/api/isa/index.js";
import moment from "moment";
export default {
  name: "ISA-HOME",
  components: {},
  data() {
    return {
      sourceChangeColor: {
        0: "#D4AB85",
        1: "#7BAFD4",
        2: "#2A3F54"
      },
      todaySourceData: [],
      sourceChangeData: [],
      sourceData: [],
      loginData: [],
      sourceEachart: null,
      loginEachart: null,
      dialogVisible: false,
      totalSource: 0,
      totalApi: 0,
      types: {
        parent: "家长",
        student: "学生",
        teacher: "教师"
      }
    };
  },
  created() {
    this.getTotal();
    this.getListRoleNames();
    this.getListLonginLog();
    this.getDataSouces();
  },
  mounted() {},
  computed: {},
  methods: {
    getTotal() {
      getAPINum().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.totalApi = res.data.data;
        }
      });
      getDataSourcesNum().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.totalSource = res.data.data;
        }
      });
    },
    getListRoleNames() {
      getListRoleNames().then(res => {
        if (res.data.success) {
          console.log("res", res);
          let data = res.data.data;
          let sourceData = [];
          Object.keys(data).forEach(item => {
            sourceData.push({ name: item, value: data[item] });
          });
          console.log("sourceData", sourceData);
          this.$nextTick(() => {
            this.sourceEachart = echarts.init(this.$refs["source"]);
            this.sourceEachart.clear();
            this.sourceEachart.setOption(
              this.setSourceChart(this.sourceEachart, sourceData)
            );
          });
        }
      });
    },
    getListLonginLog() {
      getListLonginLog().then(res => {
        if (res.data.success) {
          console.log("res", res);
          let data = res.data.data;
          let date = [];
          let dateData = [];
          Object.keys(data).forEach(item => {
            date.push(item);
            dateData.push(data[item]);
          });
          this.$nextTick(() => {
            this.loginEachart = echarts.init(this.$refs["login"]);
            this.loginEachart.clear();
            this.loginEachart.setOption(this.setLoginChart(date, dateData));
          });
        }
      });
    },
    getDataSouces() {
      getDataSoucesChange().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.sourceChangeData = res.data.data;
          this.todaySourceData = [];
          this.sourceChangeData.map((item, index) => {
            item["createTime"] = moment(item["createTime"]).format(
              "YYYY-MM-DD HH:mm"
            );
            if (index < 3) {
              this.todaySourceData.push(item);
            }
          });
        }
      });
    },
    setSourceChart(myChart, data) {
      return {
        tooltip: {
          trigger: "item"
        },
        legend: {
          left: "center",
          icon: "circle",
          bottom: "2%",
          itemGap: 8,
          height: 10,
          // itemWidth: 20,
          // itemHeight: 20,
          textStyle: {
            fontSize: 14
          },
          itemStyle: {
            // borderWidth: 8
          }
        },
        color: [
          "#2A3F54",
          "#546475",
          "#7D8A96",
          "#D4AB85",
          "#7BAFD4",
          "#6E9CBE",
          "#C6DBEA",
          "#ABBDCA",
          "#BD9876",
          "#AFC2CF",
          "#485564"
        ], // 自定义颜色范围
        series: {
          type: "pie",
          width: 560,
          radius: ["30%", "50%"],
          center: ["50%", "40%"], //饼状图位置
          left: "center",
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1
          },
          label: {
            alignTo: "edge",
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 10,
            rich: {
              time: {
                fontSize: 10,
                color: "#999"
              }
            }
          },
          labelLine: {
            length: 20,
            length2: 10,
            maxSurfaceAngle: 60
          },
          labelLayout: function(params) {
            console.log("params", params);
            const isLeft = params.labelRect.x < myChart.getWidth() / 2;
            const points = params.labelLinePoints;
            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;
            return {
              labelLinePoints: points
            };
          },
          data: data
        }
      };
    },
    setLoginChart(date, dateData) {
      return {
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            var res = params[0].name + "<br/>\n登录：" + params[0].value;
            return res;
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            margin: 20,
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              type: "dashed",
              color: "#BCC2CC"
            }
          },
          data: date
        },
        yAxis: {
          type: "value",
          axisLabel: {
            margin: 20
          },
          axisLine: {
            lineStyle: {
              color: "#BCC2CC"
            }
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: ["#BCC2CC"]
            }
          }
        },
        series: [
          {
            data: dateData,
            type: "line",
            lineStyle: {
              color: "#D4AB85",
              width: 4
            },
            itemStyle: {
              color: "#D4AB85"
            }
          }
        ]
      };
    },
    showMore() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  .home_top {
    margin-bottom: 20px;
    .home_top_left {
      width: 50%;
      padding-right: 10px;
      box-sizing: border-box;
      .home_top_card {
        height: 160px;
        box-sizing: border-box;
        padding: 20px 30px;
        background-color: #fff;
        flex: 1;
        border-radius: 6px;
        &:nth-child(even) {
          margin-left: 10px;
        }
        &:nth-child(odd) {
          margin-right: 10px;
        }
        .home_top_card_icon {
          width: 69px;
          height: 69px;
          // background: #d4ab85;
          margin-right: 30px;
          border-radius: 50%;
          background-size: cover;
        }
        .home_top_card_label {
          font-size: 14px;
          font-family: AlibabaPuHuiTiM;
          color: #333333;
          line-height: 20px;
          margin-bottom: 12px;
        }
        .home_top_card_num {
          font-size: 30px;
          font-family: DIN-Medium, DIN;
          font-weight: 500;
          color: #333333;
          line-height: 36px;
        }
      }
    }
    .home_top_right {
      flex: 1;
      height: 160px;
      margin-left: 10px;
      padding: 20px 22px 20px 24px;
      background-color: #fff;
      border-radius: 6px;
      box-sizing: border-box;
      .el-empty {
        padding: 0;
      }
      /deep/.el-empty__description {
        margin-top: 5px;
      }
    }
  }
  .home_titel {
    margin-bottom: 15px;
    font-size: 18px;
    font-family: AlibabaPuHuiTiM;
    color: #333333;
    line-height: 25px;
  }
  .echarts {
    flex: 1;
    background-color: #fff;
    border-radius: 6px;
    padding: 20px 25px;
    &:nth-child(even) {
      margin-left: 10px;
    }
    &:nth-child(odd) {
      margin-right: 10px;
    }
    .echarts_box {
      height: 500px;
    }
  }
}
.timeline {
  // overflow: hidden;
  .timeline_item {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-family: AlibabaPuHuiTiR;
    color: #666666;
    line-height: 18px;
    padding-bottom: 12px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 2px;
      top: 8px;
      left: 4px;
      bottom: -6px;
      background: #ededed;
      z-index: 1;
    }

    &:last-child {
      padding-bottom: 0;
      &::before {
        content: "";
        position: absolute;
        width: 0;
      }
    }
    .progress {
      flex: 1;
      position: relative;
      .percentage {
        position: absolute;
        right: 0;
        bottom: 8px;
        font-size: 10px;
        font-family: AlibabaPuHuiTiR;
        color: #d4ab85;
        line-height: 14px;
      }
      /deep/ .el-progress-bar {
        padding-right: 0;
      }
      /deep/ .el-progress__text {
        display: none;
      }
    }
    .description {
      width: 120px;
      margin: 0 30px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid #d4ab85;
      box-sizing: border-box;
      margin-right: 10px;
      z-index: 2;
    }
  }
}
.more {
  font-size: 12px;
  font-family: AlibabaPuHuiTiR;
  color: #d4ab85;
  line-height: 16px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
