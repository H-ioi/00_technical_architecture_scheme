<template>
  <div class="detail">
    <div class="detail_content">
      <div class="df_sb detail_top">
        <div class="detail_top_left df_sb">
          <div class="back_btn" @click="back">
            <img src="/svg/other/fanhui.svg" alt="" />
          </div>
          <span>预定管理看板</span>
        </div>
      </div>
      <div class="detail_item">
        <div class="detail_item_title df_sb" style="border-bottom: none">
          <span>{{
            `预定时间看板${
              $route.query.spaceName ? "-" + $route.query.spaceName : ""
            }`
          }}</span>
          <el-button
            type="primary"
            size="mini"
            @click="
              showReservation = true;
              reservationType = 'add';
            "
            >新建预定</el-button
          >
        </div>
      </div>

      <full-calendar
        ref="full-calendar"
        @handleEventClick="handleEventClick"
        @setReserve="setReserve"
        @getReserveDetail="getReserveDetail"
      ></full-calendar>

      <Reservation
        ref="reservation"
        :showReservation="showReservation"
        :reservationType="reservationType"
        @changeModal="changeModal"
        @refreshData="refreshData"
        @delSpaceReserve="delSpaceReserve"
        @editReserve="editReserve"
      />
    </div>
  </div>
</template>

<script>
import { spaceUseStatus } from "@/const/space/index.js";
import Fullcalendar from "./fullcalendar/index.vue";
import Reservation from "./modal/reservation";
export default {
  components: {
    "full-calendar": Fullcalendar,
    Reservation
  },
  data() {
    return {
      spaceUseStatus: spaceUseStatus,
      // 预定类型
      showReservation: false,
      reservationType: "",
      spaceAttribute: [],
      baseInfo: {},
      hierarchyInfo: [],
      spaceTypeInfo: [],
      spaceTypeName: [],
      // 选择的当前日期
      currentDate: "",
      spaceName: ""
    };
  },
  created() {},
  computed: {},
  methods: {
    getSpaceName(data) {
      this.spaceTypeName = [];
      data.map(item => {
        this.spaceTypeName.push(item.typeName);
      });
    },
    handleEventClick(type, info) {
      this.showReservation = true;
      this.reservationType = type;
    },
    changeModal(isShow, type) {
      if (type) {
        this.reservationType = type;
      }
      this.showReservation = isShow;
    },
    setDefault(data) {
      return data && data != "" ? data : "--";
    },
    back() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.back();
    },
    getListName(data, value) {
      let name = "";
      data.map(item => {
        if (item.value == value) {
          name = item.label;
        }
      });
      return name;
    },
    // 设置时间
    setReserve(start, end) {
      console.log(start, end);
      this.reservationType = "add";
      this.showReservation = true;
      this.$nextTick(() => {
        this.$refs.reservation.ruleForm.startTime = start;
        this.$refs.reservation.ruleForm.endTime = end;
      });
    },
    // 预定列表详情
    getReserveDetail(data) {
      console.log("data", data);
      this.reservationType = "look";
      this.showReservation = true;
      this.$nextTick(() => {
        this.$refs.reservation.ruleForm = {
          ...data[0],
          time: "00:00"
        };
      });
    },
    // 刷新预定列表
    refreshData() {
      this.showReservation = false;
      this.$refs["full-calendar"].getSpaceReserveList();
    },
    // 删除预定
    delSpaceReserve(id) {
      this.showReservation = false;
      this.$refs["full-calendar"].deleteItem(id);
      this.$refs["full-calendar"].getSpaceReservePage();
    },
    editReserve() {
      this.reservationType = "edit";
    }
  }
};
</script>

<style lang="scss" scoped>
.detail_baseinfo_item {
  width: 25% !important;
  margin-bottom: 20px;
}
.detail_baseinfo {
  .el-form {
    width: 100% !important;
  }
}
</style>
