<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="500px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" style="max-height: 600px; overflow-y: auto">
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="schoolIds"
              style="width: 100%"
              v-if="schoolSelectList.length > 1"
            >
              <el-select
                clearable
                collapse-tags
                style="width: 100%"
                v-model="ruleForm['schoolIds']"
                :placeholder="$t('common.请选择')"
                multiple
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in schoolSelectList"
                  :label="schoolDropdownLabel(i)"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.中文名')"
              prop="cnName"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文名')"
              prop="enName"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.enName"
                :placeholder="$t('consult.请输入')"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn" v-if="modalType != 'look'">
            <el-button type="primary" size="medium" @click="submitForm('ruleForm')">{{
              $t("isagroup.确认")
            }}</el-button>
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getStationDetail, addStation, editStation } from "@/api/isacommunity/station.js";
import schoolListBuscommonMixin from "@/mixins/schoolListBuscommon.js";
export default {
  name: "operation",
  mixins: [schoolListBuscommonMixin],
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {},
      rules: {
        schoolIds: [
          { required: true, message: that.$t("isagroup.请选择"), trigger: "blur" },
        ],
        cnName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
        enName: [
          { required: true, message: that.$t("isagroup.请输入"), trigger: "blur" },
        ],
      },
      schoolList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    // 打开
    async showForm(type = "add", item = {}) {
      await this.fetchSchoolListBuscommon();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        // this.getDettail(item.id);
        this.$nextTick(() => {
          this.ruleForm = {
            id: item.id,
            schoolIds: item.schoolIds,
            cnName: item.cnName,
            enName: item.enName,
          };
          console.log(" this.ruleForm", this.ruleForm);
        });
      } else {
        if (this.schoolSelectList.length === 1) {
          let schoolId = this.schoolSelectList[0].id;
          this.ruleForm = {
            ...this.ruleForm,
            schoolIds: schoolId,
          };
        }
      }
    },
    // 新增
    addData(data) {
      addStation(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    // 编辑
    editData(data) {
      editStation(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.$emit("getList");
          this.closeModal();
        }
      });
    },
    getDettail(id) {
      getStationDetail(id).then((res) => {
        if (res.data.success) {
        }
      });
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            schoolIds: this.ruleForm.schoolIds,
            cnName: this.ruleForm.cnName,
            enName: this.ruleForm.enName,
          };
          if (this.modalType == "add") {
            this.addData(data);
          } else {
            data["id"] = this.ruleForm.id;
            this.editData(data);
          }
        }
      });
    },
    // 关闭
    closeModal() {
      this.showModal = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
