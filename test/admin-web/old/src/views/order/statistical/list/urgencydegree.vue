<template>
  <div class="statisticalItem df_center_sb_column">
    <div class="statisticalItem_title">
      <span>紧急程度</span>
      <div>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :value-format="'yyyy-MM-dd'"
          :picker-options="pickerOptions"
          unlink-panels
          @change="changeDate"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="echart" ref="echart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getBeforeYear } from "@/util/date.js";
import { getOrderUrgency } from "@/api/workorder/order/index.js";
export default {
  name: "PCOrderOrdertype",
  props: {
    currentSchool: String,
  },
  data() {
    return {
      echart: null,
      date: "",
      getbeforeyear: "",
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      option: {
        grid: {
          top: "15%",
          left: "10%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "category",
          axisLabel: {
            fontSize: 16,
            color: "#999999",
            margin: 12,
          },
          axisLine: {
            lineStyle: {
              color: "#999999",
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 16,
            color: "#999999",
          },
        },
        series: [
          {
            barWidth: "50",
            type: "bar",
            itemStyle: {
              normal: {
                color: function (params) {
                  // 给出颜色组
                  var colorList = ["#EE6666", "#FAC858", "#5470C6", "#91CC75"];
                  return colorList[params.dataIndex];
                },
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.getbeforeyear = getBeforeYear(1);
    console.log(22222);
    this.changeDate(this.getbeforeyear);
    console.log(33333);
  },
  mounted() {
    this.setChart();
  },
  watch: {
    currentSchool() {
      this.changeDate(this.date);
    },
  },
  methods: {
    changeDate(date) {
      this.date = date;
      let obj = {
        begin: this.date[0],
        end: this.date[1],
        school: this.currentSchool,
      };
      console.log(11111111);
      this.getOrderUrgency(obj);
    },
    getOrderUrgency(data) {
      getOrderUrgency(data).then((res) => {
        console.log("res", res);
        let x = [];
        let y = [];
        res.data.data.map((i, k) => {
          x[k] = i.x;
          y[k] = i.y;
        });
        this.$set(this.option, "xAxis", {
          ...this.option["xAxis"],
          data: x,
        });
        this.$set(this.option["series"], 0, {
          ...this.option["series"][0],
          data: y,
        });
        this.echart.clear();
        this.echart.setOption(this.option);
      });
    },
    setChart() {
      this.echart = echarts.init(this.$refs.echart);
      this.echart.clear();
      this.echart.setOption(this.option);
    },
  },
};
</script>

<style lang="scss" scoped></style>
