<template>
  <div class="thepool_page">
    <el-popover
      placement="left"
      width="200"
      trigger="manual"
      v-model="showPopover"
    >
      <el-tree
        v-if="showPopover"
        ref="tree"
        show-checkbox
        draggable
        :data="tableTitle"
        node-key="prop"
        default-expand-all
        @node-drop="handleDrop"
        @check="changeCheckbox"
        :allow-drop="allowDrop"
        :default-checked-keys="defaultCheckedKeys"
      >
        <span slot-scope="{ node, data }">
          <span>{{ $t("consult")[node.label] }}</span>
        </span>
      </el-tree>
      <div class="df_sb" style="padding-top: 20px">
        <el-button type="defult" round @click="showPopover = false">{{
          $t("btn.取消")
        }}</el-button>
        <el-button type="primary" round @click="saveConfirm">{{
          $t("btn.确定")
        }}</el-button>
      </div>
      <i
        slot="reference"
        class="el-icon-menu tabletmenu"
        @click="isShowPopover"
      ></i>
    </el-popover>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
export default {
  props: {
    type: {
      require: true,
      type: String,
    },
  },
  data() {
    return {
      showPopover: false,
      tableTitle: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultCheckedKeys: [],
      tableName: {
        mylist: "enquiryTableMy",
        alllist: "enquiryTableList",
      },
    };
  },
  computed: {
    // ...mapGetters(["thePool_LocalCache"])
  },
  created() {},
  methods: {
    isShowPopover() {
      this.defaultCheckedKeys = [];
      this.tableTitle = [];
      this.showPopover = !this.showPopover;
      if (this.showPopover) {
        this.$nextTick(() => {
          const thePool_LocalCache = this.$store.getters.thePool_LocalCache;
          if (thePool_LocalCache[this.type]) {
            this.tableTitle = _.cloneDeep(thePool_LocalCache[this.type]);
          } else {
            switch (this.type) {
              case "enquiryTableMy":
                this.tableTitle = _.cloneDeep(consult["selectTableTitle"]);
                break;
              case "enquiryTableList":
                this.tableTitle = _.cloneDeep(consult["selectTableTitle"]);
                break;
              case "studentTitle":
                this.tableTitle = _.cloneDeep(consult["studentTitle"]);
                break;
              case "studentMyTitle":
                this.tableTitle = _.cloneDeep(consult["studentTitle"]);
                break;
            }
          }
          this.tableTitle.map((item) => {
            if (item["show"]) {
              this.defaultCheckedKeys.push(item["prop"]);
            }
          });
        });
      }
    },
    saveConfirm() {
      let keyList = this.$refs["tree"].getCheckedKeys();
      let checkKeyList = this.tableTitle.map((item) => {
        return {
          ...item,
          show: keyList.includes(item["prop"]),
        };
      });
      this.$store.commit("SET_ThePool_LocalCache", {
        name: this.type,
        value: checkKeyList,
      });
      this.showPopover = false;
      setTimeout(() => {
        this.$emit("resetTableTitle");
      }, 300);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      //   console.log("handleDrop", 11111);
      this.$nextTick(() => {
        let checkedKeys = [];
        this.tableTitle.map((item) => {
          if (item["show"]) {
            checkedKeys.push(item["prop"]);
          }
        });
        this.$refs["tree"].setCheckedKeys(checkedKeys, true);
      });
    },
    changeCheckbox(checkedNodes, data) {
      let checkList = data["checkedKeys"];
      this.tableTitle.map((item) => {
        item["show"] = checkList.includes(item["prop"]);
      });
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        return type === "prev" || type === "next";
      } else {
        // 不同级进行处理
        return false;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
