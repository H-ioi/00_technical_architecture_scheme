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
              :label="$t('isagroup.异常日期')"
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
              :label="$t('isagroup.异常类型')"
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
                  v-for="(i, k) in consts['exceptionType']"
                  :label="$t('isagroup.' + i.label)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.exceptionType == '1'"
              :label="$t('isagroup.是否调度')"
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
                  v-for="(i, k) in consts['isOrNo']"
                  :label="i.label"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.needDispatch == 1"
              :label="$t('isagroup.车牌号')"
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
              :label="$t('isagroup.调度司机')"
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
            <el-form-item :label="$t('isagroup.详情')" prop="details" style="width: 96%">
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
  getCarinfoList,
} from "@/api/isacommunity/buscommon.js";
import {
  addExcept,
  editExcept,
  getExceptDetail,
} from "@/api/isacommunity/busexception.js";
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
        carId: [{ required: true, message: that.$t("isagroup.请选择"), trigger: "blur" }],
        exceptionDate: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        needDispatch: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        exceptionType: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        dispatchCarId: [
          { required: false, message: that.$t("isagroup.请选择"), trigger: "blur" },
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
      addExcept(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editExcept(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getExceptDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            sectionId,
            lineId,
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
