<template>
  <div class="avue-top">
    <div class="top_left">
      <img
        v-if="!isCollapse"
        class="collapse"
        src="/thepool/icon/icon_cebianlan_off.png"
        alt=""
        @click="changeCollapse"
      />
      <img
        v-else
        class="collapse"
        src="/thepool/icon/icon_cebianlan_on.png"
        alt=""
        @click="changeCollapse"
      />
      <el-breadcrumb class="pool-breadcrumb" separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="index"
        >
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="top_search">
      <el-input
        v-if="showKeywordSearch"
        @input="inputKeyword"
        @clear="clearKeyword"
        :placeholder="$t('consult.请输入')"
        v-model="keyword"
        clearable
      >
        <template slot="prepend">
          <img src="/thepool/icon/icon_sousuo.png" alt="" />
        </template>
        <template slot="append">
          <span @click="searchList">
            {{ $t("consult.搜索") }}
          </span>
        </template>
      </el-input>
      <el-autocomplete
        v-else
        v-model="searchWord"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
        style="width: 100%"
        clearable
      >
        <template slot="prepend">
          <img src="/thepool/icon/icon_sousuo.png" alt="" />
        </template>
        <template slot="append">
          <span @click="searchClueList">
            {{ $t("consult.搜索") }}
          </span>
        </template>
      </el-autocomplete>
    </div>
    <div class="top_right">
      <div class="top-bar_news">
        <div class="news" @click="$router.push('/notification/list')">
          <span class="news_num" v-if="messageNum['unreadall'] > 0">{{
            messageNum["unreadall"]
          }}</span>
          <i class="el-icon-bell"></i>
        </div>
        <!-- 用户信息及修改密码 -->
        <el-dropdown>
          <span class="el-dropdown-link" style="cursor: pointer">
            <div class="userInfo">
              <span class="userInfo_head">{{ firstChar }}</span>
              <span class="userInfo_name"> {{ userInfo.username }}</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </div>
          </span>
          <el-dropdown-menu slot="dropdown" class="userdropdown_menu">
            <el-dropdown-item>
              <router-link to="/info/index">{{
                $t("consult.修改密码")
              }}</router-link>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout"
              >{{ $t("consult.退出系统") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { clearStore } from "@/util/store";
import { getMyClueList } from "@/api/consult/index.js";
export default {
  name: "Top",
  components: {},
  filters: {},
  data() {
    return {
      firstChar: "",
      currentSchool: null,
      breadcrumbList: [],
      keyword: "",
      showKeywordSearch: false,
      searchWord: "",
      timeout: null,
      pathUrlList: [
        "/thepool/enquiry/index/index",
        "/thepool/enquiry/my/index",
        "/thepool/user/student/index",
        "/thepool/user/student/mine",
        "/thepool/user/guardian/index",
        "/thepool/user/guardian/mine",
      ],
    };
  },
  computed: {
    ...mapGetters([
      "tenantId",
      "userInfo",
      "pooldictpermissions",
      "i18nlocel",
      "messageNum",
      "isCollapse",
      "pooldictionary",
    ]),
  },
  created() {
    // 初始化首字符
    if (this.userInfo && this.userInfo.username) {
      this.firstChar = this.userInfo.username.charAt(0).toUpperCase();
    }
    if (this.$route.path == "/thepool/enquiry/index/index") {
      if (this.$route.query.keyword) {
        this.keyword = this.$route.query.keyword;
        this.$nextTick(() => {
          this.searchList();
        });
      }
    }
  },
  mounted() {
    this.handleRouteChange();
    this.generateBreadcrumb();
    this.$store.subscribeAction((action) => {
      if (action.type === "clearKeyword") {
        this.clearKeyword();
      }
    });
  },
  watch: {
    $route() {
      this.handleRouteChange();
      this.generateBreadcrumb();
    },
  },
  methods: {
    changeCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    // 监听路由变化，pathUrlList存在该路由showKeywordSearch为true,
    // 否则为false
    handleRouteChange() {
      this.showKeywordSearch = this.pathUrlList.includes(this.$route.path);
    },

    // 自动生成面包屑
    generateBreadcrumb() {
      const matched = this.$route.matched;
      console.log("generateBreadcrumb", matched);

      this.breadcrumbList = matched
        .filter((item) => item.name)
        .map((item) => ({
          name: item.name,
          path: item.path,
        }));
    },
    //监听keyword变化，回车触发跨页面搜索
    searchList() {
      this.$store.dispatch("searchList", this.keyword);
    },
    inputKeyword() {
      this.$store.commit("SET_KEYWORD", this.keyword);
    },
    clearKeyword() {
      this.keyword = "";
      this.$store.commit("SET_KEYWORD", this.keyword);
    },
    querySearchAsync(queryString, cb) {
      console.log("queryString", queryString);

      if (!queryString) {
        cb([]);
        return;
      }
      getMyClueList({
        pageSize: 100,
        pageNum: 1,
        keyword: queryString,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          let restaurants = data || [];
          restaurants.map((item) => {
            let applySchoolLabel = "";
            let guardianTitle = item.guardianTitle || "";
            if (item.applySchool) {
              applySchoolLabel = this.$getListLabel(
                this.pooldictionary,
                item.applySchool
              );
            }
            item["value"] =
              guardianTitle +
              (applySchoolLabel == "" ? "" : "-" + applySchoolLabel);
          });
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(restaurants);
          }, 1000);
        }
      });
    },
    handleSelect(item) {
      console.log("handleSelect", item);
      const routeUrl = this.$router.resolve({
        path: "/thepool/enquiry/detail",
        query: {
          clueId: item.id,
          type: "1",
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 搜索线索
    searchClueList() {
      const routeUrl = this.$router.resolve({
        path: "/thepool/enquiry/index/index",
        query: {
          keyword: this.searchWord,
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    logout() {
      this.$confirm(
        this.$t("consult.是否退出系统, 是否继续?"),
        this.$t("consult.提示"),
        {
          confirmButtonText: this.$t("consult.确认"),
          cancelButtonText: this.$t("consult.取消"),
          type: "warning",
        }
      ).then(() => {
        // this.$store.commit("CLEAR_DICTIONARY");
        clearStore({ type: "session" });
        this.$store.dispatch("LogOut");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avue-top {
  height: 80px !important;
  background-color: #f1f5fb !important;
  padding-right: 0 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .top_left {
    display: flex;
    align-items: center;
    .collapse {
      cursor: pointer;
      width: 18px;
      margin-right: 10px;
    }
  }
  .top_right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .top-bar_news {
      display: flex;
      align-items: center;
      margin-right: 30px;
    }
  }
}

.userInfo {
  display: flex;
  align-items: center;
  .userInfo_head {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white; // 设置字体颜色为白色
    background: #2a3f54;
    text-align: center; // 文字居中
    line-height: 40px; // 垂直居中
    font-size: 20px;
  }
  .userInfo_name {
    display: inline-block;
    font-family: AppleSystemUIFont;
    font-size: 16px;
    color: #333333;
    padding-left: 10px;
  }
}
.news {
  position: relative;
  cursor: pointer;
  margin-right: 20px;
  .news_num {
    display: inline-block;
    position: absolute;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: #ffffff;
    background-color: red;
    border-radius: 50%;
    top: 8px;
    right: 0;
    font-size: 12px;
    font-weight: 400;
    transform: translate(50%, -50%) scale(0.8);
  }

  i {
    font-size: 24px;
    color: #2a3f54;
    line-height: 24px !important;
  }
}
.top_search {
  flex: 1;
  padding: 0 30px;
  /deep/ .el-input {
    border-radius: 30px;
    .el-input-group__prepend {
      border-radius: 30px 0 0 30px;
      padding: 0 0 0 20px;
      background-color: #fff;
      border-color: #dddddd;
      img {
        width: 20px;
        height: 20px;
        margin-top: 3px;
      }
    }
    .el-input-group__append {
      border-radius: 0 30px 30px 0;
      width: 88px;
      background: #ba8e62;
      padding: 0;
      text-align: center;
      color: #ffffff;
      border: none;
      cursor: pointer;
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:hover {
        background-color: #d4ab85 !important;
      }
    }
    .el-input__inner {
      padding: 10px;
      border-color: #dddddd;
      border-left: none;
      border-right: none;
    }
    .el-input__inner:focus {
      outline: none;
      border-color: #dddddd;
    }
  }
}
</style>
