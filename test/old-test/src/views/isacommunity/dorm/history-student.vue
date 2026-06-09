<template>
  <div class="leave-manage">
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
          <el-select v-model="dataForm.buildingId" :placeholder="$t('dorm.楼栋')" clearable style="width: 110px;"
            @change="loadFloorList(dataForm.buildingId)">
            <el-option v-for="building in buildingList" :key="building.id" :label="building.name"
              :value="building.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="dataForm.floorId" :placeholder="$t('dorm.楼层')" style="width: 110px;"
            @change="handleFloorChange">
            <el-option v-for="floor in floorList" :key="floor.id" :label="floor.name" :value="floor.id"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-select v-model="dataForm.roomId" :placeholder="$t('dorm.房间号')" style="width: 110px;">
            <el-option v-for="room in roomList" :key="room.id" :label="room.number" :value="room.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="dataForm.projectId" :placeholder="$t('dorm.属性')" style="width: 120px;">
            <el-option v-for="project in projectList" :key="project.id" :label="project.name"
              :value="project.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>





          <el-input v-model="dataForm.keyword" :placeholder="$t('attendance.学号/姓名')" clearable
            style="width: 150px;"></el-input>
        </el-form-item>
       





       <el-form-item>
          <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="~"
            :start-placeholder="$t('dorm.入住日期')" :end-placeholder="$t('dorm.入住日期')" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" style="width: 250px" size="medium">
          </el-date-picker>
        </el-form-item>



          <el-form-item>
          <el-date-picker v-model="dataForm.dateRange2" type="daterange" range-separator="~"
            :start-placeholder="$t('dorm.退宿日期')" :end-placeholder="$t('dorm.退宿日期')" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" style="width: 250px" size="medium">
          </el-date-picker>
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

    <div class="isa_table">
      <el-table :data="dataList" fit v-loading="dataListLoading" 
        :header-cell-style="headercellstyle" style="width: 100%; font-size: 14px;">
      <el-table-column prop="student.school.en_name" header-align="center" align="left" :label="$t('attendance.学校')"
          show-overflow-tooltip width="200" fixed="left">
        </el-table-column>
        <el-table-column prop="admission_no" header-align="center" align="center" :label="$t('attendance.学号')"
          show-overflow-tooltip width="120" fixed="left">
        </el-table-column>
        
        <el-table-column prop="student.en_name" header-align="center" align="center" :label="$t('attendance.姓名')"
          show-overflow-tooltip width="120" fixed="left">
        </el-table-column>
      
        <el-table-column prop="student.grade_code" header-align="center" align="center" :label="$t('attendance.年级')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="student.form_code" header-align="center" align="center" :label="$t('attendance.班级')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="student.nationality" header-align="center" align="center" :label="$t('isagroup.国籍')"
          show-overflow-tooltip width="120">
        </el-table-column>

        <el-table-column prop="gender" header-align="center" align="center" :label="$t('isagroup.性别')"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.student.gender === '1' || scope.row.student.gender === 1 ? $t('dorm.男') : (scope.row.student.gender === '2' ||
              scope.row.student.gender === 2 ? $t('dorm.女') : scope.row.student.gender) }}
          </template>
        </el-table-column>


        <el-table-column prop="student.birthdate" header-align="center" align="center" :label="$t('isagroup.出生日期')"
          show-overflow-tooltip width="120">

        </el-table-column>
        <!--

        <el-table-column prop="isInfectious" header-align="center" align="center" :label="$t('dorm.是否过过敏原')"
          show-overflow-tooltip width="120">

        </el-table-column>


        <el-table-column prop="cancelLeave" header-align="center" align="center" :label="$t('dorm.是否定期服用药物')"
          width="150">

        </el-table-column>
        -->
        <el-table-column prop="student.has_bed" header-align="center" align="center" :label="$t('dorm.是否分配')"
          show-overflow-tooltip width="100">
          <template slot-scope="scope">
            {{ scope.row.student.has_bed ? $t('attendance.是') : $t('attendance.否') }}
          </template>
        </el-table-column>
        <el-table-column prop="student.project_name" header-align="center" align="center" :label="$t('dorm.属性')"  show-overflow-tooltip width="100" />
        <el-table-column prop="student.floor_name" header-align="center" align="center" :label="$t('dorm.楼层')"  show-overflow-tooltip width="100" />
        <el-table-column prop="student.room_room" header-align="center" align="center" :label="$t('dorm.房间号')" />

        <el-table-column prop="student.bed_label" header-align="center" align="center" :label="$t('dorm.床位')" />

        <el-table-column prop="checkin_date" header-align="center" align="center" :label="$t('dorm.住宿日期')" width="120">
          <template slot-scope="scope">
            {{ scope.row.checkin_date ? scope.row.checkin_date.substring(0, 10) : '' }}
          </template>
        </el-table-column>

        <el-table-column prop="checkout_date" header-align="center" align="center" :label="$t('dorm.退宿日期')" width="120">
          <template slot-scope="scope">
             {{ scope.row.checkout_date ? scope.row.checkout_date.substring(0, 10) : '' }}
          </template>
        </el-table-column>

          <el-table-column prop="operator_name" header-align="center" align="center" :label="$t('dorm.创建人')" />
            <el-table-column prop="created_at" header-align="center" align="center" :label="$t('dorm.创建时间')" show-overflow-tooltip width="180" />
              <el-table-column prop="updated_at" header-align="center" align="center" :label="$t('dorm.更新时间')" show-overflow-tooltip width="180" />
        
        <el-table-column header-align="center" align="center" :label="$t('attendance.操作')" width="100" fixed="right">
          <template slot-scope="scope">
        <a type="text" size="small" @click="viewDetail(scope.row)" class="text-btn"    v-if="permissions['boarding-view']">{{ $t("btn.查看") }}</a>
         <a type="text" size="small" @click="editStudent(scope.row)"  
                 v-if="permissions['boarding-edit'] " class="text-btn">{{ $t("btn.编辑") }}</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="df_sb isa_table_footer">
       <div></div>
        <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
          @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
      </div>
    </div>
 <student-model2 :dialog-visible.sync="detailDialogVisible" :detail-data="detailData" ></student-model2>
  <student-edit2 :dialog-visible.sync="editDialogVisible" :detail-data="editData" @dialog-submit="submitConditionDialog"></student-edit2>
  </div>
