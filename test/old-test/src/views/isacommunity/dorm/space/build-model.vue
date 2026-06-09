<template>
    <div>
        <el-dialog :title="$t('dorm.楼栋管理')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="floor-dialog" close-on-click-modal close-on-press-escape>
            <div class="holiday-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="130px">
                    <el-form-item :label="$t('dorm.学校')" prop="schoolId" style="width: 100%;">
                        <el-select v-model="form.schoolId" :placeholder="$t('dorm.请选择学校')" style="width: 100%;">
                            <el-option v-for="school in schoolList" :key="school.externId" :label="school.enName"
                                :value="school.externId"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.楼栋名称')" prop="name">
                        <el-input v-model="form.name" :placeholder="$t('dorm.请输入楼栋名称')"></el-input>
                    </el-form-item>


                    <!--
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="form.status" :placeholder="$t('dorm.状态')" clearable style="width: 100%;">
                            <el-option :label="$t('dorm.启用')" value="1"></el-option>
                            <el-option :label="$t('dorm.禁用')" value="0"></el-option>

                        </el-select>
                    </el-form-item>
                    -->




                </el-form>

                <div class="floor-dialog-footer">
                    <el-button size="medium" @click="cancel">{{
                        $t('attendance.取消') }}</el-button>
                    <el-button type="primary" size="medium" @click="submit()" class="submit-btn" :loading="loading">{{
                        $t('attendance.确定') }}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" class="image-dialog">
            <img width="100%" :src="dialogImageUrl" style="scale: 0.8;">
        </el-dialog>
    </div>

</template>

<script>
import { saveBuilding, updateBuilding } from "@/api/isacommunity/dorm.js";

export default {
    name: 'BuildModel',
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
        },
      
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible2: false,

            studentInfo: {}, // 存储学生详细信息
            loading: false, // 防止重复点击
            form: {
                id: '',
                schoolId: '',
                name: '',
            },
            rules: {
                schoolId: [
                    { required: true, message: this.$t('dorm.请选择学校'), trigger: 'change' }
                ],

                name: [
                    { required: true, message: this.$t('dorm.请输入楼栋名称'), trigger: 'blur' }
                ],
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal) {
                
                if (newVal) {
                   if(this.schoolList.length == 1){
                        this.form.schoolId = this.schoolList[0].externId;
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
                    this.$nextTick(() => { 
                     this.form.id = newVal.data.id // 保存id用于更新操作
                    this.form.schoolId = newVal.data.school.extern_id || ''
                    this.form.name = newVal.data.name || ''
                    });
                  
                }
            },
            deep: true,
            immediate: true
        },
    },
   
    methods: {
    
        submit() {
            if (this.loading) return; // 防止重复点击

            this.loading = true; // 开始加载

            this.$refs.form.validate((valid) => {

                if (valid) {
                    // 判断是新增还是更新
                    const request = this.form.id ? updateBuilding : saveBuilding
                    const message = this.form.id ? this.$t('attendance.更新成功') : this.$t('attendance.新增成功')

                    request(this.form).then((res) => {

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
                    
                        this.loading = false; // 加载结束
                    })
                } else {
                    this.loading = false; // 加载结束
                    return false
                }
            })
        },

        cancel() {
            this.resetForm();
            this.$emit('update:dialogVisible', false);
            this.$emit('dialog-cancel');
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
                id: '',
                schoolId: '',
                name: '',
            }
        },
        handlePreview(file) {
            console.log(file)
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