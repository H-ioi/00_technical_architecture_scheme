<template>
  <div class="thepool_page">
    <div class="space">
      <el-scrollbar
        class="space_right"
        ref="space_right"
        style="background: #ffffff; padding: 30px"
      >
        <div class="title">{{ $t("consult.收集表动态表单") }}</div>
        <div class="formgenerator_template">
          <div class="formgenerator_item">
            <div class="formgenerator_itemname">
              {{ $t("consult.基本属性") }}
            </div>

            <el-form
              :label-position="'top'"
              :inline="true"
              :model="templateFrom"
              :rules="templateRule"
              ref="templateFrom"
            >
              <el-form-item
                :label="$t('consult.收集表名')"
                prop="collectionName"
                style="margin: 0; width: 33%"
              >
                <el-input
                  style="width: 100%"
                  v-model="templateFrom.collectionName"
                  :placeholder="$t('consult.请输入')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('consult.学校')"
                prop="schoolIds"
                style="margin: 0; width: 33%"
              >
                <el-select
                  multiple
                  v-model="templateFrom.schoolIds"
                  :placeholder="$t('consult.请选择')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in pooldictpermissions"
                    :key="item.value"
                    :label="i18nlocel == 'en' ? item.enLabel : item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('consult.关联活动')"
                prop="activityIds"
                style="margin: 0; width: 33%"
              >
                <el-select
                  v-model="templateFrom.activityIds"
                  :placeholder="$t('consult.请选择')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in activityList"
                    :key="item.id"
                    :label="item.activityName"
                    :value="String(item.id)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('consult.状态')"
                prop="linkStatus"
                style="margin: 0; width: 33%"
              >
                <el-select
                  v-model="templateFrom.linkStatus"
                  :placeholder="$t('consult.请选择')"
                  style="width: 100%"
                >
                  <el-option :label="$t('consult.有效')" :value="1">
                  </el-option>
                  <el-option :label="$t('consult.失效')" :value="0">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('consult.填报须知')"
                prop="guideline"
                style="margin: 0; width: 80%"
              >
                <el-input
                  style="width: 100%"
                  v-model="templateFrom.guideline"
                  :placeholder="$t('consult.请输入')"
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
              templateStr="collection_dynamic"
              :hasTemplateFrom="false"
              :collectionData="templateFrom"
              @submitForm="submitForm"
            />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityOpt } from "@/api/consult/activity.js";
import {
  addCollection,
  editCollection,
  getCollectionDetail,
  getRelatedInfoTable,
} from "@/api/consult/collection.js";
import FormgeneratorActivity from "@/page/space/from/formgenerator_activity.vue";

export default {
  components: {
    FormgeneratorActivity,
  },
  data() {
    let that = this;
    return {
      activityList: [],
      currentSchool: "",
      templateFrom: {
        collectionName: "",
        activityIds: "",
        linkStatus: "",
        guideline: "",
        schoolIds: [],
      },
      templateRule: {
        collectionName: [
          {
            required: true,
            message: that.$t("consult.请输入"),
            trigger: "blur",
          },
        ],
        linkStatus: [
          {
            required: true,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
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
    ...mapGetters(["permissions", "pooldictpermissions", "i18nlocel"]),
  },
  methods: {
    // 初始化数据
    initData() {
      this.getActivityOpt();
      this.templateType = this.$route.query.type;
      if (this.$route.query.id) {
        this.collectionId = this.$route.query.id;
        this.$nextTick(() => {
          this.$refs.FormgeneratorActivity.collectionId = this.collectionId;
        });
        this.getDetail();
      }
    },
    add(data) {
      addCollection(data).then((res) => {
        console.log("addCollection", res);
        if (res.data.success) {
          this.closePage(res.data.data);
          this.$message.success(this.$t("consult.成功"));
        } else {
          this.$message.error(this.$t("consult.失败"));
        }
      });
    },
    edit(data) {
      editCollection(data).then((res) => {
        console.log("editCollection", res);
        if (res.data.success) {
          this.closePage();
          this.$message.success(this.$t("consult.成功"));
        } else {
          this.$message.error(this.$t("consult.失败"));
        }
      });
    },
    getDetail() {
      getCollectionDetail(this.collectionId).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          console.log("getCollectionDetail", res, data);

          let {
            activityInfos,
            collectionName,
            guideline,
            linkStatus,
            template,
            schoolIds,
          } = data;
          this.$nextTick(() => {
            this.templateFrom = {
              collectionName: collectionName,
              guideline: guideline,
              linkStatus: linkStatus ? 1 : 0,
              schoolIds: schoolIds || [],
              activityIds: activityInfos
                ? activityInfos.length > 0
                  ? activityInfos[0]["id"]
                  : ""
                : "",
            };
            this.$refs.FormgeneratorActivity.getTemplateDetail(template);
          });
        }
      });
    },
    submitForm() {
      this.$refs["templateFrom"].validate((valid) => {
        if (valid) {
          let data = {
            ...this.templateFrom,
            activityIds: this.templateFrom["activityIds"]
              ? [this.templateFrom["activityIds"]]
              : [],
            template: [],
          };
          let formData =
            this.$refs.FormgeneratorActivity.setFormgeneratorData();
          if (formData["isPass"]) {
            data["template"] = formData["data"];
            console.log("submitForm", data);

            if (this.templateType == "add") {
              this.add(data);
            } else {
              data["id"] = this.collectionId;
              this.edit(data);
            }
          } else {
            return;
          }
        } else {
          return false;
        }
      });
    },

    getActivityOpt() {
      let school = this.pooldictpermissions.map((item) => {
        return item.value;
      });
      getActivityOpt({ school }).then((res) => {
        if (res.data.success) {
          this.activityList = res.data.data;
        }
      });
    },
    closePage(id) {
      this.$confirm("保存成功，是否返回列表？", "保存成功", {
        confirmButtonText: this.$t("consult.确定"),
      })
        .then(() => {
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.push("/thepool/activity/templatelist");
        })
        .catch((action) => {
          if (this.templateType == "add") {
            this.collectionId = id;
            this.templateType = "edit";
            this.$nextTick(() => {
              this.$refs.FormgeneratorActivity.collectionId = this.collectionId;
            });
            this.getDetail();
          }
        });
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
