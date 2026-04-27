<template>
  <div class="menu-wrapper">
    <template v-if="!isblackpath">
      <el-menu-item
        v-for="(item, index) in menu"
        :index="item[pathKey]"
        :key="index"
        class="menuitemimg"
      >
        <div>
          <el-popover
            placement="right-start"
            width="180"
            trigger="hover"
            :visible-arrow="false"
            :close-delay="100"
            :popper-class="
              item[childrenKey].length == 0 ? 'closepopover' : 'sidemenupopover'
            "
          >
            <div
              @click="open(item, 0)"
              slot="reference"
              :class="[
                'imgReference',
                {
                  imgReference_on: getCurrentLeftMenu(item)
                }
              ]"
            >
              <img :src="`/svg/menu/${item.icon}.svg`" alt="" />
              <!-- <div class="menuText">{{ item[labelKey] }}</div> -->
              <div class="menuText">
                {{ i18nlocel == "en" ? resetShowName(item) : item[labelKey] }}
              </div>
            </div>

            <div v-if="item[childrenKey].length == 0">{{ item[labelKey] }}</div>
            <div v-else>
              <div
                v-for="(child, cindex) in item[childrenKey]"
                :index="(child[pathKey], cindex)"
                :key="child[labelKey]"
                :class="['menuItem']"
              >
                <div
                  @click="open(child, 1)"
                  :class="[
                    'itemfirst',
                    'df_sb',
                    {
                      hoverCokor: vaildAvtive(child)
                    },
                    {
                      isroute: child.path.indexOf('/index') !== -1
                    }
                  ]"
                >
                  <!-- <span>{{ child[labelKey] }}</span> -->
                  <span>{{
                    i18nlocel == "en" ? resetShowName(child) : child[labelKey]
                  }}</span>
                  <i
                    :ref="child.path + 'icon'"
                    v-if="child[childrenKey].length !== 0"
                    class="el-icon-caret-top opScreen"
                  ></i>
                </div>
                <div
                  v-if="child[childrenKey].length !== 0"
                  :ref="child.path"
                  style="display: none; transition: all 1s"
                >
                  <div
                    :class="[
                      'itemsecond',
                      {
                        hoverCokor: vaildAvtive(c)
                      },
                      {
                        isroute: c.path.indexOf('/index') !== -1
                      }
                    ]"
                    @click="open(c, 2, i)"
                    :key="c[labelKey]"
                    v-for="(c, i) in child[childrenKey]"
                    :index="(c[pathKey], i)"
                  >
                    {{ i18nlocel == "en" ? resetShowName(c) : c[labelKey] }}
                  </div>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";
