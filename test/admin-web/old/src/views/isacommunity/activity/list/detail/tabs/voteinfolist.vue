<template>
  <div class="activity-voteinfo-tab" v-loading="listLoading">
    <div class="community_searchFrom voteinfo-search-wrap">
      <div class="activity-search-toolbar">
        <el-form
          :inline="true"
          class="voteinfo-search-form activity-search-form--inline"
          :model="searchFrom"
          @submit.native.prevent
        >
          <el-form-item class="activity-search-field">
            <el-input
              v-model="searchFrom.keyword"
              clearable
              class="activity-search-input--w320"
              :placeholder="$t('isagroup.投票信息搜索提示')"
              @keyup.enter.native="getList"
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
        <div v-if="!readOnly" class="activity-search-toolbar__actions">
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
        </div>
      </div>
    </div>

    <div class="isa_table">
      <Table
        ref="voteRecordTable"
        :showSelection="showSelection"
        :tableTitle="tabletitle.activityVoteRecordTable"
        :tableData="tableData"
        :tableBtn="tableBtn"
        tableType="activityVoteRecord"
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
      :title="$t('isagroup.新增投票记录')"
      :visible.sync="dialogVisible"
      width="560px"
      :close-on-click-modal="false"
      append-to-body
      custom-class="voteinfo-dialog"
      @closed="resetDialogForm"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-position="top"
        class="voteinfo-dialog-form"
      >
        <el-form-item :label="$t('isagroup.签到记录')" prop="checkinId">
          <el-select
            v-model="dialogForm.checkinId"
            filterable
            :placeholder="$t('isagroup.请选择')"
            style="width: 100%"
            :loading="checkinLoading"
          >
            <el-option
              v-for="opt in checkinOptions"
              :key="String(opt.id)"
              :label="checkinOptionLabel(opt)"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('isagroup.投票节目')" prop="voteId">
          <el-select
            v-model="dialogForm.voteId"
            filterable
            :placeholder="$t('isagroup.请选择')"
            style="width: 100%"
            :loading="voteProgramLoading"
          >
            <el-option
              v-for="opt in voteProgramOptions"
              :key="String(opt.id)"
              :label="voteProgramOptionLabel(opt)"
              :value="opt.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('isagroup.投票人')" prop="voter">
          <el-input
            v-model="dialogForm.voter"
            maxlength="100"
            :placeholder="$t('consult.请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('isagroup.电话')" prop="phone">
          <el-input
            v-model="dialogForm.phone"
            maxlength="30"
            :placeholder="$t('consult.请输入')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("btn.取消")
        }}</el-button>
        <el-button type="primary" @click="submitDialog">{{
          $t("btn.确定")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getActivityCheckinPage } from "@/api/isacommunity/activity.js";
import {
  addVoteRecord,
  delVoteRecord,
  getVoteProgramList,
  getVoteRecordPage,
} from "@/api/isacommunity/voteprogram.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

export default {
  name: "ActivityVoteInfoList",
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
      },
      tableHeight: "calc(100vh - 420px)",
      tableBtn: [],
      dialogVisible: false,
      dialogForm: {
        checkinId: null,
        voteId: null,
        voter: "",
        phone: "",
      },
      checkinOptions: [],
      checkinLoading: false,
      voteProgramOptions: [],
      voteProgramLoading: false,
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
    dialogRules() {
      const req = (msg) => [
        { required: true, message: msg, trigger: "change" },
      ];
      const reqBlur = (msg) => [
        { required: true, message: msg, trigger: "blur" },
      ];
      return {
        checkinId: req(this.$t("isagroup.请选择签到记录")),
        voteId: req(this.$t("isagroup.请选择投票节目")),
        voter: reqBlur(this.$t("isagroup.请输入")),
        phone: reqBlur(this.$t("isagroup.请输入")),
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
        this.loadVotePrograms();
      }
    },
  },
  methods: {
    onTableSelectionChange(arr) {
      this.tableSelectionCount = Array.isArray(arr) ? arr.length : 0;
    },
    voteProgramOptionLabel(opt) {
      const name = opt.cnName || opt.voteName || opt.name || "";
      const proj = opt.programName || "";
      if (name && proj) {
        return `${name} · ${proj}`;
      }
      return name || proj || String(opt.id);
    },
    checkinOptionLabel(row) {
      const id = row.id != null ? row.id : "";
      const name =
        row.name != null && row.name !== "" ? String(row.name) : "";
      const phone =
        row.phone != null && row.phone !== "" ? String(row.phone) : "";
      const code =
        row.code != null && row.code !== "" ? String(row.code) : "";
      const parts = [name, phone, code].filter(Boolean);
      return parts.length ? `#${id} · ${parts.join(" · ")}` : `#${id}`;
    },
    loadCheckinOptions() {
      if (!this.activityId) {
        this.checkinOptions = [];
        return;
      }
      this.checkinLoading = true;
      const params = {
        activityId: this.activityId,
        current: 1,
        size: 500,
        pageNum: 1,
        pageSize: 500,
      };
      getActivityCheckinPage(params)
        .then((res) => {
          if (res.data.success) {
            const payload = res.data.data || {};
            const list = this.extractPageList(payload);
            this.checkinOptions = Array.isArray(list) ? list : [];
          }
        })
        .finally(() => {
          this.checkinLoading = false;
        });
    },
    loadVotePrograms() {
      if (!this.activityId) {
        this.voteProgramOptions = [];
        return;
      }
      this.voteProgramLoading = true;
      getVoteProgramList({ activityId: this.activityId })
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
            this.voteProgramOptions = list;
          }
        })
        .finally(() => {
          this.voteProgramLoading = false;
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
    formatRow(item, index, current, size) {
      const createRaw =
        item.createTime != null ? item.createTime : item.create_time;
      const seq = (current - 1) * size + index + 1;
      const idPart = item.id != null ? String(item.id) : `noid-${index}`;
      return {
        ...item,
        _rowKey: `${idPart}-p${current}-i${index}`,
        _seq: String(seq).padStart(2, "0"),
        voter:
          item.voter != null && item.voter !== "" ? String(item.voter) : "--",
        phone:
          item.phone != null && item.phone !== "" ? String(item.phone) : "--",
        programName:
          item.programName != null && item.programName !== ""
            ? item.programName
            : "--",
        voteName:
          item.voteName != null && item.voteName !== "" ? item.voteName : "--",
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
      this.listLoading = true;
      getVoteRecordPage(params)
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
              const t = this.$refs.voteRecordTable;
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
    playTab() {},
    openAdd() {
      if (!this.activityId) {
        return;
      }
      this.dialogForm = {
        checkinId: null,
        voteId: null,
        voter: "",
        phone: "",
      };
      this.loadCheckinOptions();
      this.loadVotePrograms();
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
        const aid = this.activityId;
        const cid = this.dialogForm.checkinId;
        const vid = this.dialogForm.voteId;
        if (cid == null || cid === "" || vid == null || vid === "") {
          return;
        }
        const payload = {
          activityId:
            typeof aid === "string" && /^\d+$/.test(aid) && aid.length <= 16
              ? Number(aid)
              : aid,
          checkinId: Number(cid),
          voteId: Number(vid),
          voter: this.dialogForm.voter,
          phone: this.dialogForm.phone,
        };
        addVoteRecord(payload).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.dialogVisible = false;
            this.getList();
          }
        });
      });
    },
    batchDel() {
      const selectionId = this.$refs.voteRecordTable.selectionId;
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
          delVoteRecord({ ids: selectionId }).then((res) => {
            if (res.data.success) {
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
.activity-voteinfo-tab {
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

.voteinfo-search-wrap {
  margin-bottom: 12px;
}

.voteinfo-search-form {
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

.activity-search-field {
  margin-bottom: 0 !important;
}

.activity-search-input--w320 {
  width: 320px;
}

.isa_table {
  width: 100%;
}

.voteinfo-dialog-form {
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
