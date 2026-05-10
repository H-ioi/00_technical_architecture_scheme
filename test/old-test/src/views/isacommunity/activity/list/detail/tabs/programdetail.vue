<template>
  <div style="width: 100%">
    <div class="programlist">
      <div class="programlist_item" v-for="(item, index) in programlist" :key="index">
        <div class="item_top">
          <div class="item_top_title">
            {{ i18nlocel == "en" ? item.programInfo.enName : item.programInfo.cnName }}
          </div>
          <div
            class="item_top_type"
            :style="typeColor[String(item.programInfo.programStatus)]"
          >
            {{ resetTypeStr(item.programInfo) }}
          </div>
        </div>
        <div class="item_info">
          <div
            class="item_info_box"
            style="text-align: right"
            v-if="item.programInfo.programStatus != 2"
          >
            <el-button
              v-if="!item.programInfo.currentRoundStatus"
              style="margin-right: 10px"
              type="primary"
              size="mini"
              @click="handleProgramStatus(item.programInfo, index, true)"
              >{{ $t("isagroup.开始") }}</el-button
            >
            <el-button
              v-if="item.programInfo.currentRoundStatus"
              style="margin-right: 10px"
              type="primary"
              size="mini"
              @click="handleProgramStatus(item.programInfo, index, false)"
              >{{ $t("isagroup.结束") }}</el-button
            >
          </div>
          <div class="item_info_box">
            <div class="item_info_label">{{ $t("isagroup.ID") }}：</div>
            <div class="item_info_value">{{ item.programInfo.id }}</div>
          </div>
          <!-- <div class="item_info_box">
            <div class="item_info_label">{{ $t("isagroup.项目名称") }}：</div>
            <div class="item_info_value">
              {{ i18nlocel == "en" ? item.programInfo.enName : item.programInfo.cnName }}
            </div>
          </div> -->
          <div class="item_info_box">
            <div class="item_info_label">{{ $t("isagroup.项目类型") }}：</div>
            <div class="item_info_value">
              {{ $getListLabel(consts["programType"], item.programInfo.programType) }}
            </div>
          </div>
          <div class="item_info_box">
            <div class="item_info_label">{{ $t("isagroup.项目规则") }}：</div>
            <div class="item_info_value">{{ setProgramRules(item.programInfo) }}</div>
          </div>
          <div class="item_info_box">
            <div class="item_info_label">{{ $t("isagroup.背景图") }}：</div>
            <!-- <div class="item_info_value">{{ item.programInfo.backgroundImage }}</div> -->
            <div class="item_info_value">
              <img width="200px" :src="item.programInfo.backgroundImage" alt="" />
            </div>
          </div>

          <div
            class="item_info_box"
            style="width: 100%"
            v-if="item.programInfo.programType == 2"
          >
            <div class="item_info_label">{{ $t("isagroup.投票节目") }}：</div>
            <div class="item_info_value">
              {{
                i18nlocel == "en"
                  ? item.bindInfo["voteEnName"]
                  : item.bindInfo["voteCnName"]
              }}
            </div>
          </div>
          <div
            class="item_info_box"
            style="width: 50%"
            v-if="item.programInfo.programType == 2"
          >
            <div class="item_info_label">{{ $t("isagroup.获奖名额") }}：</div>
            <div class="item_info_value">
              {{ item.programInfo.rule.prizeCount }}
            </div>
          </div>
          <div
            class="df_warp"
            style="width: 100%"
            v-if="item.programInfo.programType == 1"
          >
            <div class="item_info_box" style="width: 50%">
              <div class="item_info_label">{{ $t("isagroup.项目轮次总数") }}：</div>
              <div class="item_info_value">
                {{ item.programInfo.totalRounds }}
              </div>
            </div>
            <div class="item_info_box" style="width: 50%">
              <div class="item_info_label">{{ $t("isagroup.当前轮次") }}：</div>
              <div class="item_info_value">
                {{ item.programInfo.currentRound }}
              </div>
            </div>
            <div class="item_info_box" style="width: 50%">
              <div class="item_info_label">{{ $t("isagroup.获奖名额") }}：</div>
              <div class="item_info_value">
                {{ item.programInfo.rule.prizeCount }}
              </div>
            </div>
            <div class="item_info_box" style="width: 50%">
              <div class="item_info_label">{{ $t("isagroup.奖品数量") }}：</div>
              <div class="item_info_value">
                {{ item.programInfo.rule.prizeCount }}
              </div>
            </div>
            <div
              class="df_warp"
              style="width: 100%"
              v-for="(prize, k) in item.bindInfo.prizeList"
              :key="l"
            >
              <div class="item_info_box" style="width: 100%">
                <div class="item_info_label">{{ $t("isagroup.奖品名称") }}：</div>
                <div class="item_info_value">
                  {{ i18nlocel == "en" ? prize.enName : prize.cnName }}
                </div>
              </div>
              <div class="item_info_box" style="width: 100%">
                <div class="item_info_label">{{ $t("isagroup.奖品金额") }}：</div>
                <div class="item_info_value">{{ prize.amount }}RMB</div>
              </div>
              <div class="item_info_box" style="width: 100%">
                <div class="item_info_label">{{ $t("isagroup.图片") }}：</div>
                <div class="item_info_value">
                  <img width="200px" :src="prize.imageUrl" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getActivityProgramlist,
  getProgramDetail,
  editActivityProgramStatus,
} from "@/api/isacommunity/activityprogram.js";
import { getVoteProgram } from "@/api/isacommunity/voteprogram.js";
import { getProgramPrizeList } from "@/api/isacommunity/prize.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import dayjs from "dayjs";
export default {
  name: "detail",
  components: {},
  props: {
    activityId: String,
  },
  data() {
    return {
      consts: consts,
      tablestyle: consts["tablestyle"],
      tabletitle: tabletitle,
      showDialog: false,
      detailData: {},
      driverList: [],
      programlist: [],
      typeColor: {
        0: "color: #C34343;",
        1: "color: #43C34F;",
        2: "color: #999999;",
      },
    };
  },
  created() {},
  mounted() {
    // this.getDetail();
  },
  computed: {
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
  },
  methods: {
    getDetail() {
      getActivityProgramlist({ activityId: this.activityId }).then((res) => {
        if (res) {
          this.programlist = [];
          let list = res;
          list.forEach(async (item) => {
            let programInfo = await getProgramDetail(item["id"]);
            let bindInfo = {};
            if (programInfo["programType"] == 1) {
              let prizeList = await getProgramPrizeList({ programId: item["id"] });
              bindInfo = {
                prizeList: prizeList,
              };
            }
            if (programInfo["programType"] == 2) {
              let voteList = await getVoteProgram({ programId: item["id"] });
              let voteCnName = voteList.map((i) => i.cnName);
              let voteEnName = voteList.map((i) => i.enName);
              bindInfo = {
                voteCnName: String(voteCnName),
                voteEnName: String(voteEnName),
              };
            }
            if (programInfo["programType"] == 3) {
            }

            this.programlist.push({
              programInfo: programInfo,
              bindInfo: bindInfo,
            });
          });
          console.log(" this.programlist", this.programlist);
        }
      });
    },
    setProgramType(e) {
      return this.$getListLabel(consts["programStatus"], e);
    },
    setProgramRules(data) {
      let type = data["programType"];
      let rule = data["rule"];
      let str = "";
      switch (type) {
        case 1:
          let {
            needPayment,
            needCheckin,
            createLotteryPool,
            lotteryIdentifierType,
            lotteryParticipantScope,
          } = rule;
          str += needPayment
            ? this.i18nlocel == "en"
              ? "Need payment"
              : "需要支付"
            : this.i18nlocel == "en"
            ? "No payment"
            : "不需要支付";
          str += needCheckin
            ? this.i18nlocel == "en"
              ? "，Need Checkin"
              : "，需要签到"
            : this.i18nlocel == "en"
            ? "，No Checkin"
            : "，不需要签到";
          str += createLotteryPool
            ? this.i18nlocel == "en"
              ? "，Create Lottery Pool"
              : "，创建抽奖池"
            : this.i18nlocel == "en"
            ? "No Lottery Pool"
            : "，不需要创建抽奖池";
          str +=
            "，" +
            this.$getListLabel(consts["lotteryIdentifierType"], lotteryIdentifierType);

          str +=
            "，" +
            this.$getListLabel(
              consts["lotteryParticipantScope"],
              lotteryParticipantScope
            );
          return str;
        case 2:
          let { needVote, votePerAttemptCount, voteStartTime, voteEndTime } = rule;
          str += needVote
            ? this.i18nlocel == "en"
              ? "Need Vote"
              : "需要投票"
            : this.i18nlocel == "en"
            ? "No Vote"
            : "不需要投票";
          if (votePerAttemptCount) {
            str +=
              this.i18nlocel == "en"
                ? "，Each vote count" + votePerAttemptCount
                : "，每次投票数" + votePerAttemptCount;
          }
          if (voteStartTime) {
            str +=
              this.i18nlocel == "en"
                ? "，Vote Start Time" + dayjs(voteStartTime).format("YYYY-MM-DD HH:mm:ss")
                : "，投票时间" + dayjs(voteStartTime).format("YYYY-MM-DD HH:mm:ss");
          }
          if (voteEndTime) {
            str += "-" + dayjs(voteEndTime).format("YYYY-MM-DD HH:mm:ss");
          }
          return str;
        case 3:
          return this.$getListLabel(
            consts["blessingDisplayRule"],
            rule["blessingDisplayRule"]
          );
        default:
          return "--";
      }
    },
    handleProgramStatus(item, index, type) {
      let fromDdata = new FormData();
      fromDdata.append("id", Number(item["id"]));
      fromDdata.append("startFlag", type);
      editActivityProgramStatus(fromDdata).then(async (res) => {
        if (res) {
          this.$message({
            message: !type ? this.$t("isagroup.结束") : this.$t("isagroup.开始"),
            type: "success",
          });
          let programInfo = await getProgramDetail(item["id"]);
          this.$set(this.programlist[index], "programInfo", programInfo);
        }
      });
    },
    resetTypeStr(programInfo) {
      if (!programInfo) return;
      let { programStatus, programType, currentRound } = programInfo;
      let str = this.$getListLabel(consts["programStatus"], programStatus);
      if (programType == 1 && programStatus == 1) {
        str =
          this.i18nlocel == "en" ? "Round " + currentRound : "第" + currentRound + "轮";
      }

      return str;
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
.df_warp {
  display: flex;
  flex-wrap: wrap;
}
.programlist {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  .programlist_item {
    width: 48%;
    height: 396px;
    border-radius: 6px;
    margin-bottom: 20px;
    margin-right: 20px;
    border: 1px solid #d6d6d6;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      box-sizing: border-box;
      overflow: hidden;
      height: 40px;
      background: rgba(231, 241, 251, 0.5);

      .item_top_title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #333333;
      }
      .item_top_type {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #c34343;
      }
    }
    .item_info {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      .item_info_box {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        .item_info_label {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 20px;
          text-align: left;
        }
        .item_info_value {
          flex: 1;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          text-align: left;
          //   white-space: pre-wrap;
          //   word-wrap: break-word; // 允许长单词或URL在容器边界处换行
          //   word-break: break-all; // 允许在单词内换行，对中英文混合特别有用
          //   overflow-wrap: break-word; // 标准版本的word-wrap，提供更好的兼容性
        }
      }
    }
  }
}
</style>
