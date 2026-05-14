<template>
  <div class="activity-blessing-tab" v-loading="listLoading">
    <div class="community_searchFrom blessing-search-wrap">
      <div class="activity-search-toolbar">
        <el-form
          :inline="true"
          class="blessing-search-form activity-search-form--inline"
          :model="searchFrom"
          @submit.native.prevent
        >
          <el-form-item class="activity-search-field">
            <el-input
              v-model="searchFrom.keyword"
              clearable
              class="activity-search-input--w280"
              :placeholder="$t('isagroup.祝福语搜索提示')"
              @keyup.enter.native="getList"
            />
          </el-form-item>
          <el-form-item class="activity-search-field">
            <el-select
              v-model="searchFrom.visible"
              clearable
              class="activity-search-select--w140"
              :placeholder="$t('isagroup.是否可见')"
            >
              <el-option :label="$t('isagroup.是')" :value="1" />
              <el-option :label="$t('isagroup.否')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            class="activity-search-field activity-search-field--search"
          >
            <el-button type="primary" size="medium" @click="getList">{{
              $t("isagroup.搜索")
            }}</el-button>
          </el-form-item>
        </el-form>
        <div v-if="!readOnly || showExportEnded" class="activity-search-toolbar__actions">
          <template v-if="!readOnly">
            <el-button
              v-if="permissions['busdriver_edit']"
              type="primary"
              size="medium"
              :disabled="!activityId"
              @click="openAdd"
              >{{ $t("btn.新增") }}</el-button
            >
            <el-button
              v-if="
                permissions['busdriver_del'] || permissions['activity_ticket_del']
              "
              type="danger"
              size="medium"
              plain
              :disabled="tableSelectionCount === 0"
              @click="batchDel"
              >{{ $t("btn.删除") }}</el-button
            >
            <el-button
              v-if="permissions['busdriver_edit']"
              type="primary"
              size="medium"
              plain
              :disabled="!activityId || tableSelectionCount === 0"
              @click="batchSetVisible(1)"
              >{{ $t("isagroup.可见") }}</el-button
            >
            <el-button
              v-if="permissions['busdriver_edit']"
              type="primary"
              size="medium"
              plain
              :disabled="!activityId || tableSelectionCount === 0"
              @click="batchSetVisible(0)"
              >{{ $t("isagroup.不可见") }}</el-button
            >
          </template>
          <el-button
            v-if="showExportEnded && permissions['busdriver_edit']"
            type="primary"
            size="medium"
            plain
            :disabled="!activityId || blessingExportLoading"
            @click="exportBlessingCsv"
            >{{ $t("btn.导出") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="isa_table">
      <Table
        ref="blessingTable"
        :showSelection="showSelection"
        :tableTitle="tabletitle.activityBlessingTable"
        :tableData="tableData"
        :tableBtn="tableBtn"
        tableType="activityBlessing"
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

    <!-- 查看 -->
    <el-dialog
      :title="$t('isagroup.祝福语详情')"
      :visible.sync="viewDialogVisible"
      width="560px"
      append-to-body
      custom-class="blessing-view-dialog"
    >
      <div class="blessing-view-body">
        <div class="blessing-view-row">
          <span class="blessing-view-label">{{ $t("isagroup.报名ID") }}</span>
          <span>{{ viewDetail.ticketIdLabel || "--" }}</span>
        </div>
        <div class="blessing-view-row">
          <span class="blessing-view-label">{{ $t("isagroup.祝福内容") }}</span>
          <div class="blessing-view-value">
            {{ viewDetail.content || "--" }}
          </div>
        </div>
        <div class="blessing-view-row">
          <span class="blessing-view-label">{{ $t("isagroup.是否可见") }}</span>
          <span>{{ viewDetail.visibleLabel || "--" }}</span>
        </div>
        <div class="blessing-view-row">
          <span class="blessing-view-label">{{ $t("isagroup.创建时间") }}</span>
          <span>{{ viewDetail.createTimeLabel || "--" }}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="viewDialogVisible = false">{{
          $t("btn.确定")
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 新增 / 编辑 -->
    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      width="560px"
      :close-on-click-modal="false"
      append-to-body
      custom-class="blessing-edit-dialog"
      @closed="resetEditForm"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-position="top"
        class="blessing-edit-form"
      >
        <el-form-item
          v-if="editMode === 'add'"
          :label="$t('isagroup.活动项目')"
          prop="programId"
        >
          <el-select
            v-model="editForm.programId"
            filterable
            :placeholder="$t('isagroup.请选择')"
            style="width: 100%"
            :loading="programLoading"
          >
            <el-option
              v-for="opt in programOptions"
              :key="String(opt.id)"
              :label="programOptionLabel(opt)"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="editMode === 'add'"
          :label="$t('isagroup.报名ID')"
          prop="ticketId"
        >
          <el-select
            v-model="editForm.ticketId"
            filterable
            remote
            reserve-keyword
            :remote-method="searchTickets"
            :loading="ticketLoading"
            :placeholder="$t('isagroup.请选择')"
            style="width: 100%"
          >
            <el-option
              v-for="opt in ticketOptions"
              :key="String(opt.id)"
              :label="ticketOptionLabel(opt)"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('isagroup.祝福内容')" prop="content">
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="4"
            maxlength="2000"
            show-word-limit
            :placeholder="$t('consult.请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('isagroup.是否可见')" prop="visible">
          <el-radio-group v-model="editForm.visible">
            <el-radio :label="1">{{ $t("isagroup.是") }}</el-radio>
            <el-radio :label="0">{{ $t("isagroup.否") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{
          $t("btn.取消")
        }}</el-button>
        <el-button type="primary" @click="submitEdit">{{
          $t("btn.确定")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getActivityTicketPage } from "@/api/isacommunity/activity.js";
import { getActivityProgramList } from "@/api/isacommunity/activityprogram.js";
import {
  addBlessing,
  delBlessing,
  editBlessing,
  getBlessingDetail,
  getBlessingPage,
} from "@/api/isacommunity/blessing.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import { downloadUtf8Csv } from "@/util/download";

export default {
  name: "ActivityBlessingList",
  components: { Table, Pagination },
  props: {
    activityId: {
      type: [String, Number],
      default: "",
    },
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
      listLoading: false,
      tableSelectionCount: 0,
      tableData: [],
      paginationTotal: 0,
      pagination: {
        size: 10,
        current: 1,
      },
      searchFrom: {
        keyword: "",
        visible: undefined,
      },
      tableHeight: "calc(100vh - 480px)",
      blessingExportLoading: false,
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "view", permissions: "busdriver_edit" },
        { name: "编辑", type: "edit", permissions: "busdriver_edit" },
      ],
      viewDialogVisible: false,
      viewDetail: {
        ticketIdLabel: "",
        content: "",
        visibleLabel: "",
        createTimeLabel: "",
      },
      editDialogVisible: false,
      editMode: "add",
      editForm: {
        id: null,
        programId: null,
        ticketId: null,
        content: "",
        visible: 1,
      },
      programOptions: [],
      programLoading: false,
      ticketOptions: [],
      ticketLoading: false,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    showSelection() {
      return (
        !this.readOnly &&
        (this.permissions["busdriver_del"] ||
          this.permissions["activity_ticket_del"])
      );
    },
    editDialogTitle() {
      return this.editMode === "add"
        ? this.$t("isagroup.新增祝福语")
        : this.$t("isagroup.编辑祝福语");
    },
    editRules() {
      const req = (msg) => [{ required: true, message: msg, trigger: "blur" }];
      const rules = {
        content: req(this.$t("isagroup.请输入")),
        visible: [
          {
            required: true,
            message: this.$t("isagroup.请选择"),
            trigger: "change",
          },
        ],
      };
      if (this.editMode === "add") {
        rules.programId = [
          {
            required: true,
            message: this.$t("isagroup.活动项目"),
            trigger: "change",
          },
        ];
        rules.ticketId = [
          {
            required: true,
            message: this.$t("isagroup.请选择"),
            trigger: "change",
          },
        ];
      }
      return rules;
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
      if (this.readOnly) {
        this.tableBtn = this.permissionsBtn
          .filter((item) => item.type === "view")
          .filter((item) => this.permissions[item.permissions]);
      } else {
        this.tableBtn = this.permissionsBtn.filter(
          (item) => this.permissions[item.permissions]
        );
      }
    },
    programOptionLabel(opt) {
      return opt.cnName || opt.name || opt.programName || String(opt.id);
    },
    ticketOptionLabel(opt) {
      const id = opt.id != null ? String(opt.id) : "";
      const phone = opt.phone ? String(opt.phone) : "";
      const name = opt.name ? String(opt.name) : "";
      const parts = [id, phone, name].filter((s) => s !== "");
      return parts.length ? parts.join(" · ") : id;
    },
    searchTickets(query) {
      if (!this.activityId) {
        this.ticketOptions = [];
        return;
      }
      const kw = query != null ? String(query).trim() : "";
      this.ticketLoading = true;
      getActivityTicketPage({
        activityId: this.activityId,
        current: 1,
        size: 100,
        pageNum: 1,
        pageSize: 100,
        keyword: kw || undefined,
      })
        .then((res) => {
          if (res.data.success) {
            const payload = res.data.data || {};
            this.ticketOptions = this.extractPageList(payload);
          }
        })
        .finally(() => {
          this.ticketLoading = false;
        });
    },
    loadPrograms() {
      if (!this.activityId) {
        this.programOptions = [];
        return;
      }
      this.programLoading = true;
      getActivityProgramList({ activityId: this.activityId })
        .then((res) => {
          if (res.data.success) {
            const raw = res.data.data;
            let list = [];
            if (Array.isArray(raw)) {
              list = raw;
            } else if (raw && Array.isArray(raw.records)) {
              list = raw.records;
            } else if (raw && Array.isArray(raw.list)) {
              list = raw.list;
            }
            this.programOptions = list;
          }
        })
        .finally(() => {
          this.programLoading = false;
        });
    },
    extractPageList(payload) {
      if (!payload || typeof payload !== "object") {
        return [];
      }
      if (Array.isArray(payload)) {
        return payload;
      }
      if (Array.isArray(payload.records)) {
        return payload.records;
      }
      if (Array.isArray(payload.content)) {
        return payload.content;
      }
      if (Array.isArray(payload.list)) {
        return payload.list;
      }
      if (Array.isArray(payload.data)) {
        return payload.data;
      }
      if (
        payload.data &&
        typeof payload.data === "object" &&
        Array.isArray(payload.data.records)
      ) {
        return payload.data.records;
      }
      return [];
    },
    buildBlessingParams(cur, sz) {
      const params = {
        activityId: this.activityId,
        current: cur,
        size: sz,
        pageNum: cur,
        pageSize: sz,
        keyword: this.searchFrom.keyword || undefined,
      };
      if (this.searchFrom.visible === 0 || this.searchFrom.visible === 1) {
        params.visible = this.searchFrom.visible;
      }
      return params;
    },
    async exportBlessingCsv() {
      if (!this.activityId || this.blessingExportLoading) {
        return;
      }
      this.blessingExportLoading = true;
      const pageSize = 200;
      let current = 1;
      let allRaw = [];
      let totalKnown = null;
      try {
        while (current < 600) {
          const params = this.buildBlessingParams(current, pageSize);
          const res = await getBlessingPage(params);
          if (!res.data.success) {
            break;
          }
          const payload = res.data.data || {};
          const list = this.extractPageList(payload);
          const total =
            payload.total !== undefined && payload.total !== null
              ? payload.total
              : payload.totalElements != null
              ? payload.totalElements
              : null;
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
        const cols = this.tabletitle.activityBlessingTable.map((c) => ({
          header: c.label,
          key: c.prop,
        }));
        const rows = allRaw.map((item, i) =>
          this.formatRow(item, i, 1, 1)
        );
        downloadUtf8Csv(
          `activity-blessing-${this.activityId}.csv`,
          rows,
          cols
        );
        this.$message.success(this.$t("isagroup.成功"));
      } catch (e) {
        this.$message.error(this.$t("isagroup.失败"));
      } finally {
        this.blessingExportLoading = false;
      }
    },
    ynLabel(val) {
      if (val === 1 || val === "1") {
        return this.$t("isagroup.是");
      }
      if (val === 0 || val === "0") {
        return this.$t("isagroup.否");
      }
      return "--";
    },
    formatRow(item, index, current, size) {
      const createRaw =
        item.createTime != null ? item.createTime : item.create_time;
      const seq = (current - 1) * size + index + 1;
      const idPart = item.id != null ? String(item.id) : `noid-${index}`;
      const vis = item.visible;
      const ticketIdRaw =
        item.ticketId != null ? item.ticketId : item.ticket_id;
      return {
        ...item,
        _rowKey: `${idPart}-p${current}-i${index}`,
        _seq: String(seq).padStart(2, "0"),
        ticketIdLabel:
          ticketIdRaw != null && ticketIdRaw !== ""
            ? String(ticketIdRaw)
            : "--",
        content:
          item.content != null && item.content !== ""
            ? String(item.content)
            : "--",
        visibleLabel: this.ynLabel(vis),
        createTimeLabel: createRaw
          ? dayjs(createRaw).format("YYYY-MM-DD HH:mm")
          : "--",
      };
    },
    getList() {
      if (!this.activityId) {
        this.tableData = [];
        this.paginationTotal = 0;
        return;
      }
      const cur = this.pagination.current;
      const sz = this.pagination.size;
      const params = this.buildBlessingParams(cur, sz);
      this.listLoading = true;
      getBlessingPage(params)
        .then((res) => {
          if (res.data.success) {
            const payload = res.data.data || {};
            const list = this.extractPageList(payload);
            const total =
              payload.total !== undefined && payload.total !== null
                ? payload.total
                : payload.totalElements != null
                ? payload.totalElements
                : 0;
            this.paginationTotal = total;
            this.tableData = list.map((item, index) =>
              this.formatRow(item, index, cur, sz)
            );
            this.$nextTick(() => {
              const t = this.$refs.blessingTable;
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
    handleCurrentChange(page) {
      this.pagination.current = page;
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1;
      this.getList();
    },
    playTab(type, row) {
      if (type === "view") {
        this.openView(row);
      } else if (type === "edit") {
        this.openEdit(row);
      }
    },
    openView(row) {
      getBlessingDetail(row.id).then((res) => {
        if (!res.data.success || !res.data.data) {
          return;
        }
        const d = res.data.data;
        const createRaw = d.createTime != null ? d.createTime : d.create_time;
        const tid = d.ticketId != null ? d.ticketId : d.ticket_id;
        this.viewDetail = {
          ticketIdLabel: tid != null && tid !== "" ? String(tid) : "",
          content: d.content || "",
          visibleLabel: this.ynLabel(d.visible),
          createTimeLabel: createRaw
            ? dayjs(createRaw).format("YYYY-MM-DD HH:mm")
            : "--",
        };
        this.viewDialogVisible = true;
      });
    },
    openAdd() {
      if (!this.activityId) {
        return;
      }
      this.editMode = "add";
      this.editForm = {
        id: null,
        programId: null,
        ticketId: null,
        content: "",
        visible: 1,
      };
      this.loadPrograms();
      this.searchTickets("");
      this.editDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.editFormRef) {
          this.$refs.editFormRef.clearValidate();
        }
      });
    },
    openEdit(row) {
      getBlessingDetail(row.id).then((res) => {
        if (!res.data.success || !res.data.data) {
          return;
        }
        const d = res.data.data;
        this.editMode = "edit";
        this.editForm = {
          id: d.id,
          programId: d.programId != null ? d.programId : null,
          ticketId: null,
          content: d.content || "",
          visible: d.visible === 0 || d.visible === "0" ? 0 : 1,
        };
        this.editDialogVisible = true;
        this.$nextTick(() => {
          if (this.$refs.editFormRef) {
            this.$refs.editFormRef.clearValidate();
          }
        });
      });
    },
    resetEditForm() {
      if (this.$refs.editFormRef) {
        this.$refs.editFormRef.resetFields();
      }
    },
    submitEdit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.editMode === "add") {
          addBlessing({
            programId: this.editForm.programId,
            ticketId: this.editForm.ticketId,
            content: this.editForm.content,
            visible: this.editForm.visible,
          }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.editDialogVisible = false;
              this.getList();
            }
          });
        } else {
          editBlessing({
            id: this.editForm.id,
            programId: this.editForm.programId,
            content: this.editForm.content,
            visible: this.editForm.visible,
          }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.editDialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    batchDel() {
      const selectionId = this.$refs.blessingTable.selectionId;
      if (!selectionId || selectionId.length === 0) {
        this.$message.warning(this.$t("isagroup.请选择要删除的数据"));
        return;
      }
      this.$confirm(
        this.$t("isagroup.确定要删除吗？"),
        this.$t("isagroup.删除"),
        { type: "warning" }
      )
        .then(() => {
          delBlessing({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    batchSetVisible(vis) {
      const tableRef = this.$refs.blessingTable;
      if (
        !tableRef ||
        !tableRef.selectionId ||
        tableRef.selectionId.length === 0
      ) {
        this.$message.warning(this.$t("isagroup.请选择要操作的数据"));
        return;
      }
      const ids = [...tableRef.selectionId];
      this.$confirm(
        vis === 1
          ? this.$t("isagroup.确定设为可见吗")
          : this.$t("isagroup.确定设为不可见吗"),
        this.$t("isagroup.提示"),
        { type: "warning" }
      )
        .then(() => {
          const tasks = ids.map((id) =>
            editBlessing({ id, visible: vis }).then((res) => res.data.success)
          );
          Promise.all(tasks).then((results) => {
            if (results.every(Boolean)) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-blessing-tab {
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

.blessing-search-wrap {
  margin-bottom: 12px;
}

.blessing-search-form {
  width: 100%;
}

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

.activity-search-field--search {
  margin-right: 0 !important;
}

.activity-search-input--w280 {
  width: 280px;
}

.activity-search-select--w140 {
  width: 140px;
}

.activity-search-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}

.isa_table {
  width: 100%;
}

.blessing-view-body {
  padding: 4px 0;
}

.blessing-view-row {
  margin-bottom: 16px;
  line-height: 1.5;
}

.blessing-view-label {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.blessing-view-value {
  white-space: pre-wrap;
  word-break: break-word;
  color: #333;
}

.blessing-edit-form {
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
