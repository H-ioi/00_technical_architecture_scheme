<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.一键升学')"
      :visible="showModal"
      width="1200px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="upgradedialog pooldialog"
    >
      <div
        v-if="showModal"
        v-loading="loading"
        style="max-height: 640px; min-height: 640px; overflow: auto; padding-top: 20px"
      >
        <StatusItem
          :statusList="statusList"
          :currentstatus="currentstatus"
          @changeStasus="changeStasus"
        />
        <div class="searchFromBox search" style="padding: 20px">
          <el-form
            ref="searchFrom"
            class="df_align_center searchFrom"
            :label-position="'top'"
            :inline="true"
            :model="searchFrom"
          >
            <el-form-item :label="$t('consult.关键词')" prop="keyword" style="width: 15%">
              <el-input
                v-model="searchFrom.keyword"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="pooldictpermissions.length > 1"
              :label="$t('consult.归属校区')"
              style="width: 15%"
            >
              <el-select
                multiple
                v-model="searchFrom.schools"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="pooldictpermissions.length > 1"
              :label="$t('consult.校区')"
              style="width: 15%"
            >
              <el-select
                multiple
                v-model="searchFrom.applySchools"
                :placeholder="$t('consult.请选择')"
                @change="changeSchool"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.申请年级')"
              style="width: 15%"
            >
              <el-select
                clearable
                multiple
                v-model="searchFrom.enrollLevels"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.在读年级')"
              style="width: 15%"
            >
              <el-select
                clearable
                multiple
                v-model="searchFrom.enrollLevelIns"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              style="width: 160px"
            >
              <el-select
                clearable
                multiple
                v-model="searchFrom.directions"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in directionsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.新增时间')" style="width: 320px">
              <el-date-picker
                style="width: 100%"
                v-model="searchFrom.createdTime"
                type="daterange"
                clearable
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd'"
                :format="'yyyy-MM-dd'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item style="width: 160px; margin-right: 0">
              <div class="df_sb">
                <el-button
                  type="defult"
                  size="small"
                  icon="el-icon-search"
                  round
                  @click="search"
                  >{{ $t("consult.搜索") }}</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-delete"
                  round
                  @click="clear"
                  >{{ $t("consult.清除") }}</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div style="padding-top: 0" class="df_sb palyTableBox">
          <span></span>
          <div class="df_sb">
            <el-button
              v-if="currentstatus == '0' && permissions['enquiry_student_upgrade_enter']"
              type="primary"
              size="medium"
              round
              @click="handleBtns('Upgrade')"
              >{{ $t("consult.批量升学") }}</el-button
            >
            <el-button
              v-if="
                currentstatus == '1' && permissions['enquiry_student_upgrade_rollback']
              "
              type="primary"
              size="medium"
              round
              @click="handleBtns('Downgrade')"
              >{{ $t("consult.批量回退") }}</el-button
            >
          </div>
        </div>
        <div class="tableBox">
          <Table
            style="width: 100%"
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="[]"
            :showSelection="true"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import {
  getStudentUpgrade,
  rollbackStudent,
  batchUpgradeStudent,
} from "@/api/consult/student.js";
import Table from "@/components/thepoolcommon/Table.vue";
import StatusItem from "@/components/thepoolcommon/StatusItem.vue";
export default {
  name: "guardians",
  components: {
    Table,
    StatusItem,
  },
  props: {
    isMine: Boolean,
  },
  data() {
    return {
      showModal: false,
      statusList: consult["upgradeList"],
      currentstatus: "0",
      tableTitle: consult["upgradeStudentTitle"],
      tableData: [],
      searchData: {},
      searchFrom: {
        applySchools: [],
        enrollLevels: [],
        enrollLevelIns: [],
        directions: [],
        schools: [],
        keyword: "",
        createdTime: [],
      },
      enrollLevelList: [],
      directionsList: [],
      loading: false,
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  methods: {
    show(data) {
      this.showModal = true;
      this.$nextTick(() => {
        this.searchFrom = {
          ...this.searchFrom,
          ...data,
        };
        if (data["applySchools"]) {
          this.changeSchool(data["applySchools"]);
        }
        // this.search();
      });
    },
    batchUpgradeStudent(data) {
      batchUpgradeStudent(data).then((res) => {
        if (res.data.success) {
          this.search();
          this.$message.success(this.$t("common.成功"));
        }
      });
    },
    rollbackStudent(data) {
      rollbackStudent(data).then((res) => {
        if (res.data.success) {
          this.search();
          this.$message.success(this.$t("common.成功"));
        }
      });
    },
    handleBtns(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择"));
      } else {
        switch (type) {
          case "Upgrade":
            this.$alert(this.$t("consult.确认批量升学吗"), this.$t("consult.审批"), {
              confirmButtonText: this.$t("consult.确定"),
            }).then(() => {
              this.batchUpgradeStudent({ ids: selectionId });
            });
            break;
          case "Downgrade":
            this.$alert(this.$t("consult.确认批量回退吗"), this.$t("consult.审批"), {
              confirmButtonText: this.$t("consult.确定"),
            }).then(() => {
              this.rollbackStudent({ ids: selectionId });
            });
        }
      }
    },
    getList() {
      this.loading = true;
      getStudentUpgrade({
        upgradeStatus: this.currentstatus,
        isMine: this.isMine,
        ...this.searchData,
      })
        .then((res) => {
          console.log("res", res);
          if (res.data.success) {
            this.tableData = res.data.data;
            this.tableData.map((item) => {
              if (item.applySchool) {
                item["applySchoolLabel"] = this.$getListLabel(
                  this.pooldictionary,
                  item.applySchool
                );
                item["grade"] = this.getDataLabel(
                  item.applySchool,
                  "enquiry_enroll_level",
                  item.grade
                );
                item["enrollLevel"] = this.getDataLabel(
                  item.applySchool,
                  "enquiry_enroll_level",
                  item.enrollLevel
                );
              } else {
                item["grade"] = this.$getListLabel(
                  this.dictionary["enquiry_enroll_level"],
                  item.grade
                );
                item["enrollLevel"] = this.$getListLabel(
                  this.dictionary["enquiry_enroll_level"],
                  item.enrollLevel
                );
              }
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 搜索
    search() {
      this.searchData = {};
      this.searchData = this.getSearchData();
      this.getList();
    },
    // 清除搜索
    clear() {
      this.searchData = {};
      if (this.pooldictpermissions.length == 1) {
        this.searchFrom = {
          ...this.searchFrom,
          enrollLevels: [],
          enrollLevelIns: [],
          directions: [],
          keyword: "",
          createdTime: [],
        };
      } else {
        this.searchFrom = {
          applySchools: [],
          enrollLevels: [],
          enrollLevelIns: [],
          directions: [],
          schools: [],
          keyword: "",
          createdTime: [],
        };
        this.enrollLevelList = [];
        this.directionsList = [];
      }
      this.search();
    },
    getSearchData() {
      let searchData = {};
      searchData["applySchools"] = this.searchFrom["applySchools"];
      searchData["enrollLevels"] = this.searchFrom["enrollLevels"];
      searchData["enrollLevelIns"] = this.searchFrom["enrollLevelIns"];
      searchData["directions"] = this.searchFrom["directions"];
      searchData["schools"] = this.searchFrom["schools"];
      if (this.searchFrom["keyword"]) {
        searchData["keyword"] = this.searchFrom["keyword"];
      }
      if (this.searchFrom["createdTime"] && this.searchFrom["createdTime"].length > 0) {
        searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      console.log("getSearchData", searchData);
      return searchData;
    },
    changeStasus(item, index) {
      this.currentstatus = item.type;
      this.getList();
    },
    closeModal() {
      this.showModal = false;
      this.tableData = [];
      this.enrollLevelList = [];
      this.directionsList = [];
      this.searchData = [];
      this.searchFrom = {
        applySchools: [],
        enrollLevels: [],
        enrollLevelIns: [],
        directions: [],
        schools: [],
        keyword: "",
        createdTime: [],
      };
    },
    changeSchool(e) {
      if (e.length == 0) {
        this.enrollLevelList = [];
        this.directionsList = [];
        return;
      }
      let enrollLevelList = [];
      let directionsList = [];
      let enrollLevelIds = [];
      let directionsIds = [];
      this.enrollLevelList = [];
      this.directionsList = [];
      let pooldictpermissions = _.cloneDeep(this.pooldictpermissions);
      pooldictpermissions.map((item) => {
        if (e.includes(item.value)) {
          if (item["child"]["enquiry_enroll_level"]) {
            item["child"]["enquiry_enroll_level"].map((level) => {
              if (enrollLevelIds.includes(level.value)) {
                enrollLevelList.map((enrollLevel) => {
                  if (level.value == enrollLevel.value) {
                    let label = enrollLevel["label"].split(",");
                    let enLabel = enrollLevel["enLabel"].split(",");
                    if (!label.includes(level["label"])) {
                      label = [...label, ...level["label"].split(",")];
                      enrollLevel["label"] = String([...new Set(label)]);
                    }
                    if (!enLabel.includes(level["enLabel"])) {
                      enLabel = [...enLabel, ...level["enLabel"].split(",")];
                      enrollLevel["enLabel"] = String([...new Set(enLabel)]);
                    }
                  }
                });
              } else {
                enrollLevelIds.push(level.value);
                enrollLevelList.push(level);
              }
            });
          }
          if (item["child"]["enquiry_direction"]) {
            item["child"]["enquiry_direction"].map((direction) => {
              if (directionsIds.includes(direction.value)) {
                // console.log("directionsList", directionsList);
                directionsList.map((d) => {
                  if (direction.value == d.value) {
                    let label = d["label"].split(",");
                    let enLabel = d["enLabel"].split(",");
                    if (!label.includes(direction["label"])) {
                      label = [...label, ...direction["label"].split(",")];
                      d["label"] = String([...new Set(label)]);
                    }
                    if (!enLabel.includes(direction["enLabel"])) {
                      enLabel = [...enLabel, ...direction["enLabel"].split(",")];
                      d["enLabel"] = String([...new Set(enLabel)]);
                    }
                  }
                });
              } else {
                directionsIds.push(direction.value);
                directionsList.push(direction);
              }
            });
          }
        }
      });
      this.enrollLevelList = enrollLevelList;
      this.directionsList = directionsList;
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
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 10px !important;
  box-sizing: border-box;
}
.modalFromBtn {
  text-align: center;
}
</style>
