<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.新增')"
      :visible="showModal"
      width="400px"
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
            <el-form-item
              :label="$t('consult.收集表名')"
              prop="collectionName"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.collectionName"
                :placeholder="$t('consult.请输入')"
                maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.关联活动')"
              prop="activitiesIds"
              style="width: 100%"
            >
              <el-select
                multiple
                v-model="ruleForm.activitiesIds"
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
              :label="$t('consult.是否使用模板')"
              prop="useTemplate"
              style="width: 100%"
            >
              <el-switch
                @change="changeUseTemplate"
                v-model="ruleForm.useTemplate"
                active-color="#175E67"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.useTemplate"
              :label="$t('consult.模板')"
              prop="templateId"
              style="width: 100%"
            >
              <el-select
                v-model="ruleForm.templateId"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.value"
                  :label="item.label"
                  :value="String(item.id)"
                >
                </el-option>
              </el-select>
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
import { consult } from "@/const/consult/index.js";
import { getActivityOpt } from "@/api/consult/activity.js";
import { addCollection } from "@/api/consult/collection.js";
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
export default {
  name: "guardians",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      type: "add",
      showModal: false,
      activityList: [],
      templateList: [],
      ruleForm: {
        collectionName: "",
        activitiesIds: [],
        useTemplate: false,
        templateId: "",
      },
      rules: {
        collectionName: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        activitiesIds: [
          { required: true, message: that.$t("consult.请选择"), trigger: "change" },
        ],
        templateId: [
          { required: false, message: that.$t("consult.请选择"), trigger: "change" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    show() {
      this.showModal = true;
      this.getActivityOpt();
      this.fetchtypelist();
    },
    add(data) {
      addCollection(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },

    getActivityOpt() {
      getActivityOpt().then((res) => {
        if (res.data.success) {
          this.activityList = res.data.data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.useTemplate) {
            this.closeModal();
            this.$router.push(
              "/thepool/activity/templateform?type=add&templateId=" +
                this.ruleForm.templateId
            );
          } else {
            this.add({
              collectionName: this.ruleForm.collectionName,
              activitiesIds: this.ruleForm.activitiesIds,
            });
          }
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.ruleForm = {
        collectionName: "",
        activitiesIds: [],
        useTemplate: false,
        templateId: "",
      };
      this.showModal = false;
    },
    changeUseTemplate(e) {
      this.$set(this.rules["templateId"], 0, {
        ...this.rules.templateId[0],
        required: e,
      });
    },
    fetchtypelist() {
      fetchTypeList("association_table").then((res) => {
        console.log("res.data", res.data);
        let data = res.data.data;
        if (data == null) return;
        let arr = [];
        data.map((item) => {
          if (!item.archived) {
            arr.push(item);
          }
        });
        this.templateList = arr;
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
