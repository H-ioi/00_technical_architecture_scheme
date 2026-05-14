<template>
  <div class="leave-manage">
    <div class="community_searchFrom">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
        style="display: flex; align-items: center; flex-wrap: wrap;">
        <el-form-item>
          <el-select v-model="dataForm.school" :placeholder="$t('attendance.学校')" clearable>
            <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName"
              :value="school.enName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.keyword" :placeholder="$t('attendance.学号/姓名')" clearable
            style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.scp" :placeholder="$t('dorm.是否分配')" clearable style="width: 100px;">
            <el-option :label="$t('attendance.是')" value="1"></el-option>
            <el-option :label="$t('attendance.否')" value="0"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.scp" :placeholder="$t('dorm.楼层')" clearable style="width: 100px;">
            <el-option :label="$t('attendance.是')" value="1"></el-option>
            <el-option :label="$t('attendance.否')" value="0"></el-option>

          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="dataForm.scp" :placeholder="$t('dorm.房间号')" clearable style="width: 100px;">
            <el-option :label="$t('attendance.是')" value="1"></el-option>
            <el-option :label="$t('attendance.否')" value="0"></el-option>

          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="dataForm.scp" :placeholder="$t('dorm.属性')" clearable style="width: 100px;">
            <el-option :label="$t('attendance.是')" value="1"></el-option>
            <el-option :label="$t('attendance.否')" value="0"></el-option>

          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker v-model="dataForm.dateRange" type="date" range-separator="~" :placeholder="$t('dorm.入住日期')"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 200px" size="medium"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="button-group" style="margin-top: 10px;">
            <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
              $t("btn.重置") }}</el-button>
            <el-button @click="getDataList()" type="primary">{{ $t('attendance.查询') }}</el-button>
          </div>
        </el-form-item>
      </el-form>



    </div>

    <div class="isa_table">
      <el-table :data="dataList" fit v-loading="dataListLoading" @selection-change="selectionChangeHandle"
        :header-cell-style="headercellstyle" style="width: 100%; font-size: 14px;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="admissonNo" header-align="center" align="center" :label="$t('attendance.学号')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="studentName" header-align="center" align="center" :label="$t('attendance.姓名')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="studentSchool" header-align="center" align="left" :label="$t('attendance.学校')"
          show-overflow-tooltip width="200px">
        </el-table-column>
        <el-table-column prop="studentGrade" header-align="center" align="center" :label="$t('attendance.年级')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="studentClass" header-align="center" align="center" :label="$t('attendance.班级')"
          show-overflow-tooltip width="120">
        </el-table-column>




        <el-table-column prop="reason" header-align="center" align="center" :label="$t('isagroup.国籍')"
          show-overflow-tooltip width="120">
        </el-table-column>

        <el-table-column prop="dateString" header-align="center" align="center" :label="$t('isagroup.性别')"
          show-overflow-tooltip width="200">
        </el-table-column>


        <el-table-column prop="extendTime" header-align="center" align="center" :label="$t('isagroup.出生日期')"
          show-overflow-tooltip width="120">

        </el-table-column>

        <el-table-column prop="isInfectious" header-align="center" align="center" :label="$t('dorm.是否过过敏原')"
          show-overflow-tooltip width="120">
          <template slot-scope="scope">
            {{ scope.row.isInfectious === '101' ? $t('attendance.是') : scope.row.isInfectious === '102' ?
              $t('attendance.否') : '-' }}
          </template>
        </el-table-column>


        <el-table-column prop="cancelLeave" header-align="center" align="center" :label="$t('dorm.是否定期服用药物')"
          width="150">
          <template slot-scope="scope">
            {{ getHolidayEndStatusText(scope.row.cancelLeave) }}
          </template>
        </el-table-column>
        <el-table-column prop="weekDays" header-align="center" align="center" :label="$t('dorm.是否分配')"
          show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.weekDays" :key="index" type="primary" size="small"
              style="margin-right: 5px;">
              {{ getWeekDaysText(item) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" header-align="center" align="center" :label="$t('dorm.属性')" />
        <el-table-column prop="status" header-align="center" align="center" :label="$t('dorm.楼层')" />
        <el-table-column prop="status" header-align="center" align="center" :label="$t('dorm.房间号')" />




      </el-table>
      <div class="df_sb isa_table_footer">
        <div>
          <el-button size="small" type="danger" @click="deleteHandle">{{ $t('attendance.删除') }}</el-button>
          <el-button size="small" type="danger" @click="addItem">{{ $t('dorm.批量分配') }}</el-button>
          <el-button size="small" type="danger" @click="checkOut">{{ $t('dorm.批量退宿') }}</el-button>
        </div>
        <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
          @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { listHoliday, getSchoolList } from '@/api/isacommunity/holiday'
import Pagination from "@/components/communitycommon/Pagination.vue";

import { headercellstyle } from './common-style.js';

export default {
  name: 'CurrentStudentBoarding',
  components: { Pagination },
  data() {
    return {
      dataForm: {
        keyword: '',
        type: '',
        school: '',
        dateRange: [],
        scp: ''
      },
      isViewMode: false,
      pagination: {
        size: 10,
        current: 1,
      },
      headercellstyle,
      cancelDialogVisible: false,
      paginationTotal: 0,
      cancelData: null,
      dataList: [],
      dialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      schoolList: []
    }
  },
  mounted() {
    this.getDataList();
    this.loadSchoolList();
  },
  methods: {
    // 获取数据列表
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },


    submitConditionDialog(formData) {
      this.dialogVisible = false
      this.getDataList()
    },
    submitCancelDialog(formData) {
      this.cancelDialogVisible = false
      this.getDataList()
    },
    getDataList() {

      this.dataListLoading = true;
      const params = {
        ...this.pagination,
        keyword: this.dataForm.keyword,
        studentSchool: this.dataForm.school,

      };
      listHoliday(params).then((res) => {
        this.dataList = res.records
        this.paginationTotal = res.total
      
        this.dataListLoading = false
      }).catch(err => {
        console.error(err);
        this.dataListLoading = false
      })
    },
    deleteHandle() {
      if (this.dataListSelections.length === 0) {
        this.$message({
          message: this.$t('attendance.请选择要删除的项'),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.$confirm(this.$t('attendance.确定删除操作'), this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
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
          this.$message.success(this.$t('attendance.操作成功'));
        }).catch(err => {
          console.error(err);
          this.dataListLoading = false
        })
      }).catch(() => {
        // 取消删除
      });
    },
    checkOut() {
      if (this.dataListSelections.length === 0) {
        this.$message({
          message: this.$t('attendance.请选择要操作的项'),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.$confirm(this.$t('dorm.是否确认给选中学生批量分配退宿？'), this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
        // 在这里编写批量退宿的接口调用逻辑
        this.$message.success(this.$t('attendance.操作成功'));
        this.getDataList();
      }).catch(() => {
        // 取消操作
      });
    },
    // 加载学校列表
    loadSchoolList() {

      this.$nextTick(async () => {
        let res = await getSchoolList()
        this.schoolList = res.data.data
      });

    },



    // 重置
    clear() {
      this.dataForm = {
        keyword: '',
        type: '',
        school: '',
        dateRange: [],
        scp: ''
      };
      this.getDataList()
    },
    // 新增
    addItem() {
      this.editData = null // 新增时重置编辑数据
      this.dialogVisible = true
      this.isViewMode = false;
    },

    cancelHandle(row) {

      this.cancelData = row
      this.cancelDialogVisible = true


    },



    // 编辑
    editForm(row) {
      this.editData = JSON.parse(JSON.stringify(row)) // 深拷贝避免直接修改原数据
      this.isViewMode = true
      this.dialogVisible = true
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
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
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
        '101': this.$t('attendance.已撤销'),
        '104': this.$t('attendance.已销假'),
        '1101': this.$t('attendance.休假中'),
        '1102': this.$t('attendance.已结束'),
        '1103': this.$t('attendance.待休假')
      }
      return statusMap[status] || '-'
    },

    getWeekDaysText(status) {
      const statusMap = {
        'monday': this.$t('attendance.周一'),
        'tuesday': this.$t('attendance.周二'),
        'wednesday': this.$t('attendance.周三'),
        'thursday': this.$t('attendance.周四'),
        'friday': this.$t('attendance.周五'),

      }
      return statusMap[status] || '-'
    },


    getHolidayEndStatusText(status) {
      const statusMap = {
        '100': this.$t('attendance.待审批'),
        '102': this.$t('attendance.已销假'),
        '101': this.$t('attendance.未销假'),

      }
      return statusMap[status] || this.$t('attendance.未销假')
    }


  }
}
</script>

<style scoped lang="scss">
/* 修复固定列穿透和层级问题 */
::v-deep .el-table {
  .el-table__fixed-right {
   
    background-color: #ffffff;
   
  }
 
}



.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>