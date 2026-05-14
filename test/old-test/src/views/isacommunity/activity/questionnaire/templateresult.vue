<template>
  <div class="thepool_page">
    <div class="df_sb palyTableBox" v-if="!isBindActive">
      <div style="width: 100%; text-align: right">
        <QRCode :codeId="$route.query.id" />
        <div>{{ $t("consult.关联活动") }}：{{ templateFrom["activityName"] }}</div>
      </div>
    </div>
    <div class="df_sb palyTableBox">
      <div class="df_sb">
        <div class="df_sb" v-if="!isBindActive">
          <el-button type="primary" size="small" round @click="exportList">{{
            $t("btn.导出")
          }}</el-button>
        </div>
      </div>
      <PaginationInfo :paginationTotal="paginationTotal" v-if="tableTitle.length > 0" />
    </div>
    <div class="tableBox" v-if="tableTitle.length > 0">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        :header-cell-style="tablestyle.headercellstyle"
        :cell-style="tablestyle.rowstyle"
        :row-class-name="tableRowClassName"
      >
        <!-- 多选按钮 -->
        <el-table-column
          v-if="showSelection && hasAssociation == '0'"
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
            <span v-if="i.type != 'upload'">
              {{
                scope.row[i.prop] === null ||
                scope.row[i.prop] === "" ||
                scope.row[i.prop] === undefined
                  ? "--"
                  : String(scope.row[i.prop])
              }}
            </span>
            <span v-else>
              <span v-if="!scope.row[i.prop] || scope.row[i.prop].length == 0"> --</span>
              <el-button
                v-else
                type="text"
                @click="viewFile(scope.row, i.prop, i.properties)"
              >
                {{ $t("consult.查看文件") }}</el-button
              >
            </span>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <!-- <el-table-column
          v-if="hasAssociation == '0'"
          fixed="right"
          :label="$t('consult.操作')"
          :width="`180px`"
        >
          <template slot-scope="scope"
            ><div class="df_align_center table_textbtn">
              <span
                v-if="permissions['thepool_collection_audit'] && scope.row.status != '2'"
              >
                <el-button
                  type="text"
                  size="small"
                  :disabled="scope.row.status != '0'"
                  @click.stop="playTab('Approval', scope.row, scope)"
                >
                  {{ $t("consult.审批") }}
                </el-button>
              </span>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <div class="tableBox" v-else></div>
    <el-dialog
      :title="$t('consult.查看文件')"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <div style="max-height: 600px; overflow-y: auto">
        <div
          @click="lookCurrentFile(item.id, item.fileName)"
          v-for="item in fileList"
          :key="item.id"
          style="
            margin-bottom: 10px;
            color: #ba8e62;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            cursor: pointer;
          "
        >
          {{ item.fileName }}
        </div>
      </div>
    </el-dialog>
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
  confirmCollection,
} from "@/api/consult/collection.js";
import {
  addQuestionnaire,
  editQuestionnaire,
  getQuestionnaireDetail,
  exportQuestionnaire,
} from "@/api/isacommunity/questionnaire.js";
import {
  getTemplateOuterId,
  getDynamicTemplateList,
  getIsaDynamicTemplateList,
} from "@/api/space/templatedynamic.js";
import {
  getOuterFileInfoList,
  getOuterFileInfo,
  downloadOuterFile,
} from "@/api/upload/index.js";
import { download } from "@/util/download.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import QRCode from "@/components/isagroupcommon/QRcode.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    QRCode,
  },
  props: {
    isBindActive: {
      default: false,
      type: Boolean,
    },
    showSelection: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      tablestyle: {
        headercellstyle: {
          background: "#F8F8F8",
          color: " #333333",
          "font-size": "16px",
          "font-weight": "400",
          height: "60px",
        },
        rowstyle: {
          color: " #999999",
          "font-size": "14px",
          "font-weight": "400",
          height: "54px",
          border: "none",
          padding: "0px",
        },
      },
      tableTitle: [],
      tableData: [],
      tableBtn: [
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
        {
          name: "重新审批",
          type: "Re-approval",
          permissions: "thepool_user_guardian_edit",
          icon: "el-icon-view",
        },
      ],
      collectionInfo: { outerId: "", scene: "isa_community_questionnaire" },
      pagination: {
        size: 10,
        current: 1,
        scene: "isa_community_questionnaire",
        outerId: "",
      },
      paginationTotal: 0,
      templateFormId: "",
      templateFrom: {},
      confirmTableData: [],
      selectionId: [],
      batchType: "",
      hasAssociation: "2", //0审核写入，1自动写入，2无关联属性
      dialogVisible: false,
      fileType: "",
      fileList: [],
      studentInfo: [
        { label: "生日", prop: "studentBirthDate" },
        { label: "性别", prop: "studentGender" },
        { label: "学校", prop: "studentSchool" },
        { label: "学生姓名", prop: "studentName" },
      ],
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
  mounted() {},
  activated() {
    this.initData();
  },
  methods: {
    async initData() {
      if (this.isBindActive) return;
      if (this.$route.query.id) {
        this.setData(this.$route.query.id);
      }
    },
    async setData(id) {
      this.pagination["current"] = 1;
      this.collectionInfo["outerId"] = id;
      this.pagination["outerId"] = id;
      this.templateFrom = await this.getDetail();
      this.tableTitle = await this.getTemplateOuterId();
      if (this.templateFrom["needStudentInfo"] == "1") {
        this.studentInfo.forEach((item) => {
          this.tableTitle.unshift({
            label: item.label,
            prop: item.prop,
          });
        });
      }
      if (this.tableTitle.length > 0) {
        this.tableTitle.push({ label: this.$t("consult.创建时间"), prop: "createTime" });
        if (this.hasAssociation != "2") {
          this.tableTitle.push({
            label: this.$t("consult.状态"),
            prop: "statusLabel",
          });
        }

        this.getList();
      } else {
        this.tableData = [];
      }
    },
    async updateData() {
      this.templateFrom = await this.getDetail();
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        getQuestionnaireDetail(this.collectionInfo["outerId"]).then((res) => {
          if (res.data.success) {
            let data = res.data.data;
            let templateFrom = {
              name: data.name,
              schoolIds: data.schoolIds,
              activityName: data.activityName,
              activityId: data.activityId,
              status: data.status,
              needStudentInfo: String(data.needStudentInfo),
              instructions: data.instructions,
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
            this.hasAssociation = "2";
            if (res.data.data.length > 0) {
              let fields = res.data.data[0].fields;
              let coverTitle = { clueTitle: [], studentTitle: [], parentTitle: [] };
              let tableTitle = fields.map((item) => {
                // 是否关联表&&是否自动写入
                if (item["type"] == "association") {
                  let { properties } = item;
                  properties.map((act) => {
                    if (act["key"] == "approval") {
                      let arr = [];
                      let approval = act["value"];
                      arr = approval.split("_");
                      this.hasAssociation = String(arr[0]);
                      //   if (arr[0] == "0") {
                      //     this.hasAssociation = true;
                      //   }
                    }
                    if (act["key"] == "unique_field" || act["key"] == "other_field") {
                      let fieldValue = act["value"].split("@");
                      switch (fieldValue[1]) {
                        case "clue_info":
                          coverTitle.clueTitle.push(fieldValue[2]);
                          break;
                        case "guardian_info":
                          coverTitle.parentTitle.push(fieldValue[2]);
                          break;
                        case "student_info":
                          coverTitle.studentTitle.push(fieldValue[2]);
                          break;
                      }
                    }
                  });
                }
                return {
                  label: item.label + (item["isHide"] ? "（隐藏）" : ""),
                  prop: item.id,
                  sort: item.sort,
                  type: item.type,
                  properties: item.properties,
                };
              });
              tableTitle = tableTitle.sort((a, b) => {
                return a.sort - b.sort;
              });
              tableTitle = tableTitle.filter((item) => {
                return item["type"] != "association";
              });
              this.$nextTick(() => {
                var tableRef = this.$refs["CollectionTabel"];
                if (
                  tableRef &&
                  typeof tableRef.resetTitle === "function"
                ) {
                  tableRef.resetTitle(coverTitle);
                }
              });
              resolve(tableTitle);
            } else {
              resolve([]);
            }
          } else {
          }
        });
      });
    },
    getList() {
      getIsaDynamicTemplateList(this.pagination).then((res) => {
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = [];
          this.paginationTotal = total;
          data.map((item) => {
            let obj = { createTime: item.createTime, id: item.id };
            item.fields.map((l) => {
              obj[l.templateFormFieldId] = this.getTemplateValue(
                l.templateFormFieldId,
                l.value
              );
            });
            if (this.templateFrom["needStudentInfo"] == "1") {
              obj["studentName"] = item.studentName;
              obj["studentSchool"] = item.studentSchool;
              obj["studentBirthDate"] = item.studentBirthDate;
              obj["studentGender"] = item.studentGender ? "男" : "女";
            }
            this.tableData.push(obj);
          });
        }
      });
    },
    exportCollection() {
      exportCollection(this.collectionInfo["outerId"]).then(async (res) => {
        this.$message.success(this.$t("consult.成功"));
        download(res.data, res.headers["content-disposition"]);
      });
    },
    batchPlayTab(type) {
      console.log("batchPlayTab", this.selectionId);

      this.batchType = type;
      if (this.selectionId == 0) {
        this.$message.error(this.$t("consult.请选择"));
      } else {
        this.confirmCollection({
          collectionId: this.collectionInfo["outerId"],
          dynamicIds: this.selectionId,
        });
      }
    },

    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "Approval":
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
              values = value ? JSON.parse(value) : [];
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
              values = value ? JSON.parse(value) : [];
              properties.map((o) => {
                if (values.includes(Number(o.id))) {
                  arr.push(o.value);
                }
              });
              str = String(arr);
              break;
            case "select":
              properties = item.properties;
              values = value ? JSON.parse(value) : [];
              properties.map((o) => {
                if (values.includes(Number(o.id))) {
                  arr.push(o.label);
                }
              });
              str = String(arr);
              break;
            case "datetimepicker":
              str = values = value ? JSON.parse(value)[0] : [];
              break;
            case "upload":
              console.log("upload", value);

              str = value || [];
              break;
          }
        }
      });
      return str;
    },

    // 多选
    handleSelectionChange(arr) {
      this.selectionId = [];
      arr.map((i) => {
        this.selectionId.push(i.id);
      });
    },
    checkSelectable(row) {
      if (row.status == "1") {
        return false;
      } else {
        return true;
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    // 动态更改一行table样式
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 > 0 ? "shinning" : "";
    },
    viewFile(row, prop, properties) {
      console.log("viewFile0", row, prop, row[prop], JSON.parse(row[prop]));
      let fileIds = [];
      if (typeof row[prop] === "string") {
        // 使用正则表达式匹配所有数字序列，保持字符串格式
        const idMatches = row[prop].match(/\d+/g);
        if (idMatches) {
          // 保持ID为字符串类型，不进行数字转换
          fileIds = idMatches;
        }
      } else if (Array.isArray(row[prop])) {
        // 如果已经是数组，确保所有元素都是字符串类型
        fileIds = row[prop].map((id) => String(id));
      } else {
        // 其他情况，转换为字符串数组
        fileIds = [String(row[prop])];
      }

      console.log("处理后的fileIds:", fileIds);
      //   this.fileType = properties.filter((res) => {
      //     return res.key == "upload_file_type";
      //   })[0].value;
      if (fileIds.length == 1) {
        getOuterFileInfoList({
          ids: fileIds,
          tenantId: 2,
        }).then((res) => {
          console.log("getOuterFileInfoList", res);
          if (res.status == 200) {
            res.data.data.map((item) => {
              this.lookCurrentFile(item.id, item.originalName);
            });
          }
        });
      } else {
        getOuterFileInfoList({
          ids: fileIds,
          tenantId: 2,
        }).then((res) => {
          console.log("getOuterFileInfoList", res);

          if (res.status == 200) {
            this.fileList = res.data.data.map((item) => {
              return {
                fileName: item.originalName,
                id: item.id,
              };
            });
            this.dialogVisible = true;
          }
        });
      }
    },
    lookCurrentFile(id, fileName) {
      downloadOuterFile(id).then((res) => {
        console.log("downloadOuterFile", res);
        // let name = this.extractFilename(res.headers["content-disposition"]);
        download(res.data, fileName);
        this.$message({
          message: this.$t("consult.成功"),
          type: "success",
        });
      });
    },
    extractFilename(headerString) {
      const match = headerString.match(/filename="([^"]+)"/);
      return match ? match[1] : null;
    },
    handleClose() {
      this.fileType = "";
      this.fileList = [];
      this.dialogVisible = false;
    },
    exportList() {
      exportQuestionnaire(this.$route.query.id).then((res) => {
        console.log("exportQuestionnaire", res);
        if (res.status == 200) {
          download(res.data, this.templateFrom.name + ".xlsx");
          this.$message({
            message: this.$t("consult.成功"),
            type: "success",
          });
        }
      });
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
