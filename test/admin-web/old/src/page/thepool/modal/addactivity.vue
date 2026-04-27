<template>
  <div class="thepool_page">
    <el-dialog
      :title="type == 'add' ? $t('consult.新增') : $t('consult.编辑')"
      :visible="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          v-if="showModal"
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.活动名称')"
              prop="activityName"
              style="width: 50%"
            >
              <el-input
                v-model="ruleForm.activityName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.活动类型')"
              prop="activityType"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.activityType"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictionary['activity_type']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="String(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.活动负责人')"
              prop="managerId"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.managerId"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="String(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.活动校区')"
              prop="schools"
              style="width: 50%"
            >
              <el-select
                multiple
                v-model="ruleForm.schools"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="String(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.活动时间')"
              prop="activityTime"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.activityTime"
                type="datetimerange"
                range-separator="-"
                :start-placeholder="$t('consult.开始时间')"
                :end-placeholder="$t('consult.结束时间')"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.活动详情')"
              prop="activityDetails"
              style="width: 80%"
            >
              <el-input
                v-model="ruleForm.activityDetails"
                :placeholder="$t('consult.请输入')"
                maxlength="300"
                type="textarea"
                :rows="5"
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
import { consult } from "@/const/consult/index.js";
import { addActivity, editActivity, getActivityDetail } from "@/api/consult/activity.js";
export default {
  name: "guardians",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      type: "add",
      showModal: false,
      ruleForm: {
        activityName: "",
        activityType: "",
        startDate: "",
        endDate: "",
        managerId: "",
        schools: [],
        activityDetails: "",
        activityTime: [],
      },
      rules: {
        activityName: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
        activityType: [
          { required: true, message: that.$t("consult.请选择"), trigger: "change" },
        ],
        activityTime: [
          { required: true, message: that.$t("consult.请选择"), trigger: "change" },
        ],
        managerId: [
          { required: true, message: that.$t("consult.请选择"), trigger: "change" },
        ],
        schools: [
          { required: true, message: that.$t("consult.请选择"), trigger: "change" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "pooldictpermissions",
      "permissions",
      "dictionary",
      "i18nlocel",
      "userList",
    ]),
  },
  methods: {
    show(schoolId) {
      this.showModal = true;
      this.$nextTick(() => {
        this.ruleForm = {
          ...this.ruleForm,
          schools: [schoolId],
        };
      });
    },
    add(data) {
      addActivity(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    edit(data) {
      editActivity(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getActivityDetail(id).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.type = "edit";
          this.showModal = true;
          this.$nextTick(async () => {
            this.ruleForm = {
              id: data["id"],
              activityName: data["activityName"],
              activityType: data["activityType"],
              //   startDate: data["startDate"],
              //   endDate: data["endDate"],
              managerId: data["managerId"],
              schools: data["schools"],
              activityDetails: data["activityDetails"],
              activityTime: [data["startDate"], data["endDate"]],
            };
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setData();
        } else {
          return false;
        }
      });
    },
    async setData() {
      let data = {
        ...this.ruleForm,
        startDate: this.ruleForm["activityTime"][0],
        endDate: this.ruleForm["activityTime"][1],
      };
      delete data["activityTime"];
      if (this.type == "add") {
        this.add(data);
      } else {
        this.edit(data);
      }
    },
    closeModal() {
      this.type = "add";
      this.ruleForm = {
        activityName: "",
        activityType: "",
        managerId: "",
        schools: [],
        activityDetails: "",
        activityTime: [],
      };
      this.showModal = false;
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
