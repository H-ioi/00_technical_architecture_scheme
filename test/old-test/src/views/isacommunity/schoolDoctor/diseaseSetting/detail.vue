<template>
  <el-drawer :title="drawerTitle" :visible.sync="showDialog" size="600px" :before-close="closeModal"
    class="drawer-body">
    <div class="drawer-content" v-if="showDialog" v-loading="detailLoading">
      <el-form class="drawer-form" :label-position="'top'" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('schoolDoctor.中文名称')" prop="cnName">
          <el-input v-model="ruleForm.cnName" :placeholder="$t('schoolDoctor.请输入中文名称')" :disabled="modalType === 'look'" />
        </el-form-item>
        <el-form-item :label="$t('schoolDoctor.英文名称')" prop="enName">
          <el-input v-model="ruleForm.enName" :placeholder="$t('schoolDoctor.请输入英文名称')" :disabled="modalType === 'look'" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.类型')" prop="type">
              <el-select v-model="ruleForm.type" style="width: 100%" :placeholder="$t('schoolDoctor.请选择类型')" clearable
                :disabled="modalType === 'look'">
                <el-option :label="$t('schoolDoctor.疾病')" :value="1" />
                <el-option :label="$t('schoolDoctor.症状')" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('schoolDoctor.状态')" prop="status">
              <el-select v-model="ruleForm.status" style="width: 100%" :placeholder="$t('schoolDoctor.请选择状态')" clearable
                :disabled="modalType === 'look'">
                <el-option :label="$t('schoolDoctor.启用')" :value="1" />
                <el-option :label="$t('schoolDoctor.禁用')" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('schoolDoctor.备注')" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="3" :placeholder="$t('schoolDoctor.请输入备注')"
            :disabled="modalType === 'look'" />
        </el-form-item>
      </el-form>

      <div class="drawer-footer" v-if="modalType !== 'look'">
        <el-button @click="closeModal">{{ $t('btn.取消') }}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="isSubmitting">{{ $t('schoolDoctor.确认') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  addDiseaseSetting,
  editDiseaseSetting,
  getDiseaseSettingDetail,
} from "@/api/isacommunity/diseaseSetting";
export default {
  name: "DiseaseSettingDetail",
  components: {},
  props: {
    title: { type: String, default: "" },
  },
  data() {
    return {
      modalType: "look",
      showDialog: false,
      detailLoading: false,
      ruleForm: {
        id: undefined,
        cnName: "",
        enName: "",
        type: undefined,
        status: 1,
        remark: "",
      },
      rules: {},
      isSubmitting: false,
    };
  },
  created() {
    this.rules = this.initRules();
  },
  computed: {
    drawerTitle() {
      const typeMap = {
        add: this.$t("schoolDoctor.新增疾病设置"),
        edit: this.$t("schoolDoctor.编辑疾病设置"),
        look: this.$t("schoolDoctor.疾病设置详情"),
      };
      return typeMap[this.modalType] || this.title || this.$t("schoolDoctor.详情");
    },
  },
  methods: {
    initRules() {
      return {
        cnName: [{ required: true, message: this.$t("schoolDoctor.请输入中文名称"), trigger: "blur" }],
        enName: [{ required: true, message: this.$t("schoolDoctor.请输入英文名称"), trigger: "blur" }],
        type: [{ required: true, message: this.$t("schoolDoctor.请选择类型"), trigger: "change" }],
        status: [{ required: true, message: this.$t("schoolDoctor.请选择状态"), trigger: "change" }],
      };
    },

    async showModal(type = "add", item = {}) {
      this.modalType = type;
      this.showDialog = true;
      const tasks = [];
      if (type !== "add") {
        tasks.push(() => this.getDetail(item.id));
      } else {
        this.ruleForm = {
          id: undefined,
          cnName: "",
          enName: "",
          type: undefined,
          status: 1,
          remark: "",
        };
      }
      this.detailLoading = true;
      try {
        for (let i = 0; i < tasks.length; i++) {
          await tasks[i]();
        }
      } finally {
        this.detailLoading = false;
      }
    },

    getDetail(id) {
      return getDiseaseSettingDetail(id).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            this.ruleForm = {
              ...this.ruleForm,
              ...res.data.data,
              id,
            };
          });
        }
      });
    },

    submitForm(formName) {
      if (this.isSubmitting) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSubmitting = true;
          let data = { ...this.ruleForm };
          if (this.modalType === "add") {
            this.addData(data);
          } else {
            this.editData(data);
          }
        }
      });
    },

    addData(data) {
      addDiseaseSetting(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("schoolDoctor.新增成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    editData(data) {
      editDiseaseSetting(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("schoolDoctor.编辑成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    closeModal() {
      this.$refs.ruleForm.resetFields();
      this.showDialog = false;
      this.ruleForm = {
        id: undefined,
        cnName: "",
        enName: "",
        type: undefined,
        status: 1,
        remark: "",
      };
      this.isSubmitting = false;
      this.detailLoading = false;
    },
  },
};
</script>
