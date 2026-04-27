<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="720px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="orderDetail">
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 50%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(row, index) in displayRows"
                :key="index"
              >
                <span>{{ $t("isagroup")[row.label] }}</span>
                <span :title="$checkNull(row.value)">{{ $checkNull(row.value) }}</span>
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
import { getWechatSchoolDetail } from "@/api/isacommunity/wechatSchoolInfo.js";
import consts from "@/const/isacommunity/consts.js";
import dayjs from "dayjs";
export default {
  name: "wechatSchoolDetail",
  components: {},
  props: {
    title: String,
  },
  data() {
    return {
      showDialog: false,
      detailData: {},
      displayRows: [],
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "dictionary"]),
  },
  methods: {
    showModal(item) {
      this.showDialog = true;
      const id = item.id;
      if (id) this.getDetail(id);
    },
    closeModal() {
      this.showDialog = false;
    },
    schoolLabel(schoolId) {
      if (schoolId == null || schoolId === "") return "--";
      const list = this.dictionary["school"] || [];
      const row = list.find((s) => String(s.id) === String(schoolId));
      if (!row) return String(schoolId);
      return this.i18nlocel === "en" ? row.enName || row.cnName : row.cnName || row.enName;
    },
    getDetail(id) {
      getWechatSchoolDetail(id).then((res) => {
        if (res.data.success) {
          const d = res.data.data || {};
          const activeLabel = this.$getListLabel(consts["yesOrno"], String(d.active));
          this.detailData = { ...d };
          this.displayRows = [
            { label: "ID", value: d.id },
            { label: "校区", value: this.schoolLabel(d.schoolId) },
            { label: "微信AppID", value: d.wechatAppid },
            { label: "微信Secret", value: d.wechatSecret },
            { label: "推送模板", value: d.msgTemplateId },
            { label: "Token值", value: d.verifyToken },
            { label: "激活状态", value: activeLabel },
            {
              label: "创建时间",
              value: d.createdAt ? dayjs(d.createdAt).format("YYYY-MM-DD HH:mm:ss") : "--",
            },
            {
              label: "更新时间",
              value: d.updatedAt ? dayjs(d.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "--",
            },
          ];
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
