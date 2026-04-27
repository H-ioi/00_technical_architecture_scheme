<template>
  <div>
    <el-dialog
      :title="$t('btn')[typeTitel[type]]"
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
              v-if="schoolList.length > 1"
              :label="$t('isagroup.选择学校')"
              style="width: 90%"
              prop="schoolIdList"
            >
              <el-select
                style="width: 100%"
                multiple
                clearable
                v-model="ruleForm['schoolIdList']"
                :placeholder="$t('isagroup.选择学校')"
                @clear="initData"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolList"
                  :label="i.enName"
                  :value="i.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.文件')" style="width: 90%" prop="fileIds">
              <FileList
                ref="filelist"
                :scene="'dataform_file_attachment'"
                :isDisabled="false"
                :showDownload="true"
                :limit="1"
                types=".xlsx, .xls"
                :tipsText="$t('isagroup.文件只支持上传Excel文件格式，且不能超过20MB')"
              />
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("btn.保存")
            }}</el-button>
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
import { addSheet, editSheet } from "@/api/isa/science/sheet.js";
import FileList from "@/components/isagroupcommon/FileList";
export default {
  name: "fileModal",
  props: {
    schoolList: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  components: {
    FileList,
  },
  data() {
    let _this = this;
    return {
      show: false,
      type: "add",
      typeTitel: {
        add: "新增",
        edit: "编辑",
      },
      ruleForm: { schoolIds: [], fileIds: [] },
      rules: {
        schoolIdList: [
          {
            required: true,
            message: _this.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        fileIds: [
          {
            required: true,
            message: _this.$t("isagroup.请上传"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getFileList() {
      let list = this.$refs["filelist"].filelistobj;
      console.log("list", list);
      if (list.length > 0) {
        this.ruleForm["fileIds"] = [list[0]["id"]];
      } else {
        this.ruleForm["fileIds"] = [];
      }
    },
    submitForm(formName) {
      this.getFileList();
      if (this.schoolList.length == 1) {
        this.ruleForm["schoolIdList"] = [this.schoolList[0]["id"]];
      }
      this.$nextTick(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append("schoolIdList", this.ruleForm["schoolIdList"]);
            formData.append("fileIds", this.ruleForm["fileIds"]);
            switch (this.type) {
              case "add":
                addSheet(formData).then((res) => {
                  this.$emit("resetPageList");
                  this.$message({
                    type: "success",
                    message: this.$t("common.成功"),
                  });
                  this.closeModal();
                });
                break;
              case "edit":
                formData.append("id", this.ruleForm["id"]);
                editSheet(formData).then((res) => {
                  this.$emit("resetPageList");
                  this.$message({
                    type: "success",
                    message: this.$t("common.成功"),
                  });
                  this.closeModal();
                });
                break;
            }
          } else {
            return false;
          }
        });
      });
    },
    initData(type, item = {}) {
      this.show = true;
      this.type = type;
      switch (type) {
        case "add":
          break;
        case "edit":
          this.ruleForm = {
            ...this.ruleForm,
            fileIds: item["fileIds"],
            schoolIdList: item["schoolIdList"],
            id: item["id"],
          };
          this.$nextTick(() => {
            this.$refs["filelist"].getFileList(item["id"]);
          });
          break;
      }
    },
    closeModal() {
      this.show = false;
      this.ruleForm = { fileIds: [] };
      this.$refs["filelist"].clearData();
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped></style>
