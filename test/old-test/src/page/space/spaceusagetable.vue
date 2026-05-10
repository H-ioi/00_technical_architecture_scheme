<template>
  <div>
    <div class="detail_item">
      <div class="detail_item_title df_sb" style="border-bottom: none">
        <span>使用时间看板</span>
        <el-button
          v-if="permissions['space_usage_add']"
          type="primary"
          size="mini"
          @click="changeUsage('add')"
          >新建</el-button
        >
      </div>
    </div>
    <Table
      ref="Table"
      :showSelection="false"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :tableBtn="tableBtn"
      @playTab="playTab"
    />
    <Spaceusage
      ref="spaceusage"
      :showSpaceusage="showSpaceusage"
      :spaceusageType="spaceusageType"
      @changeModal="changeModal"
      @refreshData="refreshData"
      @delSpaceUsage="delSpaceUsage"
      @editUse="editUse"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Spaceusage from "./modal/spaceusage";
import Table from "@/components/common/Table.vue";
import {
  getSpaceUsageList,
  addUsageSpace,
  putSpaceUsage,
  delSpaceUsage,
} from "@/api/space/spaceusage.js";
export default {
  components: {
    Table,
    Spaceusage,
  },
  props: {
    permissions: Object,
  },
  data() {
    return {
      // 使用类型
      showSpaceusage: false,
      spaceusageType: "",
      // 使用信息
      // 表格
      tableTitle: [
        { label: "使用人", prop: "username", width: "" },
        { label: "联系方式", prop: "phone", width: "" },
        { label: "开始时间", prop: "startTime", width: "" },
        { label: "结束时间", prop: "endTime", width: "" },
        { label: "备注信息", prop: "remark", width: "" },
        { label: "填写人", prop: "enterUserName", width: "" },
      ],
      tableData: [],
      tableBtn: [
        {
          name: "编辑",
          type: "edit",
          permissions: "space_usage_edit",
          color: "",
        },
        {
          name: "删除",
          type: "delete",
          permissions: "space_usage_del",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
      ],
    };
  },
  created() {
    this.getSpaceUsageList();
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
  },
  computed: {
    ...mapGetters(["userList", "userInfo"]),
  },
  methods: {
    // 使用信息
    getSpaceUsageList() {
      getSpaceUsageList(this.$route.query.id).then((res) => {
        if (res.data.success) {
          console.log("res", res);
          let data = res.data.data;
          this.tableData = data;
          this.tableData.map((item) => {
            this.userList.map((i) => {
              if (item.enterUserId == i.value) {
                item["enterUserName"] = i.label;
              }
            });
          });
        }
      });
    },
    delSpaceUsages(id) {
      delSpaceUsage(id).then((res) => {
        this.$message.success("已删除");
        this.getSpaceUsageList();
      });
    },
    playTab(name, item, scope) {
      switch (name) {
        case "delete":
          this.delSpaceUsages(item.id);
          break;
        case "look":
          this.changeUsage("look");
          this.setFormData(item);
          break;
        case "edit":
          this.changeUsage("edit");
          this.setFormData(item);
          break;
      }
    },
    refreshData() {
      this.getSpaceUsageList();
    },
    changeUsage(type) {
      this.showSpaceusage = true;
      this.spaceusageType = type;
    },
    changeModal(type) {
      this.showSpaceusage = type;
    },
    setFormData(item) {
      this.$nextTick(() => {
        this.$refs["spaceusage"].ruleForm = {
          ...item,
          time: "00:00", //无用的
        };
      });
    },
    // 删除预定
    delSpaceUsage(id) {
      this.showSpaceusage = false;
      this.getSpaceUsageList();
    },
    editUse() {
      this.spaceusageType = "edit";
    },
  },
};
</script>