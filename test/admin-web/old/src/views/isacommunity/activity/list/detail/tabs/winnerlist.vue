<template>
  <div class="activity-winner-tab" v-loading="listLoading">
    <div class="winner-kind-tabs">
      <el-radio-group
        v-model="winnerKind"
        size="small"
        @change="onWinnerKindChange"
      >
        <el-radio-button label="lottery">{{
          $t("isagroup.抽奖类获奖者")
        }}</el-radio-button>
        <el-radio-button label="competition">{{
          $t("isagroup.比赛类获奖者")
        }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="community_searchFrom winner-search-wrap">
      <div class="activity-search-toolbar">
        <el-form
          :inline="true"
          class="winner-search-form activity-search-form--inline"
          :model="searchFrom"
          @submit.native.prevent
        >
          <el-form-item class="activity-search-field">
            <el-input
              v-model="searchFrom.keyword"
              clearable
              class="activity-search-input--w360"
              :placeholder="$t('isagroup.获奖名单搜索提示')"
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
            v-if="permissions['busdriver_edit']"
            type="primary"
            size="medium"
            plain
            :disabled="!activityId"
            @click="handleExport"
            >{{ $t("btn.导出") }}</el-button
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
        :key="tableRenderKey"
        ref="awardTable"
        :showSelection="showSelection"
        :tableTitle="currentTableTitle"
        :tableData="tableData"
        :tableBtn="tableBtn"
        tableType="activityPrizeAward"
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
      custom-class="winner-dialog"
      @closed="resetDialogForm"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-position="top"
        class="winner-dialog-form"
      >
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.活动项目')" prop="programId">
              <el-select
                v-model="dialogForm.programId"
                filterable
                :placeholder="$t('isagroup.请选择')"
                style="width: 100%"
                :loading="programLoading"
                @change="onProgramSelectChange"
              >
                <el-option
                  v-for="opt in programOptions"
                  :key="String(opt.id)"
                  :label="programOptionLabel(opt)"
                  :value="opt.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="winnerKind === 'competition'" :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.名次')" prop="awardRank">
              <el-input
                v-model="dialogForm.awardRank"
                maxlength="100"
                :placeholder="$t('consult.请输入')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24">
            <el-form-item :label="$t('isagroup.中奖票码')" prop="ticketCode">
              <el-input
                v-model="dialogForm.ticketCode"
                maxlength="80"
                :placeholder="$t('consult.请输入')"
                @blur="fetchByTicketCode"
              />
              <div class="winner-form-hint">
                {{ $t("isagroup.票码带出提示") }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.姓名')" prop="name">
              <el-input
                v-model="dialogForm.name"
                maxlength="100"
                disabled
                :placeholder="$t('isagroup.由票码带出')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.电话')" prop="phone">
              <el-input
                v-model="dialogForm.phone"
                maxlength="20"
                disabled
                :placeholder="$t('isagroup.由票码带出')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('isagroup.邮箱地址')" prop="email">
              <el-input
                v-model="dialogForm.email"
                maxlength="100"
                disabled
                :placeholder="$t('isagroup.由票码带出')"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import {
  getActivityProgramlist,
  getProgramDetail,
} from "@/api/isacommunity/activityprogram.js";
import {
  addPrizeAward,
  delPrizeAward,
  editPrizeAward,
  exportPrizeAwardCompetition,
  exportPrizeAwardLottery,
  getPrizeAwardByTicketCode,
  getPrizeAwardCompetitionPage,
  getPrizeAwardDetail,
  getPrizeAwardLotteryPage,
} from "@/api/isacommunity/prizeAward.js";
import Pagination from "@/components/communitycommon/Pagination.vue";
import Table from "@/components/communitycommon/Table.vue";
import tabletitle from "@/const/isacommunity/tabletitle.js";
import dayjs from "dayjs";
import { mapGetters } from "vuex";

export default {
  name: "ActivityWinnerList",
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
      winnerKind: "lottery",
      tableRenderKey: 0,
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
      tableHeight: "calc(100vh - 520px)",
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
      programOptions: [],
      programLoading: false,
      dialogForm: {
        id: null,
        programId: null,
        programName: "",
        ticketCode: "",
        /** getByTicketCode 返回数据中的 id，提交为 checkinId */
        checkinId: null,
        name: "",
        phone: "",
        email: "",
        awardRank: "",
      },
    };
  },
  computed: {
    ...mapGetters(["permissions", "i18nlocel"]),
    currentTableTitle() {
      if (this.winnerKind === "competition") {
        return this.tabletitle.activityPrizeAwardCompetitionTable;
      }
      return this.tabletitle.activityPrizeAwardLotteryTable;
    },
    showSelection() {
      return (
        !this.readOnly &&
        (this.permissions["busdriver_del"] ||
          this.permissions["activity_ticket_del"])
      );
    },
    dialogTitle() {
      return this.dialogMode === "add"
        ? this.$t("isagroup.新增获奖记录")
        : this.$t("isagroup.编辑获奖记录");
    },
    dialogRules() {
      const req = (msg) => [{ required: true, message: msg, trigger: "blur" }];
      const programRule = [
        {
          required: true,
          message: this.$t("isagroup.活动项目"),
          trigger: "change",
        },
      ];
      const ticketRule = req(this.$t("isagroup.请输入"));
      const namePhone = {
        programId: programRule,
        ticketCode: ticketRule,
        name: req(this.$t("isagroup.请输入")),
        phone: req(this.$t("isagroup.请输入")),
      };
      if (this.winnerKind === "competition") {
        return {
          ...namePhone,
          awardRank: req(this.$t("isagroup.请输入")),
        };
      }
      return namePhone;
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
    /**
     * 活动项目列表：与活动项目 Tab 同源接口，按当前获奖类型传 programTypes（抽奖=1、比赛=2），
     * 再拉详情并仅保留进行中且 programType 匹配的项目。
     */
    programTypeFilterForKind() {
      if (this.winnerKind === "lottery") {
        return 1;
      }
      if (this.winnerKind === "competition") {
        return 2;
      }
      return null;
    },
    async loadInProgressPrograms() {
      if (!this.activityId) {
        this.programOptions = [];
        return;
      }
      const wantType = this.programTypeFilterForKind();
      const programTypes = wantType != null ? [String(wantType)] : undefined;
      this.programLoading = true;
      try {
        const list = await getActivityProgramlist({
          activityId: this.activityId,
          ...(programTypes ? { programTypes } : {}),
        });
        const arr = Array.isArray(list)
          ? list.filter((item) => item && item.id != null)
          : [];
        if (arr.length === 0) {
          this.programOptions = [];
          return;
        }
        const details = await Promise.all(
          arr.map((item) => getProgramDetail(item.id))
        );
        this.programOptions = details.filter((p) => {
          if (!p || Number(p.programStatus) !== 1) {
            return false;
          }
          if (wantType == null) {
            return true;
          }
          return Number(p.programType) === wantType;
        });
      } catch (e) {
        this.programOptions = [];
      } finally {
        this.programLoading = false;
      }
    },
    programDisplayName(p) {
      if (!p) {
        return "";
      }
      return this.i18nlocel === "en"
        ? p.enName || p.cnName || ""
        : p.cnName || p.enName || "";
    },
    programOptionLabel(p) {
      return this.programDisplayName(p) || String(p.id != null ? p.id : "");
    },
    onProgramSelectChange(val) {
      const p = this.programOptions.find(
        (x) => x.id === val || String(x.id) === String(val)
      );
      this.dialogForm.programName = p ? this.programDisplayName(p) : "";
    },
    async applyEditProgramSelection(d) {
      const pid =
        d.programId != null
          ? d.programId
          : d.program_id != null
          ? d.program_id
          : null;
      if (pid != null) {
        let opt = this.programOptions.find(
          (x) => x.id === pid || String(x.id) === String(pid)
        );
        if (!opt) {
          try {
            const detail = await getProgramDetail(pid);
            if (detail) {
              this.programOptions = [detail, ...this.programOptions];
              opt = detail;
            }
          } catch (e) {
            opt = null;
          }
        }
        if (opt) {
          this.dialogForm.programId = opt.id;
          this.dialogForm.programName = this.programDisplayName(opt);
        }
        return;
      }
      const name = (d.programName || "").trim();
      if (!name) {
        return;
      }
      const found = this.programOptions.find(
        (x) =>
          this.programDisplayName(x) === name ||
          (x.cnName || "").trim() === name ||
          (x.enName || "").trim() === name
      );
      if (found) {
        this.dialogForm.programId = found.id;
        this.dialogForm.programName = this.programDisplayName(found);
      }
    },
    onWinnerKindChange() {
      this.pagination.current = 1;
      this.tableRenderKey += 1;
      this.getList();
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
    formatTime(raw) {
      if (!raw) {
        return "--";
      }
      return dayjs(raw).format("YYYY-MM-DD HH:mm");
    },
    formatRow(item, index, current, size) {
      const createRaw =
        item.createTime != null ? item.createTime : item.create_time;
      const seq = (current - 1) * size + index + 1;
      const idPart = item.id != null ? String(item.id) : `noid-${index}`;
      const base = {
        ...item,
        _rowKey: `${idPart}-p${current}-i${index}`,
        _seq: String(seq).padStart(2, "0"),
        programName: item.programName != null ? item.programName : "--",
        ticketCode:
          item.ticketCode != null && item.ticketCode !== ""
            ? String(item.ticketCode)
            : "--",
        name: item.name != null && item.name !== "" ? item.name : "--",
        phone:
          item.phone != null && item.phone !== "" ? String(item.phone) : "--",
        createTimeLabel: this.formatTime(createRaw),
      };
      if (this.winnerKind === "competition") {
        base.awardRank =
          item.awardRank != null && item.awardRank !== ""
            ? String(item.awardRank)
            : "--";
      }
      return base;
    },
    getListRequest() {
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
      if (this.winnerKind === "lottery") {
        return getPrizeAwardLotteryPage(params);
      }
      return getPrizeAwardCompetitionPage(params);
    },
    getList() {
      if (!this.activityId) {
        this.tableData = [];
        this.paginationTotal = 0;
        return;
      }
      const cur = this.pagination.current;
      const sz = this.pagination.size;
      this.listLoading = true;
      this.getListRequest()
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
              const t = this.$refs.awardTable;
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
      if (type === "edit") {
        this.openEdit(row);
      }
    },
    emptyDialogForm() {
      this.dialogForm = {
        id: null,
        programId: null,
        programName: "",
        ticketCode: "",
        checkinId: null,
        name: "",
        phone: "",
        email: "",
        awardRank: "",
      };
    },
    openAdd() {
      if (!this.activityId) {
        return;
      }
      this.dialogMode = "add";
      this.emptyDialogForm();
      this.dialogVisible = true;
      this.loadInProgressPrograms();
      this.$nextTick(() => {
        if (this.$refs.dialogFormRef) {
          this.$refs.dialogFormRef.clearValidate();
        }
      });
    },
    openEdit(row) {
      const id = row.id;
      if (id == null) {
        return;
      }
      getPrizeAwardDetail(id).then(async (res) => {
        if (!res.data.success) {
          return;
        }
        const d = res.data.data || {};
        this.dialogMode = "edit";
        const lookupRaw =
          d.checkin_id != null
            ? d.checkin_id
            : d.checkinId != null
            ? d.checkinId
            : null;
        this.dialogForm = {
          id: d.id,
          programId: null,
          programName: d.programName || "",
          ticketCode:
            d.ticketCode != null && d.ticketCode !== ""
              ? String(d.ticketCode)
              : "",
          checkinId:
            lookupRaw != null && lookupRaw !== ""
              ? Number(lookupRaw)
              : null,
          name: d.name || "",
          phone: d.phone != null ? String(d.phone) : "",
          email: d.email || "",
          awardRank:
            d.awardRank != null && d.awardRank !== ""
              ? String(d.awardRank)
              : "",
        };
        await this.loadInProgressPrograms();
        await this.applyEditProgramSelection(d);
        this.dialogVisible = true;
        this.$nextTick(() => {
          if (this.$refs.dialogFormRef) {
            this.$refs.dialogFormRef.clearValidate();
          }
        });
      });
    },
    resetDialogForm() {
      if (this.$refs.dialogFormRef) {
        this.$refs.dialogFormRef.resetFields();
      }
    },
    async fetchByTicketCode() {
      const code = String(this.dialogForm.ticketCode || "").trim();
      if (!code || !this.activityId) {
        return;
      }
      try {
        const res = await getPrizeAwardByTicketCode({ ticketCode: code });
        if (!res.data.success) {
          this.$message.info(this.$t("isagroup.未查到票码信息"));
          return;
        }
        let raw = res.data.data;
        if (raw == null) {
          this.$message.info(this.$t("isagroup.未查到票码信息"));
          return;
        }
        if (Array.isArray(raw)) {
          raw = raw.length ? raw[0] : null;
        }
        if (!raw || typeof raw !== "object") {
          this.$message.info(this.$t("isagroup.未查到票码信息"));
          return;
        }
        const d = raw;
        const hasName = d.name != null && String(d.name).trim() !== "";
        const hasPhone = d.phone != null && String(d.phone).trim() !== "";
        const hasProgram =
          d.programId != null ||
          (d.programName != null && String(d.programName).trim() !== "");
        if (!hasName && !hasPhone && !hasProgram) {
          this.$message.info(this.$t("isagroup.未查到票码信息"));
          return;
        }
        if (hasName) {
          this.dialogForm.name = d.name;
        }
        if (hasPhone) {
          this.dialogForm.phone = String(d.phone);
        }
        if (d.email != null && d.email !== "") {
          this.dialogForm.email = d.email;
        }
        this.dialogForm.checkinId =
          d.id != null && d.id !== "" ? Number(d.id) : null;
        await this.applyEditProgramSelection(d);
      } catch (e) {
        console.error(e);
        this.$message.info(this.$t("isagroup.未查到票码信息"));
      }
    },
    buildPayload() {
      const aid = this.activityId;
      const base = {
        activityId:
          typeof aid === "string" && /^\d+$/.test(aid) && aid.length <= 16
            ? Number(aid)
            : aid,
        programId:
          this.dialogForm.programId != null
            ? this.dialogForm.programId
            : undefined,
        programName: this.dialogForm.programName || undefined,
        ticketCode: this.dialogForm.ticketCode || undefined,
        name: this.dialogForm.name || undefined,
        phone: this.dialogForm.phone || undefined,
        email: this.dialogForm.email || undefined,
      };
      const cid = this.dialogForm.checkinId;
      if (cid != null && cid !== "" && !Number.isNaN(Number(cid))) {
        base.checkinId = Number(cid);
      }
      if (this.winnerKind === "competition") {
        return {
          ...base,
          awardRank: this.dialogForm.awardRank || undefined,
        };
      }
      return base;
    },
    submitDialog() {
      this.$refs.dialogFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        const payload = this.buildPayload();
        if (this.dialogMode === "add") {
          addPrizeAward(payload).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("isagroup.成功"));
              this.dialogVisible = false;
              this.getList();
            }
          });
        } else {
          editPrizeAward({
            ...payload,
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
      const selectionId = this.$refs.awardTable.selectionId;
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
          delPrizeAward({ ids: selectionId }).then((res) => {
            if (res.data.success) {
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
      const params = {
        activityId: this.activityId,
        keyword: this.searchFrom.keyword || undefined,
      };
      let req;
      if (this.winnerKind === "lottery") {
        req = exportPrizeAwardLottery(params);
      } else {
        req = exportPrizeAwardCompetition(params);
      }
      try {
        const res = await req;
        const cd =
          res.headers["content-disposition"] ||
          res.headers["Content-Disposition"] ||
          "";
        const filename =
          this.parseFilenameFromContentDisposition(cd) || "winners.xlsx";
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
.activity-winner-tab {
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

/* 与爱莎圈主按钮 / Tab 主题色一致（#BA8E62） */
.winner-kind-tabs {
  margin-bottom: 12px;

  $winner-tab-theme: #ba8e62;

  ::v-deep .el-radio-button__inner {
    &:hover {
      color: $winner-tab-theme;
    }
  }

  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: $winner-tab-theme;
    border-color: $winner-tab-theme;
    color: #fff;
    box-shadow: -1px 0 0 0 $winner-tab-theme;
  }

  ::v-deep
    .el-radio-button:first-child
    .el-radio-button__orig-radio:checked
    + .el-radio-button__inner {
    box-shadow: none !important;
  }

  ::v-deep
    .el-radio-button__orig-radio:checked
    + .el-radio-button__inner:hover {
    background-color: #a67d52;
    border-color: #a67d52;
    color: #fff;
    box-shadow: -1px 0 0 0 #a67d52;
  }

  ::v-deep
    .el-radio-button:first-child
    .el-radio-button__orig-radio:checked
    + .el-radio-button__inner:hover {
    box-shadow: none !important;
  }

  ::v-deep .el-radio-button__orig-radio:focus + .el-radio-button__inner {
    border-color: $winner-tab-theme;
  }
}

.winner-search-wrap {
  margin-bottom: 12px;
}

.winner-search-form {
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

.activity-search-input--w360 {
  width: 360px;
}

.isa_table {
  width: 100%;
}

.winner-hint {
  margin-top: 16px;
  max-width: 960px;
}

.winner-hint__text {
  line-height: 1.6;
  font-size: 13px;
}

.winner-form-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

.winner-dialog-form {
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
