<template>
  <div class="thepool_page">
    <div class="space">
      <el-scrollbar
        class="space_right"
        ref="space_right"
        style="background: #ffffff; padding: 20px"
      >
        <div class="df_sb">
          <div class="title" style="margin-bottom: 15px">
            {{ $t("consult.收集表动态表单显示规则配置") }}
          </div>
          <el-button type="primary" size="medium" @click="saveTemplate">{{
            $t("consult.保存")
          }}</el-button>
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
import {
  getCollectionDetail,
  editCollectionView,
} from "@/api/consult/collection.js";
import FormgeneratorActivity from "@/page/space/from/formgenerator_activity_show.vue";
import { template } from "lodash";

export default {
  components: {
    FormgeneratorActivity,
  },
  data() {
    return {
      templateFrom: {},
      templateType: "edit",
      collectionId: "",
      templateId: "",
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
    ...mapGetters(["permissions", "pooldictpermissions"]),
  },
  methods: {
    // 初始化数据
    initData() {
      this.collectionId = this.$route.query.id;
      this.$nextTick(() => {
        this.$refs.FormgeneratorActivity.collectionId = this.collectionId;
      });
      this.getDetail();
    },
    saveTemplate() {
      let formArr = this.$refs.FormgeneratorActivity.formArr;
      let templateFields = [];
      formArr.map((item) => {
        if (item.visibleCondition && item.visibleCondition.length > 0) {
          templateFields.push({
            fieldId: item.fieldId,
            visibleCondition: item.visibleCondition,
          });
        }
      });
      let templateFrom = {
        templateId: this.templateId,
        templateFields,
      };
      console.log("saveTemplate", templateFrom);
      editCollectionView(templateFrom).then((res) => {
        if (res.data.success) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          // this.closePage();
        }
      });
    },
    getDetail() {
      getCollectionDetail(this.collectionId).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          let { template } = data;
          this.templateId = template.templateId;
          this.$nextTick(() => {
            this.$refs.FormgeneratorActivity.getTemplateDetail(template);
          });
        }
      });
    },

    closePage() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.push("/thepool/activity/templatelist_show");
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
