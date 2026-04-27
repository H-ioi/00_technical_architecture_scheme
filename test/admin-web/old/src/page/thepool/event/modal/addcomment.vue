<template>
  <div class="thepool_page">
    <el-dialog
      :title="type == 'add' ? $t('consult.新增') : $t('consult.编辑')"
      :visible.sync="showModal"
      width="600px"
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
            <el-form-item :label="$t('consult.评论')" prop="comment" style="width: 100%">
              <el-input
                v-model="ruleForm.comment"
                :placeholder="$t('consult.请输入')"
                maxlength="800"
                type="textarea"
                rows="8"
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
import { addComment } from "@/api/consult/event.js";
import { consult } from "@/const/consult/index.js";
export default {
  name: "guardians",
  components: {},
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  data() {
    let that = this;
    return {
      consult: consult,
      type: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        comment: [
          { required: true, message: that.$t("consult.请输入"), trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    async initModal() {
      this.type = "add";
      this.showModal = true;
    },

    addComment() {
      let data = {
        eventId: this.eventId,
        ...this.ruleForm,
      };
      addComment(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.closeModal();
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addComment();
        }
      });
    },
    closeModal() {
      this.type = "add";
      this.ruleForm = {};
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
