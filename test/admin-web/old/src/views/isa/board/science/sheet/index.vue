<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">
          {{ $t("isagroup.数据表格") }}
        </div>
      </div>
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 180px" v-if="schoolList.length > 1">
          <el-select
            style="width: 100%"
            v-model="searchFrom['schoolIds']"
            filterable
            :placeholder="$t('isagroup.选择学校')"
          >
            <el-option
              :key="k"
              v-for="(i, k) in schoolList"
              :label="i.enName"
              :value="i.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input
            style="width: 100%"
            v-model="searchFrom['originalName']"
            :placeholder="$t('common.请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: auto; margin-right: 0">
          <el-button type="primary" size="large" @click="getList">{{
            $t("btn.查询")
          }}</el-button>
          <!-- <el-button
            type="defult"
            size="large"
            icon="el-icon-refresh-right"
            @click="clear"
            >{{ $t("btn.重置") }}</el-button
          > -->
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <div>
        <el-button
          v-if="permissions['dataform_file_add']"
          class="isagroup-plain-button"
          type="primary"
          size="medium"
          plain
          @click="changeFile('add')"
          >{{ $t("btn.新增") }}</el-button
        >
        <el-button
          v-if="permissions['dataform_file_download']"
          class="isagroup-plain-button"
          type="primary"
          size="medium"
          plain
          @click="templateDownload()"
          >{{ $t("isagroup.模板下载") }}</el-button
        >
        <!-- <el-button
          class="isagroup-plain-button"
          type="primary"
          size="medium"
          plain
          @click="batchChange('batchexport')"
          >导出</el-button
        > -->
        <el-button
          v-if="permissions['dataform_file_del']"
          class="isagroup-plain-button"
          type="primary"
          size="medium"
          plain
          @click="batchChange('batchdel')"
          >{{ $t("btn.删除") }}</el-button
        >
      </div>
      <span></span>
      <!-- <PaginationInfo :paginationTotal="paginationTotal" /> -->
      <!-- <el-input
        style="width: 240px"
        suffix-icon="el-icon-search"
        v-model="searchFrom['originalName']"
        :placeholder="$t('common.请输入')"
        @keyup.enter.native="getList"
        @blur="getList"
        @clear="clear"
      ></el-input> -->
    </div>
    <div class="sheettable">
      <Table
        ref="Table"
        :showSelection="true"
        :tableTitle="sheetTableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        @playTab="playTab"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <FileModal
      v-if="showFileModal"
      ref="FileModal"
      :schoolList="schoolList"
      @resetPageList="getList"
      @closeModal="closeModal"
    />
    <Model ref="Model" />
  </div>
</template>

