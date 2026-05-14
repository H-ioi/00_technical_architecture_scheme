<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
      <div style="display: flex; justify-content: center; align-items: center">
        <PdfGenerator ref="pdfGenerator" :studentBaseInfo="studentBaseInfo" />
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getPoolStudentTemplate,
  getStudentfillInfo,
} from "@/api/consult/collection.js";
import { getStudentDetail } from "@/api/consult/student.js";
import { getOuterFile } from "@/api/upload/index.js";
import { consult } from "@/const/consult/index.js";
import PdfGenerator from "./PdfGenerator/index.vue";
export default {
  components: {
    PdfGenerator,
  },
  data() {
    return {
      studentId: "",
      applySchool: 5,
      sexList: consult["sexList"],
      enrolledStatus: consult["enrolledStatus"],
      studentBaseInfo: {},
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.studentId = this.$route.query.id;
      this.applySchool = this.$route.query.schoolId;
      this.getStudentDetail();
      let templateList = await getPoolStudentTemplate({
        applySchool: this.applySchool,
      });
      let studentFillInfo = await getStudentfillInfo({
        studentId: this.studentId,
      });

      this.$refs.pdfGenerator.initData(templateList, studentFillInfo);
    },
    getStudentDetail() {
      getStudentDetail(this.studentId).then((res) => {
        if (res.data.success) {
          let { baseInfo, schools, photos } = res.data.data;
          let data = baseInfo;
          this.studentBaseInfo = {
            ...data,
            schools,
            sexlabel: this.$getListLabel(this.sexList, data.sex),
            enrollYear: data["enrollYear"]
              ? `${data["enrollYear"]}-${data["enrollYear"] + 1}`
              : "--",
            statusLabel: this.$getListLabel(this.enrolledStatus, data.status),
            applySchoolLabel: this.$getListLabel(
              this.pooldictionary,
              data.applySchool
            ),
            enrollLevelLabel: data.applySchool
              ? this.getDictLabel(
                  data.applySchool,
                  "enquiry_enroll_level",
                  data.enrollLevel
                )
              : this.$getListLabel(
                  this.dictionary["enquiry_enroll_level"],
                  data.enrollLevel
                ),
          };
          this.$nextTick(async () => {
            if (photos && photos.length > 0) {
              photos.forEach(async (item) => {
                if (String(item.type) == "0") {
                  const file = await getOuterFile(item.photoId);
                  let photoUrl = window.URL.createObjectURL(file);
                  console.log(photoUrl);
                  this.$set(this.studentBaseInfo, "photoUrl", photoUrl);
                }
              });
            }
          });
          console.log(" this.studentBaseInfo", this.studentBaseInfo);
        }
      });
    },
    getDictLabel(pid, type, cid) {
      let str = "";
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
      return str;
    },
  },
};
</script>
