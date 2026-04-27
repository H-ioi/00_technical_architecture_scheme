<template>
  <div class="isa_center_page">
    <div class="searchFromBox">
      <div class="df_sb searchFromBox_header">
        <div class="searchFromBox_header_titel">接口文件</div>
      </div>
      <el-form
        class="df_align_center"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item style="width: 30%">
          <el-input
            v-model="searchFrom['fname']"
            placeholder="请输入文件名"
          ></el-input>
        </el-form-item>

        <el-form-item style="width: auto; margin-right: 0">
          <el-button
            class="el-button-icon"
            type="primary"
            size="large"
            icon="el-icon-search"
            @click="search"
          ></el-button>
          <el-button
            class="el-button-icon"
            type="defult"
            size="large"
            icon="el-icon-delete"
            @click="clear"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox">
      <div>
        <el-button
          v-if="permissions['interface_file_add']"
          type="primary"
          size="medium"
          @click="changeInterfaceFile('add')"
          >新增</el-button
        >
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :showSelection="false"
        :tableTitle="tableTitle"
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
    <!-- 新增编辑弹窗 -->
    <FileModal ref="FileModal" @resetPageList="getPageList" />
    <!-- 详情弹窗 -->
    <el-dialog
      title="查看详情"
      :visible.sync="showDialog"
      width="80%"
      :before-close="() => (showDialog = false)"
    >
      <div class="tabledata">
        <div
          class="dataitem"
          :style="`width:${item['prop'] == 'fileDesc' ? '100%' : '30%'}`"
          v-for="(item, index) in tableTitle"
          :key="index"
        >
          <div class="dataitem_label">{{ item["label"] }}</div>
          <div class="dataitem_value">
            {{ currenntItem[item["prop"]] ? currenntItem[item["prop"]] : "--" }}
          </div>
        </div>
      </div>
      <div class="tabledata">
        <div class="dataitem">
          <div class="dataitem_label">文件</div>
          <div class="dataitem_value">
            <FileList
              ref="filelist"
              :scene="'interface_file_attachment'"
              :isDisabled="true"
              :showDownload="true"
              :limit="1"
              :types="'image/jpeg,image/png,.pdf, .doc, .docx,'"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getInterfaceFilePage,
  delInterfaceFile,
  getInterfaceFileDetail
} from "@/api/isa/interfacemanager.js";
import { download } from "@/util/download.js";
import moment from "moment";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import FileModal from "./modal/file.vue";
import FileList from "@/components/isacentercommon/FileList";
import {
  downloadFile,
  uploadFile,
  getFileList,
  deleteFile
} from "@/api/upload/index.js";
export default {
  name: "ISA-SEARCH",
  components: {
    Pagination,
    PaginationInfo,
    Table,
    FileModal,
    FileList
  },
  data() {
    return {
      fileModalType: "",
      showDialog: false,
      currenntItem: {},
      pagination: {
        size: 10,
        current: 1
      },
      paginationTotal: 0,
      searchFrom: {
        fname: ""
      },
      tableTitle: [
        { label: "ID", prop: "id", width: "" },
        { label: "文件名", prop: "fname", width: "" },
        { label: "创建时间", prop: "createTime", width: "" },
        { label: "更新时间", prop: "updateTime", width: "" },
        { label: "状态", prop: "fileStatusLabel", width: "" },
        { label: "文件描述", prop: "fileDesc", width: "" }
      ],
      tableBtn: [],
      btnList: [
        { name: "查看", type: "look", icon: "", permissions: "" },
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "interface_file_edit"
        },
        {
          name: "删除",
          type: "delete",
          icon: "",
          permissions: "interface_file_del"
        }
      ],
      tableData: []
    };
  },
  created() {
    this.tableBtn = this.btnList.filter(item => {
      return item["type"] == "look" || this.permissions[item["permissions"]];
    });
    this.getPageList();
  },
  mounted() {},
  activated() {
    this.getPageList();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getPageList() {
      getInterfaceFilePage({
        ...this.pagination,
        ...this.searchFrom
      }).then(res => {
        if (res.data.success) {
          let { data, total, current } = res.data.data;
          this.paginationTotal = total;
          this.tableData = data.map(item => {
            return {
              ...item,
              createTime: moment(item["createTime"]).format("YYYY/MM/DD hh:mm"),
              updateTime: !item["updateTime"]
                ? "--"
                : moment(item["updateTime"]).format("YYYY/MM/DD hh:mm"),
              fileStatusLabel: item["fileStatus"] ? "有效" : "无效"
            };
          });
        }
      });
    },
    changeInterfaceFile(type, item = {}) {
      this.$refs["FileModal"].initData(type, item);
    },
    playTab(name, item, scope) {
      this.currenntItem = item;
      switch (name) {
        case "look":
          // this.showDialog = true;
          // this.$nextTick(() => {
          //   this.openFileSaver(item["id"]);
          // });
          getInterfaceFileDetail(item["id"]).then(res => {
            console.log("getInterfaceFileDetail", res);
            if (res.data.success) {
              let { files } = res.data.data;
              if (files && files.length > 0) {
                let obj = files[0];
                downloadFile(files[0]["fileId"], obj).then(file => {
                  console.log("downloadFile", file);
                  let blob = new Blob([file.data], {
                    type: obj["contentType"]
                  }); // 返回的文件流数据
                  let url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  // link.href = url;
                  link.style.display = "none";
                  window.open(url);
                });
              } else {
                this.$message.warning("没有可用的文件，请上传！");
              }
            }
          });
          break;
        case "edit":
          this.changeInterfaceFile("edit", item);
          break;
        case "delete":
          delInterfaceFile(item["id"]).then(res => {
            this.getPageList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          break;
      }
    },
    openFileSaver(outerId) {
      let data = {
        outerId: outerId,
        scene: "interface_file_attachment"
      };
      getFileList(data).then(res => {
        let data = res.data.data;
        console.log("data", data);
        if (data.length > 0) {
          let obj = {
            id: data[0]["id"],
            type: data[0]["contentType"],
            file: "",
            name: data[0]["originalName"]
          };
          downloadFile(data[0]["id"], obj).then(file => {
            console.log("downloadFile", file);
            let blob = new Blob([file.data], { type: obj["type"] }); // 返回的文件流数据
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            window.open(url);
          });
        } else {
          this.$message.warning("没有可用的文件，请上传！");
        }
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getPageList();
    },
    // 搜索
    search() {
      this.pagination["current"] = 1;
      this.getPageList();
    },
    clear() {
      this.searchFrom["fname"] = "";
      this.pagination["current"] = 1;
      this.getPageList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
