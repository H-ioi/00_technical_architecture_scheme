<template>
  <div class="orderDetail">
    <div class="orderDetail_btn" v-if="currentOrderStatus == '1'">
      <el-button
        v-if="isMy ? true : permissions['order_carry_edit']"
        type="primary"
        size="medium"
        @click="editOrder('edit')"
        >编辑</el-button
      >
      <el-button
        v-if="isMy ? true : permissions['order_distribute']"
        type="primary"
        size="medium"
        @click="showDistribute = true"
        >派单</el-button
      >
      <el-button
        v-if="isMy ? true : permissions['order_cancel']"
        type="defult"
        size="medium"
        @click="showCancel = true"
        >取消</el-button
      >
    </div>
    <div class="orderDetail_btn" v-if="currentOrderStatus == '2'">
      <el-button
        v-if="isMy ? hasMyAuthority : permissions['order_carry_edit']"
        type="primary"
        size="medium"
        @click="editOrder('edit')"
        >编辑</el-button
      >
      <el-button
        v-if="isMy ? hasMyAuthority : permissions['order_distribute']"
        type="primary"
        size="medium"
        @click="showDistribute = true"
        >派单</el-button
      >
      <el-button
        v-if="isMy ? hasMyAuthority : permissions['order_complete']"
        type="primary"
        size="medium"
        @click="(showSupply = true), (modalType = 'complete')"
        >完单</el-button
      >

      <el-button
        v-if="isMy ? true : permissions['order_supply']"
        type="primary"
        size="medium"
        @click="(showSupply = true), (modalType = 'supply')"
        >补充</el-button
      >
      <el-button
        v-if="isMy ? hasMyAuthority : permissions['order_collaborators']"
        type="primary"
        size="medium"
        @click="editCollaborators"
        >协作人</el-button
      >
      <el-button
        v-if="isMy ? hasMyAuthority : permissions['order_cancel']"
        type="defult"
        size="medium"
        @click="showCancel = true"
        >取消</el-button
      >
    </div>
    <div class="orderDetail_btn" v-if="currentOrderStatus == '5'">
      <el-button
        v-if="isMy ? hasMyAuthority : permissions['order_appraise']"
        type="primary"
        size="medium"
        @click="showAppraise = true"
        >评价</el-button
      >
      <el-button
        v-if="isMy ? true : permissions['order_supply']"
        type="primary"
        size="medium"
        @click="(showSupply = true), (modalType = 'supply')"
        >补充</el-button
      >
      <el-button type="defult" size="medium" @click="backOrderList"
        >返回</el-button
      >
    </div>
    <div class="orderDetail_btn" v-if="currentOrderStatus == '6'">
      <el-button type="defult" size="medium" @click="backOrderList"
        >返回</el-button
      >
    </div>
    <div class="orderDetail_btn" v-if="currentOrderStatus == '10'">
      <el-button type="defult" size="medium" @click="backOrderList"
        >返回</el-button
      >
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item" v-if="currentOrderStatus != '1'">
        <div class="orderDetail_item_title">工单处理信息</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>处理状态</span>
            <span
              :title="order['orderStatus'][currentOrderStatus]"
              style="color: #175e67"
              >{{ order["orderStatus"][currentOrderStatus] }}</span
            >
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>催单次数</span>
            <span :style="`color:${OrderData['urgeNums'] > 0 ? 'red' : ''}`">{{
              checkNull(OrderData["urgeNums"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>处理人</span>
            <span :title="checkNull(OrderData['distributeUsername'])">{{
              checkNull(OrderData["distributeUsername"])
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>派单时间</span>
            <span :title="checkNull(OrderData['distributeTime'])">{{
              checkNull(OrderData["distributeTime"])
            }}</span>
          </div>
          <div
            class="orderDetail_baseinfo_item"
            v-if="currentOrderStatus == '5' || currentOrderStatus == '6'"
          >
            <span>完单时间</span>
            <span :title="checkNull(OrderData['completeTime'])">{{
              checkNull(OrderData["completeTime"])
            }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item" v-if="currentOrderStatus == 6">
        <div class="orderDetail_item_title df_sb">
          <span>评价信息</span>
          <div v-if="isMy ? hasMyAuthority : permissions['order_appraise']">
            <el-button
              v-if="currentOrderStatus == 5 ? true : !changeAppraise"
              type="primary"
              size="mini"
              @click="appraiseOrder"
              >保存评价</el-button
            >
            <el-button
              v-else
              type="primary"
              size="mini"
              @click="changeAppraise = false"
              >修改评价</el-button
            >
          </div>
        </div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">评价</div>
            <el-rate
              v-model="orderAppraise.star"
              show-text
              :texts="rateTexts"
              :void-color="'#C6D1DE'"
              :text-color="'#175E67'"
              :colors="['#175E67', '#175E67', '#175E67']"
              :disabled="changeAppraise && currentOrderStatus == 6"
              void-icon-class="el-icon-star-on"
            >
            </el-rate>
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">备注</div>
            <ShowText
              v-if="changeAppraise && currentOrderStatus == 6"
              :label="orderAppraise.content"
            />
            <el-input
              v-else
              type="textarea"
              :rows="5"
              :maxlength="300"
              show-word-limit
              v-model="orderAppraise.content"
              placeholder="请输入"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">申请人信息</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>申请人</span>
            <span :title="OrderData['contact']">{{
              OrderData["contact"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>邮箱</span>
            <span :title="OrderData['email']">{{ OrderData["email"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>手机号</span>
            <span :title="OrderData['phone']">{{ OrderData["phone"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>部门</span>
            <span :title="OrderData['department']">{{
              OrderData["department"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>所属校区</span>
            <span :title="OrderData['schoolName']">{{
              OrderData["schoolName"]
            }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">工单基本信息</div>
        <div class="orderDetail_baseinfo baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>紧急程度</span>
            <span :title="OrderData['urgencyName']">{{
              OrderData["urgencyName"]
            }}</span>
          </div>

          <div class="orderDetail_baseinfo_item">
            <span>创建时间</span>
            <span :title="OrderData['createTime']">{{
              OrderData["createTime"]
            }}</span>
          </div>

          <div class="orderDetail_baseinfo_item">
            <span>是否征得同意</span>
            <span>{{ OrderData["isConsent"] ? "是" : "否" }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>物品所有者</span>
            <span :title="OrderData['owner']">{{ OrderData["owner"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>协调人员</span>
            <span :title="OrderData['owner']">{{
              OrderData["coordinator"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>搬运日期</span>
            <span :title="OrderData['carryDate']">{{
              OrderData["carryDate"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>搬运时间</span>
            <span :title="OrderData['carryTimeName']">{{
              OrderData["carryTimeName"]
            }}</span>
          </div>

          <div class="orderDetail_baseinfo_item">
            <span>是否协助搬运</span>
            <span>{{ OrderData["isCoordination"] ? "是" : "否" }}</span>
          </div>
          <div class="orderDetail_infoItem" v-if="currentOrderStatus != '1'">
            <div class="infoItemTitle">协作人</div>
            <ShowText :label="collaborators" />
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">不同意原因</div>
            <ShowText :label="OrderData['notConsentReason']" />
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">物品位置</div>
            <ShowText :label="OrderData['location']" />
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">搬运位置</div>
            <ShowText :label="OrderData['destination']" />
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">物品细节</div>
            <ShowText :label="OrderData['description']" />
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">附件</div>
            <FileListOrder
              ref="filelist"
              :scene="'order_attachment'"
              :isDisabled="true"
            />
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title" style="margin-bottom: 20px">
          工单流程
        </div>
        <div class="orderDetail_baseinfo">
          <el-steps
            class="orderSteps"
            direction="vertical"
            :active="orderLogs.length"
          >
            <el-step v-for="(i, k) in orderLogs" :key="k" :title="i.title">
              <template slot="description">
                <ShowText
                  v-if="i.details !== null && i.details !== ''"
                  :label="i.details"
                />
                <div class="time">{{ i.createTime }}</div>
              </template></el-step
            >
          </el-steps>
        </div>
      </div>
    </div>
    <Distribute
      v-if="showDistribute"
      :currentOrderId="[currentOrderId]"
      :showAdd="showDistribute"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Cancel
      :currentOrderId="[currentOrderId]"
      :showCancel="showCancel"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Supply
      :currentOrderId="currentOrderId"
      :showSupply="showSupply"
      :title="modalType"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Appraise
      :currentOrderId="currentOrderId"
      :showAppraise="showAppraise"
      @changeModal="changeModal"
      @refreshData="refreshData"
    />
    <Collaborators
      ref="collaborators"
      :currentOrderId="currentOrderId"
      :showCollaborators="showCollaborators"
      @changeModal="changeModal"
      @addCollaborators="addCollaborators"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getOrderDetail,
  appraiseOrder,
  getCollaboratorsList,
  addCollaborators,
  getMyOrderDetail,
  appraiseMyOrder
} from "@/api/workorder/order/index.js";
import ShowText from "@/components/common/ShowText.vue";
import Distribute from "@/page/order/modal/distributeorder.vue";
import Cancel from "@/page/order/modal/cancelorder.vue";
import Supply from "@/page/order/modal/supplyorder.vue";
import Appraise from "@/page/order/modal/appraiseorder.vue";
import Collaborators from "@/page/order/modal/collaborators.vue";
import FileListOrder from "@/components/common/FileListOrder";
import { order } from "@/const/order/index.js";
export default {
  name: "PCOrderDetail",

  data() {
    return {
      order: order,
      OrderData: {},
      currentOrderId: "",
      currentOrderStatus: "",
      orderLogs: [],
      orderAppraise: {
        star: 0,
        content: ""
      },
      rateValue: null,
      rateTexts: ["差", "较差", "一般", "较好", "优秀"],
      showDistribute: false,
      showCancel: false,
      showSupply: false,
      showAppraise: false,
      modalType: "",
      changeAppraise: true,
      collaborators: null,
      collaboratorsId: [],
      collaboratorsData: [],
      showCollaborators: false,
      hasMyAuthority: true,
      isMy: null
    };
  },
  components: {
    ShowText,
    Distribute,
    Cancel,
    Supply,
    FileListOrder,
    Collaborators,
    Appraise
  },
  created() {
    console.log("permissions", this.permissions);
    this.currentOrderId = this.$route.query.id;
    this.isMy = this.$route.query.isMy ? true : false;
    this.getOrderDetail(this.currentOrderId);
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userList", "permissions"])
  },
  methods: {
    getCollaboratorsList() {
      getCollaboratorsList({ id: this.currentOrderId }).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          let list = [];
          this.collaboratorsId = [];
          this.collaboratorsData = data;
          if (data.length > 0) {
            data.map(i => {
              list.push(
                i.username + (i.nickname != null ? "      " + i.nickname : "")
              );
              this.collaboratorsId.push(i.userId);
            });
            this.collaborators = String(list);
          } else {
            this.collaborators = "无";
          }
        }
      });
    },
    addCollaborators(data) {
      addCollaborators(data).then(res => {
        if (res.data.success) {
          this.getCollaboratorsList();
          this.changeModal();
        }
      });
    },
    editCollaborators() {
      this.showCollaborators = true;
      this.$nextTick(() => {
        this.$refs["collaborators"].collaboratorsId = this.collaboratorsId;
        this.$refs["collaborators"].collaboratorsData = this.collaboratorsData;
      });
    },
    getOrderDetail(id) {
      if (this.isMy) {
        getMyOrderDetail(id).then(res => {
          this.setData(res, id);
        });
      } else {
        getOrderDetail(id).then(res => {
          this.setData(res, id);
        });
      }
    },
    setData(res, id) {
      if (res.data.success) {
        console.log("res", res);
        this.OrderData = {};
        let {
          files,
          type,
          orderDemand,
          orderCarry,
          orderAreas,
          status,
          orderLogs,
          orderAppraise,
          hasMyAuthority
        } = res.data.data;
        this.currentOrderStatus = status;
        this.orderLogs = orderLogs;
        this.hasMyAuthority = hasMyAuthority;
        if (status != "1") {
          this.getCollaboratorsList();
        }
        if (status == 6 && orderAppraise != null) {
          this.orderAppraise = orderAppraise;
        }

        this.OrderData = {
          ...orderCarry,
          ...res.data.data
        };
        Object.keys(this.OrderData).forEach(i => {
          if (this.OrderData[i] == null || this.OrderData[i] == undefined) {
            this.OrderData[i] = "无";
          }
        });
        this.$nextTick(() => {
          this.$refs["filelist"].filelistobj = [];
          this.$refs["filelist"].filelist = [];
          if (files !== null) {
            console.log("8888", this.$refs);

            let ids = [];
            files.map(i => {
              ids.push(i.fileId);
              let obj = {
                outerId: id,
                scene: "order_attachment"
              };
              let fileObj = {
                // status: "uploading",
                // message: "...",
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
    },
    appraiseOrder() {
      let data = {
        ...this.orderAppraise,
        ids: [this.currentOrderId]
      };
      if (this.isMy) {
        appraiseMyOrder(data).then(res => {
          if (res.data.success) {
            this.$message.success("已修改评价");
            this.changeAppraise = true;
            this.getOrderDetail(this.currentOrderId);
          }
        });
      } else {
        appraiseOrder(data).then(res => {
          if (res.data.success) {
            this.$message.success("已修改评价");
            this.changeAppraise = true;
            this.getOrderDetail(this.currentOrderId);
          }
        });
      }
    },
    checkNull(str) {
      return str == null || str == undefined ? "无" : str;
    },
    getUserName(id) {
      if (id == null) return null;
      let name = "";
      this.userList.map(i => {
        if (id == i.value) {
          name = i.label;
        }
      });
      return name;
    },
    changeModal(type) {
      this.showDistribute = type;
      this.showCancel = type;
      this.showSupply = type;
      this.showAppraise = type;
      this.showCollaborators = type;
    },
    refreshData() {
      this.getOrderDetail(this.currentOrderId);
    },
    editOrder(type) {
      this.$router.push({
        path: "/order/editcarry?isMy" + this.isMy,
        query: {
          id: this.currentOrderId,
          type
        }
      });
    },
    backOrderList() {
      this.$store.commit("SET_CURRENTSTATUS", this.currentOrderStatus);
      this.$router.push({
        path: `/order/${this.isMy ? "mylist" : "list"}/index`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.baseinfo {
  .orderDetail_baseinfo_item {
    margin-bottom: 20px;
  }
}
</style>
