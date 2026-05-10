<template>
  <div class="orderDetail">
    <div class="orderDetail_content">
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">
          <div>{{ $t("consult.活动详情") }}</div>
          <div>
            <el-button
              v-if="permissions['thepool_activity_edit']"
              type="primary"
              size="medium"
              @click="getActivity"
              >{{ $t("consult.编辑") }}</el-button
            >
          </div>
        </div>
        <div class="orderDetail_baseinfo">
          <div
            class="orderDetail_baseinfo_item"
            v-for="(item, index) in activityInfo"
            :key="index"
          >
            <span>{{ $t("consult")[item.label] }}</span>
            <span :title="checkNull(activityData[item.prop])">{{
              checkNull(activityData[item.prop])
            }}</span>
          </div>
        </div>
      </div>
      <div class="orderDetail_item">
        <div class="orderDetail_item_title df_sb">
          <div>{{ $t("consult.收集表名") }}</div>
          <div class="orderDetail_item_tabs">
            <div class="orderDetail_item_tablist">
              <div
                @click="changeCollection(item)"
                :class="[
                  'orderDetail_item_tablist_item',
                  {
                    tablist_item_active: currentCollectionId == item.id,
                  },
                ]"
                v-for="(item, index) in activityData['collections']"
                :key="item.id"
              >
                {{ item["collectionName"] }}
              </div>
            </div>
          </div>
        </div>
        <div class="orderDetail_baseinfo">
          <TemplateResult
            style="width: 100%"
            ref="TemplateResult"
            :showSelection="false"
            :isBindActive="true"
          />
        </div>
      </div>
    </div>
    <!-- 编辑家长 -->
    <AddActivity ref="AddActivity" @initData="getDetail" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getActivityDetail } from "@/api/consult/activity.js";
import { consult } from "@/const/consult/index.js";
import Table from "@/components/common/Table.vue";
import ShowText from "@/components/common/ShowText.vue";
import AddActivity from "@/page/thepool/modal/addactivity.vue";
import TemplateResult from "@/views/thepool/activity/templateresult.vue";
export default {
  name: "PCOrderDetail",
  components: {
    Table,
    ShowText,
    AddActivity,
    TemplateResult,
  },
  data() {
    return {
      activityData: {},
      activityInfo: consult["activityInfo"],
      currentCollectionId: "",
    };
  },

  created() {
    this.getDetail();
  },
  mounted() {},
  activated() {
    this.getDetail();
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "userList",
      "permissions",
      "i18nlocel",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },
  watch: {
    i18nlocel() {},
  },
  methods: {
    initData() {},
    getDetail() {
      getActivityDetail(this.$route.query.id).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.activityData = {
            ...data,
            activityTypeLabel: this.getDataLabel(
              data.activityType,
              this.dictionary["activity_type"]
            ),
            schoolsLabel: String(
              data.schools.map((item) => {
                return this.getDataLabel(item, this.pooldictionary);
              })
            ),
            collections: data["collections"].length > 0 ? data["collections"] : [],
          };
          if (this.activityData["collections"].length > 0) {
            this.currentCollectionId = this.activityData["collections"][0].id;
            this.$nextTick(async () => {
              this.$refs.TemplateResult.setData(this.currentCollectionId);
            });
          }
        }
      });
    },

    // 编辑活动信息
    getActivity() {
      this.$refs["AddActivity"].getDetail(this.$route.query.id);
    },
    changeCollection(item) {
      this.currentCollectionId = item.id;
      this.$nextTick(async () => {
        this.$refs.TemplateResult.setData(this.currentCollectionId);
      });
    },
    checkNull(str) {
      return str == null || str == undefined || str == "" ? "--" : str;
    },
    getDataLabel(id, data) {
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    getDataId(id, data) {
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = item.id;
        }
      });
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-step__description {
  padding-right: 0% !important;
}

.orderSteps {
  width: 100%;
}

.orderDetail_baseinfo {
  padding-bottom: 20px !important;
}

.orderDetail_baseinfo_item {
  margin-bottom: 20px;
}

.followType {
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #efefef;
  display: flex;
  align-items: center;

  .followType_item {
    cursor: pointer;
    padding: 10px 20px 10px;
  }

  .currentFollow {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 3px;
      background-color: #175e67;
    }
  }
}
.orderDetail_item_tabs {
  flex: 1;
  height: 50px;
  position: relative;

  .orderDetail_item_tablist {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    // overflow-x: auto;
    .orderDetail_item_tablist_item {
      padding: 0 30px;
      cursor: pointer;
    }
    .tablist_item_active {
      color: #175e67;
      background: #eef5f6;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        bottom: -1px;
        height: 2px;
        right: 0;
        left: 0;
        background: #175e67;
      }
    }
  }
}
</style>
