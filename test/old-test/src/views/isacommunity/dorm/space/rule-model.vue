<template>
    <div>
        <el-dialog :title="dialogTitle" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="rule-dialog" close-on-click-modal close-on-press-escape>
            <div class="rule-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item :label="$t('dorm.学校')" prop="school" style="width: 100%;">
                        <el-select v-model="form.school" :placeholder="$t('dorm.请选择学校')" style="width: 100%;">
                            <el-option v-for="school in schoolList" :key="school.enName" :label="school.enName"
                                :value="school.enName"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.分配规则')" required>
                        <div v-for="(item, index) in form.rulesList" :key="index"
                            style="display: flex; align-items: center; margin-bottom: 10px;">
                            <el-select v-model="form.rulesList[index]" :placeholder="$t('dorm.请选择分配规则')"
                                style="flex: 1; margin-right: 10px;" clearable>
                                <el-option v-for="option in ruleOptions" :key="option.value" :label="option.label"
                                    :value="option.value"></el-option>
                            </el-select>
                            <el-button type="primary" icon="el-icon-plus" circle @click="addRule" v-if="index === 0"
                                size="small"></el-button>
                            <el-button type="danger" icon="el-icon-minus" circle @click="removeRule(index)"
                                v-if="index > 0" size="small"></el-button>
                        </div>
                    </el-form-item>





                    <el-form-item :label="$t('dorm.状态')" prop="status">
                        <el-select v-model="form.status" :placeholder="$t('dorm.请选择状态')" clearable style="width: 100%;">
                            <el-option :label="$t('dorm.满员')" value="1"></el-option>
                            <el-option :label="$t('dorm.空房')" value="0"></el-option>
                            <el-option :label="$t('dorm.部分满员')" value="2"></el-option>

                        </el-select>
                    </el-form-item>




                </el-form>

                <div class="rule-dialog-footer">

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
    name: 'RuleDialog',
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
            ruleOptions: [
                { label: this.$t('dorm.按班级分配'), value: 'class' },
                { label: this.$t('dorm.按年级分配'), value: 'grade' },
                { label: this.$t('dorm.按性别分配'), value: 'gender' }
            ],
            form: {
                rulesList: [''],
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
                    { required: true, message: this.$t('dorm.请选择学校'), trigger: 'change' }
                ],
              
              
                
            }
        }
    },
    computed: {
        dialogTitle() {
            if (this.isViewMode) {
                return this.$t('btn.查看') + ' ' + this.$t('dorm.规则');
            }
            return this.form.id ? this.$t('btn.编辑') + this.$t('dorm.规则') : this.$t('attendance.新增') + this.$t('dorm.规则');
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal) {
                if (newVal) {
                    // 对话框打开时重置表单
                    this.resetForm();
                    this.$nextTick(() => {
                        if (this.$refs.form) {
                            this.$refs.form.clearValidate();
                        }
                    });
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

                    if (newVal.rulesList && Array.isArray(newVal.rulesList) && newVal.rulesList.length > 0) {
                        this.form.rulesList = [...newVal.rulesList];
                    } else if (newVal.rule) {
                        try {
                            let parsed = JSON.parse(newVal.rule);
                            this.form.rulesList = Array.isArray(parsed) ? parsed : [newVal.rule];
                        } catch (e) {
                            this.form.rulesList = typeof newVal.rule === 'string' ? newVal.rule.split(',') : [newVal.rule];
                        }
                    } else {
                        this.form.rulesList = [''];
                    }

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
    },

    methods: {
        addRule() {
            this.form.rulesList.push('');
        },
        removeRule(index) {
            this.form.rulesList.splice(index, 1);
        },
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
                // 检查是否至少输入了一条规则
                const validRules = this.form.rulesList.filter(r => r && r.trim() !== '');
                if (validRules.length === 0) {
                    this.$message.error(this.$t('dorm.请输入分配规则'));
                    this.loading = false;
                    return false;
                }

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

                    // 将 rulesList 转换为 rule 字段（用逗号分隔或保留为数组，此处转换为逗号分隔字符串以作兼容）
                    this.form.rule = this.form.rulesList.filter(r => r && r.trim() !== '').join(',');

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
                rulesList: [''],
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
.rule-dialog {

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
    .rule-dialog-footer {
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

}
</style>