<template>
  <div class="detail">
    <div class="detail_content">
      <div class="df_sb detail_top">
        <div class="detail_top_left df_sb">
          <div class="back_btn" @click="back">
            <img src="/svg/other/fanhui.svg" alt="" />
          </div>
          <span>空间详情</span>
        </div>
        <el-button
          v-if="permissions['space_edit']"
          type="primary"
          size="mini"
          @click="
            $router.push(
              `/space/edit?pid=${$route.query.pid}&id=${$route.query.id}`
            )
          "
          >编辑</el-button
        >
      </div>
      <div class="detail_item">
        <div class="detail_item_title">空间基本属性</div>
        <div class="detail_baseinfo">
          <div class="detail_baseinfo_item">
            <span>空间名称</span>
            <span :title="setDefault(baseInfo['name'])">{{
              setDefault(baseInfo["name"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>面积：㎡</span>
            <span :title="setDefault(baseInfo['area'])">{{
              setDefault(baseInfo["area"])
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>使用类型</span>
            <span :title="setDefault(baseInfo['useType'])">{{
              setDefault(getListName(spaceUseStatus, baseInfo["useType"]))
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>空间标签</span>
            <span :title="setDefault(String(spaceLabeName))">{{
              setDefault(String(spaceLabeName))
            }}</span>
          </div>
          <div class="detail_baseinfo_item">
            <span>空间类型</span>
            <span :title="setDefault(String(spaceTypeName))">{{
              setDefault(String(spaceTypeName))
            }}</span>
          </div>
          <div style="width: 100%" v-if="showIconFileId">
            <div style="color: #999999; margin-bottom: 5px">空间平面图</div>
            <FileList
              ref="filelist"
              :limit="1"
              :scene="'space_icon_attachment'"
              :isDisabled="true"
              :showDownload="false"
              :showName="false"
            />
          </div>
          <!-- 层级属性 -->
          <FromItemDetail ref="levelForm" />
        </div>
      </div>

      <!-- <div class="detail_item" v-if="spaceAttribute.length > 0"> -->
      <div
        class="detail_item"
        v-for="(item, index) in spaceAttribute"
        :key="index"
      >
        <div class="detail_item_title">{{ item.typeName }}</div>
        <div class="detail_baseinfo">
          <!-- 空间类型属性 -->
          <FromItemDetail :ref="`spacetype${item.typeId}`" />
        </div>
      </div>
      <!-- 绑定的工单 -->
      <div class="detail_item" v-if="tableData.length > 0">
        <div class="detail_item_title">工单列表</div>
        <div class="detail_baseinfo">
          <Table
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="[]"
            :showSelection="false"
          />
        </div>
      </div>
      <!-- 空间资产 -->
      <SpaceAsset :sapceName="baseInfo['name']" />

      <div
        class="detail_item"
        v-if="baseInfo['useType'] == 1 && $route.path == '/space/boarddetail'"
      >
        <div class="detail_item_title df_sb" style="border-bottom: none">
          <span>预定时间看板</span>
          <el-button
            v-if="permissions['space_reserve_add']"
            type="primary"
            size="mini"
            @click="
              showReservation = true;
              reservationType = 'add';
            "
            >新建预定</el-button
          >
        </div>
      </div>

      <full-calendar
        v-if="baseInfo['useType'] == 1 && $route.path == '/space/boarddetail'"
        ref="full-calendar"
        @handleEventClick="handleEventClick"
        @setReserve="setReserve"
        @getReserveDetail="getReserveDetail"
      ></full-calendar>

      <Reservation
        v-if="baseInfo['useType'] == 1 && $route.path == '/space/boarddetail'"
        ref="reservation"
        :showReservation="showReservation"
        :reservationType="reservationType"
        @changeModal="changeModal"
        @refreshData="refreshData"
        @delSpaceReserve="delSpaceReserve"
        @editReserve="editReserve"
      />
      <!-- 使用类型信息 -->
      <SpaceusageTable
        :permissions="permissions"
        v-if="baseInfo['useType'] == 2 && $route.path == '/space/boarddetail'"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { spaceUseStatus } from "@/const/space/index.js";
import { getSpaceDetail } from "@/api/space/spacelist.js";
import { getDynamicDetail } from "@/api/space/templatedynamic.js";
import { getSpaceLevelDeatil } from "@/api/space/spacehierarchy.js";
import { order } from "@/const/order/index.js";
import { getOrderSpaceList } from "@/api/workorder/order/index.js";
import Fullcalendar from "./fullcalendar/index.vue";
import Reservation from "./modal/reservation";
import SpaceusageTable from "./spaceusagetable";
import FromItemDetail from "@/page/space/from/fromitemdetail.vue";
import SpaceAsset from "@/page/assets/spaceAssets.vue";
import FileList from "@/components/common/FileList";
import Table from "@/components/common/Table.vue";
export default {
  components: {
    "full-calendar": Fullcalendar,
    Reservation,
    FromItemDetail,
    SpaceusageTable,
    SpaceAsset,
    FileList,
    Table
  },
  data() {
    return {
      spaceUseStatus: spaceUseStatus,
      // 预定类型
      showReservation: false,
      reservationType: "",
      spaceAttribute: [],
      baseInfo: {},
      hierarchyInfo: [],
      spaceTypeInfo: [],
      spaceTypeName: [],
      spaceLabeName: [],
      // 选择的当前日期
      currentDate: "",
      showIconFileId: false,
      tableTitle: order["orderTitle"],
      tableData: []
    };
  },
  created() {
    this.getSpaceDetail();
    this.getOrderSpaceList();
    // this.getSpaceLevelDeatil();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getOrderSpaceList() {
      getOrderSpaceList(this.$route.query.id).then(res => {
        if (res.data.success) {
          console.log("res", res);
          this.tableData = res.data.data;
        }
      });
    },
    getSpaceLevelDeatil(hierarchyFormId, pid) {
      getSpaceLevelDeatil(pid).then(res => {
        if (res.data.success) {
          console.log("res", res);
          this.$refs.levelForm.getTemplateDetail(
            res.data.data.templateFormId,
            hierarchyFormId
          );
        }
      });
    },
    getSpaceDetail() {
      getSpaceDetail(this.$route.query.id).then(res => {
        if (res.data.success) {
          console.log("res", res);
          let {
            area,
            name,
            useType,
            typeForms,
            hierarchyFormId,
            pid,
            labels,
            iconFileId
          } = res.data.data;
          this.baseInfo = res.data.data;
          this.getSpaceName(typeForms);
          this.getSpaceLabel(labels);
          this.spaceAttribute = typeForms;
          this.getSpaceLevelDeatil(hierarchyFormId, pid);
          console.log("iconFileId", iconFileId);
          if (iconFileId != null && iconFileId != "") {
            console.log("111111iconFileId", iconFileId);
            this.showIconFileId = true;
          }
          this.$nextTick(() => {
            // this.$refs.levelForm.getDynamicDetail(hierarchyFormId);
            typeForms.map(item => {
              this.$nextTick(() => {
                let refsId = `spacetype${item.typeId}`;
                this.$refs[refsId][0].getTemplateDetail(
                  item.templateFormId,
                  item.formId
                );
                // this.$refs[refsId][0].getDynamicDetail(item.formId);
              });
            });
            if (iconFileId != null && iconFileId != "") {
              let obj = {
                id: iconFileId,
                file: "",
                name: "平面图",
                type: "png"
              };
              this.$refs["filelist"].filelistobj[0] = obj;
              this.$refs["filelist"].getFile(iconFileId, obj);
            }
          });
        }
      });
    },
    getDynamicDetail(id) {
      getDynamicDetail(id).then(res => {
        if (res.data.success) {
          let { fields, id, templateFormId } = res.data.data;
        }
      });
    },
    getSpaceName(data) {
      this.spaceTypeName = [];
      data.map(item => {
        this.spaceTypeName.push(item.typeName);
      });
    },
    getSpaceLabel(data) {
      this.spaceLabeName = [];
      data.map(item => {
        this.spaceLabeName.push(item.name);
      });
    },
    handleEventClick(type, info) {
      this.showReservation = true;
      this.reservationType = type;
    },
    changeModal(isShow, type) {
      if (type) {
        this.reservationType = type;
      }
      this.showReservation = isShow;
    },
    setDefault(data) {
      return data && data != "" ? data : "--";
    },
    back() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.back();
    },
    getListName(data, value) {
      let name = "";
      data.map(item => {
        if (item.value == value) {
          name = item.label;
        }
      });
      return name;
    },
    // 设置时间
    setReserve(start, end) {
      console.log(start, end);
      this.reservationType = "add";
      this.showReservation = true;
      this.$nextTick(() => {
        this.$refs.reservation.ruleForm.startTime = start;
        this.$refs.reservation.ruleForm.endTime = end;
      });
    },
    // 预定列表详情
    getReserveDetail(data) {
      console.log("data", data);
      this.reservationType = "look";
      this.showReservation = true;
      this.$nextTick(() => {
        this.$refs.reservation.ruleForm = {
          ...data[0],
          time: "00:00"
        };
      });
    },
    // 刷新预定列表
    refreshData() {
      this.showReservation = false;
      this.$refs["full-calendar"].getSpaceReserveList();
    },
    // 删除预定
    delSpaceReserve(id) {
      this.showReservation = false;
      this.$refs["full-calendar"].deleteItem(id);
    },
    editReserve() {
      this.reservationType = "edit";
    }
  }
};
</script>

<style lang="scss" scoped>
.detail_baseinfo_item {
  width: 25% !important;
  margin-bottom: 20px;
}
.detail_baseinfo {
  .el-form {
    width: 100% !important;
  }
}
</style>
