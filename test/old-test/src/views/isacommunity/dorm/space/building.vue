<template>
  <div class="community_page">

    <div class="community_top">
      <div class="community_top_title">{{ $t("dorm.楼栋管理") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" @click="addItem" icon="el-icon-circle-plus-outline" v-if="permissions['building-add']">{{ $t('dorm.新增楼栋') }}</el-button>
      </div>
    </div>
    <div class="community_centent" style="overflow-y: scroll;">
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
            <el-select v-model="dataForm.buildingId" :placeholder="$t('dorm.楼栋')" clearable>
              <el-option v-for="building in buildingList" :key="building.id" :label="building.name"
                :value="building.id"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-select v-model="dataForm.isActive" :placeholder="$t('dorm.状态')" clearable >
              <el-option :label="$t('dorm.启用')" value="1"></el-option>
              <el-option :label="$t('dorm.禁用')" value="0"></el-option>

            </el-select>
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

      <div class="isa_table" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <!-- 卡片列表布局 -->
        <el-card class="building-card" v-for="(item, index) in dataList" :key="index" shadow="hover">
          <!-- 头部: 楼栋名和开关 -->
          <div slot="header" class="card-header">
            <span class="building-name">{{ item.name }}</span>
            <el-switch v-model="item.is_active" :active-value="1" active-color="#9CD1A0" :inactive-value="0"
              @change="handleStatusChange(item)"></el-switch>
          </div>

          <!-- 主体内容: 信息展示 -->
          <div class="card-content">
            <el-row :gutter="20" class="info-row">
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
                <span class="value">{{ item.school.en_name }}</span>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="info-row">
              <el-col :span="12">
                <span class="label">{{ $t('dorm.总层数') }}：</span>
                <span class="value">{{ item.floor_count }}{{ $i18n.locale === 'en' ? '' : '层' }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">{{ $t('dorm.总房间数') }}：</span>
                <span class="value">{{ item.total_room_count }}{{ $i18n.locale === 'en' ? '' : '个' }}</span>
              </el-col>
            </el-row>

            <el-row class="info-row">
              <el-col :span="24">
                <span class="label">{{ $t('dorm.已占用') }}：</span>
                <span class="value">{{ item.used_room_count  }}{{ $i18n.locale === 'en' ? '' : '个' }}</span>
              </el-col>
            </el-row>

            <!-- 进度条 -->
            <el-progress :percentage="item.room_occupancy_ratio*100" :show-text="false"
              class="custom-progress">
            </el-progress>
          </div>
          <!-- 底部操作按钮 -->
          <div class="card-footer">
            <!-- <span style="color: #409EFF; cursor: pointer;" @click="viewForm(item)">查看</span> -->
            <span style="color: #E6A23C; cursor: pointer;" @click="editForm(item)" v-if="permissions['building-edit']">{{ $t('btn.编辑') }}</span>
            <span style="color: #F56C6C; cursor: pointer;" @click="deleteBuilding(item)" v-if="permissions['building-delete']">{{ $t('btn.删除') }}</span>
          </div>
        </el-card>
      </div>

      <el-empty v-if="!dataList || dataList.length === 0"></el-empty>

    </div>

    <build-model :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode"
      :school-list="dictionary['school']" @dialog-submit="submitConditionDialog" @dialog-cancel="closeConditionDialog" />
      
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
        <div class="warning-title">{{ $t('dorm.确定要删除该楼栋吗？') }}</div>
    
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('btn.取消') }}</el-button>
        <el-button type="danger" @click="confirmDelete">{{ $t('btn.删除') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBuildingListPage, getBuildingDetail, deleteBuildingBatch, getBuildingList, activateBuilding, deactivateBuilding } from '@/api/isacommunity/dorm'
import Pagination from "@/components/communitycommon/Pagination.vue";
import BuildModel from './build-model.vue';
import WarnModel from '../warn-model.vue';
import { mapGetters } from "vuex";
export default {
  name: 'BuildingManage',
  components: { Pagination, BuildModel, WarnModel },
  data() {
    return {
      dataForm: {
        schoolId: '',
        buildingId: '',
        isActive: '',
      },
      isViewMode: false,
      pagination: {
        size: 10,
        current: 1,
      },
      cancelDialogVisible: false,
      paginationTotal: 0,
      cancelData: null,
      editData: null,
      dataList: [],
      buildingList: [],
      dialogVisible: false,
      dataListLoading: false,
      deleteDialogVisible: false,
      deleteItem: null,

    }
  },
  mounted() {
    this.getDataList();

  },
  computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },
  methods: {

    handleSchoolChange(schoolId) {
      if (schoolId) {
        this.loadBuildingList(schoolId);
      }
    },
    async loadBuildingList(schoolId) {
      try {
        if (!schoolId) return;

        const res = await getBuildingList({ schoolId: schoolId })

        console.log('获取到的楼栋列表:', res);
        this.buildingList = res || []
      } catch (error) {
        console.error('获取宿舍列表失败:', error)
      }
    },


    // 获取数据列表
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },
    // 删除楼宇
    deleteBuilding(item) {
      this.deleteItem = item;
      this.deleteDialogVisible = true;
    },
    confirmDelete() {
      if (!this.deleteItem) return;
      deleteBuildingBatch({ id: this.deleteItem.id }).then(res => {
        this.$message.success(this.$t('dorm.删除成功'));
        this.getDataList();
        this.deleteDialogVisible = false;
        this.deleteItem = null;
      }).catch(err => {
    
      });
    },

    // 处理状态切换
    handleStatusChange(row) {
      // 可以在这里调用后端接口更新状态
   
      
       if(row.is_active === 1){
    
        activateBuilding({ id: row.id }).then(res => {
          this.$message.success(this.$t('dorm.状态更新成功'));
          this.getDataList();
        }).catch(err => {
          this.$message.error(this.$t('dorm.状态更新失败'));
        });
       }else{
     
      deactivateBuilding({ id: row.id }).then(res => {
        this.$message.success(this.$t('dorm.状态更新成功'));
        this.getDataList();
      }).catch(err => {
        this.$message.error(this.$t('dorm.状态更新失败'));
      });
       }
      
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

      this.dataListLoading = true
      const params = {
        ...this.pagination,
        buildingId: this.dataForm.buildingId,
        schoolId: this.dataForm.schoolId,
        isActive: this.dataForm.isActive
      }
      let res = await getBuildingListPage(params)
      this.dataList = res.data
      this.paginationTotal = res.total
      this.dataListLoading = false

    },
 



    // 重置
    clear() {
      this.dataForm = {
        keyword: '',
        schoolId: '',
        buildingId: '',
        isActive: '',
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
      this.isViewMode = false
      this.dialogVisible = true
      // 如果需要调用接口获取详情

      getBuildingDetail(row.id).then(res => {
        this.editData = res.data
      }).catch(err => {
        console.error('获取详情失败:', err)
        this.editData = JSON.parse(JSON.stringify(row)) // 失败时回退使用列表数据
      })

    },
    // 查看
    viewForm(row) {
      this.isViewMode = true
      this.dialogVisible = true
      if (row.id) {
        getBuildingDetail(row.id).then(res => {
          this.editData = res.data
        }).catch(err => {
          console.error('获取详情失败:', err)
          this.editData = JSON.parse(JSON.stringify(row))
        })
      } else {
        this.editData = JSON.parse(JSON.stringify(row))
      }
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

/* 卡片布局样式 */
.building-card {
  width: calc((100% - 40px) / 3);
  /* 减去 gap 的总宽度再除以 3 */
  min-width: 300px;
  /* 适当减小最小宽度，防止屏幕缩小时换行太早 */
  box-sizing: border-box;
  /* 确保 padding 和 border 不会增加额外宽度 */
border-radius: 20px;
box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
background: rgba(255, 255, 255, 1);

  ::v-deep .el-card__header {
    padding: 15px 20px;
    border-bottom: 1px solid #F2F6FC;
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
  padding: 20px;
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
    /* 接近截图的蓝色 */
    border-radius: 4px;
  }
}

.card-footer {
  padding: 10px 20px;
  border-top: 1px solid #F2F6FC;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
border-radius: 0px 0px 20px 20px;
background: rgba(250, 250, 250, 1);
  .span {
    cursor: pointer;
  }
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