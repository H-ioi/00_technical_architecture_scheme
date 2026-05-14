<template>
  <el-form
    ref="ruleForm"
    :label-position="'top'"
    :model="ruleForm"
    :rules="rules"
    class="activity-form"
    :class="{
      'activity-form--embedded': embedded,
      'activity-form--readonly': readonly || formReadonlyForTinymce,
    }"
  >
    <fieldset class="activity-form-fieldset" :disabled="fieldsetDisabled">
      <div class="activity-form-body">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="18">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('isagroup.中文名')"
                  prop="activityCnName"
                >
                  <el-input
                    v-model="ruleForm.activityCnName"
                    :placeholder="$t('consult.请输入')"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item
                  :label="$t('isagroup.英文名')"
                  prop="activityEnName"
                >
                  <el-input
                    v-model="ruleForm.activityEnName"
                    :placeholder="$t('consult.请输入')"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('isagroup.中文简介')" prop="introCn">
                  <el-input
                    v-model="ruleForm.introCn"
                    :placeholder="$t('consult.请输入')"
                    type="textarea"
                    rows="2"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('isagroup.英文简介')" prop="introEn">
                  <el-input
                    v-model="ruleForm.introEn"
                    :placeholder="$t('consult.请输入')"
                    type="textarea"
                    rows="2"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" :sm="6">
            <el-form-item :label="$t('isagroup.背景图')" prop="imageUrl">
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
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
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.中文地址')" prop="addressCn">
              <el-input
                v-model="ruleForm.addressCn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.英文地址')" prop="addressEn">
              <el-input
                v-model="ruleForm.addressEn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.中文提示')" prop="tipsCn">
              <el-input
                v-model="ruleForm.tipsCn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.英文提示')" prop="tipsEn">
              <el-input
                v-model="ruleForm.tipsEn"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="1"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.活动时间')" prop="activityTime">
              <el-date-picker
                v-model="ruleForm.activityTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :disabled="activityTimeRangeDisabled"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item
              :label="$t('isagroup.报名时间')"
              prop="registrationTime"
            >
              <el-date-picker
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
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item :label="$t('isagroup.活动校区')" prop="schoolIds">
              <el-select
                clearable
                collapse-tags
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolSelectList"
                  :label="schoolDropdownLabel(i)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item :label="$t('isagroup.签到方式')" prop="checkinMethod">
              <el-select
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
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item :label="$t('isagroup.票价')" prop="ticketPrice">
              <el-input-number
                v-model="ruleForm.ticketPrice"
                :precision="0"
                :step="0.01"
                :min="0"
                :placeholder="$t('consult.请输入')"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item :label="$t('isagroup.是否推荐')" prop="recommended">
              <el-select
                clearable
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
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item :label="$t('isagroup.是否Banner')" prop="banner">
              <el-select
                clearable
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
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item
              :label="$t('isagroup.是否需要反馈')"
              prop="needFeedback"
            >
              <el-select
                clearable
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
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="6">
            <el-form-item :label="$t('isagroup.微信提醒')" prop="wechatNotify">
              <el-select clearable v-model="ruleForm['wechatNotify']" :placeholder="$t('isagroup.请选择')"
                @change="changeWechatNotify">
                <el-option :key="k" v-for="(i, k) in consts['yesOrno']" :label="i18nlocel == 'en' ? i.enLabel : i.label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item
              :label="$t('isagroup.推送校区')"
              prop="wechatPushSchoolIds"
            >
              <el-select
                clearable
                collapse-tags
                v-model="ruleForm['wechatPushSchoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolSelectList"
                  :label="schoolDropdownLabel(i)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-form-item
              :label="$t('isagroup.推送邮箱')"
              prop="emailConfigIds"
            >
              <el-select
                clearable
                collapse-tags
                filterable
                v-model="ruleForm['emailConfigIds']"
                :placeholder="$t('common.请选择')"
                multiple
                @visible-change="onEmailConfigDropdownVisible"
              >
                <el-option
                  v-for="opt in emailConfigOptions"
                  :key="'ec-' + opt.id"
                  :label="opt.email"
                  :value="opt.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="16"
          type="flex"
          align="middle"
          class="activity-form__row--limit-scope"
        >
          <el-col :xs="24" :span="12">
            <el-form-item
              :label="$t('isagroup.报名人数限制')"
              prop="registrationLimit"
              class="activity-form-item--row-label"
            >
              <div class="activity-form-registration-limit">
                <el-radio-group
                  v-model="registrationUnlimited"
                  class="activity-form-registration-radios"
                >
                  <el-radio :label="true">{{ $t("isagroup.不限制") }}</el-radio>
                  <el-radio :label="false">{{
                    $t("isagroup.限制人数")
                  }}</el-radio>
                </el-radio-group>
                <el-input-number
                  v-if="!registrationUnlimited"
                  v-model="ruleForm.registrationLimit"
                  :min="1"
                  :precision="0"
                  :step="1"
                  controls-position="right"
                  class="activity-form-registration-cap"
                  :placeholder="$t('consult.请输入')"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :span="12">
            <el-form-item :label="$t('isagroup.可见范围')" prop="visibleScope">
              <el-radio-group
                v-model="ruleForm.visibleScope"
                class="activity-form-radio-group"
              >
                <el-radio :label="0">{{ $t("isagroup.公开") }}</el-radio>
                <el-radio :label="1">{{ $t("isagroup.指定") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="Number(ruleForm.visibleScope) === 1"
          :gutter="16"
          type="flex"
          align="middle"
          class="activity-form__row--limit-scope"
        >
          <el-col :xs="24" :span="24">
            <el-form-item
              :label="$t('isagroup.可见范围名单')"
              class="activity-form-item--action-only activity-form-item--row-label"
            >
              <div class="visible-scope-file-actions">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-download"
                  :disabled="fieldsetDisabled"
                  @click="handleDownloadVisibleScopeTemplate"
                  >{{ $t("isagroup.下载Excel模板") }}</el-button
                >
                <el-upload
                  class="visible-scope-upload"
                  :action="uploadAction"
                  :show-file-list="false"
                  accept=".xlsx,.xls"
                  :disabled="!ruleForm.id || fieldsetDisabled"
                  :http-request="handleImportVisibleScope"
                >
                  <el-button
                    size="small"
                    icon="el-icon-upload2"
                    :disabled="!ruleForm.id || fieldsetDisabled"
                    >{{ $t("isagroup.上传可见范围名单") }}</el-button
                  >
                </el-upload>
                <el-button
                  size="small"
                  icon="el-icon-view"
                  :disabled="!ruleForm.id || fieldsetDisabled"
                  @click="openVisibleScopeDrawer"
                  >查看名单</el-button
                >
                <span v-if="!ruleForm.id" class="visible-scope-tip">{{
                  $t("isagroup.保存活动后可上传名单")
                }}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item
              :label="$t('isagroup.推送内容')"
              prop="wechatPushContent"
            >
              <el-input
                v-model="ruleForm.wechatPushContent"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="2"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item
              :label="$t('isagroup.推送备注')"
              prop="wechatPushRemark"
            >
              <el-input
                v-model="ruleForm.wechatPushRemark"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="2"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="$t('isagroup.状态')" prop="activityStatus">
              <el-radio-group
                v-model="ruleForm['activityStatus']"
                class="activity-form-radio-group"
                :disabled="activityStatusRadiosDisabled"
              >
                <el-radio
                  v-for="(i, k) in activityStatusRadioOptions"
                  :key="k"
                  :label="i.value"
                  style="color: #999999"
                >
                  {{ i18nlocel === "en" ? i.enLabel : i.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="$t('isagroup.中文详情')" prop="detailCn">
              <TinymceCn
                ref="TinymceCn"
                :editor-id="'tinymce-cn'"
                :language="'zh_CN'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item :label="$t('isagroup.英文详情')" prop="detailEn">
              <TinymceEn
                ref="TinymceEn"
                :editor-id="'tinymce-en'"
                :language="'en'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </fieldset>
    <el-form-item v-if="!readonly && !hideFooter" class="modalFromBtn">
      <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
        $t("isagroup.确认")
      }}</el-button>
      <el-button type="default" size="medium" @click="closeModal">{{
        $t("isagroup.取消")
      }}</el-button>
    </el-form-item>
    <el-drawer
      title="可见范围名单"
      :visible.sync="visibleScopeDrawerVisible"
      size="640px"
      append-to-body
    >
      <div class="visible-scope-drawer">
        <el-table
          v-loading="visibleScopeLoading"
          :data="visibleScopeTableData"
          border
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column
            prop="mobile"
            label="手机号"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="170"
            show-overflow-tooltip
          />
        </el-table>
        <div class="visible-scope-drawer__footer">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="visibleScopePagination.current"
            :page-size="visibleScopePagination.size"
            :total="visibleScopePagination.total"
            @current-change="handleVisibleScopeCurrentChange"
          />
        </div>
      </div>
    </el-drawer>
  </el-form>
</template>

<script>
import {
  addActivity,
  downloadVisibleScopeTemplate,
  editActivity,
  getActivityDetail,
  getVisibleScopeListByFile,
  importVisibleScopeFile,
} from "@/api/isacommunity/activity.js";
import { getSchoolEmailConfigDetail, getSchoolEmailConfigList } from "@/api/isacommunity/schoolEmailConfig.js";
import IsaTinymce from "@/components/tinymce/isatinymce.vue";
import consts from "@/const/isacommunity/consts.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
import myRequest from "@/router/axiosother.js";
import { mapGetters } from "vuex";
export default {
  name: "operation",
  mixins: [schoolListBuscommonMixin],
  components: {
    TinymceCn: IsaTinymce,
    TinymceEn: IsaTinymce,
  },
  props: {
    /** 嵌入详情页 Tab 内，不使用 el-dialog */
    embedded: {
      type: Boolean,
      default: false,
    },
    /** 只读（查看）：禁用表单与上传等操作 */
    readonly: {
      type: Boolean,
      default: false,
    },
    /** 隐藏底部确认/取消（由页面标题栏统一保存/取消） */
    hideFooter: {
      type: Boolean,
      default: false,
    },
    /**
     * 活动状态（与 consts.activityStatus 一致），嵌入编辑时由详情页传入。
     * 0 待发布 1 已发布：仅锁活动时间；2 已开始 / 3 已结束：基本信息整表不可编辑。
     */
    activityStatus: {
      type: String,
      default: "",
    },
  },
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
      visibleScopeDrawerVisible: false,
      visibleScopeLoading: false,
      visibleScopeTableData: [],
      visibleScopePagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      emailConfigOptions: [],
    };
  },
  created() {
    this.rules = this.initRules();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    uploadAction() {
      return "/";
    },
    /** 与后端一致：0 表示不限制；>0 表示限制人数 */
    registrationUnlimited: {
      get() {
        return Number(this.ruleForm.registrationLimit) === 0;
      },
      set(on) {
        if (on) {
          this.$set(this.ruleForm, "registrationLimit", 0);
        } else {
          const n = Number(this.ruleForm.registrationLimit);
          this.$set(
            this.ruleForm,
            "registrationLimit",
            n > 0 && Number.isFinite(n) ? n : 1
          );
        }
        this.$nextTick(() => {
          this.$refs.ruleForm &&
            this.$refs.ruleForm.clearValidate("registrationLimit");
        });
      },
    },
    /** 新增可选：待发布、已发布；编辑展示全貌且不可改（含已开始、已结束） */
    activityStatusRadioOptions() {
      const full = Array.isArray(this.consts.activityStatus)
        ? this.consts.activityStatus
        : [];
      if (this.modalType === "add") {
        return full.filter((item) => item.value === "0" || item.value === "1");
      }
      return full;
    },
    activityStatusRadiosDisabled() {
      return this.readonly || this.modalType !== "add";
    },
    /** 嵌入详情且已开始/已结束：整表锁定 */
    embeddedBasicInfoLocked() {
      if (!this.embedded || this.readonly) {
        return false;
      }
      const s = String(this.activityStatus || "");
      return s === "2" || s === "3";
    },
    /** 待发布、已发布：仅活动时间不可改 */
    embeddedLockActivityTimeOnly() {
      if (!this.embedded || this.readonly) {
        return false;
      }
      const s = String(this.activityStatus || "");
      return s === "0" || s === "1";
    },
    fieldsetDisabled() {
      return this.readonly || this.embeddedBasicInfoLocked;
    },
    activityTimeRangeDisabled() {
      return (
        this.readonly ||
        this.embeddedBasicInfoLocked ||
        this.embeddedLockActivityTimeOnly
      );
    },
    /** 富文本只读样式（fieldset 對自定义编辑器可能无效） */
    formReadonlyForTinymce() {
      return this.readonly || this.embeddedBasicInfoLocked;
    },
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.rules = this.initRules();
      },
    },
    "ruleForm.schoolIds": {
      handler() {
        this.fetchEmailConfigOptions();
      },
      deep: true,
    },
  },
  methods: {
    initRules() {
      let that = this;
      return {
        activityCnName: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        activityEnName: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        introCn: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        introEn: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        addressCn: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        addressEn: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        tipsCn: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        tipsEn: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        schoolIds: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        checkinMethod: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],

        ticketPrice: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        registrationLimit: [
          {
            validator(rule, value, callback) {
              const n = Number(value);
              if (n === 0) {
                return callback();
              }
              if (!Number.isFinite(n) || n < 1) {
                return callback(new Error(that.$t("isagroup.请输入")));
              }
              return callback();
            },
            trigger: "blur",
          },
        ],
        recommended: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        banner: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        needFeedback: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        visibleScope: [
          {
            validator(rule, value, callback) {
              if (value !== 0 && value !== 1) {
                return callback(new Error(that.$t("isagroup.请选择")));
              }
              return callback();
            },
            trigger: "change",
          },
        ],
        // wechatNotify: [
        //   {
        //     required: true,
        //     message: that.$t("isagroup.请选择"),
        //     trigger: "blur",
        //   },
        // ],
        wechatPushSchoolIds: [
          {
            required: false,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        wechatPushContent: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        wechatPushRemark: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        activityStatus: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        detailCn: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        detailEn: [
          {
            required: false,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        activityTime: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        registrationTime: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        imageUrl: [
          {
            required: true,
            message: that.$t("isagroup.请上传"),
            trigger: "blur",
          },
        ],
      };
    },
    normalizeEmailConfigIds(raw) {
      if (raw == null || raw === "") {
        return [];
      }
      const arr = Array.isArray(raw) ? raw : [raw];
      return arr
        .map((item) => {
          const id =
            item != null &&
            typeof item === "object" &&
            !Array.isArray(item) &&
            "id" in item
              ? item.id
              : item;
          if (id == null || id === "") {
            return null;
          }
          const n = Number(id);
          return Number.isFinite(n) ? n : id;
        })
        .filter((id) => id != null && id !== "");
    },
    normalizeEmailConfigOptionRows(raw) {
      const list = Array.isArray(raw) ? raw : [];
      return list.map((o) => {
        if (!o || typeof o !== "object") {
          return o;
        }
        const idRaw = o.id;
        const idNum = Number(idRaw);
        const id = Number.isFinite(idNum) ? idNum : idRaw;
        return { ...o, id };
      });
    },
    async fetchEmailConfigOptions() {
      const params = { appModule: "1" };
      const schoolIds = Array.isArray(this.ruleForm.schoolIds)
        ? this.ruleForm.schoolIds.filter((id) => id != null && id !== "")
        : [];
      if (schoolIds.length) {
        params.schoolIds = schoolIds;
      }
      try {
        const res = await getSchoolEmailConfigList(params);
        if (res.data && res.data.success) {
          this.emailConfigOptions = this.normalizeEmailConfigOptionRows(
            res.data.data
          );
        } else {
          this.emailConfigOptions = [];
        }
      } catch (e) {
        this.emailConfigOptions = [];
      }
      await this.mergeMissingEmailConfigOptions();
    },
    async mergeMissingEmailConfigOptions() {
      const selected = Array.isArray(this.ruleForm.emailConfigIds)
        ? this.ruleForm.emailConfigIds.filter(
            (id) => id != null && id !== ""
          )
        : [];
      if (!selected.length) {
        return;
      }
      const have = new Set(
        this.emailConfigOptions.map((o) =>
          o && o.id != null ? String(o.id) : ""
        )
      );
      const missing = selected.filter((id) => !have.has(String(id)));
      if (!missing.length) {
        return;
      }
      try {
        const rows = await Promise.all(
          missing.map((id) =>
            getSchoolEmailConfigDetail(id)
              .then((res) => {
                if (res.data && res.data.success && res.data.data) {
                  return res.data.data;
                }
                return null;
              })
              .catch(() => null)
          )
        );
        const normalized = this.normalizeEmailConfigOptionRows(
          rows.filter(Boolean)
        );
        if (normalized.length) {
          const existing = new Set(
            this.emailConfigOptions.map((o) =>
              o && o.id != null ? String(o.id) : ""
            )
          );
          const add = normalized.filter(
            (o) => o && o.id != null && !existing.has(String(o.id))
          );
          if (add.length) {
            this.emailConfigOptions = [...add, ...this.emailConfigOptions];
          }
        }
      } catch (e) {
        /* 忽略补齐失败 */
      }
    }, // end mergeMissingEmailConfigOptions

    /** 详情接口 emailConfigEmails 与 id 按下标对齐，用于下拉立即显示邮箱文案 */
    seedEmailConfigOptionsFromDetail(rawIds, rawEmails) {
      const ids = this.normalizeEmailConfigIds(rawIds);
      const emails = Array.isArray(rawEmails) ? rawEmails : [];
      if (!ids.length) {
        return;
      }
      const rows = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const em = emails[i];
        const email =
          em != null && String(em).trim() !== "" ? String(em).trim() : "";
        if (!email) {
          continue;
        }
        rows.push({ id, email });
      }
      if (!rows.length) {
        return;
      }
      const normalized = this.normalizeEmailConfigOptionRows(rows);
      const existing = new Set(
        this.emailConfigOptions.map((o) =>
          o && o.id != null ? String(o.id) : ""
        )
      );
      const add = normalized.filter(
        (o) => o && o.id != null && !existing.has(String(o.id))
      );
      if (add.length) {
        this.emailConfigOptions = [...add, ...this.emailConfigOptions];
      }
    },
    onEmailConfigDropdownVisible(visible) {
      if (visible) {
        this.fetchEmailConfigOptions();
      }
    },
    // 打开
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      } else {
        this.ruleForm = {
          ...this.ruleForm,
          activityStatus: "0",
          registrationLimit: 0,
          visibleScope: 0,
          emailConfigIds: [],
        };
        this.$nextTick(() => {
          this.fetchEmailConfigOptions();
        });
      }
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
              // wechatNotify,
              wechatPushSchoolIds,
              wechatPushContent,
              wechatPushRemark,
              activityStatus: activityStatusFromApi,
              detailCn,
              detailEn,
              activityStartTime,
              activityEndTime,
              registrationStartTime,
              registrationEndTime,
              imageUrl,
              registrationLimit: registrationLimitFromApi,
              visibleScopeFile,
              emailConfigIds,
              emailConfigEmails,
              visibleScope,
            } = res.data.data;
            this.$nextTick(() => {
              const raw =
                registrationLimitFromApi === null ||
                registrationLimitFromApi === undefined
                  ? 0
                  : Number(registrationLimitFromApi);
              const regLimit = Number.isFinite(raw) ? raw : 0;
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
                registrationLimit: regLimit,
                recommended: String(recommended),
                banner: String(banner),
                needFeedback: String(needFeedback),
                // wechatNotify: String(wechatNotify),
                wechatPushSchoolIds,
                wechatPushContent,
                wechatPushRemark,
                activityStatus:
                  activityStatusFromApi !== undefined &&
                  activityStatusFromApi !== null &&
                  activityStatusFromApi !== ""
                    ? String(activityStatusFromApi)
                    : "0",
                activityTime: [activityStartTime, activityEndTime],
                registrationTime: [registrationStartTime, registrationEndTime],
                imageUrl,
                visibleScopeFile,
                emailConfigIds: this.normalizeEmailConfigIds(emailConfigIds),
                visibleScope:
                  visibleScope !== undefined &&
                  visibleScope !== null &&
                  visibleScope !== ""
                    ? Number(visibleScope)
                    : 0,
              };
              // this.changeWechatNotify(this.ruleForm.wechatNotify);
              this.$refs.TinymceCn.value = detailCn;
              this.$refs.TinymceEn.value = detailEn;
              (async () => {
                await this.fetchEmailConfigOptions();
                this.seedEmailConfigOptionsFromDetail(
                  emailConfigIds,
                  emailConfigEmails
                );
              })();
            });
          });
        }
      });
    },
    submitForm(formName) {
      if (
        this.readonly ||
        this.isSubmitting ||
        this.embeddedBasicInfoLocked
      ) {
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
          delete data.wechatNotify;
          this.$refs.ruleForm.clearValidate();
          if (this.modalType == "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        }
      });
    },

    /**
     * 从 Content-Disposition 解析文件名（支持 filename= 与 RFC5987 filename*）
     */
    parseFilenameFromContentDisposition(header) {
      if (!header || typeof header !== "string") {
        return null;
      }
      const star = /filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i.exec(header);
      if (star && star[1]) {
        const raw = star[1].trim().replace(/^["']|["']$/g, "");
        try {
          return decodeURIComponent(raw);
        } catch (e) {
          return raw;
        }
      }
      const quoted = /filename\s*=\s*"((?:\\.|[^"\\])*)"/i.exec(header);
      if (quoted && quoted[1]) {
        return quoted[1].replace(/\\(.)/g, "$1");
      }
      const plain = /filename\s*=\s*([^;\n]+)/i.exec(header);
      if (plain && plain[1]) {
        const raw = plain[1].trim().replace(/^["']|["']$/g, "");
        try {
          return decodeURIComponent(raw);
        } catch (e) {
          return raw;
        }
      }
      return null;
    },

    async handleDownloadVisibleScopeTemplate() {
      if (this.readonly || this.embeddedBasicInfoLocked) {
        return;
      }
      try {
        const res = await downloadVisibleScopeTemplate();
        const cd =
          res.headers["content-disposition"] ||
          res.headers["Content-Disposition"] ||
          "";
        const filename =
          this.parseFilenameFromContentDisposition(cd) ||
          "visible-scope-template.xlsx";
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        this.$message.error(this.$t("isagroup.失败"));
      }
    },

    handleImportVisibleScope(req) {
      if (this.readonly || this.embeddedBasicInfoLocked) {
        return;
      }
      const file = req.file;
      if (!this.ruleForm.id) {
        this.$message.warning(this.$t("isagroup.保存活动后可上传名单"));
        return;
      }
      importVisibleScopeFile(this.ruleForm.id, file)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.getDetail(this.ruleForm.id);
          }
        })
        .catch(() => {});
    },

    openVisibleScopeDrawer() {
      const fileId =
        this.ruleForm.visibleScopeFile && this.ruleForm.visibleScopeFile.id;
      if (!fileId) {
        this.$message.warning("请先上传可见范围名单");
        return;
      }
      this.visibleScopeDrawerVisible = true;
      this.visibleScopePagination.current = 1;
      this.getVisibleScopeFileList();
    },

    getVisibleScopeFileList() {
      const fileId =
        this.ruleForm.visibleScopeFile && this.ruleForm.visibleScopeFile.id;
      if (!fileId) {
        this.visibleScopeTableData = [];
        this.visibleScopePagination.total = 0;
        return;
      }
      this.visibleScopeLoading = true;
      getVisibleScopeListByFile({
        fileId,
        current: this.visibleScopePagination.current,
        size: this.visibleScopePagination.size,
      })
        .then((res) => {
          if (res.data.success) {
            const page = res.data.data || {};
            this.visibleScopeTableData = Array.isArray(page.data)
              ? page.data
              : [];
            this.visibleScopePagination.total = Number(page.total) || 0;
          }
        })
        .finally(() => {
          this.visibleScopeLoading = false;
        });
    },

    handleVisibleScopeCurrentChange(page) {
      this.visibleScopePagination.current = page;
      this.getVisibleScopeFileList();
    },

    addData(data) {
      addActivity(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            const raw = res.data.data;
            const newId =
              raw && typeof raw === "object" && raw !== null && "id" in raw
                ? raw.id
                : raw;
            if (this.embedded) {
              this.$emit("saved", newId);
            } else {
              this.closeModal();
            }
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
            if (this.embedded) {
              this.$emit("saved");
            } else {
              this.closeModal();
            }
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
    // 关闭（弹窗 before-close 会传入 done）
    closeModal(done) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      this.showModal = false;
      this.ruleForm = {};
      this.isSubmitting = false;
      if (this.embedded) {
        this.$emit("cancel");
      }
      if (typeof done === "function") {
        done();
      }
    },
    async beforeUpload(file) {
      if (this.readonly || this.embeddedBasicInfoLocked) {
        return false;
      }
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
      return false;
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
.activity-form-fieldset {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.activity-form-registration-limit {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.activity-form-registration-radios {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 12px;
  line-height: 1;
  margin: 0;
  padding: 0;
  vertical-align: middle;
}

.activity-form-registration-radios ::v-deep .el-radio {
  margin-right: 0;
  line-height: 32px;
  white-space: nowrap;
}

.activity-form-registration-cap {
  flex: 0 0 auto;
  width: 140px;
  max-width: 100%;
}

.activity-form {
  width: 100%;
  box-sizing: border-box;

  ::v-deep .el-form-item {
    width: 100%;
    box-sizing: border-box;
  }

  ::v-deep .el-form-item__content {
    width: 100%;
    box-sizing: border-box;
  }

  ::v-deep .el-form-item--small.el-form-item {
    margin-right: 0;
    padding-right: 0;
    box-sizing: border-box;
  }

  .activity-form-body {
    width: 100%;
    max-height: 600px;
    overflow-y: auto;
    padding-right: 4px;
    box-sizing: border-box;

    /* 本行表单项：标签与控件同一行（覆盖 el-form 的 label-top + 子项 100% 宽） */
    .activity-form__row--limit-scope {
      /* community/common.scss 内全局隐藏了 .el-input-number 的增减按钮，此处仅恢复本字段 */
      ::v-deep .el-input-number.activity-form-registration-cap {
        .el-input-number__decrease,
        .el-input-number__increase {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
      }

      ::v-deep .el-form-item.activity-form-item--row-label {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
      }

      ::v-deep
        .el-form-item.activity-form-item--row-label
        .el-form-item__label {
        float: none !important;
        display: inline-flex !important;
        align-items: center;
        line-height: 1.3;
        padding: 0 10px 0 0 !important;
        text-align: left;
        width: auto !important;
        flex: 0 0 auto;
        min-width: 0;
        max-width: 10em;
        white-space: normal;
        word-break: break-word;
      }

      ::v-deep
        .el-form-item.activity-form-item--row-label
        .el-form-item__content {
        margin-left: 0 !important;
        display: block;
        flex: 1;
        min-width: 0;
        line-height: normal;
        width: auto !important;
      }

      /* 覆盖本行 .el-form-item__content>div 的 100% 宽，与开关+数字同排不撑满 */
      ::v-deep .el-col {
        .el-form-item--row-label .el-form-item__content > div {
          width: auto !important;
          max-width: 100%;
        }
      }
    }

    ::v-deep .el-form-item {
      width: 100%;
      box-sizing: border-box;
    }

    ::v-deep .el-form-item__content {
      width: 100%;
      box-sizing: border-box;
    }

    ::v-deep .el-date-editor--datetimerange.el-input__inner,
    ::v-deep .el-select {
      width: 100% !important;
      box-sizing: border-box;
    }

    ::v-deep .el-col {
      .el-radio-group.activity-form-radio-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
      }

      .tox-tinymce {
        width: 100% !important;
        box-sizing: border-box;
      }

      .el-form-item__content > div {
        width: 100%;
        box-sizing: border-box;
      }

      .avatar-uploader {
        display: block;
        width: 100%;

        .el-upload {
          width: 100%;
          box-sizing: border-box;
        }
      }

      .avatar-uploader-icon {
        width: 100% !important;
        min-height: 140px;
        height: auto !important;
        line-height: 140px !important;
        box-sizing: border-box;
      }

      .avatar {
        width: 100%;
        max-width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  &.activity-form--embedded .activity-form-body {
    max-height: none;
  }

  &.activity-form--readonly ::v-deep .tox-tinymce {
    pointer-events: none;
    opacity: 0.85;
  }

  .modalFromBtn {
    width: 100%;
    box-sizing: border-box;

    ::v-deep .el-form-item__content {
      width: 100%;
    }
  }

  .activity-form-item--action-only {
    margin-bottom: 18px;

    ::v-deep .el-form-item__content {
      width: 100%;
    }
  }

  .visible-scope-file-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .visible-scope-upload {
    display: inline-block;
  }

  .visible-scope-tip {
    font-size: 12px;
    color: #909399;
  }
}

.visible-scope-drawer {
  padding: 0 20px;
}

.visible-scope-drawer__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  overflow-x: auto;
}
</style>
