<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.活动项目详情") }}</div>
      <el-button type="primary" size="large" @click="editProgram">{{
        $t("btn.编辑")
      }}</el-button>
    </div>
    <div class="community_centent">
      <div class="orderDetail">
        <div class="orderDetail_item">
          <div class="orderDetail_baseinfo" style="padding-bottom: 0 !important">
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.中文名") }}</span>
              <span :title="$checkNull(programData.cnName)">{{
                $checkNull(programData.cnName)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.英文名") }}</span>
              <span :title="$checkNull(programData.enName)">{{
                $checkNull(programData.enName)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.状态") }}</span>
              <span :title="$checkNull(programData.programStatusLabel)">{{
                $checkNull(programData.programStatusLabel)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.项目类型") }}</span>
              <span :title="$checkNull(programData.programTypeLabel)">{{
                $checkNull(programData.programTypeLabel)
              }}</span>
            </div>
            <div
              style="margin-bottom: 15px; width: 100%"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.活动") }}</span>
              <span :title="$checkNull(programData.activityName)">{{
                $checkNull(programData.activityName)
              }}</span>
            </div>
            <div
              style="margin-bottom: 15px; width: 100%"
              class="orderDetail_baseinfo_item"
            >
              <span>{{ $t("isagroup.背景图") }}</span>
              <span>
                <img :src="programData.backgroundImage" alt="" style="width: 200px" />
              </span>
            </div>
          </div>
          <div
            class="orderDetail_baseinfo"
            style="padding-top: 0 !important"
            v-if="programData.programType == 1"
          >
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.是否需要支付") }}</span>
              <span :title="$checkNull(programData.needPayment)">{{
                $checkNull(programData.needPayment)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.是否需要签到") }}</span>
              <span :title="$checkNull(programData.needCheckin)">{{
                $checkNull(programData.needCheckin)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.签到开始偏移分钟") }}</span>
              <span :title="$checkNull(programData.checkinStartOffsetMinutes)">{{
                $checkNull(programData.checkinStartOffsetMinutes)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.签到结束偏移分钟") }}</span>
              <span :title="$checkNull(programData.checkinEndOffsetMinutes)">{{
                $checkNull(programData.checkinEndOffsetMinutes)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.是否创建获奖池") }}</span>
              <span :title="$checkNull(programData.createLotteryPoolLabel)">{{
                $checkNull(programData.createLotteryPoolLabel)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.抽奖识别码") }}</span>
              <span :title="$checkNull(programData.lotteryIdentifierType)">{{
                $checkNull(programData.lotteryIdentifierType)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.参与抽奖人员范围") }}</span>
              <span :title="$checkNull(programData.lotteryParticipantScope)">{{
                $checkNull(programData.lotteryParticipantScope)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.项目轮次总数") }}</span>
              <span :title="$checkNull(programData.totalRounds)">{{
                $checkNull(programData.totalRounds)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.奖品数量") }}</span>
              <span :title="$checkNull(programData.prizeCount)">{{
                $checkNull(programData.prizeCount)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.每轮配额") }}</span>
              <span v-if="programData.quotas.length > 0">
                <div style="display: inline-block" v-for="(i, k) in programData.quotas">
                  {{ i.quotaCount }}/{{ i.roundNo
                  }}{{ k + 1 == programData.quotas.length ? "" : "," }}
                </div>
              </span>
              <span v-else>--</span>
            </div>
          </div>
          <div
            class="orderDetail_baseinfo"
            style="padding-top: 0 !important"
            v-if="programData.programType == 2"
          >
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.是否需要投票") }}</span>
              <span :title="$checkNull(programData.needVote)">{{
                $checkNull(programData.needVote)
              }}</span>
            </div>

            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.开始时间") }}</span>
              <span :title="$checkNull(programData.voteStartTime)">{{
                $checkNull(programData.voteStartTime)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.结束时间") }}</span>
              <span :title="$checkNull(programData.voteEndTime)">{{
                $checkNull(programData.voteEndTime)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.单次可投票数量") }}</span>
              <span :title="$checkNull(programData.votePerAttemptCount)">{{
                $checkNull(programData.votePerAttemptCount)
              }}</span>
            </div>
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.获奖名额") }}</span>
              <span :title="$checkNull(programData.prizeCount)">{{
                $checkNull(programData.prizeCount)
              }}</span>
            </div>
          </div>
          <div
            class="orderDetail_baseinfo"
            style="padding-top: 0 !important"
            v-if="programData.programType == 3"
          >
            <div style="margin-bottom: 15px" class="orderDetail_baseinfo_item">
              <span>{{ $t("isagroup.祝福语展示规则") }}</span>
              <span :title="$checkNull(programData.blessingDisplayRule)">{{
                $checkNull(programData.blessingDisplayRule)
              }}</span>
            </div>
          </div>
        </div>
        <div class="orderDetail_item" v-if="programData.programType == 1">
          <div class="orderDetail_item_title df_sb">
            <div>
              {{ $t("isagroup.奖品配置") }}
            </div>
            <div>
              <el-button type="primary" size="small" round @click="addPrize">{{
                $t("isagroup.新增")
              }}</el-button>
            </div>
          </div>
          <div class="orderDetail_baseinfo">
            <div class="isa_table">
              <Table
                ref="Table"
                :showSelection="false"
                :tableTitle="tabletitle['activityPrizeTable']"
                :tableData="prizeList"
                :tableBtn="prizeBtn"
                @playTab="playPrizeTab"
              />
            </div>
          </div>
        </div>
        <div
          class="orderDetail_item"
          v-if="programData.programType == 1 && programData.createLotteryPool == '1'"
        >
          <div class="orderDetail_item_title df_sb">
            <div>
              {{ $t("isagroup.奖池") }}
            </div>
            <div class="df_align_center">
              <el-button type="primary" size="small" round @click="downloadPoolFile">{{
                $t("isagroup.下载模板")
              }}</el-button>
              <el-upload
                style="height: 32px; line-height: 32px; margin-left: 10px"
                class="upload-demo"
                action=""
                :before-upload="beforeUpload"
                :show-file-list="false"
                :limit="1"
              >
                <el-button size="small" type="primary">{{
                  $t("isagroup.导入")
                }}</el-button>
              </el-upload>
            </div>
          </div>
          <div class="orderDetail_baseinfo">
            <div class="isa_table">
              <Table
                ref="Table"
                :showSelection="false"
                :tableTitle="tabletitle['lotteryPoolFilesTable']"
                :tableData="poolFilesList"
                :tableBtn="poolFilesBtn"
                @playTab="playPoolFilesTab"
              />
            </div>
          </div>
        </div>
        <div class="orderDetail_item" v-if="programData.programType == 2">
          <div class="orderDetail_item_title df_sb">
            <div>
              {{ $t("isagroup.投票节目") }}
            </div>
            <div>
              <el-button type="primary" size="small" round @click="addVote">{{
                $t("isagroup.新增")
              }}</el-button>
            </div>
          </div>
          <div class="orderDetail_baseinfo">
            <div class="isa_table">
              <Table
                ref="Table"
                :showSelection="false"
                :tableTitle="tabletitle['voteProgramTable']"
                :tableData="voteList"
                :tableBtn="voteBtn"
                @playTab="playVoteTab"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑项目弹窗 -->
    <ProgramForm ref="ProgramForm" @getList="getDetail" />
    <!-- 编辑项目弹窗 -->
    <PrizForm
      ref="PrizForm"
      @getList="getProgramPrizeList"
      :isBind="true"
      :bindProgramId="programId"
    />
    <!-- 编辑节目弹窗 -->
    <VoteProgramForm
      ref="VoteProgramForm"
      @getList="getVoteProgram"
      :isBind="true"
      :bindProgramId="programId"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityProgramDetail } from "@/api/isacommunity/activityprogram.js";
import { getVoteProgram, delVoteProgram } from "@/api/isacommunity/voteprogram.js";
import { getProgramPrizeList, delPrize } from "@/api/isacommunity/prize.js";
import {
  getPoolFiles,
  importLotteryPoolFiles,
  downloadPoolFiles,
  delLotteryPoolFiles,
} from "@/api/isacommunity/lotteryPoolFile.js";
import { download } from "@/util/download.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import ProgramForm from "@/views/isacommunity/activity/program/modal/form.vue";
import PrizForm from "@/views/isacommunity/activity/prize/modal/form.vue";
import VoteProgramForm from "@/views/isacommunity/activity/voteprogram/modal/form.vue";
import dayjs from "dayjs";
export default {
  name: "activityprogramdetail",
  components: { ProgramForm, PrizForm, VoteProgramForm, Table },
  data() {
    return {
      consts: consts,
      tabletitle: tabletitle,
      programData: {},
      programId: "",
      voteList: [],
      voteBtn: [
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "",
        },
        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "",
        },
      ],
      prizeList: [],
      prizeBtn: [
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "",
        },
        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "",
        },
      ],
      poolFilesList: [],
      poolFilesBtn: [
        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "",
        },
      ],
    };
  },
  created() {
    this.programId = this.$route.query.id;
    this.getDetail();
  },

  computed: {
    ...mapGetters(["permissions", "i18nlocel", "dictionary"]),
  },
  methods: {
    initData() {},
    getDetail() {
      getActivityProgramDetail(this.programId).then(async (res) => {
        if (res.data.success) {
          let {
            activityId,
            activityName,
            cnName,
            enName,
            backgroundImage,
            programStatus,
            programType,
            totalRounds,
            rule,
            quotas, // 获取配额数据
          } = res.data.data;

          this.$nextTick(() => {
            this.programData = {
              ...this.programData,
              id: this.programId,
              activityId,
              activityName,
              cnName,
              enName,
              backgroundImage,
              programStatus,
              programType,
              programTypeLabel: this.$getListLabel(
                consts["programType"],
                String(programType)
              ),
              programStatusLabel: this.$getListLabel(
                consts["programStatus"],
                String(programStatus)
              ),
              totalRounds: String(totalRounds),
              quotas,
            };
            switch (String(programType)) {
              case "1":
                this.programData = {
                  ...this.programData,
                  createLotteryPool: String(rule["createLotteryPool"]),
                  createLotteryPoolLabel: this.$getListLabel(
                    consts["yesOrno"],
                    String(rule["createLotteryPool"])
                  ),
                  lotteryIdentifierType: this.$getListLabel(
                    consts["lotteryParticipantScope"],
                    String(rule["lotteryIdentifierType"])
                  ),
                  lotteryParticipantScope: this.$getListLabel(
                    consts["lotteryParticipantScope"],
                    String(rule["lotteryParticipantScope"])
                  ),
                  needCheckin: this.$getListLabel(
                    consts["yesOrno"],
                    String(rule["needCheckin"])
                  ),
                  needPayment: this.$getListLabel(
                    consts["yesOrno"],
                    String(rule["needPayment"])
                  ),
                  prizeCount: String(rule["prizeCount"]),
                  checkinEndOffsetMinutes: String(rule["checkinEndOffsetMinutes"]),
                  checkinStartOffsetMinutes: String(rule["checkinStartOffsetMinutes"]),
                };
                this.getProgramPrizeList();
                this.getPoolFiles();
                break;
              case "2":
                this.programData = {
                  ...this.programData,
                  needVote: this.$getListLabel(
                    consts["yesOrno"],
                    String(rule["needVote"])
                  ),
                  votePerAttemptCount: String(rule["votePerAttemptCount"]),
                  voteStartTime: rule["voteStartTime"],
                  voteEndTime: rule["voteEndTime"],
                  prizeCount: String(rule["prizeCount"]),
                };
                this.getVoteProgram();
                break;
              case "3":
                this.programData = {
                  ...this.programData,
                  blessingDisplayRule: this.$getListLabel(
                    consts["blessingDisplayRule"],
                    String(rule["blessingDisplayRule"])
                  ),
                };

                break;
            }
          });
        }
      });
    },
    // 投票配置操作
    async getVoteProgram() {
      this.voteList = await getVoteProgram({ programId: this.programId });
    },
    playVoteTab(name, item) {
      switch (name) {
        case "del":
          delVoteProgram({ ids: [item.id] }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getVoteProgram();
            }
          });
          break;
        case "edit":
          this.$refs.VoteProgramForm.showForm("edit", item);
          break;
      }
    },
    addVote() {
      this.$refs.VoteProgramForm.showForm("add", {});
    },
    // 奖品配置操作
    async getProgramPrizeList() {
      this.prizeList = await getProgramPrizeList({ programId: this.programId });
    },
    playPrizeTab(name, item) {
      switch (name) {
        case "del":
          delPrize({ ids: [item.id] }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getProgramPrizeList();
            }
          });
          break;
        case "edit":
          this.$refs.PrizForm.showForm("edit", item);
          break;
      }
    },
    addPrize() {
      this.$refs.PrizForm.showForm("add", {});
    },
    // 奖池配置
    async getPoolFiles() {
      this.poolFilesList = await getPoolFiles({ programId: this.programId });
    },
    playPoolFilesTab(name, item) {
      switch (name) {
        case "del":
          let formData = new FormData();
          formData.append("id", item.id);
          delLotteryPoolFiles(formData).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getPoolFiles();
            }
          });
          break;
      }
    },
    downloadPoolFile() {
      downloadPoolFiles().then((res) => {
        this.$message.success(this.$t("isagroup.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    beforeUpload(file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("programId", this.programId);
      importLotteryPoolFiles(formData).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.getPoolFiles();
        }
      });
    },
    // 编辑活动项目
    editProgram() {
      this.$refs.ProgramForm.showForm("edit", this.programData);
    },
  },
};
</script>

<style lang="scss" scoped></style>
