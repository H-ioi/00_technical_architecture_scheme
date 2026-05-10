<template>
  <div class="thepool_page">
    <el-dialog
      :title="type == 'add' ? $t('consult.新增') : $t('consult.编辑')"
      :visible.sync="showModal"
      width="1000px"
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
            <el-form-item
              :label="$t('consult.任务主题')"
              prop="taskSubject"
              style="width: 49%"
            >
              <el-input
                v-model="ruleForm.taskSubject"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.咨询')" prop="clueId" style="width: 49%">
              <div @click="selectClueList" class="selectInput">
                <el-input
                  v-model="ruleForm.clueName"
                  :placeholder="$t('consult.请选择')"
                  maxlength="20"
                  readonly
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('consult.重要程度')"
              prop="importanceLevel"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.importanceLevel"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in consult['importanceLevel']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('consult.任务类型')"
              prop="taskTimeType"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.taskTimeType"
                :placeholder="$t('consult.请选择')"
                @change="handleTaskTimeTypeChange"
              >
                <el-option
                  v-for="item in consult['taskTimeType']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.taskTimeType == '0'"
              :label="$t('consult.任务时间')"
              prop="taskTime"
              style="width: 49%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.taskTime"
                type="datetime"
                :placeholder="$t('consult.请选择')"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.负责人')"
              prop="personInCharge"
              style="width: 49%"
            >
              <SingleTree
                ref="personInCharge"
                size="small"
                :treeData="treeData"
                @setUser="setPersonInCharge"
              ></SingleTree>
            </el-form-item>
            <el-form-item
              :label="$t('consult.参与人员')"
              prop="teamParticipantsIds"
              style="width: 49%"
            >
              <UserTree
                ref="participants"
                size="small"
                :treeData="treeData"
                @setUser="setTeamParticipants"
              ></UserTree>
            </el-form-item>

            <el-form-item
              :label="$t('consult.完成状态')"
              prop="completeStatus"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.completeStatus"
                :placeholder="$t('consult.请选择')"
                @change="handleCompleteStatusChange"
              >
                <el-option
                  v-for="item in consult['completeStatus']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('consult.提醒方式')"
              prop="expirationReminder"
              style="width: 49%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.expirationReminder"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in consult['expirationReminder']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.完成进度')"
              prop="completeProgress"
              style="width: 100%"
            >
              <div class="progress" id="progress" @mousedown="onDragStart">
                <el-progress
                  color="#E9AA83"
                  style="cursor: pointer"
                  :percentage="ruleForm.completeProgress"
                ></el-progress>
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('consult.任务描述')"
              prop="taskDetails"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.taskDetails"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="5"
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
      <el-dialog
        width="80%"
        :title="$t('consult.咨询列表')"
        :visible.sync="innerVisible"
        custom-class="pooldialog"
        append-to-body
      >
        <el-tabs class="clueTabs" v-model="activeName">
          <el-tab-pane :label="$t('consult.我的咨询')" name="myclue">
            <selectMyClue v-if="innerVisible" ref="selectMyClue" />
          </el-tab-pane>
          <el-tab-pane :label="$t('consult.咨询列表')" name="cluelist">
            <selectClue v-if="innerVisible" ref="selectClue" />
          </el-tab-pane>
        </el-tabs>
        <span
          slot="footer"
          class="dialog-footer"
          style="width: 100%; text-align: center !important; display: block"
        >
          <el-button round type="primary" @click="selectClueData">{{
            $t("consult.确定")
          }}</el-button>
          <el-button round @click="innerVisible = false">{{
            $t("consult.取消")
          }}</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addTask, editTask, getTaskInfo } from "@/api/consult/task.js";
