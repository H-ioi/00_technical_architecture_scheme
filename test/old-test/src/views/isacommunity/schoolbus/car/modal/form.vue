<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="showModal"
    width="720px"
    class="schoolbus-dialog"
    :before-close="closeModal"
    :close-on-click-modal="false"
  >
    <el-form
      v-if="showModal"
      ref="ruleForm"
      class="schoolbus-dialog-form"
      :label-position="'top'"
      :model="ruleForm"
      :rules="rules"
      v-loading="detailLoading"
    >
      <el-row :gutter="20">
        <el-col v-if="schoolSelectList.length > 1" :span="12">
          <el-form-item :label="$t('schoolbus.校区')" prop="schoolIds">
            <el-select
              clearable
              style="width: 100%"
              v-model="ruleForm.schoolIds"
              :placeholder="$t('common.请选择')"
              @change="changeSchool"
            >
              <el-option
                v-for="(i, k) in schoolSelectList"
                :key="k"
                :label="schoolDropdownLabel(i)"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="schoolSelectList.length > 1 ? 12 : 24">
          <el-form-item :label="$t('schoolbus.车牌号')" prop="carNumber">
            <el-input
              v-model="ruleForm.carNumber"
              :placeholder="$t('consult.请输入')"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.跟车老师')" prop="carTeacherId">
            <el-select
              style="width: 100%"
              v-model="ruleForm.carTeacherId"
              :placeholder="$t('common.请选择')"
            >
              <el-option
                v-for="(i, k) in teacherList"
                :key="k"
                :label="teacherOptionLabel(i)"
                :value="i.id"
                :disabled="isTeacherOptionDisabled(i)"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.座位数')" prop="seatNumber">
            <el-input-number
              style="width: 100%"
              v-model="ruleForm.seatNumber"
              :precision="0"
              :step="1"
              :min="1"
              :max="100"
              :placeholder="$t('consult.请输入')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.司机')" prop="driverId">
            <el-select
              style="width: 100%"
              v-model="ruleForm.driverId"
              :placeholder="$t('common.请选择')"
            >
              <el-option
                v-for="(i, k) in driverList"
                :key="k"
                :label="i.name"
                :value="i.id"
                :disabled="!i.status"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('schoolbus.状态')" prop="status">
            <el-select
              style="width: 100%"
              v-model="ruleForm.status"
              :placeholder="$t('common.请选择')"
            >
              <el-option
                v-for="(i, k) in carStatusOptions"
                :key="k"
                :label="$t('schoolbus.' + i.label)"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('schoolbus.车辆照片')" prop="carImageUrl">
            <upload-file
              ref="uploadFile"
              :limit="1"
              types="image/*"
              @upload-success="handleUploadSuccess"
              @upload-error="handleUploadError"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModal">{{ $t("btn.取消") }}</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="submitForm('ruleForm')">
        {{ $t("schoolbus.确认") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { getCarinfoDetail, addCarinfo, editCarinfo } from "@/api/isacommunity/car.js";
import { getDriverList, getTeacherList } from "@/api/isacommunity/buscommon.js";
import { BUS_CAR_STATUS } from "../../schoolbusConsts.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";

export default {
  name: "BusCarForm",
  mixins: [schoolListBuscommonMixin],
  components: { uploadFile },
  data() {
    const that = this;
    return {
      carStatusOptions: BUS_CAR_STATUS,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      detailLoading: false,
      isSubmitting: false,
      ruleForm: { schoolIds: null },
      editingCarId: null,
      rules: {
        schoolIds: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
        carNumber: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        seatNumber: [
          { required: true, message: that.$t("schoolbus.请输入"), trigger: "blur" },
        ],
        driverId: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
        status: [
          { required: true, message: that.$t("schoolbus.请选择"), trigger: "change" },
        ],
      },
      driverList: [],
      teacherList: [],
      carImageUrl: "",
    };
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    dialogTitle() {
      const key = this.typeObj[this.modalType] || "新增";
      return this.$t('schoolbus')[key];
    },
  },
  methods: {
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showModal = true;
      this.detailLoading = type !== "add";
      try {
        if (type !== "add") {
          await this.getDetail(item.id);
        } else if (this.schoolSelectList.length === 1) {
          const schoolId = this.schoolSelectList[0].id;
          this.editingCarId = null;
          this.ruleForm = { schoolIds: schoolId };
          this.driverList = await getDriverList({ schoolIds: [schoolId] });
          this.teacherList = await this.loadTeacherOptions([schoolId]);
        }
      } finally {
        this.detailLoading = false;
      }
    },
    async loadTeacherOptions(schoolIds) {
      return getTeacherList({ schoolIds, isAll: 1 });
    },
    normalizeSchoolIds(value) {
      if (value == null || value === "") return [];
      return Array.isArray(value) ? value : [value];
    },
    teacherOptionLabel(teacher) {
      if (!teacher) return "";
      let label = teacher.nickname || "";
      if (teacher.boundCarNumber && this.isTeacherOptionDisabled(teacher)) {
        label += ` (${this.$t("schoolbus.已跟车")}：${teacher.boundCarNumber})`;
      }
      return label;
    },
    isTeacherOptionDisabled(teacher) {
      if (!teacher || !teacher.status) return true;
      if (!teacher.boundCarId) return false;
      if (this.modalType === "edit" && this.editingCarId) {
        return Number(teacher.boundCarId) !== Number(this.editingCarId);
      }
      return true;
    },
    buildSubmitPayload() {
      const schoolIds = this.normalizeSchoolIds(this.ruleForm.schoolIds);
      return { ...this.ruleForm, schoolIds, carImageUrl: this.carImageUrl };
    },
    addData(data) {
      this.isSubmitting = true;
      addCarinfo(data)
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
    editData(data) {
      this.isSubmitting = true;
      editCarinfo(data)
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
    async getDetail(id) {
      const res = await getCarinfoDetail(id);
      if (!res.data.success) return;
      const {
        schoolIds: detailSchoolIds,
        carNumber,
        carTeacherId,
        seatNumber,
        driverId,
        status,
        carImageUrl,
      } = res.data.data;
      this.editingCarId = id;
      const schoolIds = this.normalizeSchoolIds(detailSchoolIds);
      this.driverList = await getDriverList({ schoolIds, driverId });
      this.teacherList = await this.loadTeacherOptions(schoolIds);
      this.$nextTick(() => {
        this.ruleForm = {
          id,
          schoolIds: schoolIds.length === 1 ? schoolIds[0] : schoolIds,
          carNumber,
          carTeacherId,
          seatNumber,
          driverId,
          status,
        };
        if (carImageUrl) {
          this.carImageUrl = carImageUrl;
          this.$refs.uploadFile.imageUrl = carImageUrl;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        const data = this.buildSubmitPayload();
        if (this.modalType === "add") this.addData(data);
        else this.editData(data);
      });
    },
    async changeSchool(e) {
      delete this.ruleForm.driverId;
      delete this.ruleForm.carTeacherId;
      const schoolIds = this.normalizeSchoolIds(e);
      this.driverList = await getDriverList({ schoolIds });
      this.teacherList = await this.loadTeacherOptions(schoolIds);
    },
    handleUploadSuccess(data) {
      this.carImageUrl = data;
    },
    handleUploadError() {},
    closeModal() {
      this.driverList = [];
      this.teacherList = [];
      this.editingCarId = null;
      this.carImageUrl = "";
      this.showModal = false;
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
