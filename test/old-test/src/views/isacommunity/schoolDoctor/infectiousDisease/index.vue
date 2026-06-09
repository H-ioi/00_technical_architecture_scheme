<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('schoolDoctor.传染病管理') }}</div>
      <div class="community_top_btn">
        <el-upload
          ref="upload"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleFileChange"
          accept=".xlsx,.xls"
          style="display: inline-block; margin-right: 8px">
          <el-button size="medium" :loading="importLoading">{{ $t('btn.导入') }}</el-button>
        </el-upload>
        <el-button @click="handleExport" size="medium">{{ $t('btn.导出') }}</el-button>
        <el-button type="primary" @click="showModal('add')" size="medium">{{ $t('btn.新增') }}</el-button>
      </div>
    </div>
    <div class="community_centent_v2">
      <div class="search_body">
        <el-form class="search_form" :label-position="'top'" :inline="true" :model="searchFrom">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.status" clearable :placeholder="$t('schoolDoctor.状态')">
                  <el-option :label="$t('schoolDoctor.痊愈')" :value="1" />
                  <el-option :label="$t('schoolDoctor.病假中')" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchFrom.keyword" :placeholder="$t('schoolDoctor.名称')" clearable @keyup.enter.native="getList" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                  v-model="dateRange"
                  type="datetimerange"
                  :range-separator="$t('schoolDoctor.至')"
                  :start-placeholder="$t('schoolDoctor.发现日期开始')"
                  :end-placeholder="$t('schoolDoctor.发现日期结束')"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%" />
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
            <el-button :disabled="!selectedIds.length" size="mini" type="danger" @click="handleBatchDel">{{ $t('schoolDoctor.批量删除') }}</el-button>
          </div>
          <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange" />
        </div>
      </div>
    </div>
    <Detail ref="Detail" :title="$t('schoolDoctor.传染病')" @getList="getList" />
  </div>
</template>

<script>
import { delInfectiousDisease, exportInfectiousDisease, getInfectiousDiseasePage, importInfectiousDisease } from '@/api/isacommunity/infectiousDisease'
import Pagination from '@/components/communitycommon/Pagination.vue'
import Table from '@/components/communitycommon/Table.vue'
import { download, downloadFile } from '@/util/download.js'
import { mapGetters } from 'vuex'
import Detail from './detail.vue'

export default {
  name: 'InfectiousDisease',
  components: { Table, Pagination, Detail },
  data() {
    return {
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {},
      dateRange: null,
      tableData: [],
      selectedIds: [],
      importLoading: false
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
        { label: this.$t('schoolDoctor.学校'), prop: 'schoolName', minWidth: '200' },
        { label: this.$t('schoolDoctor.学号'), prop: 'admissionNo', minWidth: '120' },
        { label: this.$t('schoolDoctor.姓名'), prop: 'fullName', minWidth: '140' },
        { label: this.$t('schoolDoctor.年级'), prop: 'grade', width: '100' },
        { label: this.$t('schoolDoctor.班级'), prop: 'formCode', width: '100' },
        { label: this.$t('schoolDoctor.传染病名称'), prop: 'diseaseName', width: '120' },
        { label: this.$t('schoolDoctor.发现日期'), prop: 'discoveryDate', width: '170' },
        { label: this.$t('schoolDoctor.状态'), prop: 'statusText', width: '100' },
        { label: this.$t('schoolDoctor.创建时间'), prop: 'createTime', width: '170' },
        { label: this.$t('schoolDoctor.更新时间'), prop: 'updateTime', width: '170' }
      ]
    },
    tableBtn() {
      return [
        { name: '查看', type: 'look', icon: '', permissions: '' },
        { name: '编辑', type: 'edit', icon: '', permissions: '' }
      ]
    }
  },
  methods: {
    initData() {
      this.getList()
    },

    getList() {
      const params = {
        ...this.pagination,
        ...this.searchFrom
      }
      if (this.dateRange && this.dateRange.length === 2) {
        params.discoveryDateStart = this.dateRange[0]
        params.discoveryDateEnd = this.dateRange[1]
      }
      getInfectiousDiseasePage(params).then((res) => {
        if (res.data.success) {
          let { data, total } = res.data.data
          this.paginationTotal = total
          this.tableData = data || []
          this.formatData()
        }
      })
    },

    formatData() {
      const statusMap = { 1: this.$t('schoolDoctor.痊愈'), 2: this.$t('schoolDoctor.病假中') }
      this.tableData.forEach((item) => {
        item.statusText = statusMap[item.status] || '-'
      })
    },

    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id)
    },

    playTab(name, item, scope) {
      switch (name) {
        case 'look':
          this.$refs.Detail.showModal('look', item)
          break
        case 'edit':
          this.$refs.Detail.showModal('edit', item)
          break
      }
    },

    handleBatchDel() {
      if (!this.selectedIds.length) return
      this.$confirm(this.$t('schoolDoctor.将永久删除勾选的内容确认删除'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        delInfectiousDisease(this.selectedIds).then((res) => {
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
      this.dateRange = null
      this.getList()
    },

    handleCurrentChange(page) {
      this.pagination.current = page
      this.getList()
    },

    showModal(type = 'add', item = {}) {
      this.$refs.Detail.showModal(type, item)
    },

    handleFileChange(file) {
      if (!file || !file.raw) return
      this.importLoading = true
      importInfectiousDisease(file.raw)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('schoolDoctor.导入成功'))
            this.getList()
          } else {
            this.$message.warning(res.data.msg || this.$t('schoolDoctor.导入失败'))
          }
        })
        .catch((err) => {
          this.$message.error(err.message || this.$t('schoolDoctor.导入失败'))
        })
        .finally(() => {
          this.importLoading = false
          this.$refs.upload.clearFiles()
        })
    },

    handleExport() {
      this.$confirm(this.$t('schoolDoctor.确定导出当前筛选条件下的传染病记录吗？'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      })
        .then(() => {
          const params = {
            ...this.searchFrom
          }
          if (this.dateRange && this.dateRange.length === 2) {
            params.discoveryDateStart = this.dateRange[0]
            params.discoveryDateEnd = this.dateRange[1]
          }
          exportInfectiousDisease(params).then((res) => {
            const cd = res.headers['content-disposition']
            if (cd && cd.indexOf('=') !== -1) {
              download(res.data, cd)
            } else {
              downloadFile(res.data, this.$t('schoolDoctor.传染病记录.xlsx'))
            }
            this.$message.success(this.$t('schoolDoctor.导出成功'))
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped></style>
