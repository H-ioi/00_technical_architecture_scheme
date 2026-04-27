<template>
  <div class="mod-config">
    
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
    
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="流程定义编号">
      </el-table-column>
      <el-table-column
        prop="deploymentName"
        header-align="center"
        align="center"
        label="流程名称">
      </el-table-column>
      <el-table-column
        prop="flowKey"
        header-align="center"
        align="center"
        label="流程KEY">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="学校">
        <template slot-scope="scope">
          {{ scope.row.tenantId ? scope.row.tenantId.split('#')[0] : scope.row.tenantId }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          {{ scope.row.tenantId ? (scope.row.tenantId.split('#')[1] === '101' ? '事假' : scope.row.tenantId.split('#')[1] === '102' ? '病假' : scope.row.tenantId.split('#')[1]) : '' }}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="deploymentId"
        header-align="center"
        align="center"
        label="部署id">
      </el-table-column>
      <el-table-column
        prop="deploymentDate"
        header-align="center"
        align="center"
        label="部署时间">
      </el-table-column>
   

      <el-table-column
        prop="version"
        header-align="center"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
      

          <el-button type="text"  size="small" @click="showFlowImgHandle(scope.row.id)">查看流程图</el-button>
       
          <el-button type="text"   size="small" @click="startFlowHandle(scope.row.id,scope.row.tenantId)">设置审批人</el-button>
             <el-button type="text"  size="small" @click="deleteProcDef(scope.row)">删除</el-button>
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
      title="流程图"
      :visible.sync="dialogVisible"
      width="80%">
      <div style="height: auto;margin-bottom: 30px;">
        <img :src="flowImg"  height="auto" style="max-width: 100%;">
      </div>
    </el-dialog>

    <el-dialog
      title="流程定义XML内容"
      :visible.sync="dialogXMLVisible"
      width="85%">
      <div style="height: auto;margin-bottom: 30px;">
        <pre>{{ flowXML }}</pre>
      </div>
    </el-dialog>

    <el-dialog
      title="设置审批人"
      :visible.sync="dialogFormVisible"
      width="30%">
      <div style="height: auto;margin-bottom: 30px;">
        <el-form :model="dynamiForm" label-width="90px" class="sp-dialog-form">

          <el-form-item
            v-for="(form) in dynamiForm"
            :label="form.name"
            :key="form.key"
            :prop="form.key"

          >
              <el-select v-if="form.type == 'assignee'" v-model="form.value" placeholder="请选择">
                <el-option
                  v-for="item in users"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username">
                </el-option>
              </el-select>
              <el-select v-if="form.type == 'candidateUsers'" v-model="form.value" placeholder="请选择">
                <el-option
                  v-for="item in users"
                  :key="item.userId"
                  :label="item.nickname+'['+item.username+']'"
                  :value="item.userId">
                </el-option>
              </el-select>
              <el-select v-if="form.type == 'group'"  multiple="true"  v-model="form.value" placeholder="请选择">
                <el-option
                  v-for="item in users"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item style="display: flex;justify-content:center">
            <el-button type="primary"  @click="submitStartFlow()">提交</el-button>
          </el-form-item>
      </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
 
  import { listProcDef,showProcessImg,getFlowDef,setCustomVar,deleteDeployDef  } from '@/api/isacommunity/holiday'
  export default {
    data () {
      return {
        id:'',
        tenantId:'',
        dataForm: {
          key: ''
        },dynamiForm:[],
        domain:{},
        flowForm:{

        },
        flowImg:'',
        flowXML:'',
        users:[],
        roles:[],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogVisible:false,
        dialogXMLVisible:false,
        dialogFormVisible:false
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        console.log('ProcDef getDataList called')
        this.dataListLoading = true
        listProcDef({
            'page': this.pageIndex,
            'limit': this.pageSize,
        }).then((res) => {
            console.log('ProcDef getDataList response:', res)
            if (res && res.data) {
              this.dataList = res.data.list || []
              this.totalPage = res.data.totalCount || 0
            } else {
              this.dataList = res.list || []
              this.totalPage = res.totalCount || 0
            }
          this.dataListLoading = false
        }).catch((error) => {
          console.error('ProcDef getDataList error:', error)
          this.dataListLoading = false
          this.dataList = []
          this.totalPage = 0
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      deleteProcDef(row){

        this.$confirm('确定删除该流程定义吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDeployDef(row.deploymentId).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 200,
              onClose: () => {
                this.getDataList()
              }
            })
          })
        })
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },submitStartFlow(){
        for( var item of this.dynamiForm){
            this.flowForm[item.key] = item.value
        }
        this.flowForm.id = this.id
        let params = {
          id: this.flowForm.id,
          school: this.tenantId,
          flowName:'holiday',
          variable: this.flowForm
        }
        setCustomVar(params).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 200,
            onClose: () => {
              this.dialogFormVisible = false
              this.flowForm = {}
            }
          })
        })
        console.log(this.flowForm,'this.flowForm')
 
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      startFlowHandle(id,tenantId){
        this.id = id
        this.tenantId = tenantId
        getFlowDef(id).then((res) => {
       
         this.dynamiForm = res.data
         this.users = res.users
         this.dialogFormVisible = true
        })
      },
      showFlowImgHandle(id){
      
        showProcessImg(id).then((res) => {
          const blob = new Blob([res.data], { type: 'image/png' })
          this.flowImg = URL.createObjectURL(blob)
          this.dialogVisible = true
        })
      },

    }
  }
</script>

<style lang="scss">
.sp-dialog-form {
  .el-form-item {
    display: flex;
    align-items: center;
      text-align: center;
    margin-bottom: 15px;
    &:last-child {
      .el-form-item__content {
           margin-left: 10px !important
      }
  
      .el-button {
        margin-top:12px;
        width: 120px;
     
      
      }
    }
  }
}
</style>
