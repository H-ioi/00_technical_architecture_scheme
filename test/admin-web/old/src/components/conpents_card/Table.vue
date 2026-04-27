<template>
  <div>
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
        :width="item.width == undefined ? 'auto' : item.width"
      >
        <template slot-scope="scope">
          <div
            v-if="item.prop == 'professionalImg'"
            class="professionalImg"
            v-dragscroll
          >
            <i
              @click="lookProfessionalImg(item, scope.row)"
              class="el-icon-picture-outline"
              :key="index"
              v-for="(item, index) in scope.row.files"
            ></i>
            <span
              v-if="
                scope.row.files == null ||
                scope.row.files == undefined ||
                scope.row.files.length == 0
              "
              >--</span
            >
          </div>
          <el-tooltip
            v-else
            :content="
              scope.row[item.prop] === null ||
              scope.row[item.prop] === '' ||
              scope.row[item.prop] === undefined
                ? '--'
                : String(scope.row[item.prop])
            "
            effect="dark"
            placement="top-start"
          >
            <span :class="{ tips: !safari }">{{
              scope.row[item.prop] === null ||
              scope.row[item.prop] === "" ||
              scope.row[item.prop] === undefined
                ? "--"
                : String(scope.row[item.prop])
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
                s.name !== '删除' &&
                s.name !== '提交' &&
                s.name !== '上架' &&
                s.name !== '下架'
              "
              style="padding: 0 5px"
              type="text"
              size="small"
              @click="playtab(s.name, scope.row, scope)"
            >
              <i :class="s.icon"></i>
              {{ s.name }}
            </el-button>
            <el-popover v-else :ref="scope.row.id" placement="top">
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
                :disabled="
                  (s.name == '上架' && scope.row.publishStatus) ||
                  (s.name == '下架' && !scope.row.publishStatus)
                "
                style="padding: 0 5px"
                type="text"
                size="small"
                slot="reference"
              >
                <i :class="s.icon"></i> {{ s.name }}</el-button
              >
            </el-popover>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :top="'10vh'"
      width="30%"
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { download } from "@/util/download.js";
import {
  getCardFileDetail,
  uploadCardFile,
  uploadBatchCardFile,
  getCarListInfo,
} from "@/api/card/file/index.js";
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
      dialogImageUrl: "",
      dialogVisible: false,
      fileData: {
        modulType: "1",
        outerId: "",
        scene: "position_cert_attachment",
      },
      safari: false,
    };
  },
  created() {
    this.safari = this.isSafari();
  },
  mounted() {},

  methods: {
    downloadFile(id) {
      getCardFileDetail(id, this.fileData).then((res) => {
        // this.$message.success("下载");
        let blob = new Blob([res.data]); // 返回的文件流数据
        let url = window.URL.createObjectURL(blob); // 将他转化为路径
        console.log("url", url);
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      });
    },
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
    lookProfessionalImg(id, data) {
      this.fileData.outerId = data.cardId;
      this.downloadFile(id);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-button--mini,
.el-button--small {
  font-size: 14px;
}
.professionalImg {
  display: flex;
  align-items: center;
  overflow-x: scroll;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }

  i {
    cursor: pointer;
    padding: 2px;
    font-size: 26px;
    color: #175E67;
  }
}
</style>