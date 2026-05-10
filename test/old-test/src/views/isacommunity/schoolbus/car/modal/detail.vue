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
                v-for="(item, index) in tabletitle['carDetail']"
                :key="index"
              >
                <span>{{ $t("isagroup")[item.label] }}</span>
                <span :title="$checkNull(detailData[item.prop])">{{
                  $checkNull(detailData[item.prop])
                }}</span>
              </div>
              <div
                style="width: 100% !important; margin-bottom: 15px"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("isagroup.照片") }}</span>
                <upload-file
                  ref="uploadFile"
                  :disabled="true"
                  :limit="1"
                  types="image/*"
                ></upload-file>
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
import { getCarinfoDetail } from "@/api/isacommunity/car.js";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import consts from "@/const/isacommunity/consts.js";
import uploadFile from "@/components/communitycommon/uploadFile.vue";
import dayjs from "dayjs";
export default {
  name: "detail",
  components: { uploadFile },
  props: {
    title: String,
  },
  data() {
    return {
      tablestyle: consts["tablestyle"],
      tabletitle: tabletitle,
      showDialog: false,
      detailData: {},
      driverList: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
    showModal(item) {
      this.showDialog = true;
      this.getDetail(item.id);
    },
    closeModal() {
      this.showDialog = false;
    },
    // 获取详情
    getDetail(id) {
      getCarinfoDetail(id).then(async (res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            console.log("getCarinfoDetail", res.data);
            let {
              carImageUrl,
              status,
              driverInfo,
              driverId,
              createTime,
              updateTime,
            } = res.data.data;
            this.detailData = {
              ...this.detailData,
              ...res.data.data,
              statusLabel: this.$getListLabel(consts["carStatus"], status),
              //   driverName: this.$getListLabel(driverInfo, driverId, "name", "id"),
              driverName: driverInfo ? driverInfo["name"] : "--",
              createTime: dayjs(createTime).format("YYYY-MM-DD HH:mm"),
              updateTime: dayjs(updateTime).format("YYYY-MM-DD HH:mm"),
            };
            console.log("this.detailData", this.detailData);

            if (carImageUrl != "") {
              this.$refs.uploadFile.imageUrl = carImageUrl;
            }
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
