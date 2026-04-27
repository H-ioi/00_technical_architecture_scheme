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
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
      style="width: 100%;">

      <el-table-column prop="taskId" header-align="center" align="center" :label="$t('attendance.任务编号')">
      </el-table-column>
      <el-table-column prop="taskName" header-align="center" align="center" :label="$t('attendance.任务名称')">
      </el-table-column>
      <!-- 任务定义KEY 
      <el-table-column prop="taskDefKey" header-align="center" align="center" :label="$t('attendance.任务KEY')">
      </el-table-column>
    -->

      <el-table-column prop="startUserName" header-align="center" align="center" :label="$t('attendance.流程发起人')">
      </el-table-column>
 <el-table-column prop="studentSchool" header-align="center" align="center" :label="$t('attendance.学校')">
      </el-table-column>
      <el-table-column prop="studentName" header-align="center" align="center" :label="$t('attendance.学生姓名')">
      </el-table-column>

      <el-table-column prop="startTime" header-align="center" align="center" :label="$t('attendance.流程发起时间')">
      </el-table-column>
      <!-- 流程定义ID 
      <el-table-column prop="procDefId" header-align="center" align="center" :label="$t('attendance.流程定义ID')">
      </el-table-column>
      <el-table-column prop="procInsId" header-align="center" align="center" :label="$t('attendance.流程实例ID')">
      </el-table-column>
      -->
      <el-table-column prop="assigneeName" header-align="center" align="center" :label="$t('attendance.审批人')">
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t('attendance.操作')">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.taskName == $t('attendance.家长申请')"
            @click="reSubmit(scope.row.procInsId, scope.row.taskId)">{{ $t('attendance.重新填单') }}</el-button>
          <el-button type="text" v-if="scope.row.assigneeName !== null && scope.row.taskName !== $t('attendance.家长申请')"
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
        <el-form :model="formData" label-width="80px" class="demo-dynamic">
          <el-form-item :label="$t('attendance.学生姓名')">
            <span>{{ formData.studentName || formData.name || '-' }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.学号')">
            <span>{{ formData.admissonNo }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.学校')">
            <span>{{ formData.studentSchool }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.年级')">
            <span>{{ formData.studentGrade }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.班级')">
            <span>{{ formData.studentClass }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.请假时间')">
            <span>{{ formData.beginTime ? formData.beginTime + ' ' + $t('attendance.至') + ' ' + formData.endTime : '-'
              }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.请假类型')">
            <span>{{ formData.type === '101' ? $t('attendance.事假') : formData.type === '102' ? $t('attendance.病假') :
              formData.type || formData.leaveType || '-' }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.请假范围')">
            <span>{{formData.scope ? formData.scope.map(item => this.getScopeLabel(item)).join(' ') : '-'}}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.请假原因')">
            <span>{{ formData.reason || '-' }}</span>
          </el-form-item>
          <el-form-item :label="$t('attendance.附件')">
            <el-upload list-type="picture-card" :file-list="fileList" :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview" disabled>

            </el-upload>

          </el-form-item>





       
          <el-form-item :label="$t('attendance.传染病')" v-if="taskName == '护士审批'" required>
            <el-radio-group v-model="formData.isInfectious">
              <el-radio label="101">{{ $t('attendance.是') }}</el-radio>
              <el-radio label="102">{{ $t('attendance.否') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.remark" type="textarea" :rows="3" :placeholder="$t('attendance.备注')"></el-input>
          </el-form-item>
           <div style="margin-left:80px;margin-bottom: 22px;;">
            <el-button type="primary" @click="submitFlowComplete()" :loading="submitLoading">{{ $t('attendance.审批通过') }}</el-button>
            <el-button type="danger" @click="rejectTaskHandle()" :loading="submitLoading">{{
              $t('attendance.审批拒绝') }}</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog :title="$t('attendance.流程图')" :visible.sync="dialogActiveVisible" width="80%">
      <div style="height: auto;margin-bottom: 30px;">
        <img :src="flowImg" height="auto" style="max-width: 100%;">
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

    <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
      <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
    </el-dialog>

    <!-- 拒绝任务对话框 -->
    <el-dialog :title="$t('attendance.审批拒绝')" :visible.sync="dialogRejectVisible" width="40%">
      <el-form :model="dataForm" label-width="100px">
        <el-form-item :label="$t('attendance.选择审批人')">
          <el-select v-model="rejectAssignee" :placeholder="$t('attendance.请选择审批人')">
            <el-option v-for="item in assigneeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRejectVisible = false">{{ $t('attendance.取消') }}</el-button>
        <el-button type="primary" @click="confirmReject">{{ $t('attendance.确定') }}</el-button>
      </span>
    </el-dialog>


    <div v-if="dialogVisible6">
      <add :dialog-visible.sync="dialogVisible6" :edit-data="editData" @dialog-cancel="closeConditionDialog"
        @dialog-submit="submitConditionDialog" />
    </div>


  </div>
</template>

<script>
import { myTask, showProcessImgActive, completeTask, getFormByBussId, getFlowDef2, rejectTask, getHiTaskInstance } from "@/api/isacommunity/holiday.js";
import {
  downloadFile,
  uploadFile,
  getFileList,
  deleteFile
} from "@/api/upload/index.js";
import add from './dialog/add.vue'
export default {
  components: { add },
  data() {
    return {
      procInsId: '',
      taskDefKey: '',
      dataForm: {
        key: ''
      },

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
      dialogRejectVisible: false,
      rejectAssignee: '',
      assigneeList: [],
      taskName: '',
      id: '',
      formData: { remark: '', isInfectious: '' },
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

    async beforeAvatarUpload(file) {
      console.log("beforeAvatarUpload", file);
      // 检查文件类型
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error(this.$t('attendance.只能上传图片格式的文件'));
        return false;
      }
      if (!isLt2M) {
        this.$message.warning(this.$t('attendance.文件大小不能超过2MB'));
        return false;
      }
      const name = file.name;
      let fileObj = await {
        id: "11111",
        type: file.type,
        file: file,
        name: file.name
      };
      fileObj["url"] = this.setFileUrl(file);
      console.log("fileObj", fileObj);
      this.fileList.push(fileObj);
      let obj = new FormData();
      obj.append("file", file);
      obj.append("scene", "extension_attachment");
      this.uploadfile(obj, this.fileList.length - 1);
      return true;
    },
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
        this.dialogRejectVisible = false
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
    // 重新填单方法
    reSubmit(procInsId, taskId) {
      // 调用getFormByBussId获取表单数据
      getFormByBussId({ processId: procInsId }).then((res) => {
        console.log('reSubmit data:', res)
        // 将数据赋值给editData并打开add弹窗
        this.editData = res
        this.editData.processInstanceId = procInsId

        this.editData.taskId = taskId
        this.dialogVisible6 = true
      })
    },
    getFileData(data) {
      this.fileList = []
      getFileList(data).then(res => {
        let data = res.data.data;



        data.map((item, index) => {

          let obj = {
            id: item.id,
            type: item.contentType,
            file: "",
            name: item.originalName
          };
          this.fileList.push(obj);
          this.getFile(item.id, obj);
        });
        console.log(" this.fe", this.fileList);
      });
    },

    getFile(id, data) {
      downloadFile(id, data).then(res => {
        console.log("downloadFile", res);
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径
        console.log("url", url);
        this.fileList.map((i, k) => {
          console.log("lll", i, data);
          if (i.id == id) {
            this.$set(this.fileList, k, {
              ...this.fileList[k],
              file: res.data,
              id,
              url
            });
          }
        });
      });
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

        if (taskDefKey === '重新填单') {
          // 重新填单操作

          this.editData = res
          this.dialogVisible6 = true
        } else {
          // 正常审批操作
          // 先创建一个新对象，确保它是Vue的响应式对象

          // 确保isInfectious的值是有效的
          this.$nextTick(() => {
            // 这里可以访问更新后的 DOM
            this.formData = res
            this.getFileData({ outerId: this.formData.id, scene: 'extension_attachment' });
            this.dialogVisible = true
            if (this.taskName == '护士审批') {
              this.formData.isInfectious = '102'
            }


          });


        }
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

.demo-dynamic .el-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.demo-dynamic .el-form-item__label {
  flex: 0 0 120px;
  text-align: right;
  margin-right: 15px;
  white-space: nowrap;
}

.demo-dynamic .el-form-item__content {
  flex: 1;
  min-width: 0;
}
</style>
