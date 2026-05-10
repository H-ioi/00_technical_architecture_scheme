<template>
  <div>
    <el-dialog
      :title="$t('consult.新增跟进记录')"
      :visible.sync="showAddLog"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
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
            <!-- <el-form-item
              :label="$t('consult.跟进人')"
              prop="id"
              style="width: 50%"
            >
              <el-select
                multiple
                filterable
                v-model="ruleForm.follow_user_ids"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item
              :label="$t('consult.跟进人')"
              prop="follow_user_name"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.follow_user_name"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.跟进联系人')"
              prop="follow_contactor_name"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.follow_contactor_name"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.跟进时间')"
              prop="followTime"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.followTime"
                type="datetime"
                :placeholder="$t('consult.请选择')"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.跟进类型')"
              prop="followType"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.followType"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dictionary['follow_type']"
                  :key="item.value"
                  :label="i18nlocel=='en'?item.enLabel:item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('consult.备注')"
              prop="followDesc"
              style="width: 80%"
            >
              <el-input
                v-model.trim="ruleForm.followDesc"
                :placeholder="$t('consult.请输入')"
                type="textarea"
                rows="5"
                :maxlength="300"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 60%" :label="$t('consult.附件')">
              <FileList
                ref="filelist"
                :scene="'enquiry_enroll'"
                :isDisabled="false"
              />
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
            <el-button type="default" size="medium" @click="closeModal">{{
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
import { addlog, updateFile } from "@/api/consult/index.js";
import FileList from "@/components/common/FileList";
export default {
  name: "addlog",
  props: {
    showAddLog: Boolean,
    currentClueId: String,
  },
  components: {
    FileList,
  },
  data() {
    return {
      ruleForm: {
        follow_user_ids: [],
        follow_user_name: "",
        follow_contactor_name: "",
        followTime: "",
        followType: "",
        followDesc: "",
      },
      rules: {
        follow_user_ids: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        follow_user_name: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        follow_contactor_name: [
          { required: false, message: "请输入", trigger: "blur" },
        ],
        followTime: [{ required: true, message: "请选择", trigger: "blur" }],
        followType: [{ required: true, message: "请选择", trigger: "blur" }],
        followDesc: [{ required: false, message: "请输入", trigger: "blur" }],
      },
    };
  },
  created() {
    console.log("this.userInfo", this.userInfo);
    this.ruleForm.follow_user_name = this.userInfo.username;
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "userList", "userInfo",'i18nlocel']),
  },
  methods: {
    addlog(data) {
      addlog(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            let obj = new FormData();
            obj.append("scene", "follow_record_attachment");
            obj.append("outerId", res.data.data);
            obj.append("ids", fileIds);
            // let obj = {
            //   scene: "follow_record_attachment",
            //   outerId: res.data.data,
            //   ids: fileIds,
            // };
            this.setLogFeil(obj);
          }
        }
      });
    },
    setLogFeil(data) {
      updateFile(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            outerId: this.currentClueId,
            scene: "enquiry_enroll",
            followTime: this.ruleForm.followTime,
            followType: this.ruleForm.followType,
            followDesc: this.ruleForm.followDesc,
            extras: [
              {
                key: "follow_user_name",
                value: this.ruleForm.follow_user_name,
              },
              {
                key: "follow_contactor_name",
                value: this.ruleForm.follow_contactor_name,
              },
            ],
          };

          this.addlog(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        studentName: "",
        enrollLevel: "",
        guardianTitle: "",
        contactMethod: "",
      };
      this.$emit("changeModal", false);
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