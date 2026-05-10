<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.批量编辑')"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.校区')"
              prop="applySchool"
              style="width: 25%"
            >
              <el-select
                style="width: 100%"
                clearable
                v-model="ruleForm.applySchool"
                :placeholder="$t('consult.请选择')"
                @change="changeSchool"
                @clear="clearSchool"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="enrollLevelList.length > 0"
              :label="$t('consult.申请年级')"
              prop="enrollLevel"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.enrollLevel"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in enrollLevelList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="directionsList.length > 0"
              :label="$t('consult.方向')"
              prop="direction"
              style="width: 25%"
            >
              <el-select
                v-model="ruleForm.direction"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeDirection"
              >
                <el-option
                  v-for="item in directionsList"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('consult.入学年份')"
              prop="enrollYear"
              style="width: 25%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.enrollYear"
                type="year"
                :placeholder="$t('consult.请选择')"
                :value-format="'yyyy'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.国籍')"
              prop="nationality"
              style="width: 25%"
            >
              <el-input
                v-model.trim="ruleForm.nationality"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('consult.语言')" prop="language" style="width: 25%">
              <el-input
                v-model.trim="ruleForm.language"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              round
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
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
import { batchEditStudent, getStudentDetail } from "@/api/consult/student.js";
import { getDictTypeRequired } from "@/api/publik";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
export default {
  name: "addStudent",
  components: {
    SelectChannle,
  },
  props: {},
  data() {
    let that = this;
    return {
      showModal: false,
      ruleForm: {
        applySchool: "", //申请校区
        direction: "", //方向
        enrollLevel: "", //在读年级
        enrollYear: "", //入学年份
        nationality: "", //国籍
        language: "", //语言
      },
      rules: {
        applySchool: [
          { required: true, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        direction: [
          { required: false, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
        enrollLevel: [
          { required: false, message: that.$t("consult.请选择"), trigger: "blur" },
        ],
      },
      enrollLevelList: [],
      directionsList: [],
      dictRequireObj: {
        direction: false,
        enrollLevel: false,
      },
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.pooldictpermissions.length == 1) {
        this.ruleForm["applySchool"] = this.pooldictpermissions[0].value;
      }
    });
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "dictpermissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  methods: {
    batchEditStudent(data) {
      batchEditStudent(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.closeModal();
          this.$emit("initData");
        }
      });
    },
    getStudentDetail(ids) {
      this.ruleForm["studentIds"] = ids;
      if (ids.length > 1) {
        this.showModal = true;
      } else {
        getStudentDetail(ids[0]).then((res) => {
          if (res.data.success) {
            let data = res.data.data;
            this.showModal = true;
            console.log("data", data);
            this.changeSchool(data["applySchool"], false);
            this.$nextTick(() => {
              Object.keys(data).forEach((item) => {
                console.log("item", item);
                if (this.ruleForm.hasOwnProperty(item)) {
                  this.ruleForm[item] =
                    data[item] == null || data[item] == undefined
                      ? ""
                      : String(data[item]);
                }
              });
              console.log(" this.ruleForm", this.ruleForm);
            });
          }
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.batchEditStudent(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.showModal = false;
      this.ruleForm = {
        applySchool: "", //申请校区
        direction: "", //方向
        enrollLevel: "", //申请年级
        enrollYear: "", //入学年份
        nationality: "", //国籍
        language: "", //语言
      };
      this.$emit("closeModal", false);
    },
    changeEnrollLevel(e) {
      this.$refs["ruleForm"].validateField("enrollLevel");
    },
    changeDirection(e) {
      this.$refs["ruleForm"].validateField("direction");
    },
    changeSchool(e, type = true) {
      console.log("changeSchool", e);
      this.pooldictpermissions.map((item) => {
        if (item.value == e) {
          // if(item["child"])
          this.enrollLevelList = item["child"]["enquiry_enroll_level"]
            ? item["child"]["enquiry_enroll_level"]
            : [];
          this.directionsList = item["child"]["enquiry_direction"]
            ? item["child"]["enquiry_direction"]
            : [];
          this.$nextTick(() => {
            this.setRequireType(item.id, type);
          });
        }
      });
    },

    async setRequireType(id, type) {
      let Obj = await getDictTypeRequired(id);
      console.log("getDictTypeRequired", Obj);
      this.dictRequireObj = Obj;
      console.log(" this.dictRequireObj", this.dictRequireObj);
      Object.keys(this.rules).forEach((res) => {
        if (Obj[res]) {
          if (type) {
            this.ruleForm = {
              ...this.ruleForm,
              enrollLevel: "",
              direction: "",
            };
          }
          this.$set(this.rules[res], 0, {
            ...this.rules[res][0],
            required: Obj[res] == "true",
          });
          console.log("this.rules", this.rules);
        }
      });
    },
    clearSchool() {
      this.enrollLevelList = [];
      this.directionsList = [];
      this.ruleForm = {
        ...this.ruleForm,
        enrollLevel: "",
        direction: "",
      };
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
