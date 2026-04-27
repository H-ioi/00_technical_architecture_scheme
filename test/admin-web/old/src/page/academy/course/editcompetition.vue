<template>
  <div>
    <div class="editFromBox">
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="rules"
        ref="from"
      >
        <div class="searchFromBox">
          <div class="df_sb searchFromBox_header">
            <div class="searchFromBox_header_titel">
              赛事{{ type == "add" ? "新增" : "编辑" }}
            </div>
          </div>
        </div>
        <el-scrollbar class="formItem">
          <div class="df_center_wrap">
            <el-form-item label="赛事中文名称" prop="nameCn">
              <el-input
                v-model="from.nameCn"
                placeholder="请输入"
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item label="赛事英文名称" prop="nameEn">
              <el-input
                v-model="from.nameEn"
                placeholder="请输入"
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item label="语言(中)" prop="languageCn">
              <el-input
                v-model="from.languageCn"
                placeholder="请输入"
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item label="语言(英)" prop="languageEn">
              <el-input
                v-model="from.languageEn"
                placeholder="请输入"
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item label="支持赛事人数" prop="supportNum">
              <el-input-number
                style="width: 100%;"
                v-model="from.supportNum"
                placeholder="请输入"
                :min="0"
                :precision="0"
              ></el-input-number>
            </el-form-item>

            <el-form-item label="可补充赛事人数" prop="supplementNum">
              <el-input-number
                style="width: 100%;"
                v-model="from.supplementNum"
                placeholder="请输入"
                :min="0"
                :precision="0"
              ></el-input-number>
            </el-form-item>

            <el-form-item label="年龄范围" prop="appropriateAge">
              <div class="df_sa">
                <el-input-number
                  style="width: 100%;"
                  v-model="from.appropriateAgeMin"
                  placeholder="请输入"
                  :min="0"
                  :max="from.appropriateAgeMax"
                  :precision="0"
                ></el-input-number>
                <span>-</span>
                <el-input-number
                  style="width: 100%;"
                  v-model="from.appropriateAgeMax"
                  placeholder="请输入"
                  :min="from.appropriateAgeMin"
                  :max="50"
                  :precision="0"
                ></el-input-number>
              </div>
            </el-form-item>

            <el-form-item label="赛事价格(RMB/元)" prop="price">
              <el-input-number
                style="width: 100%;"
                v-model="from.price"
                placeholder="请输入"
                :min="0"
                :precision="2"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number
                style="width: 100%;"
                v-model="from.sort"
                placeholder="请输入"
                :min="0"
                :precision="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              style="width: 80%"
              label="赛事中文地址"
              prop="addressCn"
            >
              <el-input
                type="textarea"
                :rows="2"
                :maxlength="100"
                show-word-limit
                v-model="from.addressCn"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="width: 80%"
              label="赛事英文地址"
              prop="addressEn"
            >
              <el-input
                type="textarea"
                :rows="2"
                :maxlength="100"
                show-word-limit
                v-model="from.addressEn"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="自动上架时间"
              prop="autoReleaseUpTime"
              style="width: 22%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="from.autoReleaseUpTime"
                type="datetime"
                placeholder="选择时间"
                :format="'yyyy-MM-dd HH:mm:ss'"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                  }
                }"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="自动下架时间"
              prop="autoReleaseDownTime"
              style="width: 22%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="from.autoReleaseDownTime"
                type="datetime"
                placeholder="选择时间"
                :format="'yyyy-MM-dd HH:mm:ss'"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                  }
                }"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item style="width: 100%" label="赛事状态" prop="release">
              <el-radio-group v-model="from.release">
                <el-radio
                  v-for="(item, index) in course['courseStatus']"
                  :label="item['value']"
                  :key="index"
                  >{{ item["label"] }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item style="width: 100%" label="是否置顶" prop="recommend">
              <el-radio-group v-model="from.recommend">
                <el-radio
                  v-for="(item, index) in course['yesOrNo']"
                  :label="item['value']"
                  :key="index"
                  >{{ item["label"] }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              style="width: 100%"
              label="封面图"
              prop="coverFileIds"
            >
              <CoverFile ref="coverFile" :scene="'isaic_competition_cover'" />
            </el-form-item>
            <el-form-item
              style="width: 100%"
              label="二维码"
              prop="qrCodeFileId"
            >
              <QrCodeFile
                ref="qrCodeFile"
                :scene="'isaic_competition_signup_success_qr_code'"
                :limit="1"
              />
            </el-form-item>
            <el-form-item
              style="width: 80%"
              label="赛事内容介绍中文"
              prop="detailsCn"
            >
              <TinymceCn ref="TinymceCn" scene="isaic_rich_text_attachment" />
            </el-form-item>
            <el-form-item
              style="width: 80%"
              label="赛事内容介绍英文"
              prop="detailsEn"
            >
              <TinymceEn ref="TinymceEn" scene="isaic_rich_text_attachment" />
            </el-form-item>
            <BindTable
              v-if="!hasLeader"
              ref="courseChild"
              :ignoreId="currentId"
              :type="type"
              :courseType="'competition'"
              :bindCourseType="1"
            />
            <BindTable
              v-if="!hasLeader"
              ref="activityChild"
              :ignoreId="currentId"
              :type="type"
              :courseType="'competition'"
              :bindCourseType="2"
            />
            <BindTable
              v-if="!hasLeader"
              ref="competitionChild"
              :ignoreId="currentId"
              :type="type"
              :courseType="'competition'"
              :bindCourseType="3"
            />
          </div>
        </el-scrollbar>
        <el-form-item class="editFromBtn">
          <el-button type="primary" size="medium" @click="submitForm('from')"
            >保存</el-button
          >
          <!-- <el-button type="primary" size="medium" @click="submitForm('from')"
            >保存并继续编辑</el-button
          > -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import course from "@/const/academy/course.js";
import CoverFile from "@/components/academy/FileList.vue";
import QrCodeFile from "@/components/academy/FileList.vue";
import TinymceCn from "@/components/tinymce/index.vue";
import TinymceEn from "@/components/tinymce/other.vue";
import BindTable from "./bindtable.vue";
import {
  getCompetitionChild,
  getCompetitionDetail,
  addCompetition,
  putCompetition
} from "@/api/academy/competition.js";
import { formrules } from "@/util/form.js";
export default {
  name: "PCOrderAddorder",
  components: { CoverFile, QrCodeFile, BindTable, TinymceCn, TinymceEn },
  data() {
    const checkUpTime = async (rule, value, callback) => {
      if (
        !this.from["autoReleaseDownTime"] ||
        this.from["autoReleaseDownTime"] == "" ||
        value == ""
      ) {
        callback();
      } else {
        let downTime = new Date(this.from["autoReleaseDownTime"]).getTime();
        let upTime = new Date(value).getTime();
        if (downTime > upTime) {
          callback();
        } else {
          callback(new Error("自动上架时间应小于下架时间"));
        }
      }
    };
    const checkDownTime = async (rule, value, callback) => {
      if (
        !this.from["autoReleaseUpTime"] ||
        this.from["autoReleaseUpTime"] == "" ||
        value == ""
      ) {
        callback();
      } else {
        let upTime = new Date(this.from["autoReleaseUpTime"]).getTime();
        let downTime = new Date(value).getTime();
        if (downTime > upTime) {
          callback();
        } else {
          callback(new Error("自动下架时间应大于上架时间"));
        }
      }
    };
    return {
      course: course,
      currentId: "",
      type: "",
      hasLeader: false,
      from: {
        nameCn: "",
        nameEn: "",
        supportNum: "",
        supplementNum: "",
        languageCn: "",
        languageEn: "",
        appropriateAge: "",
        appropriateAgeMax: "",
        appropriateAgeMin: "",
        price: "",
        addressCn: "",
        addressEn: "",
        autoReleaseDownTime: "",
        autoReleaseUpTime: "",
        release: "",
        recommend: "",
        coverFileIds: "",
        qrCodeFileId: "",
        detailsCn: "",
        detailsEn: "",
        courseChildIds: [],
        activityChildIds: [],
        competitionChildIds: [],
        sort: 0
      },
      rules: {
        nameCn: [{ required: true, message: "请输入", trigger: "blur" }],
        nameEn: [{ required: true, message: "请输入", trigger: "blur" }],
        languageCn: [{ required: true, message: "请输入", trigger: "blur" }],
        languageEn: [{ required: true, message: "请输入", trigger: "blur" }],
        coverFileIds: [{ required: true, message: "请上传", trigger: "blur" }],
        autoReleaseUpTime: [{ validator: checkUpTime, trigger: "blur" }],
        autoReleaseDownTime: [{ validator: checkDownTime, trigger: "blur" }],
        supportNum: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrules["checkNum"], trigger: "blur" }
        ],
        supplementNum: [
          { required: false, message: "请输入", trigger: "blur" },
          { validator: formrules["checkNum"], trigger: "blur" }
        ],
        price: [{ validator: formrules["checkPrice"], trigger: "blur" }]
      }
    };
  },
  created() {
    this.type = this.$route.query.type;
    if (this.type == "edit") {
      this.currentId = this.$route.query.id;
      this.getDetail(this.$route.query.id);
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo"])
  },
  methods: {
    submitForm(formName) {
      this.from["detailsCn"] = this.$refs["TinymceCn"].value;
      this.from["detailsEn"] = this.$refs["TinymceEn"].value;
      console.log("TinymceCn", this.$refs["TinymceCn"].value);
      // return;
      this.from["coverFileIds"] = this.$refs["coverFile"].filelist;
      this.from["qrCodeFileId"] = String(this.$refs["qrCodeFile"].filelist);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = _.cloneDeep({
            ...this.from,
            price: Number(this.from["price"]) * 100,
            courseChildIds: this.from["courseChildIds"],
            activityChildIds: this.from["courseChildIds"],
            competitionChildIds: this.from["courseChildIds"]
          });
          if (!this.hasLeader) {
            data["courseChildIds"] = this.$refs["courseChild"].bindSelectionId;
            data["activityChildIds"] = this.$refs[
              "activityChild"
            ].bindSelectionId;
            data["competitionChildIds"] = this.$refs[
              "competitionChild"
            ].bindSelectionId;
          }
          if (this.$route.query.type == "add") {
            addCompetition(data).then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
                this.$router.push("/academy/course/competition");
              }
            });
          } else {
            data["id"] = this.$route.query.id;
            putCompetition(data).then(res => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
                this.$router.push("/academy/course/competition");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    getDetail(id) {
      getCompetitionDetail(id).then(res => {
        console.log("getCourseDetail", res);
        if (res.data.success) {
          let data = res.data.data;
          let {
            courseChilds,
            activityChilds,
            competitionChilds,
            hasLeader
          } = data;
          this.hasLeader = hasLeader;
          this.from = {
            nameCn: data["nameCn"],
            nameEn: data["nameEn"],
            supportNum: data["supportNum"],
            supplementNum: data["supplementNum"],
            languageCn: data["languageCn"],
            languageEn: data["languageEn"],
            appropriateAge: data["appropriateAge"],
            appropriateAgeMax: data["appropriateAgeMax"],
            appropriateAgeMin: data["appropriateAgeMin"],
            price: Number(data["price"]) / 100,
            addressCn: data["addressCn"],
            addressEn: data["addressEn"],
            autoReleaseDownTime: data["autoReleaseDownTime"],
            autoReleaseUpTime: data["autoReleaseUpTime"],
            release: data["release"],
            recommend: data["recommend"],
            coverFileId: data["coverFileId"],
            qrCodeFileId: data["qrCodeFileId"],
            detailsCn: data["detailsCn"],
            detailsEn: data["detailsEn"],
            courseChildIds: data["courseChildIds"],
            activityChildIds: data["activityChildIds"],
            competitionChildIds: data["competitionChildIds"],
            sort: data["sort"]
          };
          this.$nextTick(() => {
            this.$refs["TinymceCn"].value = this.from["detailsCn"];
            this.$refs["TinymceEn"].value = this.from["detailsEn"];
            // this.$refs["coverFile"].getFileList(id);
            // this.$refs["qrCodeFile"].getFileList(id);
            if (data["coverFileIds"]) {
              this.$refs["coverFile"].getAllFiles({
                ids: data["coverFileIds"]
              });
            }
            if (data["qrCodeFileId"]) {
              this.$refs["qrCodeFile"].getAllFiles({
                ids: [data["qrCodeFileId"]]
              });
            }
            if (!this.hasLeader) {
              console.log("courseChildIds", courseChilds);
              if (courseChilds) {
                this.$refs["courseChild"].initData(courseChilds);
              }
              if (activityChilds) {
                this.$refs["activityChild"].initData(activityChilds);
              }
              if (competitionChilds) {
                this.$refs["competitionChild"].initData(competitionChilds);
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.searchFromBox {
  background-color: #fff;
  padding: 20px 20px 0;
  .searchFromBox_header {
    .searchFromBox_header_titel {
      font-size: 20px;
      font-family: AlibabaPuHuiTiM;
      color: #333333;
      line-height: 27px;
      padding-left: 15px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 0;
        width: 5px;
        background: #d4ab85 !important;
        border-radius: 3px;
      }
    }
  }
  .palyTableBox {
    padding-top: 10px;
  }
}
</style>
