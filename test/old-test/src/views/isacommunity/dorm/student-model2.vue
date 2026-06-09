<template>
  <!-- 查看详情弹窗 -->
  <el-dialog :title="$t('dorm.学生住宿档案')" :visible.sync="visible" width="900px" class="detail-dialog" @close="closeDialog">
   
        <div class="detail-section">
          <div class="section-title">{{ $t('dorm.学生基本信息') }}</div>
          <el-row class="detail-row">
            <el-col :span="9">
              <span class="detail-label">{{ $t('attendance.学校') }}:</span>
              <span class="detail-value">{{ studentInfo.student.school.en_name || '-' }}</span>
            </el-col>
            <el-col :span="6">
              <span class="detail-label">{{ $t('attendance.学号') }}:</span>
              <span class="detail-value">{{ studentInfo.admission_no  }}</span>
            </el-col>
            <el-col :span="9">
              <span class="detail-label">{{ $t('attendance.姓名') }}:</span>
              <span class="detail-value">{{ studentInfo.student.en_name || '-' }}</span>
            </el-col>
          </el-row>
          <el-row class="detail-row">
            <el-col :span="9">
              <span class="detail-label">{{ $t('attendance.年级') }}:</span>
              <span class="detail-value">{{ studentInfo.student.grade_code || '-' }}</span>
            </el-col>
            <el-col :span="6">    
              <span class="detail-label">{{ $t('attendance.班级') }}:</span>
              <span class="detail-value">{{ studentInfo.student.form_code || '-' }}</span>
            </el-col>
            <el-col :span="9">
              <span class="detail-label">{{ $t('isagroup.性别') }}:</span>
              <span class="detail-value">
                {{ studentInfo.student.gender === '1' || studentInfo.student.gender === 1 ? $t('dorm.男') : (studentInfo.student.gender === '2' || studentInfo.student.gender === 2 ? $t('dorm.女') : studentInfo.student.gender || '-') }}
              </span>
            </el-col>
          </el-row>
          <el-row class="detail-row">
            <el-col :span="9">
              <span class="detail-label">{{ $t('isagroup.国籍') }}:</span>
              <span class="detail-value">{{ studentInfo.student.nationality || '-' }}</span>
            </el-col>
            <el-col :span="6">
              <span class="detail-label">{{ $t('isagroup.出生日期') }}:</span>
              <span class="detail-value">{{ studentInfo.student.birthdate || '-' }}</span>  
            </el-col>
             <el-col :span="9">
              <span class="detail-label">{{ $t('attendance.校巴') }}:</span>
              <span class="detail-value">-</span>
            </el-col>
          </el-row>
        
        </div>

        <div class="detail-section" v-if="permissions['boarding-parent-view']">
          <div class="section-title">{{ $t('dorm.家长联系方式') }}</div>
          <el-table :data="studentInfo.student.parent_info || []" border style="width: 100%">
            <el-table-column prop="relationship" :label="$t('dorm.关系')" align="center"></el-table-column>
            <el-table-column prop="phone" :label="$t('dorm.手机号码')" align="center"></el-table-column>
            <el-table-column prop="email_address" :label="$t('dorm.邮箱')" align="center"></el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <div class="section-title">{{ $t('dorm.住宿信息') }}</div>
          <el-row class="detail-row">
            <el-col :span="24">
              <span class="detail-label">{{ $t('dorm.房间号') }}:</span>
              <span class="detail-value">{{ studentInfo.student.room_room || '-' }}</span>
            </el-col>
          </el-row>
          <el-row class="detail-row">
            <el-col :span="24">
              <span class="detail-label">{{ $t('dorm.床位') }}:</span>
              <span class="detail-value">{{ studentInfo.student.bed_label || '-' }}</span>
            </el-col>
          </el-row>

          <el-row class="detail-row">
            <el-col :span="24">
              <span class="detail-label">{{ $t('dorm.属性') }}:</span>
              <span class="detail-value">{{ studentInfo.student.project_name || '-' }}</span>
            </el-col>
          </el-row>

             <el-row class="detail-row">
            <el-col :span="24">
              <span class="detail-label">{{ $t('dorm.入住日期') }}:</span>
              <span class="detail-value">{{ studentInfo.student.checkin_date || '-' }}</span>
            </el-col>
          </el-row>


          <el-row class="detail-row">
            <el-col :span="24">
              <span class="detail-label">{{ $t('dorm.退宿日期') }}:</span>
              <span class="detail-value">{{ studentInfo.student.planned_checkout_date || '-' }}</span>
            </el-col>
          </el-row>


          <el-row class="detail-row">
            <el-col :span="24">
              <span class="detail-label">{{ $t('dorm.缴费状态') }}:</span>
              <span class="detail-value">{{ studentInfo.student.payment_status === '1' || studentInfo.student.payment_status === 1 ? $t('dorm.已缴费') : $t('dorm.未缴费') }}</span>
            </el-col>
          </el-row>
        </div>
     
    
    <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
      <el-button @click="closeDialog">{{ $t('btn.关闭') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {  getStudentHistoryDetail } from '@/api/isacommunity/dorm'
import { mapGetters } from "vuex";
export default {
  name: 'StudentModel2',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
        buildingList: [],
            floorList: [],
            projectList: [],
            schoolList: [],
            roomList: [],
      studentInfo:{},
      activeTab: 'studentInfo'
    }
  },
  computed: {
     ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.activeTab = 'studentInfo'; // 打开时默认重置为第一个 Tab
    
        if (this.detailData && this.detailData.admission_no) {
          getStudentHistoryDetail({ admissionNo: this.detailData.admission_no }).then(res => {
            if (res) {
                this.studentInfo = res
            }
          }).catch(err => {
            console.error('获取学生详情失败:', err);
          });
        }
      }
    }
  },
  methods: {

    closeDialog() {
      this.visible = false;
    }
  }
}
</script>

<style scoped>
/* 详情弹窗样式 */
.detail-dialog ::v-deep .el-dialog__body {
  padding: 10px 20px 30px;
  background-color: #f5f5f9; /* 匹配设计图浅紫色背景 */
}

.detail-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.detail-row {
  margin-bottom: 15px;
}

.detail-label {
  color: #606266;
  margin-right: 10px;
  display: inline-block;
 
  text-align: right;
}

.detail-value {
  color: #303133;
}
</style>
