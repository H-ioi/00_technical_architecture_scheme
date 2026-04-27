<template>
  <div class="orderDetail_item">
    <div class="orderDetail_item_title df_sb">
      <span>评价信息</span>
      <div v-if="isMy ? hasMyAuthority : permissions['order_appraise']">
        <div v-if="currentOrderStatus == '5' ? true : !changeAppraise">
          <el-button type="primary" size="mini" @click="appraiseOrder"
            >保存评价</el-button
          >
          <el-button size="mini" @click="changeAppraise = true">取消</el-button>
        </div>
        <el-button
          v-else
          type="primary"
          size="mini"
          @click="changeAppraise = false"
          >修改评价</el-button
        >
      </div>
    </div>
    <div class="orderDetail_baseinfo">
      <div class="orderDetail_infoItem">
        <div class="infoItemTitle">评价</div>
        <el-rate
          v-model="orderAppraise.star"
          show-text
          :texts="rateTexts"
          :void-color="'#C6D1DE'"
          :text-color="'#175E67'"
          :colors="['#175E67', '#175E67', '#175E67']"
          :disabled="changeAppraise && currentOrderStatus == '6'"
          void-icon-class="el-icon-star-on"
        >
        </el-rate>
      </div>
      <div class="orderDetail_infoItem">
        <div class="infoItemTitle">备注</div>
        <ShowText
          v-if="changeAppraise && currentOrderStatus == '6'"
          :label="orderAppraise.content"
        />
        <el-input
          v-else
          type="textarea"
          :rows="5"
          :maxlength="300"
          show-word-limit
          v-model="orderAppraise.content"
          placeholder="请输入"
        ></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { appraiseOrder, appraiseMyOrder } from "@/api/workorder/order/index.js";
import { order } from "@/const/order/index.js";
import ShowText from "@/components/common/ShowText.vue";
export default {
  name: "appraise",
  components: {
    ShowText
  },
  props: {
    currentOrderStatus: {
      type: String,
      require: true,
      default: ""
    },
    currentOrderId: {
      type: String,
      require: true,
      default: ""
    },
    isMy: {
      type: Boolean,
      require: true,
      default: false
    },
    hasMyAuthority: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  data() {
    return {
      order: order,
      orderAppraise: { star: 0, content: "" },
      changeAppraise: true,
      rateTexts: ["差", "较差", "一般", "较好", "优秀"]
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    appraiseOrder() {
      let data = {
        ...this.orderAppraise,
        ids: [this.currentOrderId]
      };
      if (this.isMy) {
        appraiseMyOrder(data).then(res => {
          if (res.data.success) {
            this.$message.success("已修改评价");
            this.changeAppraise = true;
            this.$emit("refreshData");
          }
        });
      } else {
        appraiseOrder(data).then(res => {
          if (res.data.success) {
            this.$message.success("已修改评价");
            this.changeAppraise = true;
            this.$emit("refreshData");
          }
        });
      }
    }
  }
};
</script>
