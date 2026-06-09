<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div class="thepool-detail">
        <div class="thepool-detail_left">
          <div class="thepool-detail_top">
            <div class="thepool-tabs">
              <div
                @click="changeTab('guardianInfo')"
                :class="[
                  'thepool-tabs-item',
                  { 'is-active': currentTab === 'guardianInfo' },
                ]"
              >
                {{ $t("consult.家长信息") }}
              </div>
              <div
                @click="changeTab('studentInfo')"
                :class="[
                  'thepool-tabs-item',
                  { 'is-active': currentTab === 'studentInfo' },
                ]"
              >
                {{ $t("consult.学生信息") }}
              </div>
            </div>
            <div class="thepool-btns" v-if="currentTab === 'guardianInfo'">
              <el-button
                v-if="
                  guardianType == '2' &&
                  permissions['enquiry_guardian_school_edit']
                "
                type="primary"
                size="small"
                round
                @click="changeSchool"
                >{{ $t("consult.修改申请校区") }}</el-button
              >
              <el-button
                v-if="
                  guardianType == '1'
                    ? permissions['thepool_user_guardian_mine_edit']
                    : permissions['thepool_user_guardian_edit']
                "
                type="primary"
                size="small"
                round
                @click="editGuardian"
                >{{ $t("consult.编辑") }}</el-button
              >
            </div>
          </div>
          <div class="thepool-detail_content">
            <el-scrollbar class="detail-content" height="100%">
              <!-- 家长详情 -->
              <DETAIL-PARENT
                v-show="currentTab === 'guardianInfo'"
                ref="DETAIL-PARENT"
              />
              <!-- 学生详情 -->
              <DETAIL-STUDENT
                v-show="currentTab === 'studentInfo'"
                ref="DETAIL-STUDENT"
              />
            </el-scrollbar>
          </div>
        </div>
        <div class="thepool-detail_right" ref="detailRight">
          <div class="thepool-detail_top">
            <div class="title">{{ $t("consult.跟进记录") }}</div>
            <div class="thepool-btns"></div>
          </div>
          <!-- 跟进记录 -->
          <div class="pool-tabs">
            <el-tabs v-model="currentFollow" @tab-click="changeFollowType">
              <el-tab-pane :label="$t('consult.全部')" name="all">
              </el-tab-pane>
              <el-tab-pane
                v-for="(item, index) in dictionary['follow_type']"
                :key="index"
                :label="i18nlocel == 'en' ? item.enLabel : item.label"
                :name="item.value"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-scrollbar height="100%" class="thepool-detail_content">
            <LOG-LIST ref="LOG-LIST" />
          </el-scrollbar>
        </div>
      </div>

      <!-- 新增家长 -->
      <ADD-GUARDIANS ref="ADD-GUARDIANS" @initData="getGuardianDetail" />
      <!-- 修改归属校区 -->
      <CHANGE-SCHOOL
        ref="CHANGE-SCHOOL"
        :id="currentGuardianId"
        :type="'guardian'"
        @initData="getGuardianDetail"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getPoolStudentTemplate,
  getStudentfillInfo,
} from "@/api/consult/collection.js";
import {
  getGuardianDetail,
  getStudentGuardian,
} from "@/api/consult/student.js";
import DETAILSTUDENT from "@/page/thepool/detailinfo/student.vue";
import DETAILPARENT from "@/page/thepool/detailinfo/parent.vue";
import LOGLIST from "@/page/thepool/consult/modal/loglist.vue";
import ADDGUARDIANS from "@/page/thepool/modal/addguardians.vue";
import CHANGESCHOOL from "@/page/thepool/modal/changeschool.vue";
import { useDragResize } from "@/util/dragresize";
export default {
  name: "PCOrderDetail",
  components: {
    DETAILSTUDENT,
    DETAILPARENT,
    LOGLIST,
    ADDGUARDIANS,
    CHANGESCHOOL,
  },
  data() {
    return {
      // 当前选中的tab
      currentTab: "guardianInfo",
      guardianType: "",
      currentGuardianId: "",
      schools: [],
      currentFollow: "all",
    };
  },

  created() {
    this.guardianType = this.$route.query.type;
    this.currentGuardianId = this.$route.query.id;
    this.initData();
  },
  mounted() {
    const el = this.$refs.detailRight;
    if (el) {
      // 调用拖拽
      this.destroyDrag = useDragResize(el, {
        minWidth: 300,
        maxWidth: 800,
        throttleDelay: 10,
      });
    }
  },
  beforeDestroy() {
    // 页面销毁时清除事件（防止内存泄漏）
    if (this.destroyDrag) {
      this.destroyDrag();
    }
  },
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
    // 切换tab
    changeTab(tab) {
      this.currentTab = tab;
    },
    initData() {
      this.getGuardianDetail();
      this.getStudentGuardian();
    },
    getGuardianDetail() {
      getGuardianDetail(this.$route.query.id).then(async (res) => {
        if (res.data.success) {
          let { guardianInfo, dynamicInfos, records, schools, photos } =
            res.data.data;
          this.schools = schools || [];
          let parentInfo = {
            guardianInfo: guardianInfo || {},
            dynamicInfos: dynamicInfos || [],
            photos: photos || [],
            schools: schools || [],
          };
          this.$nextTick(async () => {
            // 家长信息
            this.$refs["DETAIL-PARENT"].initData([parentInfo]);
            this.$refs["LOG-LIST"].setLogList(records);
          });
        }
      });
    },
    getStudentGuardian() {
      getStudentGuardian({ guardianId: this.currentGuardianId }).then((res) => {
        if (res.data.success) {
          let data = res.data.data || [];
          this.$nextTick(async () => {
            // 学生信息
            this.$refs["DETAIL-STUDENT"].initData(data);
          });
        }
      });
    },
    editGuardian() {
      this.$refs["ADD-GUARDIANS"].getGuardianDetail(this.currentGuardianId);
    },
    changeSchool() {
      this.$refs["CHANGE-SCHOOL"].setSchoolList(this.schools);
    },
    // 切换跟进方式
    changeFollowType(e) {
      this.$refs["LOG-LIST"].changeFollowType({ value: e.name });
    },
  },
};
</script>

<style lang="scss" scoped></style>
