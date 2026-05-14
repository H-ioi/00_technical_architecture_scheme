<template>
  <div class="thepool_page">
    <div class="searchFromBox search" style="padding: 20px">
      <el-form
        ref="searchFrom"
        class="df_align_center searchFrom"
        :label-position="'top'"
        :inline="true"
        :model="searchFrom"
      >
        <el-form-item
          :label="$t('consult.学校')"
          prop="schools"
          style="width: 240px"
        >
          <el-select
            multiple
            v-model="searchFrom.schools"
            :placeholder="$t('consult.请选择')"
            clearable
            @clear="search"
          >
            <el-option
              v-for="item in pooldictpermissions"
              :key="item.value"
              :label="i18nlocel == 'en' ? item.enLabel : item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('consult.收集表名')"
          prop="collectionName"
          style="width: 240px"
        >
          <el-input
            v-model="searchFrom.collectionName"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('consult.活动名称')"
          prop="activityName"
          style="width: 240px"
        >
          <el-input
            v-model="searchFrom.activityName"
            :placeholder="$t('consult.请输入')"
            maxlength="20"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.创建时间')" style="width: 320px">
          <el-date-picker
            style="width: 100%"
            v-model="searchFrom.createTime"
            type="daterange"
            :range-separator="$t('consult.至')"
            :start-placeholder="$t('consult.开始')"
            :end-placeholder="$t('consult.结束')"
            :value-format="'yyyy-MM-dd'"
            :format="'yyyy-MM-dd'"
            clearable
            @clear="search"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 160px; margin-right: 0">
          <div class="df_sb">
            <el-button
              type="defult"
              size="small"
              icon="el-icon-search"
              round
              @click="search"
              >{{ $t("consult.搜索") }}</el-button
            >
            <el-button type="text" size="small" round @click="clear">
              <div class="clear_btn">
                <img src="/thepool/other/clear.png" alt="" />
                <span> {{ $t("consult.清除") }}</span>
              </div>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="df_sb palyTableBox" style="padding-top: 0">
      <div class="df_sb">
        <el-button
          v-if="permissions['thepool_collection_add']"
          type="primary"
          size="small"
          round
          @click="addTemplate"
          >{{ $t("consult.新增") }}</el-button
        >
        <el-button type="primary" size="small" round @click="copyCollection">{{
          $t("consult.复制")
        }}</el-button>
      </div>
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="true"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <div
        style="padding: 0"
        class="df_sb palyTableBox"
        v-if="paginationTotal > 10"
      >
        <PaginationInfo :paginationTotal="paginationTotal" />
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </div>
    <AddCollection ref="AddCollection" @getList="getList" />
    <el-dialog
      :title="$t('consult.二维码')"
      :visible.sync="showModal"
      width="400px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox">
        <QRCode v-if="showModal" ref="QRCode" :path="path" :showBtn="true" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getCollectionList,
  delCollection,
  copyCollection,
} from "@/api/consult/collection.js";
import { getDynamicTemplateList } from "@/api/space/templatedynamic.js";
import { consult } from "@/const/consult/index.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import AddCollection from "@/page/thepool/modal/addcollection.vue";
import QRCode from "@/components/common/QRcode.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    AddCollection,
    QRCode,
  },
  data() {
    return {
      tableTitle: consult["acTemplateTableTitle"],
      tableData: [],
      tableBtn: [
        // {
        //   name: "查看",
        //   type: "look",
        //   permissions: "look",
        //   icon: "el-icon-view",
        // },
        {
          name: "二维码",
          type: "code",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "复制链接",
          type: "link",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "规则",
          type: "show",
          permissions: "thepool_collection_edit",
          icon: "el-icon-view",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "thepool_collection_edit",
          icon: "el-icon-view",
        },
        {
          name: "删除",
          type: "del",
          permissions: "thepool_collection_del",
          icon: "el-icon-view",
        },
      ],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchData: {},
      searchFrom: {
        collectionName: "",
        activityName: "",
        createTime: [],
      },
      codeId: "",
      showModal: false,
      path: "",
    };
  },
  computed: {
    ...mapGetters([
      "dictionary",
      "i18nlocel",
      "permissions",
      "dictpermissions",
      "pooldictionary",
      "pooldictpermissions",
    ]),
  },

  created() {
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
    this.getList();
  },

  watch: {
    i18nlocel() {
      console.log("i18nlocel", this.i18nlocel);
    },
  },
  mounted() {},
  activated() {
    this.getList();
  },
  methods: {
    getList() {
      getCollectionList({
        ...this.pagination,
        ...this.searchData,
      }).then((res) => {
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data || [];
          this.paginationTotal = Number(total);
          this.tableData.map((item) => {
            item["activityNames"] = item["activityNames"]
              ? String(item["activityNames"])
              : "--";
            item["statusLabel"] = item["linkStatus"]
              ? this.$t("consult.有效")
              : this.$t("consult.失效");
            item["schoolsLabel"] = this.$getListLabels(
              this.pooldictionary,
              item["schoolIds"]
            );
          });
        }
      });
    },
    delCollection(id) {
      delCollection(id).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.getList();
        }
      });
    },
    copyCollection() {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId.length == 1) {
        this.$alert(this.$t("consult.确定复制吗"), this.$t("consult.复制"), {
          confirmButtonText: this.$t("consult.确定"),
          cancelButton: this.$t("consult.取消"),
          showCancelButton: true,
        })
          .then(() => {
            copyCollection({
              collectionId: selectionId[0],
            }).then((res) => {
              if (res.data.success) {
                this.$refs["Table"].clearSelection();
                this.$message.success(this.$t("consult.成功"));
                this.getList();
              }
            });
          })
          .catch(() => {
            this.$refs["Table"].clearSelection();
            // this.$message({
            //   type: "info",
            //   message: "已取消删除",
            // });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择一个要复制的收集表",
        });
        return;
      }
    },

    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "look":
          this.$router.push("/thepool/activity/templateresult?id=" + item.id);
          break;
        case "edit":
          this.$router.push(
            "/thepool/activity/templateform?type=edit&id=" + item.id
          );
          break;
        case "show":
          this.$router.push(
            "/thepool/activity/templateform_show?type=edit&id=" + item.id
          );
          break;
        case "del":
          getDynamicTemplateList({
            scene: "collection_dynamic",
            outerId: item.id,
          }).then((res) => {
            if (res.data.success) {
              let { total } = res.data.data;
              if (total > 0) {
                this.$alert(
                  this.$t("consult.当前收集表已有数据,确定要删除吗"),
                  this.$t("consult.删除"),
                  {
                    confirmButtonText: this.$t("consult.确定"),
                  }
                ).then(() => {
                  this.delCollection(item.id);
                });
              } else {
                this.delCollection(item.id);
              }
            }
          });

          break;
        case "link":
          this.$copyText(
            `${process.env.VUE_APP_BASE_POOL}/#/thepool/activity/questionnaire?id=${item.id}`
          ).then(
            (e) => {
              this.$message.success(this.$t("consult.已复制到粘贴板"));
            },
            (e) => {
              console.log("复制失败：", e);
            }
          );
          break;
        case "code":
          this.codeId = item.id;
          this.path = `${process.env.VUE_APP_BASE_POOL}/#/thepool/activity/questionnaire?id=${item.id}`;
          this.showModal = true;
          //   this.$nextTick(() => {
          //     this.$refs.QRCode.creatQrCode();
          //   });
          break;
      }
    },
    rowClick(row, column, event) {
      console.log("rowClick", row);
      this.$router.push("/thepool/activity/templateresult?id=" + row.id);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    // 搜索
    search() {
      this.pagination["pageNum"] = 1;
      this.searchData = {};
      this.searchData["schools"] = this.searchFrom["schools"];
      this.searchData["collectionName"] = this.searchFrom["collectionName"];
      this.searchData["activityName"] = this.searchFrom["activityName"];
      if (this.searchFrom["createTime"].length > 0) {
        this.searchData["createTimeBegin"] = this.searchFrom["createTime"][0];
        this.searchData["createTimeEnd"] = this.searchFrom["createTime"][1];
      }
      this.getList();
    },
    // 清除搜索
    clear() {
      this.pagination["pageNum"] = 1;
      this.searchData = {};
      this.searchFrom = {
        collectionName: "",
        activityName: "",
        createTime: [],
      };
      this.getList();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return (
          res["permissions"] == "look" || this.permissions[res["permissions"]]
        );
      });
      return tableBtn;
    },
    getDatastr(id, data) {
      console.log("getDataLabel", id, data);
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    addTemplate() {
      //   this.$refs["AddCollection"].show();
      this.$router.push("/thepool/activity/templateform?type=add");
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-range__close-icon {
  display: none;
}
.searchFrom {
  // justify-content: space-between;
}
.df_align_center {
  flex-wrap: wrap;
}
</style>
