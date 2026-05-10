<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="80%"
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
              :label="$t('isagroup.中文名')"
              prop="activityCnName"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.activityCnName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文名')"
              prop="activityEnName"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.activityEnName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.背景图')"
              prop="imageUrl"
              style="width: 100%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="ruleForm['imageUrl']"
                  :src="ruleForm['imageUrl']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.中文简介')"
              prop="introCn"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.introCn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="2"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文简介')"
              prop="introEn"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.introEn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="2"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.中文地址')"
              prop="addressCn"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.addressCn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文地址')"
              prop="addressEn"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.addressEn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.中文提示')"
              prop="tipsCn"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.tipsCn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文提示')"
              prop="tipsEn"
              style="width: 50%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.tipsEn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.活动时间')"
              prop="activityTime"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.activityTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.报名时间')"
              prop="registrationTime"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.registrationTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.活动校区')"
              prop="schoolIds"
              style="width: 25%"
            >
              <el-select
                clearable
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
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
              :label="$t('isagroup.签到方式')"
              prop="checkinMethod"
              style="width: 25%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['checkinMethod']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['activityCheckinMethod']"
                  :label="i18nlocel == 'en' ? i.enLabel : i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.票价')"
              prop="ticketPrice"
              style="width: 25%"
            >
              <el-input-number
                style="width: 100%"
                v-model="ruleForm.ticketPrice"
                :precision="0"
                :step="0.01"
                :min="0"
                :placeholder="$t('consult.请输入')"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否推荐')"
              prop="recommended"
              style="width: 25%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['recommended']"
                :placeholder="$t('isagroup.请选择')"
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
              :label="$t('isagroup.是否Banner')"
              prop="banner"
              style="width: 25%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['banner']"
                :placeholder="$t('isagroup.请选择')"
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
              :label="$t('isagroup.是否需要反馈')"
              prop="needFeedback"
              style="width: 25%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['needFeedback']"
                :placeholder="$t('isagroup.请选择')"
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
              :label="$t('isagroup.微信提醒')"
              prop="wechatNotify"
              style="width: 25%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['wechatNotify']"
                :placeholder="$t('isagroup.请选择')"
                @change="changeWechatNotify"
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
              :label="$t('isagroup.推送校区')"
              prop="wechatPushSchoolIds"
              style="width: 25%"
            >
              <el-select
                clearable
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['wechatPushSchoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
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
              :label="$t('isagroup.推送内容')"
              prop="wechatPushContent"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.wechatPushContent"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="2"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.推送备注')"
              prop="wechatPushRemark"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.wechatPushRemark"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="2"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.状态')"
              prop="activityStatus"
              style="width: 100%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['activityStatus']">
                <el-radio :label="0" style="color: 999999">{{
                  $t("isagroup.待发布")
                }}</el-radio>
                <el-radio :label="1" style="color: 999999">{{
                  $t("isagroup.已发布")
                }}</el-radio>
              </el-radio-group>
              <!-- <el-select
                style="width: 100%"
                v-model="ruleForm['activityStatus']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['activityStatus']"
                  :label="i18nlocel == 'en' ? i.enLabel : i.label"
                  :value="i.id"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.中文详情')"
              prop="detailCn"
              style="width: 100%"
            >
              <!-- 富文本输入 -->
              <TinymceCn ref="TinymceCn" :editor-id="'tinymce-cn'" :language="'zh_CN'" />
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文详情')"
              prop="detailEn"
              style="width: 100%"
            >
              <!-- 富文本输入 -->
              <TinymceEn ref="TinymceEn" :editor-id="'tinymce-en'" :language="'en'" />
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("isagroup.确认")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
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
  addActivity,
  editActivity,
  getActivityDetail,
} from "@/api/isacommunity/activity.js";
import myRequest from "@/router/axiosother.js";
import consts from "@/const/isacommunity/consts.js";
import TinymceCn from "@/components/tinymce/isatinymce.vue";
import TinymceEn from "@/components/tinymce/isatinymce.vue";
export default {
  name: "operation",
  components: { TinymceCn, TinymceEn },
  props: {},
  data() {
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {},
      schoolList: [],
      isSubmitting: false,
    };
  },
  created() {
    this.rules = this.initRules();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.rules = this.initRules();
      },
    },
  },
  methods: {
    initRules() {
      let that = this;
      return {
        activityCnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        activityEnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        introCn: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        introEn: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        addressCn: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        addressEn: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        tipsCn: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        tipsEn: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        checkinMethod: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],

        ticketPrice: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        recommended: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        banner: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        needFeedback: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        wechatNotify: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        wechatPushSchoolIds: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        wechatPushContent: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        wechatPushRemark: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        activityStatus: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        detailCn: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        detailEn: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        activityTime: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        registrationTime: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        imageUrl: [
          { required: true, message: that.$t("isagroup.请上传"), trigger: "blur" },
        ],
      };
    },
    // 打开
    async showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      } else {
        this.ruleForm = {
          ...this.ruleForm,
          activityStatus: 0,
        };
      }
    },
    // 新增
    addData(data) {
      addActivity(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editActivity(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getActivityDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let {
              activityCnName,
              activityEnName,
              introCn,
              introEn,
              addressCn,
              addressEn,
              tipsCn,
              tipsEn,
              schoolIds,
              checkinMethod,
              ticketPrice,
              recommended,
              banner,
              needFeedback,
              wechatNotify,
              wechatPushSchoolIds,
              wechatPushContent,
              wechatPushRemark,
              activityStatus,
              detailCn,
              detailEn,
              registrationTime,
              activityStartTime,
              activityEndTime,
              registrationStartTime,
              registrationEndTime,
              imageUrl,
            } = res.data.data;
            this.$nextTick(() => {
              this.ruleForm = {
                ...this.ruleForm,
                id,
                activityCnName,
                activityEnName,
                introCn,
                introEn,
                addressCn,
                addressEn,
                tipsCn,
                tipsEn,
                schoolIds,
                checkinMethod: String(checkinMethod),
                ticketPrice,
                recommended: String(recommended),
                banner: String(banner),
                needFeedback: String(needFeedback),
                wechatNotify: String(wechatNotify),
                wechatPushSchoolIds,
                wechatPushContent,
                wechatPushRemark,
                activityStatus,
                registrationTime,
                activityTime: [activityStartTime, activityEndTime],
                registrationTime: [registrationStartTime, registrationEndTime],
                imageUrl,
              };
              this.changeWechatNotify(this.ruleForm.wechatNotify);
              this.$refs.TinymceCn.value = detailCn;
              this.$refs.TinymceEn.value = detailEn;
            });
          });
        }
      });
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }

      this.ruleForm.detailCn = this.$refs.TinymceCn.value;
      this.ruleForm.detailEn = this.$refs.TinymceEn.value;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置提交状态为true
          this.isSubmitting = true;

          console.log("submitForm", valid, this.modalType);
          let data = {
            ...this.ruleForm,
            activityStartTime: this.ruleForm.activityTime[0],
            activityEndTime: this.ruleForm.activityTime[1],
            registrationStartTime: this.ruleForm.registrationTime[0],
            registrationEndTime: this.ruleForm.registrationTime[1],
          };
          delete data.activityTime;
          delete data.registrationTime;
          this.$refs.ruleForm.clearValidate();
          if (this.modalType == "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        }
      });
    },

    addData(data) {
      addActivity(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    editData(data) {
      editActivity(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    // 微信通知改变
    changeWechatNotify(e) {
      this.$set(this.rules["wechatPushSchoolIds"][0], "required", e == "1");
      this.$set(this.rules["wechatPushContent"][0], "required", e == "1");
      this.$set(this.rules["wechatPushRemark"][0], "required", e == "1");
      if (e == "0") {
        this.ruleForm.wechatPushSchoolIds = [];
        this.ruleForm.wechatPushContent = "";
        this.ruleForm.wechatPushRemark = "";
      }
    },
    // 关闭
    closeModal() {
      this.$refs.ruleForm.resetFields();
      this.showModal = false;
      this.ruleForm = {};
      this.isSubmitting = false;
    },
    async beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      if (isJPG && isLt20M) {
        this.ruleForm = {
          ...this.ruleForm,
          imageUrl: await this.uploadfile(file),
        };
      }
    },
    async uploadfile(file) {
      let formData = new FormData();
      formData.append("prefix", "parent_weapp_upload");
      formData.append("file", file);
      const response = await myRequest.upload(formData);
      return response.data.url;
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
