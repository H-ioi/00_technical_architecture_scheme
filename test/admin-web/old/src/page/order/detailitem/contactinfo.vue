<template>
  <div class="orderDetail_item">
    <div class="orderDetail_item_title">申请人信息</div>
    <div class="orderDetail_baseinfo">
      <div class="orderDetail_baseinfo_item">
        <span>申请人</span>
        <span :title="orderData['contact']">{{ orderData["contact"] }}</span>
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>邮箱</span>
        <span :title="orderData['email']">{{ orderData["email"] }}</span>
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>手机号</span>
        <span :title="orderData['phone']">{{ orderData["phone"] }}</span>
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>所属校区</span>
        <span :title="orderData['schoolName']">{{
          orderData["schoolName"]
        }}</span>
      </div>
      <div class="orderDetail_baseinfo_item">
        <span>部门</span>
        <span :title="orderData['department']">{{
          orderData["department"]
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { order } from "@/const/order/index.js";
export default {
  name: "contactinfo",
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
      require: false,
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
      return str == null || str == undefined ? "无" : str;
    }
  }
};
</script>
