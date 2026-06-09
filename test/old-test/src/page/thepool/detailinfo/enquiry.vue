<template>
  <div>
    <div class="orderDetail">
      <div class="orderDetail_content">
        <div class="orderDetail_item">
          <div class="orderDetail_baseinfo">
            <div
              v-show="
                isHiddenIetm(item.value, $checkNull(clueData[item.value]))
              "
              class="orderDetail_baseinfo_item"
              v-for="(item, index) in clueInfo"
              :key="index"
            >
              <span>{{ $t("consult")[item.label] }}</span>
              <span :title="$checkNull(clueData[item.value])">{{
                $checkNull(clueData[item.value])
              }}</span>
            </div>
            <div class="orderDetail_baseinfo_item">
              <span>{{ $t("consult.备注") }}</span>
              <span
                style="white-space: wrap !important"
                :title="$checkNull(clueData['remark'])"
                >{{ $checkNull(clueData["remark"]) }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div>
        <!-- 线索动态表单 -->
        <FromItemDetail ref="FromItemDetailClue" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getClueDetail } from "@/api/consult/index.js";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import { consult } from "@/const/consult/index.js";
import FromItemDetail from "@/components/thepoolcommon/dynamicform/fromitemdetail.vue";
export default {
  components: {
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
      ],
    };
  },
  created() {
    this.currentClueId = this.$route.query.clueId;
    // this.initPageData();
  },
  mounted() {},
  activated() {},
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
    i18nlocel() {},
  },
  methods: {
    // 获取线索详情
    initData(res) {
      if (res.data.success) {
        let { clueInfo, followers, dynamicInfos, schools } = res.data.data;
        this.dynamicInfos = dynamicInfos || [];
        this.studentData = {};
        this.guardianData = {};
        this.clueData = {
          ...clueInfo,
          schools: schools || [],
        };
        this.currentClueId = clueInfo.id;
        this.clueData["followStatusLabel"] =
          this.$t("consult")[consult["followStatus"][clueInfo["followStatus"]]];
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
          if (this.clueData["applySchool"]) {
            this.getTemplateDynamic(
              3,
              clueInfo["applySchool"],
              dynamicInfos || []
            );
          }
        });
      }
    },
    isHiddenIetm(type, data) {
      let isShow = false;
      let list = ["enrollLevelLabel", "channellLabel", "directionLabel"];
      isShow = data == "--" && list.includes(type);
      return !isShow;
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
    async getTemplateDynamic(type, schoolId, dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: type });
      if (templateForm.length > 0) {
        let templateList = [];
        templateForm.map((dynamicItem) => {
          if (dynamicItem.schoolId == schoolId) {
            templateList = dynamicItem.templates || [];
          }
        });
        templateList.map((item) => {
          let dynamicInfoItem = dynamicInfos.find(
            (dynamicItem) => dynamicItem.templateId == item.templateId
          );
          switch (type) {
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
  },
};
</script>
