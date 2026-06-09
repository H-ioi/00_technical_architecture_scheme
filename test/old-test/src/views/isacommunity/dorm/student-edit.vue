<template>
  <!-- 查看详情弹窗 -->
  <el-dialog :title="$t('dorm.学生住宿档案')" :visible.sync="visible" width="900px" class="detail-dialog"
    @close="closeDialog">

    <div class="detail-section">
      <div class="section-title">{{ $t('dorm.学生基本信息') }}</div>
      <el-row class="detail-row">
        <el-col :span="9">
          <span class="detail-label">{{ $t('attendance.学校') }}:</span>
          <span class="detail-value">{{ studentInfo.school.en_name }}</span>
        </el-col>
        <el-col :span="6">
          <span class="detail-label">{{ $t('attendance.学号') }}:</span>
          <span class="detail-value">{{ studentInfo.admission_no }}</span>
        </el-col>
        <el-col :span="9">
          <span class="detail-label">{{ $t('attendance.姓名') }}:</span>
          <span class="detail-value">{{ studentInfo.en_name || '-' }}</span>
        </el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col :span="9">
          <span class="detail-label">{{ $t('attendance.年级') }}:</span>
          <span class="detail-value">{{ studentInfo.grade_code || '-' }}</span>
        </el-col>
        <el-col :span="6">
          <span class="detail-label">{{ $t('attendance.班级') }}:</span>
          <span class="detail-value">{{ studentInfo.form_code || '-' }}</span>
        </el-col>
        <el-col :span="9">
          <span class="detail-label">{{ $t('isagroup.性别') }}:</span>
          <span class="detail-value">
            {{ studentInfo.gender === '1' || studentInfo.gender === 1 ? $t('dorm.男') : (studentInfo.gender === '2' ||
              studentInfo.gender === 2 ? $t('dorm.女') : studentInfo.gender || '-') }}
          </span>
        </el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col :span="9">
          <span class="detail-label">{{ $t('isagroup.国籍') }}:</span>
          <span class="detail-value">{{ studentInfo.nationality || '-' }}</span>
        </el-col>
        <el-col :span="6">
          <span class="detail-label">{{ $t('isagroup.出生日期') }}:</span>
          <span class="detail-value">{{ studentInfo.birthdate || '-' }}</span>
        </el-col>
        <el-col :span="9">
          <span class="detail-label">{{ $t('attendance.校巴') }}:</span>
          <span class="detail-value">-</span>
        </el-col>
      </el-row>

    </div>

     <div class="detail-section" v-if="permissions['boarding-parent-view']">
      <div class="section-title">{{ $t('dorm.家长联系方式') }}</div>
      <el-table :data="studentInfo.parent_info || []" border style="width: 100%">
        <el-table-column prop="relationship" :label="$t('dorm.关系')" align="center"></el-table-column>
        <el-table-column prop="phone" :label="$t('dorm.手机号码')" align="center"></el-table-column>
        <el-table-column prop="email_address" :label="$t('dorm.邮箱')" align="center"></el-table-column>
      </el-table>
    </div>

    <div class="detail-section">
      <div class="section-title">{{ $t('dorm.住宿信息') }}</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
         <el-form-item :label="$t('dorm.学校')" prop="school" style="width: 100%;">
        <el-select v-model="form.school" :placeholder="$t('attendance.学校')" clearable style="width: 100%;"
            @change="handleSchoolChange">
                <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.externId"
              ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label="$t('dorm.楼栋')" prop="buildingId" style="width: 100%;">
          <el-select v-model="form.buildingId" :placeholder="$t('dorm.请选择楼栋')" style="width: 100%;"
            @change="handleBuildingChange">
            <el-option v-for="building in buildingList" :key="building.id" :label="building.name"
              :value="building.id"></el-option>
          </el-select>
        </el-form-item>




        <el-form-item :label="$t('dorm.楼层')" prop="floorId" style="width: 100%;">
          <el-select v-model="form.floorId" :placeholder="$t('dorm.请选择楼层')" style="width: 100%;"
            @change="handleFloorChange">
            <el-option v-for="floor in floorList" :key="floor.id" :label="floor.name" :value="floor.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('dorm.房间号')" prop="roomId" style="width: 100%;">
          <el-select v-model="form.roomId" :placeholder="$t('dorm.房间号')" style="width: 100%;"
            @change="handleRoomChange">
            <el-option v-for="room in roomList" :key="room.id" :label="room.number" :value="room.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('dorm.床位')" prop="bedId" style="width: 100%;">
          <el-select v-model="form.bedId" :placeholder="$t('dorm.请选择床位')" style="width: 100%;">
            <el-option v-for="bed in bedList" :key="bed.id" :label="bed.label" :value="bed.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('dorm.属性')" prop="projectId" style="width: 100%;">
          <el-select v-model="form.projectId" :placeholder="$t('dorm.请选择属性')" style="width: 100%;">
            <el-option v-for="project in projectList" :key="project.id" :label="project.name"
              :value="project.id"></el-option>
          </el-select>
        </el-form-item>

  <el-form-item :label="$t('dorm.入住日期')" prop="checkinDate" style="width: 100%;">
          <el-date-picker v-model="form.checkinDate" type="date" :placeholder="$t('dorm.请选择入住日期')" format="yyyy-MM-dd" style="width: 100%;"
          value-format="yyyy-MM-dd" size="medium"></el-date-picker>
        </el-form-item>

  <el-form-item :label="$t('dorm.预计退宿日期')"  style="width: 100%;">
          <el-date-picker v-model="form.plannedCheckoutDate" type="date" :placeholder="$t('dorm.请选择预计退宿日期')" format="yyyy-MM-dd" style="width: 100%;" 
          value-format="yyyy-MM-dd" size="medium" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>


        <el-form-item :label="$t('dorm.缴费状态')" prop="paymentStatus" style="width: 100%;">
          <el-select v-model="form.paymentStatus" :placeholder="$t('dorm.请选择缴费状态')" style="width: 100%;">
            <el-option :label="$t('dorm.未缴费')" :value="0"></el-option>
            <el-option :label="$t('dorm.已缴费')" :value="1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>


    <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
      <el-button @click="submitForm">{{ $t('btn.保存') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { getStudentDetail, getBuildingList, getProjectList, getFloorList, getRoomList, getBedList, editStudent } from '@/api/isacommunity/dorm'
export default {
  name: 'StudentEdit',
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
      studentInfo: {},
      bedList: [],
      activeTab: 'studentInfo',
      form: {
        number: '',
        school: '',
        buildingId: '',
        floorId: '',
        projectId: '',
        roomId: '',
        bedId: '',
        paymentStatus: 0,
        checkinDate: '',
        plannedCheckoutDate: ''

      },
      pickerOptions: {
        disabledDate(time) {
          // 禁用今天及之前的时间，只能选择今天以后的时间
          return time.getTime() <= Date.now();
        }
      },
      rules: {
        school: [
          { required: true, message: this.$t('attendance.请选择学校'), trigger: 'change' }
        ],

        number: [
          { required: true, message: this.$t('dorm.请输入房间号'), trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: this.$t('dorm.请选择楼栋'), trigger: 'change' }
        ],
        roomId: [
          { required: true, message: this.$t('dorm.请选择房间号'), trigger: 'change' }
        ],
        bedId: [
          { required: true, message: this.$t('dorm.请选择床位'), trigger: 'change' }
        ],
        floorId: [
          { required: true, message: this.$t('dorm.请选择楼层'), trigger: 'change' }
        ],
        projectId: [
          { required: true, message: this.$t('dorm.请选择属性'), trigger: 'change' }
        ],

      }
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
  mounted() {
    
    
  },
  watch: {
    async dialogVisible(val) {
      if (val) {
        console.log(this.dictionary['school'])
        
        this.activeTab = 'studentInfo';
        if (this.detailData && this.detailData.admission_no) {
          let res = await getStudentDetail({ admissionNo: this.detailData.admission_no })
            if (res) {
              this.studentInfo = res
              let bed = res.bed[0];
             
              if (bed) {
                this.form = {
                  buildingId: bed.room.floor.building.id,
                  floorId: bed.room.floor.id,
                  roomId: bed.room.id,
                  bedId: bed.id,
                  projectId: bed.room.project.id,
                  number: res.number,
                  school: res.school.extern_id,
                  checkinDate: res.checkin_date,
                  plannedCheckoutDate: res.planned_checkout_date,
                  paymentStatus:res.payment_status==null?0:parseInt(res.payment_status),
                }
            
                this.$nextTick(() => {


                  if (this.form.school) {

                    this.loadBuildingList(this.form.school);
                  }
                  if (this.form.buildingId) {
                    this.loadFloorList(this.form.buildingId);
                  }

                  if (this.form.projectId) {
                    this.loadProjectList(this.form.school);
                  }

                  if(this.form.floorId){
                    this.loadRoomList(this.form.floorId);
                  }
                  if (this.form.roomId) {
                    this.loadBedList(this.form.roomId);
                  }
                });





              }
            }
        
        }
      }
    }
  },
  methods: {
    // 楼栋下拉框选中值改变时触发
    handleBuildingChange(buildingId) {

      this.form.floorId = ''; // 楼栋改变时，清空已选的楼层
      this.form.roomId = ''; // 楼栋改变时，清空已选的房间
      this.form.bedId = ''; // 楼栋改变时，清空已选的床位
      this.floorList = [];  // 清空楼层列表
      this.roomList = [];    // 清空房间列表
      this.bedList = [];       // 清空床位列表

      if (buildingId) {
        this.loadFloorList(buildingId); // 传入选中的楼栋ID获取楼层
      }
    },

submitForm(){
  this.$refs.form.validate(async (valid) => {
    if (valid) {
   
      this.form.admissionNo = this.detailData.admission_no;
      delete this.form.roomId;
      const res = await editStudent(this.form);
      
        if (res) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$emit('update:dialogVisible', false);
          this.$emit('dialog-submit')
        } 
     
    }
  });
        
},



    
    // 房间下拉框选中值改变时触发
    handleRoomChange(roomId) {
      this.form.bedId = ''; // 房间改变时，清空已选的属性
      this.bedList = [];  // 清空床位列表
      if (roomId) {
        this.loadBedList(roomId); // 传入选中的房间ID获取床位列表
      }
    },

    async loadFloorList(buildingId) {
      try {
        // 如果没有传入 buildingId，就不请求数据
        if (!buildingId) return;

        // 假设 getFloorList 接口支持传入楼栋ID作为参数
        const res = await getFloorList({ buildingId: buildingId })
        this.floorList = res || []
      } catch (error) {
        console.error('获取楼层列表失败:', error)
      }
    },


    async loadBedList(roomId) {
      try {
        if (!roomId) return;
        // 假设 getBedList 接口支持传入 roomId
        const res = await getBedList({ roomId: roomId })
        this.bedList = res || []
      } catch (error) {
        console.error('获取床位列表失败:', error)
      }
    },


    // 监听楼层选择变化
    handleFloorChange(floorId) {
      this.form.roomId = '';    // 清空已选房间
      this.form.bedId = '';    // 清空已选床位
      this.bedList = [];       // 清空床位列表
      this.roomList = [];    // 清空房间列表
      if (floorId) {
        this.loadRoomList(floorId); // 传入选中的楼层ID获取房间列表
      }
    },


    async loadRoomList(floorId) {
      try {
        if (!floorId) return;

        const res = await getRoomList({ floorId: floorId })
        this.roomList = res || []
      } catch (error) {
        console.error('获取房间列表失败:', error)
      }
    },
    async loadBuildingList(schoolId) {
      try {
        if (!schoolId) return;
        // 假设 getBuildingList 接口支持传入 schoolId
        const res = await getBuildingList({ schoolId: schoolId })

        this.buildingList = res || []
      } catch (error) {
        console.error('获取宿舍列表失败:', error)
      }
    },
    async loadProjectList(schoolId) {
      try {
        if (!schoolId) return;
        // 假设 getProjectList 接口支持传入 schoolId
        const res = await getProjectList({ schoolId: schoolId })
        this.projectList = res || []
      } catch (error) {
        console.error('获取属性列表失败:', error)
      }
    },
    handleSchoolChange(schoolId) {
      this.form.buildingId = ''; // 清空已选楼栋
      this.form.floorId = '';    // 清空已选楼层
      this.form.projectId = '';  // 清空已选属性
      this.form.roomId = '';    // 清空已选房间
      this.form.bedId = '';    // 清空已选床位
      this.buildingList = [];  // 清空楼栋列表
      this.floorList = [];     // 清空楼层列表
      this.projectList = [];   // 清空属性列表
      this.roomList = [];      // 清空房间列表
      this.bedList = [];       // 清空床位列表
      if (schoolId) {
        this.loadBuildingList(schoolId);
        this.loadProjectList(schoolId); // 同时传入学校ID获取属性列表
      }
    },
    closeDialog() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.form = {};
      this.visible = false;
    }
  }
}
</script>

<style scoped>
/* 详情弹窗样式 */
.detail-dialog ::v-deep .el-dialog__body {
  padding: 10px 20px 30px;
  background-color: #f5f5f9;
  /* 匹配设计图浅紫色背景 */
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
