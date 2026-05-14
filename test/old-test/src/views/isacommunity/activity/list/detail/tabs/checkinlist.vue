<template>
  <div class="activity-checkin-tab" v-loading="listLoading">
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
            :placeholder="$t('isagroup.签到搜索提示')"
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
            v-model="checkinTimeRange"
            class="activity-search-daterange--w400"
            type="datetimerange"
            range-separator="—"
            :start-placeholder="$t('isagroup.开始时间')"
            :end-placeholder="$t('isagroup.结束时间')"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item class="activity-search-field">
          <el-select
            v-model="searchFrom.participateLottery"
            clearable
            class="activity-search-select--w168"
            :placeholder="$t('isagroup.是否参与抽奖')"
          >
            <el-option :label="$t('isagroup.是')" :value="1" />
            <el-option :label="$t('isagroup.否')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item class="activity-search-field">
          <el-select
            v-model="searchFrom.lottery_validate"
            clearable
            class="activity-search-select--w168"
            :placeholder="$t('isagroup.是否在抽奖池内')"
          >
            <el-option :label="$t('isagroup.是')" :value="1" />
            <el-option :label="$t('isagroup.否')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item class="activity-search-field">
          <el-select
            v-model="searchFrom.checkin"
            clearable
            class="activity-search-select--w140"
            :placeholder="$t('isagroup.是否签到')"
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
      <div
        v-if="showExportEnded"
        class="activity-search-toolbar__actions"
      >
        <el-button
          v-if="permissions['busdriver_edit']"
          type="primary"
          size="medium"
          plain
          :disabled="!activityId || exportLoading"
          @click="exportCheckinCsv"
          >{{ $t("btn.导出") }}</el-button
        >
      </div>
    </div>
    </div>

    <div class="isa_table">
      <Table
        ref="checkinTable"
        :showSelection="false"
        :tableTitle="tabletitle['activityCheckinTable']"
        :tableData="tableData"
        :tableBtn="tableBtn"
        tableType="activityCheckin"
        :height="tableHeight"
        @playTab="playTab"
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
      :title="$t('isagroup.编辑签到')"
      :visible.sync="dialogVisible"
      width="520px"
      :close-on-click-modal="false"
      append-to-body
      custom-class="checkin-edit-dialog"
      @closed="resetDialogForm"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        label-position="top"
        class="checkin-dialog-form"
      >
        <el-form-item :label="$t('isagroup.是否签到')">
          <el-select v-model="dialogForm.checkin" style="width: 100%">
            <el-option :label="$t('isagroup.是')" :value="1" />
            <el-option :label="$t('isagroup.否')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('isagroup.是否参与抽奖')">
          <el-select
            v-model="dialogForm.participateLottery"
            style="width: 100%"
          >
            <el-option :label="$t('isagroup.是')" :value="1" />
            <el-option :label="$t('isagroup.否')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('isagroup.是否在抽奖池内')">
          <el-select v-model="dialogForm.lottery_validate" style="width: 100%">
            <el-option :label="$t('isagroup.是')" :value="1" />
            <el-option :label="$t('isagroup.否')" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('isagroup.允许抽奖')">
          <el-select v-model="dialogForm.allow_lottery" style="width: 100%">
            <el-option :label="$t('isagroup.是')" :value="1" />
            <el-option :label="$t('isagroup.否')" :value="0" />
          </el-select>
        </el-form-item>
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
  editActivityCheckin,
  getActivityCheckinPage,
} from "@/api/isacommunity/activity.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import { downloadUtf8Csv } from "@/util/download";

