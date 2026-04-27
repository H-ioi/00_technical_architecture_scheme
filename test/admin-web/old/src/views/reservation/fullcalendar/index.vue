<template>
  <div class="space">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">预定看板</div>
      <div class="df_fa" style="height: calc(100% - 54px)">
        <el-scrollbar class="areaList">
          <div
            @click="changeSchool(i)"
            :class="[
              'areaItem',
              {
                areaItem_active: currentSchool == i.id,
              },
            ]"
            v-for="(i, k) in spaceTop"
            :key="k"
          >
            {{ i.name }}
          </div>
        </el-scrollbar>
        <div style="flex: 1">
          <full-calendar
            ref="full-calendar"
            :currentSchool="currentSchool"
            @handleEventClick="handleEventClick"
            @getReserveDetail="getReserveDetail"
          ></full-calendar>
        </div>
      </div>
    </el-scrollbar>
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
</template>
        
    <script>
import { mapGetters } from "vuex";
import { getSpaceTop, getAllSpaceType } from "@/api/space/spacetype.js";
import Fullcalendar from "@/page/space/fullcalendar/index.vue";
import Reservation from "@/page/space/modal/reservation";
export default {
  components: {
    "full-calendar": Fullcalendar,
    Reservation,
  },
  data() {
    return {
      showReservation: false,
      reservationType: "",
      // 空间类型
      spaceTop: [],
      currentSchool: "",

      // 分页
      pagination: {
        size: 10,
        current: 1,
      },
      loadingTable: false,
    };
  },

  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },

  created() {
    this.getSpaceTop();
  },
  activated() {
    // this.refreshData();
  },
  methods: {
    getSpaceTop() {
      getSpaceTop().then((res) => {
        if (res.data.success) {
          this.spaceTop = res.data.data;
          this.changeSchool(this.spaceTop[0]);
        }
      });
    },
    changeSchool(i) {
      this.currentSchool = i.id;
      this.$nextTick(() => {
        this.$refs["full-calendar"].getSpaceReservePage();
      });
    },
    handleEventClick(type, info) {
      this.showReservation = true;
      this.reservationType = type;
    },
    // 设置时间
    setReserve(start, end) {
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
          time: "00:00",
        };
      });
    },
    changeModal(isShow, type) {
      if (type) {
        this.reservationType = type;
      }
      this.showReservation = isShow;
    },
    // 刷新预定列表
    refreshData() {
      this.showReservation = false;
      this.$refs["full-calendar"].getSpaceReservePage();
    },
    // 删除预定
    delSpaceReserve(id) {
      this.showReservation = false;
      this.$refs["full-calendar"].deleteItem(id);
      this.$refs["full-calendar"].getSpaceReservePage();
    },
    editReserve() {
      this.reservationType = "edit";
    },
  },
};
</script>
         
<style lang = "scss" scoped>
.space {
  .search {
    padding: 0 !important;
    box-shadow: none !important;
    margin-bottom: 20px;
  }
}
</style>