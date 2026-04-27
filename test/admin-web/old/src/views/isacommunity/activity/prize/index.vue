<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.奖品列表") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" size="large" @click="showForm('add')">{{
          $t("btn.新增")
        }}</el-button>
      </div>
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
              v-model="searchFrom['keyword']"
              :placeholder="$t('isagroup.关键词')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="programId" style="width: 180px">
            <el-select
              clearable
              style="width: 100%"
              v-model="searchFrom['programId']"
              :placeholder="$t('isagroup.活动项目')"
            >
              <el-option
                v-for="(i, k) in programlist"
                :key="k"
                :label="i18nlocel == 'en' ? i.enName : i.cnName"
                :value="i.id"
              ></el-option>
            </el-select>
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
        <Table
          ref="Table"
          :showSelection="true"
          :tableTitle="tabletitle['activityPrizeTable']"
          :tableData="tableData"
          :tableBtn="tableBtn"
          @playTab="playTab"
          @rowClick="rowClick"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button size="small" type="danger" plain @click="delData">{{
              $t("btn.删除")
            }}</el-button>
          </div>
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增编辑弹窗 -->
    <Form ref="Form" @getList="getList" />
    <!-- 详情弹窗 -->
    <Detail ref="Detail" :title="$t('isagroup.详情')" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityProgramlist } from "@/api/isacommunity/activityprogram.js";
import { getPrizePage, delPrize } from "@/api/isacommunity/prize.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Form from "./modal/form.vue";
import Detail from "./modal/detail.vue";
import dayjs from "dayjs";
export default {
  name: "teacher",
  components: { Table, Pagination, Form, Detail },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        {
          name: "查看",
          type: "look",
          icon: "",
          permissions: "",
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "busdriver_edit",
        },
      ],
      schoolList: [],
      roleList: [],
      programlist: [],
    };
  },
  created() {
    this.getBtn();
    this.initData();
  },
  mounted() {},
  activated() {
    this.getList();
  },
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
    async initData() {
      this.programlist = await getActivityProgramlist();
      this.getList();
    },
    getList() {
      getPrizePage({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getVoteprogramPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
          this.formatData();
        }
      });
    },
    formatData() {
      this.tableData.map((item) => {
        item["createTime"] = dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm");
        item["updateTime"] = dayjs(item["updateTime"]).format("YYYY-MM-DD HH:mm");
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          this.rowClick(item);
          break;
        case "edit":
          this.showForm("edit", item);
          break;
      }
    },
    delData() {
      let selectionId = this.$refs.Table.selectionId;
      if (selectionId.length == 0) {
        this.$message.warning(this.$t("isagroup.请选择要删除的数据"));
      } else {
        this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
          confirmButtonText: this.$t("isagroup.确定"),
        }).then(() => {
          delPrize({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        });
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.$refs["Detail"].showModal(row);
    },
    clear() {
      this.searchFrom = {};
      this.getList();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    getBtn() {
      this.tableBtn = this.permissionsBtn.filter((item) => {
        return this.permissions[item["permissions"]] || item["type"] == "look";
      });
    },
    showForm(type, item = {}) {
      this.$refs.Form.showForm(type, item);
    },
  },
};
</script>

<style lang="scss" scoped>
.tablelist {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
