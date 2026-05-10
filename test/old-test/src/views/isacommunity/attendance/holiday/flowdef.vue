<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
      style="display: flex; align-items: center;">
      <el-form-item>
        <el-input v-model="dataForm.key" clearable></el-input>
      </el-form-item>


      <el-form-item style="width: auto; margin-right: 0">
        <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
          $t("btn.重置") }}</el-button>
        <el-button @click="getDataList()" type="primary">{{ $t('attendance.查询') }}</el-button>
        <el-button type="primary" @click="addHandle">{{ $t('attendance.新增') }}</el-button>
        <span style="color: red; margin-left: 10px;">部署成功后尽量不要修改请假类型,如果需要修改,请重新部署流程定义</span>
      </el-form-item>


    </el-form>
    <el-table :data="dataList"  v-loading="dataListLoading" @selection-change="selectionChangeHandle"
      :header-cell-style="headercellstyle"
      style="width: 100%; font-size: 14px;">

      <el-table-column prop="id" header-align="center" align="center" label="ID">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="流程名称">
      </el-table-column>
      <el-table-column prop="modelKey" header-align="center" align="center" label="流程KEY">
      </el-table-column>



      <el-table-column prop="leaveType" header-align="center" align="center" label="请假类型" width="220">
        <template slot-scope="scope">
          {{ scope.row.leaveType === '101' ? '事假' : scope.row.leaveType === '102' ? '病假' : scope.row.leaveType }}
        </template>
      </el-table-column>
      <el-table-column prop="school" header-align="center" align="center" label="学校" width="220" show-overflow-tooltip>
      </el-table-column>

      <el-table-column header-align="center" align="center" label="是否需要审批" width="220">
        <template slot-scope="scope">
          {{ scope.row.needApproval === '101' ? '是' : scope.row.needApproval === '102' ? '否' : scope.row.needApproval }}
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" header-align="center" align="center" label="创建人">
      </el-table-column>
      <el-table-column prop="created" header-align="center" align="center" label="创建时间" width="150">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <a type="text" size="small" @click="editHandle(scope.row.id)" class="text-btn">编辑</a>
          <a type="text" size="small" @click="deleteHandle(scope.row.id)" class="text-btn">删除</a>
          <a type="text" size="small" @click="deployFlowHandle(scope.row.id)" class="text-btn">部署</a>
        </template>
      </el-table-column>
    </el-table>
   
    <div class="df_sb isa_table_footer">
      <div></div>
      <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
        @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
    </div>

  </div>
</template>

<script>

import { listFlowDef, deleteFlowDef, deployDef } from '@/api/isacommunity/holiday'
import Pagination from "@/components/communitycommon/Pagination.vue";

export default {
  components: { Pagination },
  data() {
    return {
      dataForm: {
        key: ''
      },
      headercellstyle: {
        background: "#F5F8FD",
        color: "#333333 !important",
        "font-size": "14px",
        "font-weight": "400",
        height: "38px",
        "font-family": "AlibabaPuHuiTiM",
      },
      dataList: [],
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      dataListLoading: false,
      dataListSelections: [],

    }
  },

  created() {

    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {

      this.dataListLoading = true
      listFlowDef({
        'page': this.pagination.current,
        'limit': this.pagination.size,
        'key': this.dataForm.key,
      }).then((res) => {
        this.dataList = res.list
        this.paginationTotal = res.totalCount

        this.dataListLoading = false
      })
    },
    // 编辑
    editHandle(id) {
      // 跳转到包含动态id的路由
      this.$router.push(`/isacommunity/attendance/holiday/flow/${id}`)
    },
    // 新增按钮处理方法
    addHandle() {
      this.$router.push('/isacommunity/attendance/holiday/flow/add')
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

    deployFlowHandle(id) {
      this.$confirm(`确定对[id=${id}]进行部署操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 部署流程
        deployDef(id).then((res) => {

          this.$message({
            message: '部署操作成功',
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
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFlowDef(id).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 200,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
    }
  }
}
</script>

<style scoped>
.text-btn {
  color: #BA8E62;
  margin-right: 10px;
  cursor: pointer;

}
</style>