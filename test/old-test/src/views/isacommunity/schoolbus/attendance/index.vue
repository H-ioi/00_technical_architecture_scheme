<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('busAttendance.校巴考勤') }}</div>
      <div class="community_top_btn">
        <el-button
          v-if="permissions['busattendance_add']"
          type="primary"
          size="medium"
          @click="showModal('add')"
        >{{ $t('btn.新增') }}</el-button>
      </div>
    </div>

    <div class="community_centent_v2">
      <div class="search_body">
        <el-form class="search_form" :label-position="'top'" :inline="true" :model="searchFrom">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="searchFrom.schoolId"
                  clearable
                  filterable
                  :placeholder="$t('busAttendance.学校')"
                  @change="changeSearchSchool"
                >
                  <el-option
                    v-for="i in schoolSelectList"
                    :key="i.id"
                    :label="schoolDropdownLabel(i)"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input
                  v-model="searchFrom.keyword"
                  :placeholder="$t('busAttendance.请输入姓名/学号')"
                  clearable
                  @keyup.enter.native="getList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  :range-separator="$t('busAttendance.至')"
                  :start-placeholder="$t('busAttendance.考勤日期开始')"
                  :end-placeholder="$t('busAttendance.考勤日期结束')"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input
                  v-model="searchFrom.formCode"
                  clearable
                  :placeholder="$t('busAttendance.班级')"
                />
              </el-form-item>
            </el-col>
            <template v-if="searchOpen">
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    v-model="searchFrom.lineId"
                    clearable
                    filterable
                    :placeholder="$t('busAttendance.请选择路线')"
                    @change="changeSearchLine"
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
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    v-model="searchFrom.stationId"
                    clearable
                    filterable
                    :placeholder="$t('busAttendance.请选择站点')"
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
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    v-model="searchFrom.attendanceStatus"
                    clearable
                    :placeholder="$t('busAttendance.考勤状态')"
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
            </template>
          </el-row>
        </el-form>
        <div class="search_btn">
          <el-button type="primary" size="medium" @click="getList">{{ $t('btn.查询') }}</el-button>
          <el-button text bg size="medium" @click="clear">{{ $t('btn.重置') }}</el-button>
          <span class="open" @click="searchOpen = !searchOpen">
            {{ searchOpen ? $t('busAttendance.收起') : $t('busAttendance.展开') }}
          </span>
        </div>
      </div>

      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="true"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          :height="schoolbusTableHeight"
          @playTab="playTab"
          @selection-change="handleSelectionChange"
        />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button
              v-if="permissions['busattendance_del']"
              :disabled="!selectedIds.length"
              size="mini"
              type="danger"
              @click="handleBatchDel"
            >{{ $t('busAttendance.批量删除') }}</el-button>
          </div>
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <Detail ref="Detail" @getList="getList" />
  </div>
</template>

<script>
import { delAttendance, getAttendancePage } from '@/api/isacommunity/busattendance.js'
import { getLineList, getStationList } from '@/api/isacommunity/buscommon.js'
import Pagination from '@/components/communitycommon/Pagination.vue'
import Table from '@/components/communitycommon/Table.vue'
import busAttendanceConsts from '@/const/isacommunity/schoolbus/busAttendanceConsts.js'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import Detail from './detail.vue'
import schoolbusListPage from '../mixins/schoolbusListPage.js'