<script>
import {
  getSheetList,
  lookSheet,
  addSheet,
  editSheet,
  delSheet,
} from "@/api/isa/science/sheet.js";
import { downloadFile } from "@/api/upload/index.js";
import { download } from "@/util/download.js";
import { getSchoolList } from "@/api/isa/index.js";
import { mapGetters } from "vuex";
import tabletitle from "@/const/isagroup/tabletitle.js";
import Table from "@/components/isagroupcommon/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import FileModal from "./modal/file.vue";
import Model from "./modal/model.vue";
export default {
  name: "student",
  components: { Table, Pagination, PaginationInfo, FileModal, Model },
  data() {
    return {
      showFileModal: false,
      pagination: {
        size: 10,
        current: 1,
      },
      paginationTotal: 0,
      searchFrom: {
        // originalName: "",
        // schoolIds: [],
      },
      sheetTableTitle: tabletitle["sheet"],
      tableData: [],
      tableBtn: [],
      permissionsBtn: [
        // {
        //   name: "查看",
        //   type: "look",
        //   icon: "",
        //   permissions: "dataform_file_look"
        // },
        {
          name: "下载",
          type: "download",
          icon: "",
          permissions: "dataform_file_download",
        },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "dataform_file_edit",
        },

        {
          name: "删除",
          type: "del",
          icon: "",
          permissions: "dataform_file_del",
        },
      ],
      schoolList: [],
    };
  },
  created() {
    this.getSelectList();
    this.getBtn();
    this.getList();
  },
  mounted() {},
  activated() {
    this.getSelectList();
    this.getBtn();
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
  },
  methods: {
    getBtn() {
      this.tableBtn = this.permissionsBtn.filter((item) => {
        return this.permissions[item["permissions"]];
      });
    },
    getList() {
      getSheetList({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        if (res.data.success) {
          console.log("getSheetList", res.data.data);
          let { data, total, current } = res.data.data;
          this.tableData = data;
          this.paginationTotal = total;
        }
      });
    },
    delSheets(ids) {
      let data = new FormData();
      data.append("dataformFileid", ids);
      delSheet(data).then((res) => {
        if (res.data.success) {
          this.getList();
          this.$message({
            type: "success",
            message: this.$t("common.成功"),
          });
        } else {
          this.$message({
            type: "fail",
            message: "删除失败!",
          });
        }
      });
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          lookSheet(item["id"]).then((res) => {
            console.log("getInterfaceFileDetail", res);
            if (res.data.success) {
              let { files } = res.data.data;
              if (files && files.length > 0) {
                let fileItem = files[0];
                this.openloadFile(fileItem);
              } else {
                this.$message.warning(this.$t("isagroup.没有可用的文件，请上传"));
              }
            }
          });
          break;
        case "edit":
          let files = item["files"];
          if (files && files.length > 0) {
            let fileIds = [];
            fileIds = files.map((file) => {
              return file["fileId"];
            });
            item["fileIds"] = fileIds;
            this.changeFile("edit", item);
          }
          break;
        case "download":
          lookSheet(item["id"]).then((res) => {
            console.log("getInterfaceFileDetail", res);
            if (res.data.success) {
              let { files } = res.data.data;
              if (files && files.length > 0) {
                let fileItem = files[0];
                this.downloadFiles(fileItem);
              } else {
                this.$message.warning(this.$t("isagroup.没有可用的文件，请上传"));
              }
            }
          });

          break;
        case "del":
          this.delSheets([item["id"]]);
          break;
      }
    },
    batchChange(type) {
      let selectAssetsId = this.$refs["Table"].selectionId;
      if (selectAssetsId.length == 0) {
        this.$message.warning(this.$t("isagroup.请先选择数据"));
      } else {
        switch (type) {
          case "batchdel":
            this.$confirm("确认删除吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delSheets(selectAssetsId);
              })
              .catch(() => {
                // this.$message({
                //   type: "info",
                //   message: "已取消删除"
                // });
              });
            break;
          case "batchexport":
            break;
        }
      }
    },
    search() {
      console.log("55555");
    },
    clear() {
      this.searchFrom = {
        originalName: "",
      };
      this.getList();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    changeFile(type, item = {}) {
      this.showFileModal = true;
      this.$nextTick(() => {
        this.$refs["FileModal"].initData(type, item);
      });
    },
    // 浏览器查看文件
    openloadFile(fileItem) {
      downloadFile(fileItem["fileId"]).then((file) => {
        console.log("downloadFile", file);
        let blob = new Blob([file.data], {
          type: fileItem["contentType"],
        }); // 返回的文件流数据
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("download", fileItem["originalName"]);
        link.style.display = "none";
        window.open(url);
      });
    },
    // 下载文件
    downloadFiles(fileItem) {
      downloadFile(fileItem["fileId"]).then((res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    closeModal() {
      this.showFileModal = false;
    },
    getSelectList() {
      getSchoolList().then((res) => {
        console.log("res", res);
        if (res.data.success) {
          this.schoolList = res.data.data;
        }
      });
    },
    templateDownload() {
      this.$refs.Model.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
.sheettable {
  background-color: #fff;
  padding: 20px;
}
</style>
