<template>
  <div>
    <el-table
      ref="multipleTable"
      :key="tabelKey"
      :data="tableData"
      style="width: 100%"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      :row-key="getRowKeys"
      :header-cell-style="tablestyle.headercellstyle"
      :cell-style="tablestyle.rowstyle"
      :row-class-name="tableRowClassName"
      @select="selectCheck"
      @select-all="selectAllCheck"
    >
      <!-- 多选按钮 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="50"
        :selectable="checkSelectable"
        :reserve-selection="false"
      >
      </el-table-column>
      <el-table-column
        v-for="(i, k) in tableTitle"
        :key="k"
        :prop="i.prop"
        :label="i.label"
        show-overflow-tooltip
        :width="`${i.width}`"
        :fixed="i.fixed"
      >
        <template slot-scope="scope">
          <span
            v-if="i.prop != 'pictureList'"
            class="tableColumnSpan"
            :title="
              scope.row[i.prop] === null ||
              scope.row[i.prop] === '' ||
              scope.row[i.prop] === undefined
                ? '--'
                : String(scope.row[i.prop])
            "
          >
            {{
              scope.row[i.prop] === null ||
              scope.row[i.prop] === "" ||
              scope.row[i.prop] === undefined
                ? "--"
                : String(scope.row[i.prop])
            }}
          </span>
          <span v-else>
            <span v-if="scope.row['pictureList'].length == 0">--</span>
            <span v-else>
              <img
                @click="showImgMax(imgSrc['max'], scope.row.id)"
                :ref="`IMG_${scope.row.id}`"
                style="width: 26px; height: 26px;cursor: pointer;"
                v-for="(imgSrc, imgIndex) in scope.row['pictureList']"
                :key="imgIndex"
                :src="downloadFile(imgSrc['min'], scope.row.id)"
                alt=""
              />
              <!-- <span
              :ref="'ImgItem' + imgIndex"
              v-for="(imgSrc, imgIndex) in scope.row['pictureList']"
              :key="imgIndex"
            >
              <ImgItem :imgItem="imgSrc" :rowIndex="scope.$index" />
            </span> -->
            </span>
          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        v-if="tableBtn.length > 0"
        fixed="right"
        :label="
          $route.path.indexOf('thepool') == -1 ? '操作' : $t('consult.操作')
        "
        :width="`${tableBtn.length * 60}px`"
      >
        <template slot-scope="scope">
          <div class="df_align_center table_textbtn">
            <span v-for="(s, b) in tableBtn" :key="b">
              <el-button
                v-if="!popoverBbtn.includes(s.name)"
                type="text"
                size="small"
                :disabled="scope.row.status === 0 ? true : false"
                @click.stop="playTab(s.type, scope.row, scope)"
              >
                {{ s.name }}
              </el-button>
              <el-popover
                v-else
                :ref="scope.$index"
                placement="top"
                class="popoverBtn"
              >
                <div class="df_sb">
                  <el-button
                    style="width: 48%"
                    type="defult"
                    size="mini"
                    @click="cancledel(scope.$index)"
                    >{{ "取消" }}</el-button
                  >
                  <el-button
                    style="width: 48%"
                    type="primary"
                    size="mini"
                    @click.stop="
                      cancledel(scope.$index), playTab(s.type, scope.row, scope)
                    "
                    >{{ "确定" }}</el-button
                  >
                </div>

                <el-button
                  type="text"
                  size="small"
                  slot="reference"
                  :disabled="
                    (s.name == '禁用' && !Number(scope.row.status)) ||
                    (s.name == '启用' && Number(scope.row.status))
                      ? true
                      : false
                  "
                >
                  <span>{{ s.name }}</span>
                </el-button>
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :top="'10vh'"
      width="50%"
      title="图片"
    >
      <img width="100%" :src="imgMaxSrc" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { tableObj } from "@/const/tabledata/index";
import { downloadFile } from "@/api/upload/index.js";
import ImgItem from "./imgItem";
export default {
  name: "PCOrderTable",
  components: {
    ImgItem
  },
  props: {
    tableTitle: {
      type: Array,
      require: true
    },
    tableData: {
      type: Array,
      require: true
    },
    tableBtn: {
      type: Array,
      require: true
    },
    showSelection: {
      type: Boolean,
      require: false,
      default: true
    },
    showSearch: {
      type: Boolean,
      require: false,
      default: false
    },
    tabelKey: {
      type: Number
    }
  },
  data() {
    return {
      dialogVisible: false,
      imgMaxSrc:"",
      search: "",
      tablestyle: {
        headercellstyle: {
          background: "#F8F8F8",
          color: " #333333",
          "font-size": "16px",
          "font-weight": "400",
          height: "60px"
        },
        rowstyle: {
          color: " #999999",
          "font-size": "14px",
          "font-weight": "400",
          height: "54px",
          border: "none",
          padding: "0px"
        }
      },
      selectionId: [],
      popoverBbtn: ["删除", "启用", "禁用", "闲置", "使用", "报废"],
      firstUrl: "",
      imgSrcList: [],
      imgSrc: ""
    };
  },

  mounted() {},

  methods: {
    downloadFile(id, rowId) {
      // console.log("downloadFile", rowId);
      downloadFile(id, {
        scene: "asset_sync_file_uni",
        rowId: rowId
      }).then(res => {
        let blob = new Blob([res.data]); // 返回的文件流数据
        let minUrl = window.URL.createObjectURL(blob); // 将他转化为路径
        console.log("downloadFile", minUrl);
        this.$nextTick(() => {
          console.log(
            "downloadFile",
            `IMG_${rowId}`,
            this.$refs[`IMG_${rowId}`]
          );
          this.$refs[`IMG_${rowId}`][0].src = minUrl;
          this.$refs[`IMG_${rowId}`][1].src = minUrl;
        });
      });
    },
    showImgMax(id,rowId) {
      downloadFile(id, {
        scene: "asset_sync_file_uni",
        rowId:rowId
      }).then(res => {
        this.dialogVisible = true;
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径
        this.imgMaxSrc = url;
      });
    },
    rowClick(row, column, event) {
      this.$emit("rowClick", row, column, event);
    },
    playTab(name, item, scope) {
      this.$emit("playTab", name, item);
    },
    cancledel(id) {
      console.log("this.$refs[id]", this.$refs[id]);
      let arr = this.$refs[id];
      arr.map(item => {
        item.doClose();
      });
    },

    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 多选
    handleSelectionChange(arr) {
      this.selectionId = [];
      arr.map(i => {
        this.selectionId.push(i.id);
      });
    },
    checkSelectable(e) {
      return true;
    },
    // 动态更改一行table样式
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    selectCheck(selection, row) {
      console.log("selectCheck, row", selection, row);
    },
    selectAllCheck(selection) {
      console.log("selectAllCheck", selection);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    getRowKeys(row) {
      return row.id;
    }
  }
};
</script>

<style lang="scss" scoped>
.isEnable {
  font-size: 14px;
  padding: 4px 10px;
  box-sizing: border-box;
  color: #447777;
  background: rgba(23, 103, 103, 0.15);
}

.isDisable {
  font-size: 14px;
  padding: 4px 10px;
  box-sizing: border-box;
  color: #666666;
  background: rgba(153, 153, 153, 0.15);
}

.tableColumnSpan {
  display: inline-block;
  width: 100%;
  height: 54px;
  line-height: 54px;
}
</style>
