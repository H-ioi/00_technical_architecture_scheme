<template>
  <div class="orderDetail">
    <!-- <div class="orderDetail_btn">
      <el-button type="primary" size="medium" @click="backList">返回</el-button>
    </div> -->
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">
          {{ course["courseName"][type] }}详情
        </div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>中文名称</span>
            <span>{{ formData["nameCn"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>英文名称</span>
            <span>{{ checkNull(formData["nameEn"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>自动上架时间</span>
            <span>{{ checkNull(formData["autoReleaseUpTime"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>自动下架时间</span>
            <span>{{ checkNull(formData["autoReleaseDownTime"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>状态</span>
            <span>{{ checkNull(formData["release"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" v-if="type != '4'">
            <span>是否置顶</span>
            <span>{{ checkNull(formData["recommend"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>语言(中)</span>
            <span>{{ checkNull(formData["languageCn"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>语言(英)</span>
            <span>{{ checkNull(formData["languageEn"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" v-if="type == '1'">
            <span>授课年级</span>
            <span>{{ checkNull(formData["grade"]) }}</span>
          </div>

          <div class="orderDetail_baseinfo_item" v-if="type == '1'">
            <span>课时</span>
            <span>{{ checkNull(formData["classHour"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" v-if="type == '1'">
            <span>授课时间</span>
            <span>{{ checkNull(formData["teachingTime"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" v-if="type == '4'">
            <span>学生理事</span>
            <span>{{ checkNull(formData["studentCouncil"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" v-if="type == '4'">
            <span>指导老师</span>
            <span>{{ checkNull(formData["academicAdvisor"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>支持课程人数</span>
            <span>{{ checkNull(formData["supportNum"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>可补充课程人数</span>
            <span>{{ checkNull(formData["supplementNum"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>年龄范围</span>
            <span>{{
              formData["appropriateAgeMin"] +
                "-" +
                formData["appropriateAgeMax"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>课程价格(RMB/元)</span>
            <span>{{ checkNull(formData["price"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>排序</span>
            <span>{{ formData["sort"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>中文地址</span>
            <span>{{ checkNull(formData["addressCn"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>英文地址</span>
            <span>{{ checkNull(formData["addressEn"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>封面图</span>
            <FileList
              ref="coverFile"
              :scene="course['courseCover'][type]"
              :isDisabled="true"
            />
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>二维码</span>
            <FileList
              ref="qrCodeFile"
              :scene="course['courseCode'][type]"
              :isDisabled="true"
              :limit="1"
            />
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>内容介绍中文</span>
            <span
              v-if="
                formData['detailsCn'] == '' || formData['detailsCn'] == null
              "
              >{{ checkNull(formData["detailsCn"]) }}</span
            >
            <div
              v-else
              style="width:750px;height: 400px;overflow-y: scroll;"
            >
              <span v-html="formData['detailsCn']"></span>
            </div>
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>内容介绍英文</span>
            <span
              v-if="
                formData['detailsEn'] == '' || formData['detailsEn'] == null
              "
              >{{ checkNull(formData["detailsEn"]) }}</span
            >
            <div
              v-else
              style="width: 750px;height: 400px;overflow-y: scroll;"
            >
              <span v-html="formData['detailsEn']"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">课程绑定</div>
        <div class="orderDetail_baseinfo">
          <el-table
            style="width: 100%"
            :header-cell-style="tablestyle['headercellstyle']"
            :cell-style="tablestyle['rowstyle']"
            :data="formData['courseChilds']"
          >
            <el-table-column
              v-for="(item, index) in course['courseBindTableTitle']"
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
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">活动绑定</div>
        <div class="orderDetail_baseinfo">
          <el-table
            style="width: 100%"
            :header-cell-style="tablestyle['headercellstyle']"
            :cell-style="tablestyle['rowstyle']"
            :data="formData['activityChilds']"
          >
            <el-table-column
              v-for="(item, index) in course['courseBindTableTitle']"
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
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">赛事绑定</div>
        <div class="orderDetail_baseinfo">
          <el-table
            style="width: 100%"
            :header-cell-style="tablestyle['headercellstyle']"
            :cell-style="tablestyle['rowstyle']"
            :data="formData['competitionChilds']"
          >
            <el-table-column
              v-for="(item, index) in course['courseBindTableTitle']"
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
import { getCourseDetail } from "@/api/academy/course.js";
import { getCompetitionDetail } from "@/api/academy/competition.js";
import { getClubDetail } from "@/api/academy/club.js";
import { getActivityDetail } from "@/api/academy/activity.js";
import { tablestyle } from "@/const/tabledata/index";
import FileList from "@/components/academy/FileList.vue";
import Table from "@/components/common/Table.vue";
import course from "@/const/academy/course.js";
export default {
  name: "detail",
  components: {
    FileList,
    Table
  },
  data() {
    return {
      tablestyle: tablestyle,
      course: course,
      type: "",
      courseId: "",
      formData: {}
    };
  },

  created() {
    this.type = this.$route.query.type;
    this.courseId = this.$route.query.id;
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
      this.getDetail();
    },
    getDetail() {
      switch (this.type) {
        case "1":
          getCourseDetail(this.courseId).then(res => {
            if (res.data.success) {
              let data = res.data.data;
              this.resetData(data);
            }
          });
          break;
        case "2":
          getActivityDetail(this.courseId).then(res => {
            if (res.data.success) {
              let data = res.data.data;
              this.resetData(data);
            }
          });
          break;
        case "3":
          getCompetitionDetail(this.courseId).then(res => {
            if (res.data.success) {
              let data = res.data.data;
              this.resetData(data);
            }
          });
          break;
        case "4":
          getClubDetail(this.courseId).then(res => {
            if (res.data.success) {
              let data = res.data.data;
              this.resetData(data);
            }
          });
          break;
      }
    },
    resetData(data) {
      this.formData = data;
      this.formData["release"] =
        course["courseStatusObj"][this.formData["release"]];
      this.formData["recommend"] = this.formData["recommend"] ? "是" : "否";
      this.formData["price"] = this.formData["price"] / 100;
      if (this.type == "4") {
        this.formData["courseChilds"] = this.formData["courses"];
        this.formData["activityChilds"] = this.formData["activitys"];
        this.formData["competitionChilds"] = this.formData["competitions"];
      }
      this.formData["courseChilds"].map(item => {
        item["price"] = item["price"] / 100;
        item["releaseLabel"] = course["courseStatusObj"][item["release"]];
      });
      this.formData["activityChilds"].map(item => {
        item["price"] = item["price"] / 100;
        item["releaseLabel"] = course["courseStatusObj"][item["release"]];
      });
      this.formData["competitionChilds"].map(item => {
        item["price"] = item["price"] / 100;
        item["releaseLabel"] = course["courseStatusObj"][item["release"]];
      });
      this.$nextTick(() => {
        // this.$refs["coverFile"].getFileList(this.courseId);
        // this.$refs["qrCodeFile"].getFileList(this.courseId);
        if (this.formData["coverFileIds"]) {
          this.$refs["coverFile"].getAllFiles({
            ids: this.formData["coverFileIds"]
          });
        }
        if (this.formData["qrCodeFileId"]) {
          this.$refs["qrCodeFile"].getAllFiles({
            ids: [this.formData["qrCodeFileId"]]
          });
        }
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    backList() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.push("/academy/consult/swiper");
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
