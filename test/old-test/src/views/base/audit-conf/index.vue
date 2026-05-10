<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="frombox" v-for="(item, index) in type" :key="index">
        <div class="title_text">{{ item.name }}</div>
        <el-form
          :model="ruleForm[item.type]"
          :rules="rules"
          :ref="item.type"
          class="demo-ruleForm tagmodal"
          label-position="top"
        >
          <div class="inputBox">
            <el-form-item
              label="审核自动通过时间(无操作自动通过)"
              prop="autoPassDay"
              :style="formitem"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm[item.type]['autoPassDay']"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核人" prop="user" :style="formitem">
              <el-select
                multiple
                v-model="ruleForm[item.type].user"
                placeholder="请选择"
              >
                <el-option
                  :label="i.username"
                  :value="String(i.userId)"
                  v-for="(i, s) in userdata"
                  :key="s"
                >
                </el-option>
                <!-- <el-option :label="i.username" :value="i.userid"> </el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用" prop="status" :style="formitem">
              <el-select
                v-model="ruleForm[item.type].status"
                placeholder="请选择"
              >
                <el-option label="是" :value="1"> </el-option>
                <el-option label="否" :value="0"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核机制" prop="mode" :style="formitem">
              <el-select
                v-model="ruleForm[item.type].mode"
                placeholder="请选择"
              >
                <el-option label="上级审核" :value="1"> </el-option>
                <el-option label="下级审核" :value="2"> </el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item class="fromBtn">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submitForm(item.type)"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { fetchList } from "@/api/admin/user";
import { fetchAuditInfo, putAuditInfo } from "@/api/base/index";
export default {
  name: "UniUiIndex",

  data() {
    return {
      item: { autoPassDay: "", status: "", user: "", mode: "" },
      type: [
        { type: "clue_claim", name: "线索阶段-公海认领审核" },
        { type: "clue_close", name: "线索阶段-线索关闭审核" },
        { type: "opportunity_extension", name: "商机阶段-商机延期审核" },
      ],
      userdata: [],
      ruleForm: {
        clue_claim: {},
        clue_close: {},
        opportunity_extension: {},
      },
      rules: {},
      formitem: "width:50%;padding-right:30px;padding-bottom:30px",
    };
  },
  created() {
    this.getuserList();
    this.type.map((item) => {
      this.fetchauditInfo({ code: item.type });
    });
  },
  mounted() {},

  methods: {
    getuserList() {
      fetchList({ current: 1, size: 100 }).then((res) => {
        this.userdata = res.data.data.records;
      });
    },
    fetchauditInfo(data) {
      fetchAuditInfo(data).then((res) => {
        this.ruleForm[data.code] = res.data.data;
      });
    },
    putauditInfo(data, type) {
      putAuditInfo(data).then((res) => {
        this.$message.success("编辑成功");
        this.fetchauditInfo({ code: type });
      });
    },
    submitForm(formName) {
      console.log("formName", formName);
      let obj = {};
      obj = {
        code: formName,
        ...this.ruleForm[formName],
      };
      this.putauditInfo(obj, formName);
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //   } else {
      //     return false;
      //   }
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.fromBtn {
  text-align: left;
  .el-button {
    width: 100px;
    height: 32px;
    line-height: 12px;
    font-size: 16px;
    font-weight: 600;
  }
}
.inputBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.frombox {
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid #ccc;
}
</style>