<template>
  <div class="mod-config mytask-dialog">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
      style="display: flex; align-items: center;">
      <!--  
  <el-form-item>
        <el-input v-model="dataForm.key" :placeholder="$t('attendance.参数名')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('attendance.查询') }}</el-button>
      </el-form-item>
      -->
    </el-form>
    <el-table :data="dataList"  v-loading="dataListLoading" @selection-change="selectionChangeHandle"
      :header-cell-style="headercellstyle"
      style="width: 100%; font-size: 14px;">
        
      <el-table-column prop="taskId" header-align="center" align="center" :label="$t('attendance.任务编号')" show-overflow-tooltip
        width="200px">
      </el-table-column>
      </el-table-column>
      <el-table-column prop="taskName" header-align="center" align="center" :label="$t('attendance.任务名称')" show-overflow-tooltip
        width="200px">
      </el-table-column>
     
      <el-table-column prop="procDefName" header-align="center" align="center" :label="$t('attendance.流程名称')" show-overflow-tooltip
        width="200px">
      </el-table-column>
  

      <el-table-column prop="startUserName" header-align="center" align="center" :label="$t('attendance.流程发起人')" show-overflow-tooltip
        width="200px">
      </el-table-column>
 <el-table-column prop="studentSchool" header-align="center" align="center" :label="$t('attendance.学校')" show-overflow-tooltip
        width="200px">
      </el-table-column>
      <el-table-column prop="studentName" header-align="center" align="center" :label="$t('attendance.学生姓名')" show-overflow-tooltip
        width="200px">
      </el-table-column>

      <el-table-column prop="startTime" header-align="center" align="center" :label="$t('attendance.流程发起时间')">
      </el-table-column>
    
      <!--
      <el-table-column prop="procDefId" header-align="center" align="center" :label="$t('attendance.流程定义ID')">
      </el-table-column>
      <el-table-column prop="procInsId" header-align="center" align="center" :label="$t('attendance.流程实例ID')">
      </el-table-column>
      -->
      <el-table-column prop="assigneeName" header-align="center" align="center" :label="$t('attendance.审批人')">
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t('attendance.操作')">
        <template slot-scope="scope">
       
          <el-button type="text" v-if="scope.row.assigneeName !== null"
            size="small"
            @click="approveHandle(scope.row.procInsId, scope.row.procDefId, scope.row.taskDefKey, scope.row.taskId, scope.row.taskName)">{{
              $t('attendance.审批') }}</el-button>


          <el-button type="text" size="small" @click="showFlowHandle(scope.row.procInsId)">{{ $t('attendance.查看流程进度')
            }}</el-button>
        </template>
      </el-table-column>
    </el-table>
      <div class="community_pagination">
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
</div>
    <el-dialog :title="$t('attendance.流程审批')" :visible.sync="dialogVisible" width="50%">
      <div style="height: auto;margin-bottom: 30px;">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.学生姓名') }}:</span>
            <span class="info-value">{{ formData.studentName || formData.name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.学号') }}:</span>
            <span class="info-value">{{ formData.admissonNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.学校') }}:</span>
            <span class="info-value">{{ formData.studentSchool }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.年级') }}:</span>
            <span class="info-value">{{ formData.studentGrade }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.班级') }}:</span>
            <span class="info-value">{{ formData.studentClass }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.请假时间') }}:</span>
            <span class="info-value">{{ formData.beginTime ? formData.beginTime + ' ' + $t('attendance.至') + ' ' + formData.endTime : '-'
              }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.请假类型') }}:</span>
            <span class="info-value">{{ formData.type === '101' ? $t('attendance.事假') : formData.type === '102' ? $t('attendance.病假') :
              formData.type || formData.leaveType || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('attendance.请假范围') }}:</span>
            <span class="info-value">{{formData.scope ? formData.scope.map(item => this.getScopeLabel(item)).join(' ') : '-'}}</span>
          </div>
          <div class="info-item full-width">
            <span class="info-label">{{ $t('attendance.请假原因') }}:</span>
            <span class="info-value">{{ formData.reason || '-' }}</span>
          </div>
          <div class="info-item full-width" v-if="fileList.length > 0">
            <span class="info-label">{{ $t('attendance.附件') }}:</span>
            <div class="info-value">
              <el-upload list-type="picture-card" :file-list="fileList" 
                :on-preview="handlePictureCardPreview" disabled>
              </el-upload>
            </div>
          </div>
          <div class="info-item full-width" v-if="taskName == '护士审批'">
            <span class="info-label required">{{ $t('attendance.传染病') }}:</span>
            <div class="info-value">
              <el-radio-group v-model="formData.isInfectious">
                <el-radio label="101">{{ $t('attendance.是') }}</el-radio>
                <el-radio label="102">{{ $t('attendance.否') }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="info-item full-width" v-if="taskName == '护士审批' && formData.isInfectious == '101'">
            <span class="info-label">{{ $t('attendance.延期时间') }}:</span>
            <div class="info-value">
              <el-date-picker v-model="formData.dateRange" type="datetime" 
                :placeholder="$t('attendance.请选择延期时间')"
                  format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width: 100%"
                  size="medium" ></el-date-picker>


                     
            </div>
          </div>
          <div class="info-item full-width">
            <el-input v-model="formData.remark" type="textarea" :rows="3" :placeholder="$t('attendance.备注')"></el-input>
          </div>
          <div class="info-item full-width" style="margin-bottom: 22px;">
            <el-button type="primary" @click="submitFlowComplete()" :loading="submitLoading">{{ $t('attendance.审批通过') }}</el-button>
            <el-button type="danger" @click="rejectTaskHandle()" :loading="submitLoading">{{
              $t('attendance.审批拒绝') }}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :title="$t('attendance.流程图')" :visible.sync="dialogActiveVisible" width="80%">
      <div style="height: auto;margin-bottom: 30px;">
        <img :src="flowImg" height="auto" style="max-width: 100%;">
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

    <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
      <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
    </el-dialog>

   


    <div v-if="dialogVisible6">
      <add :dialog-visible.sync="dialogVisible6" :edit-data="editData" @dialog-cancel="closeConditionDialog"
        @dialog-submit="submitConditionDialog" />
    </div>


  </div>
</template>

<script>
import { myTask, showProcessImgActive, completeTask, getFormByBussId, rejectTask, getHiTaskInstance } from "@/api/isacommunity/holiday.js";

import add from './dialog/add.vue'
export default {
  components: { add },
  data() {
    return {
      procInsId: '',
      taskDefKey: '',
      dataForm: { key: '' },

      dialogVisible6: false,
      flowImg: '',
      hiTasks: [],
      fileList: [],
      procDefId: '',
      dialogVisible2: false,
      dialogImageUrl: '',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      taskId: '',
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dialogVisible: false,
      dialogActiveVisible: false,
      rejectAssignee: '',
      assigneeList: [],
      taskName: '',
      headercellstyle: {
        background: "#F5F8FD",
        color: "#333333 !important",
        "font-size": "14px",
        "font-weight": "400",
        height: "38px",
        "font-family": "AlibabaPuHuiTiM",
      },
      id: '',
      formData: { remark: '', isInfectious: '', dateRange: '' },
      dialogVisible6: false,
      editData: null,
      submitLoading: false
    }
  },
  activated() {
    this.getDataList()

  },
  components: {
    add
  },
  methods: {

 
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      myTask({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'key': this.dataForm.key,
      }).then((res) => {
        console.log(res, 'res')

        this.dataList = res.list
        this.totalPage = res.totalCount

        this.dataListLoading = false
      })
    },
    handlePictureCardPreview(file) {
      this.dialogVisible2 = true;
      this.dialogImageUrl = file.url;

    },
    rejectTaskHandle() {
      if (this.submitLoading) return
      this.submitLoading = true

      let params = {
        processInstanceId: this.procInsId,
      }

      console.log(params, 'confirmRejectparams')

      rejectTask(params).then((res) => {
        this.$message.success('拒绝成功')
        this.dialogVisible = false
        this.submitLoading = false
        this.getDataList() // 刷新数据列表
      }).catch(() => {
        this.submitLoading = false
      })

    },
  
    // 关闭添加对话框
    closeConditionDialog() {
      this.dialogVisible6 = false
      this.editData = null
    },
    // 提交添加对话框
    submitConditionDialog() {
      this.dialogVisible6 = false
      this.editData = null
      this.getDataList() // 刷新数据列表
    },

  
 
    approveHandle(procInsId, procDefId, taskDefKey, taskId, taskName) {
      this.procDefId = procDefId
      this.taskDefKey = taskDefKey
      this.taskId = taskId
      this.taskName = taskName


      this.procInsId = procInsId
      //这里需要表单数据展示出来
      getFormByBussId({ processId: procInsId }).then((res) => {
        console.log(res, 'getFormByBussId res')
          // 正常审批操作
          // 先创建一个新对象，确保它是Vue的响应式对象

          // 确保isInfectious的值是有效的
          this.$nextTick(() => {
            // 这里可以访问更新后的 DOM
            this.formData = res
            console.log(this.formData, 'this.formDaaaaaaaata')
            this.fileList = this.formData.files.map(item => ({
              id: item,
              url: item
            }))
            this.dialogVisible = true
            if (this.taskName == '护士审批') {
              this.formData.isInfectious = '102'
            }


          });


       
      })
    },
    showFlowHandle(procInsId) {
      getHiTaskInstance(procInsId).then((res) => {
        console.log(res, 'aaaaaaaaaaaaaaaaaa')
        this.hiTasks = res
      })
      showProcessImgActive(procInsId).then((res) => {
        const blob = new Blob([res.data], { type: 'image/png' })
        this.flowImg = URL.createObjectURL(blob)
        this.dialogActiveVisible = true
      })


    },
    submitFlowComplete() {
      if (this.submitLoading) return
      this.submitLoading = true

      
      // 做审批通过的操作
      let params = {
        id: this.taskId,
        procInsId: this.procInsId,
        processId: this.processId,
        remark: this.formData.remark || '审批通过',
        isInfectious: this.formData.isInfectious
      }

       if (this.formData.dateRange  && this.formData.isInfectious == '101') {
        params.endTime = this.formData.dateRange
      }


      console.log(params, 'submitFlowComplete params')
     


      completeTask(params).then((res) => {
        console.log(res, 'completeTask res')
        this.dialogVisible = false
        this.submitLoading = false
        this.getDataList();
      }).catch(() => {
        this.submitLoading = false
      })
    },
    confirmRemark() {
      // 确认备注操作
      this.dialogVisible = false
      this.getDataList();
    },
    cancelRemark() {
      // 取消操作
      this.dialogVisible = false
    },
    claimHandle(id) {

      this.$confirm('确定要拾取当前的任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/flw/instance/claimTask/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    unclaimHandle(id) {
      this.$confirm('确定要归还当前的任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/flw/instance/unclaimTask/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/flow/flwdemodel/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
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
    },
    // 获取scope标签
    getScopeLabel(value) {
      const scopeMap = {
        course: this.$t('attendance.课程'),
        dorm: this.$t('attendance.宿舍'),
        bus: this.$t('attendance.校巴')
      }
      return scopeMap[value] || value
    }
  }
}
</script>

<style lang="scss">
.mytask-dialog {
  .el-step {
    margin-bottom: 0px !important;
  }

  .el-upload--picture-card {
    display: none;
  }
}

.demo-dynamic {
  display: flex;
  flex-wrap: wrap;
}

.demo-dynamic .el-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 50%;
  box-sizing: border-box;
  padding-right: 20px;
}

.demo-dynamic .el-form-item__label {
  flex: 0 0 auto;
  text-align: right;
  margin-right: 8px;
  white-space: nowrap;
}

.demo-dynamic .el-form-item__content {
  flex: 1;
  min-width: 0;
}

.demo-dynamic .full-width {
  width: 100% !important;
}

.demo-dynamic .no-label-margin .el-form-item__content {
  margin-left: 0 !important;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  width: 50%;
  box-sizing: border-box;
  padding-right: 20px;
}

.info-item.full-width {
  width: 100%;
}

.info-label {
  flex: 0 0 auto;
  text-align: right;
  margin-right: 8px;
  white-space: nowrap;
  color: #606266;
}

.info-label.required::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.info-value {
  flex: 1;
  min-width: 0;
  color: #303133;
}
</style>
