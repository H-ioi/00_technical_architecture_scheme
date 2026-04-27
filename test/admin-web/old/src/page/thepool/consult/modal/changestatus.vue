<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult')[modalTitle[currentClueType]]"
      :visible.sync="showchangeStatus"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox" v-if="showchangeStatus">
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
            </el-form-item>
            <el-form-item
              v-if="studentList.length > 1"
              :label="$t('consult.学生')"
              prop="studentId"
              style="width: 100%"
            >
              <el-select
                v-model="ruleForm.studentId"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                multiple
                @change="changeStudent"
              >
                <el-option
                  v-for="item in studentList"
                  :key="item.id"
                  :label="item['studentNameEn'] || item['firstName'] + item['lastName']"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item style="width: 100%" v-if="batchStuentList.length > 0">
              <el-form
                :label-position="'top'"
                :inline="true"
                :model="studentForm"
                :rules="studentRules"
                ref="studentForm"
              >
                <div class="df_center_wrap">
                  <el-form-item
                    v-for="(item, index) in batchStuentList"
                    :key="item.id"
                    :label="item['studentNameEn'] || item['firstName'] + item['lastName']"
                    :prop="item.id"
                    style="width: 100%"
                  >
                    <el-input
                      style="width: 100%"
                      v-model="studentForm[item.id]"
                      :placeholder="
                        $t('consult.请输入') +
                        `(${currentClueType == 'apply' ? '身份证号/护照' : '学号'})`
                      "
                      maxlength="50"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </el-form-item>
            <el-form-item :label="$t('consult.备注')" prop="remark" style="width: 100%">
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
import {
  closeStudentClue,
  batchCloseStudentClue,
  batchActivateClue,
  activateClue,
} from "@/api/consult/index.js";
import {
  batchEnterStudent,
  enterStudent,
  leaveStudent,
  batchLeaveStudent,
  batchApplyStudent,
  batchGraduationStudent,
} from "@/api/consult/student.js";
export default {
  name: "addStudent",
  props: {
    showchangeStatus: Boolean,
    currentClueType: String,
    currentClueId: {
      default: "",
      type: String,
    },
    clueIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    studentIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    studentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isClue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let that = this;
    return {
      ruleForm: {
        follower: "",
        remark: "",
      },
      rules: {
        follower: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        remark: [
          { required: false, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        studentId: [
          { required: false, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
      },
      studentForm: {},
      studentRules: {},
      modalTitle: {
        close: "关闭",
        enter: "入学",
        activate: "激活",
        leaving: "离校",
        apply: "申请",
        graduation: "毕业",
      },
      batchStuentList: [],
    };
  },
  created() {
    this.ruleForm.follower = this.userInfo.username;
    if (this.studentList.length > 0) {
      this.$nextTick(() => {
        this.$set(this.rules["studentId"], 0, {
          ...this.rules["studentId"][0],
          required: true,
        });
      });
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "userList", "userInfo"]),
  },
  watch: {
    studentList: {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          if (newVal.length == 1) {
            this.ruleForm.studentId = [newVal[0].id];
            console.log("this.ruleForm.studentId ", this.ruleForm.studentId);
            if (this.currentClueType == "apply" || this.currentClueType == "enter") {
              this.setStudentDetail(newVal);
            }
          } else {
            this.batchStuentList = [];
            this.studentForm = {};
            this.studentRules = {};
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    closeStudentClue(data) {
      closeStudentClue(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    enterStudent(query, data) {
      enterStudent(query, data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.$emit("changeModal", false);
        }
      });
    },
    leaveStudent(data) {
      leaveStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.$emit("changeModal", false);
        }
      });
    },
    // 激活线索
    activateClue(data) {
      activateClue(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    batchCloseStudentClue(data) {
      batchCloseStudentClue(data, { clueIds: this.clueIds }).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    // 批量入学
    batchEnterStudent(data) {
      batchEnterStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.$emit("changeModal", false);
        }
      });
    },
    // 批量申请
    batchApplyStudent(data) {
      batchApplyStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.$emit("changeModal", false);
        }
      });
    },
    // 批量离校
    batchLeaveStudent(data) {
      batchLeaveStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.$emit("changeModal", false);
        }
      });
    },
    // 批量毕业
    batchGraduationStudent(data) {
      batchGraduationStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.$emit("changeModal", false);
        }
      });
    },
    batchActivateClue(data) {
      batchActivateClue(data, { clueIds: this.clueIds }).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.batchStuentList.length > 0) {
            this.$refs["studentForm"].validate((studentValid) => {
              if (studentValid) {
                // 两个表单都校验通过，执行提交逻辑
                this.handleSubmit();
              } else {
                console.log("学生表单校验失败!");
                return false;
              }
            });
          } else {
            // 没有学生表单，直接执行提交逻辑
            this.handleSubmit();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提取提交逻辑到单独的方法
    handleSubmit() {
      let formData = {};
      if (!this.isMultiple) {
        switch (this.currentClueType) {
          case "close":
            formData = { clueIds: [this.currentClueId], followStatusEdit: this.ruleForm };
            this.closeStudentClue(formData);

            break;
          case "activate":
            formData = { clueIds: [this.currentClueId], followStatusEdit: this.ruleForm };
            this.activateClue(formData);

            break;
          case "enter":
            formData = {
              studentEnterList: [],
              clueId: this.currentClueId,
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            Object.keys(this.studentForm).forEach((key) => {
              formData.studentEnterList.push({
                studentId: key,
                studentNumber: this.studentForm[key],
              });
            });
            this.batchEnterStudent(formData);
            break;
          case "activate":
            this.batchActivateClue(this.ruleForm);
            break;
          case "leaving":
            formData = {
              studentId: this.ruleForm["studentId"],
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            this.batchLeaveStudent(formData);
            break;
          case "graduation":
            formData = {
              studentId: this.ruleForm["studentId"],
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            this.batchGraduationStudent(formData);
            break;
          case "apply":
            formData = {
              studentApplyList: [],
              clueId: this.currentClueId,
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            Object.keys(this.studentForm).forEach((key) => {
              formData.studentApplyList.push({
                studentId: key,
                identityCard: this.studentForm[key],
              });
            });
            this.batchApplyStudent(formData);
            break;
        }
      } else {
        switch (this.currentClueType) {
          case "close":
            formData = { clueIds: this.clueIds, followStatusEdit: this.ruleForm };
            this.closeStudentClue(formData);
            break;
          case "activate":
            formData = { clueIds: this.clueIds, followStatusEdit: this.ruleForm };
            this.activateClue(formData);
            break;
          case "enter":
            formData = {
              studentEnterList: [],
              clueId: this.currentClueId,
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            Object.keys(this.studentForm).forEach((key) => {
              formData.studentEnterList.push({
                studentId: key,
                studentNumber: this.studentForm[key],
              });
            });
            this.batchEnterStudent(formData);
            break;

          case "leaving":
            formData = {
              studentId: this.studentIds,
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            this.batchLeaveStudent(formData);
            break;
          case "graduation":
            formData = {
              studentId: this.studentIds,
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            this.batchGraduationStudent(formData);
            break;
          case "apply":
            formData = {
              studentApplyList: [],
              clueId: this.currentClueId,
              remark: {
                follower: this.ruleForm["follower"],
                remark: this.ruleForm["remark"],
              },
            };
            Object.keys(this.studentForm).forEach((key) => {
              formData.studentApplyList.push({
                studentId: key,
                identityCard: this.studentForm[key],
              });
            });
            this.batchApplyStudent(formData);
            break;
        }
      }
    },
    changeStudent(e) {
      if (!e) {
        this.batchStuentList = [];
      } else {
        if (this.currentClueType == "apply" || this.currentClueType == "enter") {
          let students = this.studentList.filter((item) => {
            return e.includes(item.id);
          });
          this.setStudentDetail(students);
        }
      }
    },
    setStudentDetail(batchStuentList) {
      this.batchStuentList = batchStuentList;
      batchStuentList.map((item) => {
        this.$set(
          this.studentForm,
          item.id,
          this.currentClueType == "apply"
            ? item.identityCard || null
            : item.studentNumber || null
        );

        this.studentRules[item.id] = [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ];
      });
    },
    closeModal() {
      this.ruleForm = {
        follower: "",
        remark: "",
      };
      this.batchStuentList = [];
      this.$emit("changeModal", false);
    },
    changeForm(e) {
      this.$refs["ruleForm"].validateField("follower");
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
