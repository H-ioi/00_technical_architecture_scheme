<template>
  <el-drawer
    :title="drawerTitle"
    :visible.sync="showDialog"
    size="720px"
    :before-close="closeModal"
    :wrapper-closable="false"
    class="drawer-body bus-attendance-drawer"
  >
    <div class="drawer-content" v-if="showDialog" v-loading="detailLoading">
      <el-form
        class="drawer-form"
        :label-position="'top'"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-row :gutter="20">
          <el-col v-if="schoolSelectList.length > 1" :span="12">
            <el-form-item :label="$t('busAttendance.学校')" prop="schoolId">
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.schoolId"
                :placeholder="$t('common.请选择')"
                :disabled="isReadonly"
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
            <el-form-item :label="$t('busAttendance.学号')" prop="admissionNo">
              <el-autocomplete
                v-if="!isReadonly"
                style="width: 100%"
                suffix-icon="el-icon-search"
                v-model="ruleForm.admissionNo"
                :fetch-suggestions="querySearch"
                :placeholder="$t('busAttendance.请输入姓名/学号')"
                :trigger-on-focus="false"
                @select="handleSelect"
              />
              <el-input v-else v-model="ruleForm.admissionNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.姓名')" prop="studentName">
              <el-input v-model="ruleForm.studentName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.年级')" prop="studentGrade">
              <el-input v-model="ruleForm.studentGrade" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.班级')" prop="formCode">
              <el-input v-model="ruleForm.formCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.考勤日期')" prop="attendanceDate">
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.attendanceDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :placeholder="$t('common.请选择')"
                :disabled="isReadonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.路线')" prop="lineId">
              <el-select
                style="width: 100%"
                v-model="ruleForm.lineId"
                filterable
                :placeholder="$t('common.请选择')"
                :disabled="isReadonly"
                @change="changeLine"
              >
                <el-option
                  v-for="i in selectLineList"
                  :key="i.id"
                  :label="i18nlocel === 'en' ? i.enName : i.cnName"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.站点')" prop="stationId">
              <el-select
                style="width: 100%"
                v-model="ruleForm.stationId"
                filterable
                :placeholder="$t('common.请选择')"
                :disabled="isReadonly"
              >
                <el-option
                  v-for="i in selectStationList"
                  :key="i.id"
                  :label="i18nlocel === 'en' ? i.enName : i.cnName"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.上下车类型')" prop="rideType">
              <el-select
                style="width: 100%"
                v-model="ruleForm.rideType"
                :placeholder="$t('common.请选择')"
                :disabled="isReadonly"
              >
                <el-option
                  v-for="(i, k) in busAttendanceConsts.busRideType"
                  :key="k"
                  :label="i18nlocel === 'en' ? i.enLabel : i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('busAttendance.考勤状态')" prop="attendanceStatus">
              <el-select
                style="width: 100%"
                v-model="ruleForm.attendanceStatus"
                :placeholder="$t('common.请选择')"
                :disabled="isReadonly"
              >
                <el-option
                  v-for="(i, k) in busAttendanceConsts.busAttendanceStatus"
                  :key="k"
                  :label="i18nlocel === 'en' ? i.enLabel : i.label"
                  :value="i.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('busAttendance.备注')" prop="remark">
              <el-input
                type="textarea"
                :rows="3"
                v-model="ruleForm.remark"
                maxlength="500"
                show-word-limit
                :disabled="isReadonly"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="drawer-footer" v-if="!isReadonly">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submitForm('ruleForm')">
          {{ $t('schoolbus.确认') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getAttendanceDetail,
  addAttendance,
  editAttendance
} from '@/api/isacommunity/busattendance.js'
import { getLineList, getStationList } from '@/api/isacommunity/buscommon.js'
import { searchStudentList } from '@/api/isacommunity/holiday.js'
import { mapStudentToFormFields } from '@/views/isacommunity/schoolDoctor/utils/studentFormMapper.js'
import busAttendanceConsts from '@/const/isacommunity/schoolbus/busAttendanceConsts.js'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import dayjs from 'dayjs'

export default {
  name: 'BusAttendanceDetail',
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      busAttendanceConsts,
      modalType: 'add',
      showDialog: false,
      detailLoading: false,
      isSubmitting: false,
      ruleForm: {},
      selectLineList: [],
      selectStationList: [],
      searchTimer: null,
      rules: {}
    }
  },
  created() {
    this.rules = this.initRules()
  },
  computed: {
    ...mapGetters(['i18nlocel']),
    isReadonly() {
      return this.modalType === 'look'
    },
    drawerTitle() {
      const typeMap = {
        add: this.$t('busAttendance.新增校巴考勤'),
        edit: this.$t('busAttendance.编辑校巴考勤'),
        look: this.$t('busAttendance.校巴考勤详情')
      }
      return typeMap[this.modalType] || this.$t('busAttendance.校巴考勤详情')
    }
  },
  methods: {
    initRules() {
      return {
        schoolId: [
          { required: true, message: this.$t('schoolbus.请选择'), trigger: 'change' }
        ],
        admissionNo: [
          { required: true, message: this.$t('schoolbus.请输入'), trigger: 'blur' }
        ],
        studentName: [
          { required: true, message: this.$t('schoolbus.请输入'), trigger: 'blur' }
        ],
        attendanceDate: [
          { required: true, message: this.$t('schoolbus.请选择'), trigger: 'change' }
        ],
        lineId: [
          { required: true, message: this.$t('schoolbus.请选择'), trigger: 'change' }
        ],
        stationId: [
          { required: true, message: this.$t('schoolbus.请选择'), trigger: 'change' }
        ],
        rideType: [
          { required: true, message: this.$t('schoolbus.请选择'), trigger: 'change' }
        ],
        attendanceStatus: [
          { required: true, message: this.$t('schoolbus.请选择'), trigger: 'change' }
        ]
      }
    },
    async showModal(type = 'add', item = {}) {
      this.modalType = type
      this.showDialog = true
      this.ruleForm = {}
      this.selectLineList = []
      this.selectStationList = []
      const tasks = [() => this.fetchSchoolListBuscommon()]
      if (type === 'add') {
        tasks.push(async () => {
          if (this.schoolSelectList.length === 1) {
            this.ruleForm.schoolId = this.schoolSelectList[0].id
            await this.changeSchool(this.ruleForm.schoolId, true)
          }
        })
      } else {
        tasks.push(() => this.loadDetail(item.id))
      }
      this.detailLoading = true
      try {
        for (let i = 0; i < tasks.length; i++) {
          await tasks[i]()
        }
      } finally {
        this.detailLoading = false
      }
    },
    async loadDetail(id) {
      const res = await getAttendanceDetail(id)
      if (!res.data.success) return
      const row = res.data.data || {}
      this.ruleForm = {
        id: row.id,
        schoolId: row.schoolId,
        admissionNo: row.admissionNo,
        studentName: row.studentName,
        studentGrade: row.grade || row.studentGrade,
        formCode: row.formCode,
        attendanceDate: row.attendanceDate
          ? dayjs(row.attendanceDate).format('YYYY-MM-DD')
          : '',
        lineId: row.lineId,
        stationId: row.stationId,
        rideType: row.rideType,
        attendanceStatus: row.attendanceStatus,
        remark: row.remark
      }
      if (row.schoolId) {
        await this.changeSchool(row.schoolId, true)
        this.ruleForm.lineId = row.lineId
        await this.changeLine(row.lineId)
        this.ruleForm.stationId = row.stationId
      }
    },
    /** @param {boolean} keepRoute 编辑/详情回填时保留路线站点 */
    async changeSchool(schoolId, keepRoute = false) {
      if (!schoolId) {
        this.selectLineList = []
        this.selectStationList = []
        return
      }
      this.selectLineList = (await getLineList({ schoolIds: schoolId })) || []
      if (!keepRoute) {
        this.ruleForm.lineId = ''
        this.ruleForm.stationId = ''
        this.selectStationList = []
      }
    },
    async changeLine(lineId) {
      const schoolId = this.ruleForm.schoolId
      if (!schoolId || !lineId) {
        this.selectStationList = []
        return
      }
      this.selectStationList =
        (await getStationList({ schoolIds: schoolId, lineId })) || []
      if (!this.selectStationList.some((s) => s.id === this.ruleForm.stationId)) {
        this.ruleForm.stationId = ''
      }
    },
    querySearch(queryString, cb) {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      const keyword = (queryString || '').trim()
      if (!keyword) {
        cb([])
        return
      }
      if (this.schoolSelectList.length > 1 && !this.ruleForm.schoolId) {
        this.$message.warning(this.$t('schoolbus.请选择学校'))
        cb([])
        return
      }
      this.searchTimer = setTimeout(() => {
        searchStudentList({ student: keyword }).then((res) => {
          const list = (res.data && res.data.data) || []
          cb(
            list.map((item) => {
              const name = item.showName || item.cnFullName || item.fullName || ''
              const no = item.admissonNo || item.studentId || ''
              return { ...item, value: no ? `${name}（${no}）` : name }
            })
          )
        })
      }, 300)
    },
    handleSelect(item) {
      const mapped = mapStudentToFormFields(
        item,
        'busAttendance',
        this.schoolSelectList
      )
      this.ruleForm = {
        ...this.ruleForm,
        ...mapped,
        admissionNo: mapped.admissionNo || item.admissonNo || item.studentId || ''
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.isSubmitting = true
        const data = { ...this.ruleForm }
        // 提交字段与接口一致：grade
        if (data.studentGrade != null && data.studentGrade !== '') {
          data.grade = data.studentGrade
        }
        const request =
          this.modalType === 'add' ? addAttendance(data) : editAttendance(data)
        request
          .then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t('schoolbus.成功'))
              this.$emit('getList')
              this.closeModal()
            }
          })
          .finally(() => {
            this.isSubmitting = false
          })
      })
    },
    closeModal() {
      this.showDialog = false
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bus-attendance-drawer {
  ::v-deep .el-drawer__body {
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .drawer-form {
    flex: 1;
    min-height: 0;
    height: auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 20px 16px;
  }

  .drawer-footer {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 12px 20px;
    background: #fff;
    border-top: 1px solid #ebeef5;
    box-shadow: 0 -2px 8px rgba(31, 45, 61, 0.06);
  }
}
</style>
