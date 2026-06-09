<template>
    <div>
        <el-dialog :title="$t('dorm.新增学生')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="floor-dialog" close-on-click-modal close-on-press-escape>
            <div class="holiday-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item :label="$t('dorm.学校')" prop="schoolId" style="width: 100%;">
                        <el-select v-model="form.schoolId" :placeholder="$t('dorm.请选择学校')" style="width: 100%;" @change="handleAdmissionNoBlur">
                            <el-option v-for="school in schoolList" :key="school.externId" :label="school.enName"
                                :value="school.externId"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.学号')" prop="admissionNo">
                        <el-input v-model="form.admissionNo" :placeholder="$t('dorm.请输入学号')" @blur="handleAdmissionNoBlur"></el-input>
                    </el-form-item>

                    <el-form-item v-if="studentInfo" label="">
                        <div class="student-info">
                            <div class="student-info__row">
                                <div class="student-info__label">{{ $t("attendance.学校") }}</div>
                                <div class="student-info__value">{{ studentInfo.school_name || '-' }}</div>
                            </div>
                            <div class="student-info__row">
                                <div class="student-info__label">{{ $t("attendance.姓名") }}</div>
                                <div class="student-info__value">{{ studentInfo.show_name || '-' }}</div>
                            </div>
                            <div class="student-info__row">
                                <div class="student-info__label">{{ $t("attendance.年级") }}</div>
                                <div class="student-info__value">{{ studentInfo.grade_code || '-' }}</div>
                            </div>
                            <div class="student-info__row">
                                <div class="student-info__label">{{ $t("attendance.班级") }}</div>
                                <div class="student-info__value">{{ studentInfo.form_code || '-' }}</div>
                            </div>
                            <div class="student-info__row">
                                <div class="student-info__label">{{ $t("isagroup.性别") }}</div>
                                <div class="student-info__value">{{ studentInfo.gender || '-' }}</div>
                            </div>
                            <div class="student-info__row">
                                <div class="student-info__label">{{ $t("isagroup.国籍") }}</div>
                                <div class="student-info__value">{{ studentInfo.show_nationality || '-' }}</div>
                            </div>
                         
                        </div>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.类型')" prop="type" style="width: 100%;">
                        <el-select v-model="form.type" :placeholder="$t('dorm.请选择类型')" style="width: 100%;">
                            <el-option label="weekly boarding" value="weekly boarding" ></el-option>
                            <el-option label="full boarding" value="full boarding"></el-option>
                        </el-select>
                    </el-form-item>




                </el-form>

                <div class="floor-dialog-footer">
                    <el-button size="medium" @click="cancel">{{
                        $t('attendance.取消') }}</el-button>
                    <el-button type="primary" size="medium" @click="submit()" class="submit-btn" :loading="loading">{{
                        $t('attendance.确定') }}</el-button>
                </div>
            </div>
        </el-dialog>

    </div>

</template>

<script>

import { getBuildingList, getStudentInfo, updateFloor, manualAddStudent } from "@/api/isacommunity/dorm.js";

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
        },
        schoolList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible2: false,
            fileList: [],
            buildingList: [],
            loading: false, // 防止重复点击
            studentInfo: null,
            form: {

                schoolId: '',
                admissionNo: '',
                type: '',
            },
            rules: {
                schoolId: [
                    { required: true, message: this.$t('dorm.请选择学校'), trigger: 'blur' }
                ],
                type: [
                    { required: true, message: this.$t('dorm.请选择类型'), trigger: 'change' }
                ],
                admissionNo: [
                    { required: true, message: this.$t('dorm.请输入学号'), trigger: 'blur' }
                ],

            }
        }
    },
    watch: {

        dialogVisible: {
            handler(val) {
                if (val) {
                    if (this.schoolList.length == 1) {
                        this.form.schoolId = this.schoolList[0].externId;
                    }
                    this.$nextTick(() => {
                        if (this.$refs.form) {
                            this.$refs.form.clearValidate();
                        }
                    });
                    if (this.editData && this.editData.id) {
                        // 如果有 editData 说明是编辑/查看模式，调用详情接口
                        this.loadDetail(this.editData.id);
                    }
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
                    this.form.school = newVal.school || ''
                    this.form.buildingId = newVal.buildingId || ''
                    this.form.name = newVal.name || ''
                    //  this.form.status = newVal.status || ''
                    this.form.name = newVal.name || ''


                }
            },
            deep: true,
            immediate: true
        },
    },

    methods: {
        async handleAdmissionNoBlur() {
            const schoolId = this.form.schoolId;
            const admissionNo = (this.form.admissionNo || '').trim();
            this.form.admissionNo = admissionNo;

            if (!admissionNo) return;
            if (!schoolId) {
                this.$message.warning(this.$t('dorm.请选择学校'));
                return;
            }

            try {
                const res = await getStudentInfo({
                    school_id: schoolId,
                    admission_no: admissionNo,
                });
                this.studentInfo = res || null;
            } catch (error) {
                this.studentInfo = null;
                console.error('获取学生信息失败:', error);
            }
        },

        // 学校下拉框选中值改变时触发
        handleSchoolChange(schoolId) {

            this.form.buildingId = ''
            this.buildingList = []

            if (schoolId) {
                this.loadBuildingList(schoolId);
            }
        },
        async loadBuildingList(schoolId) {
            try {
                if (!schoolId) return;
                // 假设 getBuildingList 接口支持传入 schoolId
                const res = await getBuildingList({ schoolId: schoolId })
                console.log('获取到的楼栋列表:', res);
                this.buildingList = res || []
            } catch (error) {
                console.error('获取宿舍列表失败:', error)
            }
        },



        submit() {
            if (this.loading) return; // 防止重复点击

            this.loading = true; // 开始加载

            this.$refs.form.validate((valid) => {
                if (valid) {

                    const message = this.$t('attendance.新增成功')
                    let params = {
                        school_id: this.form.schoolId,
                        admission_no: this.form.admissionNo,
                        boarding_type: this.form.type,
                    }
                 
                    manualAddStudent(params).then((res) => {
                        this.$message({
                            message: message,
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.$emit('dialog-submit', this.form)
                                this.loading = false; 
                            }
                        })

                    }).catch(err => {
                        this.$message.error(this.$t('attendance.操作失败'))
                        console.error(err)
                        this.loading = false; 
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
                schoolId: '',
                admissionNo: '',
                type: '',
            }
            this.studentInfo = null;
        },


        // 获取详情
        async loadDetail(id) {
            try {
                const res = await getFloorDetail(id);
                if (res) {
                    this.form = {
                        id: res.id,
                        school: res.building.school.extern_id,
                        buildingId: res.building.id,
                        name: res.name,
                    };

                    if (this.form.school) {
                        this.loadBuildingList(this.form.school);
                    }
                }
            } catch (error) {
                console.error('获取详情失败:', error);
            }
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

    .student-info {
        border: 1px solid #ebeef5;
        border-radius: 4px;
        padding: 12px;
        background: #fafafa;
        margin-top: -10px;
    }

    .student-info__row {
        display: flex;
        line-height: 22px;
    }

    .student-info__row + .student-info__row {
        margin-top: 6px;
    }

    .student-info__label {
        width: 90px;
        color: #909399;
        flex: 0 0 auto;
    }

    .student-info__value {
        color: #303133;
        word-break: break-word;
    }
}
</style>
