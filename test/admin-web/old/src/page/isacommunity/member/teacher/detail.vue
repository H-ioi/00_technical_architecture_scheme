<template>
  <div class="orderDetail">
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">
          <div>{{ $t("isagroup.教师详情") }}</div>
          <div></div>
        </div>
        <div class="orderDetail_baseinfo">
          <div
            class="orderDetail_baseinfo_item"
            v-for="(item, index) in teacherInfo"
            :key="index"
          >
            <span>{{ $t("isagroup")[item.label] }}</span>
            <span :title="checkNull(teacherData[item.prop])">{{
              checkNull(teacherData[item.prop])
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTeacherDetail } from "@/api/isacommunity/merber.js";
import consts from "@/const/isacommunity/consts.js";
import ShowText from "@/components/common/ShowText.vue";
export default {
  name: "teacherDetail",
  components: {
    ShowText,
  },
  data() {
    return {
      teacherInfo: consts["teacherInfo"],
      teacherData: {},
    };
  },

  created() {
    this.getDetail();
  },
  mounted() {},
  activated() {
    this.getDetail();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    initData() {},
    getDetail() {
      getTeacherDetail(this.$route.query.id).then((res) => {
        console.log("getTeacherDetail", res);
        if (res.data.success) {
          this.teacherData = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.orderSteps {
  width: 100%;
}

.orderDetail_baseinfo {
  padding-bottom: 20px !important;
}

.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