export default {
  name: "SidebarItem",
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    }
  },
  data() {
    return {
      config: config,
      menuItemStatus: "off",
      isblackpath: false,
      currentblackpath: "",
      currentblackpathitem: "",
      currentblackpath_isdown: true,
      currentblackpathitem_isdown: true,
      currentPathName: ""
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["roles", "i18nlocel"]),
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
    }
  },
  methods: {
    resetShowName(tagItem) {
      // 设置英文名称
      let enName = tagItem["label"];
      if (tagItem["menufiled"]) {
        tagItem["menufiled"].map(menufiled => {
          if (menufiled["sysMenuType"] == "en_US") {
            enName = menufiled["sysMenuValue"];
          }
        });
      }
      return enName;
    },
    getCurrentLeftMenu(item) {
      let currentPath = this.$route.path;
      let str = JSON.stringify(item);
      return str.indexOf(currentPath) != -1;
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some(ele =>
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
    open(item, menulevel, index = 0) {
      console.log("open---menulevel", item, menulevel, index);
      // 左侧菜单跳转
      if (menulevel === 0 && item.children.length !== 0) {
        if (item.children[0]["children"].length == 0) {
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: item.children[0][this.labelKey],
              src: item.children[0][this.pathKey],
              meta: {
                enName: this.resetShowName(item.children[0])
              }
            }),
            query: item.children[0].query
          });
        } else {
          let menu = this.$refs[item.children[0].path][0];
          menu.style.display = menu.style.display == "none" ? "block" : "none";
          let menuicon = this.$refs[item.children[0].path + "icon"];
          menuicon[0].classList.add("opScreen");
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: item.children[0]["children"][0][this.labelKey],
              src: item.children[0]["children"][0][this.pathKey],
              meta: {
                enName: this.resetShowName(item.children[0]["children"][0])
              }
            }),
            query: item.children[0]["children"][0].query
          });
        }
      }
      //无携带/index不可以跳转
      console.log('indexOf("/index")', item.path.indexOf("/index"));
      if (item.path.indexOf("/index") == -1 && item.children.length !== 0) {
        console.log("menulevel", menulevel);
        if (menulevel === 1 && item.children.length !== 0) {
          let menu = this.$refs[item.path][0];
          menu.style.display = menu.style.display == "none" ? "block" : "none";
          let menuicon = this.$refs[item.path + "icon"];
          if (menu.style.display == "none") {
            menuicon[0].classList.add("opScreen");
          } else {
            menuicon[0].classList.remove("opScreen");
          }
        }
        if (menulevel === 2) {
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: item["label"],
              src: item["path"],
              meta: {
                enName: this.resetShowName(item)
              }
            }),
            query: item["path"]
          });
        }
        return;
      }
      console.log("this.screen", this.screen);
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      console.log(
        "this.avueRouter",
        item,
        item.group,
        this.labelKey,
        this.pathKey
      );
      this.$router.$avueRouter.group = item.group;
      this.$router
        .push({
          path: this.$router.$avueRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey],
            meta: {
              enName: this.resetShowName(item)
            }
          }),
          query: item.query
        })
        .catch(() => {});
    },
    deepcurrentroute(data, path, currentpath = "") {
      data.map((item, index) => {
        if (item.path.includes(path)) {
          this.currentblackpath = currentpath;
        } else if (item.children !== 0) {
          this.deepcurrentroute(item.children, path, item.path);
        }
      });
    },
    changecurrentblackpath(item) {
      this.currentblackpath_isdown =
        this.currentblackpath == item.path
          ? !this.currentblackpath_isdown
          : true;
      this.currentblackpath = item.path;
    },
    changecurrentblackpathitem(item) {
      this.currentblackpathitem_isdown =
        this.currentblackpathitem == item.path
          ? !this.currentblackpathitem_isdown
          : true;
      this.currentblackpathitem = item.path;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-icon-arrow-right {
  display: none;
}
/deep/.el-icon-arrow-dowm {
  display: none;
}
.menuItem {
  padding: 5px 0;
  cursor: pointer;
  .itemfirst,
  .itemsecond,
  .itemthree {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-align: left;
    padding: 15px 5px 15px 15px;
    box-sizing: border-box;

    i {
      color: #666666;
      transition: all 0.3s;
    }
    span {
      width: 92%;
      display: block;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      overflow: hidden !important;
    }
  }
  .itemsecond {
    color: #666666;
    font-weight: 400;
    border-radius: 0;
    padding-left: 25px;
  }
  .itemthree {
    position: relative;
    text-align: center;
    &:hover {
      color: #808ea0;
    }
    i {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translate(-50%, -50%);
    }
  }
  .hoverCokor {
    color: #175e67;
    background-color: #eef5f6;
  }
  .isroute {
    &:hover {
      color: #175e67;
      background-color: #eef5f6;
    }
  }
  .opScreen {
    transform-origin: center center;
    transform: rotate(-180deg);
  }
  .itemfirst_black {
    text-align: center;
    position: relative;
    i {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translate(-50%, -50%);
      color: #666666;
    }
    &:hover {
      color: #667e9e;
      background-color: #fff;
    }
  }
}
.menuitemimg {
  margin: 15px 0;
}
.imgReference {
  width: 120px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  &:hover {
    background: #eef5f6;
  }
  img {
    width: 32px;
    height: 32px;
    color: #175e67;
  }
  .menuText {
    font-size: 12px;
    line-height: 12px;
    color: #175e67;
  }
}
.imgReference_on {
  background: #eef5f6;
  position: relative;
  transition: all 0.5s;
  &::before {
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-color: #175e67;
  }
  .menuText {
    color: #175e67;
  }
}
.closepopover {
  display: none;
}
</style>
