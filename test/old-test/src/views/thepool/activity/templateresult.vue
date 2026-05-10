<template>
  <div class="thepool_page">
    <el-button
      @click="backBtnClick"
      class="backBtn"
      type="text"
      icon="el-icon-arrow-left"
      >{{ $t("consult.返回") }}</el-button
    >
    <div class="df_sb palyTableBox" v-if="!isBindActive">
      <div style="width: 100%; text-align: right">
        <QRCode :codeId="$route.query.id" />
        <div>
          {{ $t("consult.关联活动") }}：{{ templateFrom["activitieNames"] }}
        </div>
      </div>
    </div>
    <div class="df_sb palyTableBox">
      <div class="df_sb">
        <div class="df_sb" v-if="!isBindActive">
          <el-button type="primary" size="small" round @click="bindActivity">{{
            $t("consult.关联活动")
          }}</el-button>
          <el-button
            v-if="
              permissions['thepool_collection_export'] && paginationTotal > 0
            "
            type="primary"
            size="small"
            round
            @click="exportCollection"
            >{{ $t("consult.导出") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_collection_audit'] && hasAssociation"
            type="primary"
            size="small"
            round
            @click="batchPlayTab('pass')"
            >{{ $t("consult.批量审批通过") }}</el-button
          >
          <el-button
            v-if="permissions['thepool_collection_audit'] && hasAssociation"
            type="primary"
            size="small"
            round
            @click="batchPlayTab('reject')"
            >{{ $t("consult.批量审批拒绝") }}</el-button
          >
        </div>
      </div>
      <PaginationInfo
        :paginationTotal="paginationTotal"
        v-if="tableTitle.length > 0"
      />
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
          v-if="showSelection && hasAssociation"
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
            <span v-if="i.type == 'upload' || i.type == 'sign'">
              <span v-if="scope.row[i.prop].length == 0">--</span>
              <el-button
                v-else
                type="text"
                @click="viewFile(scope.row, i.prop, i.properties)"
              >
                {{ $t("consult.查看文件") }}</el-button
              >
            </span>
            <span v-else-if="i.type == 'guardian'">
              <el-button
                type="text"
                @click="viewGuardian(scope.row, i.prop, i.properties)"
              >
                {{ $t("consult.查看") }}</el-button
              >
            </span>
            <span v-else>
              {{
                scope.row[i.prop] === null ||
                scope.row[i.prop] === "" ||
                scope.row[i.prop] === undefined
                  ? "--"
                  : String(scope.row[i.prop])
              }}
            </span>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
          v-if="hasAssociation"
          fixed="right"
          :label="$t('consult.操作')"
          :width="`180px`"
        >
          <template slot-scope="scope"
            ><div class="df_align_center table_textbtn">
              <span
                v-if="
                  scope.row.status != '2' &&
                  scope.row.clueId &&
                  scope.row.clueId != '0'
                "
              >
                <el-button
                  type="text"
                  size="small"
                  @click.stop="playTab('look', scope.row, scope)"
                >
                  {{ $t("consult.查看") }}
                </el-button>
              </span>
              <span
                v-if="
                  permissions['thepool_collection_audit'] &&
                  scope.row.status != '2'
                "
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
              <span
                v-if="
                  permissions['thepool_collection_audit'] &&
                  scope.row.status == '2'
                "
              >
                <el-button
                  type="text"
                  size="small"
                  :disabled="scope.row.status != '2'"
                  @click.stop="playTab('Re-approval', scope.row, scope)"
                >
                  {{ $t("consult.重新审批") }}
                </el-button>
              </span>
              <span v-if="permissions['thepool_collection_audit']">
                <el-button
                  type="text"
                  size="small"
                  :disabled="scope.row.status != '0'"
                  @click.stop="playTab('Refuse', scope.row, scope)"
                >
                  {{ $t("consult.拒绝") }}
                </el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="paginationTotal"
        :pagination="pagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <div class="tableBox" v-else></div>
    <BindActivity ref="BindActivity" @updateData="updateData" />
    <CollectionTabel ref="CollectionTabel" @batchConfirm="batchConfirm" />
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
    <el-dialog
      title="查看监护人"
      :visible.sync="showGuardian"
      width="1000px"
      :before-close="handleClose"
    >
      <div style="max-height: 600px; overflow-y: auto">
        <el-table
          ref="multipleTable"
          :data="guardianChildData"
          style="width: 100%"
          tooltip-effect="dark"
          :row-key="getRowKeys"
          :header-cell-style="tablestyle.headercellstyle"
          :cell-style="tablestyle.rowstyle"
          :row-class-name="tableRowClassName"
          height="600px"
        >
          <el-table-column
            v-for="(i, k) in guardianChildTitle"
            :key="k"
            :prop="i.prop"
            :label="i.label"
            show-overflow-tooltip
            :width="`${i.width}`"
            :fixed="i.fixed"
          >
            <template slot-scope="scope">
              <span v-if="i.type == 'upload'">
                <span v-if="scope.row[i.prop].length == 0">--</span>
                <el-button
                  v-else
                  type="text"
                  @click="viewFile(scope.row, i.prop, i.properties)"
                >
                  {{ $t("consult.查看文件") }}</el-button
                >
              </span>

              <span v-else>
                {{
                  scope.row[i.prop] === null ||
                  scope.row[i.prop] === "" ||
                  scope.row[i.prop] === undefined
                    ? "--"
                    : String(scope.row[i.prop])
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
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
  getDynamicInfo,
  getChildDynamicInfo,
} from "@/api/consult/collection.js";
import {
  getTemplateOuterId,
  getDynamicTemplateList,
} from "@/api/space/templatedynamic.js";
import {
  getOuterFileInfoList,
  getOuterFileInfo,
  downloadOuterFile,
} from "@/api/upload/index.js";
import { getTemplateList, getTemplateInfo } from "@/api/consult/template.js";
import { download } from "@/util/download.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/thepoolcommon/Table.vue";
import QRCode from "@/components/common/QRcode.vue";
import BindActivity from "@/page/thepool/modal/bindactivity.vue";
import CollectionTabel from "@/page/thepool/modal/collectiontabel.vue";
export default {
  name: "TestUniWel",
  components: {
    Pagination,
    Table,
    PaginationInfo,
    BindActivity,
    QRCode,
    CollectionTabel,
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
      statusLabel: {
        0: "待审批",
        1: "已审批",
        2: "已拒绝",
      },
      collectionInfo: { id: "", scene: "collection_dynamic" },
      pagination: {
        pageSize: 10,
        pageNum: 1,
        id: "",
      },
      paginationTotal: 0,
      templateFormId: "",
      templateFrom: {},
      confirmTableData: [],
      selectionId: [],
      batchType: "",
      hasAssociation: null, //无关联属性
      dialogVisible: false,
      fileType: "",
      fileList: [],
      statusList: [0, 1, 2],
      // 监护人子表单
      guardianChildId: "",
      showGuardian: false,
      guardianChildTitle: [],
      guardianChildData: [],
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
    this.getTemplateList();
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
      this.pagination["pageNum"] = 1;
      this.collectionInfo["id"] = id;
      this.pagination["id"] = id;
      this.templateFrom = await this.getDetail();
      this.tableTitle = await this.getTemplateOuterId(
        this.templateFrom["template"]
      );

      if (this.tableTitle.length > 0) {
        this.tableTitle.push({
          label: this.$t("consult.创建时间"),
          prop: "createTime",
        });

        this.getDynamicInfo();
      } else {
        this.tableData = [];
      }
    },
    async updateData() {
      this.templateFrom = await this.getDetail();
    },
    getTemplateList() {
      getTemplateList({
        scene: "8",
        type: "8",
        pageNum: 1,
        pageSize: 100,
      }).then((res) => {
        if (res.data.success) {
          this.$nextTick(() => {
            let list = res.data.data.data || [];
            if (list.length > 0) {
              this.guardianChildId = list[0].templateId;
            }
          });
        }
      });
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        getCollectionDetail(this.collectionInfo["id"]).then((res) => {
          if (res.data.success) {
            let data = res.data.data;
            let templateFrom = {
              ...data,
              activitieNames: data["activityInfos"]
                ? data["activityInfos"][0].activityName
                : "",
              activitieIds: data["activityInfos"]
                ? data["activityInfos"][0].id
                : "",
            };
            resolve(templateFrom);
          }
        });
      });
    },
    getDynamicInfo() {
      getDynamicInfo(this.pagination).then((res) => {
        if (res.data.success) {
          let { data, total } = res.data.data;
          let list = [];
          this.tableData = [];
          this.paginationTotal = Number(total);
          data.map((item) => {
            let obj = {
              createTime: item.createTime,
              id: item.dynamicId,
              status: item.status,
              statusLabel: this.statusLabel[item.status],
              clueId: item.clueId,
              dynamicId: item.dynamicId,
            };
            if (!this.hasAssociation && this.statusList.includes(item.status)) {
              this.hasAssociation = true;
            }

            item.dynamicInfos.map((l) => {
              obj[l.fieldId] = this.getTemplateValue(
                this.tableTitle,
                l.fieldId,
                l.value
              );
            });
            list.push(obj);
          });
          // 检查tableTitle中是否已经包含statusLabel属性，如果不包含则添加
          const hasStatusLabel = this.tableTitle.some(
            (item) => item.prop == "statusLabel"
          );
          if (this.hasAssociation && !hasStatusLabel) {
            this.hasAssociation = true;
            this.tableTitle.push({
              label: this.$t("consult.状态"),
              prop: "statusLabel",
            });
          }
          this.$nextTick(() => {
            this.tableData = list;
          });
        }
      });
    },
    getTemplateOuterId(template) {
      return new Promise((resolve, reject) => {
        let fields = template.templateFields.filter(
          (item) => item.fieldType != "banner" && item.fieldType != "title"
        );
        let tableTitle = fields.map((item) => {
          return {
            label: item.fieldName + (item["isHidden"] ? "（隐藏）" : ""),
            prop: item.fieldId,
            sort: item.sort,
            type: item.fieldType,
            properties: item.properties,
          };
        });
        tableTitle = tableTitle.sort((a, b) => {
          return a.sort - b.sort;
        });
        resolve(tableTitle);
      });
    },
    exportCollection() {
      exportCollection(this.collectionInfo["id"]).then(async (res) => {
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
          collectionId: this.collectionInfo["id"],
          dynamicIds: this.selectionId,
        });
      }
    },
    batchConfirm() {
      let data = {
        collectionId: this.collectionInfo["id"],
        dynamicIds: this.selectionId,
      };
      if (this.batchType == "pass") {
        this.$alert(
          this.$t("consult.确认审核通过吗"),
          this.$t("consult.审批"),
          {
            confirmButtonText: this.$t("consult.确定"),
          }
        ).then(() => {
          this.passCollection(data);
        });
      } else if (this.batchType == "reject") {
        this.$alert(
          this.$t("consult.确认拒绝通过吗"),
          this.$t("consult.拒绝"),
          {
            confirmButtonText: this.$t("consult.确定"),
          }
        ).then(() => {
          this.rejectCollection(data);
        });
      }
    },
    confirmCollection(data) {
      confirmCollection(data).then(async (res) => {
        if (res.data.success) {
          let data = res.data.data;
          let {
            clueInfoEntityList,
            guardianInfoEntityList,
            studentInfoEntityList,
            dynamicParams,
          } = data;
          if (
            clueInfoEntityList.length > 0 ||
            guardianInfoEntityList.length > 0 ||
            studentInfoEntityList.length > 0
          ) {
            this.$message.warning(this.$t("consult.请确认要覆盖的数据"));
            this.$nextTick(() => {
              this.$refs["CollectionTabel"].show(data);
            });
          } else {
            this.batchConfirm();
          }
        }
      });
    },
    passCollection(data) {
      passCollection(data).then(async (res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.已审批"));
          this.getDynamicInfo();
        }
      });
    },
    rejectCollection(data) {
      rejectCollection(data).then(async (res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.已拒绝"));
          this.getDynamicInfo();
        }
      });
    },
    // 表格操作
    playTab(name, item, scope) {
      switch (name) {
        case "Approval":
          this.batchType = "pass";
          this.selectionId = [item.id];
          this.confirmCollection({
            collectionId: this.collectionInfo["id"],
            dynamicIds: [item.id],
          });
          //   this.$alert(this.$t("consult.确认审核通过吗"), this.$t("consult.审批"), {
          //     confirmButtonText: this.$t("consult.确定"),
          //   }).then(() => {
          //     this.passCollection({
          //       collectionId: this.collectionInfo["id"],
          //       dynamicIds: [item.id],
          //     });
          //   });
          break;
        case "Refuse":
          this.$alert(
            this.$t("consult.确认拒绝通过吗"),
            this.$t("consult.拒绝"),
            {
              confirmButtonText: this.$t("consult.确定"),
            }
          ).then(() => {
            this.rejectCollection({
              collectionId: this.collectionInfo["id"],
              dynamicIds: [item.id],
            });
          });
          break;
        case "Re-approval":
          this.batchType = "pass";
          this.selectionId = [item.id];
          this.confirmCollection({
            collectionId: this.collectionInfo["id"],
            dynamicIds: [item.id],
          });
          break;
        case "look":
          const routeUrl = this.$router.resolve({
            path: "/thepool/enquiry/detail",
            query: {
              clueId: item.clueId,
              type: "1",
            },
          });
          window.open(routeUrl.href, "_blank");
          break;
      }
    },
    rowClick(row, column, event) {},
    // 分页
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getDynamicInfo();
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
      let str = "";
      data.map((item) => {
        if (item.value == id) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
    getTemplateValue(tableTitle, id, value) {
      let str = "--";
      let arr = [];
      let properties = [];
      let values = "";
      tableTitle.map((item) => {
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
                if (value == o.id) {
                  str = o.value;
                }
              });

              break;
            case "checkbox":
              properties = item.properties;
              values = value ? JSON.parse(value) : [];
              properties.map((o) => {
                if (values.includes(o.id)) {
                  arr.push(o.value);
                }
              });
              str = String(arr);
              break;
            case "select":
              properties = item.properties;
              values = value ? JSON.parse(value) : [];
              properties.map((o) => {
                if (values.includes(o.id)) {
                  arr.push(o.label);
                }
              });
              str = String(arr);
              break;
            case "datetimepicker":
              str = values = value ? JSON.parse(value)[0] : [];
              break;
            case "upload":
              str = value ? JSON.parse(value) : [];
              break;
            case "sign":
              str = value;
              // str = value ? JSON.parse(value) : [];
              // console.log("sign", value, str);
              break;
            case "protocol":
              str = value == "1" ? this.$t("consult.同意") : "--";
              break;
            case "nationality":
              str = value;
              break;
            case "language":
              str = value;
              break;
            case "region":
              str = value;
              break;
            case "autoFill":
              str = value;
              break;
          }
        }
      });
      return str;
    },
    bindActivity() {
      let data = {
        collectionId: this.collectionInfo["id"],
        activityIds: this.templateFrom["activitieIds"],
      };
      this.$refs["BindActivity"].show(data);
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
      console.log("viewFile0", row, prop, row[prop]);
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
      this.showGuardian = false;
      this.guardianChildTitle = [];
      this.guardianChildData = [];
    },
    backBtnClick() {
      this.$router.back();
    },
    async viewGuardian(row, prop, properties) {
      console.log("viewGuardian", row, prop, row[prop]);
      let formData = {
        dynamicId: row.dynamicId, //动态表单id
        childTemplateId: this.guardianChildId, //子模版id
        type: 5,
      };
      // 获取表头
      getTemplateInfo({
        templateId: this.guardianChildId,
      }).then(async (res) => {
        if (res.data.success) {
          console.log("res.data", res.data.data);
          let data = res.data.data.templateFields;
          let sortData = data.sort((a, b) => {
            return a.sort - b.sort;
          });
          this.guardianChildTitle = sortData.map((item) => {
            return {
              label: item.fieldName + (item["isHidden"] ? "（隐藏）" : ""),
              prop: item.fieldId,
              sort: item.sort,
              type: item.fieldType,
              properties: item.properties,
            };
          });
          // 获取填写数据
          let signupData = await getChildDynamicInfo(formData);
          console.log("signData", signupData);
          if (signupData.data.success) {
            signupData.data.data.map((guardian) => {
              let obj = {
                dynamicId: guardian.dynamicId,
              };
              guardian.dynamicInfos.map((l) => {
                obj[l.fieldId] = this.getTemplateValue(
                  this.guardianChildTitle,
                  l.fieldId,
                  l.value
                );
              });
              this.guardianChildData.push(obj);
            });
          }
          this.showGuardian = true;
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
.thepool_page {
  position: relative;
  .backBtn {
    position: absolute;
    top: 30px;
    left: 30px;
  }
}
</style>