export default {
  name: "ActivityCheckinList",
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
      tableData: [],
      paginationTotal: 0,
      pagination: {
        size: 10,
        current: 1,
      },
      searchFrom: {
        keyword: "",
        paid: undefined,
        participateLottery: undefined,
        lottery_validate: undefined,
        checkin: undefined,
      },
      checkinTimeRange: null,
      listLoading: false,
      exportLoading: false,
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
      dialogSnapshot: {},
      dialogForm: {
        id: null,
        checkin: 0,
        participateLottery: 0,
        lottery_validate: 0,
        allow_lottery: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
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
    refreshTableBtn() {
      if (this.readOnly || !this.permissions["busdriver_edit"]) {
        this.tableBtn = [];
      } else {
        this.tableBtn = this.permissionsBtn.filter(
          (item) => this.permissions[item.permissions]
        );
      }
    },
    ynLabel(val) {
      return val === 1 || val === "1"
        ? this.$t("isagroup.是")
        : this.$t("isagroup.否");
    },
    ynOrDash(val) {
      if (val === undefined || val === null || val === "") {
        return "--";
      }
      return this.ynLabel(val);
    },
    /** API checkin 为 boolean，列表也可能返回 true/false */
    ynCheckinDisplay(val) {
      if (val === undefined || val === null || val === "") {
        return "--";
      }
      if (val === true || val === 1 || val === "1") {
        return this.$t("isagroup.是");
      }
      if (val === false || val === 0 || val === "0") {
        return this.$t("isagroup.否");
      }
      return this.ynLabel(val);
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
    buildCheckinListParams(cur, sz) {
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
      if (
        this.searchFrom.participateLottery === 0 ||
        this.searchFrom.participateLottery === 1
      ) {
        params.participateLottery = this.searchFrom.participateLottery;
      }
      if (
        this.searchFrom.lottery_validate === 0 ||
        this.searchFrom.lottery_validate === 1
      ) {
        params.lottery_validate = this.searchFrom.lottery_validate;
      }
      if (this.searchFrom.checkin === 0 || this.searchFrom.checkin === 1) {
        params.checkin = this.searchFrom.checkin;
      }
      if (this.checkinTimeRange && this.checkinTimeRange.length === 2) {
        params.checkinTimeStart = this.checkinTimeRange[0];
        params.checkinTimeEnd = this.checkinTimeRange[1];
      }
      return params;
    },
    async exportCheckinCsv() {
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
          const params = this.buildCheckinListParams(current, pageSize);
          const res = await getActivityCheckinPage(params);
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
        const cols = this.tabletitle.activityCheckinTable.map((c) => ({
          header: c.label,
          key: c.prop,
        }));
        const rows = allRaw.map((item, i) =>
          this.formatRow(item, i, 1, 1)
        );
        downloadUtf8Csv(
          `activity-checkin-${this.activityId}.csv`,
          rows,
          cols
        );
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
      const params = this.buildCheckinListParams(cur, sz);
      this.listLoading = true;
      getActivityCheckinPage(params)
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
            const pageForSeq = cur;
            const size = sz;
            this.tableData = list.map((item, index) =>
              this.formatRow(item, index, pageForSeq, size)
            );
            this.$nextTick(() => {
              const t = this.$refs.checkinTable;
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
      const checkinTimeRaw =
        item.checkin_time != null ? item.checkin_time : item.checkinTime;
      const createdAtRaw =
        item.created_at != null ? item.created_at : item.createdAt;
      const ticketIdRaw =
        item.ticketId != null ? item.ticketId : item.ticket_id;
      const codeRaw = item.code;
      const paidRaw = item.paid;
      const participateRaw =
        item.participateLottery != null
          ? item.participateLottery
          : item.participate_lottery;
      const lotteryValRaw = item.lottery_validate;
      const allowLotRaw =
        item.allow_lottery != null ? item.allow_lottery : item.allowLottery;
      const checkedRaw = item.checkin != null ? item.checkin : item.checked_in;

      const seq = (current - 1) * size + index + 1;
      const idPart = item.id != null ? String(item.id) : `noid-${index}`;
      return {
        ...item,
        _rowKey: `${idPart}-p${current}-i${index}`,
        _seq: String(seq).padStart(2, "0"),
        codeStr: codeRaw != null && codeRaw !== "" ? String(codeRaw) : "--",
        ticketIdStr:
          ticketIdRaw != null && ticketIdRaw !== ""
            ? String(ticketIdRaw)
            : "--",
        paidLabel:
          paidRaw === 1 || paidRaw === "1"
            ? this.$t("isagroup.已支付")
            : paidRaw === 0 || paidRaw === "0"
            ? this.$t("isagroup.未支付")
            : "--",
        participateLotteryLabel: this.ynOrDash(participateRaw),
        lotteryValidateLabel: this.ynOrDash(lotteryValRaw),
        checkedInLabel: this.ynCheckinDisplay(checkedRaw),
        checkinTimeLabel: checkinTimeRaw
          ? dayjs(checkinTimeRaw).format("YYYY-MM-DD HH:mm")
          : "--",
        createdAtLabel: createdAtRaw
          ? dayjs(createdAtRaw).format("YYYY-MM-DD HH:mm")
          : "--",
        _allowLottery: allowLotRaw,
        _participateLottery: participateRaw,
        _lottery_validate: lotteryValRaw,
        _checkin: checkedRaw,
      };
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
      if (type === "edit") {
        this.openEdit(row);
      }
    },
    openEdit(row) {
      const checkin = row.checkin != null ? row.checkin : row.checked_in;
      const participateLottery =
        row.participateLottery != null
          ? row.participateLottery
          : row.participate_lottery;
      const lottery_validate = row.lottery_validate;
      const allowLottery =
        row.allow_lottery != null ? row.allow_lottery : row.allowLottery;
      const ticketId =
        row.ticketId != null
          ? row.ticketId
          : row.ticket_id != null
          ? row.ticket_id
          : null;
      const checkinTime =
        row.checkin_time != null ? row.checkin_time : row.checkinTime;
      const createdAt = row.created_at != null ? row.created_at : row.createdAt;
      const winItem =
        row.win_item != null
          ? row.win_item
          : row.winItem != null
          ? row.winItem
          : null;

      this.dialogSnapshot = {
        id: row.id,
        code: row.code,
        email: row.email,
        name: row.name,
        phone: row.phone,
        paid:
          row.paid !== undefined && row.paid !== null ? Number(row.paid) : null,
        ticketId,
        checkin_time: checkinTime,
        created_at: createdAt,
        win_item: winItem,
      };

      const checkinNorm =
        checkin === true ? 1 : checkin === false ? 0 : checkin;
      this.dialogForm = {
        id: row.id,
        checkin:
          checkinNorm === 1 || checkinNorm === "1"
            ? 1
            : 0,
        participateLottery:
          participateLottery === 1 || participateLottery === "1" ? 1 : 0,
        lottery_validate:
          lottery_validate === 1 || lottery_validate === "1" ? 1 : 0,
        allow_lottery: allowLottery === 1 || allowLottery === "1" ? 1 : 0,
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
    buildCheckinEditPayload() {
      const s = this.dialogSnapshot || {};
      const f = this.dialogForm;
      const payload = {
        id: s.id,
        checkin: f.checkin === 1,
        participateLottery: f.participateLottery,
        lottery_validate: f.lottery_validate,
        allow_lottery: f.allow_lottery,
        code: s.code != null && s.code !== "" ? String(s.code) : undefined,
        email: s.email != null && s.email !== "" ? String(s.email) : undefined,
        name: s.name != null && s.name !== "" ? String(s.name) : undefined,
        phone: s.phone != null && s.phone !== "" ? String(s.phone) : undefined,
        paid:
          s.paid !== undefined && s.paid !== null ? Number(s.paid) : undefined,
        ticketId: s.ticketId != null ? s.ticketId : undefined,
        checkin_time: s.checkin_time != null ? s.checkin_time : undefined,
        created_at: s.created_at != null ? s.created_at : undefined,
      };
      if (s.win_item !== undefined && s.win_item !== null) {
        payload.win_item = s.win_item;
      }
      return payload;
    },
    submitDialog() {
      const payload = this.buildCheckinEditPayload();
      editActivityCheckin(payload).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("isagroup.成功"));
          this.dialogVisible = false;
          this.getList();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-checkin-tab {
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

.registration-search-wrap {
  margin-bottom: 8px;
}

.activity-search-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px 16px;
  width: 100%;
}

.activity-search-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: auto;
}

.registration-search-form {
  width: 100%;
}

.activity-search-form--inline.el-form--inline {
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

.activity-search-select--w168 {
  width: 168px;
}

.activity-search-daterange--w400 {
  width: 400px;
}

.isa_table {
  width: 100%;
}

.checkin-dialog-form {
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
