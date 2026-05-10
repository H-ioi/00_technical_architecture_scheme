<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="85%"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="orderDetail" v-if="showDialog">
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in tabletitle['followTeacherTable']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
                <span :title="$checkNull(baseInfo[item.prop])">{{
                  $checkNull(baseInfo[item.prop])
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTeacherDetail } from "@/api/isacommunity/user.js";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
// 引入 dayjs
import dayjs from "dayjs";
export default {
  name: "detail",
  props: {
    title: String,
  },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      showDialog: false,
      baseInfo: {},
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
  },
  methods: {
    showModal(item) {
      this.showDialog = true;
      this.getDetail(item.id);
    },
    closeModal() {
      this.baseInfo = {};
      this.showDialog = false;
    },
    // 获取详情
    getDetail(id) {
      getTeacherDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            school,
            nickname,
            department,
            email,
            phone,
            status,
            lastLoginTime,
            createTime,
          } = res.data.data;

          this.$nextTick(() => {
            this.baseInfo = {
              ...this.baseInfo,
              id,
              nickname,
              department,
              email,
              phone,
              schoolLabel: this.$getListLabel(
                this.dictionary["school"],
                school,
                "enName",
                "id"
              ),

              statusLabel: this.$getListLabel(consts["statusType"], status),
              lastLoginTime: lastLoginTime
                ? dayjs(lastLoginTime).format("YYYY-MM-DD HH:mm")
                : "--",
              createTime: createTime
                ? dayjs(createTime).format("YYYY-MM-DD HH:mm")
                : "--",
            };
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
