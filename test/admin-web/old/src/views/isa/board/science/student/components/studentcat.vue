<template>
  <div class="student_bar" ref="echarts"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
import consts from "@/const/isagroup/consts.js";
import Table from "@/components/isagroupcommon/Table.vue";
export default {
  name: "student",
  components: { Table },
  data() {
    return {
      barEcharts: null,
      echarts: null,
      xAxisTitle: [
        "Verbal\nReasoning",
        "Quantitative\nReasoni",
        "Non-Verbal\nReasoning",
        "Spatial\nReasoning"
      ],
      option: {
        title: {
          text: "CAT4 Results",
          top: "0%",
          left: "9%",
          textStyle: {
            color: "#333333",
            fontSize: 12
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "12%",
          right: "0%",
          left: "10%",
          bottom: "15%"
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#E9E9E9"
            }
          },
          axisLabel: {
            fontSize: 12,
            color: "#666666"
          },
          data: []
        },
        yAxis: {
          type: "value",
          name: "Standard Age Score(SAS)",
          nameLocation: "center",
          min: 60,
          max: 140,
          nameTextStyle: {
            fontSize: 12,
            color: "#000000",
            padding: [0, -20, 20, 0],
            fontWeight: 400
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#E9E9E9"
            }
          },
          axisLabel: {
            fontSize: 12,
            color: "#666666"
          },
          splitLine: {
            lineStyle: {
              color: "#F9F9F9"
            }
          }
        },
        series: [
          {
            type: "bar",
            barWidth: 22,
            label: {
              show: true,
              position: "top",
              distance: 2,
              valueAnimation: true
            },
            data: []
          }
        ]
      }
    };
  },
  created() {
    this.initEcharts();
  },
  mounted() {},
  activated() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"])
  },
  methods: {
    // 初始化柱状图
    initEcharts() {
      this.$nextTick(() => {
        this.barEcharts = echarts.init(this.$refs["echarts"]);
        this.barEcharts.clear();
        this.barEcharts.setOption(this.option, true);
        window.onresize = () => {
          this.barEcharts.resize();
        };
      });
    },
    setData(data) {
      this.$nextTick(() => {
        let seriesData = [];
        let xAxisTitle = [];
        if (_.isEmpty(data)) {
          this.$set(this.option, "xAxis", {
            ...this.option["xAxis"],
            data: []
          });
          this.$set(this.option["series"], 0, {
            ...this.option["series"][0],
            data: []
          });
        } else {
          Object.keys(data).forEach(key => {
            let obj = {
              value: data[key],
              itemStyle: {
                color: this.setColor(data[key])
              }
            };
            let string = key.replace(/\s/g, "\n");
            xAxisTitle.push(string);
            seriesData.push(obj);
          });
          this.$set(this.option, "xAxis", {
            ...this.option["xAxis"],
            data: xAxisTitle
          });
          this.$set(this.option["series"], 0, {
            ...this.option["series"][0],
            data: seriesData
          });
        }
        this.barEcharts.clear();
        this.barEcharts.setOption(this.option, true);
        this.barEcharts.resize();
      });
    },
    setColor(value) {
      let color = "#DAFED6";
      let scoreColorList = consts["scoreColorList"];
      scoreColorList.map(item => {
        let score = item["cat"];
        if (!(value < score["min"]) && !(value > score["max"])) {
          color = item["value"];
        }
      });
      return color;
    }
  }
};
</script>

<style lang="scss" scoped>
.student_bar {
  width: 50%;
  height: 216px;
  margin-left: 25px;
}
</style>
