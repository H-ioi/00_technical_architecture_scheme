<template>
  <el-dialog
    :center="true"
    :top="'5vh'"
    :title="
      modaltype == 'add'
        ? '新增通知'
        : modaltype == 'look'
        ? '通知详情'
        : '编辑通知内容'
    "
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="changeModal"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      :label-position="'top'"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <div class="cardcontentbox">
        <div class="title_text">基本信息</div>
        <!-- <div class="df_aw"> -->
        <el-form-item
          label="消息标题"
          prop="title"
          :style="`width:${inputwidth}; padding-right: 20px `"
        >
          <el-input
            v-model="ruleForm.title"
            placeholder="请输入"
            :disabled="modaltype == 'look'"
          ></el-input>
        </el-form-item>
        <div class="df_aw">
          <el-form-item
            label="发送对象"
            prop="sendBy"
            :style="`width:${inputwidth}; padding-right: 20px`"
          >
            <el-radio-group
              v-model="ruleForm.sendBy"
              :disabled="modaltype == 'look'"
              @change="changeSendBy"
            >
              <el-radio
                :label="item.value"
                v-for="(item, index) in sendBydata"
                :key="index"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="发送方式"
            prop="status"
            :style="`width:${inputwidth}; padding-right: 20px`"
          >
            <el-radio-group
              v-model="ruleForm.status"
              @change="changestatus"
              :disabled="modaltype == 'look'"
            >
              <el-radio
                :label="item.value"
                v-for="(item, index) in messagestatus"
                :key="index"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="ruleForm.status === 0"
            label="发送时间"
            prop="sendTime"
            :style="`width:${inputwidth}; padding-right: 20px`"
          >
            <el-date-picker
              style="width: 100%"
              v-model="ruleForm.sendTime"
              type="datetime"
              placeholder="选择日期时间"
              :value-format="'yyyy-MM-dd HH:mm:ss'"
              :picker-options="pickerOptions"
              :disabled="modaltype == 'look'"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="df_aw">
          <el-form-item
            v-if="ruleForm.sendBy === 1"
            label="通知群体"
            prop="noticeGroup"
            :style="`width:${inputwidth}; padding-right: 20px`"
          >
            <el-radio-group
              v-model="ruleForm.noticeGroup"
              @change="setuser([])"
              :disabled="modaltype == 'look'"
            >
              <el-radio
                :label="item.value"
                v-for="(item, index) in noticeGroupdata"
                :key="index"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.sendBy === 2 || ruleForm.noticeGroup !== undefined"
            label="选择人员"
            prop="user"
            :style="`width:60%; padding-right: 20px`"
          >
            <UserTree
              ref="usertree"
              v-if="ruleForm.noticeGroup == 4 && ruleForm.sendBy === 1"
              size="small"
              @setuser="setuser"
              :options="depttree"
              :isDisabled="modaltype == 'look'"
            ></UserTree>
            <el-select
              multiple
              v-if="ruleForm.noticeGroup == 2 && ruleForm.sendBy === 1"
              style="width: 100%"
              v-model="ruleForm.user"
              placeholder="请选择"
              :disabled="modaltype == 'look'"
            >
              <el-option
                v-for="(item, index) in tenantUser"
                :key="index"
                :label="item.username"
                :value="String(item.userId)"
              >
              </el-option>
            </el-select>
            <el-select
              multiple
              v-if="ruleForm.sendBy === 2"
              style="width: 100%"
              v-model="ruleForm.user"
              placeholder="请选择名片用户"
              :disabled="modaltype == 'look'"
            >
              <el-option
                v-for="(item, index) in cardUser"
                :key="index"
                :label="item.name"
                :value="item.cardUserId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- </div> -->
      </div>
      <div class="cardcontentbox">
        <!-- <div class="title_text">发送内容</div> -->
        <el-form-item
          prop="details"
          label="发送内容"
          :style="`width:70%; padding-right: 20px`"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入通知内容"
            v-model="ruleForm.details"
            :disabled="modaltype == 'look'"
          >
          </el-input>
        </el-form-item>
        <FileList
          ref="scene_message"
          :scene="scene_message"
          @setfilelist="setmessage"
          :isDisabled="modaltype == 'look'"
        />
      </div>
      <el-form-item class="fromBtn" v-if="modaltype !== 'look'">
        <el-button @click="changeModal">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getUserAll, getUserids, getCardUser } from "@/api/admin/message.js";
