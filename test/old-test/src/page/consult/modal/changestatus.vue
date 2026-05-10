<template>
  <div>
    <el-dialog
      :title="$t('consult')[modalTitle[currentClueType]]"
      :visible.sync="showchangeStatus"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
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
            <el-form-item
              :label="$t('consult.跟进人')"
              prop="follower"
              style="width: 50%"
            >
              <el-input
                v-model="ruleForm.follower"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
              <!-- <el-select
                v-model="ruleForm.follower"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item
              :label="$t('consult.备注')"
              prop="remark"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.remark"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
            <el-button type="default" size="medium" @click="closeModal">{{
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
import {
  closeStudentClue,
  enterStudentClue,
  batchCloseStudentClue,
  batchEnterStudentClue,
  batchActivateClue,
  activateClue
} from "@/api/consult/index.js";
export default {
  name: "addStudent",
  props: {
    showchangeStatus: Boolean,
    currentClueType: String,
    currentClueId: String,
    clueIds: Array,
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        follower: "",
        remark: ""
      },
      rules: {
        follower: [{ required: true, message: "请选择", trigger: "blur" }],
        remark: [{ required: false, message: "请输入", trigger: "blur" }]
      },
      modalTitle: {
        close: "关闭",
        enter: "入学",
        activate: "激活"
      }
    };
  },
  created() {
    this.ruleForm.follower = this.userInfo.username;
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "userList", "userInfo"])
  },
  methods: {
    closeStudentClue(data) {
      closeStudentClue(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    enterStudentClue(data) {
      enterStudentClue(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    activateClue(data) {
      activateClue(data).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    batchCloseStudentClue(data, clueIds) {
      batchCloseStudentClue(data, clueIds).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    batchEnterStudentClue(data, clueIds) {
      batchEnterStudentClue(data, clueIds).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    batchActivateClue(data, clueIds) {
      batchActivateClue(data, clueIds).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isMultiple) {
            let data = {
              ...this.ruleForm,
              clueId: this.currentClueId
            };

            switch (this.currentClueType) {
              case "close":
                this.closeStudentClue(data);
                break;
              case "enter":
                this.enterStudentClue(data);
                break;
              case "activate":
                this.activateClue(data);
                break;
            }
          } else {
            let url = "";
            this.clueIds.map((item, index) => {
              if (index == 0) {
                url = `?clueIds=${item}`;
              } else {
                url = url + `&clueIds=${item}`;
              }
            });
            switch (this.currentClueType) {
              case "close":
                this.batchCloseStudentClue(this.ruleForm, url);
                break;
              case "enter":
                this.batchEnterStudentClue(this.ruleForm, url);
                break;
              case "activate":
                this.batchActivateClue(this.ruleForm, url);
                break;
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        follower: "",
        remark: ""
      };
      this.$emit("changeModal", false);
    },
    changeForm(e) {
      this.$refs["ruleForm"].validateField("follower");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
