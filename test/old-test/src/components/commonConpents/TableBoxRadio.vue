<template>
  <div class="tableStyle">
    <div :class="['tableTop', 'df_sb']" v-if="tableObj['haveTableTitle']">
      <span style="font-size: 18px; font-weight: 400">{{
        tableObj["tableTitle"]
      }}</span>
      <div :class="['df_fe']">
        <div v-for="(item, index) in tableObj['BtnObj']" :key="index">
          <el-button
            v-if="item !== '设置标签'"
            class="btn_small"
            type="primary"
            @click="playBtn(item)"
            style="margin-left: 20px"
          >
            {{ item }}
          </el-button>
          <el-dropdown v-else @command="playTags">
            <span class="el-dropdown-link">
              <el-button class="btn_small" type="primary">
                {{ item }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdowntags">
              <el-dropdown-item
                class="tags"
                v-for="(item, index) in tagsdata"
                :key="index"
                :command="item.value"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-table
      :header-cell-style="tablestyle.headercellstyle"
      :row-style="tablestyle.rowstyle"
      ref="listTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="tableObj['isSelection']"
        type="selection"
        :selectable="checkSelectable"
        width="55"
      >
      </el-table-column>
      <!-- <el-table-column type="index" :index="indexMethod"> </el-table-column> -->
      <el-table-column
        v-for="(item, index) in tableObj['labelType']"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <span v-if="item.prop == 'status'"
            ><el-switch
              @change="changeStatus(scope.row[item.prop], item)"
              v-model="scope.row[item.prop]"
              active-color="#2C88F5"
              inactive-color="#999999"
            >
            </el-switch
          ></span>
          <el-tooltip
            v-else
            :content="
              scope.row[item.prop] === null ||
              scope.row[item.prop] === '' ||
              scope.row[item.prop] === undefined
                ? '/'
                : scope.row[item.prop]
            "
            effect="dark"
            placement="top"
          >
            <span :class="{ tips: !safari }">{{
              scope.row[item.prop] === null ||
              scope.row[item.prop] === "" ||
              scope.row[item.prop] === undefined
                ? "/"
                : scope.row[item.prop]
            }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableObj['isplay']"
        fixed="right"
        label="操作"
        :width="`${tableObj['PlayBtn'].length * 80}px`"
      >
        <template slot-scope="scope" class="df_sa">
          <el-button
            style="padding: 0"
            v-for="(s, b) in tableObj['PlayBtn']"
            :key="b"
            @click.native.prevent="PlayCurrentItem(s, scope, scope.row)"
            type="text"
            size="small"
          >
            <i :class="iconData[s]"></i>
            {{ s }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
export default {
  name: "UniUiTablebox",
  props: {
    tableObj: Object,
    tableData: Array,
    tagsdata: Array,
  },
  data() {
    return {
      tablestyle: tableObj,
      iconData: {
        查看: "el-icon-view",
        编辑: "el-icon-edit-outline",
        删除: "el-icon-delete",
        关闭: "el-icon-edit-outline",
        认领: "el-icon-edit-outline",
        分配: "el-icon-edit-outline",
        转商机: "el-icon-edit-outline",
        设置标签: "el-icon-edit-outline",
      },
      SelectionList: [],
      selectitem: [],
      safari: false,
    };
  },
  created() {
    this.safari = this.isSafari();
  },
  mounted() {},

  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.listTable.clearSelection();
        this.$refs.listTable.toggleRowSelection(val.pop());
        return;
      }
      this.selectitem = val;
    },
    playBtn(item) {
      this.$emit("playBtn", item);
    },
    PlayCurrentItem(type, item, data) {
      this.$emit("playCurrentItem", type, item, data);
    },
    checkSelectable(e) {
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.tableStyle {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  .tableTop {
    color: #2c88f5;
    margin-bottom: 10px;
  }
}

/deep/.el-table--mini,
.el-table--small,
.el-table__expand-icon {
  font-size: 14px;
}
</style>