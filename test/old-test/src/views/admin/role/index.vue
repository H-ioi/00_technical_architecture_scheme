<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <avue-crud
        ref="crud"
        :option="tableOption"
        :data="list"
        :page.sync="page"
        v-model="form"
        :table-loading="listLoading"
        :before-open="handleOpenBefore"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="update"
        @row-save="create"
      >
        <template slot="menuLeft">
          <el-button
            v-if="roleManager_btn_add"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
            >添加
          </el-button>
        </template>
        <template slot="dsScopeForm" slot-scope="scope">
          <div v-if="form.dpType == 6">
            <el-tree
              ref="scopeTree"
              :data="dsScopeData"
              :check-strictly="true"
              :props="defaultProps"
              :default-checked-keys="checkedDsScope"
              class="filter-tree"
              node-key="id"
              highlight-current
              show-checkbox
            />
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button
            v-if="roleManager_btn_edit"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, scope.index)"
            >编辑
          </el-button>
          <el-button
            v-if="roleManager_btn_del"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row, scope.index)"
            >删除
          </el-button>
          <el-button
            v-if="roleManager_btn_perm"
            type="text"
            size="small"
            icon="el-icon-plus"
            @click="handlePermission(scope.row, scope.index)"
            >权限
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      title="分配权限"
    >
      <div class="dialog-main-tree">
        <el-tree
          ref="menuTree"
          :data="treeData"
          :default-checked-keys="checkedKeys"
          :check-strictly="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox
          default-expand-all
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updatePermession(roleId)"
          >更 新
        </el-button>
        <el-button type="default" size="small" @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  fetchRoleTree,
  permissionUpd,
  putObj,
  getAlltype,
} from "@/api/admin/role";
import { fetchContractTemplate } from "@/api/base/index";
import { tableOption } from "@/const/crud/admin/role";
import { fetchTree } from "@/api/admin/dept";
import { fetchMenuTree } from "@/api/admin/menu";
import { mapGetters } from "vuex";
// import { getDictTree } from "@/api/card/content/list.js";
import { getDictTree } from "@/api/workorder/order/orderlist.js";
export default {
  name: "TableRole",
  data() {
    return {
      searchForm: {},
      tableOption: tableOption,
      dsScopeData: [],
      treeData: [],
      checkedKeys: [],
      checkedDsScope: [],
      defaultProps: {
        label: "name",
        value: "id",
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      menuIds: "",
      list: [],
      listLoading: true,
      form: {},
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false,
      types: [
        // "client_level",
        // "client_type",
        // "bussiness_type",
        // "clue_quality",
        // "opportunity_level"
        // "contract_type",
        // "enquiry_relation_type"
        "order_school",
        "enquiry_enroll_level",
        "enquiry_direction",
        "enquiry_channel",
        "enquiry_channel_child_one",
        "enquiry_follow_tags",
        "enquiry_pay_subject",
        "isadatacenter_enroll_level", //租户3
        "isacommunity_enroll_level", //租户3
      ],
      typesList: [],
      dpType: "",
      dictTreeData: [],
      dictTreeList: [],
      dictTreeType: [
        // "order_urgency",
        // "order_school",
        "order_service_type",
        "order_area",
        "order_carry_time",
        "order_inspect_type",
        "order_repair_type",
        "order_spotcheck_type",
        "order_upkeep_type",
      ],
    };
  },
  created() {
    this.roleManager_btn_add = this.permissions["sys_role_add"];
    this.roleManager_btn_edit = this.permissions["sys_role_edit"];
    this.roleManager_btn_del = this.permissions["sys_role_del"];
    this.roleManager_btn_perm = this.permissions["sys_role_perm"];
    // this.getAlltype();

    if (this.tenantId == 1) {
      this.getDictTree();
    } else {
      this.getAlltype();
    }
  },
  computed: {
    ...mapGetters(["elements", "permissions", "tenantId"]),
  },

  methods: {
    getAlltype() {
      getAlltype({ types: this.types }).then((res) => {
        let data = res.data.data;
        Object.keys(data).forEach((res) => {
          let obj = {};
          obj["value"] = res;
          switch (res) {
            case "client_level":
              obj["label"] = "客户等级";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "client_type":
              obj["label"] = "客户类型";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "bussiness_type":
              obj["label"] = "业务类型";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "clue_quality":
              obj["label"] = "线索质量";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "opportunity_level":
              obj["label"] = "商机等级";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "order_school":
              obj["label"] = "校区";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_enroll_level":
              obj["label"] = "年级";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_direction":
              obj["label"] = "方向";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_channel":
              obj["label"] = "渠道";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_relation_type":
              obj["label"] = "关系";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_channel_child_one":
              obj["label"] = "渠道子集";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_follow_tags":
              obj["label"] = "跟进标签";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "isadatacenter_enroll_level":
              obj["label"] = "年级";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "isacommunity_enroll_level":
              obj["label"] = "年级";
              obj["children"] = this.getChildren(data[res], 1);
              break;
            case "enquiry_pay_subject":
              obj["label"] = "缴费主体";
              obj["children"] = this.getChildren(data[res], 1);
              break;
          }
          this.typesList.push(obj);
        });
        this.$set(this.tableOption.column, 6, {
          ...this.tableOption.column[6],
          dicData: this.typesList,
        });
        // this.fetchContractTemplate();
        // this.getDictTree();
      });
    },
    getDictTree() {
      getDictTree().then((res) => {
        let data = res.data.data;
        this.changeDictTree(data);
        // this.typesList.push(data[0]);
        this.typesList = [...this.typesList, ...data];
        this.dictTreeData = data;
        this.$set(this.tableOption.column, 6, {
          ...this.tableOption.column[6],
          dicData: this.typesList,
        });
      });
    },

    fetchContractTemplate() {
      fetchContractTemplate().then((res) => {
        let data = res.data.data;
        let obj = {};
        obj["label"] = "合同模板";
        obj["value"] = "templateIds";
        obj["children"] = this.getChildren(data, 2);
        this.typesList.push(obj);
        this.$set(this.tableOption.column, 6, {
          ...this.tableOption.column[6],
          dicData: this.typesList,
        });
      });
    },
    getChildren(data, type) {
      let arr = [];
      data.map((i) => {
        let item = {};
        if (type === 1) {
          if (!i.archived && i.status) {
            item["value"] = i.value;
            item["label"] = i.label;
            arr.push(item);
          }
        } else {
          if (i.status) {
            item["value"] = i.id;
            item["label"] = i.name;
            arr.push(item);
          }
        }
      });
      return arr;
    },
    getList(page, params) {
      this.listLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params,
          this.searchForm
        )
      )
        .then((response) => {
          this.list = response.data.data.records;
          this.page.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    refreshChange() {
      this.getList(this.page);
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    handleCreate() {
      this.$refs.crud.rowAdd();
    },
    handleOpenBefore(show) {
      fetchTree().then((response) => {
        this.dsScopeData = response.data.data;
        if (this.form.deptIds) {
          this.checkedDsScope = this.form.deptIds;
        } else {
          this.checkedDsScope = [];
        }
      });
      show();
    },

    handleUpdate(row, index) {
      let data = row.dictItemMap;
      let arr = [];
      this.dictTreeList = [];
      Object.keys(data).forEach((res) => {
        if (this.dictTreeType.includes(res)) {
          data[res].map((i) => {
            this.setDictTree(res, i, this.dictTreeData, []);
          });
        } else {
          data[res].map((i) => {
            arr.push([res, i]);
          });
        }
      });
      row.templateIds.map((i) => {
        arr.push(["templateIds", i]);
      });
      let formdata = {
        ...row,
        dictItemMap: [...arr, ...this.dictTreeList],
      };
      this.form.dpType = row.dpType;
      this.$refs.crud.rowEdit(formdata, index);
    },
    cancal() {
      this.dialogPermissionVisible = false;
    },
    handlePermission(row) {
      fetchRoleTree(row.roleId)
        .then((response) => {
          this.checkedKeys = response.data.data;
          return fetchMenuTree();
        })
        .then((response) => {
          this.treeData = response.data.data;
          // 解析出所有的太监节点
          this.checkedKeys = this.resolveAllEunuchNodeId(
            this.treeData,
            this.checkedKeys,
            []
          );
          this.dialogPermissionVisible = true;
          this.roleId = row.roleId;
          this.roleCode = row.roleCode;
        });
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i];
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp);
        } else {
          temp.push(idArr.filter((id) => id === item.id));
        }
      }
      return temp;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data, done) {
      done();
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.roleId);
        })
        .then(() => {
          this.getList(this.page);
          this.$notify.success("删除成功");
        });
    },
    getData(form) {
      let obj = {};
      let templateIds = [];
      let school = [];
      form.dictItemMap.map((item) => {
        let arr = item.reverse();
        if (arr[1] !== "templateIds") {
          if (obj[arr[1]]) {
            obj[arr[1]].push(arr[0]);
          } else {
            obj[arr[1]] = [];
            obj[arr[1]].push(arr[0]);
          }
        } else {
          templateIds.push(arr[0]);
        }
        if (arr[arr.length - 1] == "order_school") {
          if (!school.includes(arr[arr.length - 2])) {
            school.push(arr[arr.length - 2]);
          }
        }
      });
      if (school.length > 0) {
        obj["order_school"] = school;
      }

      let data = {
        ...form,
        dictItemMap: obj,
        templateIds: templateIds,
      };
      delete data["$dictItemMap"];
      delete data["$dsType"];
      return data;
    },
    create(row, done, loading) {
      if (this.form.dpType === 6) {
        this.form.deptIds = this.$refs.scopeTree.getCheckedKeys();
      }
      let data = this.getData(this.form);
      addObj(data)
        .then(() => {
          this.getList(this.page);
          done();
          this.$notify.success("创建成功");
        })
        .catch(() => {
          loading();
        });
    },
    update(row, index, done, loading) {
      if (this.form.dpType === 6) {
        this.form.deptIds = this.$refs.scopeTree.getCheckedKeys();
      }
      let data = this.getData(this.form);
      putObj(data)
        .then(() => {
          this.getList(this.page);
          done();
          this.dictTreeList = [];
          this.$notify.success("修改成功");
        })
        .catch(() => {
          loading();
        });
    },
    updatePermession(roleId) {
      this.menuIds = "";
      this.menuIds = this.$refs.menuTree
        .getCheckedKeys()
        .join(",")
        .concat(",")
        .concat(this.$refs.menuTree.getHalfCheckedKeys().join(","));
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false;
        this.$notify.success("修改成功");
      });
    },
    changeDictTree(data) {
      data.map((i) => {
        i["label"] = i["name"];
        if (i.child && i.child.length > 0) {
          i["children"] = i.child;
        }
        if (!i.value) {
          i.value = i.type;
        }
        if (i.child.length > 0) {
          this.changeDictTree(i.child);
        }
      });
    },
    setDictTree(type, id, data, arr) {
      let list = [];
      data.map((i) => {
        if (i.type == type && i.value == id) {
          list = [...arr, i.value];
          this.dictTreeList.push(list);
          return list;
        } else {
          if (i.children) {
            this.setDictTree(type, id, i.children, [...arr, i.value]);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
}
</style>