import { getOrganizationUserInfo } from "@/api/consult/common.js";
import { getClueDropdownList } from "@/api/consult/index.js";
import { consult } from "@/const/consult/index.js";
import UserTree from "@/components/thepoolcommon/UserTree";
import SingleTree from "@/components/thepoolcommon/SingleTree";
import selectMyClue from "@/page/thepool/modal/selectMyClue";
import selectClue from "@/page/thepool/modal/selectClue";
export default {
  name: "guardians",
  components: {
    UserTree,
    SingleTree,
    selectMyClue,
    selectClue,
  },
  props: {},
  // 添加computed来获取i18nlocel
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  data() {
    let that = this;
    return {
      consult: consult,
      type: "add",
      showModal: false,
      innerVisible: false,
      ruleForm: {},
      rules: this.initRules(), // 使用方法初始化rules
      treeData: [],
      isDragEnd: false,
      clueList: [],
      activeName: "myclue",
      taskClueList: [],
    };
  },
  // 添加watch来监测i18nlocel变化
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          // 语言切换时刷新rules
          this.rules = this.initRules();
          // 如果表单已经验证过，清除验证状态以便重新验证时显示新语言的提示
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate();
          }
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getUserList();
    this.getClueList();
  },
  methods: {
    // 初始化rules的方法，便于语言切换时重新生成
    initRules() {
      return {
        taskSubject: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        taskDetails: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        importanceLevel: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        taskTimeType: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        personInCharge: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        teamParticipantsIds: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        completeStatus: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        completeProgress: [
          { required: false, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        expirationReminder: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        clueId: [{ required: true, message: this.$t("consult.请选择"), trigger: "blur" }],
        taskTime: [
          { required: false, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
      };
    },

    async initModal() {
      this.type = "add";
      this.showModal = true;
    },

    addTask(data) {
      addTask(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    editTask(data) {
      editTask(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getTaskInfo({ taskId: id }).then((res) => {
        if (res.data.success) {
          this.type = "edit";
          this.showModal = true;
          this.taskClueList = [];
          let data = res.data.data;
          let userNames = data.participants.map((user) => user.userName);
          let userIds = data.participants.map((user) => user.userId);
          let clueInfos = data.clueInfos || [];
          this.taskClueList = clueInfos.map((item) => {
            return {
              id: item.clueId,
              guardianTitle: item.clueName,
              contactMethod: item.contactMethod,
            };
          });
          this.$nextTick(() => {
            this.ruleForm = {
              taskId: data.taskId,
              taskSubject: data.taskSubject,
              taskDetails: data.taskDetails,
              clueId: data.clueId.split(","),
              importanceLevel: String(data.importanceLevel),
              taskTimeType: String(data.taskTimeType),
              taskTime: data.taskTime,
              personInCharge: data.personInCharge,
              completeStatus: String(data.completeStatus),
              expirationReminder: String(data.expirationReminder),
              completeProgress: data.completeProgress,
              clueName: data.clueName,
            };
            this.$refs["personInCharge"].labelModel = data["personInChargeName"];
            this.$refs["personInCharge"].checkedId = data["personInCharge"];
            this.$refs["participants"].labelModel = userNames;
            this.$refs["participants"].checkedId = userIds;
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm["expirationReminder"]) {
            this.ruleForm["expirationReminder"] = 0;
          }
          if (this.type == "add") {
            this.addTask(this.ruleForm);
          } else {
            this.editTask(this.ruleForm);
          }
        }
      });
    },
    setPersonInCharge(data) {
      console.log("setPersonInCharge", data);
      this.ruleForm["personInCharge"] = String(data);
    },
    setTeamParticipants(data) {
      console.log("setTeamParticipants", data);
      this.ruleForm["teamParticipantsIds"] = data;
    },
    closeModal() {
      this.type = "add";
      this.ruleForm = {};
      this.taskClueList = [];
      this.showModal = false;
    },
    selectClueData() {
      this.innerVisible = false;
      let myClue = this.$refs.selectMyClue.getSelectClue();
      let cluelist = this.$refs.selectClue.getSelectClue();
      let allList = [...myClue, ...cluelist];
      let clueIds = [];
      let clueNames = [];
      this.taskClueList = [];
      allList.forEach((item) => {
        if (!clueIds.includes(item.id)) {
          this.taskClueList.push(item);
          clueIds.push(item.id);
          clueNames.push(item.guardianTitle + item.contactMethod);
        }
      });
      this.ruleForm = {
        ...this.ruleForm,
        clueId: clueIds,
        clueName: String(clueNames),
      };
      this.$refs.ruleForm.clearValidate("clueId");
    },
    selectClueList() {
      this.innerVisible = true;
      this.$nextTick(() => {
        this.$refs.selectMyClue.initData();
        this.$refs.selectClue.initData();
        this.$refs.selectMyClue.setSelectClueItems(this.taskClueList || []);
        this.$refs.selectClue.setSelectClueItems(this.taskClueList || []);
      });
    },
    handleCompleteStatusChange(e) {
      console.log("handleCompleteStatusChange", e);
      if (String(e) == "1") {
        this.ruleForm = {
          ...this.ruleForm,
          completeProgress: 100,
        };
      } else {
        this.ruleForm = {
          ...this.ruleForm,
          completeProgress: 0,
        };
      }
    },
    handleTaskTimeTypeChange(e) {
      console.log("handleTaskTimeTypeChange", e);
      this.$set(this.rules["taskTime"], 0, {
        ...this.rules["taskTime"][0],
        required: String(e) == "0",
      });
      if (!String(e) == "0") {
        delete this.ruleForm["taskTime"];
      }
    },
    async getClueList() {
      this.clueList = await getClueDropdownList({ pageSize: 40, pageNum: 1 });
      this.clueList.map((item) => {
        item["label"] = item["guardianTitle"] + item["contactMethod"];
      });
    },
    async getUserList() {
      let data = {};
      data["subDepartments"] = await getOrganizationUserInfo();
      // 使用示例
      this.treeData = this.convertToTree(data);
    },
    convertToTree(data) {
      // 处理部门节点
      let subDepartments = data.subDepartments || [];
      let departmentNodes =
        subDepartments.map((dept) => ({
          id: dept.departmentId, // 添加前缀避免与人员ID冲突
          label: dept.departmentName,
          type: 1, // 1表示部门
          children: this.convertToTree(dept), // 递归处理子部门
        })) || [];

      // 处理人员节点
      let userInfoList = data.userInfoList || [];
      let userNodes =
        userInfoList.map((user) => ({
          id: user.userId,
          label: user.userName, // 可根据实际字段调整
          type: 2, // 2表示人员
          is_leaf: true,
          ...user, // 保留原始用户信息
        })) || [];

      // 合并部门和人员节点
      return [...departmentNodes, ...userNodes];
    },
    // 自定义进度条点击拖拽
    onDragStart(event) {
      if (String(this.ruleForm.completeStatus) == "1") return;
      this.isDragEnd = true;
      const progressBox = this.$el.querySelector(".progress");
      progressBox.addEventListener("mouseup", this.onDragEnd);
      progressBox.addEventListener("mousemove", this.onDrag);
    },
    onDragEnd() {
      this.isDragEnd = false;
    },
    onDrag(event) {
      if (this.isDragEnd) {
        const progressBox = this.$el.querySelector(".progress");
        const rect = progressBox.getBoundingClientRect();
        const width = rect.width;
        const offsetX = event.clientX - rect.left;
        let percentage = Math.round((offsetX / width) * 100);
        percentage = Math.max(0, Math.min(percentage, 100));
        this.ruleForm = {
          ...this.ruleForm,
          completeProgress: percentage,
        };
      }
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
