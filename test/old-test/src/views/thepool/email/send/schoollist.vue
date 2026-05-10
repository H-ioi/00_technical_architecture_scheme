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
        <el-form-item
          v-if="pooldictpermissions.length > 1"
          :label="$t('consult.学校')"
          style="width: 214px"
        >
          <el-select
            multiple
            v-model="searchFrom.campusPermission"
            :placeholder="$t('consult.请选择')"
            @change="changeSchool"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in pooldictpermissions"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.邮件主题')" style="width: 214px">
          <el-input
            v-model="searchFrom.subject"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.是否成功')" style="width: 214px">
          <el-select
            style="width: 100%"
            v-model="searchFrom.isSuccess"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in consult['yesOrno']"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('consult.发送时间')" style="width: 214px">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.sendTime"
            type="datetimerange"
            :range-separator="$t('consult.至')"
            :start-placeholder="$t('consult.开始')"
            :end-placeholder="$t('consult.结束')"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
            :format="'yyyy-MM-dd HH:mm:ss'"
            clearable
            @clear="search"
          >
          </el-date-picker>
        </el-form-item>
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

    <div class="tableBox">
      <Table
        ref="Table"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="false"
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
import { getEmailList } from "@/api/consult/email.js";
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
      tableTitle: consult["emailTitle"],
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view",
        },
      ],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        sendType: 2,
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
    if (this.pooldictpermissions.length == 1) {
      let schoolId = this.pooldictpermissions[0].value;
      this.pagination["campusPermission"] = [schoolId];
    }
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
      let data = { ...this.pagination, ...this.searchFrom };
      if (this.searchFrom.sendTime && this.searchFrom.sendTime.length == 2) {
        data.sendTimeStart = this.searchFrom.sendTime[0];
        data.sendTimeEnd = this.searchFrom.sendTime[1];
      }
      delete data.sendTime;
      getEmailList(data).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.paginationTotal = Number(total);
          this.tableData = data;
          this.tableData.map((item) => {
            item["sender"] =
              item["senderName"] + "<" + item["senderEmail"] + ">";
            item["sendTime"] = item["sendTime"]
              ? dayjs(item["sendTime"]).format("YYYY-MM-DD HH:mm")
              : "--";
            let toRecipients = [];
            let ccRecipients = [];
            item["receivers"].map((item) => {
              if (item["receiverType"] == 1) {
                toRecipients = item["emailInfos"].map((i) => {
                  return i.userName + " <" + i.email + ">";
                });
              } else if (item["receiverType"] == 2) {
                ccRecipients = item["emailInfos"].map((i) => {
                  return i.userName + " <" + i.email + ">";
                });
              }
            });
            item["toRecipients"] = String(toRecipients);
            item["ccRecipients"] = String(ccRecipients);
            item["isBatchLabel"] = this.$getListLabel(
              consult["yesOrno"],
              String(item["isBatch"])
            );
            item["isSuccessLabel"] = this.$getListLabel(
              consult["successType"],
              String(item["isSuccess"])
            );
          });
        }
      });
    },

    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push("/thepool/email/senddetail?id=" + item.id);
          break;
        case "edit":
          this.$refs.addEmail.getDetail(item.id);
          break;
      }
    },
    rowClick(row, column, event) {
      this.$router.push("/thepool/email/senddetail?id=" + row.id);
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
