<template>
  <div>
    <el-dialog
      title="协作人"
      :visible.sync="showCollaborators"
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
          <el-form-item label="部门" style="width: 50%">
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
            label="部门人员"
            style="width: 100%"
            class="addCollaborators"
          >
            <span class="addBtn" @click="addCollaborators">添加</span>
            <el-checkbox-group
              v-model="ruleForm.collaborators"
              prop="collaborators"
              class="checkboxGroup"
            >
              <el-checkbox
                class="checkboxItem"
                v-for="(i, k) in deptUserList"
                :key="k"
                :label="i.userId"
                :disabled="collaboratorsId.includes(String(i.userId))"
                :title="
                  i.username + (i.nickname != null ? '' + i.nickname : '')
                "
              >
                {{ i.username }}<span style="margin-right: 10px"></span
                >{{ i.nickname != null ? "" + i.nickname : "" }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="已选择" style="width: 100%">
            <el-checkbox-group
              v-model="collaboratorsId"
              prop="collaborators"
              class="checkboxGroup"
            >
              <el-checkbox
                class="checkboxItem"
                v-for="(i, k) in collaboratorsData"
                :key="k"
                :label="i.userId"
                :title="
                  i.username + (i.nickname != null ? '' + i.nickname : '')
                "
              >
                {{ i.username }}<span style="margin-right: 10px"></span
                >{{ i.nickname != null ? "" + i.nickname : "" }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
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
import FileListOrder from "@/components/common/FileListOrder";
import { fetchTree } from "@/api/admin/dept";
import { fetchList, getUserlist } from "@/api/admin/user";
export default {
  name: "PCOrderAddorder",
  props: {
    currentOrderId: String,
    collaborators: Array,
    showCollaborators: Boolean
  },
  components: {
    FileListOrder
  },
  data() {
    return {
      ruleForm: { collaborators: [] },
      rules: {
        collaborators: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      treedata: [],
      deptName: "",
      deptId: "",
      deptUserList: [],
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf"
      },
      deptUserList: [],
      collaboratorsId: [],
      collaboratorsData: []
    };
  },
  created() {
    this.fetchtree();
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary"])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = new FormData();
          obj.append("id", this.currentOrderId);
          obj.append("collaborators", this.collaboratorsId);
          this.$emit("addCollaborators", obj);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchtree() {
      fetchTree().then(res => {
        console.log("res", res.data.data);
        this.treedata = res.data.data;
      });
    },
    fetchList(data) {
      fetchList(data).then(res => {
        let deptUserData = res.data.data.records;
        this.deptUserList = deptUserData.filter(item => {
          item["userId"] = String(item["userId"]);
          return item["lockFlag"] == "0";
        });
        console.log("this.deptUserList ", this.deptUserList);
      });
    },
    getDept(data, Node, tree) {
      console.log(9999, data, Node, tree);
      this.deptId = data.id;
      this.deptName = data.name;
      this.ruleForm.receiveUserId = "";
      this.fetchList({
        size: 10000,
        deptId: data.id
      });
    },
    addCollaborators() {
      if (this.ruleForm.collaborators.length < 1) {
        this.$message.warning("请先选择协作人");
        return;
      } else {
        this.collaboratorsId = [
          ...this.collaboratorsId,
          ...this.ruleForm.collaborators
        ];
        console.log(this.collaboratorsId);
        let list = this.deptUserList.filter(item => {
          return this.ruleForm.collaborators.includes(item.userId);
        });
        this.collaboratorsData = [...this.collaboratorsData, ...list];
        // 去重
        const res = new Map();
        this.collaboratorsData = this.collaboratorsData.filter(
          item => !res.has(item.userId) && res.set(item.userId, 1)
        );
        this.ruleForm.collaborators = [];
      }
    },

    closeModal() {
      this.deptName = "";
      this.deptUserList = [];
      this.$emit("changeModal", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.checkboxGroup {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .checkboxItem {
    width: 26%;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    /deep/.el-checkbox__label {
      max-width: 100%;
      white-space: nowrap !important;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 20px;
    }
  }
}
.addCollaborators {
  position: relative;
  .addBtn {
    position: absolute;
    width: 60px;
    height: 28px;
    line-height: 26px;
    border-radius: 2px;
    text-align: center;
    color: #ffffff;
    background-color: #175e67;
    top: -36px;
    right: 50%;
    cursor: pointer;
  }
}
</style>
