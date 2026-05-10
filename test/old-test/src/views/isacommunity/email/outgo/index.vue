<template>
    <div class="community_page outgo-cc">
        <div class="community_top">
            <div class="community_top_title">{{ $t('mail.发件列表') }}</div>
            <div class="community_top_btn">

            </div>
        </div>
        <div class="community_centent">
            <div class="community_searchFrom">
                <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"
                    style="display: flex; align-items: center;">
                    <el-form-item label="">
                        <el-input v-model="dataForm.keyword" :placeholder="$t('mail.主题关键词')"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="~"
                            :start-placeholder="$t('mail.开始日期')" :end-placeholder="$t('mail.结束日期')"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 300px"
                            size="medium"></el-date-picker>
                    </el-form-item>

                    <el-form-item style="width: auto; margin-right: 0">
                        <el-button class="button_text" size="medium" type="text" icon="el-icon-refresh-right"
                            @click="clear">{{ $t("btn.重置") }}</el-button>
                        <el-button @click="getDataList()">{{ $t('mail.查询') }}</el-button>
                        <el-button type="primary" @click="addItem">{{ $t('mail.新增') }}</el-button>
                    </el-form-item>
                </el-form>

            </div>

            <el-tabs v-model="activeTab"  @tab-click="handleTabClick">
                <el-tab-pane :label="$t('mail.发件箱')" name="sent">
                    <el-table :data="dataList" fit border v-loading="dataListLoading"
                        @selection-change="selectionChangeHandle" style="width: 100%;">


                    <el-table-column prop="subject" header-align="center" align="center" :label="$t('mail.主题')">

                    </el-table-column>
                     <el-table-column prop="username" header-align="center" align="center" :label="$t('mail.用户')">

                    </el-table-column>
                    <el-table-column prop="email" header-align="center" align="center" :label="$t('mail.发件邮箱')">

                    </el-table-column>
                        <el-table-column prop="sendResult" header-align="center" align="center" :label="$t('mail.状态')">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sendResult === 0" style="color: red;">{{ $t('mail.失败') }} 【{{ scope.row.sendDetails || '' }}】</span>
                                <span v-else-if="scope.row.sendResult === 1" style="color: green;">{{ $t('mail.成功') }}</span>

                            </template>
                        </el-table-column>
                    <el-table-column prop="createdAt" header-align="center" align="center" :label="$t('mail.发送时间')">

                    </el-table-column>

                    <el-table-column fixed="right" header-align="center" align="center" width="250" :label="$t('mail.操作')" v-if="permissions['outgo-view'] || permissions['outgo-delete']">
                        <template slot-scope="scope">
                            <a type="text" size="small" @click="viewItem(scope.row)"     v-if="permissions['outgo-view']"
                                style="margin-right: 10px;" class="text-btn">{{ $t('mail.查看') }}</a>
                            <a type="text" size="small" @click="deleteItem(scope.row.id)" class="text-btn" v-if="permissions['outgo-delete']">{{ $t('mail.删除') }}</a>
                        </template>
                    </el-table-column>
                </el-table>
                </el-tab-pane>
                <el-tab-pane :label="$t('mail.草稿箱')" name="draft">
                    <el-table :data="draftDataList" fit border v-loading="dataListLoading"
                        @selection-change="selectionChangeHandle" style="width: 100%;">
                        <el-table-column prop="subject" header-align="center" align="center" :label="$t('mail.主题')">
                        </el-table-column>
                        
      <el-table-column prop="username" header-align="center" align="center" :label="$t('mail.用户')">

                    </el-table-column>
                     
                        <el-table-column prop="email" header-align="center" align="center" :label="$t('mail.发件邮箱')">
                        </el-table-column>

                        <el-table-column fixed="right" header-align="center" align="center" width="250" :label="$t('mail.操作')">
                            <template slot-scope="scope">
                                <a type="text" size="small" @click="editItem(scope.row)" class="text-btn"
                                    style="margin-right: 10px;">{{ $t('mail.编辑') }}</a>
                                <a type="text" size="small" @click="deleteItem(scope.row.id)" class="text-btn">{{ $t('mail.删除') }}</a>
                                <a type="text" size="small" @click="sendItem(scope.row.id)" class="text-btn">{{ $t('mail.发送') }}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

                <div class="pagination-container">
                    <el-pagination background layout="prev, pager, next, jumper, sizes, ->, total" :total="total"
                        :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>

                <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="1200px" class="email-view-dialog2" @close="handleDialogClose">
                    <div class="email-dialog-content">
                          <el-form :model="formData" :rules="formRules" ref="formData" label-width="80px">
                        <!-- 发件人 -->
                        <div class="form-row">
                            <div class="form-label">{{ $t('mail.发件邮箱') }}</div>
                            <div class="form-control">
                                <el-select v-model="formData.mailInfoId"  :placeholder="$t('mail.用户')" clearable filterable>
                                    <el-option v-for="user in userList" :key="user.id" :label="user.email"
                                        :value="user.id"></el-option>
                                </el-select>
                            </div>
                        </div>

                        <!-- 收件群组 -->


                        <div class="form-row">
                            <div class="form-label">{{ $t('mail.密送群组') }}</div>
                            <div class="form-control">
                                <el-select v-model="formData.bccGroups" :placeholder="$t('mail.密送群组')" multiple clearable filterable
                                    style="width: 300px; margin-right: 10px;">
                                    <el-option v-for="group in mailGroupList" :key="group.id" :label="group.name"
                                        :value="group.id"></el-option>
                                </el-select>
                                <el-button type="default"
                                    @click="showRecipientGroup = !showRecipientGroup">{{ $t('mail.发送群组') }}</el-button>
                                <el-button type="default" @click="showCcGroup = !showCcGroup">{{ $t('mail.抄送群组') }}</el-button>
                            </div>
                        </div>

                        <div v-if="showRecipientGroup" class="form-row">
                            <div class="form-label">{{ $t('mail.发送群组') }}</div>
                            <div class="form-control">
                                <el-select v-model="formData.toGroups" :placeholder="$t('mail.发送群组')" multiple clearable filterable
                                    style="width:295px; margin-right: 10px;">
                                    <el-option v-for="group in mailGroupList" :key="group.id" :label="group.name"
                                        :value="group.id"></el-option>
                                </el-select>
                            </div>
                        </div>

                        <!-- 抄送群组 -->
                        <div v-if="showCcGroup" class="form-row">
                            <div class="form-label">{{ $t('mail.抄送群组') }}</div>
                            <div class="form-control">
                                <el-select v-model="formData.ccGroups" :placeholder="$t('mail.抄送群组')" multiple clearable filterable
                                    style="width: 295px; margin-right: 10px;">
                                    <el-option v-for="group in mailGroupList" :key="group.id" :label="group.name"
                                        :value="group.id"></el-option>
                                </el-select>
                            </div>
                        </div>


                        <!-- 密送人 -->
                        <div class="form-row">
                            <div class="form-label">{{ $t('mail.密送人') }}</div>
                            <div class="form-control">
                                <el-input v-model="formData.otherBCC" :placeholder="$t('mail.密送人')"
                                    style="width: 300px; margin-right: 10px;"></el-input>
                                <el-button type="default" @click="showRecipient = !showRecipient">{{ $t('mail.收件人') }}</el-button>
                                <el-button type="default" @click="showCc = !showCc">{{ $t('mail.抄送人') }}</el-button>
                                <span class="attachment-tip">{{ $t('mail.多个以分号隔开') }}</span>
                            </div>
                        </div>

                        <!-- 收件人 -->
                        <div v-if="showRecipient" class="form-row">
                            <div class="form-label">{{ $t('mail.收件人') }}</div>
                            <div class="form-control">
                                <el-input v-model="formData.otherMails" :placeholder="$t('mail.收件人')"
                                    style="width: 295px; margin-right: 10px;"></el-input>
                            </div>
                        </div>

                        <!-- 抄送人 -->
                        <div v-if="showCc" class="form-row">
                            <div class="form-label">{{ $t('mail.抄送人') }}</div>
                            <div class="form-control">
                                <el-input v-model="formData.otherCC" :placeholder="$t('mail.抄送人')"
                                    style="width: 295px; margin-right: 10px;"></el-input>
                            </div>
                        </div>

                        <!-- 邮件主题 -->
                        <div class="form-row">
                            <div class="form-label">{{ $t('mail.主题') }}</div>
                            <div class="form-control">
                                <el-input v-model="formData.subject" :placeholder="$t('mail.主题')"
                                    style="width: 100%; max-width: 600px;"></el-input>
                            </div>
                        </div>

                        <!-- 邮件附件 -->
                        <div class="form-row">
                            <div class="form-label">{{ $t('mail.附件') }}</div>
                            <div class="form-control">
                                <el-upload class="upload-demo" :show-file-list="true" action="" :limit="8"
                                    :file-list="fileList" :before-upload="beforeUpload">

                                    <el-button size="small" type="primary" :disabled="formData.attachments.length >= 10">{{ $t('mail.批量添加') }}</el-button>
                                    <span class="attachment-tip">{{ $t('mail.附件提示') }}</span>
                                </el-upload>
                            </div>
                        </div>

                        <!-- 已上传附件列表 -->
                        <div v-if="formData.attachments && formData.attachments.length > 0" class="form-row">
                            <div class="form-label">{{ $t('mail.已上传附件') }}</div>
                            <div class="form-control">
                                <el-tag v-for="(attachment, index) in formData.attachmentNames" :key="index" closable
                                    @close="removeAttachment(index)">
                                    {{ attachment }}
                                </el-tag>
                            </div>
                        </div>

                        <!-- 邮件内容 -->
                        <div>
                            <my-editor ref="editorRef" v-model="formData.content"></my-editor>
                        </div>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm(0)">{{ $t('mail.存草稿') }}</el-button>
                        <el-button type="primary" @click="submitForm(1)">{{ $t('mail.发送') }}</el-button>
                        <el-button @click="dialogVisible = false">{{ $t('mail.取消') }}</el-button>
                    </span>
                </el-dialog>

                <!-- 查看弹窗 -->
                <el-dialog :title="$t('mail.邮件发送详情')" :visible.sync="viewDialogVisible" width="1300px" class="email-view-dialog2">
                    <div class="email-dialog-content">
                        <div class="view-form">
                          
                            <!-- 邮件名 -->
                            <div class="view-form-item" style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center;">
                                    <div class="view-form-label">{{ $t('mail.主题') }}</div>
                                    <div class="view-form-value">{{ formData.subject || '-' }}</div>
                                </div>
                                <el-button type="primary" size="small" @click="exportRecord">
                                    {{ $t('mail.下载') }}
                                </el-button>
                            </div>

                            <!-- 发件邮箱 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.发件邮箱') }}</div>
                                <div class="view-form-value">{{ formData.email || '-' }}</div>
                            </div>

                            <!-- 用户 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.用户') }}</div>
                                <div class="view-form-value">
                                    <span v-if="formData.userInfo && formData.userInfo.username">{{ formData.userInfo.username }}</span>
                                    <span v-else>-</span>
                                </div>
                            </div>

                            <!-- 状态 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.状态') }}</div>
                                <div class="view-form-value">
                                    <span v-if="formData.sendResult === 0" style="color: red;">{{ $t('mail.失败') }}</span>
                                    <span v-else-if="formData.sendResult === 1" style="color: green;">{{ $t('mail.成功') }}</span>

                                </div>
                            </div>

                            <!-- 失败原因 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.失败原因') }}</div>
                                <div class="view-form-value">{{ formData.sendDetails || '-' }}</div>
                            </div>

                        

                         
                        

                            <!-- 密送群组 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.密送群组') }}</div>
                                <div class="view-form-value" >
                                    <span v-for="(item, index) in formData.bccGroups" :key="index" style="margin-right: 5px;">{{ item.name || '-' }}</span>
                                </div>
                            </div>
                            
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.发送群组') }}</div>
                                <div class="view-form-value" >
                                    <span v-for="(item, index) in formData.toGroups" :key="index" style="margin-right: 5px;">{{ item.name || '-' }}</span>
                                </div>
                            </div>

                            <!-- 发送群组 -->
                            <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.抄送群组') }}</div>
                                <div class="view-form-value" >
                                    <span v-for="(item, index) in formData.ccGroups" :key="index" style="margin-right: 5px;">{{ item.name || '-' }}</span>
                                </div>
                            </div>

                       
                             <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.密送人') }}</div>
                                <div class="view-form-value" >
                                    <span v-for="(item, index) in formData.bccOthersArray" :key="index" style="margin-right: 5px;">{{ item || '-' }}</span>
                                </div>
                            </div>


                               <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.收件人') }}</div>
                                <div class="view-form-value" >
                                    <span v-for="(item, index) in formData.toOthersArray" :key="index" style="margin-right: 5px;">{{ item || '-' }}</span>
                                </div>
                            </div>



                               <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.抄送人') }}</div>
                                <div class="view-form-value" >
                                    <span v-for="(item, index) in formData.ccOthersArray" :key="index" style="margin-right: 5px;">{{ item || '-' }}</span>
                                </div>
                            </div>



                             <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.附件') }}</div>
                                <div class="view-form-value">
                                    <div v-if="formData.attachments && formData.attachments.length > 0">
                                        <div v-for="(attachment, index) in formData.attachmentNames" :key="index" class="attachment-item">
                                            {{ attachment }}
                                        </div>
                                    </div>
                                    <span v-else>-</span>
                                </div>
                            </div>

                             <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.邮件内容') }}</div>
                                <div class="view-form-value" v-html ="formData.content || '-'"></div>
                            </div>

                             <div class="view-form-item">
                                <div class="view-form-label">{{ $t('mail.发送时间') }}</div>
                                <div class="view-form-value">{{ formData.createdAt || '-' }}</div>
                            </div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="viewDialogVisible = false">{{ $t('mail.关闭') }}</el-button>
                    </span>
                </el-dialog>

            </div>
        </div>


  
