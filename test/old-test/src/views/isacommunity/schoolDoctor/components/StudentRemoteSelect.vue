<template>
  <div class="student-remote-select">
    <el-form-item v-if="!readonly" :label="$t('schoolDoctor.选择学生')">
      <el-select
        v-model="selectedKey"
        filterable
        remote
        reserve-keyword
        clearable
        style="width: 100%"
        :placeholder="$t('schoolDoctor.请输入姓名/学号')"
        :remote-method="remoteSearch"
        :loading="loading"
        @change="handleSelectChange"
        @clear="handleClear">
        <el-option v-for="item in options" :key="getStudentKey(item)" :label="getOptionLabel(item)" :value="getStudentKey(item)" />
      </el-select>
    </el-form-item>

    <div v-if="cardInfo" class="student-card">
      <div class="student-card__header">
        <div class="student-card__profile">
          <div class="student-card__avatar">
            <img v-if="cardInfo.avatarUrl" :src="cardInfo.avatarUrl" alt="" />
            <span v-else>{{ cardInfo.avatarText }}</span>
          </div>
          <div class="student-card__basic">
            <div class="student-card__name">{{ cardInfo.displayName }}</div>
            <div class="student-card__id">
              <i class="el-icon-postcard"></i>
              ID: {{ cardInfo.studentId || '-' }}
            </div>
          </div>
        </div>
      </div>

      <div class="student-card__academic">
        <div class="student-card__academic-item">
          <i class="el-icon-location-outline"></i>
          <div>
            <div class="student-card__label">{{ $t('schoolDoctor.就读学校') }}</div>
            <div class="student-card__value">{{ cardInfo.schoolName || '-' }}</div>
          </div>
        </div>
        <div class="student-card__academic-item">
          <i class="el-icon-tickets"></i>
          <div>
            <div class="student-card__label">{{ $t('schoolDoctor.学部年级') }}</div>
            <div class="student-card__value">{{ cardInfo.gradeClassText || '-' }}</div>
          </div>
        </div>
      </div>

      <div v-if="cardInfo.emergencyName || cardInfo.emergencyPhone" class="student-card__footer">
        <div class="student-card__emergency">
          <i class="el-icon-phone-outline is-emergency"></i>
          <span>{{ $t('schoolDoctor.紧急联系人') }}：</span>
          <span>{{ cardInfo.emergencyName || '-' }}</span>
        </div>
        <div v-if="cardInfo.emergencyPhone" class="student-card__phone">
          <i class="el-icon-phone"></i>
          {{ cardInfo.emergencyPhone }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchStudentList } from '@/api/isacommunity/holiday.js'
import { buildStudentCardInfo, mapStudentToFormFields } from '../utils/studentFormMapper.js'

export default {
  name: 'StudentRemoteSelect',
  props: {
    /** 是否只读（详情模式） */
    readonly: {
      type: Boolean,
      default: false
    },
    /** 表单字段映射类型 */
    fieldType: {
      type: String,
      default: 'studentRecord'
    },
    /** 校区下拉，用于匹配 schoolId */
    schoolSelectList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedKey: '',
      options: [],
      studentMap: {},
      cardInfo: null,
      loading: false,
      searchTimer: null
    }
  },
  methods: {
    /** 远程搜索学生 */
    remoteSearch(query) {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      if (!query || !query.trim()) {
        this.options = []
        return
      }

      this.searchTimer = setTimeout(() => {
        this.loading = true
        searchStudentList({ student: query.trim() })
          .then((res) => {
            const list = (res.data && res.data.data) || []
            this.studentMap = {}
            this.options = list
            list.forEach((item) => {
              this.studentMap[this.getStudentKey(item)] = item
            })
          })
          .finally(() => {
            this.loading = false
          })
      }, 300)
    },

    /** 下拉选项展示文案 */
    getOptionLabel(student) {
      const name = student.showName || student.cnFullName || student.fullName || ''
      const no = student.admissonNo || student.studentId || ''
      return no ? `${name}（${no}）` : name
    },

    /** 学生唯一标识 */
    getStudentKey(student) {
      return String(student.studentId || student.id || student.admissonNo || '')
    },

    /** 选中学生后映射表单并展示信息 */
    handleSelectChange(key) {
      const student = this.studentMap[key]
      if (!student) {
        this.handleClear()
        return
      }

      const mappedFields = mapStudentToFormFields(student, this.fieldType, this.schoolSelectList)
      this.cardInfo = buildStudentCardInfo(student, this.schoolSelectList)
      this.$emit('select', mappedFields, student)
    },

    /** 编辑/详情时根据已有表单回填展示 */
    setDisplayFromForm(form) {
      this.cardInfo = buildStudentCardInfo(form, this.schoolSelectList)
      this.selectedKey = ''
      this.options = []
      this.studentMap = {}
    },

    /** 清空选择与展示 */
    reset() {
      this.selectedKey = ''
      this.options = []
      this.studentMap = {}
      this.cardInfo = null
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }
    },

    handleClear() {
      this.reset()
      this.$emit('clear')
    }
  }
}
</script>

<style lang="scss" scoped>
.student-card {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(31, 45, 61, 0.06);
}

.student-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.student-card__profile {
  display: flex;
  align-items: center;
  min-width: 0;
}

.student-card__avatar {
  position: relative;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  margin-right: 12px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(135deg, #ffb6c1 0%, #ff8fab 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.student-card__status-dot {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #67c23a;
}

.student-card__name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.student-card__id {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;

  i {
    margin-right: 4px;
  }
}

.student-card__health {
  flex-shrink: 0;
  text-align: right;
}

.student-card__health-label {
  margin-bottom: 6px;
  font-size: 12px;
  color: #909399;
}

.student-card__health-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;

  i {
    margin-right: 4px;
  }

  &.is-normal {
    color: #67c23a;
    background: #f0f9eb;
  }

  &.is-warning {
    color: #e6a23c;
    background: #fdf6ec;
  }
}

.student-card__academic,
.student-card__medical {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.student-card__medical {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 10px;
}

.student-card__academic-item,
.student-card__medical-item {
  display: flex;
  align-items: flex-start;
  min-width: 0;

  > i {
    flex-shrink: 0;
    margin-right: 8px;
    margin-top: 2px;
    font-size: 18px;
    color: #ba8e62;
  }

  .is-blood {
    color: #f56c6c;
  }

  .is-allergy {
    color: #e6a23c;
  }
}

.student-card__label {
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.student-card__value {
  font-size: 13px;
  color: #303133;
  line-height: 1.5;
  word-break: break-all;
}

.student-card__allergy-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #e6a23c;
  background: #fdf6ec;
  line-height: 1.5;
}

.student-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f2f5;
  font-size: 13px;
  color: #606266;
}

.student-card__emergency {
  display: flex;
  align-items: center;
  min-width: 0;

  .is-emergency {
    margin-right: 4px;
    color: #f56c6c;
  }
}

.student-card__phone {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  color: #ba8e62;
  background: #ecf5ff;
  font-size: 12px;

  i {
    margin-right: 4px;
  }
}
</style>
