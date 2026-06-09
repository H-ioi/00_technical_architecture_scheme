<template>
  <div class="community_page">

    <div class="community_top">
      <div class="community_top_title">  
         <i class="el-icon-arrow-left back-icon" @click="$router.go(-1)"></i>
          {{ $t('dorm.床位分配') }}</div>
      
      <div class="community_top_btn" style="display: flex; align-items: center; gap: 15px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddBedDialog" >{{ $t('dorm.新增床位') }}</el-button>
      
      </div>
    </div>
    <div class="community_centent" style="overflow-y: scroll;">


      <div class="isa_table" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <!-- 卡片列表布局 -->
        <el-card class="building-card" v-for="(item, index) in dataList.beds" :key="index" shadow="hover">
          <!-- 头部: 床位号、状态和操作人 -->
          <div slot="header" class="card-header">
            <div class="header-left">
              <span class="building-name">{{ item.label }}</span>
              <span :class="item.student === null ? 'status-tag-empty' : 'status-tag'">{{ item.student === null ?
                $t('dorm.空闲') : $t('dorm.已入住')}}</span>
            </div>
            <div class="header-right" v-if="item.student !== null">
              <el-avatar size="small" style="margin-right: 8px;background: transparent;"
                src="/img/isacommunity/girl.png" v-if="item.student.gender === 2"></el-avatar>
              <el-avatar size="small" style="margin-right: 8px;background: transparent;" src="/img/isacommunity/boy.png"
                v-if="item.student.gender === 1"></el-avatar>
              <span class="student-name" v-if="item.student !== null">{{ item.student.en_name }}</span>
            </div>

             <div class="header-right" v-if="item.student== null">
                 <span class="student-name"  style="color: #FF0000; cursor: pointer;" @click="handleDelete(item)">{{ $t('btn.删除') }}</span>
            </div>
          </div>

          <!-- 主体内容: 信息展示 -->
          <div class="card-content" v-if="item.student !== null">
            <el-row class="info-row" style="margin-bottom: 20px;">
              <el-col :span="24">
                <span class="label">{{ $t('dorm.所属校区') }}：</span>
                <span class="value">{{ item.schoolName }}</span>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="info-row">
              <el-col :span="10">
                <span class="label">{{ $t('isagroup.学号') }}：</span>
                <span class="value">{{ item.student.admission_no }}</span>
              </el-col>
              <el-col :span="7">
                <span class="label">{{ $t('dorm.年级') }}：</span>
                <span class="value">{{ item.student.grade_code }}</span>
              </el-col>
              <el-col :span="7">
                <span class="label">{{ $t('isagroup.班级') }}：</span>
                <span class="value">{{ item.student.form_code }}</span>
              </el-col>
            </el-row>
          </div>

          <!-- 底部操作按钮 -->
          <div class="card-footer" v-if="item.student !== null" style="height: 30px;">
            <span class="btn-text btn-change" @click="handleChange(item)">{{ $t('dorm.换宿') }}</span>
            <span class="btn-text btn-checkout" @click="handleCheckout(item)">{{ $t('dorm.退宿') }}</span>
          </div>


          <div class="card-content" v-if="item.student === null"
            style="text-align: center;display: flex;flex-direction: column;align-items: center;justify-content: space-between;">

            <img src="/img/isacommunity/bed.png"  style="width: 97px; height: 66px;margin-top: 20px;">


          </div>
          <div class="card-footer" v-if="item.student == null" style="background-color: #ffffff; height: 30px;">

            <span @click="handleCheckin(item)" type="primary" style="background-color: rgba(123, 175, 211, 1); 
                border-color: rgba(123, 175, 211, 1);
                color:white; padding:6px 12px;
                cursor: pointer;
                border-radius: 6px;
                ">{{ $t('dorm.办理入住') }}</span>
          </div>


        </el-card>

      </div>

    
      <el-empty v-if="dataList.beds.length === 0" />
    </div>

    <room-student :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode"
      @dialog-submit="submitConditionDialog" @dialog-cancel="closeConditionDialog" :room-id="roomId" :gender="gender" :school-id="schoolId" />
    <room-change :dialog-visible.sync="changeDialogVisible" :edit-data="editData" :is-view-mode="isViewMode"
      @dialog-submit="submitChangeDialog" @dialog-cancel="closeChangeDialog" :room-id="roomId" :school-id="schoolId"
      :admission-no="admissionNo" :gender="gender" />

    <el-dialog
      :title="$t('dorm.新增床位')"
      :visible.sync="addBedDialogVisible"
      width="400px"
      @close="closeAddBedDialog"
      center
    >
      <el-form :model="addBedForm" :rules="addBedRules" ref="addBedForm" :label-width="$i18n.locale === 'en' ? '120px' : '80px'">
        <el-form-item :label="$t('dorm.床位号')" prop="label">
          <el-input v-model="addBedForm.label" :placeholder="$t('dorm.请输入床位号')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddBedDialog">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitAddBed" :loading="addBedLoading">{{ $t('btn.确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBedListPage, assignBed, checkoutBed, saveBed, deleteBed } from '@/api/isacommunity/dorm'
