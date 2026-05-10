<template>
    <div class="holiday-dialog-main">
        <el-dialog :title="$t('attendance.销假申请')" :before-close="closeDialog" :visible.sync="dialogVisible"
            width="750px" append-to-body class="holiday-dialog" close-on-click-modal close-on-press-escape>
            <div class="holiday-dialog-body">
                <div class="info-table">
                    <!-- 学生信息 -->
                    <div class="info-row">
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.学生姓名') }}：</span>
                            <span class="info-value">{{ studentInfo.fullName || '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.学号') }}：</span>
                            <span class="info-value">{{ studentInfo.admissonNo || '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.学校') }}：</span>
                            <span class="info-value">{{ studentInfo.schoolName || '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.年级') }}：</span>
                            <span class="info-value">{{ studentInfo.grade || '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.班级') }}：</span>
                            <span class="info-value">{{ studentInfo.formCode || '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.请假类型') }}：</span>
                            <span class="info-value">{{ form.type === '101' ? $t('attendance.事假') : form.type === '102'
                                ? $t('attendance.病假') : form.type || '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.请假范围') }}：</span>
                            <span class="info-value">{{form.scope && form.scope.length > 0 ? form.scope.map(item => {
                                const scopeMap = {
                                    course: $t('attendance.课程'),
                                    dorm: $t('attendance.宿舍'),
                                    bus: $t('attendance.校巴')
                                }
                                return scopeMap[item] || item
                            }).join('、') : '-'}}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.固定假') }}：</span>
                            <span class="info-value">{{ form.fixed === '101' ? $t('attendance.是') : form.fixed === '102'
                                ? $t('attendance.否') : form.fixed || '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row" v-if="form.fixed === '101'">
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.星期') }}：</span>
                          


 <el-tag v-for="(item, index) in form.weekDays" :key="index" type="primary" size="small"
              style="margin-right: 5px;">
              {{ getWeekDaysText(item) }}
            </el-tag>
                        </div>
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.时段') }}：</span>
                            <span class="info-value">{{ form.dateLimit && form.dateLimit.length === 2 ?
                                form.dateLimit[0] + ' - ' + form.dateLimit[1] : '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.请假时间') }}：</span>
                            <span class="info-value">{{ form.dateRange && form.dateRange.length === 2 ?
                                form.dateRange[0] + ' ~ ' + form.dateRange[1] : form.beginTime && form.endTime ?
                                    form.beginTime + ' ~ ' + form.endTime : '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">{{ $t('attendance.传染病') }}：</span>
                            <span class="info-value"> {{ form.isInfectious == '101' ? $t('attendance.是') :
                                form.isInfectious == '102' ?
                                $t('attendance.否') : '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item full-width">
                            <span class="info-label">{{ $t('attendance.请假原因') }}：</span>
                            <span class="info-value">{{ form.reason || '-' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item full-width attendance-attachment">
                            <span class="info-label">{{ $t('attendance.附件') }}：</span>
                            <div class="info-value">
                                <div v-if="fileList && fileList.length > 0" class="file-list">
                                    <el-upload list-type="picture-card" :file-list="fileList"
                                        :on-preview="handlePictureCardPreview" disabled class="hide-upload">
                                    </el-upload>
                                </div>
                                <span v-else>-</span>
                            </div>
                        </div>
                    </div>
                </div>
                <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="holiday-form">

                    <el-form-item :label="$t('attendance.返校时间')" prop="backTime">
                        <el-date-picker v-model="form.backTime" type="datetime" :placeholder="$t('attendance.请选择返校时间')"
                            format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width: 100%"
                            size="medium"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('attendance.返校证明')">
                        <el-upload list-type="picture-card" :file-list="backFileList"
                            :on-preview="handlePictureCardPreview" accept=".jpeg,.png,.jpg"
                            :before-upload="beforeReturnFileUpload" :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>

                <div style="text-align: center; margin-top: 20px;">
                    <el-checkbox v-model="form.parentResponsible" class="parent-checkbox" v-if="!isViewMode">
                        <span style="color: #606266;">{{ $t('attendance.以上信息属实') }}</span>
                    </el-checkbox>
                </div>

                <div class="holiday-dialog-footer">
                    <el-button type="primary" size="medium" @click="submit()" class="submit-btn" :loading="loading">{{
                        $t('attendance.确认销假') }}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
            <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
        </el-dialog>
    </div>

</template>

<script>
import {  getStudentInfo, saveHolidayEnd } from "@/api/isacommunity/holiday.js";
import myRequest from "@/router/axiosother.js";


export default {
    name: 'HolidayDialog',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        editData: {
            type: Object,
            default: null
        },

    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible2: false,
            fileList: [],
            backFileList: [], // 返校证明文件列表
            studentInfo: {}, // 存储学生详细信息
            loading: false, // 防止重复点击
            form: {
                type: '',
                scope: [],
                fixed: '102',
                weekDays: [],
                dateRange: [], // 使用日期范围选择器
                reason: '',
                files: [],
                parentResponsible: false,
                backTime: '', // 返校时间
                admissonNo: '',
                dateLimit: ['08:00', '09:00'],
                parentResponsible: false,
                needPass: '101', // 是否需要放行条
                processInstanceId: '',
                taskId: '',
            },
            rules: {
                backTime: [
                    { required: true, message: this.$t('attendance.请选择返校时间'), trigger: 'change' }
                ],

            }
        }
    },
    watch: {
        editData: {
            handler(newVal) {
                if (newVal) {
                    console.log(newVal, 'bbbbbbbbbbbbbbbbbb')
                    // 将编辑数据加载到表单中
                    this.form.id = newVal.id // 保存id用于更新操作
                    this.form.type = newVal.type || ''
                    // 转换files为对象数组
                    if (newVal.files && Array.isArray(newVal.files)) {
                        this.fileList = newVal.files.map(fileUrl => {
                            const fileName = fileUrl.split('/').pop()

                            return {
                                url: fileUrl.replace(/"/g, ''),
                                name: fileName
                            }
                        })
                    } else {
                        this.fileList = []
                    }
                    this.form.scope = newVal.scope || []
                    this.form.fixed = newVal.fixed || 'no'
                    this.form.taskId = newVal.taskId || ''
                    this.form.isInfectious = newVal.isInfectious

                    this.form.weekDays = newVal.weekDays || []
                    // 将开始时间和结束时间转换为日期范围
                    if (newVal.beginTime && newVal.endTime) {
                        this.form.dateRange = [newVal.beginTime, newVal.endTime]
                    } else {
                        this.form.dateRange = []
                    }
                    this.form.dateLimit = newVal.dateLimit || []
                    this.form.reason = newVal.reason || ''
                    this.form.needPass = newVal.needPass || ''

                    this.$nextTick(() => {
                        this.form.admissonNo = newVal.admissonNo || ''
                        this.handleSelect({ admissonNo: newVal.admissonNo })
                    });
                    this.form.parentResponsible = newVal.parentResponsible || false
                }
            },
            deep: true,
            immediate: true
        },
        dialogVisible(newVal) {
            if (!newVal) {
                // 对话框关闭时重置表单
                this.resetForm()
            }
        }
    },
    created() {

    },
    methods: {

        handleRemove(file, fileList) {
            this.backFileList = fileList;
            // 从表单的attachments中移除对应文件
            const index = this.backFileList.findIndex(attach => attach.name === file.name);
            if (index > -1) {
                this.backFileList.splice(index, 1);
            }
        },
        async beforeReturnFileUpload(file) {
            // 检查文件类型
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.warning(this.$t('attendance.文件大小不能超过2MB'));
                return false;
            }
            const formData = new FormData();
            formData.append("file", file); // 将文件添加到 FormData 对象

            try {
                const response = await myRequest.upload(formData, {
                    headers: {
                        'x-target-scene': 'community-new'
                    }
                });
                // 上传成功，通过 $emit 通知父组件
                console.log("response", response.data);
                const url = response.data.url;
                this.backFileList.push({
                    url: url,
                    name: file.name
                });

                return true;
            } catch (error) {
                console.error("文件上传失败", error);
                return false;
            }
        },
        
        getWeekDaysText(status) {
      const statusMap = {
        'monday': this.$t('attendance.周一'),
        'tuesday': this.$t('attendance.周二'),
        'wednesday': this.$t('attendance.周三'),
        'thursday': this.$t('attendance.周四'),
        'friday': this.$t('attendance.周五'),
      
      }
      return statusMap[status] || '-'
    },

        handleSelect(item) {

            getStudentInfo({ admissonNo: item["admissonNo"] }).then(res => {
                this.studentInfo = res.data.data
            })
            this.form.admissonNo = item["admissonNo"];
            this.changeStyle("none", ".el-autocomplete-suggestion");
            if (!item["admissonNo"]) {
                this.form.admissonNo = "";
                this.studentInfo = {};
            }
        },


        handlePictureCardPreview(file) {
            this.dialogVisible2 = true;
            this.dialogImageUrl = file.url;

        },
        submit() {
            if (this.loading) return; // 防止重复点击


            this.$refs.form.validate((valid) => {

                if (this.form.isInfectious == 101) {
                    if(this.backFileList.length == 0){
                        this.$message.error(this.$t('attendance.请上传附件'));
                        return;
                    }
                }


                if (valid) {
                    if (!this.form.parentResponsible) {
                        this.$message.error(this.$t('attendance.请勾选以上信息属实'));
                        this.loading = false; // 加载结束
                        return false;
                    }
                    this.loading = true; // 开始加载
                    let submitData = {}
                    submitData.studentName = this.studentInfo.fullName || ''
                    submitData.studentSchool = this.studentInfo.schoolName
                    submitData.studentGrade = this.studentInfo.grade || ''
                    submitData.studentClass = this.studentInfo.formCode || ''
                    submitData.backTime = this.form.backTime || ''
                    submitData.studentNo = this.form.admissonNo || ''
                    submitData.studentAvatar = this.studentInfo.profilePhoto || ''
                    submitData.holidayId = this.form.id
                    // 处理文件列表
                    if (this.backFileList.length > 0) {
                        submitData.files = this.backFileList.map(item => item.url)
                    }


                    console.log(submitData, 'submitData')

                    saveHolidayEnd(submitData).then((res) => {
                        console.log(res, 'restttt')
                        this.$message({
                            message: this.$t('attendance.操作成功'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.$emit('dialog-submit', submitData)
                                this.loading = false; // 加载结束
                            }
                        })

                    }).catch(err => {
                        this.$message.error(this.$t('attendance.操作失败'))
                        console.error(err)
                        this.loading = false;
                    })

                }


            })

        },

        cancel() {
            this.resetForm()
            this.$emit('update:dialogVisible', false)
            this.$emit('dialog-cancel')
        },
        closeDialog(done) {
            this.resetForm()
            this.$emit('update:dialogVisible', false)
            this.$emit('dialog-cancel')
            done() // 调用done回调以确认关闭
        },
        resetForm() {
            // 检查表单引用是否存在
            if (this.$refs.form) {
                this.$refs.form.resetFields()
            }
            // 重置表单数据
            this.form = {
                backTime: '',
                dateRange: [],
                files: [],
                backFileList: [],
                processInstanceId: '',
                taskId: '',
            }
            // 重置文件列表，保留默认图片
            this.fileList = []
            // 重置学生信息
            this.studentInfo = {}
        }
    }
}
</script>

<style lang="scss">
.holiday-dialog {
    .attendance-attachment {
        display: none;
    }

    .is-disabled {
        background-color: #f5f7fa !important;
        color: GRAY !important;
    }

    .hide-upload .el-upload--picture-card {
        display: none;
    }

    .el-dialog__header {
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 20px;
        background-color: #fafafa;

        .el-dialog__title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }
    }

    .el-dialog__body {
        padding: 24px 20px;
    }


    .holiday-form {
        .el-form-item {
            margin-bottom: 24px;

            &:last-child {
                margin-bottom: 0;
            }

            .el-form-item__label {
                font-weight: 500;
                color: #303133;
                font-size: 14px;
                padding-right: 12px;
            }

            .el-form-item__content {
                font-size: 14px;
            }
        }
    }

    // 复选框组样式
    .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .checkbox-item {
            border-radius: 4px;
            border-color: #dcdfe6;
            transition: all 0.3s ease;

            &:hover {
                border-color: #409eff;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
            }

            &.is-checked {
                border-color: #409eff;
                background-color: #ecf5ff;

                .el-checkbox__inner {
                    background-color: #409eff;
                    border-color: #409eff;
                }

                .el-checkbox__label {
                    color: #409eff;
                }
            }
        }
    }

    // 请假原因文本域样式
    .reason-textarea {
        border-radius: 4px;
        border-color: #dcdfe6;
        transition: all 0.3s ease;

        &:focus {
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
    }

    // 上传组件样式
    .upload-demo {
        width: 100%;

        .el-upload-dragger {
            border-radius: 6px;
            border: 2px dashed #dcdfe6;
            transition: all 0.3s ease;
            padding: 24px;

            &:hover {
                border-color: #409eff;
                background-color: #ecf5ff;
            }

            .el-icon-upload {
                font-size: 32px;
                color: #409eff;
            }

            .el-upload__text {
                color: #606266;
                font-size: 14px;
                margin-top: 12px;

                em {
                    color: #409eff;
                    font-style: normal;
                }
            }
        }

        .el-upload__tip {
            color: #909399;
            font-size: 12px;
            margin-top: 8px;
        }
    }

    // 家长责任复选框样式
    .parent-checkbox {
        margin-left: 0;

        .el-checkbox__inner {
            transition: all 0.3s ease;

            &:hover {
                border-color: #409eff;
            }
        }
    }

    // 学生信息显示样式
    .student-info {
        margin-top: 12px;
        padding: 12px;
        background-color: #f5f7fa;
        border-radius: 4px;
        border-left: 4px solid #409eff;
        width: 360px;

        p {
            margin: 0;
            padding: 4px 0;
            font-size: 14px;
            color: #606266;

            .info-label {
                font-weight: 500;
                color: #303133;
            }
        }
    }

    // 信息表格样式
    .info-table {
        width: 100%;
        border-collapse: collapse;
    }

    .info-row {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 12px;
        align-items: flex-start;
    }

    .info-item {
        flex: 1;
        min-width: calc(50% - 10px);
        display: flex;
        align-items: flex-start;
        margin-right: 20px;
    }

    .info-item:nth-child(2n) {
        margin-right: 0;
    }

    .info-item.full-width {
        flex: 100%;
        min-width: 100%;
        margin-right: 0;
    }

    .info-label {
        font-weight: 500;
        color: #303133;
        width: 120px;
        flex-shrink: 0;
        margin-right: 8px;
        text-align: right;
    }

    .info-value {
        flex: 1;
        color: #606266;
        font-size: 14px;
        word-break: break-word;
    }

    // 文件列表样式
    .file-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    // 底部按钮样式
    .holiday-dialog-footer {
        text-align: center;
        margin-top: 32px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;

        button {
            margin: 0 8px;
            padding: 8px 20px;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .cancel-btn {
            border-color: #dcdfe6;
            color: #606266;

            &:hover {
                border-color: #c0c4cc;
                color: #303133;
                background-color: #f5f7fa;
            }
        }

        .submit-btn {
            background-color: #409eff;
            border-color: #409eff;
            color: #fff;
            padding: 8px 28px;

            &:hover {
                background-color: #66b1ff;
                border-color: #66b1ff;
                transform: translateY(-1px);
                box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.4);
            }
        }
    }

    // 输入框、选择器等通用样式
    .el-input,
    .el-select,
    .el-date-picker {
        .el-input__inner {
            border-radius: 4px;
            border-color: #dcdfe6;
            transition: all 0.3s ease;

            &:focus {
                border-color: #409eff;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
            }
        }
    }
}

.image-dialog {
    .el-dialog__header {
        padding: 0 !important;
    }
}
</style>