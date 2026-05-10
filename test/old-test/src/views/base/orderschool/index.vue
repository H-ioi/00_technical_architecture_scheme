<template>
  <div>
    <div class="f_sb">
      <div class="treeTable">
        <!-- 表格 -->
        <div class="topbtn">
          <el-button
            type="primary"
            @click="
              (dialogVisible = true), (type = 'add'), (ruleForm = { label: '', sort: '' })
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
            <el-form-item label="名称" style="width: 60%" prop="label">
              <el-input v-model="ruleForm['label']"></el-input>
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
    <el-dialog
      v-if="showDictList"
      title="字典配置"
      :visible.sync="showDictList"
      width="800px"
      :before-close="closeModal"
    >
      <div>
        <div style="height: 500px; overflow-y: auto; padding-bottom: 30px">
          <!-- 是否必填 -->
          <div class="dictType_title">字典类型是否必填：</div>
          <div class="dictType">
            <div class="dictType_top" v-for="(item, index) in treeData" :key="index">
              <div class="dictType_name">{{ item.label }}</div>
              <el-checkbox v-model="typeFile[item.type]">
                <!-- <span class="text">(是否必填)</span> -->
              </el-checkbox>
            </div>
          </div>
          <!-- 字典类型配置项 -->
          <div class="dictType_title">字典类型配置项：</div>
          <el-cascader
            style="width: 100%"
            :options="treeData"
            :props="props"
            clearable
            v-model="cascaderArr"
          ></el-cascader>
          <!-- <el-tree
            ref="tree"
            accordion
            show-checkbox
            :check-strictly="true"
            default-expand-all
            :expand-on-click-node="false"
            :data="treeData"
            :props="defaultProps"
            :highlight-current="true"
            node-key="id"
          >
          </el-tree> -->
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="closeModal">取 消</el-button>
          <el-button type="primary" @click="handleOk">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchTypeList,
  addType,
  putDisable,
  putEnable,
  putEdit,
  delType,
  getDictFieldAll,
  postDictField,
} from "@/api/workorder/order/orderlist.js";
import {
  getDictTypeList,
  putRelationDict,
  getRelationDictChild,
  getDictTypeField,
  getPublikTypeList,
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
      cascaderArr: [],
      props: { multiple: true, children: "child", label: "label", value: "id" },
      defaultProps: {
        children: "child",
        label: "label",
      },
      treeData: [
        {
          id: "enquiry_enroll_level",
          label: "年级",
          type: "enquiry_enroll_level",
          pid: null,
          sort: null,
          status: null,
          value: null,
          level: "1",
          child: [],
        },
        {
          id: "enquiry_direction",
          label: "方向",
          type: "enquiry_direction",
          pid: null,
          sort: null,
          status: null,
          value: null,
          level: "1",
          child: [],
        },
        {
          id: "enquiry_channel",
          label: "渠道",
          type: "enquiry_channel",
          pid: null,
          sort: null,
          status: null,
          value: null,
          level: "1",
          child: [],
        },
        {
          id: "enquiry_follow_tags",
          label: "跟进标签",
          type: "enquiry_follow_tags",
          pid: null,
          sort: null,
          status: null,
          value: null,
          level: "1",
          child: [],
        },
        {
          id: "enquiry_pay_subject",
          label: "缴费主体",
          type: "enquiry_pay_subject",
          pid: null,
          sort: null,
          status: null,
          value: null,
          level: "1",
          child: [],
        },
      ],
      tablestyle: tableObj,
      tableTitle: [
        { prop: "label", label: "类型" },
        { prop: "sort", label: "排序" },
        { prop: "status", label: "启用状态" },
      ],
      tableData: [],
      currentTitle: "",
      currentPid: "",
      currentid: "",
      typeObj: {},
      playBtn: ["编辑", "启用", "附加属性", "删除", "字典配置"],
      defaultExpandedKeys: [],
      dialogVisible: false,
      delvisible: false,
      isdel: false,
      showAttribute: false,
      type: "",
      showremark: true,
      ruleForm: { label: "", sort: "" },
      rules: {},
      contentType: "order_school",
      contentLabel: "",
      attributeTableData: [],
      showDictList: false,
      dictTypeList: [],
      dictTypeObj: {
        enquiry_channel: "渠道",
        enquiry_direction: "方向",
        enquiry_enroll_level: "年级",
        enquiry_follow_tags: "跟进标签",
        enquiry_pay_subject: "跟进标签",
      },
      dictTypeIds: [],
      dictTypeIdsObj: {},
      typeFile: {
        enquiry_channel: false,
        enquiry_direction: false,
        enquiry_enroll_level: false,
        enquiry_follow_tags: false,
        enquiry_pay_subject: false,
      },
      isAll: {
        enquiry_channel: false,
        enquiry_direction: false,
        enquiry_enroll_level: false,
        enquiry_follow_tags: false,
        enquiry_pay_subject: false,
      },
      dictTypes: [
        "enquiry_channel",
        "enquiry_direction",
        "enquiry_enroll_level",
        "enquiry_follow_tags",
        "enquiry_pay_subject",
      ],
    };
  },
  created() {
    this.fetchtypelist();
  },
  watch: {
    dictTypeIds() {
      this.setIsAll();
    },
  },
  mounted() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          let data = {
            ...this.ruleForm,
          };
          console.log("data", data);
          if (this.type == "edit") {
            data["id"] = this.currentid;
            this.putedit(data);
          } else {
            data["type"] = this.contentType;
            this.addType(data);
          }
        } else {
          return false;
        }
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
    getDictFieldAll() {
      getDictFieldAll(this.currentid).then((res) => {
        console.log("res", res);
        let data = res.data.data;
        if (data.length > 0) {
          data.map((res) => {
            res["isedit"] = false;
          });
          this.attributeTableData = data;
        } else {
          let obj = {
            dictItemLabel: this.contentLabel,
            dictItemType: "en_US",
            dictItemValue: "",
            isedit: false,
          };
          this.attributeTableData[0] = obj;
        }
        this.showAttribute = true;
      });
    },
    getDictTypeField() {
      let data = {
        pid: this.currentid,
        fieldTypes: ["required"],
        types: this.dictTypes,
      };
      getDictTypeField(data).then((res) => {
        console.log("getDictTypeField", res);
        if (res.data.success) {
          this.$nextTick(() => {
            let data = res.data.data;
            data.map((item) => {
              this.typeFile[item.dictType] = item.value == "true";
            });
            console.log("this.typeFile", this.typeFile);
          });
        }
      });
    },
    postDictField(data) {
      postDictField(data).then((res) => {
        console.log("res", res);
        this.$message.success("保存成功");
        this.getDictFieldAll();
      });
    },
    addType(data) {
      addType(data).then((res) => {
        this.$message.success("添加成功");
        this.dialogVisible = false;
        this.fetchtypelist();
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
        this.dialogVisible = false;
        this.fetchtypelist();
      });
    },
    deltype() {
      delType(this.currentid).then((res) => {
        this.$message.success("已删除");
        this.isdel = false;
        this.fetchtypelist();
      });
    },
    getRelationDictChild() {
      getRelationDictChild(this.currentid).then((res) => {
        if (res.data.data) {
          this.cascaderArr = [];
          this.$nextTick(() => {
            this.treeData.map((item) => {
              if (item["child"] && item["child"].length > 0) {
                this.reSetCascaderArr(item["child"], res.data.data, [item.id]);
              }
            });
          });
        }
      });
    },
    reSetCascaderArr(data, ids, arr = []) {
      data.map((item) => {
        if (ids.includes(item["id"])) {
          let newids = [...arr, item["id"]];
          if (item["child"]) {
            this.reSetCascaderArr(item["child"], ids, newids);
          } else {
            this.cascaderArr.push([...newids]);
            // console.log("this.cascaderArr ", this.cascaderArr);
          }
        }
      });
    },
    getDictTypeList() {
      getDictTypeList(this.currentid).then(async (res) => {
        console.log("getDictTypeList", res);
        this.dictTypeList = [];
        if (res.data.success) {
          let data = res.data.data;
          let {
            enquiry_channel,
            enquiry_direction,
            enquiry_enroll_level,
            enquiry_follow_tags,
            enquiry_pay_subject,
          } = data;
          this.dictTypeList = [];
          let enrolllevel = await this.forMatDictTypeList(
            enquiry_enroll_level,
            "enquiry_enroll_level"
          );
          let direction = await this.forMatDictTypeList(
            enquiry_direction,
            "enquiry_direction"
          );
          let channel = await this.forMatDictTypeList(enquiry_channel, "enquiry_channel");
          let followTags = await this.forMatDictTypeList(
            enquiry_follow_tags,
            "enquiry_follow_tags"
          );
          let paysubject = await this.forMatDictTypeList(
            enquiry_pay_subject,
            "enquiry_pay_subject"
          );
          this.$set(this.treeData, 0, {
            ...this.treeData[0],
            child: enrolllevel,
          });
          this.$set(this.treeData, 1, {
            ...this.treeData[1],
            child: direction,
          });
          this.$set(this.treeData, 2, {
            ...this.treeData[2],
            child: channel,
          });
          this.$set(this.treeData, 3, {
            ...this.treeData[3],
            child: followTags,
          });
          this.$set(this.treeData, 4, {
            ...this.treeData[4],
            child: paysubject,
          });
          console.log("this.treeData", this.treeData);
          this.showDictList = true;
          this.getRelationDictChild();
        }
      });
    },
    forMatDictTypeList(data, type) {
      return new Promise((resolve) => {
        let list = [];
        if (type == "enquiry_channel") {
          let channelChildOne = [];
          list = data.filter((l) => {
            return l.status == 1 && !l.archived;
          });
          list.map((item) => {
            let obj = {
              types: ["enquiry_channel_child_one"],
              pid: item.id,
            };
            channelChildOne.push(this.getPublikTypeList(obj));
          });

          Promise.all(channelChildOne).then((childOne) => {
            list.map((item) => {
              childOne.map((one) => {
                if (one[item.id] && one[item.id].length > 0) {
                  item["child"] = one[item.id];
                }
              });
            });
            resolve(list);
          });
        } else {
          list = data.filter((l) => {
            return l.status == 1 && !l.archived;
          });
          resolve(list);
        }
      });
    },
    async getPublikTypeList(data) {
      return new Promise((resolve) => {
        getPublikTypeList(data).then((res) => {
          let typesData = res.data.data;
          let type = data.types[0];
          let Obj = {};
          let arr = [];
          if (typesData[type]) {
            typesData[type].map((i) => {
              i["channelpid"] = data.pid;
              if (i["archived"] === 0 && i.status == 1) {
                arr.push(i);
              }
            });
          }
          Obj[data.pid] = arr;
          resolve(Obj);
        });
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
          this.ruleForm["label"] = row.label;
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
        case "字典配置":
          this.getDictTypeList();
          this.getDictTypeField();

          break;
      }
    },
    handleOk() {
      let data = {
        pid: this.currentid,
        cids: [],
        typeFields: [],
      };
      let checkIds = [];
      this.cascaderArr.map((item) => {
        let newarr = item.filter((c, i) => {
          return i > 0;
        });
        checkIds = [...checkIds, ...newarr];
      });
      checkIds = [...new Set(checkIds)];
      console.log("checkIds", checkIds);
      data["cids"] = checkIds;
      // 是否必填
      Object.keys(this.typeFile).forEach((res) => {
        let obj = {
          dictItemPid: this.currentid,
          dictType: res,
          fieldType: "required",
          value: this.typeFile[res],
        };
        data["typeFields"].push(obj);
      });
      console.log("handleOk", data);
      // return;
      putRelationDict(data).then((res) => {
        if (res.data.success) {
          this.closeModal();
          this.$message.success("绑定成功");
        }
      });
    },
    closeModal() {
      this.dialogVisible = false;
      this.isdel = false;
      this.showAttribute = false;
      this.showDictList = false;
      this.dictTypeIds = [];
      this.typeFile = {
        enquiry_channel: false,
        enquiry_direction: false,
        enquiry_enroll_level: false,
        enquiry_follow_tags: false,
        enquiry_pay_subject: false,
      };
      this.cascaderArr = [];
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
        };
        this.postDictField(obj);
      }
    },
    getDictTypeIdsObj() {
      this.dictTypeIdsObj = {};
      this.dictTypeList.map((item) => {
        if (item["data"].length > 0) {
          this.dictTypeIdsObj[item.type] = [];
          item["data"].map((d) => {
            this.dictTypeIdsObj[item.type].push(d.id);
          });
        } else {
          this.dictTypeIdsObj[item.type] = [];
        }
      });
    },
    setIsAll() {
      console.log("setIsAll");
      Object.keys(this.dictTypeIdsObj).forEach((res) => {
        if (this.dictTypeIdsObj[res].length == 0) {
          this.$nextTick(() => {
            this.isAll[res] = false;
          });
        } else {
          let ids = [];
          this.dictTypeIds.map((item) => {
            if (this.dictTypeIdsObj[res].includes(item)) {
              ids.push(item);
            }
          });
          if (ids.length != 0 && ids.length == this.dictTypeIdsObj[res].length) {
            this.$nextTick(() => {
              this.isAll[res] = true;
            });
          } else {
            this.$nextTick(() => {
              this.isAll[res] = false;
            });
          }
          console.log("ids", ids);
        }
      });
    },
    changeIsAll(type, data) {
      console.log("changeIsAll", type, this.isAll[type]);
      if (this.isAll[type]) {
        data.map((item) => {
          if (!this.dictTypeIds.includes(item.id)) {
            this.dictTypeIds.push(item.id);
          }
        });
      } else {
        data.map((item) => {
          if (this.dictTypeIds.includes(item.id)) {
            let index = this.dictTypeIds.indexOf(item.id);
            console.log("index", index);
            this.dictTypeIds.splice(index, 1);
          }
        });
      }
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
.dictType_title {
  font-size: 16px;
  color: #000000;
  font-weight: 500;
  margin-bottom: 10px;
}
.dictType {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  width: 100%;
  .dictType_top {
    width: 20%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .text {
      font-size: 12px;
      color: #cccccc;
    }
    .dictType_name {
      font-size: 16px;
      margin-right: 10px;
    }
  }

  .dictType_value {
    width: 25%;
    margin-right: 0;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.dialog-footer {
  display: block;
  text-align: center;
}
</style>
