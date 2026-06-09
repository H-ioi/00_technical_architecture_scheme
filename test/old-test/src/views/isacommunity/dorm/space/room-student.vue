<template>
    <div>
        <el-dialog :title="$t('dorm.办理入住')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="attribute-dialog" close-on-click-modal close-on-press-escape>
            <div class="attribute-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">

                    <el-form-item :label="$t('dorm.学校')" prop="school" style="width: 100%;">
                        <el-select v-model="form.school" :placeholder="$t('dorm.请选择学校')" style="width: 100%;" clearable
                            @change="handleSchoolChange">
                              <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.externId"
              ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.学生')" prop="admissonNo" style="width: 100%;">
                        <el-select v-model="form.admissonNo" :placeholder="$t('dorm.请选择学生')" filterable
                            style="width: 100%;">
                            <el-option v-for="student in studentList" :key="student.admission_no"
                                :label="student.en_name + ' (' + student.admission_no + ')'"
                                :value="student.admission_no"></el-option>
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
import { saveAttribute, updateAttribute, getProjectDetail, getDormStudentListPage, getFloorList, assignBed } from "@/api/isacommunity/dorm.js";
import { mapGetters } from "vuex";

export default {
    name: 'RoomStudentDialog',
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
        roomId: {
            type: String,
            default: null
        },
        gender: {
            type: String,
            default: null
        }
    },


    data() {
        return {
           
            studentList: [],

            loading: false, // 防止重复点击
            form: {
                school: '',
                admissonNo: '',
            },
            rules: {
                school: [
                    { required: true, message: this.$t('attendance.请选择学校'), trigger: 'change' }
                ],

                admissonNo: [
                    { required: true, message: this.$t('dorm.请选择学生'), trigger: 'change' }
                ],
            }
        }
    },
       computed: {
    ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
  },

    mounted() {
      
    },

        watch: {
        dialogVisible: {
            handler(val) {
                if (val) {
                    if(this.dictionary['school'].length == 1){
                        this.form.school = this.dictionary['school'][0].externId;
                        this.loadStudentList(this.form.school);
                    }
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
    },

    methods: {
     
        // 监听学校选择变化
        handleSchoolChange(schoolId) {
            this.form.admissonNo = ''; // 清空已选学生
            this.studentList = [];      // 清空学生列表
            if (schoolId) {
                this.loadStudentList(schoolId);
            }
        },
        // 获取该学校下的学生列表
        async loadStudentList(schoolId) {
            try {
                // 根据实际接口要求调整参数，这里假设传入 schoolId 作为查询条件，并且 size 给一个较大的值以获取全部
                const params = {
                    schoolId: schoolId,
                    current: 1,
                    hasBed: false,
                    gender: this.gender,
                    size: 9999
                };
                const res = await getDormStudentListPage(params);
                this.studentList = res.data;
            } catch (error) {
                console.error('获取学生列表失败:', error);
            }
        },


        submit() {
            if (this.loading) return; // 防止重复点击
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true; // 开始加载
                    let params = {
                        room_id: this.roomId,
                        label: this.editData.label,
                        admission_no: this.form.admissonNo
                    }

                    assignBed(params).then(res => {
                        console.log(res, 'restttt')
                        this.$message({
                            message: this.$t('dorm.办理入住成功'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.$emit('dialog-submit', this.form)
                                this.loading = false;
                            }
                        })
                    }).catch(err => {
                        this.loading = false;
                        return false
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
                admissonNo: '',
                school: '',
            }

        }
    }
}
</script>

<style lang="scss">
.attribute-dialog {


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
    .attribute-dialog-footer {
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