<template>
  <div>
    <div class="f_sb">
      <div class="treeBox">
        <el-tree
          ref="tree"
          lazy
          :props="defaultProps"
          :load="loadNode"
          :highlight-current="true"
          node-key="id"
          :expand-on-click-node="false"
          :current-node-key="currentNodekey"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      <div class="treeTable">
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
          <el-table-column fixed="right" label="操作" :width="`${playBtn.length * 80}px`">
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
                  <span v-if="s == '启用'">{{ scope.row.status ? "禁用" : "启用" }}</span>
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
            <el-form-item label="别名" style="width: 60%" prop="label">
              <el-input v-model="ruleForm['name']"></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 60%" prop="label">
              <el-input v-model="ruleForm['sort']"></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="mini" @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="defult" size="mini" @click="closeModal">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
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
        <el-table-column prop="dictItemLabel" label="别名"> </el-table-column>
        <el-table-column prop="dictItemType" label="属性"> </el-table-column>
        <el-table-column prop="dictItemValue" label="属性值">
          <template slot-scope="scope">
            <div v-if="scope.row.dictItemType != 'enquiry_follow_tags_color'">
              <span v-if="!scope.row.isedit">{{ scope.row.dictItemValue }}</span>
              <el-input
                v-else
                v-model="scope.row.dictItemValue"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <el-color-picker
              v-else
              v-model="scope.row.dictItemValue"
              @change="changeColor($event, scope)"
            ></el-color-picker>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80px">
          <template slot-scope="scope" class="df_center">
            <el-button
              v-if="scope.row.dictItemType != 'enquiry_follow_tags_color'"
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
  getDictFieldAll,
  postDictField,
  fetchTypeList,
} from "@/api/workorder/order/orderlist.js";
import {
  getPublikTypeList,
  getDictTypeList,
  getRelationDictList,
  putRelationDict,
  enableRelationDict,
  disableRelationDict,
  editRelationDict,
  getDictTypeTree,
} from "@/api/publik";
import { tableObj } from "@/const/tabledata/index";
import Modal from "../modal";
export default {
  name: "UniUiIndex",
  components: {
    Modal,
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "child",
        label: "label",
      },
      tablestyle: tableObj,
      tableTitle: [
        { prop: "originalLabel", label: "原名" },
        { prop: "label", label: "别名" },
        { prop: "sort", label: "排序" },
        // { prop: "status", label: "启用状态" }
      ],
      tableData: [],
      currentTitle: "",
      currentPid: "",
      typeObj: {},
      playBtn: ["编辑", "附加属性"],
      // playBtn: ["编辑",  "附加属性"],
      defaultExpandedKeys: [],
      dialogVisible: false,
      delvisible: false,
      isdel: false,
      showAttribute: false,
      type: "",
      showremark: true,
      ruleForm: { name: "", sort: "" },
      rules: {},
      firstCreate: true,
      currentTypes: {},
      currentNodekey: "",
      attributeTableData: [],
      contentLabel: "",
      dictTypeObj: {
        enquiry_channel: "渠道",
        enquiry_direction: "方向",
        enquiry_enroll_level: "年级",
        enquiry_follow_tags: "跟进标签",
        enquiry_pay_subject: "缴费主体",
      },
      dictChildTypeObj: {
        enquiry_channel_child_one: "渠道关联子集",
      },
      currentNode: {},
      topId: "",
      follow_tags_color: "#D4AB85",
    };
  },
  created() {},
  mounted() {},
  watch: {
    currentNodekey() {
      this.setCurrentNodeKey();
    },
  },
  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let data = await this.getTreeTop();
        console.log("data", data);
        resolve(data);
      }
      if (node.data.isLeaf) {
        resolve([]);
      } else {
        if (node.data.level === 1) {
          let categories = [];
          let tree = [];
          // tree = await this.getChildTree(node.data.id);
          categories = await this.getChild(node.data.id);
          if (categories.length == 0) {
            resolve([]);
          } else {
            node.data.child = [...categories];
            resolve(categories);
          }
        } else {
          if (node.data.type == "enquiry_channel") {
            resolve(node.data.child);
          } else {
            resolve([]);
          }
        }
      }
    },
    getTreeTop() {
      return new Promise((resolve, reject) => {
        fetchTypeList("order_school").then((res) => {
          console.log("res.data", res.data);
          let data = res.data.data;
          if (data == null) return;
          let arr = [];
          data.map((item) => {
            item["level"] = 1;
            if (!item.archived) {
              arr.push(item);
            }
          });

          resolve(arr);
        });
      });
    },
    getChildTree(pid) {
      return new Promise((resolve, reject) => {
        getDictTypeTree(pid).then((res) => {
          if (res.data.success) {
            console.log("getDictTypeTree", res.data.data);
            let data = res.data.data;
            let arr = [];
            resolve(arr);
          } else {
            resolve([]);
          }
        });
      });
    },
    getChild(pid) {
      return new Promise((resolve, reject) => {
        getRelationDictList(pid).then((res) => {
          // console.log("getRelationDictList", res);
          if (res.data.success) {
            let data = res.data.data;
            let arr = [];
            Object.keys(data).forEach((item) => {
              if (this.dictTypeObj[item]) {
                // console.log("getRelationDictList", item, data[item]);
                let obj = {
                  label: this.dictTypeObj[item],
                  type: item,
                  level: 2,
                  pid: pid,
                  topId: pid,
                  isLeaf: true,
                  child: [],
                };
                if (item == "enquiry_channel") {
                  data[item].map((child) => {
                    child["isLeaf"] = true;
                    child["level"] = 3;
                    child["topId"] = pid;
                  });
                  obj["isLeaf"] = false;
                  obj["child"] = data[item];
                }
                arr.push(obj);
              }
            });
            resolve(arr);
          } else {
            resolve([]);
          }
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type == "edit") {
            this.putedit(this.ruleForm);
          }
        } else {
          return false;
        }
      });
    },

    getPublikTypeList(data) {
      getPublikTypeList(data).then((res) => {
        console.log("getPublikTypeList", res);
        let typesData = res.data.data;
        let type = data.types[0];
        if (typesData[type]) {
          let arr = [];
          typesData[type].map((i) => {
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
    getDictFieldAll(row) {
      let { type } = row;
      console.log("dictItemType", type);
      getDictFieldAll(this.currentid, { pid: this.topId }).then((res) => {
        console.log("res", res);
        let data = res.data.data;
        let list = [
          {
            dictItemLabel: this.contentLabel,
            dictItemType: "en_US",
            dictItemValue: "",
            isedit: false,
          },
        ];
        let color = {
          dictItemLabel: this.contentLabel,
          dictItemType: "enquiry_follow_tags_color",
          dictItemValue: this.follow_tags_color,
          isedit: false,
        };
        if (type == "enquiry_follow_tags") {
          list.push(color);
        }
        if (data.length > 0) {
          data.map((res) => {
            list.map((l) => {
              if (res.dictItemType == l.dictItemType) {
                l["dictItemValue"] = res["dictItemValue"];
              }
            });
          });
        }
        this.attributeTableData = list;
        this.showAttribute = true;
      });
    },
    postDictField(data) {
      postDictField(data).then((res) => {
        console.log("res", res);
        this.$message.success("保存成功");
        this.showAttribute = false;
      });
    },

    putdisable() {
      let data = {
        pid: this.currentNode.pid,
        cid: this.currentid,
      };
      disableRelationDict(data).then((res) => {
        this.$message.success("已禁用");
        this.handleNodeClick(this.currentNode);
      });
    },
    putenable() {
      let data = {
        pid: this.currentNode.pid,
        cid: this.currentid,
      };
      enableRelationDict(data).then((res) => {
        this.$message.success("已启用");
        this.handleNodeClick(this.currentNode);
      });
    },
    putedit(obj) {
      editRelationDict(obj).then((res) => {
        this.$message.success("已修改");
        this.dialogVisible = false;
        this.handleNodeClick(this.currentNode);
      });
    },
    PlayCurrentItem(s, row) {
      console.log("666", s, row);
      this.currentid = row.id;
      this.typeObj = {
        pid: row.pid,
        type: row.type,
        id: row.id,
        sort: row.sort == null ? "" : row.sort,
      };
      this.contentLabel = row.label;
      switch (s) {
        case "编辑":
          this.type = "edit";
          this.dialogVisible = true;
          this.ruleForm["name"] = row.label;
          this.ruleForm["sort"] = row.sort;
          this.ruleForm["cid"] = row.id;
          // this.ruleForm["pid"] = this.currentNode.pid;
          this.ruleForm["pid"] = this.topId;
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
          this.getDictFieldAll(row);
          break;
      }
    },
    handleNodeClick(node) {
      console.log("node", node);
      this.topId = node["topId"];
      this.currentNode = node;
      if (node.level == 2) {
        getRelationDictList(node.pid).then((res) => {
          // console.log("getRelationDictList", res);
          if (res.data.success) {
            let data = res.data.data;
            this.tableData = data[node["type"]];
            this.tableData = this.tableData.filter((item) => {
              return item["status"] && !item["archived"];
            });
          }
        });
      }
      if (node.level == 3 && node.type == "enquiry_channel") {
        getRelationDictList(node.topId).then((res) => {
          console.log("getRelationDictList", res);
          if (res.data.success) {
            let data = res.data.data;
            console.log("getRelationDictList", data["enquiry_channel_child_one"]);
            this.tableData = data["enquiry_channel_child_one"].filter((item) => {
              item["topId"] = node.topId;
              return item.pid == node.id && item["status"] && !item["archived"];
            });
            console.log("this.tableData", this.tableData);
          }
        });
      }
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
          isedit: true,
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
          value: row.dictItemValue,
          // pid: this.currentNode.pid
          pid: this.topId,
        };
        this.postDictField(obj);
      }
    },
    changeColor(e, scope) {
      console.log("changeColor", e, scope);
      let index = scope["$index"];
      let row = scope["row"];
      // this.$set(this.attributeTableData, index, {
      //   ...this.attributeTableData[index],
      //   dictItemValue: e
      // });
      let obj = {
        dictItemId: this.currentid,
        type: row.dictItemType,
        value: row.dictItemValue,
      };
      this.postDictField(obj);
    },
  },
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
