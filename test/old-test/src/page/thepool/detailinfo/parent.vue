<template>
  <div>
    <div v-if="guardianList.length > 0">
      <el-scrollbar>
        <div class="guardianList">
          <div
            @click="selectCurrent(item)"
            :class="[
              'guardianList-item',
              {
                is_active: currentGuardianId == item['id'],
              },
            ]"
            v-for="item in guardianList"
            :key="item.id"
          >
            <div class="name">{{ item["guardianInfo"]["showName"] }}</div>
            <div class="value">{{ item["guardianInfo"]["phone"] }}</div>
            <div class="value">
              {{ item["guardianInfo"]["relationTypeLabel"] }}
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="orderDetail">
        <div class="orderDetail_content">
          <div class="orderDetail_item">
            <div class="orderDetail_baseinfo">
              <div
                class="orderDetail_baseinfo_item"
                v-if="guardianData['schools'].length > 0"
              >
                <span>{{ $t("consult.归属校区") }}</span>
                <span :title="$checkNull(guardianData['schoolsLabel'])">{{
                  $checkNull(guardianData["schoolsLabel"])
                }}</span>
              </div>
              <div
                class="orderDetail_baseinfo_item"
                v-for="(item, index) in parentInfo"
                :key="index"
              >
                <span>{{ $t("consult")[item.label] }}</span>
                <span :title="$checkNull(guardianData[item.prop])">{{
                  $checkNull(guardianData[item.prop])
                }}</span>
              </div>
              <div
                style="width: 100% !important"
                class="orderDetail_baseinfo_item"
              >
                <span>{{ $t("consult.头像") }}</span>
                <div v-if="guardianData.photoUrl" style="margin-top: 10px">
                  <img
                    style="width: 100px; height: 100px"
                    :src="guardianData.photoUrl"
                    alt=""
                  />
                </div>
                <span v-else>--</span>
              </div>
            </div>
            <div v-for="(item, index) in guardianTemplateList" :key="index">
              <!-- 家长动态表单 -->
              <FromItemDetail :ref="`FromItemGuardian${item.templateId}`" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="No Data~"></el-empty>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getOuterFile, uploadOuterFile } from "@/api/upload/index.js";
import { getTemplateInfoByType } from "@/api/consult/template.js";
import { consult } from "@/const/consult/index.js";
import FromItemDetail from "@/components/thepoolcommon/dynamicform/fromitemdetail.vue";
export default {
  components: {
    FromItemDetail,
  },
  data() {
    return {
      consult: consult,
      parentInfo: consult["guardiansTableTitle"],
      guardianData: {},
      guardianTemplateList: [],
      guardianList: [],
      currentGuardianId: "",
    };
  },
  created() {},
  mounted() {},
  activated() {},
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
    // 选择家长
    selectCurrent(item) {
      if (item["id"] == this.currentGuardianId) return;
      this.currentGuardianId = item["id"];
      this.changeGuardian(item);
    },
    // 获取线索关联的家长
    initData(list) {
      this.guardianList = list || [];
      if (this.guardianList.length > 0) {
        this.guardianList.map((item) => {
          item["guardianInfo"] = {
            ...item["guardianInfo"],
            showName: this.getShowName(item["guardianInfo"]),
            relationTypeLabel: item["guardianInfo"]["relationType"]
              ? this.$getListLabel(
                  this.dictionary["enquiry_relation_type"],
                  item["guardianInfo"]["relationType"]
                )
              : null,
          };
        });
        if (this.currentGuardianId != "") {
          let isHas = false;
          this.guardianList.map((item, index) => {
            if (item.id == this.currentGuardianId) {
              isHas = true;
              this.changeGuardian(item);
            }
          });
          if (!isHas) {
            this.changeGuardian(this.guardianList[0]);
          }
        } else {
          this.changeGuardian(this.guardianList[0]);
        }
      }
    },
    // 切换家长
    async changeGuardian(item) {
      this.guardianTemplateList = [];
      this.currentGuardianId = item["id"];
      this.guardianData = {
        ...item["guardianInfo"],
        sexlabel: this.$getListLabel(
          consult["sexList"],
          item["guardianInfo"]["sex"]
        ),
        relationTypeLabel: this.$getListLabel(
          this.dictionary["enquiry_relation_type"],
          item["guardianInfo"]["relationType"]
        ),
        schools: item["schools"] || [],
      };
      if (this.guardianData["schools"].length > 0) {
        let arr = [];
        this.guardianData["schools"].map((school) => {
          arr.push(this.$getListLabel(this.pooldictionary, school));
        });
        this.guardianData["schoolsLabel"] = String(arr);
      }
      this.$nextTick(async () => {
        this.getTemplateDynamic(2, 0, item["dynamicInfos"] || []);
        this.getPhotoUrl(item);
        if (item["photos"] && item["photos"].length > 0) {
          item["photos"].forEach(async (photos) => {
            if (String(photos.type) == "0") {
              const file = await getOuterFile(photos.photoId);
              let photoUrl = window.URL.createObjectURL(file);
              console.log("photoUrl", photoUrl);
              this.guardianData = {
                ...this.guardianData,
                photoUrl,
              };
            }
          });
        }
      });
    },
    getPhotoUrl(data) {
      let photos = data["photos"] || [];
      if (photos.length > 0) {
        let hasAvatar = false;
        photos.forEach(async (item) => {
          let type = String(item.type);
          if (hasAvatar) return;
          switch (type) {
            case "0":
              hasAvatar = true;
              this.getOuterFile(item, data);
              break;
            case "1":
              hasAvatar = true;
              this.getOuterFile(item, data);
              break;
            case "2":
              hasAvatar = true;
              this.getOuterFile(item, data);
              break;
          }
        });
      }
    },
    async getOuterFile(photos, data) {
      const file = await getOuterFile(photos.photoId);
      let photoUrl = window.URL.createObjectURL(file);
      console.log("photoUrl", photoUrl);
      this.guardianData = {
        ...this.guardianData,
        photoUrl,
      };
    },
    async getTemplateDynamic(type, schoolId, dynamicInfos = []) {
      let templateForm = await getTemplateInfoByType({ templateType: type });
      if (templateForm.length > 0) {
        let templateList = templateForm.find(
          (dynamicItem) => dynamicItem.schoolId == schoolId
        ).templates;

        templateList.map((item) => {
          let dynamicInfoItem = dynamicInfos.find(
            (dynamicItem) => dynamicItem.templateId == item.templateId
          );
          switch (type) {
            case 2:
              this.guardianTemplateList = templateList;
              this.$nextTick(() => {
                this.$refs[
                  `FromItemGuardian${item.templateId}`
                ][0].getTemplateDetail(item, dynamicInfoItem);
              });
              break;
          }
        });
      }
    },
    getShowName(item) {
      return item["lastName"] && item["firstName"]
        ? item["lastName"] + item["firstName"]
        : !item["lastName"] && !item["firstName"]
        ? "----"
        : item["lastName"] || item["firstName"];
    },
  },
};
</script>
<style lang="scss" scoped>
.guardianList {
  overflow-x: auto;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .guardianList-item {
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    flex-basis: 200px !important;
    min-width: 200px !important;
    max-width: 200px !important;
    width: 200px !important;
    height: 96px;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.09);
    border-radius: 20px;
    padding: 15px 15px;
    box-sizing: border-box;
    text-align: left;
    margin: 2px 20px 2px 2px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      line-height: 20px;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .value {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .is_active {
    border: 1px solid #d4ab85;
  }
}
</style>
