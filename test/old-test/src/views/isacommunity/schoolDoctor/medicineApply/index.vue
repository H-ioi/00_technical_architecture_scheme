<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('schoolDoctor.用药申请') }}</div>
      <div class="community_top_btn">
        <el-button v-if="permissions['medicationapplication_add']" type="primary" @click="showModal('add')" size="medium">{{ $t('btn.新增') }}</el-button>
      </div>
    </div>
    <div class="community_centent_v2">
      <div class="search_body">
        <el-form class="search_form" :label-position="'top'" :inline="true" :model="searchFrom">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.schoolId" clearable :placeholder="$t('schoolDoctor.学校')">
                  <el-option :key="k" v-for="(i, k) in schoolSelectList" :label="schoolDropdownLabel(i)" :value="i.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchFrom.keyword" :placeholder="$t('schoolDoctor.请输入姓名/学号')" clearable @keyup.enter.native="getList" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.applyMedication" clearable :placeholder="$t('schoolDoctor.申请用药')">
                  <el-option :label="$t('schoolDoctor.是')" :value="1" />
                  <el-option :label="$t('schoolDoctor.否')" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.status" clearable :placeholder="$t('schoolDoctor.状态')">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="$t(`schoolDoctor.${item.labelKey}`)" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="search_btn">
          <el-button type="primary" size="medium" @click="getList">{{ $t('btn.查询') }}</el-button>
          <el-button text bg size="medium" @click="clear">{{ $t('btn.重置') }}</el-button>
        </div>
      </div>

      <div class="isa_table">
        <Table
          ref="Table"
          :showSelection="true"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :tableBtn="tableBtn"
          height="calc(100vh - 295px)"
          @playTab="playTab"
          @selection-change="handleSelectionChange" />
        <div class="df_sb isa_table_footer">
          <div>
            <el-button :disabled="!selectedIds.length" size="mini" type="danger" @click="handleBatchDel">{{ $t('btn.删除') }}</el-button>
          </div>
          <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange" />
        </div>
      </div>
    </div>
    <Detail ref="Detail" @getList="getList" />
  </div>
</template>

<script>
import { delMedicationApply, getMedicationApplyPage } from '@/api/isacommunity/medicationApply'
import Pagination from '@/components/communitycommon/Pagination.vue'
import Table from '@/components/communitycommon/Table.vue'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import { mapGetters } from 'vuex'
import Detail from './detail.vue'
import { formatApplyStatus, formatDateTimeMinute, formatYesNo, MEDICATION_APPLY_STATUS } from './utils/medicationApplyOptions.js'

export default {
  name: 'MedicationApply',
  components: { Table, Pagination, Detail },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      selectedIds: [],
      statusOptions: MEDICATION_APPLY_STATUS
    }
  },
  created() {
    this.fetchSchoolListBuscommon()
    this.getList()
  },
  activated() {
    this.getList()
  },
  computed: {
    ...mapGetters(['permissions']),
    tableTitle() {
      return [
        { label: 'ID', prop: 'id', width: '70', fixed: true },
        { label: this.$t('schoolDoctor.学校'), prop: 'schoolName', minWidth: '200' },
        { label: this.$t('schoolDoctor.学号'), prop: 'admissionNo', minWidth: '120' },
        { label: this.$t('schoolDoctor.姓名'), prop: 'fullName', minWidth: '140' },
        { label: this.$t('schoolDoctor.年级'), prop: 'grade', width: '100' },
        { label: this.$t('schoolDoctor.班级'), prop: 'formCode', width: '100' },
        { label: this.$t('schoolDoctor.申请用药'), prop: 'applyMedicationText', width: '100' },
        { label: this.$t('schoolDoctor.状态'), prop: 'statusText', width: '110' },
        { label: this.$t('schoolDoctor.申请者'), prop: 'applicantText', minWidth: '120' },
        { label: this.$t('schoolDoctor.创建时间'), prop: 'createTime', width: '170' },
        { label: this.$t('schoolDoctor.更新时间'), prop: 'updateTime', width: '170' }
      ]
    },
    tableBtn() {
      return [
        { name: '查看', type: 'look', icon: '', permissions: '' },
        {
          name: '审批',
          type: 'approve',
          icon: '',
          permissions: '',
          show: (row) => row.showApproveBtn === true
        }
      ]
    }
  },
  methods: {
    buildQueryParams() {
      const params = { ...this.pagination, ...this.searchFrom }
      if (params.schoolId) {
        params.schoolIds = [params.schoolId]
        delete params.schoolId
      }
      return params
    },

    getList() {
      getMedicationApplyPage(this.buildQueryParams()).then((res) => {
        if (res.data.success) {
          const { data, total } = res.data.data
          this.paginationTotal = total
          this.tableData = data || []
          this.formatData()
        }
      })
    },

    /** 待审批才显示审批按钮：status=0，或未赋值且尚未护士审批 */
    canApproveRow(item) {
      if (!item) return false
      const status = item.status
      if (status !== null && status !== undefined && status !== '') {
        return Number(status) === 0
      }
      const nurseApproval = item.nurseApproval
      if (nurseApproval === 1 || nurseApproval === 2) return false
      return true
    },

    formatData() {
      this.tableData.forEach((item) => {
        item.statusText = formatApplyStatus(item.status, (key) => this.$t(key))
        item.applyMedicationText = formatYesNo(item.applyMedication, (key) => this.$t(key))
        item.applicantText = this.formatApplicant(item)
        item.createTime = formatDateTimeMinute(item.createTime)
        item.updateTime = formatDateTimeMinute(item.updateTime)
        item.showApproveBtn = this.canApproveRow(item)
      })
    },

    /** 申请者：小程序来源显示家长，后台新增显示操作账号 */
    formatApplicant(item) {
      const source = [item.source, item.sourceType, item.applicantType].find((value) => value !== null && value !== undefined)
      if (source === 1 || source === '1' || source === 'mini' || /mini|小程序|家长/i.test(String(item.applicant || ''))) {
        return this.$t('schoolDoctor.家长')
      }
      return item.applicant || item.operator || item.creator || '-'
    },

    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id)
    },

    playTab(name, item) {
      if (name === 'look') {
        this.$refs.Detail.showModal('look', item)
        return
      }
      if (name === 'approve') {
        if (!this.canApproveRow(item)) {
          this.$message.warning(this.$t('schoolDoctor.仅待审批记录可审批'))
          return
        }
        this.$refs.Detail.showModal('approve', item)
      }
    },

    handleBatchDel() {
      if (!this.selectedIds.length) return
      this.$confirm(this.$t('schoolDoctor.将永久删除勾选的内容确认删除'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        delMedicationApply(this.selectedIds).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('schoolDoctor.删除成功'))
            this.selectedIds = []
            this.getList()
          }
        })
      })
    },

    clear() {
      this.searchFrom = {}
      this.pagination.current = 1
      this.getList()
    },

    handleCurrentChange(page) {
      this.pagination.current = page
      this.getList()
    },

    showModal(type, item = {}) {
      this.$refs.Detail.showModal(type, item)
    }
  }
}
</script>

<style lang="scss" scoped></style>
