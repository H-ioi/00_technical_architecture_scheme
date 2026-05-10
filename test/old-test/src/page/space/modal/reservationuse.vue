<template>
  <div>
    <el-dialog
      :title="reservationType == 'look' ? ruleForm.name : '新建使用'"
      :visible.sync="showReservation"
      width="480px"
      :before-close="closeModal"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" v-if="reservationType == 'look'">
            <div class="info">
              <div class="info_label">空间名称</div>
              <div class="info_value">{{ ruleForm.spaceName }}</div>
            </div>
            <div class="info">
              <div class="info_label">使用人</div>
              <div class="info_value">{{ ruleForm.username }}</div>
            </div>
            <div class="info">
              <div class="info_label">联系方式</div>
              <div class="info_value">{{ ruleForm.phone }}</div>
            </div>
            <div class="info">
              <div class="info_label">使用时间</div>
              <div class="info_value">
                {{ ruleForm.startTime + "&nbsp;至&nbsp;" + ruleForm.endTime }}
              </div>
            </div>
            <!-- <div class="info">
              <div class="info_label">结束时间</div>
              <div class="info_value">{{ ruleForm.endTime }}</div>
            </div> -->
          </div>
          <div class="df_center_wrap" v-else>
            <el-form-item label="使用名称" style="width: 100%" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="使用时间" style="width: 100%" prop="time">
              <div class="df_sb">
                <el-form-item prop="startTime" style="margin: 0; width: 48%">
                  <!-- <el-time-select
                    style="width: 100%"
                    v-model="ruleForm.startTime"
                    :picker-options="pickerOptions"
                    placeholder="开始时间"
                  >
                  </el-time-select> -->
                  <el-date-picker
                    style="width: 100%"
                    v-model="ruleForm.startTime"
                    type="datetime"
                    :value-format="'yyyy-MM-dd HH:mm'"
                    :format="'yyyy-MM-dd HH:mm'"
                    placeholder="开始时间"
                  >
                  </el-date-picker>
                </el-form-item>
                <span class="line"></span>
                <el-form-item prop="endTime" style="margin: 0; width: 48%">
                  <!-- <el-time-select
                    style="width: 100%"
                    v-model="ruleForm.endTime"
                    :picker-options="pickerOptions"
                    placeholder="结束时间"
                  >
                  </el-time-select> -->
                  <el-date-picker
                    style="width: 100%"
                    v-model="ruleForm.endTime"
                    type="datetime"
                    :value-format="'yyyy-MM-dd HH:mm'"
                    :format="'yyyy-MM-dd HH:mm'"
                    placeholder="结束时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="使用人" style="width: 100%" prop="username">
              <el-input
                v-model="ruleForm.username"
                placeholder="请输入"
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="使用人电话" style="width: 100%" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入"
                :maxlength="32"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item
            class="modalFromBtn"
            style="margin-top: 20px"
            v-if="reservationType == 'look'"
          >
            <el-button
              v-if="permissions['space_reserve_edit']"
              type="default"
              size="medium"
              @click="editReserve"
              >编辑</el-button
            >
            <el-button
              v-if="permissions['space_reserve_del']"
              type="primary"
              size="medium"
              @click="delReserve"
              >删除</el-button
            >
          </el-form-item>
          <el-form-item class="modalFromBtn" style="margin-top: 20px" v-else>
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="default" size="medium" @click="closeModal"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import {
  addUsageSpace,
  putSpaceUsage,
  delSpaceUsage,
} from "@/api/space/spaceusage.js";
import { deepClone } from "@/util/util.js";
export default {
  name: "PCOrderAddorder",
  props: {
    currentDate: String,
    spaceId: String,
    showReservation: Boolean,
    currentOrderId: Array,
    reservationType: {
      type: String,
      default: "look",
    },
  },
  data() {
    return {
      pickerOptions: {
        start: "06:00",
        step: "00:30",
        end: "24:00",
      },
      ruleForm: {
        name: "",
        startTime: "",
        endTime: "",
        username: "",
        phone: "",
        time: "00:00", //占位，无用字段
      },
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        startTime: [{ required: true, message: "请输入", trigger: "blur" }],
        endTime: [{ required: true, message: "请输入", trigger: "blur" }],
        time: [{ required: true, message: "请输入", trigger: "blur" }],
        username: [{ required: true, message: "请输入", trigger: "blur" }],
        phone: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },

  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userList", "permissions"]),
  },
  methods: {
    // 新增使用
    addUsageSpace(data) {
      addUsageSpace(data).then((res) => {
        if (res.data.success) {
          this.$message.success("新增使用成功");
          this.$emit("refreshData");
          this.closeModal();
        }
      });
    },
    // 编辑使用
    putSpaceUsage(data) {
      putSpaceUsage(data).then((res) => {
        if (res.data.success) {
          this.$message.success("已修改");
          this.$emit("refreshData");
          this.closeModal();
        }
      });
    },
    // 删除使用
    delSpaceUsage(id) {
      delSpaceUsage(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已删除");
          this.$emit("delSpaceUsage", id);
          this.closeModal();
        }
      });
    },
    delReserve() {
      this.$alert("确认删除吗", "删除使用", {
        confirmButtonText: "确定",
      }).then(() => {
        this.delSpaceUsage(this.ruleForm.id);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);
          delete this.ruleForm["list"];
          let data = deepClone(this.ruleForm);
          delete data.time;

          console.log("data", data);

          if (this.reservationType == "add") {
            data["spaceId"] = this.$route.query.id;
            this.addUsageSpace(data);
          } else if (this.reservationType == "edit") {
            this.putSpaceUsage(data);
          }
        } else {
          return false;
        }
      });
    },
    setData(res) {
      if (res.data.success) {
        this.$message.success("已取消");
        this.$emit("refreshData");
        this.closeModal();
      } else {
        this.$message.error("失败");
      }
      this.closeModal();
    },
    editReserve() {
      this.$emit("editReserve");
    },
    closeModal() {
      this.ruleForm = {
        name: "",
        startTime: "",
        endTime: "",
        username: "",
        phone: "",
        time: "00:00", //占位，无用字段
      };
      this.$emit("changeModal", false);
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.line {
  display: inline-block;
  width: 10px;
  height: 1px;
  background: #cccccc;
}
.el-form-item {
  margin-right: 0;
}
.info {
  width: 100%;
  margin-bottom: 20px;
  .info_label {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    margin-bottom: 8px;
    -webkit-background-clip: text;
  }
  .info_value {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    -webkit-background-clip: text;
  }
}
</style>