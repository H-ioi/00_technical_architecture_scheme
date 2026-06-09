<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('schoolDoctor.学生档案') }}</div>
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

              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="searchFrom.status" clearable :placeholder="$t('schoolDoctor.档案状态')">
                    <el-option :label="$t('schoolDoctor.待完善')" :value="0" />
                    <el-option :label="$t('schoolDoctor.已建档')" :value="1" />
                    <el-option :label="$t('schoolDoctor.注销')" :value="2" />
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
            <el-button :disabled="!selectedIds.length" size="mini" type="danger" @click="handleBatchCancel">{{ $t('btn.删除') }}</el-button>
          </div>

          <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange" />
        </div>
      </div>
    </div>

    <Detail ref="Detail" @getList="getList" />
  </div>
</template>

<script>
import { batchCancelMedicalArchive, getMedicalArchivePage } from '@/api/isacommunity/medicalArchive'

import Pagination from '@/components/communitycommon/Pagination.vue'

import Table from '@/components/communitycommon/Table.vue'

import schoolListBuscommonMixin from '@/mixins/schoolListBuscommon.js'
import { mapGetters } from 'vuex'
import Detail from './detail.vue'

export default {
  name: 'StudentRecord',
  components: { Table, Pagination, Detail },
  mixins: [schoolListBuscommonMixin],
  data() {
    return {
      pagination: { size: 10, current: 1 },
      paginationTotal: 0,
      searchFrom: {},
      tableData: [],
      selectedIds: [],
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
        {
          label: this.$t('schoolDoctor.是否住宿'),
          prop: 'dormitoryStatusText',
          width: '100'
        },
        {
          label: this.$t('schoolDoctor.是否有过敏原'),
          prop: 'hasAllergenText',
          width: '120'
        },
        {
          label: this.$t('schoolDoctor.是否定期服用药物'),
          prop: 'regularMedicationText',
          width: '160'
        },
        {
          label: this.$t('schoolDoctor.是否有疾病'),
          prop: 'hasDiseaseText',
          width: '120'
        },
        {
          label: this.$t('schoolDoctor.档案状态'),
          prop: 'statusText',
          width: '100'
        },
        { label: this.$t('schoolDoctor.创建者'), prop: 'creator' },
        {
          label: this.$t('schoolDoctor.创建时间'),
          prop: 'createTime',
          width: '170'
        },
        {
          label: this.$t('schoolDoctor.更新时间'),
          prop: 'updateTime',
          width: '170'
        }
      ]
    },
    tableBtn() {
      return [
        { name: '查看', type: 'look', icon: '', permissions: '' },
        { name: '编辑', type: 'edit', icon: '', permissions: 'medicalarchive_edit' }
      ].filter((item) => !item.permissions || this.permissions[item.permissions] || item.type === 'look')
    }
  },
  methods: {
    getList() {
      getMedicalArchivePage({ ...this.pagination, ...this.searchFrom }).then((res) => {
        if (res.data.success) {
          const { data, total } = res.data.data

          this.paginationTotal = total

          this.tableData = data || []

          this.formatData()
        }
      })
    },
    formatData() {
      const statusMap = {
        0: this.$t('schoolDoctor.待完善'),
        1: this.$t('schoolDoctor.已建档'),
        2: this.$t('schoolDoctor.注销')
      }

      const yesText = this.$t('schoolDoctor.是')

      const noText = this.$t('schoolDoctor.否')

      this.tableData.forEach((item) => {
        item.statusText = item.statusName || statusMap[item.status] || '-'

        item.dormitoryStatusText = item.dormitoryStatus === 1 ? yesText : item.dormitoryStatus === 0 ? noText : '-'

        item.hasAllergenText = item.hasAllergen === 1
          ? this.$t('schoolDoctor.有过敏源')
          : item.hasAllergen === 0 ? noText : '-'

        item.regularMedicationText = item.regularMedication === 1
          ? this.$t('schoolDoctor.有长期使用药物')
          : item.regularMedication === 0 ? noText : '-'

        item.hasDiseaseText = item.hasDisease === 1 ? yesText : item.hasDisease === 0 ? noText : '-'
      })
    },
    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id)
    },
    playTab(name, item) {
      this.$refs.Detail.showModal(name, item)
    },
    handleBatchCancel() {
      if (!this.selectedIds.length) return

      this.$confirm(this.$t('schoolDoctor.将永久删除勾选的内容确认删除'), this.$t('schoolDoctor.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        batchCancelMedicalArchive(this.selectedIds).then((res) => {
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
    }
  }
}
</script>
