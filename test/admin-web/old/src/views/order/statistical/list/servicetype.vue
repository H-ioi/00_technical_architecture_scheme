<template>
  <div class="statisticalItem df_center_sb_column">
    <div class="statisticalItem_title">
      <span>服务类型（服务需求申请表）</span>
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
import { getOrderServicetype } from "@/api/workorder/order/index.js";
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
        },
        legend: {
          left: "center",
          bottom: "2%",
          itemGap: 20,
          itemWidth: 30,
          itemHeight: 10,
          borderRadius: 8,
          textStyle: {
            fontSize: 14,
          },
          itemStyle: {
            borderWidth: 8,
          },
        },
        color: ["#EE6666", "#5470C6", "#FAC858", "#91CC75"], // 自定义颜色范围
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "45%"],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: "#999999",
                  fontSize: 12,
                },
                labelLine: {
                  // show: false,
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
      this.getOrderServicetype(obj);
    },
    getOrderServicetype(data) {
      getOrderServicetype(data).then((res) => {
        console.log("res", res);
        let list = [];
        res.data.data.map((i, k) => {
          let obj = {
            name: i.x,
            value: i.y,
          };
          list.push(obj);
        });
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
