<template>
   <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">配置管理</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
     <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="display: flex; align-items: center;">
        <el-form-item label="">
          <el-select v-model="dataForm.school" placeholder="请选择学校">
            <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName" :value="school.enName"></el-option>
          </el-select>
        </el-form-item>



        
       <el-form-item style="width: auto; margin-right: 0">
            <el-button
              class="button_text"
              size="medium"
              type="text"
              icon="el-icon-refresh-right"
              @click="clear"
              >{{ $t("btn.重置") }}</el-button
            >
            <el-button  @click="getDataList()">查询</el-button>
             <el-button type="primary" @click="addItem">新增</el-button>
          </el-form-item>
      </el-form>

      </div>

      <div class="isa_table">
     
            <el-table :data="dataList" fit border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
      style="width: 100%;">
   
     
      <el-table-column prop="school" header-align="center" align="center" label="学校">
       
      </el-table-column>
      <el-table-column prop="grades" header-align="center" align="center" label="年级">
        <template slot-scope="scope">
        {{ scope.row.grades?scope.row.grades.join('、') || '-' : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="department" header-align="center" align="center" label="部门">
        <template slot-scope="scope">
          {{ getDepartmentLabel(scope.row.department) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="EMAIL">
        
      </el-table-column>
    
      <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)" style="margin-right: 10px;">编辑</el-button>
          <el-button type="text" size="small" @click="deleteItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

       <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="formData" :rules="formRules" ref="formData" label-width="100px">
        <el-form-item label="学校" prop="school" style="width: 100%;">
          <el-select v-model="formData.school" placeholder="请选择学校" style="width: 100%;">
            <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName" :value="school.enName"></el-option>
          </el-select>
        </el-form-item>
            <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" placeholder="请选择部门" style="width: 100%;">
            <el-option v-for="item in departmentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grades" v-if="!formData.department || !['dorm', 'bus', 'doctor','all'].includes(formData.department)">
          <el-select v-model="formData.grades" multiple placeholder="请选择年级" style="width: 100%;">
            <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
    
        <el-form-item label="邮箱" prop="email"  >
          <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
       
      </div>
    </div>
 

  </div>
</template>

<script>
    // 引入相关的依赖
import { getConfigList2, saveConfig, updateConfig, deleteConfig } from '@/api/isacommunity/config'

import { getSchoolList } from "@/api/isa/index.js";

export default {
  name: 'ConfigList',
  data() {
    return {
      // 搜索表单
      dataForm: {
        school: ''
      },
      // 数据列表
      dataList: [],
      // 加载状态
      dataListLoading: false,
      
      // 选中的数据
      dataListSelections: [],
      // 弹窗
      dialogVisible: false,
      dialogTitle: '新增配置',
      // 表单数据
      formData: {
        id: '',
        school: '',
        grades: [],
        department: '',
        email: ''
      },
      // 学校列表
      schoolList: [],
      // 年级列表
      gradeList: [
        { label: 'EY1', value: 'EY1' },
        { label: 'EY2', value: 'EY2' },
        { label: 'EY3', value: 'EY3' },
        { label: 'EY4', value: 'EY4' },
        { label: 'Grade 1', value: 'Grade 1' },
        { label: 'Grade 2', value: 'Grade 2' },
        { label: 'Grade 3', value: 'Grade 3' },
        { label: 'Grade 4', value: 'Grade 4' },
        { label: 'Grade 5', value: 'Grade 5' },
        { label: 'Grade 6', value: 'Grade 6' },
        { label: 'Grade 7', value: 'Grade 7' },
        { label: 'Grade 8', value: 'Grade 8' },
        { label: 'Grade 9', value: 'Grade 9' },
        { label: 'Grade 10', value: 'Grade 10' },
        { label: 'Grade 11', value: 'Grade 11' },
        { label: 'Grade 12', value: 'Grade 12' }
      ],
      // 部门列表
      departmentList: [
        { label: '所有', value: 'all' },
        { label: '学部', value: 'course' },
        { label: '宿舍', value: 'dorm' },
        { label: '校巴', value: 'bus' },
        { label: '校医', value: 'doctor' }
      ],
      // 表单验证规则
      formRules: {
        school: [
          { required: true, message: '请选择学校', trigger: 'change' }
        ],
      
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      },
    }
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    // 初始化学校列表
    this.getSchoolList()
    // 初始化数据列表
    this.getDataList()
  },
  // 方法集合
  methods: {
    // 获取学校列表
    getSchoolList() {
      getSchoolList().then(res => {
        if (res && res.data) {
          this.schoolList = res.data.data
        }
      })
    },
           clear() {
      this.dataForm = {};
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getConfigList2({
        school: this.dataForm.school
      }).then(res => {
        this.dataListLoading = false
    
          this.dataList = res || []
      
      }).catch(() => {
        this.dataListLoading = false
        this.dataList = []
      })
    },
    // 选择变更
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增
    addItem() {
      this.dialogTitle = '新增配置'
      this.formData = {
        id: '',
        school: '',
        grades: [],
        department: '',
        email: ''
      }
      this.dialogVisible = true
    },
    // 编辑
    editItem(row) {
      this.dialogTitle = '编辑配置'
      this.formData = Object.assign({}, {
        id: row.id || '',
        school: row.school || '',
        grades: row.grades || [], 
        department: row.department || '',
        email: row.email || ''
      })
      this.dialogVisible = true
    },
    // 删除
    deleteItem(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => item.id)
      this.$confirm(`确定要删除选中的${ids.length}条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteConfig(ids).then(res => {
        
            this.$message.success('删除成功')
            this.getDataList()
        
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          
        
          const apiMethod = this.formData.id ? updateConfig : saveConfig
          apiMethod(this.formData).then(res => {
        
              this.$message.success('保存成功')
              this.dialogVisible = false
              this.getDataList()
           
          }).catch(() => {
            this.$message.error('保存失败')
          })
        }
      })
    },
    // 获取部门中文标签
    getDepartmentLabel(value) {
      const department = this.departmentList.find(item => item.value === value)
      return department ? department.label : value || '-'
    }
  }
}
</script>

<style scoped>
.mod-config {
  padding: 20px;
  background-color: #fff;
}
</style>