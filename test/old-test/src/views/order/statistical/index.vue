<template>
  <div>
    <div class="df_sb statisticalTop">
      <span>服务指标</span>
      <el-select v-model="currentSchool" placeholder="请选择" @change="changeSchool">
        <el-option
          v-for="item in schoolData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="statistical">
      <div class="statisticalOrderStatus df_sb">
        <div class="statisticalOrderStatusItem df_center_sb_column">
          <img src="/img/other/待处理工单数.png" alt="" />
          <div class="num">
            {{ orderIndicatorsData.pendingNum ? orderIndicatorsData.pendingNum : 0 }}
          </div>
          <div class="text">待处理工单数</div>
        </div>
        <div class="statisticalOrderStatusItem df_center_sb_column">
          <img src="/img/other/本日工单数.png" alt="" />
          <div class="num">
            {{ orderIndicatorsData.todayNum ? orderIndicatorsData.todayNum : 0 }}
          </div>
          <div class="text">本日工单数</div>
        </div>
        <div class="statisticalOrderStatusItem df_center_sb_column">
          <img src="/img/other/本月工单数.png" alt="" />
          <div class="num">
            {{ orderIndicatorsData.monthNum ? orderIndicatorsData.monthNum : 0 }}
          </div>
          <div class="text">本月工单数</div>
        </div>
        <div class="statisticalOrderStatusItem df_center_sb_column">
          <img src="/img/other/累计工单数.png" alt="" />
          <div class="num">
            {{ orderIndicatorsData.allNum ? orderIndicatorsData.allNum : 0 }}
          </div>
          <div class="text">累计工单数</div>
        </div>
      </div>
      <div class="pickTime">
        <el-date-picker
          style="margin-bottom: 40px"
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
        <div class="df_sb">
          <div class="pickTimeItem df_center_sb_column">
            <div class="num">
              {{ orderTime.averageResponse ? getTime(orderTime.averageResponse) : 0 }}
            </div>
            <div class="text">工单平均响应时间</div>
          </div>
          <div class="pickTimeItem df_center_sb_column">
            <div class="num">
              {{ orderTime.averageSpend ? getTime(orderTime.averageSpend) : 0 }}
            </div>
            <div class="text">工单平均花费时间</div>
          </div>
        </div>
      </div>
      <OrderType :currentSchool="currentSchool" />
      <ServiceType :currentSchool="currentSchool" />
      <UrgencyDegree :currentSchool="currentSchool" />
      <OrderStatus :currentSchool="currentSchool" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import OrderType from "./list/ordertype";
import UrgencyDegree from "./list/urgencydegree";
import ServiceType from "./list/servicetype";
import OrderStatus from "./list/orderstatus";
import { getBeforeYear, getPickTime } from "@/util/date.js";
import { getOrderIndicators, getOrderTime } from "@/api/workorder/order/index.js";
export default {
  name: "TestUniIndex",

  data() {
    return {
      date: "",
      schoolData: [],
      currentSchool: "",
      orderIndicatorsData: {},
      orderTime: {},
      getbeforeyear: "",
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  components: {
    OrderType,
    UrgencyDegree,
    ServiceType,
    OrderStatus,
  },
  created() {
    // this.currentSchool = this.dictionary["order_school"][0]["value"];
    let school = this.userInfo["dataDictValues"]["order_school"];
    this.dictionary["order_school"].map((i) => {
      if (school.includes(i.value)) {
        this.schoolData.push(i);
      }
    });
    this.currentSchool = this.schoolData[0]["value"];
    this.getbeforeyear = getBeforeYear(1);
    this.changeDate(this.getbeforeyear);
    this.getOrderIndicators({ school: this.currentSchool });
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo"]),
  },
  methods: {
    getTime(time) {
      let times = getPickTime(time);
      return times;
    },
    changeDate(date) {
      this.date = date;
      let obj = {
        begin: this.date[0],
        end: this.date[1],
        school: this.currentSchool,
      };
      this.getOrderTime(obj);
    },
    getOrderIndicators(data) {
      getOrderIndicators(data).then((res) => {
        console.log("res", res);
        this.orderIndicatorsData = res.data.data;
      });
    },
    getOrderTime(data) {
      getOrderTime(data).then((res) => {
        console.log("res", res);
        this.orderTime = res.data.data;
      });
    },
    changeSchool(val) {
      console.log(val);
      this.changeDate(this.date);
      this.getOrderIndicators({ school: this.currentSchool });
    },
  },
};
</script>

<style lang="scss">
.statisticalTop {
  margin-bottom: 10px;
  span {
    font-size: 18px;
    font-weight: 400;
    color: #000000;
  }
}
.statistical {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  .num {
    font-size: 38px;
    font-weight: bold;
    color: #175e67;
  }
  .text {
    font-size: 22px;
    font-weight: 400;
    color: #333333;
  }
  .statisticalOrderStatus {
    width: 49.5%;
    background-color: #fff;
    padding: 70px 20px 40px;
    margin-bottom: 20px;
    box-sizing: border-box;
    .statisticalOrderStatusItem {
      width: 25%;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  .pickTime {
    width: 49.5%;
    margin-bottom: 20px;
    background-color: #fff;
    padding: 30px 20px 40px;
    text-align: right;
    box-sizing: border-box;
    .pickTimeItem {
      width: 50%;
    }
  }
  .statisticalItem {
    width: 49.5%;
    height: 467px;
    background: #fff;
    margin-bottom: 20px;
    padding: 30px 20px;
    box-sizing: border-box;
    .statisticalItem_title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        font-size: 16px;
        color: #175e67;
      }
    }
    .echart {
      width: 100%;
      flex: 1;
    }
  }
}

@media (max-width: 1440px) {
  .statisticalItem,
  .statisticalOrderStatus,
  .pickTime {
    width: 100% !important;
  }
}
</style>
