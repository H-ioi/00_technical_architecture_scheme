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
          <div class="fromTitle">周期性计划基本信息</div>
          <div class="df_center_wrap">
            <el-form-item label="名称" prop="contact">
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
            <el-form-item label="开始时间" prop="beginTime" style="width: 22%">
              <el-date-picker
                style="width: 100%"
                v-model="from.beginTime"
                type="datetime"
                placeholder="选择时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="beginTimeOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime" style="width: 22%">
              <el-date-picker
                style="width: 100%"
                v-model="from.endTime"
                type="datetime"
                placeholder="选择时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="endTimeOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="重复周期单位" prop="timeUnit">
              <el-select
                filterable
                v-model="from.timeUnit"
                placeholder="请选择"
                @change="changeTimeUnit"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in orderPlan['orderPlanType']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="重复周期" prop="repeatPeriod">
              <el-input-number
                style="width: 100%;"
                placeholder="请输入"
                v-model="from.repeatPeriod"
                :min="1"
                :max="repeatPeriodMax"
                :step="1"
                :precision="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="所属校区" prop="school">
              <el-select
                disabled
                v-model="from.school"
                placeholder="请选择"
                @change="changeSchool"
              >
                <el-option
                  v-for="(i, k) in dictpermissions['order_school']"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工单类型" prop="orderType">
              <el-select
                filterable
                v-model="from.orderType"
                placeholder="请选择"
                @change="changeOrderType"
              >
                <el-option
                  v-for="item in orderTypeList"
                  :key="item.orderType"
                  :label="item.label"
                  :value="item.orderType"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="指派人" prop="distributeUserId">
              <UserTree
                ref="usertree"
                size="small"
                @setuser="setDistributeUser"
                :options="[]"
                :isDisabled="false"
              ></UserTree>
            </el-form-item> -->
            <el-form-item label="指派人" prop="distributeUserId">
              <el-select
                filterable
                clearable
                v-model="from.distributeUserId"
                placeholder="请选择"
                @clear="clearDistributeUser"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in userList"
                  :label="i.label"
                  :value="String(i.value)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="from.distributeUserId"
              label="紧急程度"
              prop="urgency"
            >
              <el-select filterable v-model="from.urgency" placeholder="请选择">
                <el-option
                  :key="k"
                  v-for="(i, k) in dictionary['order_urgency']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="from.distributeUserId"
              label="协作人"
              prop="collaboratorUserIds"
            >
              <UserTree
                ref="usertree"
                size="small"
                @setuser="setCollaboratorUser"
                :options="[]"
                :isDisabled="false"
              ></UserTree>
            </el-form-item>
            <el-form-item label="是否启用" prop="status">
              <el-select filterable v-model="from.status" placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 服务工单 -->
          <Service
            v-if="from['orderType'] == 1"
            ref="Service"
            @setFormData="setFormData"
            :schoolId="from['school']"
          />
          <!-- 搬运工单 -->
          <Carry
            ref="Carry"
            v-if="from['orderType'] == 2"
            @setFormData="setFormData"
            :schoolId="from['school']"
          />
          <!-- 巡检工单 -->
          <Inspect
            ref="Inspect"
            v-if="from['orderType'] == 3"
            @setFormData="setFormData"
            :schoolId="from['school']"
          />
          <!-- 维修工单 -->
          <Repair
            ref="Repair"
            v-if="from['orderType'] == 4"
            @setFormData="setFormData"
            :schoolId="from['school']"
          />
          <!-- 点检工单 -->
          <Spotcheck
            ref="Spotcheck"
            v-if="from['orderType'] == 5"
            @setFormData="setFormData"
            :schoolId="from['school']"
          />
          <!-- 保养工单 -->
          <Upkeep
            ref="Upkeep"
            v-if="from['orderType'] == 6"
            @setFormData="setFormData"
            :schoolId="from['school']"
          />
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
import {
  addOrderPlan,
  editOrderPlan,
  getOrderPlanDetail
} from "@/api/workorder/order/orderplan.js";
import { formrules } from "@/util/form.js";
import {
  getOrderTypeList,
  getSchoolOrderType
} from "@/api/workorder/order/ordertype.js";
import { getPublikTypeList } from "@/api/publik";
import { order } from "@/const/order/index.js";
import orderPlan from "@/const/order/plan.js";
import FileListOrder from "@/components/common/FileListOrder";
import UserTree from "@/components/commonConpents/UserTree";
import Carry from "./ordertype/carry.vue";
import Service from "./ordertype/service.vue";
import Inspect from "./ordertype/inspect.vue";
import Spotcheck from "./ordertype/spotcheck.vue";
import Upkeep from "./ordertype/upkeep.vue";
import Repair from "./ordertype/repair.vue";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder,
    UserTree,
    Carry,
    Service,
    Inspect,
    Spotcheck,
    Upkeep,
    Repair
  },
  data() {
    var formrulesdata = formrules;
    return {
      orderPlan: orderPlan,
      beginTimeOptions: {
        disabledDate: time => {
          let disabledDates = [29, 30, 31];
          let day = time.getDate();
          // console.log("disabledDate", time.getDate());
          return disabledDates.includes(day)
            ? true
            : time.getTime() < Date.now();
        }
      },
      endTimeOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now();
        }
      },
      repeatPeriodMax: 1,
      from: {
        contact: "",
        email: "",
        phone: "",
        department: "",
        beginTime: "",
        endTime: "",
        timeUnit: "",
        repeatPeriod: "",
        school: "",
        orderType: "",
        distributeUserId: "",
        collaboratorUserIds: [],
        status: ""
      },
      rules: {
        contact: [{ required: true, message: "请输入", trigger: "blur" }],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrulesdata["isEmail"], trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入", trigger: "blur" }],
        department: [{ required: false, message: "请输入", trigger: "blur" }],
        beginTime: [{ required: true, message: "请选择", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择", trigger: "blur" }],
        timeUnit: [{ required: true, message: "请选择", trigger: "blur" }],
        repeatPeriod: [{ required: true, message: "请输入", trigger: "blur" }],
        school: [{ required: true, message: "请选择", trigger: "blur" }],
        orderType: [{ required: true, message: "请选择", trigger: "blur" }],
        status: [{ required: true, message: "请选择", trigger: "blur" }],
        distributeUserId: [
          { required: false, message: "请选择", trigger: "blur" }
        ],
        collaboratorUserIds: [
          { required: false, message: "请选择", trigger: "blur" }
        ]
      },
      orderTypeAll: [],
      orderTypeList: [],
      routeQuery: {},
      schoolId: ""
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo", "dictpermissions", "userList"])
  },
  methods: {
    initData() {
      this.routeQuery = this.$route.query;
     
      switch (this.routeQuery["type"]) {
        case "add":
          this.schoolId = this.routeQuery["school"];
          let { username, phone, email, deptId } = this.userInfo;
          this.from = {
            ...this.from,
            contact: username,
            phone,
            email,
            school: this.routeQuery["school"]
          };
          this.getOrderTypeList();
          break;
        case "edit":
          this.getOrderPlanDetail();
          break;
      }
    },
    addPlan(data) {
      addOrderPlan(data).then(res => {
        if (res.data.success) {
          this.$message.success("新增成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.push("/order/periodic/plan/index");
        }
      });
    },
    editPlan(data) {
      editOrderPlan(data).then(res => {
        if (res.data.success) {
          this.$message.success("修改成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.push("/order/periodic/plan/index");
        }
      });
    },
    getOrderPlanDetail() {
      getOrderPlanDetail(this.routeQuery["planId"]).then(res => {
        if (res.data.success) {
          console.log("getOrderPlanDetail", res.data);
          let data = res.data.data;
          this.from = {
            ...this.from,
            id: data["id"],
            contact: data["contact"],
            email: data["email"],
            phone: data["phone"],
            department: data["department"],
            beginTime: data["beginTime"],
            endTime: data["endTime"],
            timeUnit: data["timeUnit"],
            repeatPeriod: data["repeatPeriod"],
            school: data["school"],
            orderType: data["orderType"],
            status: data["status"],
            distributeUserId: data["distributeUserId"],
            collaboratorUserIds: data["collaboratorUserIds"],
            urgency: data["urgency"]
          };
          console.log("this.from", this.from);
          this.schoolId = data["school"];
          this.getOrderTypeList();
          // this.getSchoolOrderType(data["school"]);
          this.$nextTick(() => {
            switch (data["orderType"]) {
              case 1:
                this.$refs["Service"].setData(
                  {
                    serviceType: data["serviceType"],
                    areas: data["areas"],
                    location: data["location"],
                    description: data["description"],
                    remark: data["remark"]
                  },
                  data["id"],
                  data["files"]
                );
                break;
              case 2:
                this.$refs["Carry"].setData(
                  {
                    isConsent: data["isConsent"],
                    location: data["location"],
                    notConsentReason: data["notConsentReason"],
                    owner: data["owner"],
                    carryDate: data["carryDate"],
                    carryTime: data["carryTime"],
                    coordinator: data["coordinator"],
                    destination: data["destination"],
                    description: data["description"],
                    isCoordination: data["isCoordination"],
                    remark: data["remark"]
                  },
                  data["id"],
                  data["files"]
                );
                break;
              case 3:
                this.$refs["Inspect"].setData(
                  {
                    inspectType: data["inspectType"],
                    assetId: data["assetId"],
                    spaceId: data["spaceId"],
                    spaceName: data["spaceName"],
                    assetName: data["assetName"],
                    description: data["description"]
                  },
                  data["id"],
                  data["files"]
                );
                break;
              case 4:
                this.$refs["Repair"].setData(
                  {
                    repairType: data["repairType"],
                    cost: data["cost"],
                    assetId: data["assetId"],
                    spaceId: data["spaceId"],
                    spaceName: data["spaceName"],
                    assetName: data["assetName"],
                    description: data["description"]
                  },
                  data["id"],
                  data["files"]
                );
                break;
              case 5:
                this.$refs["Spotcheck"].setData(
                  {
                    spotcheckType: data["spotcheckType"],
                    assetId: data["assetId"],
                    spaceId: data["spaceId"],
                    spaceName: data["spaceName"],
                    assetName: data["assetName"],
                    description: data["description"]
                  },
                  data["id"],
                  data["files"]
                );
                break;
              case 6:
                this.$refs["Upkeep"].setData(
                  {
                    upkeepType: data["upkeepType"],
                    cost: data["cost"],
                    assetId: data["assetId"],
                    spaceId: data["spaceId"],
                    spaceName: data["spaceName"],
                    assetName: data["assetName"],
                    description: data["description"]
                  },
                  data["id"],
                  data["files"]
                );
                break;
            }
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("from", this.from);
          switch (this.from["orderType"]) {
            case 1:
              this.$refs["Service"].submitForm();
              break;
            case 2:
              this.$refs["Carry"].submitForm();
              break;
            case 3:
              this.$refs["Inspect"].submitForm();
              break;
            case 4:
              this.$refs["Repair"].submitForm();
              break;
            case 5:
              this.$refs["Spotcheck"].submitForm();
              break;
            case 6:
              this.$refs["Upkeep"].submitForm();
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setFormData(data) {
      console.log("setFormData", data);
      if (data["type"]) {
        console.log(11111111111);
        let newForm = {
          ...this.from,
          ...data.data
        };
        if (this.routeQuery["type"] == "add") {
          this.addPlan(newForm);
        }
        if (this.routeQuery["type"] == "edit") {
          this.editPlan(newForm);
        }
      }
    },
    // 获取全部工单类型
    getOrderTypeList() {
      getOrderTypeList().then(res => {
        console.log("res", res);
        if (res.data.success) {
          this.orderTypeAll = res.data.data;
          this.orderTypeAll.map(item => {
            order["orderType"].map(type => {
              if (item["orderType"] == type["value"]) {
                item["label"] = type["label"];
              }
            });
          });
          this.getSchoolOrderType(this.schoolId);
        }
      });
    },
    // 获取学校关联的工单类型
    getSchoolOrderType(schoolId) {
      this.orderTypeList = [];
      getSchoolOrderType(schoolId).then(res => {
        if (res.data.success) {
          let list = res.data.data;
          this.$nextTick(() => {
            this.orderTypeList = this.orderTypeAll.filter(item => {
              return (
                list.includes(Number(item["orderType"])) &&
                item["status"] &&
                schoolId == item["school"] &&
                item["orderType"] != 2
              );
            });
          });

          console.log("this.orderTypeList", this.orderTypeList);
        } else {
          this.orderTypeList = [];
        }
      });
    },
    // 设置分发人
    setDistributeUser(data) {
      console.log("setDistributeUser", data);
      // this.from["distributeUserId"] = data;
    },
    // 设置协作人
    setCollaboratorUser(data) {
      console.log("setCollaboratorUser", data);
      this.from["collaboratorUserIds"] = data;
    },
    // 选择校区
    changeSchool(e) {
      this.from["school"] = e;
      this.from["orderType"] = "";
      this.getSchoolOrderType(e);
    },
    // 选择工单类型
    changeOrderType(e) {
      this.from["orderType"] = e;
    },
    // 选择周期类型
    changeTimeUnit(e) {
      console.log("changeTimeUnit", e);
      this.from.repeatPeriod = 1;
      orderPlan["orderPlanType"].map(item => {
        if (item["value"] == e) {
          this.repeatPeriodMax = item["max"];
        }
      });
    },
    clearDistributeUser() {
      this.from["distributeUserId"] = "";
      this.from["urgency"] = "";
      this.from["collaboratorUserIds"] = [];
    }
  }
};
</script>

<style lang="scss" scoped></style>
