<template>
  <div class="cancel-manage">
    <div class="community_searchFrom">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
        style="display: flex; align-items: center;">

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
        <el-form-item style="width: auto; margin-right: 0">
          <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
            $t("btn.重置") }}</el-button>
          <el-button @click="getDataList()" type="primary">{{ $t('attendance.查询') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="isa_table">
      <el-table :data="dataList" fit border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
        :header-cell-style="headercellstyle" style="width: 100%;">
        <el-table-column prop="studentNo" header-align="center" align="center" :label="$t('attendance.学号')" width="180">
        </el-table-column>
        <el-table-column prop="studentName" header-align="center" align="center" :label="$t('attendance.姓名')"
          width="180">
        </el-table-column>
        <el-table-column prop="studentSchool" header-align="center" align="center" :label="$t('attendance.学校')"
          width="240px">
        </el-table-column>
        <el-table-column prop="studentGrade" header-align="center" align="center" :label="$t('attendance.年级')">
        </el-table-column>
        <el-table-column prop="studentClass" header-align="center" align="center" :label="$t('attendance.班级')">
        </el-table-column>



        <el-table-column prop="backTime" header-align="center" align="center" :label="$t('attendance.返校时间')"
          width="200">

        </el-table-column>


        <el-table-column prop="createdAt" header-align="center" align="center" :label="$t('attendance.创建时间')"
          width="200">
        </el-table-column>


        <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t('attendance.操作')">
          <template slot-scope="scope">
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

    <!-- 销假弹窗 -->
    <div v-if="cancelDialogVisible">
      <cancel :dialog-visible.sync="cancelDialogVisible" :edit-data="cancelData" @dialog-cancel="closeCancelDialog"
        @dialog-submit="submitCancelDialog" />
    </div>


    <div v-if="cancelDialogVisible2">
      <cancel-view :dialog-visible.sync="cancelDialogVisible2" :edit-data="cancelData"
        @dialog-cancel="closeCancelDialog" @dialog-submit="submitCancelDialog" />
    </div>

  </div>
</template>

<script>
import { listHolidayEnd, getSchoolList } from '@/api/isacommunity/holiday'
import Pagination from "@/components/communitycommon/Pagination.vue";

import cancelView from './dialog/cancelView.vue'
export default {
  name: 'CancelManage',
  components: { Pagination, cancelView },
  data() {
    return {
      dataForm: {
        keyword: '',
        type: '',
        school: '',
        dateRange: []
      },
      headercellstyle: {
        background: "#F5F8FD",
        color: "#333333 !important",
        "font-size": "14px",
        "font-weight": "400",
        height: "38px",
        "font-family": "AlibabaPuHuiTiM",
      },
      pagination: {
        size: 10,
        current: 1,
      },
      editData: null,
      cancelData: null,
      isViewMode: false,
      cancelDialogVisible2: false,
      cancelDialogVisible: false,
      paginationTotal: 0,
      dataList: [],
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
    getDataList() {

      this.dataListLoading = true;
      const params = {
        ...this.pagination,
        keyword: this.dataForm.keyword,
        studentSchool: this.dataForm.school,

      };
      listHolidayEnd(params).then((res) => {
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
      setTimeout(() => {
        this.$nextTick(async () => {
          let res = await getSchoolList()
          this.schoolList = res.data.data
        });
      }, 2000);
    },
    // 重置
    clear() {
      this.dataForm = {
        keyword: '',
        type: '',
        school: '',
        dateRange: []
      };
      this.getDataList();
    },
    // 查看
    editForm(row) {
      this.editData = JSON.parse(JSON.stringify(row))
      this.cancelData = row
      this.isViewMode = true
      this.cancelDialogVisible2 = true

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
      this.dataListSelections = val;
    },
    // 获取状态文本

    getHolidayEndStatusText(status) {
      const statusMap = {
        '100': this.$t('attendance.销假中'),
        '102': this.$t('attendance.已销假'),
        '101': this.$t('attendance.未销假'),

      }
      return statusMap[status] || this.$t('attendance.未销假')
    }
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