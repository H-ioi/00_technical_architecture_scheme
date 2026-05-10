<template>
  <div>
    <div class="editFromBox">
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="rules"
        ref="from"
      >
        <el-scrollbar class="formItem">
          <div class="fromTitle">工单基本信息</div>

          <div class="df_center_wrap">
            <el-form-item label="所属校区" prop="school">
              <el-select
                filterable
                v-model="from.school"
                placeholder="请选择"
                disabled
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in dictpermissions['order_school']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请人" prop="contact">
              <el-input
                v-model="from.contact"
                placeholder="请输入"
                :maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="from.email"
                placeholder="请输入"
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input
                v-model="from.phone"
                placeholder="请输入"
                :maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input
                v-model="from.department"
                placeholder="请输入"
                :maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="所需服务类"
              prop="serviceType"
              v-if="from.school"
            >
              <el-select
                filterable
                v-model="from.serviceType"
                placeholder="请选择"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in orderTypeList['order_service_type']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="你在哪个区域需要服务"
              prop="areas"
              v-if="from.school"
            >
              <el-select
                filterable
                :multiple="true"
                v-model="from.areas"
                placeholder="请选择"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in orderTypeList['order_area']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime" style="width: 22%">
              <el-date-picker
                style="width: 100%"
                v-model="from.createTime"
                type="datetime"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              style="width: 60%"
              label="需要服务的具体位置"
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
              style="width: 60%"
              label="请描述服务要求的内容"
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
            <el-form-item style="width: 60%" label="附件">
              <FileListOrder
                ref="filelist"
                :scene="'order_attachment'"
                :isDisabled="false"
              />
            </el-form-item>
            <el-form-item style="width: 60%" label="备注">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                show-word-limit
                v-model="from.remark"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </div>
        </el-scrollbar>
        <el-form-item class="editFromBtn">
          <el-button type="primary" size="medium" @click="submitForm('from')">{{
            this.$route.query.type == "edit" ? "保存" : "提交"
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import FileListOrder from "@/components/common/FileListOrder";
import { addOrderDemand } from "@/api/workorder/order/index.js";
import { getPublikTypeList } from "@/api/publik";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder
  },
  data() {
    var formrulesdata = formrules;
    return {
      from: { serviceType: "", areas: [] },
      rules: {
        contact: [{ required: true, message: "请输入", trigger: "blur" }],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrulesdata["isEmail"], trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入", trigger: "blur" }
          // { validator: formrulesdata["isMobileNumber"], trigger: "blur" },
        ],
        department: [{ required: false, message: "请输入", trigger: "blur" }],
        school: [{ required: true, message: "请选择", trigger: "blur" }],
        serviceType: [{ required: true, message: "请选择", trigger: "blur" }],
        areas: [{ required: true, message: "请选择", trigger: "blur" }],
        location: [{ required: true, message: "请输入", trigger: "blur" }],
        description: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      currentOrderId: "",
      orderTypeList: [],
      schoolData: [],
      isMy: null
    };
  },
  created() {
    this.isMy = this.$route.query.isMy;
    let { username, phone, email, deptId } = this.userInfo;
    this.from = {
      ...this.from,
      contact: username,
      phone,
      email,
      school: this.$route.query.schoolId
    };
    this.getPublikTypeList(this.from.school);
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo", "dictpermissions"])
  },
  methods: {
    addOrder(data) {
      addOrderDemand(data).then(res => {
        if (res.data.success) {
          this.$message.success("新增成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          if (this.isMy) {
            this.$router.push("/order/mylist/index");
          } else {
            this.$router.push("/order/list/index");
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("from", this.from);
          let data = {
            ...this.from
          };
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["fileIds"] = fileIds;
          }
          this.addOrder(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getPublikTypeList(item) {
      this.dictpermissions["order_school"].map(i => {
        if (i.value == item) {
          getPublikTypeList({
            pid: i.id,
            types: ["order_service_type", "order_area", "order_carry_time"]
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
