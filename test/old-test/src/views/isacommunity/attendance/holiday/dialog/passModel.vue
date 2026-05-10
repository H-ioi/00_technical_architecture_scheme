<template>
    <div class="holiday-dialog-main">
        <el-dialog :title="isBatch ? $t('attendance.批量生成放行条') : $t('attendance.放行条生成')" :before-close="closeDialog"
            :visible.sync="dialogVisible" width="850px" append-to-body class="holiday-dialog" close-on-click-modal
            close-on-press-escape>
            <div class="holiday-dialog-body">
                <!-- 批量生成时显示选中的学生列表 -->
                <div v-if="isBatch" class="batch-student-list">

                    <el-table :data="batchData" style="width: 100%;" size="small">
                        <el-table-column prop="studentNo" :label="$t('attendance.学号')" width="120"></el-table-column>
                        <el-table-column prop="studentName" :label="$t('attendance.姓名')" width="100"></el-table-column>
                        <el-table-column prop="studentSchool" :label="$t('attendance.学校')" width="120"></el-table-column>
                        <el-table-column prop="studentGrade" :label="$t('attendance.年级')" width="80"></el-table-column>
                        <el-table-column prop="studentClass" :label="$t('attendance.班级')" width="80"></el-table-column>
                        <el-table-column prop="studentDormitoryStatus" :label="$t('attendance.是否住宿')">
                            <template slot-scope="scope">
                                {{ scope.row.studentDormitoryStatus === 1 ? $t('attendance.是') : $t('attendance.否') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="holiday-form">
                    <!-- 非批量生成时显示学生选择 -->
                    <el-form-item v-if="!isBatch" :label="$t('attendance.选择学生')" prop="studentNo">
                        <el-autocomplete style="width: 100%" class="inline-input" suffix-icon="el-icon-search"
                            v-model="form.studentNo" :fetch-suggestions="querySearch"
                            :placeholder="$t('isagroup.请输入学号')" :trigger-on-focus="false" @select="handleSelect"
                            @keyup.enter.native="handleSelect"
                            @input="changeStyle('block', '.el-autocomplete-suggestion')"
                            @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
                            :disabled="isViewMode"></el-autocomplete>
                        <!-- 学生详细信息显示 -->
                        <div v-if="Object.keys(studentInfo).length > 0" class="student-info">
                            <p><span class="info-label">{{ $t('attendance.姓名') }}：</span>{{ studentInfo.fullName || '-'
                                }}</p>
                            <p><span class="info-label">{{ $t('attendance.学校') }}：</span>{{ studentInfo.schoolName ||
                                '-' }}</p>
                            <p><span class="info-label">{{ $t('attendance.年级') }}：</span>{{
                                studentInfo.grade || '-' }}</p>
                            <p><span class="info-label">{{ $t('attendance.班级') }}：</span>{{ studentInfo.formCode }}</p>
                            <p><span class="info-label">{{ $t('attendance.是否住宿') }}：</span>{{
                                studentInfo.dormitoryStatus == 1 ?
                                $t('attendance.是') : $t('attendance.否') }}</p>
                        </div>
                    </el-form-item>

                    <!-- 请假类型 -->

                    <!-- 放行方式 -->
                    <el-form-item :label="$t('attendance.放行方式')" prop="way">
                        <el-select v-model="form.way" :placeholder="$t('attendance.请选择放行方式')" style="width: 100%"
                            :disabled="isViewMode">
                            <el-option :label="$t('attendance.父母接送')" value="parents"></el-option>
                            <el-option :label="$t('attendance.自行离开')" value="self"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 日期范围 -->
                    <el-form-item :label="$t('attendance.放行日期')" prop="passTime">
                        <el-date-picker v-model="form.passTime" type="date"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%"
                            :placeholder="$t('attendance.放行日期')"
                            size="medium" :disabled="isViewMode"></el-date-picker>
                    </el-form-item>


                    <el-form-item :label="$t('attendance.时段')" prop="dateLimit" >
                        <el-time-picker v-model="form.dateLimit" is-range range-separator="-" :start-placeholder="$t('attendance.开始日期')"
                            :end-placeholder="$t('attendance.结束日期')" format="HH:mm" value-format="HH:mm" style="width: 100%" size="medium"  
                            :disabled="isViewMode"></el-time-picker>
                    </el-form-item>
                    <!-- 请假原因 -->
                    <el-form-item :label="$t('attendance.备注')">
                        <el-input v-model="form.memo" type="textarea" :rows="4"
                            resize="none" class="reason-textarea"
                            :disabled="isViewMode"></el-input>
                    </el-form-item>

                </el-form>

                <div class="holiday-dialog-footer" v-if="!isViewMode">

                    <el-button type="primary" size="medium" @click="submit()" class="submit-btn" :loading="loading">{{
                        $t('attendance.确认') }}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
            <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
        </el-dialog>
    </div>

</template>

<script>
import { saveReleasePass, updateReleasePass, getStudentInfo, searchStudentList } from "@/api/isacommunity/holiday.js";


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
        isViewMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible2: false,
            fileList: [],
            studentInfo: {}, // 存储学生详细信息
            loading: false, // 防止重复点击
            isBatch: false, // 是否批量生成
            batchData: [], // 批量数据
            form: {
                passTime: '', // 使用日期范围选择器
                memo: '',
                   dateLimit: ['08:00', '09:00'],
                studentNo: '',
                way: '', // 放行方式
            },
            rules: {
                studentNo: [
                    { required: true, message: this.$t('attendance.请选择学生'), trigger: 'change' }
                ],
                way: [
                    { required: true, message: this.$t('attendance.请选择放行方式'), trigger: 'change' }
                ],
                passTime: [
                    { required: true, message: this.$t('attendance.请选择放行时间'), trigger: 'change' }
                ],
                dateLimit: [
                    { required: true, message: this.$t('attendance.请选择时段'), trigger: 'change' }
                ],
               
            }
        }
    },
    watch: {
        editData: {
            handler(newVal) {
                
                if (newVal) {
                    // 检查是否为批量数据
                    if (newVal.batchData) {
                        this.isBatch = true;
                        this.batchData = newVal.batchData;
                    } else {
                        this.isBatch = false;
                        // 将编辑数据加载到表单中
                        this.form.id = newVal.id; // 保存id用于更新操作
                        this.form.passTime = newVal.passTime;
                        this.form.memo = newVal.memo || '';
                        this.form.way = newVal.way || '';
                        this.form.dateLimit = newVal.dateLimit || '';
                        
                        this.$nextTick(() => {
                            this.form.studentNo = newVal.studentNo || newVal.admissonNo || '';
                            if (this.form.studentNo) {
                                this.handleSelect({ admissonNo: this.form.studentNo });
                            }
                        });
                    }
                } else {
                    // 新增时重置表单
                    this.resetForm();
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

        // 挂载查询到的学生
        async querySearch(queryString, cb) {
            searchStudentList({ student: queryString }).then((res) => {
                let data = res.data.data
                let list = [];
                data.forEach(item => {
                    list.push({
                        value: item.showName + '(' + item.admissonNo + ')',
                        admissonNo: item.admissonNo,
                    });
                })
                cb(list);

            });
        },

        handleSelect(item) {
            getStudentInfo({ admissonNo: item["admissonNo"] }).then(res => {
                // 存储学生信息
                this.studentInfo = res.data.data
            })
            this.form.studentNo = item["admissonNo"];
            this.changeStyle("none", ".el-autocomplete-suggestion");
            if (!item["admissonNo"]) {
                this.form.studentNo = "";
                this.studentInfo = {};
            }
        },

        changeStyle(status, className) {
            let dom = document.querySelectorAll(className);
            dom[0].style.display = status;
        },

        submit() {
            if (this.loading) return; // 防止重复点击
            this.loading = true; // 开始加载

            // 批量生成时跳过学生验证
            if (this.isBatch) {
                this.batchSubmit();
            } else {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        // 添加学生信息到表单中
                        this.form.studentName = this.studentInfo.name || this.studentInfo.fullName || ''
                        this.form.studentSchool = this.studentInfo.schoolName || this.studentInfo.enName || ''
                        this.form.studentGrade = this.studentInfo.gradeName || this.studentInfo.grade || ''
                        this.form.studentClass = this.studentInfo.formCode || ''
                        this.form.studentAvatar = this.studentInfo.profilePhoto || ''
                        this.form.studentDormitoryStatus = this.studentInfo.dormitoryStatus || 0
                        const message = this.form.id ? this.$t('attendance.更新成功') : this.$t('attendance.新增成功')

                        // 根据是否有id来决定调用哪个API
                        const apiMethod = this.form.id ? updateReleasePass : saveReleasePass;
                        apiMethod(this.form).then((res) => {
                            this.$message({
                                message: message,
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$emit('dialog-submit', this.form)
                                    this.loading = false; // 加载结束
                                }
                            })
                        }).catch(err => {
                            this.$message.error(this.$t('attendance.操作失败'))
                            console.error(err)
                            this.loading = false; // 加载结束
                        })
                    } else {
                        this.loading = false; // 加载结束
                        return false
                    }
                })
            }
        },
        // 批量提交
        batchSubmit() {
            const promises = this.batchData.map(student => {
                const batchForm = {
                    ...this.form,
                    studentNo: student.studentNo,
                    id: student.id,
                    studentName: student.studentName,
                    studentSchool: student.studentSchool,
                    studentGrade: student.studentGrade,
                    studentClass: student.studentClass,
                    studentAvatar: this.studentInfo.profilePhoto || '',
                    studentDormitoryStatus: student.studentDormitoryStatus || 0
                };
                console.log(batchForm,'bbbbb')
               
                return updateReleasePass(batchForm);
            });

            Promise.all(promises).then(results => {
                this.$message({
                    message: this.$t('attendance.操作成功'),
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                        this.$emit('dialog-submit', { batch: true, count: results.length })
                        this.loading = false; // 加载结束
                    }
                });
            }).catch(err => {
                this.$message.error(this.$t('attendance.操作失败'));
                console.error(err);
                this.loading = false; // 加载结束
            });
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
            
            // 获取当前日期（只需要年月日）
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const currentDate = `${year}-${month}-${day}`;

            // 重置表单数据
            this.form = {
                passTime: currentDate,
                memo: '',
                studentNo: '',
                way: '',
            }
            // 重置批量相关数据
            this.isBatch = false;
            this.batchData = [];
            // 重置学生信息
            this.studentInfo = {};
            // 重置文件列表
            this.fileList = []
        },
        handlePreview(file) {
            console.log(file)
        }
    }
}
</script>

<style lang="scss">
.holiday-dialog {

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

    // 批量学生列表样式
    .batch-student-list {
        margin-bottom: 24px;
        padding: 16px;
        background-color: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #e9ecef;

        h4 {
            margin-top: 0;
            margin-bottom: 12px;
            color: #495057;
            font-size: 14px;
            font-weight: 600;
        }

        .el-table {
            margin-top: 8px;
        }
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