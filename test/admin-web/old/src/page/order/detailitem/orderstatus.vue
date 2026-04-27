<template>
  <div class="orderDetail_item">
    <div class="orderDetail_item_title">工单处理信息</div>
    <div class="orderDetail_baseinfo">
      <div class="orderDetail_baseinfo_item">
        <span>处理状态</span>
        <span
          :title="order['orderStatus'][currentOrderStatus]"
          style="color: #175e67"
          >{{ order["orderStatus"][currentOrderStatus] }}</span
        >
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>催单次数</span>
        <span :style="`color:${orderData['urgeNums'] > 0 ? 'red' : ''}`">{{
          checkNull(orderData["urgeNums"])
        }}</span>
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>处理人</span>
        <span :title="checkNull(orderData['distributeUsername'])">{{
          checkNull(orderData["distributeUsername"])
        }}</span>
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>派单时间</span>
        <span :title="checkNull(orderData['distributeTime'])">{{
          checkNull(orderData["distributeTime"])
        }}</span>
      </div>
      <div
        class="orderDetail_baseinfo_item"
        v-if="currentOrderStatus == '5' || currentOrderStatus == '6'"
      >
        <span>完单时间</span>
        <span :title="checkNull(orderData['completeTime'])">{{
          checkNull(orderData["completeTime"])
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { order } from "@/const/order/index.js";
import { method } from "lodash";
export default {
  name: "orderstatus",
  props: {
    orderData: {
      type: Object,
      require: true,
      default: () => {
        return {};
      }
    },
    currentOrderStatus: {
      type: String,
      require: true,
      default: ""
    }
  },
  data() {
    return {
      order: order
    };
  },
  methods: {
    checkNull(str) {
      return str == "" || str == null || str == undefined ? "无" : str;
    }
  }
};
</script>
