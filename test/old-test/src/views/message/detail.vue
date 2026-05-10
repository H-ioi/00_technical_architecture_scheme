<template>
  <div class="main-content">
    <div class="messagedetail">
      <div class="title_text">消息详情</div>
      <div class="df_sb detailtop">
        <div class="detailinfo df_sb">
          <div style="color: #333333">
            {{ "标题：" + messagetitle }}
          </div>
          <div v-if="auditmessage.deadlineTime !== undefined">
            {{ "延期到：" + auditmessage.deadlineTime }}
          </div>
          <div v-if="auditmessage.reason !== undefined">
            {{ "延期原因：" + auditmessage.reason }}
          </div>
        </div>
        <div class="attachment" v-if="filelist.length !== 0">
          <span style="color: #333333">附件</span>
          <div style="display: flex">
            <div
              style="text-align: center; margin-right: 20px; cursor: pointer"
              :key="index"
              v-for="(item, index) in filelist"
            >
              <img width="38px" src="/menu_icon/图片.png" alt="" />
              <div style="font-size: 14px; color: #2c88f5">
                {{ item.originalName }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div v-if="!auditstatus">
            <el-button
              :style="btnstyle"
              @click="(showresult = true), (aduittype = 0)"
              >拒绝</el-button
            >
            <el-button
              type="primary"
              :style="btnstyle"
              @click="(showresult = true), (aduittype = 1)"
              >同意</el-button
            >
          </div>
          <div v-if="auditstatus == 2" class="text" style="color: #fe5b77">
            <i class="el-icon-circle-close"></i>不同意
          </div>
          <div v-if="auditstatus == 1" class="text" style="color: #2c88f5">
            <i class="el-icon-circle-check"></i>已同意
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="tablebox">
      <div class="title_text">{{ type[this.code] }}</div>
      <!-- <el-table
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
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :key="index"
          v-for="(item, index) in tabletitle"
        >
        </el-table-column>
      </el-table> -->
      <!-- <Pagination ref="Pagination" /> -->
      <TableBox
        :tableObj="tableObj[tabletype[code]]"
        :tableData="tableData"
        @playCurrentItem="playCurrentItem"
      />
    </div>
    <Result
      @closeModal="closeModal"
      :showresult="showresult"
      @changemessage="changemessage"
    />
  </div>
</template>

<script>
import {
  getMessageDetail,
  getAuditDetail,
  getExtension,
  passExtension,
  rejectExtension,
  passClaim,
  rejectClaim,
  passClose,
  rejectClose,
} from "@/api/message/index.js";
import { GetCurrentClue } from "@/api/clue/index";
import { getOpportunityDetail } from "@/api/opportunity/index";
import { getFiles } from "@/api/upload/index.js";
import Result from "./result.vue";
import { tableObj } from "@/const/tabledata/index";
import TableBox from "@/components/commonConpents/TableBox";
export default {
  name: "UniUiIndex",

  data() {
    return {
      status: 0,
      auditstatus: 0,
      code: "",
      auditmessage: {},
      messagetitle: "",
      auditId: "",
      filelist: [],
      showresult: false,
      aduittype: "",
      tableObj: tableObj,
      tableData: [],
      btnstyle: "width:200px;height:50px;font-size:20px",
      type: {
        opportunity_extension: "申请延期商机",
        clue_claim: "申请线索认领",
        clue_close: "申请线索关闭",
      },
      tabletype: {
        opportunity_extension: "opportunity_look",
        clue_claim: "cluelist_look",
        clue_close: "cluelist_look",
      },
    };
  },
  created() {
    this.getMessageDetail();
  },
  mounted() {},

  methods: {
    getMessageDetail() {
      getMessageDetail(this.$route.query.id).then((res) => {
        console.log("res", res.data.data);
        let { auditId, title } = res.data.data;
        this.messagetitle = title;
        this.auditId = auditId;
        if (auditId !== null && auditId !== undefined) {
          this.getAuditDetail(auditId);
        }
      });
    },
    getAuditDetail(id) {
      getAuditDetail(id).then((res) => {
        console.log("res", res.data.data);
        let { status, code, outerId } = res.data.data;
        this.code = code;
        this.auditstatus = status;
        switch (code) {
          case "opportunity_extension":
            this.getOpportunityDetail(outerId);
            break;
          case "clue_claim":
            this.getCurrentClue(outerId);
            break;
          case "clue_close":
            this.getCurrentClue(outerId);
            break;
        }
        if (code == "opportunity_extension") {
          this.getExtension(outerId);
        }
      });
    },
    getCurrentClue(id) {
      GetCurrentClue(id).then((res) => {
        let data = res.data.data;
        this.tableData = [data];
      });
    },
    getOpportunityDetail(id) {
      getOpportunityDetail(id).then((res) => {
        let data = res.data.data;
        this.tableData = [data];
      });
    },
    getExtension(id) {
      getExtension(id).then((res) => {
        let data = res.data.data;
        this.auditmessage = data;
        if (data.fileId !== null && data.fileId !== undefined) {
          this.getFiles({ ids: [data.fileId] });
        }
      });
    },
    getFiles(data) {
      getFiles(data).then((res) => {
        let data = res.data.data;
        console.log("data", data);
        this.filelist = data;
      });
    },
    passExtension(data) {
      passExtension(data).then((res) => {
        this.getMessageDetail();
      });
    },
    rejectExtension(data) {
      rejectExtension(data).then((res) => {
        this.getMessageDetail();
      });
    },
    passClaim(data) {
      passClaim(data).then((res) => {
        this.getMessageDetail();
      });
    },
    rejectClaim(data) {
      rejectClaim(data).then((res) => {
        this.getMessageDetail();
      });
    },
    passClose(data) {
      passClose(data).then((res) => {
        this.getMessageDetail();
      });
    },
    rejectClose(data) {
      rejectClose(data).then((res) => {
        this.getMessageDetail();
      });
    },
    changemessage(data) {
      // let obj = {
      //   auditId: this.auditId,
      //   ...data,
      // };
      let obj = new FormData();
      obj.append("auditId", this.auditId);
      obj.append("result", data["result"]);
      this.showresult = false;
      switch (this.code) {
        case "opportunity_extension":
          if (this.aduittype) {
            this.passExtension(obj);
          } else {
            this.rejectExtension(obj);
          }
          break;
        case "clue_claim":
          if (this.aduittype) {
            this.passClaim(obj);
          } else {
            this.rejectClaim(obj);
          }
          break;
        case "clue_close":
          if (this.aduittype) {
            this.passClose(obj);
          } else {
            this.rejectClose(obj);
          }
          break;
      }
    },
    playCurrentItem(type, item, data) {
      switch (this.code) {
        case "opportunity_extension":
          this.$router.push({
            path: "/opportunity/my/detail",
            query: {
              id: data.id,
            },
          });
          break;
        case "clue_claim":
          this.$router.push({
            path: "/clue/my/index/detail",
            query: {
              id: data.id,
            },
          });
          break;
        case "clue_close":
          this.$router.push({
            path: "/opportunity/my/detail",
            query: {
              id: data.id,
            },
          });
          break;
      }
    },
    closeModal(type) {
      this.showresult = type;
    },
  },
  components: {
    Result,
    TableBox,
  },
};
</script>

<style lang="scss" scoped>
.messagedetail {
  padding: 30px 20px;
  box-sizing: border-box;
  background-color: #fff;

  .detailtop {
    font-size: 16px;
    font-family: Alibaba PuHuiTi;
    font-weight: 600;
    color: #999999;
    padding: 0 20px;
    box-sizing: border-box;
    align-items: flex-start;
    .detailinfo {
      height: 65px;
      flex-direction: column;
      align-items: flex-start;
    }
    .attachment {
      flex: 1;
      margin-left: 134px;
      display: flex;
      align-items: flex-start;
      span {
        margin-right: 20px;
      }
    }
  }
}
.tablebox {
  margin-top: 30px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.text {
  font-family: Alibaba PuHuiTi;
  font-size: 20px;
  font-weight: 600;
  i {
    margin-right: 10px;
  }
}
.tableStyle {
  padding: 0 !important;
}
</style>