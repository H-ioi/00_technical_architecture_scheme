<template>
  <div class="orderDetail">
    <div class="orderDetail_btn">
      <el-button type="primary" size="medium" @click="backList">返回</el-button>
    </div>
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title">轮播图详情</div>
        <div class="orderDetail_baseinfo">
          <div class="orderDetail_baseinfo_item">
            <span>轮播图名称</span>
            <span>{{ formData["title"] }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>轮播图排序</span>
            <span>{{ checkNull(formData["sort"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>轮播图链接</span>
            <span>{{ checkNull(formData["link"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>自动上架时间</span>
            <span>{{ checkNull(formData["autoReleaseUpTime"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item">
            <span>自动下架时间</span>
            <span>{{ checkNull(formData["autoReleaseDownTime"]) }}</span>
          </div>

          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>轮播图说明</span>
            <span>{{ checkNull(formData["description"]) }}</span>
          </div>
          <div class="orderDetail_baseinfo_item" style="width: 100%;">
            <span>轮播图素材</span>
            <FileList
              ref="FileList"
              :scene="'isaic_banner_cover'"
              :isDisabled="true"
              :limit="1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addBanner, putBanner, getBannerDetail } from "@/api/academy/banner.js";
import FileList from "@/components/academy/FileList.vue";
import course from "@/const/academy/course.js";
export default {
  name: "detail",
  components: {
    FileList
  },
  data() {
    return {
      formData: {}
    };
  },

  created() {
    this.initData();
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions"
    ])
  },
  watch: {},
  methods: {
    initData() {
      this.getBannerDetail();
    },
    getBannerDetail() {
      getBannerDetail(this.$route.query.id).then(res => {
        if (res.data.success) {
          this.formData = res.data.data;
          console.log("getBannerDetail", res);
          this.$nextTick(() => {
            this.$refs["FileList"].getFileList(this.formData["id"]);
          });
        }
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    backList() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.push("/academy/consult/swiper");
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}
</style>
