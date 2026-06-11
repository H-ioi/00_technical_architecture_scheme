<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <el-button
        v-if="visitData['visitStatus'] == 1"
        type="primary"
        size="medium"
        @click="editVisit"
        >编辑</el-button
      >
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">访客信息</div>
        <div class="orderDetail_baseinfo baseinfo">
          <div
            v-if="
              visitData['visitStatus'] != 1 && visitData['visitStatus'] != 2
            "
            style="width: 100% !important"
            class="orderDetail_baseinfo_item"
          >
            <span>电子访问证</span>
            <span class="clickable" @click="visitCard">点击查看</span>
          </div>
          <div
            v-for="(item, index) in visitInfo"
            :key="index"
            class="orderDetail_baseinfo_item"
          >
            <span>{{ item.label }}</span>
            <span>{{ $checkNull(visitData[item.prop]) }}</span>
          </div>
          <div class="orderDetail_infoItem">
            <span class="infoItemTitle">照片</span>
            <img
              v-if="imageUrl"
              style="width: 100px; height: 100px"
              :src="imageUrl"
            />
            <span v-else>--</span>
          </div>
        </div>
      </div>
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">受访信息</div>
        <div class="orderDetail_baseinfo baseinfo">
          <div
            v-for="(item, index) in schoolInfo"
            :key="index"
            class="orderDetail_baseinfo_item"
          >
            <span>{{ item.label }} </span>
            <span>{{ $checkNull(visitData[item.prop]) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="orderDetail_content" v-if="visitData['visitType'] == 1">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">工程信息</div>
        <div class="orderDetail_baseinfo baseinfo">
          <div
            v-for="(item, index) in projectInfo"
            :key="index"
            class="orderDetail_baseinfo_item"
          >
            <span>{{ item.label }}</span>
            <span>{{ $checkNull(projectData[item.prop]) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="orderDetail_content" v-if="auditList.length > 0">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title" style="margin-bottom: 20px">
          审核信息
        </div>
        <logList :logList="auditList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getVisitDetail, getParamInfo } from "@/api/workorder/user/visit.js";
import ShowText from "@/components/common/ShowText.vue";
import logList from "@/views/oms/visit/modal/loglist.vue";

import { order } from "@/const/order/index.js";
export default {
  name: "VisitDetail",
  components: {
    ShowText,
    logList,
  },
  data() {
    return {
      order: order,
      visitInfo: [
        {
          label: "访问状态",
          prop: "visitStatusLabel",
        },
        {
          label: "申请时间",
          prop: "createTime",
        },
        {
          label: "访问类型",
          prop: "visitTypeLabel",
        },
        {
          label: "访客姓名",
          prop: "visitHumanName",
        },
        {
          label: "访客身份证",
          prop: "visitHumanIdNo",
        },
        {
          label: "访客手机号",
          prop: "visitHumanPhone",
        },

        {
          label: "访问时间",
          prop: "visitTime",
        },
        {
          label: "访问随行人数",
          prop: "visitHumanSum",
        },
        {
          label: "访客车牌号",
          prop: "visitVehicleIdNo",
        },
        {
          label: "来访事由",
          prop: "visitDetail",
        },
      ],
      schoolInfo: [
        // {
        //   label: "邀请人",
        //   prop: "inviterLabel",
        // },
        {
          label: "受访园区",
          prop: "targetSchoolLabel",
        },
        {
          label: "受访人员姓名",
          prop: "targetUserName",
        },
        {
          label: "受访部门",
          prop: "targetDepartment",
        },
        {
          label: "受访人员联系方式",
          prop: "targetUserContact",
        },
      ],
      projectInfo: [
        {
          label: "访客类型",
          prop: "visitorTypeLabel",
        },
        {
          label: "工程名称",
          prop: "projectName",
        },
        {
          label: "联系方式",
          prop: "contactInfo",
        },
        {
          label: "施工单位",
          prop: "constructionContractor",
        },
        {
          label: "现场负责人",
          prop: "constructionSupervisor",
        },
        {
          label: "工程日期",
          prop: "constructionDate",
        },
        {
          label: "工程时间",
          prop: "constructionTime",
        },
        {
          label: "工作区域",
          prop: "constructionArea",
        },
      ],
      auditList: [],
      visitData: {},
      projectData: {},
      schoolList: [],
      schoolMap: {},
      userList: [],
      imageUrl: null,
    };
  },

  created() {
    this.initParamData();
  },
  mounted() {},
  activated() {
    this.initParamData();
  },
  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },
  methods: {
    async initParamData() {
      let data = await getParamInfo();
      let { schoolMap, visitUserList } = data;

      Object.keys(schoolMap).forEach((key) => {
        this.schoolMap[schoolMap[key]] = key;
        this.schoolList.push({
          label: key,
          value: schoolMap[key],
        });
      });
      this.userList = visitUserList;
      this.getDetail();
    },
    async getDetail() {
      let id = this.$route.query.id;
      getVisitDetail(id).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let data = res.data.data;

          this.visitData = {
            ...data,
            inviterLabel: this.$getListLabel(this.userList, data.inviterId),
            visitStatusLabel: this.$getListLabel(
              order["visitStatusList"],
              data.visitStatus
            ),
            visitTypeLabel: this.$getListLabel(
              order["visitTypeList"],
              data.visitType
            ),
            targetSchoolLabel: this.$getListLabel(
              this.schoolList,
              data.targetSchool
            ),
            visitTime:
              data.visitDateBegin +
              " " +
              data.visitTimeBegin +
              "-" +
              data.visitTimeEnd,
          };
          this.auditList = data.auditList || [];
          if (this.auditList.length > 0) {
            this.auditList.forEach((item) => {
              item.auditStatusLabel = this.$getListLabel(
                order["visitStatusList"],
                item.auditStatus
              );
            });
          }
          if (data.visitHumanPhotoId) {
            this.imageUrl = `${process.env.VUE_APP_BASE_URL}/workorder/mobile/client/visitor/visit/info/photo/download/${id}`;
          }
          delete this.visitData.projectInfo;
          if (data.visitType == "1" && data.projectInfo) {
            this.projectData = {
              ...data.projectInfo,
              visitorTypeLabel: this.$getListLabel(
                order["visitorTypeList"],
                data.projectInfo.visitorType
              ),
              constructionDate:
                data.projectInfo.constructionDateBegin +
                "至" +
                data.projectInfo.constructionDateEnd,
              constructionTime:
                data.projectInfo.constructionTimeBegin +
                "至" +
                data.projectInfo.constructionTimeEnd,
            };
          } else {
            this.projectInfo = {};
          }
        }
      });
    },
    editVisit() {
      this.$router.push({
        path: "/orderuser/visit/form",
        query: {
          type: "edit",
          id: this.$route.query.id,
        },
      });
    },
    visitCard() {
      let routeUrl = `${process.env.VUE_APP_TEACHER_URL}/visit/card?uuid=${this.visitData["uuid"]}`;
      window.open(routeUrl, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.baseinfo {
  .orderDetail_baseinfo_item {
    margin-bottom: 20px;
  }
}
.clickable {
  cursor: pointer;
  color: #ba8e62 !important;
  // 增加下划线
  text-decoration: underline;
}
</style>
