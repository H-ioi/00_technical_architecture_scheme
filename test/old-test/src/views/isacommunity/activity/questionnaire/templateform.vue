<template>
  <div class="thepool_page">
    <div class="space">
      <el-scrollbar
        class="space_right"
        ref="space_right"
        style="background: #ffffff; padding: 30px"
      >
        <div class="title">{{ $t("isagroup.问卷动态表单") }}</div>

        <div class="formgenerator_template">
          <div class="formgenerator_item">
            <div class="formgenerator_itemname">{{ $t("isagroup.基本属性") }}</div>

            <el-form
              :label-position="'top'"
              :inline="true"
              :model="templateFrom"
              :rules="templateRule"
              ref="templateFrom"
            >
              <el-form-item
                :label="$t('isagroup.问卷名称')"
                prop="name"
                style="margin: 0; width: 100%"
              >
                <el-input
                  style="width: 100%"
                  v-model="templateFrom.name"
                  :placeholder="$t('isagroup.请输入')"
                  :maxlength="255"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.校区')"
                prop="schoolIds"
                style="margin: 0; width: 33.3%"
              >
                <el-select
                  multiple
                  v-model="templateFrom.schoolIds"
                  :placeholder="$t('isagroup.请选择')"
                  style="width: 100%"
                  @change="changeSchool"
                >
                  <el-option
                    :key="k"
                    v-for="(i, k) in dictionary['school']"
                    :label="i.enName"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.关联活动')"
                prop="activityId"
                style="margin: 0; width: 33.3%"
              >
                <el-select
                  v-model="templateFrom.activityId"
                  :placeholder="$t('isagroup.请选择')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(i, k) in selectActivityList"
                    :label="i18nlocel == 'en' ? i.activityEnName : i.activityCnName"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.状态')"
                prop="status"
                style="margin: 0; width: 33.3%"
              >
                <el-select
                  v-model="templateFrom.status"
                  :placeholder="$t('isagroup.请选择')"
                  style="width: 100%"
                >
                  <el-option :label="$t('isagroup.有效')" :value="1"> </el-option>
                  <el-option :label="$t('isagroup.无效')" :value="0"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.是否填写学生信息')"
                prop="needStudentInfo"
                style="margin: 0; width: 33.3%"
              >
                <el-select
                  v-model="templateFrom.needStudentInfo"
                  :placeholder="$t('isagroup.请选择')"
                  style="width: 100%"
                >
                  <el-option
                    :key="k"
                    v-for="(i, k) in consts['yesOrno']"
                    :label="i18nlocel == 'en' ? i.enLabel : i.label"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.填报须知')"
                prop="instructions"
                style="margin: 0; width: 100%"
              >
                <el-input
                  style="width: 100%"
                  v-model="templateFrom.instructions"
                  :placeholder="$t('isagroup.请输入')"
                  maxlength="100"
                  type="textarea"
                  :rows="2"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="df_fa" style="height: calc(100% - 54px)">
          <div style="flex: 1; height: 100%">
            <FormgeneratorActivity
              ref="FormgeneratorActivity"
              templateStr="isa_community_questionnaire"
              :hasTemplateFrom="false"
              :collectionData="templateFrom"
              @submitForm="submitForm"
              @bindTemplate="bindTemplate"
            />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityList } from "@/api/isacommunity/activity.js";
import {
  addQuestionnaire,
  editQuestionnaire,
  getQuestionnaireDetail,
} from "@/api/isacommunity/questionnaire.js";
import { getTemplateOuterId, bindTemplateOuterId } from "@/api/space/templatedynamic.js";
import consts from "@/const/isacommunity/consts.js";
import FormgeneratorActivity from "@/components/isagroupcommon/formgenerator/formgenerator_activity.vue";

