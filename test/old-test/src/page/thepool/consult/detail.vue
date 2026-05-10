<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>
                {{ $t("consult.线索信息") }}
              </div>
              <div>
                <el-button
                  v-if="
                    $route.query.type == '1' &&
                    permissions['enquiry_clue_school_edit']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="changeSchool"
                  >{{ $t("consult.修改申请校区") }}</el-button
                >
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['enquiry_all_edit']
                      : $route.query.type == '2'
                      ? permissions['enquiry_mine_edit']
                      : true
                  "
                  type="primary"
                  size="small"
                  round
                  @click="editCLue"
                  >{{ $t("consult.编辑") }}</el-button
                >
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['enquiry_all_follower_edit']
                      : $route.query.type == '2'
                      ? permissions['enquiry_mine_follower_edit']
                      : true
                  "
                  type="primary"
                  size="small"
                  round
                  @click="editAssigneds"
                  >{{ $t("consult.跟进人") }}</el-button
                >
                <el-button
                  v-if="
                    ($route.query.type == '1'
                      ? clueData['followStatus'] == 1 ||
                        clueData['followStatus'] == 0
                      : clueData['followStatus'] == 1 ||
                        clueData['followStatus'] == 0) &&
                    canShowChangeStatus('apply')
                  "
                  type="primary"
                  size="small"
                  round
                  @click="changeClueStatus('apply')"
                  >{{ $t("consult.申请") }}</el-button
                >
                <el-button
                  v-if="
                    ($route.query.type == '1'
                      ? permissions['enquiry_all_status_enter'] &&
                        clueData['followStatus'] === 2
                      : permissions['enquiry_mine_status_enter'] &&
                        clueData['followStatus'] === 2) &&
                    canShowChangeStatus('enter')
                  "
                  type="primary"
                  size="small"
                  round
                  @click="changeClueStatus('enter')"
                  >{{ $t("consult.入学") }}</el-button
                >
                <el-button
                  v-if="
                    ($route.query.type == '1'
                      ? clueData['followStatus'] == 3 &&
                        permissions['thepool_user_student_leaving']
                      : clueData['followStatus'] == 3 &&
                        permissions['thepool_user_student_mine_leaving']) &&
                    canShowChangeStatus('leaving')
                  "
                  type="primary"
                  size="small"
                  round
                  @click="changeClueStatus('leaving')"
                  >{{ $t("consult.离校") }}</el-button
                >
                <!-- <el-button
                  v-if="
                    $route.query.type == '1'
                      ? clueData['followStatus'] == 3
                      : clueData['followStatus'] == 3
                  "
                  type="primary"
                  size="small"
                  round
                  @click="changeClueStatus('graduation')"
                  >{{ $t("consult.毕业") }}</el-button
                > -->
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? (permissions['enquiry_all_status_close'] &&
                          (clueData['followStatus'] == 1 ||
                            clueData['followStatus'] == 0)) ||
                        (permissions['enquiry_all_status_batch_apply_close'] &&
                          clueData['followStatus'] == 2)
                      : (permissions['enquiry_mine_status_close'] &&
                          (clueData['followStatus'] == 1 ||
                            clueData['followStatus'] == 0)) ||
                        (permissions['enquiry_mine_status_batch_apply_close'] &&
                          clueData['followStatus'] == 2)
                  "
                  type="defult"
                  size="small"
                  round
                  @click="changeClueStatus('close')"
                  >{{ $t("consult.关闭") }}</el-button
                >
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['enquiry_all_status_active'] &&
                        clueData['followStatus'] == 4
                      : permissions['enquiry_mine_status_active'] &&
                        clueData['followStatus'] == 4
                  "
                  type="defult"
                  size="small"
                  round
                  @click="changeClueStatus('activate')"
                  >{{ $t("consult.激活") }}</el-button
                >
                <!-- <el-button type="defult" size="small" @click="backList">返回</el-button> -->
              </div>
            </div>
            <div class="orderDetail_baseinfo">
              <div
                v-show="
                  isHiddenIetm(item.value, checkNull(clueData[item.value]))
                "
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in clueInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="checkNull(clueData[item.value])">{{
                  checkNull(clueData[item.value])
                }}</span>
              </div>
              <div class="orderDetail_baseinfo_item" style="width: 100%">
                <span>{{ $t("consult.备注") }}</span>
                <span
                  style="white-space: wrap !important"
                  :title="checkNull(clueData['remark'])"
                  >{{ checkNull(clueData["remark"]) }}</span
                >
              </div>
            </div>
            <div>
              <!-- 线索动态表单 -->
              <FromItemDetail ref="FromItemDetailClue" />
            </div>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.学生信息") }}</div>
              <div class="orderDetail_item_tabs" v-if="studentList.length > 1">
                <div class="orderDetail_item_tablist">
                  <div
                    @click="changeStudent(item)"
                    :class="[
                      'orderDetail_item_tablist_item',
                      {
                        tablist_item_active: currentStudentId == item.id,
                      },
                    ]"
                    v-for="(item, index) in studentList"
                    :key="item.id"
                  >
                    {{ item["baseInfo"]["showName"] }}
                  </div>
                </div>
              </div>
              <div>
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['thepool_user_student_mine_add']
                      : permissions['thepool_user_student_add']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="addStudentBindClue"
                  >{{ $t("consult.新增") }}</el-button
                >
                <el-button
                  v-if="
                    studentList.length > 0 &&
                    ($route.query.type == '1'
                      ? permissions['thepool_user_student_mine_edit']
                      : permissions['thepool_user_student_edit'])
                  "
                  type="primary"
                  size="small"
                  round
                  @click="editStudentBindClue"
                  >{{ $t("consult.编辑") }}</el-button
                >
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['enquiry_mine_bind_student']
                      : permissions['enquiry_bind_student']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="setStudentClue"
                  >{{ $t("consult.绑定") }}</el-button
                >
              </div>
            </div>
            <div v-if="studentList.length > 0">
              <div class="orderDetail_baseinfo">
                <div class="orderDetail_baseinfo_item">
                  <span>{{ $t("consult.状态") }}</span>
                  <span :title="$checkNull(studentData['statusLabel'])">{{
                    $checkNull(studentData["statusLabel"])
                  }}</span>
                </div>
                <div
                  v-show="
                    isHiddenIetm(item.value, checkNull(studentData[item.prop]))
                  "
                  class="orderDetail_baseinfo_item"
                  v-for="(item, index) in studentInfo"
                  :key="index"
                >
                  <span>{{ $t("consult")[item.label] }}</span>
                  <span :title="checkNull(studentData[item.prop])">{{
                    checkNull(studentData[item.prop])
                  }}</span>
                </div>
                <div
                  style="width: 100% !important"
                  class="orderDetail_baseinfo_item"
                >
                  <span>{{ $t("consult.头像") }}</span>
                  <div v-if="studentData.photoUrl" style="margin-top: 10px">
                    <img
                      style="width: 100px; height: 100px"
                      :src="studentData.photoUrl"
                      alt=""
                    />
                  </div>
                  <span v-else>--</span>
                </div>
              </div>
              <div class="orderDetail_baseinfo">
                <div
                  class="orderDetail_baseinfo_item"
                  v-for="(item, index) in studentExtendInfo"
                  :key="index"
                >
                  <span>{{ $t("consult")[item.label] }}</span>
                  <span :title="$checkNull(studentExtendData[item.prop])">{{
                    $checkNull(studentExtendData[item.prop])
                  }}</span>
                </div>
              </div>
              <div v-for="(item, index) in studentTemplateList" :key="index">
                <!-- 学生动态表单 -->
                <FromItemDetail
                  :ref="`FromItemDetailStudent${item.templateId}`"
                />
              </div>
            </div>
            <el-empty v-else description="No Data~"></el-empty>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.家长信息") }}</div>
              <div class="orderDetail_item_tabs" v-if="guardianList.length > 1">
                <div class="orderDetail_item_tablist">
                  <div
                    @click="changeGuardian(item)"
                    :class="[
                      'orderDetail_item_tablist_item',
                      {
                        tablist_item_active: currentGuardianId == item.id,
                      },
                    ]"
                    v-for="(item, index) in guardianList"
                    :key="item.id"
                  >
                    {{ item["guardianInfo"]["showName"] }}
                  </div>
                </div>
              </div>
              <div>
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['thepool_user_guardian_mine_add']
                      : permissions['thepool_user_guardian_add']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="addGuardianBindClue"
                  >{{ $t("consult.新增") }}</el-button
                >
                <el-button
                  v-if="
                    guardianList.length > 0 &&
                    ($route.query.type == '1'
                      ? permissions['thepool_user_guardian_mine_edit']
                      : permissions['thepool_user_guardian_edit'])
                  "
                  type="primary"
                  size="small"
                  round
                  @click="editGuardianBindClue"
                  >{{ $t("consult.编辑") }}</el-button
                >
                <el-button
                  v-if="
                    $route.query.type == '1'
                      ? permissions['enquiry_mine_bind_guardian']
                      : permissions['enquiry_bind_guardian']
                  "
                  type="primary"
                  size="small"
                  round
                  @click="setGuardianClue"
                  >{{ $t("consult.绑定") }}</el-button
                >
              </div>
            </div>
            <div v-if="guardianList.length > 0">
              <div class="orderDetail_baseinfo">
                <div
                  class="orderDetail_baseinfo_item"
                  v-for="(item, index) in parentInfo"
                  :key="index"
                >
                  <span>{{ $t("consult")[item.label] }}</span>
                  <span :title="checkNull(guardianData[item.prop])">{{
                    checkNull(guardianData[item.prop])
                  }}</span>
                </div>
                <div
                  style="width: 100% !important"
                  class="orderDetail_baseinfo_item"
                >
                  <span>{{ $t("consult.头像") }}</span>
                  <div v-if="guardianData.photoUrl" style="margin-top: 10px">
                    <img
                      style="width: 100px; height: 100px"
                      :src="guardianData.photoUrl"
                      alt=""
                    />
                  </div>
                  <span v-else>--</span>
                </div>
              </div>
              <div v-for="(item, index) in guardianTemplateList" :key="index">
                <!-- 家长动态表单 -->
                <FromItemDetail :ref="`FromItemGuardian${item.templateId}`" />
              </div>
            </div>
            <el-empty v-else description="No Data~"></el-empty>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_item_title df_sb">
              <div>{{ $t("consult.跟进记录") }}</div>
              <div class="followType">
                <div
                  @click="changeFollowType({ value: 'all' })"
                  :class="[
                    'followType_item',
                    {
                      currentFollow: currentFollow == 'all',
                    },
                  ]"
                >
                  {{ $t("consult.全部") }}
                </div>
                <div
                  @click="changeFollowType(item)"
                  :class="[
                    'followType_item',
                    {
                      currentFollow: currentFollow == item.value,
                    },
                  ]"
                  v-for="(item, index) in dictionary['follow_type']"
                  :key="index"
                >
                  {{ i18nlocel == "en" ? item.enLabel : item.label }}
                </div>
              </div>
              <el-button type="primary" size="small" round @click="addlog">{{
                $t("consult.新增")
              }}</el-button>
            </div>
            <LogList
              ref="LogList"
              :studentList="studentList"
              :guardianList="guardianList"
            />
          </div>
        </div>
        <!-- 改变状态 -->
        <changeStatus
          v-if="showchangeStatus"
          :showchangeStatus="showchangeStatus"
          :currentClueType="currentClueType"
          :isMultiple="isMultiple"
          :currentClueId="currentClueId"
          :studentList="enterStudentList"
          :isClue="true"
          @changeModal="changeModal"
          @initData="initPageData"
        />
        <!-- 编辑学生信息 -->
        <editCLue
          ref="editCLue"
          v-if="showEditClue"
          :showEditClue="showEditClue"
          :clueData="clueData"
          :templateForm="templateForm"
          @changeModal="changeModal"
          @initData="initData"
        />
        <!-- 新增记录信息 -->
        <addLog
          ref="addLog"
          v-if="showAddLog"
          :showAddLog="showAddLog"
          :currentClueId="currentClueId"
          :studentList="studentList"
          :guardianList="guardianList"
          @changeModal="changeModal"
          @initData="initData"
        />

        <addAssigned
          ref="addAssigned"
          v-if="showAddAssigned"
          :type="'edit'"
          :showAddAssigned="showAddAssigned"
          :clueIds="clueIds"
          @changeModal="changeModal"
          @initData="initData"
        />
        <changeSchool
          ref="changeSchool"
          v-if="showChangeSchool"
          :showChangeSchool="showChangeSchool"
          :clueId="clueData['id']"
          @changeModal="changeModal"
          @initData="initData"
        />
        <!-- 新增学生 -->
        <AddStudent ref="AddStudent" @initData="initPageData" />
        <!-- 新增家长 -->
        <AddGuardians ref="AddGuardians" @initData="initPageData" />
        <!-- 绑定家长 -->
        <BindClueGuardians ref="BindClueGuardians" @initData="initPageData" />
        <!-- 绑定学生 -->
        <BindClueStudent ref="BindClueStudent" @initData="initPageData" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getClueDetail } from "@/api/consult/index.js";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import { getOuterFile, uploadOuterFile } from "@/api/upload/index.js";
