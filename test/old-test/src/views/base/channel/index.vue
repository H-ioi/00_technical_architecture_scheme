<template>
  <div>
    <div class="f_sb">
      <div class="treeBox">
        <el-tree
          ref="tree"
          accordion
          default-expand-all
          :expand-on-click-node="false"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          node-key="id"
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
    <el-dialog
      title="删除"
      :visible.sync="isdel"
      width="50%"
      :close-on-click-modal="false"
    >
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
      :close-on-click-modal="false"
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
  addType,
  putDisable,
  putEnable,
  putEdit,
  delType,
  getDictFieldAll,
  postDictField,
  fetchTypeList
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
      treeData: [
        {
          child: [],
          id: "-1",
          label: "渠道配置",
          pid: null,
          sort: null,
          status: null,
          childType: "enquiry_channel",
          level: 0,
          value: null
        }
      ],
      defaultProps: {
        children: "child",
        label: "label"
      },
      tablestyle: tableObj,
      tableTitle: [
        { prop: "label", label: "类型" },
        { prop: "sort", label: "排序" },
        { prop: "status", label: "启用状态" }
      ],
      tableData: [],
      currentTitle: "",
      currentPid: "",
      typeObj: {},
      playBtn: ["编辑", "启用", "附加属性", "删除"],
      defaultExpandedKeys: ["-1"],
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
      currentNodeData: {},
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
          if (this.currentNodeData["id"] == "-1") {
            delete data["pid"];
          } else {
            data["pid"] = this.currentNodeData["id"];
          }
          if (this.type == "edit") {
            this.putedit(data);
          } else {
            data["type"] = this.currentNodeData["childType"];
            this.addType(data);
          }
          console.log("data", data);
        } else {
          return false;
        }
      });
    },
    async getDictTree() {
      console.log("getDictTree", 111111111);
      // 获取一级渠道基础表
      let topChannel = await this.fetchtypelist("enquiry_channel");
      console.log("topChannel", topChannel);
      let channelChildOne = [];
      topChannel.map(item => {
        this.defaultExpandedKeys.push(item.id);
        item["childType"] = "enquiry_channel_child_one";
        item["level"] = 1;
        this.currentTypes = {
          types: ["enquiry_channel_child_one"],
          pid: item.id
        };
        channelChildOne.push(this.getPublikTypeList(this.currentTypes));
      });
      Promise.all(channelChildOne).then(childOne => {
        console.log("childOne", childOne);
        topChannel.map(item => {
          childOne.map(one => {
            if (one[item.id]) {
              item["child"] = one[item.id];
            }
          });
        });
        this.$set(this.treeData, 0, {
          ...this.treeData[0],
          child: topChannel
        });
        if (this.firstCreate) {
          this.defaultExpandedKeys = ["-1"];
          this.currentNodekey = "-1";
          this.currentNodeData = this.treeData[0];
          this.tableData = topChannel;
        } else {
          this.$nextTick(() => {
            this.handleNodeClick(this.currentNodeData);
          });
        }
        this.firstCreate = false;
      });

      console.log(" this.treeData", this.treeData[0]);
    },
    async fetchtypelist(type) {
      return new Promise(resolve => {
        fetchTypeList(type).then(res => {
          console.log("res.data", res.data);
          let data = res.data.data;
          if (data == null) return;
          let arr = [];
          data.map(item => {
            if (!item.archived) {
              arr.push(item);
            }
          });
          resolve(arr);
        });
      });
    },
    async getPublikTypeList(data) {
      return new Promise(resolve => {
        getPublikTypeList(data).then(res => {
          console.log("getPublikTypeList", res);
          let typesData = res.data.data;
          let type = data.types[0];
          let Obj = {};
          let arr = [];
          if (typesData[type]) {
            typesData[type].map(i => {
              i["childType"] = null;
              i["level"] = 2;
              i["pid"] = data.pid;
              if (i["archived"] === 0) {
                arr.push(i);
              }
            });
          }
          Obj[data.pid] = arr;
          resolve(Obj);
        });
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

    getDictFieldAll() {
      getDictFieldAll(this.currentid).then(res => {
        console.log("res", res);
        let data = res.data.data;
        if (data.length > 0) {
          data.map(res => {
            res["isedit"] = false;
          });
          this.attributeTableData = data;
          this.$set(this.attributeTableData, 0, {
            ...this.attributeTableData[0],
            ...data[0]
          });
        } else {
          let obj = {
            dictItemLabel: this.contentLabel,
            dictItemType: "en_US",
            dictItemValue: "",
            isedit: false
          };
          this.$set(this.attributeTableData, 0, {
            ...this.attributeTableData[0],
            ...obj
          });
        }
        this.showAttribute = true;
      });
    },
    // 添加数据
    addType(data) {
      addType(data).then(res => {
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.getDictTree();
      });
    },

    putedit(obj) {
      putEdit(obj).then(res => {
        this.$message.success("已修改");
        this.dialogVisible = false;
        this.getDictTree();
      });
    },
    deltype() {
      delType(this.currentid).then(res => {
        this.$message.success("已删除");
        this.isdel = false;
        this.getDictTree();
      });
    },
    // 禁用数据
    putdisable() {
      putDisable(this.currentid).then(res => {
        this.$message.success("已禁用");
        this.handleNodeClick(this.currentNodeData);
      });
    },
    // 启用数据
    putenable() {
      putEnable(this.currentid).then(res => {
        this.$message.success("已启用");
        this.handleNodeClick(this.currentNodeData);
      });
    },
    // 更新附加属性数据
    postDictField(data) {
      postDictField(data).then(res => {
        console.log("res", res);
        this.$message.success("保存成功");
        this.showAttribute = false;
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
      this.contentLabel = row.label;
      switch (s) {
        case "编辑":
          this.type = "edit";
          this.dialogVisible = true;
          this.ruleForm["label"] = row.label;
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
    async handleNodeClick(data) {
      console.log(data);
      this.currentNodeData = data;
      let { id, childType, level } = data;
      this.$nextTick(() => {
        this.currentNodekey = id;
      });
      if (!childType) {
        this.tableData = [];
      } else {
        if (level === 0) {
          this.tableData = await this.fetchtypelist("enquiry_channel");
        }
        if (level === 1) {
          this.currentTypes = {
            types: [childType],
            pid: data.id
          };
          let Obj = await this.getPublikTypeList(this.currentTypes);
          this.tableData = Obj[data.id];
        }
      }
      console.log(" this.tableData ", this.tableData);
      // this.defaultExpandedKeys.push(data.key);
      // console.log("this.currentNodekey", this.currentNodekey);
      // if (data["isAdd"]) return;
      // this.setData(data);
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
