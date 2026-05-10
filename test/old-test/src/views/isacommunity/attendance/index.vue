<template>
    <div class="community_page">
        <div class="community_top">
            <div class="community_top_title">{{ $t("attendance.学生每日考勤") }}</div>

            <div class="community_top_btn">
                <el-button type="primary" size="large" @click="exportData" :loading="exportLoading">{{
                    $t("btn.导出")
                    }}</el-button>
            </div>

        </div>
        <div class="community_centent" style="overflow-y: scroll;">
            <div class="community_searchFrom">
                <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
                    style="display: flex; align-items: center;">
                    <el-form-item>
                        <el-select v-model="dataForm.schoolName" :placeholder="$t('attendance.学校')" clearable>
                            <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName"
                                :value="school.enName"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-input v-model="dataForm.admissionNo" :placeholder="$t('attendance.学号')" clearable
                            style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item>

                        <el-select v-model="dataForm.busStatus" :placeholder="$t('attendance.是否坐校巴')" clearable
                            style="width: 120px;">
                            <el-option :label="$t('attendance.是')" value="1"></el-option>
                            <el-option :label="$t('attendance.否')" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="dataForm.dormitoryStatus" :placeholder="$t('attendance.是否住宿')" clearable
                            style="width: 120px;">
                            <el-option :label="$t('attendance.是')" value="1"></el-option>
                            <el-option :label="$t('attendance.否')" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="~"
                            :start-placeholder="$t('attendance.开始日期')" :end-placeholder="$t('attendance.结束日期')"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 300px"
                            size="medium"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="dataForm.dataFrom" :placeholder="$t('attendance.来源')" clearable
                            style="width: 120px;">
                            <el-option :label="$t('attendance.闸机')" value="gate"></el-option>
                            <el-option :label="$t('attendance.校巴')" value="schoolBus"></el-option>
                            <el-option :label="$t('attendance.爱莎圈')" value="community"></el-option>
                            <el-option label="MB" value="MB"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="dataForm.status" :placeholder="$t('attendance.状态')" clearable
                            style="width: 120px;">
                            <el-option :label="$t('attendance.出勤')" value="Present"></el-option>
                            <el-option :label="$t('attendance.迟到')" value="Late"></el-option>
                            <el-option :label="$t('attendance.请假')" value="Leave"></el-option>
                            <el-option :label="$t('attendance.缺勤')" value="Absent"></el-option>
                            <el-option :label="$t('attendance.入校')" value="Enter"></el-option>
                            <el-option :label="$t('attendance.离校')" value="Exit"></el-option> 
                        </el-select>
                    </el-form-item>

                    <el-form-item style="width: auto; margin-right: 0">
                        <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right"
                            @click="clear">{{
                                $t("btn.重置") }}</el-button>
                        <el-button @click="search()" type="primary">{{ $t('attendance.查询') }}</el-button>

                    </el-form-item>
                </el-form>
            </div>

            <div class="isa_table">
                <el-table :data="dataList" fit  v-loading="dataListLoading"
                    @selection-change="selectionChangeHandle" :header-cell-style="headercellstyle" style="width: 100%; font-size: 14px;" tooltip-effect="dark">
                    <el-table-column prop="schoolName" header-align="center" align="left" :label="$t('attendance.学校')"
                        width="200px">
                    </el-table-column>
                    <el-table-column prop="admissionNo" header-align="center" align="center" 
                        :label="$t('attendance.学号')"
                        width="120">
                    </el-table-column>
                    <el-table-column prop="studentName" header-align="center" align="center" 
                        :label="$t('attendance.姓名')"
                        width="150">
                    </el-table-column>

                    <el-table-column prop="grade" header-align="center" align="center" :label="$t('attendance.年级')"
                        width="120">
                    </el-table-column>
                    <el-table-column header-align="center" align="center" :label="$t('attendance.班级')"
                        width="120">        
                        <template slot-scope="scope">
                            {{ scope.row.form || '-' }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="busStatus" header-align="center" align="center" 
                        :label="$t('attendance.是否坐校巴')"
                        width="120">
                        <template slot-scope="scope">
                            {{ scope.row.busStatus === 1 ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dormitoryStatus" header-align="center" align="center"
                        :label="$t('attendance.是否住宿')">
                        <template slot-scope="scope">
                            {{ scope.row.dormitoryStatus === 1 ? '是' : '否' }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="date" header-align="center" align="center" :label="$t('attendance.出勤日期')">
                    </el-table-column>

                    <el-table-column header-align="center" align="center" :label="$t('attendance.考勤时间')">
                        <template slot-scope="scope">

                            {{ renderSection(scope.row) }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" header-align="center" align="center" :label="$t('attendance.状态')">
                        <template slot-scope="scope">
                            {{ getStatusText(scope.row) }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="dataFrom" header-align="center" align="center" :label="$t('attendance.来源')">
                        <template slot-scope="scope">
                            {{ getDataFromText(scope.row.dataFrom) }}
                        </template>
                    </el-table-column>
 <el-table-column prop="comment" header-align="center" align="center" :label="$t('attendance.备注')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.comment || '-'" placement="top">
                                <span>{{ scope.row.comment && scope.row.comment.length > 10 ? scope.row.comment.substring(0, 10) + '...' : (scope.row.comment || '-') }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createdAt" header-align="center" align="center" width="150px"
                        :label="$t('attendance.创建时间')">
                    </el-table-column>

                </el-table>
                <div class="df_sb isa_table_footer">
                    <div></div>
                    <Pagination :total="paginationTotal" :pagination="pagination" :hasSizes="true"
                        @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
                </div>
            </div>




        </div>
    </div>
</template>

<script>
import { getSchoolList, getAttendanceData, exportAttendanceData } from '@/api/isacommunity/holiday'
import Pagination from "@/components/communitycommon/Pagination.vue";
import { download } from "@/util/download.js";
export default {
    name: 'LeaveManage',
    components: { Pagination },
    data() {
        return {
            dataForm: {
                admissionNo: '',
                date: '',
                dormitoryStatus: null,
                busStatus: null,
                schoolName: '',
                dateRange: [],
                dataFrom: '',
                status: '',
            },
            isViewMode: false,
            pagination: {
                size: 10,
                current: 1,
            },
            headercellstyle: {
                background: "#F5F8FD",
                color: "#333333 !important",
                "font-size": "14px",
                "font-weight": "400",
                height: "38px",
                "font-family": "AlibabaPuHuiTiM",
            },
            cancelDialogVisible: false,
            paginationTotal: 0,
            cancelData: null,
            dataList: [],
            dialogVisible: false,
            dataListLoading: false,
            dataListSelections: [],
            schoolList: [],
            exportLoading: false
        }
    },
    mounted() {
        this.getDataList();
        this.loadSchoolList()
    },
    methods: {
        // 获取数据列表
        closeConditionDialog(val) {
            this.dialogVisible = false
            this.editData = null // 重置编辑数据
        },

        exportData() {
            this.exportLoading = true;
            const params = {

                ...this.dataForm
            }
            if (this.dataForm.dateRange && this.dataForm.dateRange.length === 2) {
                params.beginTime = this.dataForm.dateRange[0]
                params.endTime = this.dataForm.dateRange[1]
            }
            exportAttendanceData(params).then((res) => {
                console.log("res", res);
                this.$message.success(this.$t("consult.成功"));
                download(res.data, res.headers["content-disposition"]);
            }).finally(() => {
                this.exportLoading = false;
            });
        },
        search() {
             this.pagination.current = 1
            this.getDataList()
        },

        getDataList() {
           
            this.dataListLoading = true
            const params = {
                ...this.pagination,
                ...this.dataForm
            }
            if (this.dataForm.dateRange && this.dataForm.dateRange.length === 2) {
                params.beginTime = this.dataForm.dateRange[0]
                params.endTime = this.dataForm.dateRange[1]
            }

            getAttendanceData(params).then((res) => {
                this.dataList = res.records
                this.paginationTotal = res.total
                this.dataListLoading = false
            }).catch(err => {
                console.error(err);
                this.dataListLoading = false
            })
        },
        // 加载学校列表
        // 加载学校列表
        loadSchoolList() {

            this.$nextTick(async () => {
                let res = await getSchoolList()
                this.schoolList = res.data.data
            });

        },
        // 重置
        clear() {
            this.dataForm = {
                admissionNo: '',
                type: '',
                school: '',
                dateRange: [],
                dataFrom: '',
                status: ''
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
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val
        },

        // 获取状态文本
        getStatusText(row) {
            const statusMap = {
                'Late': this.$t('attendance.迟到'),
                'Present': this.$t('attendance.出勤'),
                'Leave': this.$t('attendance.请假'),
                'Absent': this.$t('attendance.缺勤'),
                'Exit': this.$t('attendance.离校'),
                'Enter': this.$t('attendance.入校'),

            }
            return statusMap[row.status] || '-'
        },
        renderSection(row) {
            if (row.dataFrom != 'MB') {
                //return row.enterOrExit ==1? this.$t('attendance.入校'):this.$t('attendance.离校')
                return row.date2
            } else if (row.dataFrom == 'MB') {
                console.log(typeof row.date2,'taadd')
                if(row.date2 == '-'){
                   return row.date2
                }else{
                   
                      return `第${row.date2}节课`;
                }
               
            }
            return '-';
        },
        // 获取来源文本
        getDataFromText(value) {
            const dataFromMap = {
                'MB': 'MB',
                'schoolBus': this.$t('attendance.校巴'),
                'gate': this.$t('attendance.闸机'),
                'community': this.$t('attendance.爱莎圈')
            }
            return dataFromMap[value] || value || '-'
        }
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

/* 全局表格单元格文本溢出处理 */
.el-table .el-table__cell {
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