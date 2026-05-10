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
              prop="school"
              style="width: 33.3%"
              v-if="dictionary['school'].length > 1"
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
                  v-for="(i, k) in dictionary['school']"
                  :label="i.enName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.学期')"
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
            <el-form-item :label="$t('isagroup.路线')" prop="lineId" style="width: 33.3%">
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
              :label="$t('isagroup.站点')"
              prop="stationId"
              style="width: 33.3%"
            >
              <el-select
                style="width: 100%"
                v-model="ruleForm.stationId"
                :placeholder="$t('common.请选择')"
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
              :label="$t('isagroup.时间类型')"
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
                  v-for="(i, k) in consts['stationTimeType']"
                  :label="$t('isagroup.' + i.label)"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.车牌号')"
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
            <el-form-item :label="$t('isagroup.司机')" prop="driver" style="width: 33.3%">
              <el-input
                disabled
                style="width: 100%"
                v-model="ruleForm.driver"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.跟车老师')"
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
              :label="$t('isagroup.座位数')"
              prop="seatNumber"
              style="width: 33.3%"
            >
              <el-input
                disabled
                style="width: 100%"
                v-model="ruleForm.seatNumber"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('isagroup.乘车日期')"
              prop="rideDate"
              style="width: 33.3%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.rideDate"
                type="date"
                :placeholder="$t('common.请选择')"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.到达时间')"
              prop="arrivalTime"
              style="width: 33.3%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.arrivalTime"
                type="datetime"
                :placeholder="$t('common.请选择')"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item :label="$t('isagroup.状态')" prop="status" style="width: 33.3%">
              <el-select
                style="width: 100%"
                v-model="ruleForm['status']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['operationStatus']"
                  :label="$t('isagroup.' + i.label)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item :label="$t('isagroup.备注')" prop="remark" style="width: 96%">
              <el-input
                style="width: 100%"
                v-model="ruleForm.remark"
                :placeholder="$t('consult.请输入')"
                maxlength="500"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("isagroup.确认")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSectionList,
  getLineList,
  getStationList,
} from "@/api/isacommunity/buscommon.js";
import {
  addOperation,
  editOperation,
  getOperationDetail,
} from "@/api/isacommunity/busoperation.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "form",
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        school: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        sectionId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        lineId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        stationId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        schoolTimeType: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        carId: [{ required: true, message: that.$t("isagroup.请选择"), trigger: "blur" }],
        rideDate: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        arrivalTime: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        // status: [
        //   { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        // ],
      },
      sectionList: [],
      lineList: [],
      stationList: [],
      carList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    // 打开
    async showForm(type = "add", item = {}) {
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      } else {
        if (this.dictionary["school"].length == 1) {
          let schoolId = this.dictionary["school"][0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolId: schoolId,
          };
          this.changeSchool(schoolId);
        }
      }
    },
    // 新增
    addData(data) {
      addOperation(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editOperation(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getOperationDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            sectionId,
            lineId,
            stationId,
            carId,
            rideDate,
            arrivalTime,
            status,
            remark,
            schoolTimeType,
          } = res.data.data;
          this.sectionList = await getSectionList({ schoolIds: schoolIds });
          this.lineList = await getLineList({
            schoolIds: schoolIds,
            sectionId: sectionId,
          });
          this.stationList = await getStationList({ lineId: lineId });
          this.lineList.map((item) => {
            if (lineId == item.id) {
              this.carList = item.carList;
            }
          });
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              school: schoolIds,
              sectionId,
              lineId,
              stationId,
              carId,
              rideDate,
              arrivalTime,
              status: String(status),
              schoolTimeType: String(schoolTimeType),
              remark,
            };
            console.log(" this.carList", this.carList);

            this.carList.map((item) => {
              if (carId == item.id) {
                console.log("11item", item);
                this.ruleForm = {
                  ...this.ruleForm,
                  carTeacher: item.carTeacher,
                  driver: item.driverInfo["name"],
                  seatNumber: item.seatNumber,
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
            status: "3",
          };
          delete data.carTeacher;
          delete data.driver;
          delete data.seatNumber;

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
      delete this.ruleForm["stationId"];
      delete this.ruleForm["carId"];
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      this.sectionList = [];
      this.lineList = [];
      this.stationList = [];
      this.sectionList = await getSectionList({ schoolIds: e });
    },
    async changeSection(e) {
      delete this.ruleForm["lineId"];
      delete this.ruleForm["stationId"];
      delete this.ruleForm["carId"];
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      this.lineList = [];
      this.stationList = [];
      this.lineList = await getLineList({
        schoolIds: this.ruleForm["schoolId"],
        sectionId: e,
      });
    },
    async changeLine(e) {
      delete this.ruleForm["stationId"];
      delete this.ruleForm["carId"];
      delete this.ruleForm["carTeacher"];
      delete this.ruleForm["driver"];
      this.stationList = [];
      this.stationList = await getStationList({ lineId: e });
      if (e && this.lineList.length > 0) {
        this.lineList.map((item) => {
          if (e == item.id) {
            this.carList = item.carList;
            if (this.carList.length == 1) {
              this.ruleForm = {
                ...this.ruleForm,
                carId: this.carList[0].id,
                carTeacher: this.carList[0].carTeacher,
                driver: this.carList[0].driverInfo["name"],
                seatNumber: this.carList[0].seatNumber,
              };
            }
          }
        });
      }
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
            seatNumber: item.seatNumber,
          };
        }
      });
    },
    // 关闭
    closeModal() {
      this.sectionList = [];
      this.lineList = [];
      this.stationList = [];
      this.carList = [];
      this.ruleForm = {};
      this.showModal = false;
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
