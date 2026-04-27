<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="640px"
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
import { getSchoolEmailConfigDetail, getAppModules } from "@/api/isacommunity/schoolEmailConfig.js";
import dayjs from "dayjs";
export default {
  name: "emailSchoolDetail",
  components: {},
  props: {
    title: String,
  },
  data() {
    return {
      showDialog: false,
      displayRows: [],
      appModuleLabelMap: {},
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "dictionary"]),
  },
  methods: {
    mergeDefaultAppModuleLabels() {
      this.$set(this.appModuleLabelMap, "1", this.$t("isagroup.活动"));
    },
    loadAppModuleLabels() {
      this.mergeDefaultAppModuleLabels();
      return getAppModules()
        .then((res) => {
          if (!res.data.success) return;
          const raw = res.data.data;
          const list = Array.isArray(raw) ? raw : raw && (raw.list || raw.data || raw.records);
          if (!Array.isArray(list)) return;
          list.forEach((item) => {
            const key =
              item.value != null
                ? item.value
                : item.moduleCode != null
                  ? item.moduleCode
                  : item.code != null
                    ? item.code
                    : item.key != null
                      ? item.key
                      : item.id;
            const lab =
              item.label != null
                ? item.label
                : item.name != null
                  ? item.name
                  : item.desc != null
                    ? item.desc
                    : item.moduleName;
            if (key != null && lab != null) {
              this.$set(this.appModuleLabelMap, String(key), lab);
            }
          });
        })
        .catch(() => {});
    },
    appModuleLabel(val) {
      if (val == null || val === "") return "--";
      const s = String(val);
      return this.appModuleLabelMap[s] || s;
    },
    schoolLabel(schoolId) {
      if (schoolId == null || schoolId === "") return "--";
      const list = this.dictionary["school"] || [];
      const row = list.find((s) => String(s.id) === String(schoolId));
      if (!row) return String(schoolId);
      return this.i18nlocel === "en" ? row.enName || row.cnName : row.cnName || row.enName;
    },
    showModal(item) {
      this.showDialog = true;
      const id = item.id;
      if (id) {
        this.loadAppModuleLabels().finally(() => this.getDetail(id));
      }
    },
    closeModal() {
      this.showDialog = false;
    },
    getDetail(id) {
      getSchoolEmailConfigDetail(id).then((res) => {
        if (res.data.success) {
          const d = res.data.data || {};
          this.displayRows = [
            { label: "ID", value: d.id },
            { label: "校区", value: this.schoolLabel(d.schoolId) },
            { label: "邮箱地址", value: d.email },
            { label: "应用模块", value: this.appModuleLabel(d.appModule) },
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
