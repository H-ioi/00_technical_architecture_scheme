<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <el-button type="primary" size="medium" @click="backList">返回</el-button>
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">家长详情</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>账号状态</span>
            <span>{{ parentDatail["isActive"] ? "启用" : "禁用" }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>邮箱</span>
            <span>{{ checkNull(parentDatail["email"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>手机号</span>
            <span>{{ checkNull(parentDatail["phone"]) }}</span>
          </div>
          <!-- <div class="orderDetail_baseinfo_item">
            <span>付费总额</span>
            <span>{{ checkNull(parentDatail["payingSum"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>订单数量</span>
            <span>{{ checkNull(parentDatail["orderNum"]) }}</span>
          </div> -->
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">关联学生</div>
        <div class="orderDetail_baseinfo">
          <el-table
            style="width: 100%"
            :header-cell-style="tablestyle['headercellstyle']"
            :cell-style="tablestyle['rowstyle']"
            :row-class-name="tableRowClassName"
            :data="studentList"
          >
            <el-table-column
              v-for="(item, index) in course['bindStudentTable']"
              :key="index"
              :prop="item['prop']"
              :label="item['label']"
              :width="item['width']"
              :fixed="item['fixed']"
            >
              <template slot-scope="scope">
                <span
                  class="tableRow"
                  :title="checkNull(scope.row[item['prop']])"
                >
                  {{ checkNull(scope.row[item["prop"]]) }}</span
                >
              </template>
            </el-table-column>
            <!-- <el-table-column fixed="right" label="操作" width="120px">
              <template slot-scope="scope">
                <div class="df_align_center table_textbtn">
                  <span>
                    <el-button type="text" size="small">
                      查看
                    </el-button>
                  </span>
                </div>
              </template>
            </el-table-column> -->
          </el-table>
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
import { getParentDetail, getStudentByParent } from "@/api/academy/user.js";
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
      parentDatail: {},
      studentList: []
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
      this.getParentDetail();
      this.getStudentByParent();
    },
    getParentDetail() {
      getParentDetail(this.$route.query.id).then(res => {
        if (res.data.success) {
          this.parentDatail = res.data.data;
          console.log("getParentDetail", res);
        }
      });
    },
    getStudentByParent() {
      getStudentByParent(this.$route.query.id).then(res => {
        if (res.data.success) {
          this.studentList = res.data.data;
          console.log("studentList", res);
          this.studentList.map(item => {
            item["isIsaLabel"] = item["isIsa"] ? "是" : "否";
            item["genderLabel"] = item["gender"] == 1 ? "男" : "女";
          });
        }
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    backList() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.push("/academy/user/parent");
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
