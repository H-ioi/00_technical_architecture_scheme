<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <!-- 表格 -->
      <div style="text-align: right">
        <el-button
          type="primary"
          size="medium"
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
            <div class="df_align_center table_textbtn">
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
            </div>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
    <!-- 编辑新增弹框 -->
    <Modal
      :dialogVisible="dialogVisible"
      :labelobj="labelobj"
      :ruleForm="ruleForm"
      @closeModal="closeModal"
      @playtype="playtype"
      :type="type"
      :showsort="true"
    />
    <!-- 删除弹框 -->
    <DelModal
      :showDelModal="showDelModal"
      @closeModal="closeModal"
      @handleOkDel="handleOkDel"
    />
  </div>
</template>
  
  <script>
import Modal from "./modal";
import DelModal from "@/components/common/DelModal";
import { tableObj } from "@/const/tabledata/index";
import {
  addType,
  fetchTypeList,
  putDisable,
  putEnable,
  putEdit,
  delType,
} from "@/api/base/index";
export default {
  name: "UniUiIndex",
  components: {
    Modal,
    DelModal,
  },
  props: {
    tableTitle: {
      require: true,
      type: Object,
    },
    labelobj: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      tablestyle: tableObj,
      dialogVisible: false,
      delvisible: false,
      showDelModal: false,
      currentid: "",
      type: "",
      ruleForm: {},
    //   tableTitle: [
    //     { prop: "label", label: "跟进方式" },
    //     { prop: "sort", label: "排序" },
    //     { prop: "status", label: "启用状态" },
    //   ],
      tableData: [],
      playBtn: ["编辑", "启用", "删除"],
    //   labelobj: {
    //     label: "跟进方式",
    //     prop: "label",
    //     type: "follow_type",
    //   },
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
      fetchTypeList(this.labelobj["type"]).then((res) => {
        let data = res.data.data;
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
        this.showDelModal = false;
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
    // 确认删除
    handleOkDel() {
      this.deltype();
    },
    // 关闭Modal
    closeModal(type) {
      this.dialogVisible = type;
      this.showDelModal = type;
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
          this.showDelModal = true;
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
};
</script>