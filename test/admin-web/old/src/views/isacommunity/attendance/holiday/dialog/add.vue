<template>
    <div class="holiday-dialog-main">
        <el-dialog :title="$t('attendance.请假申请')" :before-close="closeDialog" :visible.sync="dialogVisible"
            width="750px" append-to-body class="holiday-dialog" close-on-click-modal close-on-press-escape>
            <div class="holiday-dialog-body">
                <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="holiday-form">


                    <el-form-item :label="$t('attendance.选择学生')" prop="admissonNo">
                        <el-autocomplete style="width: 100%" class="inline-input" suffix-icon="el-icon-search"
                            v-model="form.admissonNo" :fetch-suggestions="querySearch"
                            :placeholder="$t('isagroup.请输入学号')" :trigger-on-focus="false" @select="handleSelect"
                            @keyup.enter.native="handleSelect"
                            @input="changeStyle('block', '.el-autocomplete-suggestion')"
                            @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
                            :disabled="isViewMode"></el-autocomplete>
                        <!-- 学生详细信息显示 -->
                        <div v-if="Object.keys(studentInfo).length > 0" class="student-info">
                            <p><span class="info-label">{{ $t('attendance.姓名') }}：</span>{{ studentInfo.name ||
                                studentInfo.fullName || '-' }}</p>
                            <p><span class="info-label">{{ $t('attendance.学校') }}：</span>{{ studentInfo.schoolName ||
                                studentInfo.enName || '-' }}</p>
                            <p><span class="info-label">{{ $t('attendance.年级') }}：</span>{{ studentInfo.gradeName ||
                                studentInfo.grade || '-' }}</p>
                            <p><span class="info-label">{{ $t('attendance.班级') }}：</span>{{ studentInfo.formCode ||
                                studentInfo.formCode || '-' }}</p>
                        </div>
                    </el-form-item>

                    <!-- 请假类型 -->



                    <el-form-item :label="$t('attendance.请假类型')" prop="type">
                        <el-select v-model="form.type" :placeholder="$t('attendance.请选择请假类型')" style="width: 100%"
                            :disabled="isViewMode">
                            <el-option :label="$t('attendance.事假')" value="101"></el-option>
                            <el-option :label="$t('attendance.病假')" value="102"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 请假范围 -->
                    <el-form-item :label="$t('attendance.请假范围')" prop="scope">
                        <el-checkbox-group v-model="form.scope" class="checkbox-group" :disabled="isViewMode">
                            <el-checkbox label="course"  class="checkbox-item">{{
                                $t('attendance.课程') }}</el-checkbox>
                            <el-checkbox label="dorm"  class="checkbox-item">{{
                                $t('attendance.宿舍') }}</el-checkbox>
                            <el-checkbox label="bus"  class="checkbox-item">{{
                                $t('attendance.校巴') }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <!-- 固定假 -->
                    <el-form-item :label="$t('attendance.固定假')" prop="fixed">
                        <el-select v-model="form.fixed" :placeholder="$t('attendance.请选择')" style="width: 100%"
                            @change="handleFixedChange" :disabled="isViewMode">
                            <el-option :label="$t('attendance.是')" value="101"></el-option>
                            <el-option :label="$t('attendance.否')" value="102"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 星期 -->
                    <el-form-item :label="$t('attendance.星期')" prop="weekDays" v-if="form.fixed === '101'">
                        <el-checkbox-group v-model="form.weekDays" class="checkbox-group" :disabled="isViewMode">
                            <el-checkbox :label="$t('attendance.周一')"  class="checkbox-item">{{
                                $t('attendance.周一') }}</el-checkbox>
                            <el-checkbox :label="$t('attendance.周二')"  class="checkbox-item">{{
                                $t('attendance.周二') }}</el-checkbox>
                            <el-checkbox :label="$t('attendance.周三')"  class="checkbox-item">{{
                                $t('attendance.周三') }}</el-checkbox>
                            <el-checkbox :label="$t('attendance.周四')"  class="checkbox-item">{{
                                $t('attendance.周四') }}</el-checkbox>
                            <el-checkbox :label="$t('attendance.周五')"  class="checkbox-item">{{
                                $t('attendance.周五') }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <!-- 日期范围 -->
                    <el-form-item :label="$t('attendance.请假时间')" prop="dateRange" v-if="form.fixed === '102'">
                        <el-date-picker v-model="form.dateRange" type="datetimerange" range-separator="~"
                            :start-placeholder="$t('attendance.开始日期')" :end-placeholder="$t('attendance.结束日期')"
                            format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width: 100%"
                            size="medium" :disabled="isViewMode"></el-date-picker>
                    </el-form-item>

                    <el-form-item :label="$t('attendance.请假时间')" prop="dateRange" v-if="form.fixed === '101'">
                        <el-date-picker v-model="form.dateRange" type="daterange" range-separator="-"
                            :start-placeholder="$t('attendance.开始日期')" :end-placeholder="$t('attendance.结束日期')"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%"
                            size="medium" :disabled="isViewMode"></el-date-picker>
                    </el-form-item>

                    <el-form-item :label="$t('attendance.时段')" prop="dateLimit" v-if="form.fixed === '101'">
                        <el-time-picker v-model="form.dateLimit"  is-range
                            range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                            format="HH:mm" value-format="HH:mm" style="width: 100%"
                            size="medium" :disabled="isViewMode"></el-time-picker>
                    </el-form-item>

                    <!-- 请假原因 -->
                    <el-form-item :label="$t('attendance.请假原因')" prop="reason">
                        <el-input v-model="form.reason" type="textarea" :rows="4"
                            :placeholder="$t('attendance.请详细描述请假原因')" resize="none" class="reason-textarea"
                            :disabled="isViewMode"></el-input>
                    </el-form-item>

                    <!-- 上传附件 -->
                    <el-form-item :label="$t('attendance.附件')">
                        <el-upload list-type="picture-card" :file-list="fileList" :on-preview="handlePictureCardPreview"

                         accept=".jpeg,.png,.jpg"
                            :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :disabled="isViewMode"
                            :class="{ 'hide-upload': isViewMode }">
                            <i class="el-icon-plus"></i>
                        </el-upload>

                    </el-form-item>

                <!-- 家长负责安全 -->
                    <div style="text-align: center;">
                        <el-checkbox v-model="form.parentResponsible" class="parent-checkbox" v-if="!isViewMode">
                            <span style="color: #606266;">{{ $t('attendance.请假期间，家长负责孩子的安全') }}</span>
                        </el-checkbox>
                    </div>

                </el-form>

                <div class="holiday-dialog-footer" v-if="!isViewMode">

                    <el-button type="primary" size="medium" @click="submit()" class="submit-btn" :loading="loading"
                      >{{ $t('attendance.确定申请') }}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
            <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
        </el-dialog>
    </div>

</template>

<script>
import { saveHoliday, updateHoliday ,  getStudentInfo, searchStudentList,        } from "@/api/isacommunity/holiday.js";
import {
    downloadFile,
    uploadFile,
    getFileList,
    deleteFile
} from "@/api/upload/index.js";


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
            form: {
                type: '',
                scope: [],
                fixed: '102',
                weekDays: [],
                dateRange: [], // 使用日期范围选择器
                reason: '',
                admissonNo: '',
                dateLimit: ['08:00', '09:00'],
                parentResponsible: false,
                processInstanceId: '',
                taskId: '',
            },
            rules: {
                admissonNo: [
                    { required: true, message: this.$t('attendance.请选择学生'), trigger: 'change' }
                ],
                type: [
                    { required: true, message: this.$t('attendance.请选择请假类型'), trigger: 'change' }
                ],
                scope: [
                    { required: true, message: this.$t('attendance.请选择请假范围'), trigger: 'change' }
                ],
                reason: [
                    { required: true, message: this.$t('attendance.请填写请假原因'), trigger: 'blur' }
                ],
                dateRange: [
                    { required: true, message: this.$t('attendance.请选择请假时间'), trigger: 'change' }
                ],
                dateLimit: [
                    { required: true, message: this.$t('attendance.请选择请假时间'), trigger: 'change' }
                ],
                weekDays: [
                    { required: true, message: this.$t('attendance.请选择星期'), trigger: 'change' }
                ],
            }
        }
    },
    watch: {
        editData: {
            handler(newVal) {
                if (newVal) {
                    this.getFileData({ outerId: newVal.id, scene: 'extension_attachment' });
                    // 将编辑数据加载到表单中
                    this.form.id = newVal.id // 保存id用于更新操作
                    this.form.type = newVal.type || ''
                    this.form.scope = newVal.scope || []
                    this.form.fixed = newVal.fixed || 'no'
                    this.form.taskId = newVal.taskId || ''

                    this.form.weekDays = newVal.weekDays || []
                    // 将开始时间和结束时间转换为日期范围
                    if (newVal.beginTime && newVal.endTime) {
                        this.form.dateRange = [newVal.beginTime, newVal.endTime]
                    } else {
                        this.form.dateRange = []
                    }
                    this.form.dateLimit = newVal.dateLimit || []
                    this.form.reason = newVal.reason || ''

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
        async beforeAvatarUpload(file) {
            // 检查文件类型
          
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.warning(this.$t('attendance.文件大小不能超过2MB'));
                return false;
            }
            const name = file.name;
            let fileObj = await {
                id: "11111",
                type: file.type,
                file: file,
                name: file.name
            };
            fileObj["url"] = this.setFileUrl(file);
            console.log("fileObj", fileObj);
            this.fileList.push(fileObj);
            let obj = new FormData();
            obj.append("file", file);
            obj.append("scene", "extension_attachment");
            this.uploadfile(obj, this.fileList.length - 1);
            return true;
        },

        // 挂载查询到的学生
        async querySearch(queryString, cb) {
            searchStudentList({ student: queryString }).then((res) => {
                console.log(res,'rrrrrrrr')
                let data = res.data.data
                let list = [];


                   data.forEach(item=>{
                    list.push({
                        value:  item.showName+'('+item.admissonNo+')',
                        admissonNo: item.admissonNo,
                    });
                })

          
                cb(list);

            });
        },

        handleSelect(item) {

            getStudentInfo({ admissonNo: item["admissonNo"] }).then(res => {
                console.log(res, 'info');
                // 存储学生信息
                this.studentInfo = res.data.data
            })
            this.form.admissonNo = item["admissonNo"];
            this.changeStyle("none", ".el-autocomplete-suggestion");
            if (!item["admissonNo"]) {
                this.form.admissonNo = "";
                this.studentInfo = {};
            }
        },
        changeStyle(status, className) {
            let dom = document.querySelectorAll(className);
            dom[0].style.display = status;
        },

        handleRemove(file, fileList) {
            console.log("handleRemove", file, fileList);
            this.fileList = fileList;
            // 从表单的attachments中移除对应文件
            const index = this.fileList.findIndex(attach => attach.name === file.name);
            if (index > -1) {
                this.fileList.splice(index, 1);
            }
        },

        getFileData(data) {
            getFileList(data).then(res => {
                let data = res.data.data;
                this.filelist = [];

                data.map((item, index) => {
                    this.filelist.push(item.id);
                    let obj = {
                        id: item.id,
                        type: item.contentType,
                        file: "",
                        name: item.originalName
                    };
                    this.fileList.push(obj);
                    this.getFile(item.id, obj);
                });

            });
        },

        uploadfile(data, index) {

            uploadFile(data).then(res => {
                this.$message.success(this.$t('attendance.上传成功'));
                let id = res.data.data;
                this.$set(this.fileList, index, {
                    ...this.fileList[index],
                    id
                });

            });
        },
        handlePictureCardPreview(file) {
            this.dialogVisible2 = true;
            this.dialogImageUrl = file.url;

        },
        submit() {
            if (this.loading) return; // 防止重复点击
            
            this.loading = true; // 开始加载
            
            this.$refs.form.validate((valid) => {
                // 检查病假是否需要上传附件
                if (valid) {
                    if (this.form.type == 102 && this.fileList.length === 0) {
                        this.$message.error(this.$t('attendance.病假必须上传附件'));
                        this.loading = false; // 加载结束
                        return false;
                    }

                    // 检查家长是否负责
                    if (!this.form.parentResponsible) {
                        this.$message.error(this.$t('attendance.请勾选注意事项'));
                        this.loading = false; // 加载结束
                        return false;
                    }
                
                    // 将日期范围转换为开始日期和结束日期
                    if (this.form.dateRange && this.form.dateRange.length === 2) {
                        this.form.beginTime = this.form.dateRange[0]
                        this.form.endTime = this.form.dateRange[1]
                    }

                    // 添加学生信息到表单中
                    this.form.studentName = this.studentInfo.name || this.studentInfo.fullName || ''
                    this.form.studentSchool = this.studentInfo.schoolName || this.studentInfo.enName || ''
                    this.form.studentGrade = this.studentInfo.gradeName || this.studentInfo.grade || ''
                    this.form.studentClass = this.studentInfo.formCode  || ''
                    this.form.processInstanceId = this.form.processInstanceId || ''
                    this.form.taskId = this.form.taskId || ''
                    // 如果是固定假，不需要传 dateLimit
                    if (this.form.fixed == '101') {
                        this.form.dateLimit = this.form.dateLimit || []
                    } else {
                        // 固定假不需要传 dateLimit
                        delete this.form.dateLimit
                    }

                    // 判断是新增还是更新
                    const request = this.form.id ? updateHoliday : saveHoliday
                    const message = this.form.id ? this.$t('attendance.更新成功') : this.$t('attendance.新增成功')
                    this.form.fileIds = this.fileList.map(item => item.id)
                    console.log(this.form, 'this.form')

                    request(this.form).then((res) => {
                        console.log(res, 'restttt')
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
                type: '',
                scope: [],
                fixed: 'no',
                weekDays: [],
                dateRange: [],
                reason: '',
                parentResponsible: false,
            }
            // 重置文件列表
            this.fileList = []
        },
        handlePreview(file) {
            console.log(file)
        },
        handleFixedChange(value) {
            if (value === 'no') {
                this.form.weekDays = []
            }
        },
        getFile(id, data) {
            downloadFile(id, data).then(res => {
                console.log("downloadFile", res);
                let blob = new Blob([res.data]); // 返回的文件流数据
                let url = window.URL.createObjectURL(blob); // 将他转化为路径
                this.fileList.map((i, k) => {
                    console.log("lll", i, data);
                    if (i.id == id) {
                        this.$set(this.fileList, k, {
                            ...this.fileList[k],
                            file: res.data,
                            id,
                            url
                        });
                    }
                });
            });
        },

        setFileUrl(file) {
            if (!file) return '';
            return window.URL.createObjectURL(file);
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
