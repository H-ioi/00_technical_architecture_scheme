<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.邮件发送')"
      :visible.sync="showModal"
      width="80%"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
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
              :label="$t('consult.邮件主题')"
              prop="subject"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.subject"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.发送人')"
              prop="senderId"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.senderId"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in sendEmailList"
                  :key="item.userId"
                  :label="item.username + ' <' + item.emailAddress + '>'"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.收件人')"
              prop="toRecipients"
              style="width: 100%"
            >
              <el-select
                popper-class="showSelectClose"
                multiple
                filterable
                allow-create
                default-first-option
                style="width: 100%"
                v-model="ruleForm.toRecipients"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in toRecipientsList"
                  :key="item.email"
                  :label="item.name + ' <' + item.email + '>'"
                  :value="item.name + '-' + item.email"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.抄送人')"
              prop="ccRecipients"
              style="width: 100%"
            >
              <el-select
                popper-class="showSelectClose"
                multiple
                filterable
                allow-create
                default-first-option
                style="width: 100%"
                v-model="ruleForm.ccRecipients"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in ccRecipientsList"
                  :key="item.email"
                  :label="item.userName + ' <' + item.email + '>'"
                  :value="item.userName + '-' + item.email"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.是否批量发送')"
              prop="isBatch"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.isBatch"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in consult['yesOrno']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 100%">
              <!-- 附件上传 -->
              <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :limit="10"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">{{
                  $t("consult.附件上传")
                }}</el-button>
                <div slot="tip" class="el-upload__tip">
                  {{ $t("consult.最多上传10个附件") }},
                  {{ $t("consult.单个附件不超过20M") }}
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item style="width: 100%">
              <!-- 富文本输入 -->
              <TinymceCn ref="TinymceCn" />
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              round
              @click="submitForm('ruleForm')"
              >{{ $t("consult.发送") }}</el-button
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
import {
  getEmailCurrentUser,
  getOrganizationUserEmail,
  sendEmail,
  getOuterEmail,
} from "@/api/consult/email.js";
import { consult } from "@/const/consult/index.js";
import { downloadFile, uploadFile } from "@/api/upload/index.js";
import TinymceCn from "@/components/tinymce/email.vue";
export default {
  name: "email",
  components: {
    TinymceCn,
  },
  props: {
    type: {
      type: Number,
      default: 1, // normal 普通发送  template 模板发送
    },
  },
  data() {
    return {
      consult: consult,
      showModal: false,
      ruleForm: {},
      rules: this.initRules(),
      //  发送人可用邮箱
      sendEmailList: [],
      //  收件人邮箱
      toRecipientsList: [],
      // 抄送人人邮箱
      ccRecipientsList: [],
      //   外部id
      outerIds: [],
      //   fileList  附件列表
      fileList: [],
      //   附件ID列表，用于提交
      attachmentIds: [],
    };
  },
  created() {
    // this.initData();
  },
  mounted() {},
  computed: {
    ...mapGetters(["pooldictpermissions", "permissions", "dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler: function () {
        // 语言切换时重新初始化验证规则
        this.rules = this.initRules();
        // 清除表单验证状态
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate();
        }
      },
      immediate: false,
    },
  },
  methods: {
    // 初始化表单验证规则
    initRules() {
      return {
        subject: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        senderId: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        toRecipients: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        isBatch: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
      };
    },
    async initData(ids) {
      this.outerIds = ids;
      this.sendEmailList = await getEmailCurrentUser();
      this.ccRecipientsList = await getOrganizationUserEmail();
      this.toRecipientsList = await getOuterEmail({
        ids: ids,
        type: this.type,
      });

      this.showModal = true;
      console.log("  this.toRecipientsList ", this.toRecipientsList);
      this.$nextTick(() => {
        let defaultRecipients = this.toRecipientsList.map((item) => {
          return item.name + "-" + item.email;
        });
        this.ruleForm = {
          ...this.ruleForm,
          toRecipients: defaultRecipients,
        };
      });
    },
    sendEmail(data) {
      sendEmail(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("cancelSelectAll");
          this.closeModal();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let content = this.$refs["TinymceCn"].value;
          let toRecipients = this.ruleForm.toRecipients.map((item) => {
            let arr = item.split("-");
            if (arr.length == 2) {
              return { userName: arr[0], email: arr[1] };
            } else {
              return { userName: "", email: item };
            }
          });
          let ccRecipients = this.ruleForm.ccRecipients.map((item) => {
            let arr = item.split("-");
            if (arr.length == 2) {
              return { userName: arr[0], email: arr[1] };
            } else {
              return { userName: "", email: item };
            }
          });
          let fileIds = [];
          if (this.fileList.length > 0) {
            this.fileList.map((item) => {
              fileIds.push(item.id);
            });
          }
          this.sendEmail({
            subject: this.ruleForm.subject,
            isBatch: this.ruleForm.isBatch,
            toRecipientsInfo: toRecipients,
            ccRecipientsInfo: ccRecipients,
            senderId: Number(this.ruleForm.senderId),
            id: this.outerIds,
            content: content,
            type: this.type,
            senderType: this.sendEmailList.find(
              (item) => item.userId == this.ruleForm.senderId
            ).userType,
            fileIds: this.attachmentIds, // 添加附件ID列表
          });
        }
      });
    },
    closeModal() {
      this.ruleForm = {};
      this.showModal = false;
      this.sendEmailList = [];
      this.toRecipientsList = [];
      this.ccRecipientsList = [];
      this.outerIds = [];
      this.fileList = [];
      this.attachmentIds = [];
    },
    handleRemove(file, fileList) {
      // 从附件ID列表中移除对应的文件ID
      if (file.attachmentId) {
        this.attachmentIds = this.attachmentIds.filter((id) => id !== file.attachmentId);
      }
      this.fileList = fileList;
    },
    handlePreview(file) {
      // 如果有文件的url，可以在这里实现预览功能
      //   if (file.url) {
      //     window.open(file.url);
      //   }
    },
    uploadfile(data) {
      return new Promise((resolve, reject) => {
        uploadFile(data).then((res) => {
          this.$message.success("上传成功");
          resolve(res);
        });
      });
    },
    async beforeUpload(file) {
      console.log("beforeUpload file", file);
      const isLt20M = file.size / 1024 / 1024 > 20;
      if (isLt20M) {
        this.$message.warning(this.$t("consult.文件大小不能超过20M"));
        return false;
      }

      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append("file", file);

        // 调用uploadFile接口上传文件
        const response = await uploadFile(formData);
        console.log("beforeUpload file", file);
        if (response && response.data && response.data.success) {
          // 获取附件ID
          const attachmentId = response.data.data;

          // 将附件ID添加到列表中
          this.attachmentIds.push(attachmentId);

          // 为文件对象添加attachmentId属性，方便后续移除时识别
          file.attachmentId = attachmentId;

          // 将文件添加到文件列表中
          this.fileList.push({
            name: file.name,
            size: file.size,
            attachmentId: attachmentId,
            url: attachmentId, // 如果上传接口返回了文件URL，可以使用
          });

          return false; // 阻止自动上传，因为我们已经手动处理了
        } else {
          this.$message.error(this.$t("consult.文件上传失败"));
          return false;
        }
      } catch (error) {
        console.error("文件上传错误:", error);
        this.$message.error(this.$t("consult.文件上传失败"));
        return false;
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`${this.$t("consult.确定移除")} ${file.name}？`);
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
