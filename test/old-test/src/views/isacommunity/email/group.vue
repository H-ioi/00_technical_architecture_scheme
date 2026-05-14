<template>
    <div class="community_page mail-group-page" style="overflow: scroll;">
        <div class="community_top">
            <div class="community_top_title">{{ $t('mail.群组列表') }}</div>
            <div class="community_top_btn">

            </div>
        </div>
        <div class="community_centent" style="overflow-y: scroll;">
            <div class="community_searchFrom">
                <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
                    style="display: flex; align-items: center;">
                    <el-form-item label="">
                        <el-input v-model="dataForm.keyword" :placeholder="$t('mail.请输入群组名称')"
                            style="width: 200px;"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-select v-model="dataForm.status" :placeholder="$t('mail.状态')" style="width: 120px;">
                            <el-option :label="$t('mail.使用中')" value="1"></el-option>
                            <el-option :label="$t('mail.归档')" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="dataForm.includeParentMails" :placeholder="$t('mail.包含家长邮箱')"
                            style="width: 120px;">
                            <el-option :label="$t('mail.是')" value="1"></el-option>
                            <el-option :label="$t('mail.否')" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="dataForm.includeStudentMails" :placeholder="$t('mail.包含学生邮箱')"
                            style="width: 120px;">
                            <el-option :label="$t('mail.是')" value="1"></el-option>
                            <el-option :label="$t('mail.否')" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width: auto; margin-right: 0">
                        <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right"
                            @click="clear">{{ $t("btn.重置") }}</el-button>
                        <el-button @click="getDataList()">{{ $t('mail.查询') }}</el-button>
                        <el-button type="primary" @click="addItem" v-if="permissions['mailgroup-add']">{{ $t('mail.新增')
                            }}</el-button>
                        <el-button type="primary" @click="archiveGroup(0)" v-if="permissions['mailgroup-gd']">{{
                            $t('mail.归档') }}</el-button>
                        <el-button type="primary" @click="archiveGroup(1)" v-if="permissions['mailgroup-sy']">{{
                            $t('mail.使用中') }}</el-button>
                        <el-button type="primary" @click="archiveGroup(-1)" v-if="permissions['mailgroup-delete']">{{
                            $t('mail.删除') }}</el-button>
                    </el-form-item>
                </el-form>

            </div>

            <div class="isa_table">

                <el-table :data="dataList" fit border v-loading="dataListLoading"
                    @selection-change="selectionChangeHandle" style="width: 100%;">

                    <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
                    <el-table-column header-align="center" align="center" label="ID" prop="id"
                        width="80"></el-table-column>
                    <el-table-column prop="name" header-align="center" align="center" :label="$t('mail.群组名称')"
                        width="180">

                    </el-table-column>
                    <el-table-column prop="scopes" header-align="center" align="center" :label="$t('mail.范围')"
                        width="450">
                        <template slot-scope="scope">
                            <div v-if="scope.row.scopes">
                                <el-tooltip placement="top" effect="light">
                                    <div slot="content">
                                        <div v-for="(scopeItem, index) in (scope.row.scopes.split(';').filter(item => item.trim() !== ''))"
                                            :key="index">
                                            {{ convertGroup(scopeItem) }}
                                        </div>
                                    </div>
                                    <div>
                                        <div v-for="(scopeItem, index) in (scope.row.scopes.split(';').filter(item => item.trim() !== '').slice(0, 2))"
                                            :key="index">
                                            {{ convertGroup(scopeItem) }}
                                        </div>
                                        <div
                                            v-if="scope.row.scopes.split(';').filter(item => item.trim() !== '').length > 2">
                                            ...</div>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="includeParentMails" header-align="center" align="center"
                        :label="$t('mail.包含家长邮箱')">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.includeParentMails ? $t('mail.是') : $t('mail.否') }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="includeStudentMails" header-align="center" align="center"
                        :label="$t('mail.包含学生邮箱')">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.includeStudentMails ? $t('mail.是') : $t('mail.否') }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" header-align="center" align="center" :label="$t('mail.状态')"
                        width="120">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.status == '1' ? $t('mail.使用中') : $t('mail.归档') }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createdAt" header-align="center" align="center" :label="$t('mail.创建时间')">

                    </el-table-column>

                    <el-table-column fixed="right" header-align="center" align="center" width="250"
                        :label="$t('mail.操作')"
                        v-if="permissions['mailgroup-edit'] || permissions['mailgroup-view'] || permissions['mailgroup-delete']">
                        <template slot-scope="scope">
                            <a type="text" size="small" @click="editItem(scope.row)" class="text-btn"
                                style="margin-right: 10px;" v-if="permissions['mailgroup-edit']">{{ $t('mail.编辑') }}</a>
                            <a type="text" size="small" @click="viewItem(scope.row)" class="text-btn"
                                style="margin-right: 10px;" v-if="permissions['mailgroup-view']">{{ $t('mail.查看') }}</a>
                            <a type="text" size="small" @click="deleteItem(scope.row.id)" class="text-btn"
                                v-if="permissions['mailgroup-delete']">{{ $t('mail.删除') }}</a>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 -->
                <div class="pagination-container">
                    <el-pagination background layout="prev, pager, next, jumper, sizes, ->, total" :total="total"
                        :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>

                <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" class="mail-group-dialog">
                    <el-form ref="formData" :model="formData" :rules="formRules" label-width="80px">
                        <div class="group-dialog-content">
                            <!-- 基本信息 -->
                            <div class="basic-info">
                                <div class="form-row">

                                    <div class="form-item">
                                        <label>{{ $t('mail.群组名称') }}</label>
                                        <el-input v-model="formData.name" :placeholder="$t('mail.请输入名称')"></el-input>
                                    </div>
                                    <div class="form-item">
                                        <label>{{ $t('mail.群组邮箱') }}</label>
                                        <div class="checkbox-group">
                                            <el-checkbox v-model="formData.studentEmail">{{ $t('mail.学生邮箱')
                                                }}</el-checkbox>
                                            <el-checkbox v-model="formData.parentEmail">{{ $t('mail.家长邮箱')
                                                }}</el-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 添加学生 -->
                            <div class="section">
                                <h3>{{ $t('mail.添加学生') }}</h3>
                                <div class="search-section">

                                    <div class="search-form">
                                        <el-select v-model="formData.schoolName" :placeholder="$t('mail.选择学校')"
                                            style="width: 200px; margin-right: 10px;">
                                            <el-option v-for="school in schoolList" :key="school.enName"
                                                :label="school.enName" :value="school.enName"></el-option>
                                        </el-select>
                                        <el-input v-model="formData.admissionNo" :placeholder="$t('mail.输入名字/学号')"
                                            style="width: 300px; margin-right: 22px;"> </el-input>

                                        <el-button type="primary" @click="searchStudent" :loading="searchLoading">{{
                                            $t('mail.搜索')
                                            }}</el-button>

                                    </div>

                                    <!-- 搜索结果 -->
                                    <div v-if="searchResults.length > 0" class="search-results" style="width: 100%;">
                                        <h4>{{ $t('mail.搜索结果') }}</h4>
                                        <el-table :data="searchResults" style="width: 100%; margin-top: 10px;" border>
                                            <el-table-column prop="schoolName" :label="$t('mail.学校')"
                                                width="250"></el-table-column>
                                            <el-table-column prop="admissionNo" :label="$t('mail.学号')"
                                                width="150"></el-table-column>
                                            <el-table-column prop="studentShowName" :label="$t('mail.姓名')"
                                                width="250"></el-table-column>
                                            <el-table-column prop="grade" :label="$t('mail.年级')"
                                                width="150"></el-table-column>
                                            <el-table-column :label="$t('mail.操作')">
                                                <template slot-scope="scope">
                                                    <el-button type="primary" size="small"
                                                        @click="addToGroup(scope.row)">{{ $t('mail.增加') }}</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div style="margin-top: 10px; text-align: right;">
                                            <el-button @click="clearSearchResults">{{ $t('mail.清空') }}</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 添加特定范围 -->
                            <div class="section">
                                <h3>{{ $t('mail.添加特定范围') }}</h3>
                                <div class="range-form">
                                    <div class="form-row">
                                        <div class="form-item">
                                            <label>{{ $t('mail.学校') }}</label>
                                            <el-select v-model="formData.subSchoolName" :placeholder="$t('mail.选择学校')"
                                              filterable style="width: 100%; margin-right: 10px;"
                                                @change="handleSchoolChange">
                                                <el-option v-for="school in schoolList" :key="school.enName"
                                                    :label="school.enName" :value="school.enName"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="form-item">
                                            <label>{{ $t('mail.年级') }}</label>
                                            <el-select v-model="formData.rangeGrade" multiple clearable filterable
                                                :placeholder="$t('mail.请选择年级')" style="width: 100%;">
                                                <el-option v-for="grade in gradeList" :key="grade.value || grade"
                                                    :label="grade.label || grade"
                                                    :value="grade.value || grade"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="form-item" v-if="divisionList.length > 0">
                                           <label>{{ $t('mail.学部') }}</label>
                                            <el-select v-model="formData.rangeDivision" :placeholder="$t('mail.请选择')" clearable filterable
                                                style="width: 100%;">
                                                <el-option v-for="division in divisionList" :key="division"
                                                    :label="division" :value="division"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="form-item"  v-if="boardingHouseList.length > 0">
                                            <label>{{ $t('mail.学院') }}</label>
                                            <el-select v-model="formData.rangeCollege" :placeholder="$t('mail.请选择学院')" clearable filterable
                                                style="width: 100%;">
                                                <el-option v-for="college in boardingHouseList" :key="college"
                                                    :label="college" :value="college"></el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-item">
                                            <label>{{ $t('mail.乘坐校巴') }}</label>
                                            <el-select v-model="formData.rangeBus" :placeholder="$t('mail.请选择')" clearable filterable
                                                style="width: 100%;">
                                                <el-option :label="$t('mail.是')" value="yes"></el-option>
                                                <el-option :label="$t('mail.否')" value="no"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="form-item">
                                            <label>{{ $t('mail.住宿') }}</label>
                                            <el-select v-model="formData.rangeDorm" :placeholder="$t('mail.请选择')" clearable filterable
                                                style="width: 100%;">
                                                <el-option :label="$t('mail.是')" value="yes"></el-option>
                                                <el-option :label="$t('mail.否')" value="no"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="form-item">
                                            <label>{{ $t('mail.入读日期') }}</label>
                                            <el-date-picker v-model="formData.rangeDate" type="daterange"
                                                range-separator="—" :start-placeholder="$t('mail.开始日期')"
                                                :end-placeholder="$t('mail.结束日期')" style="width: 300px;">
                                            </el-date-picker>
                                        </div>
                                    </div>
                                    <div class="range-buttons">
                                        <el-button type="primary" @click="addRange">{{ $t('mail.添加') }}</el-button>
                                        <el-button @click="resetRange">{{ $t('mail.重置') }}</el-button>
                                    </div>
                                </div>
                            </div>

                            <!-- 群组名单 -->
                            <div class="section">
                                <h3>{{ $t('mail.群组名单') }}</h3>
                                <div class="list-container">
                                    <div v-if="groupMembers.length === 0" class="empty-list">
                                        {{ $t('mail.暂无数据，请搜索添加') }}
                                    </div>
                                    <div v-else class="member-list">
                                        <div v-for="(member, index) in groupMemberInfo"
                                            :key="index || member.admissionNo" class="member-item">
                                            <div class="member-info">
                                                <div class="member-name">{{ member }}
                                                </div>

                                            </div>
                                            <span type="text" size="small" class="remove-btn"
                                                @click="removeMember(member)">X</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div class="form-item" style="display: flex;align-items: center;margin-top: 22px;">
                                <label style="margin-right: 10px;">{{ $t('mail.状态') }}</label>
                                <el-radio-group v-model="formData.status" style="display: flex;align-items: center;">
                                    <el-radio label="1">{{ $t('mail.使用中') }}</el-radio>
                                    <el-radio label="0">{{ $t('mail.归档') }}</el-radio>
                                </el-radio-group>
                            </div>




                        </div>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false" style="width: 100px;">{{ $t('mail.取消') }}</el-button>
                        <el-button type="primary" @click="submitForm"
                            style="width: 100px; background-color: #c19a6b; border-color: #c19a6b;">{{ $t('mail.保存')
                            }}</el-button>
                    </span>
                </el-dialog>

                <!-- 查看弹窗 -->
                <el-dialog :title="$t('mail.查看')" :visible.sync="viewDialogVisible" width="900px">
                    <div class="view-form">
                        <div class="view-item">
                            <label>{{ $t('mail.群组名称') }}：</label>
                            <span>{{ viewData.name }}</span>
                        </div>
                        <div class="view-item">
                            <label>{{ $t('mail.包含家长邮箱') }}：</label>
                            <span>{{ viewData.includeParentMails ? $t('mail.是') : $t('mail.否') }}</span>
                        </div>
                        <div class="view-item">
                            <label>{{ $t('mail.包含学生邮箱') }}：</label>
                            <span>{{ viewData.includeStudentMails ? $t('mail.是') : $t('mail.否') }}</span>
                        </div>
                        <div class="view-item">
                            <label>{{ $t('mail.范围') }}：</label>
                            <div v-if="groupMemberInfo.length === 0">-</div>
                            <div v-else class="scopes-list">
                                <div v-for="(item, index) in groupMemberInfo" :key="index">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                        <div class="view-item">
                            <label>{{ $t('mail.状态') }}：</label>
                            <span>{{ viewData.status == '1' ? $t('mail.使用中') : $t('mail.归档') }}</span>
                        </div>
                        <div class="view-item">
                            <label>{{ $t('mail.创建时间') }}：</label>
                            <span>{{ viewData.createdAt }}</span>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="viewDialogVisible = false">{{ $t('mail.关闭') }}</el-button>
                    </span>
                </el-dialog>

            </div>
        </div>


    </div>
