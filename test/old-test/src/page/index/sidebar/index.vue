<template>
  <div
    class="avue-sidebar"
    :style="`background:${tenantId == 2 ? '#2a3f54' : '#ffffff'}; ${
      tenantId == 2 ? 'padding-bottom:60px' : 'padding-bottom:10px'
    }`"
  >
    <CommunityLogo v-if="tenantId == 5" />
    <EmsLogo v-else-if="tenantId == 6" />
    <ThepoolLogo v-else-if="tenantId == 2" />
    <logo v-else />

    <el-scrollbar
      :style="`height:100%;background:${tenantId == 2 ? '#2a3f54' : '#ffffff'}`"
    >
      <div v-if="validatenull(menuitem)" class="avue-sidebar--tip">
        没有发现菜单
      </div>
      <el-menu
        :default-active="nowTagValue"
        :show-timeout="200"
        :collapse="keyCollapse"
        unique-opened
        mode="vertical"
      >
        <ThepoolSidebarItem
          v-if="tenantId == 2"
          ref="sidebar"
          :menu="menuitem"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first
        />
        <CommunitySidebarItem
          v-else-if="tenantId == 5"
          ref="sidebar"
          :menu="menuitem"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first
        />
        <EmsSidebarItem
          v-else-if="tenantId == 6"
          ref="sidebar"
          :menu="menuitem"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first
        />
        <sidebar-item
          v-else
          ref="sidebar"
          :menu="menuitem"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first
        />
      </el-menu>
    </el-scrollbar>
    <div v-if="tenantId == 2" class="poolanguage">
      <ThepooLanguage ref="ThepooLanguage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
// thepool
import ThepoolSidebarItem from "../thepool/sidebar/index";
import ThepoolLogo from "../thepool/logo/index";
import ThepooLanguage from "@/components/thepoolcommon/Language";
// 爱莎圈后台
import CommunitySidebarItem from "../community/sidebar/index";
import CommunityLogo from "../community/logo/index";
// ems后台
import EmsSidebarItem from "../ems/sidebar/index";
import EmsLogo from "../ems/logo/index";
import { getPoolDictionary } from "@/util/filter.js";
export default {
  name: "Sidebar",
  inject: ["Index"],
  components: {
    sidebarItem,
    logo,
    ThepoolSidebarItem,
    ThepoolLogo,
    ThepooLanguage,
    CommunitySidebarItem,
    CommunityLogo,
    EmsSidebarItem,
    EmsLogo,
  },
  data() {
    return {
      menuitem: [],
      dictionary: [
        "order_urgency",
        "order_service_type",
        "order_area",
        "order_carry_time",
        "follow_type",
        "order_school",
        "enquiry_enroll_level",
        "enquiry_relation_type",
        "order_inspect_type",
        "order_repair_type",
        "order_spotcheck_type",
        "order_upkeep_type",
      ],
    };
  },

  created() {
    // window.addEventListener("beforeunload", this.handleBeforeUnload);
    // this.Index.openMenu(this.menuId);
    this.openMenu();
    this.reloadData();
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "website",
      "menu",
      "tag",
      "keyCollapse",
      "screen",
      "tenantId",
    ]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  methods: {
    async openMenu(item = {}) {
      this.$store
        .dispatch("GetMenu", { type: true, id: item.id })
        .then((data) => {
          this.menuitem = data;
          this.Index.openMenu(data);
        });
      //   console.log("this.tenantId", this.tenantId, this.tenantId != 3);
    },
    handleBeforeUnload(event) {
      // 通用阻止默认行为
      event.preventDefault();
      // 兼容旧版浏览器
      event.returnValue = "";
      // 这里添加刷新或关闭前的逻辑，如保存数据等
      this.reloadData();
    },
    reloadData() {
      switch (this.tenantId) {
        case 1:
          this.$store.dispatch("FetchList");
          this.dictionary.map((item) => {
            this.$store.dispatch("GetDictionary", { type: item });
          });
          break;
        case 2:
          this.$store.dispatch("FetchList");
          getPoolDictionary("order_school").then((res) => {});
          const dictionary = [
            "follow_type", //跟进类型
            "enquiry_relation_type", //关系
            "activity_type", //活动类型
            "enquiry_channel", //渠道
            "enquiry_channel_child_one", //渠道子集
            "enquiry_direction", //方向
            "enquiry_enroll_level", //年级
            "enquiry_follow_tags", //跟进标签
            "enquiry_pay_subject", //缴费主体
            "enquiry_boarding", //住宿情况
          ];
          dictionary.map((item) => {
            this.$store.dispatch("GetDictionary", { type: item });
          });
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          //   await getSchool();
          //   await getForm();
          //   await getYeargroup();
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.avue-sidebar {
  .poolanguage {
    position: absolute;
    // top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
