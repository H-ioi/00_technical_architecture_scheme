<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%; background-color: #fff">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.邮件详情") }}</div>
              <div>
                <!-- <el-button
                  v-if="permissions['event_edit']"
                  @click="editUserEmail"
                  type="primary"
                  size="small"
                  round
                  >{{ $t("consult.编辑") }}</el-button
                > -->
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.邮件主题") }}</span>
                <span :title="$checkNull(emailData['subject'])">{{
                  $checkNull(emailData["subject"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.发送人") }}</span>
                <span :title="$checkNull(emailData['sender'])">{{
                  $checkNull(emailData["sender"])
                }}</span>
              </div>
              <div
                class="orderDetail_baseinfo_item"
                v-if="emailData['toRecipients'].length > 0"
              >
                <span>{{ $t("consult.收件人") }}</span>
                <div class="emaillist">
                  <div
                    class="emaillist-item"
                    v-for="item in emailData['toRecipients']"
                    :key="item"
                  >
                    {{ $checkNull(item) }},
                  </div>
                </div>
              </div>
              <div
                class="orderDetail_baseinfo_item"
                v-if="emailData['ccRecipients'].length > 0"
              >
                <span>{{ $t("consult.抄送人") }}</span>
                <div class="emaillist">
                  <div
                    class="emaillist-item"
                    v-for="item in emailData['ccRecipients']"
                    :key="item"
                  >
                    {{ $checkNull(item) }},
                  </div>
                </div>
              </div>

              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.是否批量发送") }}</span>
                <span :title="$checkNull(emailData['isBatchLabel'])">{{
                  $checkNull(emailData["isBatchLabel"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item">
                <span>{{ $t("consult.操作人") }}</span>
                <span :title="$checkNull(emailData['operatorName'])">{{
                  $checkNull(emailData["operatorName"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item" v-if="emailData['errorMessage']">
                <span>{{ $t("consult.报错信息") }}</span>
                <span :title="$checkNull(emailData['errorMessage'])">{{
                  $checkNull(emailData["errorMessage"])
                }}</span>
              </div>
              <div
                class="orderDetail_baseinfo_item"
                v-if="emailData['attachments'] && emailData['attachments'].length > 0"
              >
                <span>{{ $t("consult.附件") }}</span>
                <div class="attachments">
                  <div
                    @click="downLoadFile(file)"
                    class="attachmentsitem"
                    v-for="(file, index) in emailData['attachments']"
                    :key="file.fileId"
                  >
                    {{ file.fileName }}
                  </div>
                </div>
              </div>
              <div class="email-content">
                <span class="email-label">{{ $t("consult.邮件详情") }}</span>
                <div class="email-content-wrapper">
                  <div v-html="emailData.content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import { getEmailDetail } from "@/api/consult/email.js";
import { download } from "@/util/download.js";
import { downloadFile } from "@/api/upload/index.js";
import dayjs from "dayjs";
export default {
  name: "Event",
  components: {},
  data() {
    return {
      consult: consult,
      emailInfo: consult["userEmailTitle"],
      emailData: {},
    };
  },
  computed: {
    ...mapGetters(["i18nlocel", "permissions"]),
  },

  created() {
    this.getDetail();
  },

  watch: {},
  mounted() {},
  activated() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      getEmailDetail(this.$route.query.id).then(async (res) => {
        if (res.data.success) {
          let {
            subject,
            senderName,
            receivers,
            content,
            sendTime,
            senderEmail,
            attachments,
            isBatch,
            isSuccess,
            errorMessage,
            operatorName,
          } = res.data.data;
          this.$nextTick(() => {
            let toRecipients = [];
            let ccRecipients = [];
            receivers.map((item) => {
              if (item["receiverType"] == 1) {
                toRecipients = item["emailInfos"].map((i) => {
                  return i.userName + " <" + i.email + ">";
                });
              } else if (item["receiverType"] == 2) {
                ccRecipients = item["emailInfos"].map((i) => {
                  return i.userName + " <" + i.email + ">";
                });
              }
            });
            console.log("toRecipients", toRecipients);
            console.log("ccRecipients", ccRecipients);

            this.emailData = {
              id: this.$route.query.id,
              subject: subject,
              sender: senderName + " <" + senderEmail + ">",
              content: content,
              sendTime: dayjs(sendTime).format("YYYY-MM-DD HH:mm:ss"),
              toRecipients: toRecipients,
              ccRecipients: ccRecipients,
              attachments,
              errorMessage,
              operatorName,
              isBatchLabel: this.$getListLabel(consult["yesOrno"], String(isBatch)),
              isSuccessLabel: this.$getListLabel(
                consult["successType"],
                String(isSuccess)
              ),
            };
          });
        }
      });
    },
    // 下载
    downLoadFile(file) {
      downloadFile(file.fileId).then((res) => {
        download(res.data, res.headers["content-disposition"]);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.thepool_page {
  .orderDetail_baseinfo_item {
    width: 100% !important;
  }
}
.thepool_page
  .orderDetail
  .orderDetail_content
  .orderDetail_item
  .orderDetail_baseinfo
  .orderDetail_baseinfo_item {
  margin-bottom: 20px !important;
  span {
    white-space: wrap !important;
  }
}
.attachments {
  padding: 10px 0 0;
  display: flex;
  flex-direction: column;
  .attachmentsitem {
    display: inline-block;
    padding-bottom: 10px;
    cursor: pointer;
    &:hover {
      color: #ba8e62;
    }
  }
}
.emaillist {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .emaillist-item {
    margin-bottom: 10px;
    padding: 0 5px;
    color: #0d0d0d;
    font-size: 14px;
  }
}
.email-content {
  width: 100%;
  .email-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #999999;
  }

  .email-content-wrapper {
    margin-top: 20px;
    // 重置容器内所有元素的样式
    &,
    * {
      all: initial !important;
      box-sizing: border-box !important;
    }

    // 恢复基本的块级元素行为
    display: block !important;
    width: 100% !important;

    // 设置基础字体样式
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #333 !important;

    // 为常用元素设置默认样式
    p,
    div,
    span,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    p {
      margin-bottom: 16px !important;
    }
  }
}
</style>
