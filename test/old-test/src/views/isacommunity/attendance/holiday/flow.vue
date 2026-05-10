<template>
 
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">流程配置</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
    

      <el-tab-pane label="流程定义数据" name="flowdef">
        <flowdef ref="flowdefRef" @edit-flow="handleEditFlow"></flowdef>
      </el-tab-pane>
      
      <!-- 第四个tab：流程部署 -->
      <el-tab-pane label="流程部署" name="procdef">
        <procdef ref="procdefRef"></procdef>
      </el-tab-pane>
    </el-tabs>
      </div>

    
    </div>
    <!-- 详情弹窗 -->
    <div v-if="dialogVisible">
      <add :dialog-visible.sync="dialogVisible" :edit-data="editData" @dialog-cancel="closeConditionDialog" @dialog-submit="submitConditionDialog" />
    </div>

  </div>
  
</template>
<script>
// 引入相关的依赖

import flowdef from './flowdef.vue'
import procdef from './procdef.vue'


export default {
  components: {
    flowdef,
    procdef
  },
  name: '',
  created() { },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    // 初始化学校列表
  
    this.init()
  },
  data() {
    return {

      container: null,

      dataForm: {
        name: '',
        modelKey: ''
      },
      // 标签页
      activeTab: 'flowdef', // 默认激活第一个标签页
      // XML弹窗相关
      xmlDialogVisible: false,
      xmlContent: '',
   
      // 表单配置
      formConfig: {
        id: '', // 流程定义ID，用于判断是否是编辑模式
        name: '', // 流程名称
        modelKey: '', // 流程KEY
        schools: [], // 学校
        leaveType: '', // 请假类型
        leaveScope: [], // 请假范围
        isFixed: '', // 固定假
        canRevoke: 'yes', // 假期可撤销，默认是
        needApproval: 'yes' // 需要审批，默认是
      },
      // 表单验证规则
      formRules: {
        modelKey: [
          { required: true, message: '请输入流程KEY', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ],
        schools: [
          { required: true, message: '请选择学校', trigger: 'change' }
        ],
        leaveType: [
          { required: true, message: '请选择请假类型', trigger: 'change' }
        ],
        leaveScope: [
          { required: true, message: '请选择请假范围', trigger: 'change' }
        ]
      }
    }
  },
  // 方法集合
  methods: {
    init() {
  

    },

    success() {
      // console.log('创建成功!')
    },
    // 处理tab切换事件
    handleTabClick(tab) {
      if (tab.name === 'flowdef' ) {
        this.$refs.flowdefRef.getDataList()
      } else if (tab.name === 'procdef' ) {
        this.$refs.procdefRef.getDataList()
      }
    }

  },

}
</script>

<style>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 100px);
}


.panel {
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
}

.form-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: calc(100vh - 100px);
}

.el-tabs__item.is-active {
  color: #BA8E62 !important;
}

/* 添加鼠标悬停效果 */
.el-tabs__item:hover {
  color: #BA8E62 !important;
}

/* 修改激活状态的下划线颜色 */
.el-tabs__active-bar {
  background-color: #BA8E62 !important;
  display: none !important;
}
</style>
