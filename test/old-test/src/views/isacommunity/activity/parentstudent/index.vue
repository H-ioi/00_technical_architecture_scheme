<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.家长学生关联管理") }}</div>
      <div class="community_top_btn"></div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form
          class="df_align_center"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
        >
          <el-form-item style="width: 180px">
            <el-input
              clearable
              style="width: 100%"
              v-model="searchFrom['phone']"
              :placeholder="$t('isagroup.关键词')"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: auto; margin-right: 0">
            <el-button
              class="button_text"
              size="medium"
              type="text"
              icon="el-icon-refresh-right"
              @click="clear"
              >{{ $t("btn.重置") }}</el-button
            >
            <el-button size="medium" type="primary" @click="getList">{{
              $t("btn.查询")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="isa_table">
        <div class="df_align_center">
          <div class="itemInfo">
            <div class="label">{{ $t("isagroup.手机号") }}：</div>
            <div class="value">
              {{ parentData["phoneNumber"] }}
            </div>
          </div>
          <div class="itemInfo">
            <div class="label">{{ $t("isagroup.邮箱") }}：</div>
            <div class="value">
              {{ parentData["email"] }}
            </div>
          </div>
          <div class="itemInfo">
            <div class="label">{{ $t("isagroup.是否爱莎家长") }}：</div>
            <div class="value">
              {{ parentData["isIsaParent"] ? "Yes" : "No" }}
            </div>
          </div>
        </div>
      </div>
      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="false"
          :tableTitle="studentTable"
          :tableData="studentTableData"
        />
      </div>
      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="false"
          :tableTitle="activityTable"
          :tableData="activityTableData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getParentStudent } from "@/api/isacommunity/activity.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
export default {
  name: "teacher",
  components: { Table },
  data() {
    return {
      consts: consts,
      searchFrom: {},
      studentTable: [
        {
          label: "中文名",
          prop: "cnName",
        },
        {
          label: "英文名",
          prop: "enName",
        },
        {
          label: "学号",
          prop: "admissionNo",
        },
        {
          label: "年级",
          prop: "grade",
        },
      ],
      studentTableData: [],
      activityTable: [
        {
          label: "ID",
          prop: "id",
        },
        {
          label: "中文名",
          prop: "activityCnName",
        },
        {
          label: "英文名",
          prop: "activityEnName",
        },
      ],
      activityTableData: [],
      parentData: {},
    };
  },
  created() {},
  mounted() {},
  activated() {},
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.formatData();
      },
    },
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  methods: {
    getList() {
      const phoneRaw = this.searchFrom && this.searchFrom.phone;
      const phone =
        typeof phoneRaw === "string"
          ? phoneRaw.trim()
          : String(phoneRaw || "").trim();
      if (!phone) {
        this.$message.warning(this.$t("isagroup.请输入关键词后再查询"));
        return;
      }
      getParentStudent({
        ...this.searchFrom,
        phone,
      }).then((res) => {
        if (res.data.success) {
          let { activities, parent, students } = res.data.data;
          this.parentData = parent;
          this.studentTableData = students;
          this.activityTableData = activities;
          //   this.formatData();
        }
      });
    },
    formatData() {
      this.studentTableData.map((item) => {
        item["grade"] = this.$getListLabel(this.dictionary["yeargroup"], item["grade"]);
      });
    },
    clear() {
      this.searchFrom = {};
      this.parentData = {};
      this.studentTableData = [];
      this.activityTableData = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.isa_table {
  margin-bottom: 20px;
}
.itemInfo {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .label {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
  }
  .value {
    color: #666666;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
