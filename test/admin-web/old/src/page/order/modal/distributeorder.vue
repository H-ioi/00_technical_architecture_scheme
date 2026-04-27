<template>
  <div>
    <el-dialog
      title="分发工单"
      :visible.sync="showAdd"
      width="50%"
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
            <div class="df_sb" style="width: 100%">
              <el-form-item
                label="部门"
                style="width: 50%"
                prop="receiveUserId"
              >
                <el-select
                  style="width: 100%"
                  v-model="deptName"
                  placeholder="请选择"
                >
                  <el-option :value="deptName">
                    <el-tree
                      ref="tree"
                      :props="defaultProps"
                      :data="treedata"
                      node-key="id"
                      highlight-current
                      @node-click="getDept"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="分发对象"
                style="width: 50%"
                prop="receiveUserId"
              >
                <el-select
                  style="width: 100%"
                  v-model="ruleForm.receiveUserId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in deptUserList"
                    :key="item.value"
                    :label="
                      item.username +
                      (item.nickname == null || item.nickname == ''
                        ? ''
                        : '    ' + item.nickname)
                    "
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="紧急程度" prop="urgency" style="width: 50%">
                <el-select
                  style="width: 100%"
                  v-model="ruleForm.urgency"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dictionary['order_urgency']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="备注信息" style="width: 100%">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
                v-model="ruleForm.remark"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="default" size="medium" @click="closeModal"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import UserTree from "@/components/common/UserTree.vue";
import {
  distributeOrder,
  distributeMyOrder,
} from "@/api/workorder/order/index.js";
import { fetchTree } from "@/api/admin/dept";
import { fetchList, getUserlist } from "@/api/admin/user";
export default {
  name: "PCOrderAddorder",
  props: {
    showAdd: Boolean,
    currentOrderId: Array,
  },
  components: {
    // UserTree,
  },
  data() {
    return {
      ruleForm: { receiveUserId: "", urgency: "", remark: "" },
      rules: {
        receiveUserId: [{ required: true, message: "请输入", trigger: "blur" }],
        urgency: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      treedata: [],
      deptName: "",
      deptId: "",
      deptUserList: [],
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf",
      },
    };
  },
  created() {
    this.fetchtree();
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userList"]),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          let data = {
            ...this.ruleForm,
            ids: this.currentOrderId,
          };
          if (!data["remark"]) {
            delete data["remark"];
          }
          this.distributeOrder(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    distributeOrder(data) {
      if (this.getIsMy()) {
        distributeMyOrder(data).then((res) => {
          this.setData(res);
        });
      } else {
        distributeOrder(data).then((res) => {
          this.setData(res);
        });
      }
    },
    setData(res) {
      if (res.data.success) {
        this.$message.success("已分发");
        this.$emit("refreshData");
        this.closeModal();
      } else {
        this.$message.error("失败");
      }
      this.closeModal();
    },
    fetchtree() {
      fetchTree().then((res) => {
        console.log("res", res.data.data);
        this.treedata = res.data.data;
      });
    },
    fetchList(data) {
      fetchList(data).then((res) => {
        let data = res.data.data.records;
        this.deptUserList = data.filter((item) => {
          return item.lockFlag == "0";
        });
      });
    },
    getDept(data, Node, tree) {
      console.log(9999, data, Node, tree);
      this.deptId = data.id;
      this.deptName = data.name;
      this.ruleForm.receiveUserId = "";
      this.fetchList({
        size: 10000,
        deptId: data.id,
      });
    },
    getIsMy() {
      return (
        this.$route.path == "/order/mylist/index" || this.$route.query.isMy
      );
    },
    closeModal() {
      this.ruleForm = {
        receiveUserId: "",
        urgency: "",
        remark: "",
      };
      this.deptName = "";
      this.$emit("changeModal", false);
    },
    setuser(userid) {
      this.ruleForm["receiveUserId"] = userid;
    },
  },
};
</script>

<style lang="scss" scoped></style>
