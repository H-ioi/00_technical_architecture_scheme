<template>
  <div class="community_page">

    <div class="community_top">
      <div class="community_top_title">{{ $t("dorm.自动分配规则") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" @click="addItem">{{ $t('attendance.新增') }}</el-button>
      </div>
    </div>
    <div class="community_centent">
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
            <el-input v-model="dataForm.keyword" :placeholder="$t('dorm.规则名')" clearable
              style="width: 150px;"></el-input>
          </el-form-item>


          <el-form-item>
            <el-select v-model="dataForm.scp" :placeholder="$t('dorm.状态')" clearable style="width: 140px;">
              <el-option :label="$t('dorm.启用')" value="1"></el-option>
              <el-option :label="$t('dorm.禁用')" value="0"></el-option>

            </el-select>
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

          <el-table-column prop="studentSchool" header-align="center" align="left" :label="$t('attendance.学校')"
            show-overflow-tooltip>
          </el-table-column>




          <el-table-column prop="admissonNo" header-align="center" align="center" :label="$t('dorm.规则名')"
            show-overflow-tooltip>
          </el-table-column>



          <el-table-column prop="status" header-align="center" align="center" :label="$t('attendance.状态')">
            <template slot-scope="scope">
              {{ getStatusText(scope.row.status) }}
            </template>
          </el-table-column>


          <el-table-column fixed="right" header-align="center" align="center" width="250" :label="$t('attendance.操作')">
            <template slot-scope="scope">
              <a type="text" size="small" @click="editForm(scope.row)" class="text-btn">{{ $t("btn.查看") }} </a>
              <a type="text" size="small" @click="editForm(scope.row)" class="text-btn">{{ $t("btn.编辑") }} </a>
            </template>
          </el-table-column>
        </el-table>



        <div class="df_sb isa_table_footer">
          <div>
            <el-button size="small" type="danger" plain @click="deleteHandle">{{ $t("btn.删除") }}</el-button>
          </div>
          <Pagination :total="paginationTotal" :pagination="pagination" @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange" />
        </div>


      </div>

    </div>

    <rule-model :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode"
      @dialog-submit="submitConditionDialog" @dialog-cancel="closeConditionDialog" />
  </div>
</template>

<script>
import { listHoliday, cancelFlow, getSchoolList } from '@/api/isacommunity/holiday'
import Pagination from "@/components/communitycommon/Pagination.vue";
import RuleModel from './rule-model.vue';

import { headercellstyle } from '../common-style.js';

export default {
  name: 'RuleManage',
  components: { Pagination, RuleModel },
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
      editData: null,
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
        
      }).catch(() => {
        // 取消删除
      });
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
      this.dataListLoading = true
      const params = {
        ...this.pagination,
        scp: this.dataForm.scp,
        keyword: this.dataForm.keyword,
        type: this.dataForm.type,
        studentSchool: this.dataForm.school
      }
      // 添加时间范围参数
    
      listHoliday(params).then((res) => {
        this.dataList = res.records
        this.paginationTotal = res.total
        this.dataListLoading = false
      }).catch(err => {
        console.error(err);
        this.dataListLoading = false
      })
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

      this.dialogVisible = true;
      this.isViewMode = false;
      this.editData = null;
    },



    backHandle(procId, id) {
      this.$confirm(this.$t('attendance.确定撤销操作'), this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {

        cancelFlow(procId, id).then((res) => {
          console.log(res, 'resaaaaa')

          this.$message({
            message: this.$t('attendance.操作成功'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
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

<style scoped>

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>