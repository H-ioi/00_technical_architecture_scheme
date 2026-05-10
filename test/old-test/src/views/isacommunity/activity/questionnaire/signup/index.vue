<template>
  <div>
    <div
      class="questionnaire"
      v-if="collectionData['status'] && !collectionData['isDeleted']"
    >
      <div class="questionnaire-nav">
        <div class="questionnaire-nav_text">{{ collectionData["name"] }}</div>
      </div>
      <el-scrollbar class="questionnaire-content">
        <div class="questionnaire-content-scroll">
          <div class="form-questionnaire" v-if="collectionData['needStudentInfo']">
            <el-form
              :label-position="'top'"
              :inline="true"
              :model="studentForm"
              :rules="studentRules"
              ref="studentForm"
            >
              <el-form-item label="姓名Name" prop="name" style="width: 100%">
                <el-input
                  style="width: 100%"
                  v-model="studentForm.name"
                  placeholder="请输入"
                  maxlength="100"
                ></el-input>
              </el-form-item>
              <el-form-item label="学校School" prop="school" style="width: 100%">
                <el-input
                  style="width: 100%"
                  v-model="studentForm.school"
                  placeholder="请输入"
                  maxlength="100"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="出生日期BirthDate"
                prop="birthDate"
                style="width: 100%"
              >
                <el-date-picker
                  v-model="studentForm.birthDate"
                  type="date"
                  placeholder="请选择"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="性别Gender" prop="gender" style="width: 100%">
                <el-select
                  style="width: 100%"
                  v-model="studentForm.gender"
                  placeholder="请选择"
                >
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <FromitemActivity
            ref="FromitemActivity"
            type="questionnaire"
            @signUpCollection="signUpCollection"
          />
        </div>
      </el-scrollbar>
      <div class="questionnaire-footter">
        <!-- <div class="questionnaire-cancel" @click="cancelData">取消</div> -->
        <div
          class="questionnaire-confirm"
          @click="submit"
          :class="{ disabled: isSubmitting }"
          :style="{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }"
        >
          {{ isSubmitting ? "提交中..." : "确认提交" }}
        </div>
      </div>
      <el-dialog
        class="questionnaire-dialog"
        :show-close="false"
        :visible.sync="showModal"
        width="260px"
        :before-close="closeModal"
        :close-on-click-modal="false"
      >
        <div class="questionnaire-tips">
          <div class="questionnaire-tips-title">填报须知</div>
          <div class="questionnaire-tips-text">
            {{ collectionData["instructions"] }}
          </div>
          <div class="questionnaire-btn" @click="closeModal">确定</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getViewCollection,
  signUpCollection,
  checkCollection,
} from "@/api/consult/collection.js";
import { viewQuestionnaireDetail, signUp } from "@/api/isacommunity/questionnaire.js";
import FromitemActivity from "@/components/formgenerator/fromitem-activity.vue";
export default {
  components: {
    FromitemActivity,
  },
  beforeRouteEnter(to, form, next) {
    document.title = "ISA SMS";
    next();
  },

  data() {
    return {
      showModal: false,
      linkStatus: false,
      collectionData: {},
      collectionInfo: { outerId: "", scene: "isa_community_questionnaire" },
      studentForm: {},
      studentRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        school: [{ required: true, message: "请输入", trigger: "blur" }],
        birthDate: [{ required: true, message: "请选择", trigger: "blur" }],
        gender: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      isSubmitting: false, // 添加防重提交状态
    };
  },
  created() {},
  mounted() {
    document.title = "问卷报名";
    this.initData();
  },
  activated() {},
  computed: {
    ...mapGetters(["permissions", "dictpermissions"]),
  },
  methods: {
    async initData() {
      if (this.$route.query.id) {
        this.collectionInfo = {
          outerId: this.$route.query.id,
          scene: "isa_community_questionnaire",
        };
        this.getList();
      }
    },
    cancelData() {
      this.$alert("确认取消吗?", "取消", {
        confirmButtonText: "确定",
      }).then(() => {
        this.getList();
      });
    },
    getList() {
      viewQuestionnaireDetail(this.collectionInfo).then((res) => {
        if (res.data.success) {
          let {
            activityQuestionnaireDTO,
            templateDynamicFormCollectionDTO,
          } = res.data.data;
          this.collectionData = activityQuestionnaireDTO;
          this.$nextTick(() => {
            if (!this.collectionData["status"] || this.collectionData["isDeleted"]) {
              this.$message({
                message: "该链接已失效<br/>This link has expired",
                type: "warning",
                duration: 0,
                dangerouslyUseHTMLString: true,
              });
            } else {
              this.$refs.FromitemActivity.type = "questionnaire";
              if (this.collectionData["instructions"]) {
                this.showModal = true;
              }
              let formdata = {
                data: {
                  data: templateDynamicFormCollectionDTO,
                },
              };
              this.$refs.FromitemActivity.templateFormId =
                templateDynamicFormCollectionDTO.id;
              this.$refs.FromitemActivity.reSetForm(formdata);
            }
          });
        }
      });
    },
    submit() {
      if (
        !this.collectionData["status"] ||
        this.collectionData["isDeleted"] ||
        this.isSubmitting
      )
        return;
      this.isSubmitting = true; // 设置提交状态
      this.$refs.FromitemActivity.saveFormArrValue();
    },
    getStudentInfo() {
      return new Promise((resolve) => {
        this.$refs["studentForm"].validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    async signUpCollection(data) {
      try {
        if (this.collectionData["needStudentInfo"]) {
          let isValid = await this.getStudentInfo();
          if (!isValid) {
            this.isSubmitting = false; // 验证失败，重置提交状态
            return;
          }
        }
        let formData = {
          questionnaireId: this.collectionInfo["outerId"],
          dynamicFormAddDTO: {
            ...data,
          },
          activityStudentSurveyDTO: {
            ...this.studentForm,
          },
        };
        signUp(formData)
          .then((res) => {
            this.isSubmitting = false;
            if (res.data.success) {
              //   this.$message.success("提交成功");
              this.$router.push("/isacommunity/activity/questionnaire/signup/success");
            } else {
              this.$message.error("提交失败，请重试");
            }
          })
          .catch(() => {
            this.isSubmitting = false;
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } catch (error) {
        this.$message.error("提交失败，请重试");
        this.isSubmitting = false; // 发生异常，重置提交状态
      }
    },
    canSignUp() {
      let isValid = this.getStudentInfo();
      if (isValid) {
        this.$refs.FromitemActivity.saveFormArrValue();
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
// 可以添加一些样式来表示提交中状态
.disabled {
  opacity: 0.6;
}
</style>