import Pagination from "@/components/communitycommon/Pagination.vue";
import RoomStudent from './room-student.vue';
import RoomChange from './room-change.vue';

import { headercellstyle } from '../common-style.js';
import { Empty } from 'element-ui';

export default {
  name: 'RoomAssigne',
  components: { Pagination, RoomStudent, RoomChange },
  data() {
    return {
      dataForm: {
        keyword: '',
        type: '',
        school: '',
        dateRange: [],
        scp: ''
      },
      isViewMode: false,
      pagination: {
        size: 10,
        current: 1,
      },
      admissionNo: '',
      headercellstyle,
      cancelDialogVisible: false,
      paginationTotal: 0,
      cancelData: null,
      editData: null,
      dataList: [],
      dialogVisible: false,
      changeDialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      schoolList: [],
      roomId: null, // 用于存储从路由参数中获取的房间ID
      gender: null, // 用于存储从路由参数中获取的性别
      addBedDialogVisible: false,
      addBedLoading: false,
      addBedForm: {
        label: ''
      },
      addBedRules: {
        label: [
          { required: true, message: this.$t('dorm.请输入床位号'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 从路由的 path 中截取最后的数字作为 ID
    const pathParts = this.$route.path.split('/');
    this.roomId = pathParts[pathParts.length - 1];

    console.log('当前房间ID:', this.roomId);
    this.gender = this.$route.query.gender;
    this.schoolId = this.$route.query.schoolId;

    this.getDataList();
  
  },
  methods: {
    // 获取数据列表
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },
    closeChangeDialog(val) {
      this.changeDialogVisible = false
      this.editData = null // 重置编辑数据
    },

    submitChangeDialog(formData) {
      this.changeDialogVisible = false
      this.getDataList()
    },
    submitCancelDialog(formData) {
      this.cancelDialogVisible = false
      this.getDataList()
    },

    submitConditionDialog(formData) {
      this.dialogVisible = false
      this.getDataList()
    },
    submitCancelDialog(formData) {
      this.cancelDialogVisible = false
      this.getDataList()
    },
    getDataList() {
      this.dataListLoading = true


      getBedListPage(this.roomId).then((res) => {

        this.dataList = res

        this.dataListLoading = false
      }).catch(err => {
        console.error(err);
        this.dataListLoading = false
      })
    },
    // 换宿操作
    handleChange(item) {
      this.editData = JSON.parse(JSON.stringify(item));
      this.isViewMode = false;
      this.changeDialogVisible = true;


      this.admissionNo = item.student.admission_no;

    },

    // 退宿操作
    handleCheckout(item) {
      this.$confirm(this.$t('dorm.是否确认给该学生办理退宿？'), this.$t('consult.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(async () => {
        try {
          const params = {
            "bed_id": parseInt(item.id),
            "admission_no": item.admissionNo

          };
          await checkoutBed(params);
          this.$message({
            type: 'success',
            message: '退宿成功!'
          });
          // 刷新列表数据
          this.getDataList();
        } catch (error) {
          console.error('退宿失败:', error);
          // 错误提示通常已经在拦截器中处理了，如果需要单独处理可以在这里添加
        }
      }).catch(() => {
        // 取消退宿
      });
    },

    // 删除床位操作
    handleDelete(item) {
      this.$confirm(this.$t('dorm.是否确认删除该床位？'), this.$t('consult.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(async () => {
        try {
          const params = {
            id: item.id
          };
          await deleteBed(params);
          this.$message({
            type: 'success',
            message: this.$t('attendance.操作成功')
          });
          // 刷新列表数据
          this.getDataList();
        } catch (error) {
          console.error('删除床位失败:', error);
         
        }
      }).catch(() => {
        // 取消删除
      });
    },

    // 处理办理入住点击事件
    handleCheckin(item) {
      // 打开分配学生的弹窗，并传递当前床位数据
      this.editData = JSON.parse(JSON.stringify(item));
      this.isViewMode = false;
      this.dialogVisible = true;
    },

    // 重置
    clear() {
      this.dataForm = {
        keyword: '',
        type: '',
        school: '',
        dateRange: [],
        scp: ''
      };
      this.getDataList()
    },
    // 新增
    addItem() {

      this.dialogVisible = true;
      this.isViewMode = false;
      this.editData = null;
    },

    // 打开新增床位弹窗
    openAddBedDialog() {
      this.addBedForm.label = '';
      this.addBedDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.addBedForm) {
          this.$refs.addBedForm.clearValidate();
        }
      });
    },

    // 关闭新增床位弹窗
    closeAddBedDialog() {
      this.addBedDialogVisible = false;
    },

    // 提交新增床位
    submitAddBed() {
      this.$refs.addBedForm.validate((valid) => {
        if (valid) {
          this.addBedLoading = true;
          const params = {
            roomId: parseInt(this.roomId),
            label: this.addBedForm.label,
            is_active:1
          };
          saveBed(params).then(res => {
            this.$message.success(this.$t('attendance.操作成功'));
            this.addBedLoading = false;
            this.addBedDialogVisible = false;
            this.getDataList();
          }).catch(err => {
         
            this.addBedLoading = false;
          });
        }
      });
    },

    // 编辑
    editForm(row) {
      this.editData = JSON.parse(JSON.stringify(row)) // 深拷贝避免直接修改原数据
      this.isViewMode = true
      this.dialogVisible = true
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getDataList();
    },
    handleSizeChange(size) {
      this.pagination["current"] = 1;
      this.pagination["size"] = size;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 获取部门标签
    getScopeLabel(value) {
      const scopeMap = {
        course: this.$t('attendance.课程'),
        dorm: this.$t('attendance.宿舍'),
        bus: this.$t('attendance.校巴')
      }
      return scopeMap[value] || value
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '1100': this.$t('attendance.待审批'),
        '102': this.$t('attendance.已拒绝'),
        '101': this.$t('attendance.已撤销'),
        '104': this.$t('attendance.已销假'),
        '1101': this.$t('attendance.休假中'),
        '1102': this.$t('attendance.已结束'),
        '1103': this.$t('attendance.待休假')
      }
      return statusMap[status] || '-'
    },

    getWeekDaysText(status) {
      const statusMap = {
        'monday': this.$t('attendance.周一'),
        'tuesday': this.$t('attendance.周二'),
        'wednesday': this.$t('attendance.周三'),
        'thursday': this.$t('attendance.周四'),
        'friday': this.$t('attendance.周五'),

      }
      return statusMap[status] || '-'
    },


    getHolidayEndStatusText(status) {
      const statusMap = {
        '100': this.$t('attendance.待审批'),
        '102': this.$t('attendance.已销假'),
        '101': this.$t('attendance.未销假'),

      }
      return statusMap[status] || this.$t('attendance.未销假')
    },
  }
}
</script>

<style scoped lang="scss">
/* 防止学校列内容换行 */
.el-table .el-table__cell[data-column-key="studentSchool"] {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.el-form-item {
  margin-bottom: 9px !important;
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}

/* 卡片布局样式 */
.building-card {
  width: calc((100% - 40px) / 3);
  min-width: 300px;
  box-sizing: border-box;
border-radius: 20px;
box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
background: rgba(255, 255, 255, 1);

  ::v-deep .el-card__header {
    padding: 15px 20px;
    border-bottom: none;
    background-color: transparent;
    position: relative;
  }

  ::v-deep .el-card__header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10px;
    right: 10px;
    border-bottom: 1px solid #EBEEF5;
  }

  ::v-deep .el-card__body {
    padding: 0;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .building-name {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }

    .status-tag {
      background-color: #E8F4EC;
      color: #67C23A;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .status-tag-empty {
      background-color: rgba(245, 245, 245, 1);
        padding: 3px 8px;
      color: rgba(153, 153, 153, 1);
        border-radius: 4px;
    }

  }

  .header-right {
    color: #303133;
    font-size: 14px;
    display: flex;
    align-items: center;

    .student-name {
      font-weight: 500;
    }
  }
}

.card-content {
  padding: 20px;
  height: 100px;

  .info-row {
    font-size: 14px;
    display: flex;
    align-items: center;

    .label {
      color: #909399;
    }

    .value {
      color: #303133;
    }
  }
}

.card-footer {
  padding: 12px 0;
  background-color: #F8F9FA;
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  border-radius: 0 0 8px 8px;

  .btn-text {
    font-size: 14px;
    cursor: pointer;
    user-select: none;

    &.btn-change {
      color: rgba(101, 154, 191, 1);
    }

    &.btn-checkout {
      color: #F56C6C;
    }
  }
}

.back-icon {
  margin-right: 4px;
  cursor: pointer;
  transition: color 0.3s;
}

.back-icon:hover {
  color: #BA8E62;
}
</style>