<template>
  <div class="leave-manage">
    <div class="community_searchFrom">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
        style="display: flex; align-items: center; flex-wrap: wrap;">
        <el-form-item>
          <el-select v-model="dataForm.schoolId" :placeholder="$t('attendance.学校')" clearable
            @change="handleSchoolChange">
            <el-option :key="k" v-for="(i, k) in dictionary['school']" :label="i.enName"
              :value="i.externId"></el-option>
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
          <el-select v-model="dataForm.hasBed" :placeholder="$t('dorm.是否分配')" clearable style="width: 150px;">
            <el-option :label="$t('attendance.是')" value="true"></el-option>
            <el-option :label="$t('attendance.否')" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="~"
            :start-placeholder="$t('dorm.入住日期')" :end-placeholder="$t('dorm.入住日期')" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" style="width: 250px" size="medium">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker v-model="dataForm.dateRange2" type="daterange" range-separator="~"
            :start-placeholder="$t('dorm.预计退宿日期')" :end-placeholder="$t('dorm.预计退宿日期')" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" style="width: 250px" size="medium">
          </el-date-picker>
        </el-form-item>
          <el-form-item style="width: auto; margin-top: -12px">
          <div class="button-group" style="margin-top: 10px;">
            <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
              $t("btn.重置") }}</el-button>
            <el-button @click="getDataList()" type="primary">{{ $t('attendance.查询') }}</el-button>
             <el-button @click="checkAdd" type="primary"  v-if="permissions['boarding-add']">{{ $t('attendance.新增') }}</el-button>
          </div>
        </el-form-item>
      </el-form>



    </div>

    <div class="isa_table">
      <el-table :data="dataList" fit v-loading="dataListLoading" @selection-change="selectionChangeHandle"
        :header-cell-style="headercellstyle" style="width: 100%; font-size: 14px;">
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column prop="school.en_name" header-align="center" align="left" :label="$t('attendance.学校')"
          show-overflow-tooltip width="200" fixed="left">
        </el-table-column>
        <el-table-column prop="admission_no" header-align="center" align="center" :label="$t('attendance.学号')"
          show-overflow-tooltip width="120" fixed="left">
        </el-table-column>
        <el-table-column prop="en_name" header-align="center" align="center" :label="$t('attendance.姓名')"
          show-overflow-tooltip width="120" fixed="left">
        </el-table-column>

        <el-table-column prop="grade_code" header-align="center" align="center" :label="$t('attendance.年级')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="form_code" header-align="center" align="center" :label="$t('attendance.班级')"
          show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="nationality" header-align="center" align="center" :label="$t('isagroup.国籍')"
          show-overflow-tooltip width="120">
        </el-table-column>

        <el-table-column prop="gender" header-align="center" align="center" :label="$t('isagroup.性别')"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.gender === '1' || scope.row.gender === 1 ? $t('dorm.男') : (scope.row.gender === '2' ||
              scope.row.gender === 2 ? $t('dorm.女') : scope.row.gender) }}
          </template>
        </el-table-column>


        <el-table-column prop="birthdate" header-align="center" align="center" :label="$t('isagroup.出生日期')"
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
        <el-table-column prop="has_bed" header-align="center" align="center" :label="$t('dorm.是否分配')"
          show-overflow-tooltip width="100">
          <template slot-scope="scope">
            {{ scope.row.has_bed ? $t('attendance.是') : $t('attendance.否') }}
          </template>
        </el-table-column>
        <el-table-column prop="project_name" header-align="center" align="center" :label="$t('dorm.属性')"
          show-overflow-tooltip width="100" />
        <el-table-column prop="floor_name" header-align="center" align="center" :label="$t('dorm.楼层')"  show-overflow-tooltip width="120" />
        <el-table-column prop="room_room" header-align="center" align="center" :label="$t('dorm.房间号')" />

        <el-table-column prop="bed_label" header-align="center" align="center" :label="$t('dorm.床位')" />
        <el-table-column prop="checkin_date" header-align="center" align="center" :label="$t('dorm.住宿日期')" width="120">
          <template slot-scope="scope">
            {{ scope.row.checkin_date ? scope.row.checkin_date.substring(0, 10) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="planned_checkout_date" header-align="center" align="center" :label="$t('dorm.预计退宿日期')"
          width="120" />
        <el-table-column header-align="center" align="center" :label="$t('attendance.操作')" width="100" fixed="right">
          <template slot-scope="scope">
            <div style="display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap;">
              <a type="text" size="small" @click="viewDetail(scope.row)" class="text-btn"
                v-if="permissions['boarding-view']">{{ $t("btn.查看") }}</a>
              <a type="text" size="small" @click="singleCheckOut(scope.row)"
                v-if="permissions['boarding-checkout'] && scope.row.has_bed" class="text-btn">{{ $t("dorm.退宿") }}</a>
              <a type="text" size="small" @click="editStudent(scope.row)" v-if="permissions['boarding-edit']"
                class="text-btn">{{ $t("btn.编辑") }}</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="df_sb isa_table_footer" v-if="!dataListLoading">
        <div>

          <el-button size="small" type="danger" @click="checkIn" v-if="permissions['boarding-assigne']">{{
            $t('dorm.批量分配')
          }}</el-button>
          <el-button size="small" type="danger" @click="checkOut" v-if="permissions['boarding-checkout']">{{
            $t('dorm.批量退宿')
          }}</el-button>


          <el-button size="small" type="danger" @click="planCheckOut" v-if="permissions['boarding-planCheckOut']">{{
            $t('dorm.预计退宿日期')
          }}</el-button>


        </div>
        <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
          @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
      </div>
    </div>

    <!-- 批量退宿弹窗 -->
    <el-dialog :title="$t('dorm.预计退宿日期')" :visible.sync="checkOutDialogVisible" width="400px" center>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px; margin-bottom: 20px;">

        <el-date-picker v-model="checkoutDate" type="date" :placeholder="$t('dorm.请选择退宿日期')" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" size="medium" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkOutDialogVisible = false" :disabled="checkOutLoading">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="confirmCheckOut" :loading="checkOutLoading">{{ $t('btn.确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <student-model :dialog-visible.sync="detailDialogVisible" :detail-data="detailData"></student-model>

    <!-- 编辑弹窗 -->
    <student-edit :dialog-visible.sync="editDialogVisible" :detail-data="editData"
      @dialog-submit="submitConditionDialog"></student-edit>

    <!-- 新增弹窗 -->
    <student-add :dialog-visible.sync="addDialogVisible" @dialog-submit="submitConditionDialog" :school-list="dictionary['school']"></student-add>
  </div>
</template>

<script>
import { getDormStudentListPage, getBuildingList, getFloorList, getRoomList, getProjectList, autoAssignBed, plannedCheckout, checkoutBedBatch } from '@/api/isacommunity/dorm'
import Pagination from "@/components/communitycommon/Pagination.vue";
import StudentModel from './student-model.vue';
import StudentEdit from './student-edit.vue';
import StudentAdd from './student-add.vue';
import { mapGetters } from "vuex";
import { headercellstyle } from './common-style.js';

export default {
  name: 'CurrentStudentBoarding',
  components: { Pagination, StudentModel, StudentEdit, StudentAdd },
  data() {
    return {
      dataForm: {
        keyword: '',
        buildingId: '',
        floorId: '',
        projectId: '',
        schoolId: '',
        hasBed: '',
        scp: '',
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
      headercellstyle,
      cancelDialogVisible: false,
      paginationTotal: 0,
      cancelData: null,
      dataList: [],
      dialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      schoolList: [],
      checkOutDialogVisible: false,
      checkoutDate: '',
      checkOutLoading: false,
      detailDialogVisible: false,
      detailData: {},
      editDialogVisible: false,
      editData: {},
      addDialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          // 禁用今天及之前的时间，只能选择今天以后的时间
          return time.getTime() <= Date.now();
        }
      }
    }
  },
  computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },
    // 监听楼层选择变化
    handleFloorChange(floorId) {
      this.dataForm.roomId = '';    // 清空已选房间

      this.roomList = [];    // 清空房间列表
      if (floorId) {
        this.loadRoomList(floorId); // 传入选中的楼层ID获取房间列表
      }
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

    // 监听学校选择变化
    handleSchoolChange(schoolId) {
      // 强制更新视图，确保清空操作生效后下拉框不被锁死
      this.$set(this.dataForm, 'buildingId', '');
      this.buildingList = [];
      this.projectList = [];
      this.dataForm.projectId = '';
      this.dataForm.floorId = ''
      this.dataForm.roomId = ''
      this.dataForm.projectId = ''

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
    submitConditionDialog(formData) {
      this.addDialogVisible = false
      this.dialogVisible = false
      this.getDataList()
    },
    submitCancelDialog(formData) {
      this.cancelDialogVisible = false
      this.addDialogVisible = false
      this.getDataList()
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
    viewDetail(row) {
      this.detailData = Object.assign({}, row);
      this.detailDialogVisible = true;
    },

    editStudent(row) {
      this.editData = Object.assign({}, row);
      this.editDialogVisible = true;
    },

    checkOut() {
      if (this.dataListSelections.length === 0) {
        this.$message({
          message: this.$t('dorm.请选择要操作的项'),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.$confirm(this.$t('dorm.是否确认给选中学生批量退宿？'), this.$t('consult.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        checkoutBedBatch({
          admissionNos: this.dataListSelections.map(item => item.admission_no).join(',')
        }).then(res => {
          let result = res.data.data
          if (result && result.results) {


            let resultHtml = '<div style="max-height: 300px; overflow-y: auto; text-align: left; padding: 10px;">';
            result.results.forEach(item => {
              // 根据状态设置不同颜色：跳过(警告色)、成功(绿色)、失败(红色)
              let color = item.message ? '#E6A23C' : '#67C23A';
              let msg = item.message ? item.message : this.$t('attendance.操作成功');
              resultHtml += `<div style="margin-bottom: 8px; font-size: 14px; color: ${color};">
                <strong>${item.admission_no}</strong>: ${msg}
              </div>`;
            });
            resultHtml += '</div>';

            // 使用 $alert 弹窗展示 HTML 内容
            this.$alert(resultHtml, this.$t('dorm.批量退宿'), {
              dangerouslyUseHTMLString: true,
              confirmButtonText: this.$t('btn.确定')
            }).then(() => {
              this.getDataList();
            });
          } else {
            this.$message.success(this.$t('attendance.操作成功'));
            this.getDataList();
          }
          this.getDataList();
        })
      }).catch(() => { });
    },

    singleCheckOut(row) {
      this.$confirm(this.$t('dorm.是否确认给该学生办理退宿？'), this.$t('consult.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        checkoutBedBatch({
          admissionNos: row.admission_no
        }).then(res => {
          this.$message.success(this.$t('attendance.操作成功'));
          this.getDataList();
        })
      }).catch(() => { });
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
        checkinDateStart: this.dataForm.dateRange && this.dataForm.dateRange.length > 0 ? this.dataForm.dateRange[0] : '',
        checkinDateEnd: this.dataForm.dateRange && this.dataForm.dateRange.length > 0 ? this.dataForm.dateRange[1] : '',
        plannedCheckoutDateStart: this.dataForm.dateRange2 && this.dataForm.dateRange2.length > 0 ? this.dataForm.dateRange2[0] : '',
        plannedCheckoutDateEnd: this.dataForm.dateRange2 && this.dataForm.dateRange2.length > 0 ? this.dataForm.dateRange2[1] : ''
      };
      getDormStudentListPage(params).then((res) => {
        this.dataList = res.data
        this.paginationTotal = res.total
        this.dataListLoading = false
      }).catch(err => {
        console.error(err);
        this.dataListLoading = false
      })
    },

    planCheckOut() {
      if (this.dataListSelections.length === 0) {
        this.$message({
          message: this.$t('dorm.请选择要操作的项'),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.checkoutDate = ''; // 打开弹窗前清空日期
      this.checkOutLoading = false; // 重置 loading 状态
      this.checkOutDialogVisible = true;
    },

    confirmCheckOut() {
      if (!this.checkoutDate) {
        this.$message.warning(this.$t('dorm.请选择退宿日期'));
        return;
      }

      this.checkOutLoading = true;
      let params = {
        admissionNos: this.dataListSelections.map(item => item.admission_no).join(','),
        plannedCheckoutDate: this.checkoutDate
      }


      plannedCheckout(params).then(res => {
        this.$message.success(this.$t('attendance.操作成功'));
        this.checkOutLoading = false;
        this.checkOutDialogVisible = false;
        this.getDataList();
      }).catch(() => {
        this.checkOutLoading = false;
      });
    },

    checkIn() {
      if (this.dataListSelections.length === 0) {
        this.$message({
          message: this.$t('dorm.请选择要操作的项'),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.$confirm(this.$t('dorm.是否确认给选中学生批量分配入住？'), this.$t('consult.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        let params = {
          admissionNos: this.dataListSelections.map(item => item.admission_no).join(','),
          dryRun: false
        }

        autoAssignBed(params).then(res => {

          let result = res.data.data
          if (result && result.details) {
            // 构建学生姓名映射，方便展示


            let resultHtml = '<div style="max-height: 300px; overflow-y: auto; text-align: left; padding: 10px;">';
            result.details.forEach(item => {
              // 根据状态设置不同颜色：跳过(警告色)、成功(绿色)、失败(红色)
              let color = item.message ? '#E6A23C' : '#67C23A';
              let name = item.admission_no;
              let msg = item.message ? item.message : `${item.building_name}/` + `${item.floor_name}/` + `${item.room_number}/` + `${item.label}`;
              resultHtml += `<div style="margin-bottom: 8px; font-size: 14px; color: ${color};">
                <strong>${name}</strong> : ${msg}
              </div>`;
            });
            resultHtml += '</div>';

            // 使用 $alert 弹窗展示 HTML 内容
            this.$alert(resultHtml, this.$t('dorm.分配结果'), {
              dangerouslyUseHTMLString: true,
              confirmButtonText: this.$t('btn.确定')
            }).then(() => {
              this.getDataList();
            });
          } else {
            this.$message.success(this.$t('attendance.操作成功'));
            this.getDataList();
          }
        }).catch(err => {
          console.error(err);
          this.$message.error(this.$t('attendance.操作失败') || '操作失败');
        });
      }).catch(() => {
        // 取消操作
      });
    },



    // 重置
    clear() {
      this.dataForm = {
        keyword: '',
        schoolId: '',
        hasBed: '',
        buildingId: '',
        floorId: '',
        projectId: '',
        dateRange: []
      };
      this.getDataList()
    },
    // 新增弹窗
    checkAdd() {
      this.addDialogVisible = true;
    },
    // 新增
    addItem() {
      this.editData = null // 新增时重置编辑数据
      this.dialogVisible = true
      this.isViewMode = false;
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
    // 表头过滤方法：性别
    filterGender(value, row) {
      return String(row.gender) === value;
    },
    // 表头过滤方法：是否分配
    filterHasBed(value, row) {
      return row.has_bed === value;
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    }
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
}

.text-btn {
  color: #BA8E62 !important;

  cursor: pointer;
}
</style>