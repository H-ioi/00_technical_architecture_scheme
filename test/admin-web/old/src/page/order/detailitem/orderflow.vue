<template>
  <div class="orderDetail_item">
    <div class="orderDetail_item_title" style="margin-bottom: 20px">
      工单流程
    </div>
    <div class="orderDetail_baseinfo">
      <el-steps
        class="orderSteps"
        direction="vertical"
        :active="orderLogs.length"
      >
        <el-step v-for="(i, k) in orderLogs" :key="k" :title="i.title">
          <template slot="description">
            <ShowText
              v-if="i.details !== null && i.details !== ''"
              :label="i.details"
            />
            <div class="time">{{ i.createTime }}</div>
          </template></el-step
        >
      </el-steps>
    </div>
  </div>
</template>
<script>
import { order } from "@/const/order/index.js";
import ShowText from "@/components/common/ShowText.vue";
export default {
  name: "orderflow",
  components: {
    ShowText
  },
  props: {
    orderLogs: {
      type: Array,
      require: true,
      default: () => {
        return [];
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
