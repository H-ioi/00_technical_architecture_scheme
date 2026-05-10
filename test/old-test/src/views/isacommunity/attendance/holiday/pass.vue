<template>
  <div class="community_page">
    <div class="community_top">
      <div class="community_top_title">{{ $t('attendance.放行条管理') }}</div>
      <div class="community_top_btn">
        <!-- <el-button type="primary" size="large" @click="exportData">{{
          $t("btn.导出")
        }}</el-button> -->
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
          style="display: flex; align-items: center;">

       
          <el-form-item>
            <el-select v-model="dataForm.school" :placeholder="$t('attendance.学校')" clearable>
              <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName"
                :value="school.enName"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="dataForm.isDormitory" :placeholder="$t('attendance.是否住宿')" clearable style="width: 100px;">
              <el-option :label="$t('attendance.是')" value="1"></el-option>
              <el-option :label="$t('attendance.否')" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input v-model="dataForm.keyword" :placeholder="$t('attendance.学号/姓名')" clearable
              style="width: 150px;"></el-input>
          </el-form-item>

          <el-form-item style="width: auto; margin-right: 0">
            <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right" @click="clear">{{
              $t("btn.重置") }}</el-button>
            <el-button @click="getDataList()" type="primary">{{ $t('attendance.查询') }}</el-button>
            <el-button type="primary" @click="addItem" v-if="permissions['pass-add']">{{ $t('attendance.新增') }}</el-button>
              <el-button type="primary" @click="batchGenerate" v-if="permissions['pass-generated-batch']">{{ $t('attendance.批量生成') }}</el-button>
                 <el-button type="primary" @click="batchDelete" v-if="permissions['pass-delete']">{{ $t('btn.删除') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="isa_table">
        <el-table :data="dataList" fit  v-loading="dataListLoading" @selection-change="selectionChangeHandle" :header-cell-style="headercellstyle"
          style="width: 100%; font-size: 14px;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="studentNo" header-align="center" align="center" :label="$t('attendance.学号')" show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column prop="studentName" header-align="center" align="center" :label="$t('attendance.姓名')" show-overflow-tooltip
            width="180">
          </el-table-column>
          <el-table-column prop="studentSchool" header-align="center" align="center" :label="$t('attendance.学校')" show-overflow-tooltip
            width="240px">
          </el-table-column>
          <el-table-column prop="studentGrade" header-align="center" align="center" :label="$t('attendance.年级')" show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column prop="studentClass" header-align="center" align="center" :label="$t('attendance.班级')">
          </el-table-column>

          <el-table-column prop="studentDormitoryStatus" header-align="center" align="center" :label="$t('attendance.是否住宿')" width="120">
            <template slot-scope="scope">
              {{ scope.row.studentDormitoryStatus === 1 ? $t('attendance.是') : $t('attendance.否') }}
            </template>
          </el-table-column>
  <el-table-column prop="createdBy" header-align="center" align="center" :label="$t('attendance.放行人')" show-overflow-tooltip
            width="120">
          </el-table-column>

            <el-table-column prop="way" header-align="center" align="center" :label="$t('attendance.放行方式')" show-overflow-tooltip
            width="130">
            <template slot-scope="scope">
              {{ getWayText(scope.row.way) }}
            </template>
          </el-table-column>
           <el-table-column  header-align="center" align="center" :label="$t('attendance.请假时间')" show-overflow-tooltip
            width="180">
             <template slot-scope="scope">
              {{ scope.row.beginTime }} - {{ scope.row.endTime }}
            </template>
          </el-table-column>
          
          <el-table-column prop="passTime" header-align="center" align="center" :label="$t('attendance.放行日期')" width="120">
          </el-table-column>
           <el-table-column prop="isLeave" header-align="center" align="center" :label="$t('attendance.是否离校')" width="120">
            <template slot-scope="scope">
              {{ scope.row.isLeave == 0 ? $t('attendance.是') : $t('attendance.否') }}
            </template>
          </el-table-column>


 <el-table-column prop="dateLimit" header-align="center" align="center" :label="$t('attendance.时段')" show-overflow-tooltip
            width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.dateLimit && Array.isArray(scope.row.dateLimit) && scope.row.dateLimit.length === 2">
              {{ scope.row.dateLimit[0] }}-{{ scope.row.dateLimit[1] }}
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" :label="$t('attendance.状态')">
            <template slot-scope="scope">
              {{ getStatusText(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" header-align="center" align="center" :label="$t('attendance.创建时间')" show-overflow-tooltip
            width="200px">
          </el-table-column>

          <el-table-column fixed="right" header-align="center" align="center" width="200" :label="$t('attendance.操作')">
            <template slot-scope="scope">
             
              <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("btn.删除") }}</el-button>-->
              <a type="text" size="small" @click="backHandle(scope.row,-1)"  v-if="scope.row.status != 0 &&permissions['pass-delete']"
               class="text-btn">{{ $t("btn.删除") }}
                </a>
                  <a type="text" size="small" @click="backHandle(scope.row,1)" v-if="![3, 2, 1].includes(scope.row.status) &&permissions['pass-voided']"           class="text-btn">{{ $t("attendance.作废") }}
                </a>
              <a type="text" size="small" @click="editForm(scope.row)" class="text-btn">{{ $t("btn.查看") }}</a>
              <a type="text"  v-if="scope.row.status == 2 &&permissions['pass-generated']" size="small" @click="editForm(scope.row)" class="text-btn">{{ $t("attendance.生成") }}</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="df_sb isa_table_footer">
          <div></div>
          <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
            @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </div>

      </div>
    </div>
    <!-- 详情弹窗 -->
    <div v-if="dialogVisible">
      <pass-model :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode" @dialog-cancel="closeConditionDialog"
        @dialog-submit="submitConditionDialog" />
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listPass, deleteHoliday, updatePassStatus, updateBatchStatus, getSchoolList } from '@/api/isacommunity/holiday'
import passModel from './dialog/passModel.vue'
import Pagination from "@/components/communitycommon/Pagination.vue";
export default {
  components: { passModel, Pagination },      
  data() {
    return {
      dataForm: {
        keyword: '',
        type: '',
        school: '',
        isDormitory: '',
      },
       headercellstyle: {
          background: "#F5F8FD",
          color: "#333333 !important",
          "font-size": "14px",
          "font-weight": "400",
          height: "38px",
          "font-family": "AlibabaPuHuiTiM",
        },
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      dataList: [],
      dialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      editData: null,
      isViewMode: false,
      schoolList: []
    }
  },
   computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },

  activated() {
    this.$nextTick(() => {
      this.getDataList()
    })
    // 加载学校列表
    getSchoolList().then(res => {
      console.log('school list:', res)
      if (res && res.data) {
        this.schoolList = res.data.data
      }
    })
  },
  methods: {
    closeConditionDialog(val) {
      this.dialogVisible = false
      this.editData = null // 重置编辑数据
    },


    backHandle(row,status) {
      this.$confirm(`确定操作?`, this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
      
        updatePassStatus({id:row.id,passTime:row.passTime,status,dataFrom:'admin'}).then((res) => {
          this.$message({
            message: this.$t('attendance.操作成功'),
            type: 'success',
            duration: 200,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
    },
      clear() {
      this.dataForm = {
        keyword: '',
        type: '',
        school: '',
        isDormitory: '',
      };
      this.getDataList()
    },
    addItem() {
      this.editData = null // 新增时重置编辑数据
      this.dialogVisible = true
      this.isViewMode = false;
    },
    // 批量生成
    batchGenerate() {
      if (this.dataListSelections.length === 0) {
        this.$message.warning(this.$t('attendance.请选择要生成的数据'));
        return;
      }
      // 检查是否所有选中的数据都是待生成状态
      const hasInvalidStatus = this.dataListSelections.some(item => item.status != 2);
      if (hasInvalidStatus) {
        this.$message.warning(this.$t('attendance.只能选择状态为待生成的数据'));
        return;
      }
      this.editData = { batchData: this.dataListSelections };
      this.dialogVisible = true;
      this.isViewMode = false;
    },


        batchDelete() {
      if (this.dataListSelections.length === 0) {
        this.$message.warning(this.$t('attendance.请选择要删除的数据'));
        return;
      }
      // 检查是否所有选中的数据都是待生成状态
      const hasInvalidStatus = this.dataListSelections.some(item => item.status == 0);
      if (hasInvalidStatus) {
        this.$message.warning(this.$t('attendance.已生效的数据不能删除'));
        return;
      }

      this.$confirm(`确定删除选中的数据?`, this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
        const ids = this.dataListSelections.map(item => item.id);
        const status = -1;
        updateBatchStatus({ids,status}).then((res) => {
          this.$message({
            message: this.$t('attendance.操作成功'),
            type: 'success',
            duration: 200,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    },
    submitConditionDialog(formData) {
      this.dialogVisible = false
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      const params = {
        ...this.pagination,
        keyword: this.dataForm.keyword,
        studentSchool: this.dataForm.school,
        isDormitory: this.dataForm.isDormitory
      }
     
      listPass(params).then((res) => {
 
        this.dataList = res.records
        this.paginationTotal = res.total
        
        this.dataListLoading = false
      })
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
    // 编辑
    editForm(row) {
      this.editData = JSON.parse(JSON.stringify(row)) // 深拷贝避免直接修改原数据
      // 状态为2（待生成）时，设置为可编辑模式
      this.isViewMode = row.status !== 2
      this.dialogVisible = true
    },

    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },


    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': this.$t('attendance.已生效'),
        '1': this.$t('attendance.作废'),
        '2': this.$t('attendance.待生成'),
        '3': this.$t('attendance.已过期')
      }
      return statusMap[status] || '-'
    },
    // 获取放行方式文本
    getWayText(way) {
      const wayMap = {
        'parents': this.$t('attendance.父母接送'),
        'self': this.$t('attendance.自行离开')
      }
      return wayMap[way] || way
    },
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行删除操作?`, this.$t('attendance.提示'), {
        confirmButtonText: this.$t('attendance.确定'),
        cancelButtonText: this.$t('attendance.取消'),
        type: 'warning'
      }).then(() => {
        deleteHoliday(id).then((res) => {

          this.$message({
            message: this.$t('attendance.操作成功'),
            type: 'success',
            duration: 200,
            onClose: () => {
              this.getDataList()
            }
          })

        })
      })
    },

  }
}
</script>

<style scoped>
/* 防止学校列内容换行 */
.el-table .el-table__cell[data-column-key="studentSchool"] {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>