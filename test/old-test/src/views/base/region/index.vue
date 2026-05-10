<template>
  <div class="app-container calendar-list-container">
    <div class="industrybox">
      <el-button type="primary" @click="playregion({}, 'add', 'top', 1)"
        >新增区域</el-button
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
        <el-table-column prop="name" label="区域">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.children == undefined"
              content="点击展开"
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
              @click="playregion({}, 'add', scope.row.id, scope.row.level)"
              style="padding: 0"
              type="text"
              size="small"
            >
              新增
            </el-button>
            <el-button
              v-if="!scope.row.status"
              @click="enableRegion(scope.row)"
              style="padding: 0"
              type="text"
              size="small"
            >
              启用
            </el-button>
            <el-button
              v-if="scope.row.status"
              @click="disableRegion(scope.row)"
              style="padding: 0"
              type="text"
              size="small"
            >
              禁用
            </el-button>
            <el-button
              @click="playregion(scope.row, 'detail', '', '')"
              style="padding: 0"
              type="text"
              size="small"
            >
              查看
            </el-button>
            <el-button
              @click="
                playregion(scope.row, 'edit', scope.row.id, scope.row.level)
              "
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
                  @click="delRegion(scope.row.id)"
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
  getProvince,
  getRegionChild,
  getRegionList,
  getRegionDetail,
  enableRegion,
  disableRegion,
  delRegion,
  addRegion,
  editRegion,
} from "@/api/region/index";
import Modal from "./modal";
export default {
  name: "UniUiIndex",

  data() {
    return {
      dialogVisible: false,
      type: "",
      pid: "",
      level: "",
      tableData: [],
    };
  },
  created() {
    this.getProvince();
  },
  mounted() {},

  methods: {
    submitFormOk(data) {
      switch (this.type) {
        case "add":
          this.addRegion(data);
          break;
        case "edit":
          this.editRegion(data);
          break;
      }
    },
    showpopover(id, data) {
      this.$refs[id]["showpopover"] = data;
    },
    getProvince() {
      getProvince().then((res) => {
        let data = res.data.data;
        this.tableData = data.filter((item) => {
          item = {
            ...item,
            children: [1],
          };
          return !item.archived;
        });
        this.closeModal(false);
      });
    },
    addRegion(data) {
      let obj = data;
      obj["level"] = this.level;
      if (this.pid !== "top") {
        obj["pid"] = this.pid;
      }
      addRegion(obj).then((res) => {
        console.log("res", res.data.data);
        this.$message.success("已新增");
        this.closeModal(false);
        if (this.pid !== "top") {
          this.getRegionChild(this.pid);
        } else {
          this.getProvince();
        }
      });
    },
    editRegion(data) {
      editRegion(data).then((res) => {
        this.$message.success("已修改");
        this.closeModal(false);
        if (data.pid !== null) {
          this.getRegionChild(data.pid);
        } else {
          this.getProvince();
        }
      });
    },
    delRegion(id) {
      delRegion(id).then((res) => {
        this.$message.success("已删除");
        this.getProvince();
      });
    },
    enableRegion(row) {
      enableRegion({ id: row.id }, row.id).then((res) => {
        this.$message.success("已启用");
        if (row.pid !== null) {
          this.getRegionChild(row.pid);
        } else {
          this.getProvince();
        }
      });
    },
    disableRegion(row) {
      disableRegion({ id: row.id }, row.id).then((res) => {
        this.$message.success("已禁用");
        if (row.pid !== null) {
          this.getRegionChild(row.pid);
        } else {
          this.getProvince();
        }
      });
    },
    getRegionChild(id) {
      getRegionChild(id).then((res) => {
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
        this.getRegionChild(row.id);
      }
    },
    playregion(item, type, pid, level) {
      this.type = type;
      this.pid = pid;
      this.level = level;
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