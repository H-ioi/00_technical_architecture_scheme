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
      ref="modal"
      :dialogVisible="dialogVisible"
      :labelobj="labelobj"
      :ruleForm="ruleForm"
      @closeModal="closeModal"
      @playtype="playtype"
      :type="type"
      :contract_quota="contract_quota"
      :showquotas="showquotas"
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
import Modal from "../modal";
import { tableObj } from "@/const/tabledata/index";
import {
  fetchContractTemplate,
  putEditContractTemplate,
  putEnableContractTemplate,
  delContractTemplate,
  addContractTemplate,
  putDisableContractTemplate,
  fetchTypeList,
} from "@/api/base/index";
export default {
  name: "UniUiIndex",

  data() {
    return {
      tablestyle: tableObj,
      dialogVisible: false,
      delvisible: false,
      isdel: false,
      showquotas: true,
      currentid: "",
      type: "",
      ruleForm: {},
      contract_quota: [],
      tableTitle: [
        { prop: "name", label: "合同模板" },
        { prop: "quotalabel", label: "合同指标" },
        // { prop: "time", label: "配置时间" },
        // { prop: "tenantId", label: "配置人" },
        { prop: "status", label: "启用状态" },
      ],
      tableData: [],
      playBtn: ["编辑", "启用", "删除"],
      labelobj: {
        label: "合同模板",
        prop: "name",
        type: "contract_type",
      },
    };
  },
  created() {
    this.fetchtypelist();
    this.getcontractquota();
  },
  mounted() {},

  methods: {
    getcontractquota() {
      fetchTypeList("contract_quota").then((res) => {
        this.contract_quota = res.data.data;
        // this.$refs.modal.contract_quota = this.contract_quota;
      });
    },
    addtype(data) {
      addContractTemplate(data).then((res) => {
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.fetchtypelist();
      });
    },
    fetchtypelist() {
      fetchContractTemplate().then((res) => {
        let data = res.data.data;
        let arr = [];
        data.map((item) => {
          if (!item.archived) {
            arr.push(item);
          }
        });
        this.tableData = arr;
        this.tableData.map((item) => {
          let value = [];
          let label = [];
          if (item["quotas"] == null || item["quotas"] == undefined) return;
          item["quotas"].map((i) => {
            value.push(i.value);
            label.push(i.label);
          });
          item["quotastags"] = value;
          item["quotalabel"] = String(label);
        });
      });
    },
    putdisable() {
      putDisableContractTemplate(this.currentid).then((res) => {
        this.$message.success("已禁用");
        this.fetchtypelist();
      });
    },
    putenable() {
      putEnableContractTemplate(this.currentid).then((res) => {
        this.$message.success("已启用");
        this.fetchtypelist();
      });
    },
    putedit(obj) {
      putEditContractTemplate(obj).then((res) => {
        this.$message.success("已修改");
        this.fetchtypelist();
        this.dialogVisible = false;
      });
    },
    deltype() {
      delContractTemplate(this.currentid).then((res) => {
        this.$message.success("已删除");
        this.fetchtypelist();
        this.isdel = false;
      });
    },
    playtype(data) {
      if (this.type == "add") {
        this.addtype(data);
      } else {
        let obj = {
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
          this.ruleForm = { name: row.name, quotastags: row.quotastags };
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