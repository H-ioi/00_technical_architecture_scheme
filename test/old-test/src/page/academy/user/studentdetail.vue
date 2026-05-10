<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <el-button type="primary" size="medium" @click="backList">返回</el-button>
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">学生详情</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>是否爱莎学生</span>
            <span :title="studentDatail['isIsa'] ? '是' : '否'">{{
              studentDatail["isIsa"] ? "是" : "否"
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>姓名(中)</span>
            <span :title="studentDatail['nameCn']">{{
              checkNull(studentDatail["nameCn"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>姓名(英)</span>
            <span :title="studentDatail['nameEn']">{{
              checkNull(studentDatail["nameEn"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>昵称</span>
            <span :title="studentDatail['nickname']">{{
              checkNull(studentDatail["nickname"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学号</span>
            <span :title="studentDatail['admissionNo']">{{
              checkNull(studentDatail["admissionNo"])
            }}</span>
          </div>
          <!-- <div class="orderDetail_baseinfo_item">
            <span>关联家长账号</span>
            <span :title="studentDatail['parentPhone']">{{
              checkNull(studentDatail["parentPhone"])
            }}</span>
          </div> -->
          <div class="orderDetail_baseinfo_item">
            <span>出生日期</span>
            <span :title="studentDatail['birthdate']">{{
              checkNull(studentDatail["birthdate"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>性别</span>
            <span :title="studentDatail['gender'] == 1 ? '男' : '女'">{{
              studentDatail["gender"] == 1 ? "男" : "女"
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>国籍</span>
            <span :title="studentDatail['nationality']">{{
              checkNull(studentDatail["nationality"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>离校日期</span>
            <span :title="studentDatail['leaveDate']">{{
              checkNull(studentDatail["leaveDate"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>入学日期</span>
            <span :title="studentDatail['entryDate']">{{
              checkNull(studentDatail["entryDate"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学校名称(中)</span>
            <span :title="studentDatail['schoolNameCn']">{{
              checkNull(studentDatail["schoolNameCn"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>学校名称(英)</span>
            <span :title="studentDatail['schoolNameEn']">{{
              checkNull(studentDatail["schoolNameEn"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>年级</span>
            <span :title="studentDatail['gradeName']">{{
              checkNull(studentDatail["gradeName"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>班级</span>
            <span :title="studentDatail['form']">{{
              checkNull(studentDatail["form"])
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { tablestyle } from "@/const/tabledata/index";
import Table from "@/components/common/Table.vue";
import ShowText from "@/components/common/ShowText.vue";
import { getStudentDetail } from "@/api/academy/user.js";
import course from "@/const/academy/course.js";
export default {
  name: "detail",
  components: {
    Table
  },
  data() {
    return {
      tablestyle: tablestyle,
      course: course,
      studentDatail: {},
      tableData: [],
      tableBtn: [
        {
          name: "查看",
          type: "look",
          permissions: "look",
          icon: "el-icon-view"
        }
      ]
    };
  },

  created() {
    this.initData();
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions"
    ])
  },
  watch: {},
  methods: {
    initData() {
      this.getStudentDetail();
    },
    // 获取主订单详情
    getStudentDetail() {
      getStudentDetail(this.$route.query.id).then(res => {
        if (res.data.success) {
          this.studentDatail = res.data.data;
          console.log("getStudentDetail", res);
        }
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    backList() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.push("/academy/user/student");
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
