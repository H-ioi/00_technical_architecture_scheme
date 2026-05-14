<template>
  <div class="menu-wrapper">
    <div>
      <!-- 一级菜单 -->
      <div v-for="(item, index) in menu" :key="index" class="menuItem">
        <div :class="['itemfirst']">
          <div
            :style="`margin-bottom:${
              openMenuIds.includes(item.id)
                ? activeMenuIds.includes(item.id)
                  ? '10'
                  : '0'
                : '10'
            }px !important`"
            @click.stop="changeMenu(item)"
            :class="[
              'menuItem_info',
              { firsr_active: vaildAvtive(item) || activeMenuIds.includes(item.id) },
            ]"
          >
            <span class="menuItem_icon">
              <img :src="showMenuIcon(item['path'])" />
            </span>
            <span
              class="menuItem_label"
              :title="$t('consult')[item.name] ? $t('consult')[item.name] : item.name"
            >
              {{ $t("consult")[item.name] ? $t("consult")[item.name] : item.name }}</span
            >
            <i
              v-if="item.children.length > 0"
              :class="[
                'el-icon-arrow-right',
                openMenuIds.includes(item.id) ? 'rotated' : '',
              ]"
            ></i>
          </div>
          <!-- 二级菜单 -->
          <transition
            name="menu-slide"
            v-if="openMenuIds.includes(item.id) && item.children.length > 0"
          >
            <div
              :class="[
                'menu-sub',
                {
                  'menu-sub-open': openMenuIds.includes(item.id),
                },
              ]"
            >
              <div :class="['itemsecond', ,]" v-for="(i, k) in item.children" :key="k">
                <div
                  @click.stop="changeMenu(i)"
                  :class="[
                    'menuItem_info',
                    { active: vaildAvtive(i) || activeMenuIds.includes(i.id) },
                  ]"
                >
                  <span class="menuItem_icon">
                    <span class="point"></span>
                  </span>
                  <span
                    class="menuItem_label"
                    :title="$t('consult')[i.name] ? $t('consult')[i.name] : i.name"
                  >
                    {{ $t("consult")[i.name] ? $t("consult")[i.name] : i.name }}</span
                  >
                  <i
                    v-if="i.children.length !== 0"
                    :class="[
                      'el-icon-arrow-right',
                      openMenuIds.includes(i.id) ? 'rotated' : '',
                    ]"
                  ></i>
                </div>
                <!-- 三级菜单 -->
                <transition name="menu-slide">
                  <div
                    v-if="openMenuIds.includes(i.id) && i.children.length > 0"
                    :class="[
                      'menu-sub',
                      {
                        'menu-sub-open': openMenuIds.includes(i.id),
                      },
                    ]"
                  >
                    <div :class="['itemthree']" v-for="(c, d) in i.children" :key="d">
                      <div
                        @click.stop="changeMenu(c)"
                        :class="['menuItem_info', { active: vaildAvtive(c) }]"
                      >
                        <span class="menuItem_icon"> </span>
                        <span
                          class="menuItem_label"
                          :title="$t('consult')[c.name] ? $t('consult')[c.name] : c.name"
                        >
                          {{
                            $t("consult")[c.name] ? $t("consult")[c.name] : c.name
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "../../sidebar/config.js";
export default {
  name: "SidebarItem",
  components: {},
  props: {
    menu: {
      type: Array,
    },
    screen: {
      type: Number,
    },
    first: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapse: {
      type: Boolean,
    },
  },
  data() {
    return {
      config: config,
      menuItem: [],
      // 打开关闭的菜单
      openMenuIds: [],
      // 选中的菜单
      activeMenuIds: [],
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  activated() {
    this.initData();
  },
  computed: {
    ...mapGetters(["roles"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        let path = this.$route.path;
        this.activeMenuIds = this.getActiveMenuIds(this.menu, path);
        this.openMenuIds = this.getActiveMenuIds(this.menu, path);
      });
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some((ele) =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    changeMenu(item) {
      if (!this.openMenuIds.includes(item.id)) {
        if (item["children"] && item["children"].length > 0) {
          this.openMenuIds.push(item.id);
        } else {
          this.activeMenuIds = this.getActiveMenuIds(this.menu, item["path"]);
          this.open(item);
        }
      } else {
        this.openMenuIds = this.openMenuIds.filter((ele) => ele !== item.id);
      }
    },
    /**
     * 递归查找匹配路径的菜单项 ID 数组
     * @param {Array} data - 菜单数据数组
     * @param {string} path - 要匹配的路径
     * @param {Array} activeMenuIds - 递归过程中存储的菜单项 ID 数组，默认为空数组
     * @returns {Array} - 匹配路径的菜单项 ID 数组
     */
    getActiveMenuIds(data, path, activeMenuIds = []) {
      for (const item of data) {
        const newActiveMenuIds = [...activeMenuIds, item.id];
        if (path === item.path) {
          return newActiveMenuIds;
        } else if (item.children && item.children.length > 0) {
          const result = this.getActiveMenuIds(item.children, path, newActiveMenuIds);
          if (result.length > 0) {
            return result;
          }
        }
      }
      return [];
    },
    open(item) {
      //   if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      const path = this.$router.$avueRouter.getPath({
        name: item[this.labelKey],
        src: item[this.pathKey],
      });
      const raw =
        item.query && typeof item.query === "object" ? item.query : {};
      const query = { ...raw };
      if (this.$route.path === path) {
        query._menuTap = Date.now();
      }
      this.$router.push({ path, query }).catch(() => {});
    },
    showMenuIcon(path) {
      // 提取 /thepool/ 之后的部分
      const thepoolIndex = path.indexOf("/thepool/");
      let relevantPath = "";
      if (thepoolIndex !== -1) {
        const startIndex = thepoolIndex + "/thepool/".length;
        relevantPath = path.slice(startIndex);
        // 找到第二个 / 的位置
        const secondSlashIndex = relevantPath.indexOf("/", 1);
        if (secondSlashIndex !== -1) {
          relevantPath = relevantPath.slice(0, secondSlashIndex);
        } else {
          // 若第二个 / 不存在，找第三个 / 的位置
          const thirdSlashIndex = relevantPath.indexOf("/", secondSlashIndex + 1);
          if (thirdSlashIndex !== -1) {
            relevantPath = relevantPath.slice(0, thirdSlashIndex);
          }
        }
      } else {
        // 提取第一个 / 后的单词
        let pathList = path.split("/");
        relevantPath = pathList[1];
      }
      // 检查当前路径对应的菜单项是否激活
      const isActive = this.menu.some((item) => {
        if (item.path === path) {
          return this.activeMenuIds.includes(item.id);
        }

        return false;
      });

      // 根据激活状态生成图片文件名
      const status = isActive ? "on" : "off";

      // 返回图片路径
      try {
        return `/thepool/menu/${relevantPath}_${status}.png`;
      } catch (error) {
        console.error(`未找到图片:`, error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-wrapper {
  width: 220px !important;
  padding: 15px !important;
  box-sizing: border-box;
  background: #2a3f54 !important;
}
.menuItem {
  cursor: pointer;
  .itemfirst,
  .itemsecond,
  .itemthree {
    i {
      transition: all 0.2s;
      color: #ffffff;
    }
    .rotated {
      transform: rotate(90deg); // 旋转 90°
    }
    .menuItem_info {
      width: 100%;
      //   height: 42px;
      padding: 10px 10px 10px 20px;
      box-sizing: border-box;
      //   background: #fff;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      &:hover {
        // background: rgba(247, 251, 254, 1);
        .menuItem_label {
          font-weight: 500;
          color: #d4ab85;
        }
        .menuItem_icon {
          .point {
            // background-color: #2a3f54;
          }
        }
      }
      .menuItem_icon {
        display: inline-block;
        width: 20px;
        height: 20px;
      }
      .menuItem_label {
        flex: 1;
        text-align: left;
        padding: 0 10px;
        box-sizing: border-box;
        // 添加以下样式使文本不换行，超出部分显示省略号
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #ffffff;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        line-height: 16px;
      }
    }
  }
  .itemfirst {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    .menuItem_info {
      .menuItem_icon {
        img {
          width: 20px;
          height: 20px;
          //   background-color: red;
        }
      }
    }
  }
  .itemsecond {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #666666;
    .menuItem_info {
      margin-bottom: 0;
      .menuItem_icon {
        display: flex;
        align-items: center;
        .point {
          display: inline-block;
          width: 7px;
          height: 7px;
          background-color: #c9c9c9;
          border-radius: 50%;
          margin-left: 12px;
        }
      }
    }
  }
  .itemthree {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #666666;
  }
  .firsr_active {
    color: #d4ab85 !important;
    background: rgba(212, 171, 133, 0.06) !important;
    border-radius: 6px;
    border: 1px solid #d4ab85;
    margin-bottom: 0 !important;
    margin-top: 10px;
    .menuItem_label {
      font-weight: 500 !important;
      color: #d4ab85 !important;
    }
    i {
      color: #d4ab85 !important;
    }
  }
  .active {
    .menuItem_label {
      font-weight: 500 !important;
      color: #d4ab85 !important;
    }
    .menuItem_icon {
      .point {
        background-color: #d4ab85 !important;
      }
    }
    i {
      color: #d4ab85 !important;
    }
  }
  .menu-sub {
    overflow: hidden;
    max-height: 0;
    transform: translateY(-10px);
    opacity: 0;
    transition: max-height 0.3s ease-in-out, transform 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
    pointer-events: none;
  }

  .menu-sub-open {
    max-height: 1000px;
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.3s ease-in-out 0.1s, max-height 0.3s ease-in-out,
      transform 0.3s ease-in-out 0.1s;
    // 延迟 0.1s 执行 transform 动画，让高度变化先开始
    // 延迟 0.1s 执行透明度动画
  }

  .menu-slide-enter-active,
  .menu-slide-leave-active {
    transition: all 0.3s ease;
  }

  .menu-slide-enter-from,
  .menu-slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }

  .menu-slide-enter-to,
  .menu-slide-leave-from {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
