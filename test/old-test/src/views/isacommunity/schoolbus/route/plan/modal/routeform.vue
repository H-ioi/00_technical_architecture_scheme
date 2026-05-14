<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="schoolIds"
              style="width: 33%"
              v-if="schoolSelectList.length > 1"
            >
              <el-select
                multiple
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                @change="changeSchool"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolSelectList"
                  :label="schoolDropdownLabel(i)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.学期')"
              prop="sectionId"
              style="width: 33%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['sectionId']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in selectSectionList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.中文名')" prop="cnName" style="width: 33%">
              <el-input
                v-model="ruleForm.cnName"
                :placeholder="$t('common.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('isagroup.英文名')" prop="enName" style="width: 33%">
              <el-input
                v-model="ruleForm.enName"
                :placeholder="$t('common.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.路线类型')"
              prop="lineType"
              style="width: 33%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['lineType']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['routeType']"
                  :label="$t('isagroup')[i.label]"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.车牌号')"
              prop="carIdList"
              style="width: 33%"
            >
              <el-select
                multiple
                collapse-tags
                filterable
                style="width: 100%"
                v-model="ruleForm['carIdList']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in carList"
                  :label="i.carNumber"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('isagroup.状态')" prop="visible" style="width: 100%">
              <el-radio-group style="width: 100%" v-model="ruleForm.visible">
                <el-radio
                  :label="i.value"
                  :key="k"
                  v-for="(i, k) in consts['visibleType']"
                  >{{ $t("isagroup")[i.label] }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <div
              style="width: 100%; margin-top: 15px"
              v-for="(item, index) in weekDays"
              :key="index"
            >
              <div class="df_sb" style="width: 100%">
                <div class="df_start_center" style="width: 50%">
                  <el-form-item :label="$t('isagroup.路线日期')" style="width: 46%">
                    <el-select
                      style="width: 100%"
                      v-model="item['weekDays']"
                      :placeholder="$t('common.请选择')"
                      multiple
                    >
                      <el-option
                        :key="k"
                        v-for="(i, k) in consts['WeeklyDays']"
                        :label="i.label"
                        :value="i.value"
                        :disabled="isOptionDisabled(i.value, index)"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <el-button
                      v-if="canAdd"
                      class="button_text"
                      size="small"
                      type="text"
                      icon="el-icon-plus"
                      @click="addWeekDays"
                      >{{ $t("isagroup.增加") }}</el-button
                    >
                    <el-button
                      v-if="weekDays.length > 1"
                      class="button_text"
                      size="small"
                      type="text"
                      icon="el-icon-minus"
                      @click="delWeekDays(item, index)"
                      >{{ $t("isagroup.减少") }}</el-button
                    >
                  </div>
                </div>
                <div>
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addStation(item, index)"
                    >{{ $t("isagroup.新增站点") }}</el-button
                  >
                </div>
              </div>
              <div style="width: 100%">
                <el-table
                  :header-cell-style="tablestyle.headercellstyle"
                  :data="item['stationPrices']"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="(i, k) in tabletitle['bindStationTable']"
                    :key="k"
                    :prop="i['prop']"
                    :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
                    show-overflow-tooltip
                    :width="`${i['width']}`"
                    :fixed="i['fixed']"
                  >
                  </el-table-column>
                  <el-table-column fixed="right" :label="$t('common.操作')" width="100">
                    <template slot-scope="scope">
                      <span class="df_sb">
                        <el-button
                          class="button_text"
                          type="text"
                          size="small"
                          @click="editCurrentStation(scope.row, scope.$index, index)"
                          >{{ $t("isagroup.编辑") }}</el-button
                        >
                        <el-button
                          class="button_text"
                          type="text"
                          size="small"
                          @click="delCurrentStation(scope.row, scope.$index, index)"
                          >{{ $t("isagroup.删除") }}</el-button
                        >
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="large" @click="submitForm('ruleForm')">{{
              $t("consult.保存")
            }}</el-button>
            <el-button type="default" size="large" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 新增站点弹窗 -->
      <el-dialog
        style="z-index: 99999"
        :title="$t('isagroup')[typeObj[stationModalType]]"
        :visible.sync="showAddStationModal"
        width="350px"
        :before-close="closeAddStationModal"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :modal="false"
      >
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="addStationForm"
          :rules="addStationRules"
          :modal="false"
          ref="addStationForm"
        >
          <div class="moadlFromBox">
            <el-form-item
              style="width: 100%"
              :label="$t('isagroup.站点')"
              prop="stationId"
            >
              <el-select
                filterable
                style="width: 100%"
                v-model="addStationForm.stationId"
                :placeholder="$t('common.请选择')"
                @change="changeStation"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in selectStationList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="timepicker"
              style="width: 100%"
              :label="$t('isagroup.上学上车时间')"
              prop="goTime"
            >
              <el-time-picker
                class="timepicker"
                style="width: 100%"
                v-model="addStationForm.goTime"
                format="HH:mm"
                value-format="HH:mm:ss"
                :placeholder="$t('common.请选择')"
              ></el-time-picker>
            </el-form-item>
            <el-form-item
              class="timepicker"
              style="width: 100%"
              :label="$t('isagroup.放学下车时间')"
              prop="backTime"
            >
              <el-time-picker
                style="width: 100%"
                v-model="addStationForm.backTime"
                format="HH:mm"
                value-format="HH:mm:ss"
                :placeholder="$t('common.请选择')"
              ></el-time-picker>
            </el-form-item>
            <el-form-item style="width: 100%" :label="$t('isagroup.日价格')" prop="price">
              <el-input-number
                style="width: 100%"
                v-model="addStationForm.price"
                :precision="2"
                :step="0.1"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              style="width: 100%"
              :label="$t('isagroup.周价格')"
              prop="weekPrice"
            >
              <el-input-number
                style="width: 100%"
                v-model="addStationForm.weekPrice"
                :precision="2"
                :step="0.1"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item class="modalFromBtn">
              <el-button type="default" size="small" @click="closeAddStationModal">{{
                $t("consult.取消")
              }}</el-button>
              <el-button size="small" type="primary" @click="submitAddStationForm">
                {{ $t("consult.保存") }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getStationList,
  getCarinfoList,
} from "@/api/isacommunity/buscommon.js";
import { addRoute, editRoute, getRouteDetail } from "@/api/isacommunity/route.js";
import consts from "@/const/isacommunity/consts.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import _ from "lodash";
// 引入 dayjs
import dayjs from "dayjs";
import moment from "moment";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "operation",
  mixins: [schoolListBuscommonMixin],
  components: {
    uploadFile,
  },
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      tabletitle: tabletitle,
      tablestyle: {
        headercellstyle: {
          background: "#F5F8FD",
          color: "#333333 !important",
          "font-size": "14px",
          "font-weight": "400",
          height: "38px",
          "font-family": "AlibabaPuHuiTiM",
        },
        rowstyle: {
          color: " #666666",
          "font-size": "14px",
          "font-weight": "400",
          height: "44px",
          padding: "0px",
        },
      },
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        sectionId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        lineType: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        carIdList: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        visible: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
      sectionList: [],
      stationList: [],
      selectSectionList: [],
      selectStationList: [],
      carList: [],
      weekDays: [{ weekDays: [], stationPrices: [] }],
      canAdd: true, // 初始值设为 true
      // 新增站点弹窗相关数据
      showAddStationModal: false,
      addStationForm: {},
      addStationRules: {
        stationId: [{ required: true, message: "请选择", trigger: "blur" }],
        goTime: [{ required: false, message: "请选择", trigger: "blur" }],
        backTime: [{ required: false, message: "请选择", trigger: "blur" }],
        price: [{ required: true, message: "请输入", trigger: "blur" }],
        weekPrice: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      stationModalType: "add",
      currentWeekDayIndex: -1, // 记录当前操作的 weekDays 索引
      currentStationIndex: -1,
      carImageUrl: "",
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  watch: {
    weekDays: {
      handler(newVal) {
        this.checkAllDaysSelected(newVal);
      },
      deep: true, // 深度监听 weekDays 数组内对象的变化
    },
  },
  methods: {
    // 打开
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showModal = true;
      if (this.modalType != "add") {
        this.getDetail(item.id);
      } else {
        if (this.schoolSelectList.length === 1) {
          let schoolId = this.schoolSelectList[0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolIds: [schoolId],
          };
          this.selectSectionList = await getSectionList({ schoolIds: [schoolId] });
          this.selectStationList = await getStationList({ schoolIds: [schoolId] });
          this.carList = await getCarinfoList({ schoolIds: [schoolId], isAll: 0 });
        }
      }
    },
    // 新增
    addData(data) {
      addRoute(data).then((res) => {
        this.$message.success(this.$t("isagroup.成功"));
        this.$emit("getList");
        this.closeModal();
      });
    },
    // 编辑
    editData(data) {
      editRoute(data).then((res) => {
        this.$message.success(this.$t("isagroup.成功"));
        this.$emit("getList");
        this.closeModal();
      });
    },
    // 获取详情
    getDetail(id) {
      getRouteDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            sectionId,
            cnName,
            enName,
            lineType,
            visible,
            carIdList,
            weekDays,
          } = res.data.data;
          let carIds = carIdList ? carIdList : [];
          this.selectSectionList = await getSectionList({ schoolIds: schoolIds });
          this.selectStationList = await getStationList({ schoolIds: schoolIds });
          this.carList = await getCarinfoList({
            schoolIds: schoolIds,
            isAll: 0,
            carId: carIds,
          });

          this.$nextTick(() => {
            this.ruleForm = {
              lineId: id,
              schoolIds: schoolIds,
              sectionId: sectionId,
              cnName: cnName,
              enName: enName,
              lineType: String(lineType),
              visible: visible,
              carIdList: carIds,
            };

            this.weekDays = weekDays ? _.cloneDeep(weekDays) : this.weekDays;
            this.weekDays.forEach((item) => {
              delete item["lineId"];
              item["weekDays"] = item["weekDays"].split(",");
              if (item.stationPrices) {
                item.stationPrices = item.stationPrices.map((i) => {
                  return {
                    id: i["id"],
                    stationId: i["stationId"],
                    goTime: i["goTime"],
                    backTime: i["backTime"],
                    showGoTime: i["goTime"] ? i["goTime"].slice(0, 5) : "",
                    showBackTime: i["backTime"] ? i["backTime"].slice(0, 5) : "",
                    price: i["price"],
                    weekPrice: i["weekPrice"],
                    stationName:
                      this.i18nlocel == "en"
                        ? i["busStationDTO"]["enName"]
                        : i["busStationDTO"]["cnName"],
                  };
                });
              } else {
                item.stationPrices = [];
              }
            });
            console.log("getRouteDetail", this.weekDays);
          });
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let pass = valid;
        if (pass) {
          let isAllWeekDaysEmpty = this.isAllWeekDaysEmpty();
          pass = !isAllWeekDaysEmpty;
          if (isAllWeekDaysEmpty) {
            this.$message.error(this.$t("isagroup.请选择路线日期并添加站点"));
          }
        }
        if (pass) {
          let data = {
            schoolIds: this.ruleForm.schoolIds,
            sectionId: this.ruleForm.sectionId,
            cnName: this.ruleForm.cnName,
            enName: this.ruleForm.enName,
            lineType: this.ruleForm.lineType,
            visible: this.ruleForm.visible,
            carIdList: this.ruleForm.carIdList,
            weekDays: _.cloneDeep(this.weekDays),
          };

          data.weekDays.forEach((item) => {
            item["weekDays"] = String(item["weekDays"]);
            item.stationPrices.forEach((i) => {
              delete i["stationName"];
              delete i["showGoTime"];
              delete i["showBackTime"];
            });
          });
          console.log("submit!", data);
          if (this.modalType === "add") {
            this.addData(data);
          } else {
            data["id"] = this.ruleForm.lineId;
            this.editData(data);
          }
        }
      });
    },
    isAllWeekDaysEmpty() {
      let hasEmpty = false;
      this.weekDays.map((item) => {
        if (!hasEmpty && (item.weekDays.length == 0 || item.stationPrices.length == 0)) {
          hasEmpty = true;
        }
      });
      return hasEmpty;
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.weekDays = _.cloneDeep([{ weekDays: [], stationPrices: [] }]);
      this.$refs.ruleForm.resetFields();
      this.addStationForm = {};
    },
    // 新增路线
    addWeekDays() {
      this.weekDays.push({ weekDays: [], stationPrices: [] });
    },
    // 减少路线
    delWeekDays(item, index) {
      this.weekDays = this.weekDays.filter((_, i) => i !== index);
    },
    resetWeekDays() {
      this.weekDays = [{ weekDays: [], stationPrices: [] }];
    },
    // 选择校区
    async changeSchool(e) {
      this.ruleForm["schoolIds"] = e;
      this.resetWeekDays();
      delete this.ruleForm["sectionId"];
      delete this.ruleForm["carIdList"];
      this.selectSectionList = await getSectionList({ schoolIds: e });
      this.selectStationList = await getStationList({ schoolIds: e });
      this.carList = await getCarinfoList({ schoolIds: e, isAll: 0 });
    },
    // 检查选项是否应该被禁用
    isOptionDisabled(value, currentIndex) {
      // 遍历除当前索引外的其他 weekDays 项
      for (let i = 0; i < this.weekDays.length; i++) {
        if (i !== currentIndex && this.weekDays[i].weekDays.includes(value)) {
          return true;
        }
      }
      return false;
    },
    // 检查是否所有日期都被选择
    checkAllDaysSelected(weekDays) {
      const allDays = new Set(this.consts["WeeklyDays"].map((item) => item.value));
      const selectedDays = new Set();

      weekDays.forEach((item) => {
        item.weekDays.forEach((day) => {
          selectedDays.add(day);
        });
      });

      // 判断是否所有日期都被选择
      let allSelected = true;
      allDays.forEach((day) => {
        if (!selectedDays.has(day)) {
          allSelected = false;
        }
      });

      this.canAdd = !allSelected;
    },
    addStation(item, index) {
      this.stationModalType = "add";
      this.currentWeekDayIndex = index;
      this.showAddStationModal = true;
      this.$refs.addStationForm.resetFields();
    },
    // 编辑当前站点
    editCurrentStation(station, stationIndex, weekDayIndex) {
      console.log("editCurrentStation", station, stationIndex, weekDayIndex);
      this.stationModalType = "edit";
      this.currentWeekDayIndex = weekDayIndex;
      this.currentStationIndex = stationIndex;
      this.showAddStationModal = true;
      // 回显数据
      this.addStationForm = { ...station };
    },
    // 删除当前站点
    delCurrentStation(station, stationIndex, weekDayIndex) {
      this.$alert(this.$t("isagroup.确定要删除吗？"), this.$t("isagroup.删除"), {
        confirmButtonText: this.$t("isagroup.确定"),
      }).then(() => {
        this.weekDays[weekDayIndex].stationPrices.splice(stationIndex, 1);
      });
    },
    closeAddStationModal() {
      this.currentWeekDayIndex = -1;
      this.showAddStationModal = false;
      this.addStationForm = {};
      this.$refs.addStationForm.resetFields();
    },
    changeStation(e) {
      this.selectStationList.map((i) => {
        if (i.id == e) {
          this.addStationForm = {
            ...this.addStationForm,
            stationName: this.i18nlocel == "en" ? i.enName : i.cnName,
          };
        }
      });
    },
    // 提交新增/编辑站点表单
    submitAddStationForm() {
      this.$refs.addStationForm.validate((valid) => {
        let isPass = valid;
        if (valid) {
          let hasTime =
            !this.addStationForm["goTime"] && !this.addStationForm["backTime"];
          if (hasTime) {
            isPass = false;
            this.$message.warning(this.$t("isagroup.请选择上学/放学时间"));
          }
        }
        if (isPass) {
          if (this.currentWeekDayIndex !== -1) {
            const newStation = {
              ...this.addStationForm,
              showGoTime: this.addStationForm["goTime"]
                ? this.addStationForm["goTime"].slice(0, 5)
                : "",
              showBackTime: this.addStationForm["backTime"]
                ? this.addStationForm["backTime"].slice(0, 5)
                : "",
            };
            const stationPrices = this.weekDays[this.currentWeekDayIndex].stationPrices;
            if (this.currentStationIndex !== -1) {
              // 使用 this.$set 更新现有站点数据
              this.$set(stationPrices, this.currentStationIndex, newStation);
              // 重置编辑索引
              this.currentStationIndex = -1;
            } else {
              // 新增站点数据
              stationPrices.push(newStation);
            }
          }
          this.closeAddStationModal();
        }
      });
    },
    handleUploadSuccess(data) {
      console.log("文件上传成功", data);
      this.carImageUrl = data;
    },
    handleUploadError(error) {
      console.error("文件上传失败", error);
    },
    async getSelectList() {
      this.selectSectionList = await getSectionList({ schoolIds: schoolIds });
      this.selectStationList = await getStationList({ schoolIds: schoolIds });
      this.carList = await getCarinfoList({ schoolIds: schoolIds, isAll: 0 });
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
</style>
