<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t(`consult.${title[type]}`)"
      :visible.sync="showModal"
      width="640px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="orderDetail" v-if="showModal && type == 'look'">
        <div class="orderDetail_content" style="height: 540px; overflow: auto">
          <div class="orderDetail_item" style="padding: 0 !important">
            <div class="orderDetail_baseinfo" style="padding: 0 !important">
              <div
                class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look"
                v-for="(item, index) in eventInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="$checkNull(eventData[item.prop])">{{
                  $checkNull(eventData[item.prop])
                }}</span>
              </div>
              <div
                v-if="eventData['publicType'] == '2'"
                class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look"
              >
                <span>{{ $t("consult.可见部门") }}</span>
                <span :title="$checkNull(eventData['deptNames'])">{{
                  $checkNull(eventData["deptNames"])
                }}</span>
              </div>
              <div
                v-if="eventData['publicType'] == '3'"
                class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look"
              >
                <span>{{ $t("consult.可见校区") }}</span>
                <span :title="$checkNull(eventData['schoolsNames'])">{{
                  $checkNull(eventData["schoolsNames"])
                }}</span>
              </div>
              <div
                v-if="eventData['publicType'] == '4'"
                class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look"
              >
                <span>{{ $t("consult.可见团队") }}</span>
                <span :title="$checkNull(eventData['teamNames'])">{{
                  $checkNull(eventData["teamNames"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look">
                <span>{{ $t("consult.参与人员") }}</span>
                <span :title="$checkNull(eventData['userNames'])">{{
                  $checkNull(eventData["userNames"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look">
                <span>{{ $t("consult.事件详情") }}</span>
                <span :title="$checkNull(eventData['eventDetails'])">{{
                  $checkNull(eventData["eventDetails"])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item orderDetail_baseinfo_item_look">
                <span>{{ $t("consult.地点") }}</span>
                <span :title="$checkNull(eventData['location'])">{{
                  $checkNull(eventData["location"])
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="moadlFromBox" v-if="showModal && type != 'look'">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('consult.事件主题')"
              prop="eventSubject"
              style="width: 100%"
            >
              <el-input
                v-model="ruleForm.eventSubject"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.咨询')" prop="clueId" style="width: 100%">
              <div @click="selectClueList" class="selectInput">
                <el-input
                  :readonly="type == 'look'"
                  :disabled="type == 'look'"
                  v-model="ruleForm.clueName"
                  :placeholder="$t('consult.请选择')"
                  maxlength="20"
                  readonly
                ></el-input>
              </div>
              <!-- <el-select
                style="width: 100%"
                v-model="ruleForm.clueId"
                :placeholder="$t('consult.请选择')"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
              >
                <el-option
                  v-for="item in clueList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item
              :label="$t('consult.事件时间')"
              prop="eventTime"
              style="width: 100%"
            >
              <el-date-picker
                style="width: 100%"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.eventTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                :placeholder="$t('consult.请选择')"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item
              :label="$t('consult.事件类型')"
              prop="eventType"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.eventType"
                :placeholder="$t('consult.请选择')"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
              >
                <el-option
                  v-for="item in consult['eventType']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.事件重复')"
              prop="eventRepeat"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.eventRepeat"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in consult['eventRepeat']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.公开程度')"
              prop="publicType"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.publicType"
                :placeholder="$t('consult.请选择')"
                @change="changePublicType"
              >
                <el-option
                  v-for="item in consult['publicTypeList']"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="ruleForm.publicType == '2'"
              :label="$t('consult.可见部门')"
              prop="publicIds"
              style="width: 100%"
            >
              <DeptTree
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                ref="deptTree"
                size="small"
                :treeData="deptTreeData"
                @setUser="setDeptData"
              ></DeptTree>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.publicType == '3'"
              :label="$t('consult.可见校区')"
              prop="publicIds"
              style="width: 100%"
            >
              <el-select
                multiple
                style="width: 100%"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.publicIds"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.publicType == '4'"
              :label="$t('consult.可见团队')"
              prop="publicIds"
              style="width: 100%"
            >
              <el-select
                multiple
                style="width: 100%"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.publicIds"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in teamList"
                  :key="item.teamId"
                  :label="item.teamName"
                  :value="item.teamId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('consult.参与人员')"
              prop="userId"
              style="width: 100%"
            >
              <UserTree
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                ref="participants"
                size="small"
                :treeData="treeData"
                @setUser="setParticipants"
              ></UserTree>
            </el-form-item>
            <el-form-item
              :label="$t('consult.提醒方式')"
              prop="expirationReminder"
              style="width: 100%"
            >
              <el-select
                style="width: 100%"
                :readonly="type == 'look'"
                :disabled="type == 'look'"
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
              :label="$t('consult.事件详情')"
              prop="eventDetails"
              style="width: 100%"
            >
              <el-input
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.eventDetails"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.地点')" prop="location" style="width: 100%">
              <el-input
                :readonly="type == 'look'"
                :disabled="type == 'look'"
                v-model="ruleForm.location"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="3"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn" v-if="type != 'look'">
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
          <el-form-item class="modalFromBtn" v-else>
            <el-button
              v-if="permissions['event_del']"
              type="default"
              size="medium"
              round
              @click="delEvent"
              >{{ $t("consult.删除") }}</el-button
            >
            <el-button
              v-if="permissions['event_edit']"
              type="primary"
              size="medium"
              round
              @click="type = 'edit'"
              >{{ $t("consult.编辑") }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <span
        v-if="showModal && type == 'look'"
        slot="footer"
        class="dialog-footer"
        style="width: 100%; text-align: center !important; display: block"
      >
        <el-button v-if="permissions['event_del']" round @click="delEvent">{{
          $t("consult.删除")
        }}</el-button>
        <el-button
          v-if="permissions['event_edit']"
          round
          type="primary"
          @click="editEventData"
          >{{ $t("consult.编辑") }}</el-button
        >
      </span>
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
import { addEvent, editEvent, getEventInfo, delEvent } from "@/api/consult/event.js";
import { getOrganizationUserInfo, getTeamIds } from "@/api/consult/common.js";
import { getClueDropdownList } from "@/api/consult/index.js";
import { consult } from "@/const/consult/index.js";
import UserTree from "@/components/thepoolcommon/UserTree";
import DeptTree from "@/components/thepoolcommon/UserTree";
import selectMyClue from "@/page/thepool/modal/selectMyClue";
import selectClue from "@/page/thepool/modal/selectClue";
export default {
  name: "guardians",
  components: {
    UserTree,
    DeptTree,
    selectMyClue,
    selectClue,
  },
  props: {},
  data() {
    return {
      consult: consult,
      type: "add",
      title: {
        add: "新增",
        edit: "编辑",
        look: "查看",
      },
      showModal: false,
      innerVisible: false,
      ruleForm: {},
      rules: this.initRules(),
      treeData: [],
      clueList: [],
      teamList: [],
      deptTreeData: [],
      activeName: "myclue",
      eventClueList: [],
      eventInfo: consult["eventInfo"],
      eventData: {},
      detailFormData: {},
      eventId: "",
      eventTimeId: "",
    };
  },
  created() {
    this.getUserList();
    this.getClueList();
    this.getTeamList();
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "pooldictionary",
      "pooldictpermissions",
      "permissions",
      "dictionary",
      "i18nlocel",
    ]),
  },
  watch: {
    i18nlocel: {
      handler: function () {
        // 语言切换时重新初始化验证规则
        this.rules = this.initRules();
        // 清除表单验证状态
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate();
        }
      },
      immediate: false,
    },
  },
  methods: {
    // 初始化表单验证规则
    initRules() {
      return {
        eventSubject: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        eventDetails: [
          { required: true, message: this.$t("consult.请输入"), trigger: "blur" },
        ],
        eventType: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        eventRepeat: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        publicType: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        userId: [{ required: true, message: this.$t("consult.请选择"), trigger: "blur" }],
        expirationReminder: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        clueId: [{ required: true, message: this.$t("consult.请选择"), trigger: "blur" }],
        eventTime: [
          { required: true, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
        publicIds: [
          { required: false, message: this.$t("consult.请选择"), trigger: "blur" },
        ],
      };
    },

    async initModal() {
      this.type = "add";
      this.showModal = true;
    },

    addEvent(data) {
      addEvent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    editEvent(data) {
      editEvent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    delEvent() {
      this.$alert(this.$t("consult.确定要删除吗？"), this.$t("consult.删除"), {
        confirmButtonText: this.$t("consult.确定"),
      }).then(() => {
        delEvent({ eventId: this.eventId }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("consult.成功"));
            this.$emit("initData");
            this.closeModal();
          }
        });
      });
    },
    getDetail(query) {
      this.eventId = query["eventId"];
      this.eventTimeId = query["eventTimeId"];
      getEventInfo({ eventId: query["eventId"], eventTimeId: query["eventTimeId"] }).then(
        (res) => {
          if (res.data.success) {
            this.type = query["type"] || "look";
            this.showModal = true;
            this.detailFormData = res.data.data;
            if (this.type == "look") {
              this.setDetailData(res);
            }
            if (this.type == "edit") {
              this.editEventData(res);
            }
          }
        }
      );
    },
    editEventData() {
      this.type = "edit";
      this.setDetailForm();
    },
    async setDetailForm() {
      let data = this.detailFormData;
      let participants = data.participants || [];
      let userIds = participants.map((item) => item.userId);
      let userNames = participants.map((item) => item.userName);
      let clueInfos = data.clueInfos || [];
      this.eventClueList = clueInfos.map((item) => {
        return {
          id: item.clueId,
          guardianTitle: item.clueName,
          contactMethod: item.contactMethod,
        };
      });
      this.ruleForm = {
        ...this.ruleForm,
        eventId: data.eventId,
        eventTimeId: data.eventTimeId,
        eventSubject: data.eventSubject,
        eventDetails: data.eventDetails,
        eventTime: [data.startTime, data.endTime],
        userId: data.userId,
        publicIds: data.publicIds,
        location: data.location,
        clueId: data.clueId,
        clueName: data.clueName,
        eventType: String(data.eventType),
        eventRepeat: String(data.eventRepeat),
        publicType: String(data.publicType),
        expirationReminder: String(data.expirationReminder),
      };
      this.$nextTick(() => {
        this.changePublicType(this.ruleForm.publicType);
        this.$refs["participants"].labelModel = userNames;
        this.$refs["participants"].checkedId = userIds;
        if (this.ruleForm.publicType == "2") {
          this.$refs["deptTree"].checkedId = data.publicIds;
          let deptNames = this.getDeptLabelsByPublicIds(data.publicIds);
          this.$refs["deptTree"].labelModel = deptNames;
          console.log("部门", data.publicIds, deptNames);
        }
      });
    },
    async setDetailData(res) {
      let data = res.data.data;
      let participants = data.participants || [];
      let userNames = participants.map((item) => item.userName);
      this.eventData = {
        ...data,
        eventTime: data.startTime + "-" + data.endTime,
        eventTypeLabel: this.$getListLabel(consult["eventType"], data.eventType),
        eventRepeatLabel: this.$getListLabel(consult["eventRepeat"], data.eventRepeat),
        expirationReminderLabel: this.$getListLabel(
          consult["expirationReminder"],
          data.expirationReminder
        ),
        publicTypeLabel: this.$getListLabel(consult["publicTypeList"], data.publicType),
        userNames: String(userNames),
        publicIds: data.publicIds,
      };
      if (data.publicType == 2) {
        let deptNames = this.getDeptLabelsByPublicIds(data.publicIds);
        this.eventData = {
          ...this.eventData,
          deptNames: String(deptNames),
        };
      }
      if (data.publicType == 3) {
        let showNames = [];
        this.pooldictionary.map((item) => {
          if (data.publicIds.includes(item.value))
            showNames.push(this.i18nlocel == "en" ? item.enLabel : item.label);
        });
        this.eventData = {
          ...this.eventData,
          schoolsNames: String(showNames),
        };
      }
      if (data.publicType == 4) {
        let teamList = await getTeamIds();
        let teamNames = [];
        teamList.map((item) => {
          if (data.publicIds.includes(item.teamId)) {
            teamNames.push(item.teamName);
          }
        });
        this.eventData = {
          ...this.eventData,
          teamNames: String(teamNames),
        };
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.ruleForm,
            startTime: this.ruleForm.eventTime[0],
            endTime: this.ruleForm.eventTime[1],
          };
          delete data.eventTime;
          if (this.type == "add") {
            this.addEvent(data);
          } else {
            this.editEvent(data);
          }
        }
      });
    },
    setDeptData(data) {
      console.log("setPersonInCharge", data);
      this.ruleForm = {
        ...this.ruleForm,
        publicIds: data,
      };
    },
    setParticipants(data) {
      console.log("setParticipants", data);
      this.ruleForm = {
        ...this.ruleForm,
        userId: data,
      };
    },
    closeModal() {
      this.type = "add";
      this.ruleForm = {};
      this.eventClueList = [];
      this.showModal = false;
    },
    selectClueData() {
      this.innerVisible = false;
      let myClue = this.$refs.selectMyClue.getSelectClue();
      let cluelist = this.$refs.selectClue.getSelectClue();
      let allList = [...myClue, ...cluelist];
      let clueIds = [];
      let clueNames = [];
      this.eventClueList = [];
      allList.forEach((item) => {
        if (!clueIds.includes(item.id)) {
          this.eventClueList.push(item);
          clueIds.push(item.id);
          clueNames.push(item.guardianTitle + item.contactMethod);
        }
      });
      this.ruleForm = {
        ...this.ruleForm,
        clueId: clueIds,
        clueName: clueNames,
      };
      this.$refs.ruleForm.clearValidate("clueId");
    },
    selectClueList() {
      this.innerVisible = true;
      this.$nextTick(() => {
        this.$refs.selectMyClue.initData();
        this.$refs.selectClue.initData();
        this.$refs.selectMyClue.setSelectClueItems(this.eventClueList || []);
        this.$refs.selectClue.setSelectClueItems(this.eventClueList || []);
      });
    },
    changePublicType(e) {
      console.log("changePublicType", e);
      delete this.ruleForm["publicIds"];
      this.$set(this.rules["publicIds"], 0, {
        ...this.rules["publicIds"][0],
        required: String(e) != "0" && String(e) != "1",
      });
    },
    // 获取线索列表
    async getClueList() {
      this.clueList = await getClueDropdownList({ pageSize: 40, pageNum: 1 });
      this.clueList.map((item) => {
        item["label"] = item["guardianTitle"] + item["contactMethod"];
      });
    },
    // 获取团队列表
    async getTeamList() {
      this.teamList = await getTeamIds();
    },
    async getUserList() {
      let data = {};
      data["subDepartments"] = await getOrganizationUserInfo();
      // 使用示例
      this.treeData = this.convertToTree(data);
      this.deptTreeData = this.setDeptTreeData(data);
      console.log("getUserList", this.deptTreeData);
    },
    setDeptTreeData(data) {
      // 处理部门节点
      let subDepartments = data.subDepartments || [];
      let departmentNodes =
        subDepartments.map((dept) => ({
          id: dept.departmentId,
          label: dept.departmentName,
          type: 2,
          children: this.setDeptTreeData(dept),
        })) || [];
      return [...departmentNodes];
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
    // 新增：根据publicIds获取部门标签
    getDeptLabelsByPublicIds(publicIds) {
      console.log("this.deptTreeData", this.deptTreeData);

      if (!publicIds) return [];
      // 确保publicIds是数组格式
      const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
      const labels = [];

      // 递归查找部门标签
      const findLabels = (nodes) => {
        if (!nodes || !nodes.length) return;

        nodes.forEach((node) => {
          if (ids.includes(node.id)) {
            labels.push(node.label);
          }
          if (node.children && node.children.length) {
            findLabels(node.children);
          }
        });
      };

      findLabels(this.deptTreeData);
      return labels;
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
.thepool_page {
  .orderDetail {
    .orderDetail_content {
      .orderDetail_item {
        .orderDetail_baseinfo {
          .orderDetail_baseinfo_item_look {
            width: 100% !important;
            margin-bottom: 10px !important;
            line-height: 16px !important;
            span {
              white-space: wrap !important;
            }
          }
        }
      }
    }
  }
}
</style>
