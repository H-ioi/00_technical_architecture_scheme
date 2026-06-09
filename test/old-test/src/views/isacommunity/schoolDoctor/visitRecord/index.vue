<template>
  <div class="community_page community_page_v2">
    <div class="community_top">
      <div class="community_top_title">
        {{ $t('schoolDoctor.就诊记录') }}
        <el-radio-group v-model="activeTab" size="large" fill="#ba8e62" @change="handleTabChange">
          <el-radio-button label="pending">{{ $t('schoolDoctor.待用药') }}</el-radio-button>
          <el-radio-button label="record">{{ $t('schoolDoctor.就诊记录') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="community_top_btn">
        <el-button v-if="activeTab === 'record'" type="primary" @click="showModal('add')" size="medium">{{ $t('btn.新增') }}</el-button>
      </div>
    </div>

    <div class="community_centent_v2">
      <template v-if="activeTab === 'pending'">
        <div class="search_body">
          <el-form class="search_form" :label-position="'top'" :inline="true" :model="pendingSearchForm">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="pendingSearchForm.schoolId" clearable :placeholder="$t('schoolDoctor.学校')">
                    <el-option v-for="item in schoolSelectList" :key="item.id" :label="schoolDropdownLabel(item)" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input
                    v-model="pendingSearchForm.keyword"
                    :placeholder="$t('schoolDoctor.请输入姓名/学号')"
                    clearable
                    @keyup.enter.native="getPendingList" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="pendingSearchForm.searchStatus" clearable :placeholder="$t('schoolDoctor.状态')">
                    <el-option v-for="item in pendingStatusOptions" :key="item.value" :label="$t(`schoolDoctor.${item.labelKey}`)" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-date-picker
                    v-model="pendingDateRange"
                    type="datetimerange"
                    :range-separator="$t('schoolDoctor.至')"
                    :start-placeholder="$t('schoolDoctor.申请用药日期开始')"
                    :end-placeholder="$t('schoolDoctor.申请用药日期结束')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="search_btn">
            <el-button type="primary" size="medium" @click="getPendingList">{{ $t('btn.查询') }}</el-button>
            <el-button text bg size="medium" @click="clearPending">{{ $t('btn.重置') }}</el-button>
          </div>
        </div>

        <div class="isa_table">
          <Table
            ref="pendingTable"
            :showSelection="false"
            :tableTitle="pendingTableTitle"
            :tableData="pendingTableData"
            :tableBtn="pendingTableBtn"
            height="calc(100vh - 295px)"
            @playTab="playPendingTab" />
          <div class="df_sb isa_table_footer">
            <Pagination :total="pendingPaginationTotal" :pagination="pendingPagination" @handleCurrentChange="handlePendingCurrentChange" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="search_body">
          <el-form class="search_form" :label-position="'top'" :inline="true" :model="recordSearchForm">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="recordSearchForm.schoolId" clearable :placeholder="$t('schoolDoctor.学校')">
                    <el-option v-for="item in schoolSelectList" :key="item.id" :label="schoolDropdownLabel(item)" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input
                    v-model="recordSearchForm.keyword"
                    :placeholder="$t('schoolDoctor.请输入姓名/学号')"
                    clearable
                    @keyup.enter.native="getRecordList" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="recordSearchForm.leaveDestination" clearable :placeholder="$t('schoolDoctor.离开去向')">
                    <el-option v-for="item in leaveOptions" :key="item.value" :label="$t(`schoolDoctor.${item.labelKey}`)" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="recordSearchForm.parentAgree" clearable :placeholder="$t('schoolDoctor.家长是否同意')">
                    <el-option :label="$t('schoolDoctor.是')" :value="1" />
                    <el-option :label="$t('schoolDoctor.否')" :value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="recordSearchOpen">
                <el-col :span="6">
                  <el-form-item>
                    <el-select v-model="recordSearchForm.contactParent" clearable :placeholder="$t('schoolDoctor.是否联系家长')">
                      <el-option :label="$t('schoolDoctor.是')" :value="1" />
                      <el-option :label="$t('schoolDoctor.否')" :value="0" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker
                      v-model="recordDateRange"
                      type="datetimerange"
                      :range-separator="$t('schoolDoctor.至')"
                      :start-placeholder="$t('schoolDoctor.到访时间开始')"
                      :end-placeholder="$t('schoolDoctor.到访时间结束')"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%" />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
          <div class="search_btn">
            <el-button type="primary" size="medium" @click="getRecordList">{{ $t('btn.查询') }}</el-button>
            <el-button text bg size="medium" @click="clearRecord">{{ $t('btn.重置') }}</el-button>
            <span class="open" @click="recordSearchOpen = !recordSearchOpen">
              {{ recordSearchOpen ? $t('schoolDoctor.收起') : $t('schoolDoctor.展开') }}
            </span>
          </div>
        </div>

        <div class="isa_table">
          <Table
            ref="recordTable"
            :showSelection="true"
            :tableTitle="recordTableTitle"
            :tableData="recordTableData"
            :tableBtn="recordTableBtn"
            :height="recordSearchOpen ? 'calc(100vh - 345px)' : 'calc(100vh - 295px)'"
            @playTab="playRecordTab"
            @selection-change="handleRecordSelectionChange" />
          <div class="df_sb isa_table_footer">
            <div>
              <el-button :disabled="!recordSelectedIds.length" size="mini" type="danger" @click="handleRecordBatchDel">{{ $t('btn.删除') }}</el-button>
            </div>
            <Pagination :total="recordPaginationTotal" :pagination="recordPagination" @handleCurrentChange="handleRecordCurrentChange" />
          </div>
        </div>
      </template>
    </div>

    <Detail ref="Detail" @refresh="handleRefresh" />
  </div>
</template>

<script>
import { delVisitRecord, getPendingMedicationPage, getVisitRecordPage } from '@/api/isacommunity/visitRecord'
import Pagination from '@/components/communitycommon/Pagination.vue'
import Table from '@/components/communitycommon/Table.vue'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import Detail from './detail.vue'
import {
  buildPendingSearchParams,
  formatDateTimeMinute,
  formatLeaveDestination,
  formatMedicationTime,
  formatPendingListStatus,
  formatYesNo,
  LEAVE_DESTINATION_OPTIONS,
  PENDING_MEDICATION_STATUS_ENDED,
  PENDING_SEARCH_STATUS,
  resolvePendingApplicationId
} from './utils/visitRecordOptions.js'

export default {
  name: 'VisitRecord',
  components: { Table, Pagination, Detail },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      activeTab: 'pending',
      pendingPagination: { size: 10, current: 1 },
      pendingPaginationTotal: 0,
      pendingSearchForm: {},
      pendingDateRange: null,
      pendingTableData: [],
      recordPagination: { size: 10, current: 1 },
      recordPaginationTotal: 0,
      recordSearchForm: {},
      recordDateRange: null,
      recordTableData: [],
      recordSelectedIds: [],
      recordSearchOpen: false,
      pendingStatusOptions: PENDING_SEARCH_STATUS,
      leaveOptions: LEAVE_DESTINATION_OPTIONS
    }
  },
  computed: {
    pendingTableTitle() {
      return [
        { label: 'ID', prop: 'id', width: '70', fixed: true },
        { label: this.$t('schoolDoctor.学校'), prop: 'schoolName', minWidth: '200' },
        { label: this.$t('schoolDoctor.学号'), prop: 'admissionNo', minWidth: '120' },
        { label: this.$t('schoolDoctor.姓名'), prop: 'fullName', minWidth: '140' },
        { label: this.$t('schoolDoctor.年级'), prop: 'grade', width: '100' },
        { label: this.$t('schoolDoctor.班级'), prop: 'formCode', width: '100' },
        { label: this.$t('schoolDoctor.申请用药日期'), prop: 'applyMedicationDate', width: '180' },
        { label: this.$t('schoolDoctor.给药时间'), prop: 'operationTime', width: '180' },
        { label: this.$t('schoolDoctor.状态'), prop: 'statusText', width: '100' },
        { label: this.$t('schoolDoctor.创建时间'), prop: 'createTime', width: '170' },
        { label: this.$t('schoolDoctor.更新时间'), prop: 'updateTime', width: '170' }
      ]
    },
    pendingTableBtn() {
      return [
        { name: '查看', type: 'look', icon: '', permissions: '' },
        {
          name: '操作用药',
          type: 'operate',
          icon: '',
          permissions: '',
          show: (row) => Number(row.status) !== PENDING_MEDICATION_STATUS_ENDED
        }
      ]
    },
    recordTableTitle() {
      return [
        { label: 'ID', prop: 'id', width: '70', fixed: true },
        { label: this.$t('schoolDoctor.学校'), prop: 'schoolName', minWidth: '200' },
        { label: this.$t('schoolDoctor.学号'), prop: 'admissionNo', minWidth: '120' },
        { label: this.$t('schoolDoctor.姓名'), prop: 'fullName', minWidth: '140' },
        { label: this.$t('schoolDoctor.年级'), prop: 'grade', width: '100' },
        { label: this.$t('schoolDoctor.班级'), prop: 'formCode', width: '100' },
        { label: this.$t('schoolDoctor.到访日期'), prop: 'visitDate', width: '120' },
        { label: this.$t('schoolDoctor.到访时间'), prop: 'visitTimeText', width: '150' },
        { label: this.$t('schoolDoctor.具体情况'), prop: 'specificSituationText', minWidth: '140' },
        { label: this.$t('schoolDoctor.离开去向'), prop: 'leaveDestinationText', width: '100' },
        { label: this.$t('schoolDoctor.是否执行操作'), prop: 'executeOperationText', width: '120' },
        { label: this.$t('schoolDoctor.是否联系家长'), prop: 'contactParentText', width: '120' },
        { label: this.$t('schoolDoctor.家长签字'), prop: 'parentSignatureText', width: '100' },
        { label: this.$t('schoolDoctor.创建时间'), prop: 'createTime', width: '170' },
        { label: this.$t('schoolDoctor.更新时间'), prop: 'updateTime', width: '170' }
      ]
    },
    recordTableBtn() {
      return [
        { name: '查看', type: 'look', icon: '', permissions: '' },
        { name: '编辑', type: 'edit', icon: '', permissions: '' }
      ]
    }
  },
  created() {
    this.initData()
  },
  activated() {
    this.handleRouteQuery()
    this.handleRefresh(false)
  },
  methods: {
    async initData() {
      await this.fetchSchoolListBuscommon()
      this.handleRouteQuery()
      this.handleRefresh(false)
    },

    handleRouteQuery() {
      const query = this.$route.query || {}
      if (query.tab === 'record') {
        this.activeTab = 'record'
      }
    },

    openRecordFromQuery() {
      const recordId = this.$route.query.recordId
      if (!recordId || this.activeTab !== 'record') return
      this.$nextTick(() => {
        this.$refs.Detail.showModal('look', { id: recordId })
      })
    },

    handleTabChange() {
      this.handleRefresh(false)
    },

    handleRefresh(clearQuery) {
      if (this.activeTab === 'pending') {
        this.getPendingList()
      } else {
        this.getRecordList().then(() => {
          this.openRecordFromQuery()
        })
      }
      if (clearQuery !== false && this.$route.query.recordId) {
        this.$router.replace({ path: this.$route.path, query: { tab: this.activeTab } })
      }
    },

    buildPendingParams() {
      return buildPendingSearchParams(this.pendingPagination, this.pendingSearchForm, this.pendingDateRange)
    },

    getPendingList() {
      return getPendingMedicationPage(this.buildPendingParams()).then((res) => {
        if (res.data.success) {
          const { data, total } = res.data.data
          this.pendingPaginationTotal = total
          this.pendingTableData = data || []
          this.formatPendingData()
        }
      })
    },

    formatPendingData() {
      this.pendingTableData.forEach((item) => {
        item.applicationId = resolvePendingApplicationId(item)
        item.statusText = formatPendingListStatus(item.status, item.applicationStatus, (key) => this.$t(key))
        item.medicationTimeText = formatMedicationTime(item.medicationTime, (key) => this.$t(key))
        item.applyMedicationDateText =
          item.applyMedicationDateStart && item.applyMedicationDateEnd
            ? `${formatDateTimeMinute(item.applyMedicationDateStart)} ~ ${formatDateTimeMinute(item.applyMedicationDateEnd)}`
            : '-'
        item.createTime = formatDateTimeMinute(item.createTime)
        item.updateTime = formatDateTimeMinute(item.updateTime)
      })
    },

    getRecordList() {
      const params = { ...this.recordPagination, ...this.recordSearchForm }
      if (this.recordDateRange && this.recordDateRange.length === 2) {
        params.visitDateStart = this.recordDateRange[0]
        params.visitDateEnd = this.recordDateRange[1]
      }
      return getVisitRecordPage(params).then((res) => {
        if (res.data.success) {
          const { data, total } = res.data.data
          this.recordPaginationTotal = total
          this.recordTableData = data || []
          this.formatRecordData()
        }
      })
    },

    formatRecordData() {
      this.recordTableData.forEach((item) => {
        item.visitDate = formatDateTimeMinute(item.visitTime)
        item.visitTimeText = formatDateTimeMinute(item.visitTime)
        item.specificSituationText = item.specificSituation || item.remark || item.chiefComplaint || '-'
        item.leaveDestinationText = formatLeaveDestination(item.leaveDestination, (key) => this.$t(key))
        item.executeOperationText = formatYesNo(item.executeOperation, (key) => this.$t(key))
        item.contactParentText = formatYesNo(item.contactParent, (key) => this.$t(key))
        item.parentSignatureText = item.parentSignaturePath ? this.$t('schoolDoctor.有') : this.$t('schoolDoctor.无')
        item.createTime = formatDateTimeMinute(item.createTime)
        item.updateTime = formatDateTimeMinute(item.updateTime)
      })
    },

    handleRecordSelectionChange(selection) {
      this.recordSelectedIds = selection.map((item) => item.id)
    },

    playPendingTab(name, item) {
      if (name === 'look') {
        this.$refs.Detail.showModal('lookPending', item)
        return
      }
      if (name === 'operate') {
        if (Number(item.status) === 1) {
          this.$message.warning(this.$t('schoolDoctor.已结束记录不可操作'))
          return
        }
        this.$refs.Detail.showModal('operatePending', item)
      }
    },

    playRecordTab(name, item) {
      this.$refs.Detail.showModal(name === 'look' ? 'look' : 'edit', item)
    },

    showModal(type, item = {}) {
      this.$refs.Detail.showModal(type, item)
    },

    confirmDelete(onConfirm) {
      this.$confirm(this.$t('schoolDoctor.将永久删除勾选的内容确认删除'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(onConfirm)
    },

    handleRecordBatchDel() {
      if (!this.recordSelectedIds.length) return
      this.confirmDelete(() => {
        delVisitRecord(this.recordSelectedIds).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('schoolDoctor.删除成功'))
            this.recordSelectedIds = []
            this.getRecordList()
          }
        })
      })
    },

    clearPending() {
      this.pendingSearchForm = {}
      this.pendingDateRange = null
      this.pendingPagination.current = 1
      this.getPendingList()
    },

    clearRecord() {
      this.recordSearchForm = {}
      this.recordDateRange = null
      this.recordPagination.current = 1
      this.getRecordList()
    },

    handlePendingCurrentChange(page) {
      this.pendingPagination.current = page
      this.getPendingList()
    },

    handleRecordCurrentChange(page) {
      this.recordPagination.current = page
      this.getRecordList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
