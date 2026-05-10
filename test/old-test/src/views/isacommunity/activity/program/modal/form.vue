<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1000px"
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
            <el-form-item :label="$t('isagroup.中文名')" prop="cnName" style="width: 50%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.英文名')" prop="enName" style="width: 50%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.活动')"
              prop="activityId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['activityId']"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in activityList"
                  :label="i18nlocel == 'en' ? i.activityEnName : i.activityCnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              :label="$t('isagroup.状态')"
              prop="programName"
              style="width: 25%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm['programStatus']"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['programStatus']"
                  :label="i18nlocel == 'en' ? i.enLabel : i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item
              :label="$t('isagroup.背景图')"
              prop="backgroundImage"
              style="width: 100%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="ruleForm['backgroundImage']"
                  :src="ruleForm['backgroundImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.项目类型')"
              prop="programName"
              style="width: 100%"
            >
              <el-radio-group
                @change="changeProgram"
                style="width: 100%"
                v-model="ruleForm['programType']"
              >
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['programType']"
                  :label="i.id"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <div
              class="df_center_wrap"
              style="width: 100%"
              v-if="ruleForm['programType'] == '1'"
            >
              <el-form-item
                :label="$t('isagroup.是否需要支付')"
                prop="needPayment"
                style="width: 50%"
              >
                <el-radio-group style="width: 100%" v-model="ruleForm['needPayment']">
                  <el-radio
                    :key="k"
                    v-for="(i, k) in consts['yesOrno']"
                    :label="i.id"
                    style="color: 999999"
                    >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.是否需要签到')"
                prop="needCheckin"
                style="width: 50%"
              >
                <el-radio-group style="width: 100%" v-model="ruleForm['needCheckin']">
                  <el-radio
                    :key="k"
                    v-for="(i, k) in consts['yesOrno']"
                    :label="i.id"
                    style="color: 999999"
                    >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.签到开始偏移分钟')"
                prop="checkinStartOffsetMinutes"
                style="width: 50%"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="ruleForm.checkinStartOffsetMinutes"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :placeholder="$t('consult.请输入')"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.签到结束偏移分钟')"
                prop="checkinEndOffsetMinutes"
                style="width: 50%"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="ruleForm.checkinEndOffsetMinutes"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :placeholder="$t('consult.请输入')"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.是否创建获奖池')"
                prop="createLotteryPool"
                style="width: 50%"
              >
                <el-radio-group
                  style="width: 100%"
                  v-model="ruleForm['createLotteryPool']"
                >
                  <el-radio
                    :key="k"
                    v-for="(i, k) in consts['yesOrno']"
                    :label="i.id"
                    style="color: 999999"
                    >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.抽奖识别码')"
                prop="lotteryIdentifierType"
                style="width: 50%"
              >
                <el-radio-group
                  style="width: 100%"
                  v-model="ruleForm['lotteryIdentifierType']"
                >
                  <el-radio
                    :key="k"
                    v-for="(i, k) in consts['lotteryIdentifierType']"
                    :label="i.id"
                    style="color: 999999"
                    >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.参与抽奖人员范围')"
                prop="lotteryParticipantScope"
                style="width: 50%"
              >
                <el-radio-group
                  style="width: 100%"
                  v-model="ruleForm['lotteryParticipantScope']"
                >
                  <el-radio
                    :key="k"
                    v-for="(i, k) in consts['lotteryParticipantScope']"
                    :label="i.id"
                    style="color: 999999"
                    >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.项目轮次总数')"
                prop="totalRounds"
                style="width: 100%"
              >
                <el-input-number
                  style="width: 50%"
                  v-model="ruleForm.totalRounds"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :placeholder="$t('consult.请输入')"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.奖品数量')"
                prop="prizeCount"
                style="width: 100%"
              >
                <el-input-number
                  style="width: 50%"
                  v-model="ruleForm.prizeCount"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :placeholder="$t('consult.请输入')"
                ></el-input-number>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.每轮配额')"
                prop="quotas"
                style="width: 100%"
              >
                <div style="width: 100%">
                  <div
                    v-for="(item, index) in quotasList"
                    :key="index"
                    style="margin-bottom: 10px"
                  >
                    <span style="margin-right: 10px">{{ item.roundNo }}:</span>
                    <el-input-number
                      style="width: 50%"
                      v-model="item.quotaCount"
                      :precision="0"
                      :step="1"
                      :min="1"
                      :placeholder="$t('consult.请输入')"
                    ></el-input-number>
                  </div>
                  <div
                    v-if="quotasList.length > 0"
                    style="color: #f56c6c; margin-top: 5px"
                  >
                    {{ quotaErrorMsg }}
                  </div>
                </div>
              </el-form-item>
            </div>
            <div
              class="df_center_wrap"
              style="width: 100%"
              v-if="ruleForm['programType'] == '2'"
            >
              <el-form-item
                :label="$t('isagroup.是否需要投票')"
                prop="needVote"
                style="width: 50%"
              >
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="ruleForm['needVote']"
                  :placeholder="$t('isagroup.请选择')"
                >
                  <el-option
                    v-for="(i, k) in consts['yesOrno']"
                    :label="i18nlocel == 'en' ? i.enLabel : i.label"
                    :value="i.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.单次可投票数量')"
                prop="votePerAttemptCount"
                style="width: 50%"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="ruleForm.votePerAttemptCount"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :placeholder="$t('consult.请输入')"
                ></el-input-number>
              </el-form-item>

              <el-form-item
                :label="$t('isagroup.开始时间')"
                prop="voteStartTime"
                style="width: 50%"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="ruleForm.voteStartTime"
                  type="datetime"
                  :placeholder="$t('consult.请选择')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.结束时间')"
                prop="voteEndTime"
                style="width: 50%"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="ruleForm.voteEndTime"
                  type="datetime"
                  :placeholder="$t('consult.请选择')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                :label="$t('isagroup.获奖名额')"
                prop="prizeCount"
                style="width: 50%"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="ruleForm.prizeCount"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :placeholder="$t('consult.请输入')"
                ></el-input-number>
              </el-form-item>
            </div>
            <div
              class="df_center_wrap"
              style="width: 100%"
              v-if="ruleForm['programType'] == '3'"
            >
              <el-form-item
                :label="$t('isagroup.祝福语展示规则')"
                prop="blessingDisplayRule"
                style="width: 100%"
              >
                <el-radio-group
                  style="width: 100%"
                  v-model="ruleForm['blessingDisplayRule']"
                >
                  <el-radio
                    :key="k"
                    v-for="(i, k) in consts['blessingDisplayRule']"
                    :label="i.id"
                    style="color: 999999"
                    >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
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
import { getActivityList } from "@/api/isacommunity/activity.js";
import {
  addActivityProgram,
  editActivityProgram,
  getActivityProgramDetail,
} from "@/api/isacommunity/activityprogram.js";
import myRequest from "@/router/axiosother.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {},
      activityList: [],
      quotasList: [],
      quotaErrorMsg: "",
      isSubmitting: false,
    };
  },
  created() {
    this.rules = this.initRules();
    this.initData();
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
    // 监听总轮数变化，动态生成配额列表
    "ruleForm.totalRounds": function (newVal) {
      const totalRounds = parseInt(newVal) || 0;
      const currentLength = this.quotasList.length;

      if (totalRounds > currentLength) {
        // 增加配额输入框
        for (let i = currentLength; i < totalRounds; i++) {
          this.quotasList.push({
            roundNo: i + 1,
            quotaCount: 1, // 默认值为1
          });
        }
      } else if (totalRounds < currentLength) {
        // 减少配额输入框
        this.quotasList.splice(totalRounds);
      }

      this.validateQuotas(); // 验证配额
    },
    // 监听配额数量变化，进行验证
    quotasList: {
      handler: function () {
        this.validateQuotas();
      },
      deep: true,
    },
    // 监听奖品数量变化，重新验证配额
    "ruleForm.prizeCount": function () {
      this.validateQuotas();
    },
    // 新增：监听needVote变化，动态修改votePerAttemptCount的必填属性
    "ruleForm.needVote": function (newVal) {
      this.$set(this.rules["votePerAttemptCount"][0], "required", newVal === "1");
    },
  },
  methods: {
    initRules() {
      let that = this;
      return {
        activityId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        // programStatus: [
        //   { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        // ],
        programType: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],

        backgroundImage: [
          { required: true, message: that.$t("isagroup.请上传"), trigger: "blur" },
        ],
        // 抽奖类规则
        createLotteryPool: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        lotteryIdentifierType: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        lotteryParticipantScope: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        needCheckin: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        needPayment: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        prizeCount: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        checkinEndOffsetMinutes: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        checkinStartOffsetMinutes: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        totalRounds: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        quotas: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        // 比赛类规则
        needVote: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        voteStartTime: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        voteEndTime: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        votePerAttemptCount: [
          { required: false, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        // 祝福类规则
        blessingDisplayRule: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      };
    },
    async initData() {
      this.activityList = await getActivityList();
    },
    // 打开
    async showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    // 新增
    addData(data) {
      addActivityProgram(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editActivityProgram(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getActivityProgramDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            activityId,
            cnName,
            enName,
            backgroundImage,
            programType,
            totalRounds,
            rule,
            quotas = [], // 获取配额数据
          } = res.data.data;

          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              activityId,
              cnName,
              enName,
              backgroundImage,
              programType: String(programType),
              totalRounds: String(totalRounds),
            };
            switch (String(programType)) {
              case "1":
                this.ruleForm = {
                  ...this.ruleForm,
                  createLotteryPool: String(rule["createLotteryPool"]),
                  lotteryIdentifierType: String(rule["lotteryIdentifierType"]),
                  lotteryParticipantScope: String(rule["lotteryParticipantScope"]),
                  needCheckin: String(rule["needCheckin"]),
                  needPayment: String(rule["needPayment"]),
                  prizeCount: String(rule["prizeCount"]),
                  checkinEndOffsetMinutes: String(rule["checkinEndOffsetMinutes"]),
                  checkinStartOffsetMinutes: String(rule["checkinStartOffsetMinutes"]),
                };
                // 初始化配额列表
                this.quotasList = [];
                if (quotas && quotas.length > 0) {
                  // 如果有配额数据，使用现有数据
                  this.quotasList = quotas.map((item) => ({
                    roundNo: parseInt(item.roundNo),
                    quotaCount: parseInt(item.quotaCount),
                  }));
                } else if (totalRounds > 0) {
                  // 如果没有配额数据但有总轮数，生成默认配额
                  for (let i = 0; i < totalRounds; i++) {
                    this.quotasList.push({
                      roundNo: i + 1,
                      quotaCount: 1,
                    });
                  }
                }
                this.setLotterydrawRule("1");
                break;
              case "2":
                this.ruleForm = {
                  ...this.ruleForm,
                  needVote: String(rule["needVote"]),
                  votePerAttemptCount: String(rule["votePerAttemptCount"]),
                  voteStartTime: rule["voteStartTime"],
                  voteEndTime: rule["voteEndTime"],
                  prizeCount: rule["prizeCount"],
                };
                this.setCompetitionRule("2");
                break;
              case "3":
                this.ruleForm = {
                  ...this.ruleForm,
                  blessingDisplayRule: String(rule["blessingDisplayRule"]),
                };

                this.setBlessingRule("3");

                break;
            }
          });
        }
      });
    },
    // 验证配额
    validateQuotas() {
      if (this.quotasList.length === 0) {
        this.quotaErrorMsg = "";
        return true;
      }

      // 检查每轮配额是否大于0
      for (let item of this.quotasList) {
        if (!item.quotaCount || item.quotaCount <= 0) {
          this.quotaErrorMsg = this.$t("isagroup.每轮配额数量必须大于0");
          return false;
        }
      }

      // 计算总配额数量
      const totalQuota = this.quotasList.reduce(
        (sum, item) => sum + (parseInt(item.quotaCount) || 0),
        0
      );
      const prizeCount = parseInt(this.ruleForm.prizeCount) || 0;

      // 检查总配额是否超过奖品数量
      if (prizeCount > 0 && totalQuota > prizeCount) {
        this.quotaErrorMsg = this.$t("isagroup.总配额数量不能超过奖品数量");
        return false;
      }

      this.quotaErrorMsg = "";
      return true;
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 额外验证配额
          if (!this.validateQuotas()) {
            this.$message.error(this.quotaErrorMsg);
            return;
          }

          // 设置提交状态为true
          this.isSubmitting = true;

          console.log("submitForm", valid, this.modalType);
          this.setFormData();
        }
      });
    },
    // 修改addData方法，确保重置提交状态
    addData(data) {
      addActivityProgram(data)
        .then((res) => {
          this.isSubmitting = false; // 重置提交状态
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false; // 错误时也要重置提交状态
        });
    },
    editData(data) {
      editActivityProgram(data)
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
    setFormData() {
      let data = {
        activityId: this.ruleForm["activityId"],
        cnName: this.ruleForm["cnName"],
        enName: this.ruleForm["enName"],
        backgroundImage: this.ruleForm["backgroundImage"],
        programType: this.ruleForm["programType"],
        rule: {},
      };
      switch (this.ruleForm["programType"]) {
        case "1":
          data["totalRounds"] = this.ruleForm["totalRounds"];
          data["rule"] = {
            createLotteryPool: this.ruleForm["createLotteryPool"],
            lotteryIdentifierType: this.ruleForm["lotteryIdentifierType"],
            lotteryParticipantScope: this.ruleForm["lotteryParticipantScope"],
            needCheckin: this.ruleForm["needCheckin"],
            needPayment: this.ruleForm["needPayment"],
            prizeCount: this.ruleForm["prizeCount"],
            checkinEndOffsetMinutes: this.ruleForm["checkinEndOffsetMinutes"],
            checkinStartOffsetMinutes: this.ruleForm["checkinStartOffsetMinutes"],
          };
          // 添加配额数据
          data["quotas"] = this.quotasList.map((item) => ({
            roundNo: item.roundNo,
            quotaCount: item.quotaCount,
          }));
          break;
        case "2":
          data["totalRounds"] = 1;
          data["rule"] = {
            needVote: this.ruleForm["needVote"],
            votePerAttemptCount: this.ruleForm["votePerAttemptCount"],
            voteStartTime: this.ruleForm["voteStartTime"],
            voteEndTime: this.ruleForm["voteEndTime"],
            prizeCount: this.ruleForm["prizeCount"],
          };
          break;
        case "3":
          data["totalRounds"] = 1;
          data["rule"] = {
            blessingDisplayRule: this.ruleForm["blessingDisplayRule"],
          };
          break;
      }
      this.$refs.ruleForm.clearValidate();
      if (this.modalType == "add") {
        this.addData([data]);
      } else {
        data["id"] = this.ruleForm["id"];
        this.editData([data]);
      }
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
          backgroundImage: await this.uploadfile(file),
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
    changeProgram(e) {
      if ((this.modalType = "add")) {
        switch (e) {
          case "1":
            this.ruleForm = {
              ...this.ruleForm,
              createLotteryPool: "0",
              lotteryIdentifierType: "0",
              lotteryParticipantScope: "0",
              needCheckin: "0",
              needPayment: "0",
            };
            break;
          case "2":
            this.ruleForm = {
              ...this.ruleForm,
              needVote: "0",
            };
            if (this.ruleForm["activityId"]) {
              let currentActivity = this.activityList.find(
                (item) => item.id == this.ruleForm["activityId"]
              );
              this.ruleForm = {
                ...this.ruleForm,
                voteStartTime: currentActivity.activityStartTime,
                voteEndTime: currentActivity.activityEndTime,
                prizeCount: "0",
              };
            }
            break;
          case "3":
            break;
        }
      }
      this.$nextTick(() => {
        this.setLotterydrawRule(e);
        this.setCompetitionRule(e);
        this.setBlessingRule(e);
      });
    },
    setLotterydrawRule(e) {
      this.$set(this.rules["createLotteryPool"][0], "required", e == "1");
      this.$set(this.rules["lotteryIdentifierType"][0], "required", e == "1");
      this.$set(this.rules["lotteryParticipantScope"][0], "required", e == "1");
      this.$set(this.rules["needCheckin"][0], "required", e == "1");
      this.$set(this.rules["needPayment"][0], "required", e == "1");
      this.$set(this.rules["prizeCount"][0], "required", e == "1");
      //   this.$set(this.rules["checkinEndOffsetMinutes"][0], "required", e == "1");
      //   this.$set(this.rules["checkinStartOffsetMinutes"][0], "required", e == "1");
      this.$set(this.rules["totalRounds"][0], "required", e == "1");
    },
    setCompetitionRule(e) {
      this.$set(this.rules["needVote"][0], "required", e == "2");
      this.$set(this.rules["voteStartTime"][0], "required", e == "2");
      this.$set(this.rules["voteEndTime"][0], "required", e == "2");
      this.$set(
        this.rules["votePerAttemptCount"][0],
        "required",
        e == "2" && this.ruleForm["needVote"] == "1"
      );
      this.$set(this.rules["prizeCount"][0], "required", e == "2");
    },
    setBlessingRule(e) {
      this.$set(this.rules["blessingDisplayRule"][0], "required", e == "3");
    },
    setVoteCountRule(e) {
      this.$set(this.rules["votePerAttemptCount"][0], "required", e == "1");
    },
    // 关闭
    closeModal() {
      this.$refs.ruleForm.resetFields();
      this.showModal = false;
      this.ruleForm = {};
      this.isSubmitting = false;
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
