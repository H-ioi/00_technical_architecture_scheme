<template>
  <div class="thepool_page">
    <el-dialog
      :title="type == 'add' ? $t('consult.新增') : $t('consult.编辑')"
      :visible.sync="showModal"
      width="640px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('consult.团队名称')"
              prop="teamName"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.teamName"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.团队成员')"
              prop="teamParticipantsIds"
              style="width: 100%"
            >
              <UserTree
                ref="usertree"
                size="small"
                :treeData="treeData"
                @setUser="setUser"
              ></UserTree>
            </el-form-item>
            <el-form-item
              :label="$t('consult.团队介绍')"
              prop="teamIntroduce"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.teamIntroduce"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              round
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addTeam, editTeam, getTeamInfo } from "@/api/consult/team.js";
import { getOrganizationUserInfo } from "@/api/consult/common.js";
import UserTree from "@/components/thepoolcommon/UserTree";
export default {
  name: "guardians",
  components: {
    UserTree,
  },
  props: {},
  data() {
    return {
      type: "add",
      showModal: false,
      ruleForm: {
        teamName: "",
        teamParticipantsIds: [],
        teamIntroduce: "",
      },
      rules: this.initRules(),
      treeData: [],
    };
  },
  created() {
    this.getUserList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler: function () {
        // 语言切换时重新初始化验证规则
        this.rules = this.initRules();
        // 清除表单验证状态
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate();
        }
      },
      immediate: false,
    },
  },
  methods: {
    // 初始化表单验证规则
    initRules() {
      return {
        teamName: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        teamIntroduce: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        teamParticipantsIds: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
      };
    },

    async initModal() {
      this.type = "add";
      this.showModal = true;
    },
    async setDetail(item) {
      this.type = "edit";
      this.showModal = true;
      let userNames = item.participants.map((user) => user.userName);
      let userIds = item.participants.map((user) => user.userId);
      this.ruleForm = {
        teamId: item.teamId,
        teamName: item.teamName,
        teamParticipantsIds: userIds,
        teamIntroduce: item.teamIntroduce,
      };
      this.$nextTick(() => {
        this.$refs["usertree"].labelModel = userNames;
        this.$refs["usertree"].checkedId = userIds;
      });
    },
    async getUserList() {
      let data = {};
      data["subDepartments"] = await getOrganizationUserInfo();
      // 使用示例
      this.treeData = this.convertToTree(data);
    },
    convertToTree(data) {
      // 处理部门节点
      let subDepartments = data.subDepartments || [];
      let departmentNodes =
        subDepartments.map((dept) => ({
          id: dept.departmentId, // 添加前缀避免与人员ID冲突
          label: dept.departmentName,
          type: 1, // 1表示部门
          children: this.convertToTree(dept), // 递归处理子部门
        })) || [];

      // 处理人员节点
      let userInfoList = data.userInfoList || [];
      let userNodes =
        userInfoList.map((user) => ({
          id: user.userId,
          label: user.userName, // 可根据实际字段调整
          type: 2, // 2表示人员
          is_leaf: true,
          ...user, // 保留原始用户信息
        })) || [];

      // 合并部门和人员节点
      return [...departmentNodes, ...userNodes];
    },

    addTeam(data) {
      addTeam(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    editTeam(data) {
      editTeam(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getTeamInfo(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            this.addTeam(this.ruleForm);
          } else {
            this.editTeam(this.ruleForm);
          }
        }
      });
    },
    setUser(data) {
      console.log("setuser", data);
      this.ruleForm["teamParticipantsIds"] = data;
    },
    closeModal() {
      this.type = "add";
      this.ruleForm = {
        teamName: "",
        teamIntroduce: "",
        teamParticipantsIds: [],
      };
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