export default {
  name: 'busAttendance',
  components: { Table, Pagination, Detail },
  mixins: [schoolListBuscommonMixin, schoolbusListPage],
  data() {
    return {
      busAttendanceConsts,
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      dateRange: null,
      tableData: [],
      lineList: [],
      stationList: [],
      selectLineList: [],
      selectStationList: []
    }
  },
  created() {
    this.initData()
  },
  activated() {
    this.getList()
  },
  computed: {
    ...mapGetters(['permissions', 'i18nlocel']),
    tableTitle() {
      return [
        { label: 'ID', prop: 'id', width: '70', fixed: true },
        { label: this.$t('busAttendance.学校'), prop: 'schoolName', minWidth: '200' },
        { label: this.$t('busAttendance.学号'), prop: 'admissionNo', minWidth: '130' },
        { label: this.$t('busAttendance.姓名'), prop: 'studentName', minWidth: '180' },
        { label: this.$t('busAttendance.年级'), prop: 'grade', width: '100' },
        { label: this.$t('busAttendance.班级'), prop: 'formCode', width: '80' },
        { label: this.$t('busAttendance.考勤日期'), prop: 'attendanceDate', width: '120' },
        { label: this.$t('busAttendance.路线'), prop: 'lineName', minWidth: '120' },
        { label: this.$t('busAttendance.站点'), prop: 'stationName', minWidth: '120' },
        { label: this.$t('busAttendance.上下车类型'), prop: 'rideTypeLabel', width: '110' },
        { label: this.$t('busAttendance.考勤状态'), prop: 'attendanceStatusLabel', width: '100' },
        { label: this.$t('busAttendance.操作人'), prop: 'operator', width: '100' },
        { label: this.$t('busAttendance.创建时间'), prop: 'createTime', width: '170' },
        { label: this.$t('busAttendance.备注'), prop: 'remark', minWidth: '120' }
      ]
    },
    tableBtn() {
      const btns = [
        { name: this.$t('btn.查看'), type: 'look', icon: '', permissions: '' },
        {
          name: this.$t('btn.编辑'),
          type: 'edit',
          icon: '',
          permissions: 'busattendance_edit'
        }
      ]
      return btns.filter(
        (item) => this.permissions[item.permissions] || item.type === 'look'
      )
    }
  },
  watch: {
    i18nlocel() {
      this.formatData()
    }
  },
  methods: {
    async initData() {
      await this.fetchSchoolListBuscommon()
      this.lineList = (await getLineList()) || []
      this.stationList = (await getStationList()) || []
      if (this.schoolSelectList.length === 1) {
        this.searchFrom.schoolId = this.schoolSelectList[0].id
        this.changeSearchSchool(this.searchFrom.schoolId)
      }
      this.getList()
    },
    getList() {
      const params = { ...this.pagination, ...this.searchFrom }
      if (params.schoolId) {
        params.schoolIds = [params.schoolId]
        delete params.schoolId
      }
      if (this.dateRange && this.dateRange.length === 2) {
        params.attendanceDateStart = `${this.dateRange[0]} 00:00:00`
        params.attendanceDateEnd = `${this.dateRange[1]} 23:59:59`
      }
      getAttendancePage(params).then((res) => {
        if (!res.data.success) return
        const { data, total } = res.data.data
        this.paginationTotal = total
        this.tableData = data || []
        this.formatData()
      })
    },
    formatData() {
      this.tableData.forEach((item) => {
        this.applySchoolNameFromId(item)
        item.grade = item.grade || item.studentGrade || '-'
        item.lineName = item.lineName || item.buslineCnName || item.buslineEnName || '-'
        item.stationName =
          item.stationName || item.busStationCnName || item.busStationEnName || '-'
        if (item.attendanceDate) {
          item.attendanceDate = dayjs(item.attendanceDate).format('YYYY-MM-DD')
        }
        if (item.createTime) {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
        }
        item.rideTypeLabel = this.$getListLabel(
          busAttendanceConsts.busRideType,
          item.rideType
        )
        item.attendanceStatusLabel = this.$getListLabel(
          busAttendanceConsts.busAttendanceStatus,
          item.attendanceStatus
        )
        item.operator = item.operator || item.createBy || item.creator || '-'
        item.remark = item.remark == null || item.remark === '' ? '-' : item.remark
      })
    },
    playTab(name, item) {
      this.$refs.Detail.showModal(name, item)
    },
    showModal(type, item = {}) {
      this.$refs.Detail.showModal(type, item)
    },
    handleBatchDel() {
      if (!this.selectedIds.length) return
      this.$confirm(
        this.$t('busAttendance.将永久删除勾选的内容，确认删除？'),
        this.$t('busAttendance.提示'),
        {
          confirmButtonText: this.$t('btn.确定'),
          cancelButtonText: this.$t('btn.取消'),
          type: 'warning'
        }
      ).then(() => {
        delAttendance({ ids: this.selectedIds }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('schoolbus.成功'))
            this.getList()
          }
        })
      })
    },
    clear() {
      this.searchFrom = {}
      this.dateRange = null
      this.selectLineList = []
      this.selectStationList = []
      if (this.schoolSelectList.length === 1) {
        this.searchFrom.schoolId = this.schoolSelectList[0].id
        this.changeSearchSchool(this.searchFrom.schoolId)
      }
      this.pagination.current = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.pagination.current = page
      this.getList()
    },
    changeSearchSchool(schoolId) {
      if (!schoolId) {
        this.selectLineList = []
        this.selectStationList = []
        this.searchFrom.lineId = ''
        this.searchFrom.stationId = ''
        return
      }
      const ids = new Set([schoolId])
      const matchSchool = (item) => {
        if (Array.isArray(item.schoolIds)) {
          return item.schoolIds.some((id) => ids.has(id))
        }
        return ids.has(item.schoolIds)
      }
      this.selectLineList = this.lineList.filter(matchSchool)
      this.selectStationList = this.stationList.filter(matchSchool)
      this.searchFrom.lineId = ''
      this.searchFrom.stationId = ''
    },
    changeSearchLine(lineId) {
      const schoolId = this.searchFrom.schoolId
      if (!schoolId) {
        this.selectStationList = []
        return
      }
      const ids = new Set([schoolId])
      this.selectStationList = this.stationList.filter((item) => {
        const schoolOk = Array.isArray(item.schoolIds)
          ? item.schoolIds.some((id) => ids.has(id))
          : ids.has(item.schoolIds)
        return schoolOk && (!lineId || item.lineId === lineId)
      })
      this.searchFrom.stationId = ''
    }
  }
}
</script>
