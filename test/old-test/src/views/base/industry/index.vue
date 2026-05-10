<template>
  <div class="app-container calendar-list-container">
    <div class="industrybox">
      <el-button type="primary" @click="playindustry({}, 'add', 'top')"
        >新增顶级行业</el-button
      >
      <el-table
        @cell-click="cellclickcurrent"
        :data="tableData"
        style="width: 100%; margin-top: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="行业名称">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.children == undefined"
              content="点击展开行业"
              effect="dark"
              placement="top"
            >
              <span>{{ scope.row.name }}</span>
            </el-tooltip>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span> {{ scope.row.status ? "已启用" : "已禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="playindustry({}, 'add', scope.row.id, scope.row)"
              style="padding: 0"
              type="text"
              size="small"
            >
              新增
            </el-button>
            <el-button
              v-if="!scope.row.status"
              @click="enableIndustry(scope.row)"
              style="padding: 0"
              type="text"
              size="small"
            >
              启用
            </el-button>
            <el-button
              v-if="scope.row.status"
              @click="disableIndustry(scope.row)"
              style="padding: 0"
              type="text"
              size="small"
            >
              禁用
            </el-button>
            <el-button
              @click="playindustry(scope.row, 'detail', '')"
              style="padding: 0"
              type="text"
              size="small"
            >
              查看
            </el-button>
            <el-button
              @click="playindustry(scope.row, 'edit', scope.row.pid)"
              style="padding: 0"
              type="text"
              size="small"
            >
              修改
            </el-button>
            <!-- <el-popover :ref="scope.row.id" placement="top" width="160">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="text"
                  size="small"
                  @click="scope._self.$refs[scope.row.id].doClose()"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="delIndustry(scope.row)"
                  >确定</el-button
                >
              </div>
              <el-button
                type="text"
                size="small"
                slot="reference"
                @click="showpopover(scope.row.id, true)"
                >删除</el-button
              >
            </el-popover> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Modal
      ref="modal"
      @submitFormOk="submitFormOk"
      @closeModal="closeModal"
      :dialogVisible="dialogVisible"
      :type="type"
    />
  </div>
</template>

<script>
import {
  getIndustryTop,
  getIndustryChild,
  getIndustryDetail,
  enableIndustry,
  disableIndustry,
  delIndustry,
  addIndustry,
  editIndustry,
} from "@/api/industry/index";
import Modal from "./modal";
export default {
  name: "UniUiIndex",

  data() {
    return {
      visible: false,
      dialogVisible: false,
      type: "",
      pid: "",
      tableData: [],
    };
  },
  created() {
    this.getIndustryTop();
  },
  mounted() {},

  methods: {
    showpopover(id, data) {
      this.$refs[id]["showpopover"] = data;
    },
    getIndustryTop() {
      getIndustryTop().then((res) => {
        let data = res.data.data;
        this.tableData = data.filter((item) => {
          item = {
            ...item,
          };
          return !item.archived;
        });
        this.closeModal(false);
      });
    },
    addIndustry(data) {
      console.log("data", data);
      let obj = data;
      if (this.pid !== "top") {
        obj["pid"] = this.pid;
      }
      addIndustry(obj).then((res) => {
        console.log("res", res.data.data);
        this.$message.success("已新增");
        this.closeModal(false);
        if (this.pid !== "top") {
          this.getIndustryChild(this.pid);
        } else {
          this.getIndustryTop();
        }
      });
    },
    editIndustry(data) {
      editIndustry(data).then((res) => {
        this.$message.success("已修改");
        this.closeModal(false);
        this.getIndustryChild(this.pid);
      });
    },
    submitFormOk(data) {
      switch (this.type) {
        case "add":
          this.addIndustry(data);
          break;
        case "edit":
          this.editIndustry(data);
          break;
      }
    },
    delIndustry(row) {
      delIndustry(row.id).then((res) => {
        this.$message.success("已删除");
        if (row.id !== null) {
          this.getIndustryChild(row.pid);
        } else {
          this.getIndustryTop();
        }
      });
    },
    enableIndustry(row) {
      enableIndustry({ id: row.id }, row.id).then((res) => {
        this.$message.success("已启用");
        this.closeModal(false);
        if (row.id !== null) {
          this.getIndustryChild(row.pid);
        } else {
          this.getIndustryTop();
        }
      });
    },
    disableIndustry(row) {
      disableIndustry({ id: row.id }, row.id).then((res) => {
        this.$message.success("已禁用");
        this.closeModal(false);
        if (row.id !== null) {
          this.getIndustryChild(row.pid);
        } else {
          this.getIndustryTop();
        }
      });
    },
    getIndustryChild(id) {
      getIndustryChild(id).then((res) => {
        let data = res.data.data;
        this.setindustrychild(id, data, this.tableData);
      });
    },
    setindustrychild(id, data, tableData) {
      tableData.map((item, index) => {
        if (item.id == id) {
          this.$set(tableData, index, {
            ...item,
            children: data,
          });
          console.log("222tableData", this.tableData);
          if (data.length == 0) {
            this.$message.warning("该行业下无子集，请添加");
            return;
          }
        } else {
          if (item["children"] && item["children"].length !== 0) {
            this.setindustrychild(id, data, item["children"]);
          }
        }
      });
    },
    cellclickcurrent(row, column, cell, event) {
      console.log(999, row, column, cell, event);
      if (column.property == "name") {
        this.getIndustryChild(row.id);
      }
    },
    playindustry(item, type, pid) {
      this.type = type;
      this.pid = pid;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["modal"].ruleForm = item;
      });
    },
    closeModal(type) {
      this.dialogVisible = type;
    },
  },
  components: {
    Modal,
  },
};
</script>

<style lang="scss" scoped>
.industrybox {
  background-color: #fff;
  padding: 30px;
}
</style>