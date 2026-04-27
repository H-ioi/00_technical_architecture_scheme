<template>
  <div>
    <el-tabs v-model="activeTab">
       <el-tab-pane label="流程配置" name="form">
        <div class="form-container">
          <el-form :model="formConfig" ref="formConfig" label-width="120px" :rules="formRules">


            <el-form-item label="流程名称" prop="flowName">
              <el-input v-model="formConfig.name" placeholder="请输入流程名称" style="width: 250px"></el-input>
            </el-form-item>

        

            <el-form-item label="学校" prop="schools">
              <el-select v-model="formConfig.schools" placeholder="请选择学校" multiple>
                <!-- 动态加载学校列表 -->
                <el-option 
                  v-for="school in schoolList" 
                  :key="school.enName" 
                  :label="school.enName" 
                  :value="school.enName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请假类型" prop="leaveType">
              <el-select v-model="formConfig.leaveType" placeholder="请选择请假类型">
                <el-option label="事假" value="101"></el-option>
                <el-option label="病假" value="102"></el-option>
              </el-select>
            </el-form-item>
         
          
        
            <el-form-item label="需要审批">
              <el-select v-model="formConfig.needApproval" placeholder="请选择是否需要审批">
                <el-option label="是" value="101"></el-option>
                <el-option label="否" value="102"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmit">保存配置</el-button>
                  <el-button @click="goBack" type="info" style="margin-bottom: 20px;">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 第一个tab：BPMN编辑器 -->
      <el-tab-pane label="流程设计" name="design" v-if="formConfig.needApproval !== '102'">
        <div style="display: flex; align-items: center;">
          <el-button type="primary" @click="showXMLHandle">查看XML</el-button>
          <el-button type="success" @click="importXMLHandle">导入XML</el-button>
          <div  style="margin-left: 20px;">系统内置变量  提交人：${startUser}    <span style="margin-left: 20px;">会签条件：${nrOfCompletedInstances>=1}只要一个通过就通过</span>
             <span style="margin-left: 20px;">范围${scopeList}</span>
             <span style="margin-left: 20px;">监听器com.uni.attendance.listen.BusinessEndListener</span>
          </div>
        </div>
        <div class="containers bpmn-color">
          <div class="canvas" ref="canvas"></div>
          <div id="js-properties-panel4" class="panel"></div>
        </div>
      </el-tab-pane>

      <!-- 第二个tab：表单 -->
     

     
    </el-tabs>

    <!-- XML内容弹窗 -->
    <el-dialog title="XML内容" :visible.sync="xmlDialogVisible" width="80%" :close-on-click-modal="false">
      <el-input v-model="xmlContent" type="textarea" :rows="20" readonly
        style="font-family: monospace; font-size: 12px;"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xmlDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyXML">复制</el-button>
      </span>
    </el-dialog>

    <!-- 导入XML弹窗 -->
    <el-dialog title="导入XML" :visible.sync="importXmlDialogVisible" width="80%" :close-on-click-modal="false">
      <el-input v-model="importXmlContent" type="textarea" :rows="20"
        style="font-family: monospace; font-size: 12px;" placeholder="请粘贴XML内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importXmlDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImportXML">确认导入</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { xmlStr } from './xmlStr'
import { postFlowDef, getFlowModelef} from '@/api/isacommunity/holiday'
import { getSchoolList } from "@/api/isa/index.js";
// 需要引入右侧属性栏的相关依赖
// 这里引入的是右侧属性栏这个框
import propertiesPanelModule from 'bpmn-js-properties-panel'
// 而这个引入的是右侧属性栏里的内容
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// 一个描述的json
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import customeTranslator from '@/util/customeTranslator'


