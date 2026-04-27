<template>
  <el-dialog
    title="新增履约记录"
    :before-close="closeModal"
    :visible.sync="showperformance"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="top"
    >
      <div class="inputBox">
        <el-form-item
          :label="item.label"
          :prop="item.value"
          :style="formitem"
          :key="index"
          v-for="(item, index) in templatedata"
        >
          <el-input
            placeholder="请填写指标数据"
            v-model="ruleForm[item.value]"
          ></el-input>
        </el-form-item>
        <el-form-item label="收款金额" prop="amount" :style="formitem">
          <el-input
            placeholder="请填写收款金额"
            v-model="ruleForm.amount"
          ></el-input>
        </el-form-item>
      </div>
      <Texteare :ruleForm="ruleForm" :Texteare="text" :isedit="true" />
      <el-form-item label="附件信息">
        <div class="filebox df_aw">
          <div
            class="fileboxitem"
            v-for="(item, index) in filelistobj"
            :key="index"
          >
            <img
              width="70px"
              :src="`/menu_icon/fileimg/${item.type}.png`"
              alt=""
            />
            <span>{{ item.name }}</span>
          </div>
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item class="fromBtn">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { uploadFile } from "@/api/upload/index.js";
import Texteare from "@/components/commonConpents/commonFrom/Texteare";
export default {
  name: "UniUiAddnewcontart",
  props: {
    showperformance: Boolean,
    templatedata: Array,
    ruleForm: Object,
  },
  data() {
    let valiNumberPass1 = (rule, value, callback) => {
      //包含小数的数字
      // let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      let reg = /^[0-9]+(.?[0-9]{0,1}[1-9]?)$/g;
      if (value === "") {
        callback(new Error("请输入金额"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入数字最多保留两位小数"));
      } else {
        callback();
      }
    };
    return {
      formitem: "width:50%;padding-right:20px",
      filelist: [],
      filelistobj: [],
      rules: {
        name: [{ required: true, message: "请填写", trigger: "blur" }],
        amount: [
          { required: false, validator: valiNumberPass1, trigger: "blur" },
        ],
      },
      text: {
        label: "备注",
        prop: "note",
        placeholder: "请输入",
      },
    };
  },
  created() {},
  mounted() {},

  methods: {
    uploadfile(data, name) {
      uploadFile(data).then((res) => {
        this.$message.success("上传成功");
        this.filelist.push(res.data.data);
        this.setfilename(name);
      });
    },
    setfilename(name) {
      let arr = name.split(".");
      let obj = {
        name,
        type: arr[1],
      };
      this.filelistobj.push(obj);
      console.log(" this.filelistobj", this.filelistobj);
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const name = file.name;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
      let obj = new FormData();
      obj.append("file", file);
      obj.append("scene", "contract_performance_attachment");
      this.uploadfile(obj, name);
    },
    closeModal() {
      this.$emit("closeModal", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("this.ruleForm", this.ruleForm);
          let arr = [];
          Object.keys(this.ruleForm).forEach((item) => {
            if (item !== "note" && item !== "amount") {
              let data = {
                quota: item,
                value: this.ruleForm[item],
              };
              arr.push(data);
            }
          });
          let obj = {
            contractId: this.$route.query.id,
            quotas: arr,
            note: this.ruleForm["note"],
            amount: Number(this.ruleForm["amount"]) * 100,
            fileIds: this.filelist,
          };

          this.$emit("addperformance", obj);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeshowAddNewContart() {
      this.$emit("changeshowAddNewContart");
    },
  },
  components: {
    Texteare,
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__footer {
  text-align: center;
}
/deep/.el-dialog__body {
  padding-top: 0;
}
/deep/.dialog-footer {
  .el-button {
    width: 160px;
    height: 40px;
  }
}
.inputBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/deep/.el-input__inner {
  border: 1px solid #dcdfe6;
}
/deep/.avatar-uploader-icon {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
/deep/.avatar-uploader {
  margin-right: 20px;
  margin-bottom: 20px;
}
.fileboxitem {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-bottom: 20px;
  // border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  span {
    font-size: 14px;
    font-weight: 600;
    color: #2c88f5;
    padding: 5px;
  }
}
</style>