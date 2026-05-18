<template>
  <div class="activity-feedback-tab" v-loading="listLoading">
    <div class="community_searchFrom feedback-search-wrap">
      <div class="activity-search-toolbar">
        <el-form
          :inline="true"
          class="feedback-search-form activity-search-form--inline"
          :model="searchFrom"
          @submit.native.prevent
        >
          <el-form-item class="activity-search-field">
            <el-input
              v-model="searchFrom.keyword"
              clearable
              class="activity-search-input--w280"
              :placeholder="$t('isagroup.反馈内容搜索提示')"
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
          <el-form-item class="activity-search-field activity-search-field--search">
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
          <!-- 活动反馈：新增功能暂时关闭
          <el-button
            v-if="permissions['busdriver_edit']"
            type="primary"
            size="medium"
            :disabled="!activityId"
            @click="openAdd"
            >{{ $t("btn.新增") }}</el-button
          >
          -->
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
            v-if="
              (!readOnly || showExportEnded) && permissions['busdriver_edit']
            "
            type="primary"
            size="medium"
            plain
            :disabled="!activityId"
            @click="handleExport"
            >{{ $t("btn.导出") }}</el-button
          >
        </div>
      </div>
    </div>

    <div class="isa_table">
      <Table
        ref="feedbackTable"
        :showSelection="showSelection"
        :tableTitle="tabletitle.activityFeedbackTable"
        :tableData="tableData"
        :tableBtn="tableBtn"
        tableType="activityFeedback"
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
      :title="$t('isagroup.反馈详情')"
      :visible.sync="viewDialogVisible"
      width="560px"
      append-to-body
      custom-class="feedback-view-dialog"
    >
      <div class="feedback-view-body">
        <div class="feedback-view-row">
          <span class="feedback-view-label">{{ $t("isagroup.内容") }}</span>
          <div class="feedback-view-value">{{ viewDetail.content || "--" }}</div>
        </div>
        <div class="feedback-view-row">
          <span class="feedback-view-label">{{ $t("isagroup.满意度") }}</span>
          <span>{{ viewDetail.satisfactionLabel || "--" }}</span>
        </div>
        <div class="feedback-view-row">
          <span class="feedback-view-label">{{ $t("isagroup.电话") }}</span>
          <span>{{ viewDetail.phone || "--" }}</span>
        </div>
        <div class="feedback-view-row">
          <span class="feedback-view-label">{{ $t("isagroup.是否可见") }}</span>
          <span>{{ viewDetail.visibleLabel || "--" }}</span>
        </div>
        <div class="feedback-view-row">
          <span class="feedback-view-label">{{ $t("isagroup.创建时间") }}</span>
          <span>{{ viewDetail.createTimeLabel || "--" }}</span>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="viewDialogVisible = false">{{
          $t("btn.确定")
        }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      width="560px"
      :close-on-click-modal="false"
      append-to-body
      custom-class="feedback-edit-dialog"
      @closed="resetEditForm"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-position="top"
        class="feedback-edit-form"
      >
        <el-form-item :label="$t('isagroup.内容')" prop="content">
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="4"
            maxlength="2000"
            show-word-limit
            :placeholder="$t('consult.请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('isagroup.满意度')" prop="satisfactionRate">
          <el-radio-group v-model="editForm.satisfactionRate">
            <el-radio :label="1">{{ $t("isagroup.不满意") }}</el-radio>
            <el-radio :label="2">{{ $t("isagroup.一般") }}</el-radio>
            <el-radio :label="3">{{ $t("isagroup.满意") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('isagroup.电话')" prop="phone">
          <el-input
            v-model="editForm.phone"
            maxlength="30"
            :placeholder="$t('consult.请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('isagroup.是否可见')" prop="visible">
          <el-radio-group v-model="editForm.visible">
            <el-radio :label="1">{{ $t("isagroup.是") }}</el-radio>
            <el-radio :label="0">{{ $t("isagroup.否") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('isagroup.报名ID')">
          <el-input
            v-model="editForm.parentId"
            :placeholder="$t('consult.请输入')"
          />
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
import {
  getFeedbackPage,
  getFeedbackDetail,
  // addFeedback, // 新增已暂时关闭
  editFeedback,
  delFeedback,
  exportActivityFeedback,
} from "@/api/isacommunity/feedback.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

import activityDetailPagination from "../mixins/activityDetailPagination.js";
import { extractPageList, totalFromPagePayload } from "../utils/tabPageHelpers.js";

export default {
  name: "ActivityFeedbackList",
  mixins: [activityDetailPagination],
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
      tableBtn: [],
      permissionsBtn: [
        { name: "查看", type: "view", permissions: "busdriver_edit" },
        { name: "编辑", type: "edit", permissions: "busdriver_edit" },
      ],
      viewDialogVisible: false,
      viewDetail: {
        content: "",
        satisfactionLabel: "",
        phone: "",
        visibleLabel: "",
        createTimeLabel: "",
      },
      editDialogVisible: false,
      editMode: "add",
      editForm: {
        id: null,
        content: "",
        satisfactionRate: 3,
        phone: "",
        visible: 1,
        parentId: "",
      },
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
      return this.$t("isagroup.编辑反馈");
    },
    editRules() {
      const req = (msg) => [{ required: true, message: msg, trigger: "blur" }];
      return {
        content: req(this.$t("isagroup.请输入")),
        satisfactionRate: [
          {
            required: true,
            message: this.$t("isagroup.请选择"),
            trigger: "change",
          },
        ],
        visible: [
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
    ynLabel(val) {
      if (val === 1 || val === "1") {
        return this.$t("isagroup.是");
      }
      if (val === 0 || val === "0") {
        return this.$t("isagroup.否");
      }
      return "--";
    },
    satisfactionLabel(val) {
      const v = Number(val);
      if (v === 1) {
        return this.$t("isagroup.不满意");
      }
      if (v === 2) {
        return this.$t("isagroup.一般");
      }
      if (v === 3) {
        return this.$t("isagroup.满意");
      }
      return "--";
    },
    formatRow(item, index, current, size) {
      const createRaw =
        item.createTime != null ? item.createTime : item.create_time;
      const seq = (current - 1) * size + index + 1;
      const idPart = item.id != null ? String(item.id) : `noid-${index}`;
      return {
        ...item,
        _rowKey: `${idPart}-p${current}-i${index}`,
        _seq: String(seq).padStart(2, "0"),
        content:
          item.content != null && item.content !== ""
            ? String(item.content)
            : "--",
        satisfactionLabel: this.satisfactionLabel(item.satisfactionRate),
        phone:
          item.phone != null && item.phone !== ""
            ? String(item.phone)
            : "--",
        visibleLabel: this.ynLabel(item.visible),
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
      this.listLoading = true;
      getFeedbackPage(params)
        .then((res) => {
          if (res.data.success) {
            const payload = res.data.data || {};
            const list = extractPageList(payload);
            this.paginationTotal = totalFromPagePayload(payload);
            this.tableData = list.map((item, index) =>
              this.formatRow(item, index, cur, sz)
            );
            this.$nextTick(() => {
              const t = this.$refs.feedbackTable;
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
    playTab(type, row) {
      if (type === "view") {
        this.openView(row);
      } else if (type === "edit") {
        this.openEdit(row);
      }
    },
    openView(row) {
      getFeedbackDetail(row.id).then((res) => {
        if (!res.data.success || !res.data.data) {
          return;
        }
        const d = res.data.data;
        const createRaw = d.createTime != null ? d.createTime : d.create_time;
        this.viewDetail = {
          content: d.content || "",
          satisfactionLabel: this.satisfactionLabel(d.satisfactionRate),
          phone: d.phone != null ? String(d.phone) : "",
          visibleLabel: this.ynLabel(d.visible),
          createTimeLabel: createRaw
            ? dayjs(createRaw).format("YYYY-MM-DD HH:mm")
            : "--",
        };
        this.viewDialogVisible = true;
      });
    },
    openEdit(row) {
      getFeedbackDetail(row.id).then((res) => {
        if (!res.data.success || !res.data.data) {
          return;
        }
        const d = res.data.data;
        this.editMode = "edit";
        const pid = d.parentId != null ? d.parentId : "";
        this.editForm = {
          id: d.id,
          content: d.content || "",
          satisfactionRate:
            [1, 2, 3].indexOf(Number(d.satisfactionRate)) >= 0
              ? Number(d.satisfactionRate)
              : 3,
          phone: d.phone != null ? String(d.phone) : "",
          visible: d.visible === 0 || d.visible === "0" ? 0 : 1,
          parentId: pid !== "" ? String(pid) : "",
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
    normalizeParentId(raw) {
      const s = String(raw == null ? "" : raw).trim();
      if (s === "") {
        return undefined;
      }
      if (!/^\d+$/.test(s)) {
        return undefined;
      }
      return s.length <= 16 ? Number(s) : s;
    },
    submitEdit() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        const parentNorm = this.normalizeParentId(this.editForm.parentId);
        const base = {
          content: this.editForm.content,
          satisfactionRate: this.editForm.satisfactionRate,
          phone: this.editForm.phone || undefined,
          visible: this.editForm.visible,
        };
        if (parentNorm !== undefined) {
          base.parentId = parentNorm;
        }
        editFeedback({
          id: this.editForm.id,
          ...base,
        }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.editDialogVisible = false;
            this.getList();
          }
        });
      });
    },
    batchDel() {
      const selectionId = this.$refs.feedbackTable.selectionId;
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
          delFeedback({ ids: selectionId }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    batchSetVisible(vis) {
      const tableRef = this.$refs.feedbackTable;
      if (!tableRef || !tableRef.selectionId || tableRef.selectionId.length === 0) {
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
            editFeedback({ id, visible: vis }).then((res) => res.data.success)
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
    async handleExport() {
      if (!this.activityId) {
        return;
      }
      try {
        const res = await exportActivityFeedback(this.activityId);
        const cd =
          res.headers["content-disposition"] ||
          res.headers["Content-Disposition"] ||
          "";
        const filename =
          this.parseFilenameFromContentDisposition(cd) || "feedback.xlsx";
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
  },
};
</script>

<style lang="scss" scoped>
.activity-feedback-tab {
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

.feedback-search-wrap {
  margin-bottom: 12px;
}

.feedback-search-form {
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

.feedback-view-body {
  padding: 4px 0;
}

.feedback-view-row {
  margin-bottom: 16px;
  line-height: 1.5;
}

.feedback-view-label {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.feedback-view-value {
  white-space: pre-wrap;
  word-break: break-word;
  color: #333;
}

.feedback-edit-form {
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
