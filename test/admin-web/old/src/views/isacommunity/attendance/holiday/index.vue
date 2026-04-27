<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t("isagroup.请假管理") }}</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
          style="display: flex; align-items: center;">

          <el-form-item>
            <el-select v-model="dataForm.type" :placeholder="$t('attendance.请假类型')" clearable style="width: 100px;">
              <el-option :label="$t('attendance.事假')" value="101"></el-option>
              <el-option :label="$t('attendance.病假')" value="102"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="dataForm.school" :placeholder="$t('attendance.学校')" clearable>
              <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName"
                :value="school.enName"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="dataForm.scp" :placeholder="$t('attendance.请假范围')" clearable style="width: 100px;">
              <el-option :label="$t('attendance.课程')" value="course"></el-option>
              <el-option :label="$t('attendance.宿舍')" value="dorm"></el-option>
              <el-option :label="$t('attendance.校巴')" value="bus"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="~"
              :start-placeholder="$t('attendance.开始日期')" :end-placeholder="$t('attendance.结束日期')" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" style="width: 300px" size="medium"></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-input v-model="dataForm.keyword" :placeholder="$t('attendance.学号/姓名')" clearable
              style="width: 150px;"></el-input>
          </el-form-item>

          <el-form-item style="width: auto; margin-right: 0">
            <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
              $t("btn.重置") }}</el-button>
            <el-button @click="getDataList()">{{ $t('attendance.查询') }}</el-button>
            <el-button type="primary" @click="addItem">{{ $t('attendance.新增') }}</el-button>
          </el-form-item>



        </el-form>
      </div>

      <div class="isa_table">
        <el-table :data="dataList" fit border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
          style="width: 100%;">



          <el-table-column prop="admissonNo" header-align="center" align="center" :label="$t('attendance.学号')"
            width="120">
          </el-table-column>
          <el-table-column prop="studentName" header-align="center" align="center" :label="$t('attendance.姓名')"
            width="120">
          </el-table-column>
          <el-table-column prop="studentSchool" header-align="center" align="left" :label="$t('attendance.学校')"
            width="200px">
          </el-table-column>
          <el-table-column prop="studentGrade" header-align="center" align="center" :label="$t('attendance.年级')">
          </el-table-column>
          <el-table-column prop="studentClass" header-align="center" align="center" :label="$t('attendance.班级')">
          </el-table-column>

          <el-table-column header-align="center" align="center" :label="$t('attendance.请假类型')" width="120px">
            <template slot-scope="scope">
              {{ scope.row.type === '101' ? $t('attendance.事假') : scope.row.type === '102' ? $t('attendance.病假') :
                scope.row.type }}
            </template>
          </el-table-column>




          <el-table-column prop="scope" header-align="center" align="center" :label="$t('attendance.请假范围')" width="180">
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.scope" :key="index" type="primary" size="small"
                style="margin-right: 5px;">
                {{ getScopeLabel(item) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="reason" header-align="center" align="center" :label="$t('attendance.请假原因')" width="120"
            show-overflow-tooltip>

          </el-table-column>

          <el-table-column prop="dateString" header-align="center" align="center" :label="$t('attendance.请假时间')"
            width="200">
          </el-table-column>
          <el-table-column prop="dateLimit" header-align="center" align="center" :label="$t('attendance.时段')"
            width="120">
            <template slot-scope="scope">
              <span
                v-if="scope.row.dateLimit && Array.isArray(scope.row.dateLimit) && scope.row.dateLimit.length === 2">
                {{ scope.row.dateLimit[0] }}-{{ scope.row.dateLimit[1] }}
              </span>
              <span v-else>
                -
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="isInfectious" header-align="center" align="center" :label="$t('attendance.传染病')"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.isInfectious === '101' ? $t('attendance.是') : scope.row.isInfectious === '102' ?
                $t('attendance.否') : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="fixed" header-align="center" align="center" :label="$t('attendance.固定假')">
            <template slot-scope="scope">
              {{ scope.row.fixed === '101' ? $t('attendance.是') : scope.row.fixed === '102' ? $t('attendance.否') :
                scope.row.fixed }}
            </template>

          </el-table-column>
          <el-table-column prop="weekDays" header-align="center" align="center" :label="$t('attendance.星期')"
            width="180">
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.weekDays" :key="index" type="primary" size="small"
                style="margin-right: 5px;">
                {{ item }}
              </el-tag>


            </template>
          </el-table-column>





          <el-table-column prop="status" header-align="center" align="center" :label="$t('attendance.状态')">
            <template slot-scope="scope">
              {{ getStatusText(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" header-align="center" align="center" :label="$t('attendance.创建时间')"
            width="200px">
          </el-table-column>

          <el-table-column fixed="right" header-align="center" align="center" width="120" :label="$t('attendance.操作')">
            <template slot-scope="scope">
             
              <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("btn.删除") }}</el-button>-->
              <a type="text" size="small" @click="backHandle(scope.row.procId)"
                v-if="scope.row.procId !== null && scope.row.status !== '102' && !scope.row.isEnd " class="text-btn">{{ $t("attendance.撤回")
                }}</a>
              <a type="text" size="small" @click="editForm(scope.row)" class="text-btn">{{ $t("btn.查看") }}</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="df_sb isa_table_footer">
          <div></div>
          <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
            @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </div>

      </div>
    </div>
    <!-- 详情弹窗 -->
    <div v-if="dialogVisible">
      <add :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode" @dialog-cancel="closeConditionDialog"
        @dialog-submit="submitConditionDialog" />
    </div>

  </div>
</template>

<script>

import { listHoliday, deleteHoliday, deployDef, cancelFlow } from '@/api/isacommunity/holiday'
import add from './dialog/add.vue'
import Pagination from "@/components/communitycommon/Pagination.vue";
import { getSchoolList } from "@/api/isa/index.js";
export default {
  components: { add, Pagination },
  data() {
    return {
      dataForm: {
        keyword: '',
        type: '',
        school: '',
        dateRange: []
      },
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      dataList: [],


      dialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      editData: null,
      isViewMode: false,
      schoolList: [],


    }
  },

  activated() {
    this.$nextTick(() => {
      this.getDataList()
    })
    // 加载学校列表
    getSchoolList().then(res => {
      console.log('school list:', res)
      if (res && res.data) {
        this.schoolList = res.data.data
      }
    })
  },
  methods: {
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },

    // 撤回
    backHandle(id) {
      this.$confirm(`确定对[id=${id}]进行撤回操作?`, this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
        // 撤回流程
        cancelFlow(id).then((res) => {
          console.log(res, 'resaaaaa')

          this.$message({
            message: this.$t('attendance.撤回操作成功'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
    },
    clear() {
      this.dataForm = {};
      this.getDataList()
    },
    addItem() {
      this.editData = null // 新增时重置编辑数据
      this.dialogVisible = true
      this.isViewMode = false;
    },
    submitConditionDialog(formData) {
      this.dialogVisible = false
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const params = {
        ...this.pagination,
        scp: this.dataForm.scp,
        keyword: this.dataForm.keyword,
        type: this.dataForm.type,
        studentSchool: this.dataForm.school
      }
      // 添加时间范围参数
      if (this.dataForm.dateRange && this.dataForm.dateRange.length === 2) {
        params.beginTime = this.dataForm.dateRange[0]
        params.endTime = this.dataForm.dateRange[1]
      }
      listHoliday(params).then((res) => {
        this.dataList = res.records
        this.paginationTotal = res.total

        this.dataListLoading = false
      })
    },

    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getDataList();
    },
    handleSizeChange(size) {
      this.pagination["current"] = 1;
      this.pagination["size"] = size;
      this.getDataList();
    },
    // 编辑
    editForm(row) {
      this.editData = JSON.parse(JSON.stringify(row)) // 深拷贝避免直接修改原数据
      this.isViewMode = true
      this.dialogVisible = true
    },

    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },

    deployFlowHandle(id) {
      this.$confirm(`确定对[id=${id}]进行部署操作?`, this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
        // 部署流程
        deployDef(id).then((res) => {
          console.log(res, 'resaaaaa')

          this.$message({
            message: this.$t('attendance.部署操作成功'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
    },
    // 删除
    // 获取部门标签
    getScopeLabel(value) {
      const scopeMap = {
        course: this.$t('attendance.课程'),
        dorm: this.$t('attendance.宿舍'),
        bus: this.$t('attendance.校巴')
      }
      return scopeMap[value] || value
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '1100': this.$t('attendance.待审批'),
        '102': this.$t('attendance.已拒绝'),
        '101': this.$t('attendance.已撤回'),
        '1101': this.$t('attendance.休假中'),
        '1102': this.$t('attendance.已结束'),
        '1103': this.$t('attendance.待休假')
       
      }
      return statusMap[status] || '-'
    },
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行删除操作?`, this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
        deleteHoliday(id).then((res) => {

          this.$message({
            message: this.$t('attendance.操作成功'),
            type: 'success',
            duration: 200,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
    },

  }
}
</script>

<style scoped>
/* 防止学校列内容换行 */
.el-table .el-table__cell[data-column-key="studentSchool"] {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>