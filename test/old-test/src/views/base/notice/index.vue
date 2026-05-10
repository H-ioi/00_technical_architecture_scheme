<template>
    <div>
        <div class="f_sb" style="background-color: #fff">
            <div class="schoolBox">
                <div :class="['schoolItem', { currentItem: currentSchoolId == i.value }]" v-for="(i, k) in schoolData"
                    :key="k" @click="changeSchool(i)">
                    {{ i.label }}
                </div>
            </div>
            <div class="treeTable">
                <el-table :data="tableData" style="width: 100%" :header-cell-style="tablestyle.headercellstyle"
                    :row-style="tablestyle.rowstyle">
                    <el-table-column show-overflow-tooltip v-for="(item, index) in tableTitle" :key="index"
                        :prop="item.prop" :label="item.label">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" :width="`${playBtn.length * 80}px`">
                        <template slot-scope="scope" class="df_center">
                            <div class="df_align_center table_textbtn">
                                <el-button v-for="(s, b) in playBtn" :key="b" style="padding: 0"
                                    @click.native.prevent="PlayCurrentItem(s, scope.row)" type="text" size="small">
                                    <span> {{ s }}</span>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background :hide-on-single-page="true" layout=" prev, pager, next,slot" :page-size="10"
                        :current-page="pagination['current']" :total="paginationTotal"
                        @current-change="handleCurrentChange">
                        <!-- <span class="paginationTotal"
                >共有信息<span style="color: #d4ab85">{{ paginationTotal }}</span
                >条</span
              > -->
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="60%" :before-close="closeModal">
            <div class="moadlFromBox">
                <el-form :label-position="'top'" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
                    <div class="df_cs" v-for="(i, k) in bindUserList" :key="k">
                        <el-form-item label="绑定人员" style="width: 30%">
                            <el-select v-model="i.username" placeholder="请选择" style="width: 100%"
                                @change="changeCurrentUser($event, k)">
                                <el-option v-for="(item, key) in userList" :key="key" :label="item.username" :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="绑定邮箱" style="width: 30%">
                            <el-input v-model="i.mailbox"></el-input>
                        </el-form-item>
                        <el-form-item label="" style="margin-top: 30px" class="f_sb">
                            <el-button v-if="bindUserList.length - 1 == k" type="primary" icon="el-icon-plus" circle
                                @click="addUser"></el-button>
                            <el-button type="primary" icon="el-icon-minus" circle @click="delUser(i, k)"></el-button>
                        </el-form-item>
                    </div>
                    <el-form-item class="modalFromBtn">
                        <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
                        <el-button type="defult" size="mini" @click="closeModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import { fetchTypeList } from "@/api/workorder/order/orderlist.js";
import { fetchList } from "@/api/admin/user";
import { getCoticeList, getCoticeDetail, updateCoticeItem } from "@/api/consult/index";
import { tableObj } from "@/const/tabledata/index";
import Modal from "../modal";
export default {
    name: "UniUiIndex",
    components: {
        Modal,
    },
    data() {
        return {
            userList: [],
            bindUserList: [],
            contentType: "order_school",
            currentSchoolId: "",
            currentRow: {},
            tablestyle: tableObj,
            tableTitle: [
                { prop: "name", label: "类型" },
                { prop: "username", label: "绑定人员" },
                { prop: "mailbox", label: "绑定邮箱" },
                { prop: "createTime", label: "创建时间" },
            ],
            tableData: [],
            playBtn: ["编辑"],
            schoolData: [],
            dialogVisible: false,
            ruleForm: {},
            rules: {},
            paginationTotal: 0,
            pagination: {
                current: 1,
                size: 10,
            },
        };
    },
    created() {
        this.fetchList();
        this.fetchtypelist();
    },
    mounted() { },

    methods: {
        fetchList() {
            fetchList({ current: 1, size: 10000 }).then((res) => {
                this.userList = res.data.data.records;
            });
        },
        // 获取学校
        fetchtypelist() {
            fetchTypeList(this.contentType).then((res) => {
                console.log("res.data", res.data);
                this.schoolData = res.data.data;
                this.currentSchoolId = this.schoolData[0].value;
                this.pagination["school"] = this.currentSchoolId;
                this.getCoticeList(this.pagination);
            });
        },
        getCoticeList(data) {
            getCoticeList(data).then((res) => {
                console.log("res.data", res.data);
                let data = res.data.data.records;
                this.paginationTotal = res.data.data.total;
                data.map((item) => {
                    let username = [];
                    let mailbox = [];
                    if (item["users"].length > 0) {
                        item["users"].map((res) => {
                            username.push(res.username);
                            mailbox.push(res.mailbox);
                        });
                    }
                    item["username"] = String(username);
                    item["mailbox"] = String(mailbox);
                });
                this.tableData = data;
            });
        },
        submitForm() {
            if (!this.checkBindUserList()) {
                this.$message.warning("请填写完整绑定人员和绑定邮箱");
            } else {
                let obj = {
                    id: this.currentRow.id,
                    school: this.currentRow.school,
                    users: this.bindUserList,
                };
                console.log("obj", obj);
                this.updateCoticeItem(obj);
            }
        },
        checkBindUserList() {
            let isCheck = true;
            this.bindUserList.map((item) => {
                if (
                    item.username == "" ||
                    !item.username ||
                    item.mailbox == "" ||
                    !item.mailbox
                ) {
                    isCheck = false;
                }
            });
            return isCheck;
        },
        updateCoticeItem(data) {
            updateCoticeItem(data).then((res) => {
                console.log("res", res);
                this.$message.success("保存成功");
                this.getCoticeList(this.pagination);
                this.closeModal();
            });
        },
        PlayCurrentItem(s, row) {
            console.log("666", s, row);
            this.currentRow = row;
            this.bindUserList = [];
            if (row.users.length > 0) {
                this.bindUserList = [...row.users];
            } else {
                this.bindUserList.push({});
            }

            this.dialogVisible = true;
        },
        changeSchool(item) {
            this.currentSchoolId = item.value;
            this.pagination["school"] = this.currentSchoolId;
            this.getCoticeList(this.pagination);
        },
        changeCurrentUser(e, k) {
            console.log("e", e, k);
            let user = this.userList[e];
            this.$set(this.bindUserList, k, {
                ...this.bindUserList[k],
                username: user.username,
                userId: user.userId,
                mailbox: user.email,
                
            });
            console.log("changeCurrentUser", this.bindUserList);
        },
        addUser() {
            this.bindUserList.push({});
        },
        delUser(i, k) {
            this.bindUserList.splice(k, 1);
        },
        handleCurrentChange(val) {
            this.pagination["current"] = val;
            this.getCoticeList(this.pagination);
        },
        closeModal() {
            this.dialogVisible = false;
        },
    },
};
</script>
  
<style lang="scss" scoped>
.schoolBox {
    width: 20%;
    background-color: #fff;
    padding: 20px;

    .schoolItem {
        padding: 10px;
        font-size: 16px;
        cursor: pointer;
        white-space: nowrap;
    }

    .currentItem {
        color: #2c88f5;
        background-color: #f5f7fe;
    }
}

.treeTable {
    background-color: #fff;
    flex: 1;
    padding: 20px;
}

.pagination {
    padding: 20px;
    text-align: right;
    width: 100%;
}
</style>