<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <!-- 表格 -->
      <div class="topbtn">
        <el-button
          type="primary"
          @click="(dialogVisible = true), (type = 'add')"
          >新增</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="tablestyle.headercellstyle"
        :row-style="tablestyle.rowstyle"
      >
        <!-- <el-table-column
          type="selection"
          :selectable="checkSelectable"
          width="55"
        >
        </el-table-column> -->
        <el-table-column
          v-for="(item, index) in tableTitle"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span v-if="item.prop == 'status'">{{
              scope.row[item.prop] ? "已启用" : "已禁用"
            }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          :width="`${playBtn.length * 80}px`"
        >
          <template slot-scope="scope" class="df_center">
            <el-button
              v-for="(s, b) in playBtn"
              :key="b"
              style="padding: 0"
              @click.native.prevent="
                PlayCurrentItem(
                  s == '启用' ? (scope.row.status ? '禁用' : '启用') : s,
                  scope.row
                )
              "
              type="text"
              size="small"
            >
              <span v-if="s == '启用'">{{
                scope.row.status ? "禁用" : "启用"
              }}</span>
              <span v-else> {{ s }}</span>
            </el-button>
            <!-- <el-popover
              placement="top"
              width="160"
              trigger="click"
              v-model="delvisible"
            >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="delvisible = false"
                  >取消</el-button
                >
                <el-button
                  style="padding: 0"
                  type="primary"
                  size="mini"
                  @click="deltype(scope.row.id)"
                  >确定</el-button
                >
              </div>
              <el-button
                type="text"
                size="small"
                slot="reference"
                >删除</el-button
              >
            </el-popover> -->
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
    <Modal
      :dialogVisible="dialogVisible"
      :ruleForm="ruleForm"
      :title="'名片组'"
      @closeModal="closeModal"
      @playtype="playtype"
    />
    <el-dialog title="删除" :visible.sync="isdel" width="50%">
      <p>确认删除吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdel = false">取 消</el-button>
        <el-button type="primary" @click="delCardPage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Modal from "./modal";
import { tableObj } from "@/const/tabledata/index";
import {
  getCardGroup,
  addCardGroup,
  editCardGroup,
  delCardPage,
} from "@/api/card/group/index.js";

export default {
  name: "UniUiIndex",

  data() {
    return {
      tablestyle: tableObj,
      dialogVisible: false,
      delvisible: false,
      isdel: false,
      currentid: "",
      type: "",
      ruleForm: {},
      tableTitle: [
        { prop: "name", label: "名片组名称" },
        { prop: "sort", label: "排序" },
        { prop: "description", label: "描述" },
      ],
      tableData: [],
      playBtn: ["编辑", "删除"],
    };
  },
  created() {
    this.getCardGroup();
  },
  mounted() {},

  methods: {
    addCardGroup(data) {
      addCardGroup(data).then((res) => {
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.getCardGroup();
      });
    },
    getCardGroup() {
      getCardGroup().then((res) => {
        let data = res.data.data.records;
        this.tableData = data;
      });
    },
    delCardPage() {
      delCardPage({ id: [this.currentid] }).then((res) => {
        this.$message.success("已删除");
        this.getCardGroup();
        this.isdel = false;
      });
    },
    editCardGroup(data) {
      editCardGroup(data).then((res) => {
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.getCardGroup();
      });
    },
    playtype(data) {
      if (this.type == "add") {
        this.addCardGroup(data);
      } else {
        let obj = {
          ...data,
          id: this.currentid,
        };
        this.editCardGroup(obj);
      }
    },
    // 关闭Modal
    closeModal(type) {
      this.dialogVisible = type;
    },

    checkSelectable(e) {
      return true;
    },
    PlayCurrentItem(s, row) {
      console.log("666", s, row);
      this.currentid = row.id;
      switch (s) {
        case "编辑":
          this.type = "edit";
          this.ruleForm = row;
          this.dialogVisible = true;
          break;
        case "删除":
          this.isdel = true;
          break;
        case "启用":
          this.putenable();
          break;
        case "禁用":
          this.putdisable();
          break;
      }
    },
  },
  components: {
    Modal,
  },
};
</script>

<style lang="scss" scoped>
.topbtn {
  text-align: right;
  .el-button {
    width: 120px;
    height: 40px;
    font-size: 16px;
  }
}
</style>