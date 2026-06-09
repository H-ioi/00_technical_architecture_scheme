<template>
    <div>
        <el-dialog :title="$t('dorm.房间变更')" :before-close="closeDialog" :visible.sync="dialogVisible" width="750px"
            append-to-body class="room-dialog" close-on-click-modal close-on-press-escape>
            <div class="attribute-dialog-body">



                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item :label="$t('dorm.学校')" prop="school" style="width: 100%;">
                        <el-select v-model="form.school" :placeholder="$t('dorm.请选择学校')" style="width: 100%;" clearable
                            @change="handleSchoolChange">
                            <el-option :key="k" v-for="(i, k) in dictionary['school']" :label="i.enName"
                                :value="i.externId"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.楼栋')" prop="buildingId" style="width: 100%;">
                        <el-select v-model="form.buildingId" :placeholder="$t('dorm.请选择楼栋')" style="width: 100%;"
                            @change="handleBuildingChange">
                            <el-option v-for="building in buildingList" :key="building.id" :label="building.name"
                                :value="building.id"></el-option>
                        </el-select>
                    </el-form-item>




                    <el-form-item :label="$t('dorm.楼层')" prop="floorId" style="width: 100%;">
                        <el-select v-model="form.floorId" :placeholder="$t('dorm.请选择楼层')" style="width: 100%;"
                            @change="handleFloorChange">
                            <el-option v-for="floor in floorList" :key="floor.id" :label="floor.name"
                                :value="floor.id"></el-option>
                        </el-select>
                    </el-form-item>




                    <el-form-item :label="$t('dorm.房间号')" prop="roomId" style="width: 100%;">
                        <el-select v-model="form.roomId" :placeholder="$t('dorm.请选择房间号')" style="width: 100%;"
                            @change="handleRoomChange">
                            <el-option v-for="room in roomList" :key="room.id" :label="room.number"
                                :value="room.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('dorm.床位')" prop="bedId" style="width: 100%;">
                        <el-select v-model="form.bedId" :placeholder="$t('dorm.请选择床位')" style="width: 100%;">
                            <el-option v-for="bed in bedList" :key="bed.label" :label="bed.label"
                                :value="bed.label"></el-option>
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
import {  getBuildingList, getFloorList, getBedList, saveRoom, updateRoom, getRoomList, moveBed } from "@/api/isacommunity/dorm.js";
import { mapGetters } from 'vuex';


export default {
    name: 'RoomChangeDialog',
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
        admissionNo: {
            type: String,
            default: ''
        },
        schoolId:{
             type: String,
            default: ''
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
            roomList: [],
            bedList: [],

            loading: false, // 防止重复点击
            form: {
                school: '',
                buildingId: '',
                floorId: '',
                roomId: '',
                bedId: '',



            },
            rules: {
                school: [
                    { required: true, message: this.$t('attendance.请选择学校'), trigger: 'change' }
                ],
                buildingId: [
                    { required: true, message: this.$t('dorm.请选择楼栋'), trigger: 'change' }
                ],
                floorId: [
                    { required: true, message: this.$t('dorm.请选择楼层'), trigger: 'change' }
                ],
                bedId: [
                    { required: true, message: this.$t('dorm.请选择床位号'), trigger: 'change' }
                ],
                roomId: [
                    { required: true, message: this.$t('dorm.请选择房间号'), trigger: 'change' }
                ],

            }
        }
    },
    computed: {
        ...mapGetters(["dictionary", "permissions", "i18nlocel"]),
    },
    watch: {
        dialogVisible: {
            handler(val) {
                if (val) {
                
                      if(this.dictionary['school'].length == 1){
                        this.form.school = this.dictionary['school'][0].externId;
                        this.loadBuildingList(this.form.school);
                    }
                   
                    this.$nextTick(() => {
                        if (this.$refs.form) {
                             // this.form.school = this.schoolId;
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



   

        // 学校下拉框选中值改变时触发
        handleSchoolChange(schoolId) {
            this.form.buildingId = ''; // 清空已选楼栋

            this.form.floorId = '';    // 清空已选楼层
            this.form.roomId = '';    // 清空已选房间
            this.form.bedId = '';    // 清空已选床位
            this.buildingList = [];  // 清空楼栋列表
            this.roomList = [];    // 清空房间列表
            this.floorList = [];     // 清空楼层列表
            this.bedList = [];     // 清空床位列表
            if (schoolId) {
                this.loadBuildingList(schoolId);

            }
        },
        handleRoomChange(roomId) {
            this.form.bedId = '';    // 清空已选床位
            this.bedList = [];     // 清空床位列表
            if (roomId) {
                this.loadBedList(roomId);
            }
        },
        // 监听楼层选择变化
        handleFloorChange(floorId) {
            this.form.roomId = '';    // 清空已选房间
            this.form.bedId = '';    // 清空已选床位
            this.bedList = [];     // 清空床位列表
            this.roomList = [];    // 清空房间列表
            if (floorId) {
                this.loadRoomList(floorId); // 传入选中的楼层ID获取房间列表
            }
        },
        // 楼栋栋下拉框选中值改变时触发
        handleBuildingChange(buildingId) {
            this.form.floorId = ''; // 楼栋改变时，清空已选的楼层
            this.floorList = [];  // 清空楼层列表
            this.roomList = [];    // 清空房间列表
            this.bedList = [];     // 清空床位列表

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
        async loadRoomList(floorId) {
            try {
                if (!floorId) return;
                // 假设 getRoomList 接口支持传入 floorId
                const res = await getRoomList({ floorId: floorId })
                this.roomList = res || []
            } catch (error) {
                console.error('获取房间列表失败:', error)
            }
        },
        // 获取床位列表
        async loadBedList(roomId) {
            try {
                if (!roomId) return;
                // 假设 getBedList 接口支持传入 roomId
                const res = await getBedList({ roomId: roomId })
                this.bedList = res || []
            } catch (error) {
                console.error('获取床位列表失败:', error)
            }
        },
        submit() {
            if (this.loading) return; // 防止重复点击

            this.loading = true; // 开始加载

            this.$refs.form.validate((valid) => {
                if (valid) {




                    let params = {
                        admission_no: this.admissionNo,
                        to_room_id: this.form.roomId,
                        to_label: this.form.bedId
                    }

                    moveBed(params).then((res) => {
                        this.$message({
                            message: this.$t('dorm.房间变更成功'),
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
                school: '',
                buildingId: '',
                floorId: '',
                roomId: '',
                bedId: '',
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