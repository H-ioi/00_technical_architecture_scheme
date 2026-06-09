<template>
  <div class="community_page">

    <div class="community_top">
      <div class="community_top_title">{{ $t("dorm.房间管理") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addItem" v-if="permissions['room-add']">{{ $t('dorm.新增房间') }}</el-button>
      </div>
    </div>
    <div class="community_centent" style="overflow-y: scroll;" v-loading="dataListLoading"
      element-loading-text="Loading...">
      <div class="community_searchFrom">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
          style="display: flex; align-items: center; flex-wrap: wrap;">
          <el-form-item>
            <el-select v-model="dataForm.schoolId" :placeholder="$t('attendance.学校')" clearable
              @change="handleSchoolChange">
              <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.externId"
              ></el-option>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-select v-model="dataForm.buildingId" :placeholder="$t('dorm.楼栋')" clearable    @change="loadFloorList(dataForm.buildingId)">
              <el-option v-for="building in buildingList" :key="building.id" :label="building.name"
                :value="building.id"></el-option>
            </el-select>
          </el-form-item>

           <el-form-item>
          <el-select v-model="dataForm.floorId" :placeholder="$t('dorm.楼层')" clearable style="width: 120px;"
          >
            <el-option v-for="floor in floorList" :key="floor.id" :label="floor.name" :value="floor.id"></el-option>
          </el-select>
        </el-form-item>


          <el-form-item>
            <el-select v-model="dataForm.roomGender" :placeholder="$t('dorm.性别')" clearable style="width: 120px;">
              <el-option :label="$t('dorm.男')" value="1"></el-option>
              <el-option :label="$t('dorm.女')" value="2"></el-option>

            </el-select>
          </el-form-item>


          
          <el-form-item>
           <el-input  v-model="dataForm.studentNameKeyword" :placeholder="$t('dorm.姓名')" style="width: 140px;"  />
          </el-form-item>
           <el-form-item>
           <el-input  v-model="dataForm.roomNumberKeyword" :placeholder="$t('dorm.房号')" style="width: 120px;"  />
          </el-form-item>
          <el-form-item>
            <div class="button-group" style="margin-top: 10px;">
              <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
                $t("btn.重置") }}</el-button>
              <el-button @click="getDataList()" type="primary">{{ $t('attendance.查询') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>



      <template v-for="(building, index) in dataList" v-if="building.room.length > 0">
        <div style="margin: 20px 0; border-bottom: 1px solid #EBEEF5; display: flex; justify-content: space-between; align-items: center;" :key="'header-' + index">
          <div style="font-size: 18px; font-weight: 500; line-height: 26px;margin-bottom: 10px;">
          {{ $i18n.locale === 'en' ?( building.building.name + ',' + building.name ): (building.building.name + '栋' + building.name + '层') }} </div>
          <div style="font-size: 14px; color: #606266; margin-bottom: 10px; display: flex; align-items: center;">
            <el-avatar size="small" style="margin-right: 8px; background: transparent;" src="/img/isacommunity/girl.png"></el-avatar>
            <span class="female-text" style="margin-right: 16px;">{{ building.female_student_count }}</span>
            <el-avatar size="small" style="margin-right: 8px; background: transparent;" src="/img/isacommunity/boy.png"></el-avatar>
            <span class="male-text">{{ building.male_student_count }}</span>
          </div>
        </div>
        <div class="isa_table" style="display: flex; gap: 20px; flex-wrap: wrap;margin-top: 20px;"  
          :key="'content-' + index">

          <!-- 卡片列表布局 -->
          <el-card 
          class="building-card" 
          v-for="(item, itemIndex) in building.room" 
          :key="itemIndex" 
          shadow="hover"
          :class="getGenderCardBgClass(item.gender)"
        >
            <!-- 头部: 楼栋名和开关 -->
            <div slot="header" class="card-header">
              <span class="building-name">{{ item.number }}
              <span 
                v-if="[0, 1, 2].includes(item.occupancy_status)" 
                :class="['occupancy-status-tag', `status-${item.occupancy_status}`]"
              >
                {{ getOccupancyText(item.occupancy_status) }}
              </span>
           
            
            </span>


              <el-switch v-model="item.is_active" :active-value="1" active-color="#9CD1A0" :inactive-value="0"   @change="handleStatusChange(item)"></el-switch>
            </div>

            <!-- 主体内容: 信息展示 -->
            <div class="card-content">
              <el-row :gutter="20" class="info-row" style="margin-top: 12px;">
                <el-col :span="12">
                  <span class="label">{{ $t('dorm.创建时间') }}：</span>
                  <span class="value">{{ item.created_at }}</span>
                </el-col>
                <el-col :span="12">
                  <span class="label">{{ $t('dorm.更新时间') }}：</span>
                  <span class="value">{{ item.updated_at }}</span>
                </el-col>
              </el-row>

              <el-row class="info-row">
                <el-col :span="24">
                  <span class="label">{{ $t('dorm.所属校区') }}：</span>
                  <span class="value">{{ building.building.school.en_name }}</span>
                </el-col>
              </el-row>

              <el-row :gutter="20" class="info-row">
                <el-col :span="12">
                  <span class="label">{{ $t('dorm.属性') }} ：</span>
                  <el-tooltip v-if="item.project && item.project.name && item.project.name.length > 30" class="item" effect="dark" :content="item.project.name" placement="top">
                    <span class="value">{{ item.project.name.substring(0, 30) + '...' }}</span>
                  </el-tooltip>
                  <span v-else class="value">{{ item.project ? item.project.name : "-" }}</span>
                </el-col>
                <el-col :span="12">
                  <span class="label">{{ $t('dorm.床位数') }}：</span>
                  <span class="value">{{ item.bed_usage_ratio }}</span>
                </el-col>
              </el-row>

              <el-row class="info-row">
                <el-col :span="24">
                  <span class="label">{{ $t('dorm.入住学生') }}：</span>
                  <el-tooltip v-if="item.student_names && item.student_names.length > 60" class="item" effect="dark" :content="item.student_names" placement="top">
                    <span class="value" >{{ item.student_names.substring(0, 60) + '...' }}</span>
                  </el-tooltip>
                  <span v-else class="value">{{ item.student_names }}</span>
                </el-col>
              </el-row>
            </div>

            <!-- 底部操作按钮 -->
            <div class="card-footer" :class="getGenderFooterBgClass(item.gender)">
              <span :style="{ color: 'rgba(101, 154, 191, 1)', cursor: 'pointer' }" @click="goToAssign(item)"
                v-if="permissions['room-assignment'] && item.is_active === 1">{{ $t('dorm.床位分配') }}</span>
              <span :style="{ color:'#E6A23C', cursor: 'pointer' }" @click="editForm(item)"
                v-if="permissions['room-edit']">{{ $t('btn.编辑') }}</span>
              <span :style="{ color: '#F56C6C', cursor: 'pointer' }" @click="deleteRoom(item)"
                v-if="permissions['room-delete']">{{ $t('btn.删除') }}</span>
            </div>
          </el-card>

        </div>
      </template>

      <el-empty v-if="!dataList || dataList.length === 0 || !dataList.some(b => b.room && b.room.length > 0)"></el-empty>

    </div>

    <room-model :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode" :school-list="dictionary['school']"
      @dialog-submit="submitConditionDialog" @dialog-cancel="closeConditionDialog" />

    <el-dialog
      :title="$t('dorm.确认删除')"
      :visible.sync="deleteDialogVisible"
      width="400px"
      custom-class="delete-confirm-dialog"
      :show-close="true"
      center
    >
      <div class="delete-dialog-content">
        <div class="warning-icon">
          <img src="/img/isacommunity/warn.png"  />
        </div>
        <div class="warning-title">{{ $t('dorm.确定要删除该房间吗？') }}</div>
        <div class="warning-text">{{ $t('dorm.确认删除,无法恢复') }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('btn.取消') }}</el-button>
        <el-button type="danger" @click="confirmDelete">{{ $t('btn.删除') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>


import { getFloorListPage, deleteRoomBatch, getBuildingList, deactivateRoom,activateRoom,getFloorList } from '@/api/isacommunity/dorm'
import Pagination from "@/components/communitycommon/Pagination.vue";
import RoomModel from './room-model.vue';
import { mapGetters } from "vuex";
import { headercellstyle } from '../common-style.js';

export default {
  name: 'RoomManage',
  components: { Pagination, RoomModel },
  data() {
    return {
      dataForm: {
        schoolId: '',
        roomGender: '',
        buildingId: '',
        floorId: '',
        studentNameKeyword: '',
        roomNumberKeyword: '',
      },
      isViewMode: false,

      pagination: {
        size: 10,
        current: 1,
      },
      headercellstyle,
      cancelDialogVisible: false,
      paginationTotal: 0,
      cancelData: null,
      editData: null,
      dataList: [],
      floorList: [],
      buildingList: [],
      dialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],

      deleteDialogVisible: false,
      itemToDelete: null // 临时存储要删除的数据
    }
  },
  mounted() {
    this.getDataList();

  


  },
  computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },
  methods: {
    // 获取数据列表
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },

        // 获取楼层列表
    async loadFloorList(buildingId) {
      this.dataForm.floorId = ''; // 清空已选楼层
      try {
        // 如果没有传入 buildingId，就不请求数据
        if (!buildingId) return;
        // 清空已选楼层
        this.dataForm.floorId = '';
        // 清空已选房间
       
        // 清空楼层列表
        this.floorList = [];

        const res = await getFloorList({ buildingId: buildingId })
        this.floorList = res || []
      } catch (error) {
        console.error('获取楼层列表失败:', error)
      }
    },

    handleStatusChange(row) {

      if (row.is_active === 1) {

        activateRoom({ id: row.id }).then(res => {
          this.$message.success(this.$t('dorm.状态更新成功'));
          this.getDataList();
        }).catch(err => {
          this.$message.error(this.$t('dorm.状态更新失败'));
        });
      } else {

        deactivateRoom({ id: row.id }).then(res => {
          this.$message.success(this.$t('dorm.状态更新成功'));
          this.getDataList();
        }).catch(err => {
          this.$message.error(this.$t('dorm.状态更新失败'));
        });
      }

    },

    handleSchoolChange(schoolId) {
      this.dataForm.buildingId = ''; // 清空已选楼栋
      this.dataForm.floorId = '';    // 清空已选楼层
      this.dataForm.projectId = '';  // 清空已选属性
      if (schoolId) {
        this.loadBuildingList(schoolId);

      }
    },
    async loadBuildingList(schoolId) {
      try {
        if (!schoolId) return;
        const res = await getBuildingList({ schoolId: schoolId })
        this.buildingList = res || []
      } catch (error) {
        console.error('获取宿舍列表失败:', error)
      }
    },
    // 删除楼层
    deleteRoom(item) {
      this.itemToDelete = item;
      this.deleteDialogVisible = true;
    },
    // 确认删除逻辑
    confirmDelete() {
      if (!this.itemToDelete) return;
      deleteRoomBatch({ id: this.itemToDelete.id }).then(res => {
        this.$message.success(this.$t('dorm.删除成功'));
        this.deleteDialogVisible = false;
        this.getDataList();
      }).catch(err => {
          this.deleteDialogVisible = false;
      }).finally(() => {
        this.itemToDelete = null;
      });
    },
    // 跳转到床位分配页面
    goToAssign(row) {
      console.log(row,'wwww')
      this.$router.push({
        path: `/isacommunity/dorm/space/room/${row.id}?gender=${row.gender}&schoolId=${row.school_id}` // 拼接为动态路由路径
      });
    },

    submitConditionDialog(formData) {
      this.dialogVisible = false
      this.getDataList()
    },
    submitCancelDialog(formData) {
      this.cancelDialogVisible = false
      this.getDataList()
    },
    async getDataList() {
      this.dataListLoading = true;
      try {
        const params = {
          ...this.pagination,
          size: 999,
          includeRoom: true, // 房间页面应该是 includeRoom: true
          schoolId: this.dataForm.schoolId,
          buildingId: this.dataForm.buildingId,
          roomGender: this.dataForm.roomGender,
          floorId: this.dataForm.floorId,
          studentNameKeyword: this.dataForm.studentNameKeyword,
          roomNumberKeyword: this.dataForm.roomNumberKeyword,
        }
        let res = await getFloorListPage(params) // 房间页面调用的应该是 getFloorListPage
        this.dataList = res.data
        this.paginationTotal = res.total
      } catch (error) {
        console.error('获取列表数据失败:', error);
      } finally {
        this.dataListLoading = false;
      }
    },



    // 重置
    clear() {
      this.dataForm = {
        schoolId: '',
        roomGender:'',
        buildingId: '',
        floorId: '',
        studentNameKeyword: '',
        roomNumberKeyword: '',
      };
      this.getDataList()
    },
    // 新增
    addItem() {

      this.dialogVisible = true;
      this.isViewMode = false;
      this.editData = null;
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
    // 获取入住状态文本
    getOccupancyText(status) {
      const map = {
        0: this.$t('dorm.空闲可住'),
        1: this.$t('dorm.部分入住'),
        2: this.$t('dorm.已住满')
      };
      return map[status] || '';
    },
    // 根据性别设置卡片背景色
    getGenderCardBgClass(gender) {
      if (String(gender) === '1') return 'card-bg-female';
      if (String(gender) === '2') return 'card-bg-male';
      return '';
    },
    // 根据性别设置卡片底部背景色
    getGenderFooterBgClass(gender) {
      if (String(gender) === '1') return 'footer-bg-male';
      if (String(gender) === '2') return 'footer-bg-female';
      return '';
    }
  }
}
</script>

<style scoped lang="scss">

  .male-text {
    color:rgba(89, 181, 229, 1) ;
    font-weight: 400;
    font-size: 16px;
  }
  .female-text {
    color:rgba(224, 94, 158, 1) ;
    font-weight: 400;
    font-size: 16px;
  }

.el-col {
  margin-bottom: 0px !important;
}

.el-form-item {
  margin-bottom: 9px !important;
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
.text-truncate {
  display: inline-block;
  max-width: 340px;        /* 根据需要调整 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 卡片布局样式 */
.building-card {

 width: 49%;
  /* 适当减小最小宽度，防止屏幕缩小时换行太早 */
  box-sizing: border-box;
  /* 确保 padding 和 border 不会增加额外宽度 */
  border-radius: 20px;
box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
background: rgba(255, 255, 255, 1);

  ::v-deep .el-card__header {
    padding: 15px 20px;
    border-bottom: 0px solid #F2F6FC;
  }

  ::v-deep .el-card__body {
    padding: 0;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  

  .building-name {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
}

.card-content {
  padding: 0px 20px;
border-top: 1px solid #F2F6FC;
  .info-row {
    margin-bottom: 12px;
    font-size: 14px;

    .label {
      color: #909399;
    }

    .value {
      color: #303133;
    }
  }
}

.custom-progress {
  margin-top: 15px;
  ::v-deep .el-progress-bar__outer {
    background-color: #E4E7ED;
    border-radius: 4px;
  }
  ::v-deep .el-progress-bar__inner {
    background-color: #BA8E62 !important;
    border-radius: 4px;
  }
}

/* 卡片动态背景色 */
.card-bg-male {
  background-color: rgba(250, 241, 241, 1) !important;
}
.card-bg-female {
  background-color: rgba(233, 244, 249, 1) !important;
}

.card-footer {
  padding: 10px 20px;
  background-color: rgba(250, 250, 250, 1); /* 默认色 */
  border-top: 1px solid #F2F6FC;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  border-radius: 0 0 12px 12px;
  
  .span {
     cursor: pointer;
  }
}

/* 底部操作区动态背景色 */
.footer-bg-male {
  background-color: rgba(218, 238, 245, 1) !important;
}
.footer-bg-female {
  background-color: rgba(250, 230, 230, 1) !important;
}

/* 入住状态标签通用样式 */
.occupancy-status-tag {
  font-size: 12px;
  padding: 2px 6px;
  margin-left: 10px;
  font-weight: normal;
  border-radius: 6px;
}

/* 各状态颜色 */
.status-0 { /* 空闲可住 */
  background-color: rgba(156, 209, 160, 0.21);
  color: rgba(16, 185, 129, 1);
}
.status-1 { /* 部分入住 */
  background-color: rgba(205, 233, 253, 1);
  color: rgba(59, 130, 246, 1);
}
.status-2 { /* 已满 */
  background-color: rgba(224, 162, 162, 0.21);
  color: rgba(239, 68, 68, 1);
}
/* 自定义删除确认弹窗样式 */
::v-deep .delete-confirm-dialog {
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  
  .el-dialog__header {
    border-bottom: 0px solid #F2F6FC !important;
    .el-dialog__headerbtn {
      top: 15px;
      right: 15px;
    }
    .el-dialog__title{
      color: #303133;
      font-size: 22px;
      font-weight: 500;
    }
  }
  
  .el-dialog__body {
    padding: 30px 20px 10px;
  }
  
  .delete-dialog-content {
    text-align: center;
    
    .warning-icon {
      font-size: 48px;
      color: #F56C6C;
      margin-bottom: 15px;
    }
    
    .warning-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 10px;
    }
    
    .warning-text {
      font-size: 14px;
      color: #909399;
    }
  }

  
  .el-dialog__footer {
    padding-bottom: 30px;
    
    .el-button {
      min-width: 90px;
      border-radius: 4px;
      
      &--default {
        background-color: #FFFFFF !important;
        border-color: #DCDFE6 !important;
        color: #000000 !important;
        
      
      }
      
      &--danger {
        background-color: #FF0000 !important;
        border-color: #F56C6C !important; 
        color: #FFFFFF !important;
        
      
      }
    }
  }
}
</style>
