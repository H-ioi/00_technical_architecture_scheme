<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <el-button
        type="primary"
        v-if="permissions['order_periodic_plan_edit']"
        size="medium"
        @click="editOrder()"
        >编辑</el-button
      >
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">周期性计划基本信息</div>
        <div class="orderDetail_baseinfo ">
          <div
            class="orderDetail_baseinfo_item"
            v-for="(item, index) in planInfo"
            :key="index"
          >
            <span>
              {{ item["label"] }}
            </span>
            <span :title="checkNull(planData[item['props']])">{{
              checkNull(planData[item["props"]])
            }}</span>
            <!-- <ShowText :label="checkNull(planData[item['props']])" /> -->
          </div>
        </div>
        <div class="orderDetail_item">
          <div class="orderDetail_item_title">工单基本信息</div>
          <div class="orderDetail_baseinfo ">
            <div
              class="orderDetail_infoItem"
              v-for="(item, index) in orderInfo"
              :key="index"
            >
              <div class="infoItemTitle">
                {{ item["label"] }}
              </div>
              <!-- <span :title="checkNull(planData[item['props']])">{{
                checkNull(planData[item["props"]])
              }}</span> -->
              <ShowText :label="checkNull(planData[item['props']])" />
            </div>
            <div class="orderDetail_infoItem">
              <div class="infoItemTitle">附件</div>
              <FileListOrder
                ref="filelist"
                :scene="'order_periodic_plan_attachment'"
                :isDisabled="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOrderPlanDetail } from "@/api/workorder/order/orderplan.js";
