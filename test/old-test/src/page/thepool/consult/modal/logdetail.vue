<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.详情')"
      :visible.sync="logDetail"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.跟进人')"
              prop="follow_user_name"
              style="width: 50%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                ruleForm.follow_user_name
              }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('consult.跟进联系人')"
              prop="follow_contactor_name"
              style="width: 50%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                checkNull(ruleForm.follow_contactor_name)
              }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('consult.跟进时间')"
              prop="followTime"
              style="width: 50%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                checkNull(ruleForm.followTime)
              }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('consult.跟进类型')"
              prop="followType"
              style="width: 50%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                checkNull(ruleForm.followTypeLabel)
              }}</span>
            </el-form-item>
            <el-form-item
              v-if="isClue"
              :label="$t('consult.学生')"
              prop="studentName"
              style="width: 50%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                checkNull(ruleForm.studentName)
              }}</span>
            </el-form-item>
            <el-form-item
              v-if="isClue"
              :label="$t('consult.家长')"
              prop="guardianName"
              style="width: 50%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                checkNull(ruleForm.guardianName)
              }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('consult.备注')"
              prop="followDesc"
              style="width: 80%"
            >
              <span style="color: #0d0d0d; line-height: 18px">{{
                checkNull(ruleForm.followDesc)
              }}</span>
            </el-form-item>
            <el-form-item style="width: 60%" :label="$t('consult.附件')">
              <FileList
                ref="filelist"
                :scene="'enquiry_enroll'"
                :isDisabled="true"
                :showDownload="true"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addlog, updateFile } from "@/api/consult/index.js";
import FileList from "@/components/common/FileList";
export default {
  name: "addlog",
  props: {
    logDetail: Boolean,
    isClue: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    FileList,
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "userList", "userInfo"]),
  },
  methods: {
    setFeilList(data) {
      this.$nextTick(() => {
        this.$refs["filelist"].getFileList(data);
      });
    },
    closeModal() {
      this.ruleForm = {};
      this.$emit("changeModal", false);
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
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
