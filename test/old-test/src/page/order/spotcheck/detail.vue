<template>
  <div class="orderDetail">
    <div class="orderDetail_btn" v-if="currentOrderStatus == '1'">
      <el-button
        v-if="isMy ? true : permissions['order_spotcheck_edit']"
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
        v-if="isMy ? hasMyAuthority : permissions['order_spotcheck_edit']"
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
    <div
      class="orderDetail_btn"
      v-if="currentOrderStatus == '6' || currentOrderStatus == '10'"
    >
      <el-button type="defult" size="medium" @click="backOrderList"
        >返回</el-button
      >
    </div>
    <div class="orderDetail_content">
      <!-- 工单处理信息 -->
      <OrderStatus
        v-if="currentOrderStatus != 1"
        ref="OrderStatus"
        :orderData="OrderData"
        :currentOrderStatus="String(currentOrderStatus)"
      />
      <!-- 工单评价 -->
      <OrderAppraise
        v-if="currentOrderStatus == 6"
        ref="OrderAppraise"
        :isMy="isMy"
        :hasMyAuthority="hasMyAuthority"
        :currentOrderId="currentOrderId"
        :currentOrderStatus="String(currentOrderStatus)"
        @refreshData="refreshData"
      />
      <!-- 申请人信息 -->
      <Contactinfo ref="Contactinfo" :orderData="OrderData" />
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
            <span>点检类型</span>
            <span :title="OrderData['spotcheckTypeName']">{{
              OrderData["spotcheckTypeName"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>关联空间</span>
            <span :title="OrderData['spaceName']">{{
              OrderData["spaceName"]
            }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>关联资产</span>
            <span :title="OrderData['assetName']">{{
              OrderData["assetName"]
            }}</span>
          </div>
          <div class="orderDetail_infoItem">
            <div class="infoItemTitle">明细信息</div>
            <ShowText :label="OrderData['description']" />
          </div>
          <div class="orderDetail_infoItem" v-if="currentOrderStatus != '1'">
            <div class="infoItemTitle">协作人</div>
            <ShowText :label="collaborators" />
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
      <!-- 工单流程 -->
      <OrderFlow ref="OrderFlow" :orderLogs="orderLogs" />
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
  getCollaboratorsList,
  addCollaborators,
  getMyOrderDetail
} from "@/api/workorder/order/index.js";
import ShowText from "@/components/common/ShowText.vue";
import Distribute from "@/page/order/modal/distributeorder.vue";
import Cancel from "@/page/order/modal/cancelorder.vue";
import Supply from "@/page/order/modal/supplyorder.vue";
import Appraise from "@/page/order/modal/appraiseorder.vue";
import Collaborators from "@/page/order/modal/collaborators.vue";
import FileListOrder from "@/components/common/FileListOrder";
import OrderStatus from "@/page/order/detailitem/orderstatus.vue";
import Contactinfo from "@/page/order/detailitem/contactinfo.vue";
import OrderFlow from "@/page/order/detailitem/orderflow.vue";
import OrderAppraise from "@/page/order/detailitem/appraise.vue";
import { order } from "@/const/order/index.js";
export default {
  name: "PCOrderDetail",
  components: {
    ShowText,
    Distribute,
    Cancel,
    Supply,
    FileListOrder,
    Collaborators,
    Appraise,
    OrderStatus,
    Contactinfo,
    OrderFlow,
    OrderAppraise
  },
  data() {
    return {
      order: order,
      OrderData: {},
      currentOrderId: "",
      currentOrderStatus: "",
      orderLogs: [],
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

  created() {
    this.isMy = this.$route.query.isMy;
    this.currentOrderId = this.$route.query.id;
    this.getOrderDetail(this.currentOrderId);
  },
  mounted() {},
  activated() {
    this.isMy = this.$route.query.isMy;
    this.currentOrderId = this.$route.query.id;
    this.getOrderDetail(this.currentOrderId);
  },
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
          orderSpotcheck,
          status,
          orderLogs,
          orderAppraise,
          hasMyAuthority
        } = res.data.data;
        this.currentOrderStatus = status;
        this.orderLogs = orderLogs;
        this.hasMyAuthority = hasMyAuthority;

        this.OrderData = {
          ...orderSpotcheck,
          ...res.data.data
        };
        Object.keys(this.OrderData).forEach(i => {
          this.OrderData[i] = this.checkNull(this.OrderData[i]);
        });
        if (status != "1") {
          this.getCollaboratorsList();
        }
        this.$nextTick(() => {
          if (status == 6 && orderAppraise != null) {
            this.$refs["OrderAppraise"].orderAppraise = {
              ...orderAppraise
            };
          }
          this.$refs["filelist"].filelistobj = [];
          this.$refs["filelist"].filelist = [];
          if (files !== null) {
            let ids = [];
            files.map(i => {
              ids.push(i.fileId);
              let obj = {
                outerId: id,
                scene: "order_attachment"
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
    },
    checkNull(str) {
      return str == null || str == "" || str == undefined ? "--" : str;
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
        path: "/order/spotcheck/edit",
        query: {
          id: this.currentOrderId,
          schoolId: this.OrderData["school"],
          isMy: this.isMy,
          type
        }
      });
    },
    backOrderList() {
      this.$store.commit("SET_CURRENTSTATUS", this.currentOrderStatus);
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
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
