<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="frombox">
        <div class="title_text">线索阶段回退公海配置</div>
        <el-form
          :model="clue_reback"
          :rules="rules"
          ref="clue_reback"
          class="demo-ruleForm tagmodal"
          label-position="top"
        >
          <div class="inputBox">
            <el-form-item
              label="认领/分配天数"
              prop="claimDay"
              :style="formitem"
            >
              <el-input
                style="width: 100%"
                v-model="clue_reback.claimDay"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="无跟进记录天数"
              prop="followDay"
              :style="formitem"
            >
              <el-input
                style="width: 100%"
                v-model="clue_reback.followDay"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="status" :style="formitem">
              <el-select v-model="clue_reback.status" placeholder="请选择">
                <el-option label="是" :value="1"> </el-option>
                <el-option label="否" :value="0"> </el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item class="fromBtn">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submitForm('clue_reback')"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="frombox">
        <div class="title_text">商机阶段回退线索公海配置</div>
        <el-form
          :model="opportunity_reback"
          :rules="rules"
          ref="opportunity_reback"
          class="demo-ruleForm tagmodal"
          label-position="top"
        >
          <div class="inputBox">
            <el-form-item label="商机延期申请设置" prop="day" :style="formitem">
              <el-input
                style="width: 100%"
                v-model="opportunity_reback.closeDay"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="无跟进记录天数"
              prop="followDay"
              :style="formitem"
            >
              <el-input
                style="width: 100%"
                v-model="opportunity_reback.followDay"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="status" :style="formitem">
              <el-select
                v-model="opportunity_reback.status"
                placeholder="请选择"
              >
                <el-option label="是" :value="1"> </el-option>
                <el-option label="否" :value="0"> </el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item class="fromBtn">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submitForm('clue_close')"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="frombox">
        <div class="title_text">线索自动关闭设置</div>
        <el-form
          :model="clue_close"
          :rules="rules"
          ref="clue_close"
          class="demo-ruleForm tagmodal"
          label-position="top"
        >
          <div class="inputBox">
            <el-form-item label="回退次数" prop="rebackNum" :style="formitem">
              <el-input
                style="width: 100%"
                v-model="clue_close.rebackNum"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="自动关闭天数"
              prop="closeDay"
              :style="formitem"
            >
              <el-input
                style="width: 100%"
                v-model="clue_close.closeDay"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="status" :style="formitem">
              <el-select v-model="clue_close.status" placeholder="请选择">
                <el-option label="是" :value="1"> </el-option>
                <el-option label="否" :value="0"> </el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item class="fromBtn">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submitForm('opportunity_reback')"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="frombox">
        <div class="title_text">商机延期申请设置</div>
        <el-form
          :model="opportunity_extension"
          :rules="rules"
          ref="opportunity_extension"
          class="demo-ruleForm tagmodal"
          label-position="top"
        >
          <div class="inputBox">
            <el-form-item
              label="延期商机条数"
              prop="extensionNum"
              :style="formitem"
            >
              <el-input
                style="width: 100%"
                v-model="opportunity_extension.extensionNum"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="status" :style="formitem">
              <el-select
                v-model="opportunity_extension.status"
                placeholder="请选择"
              >
                <el-option label="是" :value="1"> </el-option>
                <el-option label="否" :value="0"> </el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item class="fromBtn">
            <el-button>取消</el-button>
            <el-button
              type="primary"
              @click="submitForm('opportunity_extension')"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { fetchMechanismInfo, putMechanism } from "@/api/base/index";
export default {
  name: "UniUiIndex",

  data() {
    return {
      type: [
        "clue_reback",
        "clue_close",
        "opportunity_reback",
        "opportunity_extension",
      ],
      clue_reback: {},
      clue_close: {},
      opportunity_reback: {},
      opportunity_extension: {},
      // ruleForm: {},
      rules: {},
      formitem: "width:50%;padding-right:30px;padding-bottom:30px",
    };
  },
  created() {
    this.type.map((item) => {
      this.fetchmechanisminfo({ code: item });
    });
  },
  mounted() {},

  methods: {
    fetchmechanisminfo(data) {
      fetchMechanismInfo(data).then((res) => {
        switch (data.code) {
          case "clue_reback":
            this.clue_reback = res.data.data;
            break;
          case "clue_close":
            this.clue_close = res.data.data;
            break;
          case "opportunity_reback":
            this.opportunity_reback = res.data.data;
            break;
          case "opportunity_extension":
            this.opportunity_extension = res.data.data;
            break;
        }
      });
    },
    putmechanism(data, type) {
      putMechanism(data).then((res) => {
        this.$message.success("编辑成功");
        this.fetchmechanisminfo({ code: type });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {};
          switch (formName) {
            case "clue_reback":
              obj = {
                code: formName,
                ...this.clue_reback,
              };
              this.putmechanism(obj, formName);
              break;
            case "clue_close":
              obj = {
                code: formName,
                ...this.clue_close,
              };
              this.putmechanism(obj, formName);
              break;
            case "opportunity_reback":
              obj = {
                code: formName,
                ...this.opportunity_reback,
              };
              this.putmechanism(obj, formName);
              break;
            case "opportunity_extension":
              obj = {
                code: formName,
                ...this.opportunity_extension,
              };
              this.putmechanism(obj, formName);
              break;
          }
        } else {
          return false;
        }
      });
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