</template>

<style scoped>
.view-form {
    padding: 20px;
}

.view-item {
    margin-bottom: 15px;
    display: flex;
    align-items: flex-start;
}

.view-item label {
    width: 120px;
    font-weight: bold;
    margin-right: 10px;
}

.view-item span {
    flex: 1;
    word-break: break-word;
}
</style>

<script>
// 引入相关的依赖
import { getSchoolList, getStudentList, getGradeList, createMailGroup, updateMailGroup, deleteMailGroup, listMailGroup, batchUpdateMailGroupStatus, getBoardingHouseList, getDivisionNameList } from "@/api/isacommunity/mail";
import { mapGetters } from "vuex";

export default {
    name: 'ConfigList',
    data() {
        return {
            // 搜索表单
            dataForm: {
                keyword: '',
                dateRange: [],
                status: '',
                includeParentMails: '',
                includeStudentMails: ''
            },
            // 数据列表
            dataList: [],
            // 加载状态
            dataListLoading: false,
            // 搜索加载状态
            searchLoading: false,
            pageIndex: 1,
            pageSize: 10,
            total: 0,

            // 选中的数据
            dataListSelections: [],
            // 弹窗
            dialogVisible: false,
            dialogTitle: '',
            // 查看弹窗
            viewDialogVisible: false,
            viewData: {},
            // 表单数据
            formData: {
                id: '',
                name: '',
                studentEmail: false,
                parentEmail: false,
                schoolName: '',
                subSchoolName: [],
                admissionNo: '',
                rangeSchool: '',
                rangeGrade: [],
                rangeCollege: '',
                rangeBus: '',
                rangeDorm: '',
                rangeDivision: '',
                rangeStartDate: '',
                rangeEndDate: '',
                school: '',
                grades: [],
                department: '',
                email: '',
                status: '1'
            },

            schoolList: [],
            // 群组名单
            groupMembers: [],
            groupMemberInfo: [],
            // 年级列表
            gradeList: [
            ],
            // 学院列表
            boardingHouseList: [],
            // 学部列表
            divisionList: [],
            // 部门列表
            // 搜索结果
            searchResults: [],
            // 表单验证规则
            formRules: {
                name: [
                    { required: true, message: '请输入群组名称', trigger: 'blur' }
                ],


            },
        }
    },
    // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
    mounted() {

        this.getSchoolList()

        this.getDataList()

        this.getGradeList()

      
    },
    computed: {
        ...mapGetters([
            "dictionary",
            "i18nlocel",
            "permissions",
            "dictpermissions",
            "pooldictionary",
            "pooldictpermissions",
        ]),
    },
    // 方法集合
    methods: {

        getSchoolList() {
            getSchoolList().then(res => {

                if (res && res.data) {
                    this.schoolList = res.data.data
                }
            })
        },

        getGradeList() {
            getGradeList().then(res => {
                if (res && res.data) {
                    this.gradeList = res.data.data
                }
            })
        },

      
        getDivisionList(schoolName) {
            if (!schoolName) {
                this.divisionList = [];
                return;
            }
            getDivisionNameList({ schoolName }).then(res => {
                if (res && res.data) {
                    this.divisionList = res.data.data || [];
                }
            })
        },
        clear() {
            this.dataForm.keyword = ''
            this.dataForm.dateRange = []
            this.dataForm.status = ''
            this.dataForm.includeParentMails = ''
            this.dataForm.includeStudentMails = ''
            this.getDataList()
        },
        searchStudent() {
            if (!this.formData.admissionNo) {

                return;
            }
            this.searchLoading = true
            getStudentList({
                schoolName: this.formData.schoolName,
                admissionNo: this.formData.admissionNo
            }).then(res => {

                if (res && res.data) {
                    this.searchResults = res.data.data || []
                }
            }).finally(() => {
                this.searchLoading = false
            })
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            // 准备查询参数
            let params = {
                current: this.pageIndex,
                size: this.pageSize,
                keyword: this.dataForm.keyword
            }
            // 添加状态参数
            if (this.dataForm.status) {
                params.status = this.dataForm.status
            }
            // 添加包含家长邮箱参数
            if (this.dataForm.includeParentMails) {
                params.includeParentMails = this.dataForm.includeParentMails
            }
            // 添加包含学生邮箱参数
            if (this.dataForm.includeStudentMails) {
                params.includeStudentMails = this.dataForm.includeStudentMails
            }

            if (this.dataForm.dateRange && this.dataForm.dateRange.length === 2) {
                params.beginCreateDate = this.dataForm.dateRange[0]
                params.endCreateDate = this.dataForm.dateRange[1]
            }
            listMailGroup(params).then(res => {

                if (res && res.data) {
                    this.dataList = res.data || []
                    this.total = res.total || 0
                }
                this.dataListLoading = false
            })
        },
        // 处理分页大小变化
        handleSizeChange(size) {
            this.pageSize = size
            this.getDataList()
        },
        // 处理当前页码变化
        handleCurrentChange(current) {
            this.pageIndex = current
            this.getDataList()
        },

        // 选择变更
        selectionChangeHandle(val) {
            this.dataListSelections = val
        },
        // 新增
        addItem() {
            this.dialogTitle = this.$t('mail.新增群组')
            this.searchResults = []
            this.groupMemberInfo = []
            this.groupMembers = []
            this.formData = {
                id: '',
                school: '',
                grades: [],
                department: '',
                email: '',
                status: '1',
                studentEmail: false,
                parentEmail: false
            }
            // 重置群组名单为空
            this.groupMembers = []
            this.dialogVisible = true
        },
        // 编辑
        editItem(row) {
            this.dialogTitle = this.$t('mail.编辑群组')

            this.formData = Object.assign({}, {
                id: row.id || '',
                name: row.name || '',

                studentEmail: row.includeStudentMails || false,
                parentEmail: row.includeParentMails || false,
                status: row.status + ''
            })

            if (typeof row.scopes === 'string') {
                this.groupMembers = row.scopes.split(';').filter(item => item.trim() !== '')
                this.groupMemberInfo = this.groupMembers.map(item => this.convertGroup(item))
            } else {
                this.groupMembers = row.scopes || []
            }

            this.dialogVisible = true
        },
        // 查看
        viewItem(row) {
            this.viewData = Object.assign({}, row)
            // 处理群组成员数据，转换为可读格式
            this.groupMemberInfo = []
            if (row.scopes) {
                const scopes = typeof row.scopes === 'string' ? row.scopes.split(';').filter(item => item.trim() !== '') : row.scopes
                scopes.forEach(scope => {
                    this.groupMemberInfo.push(this.convertGroup(scope))
                })
            }
            this.viewDialogVisible = true
        },
        // 删除
        deleteItem(id) {

            this.$confirm(this.$t('mail.确定删除选中的数据吗'), this.$t('mail.提示'), {
                confirmButtonText: this.$t('mail.确定'),
                cancelButtonText: this.$t('mail.取消'),
                type: 'warning'
            }).then(() => {
                deleteMailGroup({
                    id
                }).then(res => {
                    this.$message.success(this.$t('mail.操作成功'))
                    this.getDataList()
                }).catch(() => {
                    this.$message.error(this.$t('mail.操作失败'))
                })

            })
        },
        // 归档群组
        archiveGroup(value) {
            if (this.dataListSelections.length === 0) {
                this.$message.warning(this.$t('mail.请选择要操作的数据'));
                return;
            }

            const ids = this.dataListSelections.map(item => item.id);


            this.$confirm(this.$t('mail.确定操作选中的记录吗'), this.$t('mail.提示'), {
                confirmButtonText: this.$t('mail.确定'),
                cancelButtonText: this.$t('mail.取消'),
                type: 'warning'
            }).then(() => {
                batchUpdateMailGroupStatus({
                    ids: ids.join(','),
                    status: value
                }).then(res => {
                    this.$message.success(this.$t('mail.操作成功'))
                    this.getDataList()
                }).catch(() => {
                    this.$message.error(this.$t('mail.操作失败'))
                })

            })
        },
        // 提交表单
        submitForm() {
            // 手动验证群组名称
            if (!this.formData.name) {
                this.$message.error(this.$t('mail.请输入群组名称'))
                return
            }
            // 验证群组名单不能为空
            if (!this.groupMembers || this.groupMembers.length === 0) {
                this.$message.error('群组名单不能为空')
                return
            }
            // 验证至少选中一个邮箱类型
            if (!this.formData.studentEmail && !this.formData.parentEmail) {
                this.$message.error('请至少选中一个邮箱类型')
                return
            }

            let params = {
                name: this.formData.name,
                scopes: this.groupMembers.join(';'),
                includeParentMails: this.formData.parentEmail ? 1 : 0,
                includeStudentMails: this.formData.studentEmail ? 1 : 0,
                status: this.formData.status,
                id: this.formData.id || ''
            }


            const apiMethod = this.formData.id ? updateMailGroup : createMailGroup
            apiMethod(params).then(res => {
                this.$message.success(this.$t('mail.操作成功'))
                this.dialogVisible = false
                this.getDataList()
            }).catch(() => {
                this.$message.error(this.$t('mail.操作失败'))
            })
        },
        // 移除成员
        removeMember(row) {
            const index = this.groupMembers.findIndex(item => item.id === row.id || item.admissionNo === row.admissionNo)
            if (index > -1) {
                this.groupMembers.splice(index, 1)
            }
        },
        // 添加到群组
        addToGroup(member) {
            const exists = this.groupMembers.some(item => item.includes(member.admissionNo))
            const memberStr = `${member.schoolName || '-'},All,${member.grade || '-'},All,All,All,All,All,${member.admissionNo || '-'}`

            if (!exists) {
                this.groupMembers.push(memberStr)
                this.groupMemberInfo.push(this.convertGroup(memberStr))
            } else {
                this.$message.warning(this.$t('mail.该成员已在群组中'))
            }
        },
        // 清空搜索结果
        clearSearchResults() {
            this.searchResults = []
        },
        // 添加特定范围
        addRange() {
            // 拼接特定范围字段
            const { subSchoolName, rangeGrade, rangeCollege, rangeBus, rangeDorm, rangeDate } = this.formData;

            // 处理学校和年级的多选组合

            const grades = Array.isArray(rangeGrade) ? rangeGrade : (rangeGrade ? [rangeGrade] : []);

            // 生成所有学校和年级的组合
            const combinations = [];
            if (subSchoolName != null && grades.length > 0) {
                // 学校和年级都有选择，生成所有组合
                for (const grade of grades) {

                    combinations.push({ subSchoolName, grade });
                }

            } else if (subSchoolName != null) {
                // 只选择了学校

                combinations.push({ subSchoolName, grade: '' });

            } else {
                // 只选择了年级
                for (const grade of grades) {
                    combinations.push({ subSchoolName: '', grade });
                }
            }

          
           
            for (const combo of combinations) {
             
                let rangeString = '';

                if (combo.subSchoolName) {
                    rangeString += `${combo.subSchoolName}`;
                }

           
                if (this.formData.rangeDivision && this.divisionList.length > 0) {
                    rangeString += `,${this.formData.rangeDivision}`;
                } else {
                    rangeString += `,All`;
                }

                if (combo.grade) {
                    rangeString += `,${combo.grade}`;
                } else {
                    rangeString += `,All`;
                }

                if (rangeCollege && this.boardingHouseList.length > 0) {
                    rangeString += `,${rangeCollege}`;

                } else {
                    rangeString += `,All`;
                }

                if (rangeBus) {
                    rangeString += `,${rangeBus === 'yes' ? true : false}`;


                } else {
                    rangeString += `,All`;
                }

                if (rangeDorm) {
                    rangeString += `,${rangeDorm === 'yes' ? true : false}`;

                } else {
                    rangeString += `,All`;
                }

                if (rangeDate && rangeDate.length === 2) {
                    const startDate = new Date(rangeDate[0]).toLocaleDateString().replace(/\//g, '-');
                    const endDate = new Date(rangeDate[1]).toLocaleDateString().replace(/\//g, '-');
                    rangeString += `,${startDate},${endDate}`;

                } else {
                    rangeString += `,All,All`;
                }
                rangeString += `,All`;
                // 去除末尾空格
                rangeString = rangeString.trim();


                // 检查是否已存在
                if (rangeString && this.groupMembers.includes(rangeString)) {
   
                    duplicateCount++;
                    continue;
                }

         
          
                // 如果有选择范围，添加到群组名单
                if (rangeString) {
                    this.groupMembers.push(rangeString);
                    this.groupMemberInfo.push(this.convertGroup(rangeString))
                  
                }
            }

        },
        // 重置特定范围表单
        resetRange() {
            this.formData.subSchoolName = []
            this.formData.rangeGrade = []
            this.formData.rangeCollege = ''
            this.formData.rangeBus = ''
            this.formData.rangeDorm = ''
            this.boardingHouseList = []
             this.divisionList = []
            this.formData.rangeDivision = ''
            this.formData.rangeDate = ''
        },
        handleSchoolChange(selectedSchool) {
            // 清空列表
            
            this.boardingHouseList = [];
            this.divisionList = [];
            
          
                // 加载学院数据
                getBoardingHouseList({schoolName: selectedSchool}).then(res => {
                    if (res && res.data) {
                        this.boardingHouseList = res.data.data;
                        // 数据加载完成后清空选择
                       
                       
                    }
                });

                // 加载学部数据
                getDivisionNameList({schoolName: selectedSchool}).then(res => {
                    if (res && res.data) {
                        this.divisionList = res.data.data.map(item => item.replace(/[\u4e00-\u9fa5]/g, '').trim());
                      
                    }
                });
           
        },

        convertGroup(str) {
            if (!str) return '-'
            let parts = str.split(',')
            // 0:学校, 1:学部, 2:年级, 3:学院, 4:是否校巴, 5:是否住宿, 6:入学日期起, 7:入学时间终, 8:学号
            let result = []

            // 学校
            if (parts[0] && parts[0] !== 'All') {
                result.push(parts[0])
            }
            // 学部
            if (parts[1] && parts[1] !== 'All') {
                result.push(parts[1])
            }
            // 年级
            if (parts[2] && parts[2] !== 'All') {
                result.push(parts[2])
            }
            // 学院
            if (parts[3] && parts[3] !== 'All') {
                result.push(parts[3])
            }
            // 是否校巴
            if (parts[4] && parts[4] !== 'All') {
                if (parts[4] === 'true' || parts[4] === '是') {
                    result.push('乘坐校巴(是)')
                } else {
                    result.push('乘坐校巴(否)')
                }
            }
            // 是否住宿
            if (parts[5] && parts[5] !== 'All') {
                if (parts[5] === 'true' || parts[5] === '是') {
                    result.push('住宿(是)')
                } else {
                    result.push('住宿(否)')
                }
            }
            // 入学日期起
            if (parts[6] && parts[6] !== 'All') {
                result.push(parts[6])
            }
            // 入学时间终
            if (parts[7] && parts[7] !== 'All') {
                result.push(parts[7])
            }
            // 学号
            if (parts[8] && parts[8] !== 'All') {
                result.push(parts[8])
            }

            return result.join(', ') || '-'
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  .el-table__fixed-right {
    z-index: 99 !important;
    background-color: #ffffff;
   
  }
 
}
.mail-group-page {
    .mail-group-dialog {
        .el-dialog__body {
            padding: 0 !important;
        }
    }

    .text-btn {
        color: #BA8E62 !important;
        margin-right: 10px;
        cursor: pointer;
    }

    .mod-config {
        padding: 20px;
        background-color: #fff;
    }

    .group-dialog-content {
        padding: 20px;
    }

    .form-row {
        display: flex;
        margin-bottom: 20px;
        align-items: center;
    }

    .form-item {
        flex: 1;
        margin-right: 20px;
    }

    .form-item:last-child {
        margin-right: 0;
    }

    .form-item label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
    }

    .checkbox-group .el-checkbox {
        margin-right: 20px;
    }

    .section {
        margin-top: 30px;
        border-top: 1px solid #e4e7ed;
        padding-top: 20px;
    }

    .section h3 {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
    }

    .search-section {
        margin-bottom: 20px;
    }

    .search-section label {
        display: block;
        margin-bottom: 10px;
        font-weight: 500;
    }

    .search-form {
        display: flex;
        align-items: center;
    }

    .range-form {
        margin-top: 20px;
    }

    .date-range {
        display: flex;
        align-items: center;
    }

    .range-buttons {
        display: flex;
        justify-content: flex-start;
        margin-top: 20px;
    }

    .range-buttons .el-button {
        margin-right: 10px;
    }

    .list-container {
        min-height: 200px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #f5f7fa;
        margin-top: 10px;
        padding: 15px;
    }

    .empty-list {
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
    }

    .member-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .member-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        background-color: #ffffff;
        border: 1px solid #e4e7ed;
        border-radius: 4px;

        transition: all 0.3s ease;
    }

    .member-item:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-color: #c19a6b;
    }

    .member-info {
        flex: 1;
    }

    .member-name {
        font-weight: 500;
        margin-bottom: 4px;
        color: #303133;
    }

    .member-details {
        font-size: 12px;
        color: #909399;
    }

    .remove-btn {
        opacity: 0;
        transition: opacity 0.3s ease;
        color: #f56c6c;
        margin-left: 20px;
    }

    .member-item:hover .remove-btn {
        opacity: 1;
    }

    .remove-btn:hover {
        color: #f56c6c;
        font-weight: 500;
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .dialog-footer .el-button {
        margin: 0 10px;
    }

    /* 分页样式 */
    .pagination-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
        padding-right: 20px;
    }
}
</style>
