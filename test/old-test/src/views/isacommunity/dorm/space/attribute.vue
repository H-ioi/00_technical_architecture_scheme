<template>
  <div class="community_page">

    <div class="community_top">
      <div class="community_top_title">{{ $t("dorm.属性管理") }}</div>
      <div class="community_top_btn">
        <el-button type="primary" @click="addItem" v-if="permissions['attribute-add']">{{ $t('dorm.新增属性') }}</el-button>
      </div>
    </div>
    <div class="community_centent">
      <div class="community_searchFrom">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
          style="display: flex; align-items: center; flex-wrap: wrap;">
          <el-form-item>
            <el-select v-model="dataForm.schoolId" :placeholder="$t('attendance.学校')" clearable>
               <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.externId"
              ></el-option>
            </el-select>
          </el-form-item>


          <!--
          <el-form-item>
            <el-input v-model="dataForm.keyword" :placeholder="$t('dorm.属性名称')" clearable
              style="width: 150px;"></el-input>
          </el-form-item>
-->

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
        <el-table :data="dataList" fit v-loading="dataListLoading" @selection-change="selectionChangeHandle"
          :header-cell-style="headercellstyle" style="width: 100%; font-size: 14px;">

          <el-table-column type="selection" width="55" align="center"></el-table-column>

          <el-table-column header-align="center" align="left" :label="$t('attendance.学校')" show-overflow-tooltip>


            <template slot-scope="scope">
              {{ scope.row.school.en_name }}
            </template>


          </el-table-column>
          <el-table-column prop="name" header-align="center" align="center" :label="$t('dorm.属性')" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" :label="$t('dorm.状态')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.is_active == '1'  ? $t('dorm.启用') : $t('dorm.禁用') }}
            </template>
          </el-table-column>


          <el-table-column prop="creatorName" header-align="center" align="center" :label="$t('dorm.创建人')" show-overflow-tooltip>
          </el-table-column>


          <el-table-column fixed="right" header-align="center" align="center" width="150" :label="$t('attendance.操作')">
            <template slot-scope="scope">
              <a type="text" size="small" @click="editForm(scope.row)" class="text-btn" v-if="permissions['attribute-edit']">{{ $t("btn.编辑") }} </a>
              <!-- <a type="text" size="small" @click="viewForm(scope.row)" class="text-btn">{{ $t("btn.查看") }} </a>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="df_sb isa_table_footer">
          <div>
            <el-button size="small" type="danger" @click="deleteHandle" v-if="permissions['attribute-delete']">{{ $t('attendance.删除') }}</el-button>

          </div>
          <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
            @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </div>
      </div>

    </div>

    <attribute-model :dialog-visible.sync="dialogVisible" :edit-data="editData" :is-view-mode="isViewMode"
      @dialog-submit="submitConditionDialog" @dialog-cancel="closeConditionDialog" />





  </div>
</template>

<script>
import { getProjectListPage, deleteProjectBatch } from '@/api/isacommunity/dorm'
import Pagination from "@/components/communitycommon/Pagination.vue";
import AttributeModel from './attribute-model.vue';
import { mapGetters } from "vuex";
import { headercellstyle } from '../common-style.js';

export default {
  name: 'AttributeManage',
  components: { Pagination, AttributeModel },
  data() {
    return {
      dataForm: {
        keyword: '',
        type: '',
        schoolId: '',
        status: '',
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
      dialogVisible: false,
      dataListLoading: false,
      dataListSelections: [],
  
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

    deleteHandle() {
      if (this.dataListSelections.length === 0) {
        this.$message({
          message: this.$t('dorm.请选择要操作的项'),
          type: 'warning',
          duration: 1500
        })
        return
      }
      this.$confirm(this.$t('dorm.确定删除选中项吗？'), this.$t('consult.提示'), {
        confirmButtonText: this.$t('btn.确定'),
        cancelButtonText: this.$t('btn.取消'),
        type: 'warning'
      }).then(() => {
        deleteProjectBatch({
          ids: this.dataListSelections.map(item => item.id).join(",")
        }).then((res) => {
          this.dataListSelections = []
          this.getDataList()
          this.$message({
            message: this.$t('dorm.删除成功'),
            type: 'success'
          })
        })
      })
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
      const params = {
        ...this.pagination,
        keyword: this.dataForm.keyword,
        schoolId: this.dataForm.schoolId
      }

      getProjectListPage(params).then((res) => {
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
        type: '',
        schoolId: '',
        status: '',
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
      this.isViewMode = false // 编辑模式，可以修改
      this.dialogVisible = true
    },
    // 查看
    viewForm(row) {
      this.editData = JSON.parse(JSON.stringify(row))
      this.isViewMode = true // 查看模式，表单将被禁用或隐藏保存按钮
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

.el-form-item {
  margin-bottom: 9px !important;
}

.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}
</style>