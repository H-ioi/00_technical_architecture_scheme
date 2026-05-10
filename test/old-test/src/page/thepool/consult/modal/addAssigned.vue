<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.跟进人')"
      :visible.sync="showAddAssigned"
      width="560px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
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
            <el-form-item :label="$t('consult.跟进人')" prop="id" style="width: 100%">
              <UserTree
                ref="usertree"
                size="small"
                @setuser="setuser"
                :options="[]"
                :isDisabled="false"
              ></UserTree>
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
import { addAssigned, editAssigned } from "@/api/consult/index.js";
import { fetchTree } from "@/api/admin/dept";
import UserTree from "@/components/commonConpents/UserTree";
export default {
  name: "addlog",
  props: {
    showAddAssigned: Boolean,
    clueIds: String,
    type: String,
  },
  components: {
    UserTree,
  },
  data() {
    let that = this;
    return {
      depttree: [],
      ruleForm: {
        userIds: [],
      },
      rules: {
        userIds: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // this.fetchtree();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "userList", "userInfo"]),
  },
  methods: {
    addAssigned(data) {
      addAssigned(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    editAssigned(data) {
      editAssigned(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = new FormData();

          data.append("userIds", this.ruleForm.userIds);
          if (this.type == "add") {
            data.append("clueIds", this.clueIds);
            this.addAssigned(data);
          } else {
            data.append("clueId", this.clueIds[0]);
            this.editAssigned(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchtree() {
      fetchTree().then((res) => {
        console.log("res", res.data.data);
        this.depttree = res.data.data;
      });
    },
    setuser(data) {
      console.log("data", data);
      this.ruleForm["userIds"] = data;
    },

    closeModal() {
      this.ruleForm = {
        userIds: "",
      };
      this.$emit("changeModal", false);
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
