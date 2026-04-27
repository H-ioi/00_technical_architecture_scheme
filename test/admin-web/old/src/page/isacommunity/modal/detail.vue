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
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "detail",
  components: {},
  props: {
    title: String,
    detailInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
    detailData: {
      type: Object,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["i18nlocel"]),
  },
  methods: {
    showModal() {
      console.log(11111);

      this.showDialog = true;
    },
    closeModal() {
      this.showDialog = false;
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