</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
// 引入相关的依赖
import { listSendRecord, removeSendRecord, listMailGroup, uploadFile,listUserMailinfo,saveMailRecord,
    exportSendRecord,updateMailRecord,getSendRecordDetail } from "@/api/isacommunity/mail";
import myEditor from "@/views/isacommunity/myEditor.vue";
import { download } from "@/util/download.js";
import { mapGetters } from "vuex";

export default {
    name: 'MailGoupSendRecord',
    components: {
        myEditor
    },
    data() {
        return {
            // 搜索表单
            dataForm: {
                keyword: '',
                dateRange: []
            },
            fileList: [],
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            // 数据列表
            dataList: [],
            // 草稿箱数据列表
            draftDataList: [],
            // 当前激活的标签页
            activeTab: 'sent',
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
                toGroups: [],
                ccGroups: [],
                bccGroups: [],
                otherCC: [],
                otherBCC: [],
                otherMails: [],
                subject: '',
                content: ' ',
                mailInfoId: '',

                attachmentNames: [],
                attachments: []
            },
            // 控制收件群组行的显示
            showRecipientGroup: false,
            // 控制抄送群组行的显示
            showCcGroup: false,
            // 控制收件人行的显示
            showRecipient: false,
            userList: [],
            // 控制抄送人
            showCc: false,
            // 学校列表
            schoolList: [],
            // 群组名单
            groupMembers: [],
            // 年级列表
            mailGroupList: [
            ],
            // 部门列表

            // 表单验证规则
            formRules: {
                school: [
                    { required: true, message: '请选择学校', trigger: 'change' }
                ],

                department: [
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ]
            },
        }
    },
    // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
    mounted() {

        // 初始化数据列表
        this.getDataList()
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
         getAllUser() {
            listUserMailinfo({
                current: 1,
                status: 1,
                size: 9997
            }).then(res => {
                console.log(res, 'ressssss')
                if (res && res.data) {

                    this.userList = res.data || []
                }
            })
        },
        // 标签页切换
        handleTabClick(tab) {
            if (tab.name === 'sent') {
                this.getDataList()
            } else if (tab.name === 'draft') {
            
                this.getDraftDataList()
            }
        },
        // 获取草稿箱数据列表
        getDraftDataList() {
            this.dataListLoading = true
            let params = {
                current: this.pageIndex,
                size: this.pageSize,
                keyword: this.dataForm.keyword,
                status: 0
            }
            if (this.dataForm.dateRange && this.dataForm.dateRange.length === 2) {
                params.beginCreateDate = this.dataForm.dateRange[0]
                params.endCreateDate = this.dataForm.dateRange[1]
            }

            listSendRecord(params).then(res => {
                if (res && res.data) {
                    this.draftDataList = res.data || []
                    this.total = res.total || 0
                }
                this.dataListLoading = false
            })
        },

        // 获取年级列表
        getMailGroupList() {
            let params = {
                current: this.pageIndex,
                status: 1,
                size: 99996

            }

            listMailGroup(params).then(res => {
                console.log(res, 'rt')
                if (res && res.data) {
                    this.mailGroupList = res.data || []

                }

            })
        },
        clear() {
            this.dataForm = {};
            this.getDataList()
        },

        beforeUpload(file) {
            // 限制文件大小为20MB
            const maxSize = 20 * 1024 * 1024 // 20MB
            if (file.size > maxSize) {
                this.$message.error(this.$t('mail.文件大小不能超过20MB'));
                return false;
            }
            
            // 限制附件数量为10个
            if (this.formData.attachments.length >= 10) {
                this.$message.error(this.$t('mail.最多上传10个附件'));
                return false;
            }
            
            let data = new FormData()
            data.append('files', file)

            uploadFile(data).then(res => {
                console.log(res.data, 'res.data.data[0111111]')
                if (res && res.data) {
                     console.log(file.name, 'file.name')

                    this.formData.attachments.push(res.data.data[0])
                    this.formData.attachmentNames.push(file.name)
                
                }
      
                this.$message.success("上传成功!");
            })
            
            // 返回false，阻止el-upload组件的默认上传行为
            return false;
        },
        // 获取数据列表
        getDataList() {
            if (this.activeTab === 'sent') {
                this.getSentDataList()
            } else if (this.activeTab === 'draft') {
                this.getDraftDataList()
            }
        },
        // 获取发件箱数据列表
        getSentDataList() {
            this.dataListLoading = true
            let params = {
                current: this.pageIndex,
                size: this.pageSize,
                keyword: this.dataForm.keyword,
                status: 1
            }
            if (this.dataForm.dateRange && this.dataForm.dateRange.length === 2) {
                params.beginCreateDate = this.dataForm.dateRange[0]
                params.endCreateDate = this.dataForm.dateRange[1]
            }

            listSendRecord(params).then(res => {
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
            this.dialogTitle = this.$t('mail.发送邮件')
            this.formData = {
                toGroups: [],
                ccGroups: [],
                bccGroups: [],
                otherCC: [],
                otherBCC: [],
                subject: '',
              
                mailInfoId: '',
                attachments: [],
                attachmentNames: [],
                content: '',
            }
            this.showRecipient = false
            this.showCc = false
            this.showRecipientGroup = false
            this.showCcGroup = false
            // 调用获取用户列表
            this.getAllUser()
            // 调用获取群组列表
            this.getMailGroupList()
            this.dialogVisible = true
            this.$nextTick(() => {
                if (this.$refs.editorRef && this.$refs.editorRef.initEditor) {
                 
                    this.$refs.editorRef.initEditor()
                }
            })
        },
        // 编辑
        editItem(row) {
            console.log('editItem called with row:', row)
            this.dialogTitle = this.$t('mail.编辑邮件')
            // 调用获取用户列表
            this.getAllUser()
            // 调用获取群组列表
            this.getMailGroupList()
            getSendRecordDetail({ id: row.id }).then(data => {
                console.log('getSendRecordDetail data:', data)
                if (data) {
 
                    this.formData = {
                        toGroups: data.toGroups.map(item => item.id) || [],
                        ccGroups: data.ccGroups.map(item => item.id) || [],
                        bccGroups: data.bccGroups.map(item => item.id) || [],
                        otherCC: data.ccOthersArray.join(';') || [],
                        otherBCC: data.bccOthersArray.join(';') || [],
                        otherMails: data.toOthersArray.join(';') || [],
                        subject: data.subject || '',
                        content: data.content || ' ',
                        email: data.email || '',
                        mailInfoId: data.userMailinfoId || '',
                        id: data.id || '',
                        attachments: data.attachmentUrls || [],
                        attachmentNames: (data.attachmentUrls || []).map(path => {
                            const lastIndex = path.lastIndexOf("|")
                            return lastIndex > -1 ? path.substring(lastIndex + 1) : path
                        })
                    }
                    console.log(this.formData, 'this.formData')
                    this.showRecipient = (data.toOthersArray && data.toOthersArray.length > 0)
                    this.showCc = (data.ccOthersArray && data.ccOthersArray.length > 0)
                    this.showRecipientGroup = (data.toGroups && data.toGroups.length > 0)
                    this.showCcGroup = (data.ccGroups && data.ccGroups.length > 0)
                    this.dialogVisible = true
                } 
            })
        },
        // 查看
        viewItem(row) {
            console.log('viewItem called with row:', row)
            getSendRecordDetail({ id: row.id }).then(data => {
             
                if (data) {
                    console.log( data.bccOthersArray, 'bccOthersArray')
                    this.formData = {
                        userId: data.userId || '',
                        toGroups: data.toGroups || [],
                        ccGroups: data.ccGroups || [],
                        bccGroups: data.bccGroups || [],
                        ccOthersArray: data.ccOthersArray || [],
                        bccOthersArray: data.bccOthersArray || [],
                        toOthersArray: data.toOthersArray || [],
                        otherMails: data.toOthersArray || [],
                        subject: data.subject || ' ',
                        content: data.content || ' ',
                        id: data.id || '',
                        mailInfoId: data.userMailinfoId || '',
                        attachments: data.attachmentUrls || [],
                        attachmentNames: (data.attachmentUrls || []).map(path => {
                            const lastIndex = path.lastIndexOf("|")
                            return lastIndex > -1 ? path.substring(lastIndex + 1) : path
                        }) || [],
                        // 额外字段
                        userInfo: data.userInfo || {},
                        email: data.email || '',
                        sendResult: data.sendResult ,
                        sendDetails: data.sendDetails || '',
                       
                        createdAt: data.createdAt || ''
                    }
                 
                 
                    this.viewDialogVisible = true
                }
            }).catch(err => {
                console.error('Error in getSendRecordDetail:', err)
            })
        },
        // 删除
        deleteItem(id) {

            this.$confirm(this.$t('mail.确定删除选中的数据吗'), this.$t('mail.提示'), {
                confirmButtonText: this.$t('mail.确定'),
                cancelButtonText: this.$t('mail.取消'),
                type: 'warning'
            }).then(() => {
                removeSendRecord({
                    id: id
                }).then(res => {
                    this.$message.success(this.$t('mail.操作成功'))
                    this.getDataList()
                }).catch(() => {    
                    this.$message.error(this.$t('mail.操作失败'))
                })
            })
        },
        // 提交表单
        submitForm(status) {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    // 创建提交数据对象
                    const submitData = { ...this.formData }

                    // 如果收件群组未显示，删除 toGroups 字段
                    if (!this.showRecipientGroup) {
                        delete submitData.toGroups
                    }

                    // 如果抄送群组未显示，删除 ccGroups 字段
                    if (!this.showCcGroup) {
                        delete submitData.ccGroups
                    }

                    // 如果收件人未显示，删除 otherMails 字段
                    if (!this.showRecipient) {
                        delete submitData.otherMails
                    } else {
                        if(submitData.otherMails!='' && submitData.otherMails!=null){
                            submitData.otherMails = submitData.otherMails.split(';')
                        }
                    }
                    
                    if(submitData.otherBCC!='' && submitData.otherBCC!=null){
                        submitData.otherBCC = submitData.otherBCC.split(';')
                    }
                    
                 
                    if (!this.showCc) {
                        delete submitData.otherCC
                    } else {
                        if(submitData.otherCC!='' && submitData.otherCC!=null){
                            submitData.otherCC = submitData.otherCC.split(';')
                        }
                    }

                    submitData.status = status
           
                 
                    if (this.formData.id) {
                        updateMailRecord(submitData).then(res => {
                            this.$message.success('操作成功')
                            this.dialogVisible = false
                            this.getDataList()
                        }).catch(() => {
                            this.$message.error('操作失败')
                        })
                    } else {
                        saveMailRecord(submitData).then(res => {
                            this.$message.success('操作成功')
                            this.dialogVisible = false
                            this.getDataList()
                        }).catch(() => {
                            this.$message.error('操作失败')
                        })
                    }
                }
            })
        },
        // 移除成员
        removeMember(row) {
            const index = this.groupMembers.findIndex(item => item.id === row.id || item.admissionNo === row.admissionNo)
            if (index > -1) {
                this.groupMembers.splice(index, 1)
            }
        },
        // 处理文件上传
        handleFileUpload() {
            this.$refs.fileInput.click();
        },

        // 移除附件
        removeAttachment(index) {
            this.formData.attachments.splice(index, 1);
            this.formData.attachmentNames.splice(index, 1);
        },
        // 弹窗关闭事件
        handleDialogClose() {
          // window.location.reload()
          this.$refs.editorRef.initEditor()
            
        },
        // 导出记录
        exportRecord() {
           
            exportSendRecord( this.formData.id ).then(res => {
                download(res.data, res.headers["content-disposition"]);
            }).catch(() => {
                this.$message.error(this.$t('mail.操作失败'));
            });
        },
        // 发送邮件（从草稿箱发送）
       async sendItem(id) {
            let temp = {}
             getSendRecordDetail({ id }).then(data => {
                console.log('getSendRecordDetail data:', data)
                if (data) {
 
                    temp = {
                        toGroups: data.toGroups.map(item => item.id) || [],
                        ccGroups: data.ccGroups.map(item => item.id) || [],
                        bccGroups: data.bccGroups.map(item => item.id) || [],
                        otherCC: data.ccOthersArray.join(';') || [],
                        otherBCC: data.bccOthersArray.join(';') || [],
                        otherMails: data.toOthersArray.join(';') || [],
                        subject: data.subject || '',
                        content: data.content || '',
                        status: 1,
                        email: data.email || '',
                        mailInfoId: data.userMailinfoId || '',
                        id: data.id || '',
                        attachments: data.attachmentUrls || [],
                        attachmentNames: (data.attachmentUrls || []).map(path => {
                            const lastIndex = path.lastIndexOf("|")
                            return lastIndex > -1 ? path.substring(lastIndex + 1) : path
                        })
                    }
                  
                } 
                updateMailRecord(temp).then(res => {
                    this.$message.success(this.$t('mail.操作成功'))
                  
                    this.getDataList()
                }).catch(() => {
                    this.$message.error(this.$t('mail.操作失败'))
                })
            })
        }

    }
}
</script>

<style lang="scss"  >
.outgo-cc{
.email-view-dialog2 {
    .el-dialog__body {
        padding: 0 !important;
    }
}
.text-btn {
  color: #BA8E62 !important;
  margin-right: 10px;
  cursor: pointer;
}

.email-dialog-content {
    padding: 30px;
}

.form-row {
    display: flex;
    margin-bottom: 25px;
    align-items: center;
}

.form-label {
    width: 100px;
    font-weight: 500;
    color: #303133;
}

.form-control {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 800px;
    flex-wrap: wrap;
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

.editor-toolbar-separator {
    width: 1px;
    height: 16px;
    background-color: #e4e7ed;
    margin: 0 10px;
}

.editor-toolbar-text {
    font-size: 12px;
    color: #909399;
    margin-right: 10px;
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
  width: 120px;
  font-weight: 500;
  margin-right: 20px;
  text-align: right;
  flex-shrink: 0;
}

.view-form-value {
  flex: 1;
  word-break: break-word;
}

.email-view-dialog .dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.email-view-dialog .dialog-footer .el-button {
  margin-left: 10px;
}
}

</style>
