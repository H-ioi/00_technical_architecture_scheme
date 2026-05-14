<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup.复制路线')"
      :visible.sync="showModal"
      width="500px"
      :before-close="closeModal"
      :close-on-click-modal="false"
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
              :label="$t('isagroup.校区')"
              prop="schoolId"
              style="width: 100%"
            >
              <el-select
                multiple
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolId']"
                :placeholder="$t('common.请选择')"
                @change="changeSchool"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolSelectList"
                  :label="schoolDropdownLabel(i)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('isagroup.学期')">
              <el-select
                style="width: 100%"
                v-model="ruleForm['sectionId']"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in selectSectionList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("consult.保存")
            }}</el-button>
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
import { batchCopy } from "@/api/isacommunity/route.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "operation",
  mixins: [schoolListBuscommonMixin],
  components: {},
  props: {
    sectionList: {
      default: () => {
        return [];
      },
      type: [],
    },
  },
  data() {
    let that = this;
    return {
      showModal: false,
      ruleForm: {},
      rules: {
        schoolId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        sectionId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
      selectSectionList: [],
      selectionId: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    // 打开
    async show(selectionId) {
      await this.fetchSchoolListBuscommon();
      this.selectionId = selectionId;
      this.showModal = true;
    },
    batchCopy(data) {
      batchCopy(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ids: this.selectionId,
            schoolIds: this.ruleForm.schoolId,
            sectionId: this.ruleForm.sectionId,
          };
          this.batchCopy(data);
        }
      });
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
    },
    // 选择校区
    changeSchool(e) {
      const selectedSchoolIds = new Set(e);
      this.selectSectionList = this.sectionList.filter((item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => selectedSchoolIds.has(id));
        }
        return selectedSchoolIds.has(item.schoolIds);
      });
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
