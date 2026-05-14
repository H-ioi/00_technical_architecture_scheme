<template>
    <div>
        <el-dialog :title="$t('dorm.楼层管理')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="floor-dialog" close-on-click-modal close-on-press-escape>
            <div class="holiday-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="学校" prop="school" style="width: 100%;">
                        <el-select v-model="form.school" placeholder="请选择学校" style="width: 100%;">
                            <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName"
                                :value="school.enName"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="楼栋名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入楼栋名称"></el-input>
                    </el-form-item>


                    <el-form-item label="楼层数" prop="department">
                        <el-input v-model="form.department" placeholder="请输入楼层数"></el-input>
                    </el-form-item>

                    <el-form-item label="开始楼层" prop="department">
                        <el-input v-model="form.department" placeholder="请输入楼层数"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="form.status" :placeholder="$t('dorm.状态')" clearable style="width: 100%;">
                            <el-option :label="$t('dorm.启用')" value="1"></el-option>
                            <el-option :label="$t('dorm.禁用')" value="0"></el-option>

                        </el-select>
                    </el-form-item>




                </el-form>

                <div class="floor-dialog-footer">

                    <el-button type="primary" size="medium" @click="submit()" class="submit-btn" :loading="loading">{{
                        $t('attendance.确定申请') }}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
            <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
        </el-dialog>
    </div>

</template>

<script>
import { saveHoliday, updateHoliday, getStudentInfo, searchStudentList, } from "@/api/isacommunity/holiday.js";
import myRequest from "@/router/axiosother.js";

export default {
    name: 'FloorDialog',
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
                school: '',
                name: '',
                department: '',
                startFloor: '',
                reason: '',
                remark: '',
                status: '',
                parentResponsible: false,
                needPass: '101', // 是否需要放行条
                processInstanceId: '',
                taskId: '',
                dataFrom: '',
            },
            rules: {
                school: [
                    { required: true, message: this.$t('attendance.请选择学校'), trigger: 'change' }
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
        dialogVisible: {
            handler(newVal) {
              //  alert(newVal)
                if (newVal) {
                    // 对话框打开时重置表单
                    //this.resetForm();
                   // this.$nextTick(() => {
                   //     if (this.$refs.form) {
                            //this.$refs.form.clearValidate();
                        //}
                  //  });
                } else {
                    // 对话框关闭时重置表单
                    this.resetForm();
                }
            },
            immediate: true
        },
        editData: {
            handler(newVal) {
                if (newVal) {
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
                    this.form.remark = newVal.remark || ''
                    this.form.dataFrom = newVal.dataFrom || ''
                    this.form.weekDays = newVal.weekDays || []
                   
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
    },

    methods: {
        async beforeAvatarUpload(file) {
            // 检查文件类型

            const isLt2M = file.size / 1024 / 1024 < 20;

            if (!isLt2M) {
                this.$message.warning(this.$t('attendance.文件大小不能超过20MB'));
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
                this.fileList.push({
                    url: url,
                    name: file.name
                });
                return true;
            } catch (error) {
                console.error("文件上传失败", error);
                return false;
            }
        },

        // 挂载查询到的学生
        async querySearch(queryString, cb) {
            searchStudentList({ student: queryString }).then((res) => {
                console.log(res, 'rrrrrrrr')
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
                    this.form.studentClass = this.studentInfo.formCode || ''
                    this.form.processInstanceId = this.form.processInstanceId || ''
                    this.form.taskId = this.form.taskId || ''
                    // 如果是固定假，不需要传 dateLimit
                    if (this.form.fixed == '101') {
                        this.form.dateLimit = this.form.dateLimit || []
                    } else {
                        // 固定假不需要传 dateLimit
                        delete this.form.dateLimit
                    }
                    this.form.source = 'admin'
                    // 判断是新增还是更新
                    const request = this.form.id ? updateHoliday : saveHoliday
                    const message = this.form.id ? this.$t('attendance.更新成功') : this.$t('attendance.新增成功')
                    if (this.fileList.length > 0) {
                        this.form.files = this.fileList.map(item => item.url)
                    }
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
                fixed: '102',
                weekDays: [],
                dateRange: [],
                files: [],
                reason: '',
                admissonNo: '',
                dateLimit: ['08:00', '09:00'],
                parentResponsible: false,
                needPass: '101',
                processInstanceId: '',
                taskId: '',
            }
            // 重置文件列表，保留默认图片
            this.fileList = []
            // 重置学生信息
            this.studentInfo = {}
        },
        handlePreview(file) {
            console.log(file)
        },


        handleFixedChange(val) {
            // 当固定假改变时，重置相关字段
            if (val === '102') {
                this.form.weekDays = []
            }
            this.form.dateRange = []
        }
    }
}
</script>

<style lang="scss">
.floor-dialog {



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


    // 底部按钮样式
    .floor-dialog-footer {
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
</style>