<template>
  <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="1100px" :before-close="closeModal"
    class="drawer-body archive-drawer">
    <div class="drawer-content" v-if="showDialog" v-loading="detailLoading">
      <el-tabs v-model="activeTab" class="archive-tabs" type="card">
        <el-tab-pane :label="$t('schoolDoctor.学生个人信息')" name="student">
          <ArchiveStudentTab :student-info="studentInfo" :archive-meta="archiveMeta" />
        </el-tab-pane>

        <el-tab-pane :label="$t('schoolDoctor.健康与病史信息')" name="health">
          <ArchiveHealthTab :health-history="healthHistory" :edit-form="editForm" :is-editable="isEditable" />
        </el-tab-pane>

        <el-tab-pane :label="$t('schoolDoctor.疫苗及入学体检')" name="vaccine">
          <ArchiveVaccineTab :vaccine-exam="vaccineExam" />
        </el-tab-pane>

        <el-tab-pane :label="$t('schoolDoctor.在校就诊医疗记录')" name="visit">
          <ArchiveVisitTab :visit-records="visitRecords" />
        </el-tab-pane>
      </el-tabs>

      <div class="drawer-footer" v-if="modalType === 'edit'">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitEdit" :loading="isSubmitting">{{ $t('schoolDoctor.确认') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getMedicalArchiveDetail } from "@/api/isacommunity/medicalArchive";
import { editMedicalInfo } from "@/api/isacommunity/medicalInfo";
import { formatMetricValue, parseMetricNumber } from "./utils/archiveDisplay.js";
import ArchiveHealthTab from "./components/ArchiveHealthTab.vue";
import ArchiveStudentTab from "./components/ArchiveStudentTab.vue";
import ArchiveVaccineTab from "./components/ArchiveVaccineTab.vue";
import ArchiveVisitTab from "./components/ArchiveVisitTab.vue";

export default {
  name: "StudentRecordDetail",
  components: {
    ArchiveStudentTab,
    ArchiveHealthTab,
    ArchiveVaccineTab,
    ArchiveVisitTab,
  },
  data() {
    return {
      modalType: "look",
      showDialog: false,
      detailLoading: false,
      activeTab: "student",
      studentInfo: {},
      archiveMeta: {},
      healthHistory: {},
      vaccineExam: {},
      visitRecords: [],
      editForm: {
        id: undefined,
        height: undefined,
        weight: undefined,
        leftVision: undefined,
        rightVision: undefined,
        leftEar: undefined,
        rightEar: undefined,
        nurseRemark: "",
      },
      isSubmitting: false,
    };
  },
  computed: {
    drawerTitle() {
      const typeMap = {
        look: this.$t("schoolDoctor.学生档案详情"),
        edit: this.$t("schoolDoctor.编辑学生档案"),
      };
      return typeMap[this.modalType] || this.$t("schoolDoctor.详情");
    },
    isEditable() {
      return this.modalType === "edit";
    },
  },
  methods: {
    async showModal(type = "look", item = {}) {
      this.modalType = type;
      this.activeTab = "student";
      this.showDialog = true;
      this.detailLoading = true;
      try {
        await this.loadDetail(item.id);
      } finally {
        this.detailLoading = false;
      }
    },

    loadDetail(id) {
      return getMedicalArchiveDetail(id).then((res) => {
        if (!res.data.success) return;
        const data = res.data.data || {};
        this.studentInfo = data.student || {};
        this.archiveMeta = {
          creator: data.creator,
          createTime: data.createTime,
          updateTime: data.updateTime,
          status: data.status,
        };
        this.healthHistory = data.healthHistory || {};
        this.vaccineExam = data.vaccineAndExam || {};
        this.visitRecords = data.visitRecords || [];
        this.editForm = this.buildEditForm(this.healthHistory);
      });
    },

    buildEditForm(healthHistory = {}) {
      return {
        id: healthHistory.id,
        height: parseMetricNumber(healthHistory.height),
        weight: parseMetricNumber(healthHistory.weight),
        leftVision: parseMetricNumber(healthHistory.leftVision),
        rightVision: parseMetricNumber(healthHistory.rightVision),
        leftEar: parseMetricNumber(healthHistory.leftEar),
        rightEar: parseMetricNumber(healthHistory.rightEar),
        nurseRemark: healthHistory.nurseRemark || "",
      };
    },

    /** 通过 /clinic/medicalinfo/edit 更新可编辑的健康指标 */
    buildMedicalInfoPayload() {
      const form = this.editForm;
      return {
        ...this.healthHistory,
        id: form.id,
        height: formatMetricValue(form.height),
        weight: formatMetricValue(form.weight),
        leftVision: formatMetricValue(form.leftVision),
        rightVision: formatMetricValue(form.rightVision),
        leftEar: formatMetricValue(form.leftEar),
        rightEar: formatMetricValue(form.rightEar),
        nurseRemark: form.nurseRemark || "",
      };
    },

    submitEdit() {
      if (!this.editForm.id) {
        this.$message.warning(this.$t("schoolDoctor.暂无医疗信息可编辑"));
        return;
      }
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      editMedicalInfo(this.buildMedicalInfoPayload())
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("schoolDoctor.编辑成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },

    closeModal() {
      this.showDialog = false;
      this.studentInfo = {};
      this.archiveMeta = {};
      this.healthHistory = {};
      this.vaccineExam = {};
      this.visitRecords = [];
      this.editForm = this.buildEditForm();
      this.isSubmitting = false;
      this.detailLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.archive-drawer {

  ::v-deep .el-tabs__header {
    margin-bottom: 16px;
  }

  ::v-deep .el-tabs__item.is-active {
    color: #175e67;
    font-weight: 600;
  }

  ::v-deep .el-tabs__active-bar {
    background-color: #175e67;
  }

}

.archive-tabs {
  height: calc(100vh - 125px);
  padding: 0 20px;
}
</style>
