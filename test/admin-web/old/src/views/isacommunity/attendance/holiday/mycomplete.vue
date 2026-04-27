<template>
  <div class="mod-config mycomplete-dialog">
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
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="flowDefId"
        header-align="center"
        align="center"
        :label="$t('attendance.流程定义ID')">
      </el-table-column>
      <el-table-column
        prop="flowDefName"
        header-align="center"
        align="center"
        :label="$t('attendance.流程名称')">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        :label="$t('attendance.发起人')">
      </el-table-column>
        <el-table-column
        prop="studentSchool"
        header-align="center"
        align="center"
        :label="$t('attendance.学校')">
      </el-table-column>
        <el-table-column
        prop="studentName"
        header-align="center"
        align="center"
        :label="$t('attendance.学生姓名')">
      </el-table-column>
        <el-table-column
        prop="studentName"
        header-align="center"
        align="center"
        :label="$t('attendance.学生姓名')">
      </el-table-column>
      <el-table-column
        prop="startDate"
        header-align="center"
        align="center"
        :label="$t('attendance.发起时间')">
      </el-table-column>
      <el-table-column
        prop="endDate"
        header-align="center"
        align="center"
        :label="$t('attendance.结束时间')">
      </el-table-column>

      <el-table-column
        prop="flowProceId"
        header-align="center"
        align="center"
        :label="$t('attendance.实例ID')">
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

       <div style="height: 300px;margin-left: 40px;">

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
    import { myCompleteTask,showProcessImgActive,getHiTaskInstance } from '@/api/isacommunity/holiday'
  export default {
    data () {
      return {
        procInsId:'',
        dataForm: {
          key: ''
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
        myCompleteTask({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key,
        }).then((res) => {
          
     
            this.dataList = res.list
            this.totalPage = res.totalCount   
        
          this.dataListLoading = false
        })
      },
      approveHandle(id){
        this.id = id
         this.dialogVisible = true
      },showFlowHandle(procInsId){
        this.procInsId = procInsId
        // 通过流程实例id查询对应的流转记录
        getHiTaskInstance(procInsId).then((res) => {
          console.log(res,'aaaaaaaaaaaaaaaaaa')
          this.hiTasks = res
        })
        // 查看流程进度图片
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


      },unclaimHandle(id){
        this.$confirm('确定要归还当前的任务吗?', this.$t('attendance.提示'), {
          confirmButtonText: this.$t('attendance.确定'),
          cancelButtonText: this.$t('attendance.取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
              url: this.$http.adornUrl(`/flw/instance/unclaimTask/${id}`),
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? this.$t('attendance.删除') : this.$t('attendance.批量删除')}]操作?`, this.$t('attendance.提示'), {
          confirmButtonText: this.$t('attendance.确定'),
          cancelButtonText: this.$t('attendance.取消'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/flow/flwdemodel/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: this.$t('attendance.操作成功'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss">
.mycomplete-dialog {
 .el-step {
  margin-bottom: 0px !important;
}
}

</style>
