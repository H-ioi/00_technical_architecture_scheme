<template>
  <div>
    <el-form
      :label-position="'top'"
      :inline="true"
      :model="from"
      :rules="rules"
      ref="from"
    >
      <el-scrollbar class="formItem" style="padding: 20px 0;">
        <div class="fromTitle">搬运工单基本信息</div>
        <div class="df_center_wrap">
          <el-form-item
            style="width: 80%"
            label="您是否征得了物品所有者的同意，可将它们从现有位置移走？"
            prop="isConsent"
          >
            <el-radio-group v-model="from.isConsent" @change="changeIsConsent">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="from.isConsent === 0"
            style="width: 80%"
            label="如未征得同意，请注明原因。安保员工在未征得物品所有人的同意之前，不得从任何地点搬运任何物品。"
            prop="notConsentReason"
          >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.notConsentReason"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="from.isConsent === 1"
            style="width: 100%"
            label="如果已经征得同意，请您写下物品所有者的姓名：（在大多数情况下，物品所有人应为分部校长、部门负责人或校长）"
            prop="owner"
          >
            <el-input
              style="width: 25%"
              v-model="from.owner"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="width: 80%"
            label="物品的原始具体位置"
            prop="location"
          >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.location"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="width: 100%"
            label="意向搬运日期："
            prop="carryDate"
          >
            <el-date-picker
              style="width: 25%"
              v-model="from.carryDate"
              type="date"
              placeholder="选择日期"
              :value-format="'yyyy-MM-dd'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="意向搬运时间"
            style="width: 100%"
            prop="carryTime"
          >
            <el-select
              style="width: 25%"
              v-model="from.carryTime"
              placeholder="请选择"
              prop="carryTime"
            >
              <el-option
                :key="k"
                v-for="(i, k) in orderTypeList['order_carry_time']"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="width: 100%"
            label="重要的是，需要有一位代表人了解搬运的物品是如何摆放的，即什么东西放在哪里；以及确保有人核实搬运服务是按照您的要求完成的。请问谁将在现场与搬运工作人员协调此类细节？"
            prop="coordinator"
          >
            <el-input
              style="width: 25%"
              v-model="from.coordinator"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item
            style="width: 80%"
            label="物品需搬运至何处"
            prop="destination"
          >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.destination"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item
            style="width: 80%"
            label="请描述需要搬运的物品，尽可能多地提供细节，如颜色、尺寸、重量、数量等，特别是可能需要特殊设备或大量搬运人员的大件或重物:"
            prop="description"
          >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="from.description"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="width: 80%"
            label="如果我们为您提供合适的工具，如手推车和胶带，您是否能够自己或与同事一起搬运物品？"
            prop="isCoordination"
          >
            <el-radio-group v-model="from.isCoordination">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width: 60%" label="附件">
            <FileListOrder
              ref="filelist"
              :scene="'order_periodic_plan_attachment'"
              :isDisabled="false"
            />
          </el-form-item>
        </div>
      </el-scrollbar>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import FileListOrder from "@/components/common/FileListOrder";
import { getPublikTypeList } from "@/api/publik";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder
  },
  props: {
    schoolId: {
      default: "",
      type: String,
      require: true
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() + 24 * 3600 * 7 * 1000;
        }
      },
      from: { carryTime: "", notConsentReason: "", owner: "" },
      rules: {
        isConsent: [{ required: true, message: "请选择", trigger: "blur" }],
        location: [{ required: true, message: "请输入", trigger: "blur" }],
        notConsentReason: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        owner: [{ required: true, message: "请输入", trigger: "blur" }],
        carryDate: [{ required: true, message: "请选择", trigger: "blur" }],
        carryTime: [{ required: true, message: "请选择", trigger: "blur" }],
        coordinator: [{ required: true, message: "请输入", trigger: "blur" }],
        destination: [{ required: true, message: "请输入", trigger: "blur" }],
        isCoordination: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      orderTypeList: []
    };
  },
  created() {
    this.getPublikTypeList(this.schoolId);
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo", "dictpermissions"])
  },
  methods: {
    setData(data, outerId, files) {
      console.log("setData", data, files);
      this.from = {
        ...this.from,
        ...data
      };
      this.$refs["filelist"].filelistobj = [];
      this.$refs["filelist"].filelist = [];
      if (files !== null) {
        let ids = [];
        files.map(i => {
          ids.push(i.fileId);
          let obj = {
            outerId: outerId,
            scene: "order_periodic_plan_attachment"
          };
          let fileObj = {
            id: i.fileId,
            type: i.contentType,
            file: "",
            name: i.originalName
          };
          this.$refs["filelist"].filelist = ids;
          this.$refs["filelist"].filelistobj.push(fileObj);
          this.$refs["filelist"].getFile(i.fileId, obj);
        });
      }
    },
    submitForm() {
      this.$refs["from"].validate(valid => {
        if (valid) {
          console.log("from", this.from);
          let data = {
            ...this.from
          };
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["fileIds"] = fileIds;
          }
          this.$emit("setFormData", {
            type: true,
            data
          });
        } else {
          console.log("error submit!!");
          this.$emit("setFormData", {
            type: false,
            data: {}
          });
          return false;
        }
      });
    },
    changeIsConsent(value) {
      console.log("value", value);
      this.from.notConsentReason = "";
      this.from.owner = "";
    },
    getPublikTypeList(item) {
      this.dictpermissions["order_school"].map(dict => {
        if (dict.value == item) {
          getPublikTypeList({
            pid: dict.id,
            types: ["order_carry_time"]
          }).then(res => {
            console.log("11111res", res);
            let dataDictValues = this.userInfo["dataDictValues"];
            this.orderTypeList = res.data.data;
            Object.keys(this.orderTypeList).forEach(res => {
              this.orderTypeList[res] = this.orderTypeList[res].filter(i => {
                return (
                  dataDictValues[res].includes(i.value) &&
                  i.status &&
                  !i.archived
                );
              });
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
