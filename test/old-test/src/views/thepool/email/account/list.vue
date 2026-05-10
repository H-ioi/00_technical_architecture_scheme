<template>
  <div class="thepool_page">
    <div class="searchFromBox search" style="padding: 20px">
      <el-form
        ref="searchFrom"
        class="df_align_center searchFrom"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item :label="$t('consult.用户名')" style="width: 214px">
          <el-input
            v-model="searchFrom.username"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.邮箱')" style="width: 214px">
          <el-input
            v-model="searchFrom.email"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.类型')" style="width: 214px">
          <el-select
            v-model="searchFrom.userType"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in consult['userEmailType']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('consult.新增时间')" style="width: 214px">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.createdTime"
            type="daterange"
            clearable
            :range-separator="$t('consult.至')"
            :start-placeholder="$t('consult.开始')"
            :end-placeholder="$t('consult.结束')"
            :value-format="'yyyy-MM-dd'"
            :format="'yyyy-MM-dd'"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item style="width: 110px; margin-right: 0">
          <div class="df_sb">
            <el-button
              type="defult"
              size="small"
              icon="el-icon-search"
              round
              @click="search"
              >{{ $t("consult.搜索") }}</el-button
            >
            <el-button type="text" size="small" round @click="clear">
              <div class="clear_btn">
                <img src="/thepool/other/clear.png" alt="" />
                <span> {{ $t("consult.清除") }}</span>
              </div>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox" style="padding-top: 0">
      <div class="df_sb">
        <div class="df_sb">
          <el-button
            v-if="permissions['add_email_user_info']"
            type="primary"
            size="small"
            round
            @click="addEmail"
            >{{ $t("consult.新增") }}</el-button
          >
          <el-button
            v-if="permissions['del_email_user_info']"
            type="default"
            size="small"
            round
            @click="batchDeleteUserEmail"
            >{{ $t("consult.删除") }}</el-button
          >
        </div>
      </div>
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="true"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <div
        class="df_sb palyTableBox"
        style="padding: 0"
        v-if="paginationTotal > 10"
      >
        <PaginationInfo :paginationTotal="paginationTotal" />
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </div>
    <addEmail ref="addEmail" @initData="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserEmailList, delUserEmail } from "@/api/consult/email.js";
import { consult } from "@/const/consult/index.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import addEmail from "@/page/thepool/email/modal/addemail.vue";
import dayjs from "dayjs";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    addEmail,
    PaginationInfo,
  },
  data() {
    return {
      consult: consult,
      tableTitle: consult["userEmailTitle"],
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "update_email_user_info",
          icon: "el-icon-view",
        },
        {
          name: "删除",
          type: "del",
          permissions: "del_email_user_info",
          icon: "el-icon-view",
        },
      ],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchFrom: {},
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },

  created() {
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
    this.getList();
  },

  watch: {
    i18nlocel() {
      console.log("i18nlocel", this.i18nlocel);
    },
  },
  mounted() {},
  activated() {
    this.getList();
  },
  methods: {
    getList() {
      getUserEmailList({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.paginationTotal = Number(total);
          this.tableData = data;
          this.tableData.map((item) => {
            item["userTypeLabel"] = this.$getListLabel(
              consult["userEmailType"],
              item["userType"]
            );
            item["isAllowPersonalEmailLabel"] = this.$getListLabel(
              consult["yesOrno"],
              item["isAllowPersonalEmail"]
            );
            item["createTime"] = item["createTime"]
              ? dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm")
              : "--";
            item["updateTime"] = item["updateTime"]
              ? dayjs(item["updateTime"]).format("YYYY-MM-DD HH:mm")
              : "--";
          });
        }
      });
    },
    batchDeleteUserEmail() {
      let ids = this.$refs.Table.selectionId;
      if (ids.length == 0) {
        this.$message.warning(this.$t("consult.请选择"));
        return;
      }
      this.$alert(this.$t("consult.确认删除吗"), this.$t("consult.删除"), {
        confirmButtonText: this.$t("consult.确定"),
      }).then(() => {
        delUserEmail({ id: ids }).then((res) => {
          this.$message.success(this.$t("consult.成功"));
          this.getList();
        });
      });
    },

    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push("/thepool/email/detail?id=" + item.id);
          break;
        case "edit":
          this.$refs.addEmail.getDetail(item.id);
          break;
        case "del":
          delUserEmail({ id: [item.id] }).then((res) => {
            this.$message.success(this.$t("consult.成功"));
            this.getList();
          });
          break;
      }
    },
    rowClick(row, column, event) {
      this.$router.push("/thepool/email/detail?id=" + row.id);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    // 搜索
    search() {
      this.pagination["pageNum"] = 1;
      this.getList();
    },
    // 清除搜索
    clear() {
      this.searchFrom = {};
      this.search();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    addEmail() {
      this.$refs.addEmail.initModal();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
