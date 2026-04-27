<template>
  <div class="questionnaire-container">
    <div class="questionnaire" v-if="linkStatus">
      <div class="questionnaire-nav">
        <div class="questionnaire-nav_text">
          {{ collectionData["collectionName"] }}
        </div>
      </div>
      <el-scrollbar class="questionnaire-content">
        <div class="questionnaire-content-scroll">
          <FromitemActivity
            ref="FromitemActivity"
            type="questionnaire"
            @signUpCollection="signUpCollection"
          />
        </div>
      </el-scrollbar>
      <div class="questionnaire-footter">
        <!-- <div class="questionnaire-cancel" @click="cancelData">取消</div> -->
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
} from "@/api/consult/collection.js";
import FromitemActivity from "@/components/formgenerator/fromitem-activity-pool.vue";
import { set } from "lodash";
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
        console.log("linkStatus", this.linkStatus);
        if (this.linkStatus) {
          this.collectionInfo["id"] = this.$route.query.id;
          setTimeout(() => {
            this.getList();
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
          this.$nextTick(() => {
            this.collectionData = res.data.data;
            if (this.collectionData["guideline"]) {
              this.showModal = true;
            }
            this.$refs.FromitemActivity.type = "questionnaire";
            // this.$refs.FromitemActivity.templateFormId = res.data.data.id;
            this.$refs.FromitemActivity.reSetForm(
              res.data.data.template,
              this.$route.query.id
            );
          });
        }
      });
    },
    async submit() {
      let data = await this.$refs.FromitemActivity.saveFormArrValue();
      this.signUpCollection(data);
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
  },
};
</script>

<style lang="scss" scoped>
// .questionnaire-container {
//   width: 100%;
//   .questionnaire {
//     max-width: 750px;
//     margin: 0 auto;
//   }
// }
</style>
