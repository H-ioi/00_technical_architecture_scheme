<template>
  <el-popover placement="left" width="200" trigger="manual" v-model="showPopover">
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
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
    <div class="df_sb" style="padding-top: 20px">
      <el-button type="defult" @click="showPopover = false">取消</el-button>
      <el-button type="primary" @click="saveConfirm">确定</el-button>
    </div>
    <i slot="reference" class="el-icon-menu tabletmenu" @click="isShowPopover"></i>
  </el-popover>
</template>
<script>
import { mapGetters } from "vuex";
import { selectSyncTableTitle } from "@/const/assets/tablelist.js";
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
      console.log("showPopover", this.showPopover);
      if (this.showPopover) {
        this.$nextTick(() => {
          const thePool_LocalCache = this.$store.getters.thePool_LocalCache;
          console.log("thePool_LocalCache", thePool_LocalCache);
          this.tableTitle = thePool_LocalCache[this.type]
            ? _.cloneDeep(thePool_LocalCache[this.type])
            : _.cloneDeep(selectSyncTableTitle);
          console.log("this.tableTitle ", this.tableTitle);
          this.tableTitle.map((item) => {
            if (item["show"]) {
              this.defaultCheckedKeys.push(item["prop"]);
            }
          });
          console.log(" this.defaultCheckedKeys", this.defaultCheckedKeys);
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
      console.log("saveConfirm", checkKeyList);
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
        console.log("handleDrop", checkedKeys);
        this.$refs["tree"].setCheckedKeys(checkedKeys, true);
      });
    },
    changeCheckbox(checkedNodes, data) {
      console.log("changeCheckbox", data);
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
