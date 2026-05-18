<template>
  <div class="activity-registration-tab" v-loading="listLoading">
    <div class="community_searchFrom registration-search-wrap">
      <div class="activity-search-toolbar">
        <el-form
          :inline="true"
          class="registration-search-form activity-search-form--inline"
          :model="searchFrom"
          @submit.native.prevent
        >
          <el-form-item class="activity-search-field">
            <el-input
              v-model="searchFrom.keyword"
              clearable
              class="activity-search-input--w280"
              :placeholder="$t('isagroup.购票搜索提示')"
              @keyup.enter.native="getList"
            />
          </el-form-item>
          <el-form-item class="activity-search-field">
            <el-select
              v-model="searchFrom.paid"
              clearable
              class="activity-search-select--w140"
              :placeholder="$t('isagroup.是否支付')"
            >
              <el-option :label="$t('isagroup.已支付')" :value="1" />
              <el-option :label="$t('isagroup.未支付')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item class="activity-search-field">
            <el-date-picker
              v-model="registerTimeRange"
              class="activity-search-daterange--w400"
              type="datetimerange"
              range-separator="—"
              :start-placeholder="$t('isagroup.开始时间')"
              :end-placeholder="$t('isagroup.结束时间')"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
          <el-form-item
            class="activity-search-field activity-search-field--search"
          >
            <el-button type="primary" size="medium" @click="getList">{{
              $t("isagroup.搜索")
            }}</el-button>
          </el-form-item>
        </el-form>
        <div
          v-if="!readOnly || showExportEnded"
          class="activity-search-toolbar__actions"
        >
          <template v-if="!readOnly">
            <!-- <el-button
              v-if="permissions['busdriver_edit']"
              type="primary"
              size="medium"
              @click="openAdd"
              >{{ $t("btn.新增") }}</el-button
            > -->
            <el-upload
              v-if="permissions['busdriver_edit']"
              class="registration-upload"
              :action="ticketImportAction"
              :show-file-list="false"
              accept=".xlsx,.xls"
              :http-request="handleImport"
            >
              <el-button type="primary" size="medium">{{
                $t("btn.导入")
              }}</el-button>
            </el-upload>
            <el-button
              v-if="permissions['busdriver_edit']"
              type="primary"
              size="medium"
              :disabled="!activityId"
              @click="handleDownloadTemplate"
              >{{ $t("isagroup.下载Excel模板") }}</el-button
            >
            <el-button
              v-if="
                permissions['activity_ticket_del'] ||
                permissions['busdriver_del']
              "
              type="danger"
              size="medium"
              plain
              :disabled="tableSelectionCount === 0"
              @click="batchDel"
              >{{ $t("btn.删除") }}</el-button
            >
          </template>
          <el-button
            v-if="showExportEnded && permissions['busdriver_edit']"
            type="primary"
            size="medium"
            plain
            :disabled="!activityId || exportLoading"
            @click="exportRegistrationCsv"
            >{{ $t("btn.导出") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="isa_table">
      <Table
        ref="ticketTable"
        :showSelection="showSelection"
        :tableTitle="tabletitle['activityTicketTable']"
        :tableData="tableData"
        :tableBtn="tableBtn"
        tableType="activityTicket"
        :height="tableHeight"
        @playTab="playTab"
        @selection-change="onTableSelectionChange"
      />
      <div class="df_sb isa_table_footer">
        <div />
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          :has-sizes="true"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        />
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="720px"
      :close-on-click-modal="false"
      append-to-body
      custom-class="registration-dialog"
      @closed="resetDialogForm"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-position="top"
        class="registration-dialog-form"
      >
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.电话')" prop="phone">
              <el-input
                v-model="dialogForm.phone"
                maxlength="20"
                :placeholder="$t('consult.请输入')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.姓名')" prop="name">
              <el-input
                v-model="dialogForm.name"
                maxlength="100"
                :placeholder="$t('consult.请输入')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.邮箱')" prop="email">
              <el-input
                v-model="dialogForm.email"
                maxlength="100"
                :placeholder="$t('consult.请输入')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.买票ID')" prop="parentId">
              <el-input
                v-model="dialogForm.parentId"
                :placeholder="$t('consult.请输入')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.人数')" prop="peopleCount">
              <el-input-number
                v-model="dialogForm.peopleCount"
                :min="1"
                :precision="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.票价')" prop="ticketPrice">
              <el-input-number
                v-model="dialogForm.ticketPrice"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.实付金额')" prop="paidAmount">
              <el-input-number
                v-model="dialogForm.paidAmount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.是否支付')" prop="paid">
              <el-select v-model="dialogForm.paid" style="width: 100%">
                <el-option :label="$t('isagroup.已支付')" :value="1" />
                <el-option :label="$t('isagroup.未支付')" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('isagroup.订单号')" prop="orderNo">
              <el-input
                v-model="dialogForm.orderNo"
                maxlength="64"
                :placeholder="$t('consult.请输入')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("btn.取消")
        }}</el-button>
        <el-button type="primary" @click="submitDialog">{{
          $t("btn.确定")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addActivityTicket,
  delActivityTicket,
  downloadActivityTicketTemplate,
  editActivityTicket,
  getActivityTicketPage,
  importActivityTicket,
} from "@/api/isacommunity/activity.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import { downloadUtf8Csv } from "@/util/download";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

import activityDetailPagination from "../mixins/activityDetailPagination.js";
import {
  extractPageList,
  pageTotalOrNull,
  totalFromPagePayload,
} from "../utils/tabPageHelpers.js";

export default {
  name: "ActivityRegistrationList",
  mixins: [activityDetailPagination],
  components: { Table, Pagination },
  props: {
    activityId: {
      type: [String, Number],
      default: "",
    },
    /** 进行中之外为只读；已结束时父级传 show-export-ended 仍可导出 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    showExportEnded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabletitle,
      tableData: [],
      paginationTotal: 0,
      pagination: {
        size: 10,
        current: 1,
      },
      searchFrom: {
        keyword: "",
        paid: undefined,
      },
      registerTimeRange: null,
      tableHeight: "calc(100vh - 450px)",
      tableBtn: [],
      permissionsBtn: [
        {
          name: "编辑",
          type: "edit",
          icon: "",
          permissions: "busdriver_edit",
        },
      ],
      dialogVisible: false,
      dialogMode: "add",
      tableSelectionCount: 0,
      listLoading: false,
      exportLoading: false,
      dialogForm: {
        id: null,
        activityId: null,
        phone: "",
        name: "",
        email: "",
        parentId: "",
        peopleCount: 1,
        ticketPrice: 0,
        paidAmount: 0,
        paid: 1,
        orderNo: "",
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    /**
     * POST /activity/ticket/import（拼接 base 后供 el-upload 的 action 必填；
     * 实际上传走 handleImport → importActivityTicket（仅 file，不含 activityId）
     */
    ticketImportAction() {
      const base = (process.env.VUE_APP_BASE_URL || "").replace(/\/$/, "");
      if (base) {
        return `${base}/isacommunity/activity/ticket/import`;
      }
      return "/isacommunity/activity/ticket/import";
    },
    showSelection() {
      return (
        !this.readOnly &&
        (this.permissions["activity_ticket_del"] ||
          this.permissions["busdriver_del"])
      );
    },
    dialogTitle() {
      return this.dialogMode === "add"
        ? this.$t("isagroup.新增购票")
        : this.$t("isagroup.编辑购票");
    },
    dialogRules() {
      const req = (msg) => [{ required: true, message: msg, trigger: "blur" }];
      return {
        phone: req(this.$t("isagroup.请输入")),
        peopleCount: req(this.$t("isagroup.请输入")),
        ticketPrice: req(this.$t("isagroup.请输入")),
        paidAmount: req(this.$t("isagroup.请输入")),
        paid: [
          {
            required: true,
            message: this.$t("isagroup.请选择"),
            trigger: "change",
          },
        ],
      };
    },
  },
  watch: {
    activityId(id, oldId) {
      if (!id) {
        this.tableData = [];
        this.paginationTotal = 0;
        return;
      }
      if (id !== oldId) {
        this.pagination.current = 1;
        this.getList();
      }
    },
    readOnly: {
      handler() {
        this.refreshTableBtn();
      },
      immediate: true,
    },
  },
  mounted() {
    this.refreshTableBtn();
  },
  methods: {
    onTableSelectionChange(arr) {
      this.tableSelectionCount = Array.isArray(arr) ? arr.length : 0;
    },
    refreshTableBtn() {
      if (this.readOnly || !this.permissions["busdriver_edit"]) {
        this.tableBtn = [];
      } else {
        this.tableBtn = this.permissionsBtn.filter(
          (item) => this.permissions[item.permissions]
        );
      }
    },
    parseFilenameFromContentDisposition(header) {
      if (!header || typeof header !== "string") {
        return null;
      }
      const star = /filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i.exec(header);
      if (star && star[1]) {
        const raw = star[1].trim().replace(/^["']|["']$/g, "");
        try {
          return decodeURIComponent(raw);
        } catch (e) {
          return raw;
        }
      }
      const quoted = /filename\s*=\s*"((?:\\.|[^"\\])*)"/i.exec(header);
      if (quoted && quoted[1]) {
        return quoted[1].replace(/\\(.)/g, "$1");
      }
      const plain = /filename\s*=\s*([^;\n]+)/i.exec(header);
      if (plain && plain[1]) {
        const raw = plain[1].trim().replace(/^["']|["']$/g, "");
        try {
          return decodeURIComponent(raw);
        } catch (e) {
          return raw;
        }
      }
      return null;
    },
    buildTicketListParams(cur, sz) {
      const params = {
        activityId: this.activityId,
        current: cur,
        size: sz,
        pageNum: cur,
        pageSize: sz,
        keyword: this.searchFrom.keyword || undefined,
      };
      if (this.searchFrom.paid === 0 || this.searchFrom.paid === 1) {
        params.paid = this.searchFrom.paid;
      }
      if (this.registerTimeRange && this.registerTimeRange.length === 2) {
        params.registerStartTime = this.registerTimeRange[0];
        params.registerEndTime = this.registerTimeRange[1];
      }
      return params;
    },
    async exportRegistrationCsv() {
      if (!this.activityId || this.exportLoading) {
        return;
      }
      this.exportLoading = true;
      const pageSize = 200;
      let current = 1;
      let allRaw = [];
      let totalKnown = null;
      try {
        while (current < 600) {
          const params = this.buildTicketListParams(current, pageSize);
          const res = await getActivityTicketPage(params);
          if (!res.data.success) {
            break;
          }
          const payload = res.data.data || {};
          const list = extractPageList(payload);
          const total = pageTotalOrNull(payload);
          if (typeof total === "number") {
            totalKnown = total;
          }
          allRaw = allRaw.concat(list);
          if (!list.length) {
            break;
          }
          if (typeof totalKnown === "number" && allRaw.length >= totalKnown) {
            break;
          }
          if (list.length < pageSize) {
            break;
          }
          current += 1;
        }
        const cols = this.tabletitle.activityTicketTable.map((c) => ({
          header: c.label,
          key: c.prop,
        }));
        const rows = allRaw.map((item, i) => this.formatRow(item, i, 1, 1));
        downloadUtf8Csv(`activity-tickets-${this.activityId}.csv`, rows, cols);
        this.$message.success(this.$t("isagroup.成功"));
      } catch (e) {
        this.$message.error(this.$t("isagroup.失败"));
      } finally {
        this.exportLoading = false;
      }
    },
    getList() {
      if (!this.activityId) {
        this.tableData = [];
        this.paginationTotal = 0;
        return;
      }
      const cur = this.pagination.current;
      const sz = this.pagination.size;
      const params = this.buildTicketListParams(cur, sz);
      this.listLoading = true;
      getActivityTicketPage(params)
        .then((res) => {
          if (res.data.success) {
            const payload = res.data.data || {};
            const list = extractPageList(payload);
            const total = totalFromPagePayload(payload);
            this.paginationTotal = total;
            const pageForSeq = cur;
            const size = sz;
            this.tableData = list.map((item, index) =>
              this.formatRow(item, index, pageForSeq, size)
            );
            this.$nextTick(() => {
              const t = this.$refs.ticketTable;
              if (t && t.$refs && t.$refs.multipleTable) {
                t.$refs.multipleTable.doLayout();
              }
            });
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    formatRow(item, index, current, size) {
      const paidVal = item.paid;
      const paidLabel =
        paidVal === 1 || paidVal === "1"
          ? this.$t("isagroup.已支付")
          : this.$t("isagroup.未支付");
      const seq = (current - 1) * size + index + 1;
      const idPart = item.id != null ? String(item.id) : `noid-${index}`;
      return {
        ...item,
        _rowKey: `${idPart}-p${current}-i${index}`,
        _seq: String(seq).padStart(2, "0"),
        paidLabel,
        registerTimeLabel: item.registerTime
          ? dayjs(item.registerTime).format("YYYY-MM-DD HH:mm")
          : "--",
      };
    },
    /**
     * 买票 parentId 对应 Java Long：不能用 Number 解析（超大整数会精度丢失），
     * 合法时以字符串提交，由 Jackson 转为 Long。
     */
    normalizeOptionalParentId(raw) {
      const s = String(raw == null ? "" : raw).trim();
      if (s === "") {
        return { ok: true, value: undefined };
      }
      if (!/^\d+$/.test(s)) {
        return {
          ok: false,
          message: this.$t("isagroup.买票ID格式不正确"),
        };
      }
      const LONG_MAX = "9223372036854775807";
      if (
        s.length > LONG_MAX.length ||
        (s.length === LONG_MAX.length && s > LONG_MAX)
      ) {
        return {
          ok: false,
          message: this.$t("isagroup.买票ID超出范围"),
        };
      }
      return { ok: true, value: s };
    },
    /** 在安全整数范围内发 number，否则发 string，避免 Number 精度错误且尽量兼容 Jackson */
    parentIdToPayload(s) {
      const MAX_SAFE = "9007199254740991";
      if (
        s.length < MAX_SAFE.length ||
        (s.length === MAX_SAFE.length && s <= MAX_SAFE)
      ) {
        return Number(s);
      }
      return s;
    },
    playTab(type, row) {
      if (type === "edit") {
        this.openEdit(row);
      }
    },
    openAdd() {
      if (!this.activityId) {
        return;
      }
      this.dialogMode = "add";
      this.dialogForm = {
        id: null,
        activityId: this.activityId,
        phone: "",
        name: "",
        email: "",
        parentId: "",
        peopleCount: 1,
        ticketPrice: 0,
        paidAmount: 0,
        paid: 1,
        orderNo: "",
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.dialogFormRef) {
          this.$refs.dialogFormRef.clearValidate();
        }
      });
    },
    openEdit(row) {
      this.dialogMode = "edit";
      this.dialogForm = {
        id: row.id,
        activityId: row.activityId || this.activityId,
        phone: row.phone != null ? String(row.phone) : "",
        name: row.name || "",
        email: row.email || "",
        parentId:
          row.parentId != null && row.parentId !== ""
            ? String(row.parentId)
            : "",
        peopleCount: Number(row.peopleCount) || 1,
        ticketPrice: Number(row.ticketPrice) || 0,
        paidAmount: Number(row.paidAmount) || 0,
        paid: row.paid === 1 || row.paid === "1" ? 1 : 0,
        orderNo: row.orderNo || "",
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.dialogFormRef) {
          this.$refs.dialogFormRef.clearValidate();
        }
      });
    },
    resetDialogForm() {
      if (this.$refs.dialogFormRef) {
        this.$refs.dialogFormRef.resetFields();
      }
    },
    submitDialog() {
      this.$refs.dialogFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        const base = {
          activityId: Number(this.activityId),
          phone: this.dialogForm.phone,
          name: this.dialogForm.name || undefined,
          email: this.dialogForm.email || undefined,
          peopleCount: this.dialogForm.peopleCount,
          ticketPrice: this.dialogForm.ticketPrice,
          paidAmount: this.dialogForm.paidAmount,
          paid: this.dialogForm.paid,
          orderNo: this.dialogForm.orderNo || undefined,
        };
        const parentIdNorm = this.normalizeOptionalParentId(
          this.dialogForm.parentId
        );
        if (!parentIdNorm.ok) {
          this.$message.warning(parentIdNorm.message);
          return;
        }
        if (parentIdNorm.value !== undefined) {
          base.parentId = this.parentIdToPayload(parentIdNorm.value);
        }
        if (this.dialogMode === "add") {
          addActivityTicket(base).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.dialogVisible = false;
              this.getList();
            }
          });
        } else {
          editActivityTicket({
            ...base,
            id: this.dialogForm.id,
          }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.dialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    batchDel() {
      const selectionId = this.$refs.ticketTable.selectionId;
      if (!selectionId || selectionId.length === 0) {
        this.$message.warning(this.$t("isagroup.请选择要删除的数据"));
        return;
      }
      this.$confirm(
        this.$t("isagroup.确定要删除吗？"),
        this.$t("isagroup.删除"),
        {
          type: "warning",
        }
      )
        .then(() => {
          delActivityTicket({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    async handleDownloadTemplate() {
      if (!this.activityId) {
        return;
      }
      try {
        const res = await downloadActivityTicketTemplate();
        const cd =
          res.headers["content-disposition"] ||
          res.headers["Content-Disposition"] ||
          "";
        const filename =
          this.parseFilenameFromContentDisposition(cd) ||
          "ticket-import-template.xlsx";
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        this.$message.error(this.$t("isagroup.失败"));
      }
    },
    handleImport(req) {
      const file = req.file;
      importActivityTicket(file)
        .then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.getList();
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-registration-tab {
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

.registration-search-wrap {
  margin-bottom: 12px;
}

/* 搜索 + 右侧操作同一行：inline 表单 + flex 工具栏 */
.activity-search-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px 16px;
  width: 100%;
}

.activity-search-form--inline.el-form--inline {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}

.activity-search-form--inline.el-form--inline .el-form-item {
  margin-bottom: 0 !important;
  margin-right: 12px;
  vertical-align: bottom;
}

.activity-search-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}

.activity-search-field--search {
  margin-right: 0 !important;
}

.activity-search-input--w280 {
  width: 280px;
}

.activity-search-select--w140 {
  width: 140px;
}

.activity-search-daterange--w400 {
  width: 400px;
}

.registration-upload {
  display: inline-block;
}

.isa_table {
  width: 100%;
}

.registration-dialog-form {
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
