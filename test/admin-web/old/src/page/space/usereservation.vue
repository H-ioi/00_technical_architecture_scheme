<template>
  <div class="detail">
    <div class="detail_content">
      <div class="df_sb detail_top">
        <div class="detail_top_left df_sb">
          <div class="back_btn" @click="back">
            <img src="/svg/other/fanhui.svg" alt="" />
          </div>
          <span>使用管理看板</span>
        </div>
      </div>
      <div class="detail_item">
        <div class="detail_item_title df_sb" style="border-bottom: none">
          <span>{{
            `使用时间看板${
              $route.query.spaceName ? "-" + $route.query.spaceName : ""
            }`
          }}</span>
          <el-button
            type="primary"
            size="mini"
            @click="
              showSpaceusage = true;
              spaceusageType = 'add';
            "
            >新建使用</el-button
          >
        </div>
      </div>

      <full-calendar
        ref="full-calendar"
        :currentSchool="$route.query.pid"
        @handleEventClick="handleEventClick"
        @setReserve="setReserve"
        @getReserveDetail="getReserveDetail"
      ></full-calendar>

      <!-- <Reservation
        ref="reservation"
        :showSpaceusage="showSpaceusage"
        :spaceusageType="spaceusageType"
        @changeModal="changeModal"
        @refreshData="refreshData"
        @delSpaceReserve="delSpaceReserve"
        @editReserve="editReserve"
      /> -->
      <Spaceusage
        ref="spaceusage"
        :showSpaceusage="showSpaceusage"
        :spaceusageType="spaceusageType"
        @changeModal="changeModal"
        @refreshData="refreshData"
        @delSpaceUsage="delSpaceUsage"
        @editUse="editUse"
      />
    </div>
  </div>
</template>

<script>
import { spaceUseStatus } from "@/const/space/index.js";
import Fullcalendar from "./fullcalendar/index.vue";
import Reservation from "./modal/reservation";
import Spaceusage from "@/page/space/modal/spaceusage";
export default {
  components: {
    "full-calendar": Fullcalendar,
    Reservation,
    Spaceusage
  },
  data() {
    return {
      spaceUseStatus: spaceUseStatus,
      // 使用类型
      showSpaceusage: false,
      spaceusageType: "",
      spaceAttribute: [],
      baseInfo: {},
      hierarchyInfo: [],
      spaceTypeInfo: [],
      spaceTypeName: [],
      // 选择的当前日期
      currentDate: ""
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.$refs["full-calendar"].getSpaceUsageBoard();
    });
  },
  computed: {},
  methods: {
    getSpaceName(data) {
      this.spaceTypeName = [];
      data.map(item => {
        this.spaceTypeName.push(item.typeName);
      });
    },
    handleEventClick(type, info) {
      this.showSpaceusage = true;
      this.spaceusageType = type;
    },
    changeModal(isShow, type) {
      if (type) {
        this.spaceusageType = type;
      }
      this.showSpaceusage = isShow;
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
      this.spaceusageType = "add";
      this.showSpaceusage = true;
      this.$nextTick(() => {
        this.$refs.spaceusage.ruleForm.startTime = start;
        this.$refs.spaceusage.ruleForm.endTime = end;
      });
    },
    // 使用列表详情
    getReserveDetail(data) {
      console.log("data", data);
      this.spaceusageType = "look";
      this.showSpaceusage = true;
      this.$nextTick(() => {
        this.$refs.spaceusage.ruleForm = {
          ...data[0],
          time: "00:00"
        };
      });
    },
    // 刷新使用列表
    refreshData() {
      this.showSpaceusage = false;
      this.$refs["full-calendar"].getSpaceUsageBoard();
    },
    // 删除使用
    delSpaceUsage(id) {
      this.showSpaceusage = false;
      this.$refs["full-calendar"].deleteItem(id);
      this.$refs["full-calendar"].getSpaceUsageBoard();
    },
    editUse() {
      this.spaceusageType = "edit";
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
