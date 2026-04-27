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
        <!-- <div class="orderDetail_content"> -->
        <div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 25%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in detailInfo"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
                <span :title="$checkNull(detailData[item.prop])">{{
                  $checkNull(detailData[item.prop])
                }}</span>
              </div>
              <!-- <div
                style="width: 100%; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.照片") }}</span>
                <upload-file
                  ref="uploadFile"
                  :disabled="true"
                  :limit="1"
                  types="image/*"
                ></upload-file>
              </div> -->
            </div>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div style="width: 100%">
                <el-table
                  :header-cell-style="tablestyle.headercellstyle"
                  :data="carList"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="(i, k) in tabletitle['bindCarTable']"
                    :key="k"
                    :prop="i['prop']"
                    :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
                    show-overflow-tooltip
                    :width="`${i['width']}`"
                    :fixed="i['fixed']"
                  >
                    <template slot-scope="scope">
                      <span v-if="!i.isUrl"> {{ scope.row[i.prop] }}</span>
                      <a
                        v-if="i.isUrl"
                        style="color: #ba8e62"
                        :href="scope.row[i.prop]"
                        target="_blank"
                        >{{ scope.row[i.prop] }}</a
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                style="width: 100%; margin-top: 15px"
                v-for="(item, index) in weekDays"
                :key="index"
              >
                <div
                  class="df_sb"
                  style="
                    width: 100%;
                    font-size: 16px;
                    margin-bottom: 10px;
                    color: #ba8e62;
                  "
                >
                  {{ item.weekDays }}
                </div>
                <div style="width: 100%">
                  <el-table
                    :header-cell-style="tablestyle.headercellstyle"
                    :data="item['stationPrices']"
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="(i, k) in tabletitle['bindStationTable']"
                      :key="k"
                      :prop="i['prop']"
                      :label="i['hasEn'] ? $t('isagroup')[i['label']] : i['label']"
                      show-overflow-tooltip
                      :width="`${i['width']}`"
                      :fixed="i['fixed']"
                    >
                    </el-table-column>
                  </el-table>
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
import { getRouteDetail } from "@/api/isacommunity/route.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import dayjs from "dayjs";
import _ from "lodash";
export default {
  name: "detail",
  components: { uploadFile },
  props: {
    title: String,
    detailInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tablestyle: {
        headercellstyle: {
          background: "#F5F8FD",
          color: "#333333 !important",
          "font-size": "14px",
          "font-weight": "400",
          height: "38px",
          "font-family": "AlibabaPuHuiTiM",
        },
        rowstyle: {
          color: " #666666",
          "font-size": "14px",
          "font-weight": "400",
          height: "44px",
          padding: "0px",
        },
      },
      tabletitle: tabletitle,
      showDialog: false,
      detailData: {},
      baseInfo: {},
      weekDays: [],
      carList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
    showModal(item) {
      console.log(11111);

      this.showDialog = true;
      this.$nextTick(() => {
        this.detailData = {
          ...item,
        };
        this.getDetail(item.id);
      });
    },
    closeModal() {
      this.showDialog = false;
    },
    // 获取详情
    getDetail(id) {
      getRouteDetail(id).then(async (res) => {
        if (res.data.success) {
          let {
            schoolIds,
            sectionId,
            cnName,
            enName,
            lineType,
            visible,
            carList,
            weekDays,
          } = res.data.data;
          this.$nextTick(() => {
            this.baseInfo = {
              lineId: id,
              schoolIds: schoolIds,
              sectionId: sectionId,
              cnName: cnName,
              enName: enName,
              lineType: String(lineType),
              visible: visible,
            };
            this.carList = carList;
            this.carList.map((item) => {
              item["driverName"] = item["driverInfo"] ? item["driverInfo"]["name"] : "--";
              item["statusLabel"] = this.$getListLabel(
                consts["statusType"],
                item["status"]
              );
              item["createTime"] = dayjs(item["createTime"]).format("YYYY-MM-DD HH:mm");
              item["updateTime"] = dayjs(item["updateTime"]).format("YYYY-MM-DD HH:mm");
            });
            this.weekDays = weekDays ? _.cloneDeep(weekDays) : this.weekDays;
            this.weekDays.forEach((item) => {
              item.stationPrices = item.stationPrices.map((i) => {
                return {
                  id: i["id"],
                  stationId: i["stationId"],
                  goTime: i["goTime"],
                  backTime: i["backTime"],
                  showGoTime: i["goTime"] ? i["goTime"].slice(0, 5) : "",
                  showBackTime: i["backTime"] ? i["backTime"].slice(0, 5) : "",
                  price: i["price"],
                  weekPrice: i["weekPrice"],
                  stationName:
                    this.i18nlocel == "en"
                      ? i["busStationDTO"]["enName"]
                      : i["busStationDTO"]["cnName"],
                };
              });
            });
            this.weekDays = JSON.parse(JSON.stringify(this.weekDays));
          });
        }
      });
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
