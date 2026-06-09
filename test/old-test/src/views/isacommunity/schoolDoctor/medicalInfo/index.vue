<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('schoolDoctor.医疗信息') }}</div>
      <div class="community_top_btn">
        <el-upload
          v-if="permissions['medicalinfo_import']"
          ref="upload"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleFileChange"
          accept=".xlsx,.xls"
          style="display: inline-block; margin-right: 8px">
          <el-button size="medium" :loading="importLoading">{{ $t('btn.导入') }}</el-button>
        </el-upload>
        <el-button v-if="permissions['medicalinfo_export']" @click="handleExport" size="medium">{{ $t('btn.导出') }}</el-button>
        <el-button v-if="permissions['medicalinfo_add']" type="primary" @click="showModal('add')" size="medium">{{ $t('btn.新增') }}</el-button>
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
                <el-select v-model="searchFrom.hasAllergen" clearable :placeholder="$t('schoolDoctor.是否有过敏原')">
                  <el-option :label="$t('schoolDoctor.是')" :value="1" />
                  <el-option :label="$t('schoolDoctor.否')" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchFrom.regularMedication" clearable :placeholder="$t('schoolDoctor.是否定期服用药物')">
                  <el-option :label="$t('schoolDoctor.是')" :value="1" />
                  <el-option :label="$t('schoolDoctor.否')" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="searchOpen">
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="searchFrom.hasDisease" clearable :placeholder="$t('schoolDoctor.是否有疾病')">
                    <el-option :label="$t('schoolDoctor.是')" :value="1" />
                    <el-option :label="$t('schoolDoctor.否')" :value="0" />
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
            {{ searchOpen ? $t('schoolDoctor.收起') : $t('schoolDoctor.展开') }}
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
          :height="searchOpen ? 'calc(100vh - 345px)' : 'calc(100vh - 295px)'"
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
    <Detail ref="Detail" @getList="getList" />
  </div>
</template>

<script>
import { delMedicalInfo, exportMedicalInfo, getMedicalInfoPage, importMedicalInfo } from '@/api/isacommunity/medicalInfo'
import Pagination from '@/components/communitycommon/Pagination.vue'
import Table from '@/components/communitycommon/Table.vue'
import { download, downloadFile } from '@/util/download.js'
import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import { mapGetters } from 'vuex'
import Detail from './detail.vue'

export default {
  name: 'MedicalInfo',
  components: { Table, Pagination, Detail },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      selectedIds: [],
      importLoading: false,
      searchOpen: false
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
        { label: this.$t('schoolDoctor.学校'), prop: 'schoolName', minWidth: '220' },
        { label: this.$t('schoolDoctor.学号'), prop: 'admissionNo', minWidth: '120' },
        { label: this.$t('schoolDoctor.姓名'), prop: 'fullName', minWidth: '180' },
        { label: this.$t('schoolDoctor.年级'), prop: 'grade' },
        { label: this.$t('schoolDoctor.班级'), prop: 'formCode' },
        { label: this.$t('schoolDoctor.是否住宿'), prop: 'dormitoryStatusText', width: '100' },
        { label: this.$t('schoolDoctor.是否有过敏原'), prop: 'hasAllergenText', width: '120' },
        { label: this.$t('schoolDoctor.是否定期服用药物'), prop: 'regularMedicationText', width: '160' },
        { label: this.$t('schoolDoctor.是否有疾病'), prop: 'hasDiseaseText', width: '120' },
        { label: this.$t('schoolDoctor.操作者'), prop: 'operator' },
        { label: this.$t('schoolDoctor.创建时间'), prop: 'createTime', width: '170' },
        { label: this.$t('schoolDoctor.更新时间'), prop: 'updateTime', width: '170' }
      ]
    },
    tableBtn() {
      return [
        { name: '查看', type: 'look', icon: '', permissions: '' },
        { name: '编辑', type: 'edit', icon: '', permissions: 'medicalinfo_edit' }
      ].filter((item) => !item.permissions || this.permissions[item.permissions] || item.type === 'look')
    }
  },
  methods: {
    getList() {
      const params = { ...this.pagination, ...this.searchFrom }
      if (params.schoolId) {
        params.schoolIds = [params.schoolId]
        delete params.schoolId
      }
      getMedicalInfoPage(params).then((res) => {
        if (res.data.success) {
          const { data, total } = res.data.data
          this.paginationTotal = total
          this.tableData = data || []
          this.formatData()
        }
      })
    },
    formatData() {
      const yesText = this.$t('schoolDoctor.是')
      const noText = this.$t('schoolDoctor.否')
      this.tableData.forEach((item) => {
        item.dormitoryStatusText = item.dormitoryStatus === 1 ? yesText : item.dormitoryStatus === 0 ? noText : '-'
        item.hasAllergenText = item.hasAllergen === 1 ? yesText : item.hasAllergen === 0 ? noText : '-'
        item.regularMedicationText = item.regularMedication === 1 ? yesText : item.regularMedication === 0 ? noText : '-'
        item.hasDiseaseText = item.hasDisease === 1 ? yesText : item.hasDisease === 0 ? noText : '-'
        item.operator = this.formatOperator(item)
      })
    },
    /** 操作者：小程序来源显示家长，后台新增显示操作账号 */
    formatOperator(item) {
      const source = [item.source, item.sourceType, item.applicantType].find(
        (value) => value !== null && value !== undefined
      )
      if (source === 1 || source === '1' || source === 'mini' || /mini|小程序|家长/i.test(String(item.operator || ''))) {
        return this.$t('schoolDoctor.家长')
      }
      return item.operator || item.creator || '-'
    },
    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id)
    },
    playTab(name, item) {
      this.$refs.Detail.showModal(name, item)
    },
    showModal(type, item = {}) {
      this.$refs.Detail.showModal(type, item)
    },
    handleBatchDel() {
      if (!this.selectedIds.length) return
      this.$confirm(this.$t('schoolDoctor.将永久删除勾选的内容确认删除'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        delMedicalInfo(this.selectedIds).then((res) => {
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
      this.getList()
    },
    handleCurrentChange(page) {
      this.pagination.current = page
      this.getList()
    },
    handleFileChange(file) {
      if (!file || !file.raw) return
      this.importLoading = true
      importMedicalInfo(file.raw)
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
      this.$confirm(this.$t('schoolDoctor.确定导出当前筛选条件下的医疗信息吗？'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      })
        .then(() => {
          const params = { ...this.searchFrom }
          if (params.schoolId) {
            params.schoolIds = [params.schoolId]
            delete params.schoolId
          }
          exportMedicalInfo(params).then((res) => {
            const cd = res.headers['content-disposition']
            if (cd && cd.indexOf('=') !== -1) {
              download(res.data, cd)
            } else {
              downloadFile(res.data, this.$t('schoolDoctor.医疗信息.xlsx'))
            }
            this.$message.success(this.$t('schoolDoctor.导出成功'))
          })
        })
        .catch(() => {})
    }
  }
}
</script>
