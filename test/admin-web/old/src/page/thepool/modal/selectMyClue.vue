<template>
  <div class="thepool_page">
    <el-scrollbar style="height: 100%">
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
          :rules="searchRules"
        >
          <div class="df_w">
            <el-form-item
              v-if="currentstatus == '-1'"
              :label="$t('consult.跟进状态')"
              style="width: 214px"
            >
              <el-select
                clearable
                multiple
                v-model="pagination.followStatus"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in filterStatusList"
                  :key="item.type"
                  :label="$t('consult')[item.name]"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('consult.关键词')" style="width: 214px">
              <el-input
                v-model="searchFrom.keyword"
                clearable
                :placeholder="$t('consult.请输入')"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="pooldictpermissions.length > 1"
              :label="$t('consult.归属校区')"
              style="width: 214px"
            >
              <el-select
                clearable
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
              style="width: 214px"
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
              style="width: 214px"
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
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              style="width: 214px"
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
            <el-form-item
              v-if="followTagsList.length > 0"
              :label="$t('consult.跟进标签')"
              style="width: 214px"
            >
              <el-select
                clearable
                multiple
                v-model="searchFrom.followTags"
                :placeholder="$t('consult.请选择')"
              >
                <el-option
                  v-for="item in followTagsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="channelsList.length > 0"
              :label="$t('consult.渠道')"
              style="width: 214px"
            >
              <SelectChannle
                ref="SelectChannle"
                :options="channelsList"
                @setChannel="setChannel"
              />
            </el-form-item>
            <el-form-item :label="$t('consult.新增时间')" style="width: 214px">
              <el-date-picker
                style="width: 100%"
                v-model="searchFrom.createdTime"
                type="datetimerange"
                clearable
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd HH:mm  '"
                :format="'yyyy-MM-dd HH:mm'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('consult.更新时间')" style="width: 214px">
              <el-date-picker
                style="width: 100%"
                v-model="searchFrom.updateTime"
                type="datetimerange"
                clearable
                :range-separator="$t('consult.至')"
                :start-placeholder="$t('consult.开始')"
                :end-placeholder="$t('consult.结束')"
                :value-format="'yyyy-MM-dd HH:mm'"
                :format="'yyyy-MM-dd HH:mm'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('consult.排序方式')" style="width: 214px">
              <el-select v-model="searchFrom.orderBy" :placeholder="$t('consult.请选择')">
                <el-option
                  v-for="item in sortModeList"
                  :key="item.value"
                  :label="$t('consult')[item['label']]"
                  :value="item.value"
                ></el-option>
              </el-select>
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
                <el-button type="text" size="small" round @click="clear">
                  <div class="clear_btn">
                    <img src="/thepool/other/clear.png" alt="" />
                    <span> {{ $t("consult.清除") }}</span>
                  </div>
                </el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="tableBox">
        <Table
          ref="Table"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="[]"
          :showSelection="true"
          @rowClick="rowClick"
        />
        <div class="df_sb palyTableBox" style="padding: 0">
          <PaginationInfo :paginationTotal="paginationTotal" />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import StatusItem from "@/components/thepoolcommon/StatusItem.vue";
