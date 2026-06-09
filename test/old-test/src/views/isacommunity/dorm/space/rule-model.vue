<template>
    <div>
        <el-dialog :title="dialogTitle" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="rule-dialog" close-on-click-modal close-on-press-escape>
            <div class="rule-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item :label="$t('dorm.学校')" prop="schoolId" style="width: 100%;">
                        <el-select v-model="form.schoolId" :placeholder="$t('dorm.请选择学校')" style="width: 100%;">
                            <el-option v-for="school in schoolList" :key="school.externId" :label="school.enName"
                                :value="school.externId"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.规则名称')" prop="ruleName" style="width: 100%;">
                        <el-input v-model="form.ruleName" :placeholder="$t('dorm.请输入规则名称')"
                            style="width: 100%;"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.分配规则')" required>
                        <div v-for="(item, index) in form.rulesList" :key="index"
                            style="display: flex; align-items: center; margin-bottom: 10px;">
                            <el-select v-model="form.rulesList[index]" :placeholder="$t('dorm.请选择规则')"
                                style="flex: 1; margin-right: 10px;" clearable>
                                <el-option v-for="option in ruleItemList" :key="option.code" :label="option.name"
                                    :value="option.code"></el-option>
                            </el-select>
                            <el-button type="primary" icon="el-icon-plus" circle @click="addRule" v-if="index === 0"
                                size="small"></el-button>
                            <el-button type="danger" icon="el-icon-minus" circle @click="removeRule(index)"
                                v-if="index > 0" size="small"></el-button>
                        </div>
                    </el-form-item>





                    <el-form-item :label="$t('dorm.状态')" prop="is_active">
                        <el-select v-model="form.is_active" :placeholder="$t('dorm.请选择状态')" clearable style="width: 100%;">
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
import { saveBedAssignRule, updateBedAssignRule, listRuleItemList, getAssignRuleInfo, } from "@/api/isacommunity/dorm";


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
        },
        schoolList: {
            type: Array,
            default: () => []
        },

    },
    data() {
        return {
            dialogImageUrl: '',
            ruleItemList: [],
            fileList: [],
            studentInfo: {}, // 存储学生详细信息
            loading: false, // 防止重复点击
            form: {
                rulesList: [],
                ruleName: '',
                schoolId: '',
                name: '',


                is_active: '',

            },
            rules: {
                schoolId: [
                    { required: true, message: this.$t('dorm.请选择学校'), trigger: 'change' }
                ],
                ruleName: [
                    { required: true, message: this.$t('dorm.请输入规则名称'), trigger: 'blur' }
                ],

                is_active: [
                    { required: true, message: this.$t('dorm.请选择状态'), trigger: 'change' }
                ],

            }
        }
    },
    computed: {
        dialogTitle() {

            return this.form.id ? this.$t('dorm.编辑规则') : this.$t('dorm.新增规则');
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal) {
                if (newVal) {
                    this.resetForm();
                   
                    if(this.schoolList && this.schoolList.length == 1){
                        this.form.schoolId = this.schoolList[0].externId;
                    }

                    this.getRuleItemList();
                    
                    this.$nextTick(() => {
                        if (this.$refs.form) {
                            this.$refs.form.clearValidate();
                        }
                    });
                    if (this.editData && this.editData.id) {
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

                    if (newVal.rulesList && newVal.rulesList.length > 0) {
                        this.form.rulesList = [...newVal.rulesList];
                    }


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


        getRuleItemList() {
            listRuleItemList().then((res) => {
                this.ruleItemList = res
            }).catch(err => {
               
                console.error(err)
            })
        },

        // 获取详情
        async loadDetail(id) {
            try {
                this.loading = true;
                const res = await getAssignRuleInfo(id);
                if (res) {
                  
                    this.form = {
                        id: res.id,
                        schoolId: res.school_id,
                        ruleName: res.ruleName,
                        rulesList: res.ruleItems.split(','),
                        is_active: res.isActive + "",
                    };
                }
            } catch (error) {
                console.error('获取规则详情失败:', error);
            } finally {
                this.loading = false;
            }
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

                if (valid) {


                    const request = this.form.id ? updateBedAssignRule : saveBedAssignRule
                    const message = this.$t('dorm.操作成功')

                    // 将 rulesList 转换为 rule 字段（用逗号分隔或保留为数组，此处转换为逗号分隔字符串以作兼容）

                    let params = {
                        id:this.form.id,
                        school_id: this.form.schoolId,
                        rule_name: this.form.ruleName,
                        is_active: parseInt(this.form.is_active),
                        rule_items: this.form.rulesList.join(','),
                    }



                    request(params).then((res) => {
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
                schoolId: '',
                ruleName: '',
                rulesList: [''],
                is_active: '',
            }
            // 重置文件列表，保留默认图片
            this.fileList = []
            // 重置学生信息
            this.studentInfo = {}
        },

    }
}
</script>

<style lang="scss">
.rule-dialog {

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