<template>
  <div class="main-content">
    <Playbtn :playbtn="playbtn" @playBtn="playBtn" />
    <div class="tabbox">
      <Table
        @playtab="playtab"
        :tabletitle="tabletitle"
        :tableData="tableData"
        :tabbtn="tabbtn"
      />
    </div>
    <Modal
      ref="infomodal"
      :modaltype="modaltype"
      :dialogVisible="dialogVisible"
      @changeModal="changeModal"
      @submitForm="submitForm"
    />
  </div>
</template>

<script>
import Playbtn from "@/components/conpents_card/Playbtn.vue";
import Table from "./Table.vue";
import Modal from "./modal.vue";
import {
  getMessage,
  addMessageNotice,
  getMessageDetail,
  updateMessageNotice,
  delMessage,
} from "@/api/admin/message.js";
export default {
  name: "UniUiIndex",

  data() {
    return {
      pagination: {
        size: 10,
        current: 1,
        type: 4,
      },
      dialogVisible: false,
      modaltype: "add",
      playbtn: [{ name: "新增通知", type: "" }],
      tabletitle: [
        // { label: "创建时间", prop: "createTime" },
        { label: "发送时间", prop: "sendTime" },
        { label: "发送状态", prop: "status" },
        { label: "创建人", prop: "createUser" },
        { label: "通知名称", prop: "title" },
        { label: "通知内容", prop: "details" },
        { label: "发送对象", prop: "sendBy" },
      ],
      tableData: [],
      tabbtn: [
        { name: "查看", type: "", icon: "el-icon-view" },
        { name: "编辑", type: "", icon: "el-icon-edit-outline" },
        { name: "删除", type: "", icon: "el-icon-delete" },
      ],
    };
  },
  created() {
    this.getMessage(this.pagination);
  },
  mounted() {},

  methods: {
    getMessage(data) {
      getMessage(data).then((res) => {
        console.log("res", res);
        let { records } = res.data.data;
        this.tableData = records;
        this.tableData.map((item) => {
          item["status"] = item["status"] ? "已发送" : "待发送";
          item["createTime"] = item["createTime"].substring(0, 10);
          item["sendBy"] =
            item["sendBy"] === 1
              ? "后台用户"
              : item["sendBy"] === 2
              ? "小程序"
              : "--";
        });
      });
    },
    addMessageNotice(data) {
      let obj = {
        ...data,
        type: 4,
      };
      addMessageNotice(obj).then((res) => {
        console.log("新增", res);
        this.changeModal(false);
        this.$message.success("新增成功");
        this.getMessage(this.pagination);
      });
    },
    updateMessageNotice(data) {
      updateMessageNotice(data).then((res) => {
        this.changeModal(false);
        this.$message.success("已修改");
        this.getMessage(this.pagination);
      });
    },
    delMessage(id) {
      delMessage(id).then((res) => {
        this.$message.success("已删除");
        this.getMessage(this.pagination);
      });
    },
    getMessageDetail(id, type) {
      console.log(1111);
      getMessageDetail(id).then((res) => {
        this.setmodaldata(true, type);
        let data = res.data.data;
        this.$nextTick(() => {
          this.$refs["infomodal"].ruleForm = data;
          this.$refs["infomodal"].getfilelist(id);
          if (data.user !== null) {
            setTimeout(() => {
              this.$refs["infomodal"].$refs["usertree"].getUserlist({
                ids: data.user,
              });
            }, 1000);
          }
        });
      });
    },
    playBtn(name) {
      console.log("name", name);
      switch (name) {
        case "新增通知":
          this.setmodaldata(true, "add");
          break;
      }
    },
    playtab(name, item) {
      console.log(9999, name, item);
      switch (name) {
        case "查看":
          this.getMessageDetail(item.id, "look");
          break;
        case "编辑":
          this.getMessageDetail(item.id, "edit");
          break;
        case "删除":
          this.delMessage(item.id);
          break;
      }
    },
    submitForm(data) {
      console.log("this.modaltype", this.modaltype);
      switch (this.modaltype) {
        case "add":
          this.addMessageNotice(data);
          break;
        case "edit":
          this.updateMessageNotice(data);
          break;
      }
    },
    setmodaldata(show, type) {
      this.dialogVisible = show;
      this.modaltype = type;
    },
    changeModal(type) {
      if (!type) {
        this.$refs["infomodal"].ruleForm = {};
      }

      this.dialogVisible = type;
    },
  },
  components: {
    Table,
    Modal,
    Playbtn,
  },
};
</script>

<style lang="scss" scoped>
</style>