import SelectChannle from "@/components/common/pooldictselect/selectchannlemultiple.vue";
import { getMyClueList } from "@/api/consult/index.js";
import { consult } from "@/const/consult/index.js";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    StatusItem,
    SelectChannle,
  },
  data() {
    return {
      isMultiple: false,
      showBatchEditing: false,
      showAdmissionNotice: false,
      showAddClue: false,
      showAdd: false,
      showchangeStatus: false,
      currentClueType: "",
      currentClueId: "",
      pagination: {
        pageSize: 10,
        pageNum: 1,
        followStatus: ["0", "1"],
      },
      paginationTotal: 0,
      currentUserId: "",
      searchFrom: {
        keyword: "",
        schools: [],
        applySchools: [],
        enrollLevels: [],
        directions: [],
        createdTime: [],
        updateTime: [],
        channels: [],
        channelChildOnes: [],
        followTags: [],
        orderBy: "orderByCreateTime",
      },
      searchRules: {},
      searchData: { orderBy: "orderByCreateTime" },
      // statusList: [],
      statusList: consult["statusMineList"],
      filterStatusList: consult["filterStatusList"],
      tableTitle: consult["selectTableTitle"],
      sortModeList: consult["sortMode"],
      currentstatus: "1",
      tableData: [],
      tableBtn: [],
      spaceType: [],
      showAddAssigned: false,
      clueIds: [],
      showUpdate: false,
      showUpdateHybrid: false,
      enrollLevelList: [],
      directionsList: [],
      channelsList: [],
      followTagsList: [],
      enterStudentList: [],
      selectClueIds: [],
      selectClueItems: [],
    };
  },
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

  created() {},

  watch: {
    i18nlocel() {
      console.log("i18nlocel", this.i18nlocel);
      // this.getstatusList();
      this.getMyClueList();
    },
  },
  mounted() {},
  activated() {
    this.getMyClueList();
  },
  methods: {
    initData(clueId) {
      this.selectClueIds = clueId;
      if (this.pooldictpermissions.length > 0) {
        this.pooldictpermissions.map((item) => {
          this.searchFrom["schools"].push(item["value"]);
        });
        this.searchData["schools"] = this.searchFrom["schools"];
      }

      if (this.pooldictpermissions.length == 1) {
        let applySchoolsId = this.pooldictpermissions[0].value;
        this.searchFrom["applySchools"] = [applySchoolsId];
        this.searchData["applySchools"] = this.searchFrom["applySchools"];
        this.changeSchool(applySchoolsId);
      }
      this.getMyClueList();
    },
    getstatusList() {
      this.statusList = [];
      consult["statusMineList"].map((item) => {
        let obj = {
          ...item,
          name: this.$t("consult")[item["name"]],
        };
        this.statusList.push(obj);
      });
    },
    getMyClueList() {
      getMyClueList({
        ...this.pagination,
        ...this.searchData,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data || [];
          this.paginationTotal = Number(total);
          this.selectClueItems = [];
          this.tableData.map((item) => {
            item["status"] = item["followStatus"] != 1 ? 0 : 1;

            if (item.applySchool) {
              item["applySchoolLabel"] = this.$getListLabel(
                this.pooldictionary,
                item.applySchool
              );
              item["followTags"] = this.getDataLabel(
                item.applySchool,
                "enquiry_follow_tags",
                item.followTags
              );
              item["channellLabel"] = this.getDataLabel(
                item.applySchool,
                "enquiry_channel",
                item.channel
              );
              let channelChildOneLabel = this.getDataLabel(
                item.applySchool,
                "enquiry_channel_child_one",
                item.channelChildOne
              );
              item["channellLabel"] =
                item["channellLabel"] +
                (channelChildOneLabel == "" ? "" : "/" + channelChildOneLabel);
            } else {
              item["followTags"] = this.$getListLabel(
                this.dictionary["enquiry_follow_tags"],
                item.followTags
              );
              item["channellLabel"] = this.$getListLabel(
                this.dictionary["enquiry_channel"],
                item.channel
              );
              if (item.channelChildOne) {
                item["channellLabel"] =
                  item["channellLabel"] +
                  "/" +
                  this.$getListLabel(
                    this.dictionary["enquiry_channel_child_one"],
                    item.channelChildOne
                  );
              }
            }
            item["atSchoolLabel"] = this.setAtSchool(item);
            item["directionLabel"] = this.setDirection(item);
            item["enrollLevelLabel"] = this.setEnrollLevel(item);
            item["enrollLevelInLabel"] = this.setEnrollLevelIn(item);
          });
        }
      });
    },
    setSelectClueItems(data) {
      this.$nextTick(() => {
        let ids = data.map((item) => {
          return item.id;
        });
        this.$refs.Table.selectedIds = ids;
        this.$refs.Table.allSelectedItems = data;
        this.$refs.Table.syncSelectedRows();
      });
    },
    rowClick(row, column, event) {
      //   let data = {
      //     clueId: row.id,
      //     clueName: row["guardianTitle"] + row["contactMethod"],
      //   };
      //   this.$emit("selectClueData", data);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getMyClueList();
    },
    // 搜索
    search() {
      this.searchData = {};
      this.searchData = this.getSearchData();
      this.pagination["pageNum"] = 1;
      this.getMyClueList();
    },
    getSearchData() {
      let searchData = {};
      searchData["keyword"] = this.searchFrom["keyword"];
      searchData["orderBy"] = this.searchFrom["orderBy"];
      searchData["enrollLevels"] = this.searchFrom["enrollLevels"];
      searchData["directions"] = this.searchFrom["directions"];
      searchData["schools"] = this.searchFrom["schools"];
      searchData["applySchools"] = this.searchFrom["applySchools"];
      searchData["followTags"] = this.searchFrom["followTags"];
      searchData["channels"] = this.searchFrom["channels"];
      searchData["channelChildOnes"] = this.searchFrom["channelChildOnes"];
      if (this.searchFrom["createdTime"].length > 0) {
        searchData["createTimeBegin"] = this.searchFrom["createdTime"][0];
        searchData["createTimeEnd"] = this.searchFrom["createdTime"][1];
      }
      if (this.searchFrom["updateTime"].length > 0) {
        searchData["updateTimeBegin"] = this.searchFrom["updateTime"][0];
        searchData["updateTimeEnd"] = this.searchFrom["updateTime"][1];
      }
      return searchData;
    },
    // 清除搜索
    clear() {
      if (this.pooldictpermissions.length == 1) {
        this.searchFrom = {
          ...this.searchFrom,
          keyword: "",
          directions: [],
          enrollLevel: [],
          createdTime: [],
          updateTime: [],
          channels: [],
          channelChildOnes: [],
          creatorIds: [],
          followerIds: [],
          followTags: [],
          orderBy: "orderByCreateTime",
        };
      } else {
        this.searchFrom = {
          keyword: "",
          directions: [],
          enrollLevel: [],
          createdTime: [],
          updateTime: [],
          schools: [],
          applySchools: [],
          channels: [],
          channelChildOnes: [],
          creatorIds: [],
          followerIds: [],
          followTags: [],
          orderBy: "orderByCreateTime",
        };
        this.enrollLevelList = [];
        this.directionsList = [];
        this.followTagsList = [];
      }
      this.searchData = { orderBy: "orderByCreateTime" };
      this.pagination["pageNum"] = 1;
      if (this.currentstatus == "-1") {
        this.pagination["followStatus"] = [];
      }
      if (this.channelsList.length > 0) {
        this.channelsList = [];
        this.$refs["SelectChannle"].clear();
      } else {
        this.channelsList = [];
      }

      this.getMyClueList();
    },
    // 状态切换
    changeStasus(item, index) {
      console.log("item, index", item, index);
      this.currentstatus = item.type;
      this.pagination["pageNum"] = 1;
      if (item.type == "-1") {
        // delete this.pagination["followStatus"];
        this.pagination["followStatus"] = [];
      } else {
        if (item.type == "1") {
          this.pagination["followStatus"] = ["0", "1"];
        } else {
          this.pagination["followStatus"] = [item.type];
        }
      }
      this.getMyClueList();
    },
    changeModal(type) {
      this.showAdd = type;
      this.showchangeStatus = type;
      this.showAddAssigned = type;
      this.showUpdate = type;
      this.showAdmissionNotice = type;
      this.showBatchEditing = type;
      this.showUpdateHybrid = type;
      this.showAddClue = type;
      this.currentClueId = "";
      this.clueIds = [];
      this.enterStudentList = [];
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
    changeSchool(e) {
      // console.log("changeSchool", e);
      if (e.length == 0) {
        this.enrollLevelList = [];
        this.directionsList = [];
        this.channelsList = [];
        this.followTagsList = [];
        return;
      }
      let enrollLevelList = [];
      let directionsList = [];
      let channelsList = [];
      let followtagsList = [];
      let enrollLevelIds = [];
      let directionsIds = [];
      let channelsIds = [];
      let followtagsIds = [];
      this.enrollLevelList = [];
      this.directionsList = [];
      this.channelsList = [];
      this.followTagsList = [];
      console.log("this.pooldictpermissions", this.pooldictpermissions);
      let pooldictpermissions = _.cloneDeep(this.pooldictpermissions);
      pooldictpermissions.map((item) => {
        if (e.includes(item.value)) {
          if (item["child"]["enquiry_enroll_level"]) {
            item["child"]["enquiry_enroll_level"].map((level) => {
              if (enrollLevelIds.includes(level.value)) {
                // console.log("enrollLevelList", enrollLevelList);
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
          if (item["child"]["enquiry_channel"]) {
            channelsList.push({
              ...item,
              child: item["child"]["enquiry_channel"],
            });
          }
          if (item["child"]["enquiry_follow_tags"]) {
            item["child"]["enquiry_follow_tags"].map((tags) => {
              if (followtagsIds.includes(tags.value)) {
                followtagsList.map((d) => {
                  if (tags.value == d.value) {
                    let label = d["label"].split(",");
                    let enLabel = d["enLabel"].split(",");
                    if (!label.includes(tags["label"])) {
                      label = [...label, ...tags["label"].split(",")];
                      d["label"] = String([...new Set(label)]);
                    }
                    if (!enLabel.includes(tags["enLabel"])) {
                      enLabel = [...enLabel, ...tags["enLabel"].split(",")];
                      d["enLabel"] = String([...new Set(enLabel)]);
                    }
                  }
                });
              } else {
                followtagsIds.push(tags.value);
                followtagsList.push(tags);
              }
            });
          }
        }
      });
      console.log("enrollLevelList", enrollLevelList);
      this.enrollLevelList = enrollLevelList;
      this.directionsList = directionsList;
      this.channelsList = channelsList;
      this.followTagsList = followtagsList;
    },
    setChannel(data) {
      this.searchFrom["channels"] = [];
      this.searchFrom["channelChildOnes"] = [];
      let channels = [];
      let channelChildOnes = [];
      data.map((item) => {
        switch (item.length) {
          // case 0:
          //   break;
          // case 1:
          //   break;
          case 2:
            channels.push(item[1]);
            break;
          case 3:
            // this.searchFrom["channels"].push(data[1]);
            channelChildOnes.push(item[2]);
            break;
        }
      });
      this.searchFrom["channels"] = [...new Set(channels)];
      this.searchFrom["channelChildOnes"] = [...new Set(channelChildOnes)];
      console.log("this.searchFrom", this.searchFrom);
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
            str = this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevel
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
            str = this.$getListLabel(
              this.dictionary["enquiry_enroll_level"],
              item.enrollLevelIn
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
            str = this.$getListLabel(this.dictionary["enquiry_channel"], item.direction);
          }

          if (str != "") {
            direction.push(str);
          }
        });
      }
      return String(direction);
    },
    getSelectClue() {
      let allSelectedItems = this.$refs["Table"].allSelectedItems;
      //   let selectionId = this.$refs["Table"].selectionId;
      //   let clueList = this.tableData.filter((item) => selectionId.includes(item.id));
      return allSelectedItems;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
