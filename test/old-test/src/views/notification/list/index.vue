<template>
  <div class="thepool_page">
    <div class="notification">
      <div class="df_sb">
        <div class="notification_title">{{ $t("consult.消息列表") }}</div>

        <div class="notification_btns">
          <el-button type="primary" size="medium" round @click="allMessageRead">{{
            $t("consult.一键已读")
          }}</el-button>
        </div>
      </div>
      <div class="notification_table">
        <el-table
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          :data="tableData"
          style="width: 100%"
          tooltip-effect="dark"
          :header-cell-style="tablestyle.headercellstyle"
          :cell-style="tablestyle.rowstyle"
        >
          <!-- 多选按钮 -->
          <!-- <el-table-column type="selection" width="50" :selectable="checkSelectable">
                    </el-table-column> -->
          <el-table-column
            v-for="(item, index) in tableColumn"
            :key="index"
            :prop="item['prop']"
            :label="$t(`consult.${item['label']}`)"
            :width="item['width']"
          >
            <template slot-scope="scope">
              <span v-if="item['prop'] == 'isRead'" class="readstatus">
                <span
                  class="readstatus_icon"
                  :style="`background: ${
                    scope.row[item['prop']] ? '#67C23A' : '#E6A23C'
                  };`"
                ></span>
                {{ scope.row[item["prop"]] ? $t("consult.已读") : $t("consult.未读") }}
              </span>
              <span v-else>{{ scope.row[item["prop"]] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="palyTableBox df_sb">
          <PaginationInfo :paginationTotal="paginationTotal" />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import { fetchMyMessage, allMessageRead, readThisMessages } from "@/api/message/index";
export default {
  name: "list",
  components: {
    Pagination,
    PaginationInfo,
    Table,
  },
  data() {
    return {
      tablestyle: {
        headercellstyle: {
          background: "#E7F1FB",
          color: " #333333",
          "font-size": "14px",
          "font-weight": "400",
          height: "40px",
          "box-sizing": "border-box",
        },
        rowstyle: {
          color: " #666666",
          "font-size": "14px",
          "font-weight": "400",
          height: "40px",
          border: "none",
          padding: "0px",
          "box-sizing": "border-box",
        },
      },
      tableData: [],
      tableColumn: [
        {
          label: "标题",
          prop: "title",
          width: "auto",
        },
        {
          label: "消息类型",
          prop: "typeLabel",
          width: "200px",
        },
        {
          label: "消息状态",
          prop: "isRead",
          width: "200px",
        },
        {
          label: "接收时间",
          prop: "createTime",
          width: "200px",
        },
      ],
      pagination: {
        size: 10,
        current: 1,
        // type: 3,
        // moduleType: 10,
      },
      paginationTotal: 0,
      selectionId: [],
      moduleType: {
        3: "招生咨询线索",
        10: "招生咨询线索",
        11: "事件消息",
        12: "任务消息",
      },
    };
  },
  created() {
    this.getMessageList();
  },

  mounted() {},
  activated() {
    this.getMessageList();
  },
  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },
  methods: {
    allMessageRead() {
      this.$confirm(this.$t("consult.确定全部改为已读吗"), this.$t("consult.提示"), {
        confirmButtonText: this.$t("consult.确定"),
        cancelButtonText: this.$t("consult.取消"),
        showClose: false,
      })
        .then((_) => {
          allMessageRead().then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("consult.成功"));
              this.getchMessageUnread();
              this.getMessageList();
            }
          });
        })
        .catch((_) => {});
    },
    getMessageList() {
      fetchMyMessage(this.pagination).then((res) => {
        if (res.data.success) {
          console.log("fetchMyMessage", res);
          let { records, total } = res.data.data;
          this.tableData = records;
          this.tableData.map((item) => {
            item["typeLabel"] = this.moduleType[item["moduleType"]];
          });
          this.paginationTotal = total;
        }
      });
    },
    readThisMessages(id) {
      readThisMessages(id).then((res) => {
        if (res.data.success) {
          this.getchMessageUnread();
          this.getMessageList();
        }
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getMessageList();
    },
    // 多选
    handleSelectionChange(arr) {
      this.selectionId = [];
      arr.map((i) => {
        this.selectionId.push(i.id);
      });
    },
    allRead() {
      if (this.selectionId == 0) {
        this.$message.error("请至少选择一条消息");
      } else {
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.readThisMessages(row.id);
      switch (row["moduleType"]) {
        case 3:
          this.$router.push(`/thepool/enquiry/detail?clueId=${row.outerId}&type=2`);
          break;
        case 10:
          this.$router.push(`/thepool/enquiry/detail?clueId=${row.outerId}&type=2`);
          break;

        case 11:
          this.$router.push(
            "/thepool/collaboration/event/detail?eventId=" +
              row.eventId +
              "&eventTimeId=" +
              row.eventTimeId
          );
          break;
        case 12:
          this.$router.push("/thepool/collaboration/task/detail?taskId=" + row.taskId);
          break;
      }
    },
    checkSelectable(e) {
      return true;
    },
    getchMessageUnread() {
      this.$store.dispatch("FetchMessageUnread");
    },
  },
};
</script>

<style lang="scss" scoped>
.notification {
  padding: 30px;
  background-color: #fff;

  .notification_title {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #666666;
    line-height: 24px;
    margin-bottom: 20px;
  }

  .notification_btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .notification_table {
  }

  .readstatus {
    display: block;
    display: flex;
    align-items: center;
    line-height: 24px;

    .readstatus_icon {
      display: block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
}
</style>
