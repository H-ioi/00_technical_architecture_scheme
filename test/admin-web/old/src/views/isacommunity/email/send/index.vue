<template>
    <div class="community_page email-send-cc">
        <div class="community_top">
            <div class="community_top_title">{{ $t('mail.发送邮箱列表') }}</div>
            <div class="community_top_btn">

            </div>
        </div>
        <div class="community_centent">
            <div class="community_searchFrom">
                <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
                    style="display: flex; align-items: center;">
                    <el-form-item label="">
                        <el-input v-model="dataForm.keyword" :placeholder="$t('mail.365邮箱')"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="dataForm.status" :placeholder="$t('mail.状态')">
                            <el-option :label="$t('mail.使用中')" value="1"></el-option>
                            <el-option :label="$t('mail.归档')" value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item style="width: auto; margin-right: 0">
                        <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right"
                            @click="clear">{{ $t("btn.重置") }}</el-button>
                        <el-button @click="getDataList()">{{ $t('mail.查询') }}</el-button>
                        <el-button type="primary" @click="addItem">{{ $t('mail.新增') }}</el-button>
                           <el-button type="primary" @click="archiveGroup(0)">{{ $t('mail.归档') }}</el-button>
                              <el-button type="primary" @click="archiveGroup(1)">{{ $t('mail.使用中') }}</el-button>
                               <el-button type="primary" @click="archiveGroup(-1)">{{ $t('mail.删除') }}</el-button>
                    </el-form-item>
                </el-form>

            </div>

            <div class="isa_table">

                <el-table :data="dataList" fit border v-loading="dataListLoading"
                    @selection-change="selectionChangeHandle" style="width: 100%;">

                    <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>

                    <el-table-column prop="id" header-align="center" align="center" label="ID">

                    </el-table-column>
                    <el-table-column prop="email" header-align="center" align="center" :label="$t('mail.365邮箱')">

                    </el-table-column>

                    <el-table-column prop="usernames" header-align="center" align="center" :label="$t('mail.用户')">

                    </el-table-column>

                       <el-table-column prop="status" header-align="center" align="center" :label="$t('mail.状态')">
                        <template slot-scope="scope">
                            {{ scope.row.status === 0 ? $t('mail.归档') : scope.row.status === 1 ? $t('mail.使用中') : scope.row.status }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="createdAt" header-align="center" align="center" :label="$t('mail.创建时间')">

                    </el-table-column>

                    <el-table-column fixed="right" header-align="center" align="center" width="250" :label="$t('mail.操作')">
                        <template slot-scope="scope">
                            <a type="text" size="small" @click="editItem(scope.row)" class="text-btn"
                                style="margin-right: 10px;">{{ $t('mail.编辑') }}</a>
                                  <a type="text" size="small" @click="viewItem(scope.row)" class="text-btn"
                                style="margin-right: 10px;">{{ $t('mail.查看') }}</a>
                            <a  type="text" size="small" @click="deleteItem(scope.row.id)" class="text-btn">{{ $t('mail.删除') }}</a>




                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-container">
                    <el-pagination background layout="prev, pager, next, jumper, sizes, ->, total" :total="total"
                        :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>

                <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="560px" class="email-send-dialog">
                    <div class="email-dialog-content">
                        <el-form :model="formData" :rules="formRules" ref="formData" label-width="140px">
                            <!-- ID -->

                     

                            <!-- 用户 -->
                            <el-form-item :label="$t('mail.用户')" prop="userIds">
                                <el-select v-model="formData.userIds"  :placeholder="$t('mail.用户')"   filterable clearable multiple>
                                    <el-option v-for="user in userList" :key="user.userId" :label="user.username"
                                        :value="user.userId"></el-option>
                                </el-select>
                            </el-form-item>

                            <!-- 365邮箱 -->
                            <el-form-item :label="$t('mail.365邮箱')" prop="email">
                                <el-input v-model="formData.email" :placeholder="$t('mail.365邮箱')"></el-input>
                            </el-form-item>

                            <!-- 分配群组 -->
                            <el-form-item :label="$t('mail.分配群组')" prop="mailgroupIds">
                                <el-select v-model="formData.mailgroupIds"  clearable multiple :placeholder="$t('mail.分配群组')" filterable>
                                    <el-option v-for="group in mailGroupList" :key="group.id" :label="group.name"
                                        :value="group.id"></el-option>
                                </el-select>
                            </el-form-item>

                            <!-- 状态 -->
                            <el-form-item :label="$t('mail.状态')" prop="status"
                                style="vertical-align: middle;">
                                <el-radio-group v-model="formData.status" style="margin-top: 9px;">
                                    <el-radio label="1" style="margin-right: 10px !important;">{{ $t('mail.使用中') }}</el-radio>
                                    <el-radio label="0" style="margin-right: 0 !important;">{{ $t('mail.归档') }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">{{ $t('mail.取消') }}</el-button>
                        <el-button type="primary" @click="submitForm">{{ $t('mail.保存') }}</el-button>
                    </span>
                </el-dialog>

                <!-- 查看弹窗 -->
                <el-dialog :title="$t('mail.查看邮件')" :visible.sync="viewDialogVisible" width="660px" class="email-send-dialog">
                    <div class="email-dialog-content">
                        <div class="view-form">
                          

                            <!-- 用户 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.用户') }}</div>
                                <div class="view-form-value">
                                    <div v-if="formData.userIds && formData.userIds.length > 0">
                                        <span v-for="(userId, index) in formData.userIds" :key="userId">
                                            {{ userId }}{{ index < formData.userIds.length - 1 ? ', ' : '' }} 
                                        </span>
                                    </div>
                                    <span v-else>-</span>
                                </div>
                            </div>

                            <!-- 365邮箱 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.365邮箱') }}</div>
                                <div class="view-form-value">{{ formData.email || '-' }}</div>
                            </div>

                            <!-- 分配群组 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.分配群组') }}</div>
                                <div class="view-form-value">
                                    <div v-if="formData.mailgroupIds2 && formData.mailgroupIds2.length > 0">
                                        <span v-for="(group, index) in formData.mailgroupIds2" :key="group.id">
                                            {{ group.mailgroupName }}{{ index < formData.mailgroupIds2.length - 1 ? ', ' : '' }}
                                        </span>
                                    </div>
                                    <span v-else>-</span>
                                </div>
                            </div>

                            <!-- 状态 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.状态') }}</div>
                                <div class="view-form-value">{{ formData.status === 1 ? $t('mail.使用中') : $t('mail.归档') }}</div>
                            </div>
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
<script>
// 引入相关的依赖
import { getAllUserEmailForTenant5, listUserMailinfo, listMailGroup,removeUserMailinfo, addMailRelations,getUserMailinfoDetail,batchUpdateUserMailinfoStatus } from "@/api/isacommunity/mail";



export default {
    name: 'ConfigList',
    components: {},
    data() {
        return {
            // 搜索表单
            dataForm: {
                keyword: '',
                status: ''
            },
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            // 数据列表
            dataList: [],
            // 加载状态
            dataListLoading: false,

            // 选中的数据
            dataListSelections: [],
            // 弹窗
            dialogVisible: false,
            viewDialogVisible: false,
            dialogTitle: '新增配置',
            // 表单数据
            formData: {
                userMailinfoId: null,
                userIds: [],
                email: '',
                mailgroupIds: [],
                mailgroupIds2: [],
                status: "1"
            },

            // 部门列表

            // 群组列表
            mailGroupList: [],

            // 表单验证规则
            formRules: {

                userIds: [
                    { required: true, message: '请输入用户', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入365邮箱', trigger: 'blur' }
                ],
             
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            },
        }
    },
    // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
    mounted() {
        // 初始化数据列表
        this.getDataList()
    },
    // 方法集合
    methods: {
        getMailGroupList() {
            let params = {
                current: 1,
                status: 1,
                size: 99998
            }
            listMailGroup(params).then(res => {
             
                if (res && res.data) {
                    this.mailGroupList = res.data || []
                }
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
                batchUpdateUserMailinfoStatus({
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

        convertGroup(str){
            if (!str) return '-'
            let parts = str.split(',')
         
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
        },

        // 获取所有用户邮箱
        getAllUser() {
            getAllUserEmailForTenant5().then(res => {
                console.log(res, 'ressssss')
                if (res && res.data) {
                    this.userList = res.data.data || []
                }
            })
        },
        clear() {
            this.dataForm = {};
            this.getDataList()
        },

        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            let params = {
                current: this.pageIndex,
                size: this.pageSize,
                keyword: this.dataForm.keyword,
                status: this.dataForm.status
            }
            listUserMailinfo(params).then(res => {
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
            this.getMailGroupList()
            this.getAllUser()
            this.dialogTitle = this.$t('mail.新增配置')
            this.formData = {
                userMailinfoId: null,
                userIds: [],
                email: '',
                mailgroupIds: [],
                status: "1"
            }

            this.dialogVisible = true
        },
        // 编辑
        editItem(row) {
            this.getMailGroupList()
            this.getAllUser()
            this.dialogTitle = this.$t('mail.编辑配置')
            getUserMailinfoDetail({ id: row.id }).then(data => {
                console.log('getUserMailinfoDetail data:', data)
                if (data) {
                    console.log('Status type:', typeof data.mailinfo.status)
                    console.log('data.userIdRelations:', data.userIdRelations)
                    this.formData = {
                        userMailinfoId: data.mailinfo.id || '',
                        userIds: (data.userIdRelations || []).map(id => id.toString()),
                        email: data.mailinfo.email || '',
                        mailgroupIds: data.mailgroupIdRelations || [],
                        mailgroupIds2: data.mailgroupRelations || [],
                        status:data.mailinfo.status.toString()
                    }

                    console.log('Setting dialogVisible to true')
                    this.dialogVisible = true
                }
            }).catch(err => {
                console.error('Error in XX:', err)
            })
        },
        // 查看
        viewItem(row) {
            console.log('viewItem called with row:', row)
            getUserMailinfoDetail({ id: row.id }).then(data => {
                console.log('getUserMailinfoDetail data:', data)
                if (data) {
                    this.formData = {
                        userMailinfoId: data.mailinfo.id || '',
                        userIds: (data.userRelations || []).map(id => id.username),
                        email: data.mailinfo.email || '',
                        mailgroupIds: data.mailgroupIdRelations || [],
                        mailgroupIds2: data.mailgroupRelations || [],
                        status: data.mailinfo.status !== undefined ? parseInt(data.mailinfo.status) : 1
                    }
                    console.log('Setting viewDialogVisible to true')
                    this.viewDialogVisible = true
                } else {
                    console.error('Invalid response from getUserMailinfoDetail:', data)
                }
            }).catch(err => {
                console.error('Error in getUserMailinfoDetail:', err)
            })
        },
        // 删除
        deleteItem(id) {

          this.$confirm(this.$t('mail.确定删除选中的数据吗'), this.$t('mail.提示'), {
                confirmButtonText: this.$t('mail.确定'),
                cancelButtonText: this.$t('mail.取消'),
                type: 'warning'
            }).then(() => {
                removeUserMailinfo({
                    id
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

            this.$refs.formData.validate((valid) => {
                if (valid) {

                    const submitData = {
                        ...this.formData,
                        userIds: this.formData.userIds.join(','),
                        mailgroupIds: this.formData.mailgroupIds.join(',')
                    }
                    delete submitData.mailgroupIds2
                    addMailRelations(submitData).then(res => {
                        this.$message.success(this.$t('mail.操作成功'))
                        this.dialogVisible = false
                        this.getDataList()
                    }).catch(() => {
                        this.$message.error(this.$t('mail.操作失败'))
                    })
                }
            })
        },

    }
}
</script>

<style lang="scss" >
.email-send-cc{
.email-send-dialog {
    .el-dialog__body {
        padding: 0 !important;
    }
}


.email-dialog-content {
    padding: 30px;
}

.el-form-item {
    margin-bottom: 22px;

}

.el-form-item .el-form-item__content {
    display: flex;
    align-items: center;
}

.el-form-item .el-select,
.el-form-item .el-input,
.el-form-item .el-radio-group {
    width: 100%;
}

.el-form-item .el-input__inner,
.el-form-item .el-select__input {
    width: 100%;
}

.el-form-item .el-radio-group {
    display: flex;
    align-items: center;
}

.el-form-item .el-radio-group .el-radio {
    margin-right: 20px;
}

.form-row {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
}

.form-label {
    width: 100px;
    font-weight: 500;
    color: #303133;
    text-align: right;
    margin-right: 20px;
}

.form-control {
    flex: 1;
    display: flex;
    align-items: center;

}

.form-control .el-select,
.form-control .el-input {
    width: 100%;
}

.form-control .el-button {
    margin-left: 10px;
}

.attachment-tip {
    margin-left: 15px;
    font-size: 12px;
    color: #909399;
}

.editor-toolbar {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
}


.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}

.editor-content {
    border: 1px solid #e4e7ed;
    border-top: none;
    border-radius: 0 0 4px 4px;
}

.editor-content textarea {
    resize: none;
    border: none;
    outline: none;
    padding: 15px;
    min-height: 300px;
}

.dialog-footer {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

.dialog-footer .el-button {
    margin-left: 10px;
}

/* 按钮样式 */
.form-control .el-button {
    margin-left: 10px;
}

/* 查看弹窗样式 */
.view-form {
  width: 100%;
}

.view-form-item {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.view-form-label {
  width: 80px;
  font-weight: 500;
  margin-right: 10px;
  text-align: right;
}

.view-form-value {
  flex: 1;
  word-break: break-word;
}
}

</style>
