<template>
  <el-drawer
    :title="drawerTitle"
    :visible.sync="showDialog"
    size="960px"
    :before-close="closeModal"
    :wrapper-closable="false"
    class="drawer-body bus-exception-drawer"
  >
    <div class="drawer-content" v-if="showDialog" v-loading="detailLoading">
      <el-form
        class="drawer-form"
        :label-position="'top'"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <div class="df_center_wrap">
            <el-form-item
              v-if="schoolSelectList.length > 1"
              :label="$t('schoolbus.校区')"
              prop="school"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                multiple
                collapse-tags
                v-model="ruleForm['school']"
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
              :label="$t('schoolbus.学期')"
              prop="sectionId"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.sectionId"
                :placeholder="$t('common.请选择')"
                @change="changeSection"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in sectionList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('schoolbus.路线')" prop="lineId" style="width: 33.3%">
              <el-select
                style="width: 100%"
                v-model="ruleForm.lineId"
                :placeholder="$t('common.请选择')"
                @change="changeLine"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in lineList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('schoolbus.站点')"
              prop="stationId"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.stationId"
                :placeholder="$t('common.请选择')"
                clearable
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in stationList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('schoolbus.时间类型')"
              prop="schoolTimeType"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.schoolTimeType"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in stationTimeTypeOptions"
                  :label="$t('schoolbus.' + i.label)"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('schoolbus.车牌号')"
              prop="carId"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.carId"
                :placeholder="$t('common.请选择')"
                @change="changeCar"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in carList"
                  :label="i.carNumber"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('schoolbus.司机')" prop="driver" style="width: 33.3%">
              <el-input
                disabled
                style="width: 100%"
                v-model="ruleForm.driver"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('schoolbus.跟车老师')"
              prop="carTeacher"
              style="width: 33.3%"
            >
              <el-input
                disabled
                style="width: 100%"
                v-model="ruleForm.carTeacher"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('schoolbus.异常日期')"
              prop="exceptionDate"
              style="width: 33.3%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.exceptionDate"
                type="date"
                :placeholder="$t('common.请选择')"
                value-format="yyyy-MM-dd hh:mm:ss"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('schoolbus.异常类型')"
              prop="exceptionType"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['exceptionType']"
                :placeholder="$t('common.请选择')"
                @change="changeExceptionType"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in exceptionTypeOptions"
                  :label="$t('schoolbus.' + i.label)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.exceptionType == '1'"
              :label="$t('schoolbus.是否调度')"
              prop="needDispatch"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm['needDispatch']"
                :placeholder="$t('common.请选择')"
                @change="changeNeedDispatch"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in yesOrNoOptions"
                  :label="i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.needDispatch == 1"
              :label="$t('schoolbus.车牌号')"
              prop="dispatchCarId"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.dispatchCarId"
                :placeholder="$t('common.请选择')"
                @change="changeDispatchCar"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in dispatchCarList"
                  :label="i.carNumber"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.needDispatch == 1"
              :label="$t('schoolbus.调度司机')"
              prop="dispatchDriver"
              style="width: 33.3%"
            >
              <el-input
                disabled
                style="width: 100%"
                v-model="ruleForm.dispatchDriver"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('schoolbus.详情')" prop="details" style="width: 96%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.details"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
          </div>
      </el-form>
      <div class="drawer-footer" v-if="modalType !== 'look'">
        <el-button @click="closeModal">{{ $t("btn.取消") }}</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submitForm('ruleForm')">
          {{ $t("schoolbus.确认") }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getLineList,
  getCarinfoList,
  getStationList,
} from "@/api/isacommunity/buscommon.js";
import {
  addExcept,
  editExcept,
  getExceptDetail,
} from "@/api/isacommunity/busexception.js";
import {
  BUS_STATION_TIME_TYPE,
  BUS_EXCEPTION_TYPE,
  BUS_YES_OR_NO,
} from "../../../schoolbusConsts.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "form",
  mixins: [schoolListBuscommonMixin],
  props: {},
  data() {
    let that = this;
    return {
      stationTimeTypeOptions: BUS_STATION_TIME_TYPE,
      exceptionTypeOptions: BUS_EXCEPTION_TYPE,
      yesOrNoOptions: BUS_YES_OR_NO,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showDialog: false,
      detailLoading: false,
      isSubmitting: false,
      ruleForm: {},
      rules: {
        school: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        sectionId: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        lineId: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        stationId: [
          { required: false, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        schoolTimeType: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        carId: [{ required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" }],
        exceptionDate: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        needDispatch: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        exceptionType: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
        dispatchCarId: [
          { required: false, message: that.$t("schoolbus.请选择"), trigger: "blur" },
        ],
      },
      sectionList: [],
      lineList: [],
      stationList: [],
      carList: [],
      dispatchCarList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    drawerTitle() {
      const key = this.typeObj[this.modalType] || "新增";
      return this.$t('schoolbus')[key];
    },
  },
  methods: {
    // 打开
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showDialog = true;
      this.detailLoading = type !== "add";
      try {
        if (type != "add") {
          await this.getDetail(item["id"]);
        } else if (this.schoolSelectList.length === 1) {
          const schoolId = this.schoolSelectList[0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolId: schoolId,
            schoolTimeType: "2",
          };
          this.changeSchool(schoolId);
        } else {
          this.ruleForm = {
            ...this.ruleForm,
            schoolTimeType: "2",
          };
        }
      } finally {
        this.detailLoading = false;
      }
    },
    // 新增
    addData(data) {
      this.isSubmitting = true;
      addExcept(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    // 编辑
    editData(data) {
      this.isSubmitting = true;
      editExcept(data)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolbus.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    getDetail(id) {
      return getExceptDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            sectionId,
            lineId,
            stationId,
            schoolTimeType,
            carId,
            exceptionDate,
            needDispatch,
            exceptionType,
            dispatchCarId,
            details,
          } = res.data.data;
          this.sectionList = await getSectionList({ schoolIds: schoolIds });
          this.lineList = await getLineList({
            schoolIds: schoolIds,
            sectionId: sectionId,
          });
          this.stationList = await getStationList({ lineId: lineId });
          //   this.carList = await getCarinfoList({ isAll: 1, lineId: lineId });
          this.lineList.map((item) => {
            if (item.id == lineId) {
              this.carList = item.carList;
            }
          });

          this.dispatchCarList = await getCarinfoList({ isAll: 0, schoolIds: schoolIds });
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              school: schoolIds,
              sectionId,
              lineId,
              stationId,
              schoolTimeType: String(schoolTimeType),
              carId,
              exceptionDate,
              needDispatch,
              exceptionType: String(exceptionType),
              dispatchCarId,
              details,
            };
            this.changeNeedDispatch(needDispatch);

            this.carList.map((item) => {
              if (carId == item.id) {
                this.ruleForm = {
                  ...this.ruleForm,
                  carTeacher: item.carTeacher,
                  driver: item.driverInfo["name"],
                };
              }
            });
            this.dispatchCarList.map((item) => {
              if (dispatchCarId == item.id) {
                this.ruleForm = {
                  ...this.ruleForm,
                  dispatchDriver: item.driverInfo["name"],
                };
              }
            });
          });
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.ruleForm,
          };
          delete data.carTeacher;
          delete data.driver;
          delete data.dispatchDriver;

          if (this.modalType == "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        }
      });
    },
    async changeSchool(e) {
      delete this.ruleForm["sectionId"];
      delete this.ruleForm["lineId"];
      delete this.ruleForm["carId"];
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      delete this.ruleForm["dispatchCarId"];
      delete this.ruleForm["dispatchDriver"];
      this.sectionList = [];
      this.lineList = [];
      this.dispatchCarList = [];
      this.sectionList = await getSectionList({ schoolIds: e });
      this.dispatchCarList = await getCarinfoList({ isAll: 0, schoolIds: e });
    },
    async changeSection(e) {
      delete this.ruleForm["lineId"];
      delete this.ruleForm["carId"];
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      delete this.ruleForm["dispatchCarId"];
      delete this.ruleForm["dispatchDriver"];
      this.lineList = [];
      this.lineList = await getLineList({
        schoolIds: this.ruleForm["schoolId"],
        sectionId: e,
      });
    },
    async changeLine(e) {
      delete this.ruleForm["carId"];
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      delete this.ruleForm["dispatchCarId"];
      delete this.ruleForm["dispatchDriver"];
      delete this.ruleForm["stationId"];
      this.stationList = await getStationList({ lineId: e });
      //   this.carList = await getCarinfoList({ isAll: 1, lineId: e });
      this.lineList.map((item) => {
        if (item.id == e) {
          this.carList = item.carList;
          if (this.carList.length == 1) {
            this.ruleForm = {
              ...this.ruleForm,
              carId: this.carList[0].id,
              carTeacher: this.carList[0].carTeacher,
              driver: this.carList[0].driverInfo["name"],
            };
          }
        }
      });
    },
    async changeCar(e) {
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      this.carList.map((item) => {
        if (e == item.id) {
          this.ruleForm = {
            ...this.ruleForm,
            carTeacher: item.carTeacher,
            driver: item.driverInfo["name"],
          };
        }
      });
    },
    async changeExceptionType(e) {
      if (e == "0") {
        this.changeNeedDispatch(0);
      }
      this.$set(this.rules["stationId"], 0, {
        ...this.rules["stationId"][0],
        required: e == "0",
      });
    },
    async changeDispatchCar(e) {
      delete this.ruleForm["dispatchDriver"];
      this.dispatchCarList.map((item) => {
        if (e == item.id) {
          this.ruleForm = {
            ...this.ruleForm,
            dispatchDriver: item.driverInfo["name"],
          };
        }
      });
    },
    changeNeedDispatch(e) {
      if (!e) {
        delete this.ruleForm["dispatchCarId"];
        delete this.ruleForm["dispatchDriver"];
      }
      this.$set(this.rules["dispatchCarId"], 0, {
        ...this.rules["dispatchCarId"][0],
        required: e == 1,
      });
    },
    // 关闭
    closeModal() {
      this.sectionList = [];
      this.lineList = [];
      this.carList = [];
      this.stationList = [];
      this.ruleForm = {};
      this.showDialog = false;
      this.$refs.ruleForm.resetFields();
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
