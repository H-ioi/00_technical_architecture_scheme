<template>
    <div>
        <el-dialog :title="form.id ? $t('dorm.编辑房间') : $t('dorm.新增房间')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="room-dialog" close-on-click-modal close-on-press-escape>
            <div class="attribute-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item :label="$t('dorm.学校')" prop="school" style="width: 100%;">
                        <el-select v-model="form.school" :placeholder="$t('dorm.请选择学校')" style="width: 100%;" @change="handleSchoolChange" clearable>
                            <el-option v-for="school in schoolList" :key="school.externId" :label="school.enName"
                                :value="school.externId"></el-option>
                        </el-select>
                    </el-form-item>

  <el-form-item :label="$t('dorm.性别')" prop="gender" style="width: 100%;">
                        <el-select v-model="form.gender" :placeholder="$t('dorm.请选择性别')" style="width: 100%;">
                            <el-option :label="$t('dorm.男')" value="1"></el-option>
                            <el-option :label="$t('dorm.女')" value="2"></el-option>
                        </el-select>
                    </el-form-item>



                      <el-form-item :label="$t('dorm.楼栋')" prop="buildingId" style="width: 100%;">
                        <el-select v-model="form.buildingId" :placeholder="$t('dorm.请选择楼栋')" style="width: 100%;" @change="handleBuildingChange">  
                            <el-option v-for="building in buildingList" :key="building.id" :label="building.name"
                                :value="building.id"></el-option>
                        </el-select>
                    </el-form-item>




                  <el-form-item :label="$t('dorm.楼层')" prop="floorId" style="width: 100%;">
                        <el-select v-model="form.floorId" :placeholder="$t('dorm.请选择楼层')" style="width: 100%;">
                            <el-option v-for="floor in floorList" :key="floor.id" :label="floor.name" :value="floor.id"></el-option>
                        </el-select>
                    </el-form-item>

  <el-form-item :label="$t('dorm.属性')" prop="projectId" style="width: 100%;">
                        <el-select v-model="form.projectId" :placeholder="$t('dorm.请选择属性')" style="width: 100%;">
                            <el-option v-for="project in projectList" :key="project.id" :label="project.name" :value="project.id"></el-option>
                        </el-select>
                    </el-form-item>


                  <el-form-item :label="$t('dorm.房间号')" prop="number" style="width: 100%;">
                       <el-input v-model="form.number" :placeholder="$t('dorm.请输入房间号')"></el-input>
                    </el-form-item>

   <el-form-item :label="$t('dorm.床位数')" prop="total_bed_count" style="width: 100%;">
                       <el-input v-model="form.total_bed_count" :placeholder="$t('dorm.请输入床位数')"></el-input>
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
import {   getBuildingList, getFloorList, getProjectList, saveRoom, updateRoom, getRoomDetail } from "@/api/isacommunity/dorm.js";

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
        },
        schoolList: {
            type: Array,
            default: () => []
        }
    },
    async mounted() {
      
     
    },

    data() {
        return {
            dialogImageUrl: '',
            dialogVisible2: false,
            buildingList: [],
            floorList: [],
            projectList: [],
            
            loading: false, // 防止重复点击
            form: {
                number: '',
                school: '',
                building: '',
                floorId: '',
                projectId: '',
                total_bed_count: '',



         
              
            },
            rules: {
                school: [
                    { required: true, message: this.$t('dorm.请选择学校'), trigger: 'change' }
                ],
                gender: [
                    { required: true, message: this.$t('dorm.请选择性别'), trigger: 'change' }
                ],
                number: [
                    { required: true, message: this.$t('dorm.请输入房间号'), trigger: 'blur' }
                ],
                buildingId: [
                    { required: true, message: this.$t('dorm.请选择楼栋'), trigger: 'change' }
                ],
                floorId: [
                    { required: true, message: this.$t('dorm.请选择楼层'), trigger: 'change' }
                ],
                projectId: [
                    { required: true, message: this.$t('dorm.请选择属性'), trigger: 'change' }
                ],
                total_bed_count: [
                    { required: true, message: this.$t('dorm.请输入床位数'), trigger: 'blur' }
                ],
            }
        }
    },
    watch: {
        dialogVisible: {
            handler(val) {
                if (val) {
                     if(this.schoolList.length == 1){
                        this.form.school = this.schoolList[0].externId;
                        this.loadBuildingList(this.form.school);
                           this.loadProjectList(this.form.school);
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
                const res = await getRoomDetail(id);
                if (res) {
                    
                    this.form = {
                        id: res.id,
                        school: res.school_id,
                        number: res.number,
                        buildingId: res.floor.building == null ? '' : res.floor.building.id + '',
                        floorId: res.floor == null ? '' : res.floor.id + '',
                        projectId: res.project==null?'':res.project.id,
                        gender: res.gender+"",
                        total_bed_count: res.total_bed_count,
                        
                    };
                    if (this.form.school) {
                        this.loadBuildingList(this.form.school);
                    }
                    if (this.form.buildingId) {
                        this.loadFloorList(this.form.buildingId);
                    }
                 
                    if (this.form.projectId) {
                        this.loadProjectList(this.form.school);
                    }
                }
            } catch (error) {
                console.error('获取详情失败:', error);
            } finally {
                this.loading = false;
            }
        },
        // 学校下拉框选中值改变时触发
        handleSchoolChange(schoolId) {
            this.form.buildingId = ''; // 清空已选楼栋
            this.form.floorId = '';    // 清空已选楼层
            this.form.projectId = '';  // 清空已选属性
            this.buildingList = [];  // 清空楼栋列表
            this.floorList = [];     // 清空楼层列表
            this.projectList = [];   // 清空属性列表
            if (schoolId) {
                this.loadBuildingList(schoolId);
                this.loadProjectList(schoolId); // 同时传入学校ID获取属性列表
            }
        },
        // 楼栋下拉框选中值改变时触发
        handleBuildingChange(buildingId) {
            this.form.floorId = ''; // 楼栋改变时，清空已选的楼层
            this.floorList = [];  // 清空楼层列表
            if (buildingId) {
                this.loadFloorList(buildingId); // 传入选中的楼栋ID获取楼层
            }
        },
        // 获取宿舍列表
        async loadBuildingList(schoolId) {
            try {
                if (!schoolId) return;
                // 假设 getBuildingList 接口支持传入 schoolId
                const res = await getBuildingList({ schoolId: schoolId })
                
                this.buildingList = res || []
            } catch (error) {
                console.error('获取宿舍列表失败:', error)
            }
        },
        // 获取楼层列表
        async loadFloorList(buildingId) {
            try {
                // 如果没有传入 buildingId，就不请求数据
                if (!buildingId) return;
                
                // 假设 getFloorList 接口支持传入楼栋ID作为参数
                const res = await getFloorList({ buildingId: buildingId }) 
                this.floorList = res || []
            } catch (error) {
                console.error('获取楼层列表失败:', error)
            }
        },
        // 获取属性列表
        async loadProjectList(schoolId) {
            try {
                if (!schoolId) return;
                // 假设 getProjectList 接口支持传入 schoolId
                const res = await getProjectList({ schoolId: schoolId })
                this.projectList = res || []
            } catch (error) {
                console.error('获取属性列表失败:', error)
            }
        },
        submit() {
            if (this.loading) return; // 防止重复点击

            this.loading = true; // 开始加载

            this.$refs.form.validate((valid) => {
                if (valid) {
                    const request = this.form.id ? updateRoom : saveRoom
                    const message = this.form.id ? this.$t('attendance.更新成功') : this.$t('attendance.新增成功')
                   


                    request(this.form).then((res) => {
                   
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
                number: '',
                schoolId: '',
                buildingId: '',
                floorId: '',
                projectId: '',
                total_bed_count: '',
              
            }
           
        }
    }
}
</script>

<style lang="scss">
.room-dialog {


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