import ShowText from "@/components/common/ShowText.vue";
import FileListOrder from "@/components/common/FileListOrder";
import { order } from "@/const/order/index.js";
import orderPlan from "@/const/order/plan.js";
export default {
  name: "PCOrderDetail",
  components: {
    ShowText,
    FileListOrder
  },
  data() {
    return {
      planId: "",
      planData: {},
      orderInfo: {},
      planInfo: [
        {
          label: "名称",
          props: "contact"
        },
        {
          label: "邮箱",
          props: "email"
        },
        {
          label: "手机",
          props: "phone"
        },
        {
          label: "部门",
          props: "department"
        },
        // {
        //   label: "状态",
        //   props: "department"
        // },
        {
          label: "开始时间",
          props: "beginTime"
        },
        {
          label: "结束时间",
          props: "endTime"
        },
        {
          label: "重复周期单位",
          props: "timeUnitLabel"
        },
        {
          label: "重复周期",
          props: "repeatPeriod"
        },
        {
          label: "所属校区",
          props: "schoolName"
        },
        {
          label: "工单类型",
          props: "orderTypeLabel"
        },
        {
          label: "指派人",
          props: "distributeUserName"
        },
        {
          label: "紧急程度",
          props: "urgencyName"
        },
        {
          label: "协作人",
          props: "collaboratorUserNames"
        },
        {
          label: "是否启用",
          props: "statusLabel"
        }
      ],
      carryInfo: [
        {
          label: "您是否征得了物品所有者的同意，可将它们从现有位置移走？",
          props: "isConsent"
        },
        {
          label:
            "如未征得同意，请注明原因。安保员工在未征得物品所有人的同意之前，不得从任何地点搬运任何物品。",
          props: "notConsentReason"
        },
        {
          label:
            "如果已经征得同意，请您写下物品所有者的姓名：（在大多数情况下，物品所有人应为分部校长、部门负责人或校长）",
          props: "owner"
        },
        {
          label: "物品的原始具体位置",
          props: "location"
        },
        {
          label: "意向搬运日期：",
          props: "carryDate"
        },
        {
          label: "意向搬运时间",
          props: "carryTime"
        },
        {
          label:
            "重要的是，需要有一位代表人了解搬运的物品是如何摆放的，即什么东西放在哪里；以及确保有人核实搬运服务是按照您的要求完成的。请问谁将在现场与搬运工作人员协调此类细节？",
          props: "coordinator"
        },
        {
          label: "物品需搬运至何处",
          props: "destination"
        },
        {
          label:
            "请描述需要搬运的物品，尽可能多地提供细节，如颜色、尺寸、重量、数量等，特别是可能需要特殊设备或大量搬运人员的大件或重物",
          props: "description"
        },
        {
          label:
            "如果我们为您提供合适的工具，如手推车和胶带，您是否能够自己或与同事一起搬运物品？",
          props: "isCoordination"
        }
      ],
      serveInfo: [
        {
          label: "所需服务类",
          props: "serviceType"
        },
        {
          label: "你在哪个区域需要服务",
          props: "areas"
        },
        {
          label: "需要服务的具体位置",
          props: "location"
        },
        {
          label: "请描述服务要求的内容",
          props: "description"
        },
        {
          label: "备注",
          props: "remark"
        }
      ],
      inspectInfo: [
        {
          label: "巡检类型",
          props: "inspectType"
        },
        {
          label: "关联空间",
          props: "spaceName"
        },
        {
          label: "关联资产",
          props: "assetName"
        },
        {
          label: "明细信息",
          props: "description"
        }
      ],
      repairInfo: [
        {
          label: "维修类型",
          props: " repairType"
        },
        {
          label: "关联空间",
          props: "spaceName"
        },
        {
          label: "关联资产",
          props: "assetName"
        },
        {
          label: "费用(RMB)",
          props: "cost"
        },
        {
          label: "明细信息",
          props: "description"
        }
      ],
      spotcheckInfo: [
        {
          label: "点检类型",
          props: "spotcheckType"
        },
        {
          label: "关联空间",
          props: "spaceName"
        },
        {
          label: "关联资产",
          props: "assetName"
        },
        {
          label: "明细信息",
          props: "description"
        }
      ],
      upkeepInfo: [
        {
          label: "保养类型",
          props: "upkeepType"
        },
        {
          label: "关联空间",
          props: "spaceName"
        },
        {
          label: "关联资产",
          props: "assetName"
        },
        {
          label: "费用(RMB)",
          props: "cost"
        },
        {
          label: "明细信息",
          props: "description"
        }
      ]
    };
  },

  created() {
    this.planId = this.$route.query.planId;
    this.getOrderPlanDetail();
  },
  mounted() {},
  activated() {},
  computed: {
    ...mapGetters(["dictionary", "userList", "permissions"])
  },
  methods: {
    getOrderPlanDetail() {
      getOrderPlanDetail(this.planId).then(res => {
        if (res.data.success) {
          console.log("res", res);
          let data = res.data.data;
          this.planData = data;
          this.planData = {
            ...this.planData,
            statusLabel: data["status"] == 1 ? "是" : "否",
            orderTypeLabel: this.getDataLabel(
              data["orderType"],
              order["orderType"]
            ),
            urgencyLabel: this.getDataLabel(
              data["urgency"],
              this.dictionary["order_urgency"]
            ),
            timeUnitLabel: this.getDataLabel(
              data["timeUnit"],
              orderPlan["orderPlanType"]
            ),
            distributeUserName: this.getUserName(data["distributeUserId"]),
            collaboratorUserNames: this.getCollaboratorUserName(
              data["collaboratorUserIds"]
            )
          };
          switch (data["orderType"]) {
            case 1:
              this.orderInfo = this.serveInfo;
              this.planData = {
                ...this.planData,
                serviceType: this.getDataLabel(
                  data["serviceType"],
                  this.dictionary["order_service_type"]
                ),
                areas: this.getorderArease(data["orderAreas"])
              };

              break;
            case 2:
              this.orderInfo = this.carryInfo;
              this.planData = {
                ...this.planData,
                isConsent: data["isConsent"] == 1 ? "是" : "否",
                carryTime: this.getDataLabel(
                  data["carryTime"],
                  this.dictionary["order_carry_time"]
                )
              };

              break;
            case 3:
              this.orderInfo = this.inspectInfo;
              this.planData = {
                ...this.planData,
                inspectType: this.getDataLabel(
                  data["inspectType"],
                  this.dictionary["order_inspect_type"]
                )
              };
              break;
            case 4:
              this.orderInfo = this.repairInfo;
              this.planData = {
                ...this.planData,
                repairType: this.getDataLabel(
                  data["repairType"],
                  this.dictionary["order_repair_type"]
                )
              };
              break;
            case 5:
              this.orderInfo = this.spotcheckInfo;
              this.planData = {
                ...this.planData,
                spotcheckType: this.getDataLabel(
                  data["spotcheckType"],
                  this.dictionary["order_spotcheck_type"]
                )
              };
              break;
            case 6:
              this.orderInfo = this.upkeepInfo;
              this.planData = {
                ...this.planData,
                upkeepType: this.getDataLabel(
                  data["upkeepType"],
                  this.dictionary["order_upkeep_type"]
                )
              };
              break;
          }
          this.$nextTick(() => {
            this.$refs["filelist"].filelistobj = [];
            this.$refs["filelist"].filelist = [];
            if (data["files"] !== null) {
              let ids = [];
              data["files"].map(i => {
                ids.push(i.fileId);
                let obj = {
                  outerId: this.planId,
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
          });
          console.log("this.OrderData", this.OrderData);
        }
      });
    },

    checkNull(str) {
      return str == null || str == "" || str == undefined ? "--" : str;
    },
    editOrder() {
      this.$router.push(`/order/plan/edit?type=edit&planId=${this.planId}`);
    },
    getDataLabel(value, data) {
      let str = "";
      data.map(item => {
        if (item.value == value) {
          str = item.label;
        }
      });
      return str;
    },
    getorderArease(arease) {
      console.log("arease", arease);
      let names = [];
      if (arease.length > 0) {
        arease.map(item => {
          names.push(item["label"]);
        });
      }
      return String(names);
    },
    getCollaboratorUserName(ids) {
      let names = [];
      if (ids && ids.length > 0) {
        ids.map(item => {
          names.push(this.getUserName(item));
        });
      }
      return String(names);
    },
    getUserName(id) {
      if (id == null) return null;
      let name = "";
      this.userList.map(i => {
        if (Number(id) == i.value) {
          name = i.label;
        }
      });
      return name;
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
