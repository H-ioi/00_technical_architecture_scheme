<template>
  <div>
    <el-dialog
      title="模板下载"
      :visible.sync="show"
      width="600px"
      :before-close="closeModal"
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
              :label="$t('isagroup.模板下载')"
              style="width: 90%"
              prop="modelId"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['modelId']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in modelList"
                  :label="i.originalName"
                  :value="i['files'][0]['fileId']"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              :loading="downLoadIng"
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >{{ $t("btn.确定") }}</el-button
            >
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("btn.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getmodellist, downloadModel } from "@/api/isa/science/sheet.js";
import { download } from "@/util/download.js";
import { downloadFile } from "@/api/upload/index.js";
export default {
  name: "fileModal",
  props: {},
  components: {},
  data() {
    let _this = this;
    return {
      show: false,
      ruleForm: { modelId: "" },
      rules: {
        modelId: [
          {
            required: true,
            message: _this.$t("common.请选择"),
            trigger: "blur",
          },
        ],
      },
      modelList: [],
      modelId: "",
      downLoadIng: false,
    };
  },
  created() {
    this.getmodellist();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    initData() {
      this.show = true;
    },
    downloadModel() {
      this.downLoadIng = true;
      downloadFile(this.ruleForm["modelId"])
        .then((res) => {
          this.$message.success(this.$t("consult.成功"));
          download(res.data, res.headers["content-disposition"]);
          this.downLoadIng = false;
        })
        .catch((err) => {
          this.downLoadIng = false;
        });
    },
    getmodellist() {
      getmodellist().then((res) => {
        console.log("getmodellist", res);

        if (res.data.success) {
          this.modelList = res.data.data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.downloadModel();
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.show = false;
      this.ruleForm = { fileIds: [] };
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped></style>
