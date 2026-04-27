<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.请确认要覆盖的数据')"
      :visible="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div style="max-height: 800px; overflow: auto">
        <el-form :label-position="'top'" :inline="true" ref="from">
          <el-form-item style="width: 100%" label="线索表" v-if="clueData.length > 0">
            <Table
              style="width: 100%"
              ref="Table"
              :tableTitle="clueTitle"
              :tableData="clueData"
              :tableBtn="[]"
              :showSelection="false"
            />
          </el-form-item>
          <el-form-item style="width: 100%" label="家长表" v-if="parentData.length > 0">
            <Table
              style="width: 100%"
              ref="Table"
              :tableTitle="parentTitle"
              :tableData="parentData"
              :tableBtn="[]"
              :showSelection="false"
            />
          </el-form-item>
          <el-form-item style="width: 100%" label="学生表" v-if="studentData.length > 0">
            <Table
              style="width: 100%"
              ref="Table"
              :tableTitle="studentTitle"
              :tableData="studentData"
              :tableBtn="[]"
              :showSelection="false"
            />
          </el-form-item>
          <el-form-item class="modalFromBtn" style="width: 100%">
            <el-button type="primary" size="medium" round @click="batchConfirm">{{
              $t("consult.确认")
            }}</el-button>
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import Table from "@/components/thepoolcommon/Table.vue";
export default {
  name: "guardians",
  components: {
    Table,
  },
  props: {},
  data() {
    return {
      showModal: false,
      clueTitle: [],
      studentTitle: [],
      parentTitle: [],
      clueData: [],
      studentData: [],
      parentData: [],
      sexList: consult["sexList"],
      coverTitle: {
        clueTitle: consult["selectTableTitle"],
        studentTitle: consult["studentTitle"],
        parentTitle: consult["guardiansTableTitle"],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "pooldictpermissions",
      "permissions",
      "dictionary",
      "i18nlocel",
      "pooldictionary",
    ]),
  },
  methods: {
    resetTitle(data) {
      this.coverTitle = data;
      this.clueTitle = consult["coverClueTableTitle"].filter((item) => {
        return this.coverTitle["clueTitle"].includes(item["prop"]);
      });
      this.studentTitle = consult["coverStudentTitle"].filter((item) => {
        return this.coverTitle["studentTitle"].includes(item["prop"]);
      });
      this.parentTitle = consult["coverParentTableTitle"].filter((item) => {
        return this.coverTitle["parentTitle"].includes(item["prop"]);
      });
    },
    show(data) {
      this.showModal = true;
      let {
        clueInfoEntityList,
        guardianInfoEntityList,
        studentInfoEntityList,
        dynamicParams,
      } = data;

      dynamicParams.map((item) => {
        switch (item.type) {
          case 1:
            this.studentTitle = item["collections"].map((item) => {
              return {
                prop: item.key,
                label: item.name,
              };
            });
            break;
          case 2:
            this.parentTitle = item["collections"].map((item) => {
              return {
                prop: item.key,
                label: item.name,
              };
            });
            break;
          case 3:
            this.clueTitle = item["collections"].map((item) => {
              return {
                prop: item.key,
                label: item.name,
              };
            });
            break;
        }
      });
      this.$nextTick(() => {
        this.clueData = clueInfoEntityList;
        this.studentData = studentInfoEntityList;
        this.parentData = guardianInfoEntityList;
        this.clueData.map((item) => {
          item["applySchoolLabel"] = item.applySchool ? item.applySchool : "--";
          item["followTags"] = item.followTags ? item.followTags : "--";
          item["enrollLevel"] = item.enrollLevel ? item.enrollLevel : "--";
          item["enrollLevelIn"] = item.enrollLevelIn ? item.enrollLevelIn : "--";
          item["channel"] = item.channel ? item.channel : "--";
          item["direction"] = item.direction ? item.direction : "--";
          //   item["applySchool"] = this.getDatastr(item.applySchool, this.pooldictionary);
          //   if (item.applySchool) {
          //     item["applySchoolLabel"] = this.getDatastr(
          //       item.applySchool,
          //       this.pooldictionary
          //     );
          //     item["followTags"] = this.getDataLabel(
          //       item.applySchool,
          //       "enquiry_follow_tags",
          //       item.followTags
          //     );
          //     item["channellLabel"] = this.getDataLabel(
          //       item.applySchool,
          //       "enquiry_channel",
          //       item.channel
          //     );
          //     let channelChildOneLabel = this.getDataLabel(
          //       item.applySchool,
          //       "enquiry_channel_child_one",
          //       item.channelChildOne
          //     );
          //     item["channellLabel"] =
          //       item["channellLabel"] +
          //       (channelChildOneLabel == "" ? "" : "/" + channelChildOneLabel);
          //   } else {
          //     item["followTags"] = this.getDatastr(
          //       item.followTags,
          //       this.dictionary["enquiry_follow_tags"]
          //     );
          //     item["channellLabel"] = this.getDatastr(
          //       item.channel,
          //       this.dictionary["enquiry_channel"]
          //     );
          //     if (item.channelChildOne) {
          //       item["channellLabel"] =
          //         item["channellLabel"] +
          //         "/" +
          //         this.getDatastr(
          //           item.channelChildOne,
          //           this.dictionary["enquiry_channel_child_one"]
          //         );
          //     }
          //   }
          //   item["atSchoolLabel"] = this.setAtSchool(item);
          //   item["directionLabel"] = this.setDirection(item);
          //   item["enrollLevelLabel"] = this.setEnrollLevel(item);
          //   item["enrollLevelInLabel"] = this.setEnrollLevelIn(item);
        });
        console.log(" this.clueData ", this.clueData);

        this.studentData.map((item) => {
          //   item["sexlabel"] = item["sex"] ? item["sex"] : "--";
          item["applySchoolLabel"] = item.applySchool ? item.applySchool : "--";
          item["enrollLevel"] = item.enrollLevel ? item.enrollLevel : "--";
          item["enrollLevelIn"] = item.enrollLevelIn ? item.enrollLevelIn : "--";
          item["direction"] = item.direction ? item.direction : "--";
          item["sex"] = this.getDatastr(item.sex, this.sexList);
          //   item["applySchool"] = this.getDatastr(item.applySchool, this.pooldictionary);
          //   if (item.applySchool) {
          //     item["applySchoolLabel"] = this.getDatastr(
          //       item.applySchool,
          //       this.pooldictionary
          //     );
          //     item["enrollLevelLabel"] = this.getDataLabel(
          //       item.applySchool,
          //       "enquiry_enroll_level",
          //       item.enrollLevel
          //     );
          //     item["enrollLevelInLabel"] = this.getDataLabel(
          //       item.applySchool,
          //       "enquiry_enroll_level",
          //       item.enrollLevelIn
          //     );
          //     item["directionLabel"] = this.getDataLabel(
          //       item.applySchool,
          //       "enquiry_direction",
          //       item.direction
          //     );
          //   } else {
          //     item["enrollLevelLabel"] = this.getDatastr(
          //       item.enrollLevel,
          //       this.dictionary["enquiry_enroll_level"]
          //     );
          //     item["enrollLevelInLabel"] = this.getDatastr(
          //       item.enrollLevelIn,
          //       this.dictionary["enquiry_enroll_level"]
          //     );
          //     item["directionLabel"] = this.getDatastr(
          //       item.direction,
          //       this.dictionary["enquiry_direction"]
          //     );
          //   }
        });
        this.parentData.map((item) => {
          //   item["sexlabel"] = item["sex"] ? item["sex"] : "--";
          item["relationTypeLabel"] = this.getDatastr(
            item.relationType,
            this.dictionary["enquiry_relation_type"]
          );
          item["sex"] = this.getDatastr(item.sex, this.sexList);
        });
      });
    },
    batchConfirm() {
      this.$emit("batchConfirm");
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
    },
    getDatastr(value, data) {
      let str = "";
      data.map((item) => {
        if (item.value == value) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    getDataLabel(pid, type, cid) {
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
    setAtSchool(data) {
      let atSchool = [];
      if (data["students"].length > 0) {
        data["students"].map((item) => {
          if (
            item["atSchool"] != "" &&
            item["atSchool"] != undefined &&
            item["atSchool"] != null
          ) {
            atSchool.push(item["atSchool"]);
          }
        });
      }
      return String(atSchool);
    },
    setEnrollLevel(data) {
      let enrollLevel = [];
      if (data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevel
            );
          } else {
            str = this.getDatastr(
              item.enrollLevel,
              this.dictionary["enquiry_enroll_level"]
            );
          }
          if (str != "") {
            enrollLevel.push(str);
          }
        });
      }
      return String(enrollLevel);
    },
    setEnrollLevelIn(data) {
      let enrollLevel = [];
      if (data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_enroll_level",
              item.enrollLevelIn
            );
          } else {
            str = this.getDatastr(
              item.enrollLevelIn,
              this.dictionary["enquiry_enroll_level"]
            );
          }
          if (str != "") {
            enrollLevel.push(str);
          }
        });
      }
      return String(enrollLevel);
    },
    setDirection(data) {
      let direction = [];
      if (data["students"].length > 0) {
        data["students"].map((item) => {
          let str = "";
          if (item.applySchool) {
            str = this.getDataLabel(
              item.applySchool,
              "enquiry_direction",
              item.direction
            );
          } else {
            str = this.getDatastr(item.direction, this.dictionary["enquiry_channel"]);
          }

          if (str != "") {
            direction.push(str);
          }
        });
      }
      return String(direction);
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
.modalFromBtn {
  text-align: center;
}
</style>
