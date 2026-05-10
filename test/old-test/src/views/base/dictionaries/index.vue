<template>
  <div>
    <div class="f_sb">
      <div class="treeBox">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          accordion
          :highlight-current="true"
          node-key="key"
          :current-node-key="currentNodekey"
          @node-click="handleNodeClick"
          :default-expanded-keys="defaultExpandedKeys"
        >
        </el-tree>
      </div>
      <div class="treeTable">
        <!-- 表格 -->
        <div class="topbtn">
          <el-button
            type="primary"
            @click="
              (dialogVisible = true),
                (type = 'add'),
                (ruleForm = { label: '', sort: '' })
            "
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
      </div>
    </div>
    <el-dialog
      :title="type == 'edit' ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="closeModal"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item label="名称" style="width: 60%" prop="label">
              <el-input v-model="ruleForm['label']"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 60%" prop="label">
              <el-input v-model="ruleForm['sort']"></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="mini"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="defult" size="mini" @click="closeModal"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="isdel" width="50%">
      <p>确认删除吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdel = false">取 消</el-button>
        <el-button type="primary" @click="deltype">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="附加属性"
      :visible.sync="showAttribute"
      width="50%"
      :before-close="closeModal"
    >
      <el-table
        v-if="showAttribute"
        :data="attributeTableData"
        style="width: 100%"
        :header-cell-style="tablestyle.headercellstyle"
        :row-style="tablestyle.rowstyle"
      >
        <el-table-column prop="dictItemLabel" label="名称"> </el-table-column>
        <el-table-column prop="dictItemType" label="属性"> </el-table-column>
        <el-table-column prop="dictItemValue" label="属性值">
          <template slot-scope="scope">
            <span v-if="!scope.row.isedit">{{ scope.row.dictItemValue }}</span>
            <el-input
              v-else
              v-model="scope.row.dictItemValue"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80px">
          <template slot-scope="scope" class="df_center">
            <el-button
              style="padding: 0"
              @click.native.prevent="editCurrentItem(scope)"
              type="text"
              size="small"
            >
              <span>{{ !scope.row.isedit ? "编辑" : "保存" }}</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictTree,
  addType,
  putDisable,
  putEnable,
  putEdit,
  delType,
  getDictFieldAll,
  postDictField
} from "@/api/workorder/order/orderlist.js";
import { getPublikTypeList } from "@/api/publik";
import { tableObj } from "@/const/tabledata/index";
import Modal from "../modal";
export default {
  name: "UniUiIndex",
  components: {
    Modal
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      tablestyle: tableObj,
      tableTitle: [
        { prop: "name", label: "类型" },
        { prop: "sort", label: "排序" },
        { prop: "status", label: "启用状态" }
      ],
      tableData: [],
      currentTitle: "",
      currentPid: "",
      typeObj: {},
      playBtn: ["编辑", "启用", "附加属性", "删除"],
      defaultExpandedKeys: [],
      dialogVisible: false,
      delvisible: false,
      isdel: false,
      showAttribute: false,
      type: "",
      showremark: true,
      ruleForm: { label: "", sort: "" },
      rules: {},
      firstCreate: true,
      currentTypes: {},
      currentNodekey: "",
      attributeTableData: [],
      contentLabel: ""
    };
  },
  created() {
    this.getDictTree();
  },
  mounted() {},
  watch: {
    currentNodekey() {
      this.setCurrentNodeKey();
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          let data = {
            ...this.typeObj,
            ...this.ruleForm
          };
          console.log("data", data);
          if (this.type == "edit") {
            this.putedit(data);
          } else {
            if (data["pid"] == "top") {
              this.firstCreate = true;
              delete data["pid"];
            }
            this.addType(data);
          }
        } else {
          return false;
        }
      });
    },
    getDictTree() {
      getDictTree().then(res => {
        let data = res.data.data;
        data[0]["id"] = "top";
        this.setTreeNodekey(data, 1);
        data[0].child.map(res => {
          // res["id"] = `pid${res.id}`;
          res["isAdd"] = true;
          this.defaultExpandedKeys.push(res.key);
        });

        if (this.firstCreate) {
          this.currentNodekey = data[0]["key"];
          console.log("this.currentNodekey", this.currentNodekey);
          this.setData(data[0]);
          this.firstCreate = false;
        }
        this.treeData = data;
        this.setCurrentNodeKey();
        console.log("this.treeData", this.treeData);
      });
    },
    // 给树形结构设置虚拟节点
    setTreeNodekey(data, leave) {
      data.map((i, k) => {
        i["key"] = leave + "." + k;
        if (i.child.length > 0) {
          this.setTreeNodekey(i.child, i["key"]);
        }
      });
    },
    getPublikTypeList(data) {
      getPublikTypeList(data).then(res => {
        console.log("getPublikTypeList", res);
        let typesData = res.data.data;
        let type = data.types[0];
        if (typesData[type]) {
          let arr = [];
          typesData[type].map(i => {
            if (i["archived"] === 0) {
              i["name"] = i["label"];
              arr.push(i);
            }
          });
          this.tableData = arr;
        } else {
          this.tableData = [];
        }
      });
    },
    getDictFieldAll() {
      getDictFieldAll(this.currentid).then(res => {
        console.log("res", res);
        let data = res.data.data;
        if (data.length > 0) {
          data.map(res => {
            res["isedit"] = false;
          });
          this.attributeTableData = data;
        } else {
          let obj = {
            dictItemLabel: this.contentLabel,
            dictItemType: "en_US",
            dictItemValue: "",
            isedit: false
          };
          this.attributeTableData[0] = obj;
        }
        this.showAttribute = true;
      });
    },
    postDictField(data) {
      postDictField(data).then(res => {
        console.log("res", res);
        this.$message.success("保存成功");
        this.getDictFieldAll();
      });
    },
    addType(data) {
      addType(data).then(res => {
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.getDictTree();
        this.getPublikTypeList(this.currentTypes);
      });
    },

    putdisable() {
      putDisable(this.currentid).then(res => {
        this.$message.success("已禁用");
        this.getDictTree();
        this.getPublikTypeList(this.currentTypes);
      });
    },
    putenable() {
      putEnable(this.currentid).then(res => {
        this.$message.success("已启用");
        this.getDictTree();
        this.getPublikTypeList(this.currentTypes);
      });
    },
    putedit(obj) {
      putEdit(obj).then(res => {
        this.$message.success("已修改");
        this.dialogVisible = false;
        this.getDictTree();
        this.getPublikTypeList(this.currentTypes);
      });
    },
    deltype() {
      delType(this.currentid).then(res => {
        this.$message.success("已删除");
        this.isdel = false;
        this.getDictTree();
        this.getPublikTypeList(this.currentTypes);
      });
    },
    PlayCurrentItem(s, row) {
      console.log("666", s, row);
      this.currentid = row.id;
      this.typeObj = {
        pid: row.pid,
        type: row.type,
        id: row.id,
        sort: row.sort == null ? "" : row.sort
      };
      if (row.type == "order_school") {
        this.firstCreate = true;
      }
      this.contentLabel = row.name;
      switch (s) {
        case "编辑":
          this.type = "edit";
          this.dialogVisible = true;
          this.ruleForm["label"] = row.name;
          this.ruleForm["sort"] = row.sort;
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
        case "附加属性":
          this.getDictFieldAll();
          break;
      }
    },
    handleNodeClick(data) {
      console.log(data);
      this.defaultExpandedKeys.push(data.key);
      console.log("this.currentNodekey", this.currentNodekey);
      this.currentNodekey = data["key"];
      if (data["isAdd"]) return;
      this.setData(data);
    },
    setDefaultExpandedKeys() {
      // 获取树形组件实例
      let treeCompInstance = this.$refs["tree"];
      let allNodes = treeCompInstance.store._getAllNodes();
      let defaultExpandedNodes = [];
      allNodes.forEach(node => {
        node.expanded && defaultExpandedNodes.push(node.data.id);
      });
      // console.log('defaultExpandedNodes', defaultExpandedNodes);
      this.defaultExpandedKeys = defaultExpandedNodes;
    },
    setData(data) {
      console.log("data", data);
      this.typeObj = {
        pid: data.id,
        type: data.type
      };
      this.currentTitle = data.name;
      if (!data["isAdd"] && data["id"] !== "top") {
        this.currentTypes = { types: [data.type], pid: data.id };
        this.getPublikTypeList(this.currentTypes);
      } else {
        this.currentTypes = {};
        this.tableData = data.child;
      }
      console.log("this.tableData", this.tableData);
    },
    setCurrentNodeKey() {
      this.$nextTick(() => {
        this.$refs["tree"].setCurrentKey(this.currentNodekey);
      });
    },
    closeModal() {
      this.dialogVisible = false;
      this.isdel = false;
      this.showAttribute = false;
    },
    editCurrentItem({ $index, row }) {
      console.log("row", $index, row);
      if (!row.isedit) {
        this.$set(this.attributeTableData, $index, {
          ...this.attributeTableData[$index],
          isedit: true
        });
      } else {
        // this.$set(this.attributeTableData, $index, {
        //   ...this.attributeTableData[$index],
        //   isedit: false,
        // });
        console.log("this.typeObj", this.typeObj, this.currentid);
        let obj = {
          dictItemId: this.currentid,
          type: row.dictItemType,
          value: row.dictItemValue
        };
        this.postDictField(obj);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.treeBox {
  width: 30%;
  background-color: #fff;
  padding: 20px;
}
.treeTable {
  flex: 1;
  background-color: #fff;
  padding: 20px;
}
.topbtn {
  text-align: right;
  margin-bottom: 20px;
  .el-button {
    width: 120px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
