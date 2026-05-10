<template>
  <div class="mod-config myinstance-dialog">
 <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="display: flex; align-items: center;">
  <!--  
  <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('attendance.参数名')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('attendance.查询') }}</el-button>
      </el-form-item>
      -->
    </el-form>
    <el-table
      :data="dataList"
      :header-cell-style="headercellstyle"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%; font-size: 14px;">
   

      <el-table-column
        prop="flowDefId"
        header-align="center"
        align="center"
        :label="$t('attendance.流程定义ID')" show-overflow-tooltip
        width="200px">
      </el-table-column>
      <el-table-column
        prop="flowDefName"
        header-align="center"
        align="center"
        :label="$t('attendance.流程名称')" show-overflow-tooltip
        width="200px">
           
      </el-table-column>
       <el-table-column
        prop="studentSchool"
        header-align="center"
        align="center"
        :label="$t('attendance.学校')" show-overflow-tooltip
        width="200px">
      </el-table-column>
        <el-table-column
        prop="studentName"
        header-align="center"
        align="center"
        :label="$t('attendance.学生姓名')" show-overflow-tooltip
        width="200px">
      </el-table-column>
    
      <el-table-column
        prop="startDate"
        header-align="center"
        align="center"
        :label="$t('attendance.发起时间')" show-overflow-tooltip
        width="200px">
      </el-table-column>
      <el-table-column
        prop="endDate"
        header-align="center"
        align="center"
        :label="$t('attendance.结束时间')" show-overflow-tooltip
        width="200px">
      </el-table-column>

      <el-table-column
        prop="flowProceId"
        header-align="center"
        align="center"
        :label="$t('attendance.实例ID')" show-overflow-tooltip
        width="200px">
      </el-table-column>


      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('attendance.操作')">
        <template slot-scope="scope">

          <el-button type="text"  size="small" @click="showFlowHandle(scope.row.flowProceId)">{{ $t('attendance.查看流程进度') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
     <div class="community_pagination">
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    </div>
    <el-dialog
      :title="$t('attendance.流程审批')"
      :visible.sync="dialogVisible"
      width="30%">
      <div style="height: auto;margin-bottom: 30px;">
        <el-form   label-width="100px" class="demo-dynamic">
          <el-form-item>
            <el-button type="primary"  @click="submitFlowComplete()">{{ $t('attendance.审批通过') }}</el-button>
          </el-form-item>
          </el-form>
      </div>
    </el-dialog>

  <el-dialog
      :title="$t('attendance.流程图')"
      :visible.sync="dialogActiveVisible"
      width="80%">
      <div style="height: auto;margin-bottom: 30px;">
      <img :src="flowImg"  height="auto" style="max-width: 100%;">
      </div>

       <div style="margin-left: 40px;">

        <el-steps direction="vertical" >
          <el-step
          v-for="item in hiTasks"
          :key="item.id"
          :status="item.status"
          :description="item.remark"
          :title="item.taskNodeName+'  审批人:' + item.assigneeName +'   ' + item.startTime " style="margin-bottom: 10px;"></el-step>

        </el-steps>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { myStartTask,showProcessImgActive,getHiTaskInstance } from '@/api/isacommunity/holiday'
  export default {
    data () {
      return {
        procInsId:'',
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
        flowImg:'',
        dataList: [],
        hiTasks:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogVisible:false,
        dialogActiveVisible:false,
        id:''
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        myStartTask({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key,
        }).then((res) => {
          console.log(res,'res')
          this.dataList = res.list
          this.totalPage = res.totalCount   
          this.dataListLoading = false
        })
      },approveHandle(id){
        this.id = id
         this.dialogVisible = true
      },
      showFlowHandle(procInsId){
        this.procInsId = procInsId
         getHiTaskInstance(procInsId).then((res) => {
        console.log(res,'aaaaaaaaaaaaaaaaaa')
        this.hiTasks = res
      })
        showProcessImgActive(procInsId).then((res) => {
          const blob = new Blob([res.data], { type: 'image/png' })
          this.flowImg = URL.createObjectURL(blob)
          this.dialogActiveVisible = true
        })
      },submitFlowComplete(){
        // 做审批通过的操作
        this.$http({
              url: this.$http.adornUrl(`/flw/instance/completeFlow/${this.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dialogVisible = false
                this.getDataList();
              }
            })
      },claimHandle(id){

        this.$confirm('确定要拾取当前的任务吗?', this.$t('attendance.提示'), {
          confirmButtonText: this.$t('attendance.确定'),
          cancelButtonText: this.$t('attendance.取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
              url: this.$http.adornUrl(`/flw/instance/claimTask/${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.getDataList();
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('attendance.已取消删除')
          });
        });


      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

    }
  }
</script>
<style lang="scss">
.myinstance-dialog {

 .el-step {
  margin-bottom: 0px !important;
}
}

</style>
