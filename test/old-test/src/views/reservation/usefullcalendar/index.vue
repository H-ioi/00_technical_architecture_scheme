<template>
  <div class="space">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">使用看板</div>
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
</template>
        
    <script>
import { mapGetters } from "vuex";
import { getSpaceTop, getAllSpaceType } from "@/api/space/spacetype.js";
import Fullcalendar from "@/page/space/fullcalendar/index.vue";
import Spaceusage from "@/page/space/modal/spaceusage";
export default {
  components: {
    "full-calendar": Fullcalendar,
    Spaceusage,
  },
  data() {
    return {
      showSpaceusage: false,
      spaceusageType: "",
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
        this.$refs["full-calendar"].getSpaceUsageBoard();
      });
    },
    handleEventClick(type, info) {
      this.showSpaceusage = true;
      this.spaceusageType = type;
    },
    // 预定列表详情
    getReserveDetail(data) {
      console.log("data", data);
      this.spaceusageType = "look";
      this.showSpaceusage = true;
      this.$nextTick(() => {
        this.$refs.spaceusage.ruleForm = {
          ...data[0],
          time: "00:00",
        };
      });
    },
    changeModal(isShow, type) {
      if (type) {
        this.spaceusageType = type;
      }
      this.showSpaceusage = isShow;
    },
    // 刷新预定列表
    refreshData() {
      this.showSpaceusage = false;
      this.$refs["full-calendar"].getSpaceUsageBoard();
    },
    // 删除预定
    delSpaceUsage(id) {
      this.showSpaceusage = false;
      this.$refs["full-calendar"].deleteItem(id);
      this.$refs["full-calendar"].getSpaceUsageBoard();
    },
    editUse() {
      this.spaceusageType = "edit";
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