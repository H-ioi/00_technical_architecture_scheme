<template>
  <div>
    <el-dialog
      :title="typeTitel[type]"
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
            <el-form-item label="接口文件名" style="width: 90%" prop="fname">
              <el-input
                v-model="ruleForm['fname']"
                placeholder="请输入"
                maxlength="200"
              ></el-input>
            </el-form-item>
            <el-form-item label="接口描述" style="width: 90%" prop="fileDesc">
              <el-input
                type="textarea"
                :rows="5"
                maxlength="500"
                show-word-limit
                v-model="ruleForm['fileDesc']"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="接口状态" style="width: 90%" prop="fileStatus">
              <el-switch
                v-model="ruleForm['fileStatus']"
                active-color="#2A3F54"
                inactive-color="#C0C4CC"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="文件" style="width: 90%" prop="fileId">
              <FileList
                ref="filelist"
                :scene="'interface_file_attachment'"
                :isDisabled="false"
                :showDownload="true"
                :limit="1"
                :types="'image/jpeg,image/png,.pdf, .doc, .docx'"
              />
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="default" size="medium" @click="closeModal"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  addInterfaceFile,
  editInterfaceFile,
  checkFormFileName
} from "@/api/isa/interfacemanager.js";
import FileList from "@/components/isacentercommon/FileList";
export default {
  name: "fileModal",
  components: {
    FileList
  },
  props: {},
  data() {
    console.log("this", this);
    const valifname = async (rule, value, callback) => {
      let data = await checkFormFileName(value, this.type, this.ruleForm);
      if (!data) {
        callback();
      } else {
        callback(new Error("接口名重复，请重新输入"));
      }
    };
    return {
      show: false,
      type: "add",
      typeTitel: {
        add: "新增接口文件",
        edit: "编辑接口文件"
      },
      ruleForm: { fname: "", fileDesc: "", fileStatus: 0, fileId: "" },
      rules: {
        fname: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: valifname, trigger: "blur" }
        ],
        fileId: [{ required: true, message: "请上传", trigger: "blur" }]
      }
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getFileList() {
      let list = this.$refs["filelist"].filelistobj;
      console.log("list", list);
      if (list.length > 0) {
        this.ruleForm["fileId"] = list[0]["id"];
      } else {
        this.ruleForm["fileId"] = "";
      }
    },
    submitForm(formName) {
      this.getFileList();
      this.$nextTick(() => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let obj = {
              scene: "interface_file_attachment",
              fname: this.ruleForm["fname"],
              fileDesc: this.ruleForm["fileDesc"],
              fileStatus: this.ruleForm["fileStatus"] ? 1 : 0
            };
            let filelistobj = this.$refs["filelist"].filelistobj;
            if (filelistobj.length > 0) {
              obj["fileIds"] = [filelistobj[0].id];
            }
            switch (this.type) {
              case "add":
                addInterfaceFile(obj).then(res => {
                  // this.$refs["filelist"].updateFile(res.data.data);
                  this.$emit("resetPageList");
                  this.$message({
                    type: "success",
                    message: "成功!"
                  });
                  this.closeModal();
                });
                break;
              case "edit":
                obj["id"] = this.ruleForm["id"];
                editInterfaceFile(obj).then(res => {
                  // this.$refs["filelist"].updateFile(obj.id);
                  this.$emit("resetPageList");
                  this.$message({
                    type: "success",
                    message: "成功!"
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
            fname: item["fname"],
            fileDesc: item["fileDesc"],
            fileStatus: item["fileStatus"],
            id: item["id"]
          };
          this.$nextTick(() => {
            this.$refs["filelist"].getFileList(item["id"]);
          });
          break;
      }
    },
    closeModal() {
      this.show = false;
      this.ruleForm = { fname: "", fileDesc: "", fileStatus: 0 };
      this.$refs["filelist"].clearData();
    }
  }
};
</script>

<style lang="scss" scoped></style>
