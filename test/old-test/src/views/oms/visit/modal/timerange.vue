<template>
  <div class="community_page">
    <el-dialog
      title="时间配置"
      :visible.sync="showModal"
      width="500px"
      :before-close="handleClose"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          ref="form"
          :label-position="'top'"
          :model="formData"
          :rules="formRules"
        >
          <div
            class="df_center_wrap"
            style="max-height: 600px; overflow-y: auto"
          >
            <el-form-item
              class="time-picker"
              style="width: 100%"
              label="时间配置"
              prop="timerange"
            >
              <el-time-picker
                style="width: 100%"
                is-range
                v-model="formData.timerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm"
                format="HH:mm"
              >
              </el-time-picker>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { configTimerange } from "@/api/workorder/user/visit.js";
export default {
  data() {
    return {
      showModal: false,
      formData: {},
      formRules: {
        timerange: [{ required: true, message: "请选择时间", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["dictpermissions"]),
  },
  methods: {
    // 提交表单
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = {
            visitTimeBegin: this.formData["timerange"][0],
            visitTimeEnd: this.formData["timerange"][1],
          };
          configTimerange(data).then((res) => {
            console.log("res", res);
            if (res.data.success) {
              this.$message.success("编辑成功");
              this.handleClose();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 打开弹窗
    openModal() {
      this.showModal = true;
    },
    // 关闭弹窗
    handleClose() {
      this.formData = {};
      this.showModal = false;
    },
  },
};
</script>
