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
              style="width: 49%"
              v-if="schoolSelectList.length > 1"
            >
              <el-select
                clearable
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
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
              :label="$t('isagroup.车牌号')"
              prop="carNumber"
              style="width: 49%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.carNumber"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.跟车老师')"
              prop="carTeacher"
              style="width: 49%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.carTeacher"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.座位数')"
              prop="seatNumber"
              style="width: 49%"
            >
              <el-input-number
                style="width: 100%"
                v-model="ruleForm.seatNumber"
                :precision="0"
                :step="1"
                :min="1"
                :max="100"
                :placeholder="$t('consult.请输入')"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('isagroup.司机')" prop="driverId" style="width: 49%">
              <el-select
                style="width: 100%"
                v-model="ruleForm['driverId']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in driverList"
                  :label="i.name"
                  :value="i.id"
                  :disabled="!i.status"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('isagroup.状态')" prop="status" style="width: 49%">
              <el-select
                style="width: 100%"
                v-model="ruleForm['status']"
                :placeholder="$t('common.请选择')"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in consts['carStatus']"
                  :label="$t('isagroup.' + i.label)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.车辆照片')"
              prop="carImageUrl"
              style="width: 100%"
            >
              <upload-file
                ref="uploadFile"
                :limit="1"
                types="image/*"
                @upload-success="handleUploadSuccess"
                @upload-error="handleUploadError"
              ></upload-file>
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
import { getCarinfoDetail, addCarinfo, editCarinfo } from "@/api/isacommunity/car.js";
import { getDriverList } from "@/api/isacommunity/buscommon.js";
import consts from "@/const/isacommunity/consts.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "operation",
  mixins: [schoolListBuscommonMixin],
  components: { uploadFile },
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
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        carNumber: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        carTeacher: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        seatNumber: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        driverId: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        status: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
      },
      driverList: [],
      carImageUrl: "",
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    // 打开
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      } else {
        if (this.schoolSelectList.length === 1) {
          let schoolId = this.schoolSelectList[0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolIds: [schoolId],
          };
          this.driverList = await getDriverList({ schoolIds: [schoolId] });
        }
      }
    },
    // 新增
    addData(data) {
      addCarinfo(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editCarinfo(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDetail(id) {
      getCarinfoDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            carNumber,
            carTeacher,
            seatNumber,
            driverId,
            status,
            carImageUrl,
          } = res.data.data;

          this.driverList = await getDriverList({
            schoolIds: schoolIds,
            driverId: driverId,
          });
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              id,
              schoolIds,
              carNumber,
              carTeacher,
              seatNumber,
              driverId,
              status,
            };
            if (carImageUrl) {
              this.carImageUrl = carImageUrl;
              this.$refs.uploadFile.imageUrl = carImageUrl;
            }
          });
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submitForm", valid, this.modalType);
          let data = {
            ...this.ruleForm,
            carImageUrl: this.carImageUrl,
          };

          if (this.modalType == "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        }
      });
    },
    async changeSchool(e) {
      delete this.ruleForm["driverId"];
      this.driverList = [];
      this.driverList = await getDriverList({ schoolIds: e });
    },
    handleUploadSuccess(data) {
      console.log("文件上传成功", data);
      this.carImageUrl = data;
    },
    handleUploadError(error) {
      console.error("文件上传失败", error);
    },
    // 关闭
    closeModal() {
      this.driverList = [];
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