import { fetchTree } from "@/api/admin/dept";
import UserTree from "@/components/commonConpents/UserTree";
import FileList from "@/components/conpents_card/FileList";
import DeepTree from "@/components/conpents_card/DeepTree";
export default {
  name: "UniUiModal",
  props: {
    dialogVisible: Boolean,
    modaltype: String,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          let date = Date.now() - 24 * 3600 * 1000;
          return time.getTime() < date;
        },
      },
      depttree: [],
      tenantUser: [],
      cardUser: [],
      scene_message: "message_attachment",
      ruleForm: {},
      rules: {
        title: [{ required: true, message: "请填写", trigger: "blur" }],
        sendBy: [{ required: true, message: "请选择", trigger: "blur" }],
        status: [{ required: true, message: "请选择", trigger: "blur" }],
        sendTime: [{ required: true, message: "请选择", trigger: "blur" }],
        noticeGroup: [{ required: true, message: "请选择", trigger: "blur" }],
        user: [{ required: true, message: "请选择", trigger: "blur" }],
        details: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      inputwidth: "33.33%",
      dialogImageUrl: "",
      messagestatus: [
        { label: "立即发送", value: 1 },
        { label: "定时发送", value: 0 },
      ],
      sendBydata: [
        { label: "小程序", value: 2 },
        { label: "后台用户", value: 1 },
      ],
      noticeGroupdata: [
        // { label: "所有人", value: "1" },
        { label: "本租户", value: 2 },
        // { label: "部门", value: "3" },
        { label: "部门人员", value: 4 },
      ],
    };
  },
  created() {
    this.fetchtree();
    this.getUserAll();
    this.getCardUser();
  },
  mounted() {},

  methods: {
    getUserAll() {
      getUserAll().then((res) => {
        console.log("res", res);
        this.getUserids({ ids: res.data.data.userIds });
      });
    },
    getUserids(ids) {
      getUserids(ids).then((res) => {
        console.log("res666", res);
        this.tenantUser = res.data.data;
      });
    },
    getCardUser() {
      getCardUser().then((res) => {
        console.log("res", res);
        this.cardUser = res.data;
      });
    },
    fetchtree() {
      fetchTree().then((res) => {
        console.log("res", res.data.data);
        this.depttree = res.data.data;
      });
    },
    changestatus(e) {
      if (Number(e) && this.ruleForm["sendTime"]) {
        delete this.ruleForm["sendTime"];
      }
    },
    changeSendBy(e) {
      delete this.ruleForm["user"];
      if (e === 1) {
        delete this.ruleForm["noticeGroup"];
      }
    },
    changeModal() {
      this.ruleForm = {};
      this.$refs["scene_message"].clearData();
      this.$emit("changeModal", false);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          let time = this.checktime(this.ruleForm.sendTime);
          console.log("time", time);
          if (!time) {
            console.log(11111);
            return;
          } else {
            console.log(2222222);
            this.$emit("submitForm", this.ruleForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    checktime(time) {
      let _5min = 5 * 60 * 1000;
      let sendtime = new Date(time).getTime();
      console.log("sendtime", sendtime);
      console.log("now", Date.now());
      if (_5min > sendtime - Date.now()) {
        console.log("不够5分钟");
        this.$message.warning("发送时间必须大于五分钟后的时间");
        return false;
      } else {
        return true;
      }
    },
    getfilelist(id) {
      this.$refs["scene_message"].getFileList({
        scene: this.scene_message,
        outerId: id,
      });
    },
    setmessage(data) {
      this.ruleForm["file"] = data;
    },
    setuser(data) {
      console.log("data", data);
      this.ruleForm.user = data;
    },
  },
  components: {
    DeepTree,
    FileList,
    UserTree,
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner {
  border: 1px solid #dcdfe6;
}
/deep/.el-dialog__body {
  padding-top: 0;
}
/deep/.el-radio__label {
  font-size: 16px;
  color: #999999;
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
}
</style>