export default {
  components: {
   
  },
  name: '',
  created() { },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    // 初始化学校列表
    getSchoolList().then(res => {
      console.log("res", res);
      if (res && res.data) {
        this.schoolList = res.data.data;
      }
    })
    this.init()
    
    // 获取路由参数中的id
    const id = this.$route.params.id
    console.log('route id:', id)
  if (id) {
      // 调用getFlowModelef方法获取数据
      getFlowModelef(id).then((res) => {
        console.log('getFlowModelef res:', res)
        if (res) {
          // 将XML数据导入到BPMN编辑器中
          this.bpmnModeler.importXML(res.modelXml, (err) => {
            if (err) {
              this.$message.error('导入XML失败：' + err.message)
              return
            }
           // this.$message.success('XML导入成功')
          })
          
          // 将表单数据填充到表单配置中
          this.formConfig = {
            ...this.formConfig,
            id: res.id || '',
            name: res.name || '',
       
            schools: res.schools || [],
            leaveType: res.leaveType || '',
            leaveScope: res.leaveScope || [],
            isFixed: res.isFixed || '',
            canRevoke: res.canRevoke || '101',
            needApproval: res.needApproval || '101'
          }
        }
      })
    }
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      dataForm: {
        name: '',
       
      },
      // 标签页
      activeTab: 'form', // 默认激活第一个标签页
      // XML弹窗相关
      xmlDialogVisible: false,
      xmlContent: '',
      // 导入XML弹窗相关
      importXmlDialogVisible: false,
      importXmlContent: '',
      // 学校列表
      schoolList: [],
      // 表单配置
      formConfig: {
        id: '', // 流程定义ID，用于判断是否是编辑模式
        name: '', // 流程名称
        modelKey: '', // 流程KEY
        schools: [], // 学校
        leaveType: '', // 请假类型
        leaveScope: [], // 请假范围
        isFixed: '', // 固定假
        canRevoke: '101', // 假期可撤销，默认是
        needApproval: '101' // 需要审批，默认是
      },
      // 表单验证规则
      formRules: {
    
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
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas


      // 创建汉化 语言转换模块
      const customTranslateModule = {
        translate:['value',customeTranslator]
      }

      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加 控制面板
        propertiesPanel: {
          parent: '#js-properties-panel4'
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
 // 汉化模块
          customTranslateModule
        ],
        moddleExtensions: {
          //如果要在属性面板中维护camunda：XXX属性，则需要此
          camunda: camundaModdleDescriptor
        }
      })
      // 创建一个新的流程设计器
      this.createNewDiagram()
    },
    createNewDiagram() {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(xmlStr, (err) => {
        if (err) {
          // console.error(err)
        }
        else {
          // 这里是成功之后的回调, 可以在这里做一系列事情
          this.success()
        }
      })
    },

        // 返回请假管理页面
    goBack() {
      this.$router.push('/isacommunity/attendance/holiday/flow')
    },
    success() {
      // console.log('创建成功!')
    },
   
    // 显示XML内容
    showXMLHandle() {
      var that = this
      // 从BPMN建模器获取XML内容
      this.bpmnModeler.saveXML({ format: true }, function (error, xml) {
        if (error) {
          that.$message.error('获取XML失败：' + error.message)
          return
        }
        that.xmlContent = xml
        that.xmlDialogVisible = true
      })
    },
    // 复制XML内容
    copyXML() {
      const textarea = document.createElement('textarea')
      textarea.value = this.xmlContent
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('XML内容已复制到剪贴板')
    },
    // 打开导入XML对话框
    importXMLHandle() {
      this.importXmlContent = ''
      this.importXmlDialogVisible = true
    },
    // 确认导入XML
    confirmImportXML() {
      if (!this.importXmlContent.trim()) {
        this.$message.error('请输入XML内容')
        return
      }
      
      var that = this
      // 使用BPMN建模器导入XML
      this.bpmnModeler.importXML(this.importXmlContent, function (err) {
        if (err) {
          that.$message.error('导入XML失败：' + err.message)
        } else {
          that.$message.success('导入XML成功')
          that.importXmlDialogVisible = false
        }
      })
    },
    dataFormSubmit() {
      var my = this
      // 保存流程定义信息
      this.bpmnModeler.saveXML({ format: true }, function (error, xml) {
        my.saveFlowData(xml)
      })
    },
    saveFlowData(xmlStr) {
      this.$refs.formConfig.validate((valid) => {
   
        if (valid) {
          const flowData = {
            ...this.formConfig,
            modelXml: encodeURIComponent(xmlStr)
          }
          const message = this.formConfig.id ? '更新成功' : '保存成功'
          
          postFlowDef(flowData).then(({ data }) => {
            this.$message({
              message: message,
              type: 'success',
              duration: 500,
            })
            // 跳转到流程定义页面
            setTimeout(() => {
              this.$router.push('/isacommunity/attendance/holiday/flow')
            }, 500)

          })
        } else {
          this.$message.error('表单验证失败，请检查填写内容')
          return false
        }
      })

    },

  },

}
</script>

<style>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 100px);
}

.canvas {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  height: 100vh;
  overflow: scroll;
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
