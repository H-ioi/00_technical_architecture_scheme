<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <!-- 表格 -->
      <div class="topbtn">
        <el-button
          type="primary"
          @click="(dialogVisible = true), (type = 'add'), (ruleForm = {})"
          >新增</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="tablestyle.headercellstyle"
        :row-style="tablestyle.rowstyle"
      >
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
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
    <Modal
      :dialogVisible="dialogVisible"
      :ruleForm="ruleForm"
      :title="'内容目标区域'"
      @closeModal="closeModal"
      @playtype="playtype"
    />
    <el-dialog title="删除" :visible.sync="isdel" width="50%">
      <p>确认删除吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdel = false">取 消</el-button>
        <el-button type="primary" @click="deltype">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Modal from "./modal";
import { tableObj } from "@/const/tabledata/index";
import {
  addType,
  fetchTypeList,
  putDisable,
  putEnable,
  putEdit,
  delType,
} from "@/api/card/content/list.js";
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
        { prop: "label", label: "内容目标区域" },
        { prop: "sort", label: "排序" },
        { prop: "description", label: "描述" },
      ],
      tableData: [],
      playBtn: ["编辑", "启用", "删除"],
      contentType: "content_demand_region",
    };
  },
  created() {
    this.fetchtypelist();
  },
  mounted() {},

  methods: {
    addtype(data) {
      addType(data).then((res) => {
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.fetchtypelist();
      });
    },
    fetchtypelist() {
      fetchTypeList(this.contentType).then((res) => {
        console.log("res.data", res.data);
        let data = res.data.data;
        if (data == null) return;
        let arr = [];
        data.map((item) => {
          if (!item.archived) {
            arr.push(item);
          }
        });
        this.tableData = arr;
      });
    },
    putdisable() {
      putDisable(this.currentid).then((res) => {
        this.$message.success("已禁用");
        this.fetchtypelist();
      });
    },
    putenable() {
      putEnable(this.currentid).then((res) => {
        this.$message.success("已启用");
        this.fetchtypelist();
      });
    },
    putedit(obj) {
      putEdit(obj).then((res) => {
        this.$message.success("已修改");
        this.fetchtypelist();
        this.dialogVisible = false;
      });
    },
    deltype() {
      delType(this.currentid).then((res) => {
        this.$message.success("已删除");
        this.fetchtypelist();
        this.isdel = false;
      });
    },
    playtype(data) {
      let obj = {
        ...data,
        type: this.contentType,
      };
      if (this.type == "add") {
        this.addtype(obj);
      } else {
        obj = {
          ...data,
          id: this.currentid,
        };
        this.putedit(obj);
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