import { consult } from "@/const/consult/index.js";
import Table from "@/components/common/Table.vue";
import changeStatus from "@/page/thepool/consult/modal/changestatus.vue";
import editCLue from "@/page/thepool/consult/modal/editclue.vue";
import addLog from "@/page/thepool/consult/modal/addlog.vue";
import addAssigned from "@/page/thepool/consult/modal/addAssigned.vue";
import changeSchool from "@/page/thepool/consult/modal/changeschool.vue";
import AddStudent from "@/page/thepool/modal/addstudent.vue";
import AddGuardians from "@/page/thepool/modal/addguardians.vue";
import LogList from "@/page/thepool/consult/modal/loglist.vue";
import BindClueGuardians from "@/page/thepool/consult/modal/bindclueguardians.vue";
import BindClueStudent from "@/page/thepool/consult/modal/bindcluestudent.vue";
import FromItemDetail from "@/components/thepoolcommon/dynamicform/fromitemdetail.vue";
export default {
  name: "PCOrderDetail",
  components: {
    Table,
    changeStatus,
    editCLue,
    addLog,
    addAssigned,
    changeSchool,
    AddStudent,
    AddGuardians,
    LogList,
    BindClueGuardians,
    BindClueStudent,
    FromItemDetail,
  },
  data() {
    return {
      consult: consult,
      enrolledStatus: consult["enrolledStatus"],
      currentClueId: "",
      clueData: {},
      clueInfo: [
        { label: "归属校区", value: "schoolsLabel" },
        { label: "跟进状态", value: "followStatusLabel" },
        { label: "跟进标签", value: "followTagsLabel" },
        { label: "家长称谓", value: "guardianTitle" },
        { label: "学生姓名", value: "studentName" },
        { label: "联系方式", value: "contactMethod" },
        { label: "校区", value: "applySchoolLabel" },
        { label: "渠道", value: "channellLabel" },
        { label: "来源", value: "origin" },
        { label: "首次探校时间", value: "schoolTour" },
        { label: "期望入读日期", value: "expectReadDate" },
        { label: "首次来源信息", value: "firstChannel" },
        { label: "跟进人", value: "followers" },
        { label: "创建人", value: "Creator" },
        { label: "新增时间", value: "createTime" },
        { label: "更新时间", value: "updateTime" },
        // { label: "备注", value: "remark" },
      ],
      currentStudentId: "",
      studentData: {},
      studentList: [],
      enterStudentList: [],
      studentInfo: consult["studentTitle"],
      currentGuardianId: "",
      guardianData: {},
      guardianList: [],
      parentInfo: consult["guardiansTableTitle"],
      tableData: [],
      studentId: "",
      guardiansType: "",
      showchangeStatus: false,
      showEditClue: false,
      showAddLog: false,
      currentClueType: "",
      isMultiple: false,
      followersIds: [],
      showAddAssigned: false,
      clueIds: [],
      showChangeSchool: false,
      currentClueId: "",
      templateForm: {
        templateFormId: "",
        templateValueId: "",
        schoolId: "",
        clueId: "",
      },
      studentTemplateList: [],
      guardianTemplateList: [],
      currentFollow: "all",
      dynamicInfos: [],
      studentExtendInfo: consult["studentExtendTitle"],
      studentExtendData: {},
    };
  },

  created() {
    this.currentClueId = this.$route.query.clueId;
    // this.initPageData();
  },
  mounted() {
    this.currentClueId = this.$route.query.clueId;
    this.initPageData();
  },
  activated() {
    this.initPageData();
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  watch: {
    i18nlocel() {
      this.initPageData();
    },
  },
  methods: {
    // 初始化数据
    initPageData() {
      this.getClueDetail();
      this.changeModal(false);
    },
    // 获取线索详情
    getClueDetail() {
      getClueDetail(this.currentClueId).then((res) => {
        if (res.data.success) {
          let {
            clueInfo,
            studentInfo,
            parentInfo,
            followers,
            records,
            dynamicInfos,
            schools,
          } = res.data.data;
          this.dynamicInfos = dynamicInfos || [];
          this.studentData = {};
          this.guardianData = {};
          this.clueData = {
            ...clueInfo,
            schools: schools || [],
          };
          this.studentList = studentInfo || [];
          this.guardianList = parentInfo || [];
          this.getStudentClue();
          this.getGuardianClue();
          this.currentClueId = clueInfo.id;
          this.clueData["followStatusLabel"] =
            this.$t("consult")[
              consult["followStatus"][clueInfo["followStatus"]]
            ];
          if (this.clueData["applySchool"]) {
            this.clueData["applySchoolLabel"] = this.$getListLabel(
              this.pooldictionary,
              clueInfo["applySchool"]
            );
            this.clueData["followTagsLabel"] = this.getDictLabel(
              clueInfo["applySchool"],
              "enquiry_follow_tags",
              clueInfo["followTags"]
            );
            this.clueData["channellLabel"] = this.getDictLabel(
              clueInfo["applySchool"],
              "enquiry_channel",
              clueInfo["channel"]
            );
            let channelChildOneLabel = this.getDictLabel(
              clueInfo["applySchool"],
              "enquiry_channel_child_one",
              clueInfo["channelChildOne"]
            );
            this.clueData["channellLabel"] =
              this.clueData["channellLabel"] +
              (channelChildOneLabel == "" ? "" : "/" + channelChildOneLabel);
          } else {
            this.clueData["followTagsLabel"] = this.$getListLabel(
              this.dictionary["enquiry_follow_tags"],
              clueInfo["followTags"]
            );
            this.clueData["channellLabel"] = this.$getListLabel(
              this.dictionary["enquiry_channel"],
              clueInfo["channel"]
            );
            if (clueInfo["channelChildOne"]) {
              this.clueData["channellLabel"] =
                this.clueData["channellLabel"] +
                "/" +
                this.$getListLabel(
                  this.dictionary["enquiry_channel_child_one"],
                  clueInfo["channelChildOne"]
                );
            }
          }

          console.log(this.clueData);
          if (this.clueData["schools"].length > 0) {
            let arr = [];
            this.clueData["schools"].map((item) => {
              arr.push(this.$getListLabel(this.pooldictionary, item));
            });
            this.clueData["schoolsLabel"] = String(arr);
          }
          if (followers == null || followers.length == 0) {
            this.clueData["followers"] = "--";
          } else {
            let followerList = [];
            let followerIds = [];
            followers.map((item) => {
              if (item.id) {
                followerIds.push(item.id);
              }
              followerList.push(item.username);
            });
            this.clueData["followers"] = String(followerList);
            this.followersIds = followerIds;
          }
          if (this.clueData["creatorId"]) {
            this.userList.map((item) => {
              if (this.clueData["creatorId"] == String(item.value)) {
                this.clueData["Creator"] = item.label;
              }
            });
          }
          this.$nextTick(async () => {
            this.$refs["LogList"].filterLog["outerId"] = clueInfo.id;
            this.$refs["LogList"].setLogList(records);
            this.templateForm["clueId"] = this.currentClueId;
            if (this.clueData["applySchool"]) {
              this.templateForm["schoolId"] = this.$getListLabel(
                this.pooldictionary,
                clueInfo["applySchool"],
                "id",
                "value"
              );

              this.getTemplateDynamic(
                3,
                clueInfo["applySchool"],
                dynamicInfos || []
              );
            }
          });
        }
      });
    },
    async getTemplateDynamic(type, schoolId, dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: type });
      if (templateForm.length > 0) {
        let templateList = templateForm.find(
          (dynamicItem) => dynamicItem.schoolId == schoolId
        ).templates;

        templateList.map((item) => {
          let dynamicInfoItem = dynamicInfos.find(
            (dynamicItem) => dynamicItem.templateId == item.templateId
          );
          switch (type) {
            case 1:
              this.studentTemplateList = templateList;
              this.$nextTick(() => {
                this.$refs[
                  `FromItemDetailStudent${item.templateId}`
                ][0].getTemplateDetail(item, dynamicInfoItem);
              });
              break;
            case 2:
              this.guardianTemplateList = templateList;
              this.$nextTick(() => {
                this.$refs[
                  `FromItemGuardian${item.templateId}`
                ][0].getTemplateDetail(item, dynamicInfoItem);
              });
              break;
            case 3:
              this.$nextTick(() => {
                this.$refs[`FromItemDetailClue`].getTemplateDetail(
                  item,
                  dynamicInfoItem
                );
              });
              break;
          }
        });
      }
    },
    // 获取线索关联的家长
    getGuardianClue() {
      if (this.guardianList.length > 0) {
        this.guardianList.map((item) => {
          item["guardianInfo"] = {
            ...item["guardianInfo"],
            showName: this.getShowName(item["guardianInfo"]),
          };
        });
        if (this.currentGuardianId != "") {
          let isHas = false;
          this.guardianList.map((item, index) => {
            if (item.id == this.currentGuardianId) {
              isHas = true;
              this.changeGuardian(item);
            }
          });
          if (!isHas) {
            this.changeGuardian(this.guardianList[0]);
          }
        } else {
          this.changeGuardian(this.guardianList[0]);
        }
      }
    },
    // 切换家长
    async changeGuardian(item) {
      this.guardianTemplateList = [];
      this.currentGuardianId = item["id"];
      this.guardianData = {
        ...item["guardianInfo"],
        sexlabel: this.$getListLabel(
          consult["sexList"],
          item["guardianInfo"]["sex"]
        ),
        relationTypeLabel: this.$getListLabel(
          this.dictionary["enquiry_relation_type"],
          item["guardianInfo"]["relationType"]
        ),
      };

      this.$nextTick(async () => {
        this.getTemplateDynamic(2, 0, item["dynamicInfos"] || []);
        if (item["photos"] && item["photos"].length > 0) {
          item["photos"].forEach(async (photos) => {
            if (String(photos.type) == "0") {
              const file = await getOuterFile(photos.photoId);
              let photoUrl = window.URL.createObjectURL(file);
              console.log("photoUrl", photoUrl);
              this.guardianData = {
                ...this.guardianData,
                photoUrl,
              };
            }
          });
        }
      });
    },
    // 新增家长绑定线索
    addGuardianBindClue() {
      this.$refs["AddGuardians"].addGuardianBindClue(this.currentClueId);
    },
    // 编辑家长
    editGuardianBindClue() {
      this.$refs["AddGuardians"].getGuardianDetail(this.currentGuardianId);
    },
    // 绑定家长
    setGuardianClue() {
      this.$refs["BindClueGuardians"].setGuardianClueList(
        this.guardianList,
        this.currentClueId
      );
    },
    // 获取线索关联的学生
    getStudentClue() {
      if (this.studentList.length > 0) {
        this.studentList.map((item) => {
          item["baseInfo"] = {
            ...item["baseInfo"],
            showName: this.getShowName(item["baseInfo"]),
          };
        });
        if (this.currentStudentId != "") {
          let isHas = false;
          this.studentList.map((item, index) => {
            if (item.id == this.currentStudentId) {
              isHas = true;
              this.changeStudent(item);
            }
          });
          if (!isHas) {
            this.changeStudent(this.studentList[0]);
          }
        } else {
          this.changeStudent(this.studentList[0]);
        }
      }
    },
    // 切换学生
    changeStudent(item) {
      console.log("changeStudent", item);
      this.studentTemplateList = [];
      this.currentStudentId = item["id"];
      this.studentExtendData = item["extendInfo"] || {};
      this.studentData = {
        ...item["baseInfo"],
        enrollYear: item["baseInfo"].enrollYear
          ? `${item["baseInfo"].enrollYear}-${item["baseInfo"].enrollYear + 1}`
          : "--",
        isDropoutLabel: this.$getListLabel(
          consult["yesOrno"],
          item["baseInfo"].isDropout
        ),
        statusLabel: this.$getListLabel(
          this.enrolledStatus,
          item["baseInfo"].status
        ),
        sexlabel: this.$getListLabel(consult["sexList"], item["baseInfo"].sex),
        applySchoolLabel: this.$getListLabel(
          this.pooldictionary,
          item["baseInfo"].applySchool
        ),
        enrollLevelLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_enroll_level",
              item["baseInfo"].enrollLevel
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item["baseInfo"].enrollLevel
            ),
        enrollmentGradeLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_enroll_level",
              item["baseInfo"].enrollmentGrade
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item["baseInfo"].enrollmentGrade
            ),
        directionLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_direction",
              item["baseInfo"].direction
            )
          : this.$getListLabel(
              this.dictionary["enquiry_direction"],
              item["baseInfo"].direction
            ),
        enrollLevelInLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_enroll_level",
              item["baseInfo"].enrollLevelIn
            )
          : this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item["baseInfo"].enrollLevelIn
            ),
        paySubjectLabel: item["baseInfo"].applySchool
          ? this.getDictLabel(
              item["baseInfo"].applySchool,
              "enquiry_pay_subject",
              item["baseInfo"].paySubject
            )
          : this.$getListLabel(
              this.dictionary["enquiry_pay_subject"],
              item["baseInfo"].paySubject
            ),
      };
      this.$nextTick(async () => {
        if (item["photos"] && item["photos"].length > 0) {
          item["photos"].forEach(async (item) => {
            if (String(item.type) == "0") {
              const file = await getOuterFile(item.photoId);
              let photoUrl = window.URL.createObjectURL(file);
              console.log(photoUrl);
              this.studentData.photoUrl = photoUrl;
            }
          });
        }
        if (item["baseInfo"].applySchool) {
          let schoolId = this.$getListLabel(
            this.pooldictionary,
            item["baseInfo"].applySchool,
            "id",
            "value"
          );
          this.getTemplateDynamic(
            1,
            item["baseInfo"].applySchool,
            item["dynamicInfos"] || []
          );
        } else {
          this.studentTemplateList = [];
        }
      });
    },
    // 新增学生绑定线索
    addStudentBindClue() {
      this.$refs["AddStudent"].addStudentBindClue(this.currentClueId);
    },
    // 编辑学生绑定线索
    editStudentBindClue() {
      this.$refs["AddStudent"].getStudentDetail(this.currentStudentId);
    },
    // 绑定学生
    setStudentClue() {
      this.$refs["BindClueStudent"].getStudentClue(this.currentClueId);
    },

    editCLue() {
      this.showEditClue = true;
      this.$nextTick(() => {
        this.$refs["editCLue"].init(this.clueData, this.dynamicInfos || []);
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    changeClueStatus(type) {
      this.enterStudentList = [];
      switch (type) {
        case "enter":
          this.studentList.map((item) => {
            if (
              item["baseInfo"]["status"] == 1 ||
              item["baseInfo"]["status"] == 3
            ) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可入学学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;
        case "apply":
          this.studentList.map((item) => {
            if (item["baseInfo"]["status"] == 0) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可申请学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;
        case "leaving":
          this.studentList.map((item) => {
            if (item["baseInfo"]["status"] == 2) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可离校学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;
        case "graduation":
          this.studentList.map((item) => {
            if (item["baseInfo"]["status"] == 2) {
              this.enterStudentList.push({
                ...item["baseInfo"],
              });
            }
          });
          if (this.enterStudentList.length == 0) {
            this.$message.warning("该线索无可毕业学生");
          } else {
            this.currentClueType = type;
            this.showchangeStatus = true;
          }
          break;

        default:
          this.currentClueType = type;
          this.showchangeStatus = true;
          break;
      }
    },
    addlog() {
      this.showAddLog = true;
      this.$nextTick(() => {
        if (this.studentList.length > 0) {
          let studentList = this.studentList.map((item) => {
            return {
              id: item.id,
              showName: item["baseInfo"]["showName"],
            };
          });
          this.$refs["addLog"].studentList = studentList;
        }
        if (this.guardianList.length > 0) {
          let guardianList = this.guardianList.map((item) => {
            return {
              id: item.id,
              showName: item["guardianInfo"]["showName"],
            };
          });
          this.$refs["addLog"].guardianList = guardianList;
        }
      });
    },
    initData() {
      this.getClueDetail();
      this.changeModal(false);
    },
    changeModal(type) {
      this.showGuardians = type;
      this.showchangeStatus = type;
      this.showEditClue = type;
      this.showAddLog = type;
      this.showAddAssigned = type;
      this.showChangeSchool = type;
    },
    getDictLabel(pid, type, cid) {
      let str = "";
      if (cid) {
        this.pooldictionary.map((item) => {
          if (item.value == pid) {
            if (item["child"][type]) {
              let data = item["child"][type];
              data.map((c) => {
                if (c.value == cid) {
                  str = this.i18nlocel == "en" ? c.enLabel : c.label;
                }
              });
            }
          }
        });
      }

      return str;
    },
    editAssigneds() {
      this.clueIds = [this.$route.query.clueId];
      this.showAddAssigned = true;
      this.$nextTick(() => {
        this.$refs["addAssigned"].ruleForm.userIds = this.followersIds;
      });
    },
    backList() {},
    changeSchool() {
      this.showChangeSchool = true;
      this.$nextTick(() => {
        this.$refs["changeSchool"].ruleForm["schools"] =
          this.clueData["schools"];
        this.$refs["changeSchool"].setSchoolList(this.clueData["schools"]);
      });
    },
    isHiddenIetm(type, data) {
      let isShow = false;
      let list = ["enrollLevelLabel", "channellLabel", "directionLabel"];
      isShow = data == "--" && list.includes(type);
      return !isShow;
    },
    getShowName(item) {
      return item["lastName"] && item["firstName"]
        ? item["lastName"] + item["firstName"]
        : !item["lastName"] && !item["firstName"]
        ? "----"
        : item["lastName"] || item["firstName"];
    },
    // 切换跟进方式
    changeFollowType(data) {
      this.currentFollow = data.value;
      this.$refs.LogList.changeFollowType(data);
    },
    canShowChangeStatus(type) {
      let isShow = false;
      if (this.studentList.length == 0) return isShow;
      this.studentList.map((item) => {
        if (!isShow) {
          switch (type) {
            case "apply":
              if (item["baseInfo"]["status"] == "0") {
                isShow = true;
              }
              break;
            case "enter":
              if (item["baseInfo"]["status"] == "1") {
                isShow = true;
              }
              break;
            case "leaving":
              if (item["baseInfo"]["status"] == "2") {
                isShow = true;
              }
              break;
          }
        }
      });

      return isShow;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-step__description {
  padding-right: 0% !important;
}

.orderDetail_baseinfo {
  padding-bottom: 20px !important;
}

.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
