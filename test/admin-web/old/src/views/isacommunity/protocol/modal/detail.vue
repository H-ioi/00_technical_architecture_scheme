<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      width="85%"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="orderDetail">
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in tabletitle['protocolTable']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
                <span :title="$checkNull(detailData[item.prop])">
                  <span v-if="!item.isUrl">{{ $checkNull(detailData[item.prop]) }}</span>
                  <a
                    v-if="item.isUrl"
                    style="color: #ba8e62"
                    :href="detailData[item.prop]"
                    target="_blank"
                    >{{ detailData[item.prop] }}</a
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px">
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                class="community_top_btn"
                style="width: 100%; text-align: right; margin-bottom: 10px"
              >
                <el-button
                  v-if="permissions['protocolsign_export']"
                  type="defult"
                  @click="exportData"
                  >{{ $t("btn.导出") }}</el-button
                >
              </div>
              <div class="isa_table">
                <Table
                  ref="Table"
                  :showSelection="false"
                  :tableTitle="tabletitle['protocolSignTable']"
                  :tableData="tableData"
                  :tableBtn="tableBtn"
                />
                <div class="df_sb isa_table_footer">
                  <div></div>
                  <Pagination
                    :total="paginationTotal"
                    :pagination="pagination"
                    @handleCurrentChange="handleCurrentChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getProtocolDetail,
  getProtocolSignPage,
  exportProtocolSign,
} from "@/api/isacommunity/protocol.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import Table from "@/components/communitycommon/Table.vue";
import Pagination from "@/components/communitycommon/Pagination.vue";
import dayjs from "dayjs";
import { download } from "@/util/download.js";
export default {
  name: "detail",
  components: { Table, Pagination },

  props: {
    title: String,
  },
  data() {
    return {
      tablestyle: consts["tablestyle"],
      tabletitle: tabletitle,
      showDialog: false,
      detailData: {},
      tableData: [],
      tabletitle: tabletitle,
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      protocolId: "",
      schoolIds: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel", "dictionary", "permissions"]),
  },
  methods: {
    showModal(item) {
      this.protocolId = item.id;

      this.showDialog = true;
      this.getDetail(item.id);
      this.getList();
    },
    closeModal() {
      this.showDialog = false;
    },
    getList() {
      this.schoolIds = this.dictionary["school"].map((item) => item.id);
      getProtocolSignPage({
        ...this.pagination,
        protocolId: this.protocolId,
        schoolIds: this.schoolIds,
      }).then((res) => {
        if (res.data.success) {
          console.log("getProtocolSignPage", res.data.data);
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data;
        }
      });
    },
    // 获取详情
    getDetail(id) {
      getProtocolDetail(id).then((res) => {
        console.log("getProtocolDetail", res);
        if (res.data.success) {
          this.$nextTick(() => {
            console.log(" this.detailData", this.detailData);
            let {
              cnName,
              enName,
              protocolTypeEnName,
              protocolTypeCnName,
              moduleEnName,
              moduleCnName,
              needSign,
              status,
              createTime,
              updateTime,
            } = res.data.data;
            this.detailData = {
              ...this.detailData,
              ...res.data.data,
              protocolTypeName:
                this.i18nlocel == "en" ? protocolTypeEnName : protocolTypeCnName,
              moduleName: this.i18nlocel == "en" ? moduleEnName : moduleCnName,
              needSignLabel: this.$getListLabel(
                consts["isOrNo"],
                needSign,
                "label",
                "id"
              ),
              statusLabel: this.$getListLabel(consts["statusType"], status),
              createTime: dayjs(createTime).format("YYYY-MM-DD HH:mm"),
              updateTime: dayjs(updateTime).format("YYYY-MM-DD HH:mm"),
              //   showUrlName: this.i18nlocel == "en" ? enName : cnName,
            };
            console.log("this.detailData", this.detailData);
          });
        }
      });
    },
    exportData() {
      let data = {
        protocolId: this.protocolId,
        schoolIds: this.schoolIds,
      };
      exportProtocolSign(data).then((res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
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
