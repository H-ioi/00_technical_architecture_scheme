<template>
  <div class="questionnaire-container">
    <div class="questionnaire" v-if="linkStatus">
      <div class="questionnaire-nav">
        <div class="questionnaire-nav_text">
          {{ collectionData["collectionName"] }}
        </div>
      </div>
      <el-scrollbar class="questionnaire-content" id="printPdf">
        <div class="questionnaire-content-scroll">
          <FromitemActivity
            ref="FromitemActivity"
            type="questionnaire"
            @signUpCollection="signUpCollection"
          />
        </div>
      </el-scrollbar>
      <div class="questionnaire-footter">
        <!-- <div class="questionnaire-cancel" @click="downloadPDF">下载PDF</div> -->
        <div class="questionnaire-confirm" @click="submit">确认提交</div>
      </div>
      <el-dialog
        class="questionnaire-dialog"
        :show-close="false"
        :visible.sync="showModal"
        width="260px"
        :before-close="closeModal"
        :close-on-click-modal="false"
      >
        <div class="questionnaire-tips">
          <div class="questionnaire-tips-title">填报须知</div>
          <div class="questionnaire-tips-text">
            {{ collectionData["guideline"] }}
          </div>
          <div class="questionnaire-btn" @click="closeModal">确定</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getViewCollection,
  signUpCollection,
  checkCollection,
  autoFill,
} from "@/api/consult/collection.js";
import FromitemActivity from "@/components/formgenerator/fromitem-activity-pool.vue";
import html2pdf from "html2pdf.js";
export default {
  components: {
    FromitemActivity,
  },
  beforeRouteEnter(to, form, next) {
    document.title = "The Pool";
    next();
  },

  data() {
    return {
      showModal: false,
      linkStatus: false,
      collectionData: {},
      collectionInfo: {},
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    document.title = "The Pool";
  },
  activated() {},
  computed: {
    ...mapGetters(["permissions", "dictpermissions"]),
  },
  methods: {
    async initData() {
      if (this.$route.query.id) {
        let params = {
          id: this.$route.query.id,
        };
        let data = await checkCollection(params);
        this.linkStatus = data ? data["linkStatus"] : 0;
        console.log("linkStatus", data);
        if (this.linkStatus) {
          this.collectionInfo["id"] = this.$route.query.id;
          setTimeout(() => {
            // this.getList();
            this.setTemplateData(data);
          }, 300);
        } else {
          this.$message({
            message: "该链接已失效<br/>This link has expired",
            type: "warning",
            duration: 0,
            dangerouslyUseHTMLString: true,
          });
        }
      } else {
        this.$message({
          message: "请检查链接是否正确<br/>Please check if the link is correct",
          type: "warning",
          duration: 0,
          dangerouslyUseHTMLString: true,
        });
      }
    },
    cancelData() {
      this.$alert("确认取消吗?", "取消", {
        confirmButtonText: "确定",
      }).then(() => {
        this.getList();
      });
    },
    getList() {
      console.log("getList", this.collectionInfo);
      getViewCollection(this.collectionInfo).then((res) => {
        if (res.data.success) {
          this.setTemplateData(res.data.data);
        }
      });
    },
    setTemplateData(data) {
      this.$nextTick(() => {
        this.collectionData = data;
        if (this.collectionData["guideline"]) {
          this.showModal = true;
        }
        this.$refs.FromitemActivity.type = "questionnaire";
        this.$refs.FromitemActivity.reSetForm(
          data.template,
          this.$route.query.id
        );
      });
    },
    async submit() {
      let data = await this.$refs.FromitemActivity.saveFormArrValue();
      this.signUpCollection(data);

      let hasAutoFill = this.$refs.FromitemActivity.hasAutoFill;
      if (hasAutoFill) {
        let autoFillinfo = this.$refs.FromitemActivity.autoFillinfo;
        if (autoFillinfo["phone"] && autoFillinfo["code"]) {
          const res = await autoFill(autoFillinfo);
        }
      }
      console.log("submit", data);
    },
    signUpCollection(data) {
      signUpCollection(data).then((res) => {
        if (res.data.success) {
          //   this.$message.success("提交成功");
          this.$router.push("/thepool/questionnaire/success");
        } else {
          this.$message.error("提交失败，请重试");
        }
      });
    },
    closeModal() {
      this.showModal = false;
    },
    // 导出PDF
    downloadPDF() {
      const element = document.getElementById("printPdf");
      const originalStyle = element.style.cssText; // 保存原来的样式
      element.style.width = "100%";
      element.style.maxWidth = "750px"; // A4 安全宽度（自适应，不是写死！）
      element.style.margin = "0 auto";
      element.style.height = "auto";
      element.style.overflow = "visible";
      const opt = {
        margin: 8,
        filename: this.collectionData["collectionName"],
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2, // 高清
          useCORS: true, // 图片正常
          logging: false,
          allowTaint: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      // 关键：自动把滚动内容全部展开 → 打印完整
      html2pdf().set(opt).from(element).save();
      element.style.cssText = originalStyle;
    },
  },
};
</script>

<style lang="scss" scoped></style>
