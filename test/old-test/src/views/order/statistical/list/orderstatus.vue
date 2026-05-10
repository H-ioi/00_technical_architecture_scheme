<template>
  <div class="statisticalItem df_center_sb_column">
    <div class="statisticalItem_title">
      <span>工单状态</span>
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
import { getOrderStatus } from "@/api/workorder/order/index.js";
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
        tooltip: {
          trigger: "item",
          formatter: "{b} <br />转化率 : {c}%",
        },
        series: [
          {
            name: "Funnel",
            type: "funnel",
            left: "20%",
            top: 30,
            bottom: 10,
            width: "50%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            sort: "none",
            label: {
              show: true,
              position: "inside",
              fontSize: 28,
              formatter: "{c}",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            color: ["#5470C6", "#FAC858", "#91CC75"],
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.getbeforeyear = getBeforeYear(1);
    this.changeDate(this.getbeforeyear);
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
      this.getOrderStatus(obj);
    },
    getOrderStatus(data) {
      getOrderStatus(data).then((res) => {
        console.log("res", res);
        let list = [];
        res.data.data.map((i, k) => {
          let obj = {
            name: i.x + "：" + i.y,
            value: i.extra.percent,
          };

          switch (i.x) {
            case "新增工单":
              list[0] = obj;
              break;
            case "处理中工单":
              list[1] = obj;
              break;
            case "已完成工单":
              list[2] = obj;
              break;
          }
        });
        console.log("list", list);
        this.$set(this.option["series"], 0, {
          ...this.option["series"][0],
          data: list,
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
