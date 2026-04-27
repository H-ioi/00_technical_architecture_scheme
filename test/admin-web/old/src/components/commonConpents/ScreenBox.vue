<template>
  <div class="screenBox">
    <div :class="['title', 'df_sb', { oplist: isOpScreen }]">
      <span style="font-size: 18px">筛选查询</span>
      <span @click="isOpScreenall"
        >{{ isOpScreen ? "收起" : "展开"
        }}<i
          style="margin-left: 10px; margin-right: 5px"
          :class="['el-icon-arrow-down', { opScreen: isOpScreen }]"
        ></i
      ></span>
    </div>
    <div v-show="isOpScreen">
      <div
        :class="['screen', k < 1 ? 'pt' : '']"
        v-for="(i, k) in filterdata"
        :key="k"
      >
        <div :class="['screen_list', { oplist: i.isOpen }]">
          <!-- <div :class="['screen_list']"> -->
          <div class="screen_type">{{ i.name }}</div>
          <div
            @click="chooseAll(i.type)"
            :class="[
              'screen_all',
              {
                isChoose: typedata[i.type].indexOf('全部') !== -1,
              },
            ]"
          >
            全部
          </div>
          <div class="screen_item" :id="i.type">
            <span
              class="itembox"
              v-for="(s, b) in i.selectArr"
              :key="b"
              @click="ischoose(s, i.type)"
            >
              <span
                :class="{
                  isChoose: typedata[i.type].indexOf(s.value) !== -1,
                }"
                >{{ s.label }}</span
              >
            </span>
          </div>
          <div
            class="screen_play"
            @click="i.isOpen = !i.isOpen"
            v-if="i.isshow"
          >
            <span>{{ i.isOpen ? "收起" : "展开" }}</span>
            <i :class="['el-icon-arrow-down', { open: i.isOpen }]"></i>
          </div>
        </div>
      </div>
      <div class="isScreen" style="padding-bottom: 0">
        <div class="screen_list">
          <div class="screen_type">已选条件</div>
          <div class="screen_item">
            <el-button
              type="primary"
              plain
              v-for="(s, b) in isScreenItem"
              :key="b"
              >{{ s.label
              }}<i
                class="el-icon-close el-icon--right"
                @click="clearCurrentIten(s)"
              ></i
            ></el-button>
          </div>
          <div
            class="screen_play"
            @click="clearAll"
            v-if="isScreenItem.length !== 0"
          >
            清除全部
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UniUiScreenbox",
  props: {
    filterdata: Array,
    sentdata: Object,
  },
  data() {
    return {
      isOpScreen: false,
      isOpen: {},
      isScreenItem: [],
      typedata: {
        client_type: ["全部"],
        client_level: ["全部"],
        client_district: ["全部"],
        client_tag: ["全部"],
        contacter_tag: ["全部"],
        contract_type: ["全部"],
        follow_type: ["全部"],
        file_scene: ["全部"],
        bussiness_type: ["全部"],
        clue_quality: ["全部"],
        source_dept: ["全部"],
        source_way: ["全部"],
        opportunity_level: ["全部"],
        rebackTime: ["全部"],
        expireTime: ["全部"],
        hasContract: ["全部"],
        followUser: ["全部"],
        signer: ["全部"],
        followUserIds: ["全部"],
        signerIds: ["全部"],
        opportunity_stage: ["全部"],
        createUser: ["全部"],
        createrIds: ["全部"],
      },
    };
  },
  created() {
    let path = this.$route.path;
    // if (path.indexOf("clue") !== -1 || path.indexOf("opportunity") !== -1) {
    //   this.isOpScreen = true;
    // }
    if (
      path == "/clue/my/index" ||
      path == "/clue/pool/index" ||
      path == "/opportunity/my/index"
    ) {
      this.isOpScreen = true;
    }
  },
  mounted() {
    this.initSelection();
  },

  methods: {
    initSelection() {
      let path = this.$route.path;
      let query = this.$route.query;
      if (!query.statistics) return;
      let obj = {
        label: query.label,
        value: Number(query.value),
      };

      switch (path) {
        case "/contact/client/index":
          obj["type"] = "createrIds";
          this.typedata["createrIds"] = [];
          this.typedata["createrIds"].push(Number(query.value));
          break;
        case "/contact/contacter/index":
          obj["type"] = "createrIds";
          this.typedata["createrIds"] = [];
          this.typedata["createrIds"].push(Number(query.value));
          break;
        case "/contract/archives/index":
          obj["type"] = "signerIds";
          this.typedata["signerIds"] = [];
          this.typedata["signerIds"].push(Number(query.value));
          break;
        case "/clue/archives/index":
          obj["type"] = "createUser";
          this.typedata["createUser"] = [];
          this.typedata["createUser"].push(Number(query.value));
          break;
        case "/opportunity/archives/index":
          console.log(2222);
          if (query.stage) {
            console.log(1111111);
            obj["type"] = "opportunity_stage";
            obj["value"] = String(obj["value"]);
            this.typedata["opportunity_stage"] = [];
            this.typedata["opportunity_stage"].push(query.value);
          } else {
            obj["type"] = "createUser";
            this.typedata["createUser"] = [];
            this.typedata["createUser"].push(Number(query.value));
          }

          break;
      }
      this.isScreenItem.push(obj);
      console.log("filterdata", this.filterdata);
      console.log("this.typedata", this.typedata);
      console.log("this.isScreenItem", this.isScreenItem);
      setTimeout(() => {
        this.screendata();
      }, 1000);
    },
    isOpScreenall() {
      this.isOpScreen = !this.isOpScreen;
      this.$emit("getbox", this.filterdata);
    },
    //清楚筛选条件
    clearAll() {
      this.isScreenItem = [];
      for (const key in this.typedata) {
        this.typedata[key] = ["全部"];
      }
      this.screendata();
    },
    chooseAll(k) {
      this.deleteItem(this.typedata[k], k);
    },
    deleteItem(data, k) {
      data.map((item) => {
        this.isScreenItem.map((res, index) => {
          if (item == res.value && k == res.type) {
            this.isScreenItem.splice(index, 1);
          }
        });
      });
      this.typedata[k] = ["全部"];
      this.screendata();
    },
    // 选择
    ischoose(item, type) {
      let index = this.typedata[type].indexOf("全部");
      if (index !== -1) {
        this.typedata[type].splice(index, 1);
      }
      this.typedata[type].push(item.value);
      if (this.isScreenItem.length == 0) {
        this.isScreenItem.push({ ...item, type: type });
        this.screendata();
      } else {
        let ishave = false;
        this.isScreenItem.map((key) => {
          if (item.value == key.value && type == key.type) {
            ishave = true;
          }
        });
        if (!ishave) {
          this.isScreenItem.push({ ...item, type: type });
          this.screendata();
        }
      }
      console.log("this.isScreenItem", this.isScreenItem);
    },
    // 删除
    clearCurrentIten(data) {
      this.isScreenItem.map((item, index) => {
        if (item.value == data.value && item.type == data.type) {
          this.isScreenItem.splice(index, 1);
        }
      });

      if (this.typedata[data.type]) {
        this.typedata[data.type].map((i, k) => {
          if (i == data.value) {
            this.typedata[data.type].splice(k, 1);
            if (this.typedata[data.type].length == 0) {
              this.typedata[data.type] = ["全部"];
            }
          }
        });
      }
      this.screendata();
    },
    screendata() {
      console.log(6666666, this.filterdata, this.typedata, this.sentdata);
      let obj = {};
      this.filterdata.map((item) => {
        if (this.typedata[item.type]) {
          if (this.typedata[item.type][0] == "全部") {
            obj[this.sentdata[item.type]] = [];
          } else {
            // let list = [];
            // this.typedata[item.type].map((i) => {
            //   list.push(i.value);
            // });
            obj[this.sentdata[item.type]] = this.typedata[item.type];
          }
        }
      });
      console.log("objoo", obj);
      this.$emit("screendata", obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.screenBox {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: Alibaba PuHuiTi;
  font-size: 14px;
  border: 1px solid #f2f2f2;
  margin-bottom: 30px;
  .text {
    line-height: 32px;
    text-align: center;
    font-weight: 600;
    color: #999999;
    background-color: #fff;
    &:hover {
      background: #f5f7fe;
      color: #2c88f5;
    }
  }
  .title {
    font-weight: 600;
    color: #2c88f5;
    span {
      &:first-child {
        font-size: 14px;
        font-weight: 600;
      }
      &:last-child {
        font-size: 14px;
        cursor: pointer;
      }
    }
    i {
      transition: all 0.5s;
    }
    .opScreen {
      transform-origin: center center;
      transform: rotate(180deg);
    }
  }
  .oplist {
    height: auto !important;
    overflow: none;
  }
  .screen,
  .isScreen {
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .pt {
    padding-top: 15px;
  }
  .screen_list {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: 32px;
    overflow: hidden;
    transition: all 1s;
    box-sizing: border-box;
    .screen_all {
      width: 60px;
      @extend .text;
      margin-right: 10px;
      cursor: pointer;
      font-weight: 300;
    }
    .screen_item {
      flex: 1;
      .itembox {
        padding: 0 5px;
        box-sizing: border-box;
        span {
          display: inline-block;
          padding: 0 20px;
          border-radius: 5px;
          margin-bottom: 10px;
          @extend .text;
          cursor: pointer;
          font-weight: 300;
        }
      }
    }
    .screen_play {
      height: 32px;
      line-height: 32px;
      padding: 0 5px;
      color: #2c88f5;
      font-weight: 600;
      cursor: pointer;
      span {
        margin-right: 10px;
      }
      i {
        transition: all 0.5s;
      }
      .open {
        transform-origin: center center;
        transform: rotate(180deg);
      }
    }
  }
  .screen_type {
    width: 60px;
    line-height: 32px;
    text-align: left;
    font-weight: 600;
    color: #333333;
    margin-right: 35px;
  }
  .isScreen {
    border: none;
    .screen_list {
      height: auto;
    }
    /deep/.el-button {
      margin-bottom: 10px;
    }
  }
  .isChoose {
    background: #f5f7fe !important;
    color: #2c88f5 !important;
  }
}
</style>