export default {
  components: {
    FormgeneratorActivity,
  },
  data() {
    let that = this;
    return {
      consts: consts,
      activityList: [],
      selectActivityList: [],
      currentSchool: "",
      templateFrom: {
        name: "",
        activityId: "",
        status: 1,
        needStudentInfo: "0",
        instructions: "",
      },
      templateRule: {
        name: [{ required: true, message: that.$t("isagroup.请输入"), trigger: "blur" }],
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        activityId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        status: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        needStudentInfo: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        instructions: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
      },
      templateType: "add",
      collectionId: "",
      templateList: [],
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["permissions", "pooldictpermissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    // 初始化数据
    initData() {
      this.getActivityList();
      this.templateType = this.$route.query.type || "add";
      if (this.$route.query.id) {
        this.collectionId = this.$route.query.id;
        this.$nextTick(() => {
          this.$refs.FormgeneratorActivity.collectionId = this.collectionId;
        });
        this.getDetail();
      }
    },
    add(data, templateId) {
      addQuestionnaire(data)
        .then((res) => {
          console.log("addQuestionnaire", res);
          if (res.data.success) {
            this.collectionId = res.data.data;
            //   this.bindTemplate(templateId, res.data.data);
            //   this.$message.success(this.$t("isagroup.成功"));
            this.$refs.FormgeneratorActivity.setFormgeneratorData(res.data.data);
          } else {
            this.$refs.FormgeneratorActivity.isSubmitting = false;
            this.$message.error(this.$t("isagroup.失败"));
          }
        })
        .catch((e) => {
          this.$refs.FormgeneratorActivity.isSubmitting = false;
        })
        .finally(() => {
          this.$refs.FormgeneratorActivity.isSubmitting = false;
        });
    },
    edit(data, templateFormId) {
      editQuestionnaire(data)
        .then((res) => {
          console.log("editQuestionnaire", res);
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.closePage();
          } else {
            this.$refs.FormgeneratorActivity.isSubmitting = false;
            this.$message.error(this.$t("isagroup.失败"));
          }
        })
        .catch((e) => {
          this.$refs.FormgeneratorActivity.isSubmitting = false;
        })
        .finally(() => {
          this.$refs.FormgeneratorActivity.isSubmitting = false;
        });
    },
    bindTemplate(templateId, outerId) {
      let data = new FormData();
      data.append("ids", [templateId]);
      data.append("outerId", outerId);
      data.append("scene", "isa_community_questionnaire");
      bindTemplateOuterId(data).then((res) => {
        if (res) {
          this.$message.success(this.$t("isagroup.成功"));
          this.closePage();
        } else {
          this.$message.error(this.$t("isagroup.失败"));
        }
      });
    },
    getDetail() {
      getQuestionnaireDetail(this.collectionId).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          let { activities } = data;
          this.getTemplateOuterId(this.collectionId);
          this.selectActivityList = this.activityList.filter((activity) =>
            this.hasCommonElement(activity.schoolIds, data.schoolIds)
          );
          this.$nextTick(() => {
            this.templateFrom = {
              name: data.name,
              schoolIds: data.schoolIds,
              activityId: data.activityId,
              status: data.status,
              needStudentInfo: String(data.needStudentInfo),
              instructions: data.instructions,
            };
          });
        }
      });
    },
    submitForm(templateFormId = null) {
      this.$refs["templateFrom"].validate((valid) => {
        if (valid) {
          let data = {
            ...this.templateFrom,
          };
          if (this.templateType == "add") {
            this.add(data);
          } else {
            data["id"] = this.collectionId;
            this.edit(data, templateFormId);
          }
        } else {
          return false;
        }
      });
    },

    async getActivityList() {
      this.activityList = await getActivityList();
    },
    closePage() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.push("/isacommunity/activity/questionnaire/index");
    },
    getTemplateOuterId(outerId) {
      return new Promise((resolve, reject) => {
        getTemplateOuterId({
          outerId,
          scene: "isa_community_questionnaire",
        }).then((res) => {
          console.log("getTemplateOuterId", res);
          if (res.data.success) {
            this.$nextTick(() => {
              this.$refs["FormgeneratorActivity"].templateType = "edit";
              if (res.data.data.length > 0) {
                this.$refs["FormgeneratorActivity"].getTemplateDetail(
                  res.data.data[0].id
                );

                resolve(res.data.data[0].id);
              } else {
                resolve(null);
              }
            });
          } else {
          }
        });
      });
    },
    changeSchool(e) {
      let selectedSchoolIds = e || [];
      this.templateFrom.activityId = "";
      this.selectActivityList = this.activityList.filter((activity) =>
        this.hasCommonElement(activity.schoolIds, selectedSchoolIds)
      );
    },
    // 数组对比函数，存在一个相同元素即返回true
    hasCommonElement(arr1, arr2) {
      const set = new Set(arr1);
      return arr2.some((item) => set.has(item));
    },
  },
};
</script>

<style lang="scss" scoped>
.formgenerator_left {
  margin-left: 0 !important;
}
.formgenerator_template {
  width: 100%;
  display: flex;
  .formgenerator_title {
    font-size: 16px;
    font-weight: 400;
    color: #666666;
    -webkit-background-clip: text;
    margin-bottom: 20px;
  }
  .formgenerator_item {
    width: 100%;
    margin-left: 10px;
    margin-bottom: 20px;
    .el-form-item {
      padding-right: 20px !important;
      margin-bottom: 20px !important;
      box-sizing: border-box;
    }
    .formgenerator_itemname {
      font-size: 16px;
      line-height: 16px;
      font-weight: 300;
      color: #175e67;
      -webkit-background-clip: text;
      padding-left: 10px;
      position: relative;
      margin-bottom: 20px;
      &::before {
        position: absolute;
        content: "";
        top: 0;
        bottom: 0;
        left: 0;
        width: 2px;
        background: #175e67;
      }
    }
  }
}
</style>
