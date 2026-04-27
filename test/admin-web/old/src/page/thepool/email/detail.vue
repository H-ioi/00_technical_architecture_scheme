<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.邮箱详情") }}</div>
              <div>
                <el-button
                  v-if="permissions['update_email_user_info']"
                  @click="editUserEmail"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.编辑") }}</el-button
                >
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div
                :style="`width:${item.width ? item.width : '20%'};`"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in userEmailInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="$checkNull(userEmailData[item.prop])">{{
                  $checkNull(userEmailData[item.prop])
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <addEmail ref="addEmail" @initData="getDetail" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import { getUserEmailInfo } from "@/api/consult/email.js";
import addEmail from "@/page/thepool/email/modal/addemail.vue";
import dayjs from "dayjs";
export default {
  name: "Event",
  components: {
    addEmail,
  },
  data() {
    return {
      consult: consult,
      userEmailInfo: consult["userEmailTitle"],
      userEmailData: {},
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
  },

  created() {
    this.getDetail();
  },

  watch: {},
  mounted() {},
  activated() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      getUserEmailInfo(this.$route.query.id).then(async (res) => {
        if (res.data.success) {
          let {
            username,
            emailAddress,
            emailKey,
            userType,
            isAllowPersonalEmail,
            createTime,
            updateTime,
          } = res.data.data;
          this.$nextTick(() => {
            this.userEmailData = {
              id: this.$route.query.id,
              username,
              emailAddress,
              emailKey,
              userTypeLabel: this.$getListLabel(
                consult["userEmailType"],
                String(userType)
              ),
              isAllowPersonalEmailLabel: this.$getListLabel(
                consult["yesOrno"],
                String(isAllowPersonalEmail)
              ),
              createTime: createTime
                ? dayjs(createTime).format("YYYY-MM-DD HH:mm")
                : "--",
              updateTime: updateTime
                ? dayjs(updateTime).format("YYYY-MM-DD HH:mm")
                : "--",
            };
          });
        }
      });
    },
    editUserEmail() {
      this.$refs.addEmail.getDetail(this.$route.query.id);
    },
  },
};
</script>
<style lang="scss" scoped></style>