</template>

<script>
import { getDormStudentHistoryListPage, getOldSchoolList, getBuildingList, getFloorList, getRoomList, getProjectList } from '@/api/isacommunity/dorm'
import Pagination from "@/components/communitycommon/Pagination.vue";
import { mapGetters } from "vuex";
import { headercellstyle } from './common-style.js';
import studentModel2 from './student-model2.vue';
import studentEdit2 from './student-edit2.vue';

export default {
  name: 'HistoryStudentBoarding',
  components: { Pagination, studentModel2, studentEdit2 }, 
  data() {
    return {
      dataForm: {
        keyword: '',
        buildingId: '',
        floorId: '',
        projectId: '',
        schoolId: '',
        hasBed: '',
        roomId: '',
        dateRange: [],
        dateRange2: []
      },
      roomList: [],
      floorList: [],
      buildingList: [],
      isViewMode: false,
      projectList: [],
      pagination: {
        size: 10,
        current: 1,
      },
      detailDialogVisible: false,
      detailData: {},
      headercellstyle,
      paginationTotal: 0,
      cancelData: null,
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],

      editDialogVisible: false,
      editData: {},
   
      checkoutDate: '',
      checkOutLoading: false
    }
  },
  computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    editStudent(row) {
      this.editData = Object.assign({}, row);
      this.editDialogVisible = true;
    },

        submitConditionDialog(formData) {
      this.editDialogVisible = false
      this.getDataList()
    },
    // 监听楼层选择变化
    handleFloorChange(floorId) {
      this.dataForm.roomId = '';    // 清空已选房间

      this.roomList = [];    // 清空房间列表
      if (floorId) {
        this.loadRoomList(floorId); // 传入选中的楼层ID获取房间列表
      }
    },
    viewDetail(row) {
      this.detailData = Object.assign({}, row);
      this.detailDialogVisible = true;
    },
    // 获取楼层列表
    async loadFloorList(buildingId) {
      try {
        // 如果没有传入 buildingId，就不请求数据
        if (!buildingId) return;
        // 清空已选楼层
        this.dataForm.floorId = '';
        // 清空已选房间
        this.dataForm.roomId = '';
        // 清空房间列表
        this.roomList = [];
        // 清空楼层列表
        this.floorList = [];

        const res = await getFloorList({ buildingId: buildingId })
        this.floorList = res || []
      } catch (error) {
        console.error('获取楼层列表失败:', error)
      }
    },

    async loadRoomList(floorId) {
      try {
        if (!floorId) return;
        // 假设 getRoomList 接口支持传入 floorId
        const res = await getRoomList({ floorId: floorId })
        this.roomList = res || []
      } catch (error) {
        console.error('获取房间列表失败:', error)
      }
    },

    handleSchoolChange(schoolId) {
      // 强制更新视图，确保清空操作生效后下拉框不被锁死
      this.$set(this.dataForm, 'buildingId', '');
      this.buildingList = [];
      this.projectList = [];
      this.dataForm.projectId = '';
      this.dataForm.floorId=''
      this.dataForm.roomId=''
      this.dataForm.projectId=''

      if (schoolId) {
        this.loadBuildingList(schoolId);
        this.loadProjectList(schoolId);
      }
    },

    async loadProjectList(schoolId) {
      try {
        if (!schoolId) return;

        const res = await getProjectList({ schoolId: schoolId })
        this.projectList = res || []
      } catch (error) {
        console.error('获取属性列表失败:', error)
      }
    },


    // 获取楼栋列表
    async loadBuildingList(schoolId) {
      try {
        const res = await getBuildingList({ schoolId });
        // res 直接就是数组了
        this.buildingList = res || [];
      } catch (error) {
        console.error('获取楼栋列表失败:', error);
      }
    },

    getDataList() {
      this.dataListLoading = true;
      const params = {
        ...this.pagination,
        keyword: this.dataForm.keyword,
        schoolId: this.dataForm.schoolId,
        hasBed: this.dataForm.hasBed,
        buildingId: this.dataForm.buildingId,
        floorId: this.dataForm.floorId,
        projectId: this.dataForm.projectId,
        roomId: this.dataForm.roomId,
        checkinDateStart: this.dataForm.dateRange && this.dataForm.dateRange.length > 0 ? this.dataForm.dateRange[0] : '',
        checkinDateEnd: this.dataForm.dateRange && this.dataForm.dateRange.length > 0 ? this.dataForm.dateRange[1] : '',
        checkoutDateStart: this.dataForm.dateRange2 && this.dataForm.dateRange2.length > 0 ? this.dataForm.dateRange2[0] : '',
        checkoutDateEnd: this.dataForm.dateRange2 && this.dataForm.dateRange2.length > 0 ? this.dataForm.dateRange2[1] : ''



      };
      getDormStudentHistoryListPage(params).then((res) => {
        this.dataList = res.data
        this.paginationTotal = res.total

        this.dataListLoading = false
      }).catch(err => {
        console.error(err);
        this.dataListLoading = false
      })
    },

    



    // 重置
    clear() {
      this.dataForm = {
        keyword: '',
        schoolId: '',
        hasBed: '',
        buildingId: '',
        floorId: '',
        projectId: ''
      };
      this.getDataList()
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
/* 修复固定列穿透和层级问题 */
::v-deep .el-table {
  .el-table__fixed,
  .el-table__fixed-right {
    background-color: #ffffff;
    z-index: 10 !important;
  }
  
  .el-table__fixed-body-wrapper {
    background-color: #ffffff;
  }

  th.el-table__cell,
  td.el-table__cell {
    padding: 14px 0;
  }
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>
