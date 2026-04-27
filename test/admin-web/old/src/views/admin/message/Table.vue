<template>
  <el-table
    :header-cell-style="tablestyle.headercellstyle"
    :row-style="tablestyle.rowstyle"
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      v-if="!showSelection"
      type="selection"
      :selectable="checkSelectable"
      width="55"
    >
    </el-table-column>
    <!-- <el-table-column label="序号" type="index" width="60"> </el-table-column> -->
    <el-table-column
      :key="index"
      v-for="(item, index) in tabletitle"
      :prop="item.prop"
      :label="item.label"
    >
      <template slot-scope="scope">
        <el-tooltip
          :content="
            scope.row[item.prop] === null ||
            scope.row[item.prop] === '' ||
            scope.row[item.prop] === undefined
              ? '--'
              : scope.row[item.prop]
          "
          effect="dark"
          placement="top"
        >
          <span class="tips">{{
            scope.row[item.prop] === null ||
            scope.row[item.prop] === "" ||
            scope.row[item.prop] === undefined
              ? "--"
              : scope.row[item.prop]
          }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      :width="`${tabbtn.length * 80}px`"
    >
      <template slot-scope="scope" class="df_sa">
        <span v-for="(s, b) in tabbtn" :key="b">
          <el-button
            v-if="
              s.name !== '删除'
                ? s.name == '编辑'
                  ? scope.row.status !== '已发送'
                  : true
                : false
            "
            style="padding: 0 5px"
            type="text"
            size="small"
            @click="playtab(s.name, scope.row, scope)"
          >
            <i :class="s.icon"></i>
            {{ s.name }}
          </el-button>
          <el-popover
            v-if="s.name == '删除'"
            :ref="scope.row.id"
            placement="top"
          >
            <p>确定吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                type="text"
                size="small"
                @click="cancledel(scope.row.id)"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="
                  cancledel(scope.row.id), playtab(s.name, scope.row, scope)
                "
                >确定</el-button
              >
            </div>

            <el-button
              style="padding: 0 5px"
              type="text"
              size="small"
              slot="reference"
              @click="showpopover(scope.row.id, true)"
            >
              <i :class="s.icon"></i> {{ s.name }}</el-button
            >
          </el-popover>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
export default {
  name: "UniUiTable",
  props: {
    tabletitle: Array,
    tableData: Array,
    tabbtn: Array,
    showSelection: Boolean,
  },
  data() {
    return {
      tablestyle: tableObj,
    };
  },

  mounted() {},

  methods: {
    playtab(name, item, scope) {
      console.log("scope", scope);
      this.$emit("playtab", name, item);
    },
    showpopover(id, data) {
      this.$refs[id]["showpopover"] = data;
    },
    handleSelectionChange(e) {
      let idarr = [];
      e.filter((item) => {
        idarr.push(item.id);
      });
      this.SelectionList = e;
      this.$emit("getSelectionId", idarr);
    },
    checkSelectable(e) {
      return true;
    },
    cancledel(id) {
      console.log("this.$refs[id]", this.$refs[id]);
      let arr = this.$refs[id];
      arr.map((item) => {
        item.doClose();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-button--mini,
.el-button--small {
  font-size: 14px;
}
</style>