<template>
  <div>
    <div class="df_sb palyTableBox">
      <div class="df_sb">
        <div class="df_sb">
          <el-button
            v-if="permissions['thepool_user_guardian_add']"
            type="primary"
            size="small"
            @click="bindActivity"
            >{{ $t("consult.关联活动") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_user_guardian_add']"
            type="primary"
            size="small"
            @click="exportCollection"
            >{{ $t("consult.导出") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_user_guardian_add']"
            type="primary"
            size="small"
            @click="batchPlayTab('pass')"
            >{{ $t("consult.批量审批通过") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_user_guardian_add']"
            type="primary"
            size="small"
            @click="batchPlayTab('reject')"
            >{{ $t("consult.批量审批拒绝") }}</el-button
          >
        </div>
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" />
    </div>
    <div class="tableBox">
      <Table
        ref="Table"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        :showSelection="true"
        :hasEnLabel="false"
        @playTab="playTab"
        @rowClick="rowClick"
      />
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <BindActivity ref="BindActivity" @updateData="updateData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getCollectionDetail,
  passCollection,
  rejectCollection,
  exportCollection,
  batchPassCollection,
  batchRejectCollection,
} from "@/api/consult/collection.js";
import {
  getTemplateOuterId,
  getDynamicTemplateList,
} from "@/api/space/templatedynamic.js";
import { download } from "@/util/download.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
import BindActivity from "@/page/thepool/modal/bindactivity.vue";
import QRCode from "qrcodejs2";
import { bind } from "lodash";

export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    BindActivity,
  },
  data() {
    return {
      tableTitle: [],
      tableData: [{ qqq: 1111 }],
      tableBtn: [
        // {
        //   name: "报名",
        //   type: "Sign up",
        //   permissions: "look",
        //   icon: "el-icon-view",
        // },
        {
          name: "审批",
          type: "Approval",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "拒绝",
          type: "Refuse",
          permissions: "code",
          icon: "el-icon-view",
        },
        // {
        //   name: "重新审批",
        //   type: "Re-approval",
        //   permissions: "thepool_user_guardian_edit",
        //   icon: "el-icon-view",
        // },
      ],
      collectionInfo: { outerId: "", scene: "collection_dynamic" },
      pagination: {
        size: 10,
        current: 1,
        scene: "collection_dynamic",
        outerId: "",
      },
      paginationTotal: 0,
      templateFormId: "",
      templateFrom: {},
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

  watch: {
    i18nlocel() {
      console.log("i18nlocel", this.i18nlocel);
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    this.creatQrCode();
  },
  activated() {
    this.initData();
  },
  methods: {
    async initData() {
      if (this.$route.query.id) {
        this.collectionInfo["outerId"] = this.$route.query.id;
        this.pagination["outerId"] = this.$route.query.id;
        this.templateFrom = await this.getDetail();
        this.tableTitle = await this.getTemplateOuterId();
        this.tableTitle = [
          { label: "创建时间", prop: "createTime" },
          { label: "状态", prop: "status" },
          ...this.tableTitle,
        ];
        this.getList();
      }
    },
    async updateData() {
      this.templateFrom = await this.getDetail();
      this.setFormStatus();
    },
    creatQrCode() {
      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: "http://172.16.34.137:8020/#/thepool/activity/questionnaire?id=15", // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    setFormStatus() {
      this.tableData.map((item) => {
        item["status"] = !this.templateFrom.dynamicStatus.hasOwnProperty(item["id"])
          ? "待审批"
          : this.templateFrom.dynamicStatus[item["id"]] == 1
          ? "已审批"
          : "已拒绝";
      });
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        getCollectionDetail(this.collectionInfo["outerId"]).then((res) => {
          if (res.data.success) {
            let data = res.data.data;
            let templateFrom = {
              collectionName: data.collectionName,
              activitieNames: String(data.activities.map((item) => item.activityName)),
              activitieIds: data.activities.map((item) => item.id),
              guideline: data.guideline,
              dynamicStatus: data.dynamicStatus,
            };
            resolve(templateFrom);
          }
        });
      });
    },
    getTemplateOuterId() {
      return new Promise((resolve, reject) => {
        getTemplateOuterId(this.collectionInfo).then((res) => {
          console.log("getTemplateOuterId", res);
          if (res.data.success) {
            if (res.data.data.length > 0) {
              let fields = res.data.data[0].fields;
              let tableTitle = fields.map((item) => {
                return {
                  label: item.label,
                  prop: item.id,
                  sort: item.sort,
                  type: item.type,
                  properties: item.properties,
                };
              });
              tableTitle = tableTitle.sort((a, b) => {
                return a.sort - b.sort;
              });
              resolve(tableTitle);
            } else {
              resolve(null);
            }
          } else {
          }
        });
      });
    },
    getList() {
      getDynamicTemplateList(this.pagination).then((res) => {
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = [];
          this.paginationTotal = total;
          data.map((item) => {
            let obj = { createTime: item.createTime };
            item.fields.map((l) => {
              obj["id"] = l.id;
              obj[l.templateFormFieldId] = this.getTemplateValue(
                l.templateFormFieldId,
                l.value
              );
            });
            this.tableData.push(obj);
            console.log("getDynamicTemplateList", this.tableData);
          });
          this.setFormStatus();
        }
      });
    },
    exportCollection() {
      this.$alert("确认导出吗?", "导出", {
        confirmButtonText: "确定",
        callback: (action) => {
          exportCollection(this.collectionInfo["outerId"]).then(async (res) => {
            this.$message.success(this.$t("consult.成功"));
            download(res.data, res.headers["content-disposition"]);
          });
        },
      });
    },
    batchPlayTab(type) {
      let selectionId = this.$refs["Table"].selectionId;
      if (selectionId == 0) {
        this.$message.error(this.$t("consult.请选择咨询信息"));
      } else {
        let data = new FormData();
        data.append("collectionId", this.collectionInfo["outerId"]);
        data.append("dynamicIds", selectionId);
        if (type == "pass") {
          this.$alert("确认批量审核通过吗?", "批量审核", {
            confirmButtonText: "确定",
            callback: (action) => {
              this.batchPassCollection(data);
            },
          });
        } else if (type == "reject") {
          this.$alert("确认批量拒绝通过吗?", "批量拒绝", {
            confirmButtonText: "确定",
            callback: (action) => {
              this.batchRejectCollection(data);
            },
          });
        }
      }
    },
    batchPassCollection(data) {
      batchPassCollection(data).then(async (res) => {
        if (res.data.success) {
          this.$message.success("审核通过");
          this.templateFrom = await this.getDetail();
          this.setFormStatus();
        }
      });
    },
    batchRejectCollection(data) {
      batchRejectCollection(data).then(async (res) => {
        if (res.data.success) {
          this.$message.success("已拒绝");
          this.templateFrom = await this.getDetail();
          this.setFormStatus();
        }
      });
    },
    passCollection(data) {
      passCollection(data).then(async (res) => {
        if (res.data.success) {
          this.$message.success("审核通过");
          this.templateFrom = await this.getDetail();
          this.setFormStatus();
        }
      });
    },
    rejectCollection(data) {
      rejectCollection(data).then(async (res) => {
        if (res.data.success) {
          this.$message.success("已拒绝");
          this.templateFrom = await this.getDetail();
          this.setFormStatus();
        }
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      let data = new FormData();
      data.append("collectionId", this.collectionInfo["outerId"]);
      data.append("dynamicId", item.id);
      switch (name) {
        case "Approval":
          this.$alert("确认审核通过吗?", "审核", {
            confirmButtonText: "确定",
            callback: (action) => {
              this.passCollection(data);
            },
          });
          break;
        case "Refuse":
          this.$alert("确认拒绝通过吗?", "拒绝审核", {
            confirmButtonText: "确定",
            callback: (action) => {
              this.rejectCollection(data);
            },
          });
          break;
        case "Re-approval":
          this.$alert("确认审核通过吗?", "审核", {
            confirmButtonText: "确定",
            callback: (action) => {
              this.passCollection(data);
            },
          });
          break;
      }
    },
    rowClick(row, column, event) {},
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getList();
    },
    gettableBtn(data) {
      let tableBtn = data.filter((res) => {
        return res["permissions"] == "look" || this.permissions[res["permissions"]];
      });
      return tableBtn;
    },
    getDatastr(id, data) {
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    getTemplateValue(id, value) {
      let str = "--";
      let arr = [];
      let properties = [];
      let values = "";
      this.tableTitle.map((item) => {
        if (item.prop == id) {
          switch (item.type) {
            case "input":
              str = value;
              break;
            case "textarea":
              str = value;
              break;
            case "radio":
              values = JSON.parse(value);
              properties = item.properties;
              properties.map((o) => {
                console.log("radio", value == o.id, values, o.id);

                if (value == o.id) {
                  str = o.value;
                }
              });

              break;
            case "checkbox":
              properties = item.properties;
              values = JSON.parse(value);
              properties.map((o) => {
                if (values.includes(Number(o.id))) {
                  arr.push(o.value);
                }
              });
              str = String(arr);
              break;
            case "select":
              properties = item.properties;
              values = JSON.parse(value);
              properties.map((o) => {
                if (values.includes(Number(o.id))) {
                  arr.push(o.value);
                }
              });
              str = String(arr);
              break;
            case "datetimepicker":
              str = JSON.parse(value)[0];
              break;
          }
        }
      });
      return str;
    },
    bindActivity() {
      let data = {
        id: this.collectionInfo["outerId"],
        activitieIds: this.templateFrom["activitieIds"],
      };
      this.$refs["BindActivity"].show(data);
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
.qrcode {
  display: inline-block;
  img {
    width: 132px;
    height: 132px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
    box-sizing: border-box;
  }
}
</style>
