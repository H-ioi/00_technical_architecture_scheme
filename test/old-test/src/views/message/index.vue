<template>
  <div class="main-content">
    <div :class="['content_top', 'df_sb']">
      <div class="content_type">
        <div
          @click="changetype(item, index)"
          v-for="(item, index) in messagedata"
          :key="index"
          :class="{ currentStatus: index == currentStatus }"
        >
          {{ `${item.name}` }}
        </div>
      </div>
    </div>
    <div class="filterstatus" v-if="currentStatus == 1">
      <div class="title_text">筛选查询</div>
      <div class="status">
        <div>审核状态</div>
        <div>
          <span
            :class="{ bc: index == currentauditstatus }"
            @click="changeauditStatus(item, index)"
            v-for="(item, index) in auditStatus"
            :key="index"
            >{{ item.name }}</span
          >
        </div>
      </div>
    </div>
    <div class="tablebox">
      <div class="df_sb">
        <div class="title_text">消息列表</div>
        <div v-show="tableData.length !== 0 && !pagination['isRead']">
          <el-button class="btn_small" type="primary" @click="isReadMessges"
            >标记为已读</el-button
          >
          <el-button class="btn_small" type="primary" @click="allMessageRead"
            >一键已读</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          background: '#F8F8F8',
          color: ' #999999',
          'font-size': '16px',
          'font-weight': '400',
        }"
        :row-style="{
          color: ' #999999',
          'font-size': '16px',
          'font-weight': '400',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="checkSelectable"
          width="55"
        >
        </el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :key="index"
          v-for="(item, index) in tabletitle"
        >
          <template slot-scope="scope">
            <span class="statusbox" v-if="item.prop == 'isRead'"
              ><span
                class="cr"
                :style="`background: ${
                  !scope.row.isRead ? '#ff3057' : '#8EA1BB'
                }`"
              ></span
              >{{ scope.row.isRead ? "已读消息" : "未读消息" }}</span
            >
            <span v-else-if="item.prop == 'type'">{{
              messagetype[scope.row[item.prop]]
            }}</span>
            <el-tooltip
              v-else
              :content="
                scope.row[item.prop] === null ||
                scope.row[item.prop] === '' ||
                scope.row[item.prop] === undefined
                  ? '/'
                  : scope.row[item.prop]
              "
              effect="dark"
              placement="top"
            >
              <span class="tips">{{
                scope.row[item.prop] === null ||
                scope.row[item.prop] === "" ||
                scope.row[item.prop] === undefined
                  ? "/"
                  : scope.row[item.prop]
              }}</span>
            </el-tooltip>
            <!-- <span v-else>{{ scope.row[item.prop] }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="play" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="lookmessage(scope.row)"
              >查看</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="(isdel = true), (currentid = scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        @getDataList="getDataList"
        :currentfilterObj="currentfilterObj"
        ref="Pagination"
      />
    </div>
    <DelModal :isdel="isdel" @isdelcurrent="isdelcurrent" @Close="closeModal" />
    <Modal
      ref="infomodal"
      :isshow="isshow"
      :data="messageobj"
      @Close="closeModal"
      :messageItemType="messageItemType"
    />
  </div>
</template>

<script>
import {
  fetchMyMessage,
  delMessage,
  getMessageDetail,
  postMessage,
  allMessageRead,
  readMessages,
} from "@/api/message/index.js";
import Pagination from "@/components/commonConpents/Pagination";
import DelModal from "@/components/commonConpents/commonModal/Del.vue";
import Modal from "./modal.vue";
import { mapGetters } from "vuex";
export default {
  name: "UniUiIndex",

  data() {
    return {
      isdel: false,
      isshow: false,
      currentid: "",
      messageobj: {},
      pagination: {},
      currentStatus: 0,
      currentauditstatus: 0,
      messagedata: [
        { name: "未读消息", type: 0 },
        { name: "审核消息", type: 1 },
        { name: "业务消息", type: 2 },
        { name: "系统消息", type: 3 },
        { name: "通知消息", type: 4 },
        { name: "全部消息", type: 5 },
      ],
      auditStatus: [
        { name: "全部", type: -1 },
        { name: "待审核", type: 0 },
        { name: "审核通过", type: 1 },
        { name: "审核不通过", type: 2 },
      ],
      tabletitle: [
        { prop: "title", label: "标题" },
        { prop: "createTime", label: "创建时间" },
        { prop: "type", label: "消息类型" },
        { prop: "isRead", label: "消息状态" },
      ],
      messagetype: {
        1: "审核消息",
        2: "业务消息",
        3: "系统消息",
        4: "通知消息",
      },
      currentfilterObj: {},
      tableData: [],
      SelectionList: [],
      messageItemType: 0,
    };
  },

  mounted() {},

  methods: {
    changeMessageNum() {
      this.$store.dispatch("FetchMessageUnread");
    },
    allMessageRead() {
      allMessageRead().then((res) => {
        this.$message.success("全部已读");
        this.getDataList(this.currentfilterObj);
        this.changeMessageNum();
      });
    },
    readMessages(data) {
      readMessages(data).then((res) => {
        this.$message.success("已读");
        this.getDataList(this.currentfilterObj);
        this.changeMessageNum();
      });
    },
    getDataList(data) {
      this.currentfilterObj = data;
      fetchMyMessage(data).then((res) => {
        console.log("res", res);
        let data = res.data.data;
        let { records, total } = data;
        this.tableData = records;
        this.$nextTick(() => {
          this.$refs.Pagination.total = total;
        });
      });
    },
    delMessage(id) {
      delMessage(id).then((res) => {
        this.$message.success("已删除");
        this.getDataList(this.currentfilterObj);
        this.isdel = false;
      });
    },
    getMessageDetail(id) {
      getMessageDetail(id).then((res) => {
        console.log(1111, res.data.data);
        this.changeMessageNum();
        let data = res.data.data;
        switch (data.type) {
          case 1:
            break;
          case 2:
            this.todetail(data);
            break;
          case 3:
            this.getDataList(this.currentfilterObj);
            this.messageobj = data;
            this.isshow = true;
            break;
          case 4:
            this.getDataList(this.currentfilterObj);
            this.messageobj = data;
            this.isshow = true;
            this.$nextTick(() => {
              this.$refs["infomodal"].getfilelist(id);
            });
            break;
        }
      });
    },

    todetail(data) {
      switch (data.moduleType) {
        case 1:
          this.$router.push({
            path: "/contact/client/index/detail",
            query: {
              id: data.outerId,
            },
          });
          break;
        case 2:
          this.$router.push({
            path: "/contact/contacter/detail",
            query: {
              id: data.outerId,
            },
          });
          break;
        case 3:
          this.$router.push({
            path: "/clue/my/index/detail",
            query: {
              id: data.outerId,
            },
          });
          break;
        case 4:
          this.$router.push({
            path: "/opportunity/my/detail",
            query: {
              id: data.outerId,
            },
          });
          break;
        case 5:
          this.$router.push({
            path: "/contract/my/detail",
            query: {
              id: data.outerId,
            },
          });
          break;
        case 6:
          this.$router.push({
            path: "/team/detail",
            query: {
              id: data.outerId,
            },
          });
          break;
      }
    },
    postMessage(data) {
      postMessage(data).then((res) => {
        console.log(1111, res.data.data);
      });
    },
    lookmessage(row) {
      console.log("row", row);
      switch (row.type) {
        case 1:
          this.$router.push({
            path: "/message/detail",
            query: {
              id: row.id,
            },
          });
          break;
        case 2:
          if (row.isRead) {
            this.todetail(row);
          } else {
            this.getMessageDetail(row.id);
          }

          break;
        case 3:
          if (row.isRead) {
            this.messageobj = row;
            this.isshow = true;
          } else {
            this.getMessageDetail(row.id);
          }
          break;
        case 4:
          this.getMessageDetail(row.id);
          // if (row.isRead) {
          //   this.messageobj = row;
          //   this.isshow = true;
          // } else {
          //   this.getMessageDetail(row.id);
          // }

          break;
      }
    },
    changetype(item, index) {
      console.log("item.type", item.type);
      this.messageItemType = item.type;
      this.currentauditstatus = 0;
      this.currentStatus = index;
      this.pagination = {
        size: 10,
        current: 1,
      };
      this.$nextTick(() => {
        this.$refs["Pagination"].pagination.current = 1;
      });
      if (item.type == 5) {
        this.getDataList(this.pagination);
        return;
      }
      if (item.name == "未读消息") {
        this.pagination["isRead"] = item.type;
      } else {
        this.pagination["type"] = item.type;
      }
      this.getDataList(this.pagination);
    },
    changeauditStatus(item, index) {
      this.currentauditstatus = index;
      this.pagination = {
        size: 10,
        current: 1,
        type: 1,
      };
      this.$nextTick(() => {
        this.$refs["Pagination"].pagination.current = 1;
      });
      if (index < 0) {
        this.getDataList(this.pagination);
      } else {
        this.pagination["auditStatus"] = item.type;
        this.getDataList(this.pagination);
      }
    },
    isdelcurrent() {
      this.delMessage(this.currentid);
    },
    // 关闭Modal
    closeModal(type) {
      this.isdel = type;
      this.isshow = type;
    },
    checkSelectable(e) {
      if (e.isRead) {
        return false;
      } else {
        return true;
      }
    },
    isReadMessges() {
      if (this.SelectionList.length == 0) {
        this.$message.warning("至少选择一条消息");
        return;
      }
      let formdata = new FormData();
      formdata.append("id", this.SelectionList);
      this.readMessages(formdata);
    },
    handleSelectionChange(e) {
      let idarr = [];
      e.filter((item) => {
        idarr.push(item.id);
      });
      this.SelectionList = idarr;
    },
  },

  components: {
    Pagination,
    DelModal,
    Modal,
  },
};
</script>

<style lang="scss" scoped>
.filterstatus {
  padding: 30px 20px 0;
  box-sizing: border-box;
  background-color: #fff;
  font-family: Alibaba PuHuiTi;
  font-weight: 600;
  font-size: 14px;
  .status {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #f2f2f2;
    div {
      &:first-child {
        color: #333333;
        margin-right: 34px;
      }
      &:last-child {
        color: #999999;
        span {
          display: inline-block;
          padding: 0 15px;
          height: 32px;
          line-height: 32px;
          box-sizing: border-box;
          background: #fff;
          border-radius: 5px;
          margin-right: 10px;
          cursor: pointer;
          &:hover {
            color: #2c88f5;
          }
        }
        .bc {
          background-color: #f5f7fe;
          color: #2c88f5;
        }
      }
    }
  }
}
.statusbox {
  display: flex;
  align-items: center;
}
.tablebox {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>