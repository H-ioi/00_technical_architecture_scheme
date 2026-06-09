<template>
  <div class="archive-tab">
    <div class="info-card">
      <div v-if="basicFields.length" class="info-grid">
        <div v-for="item in basicFields" :key="item.key" class="info-cell">
          <div class="info-cell__label">{{ item.label }}</div>
          <div class="info-cell__value">
            <el-tag v-if="item.tag" size="small" type="info" effect="plain">{{ item.value }}</el-tag>
            <span v-else>{{ item.value }}</span>
          </div>
        </div>
      </div>
      <el-empty v-else :description="$t('schoolDoctor.暂无数据')" :image-size="72" />
    </div>

    <div v-if="showParentSection" class="info-card parent-card">
      <div class="parent-card__header">
        <div class="parent-card__title">
          <span>{{ $t('schoolDoctor.家长亲属联系方式') }}</span>
          <el-tag size="mini" type="danger" effect="plain">{{ $t('schoolDoctor.隐私数据访问限制') }}</el-tag>
        </div>
        <el-button v-if="!parentUnlocked && canViewParentInfo" size="mini" plain icon="el-icon-lock" @click="parentUnlocked = true">
          {{ $t('schoolDoctor.点击验权查看家长电话') }}
        </el-button>
      </div>

      <div v-if="!parentUnlocked" class="parent-mask">
        <i class="el-icon-lock parent-mask__icon" />
        <p>{{ $t('schoolDoctor.家长隐私说明') }}</p>
      </div>

      <div v-else-if="visibleParents.length" class="parent-list">
        <div v-for="(parent, index) in visibleParents" :key="index" class="parent-item">
          <div v-if="hasDisplayValue(parent.relationships)" class="parent-item__row">
            <span class="parent-item__label">{{ $t('schoolDoctor.关系') }}</span>
            <span>{{ parent.relationships }}</span>
          </div>
          <div v-if="hasDisplayValue(parent.mobilePhoneNumber)" class="parent-item__row">
            <span class="parent-item__label">{{ $t('schoolDoctor.手机号码') }}</span>
            <span>{{ parent.mobilePhoneNumber }}</span>
          </div>
          <div v-if="hasDisplayValue(parent.emailAddress)" class="parent-item__row">
            <span class="parent-item__label">{{ $t('schoolDoctor.邮箱地址') }}</span>
            <span>{{ parent.emailAddress }}</span>
          </div>
        </div>
      </div>
      <el-empty v-else :description="$t('schoolDoctor.暂无数据')" :image-size="72" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatGradeClass, hasDisplayValue } from "../utils/archiveDisplay.js";

export default {
  name: "ArchiveStudentTab",
  props: {
    studentInfo: { type: Object, default: () => ({}) },
    archiveMeta: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      parentUnlocked: false,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    canViewParentInfo() {
      return !!this.permissions["medicalarchive_parent_info"];
    },
    basicFields() {
      const student = this.studentInfo || {};
      const meta = this.archiveMeta || {};
      const fields = [];

      if (hasDisplayValue(student.schoolName)) {
        fields.push({
          key: "schoolName",
          label: this.$t("schoolDoctor.学校Campus"),
          value: student.schoolName,
        });
      }
      if (hasDisplayValue(student.admissionNo)) {
        fields.push({
          key: "admissionNo",
          label: this.$t("schoolDoctor.学号StudentID"),
          value: student.admissionNo,
        });
      }
      if (hasDisplayValue(student.fullName)) {
        fields.push({
          key: "fullName",
          label: this.$t("schoolDoctor.学生姓名"),
          value: student.fullName,
        });
      }

      const gradeClass = formatGradeClass(student.grade, student.formCode);
      if (gradeClass) {
        fields.push({
          key: "gradeClass",
          label: this.$t("schoolDoctor.年级班级"),
          value: gradeClass,
        });
      }

      if (student.dormitoryStatus === 0 || student.dormitoryStatus === 1) {
        fields.push({
          key: "dormitoryStatus",
          label: this.$t("schoolDoctor.午托住宿状态"),
          value: student.dormitoryStatus === 1
            ? this.$t("schoolDoctor.寄宿生")
            : this.$t("schoolDoctor.走读生"),
          tag: true,
        });
      }

      if (hasDisplayValue(student.roomNum)) {
        fields.push({
          key: "roomNum",
          label: this.$t("schoolDoctor.寝室编号"),
          value: student.roomNum,
        });
      }
      if (hasDisplayValue(student.busInfo)) {
        fields.push({
          key: "busInfo",
          label: this.$t("schoolDoctor.校车线路编号"),
          value: student.busInfo,
        });
      }
      if (hasDisplayValue(meta.creator)) {
        fields.push({
          key: "creator",
          label: this.$t("schoolDoctor.创建核准人"),
          value: meta.creator,
        });
      }

      const timeLines = [];
      if (hasDisplayValue(meta.createTime)) timeLines.push(`${this.$t("schoolDoctor.建档")}: ${meta.createTime}`);
      if (hasDisplayValue(meta.updateTime)) timeLines.push(`${this.$t("schoolDoctor.更新")}: ${meta.updateTime}`);
      if (timeLines.length) {
        fields.push({
          key: "archiveTime",
          label: this.$t("schoolDoctor.建档更新时间"),
          value: timeLines.join("\n"),
        });
      }

      return fields;
    },
    showParentSection() {
      return Array.isArray(this.studentInfo.parents);
    },
    visibleParents() {
      return (this.studentInfo.parents || []).filter((item) => {
        return (
          hasDisplayValue(item.relationships) ||
          hasDisplayValue(item.mobilePhoneNumber) ||
          hasDisplayValue(item.emailAddress)
        );
      });
    },
  },
  watch: {
    studentInfo: {
      immediate: true,
      handler() {
        this.parentUnlocked = false;
      },
    },
  },
  methods: {
    hasDisplayValue,
  },
};
</script>

<style lang="scss" scoped>
.info-card {
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 24px;
}

.info-cell__label {
  margin-bottom: 6px;
  font-size: 12px;
  color: #909399;
}

.info-cell__value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.6;
  white-space: pre-line;
}

.parent-card {
  margin-top: 16px;
}

.parent-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.parent-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.parent-mask {
  padding: 36px 24px;
  text-align: center;
  background: #fafafa;
  border: 1px dashed #dcdfe6;
  border-radius: 10px;

  &__icon {
    font-size: 36px;
    color: #c0c4cc;
  }

  p {
    margin: 12px 0 0;
    font-size: 13px;
    line-height: 1.7;
    color: #909399;
  }
}

.parent-list {
  display: grid;
  gap: 12px;
}

.parent-item {
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.parent-item__row {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #303133;

  &:last-child {
    margin-bottom: 0;
  }
}

.parent-item__label {
  flex-shrink: 0;
  width: 72px;
  color: #909399;
}
</style>
