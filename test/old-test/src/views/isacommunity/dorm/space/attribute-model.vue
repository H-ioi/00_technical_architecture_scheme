<template>
    <div>
        <el-dialog :title="$t('dorm.属性管理')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="attribute-dialog" close-on-click-modal close-on-press-escape>
            <div class="attribute-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item :label="$t('dorm.学校')" prop="schoolId" style="width: 100%;">
                        <el-select v-model="form.schoolId" :placeholder="$t('dorm.请选择学校')" style="width: 100%;">
                             <el-option
                :key="k"
                v-for="(i, k) in dictionary['school']"
                :label="i.enName"
                :value="i.externId"
              ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.属性名称')" prop="name">
                        <el-input v-model="form.name" :placeholder="$t('dorm.请输入属性名称')"></el-input>
                    </el-form-item>





                    <el-form-item :label="$t('dorm.状态')" prop="status">
                      <el-select v-model="form.isActive" :placeholder="$t('dorm.状态')" clearable style="width: 100%;">
              <el-option :label="$t('dorm.启用')" value="1"></el-option>
              <el-option :label="$t('dorm.禁用')" value="0"></el-option>

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
import { saveAttribute, updateAttribute, getProjectDetail } from "@/api/isacommunity/dorm.js";
import { mapGetters } from "vuex";
export default {
    name: 'AttributeDialog',
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
    async mounted() {
        // 初始化时获取学校列表
      
    },
    computed: {
        ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
    },




    data() {
        return {
            dialogImageUrl: '',
            dialogVisible2: false,
     
            schoolList: [],
         
            loading: false, // 防止重复点击
            form: {
               
                school: '',
                name: '',
                isActive: '',
         
              
            },
            rules: {
                schoolId: [
                    { required: true, message: this.$t('dorm.请选择学校'), trigger: 'change' }
                ],
                name: [
                    { required: true, message: this.$t('dorm.请输入属性名称'), trigger: 'blur' }
                ],
                isActive: [
                    { required: true, message: this.$t('dorm.请选择状态'), trigger: 'change' }
                ],
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(val) {
                if (val) {
                    if(this.dictionary['school'].length == 1){
                        this.form.schoolId = this.dictionary['school'][0].externId;
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
    },

    methods: {
       


      
        // 获取详情
        async loadDetail(id) {
            try {
                this.loading = true;
                const res = await getProjectDetail(id);
               
                if (res) {
               
                    this.form = {
                        id: res.id,
                        schoolId: res.school.extern_id, // 或者其他你需要的字段
                        name: res.name,
                        isActive: res.is_active+""
                    };
                }
            } catch (error) {
                console.error('获取详情失败:', error);
            } finally {
                this.loading = false;
            }
        },

        submit() {
            if (this.loading) return; // 防止重复点击

            this.loading = true; // 开始加载

            this.$refs.form.validate((valid) => {
                // 检查病假是否需要上传附件
                if (valid) {
                  
                  
                    // 判断是新增还是更新
                    const request = this.form.id ? updateAttribute : saveAttribute
                    const message = this.form.id ? this.$t('attendance.更新成功') : this.$t('attendance.新增成功')
                   
                    console.log(this.form, 'this.form')

                    request(this.form).then((res) => {
                        console.log(res, 'restttt')
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
                        this.loading = false; 
                    })
                } else {
                    this.loading = false; 
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
                id: '',
                school: '',
                name: '',
                status: '',
              
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