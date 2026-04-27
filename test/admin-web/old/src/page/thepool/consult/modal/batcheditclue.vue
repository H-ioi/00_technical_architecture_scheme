<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.批量编辑')"
      :visible.sync="showEditClue"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap">
            <el-form-item
              :label="$t('consult.校区')"
              prop="applySchool"
              style="width: 50%"
            >
              <el-select
                style="width: 100%"
                clearable
                v-model="ruleForm.applySchool"
                :placeholder="$t('consult.请选择')"
                @change="changeSchool"
                @clear="clearSchool"
              >
                <el-option
                  v-for="item in pooldictpermissions"
                  :key="item.value"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                  :disabled="!item.status"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="channelList.length > 0"
              :label="$t('consult.渠道')"
              prop="channel"
              style="width: 50%"
            >
              <SelectChannle
                ref="SelectChannle"
                :options="channelList"
                @setChannel="setChannel"
              />
            </el-form-item>
            <!-- <el-form-item
              v-if="followTagsList.length > 0"
              :label="$t('consult.跟进标签')"
              prop="followTags"
              style="width: 50%"
            >
              <el-select
                v-model="ruleForm.followTags"
                :placeholder="$t('consult.请选择')"
                style="width: 100%"
                @change="changeForm"
              >
                <el-option
                  v-for="item in followTagsList"
                  :key="item.value"
                  :disabled="!item.status"
                  :label="i18nlocel == 'en' ? item.enLabel : item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item
              :label="$t('consult.来源')"
              prop="origin"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.origin"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('consult.首次探校时间')"
              prop="schoolTour"
              style="width: 50%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="ruleForm.schoolTour"
                type="date"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('consult.备注')"
              prop="remark"
              style="width: 50%"
            >
              <el-input
                v-model.trim="ruleForm.remark"
                :placeholder="$t('consult.请输入')"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              round
              @click="submitForm('ruleForm')"
              >{{ $t("consult.保存") }}</el-button
            >
            <el-button type="default" size="medium" round @click="closeModal">{{
              $t("consult.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { batchEditClue } from "@/api/consult/index.js";
import { getDictTypeRequired } from "@/api/publik";
import SelectChannle from "@/components/common/pooldictselect/selectchannle.vue";
export default {
  name: "addStudent",
  components: {
    SelectChannle,
  },
  props: {
    showEditClue: Boolean,
    clueIds: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  data() {
    let that = this;
    return {
      ruleForm: {
        applySchool: "",
        channel: null,
        channelChildOne: null,
        origin: "",
        remark: "",
        schoolTour: "",
      },
      rules: {
        applySchool: [
          {
            required: true,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
        channel: [
          {
            required: false,
            message: that.$t("consult.请选择"),
            trigger: "blur",
          },
        ],
      },
      channelList: [],
      dictRequireObj: {
        channel: false,
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      "permissions",
      "dictionary",
      "dictpermissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  methods: {
    batchEditClue() {
      let data = {
        ...this.ruleForm,
        clueIds: this.clueIds,
      };
      if (data["channel"] && data["channel"] != "") {
        data["channel"] = {
          channelId: data["channel"],
          channelName: this.getDataLabel(
            data.applySchool,
            "enquiry_channel",
            data.channel
          ),
        };
      } else {
        data["channel"] = {};
      }
      if (data["channelChildOne"] && data["channelChildOne"] != "") {
        data["channelChildOne"] = {
          channelId: data["channelChildOne"],
          channelName: this.getDataLabel(
            data.applySchool,
            "enquiry_channel_child_one",
            data.channelChildOne
          ),
        };
      } else {
        data["channelChildOne"] = {};
      }
      batchEditClue(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.$emit("initData");
          this.closeModal();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.batchEditClue();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    closeModal() {
      this.ruleForm = {
        applySchool: "",
        channel: null,
        channelChildOne: null,
        origin: "",
        remark: "",
      };
      this.$emit("changeModal", false);
    },
    changeSchool(e, isClear = false) {
      this.pooldictpermissions.map((item) => {
        if (item.value == e) {
          this.channelList = item["child"]["enquiry_channel"]
            ? item["child"]["enquiry_channel"]
            : [];
          this.$nextTick(() => {
            this.setRequireType(item.id, isClear);
            if (this.channelList.length > 0) {
              this.$refs["SelectChannle"].cascaderValue = [];
            }
          });
        }
      });
    },

    async setRequireType(id, isClear) {
      let Obj = await getDictTypeRequired(id);
      this.dictRequireObj = Obj;
      console.log(" this.dictRequireObj", this.dictRequireObj);
      Object.keys(this.rules).forEach((res) => {
        if (Obj[res]) {
          if (isClear) {
            this.ruleForm = {
              ...this.ruleForm,
              channel: null,
              channelChildOne: null,
            };
          }

          this.$set(this.rules[res], 0, {
            ...this.rules[res][0],
            required: Obj[res] == "true",
          });
        }
      });
    },
    clearSchool() {
      this.channelList = [];
      this.ruleForm = {
        ...this.ruleForm,
        channel: null,
        channelChildOne: null,
      };
    },
    setChannel(data) {
      switch (data.length) {
        case 0:
          this.ruleForm["channel"] = null;
          this.ruleForm["channelChildOne"] = null;
          break;
        case 1:
          this.ruleForm["channel"] = data[0];
          this.ruleForm["channelChildOne"] = null;
          break;
        case 2:
          this.ruleForm["channel"] = data[0];
          this.ruleForm["channelChildOne"] = data[1];
          break;
      }
      this.$refs["ruleForm"].validateField("channel");
    },
    getDataLabel(pid, type, cid) {
      let str = "";
      this.pooldictionary.map((item) => {
        if (item.value == pid) {
          if (item["child"][type]) {
            let data = item["child"][type];
            data.map((c) => {
              if (c.value == cid) {
                str = this.i18nlocel == "en" ? c.enLabel : c.label;
              }
            });
          }
        }
      });
      return str;
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
