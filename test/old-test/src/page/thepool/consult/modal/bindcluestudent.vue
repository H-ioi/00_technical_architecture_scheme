<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.绑定')"
      :visible.sync="showModal"
      width="1200px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog thepool_page"
    >
      <div class="modal_top">
        <el-button type="primary" size="medium" round @click="getStudentList">{{
          $t("consult.新增")
        }}</el-button>
      </div>
      <el-table
        :data="studentList"
        style="width: 100%"
        :header-cell-style="tablestyle.headercellstyle"
        :row-style="tablestyle.rowstyle"
        max-height="500"
      >
        <el-table-column
          v-for="(item, index) in tableTitle"
          :label="$t('consult.' + item['label'])"
          :prop="item['prop']"
          :fixed="item['fixed']"
        >
          <template slot-scope="scope">
            <span v-if="item['prop'] == 'sexlabel'">{{
              getDatastr(scope.row.sex, sexList)
            }}</span>
            <span v-else>{{ scope.row[item["prop"]] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('consult.操作')"
          width="150px"
        >
          <template slot-scope="scope" class="df_center">
            <el-button
              style="padding: 0; min-width: 50px"
              @click.native.prevent="delCurrentItem(scope)"
              type="text"
              size="small"
            >
              <span>{{ $t("consult.删除") }}</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="df_center modal_footer">
        <el-button
          type="primary"
          size="medium"
          round
          @click="saveGuardianList"
          >{{ $t("consult.保存") }}</el-button
        >
        <el-button type="default" size="medium" round @click="closeModal">{{
          $t("consult.取消")
        }}</el-button>
      </div>
      <el-dialog
        width="1000px"
        :title="$t('consult.学生列表')"
        :visible.sync="innerVisible"
        append-to-body
        custom-class="pooldialog thepool_page"
      >
        <div class="searchFromBox search">
          <el-form
            ref="searchFrom"
            class="df_align_center searchFrom"
            :label-position="'top'"
            :inline="true"
            :model="searchFrom"
          >
            <el-form-item
              :label="$t('consult.关键词')"
              prop="keyword"
              style="width: 320px"
            >
              <el-input
                v-model="searchFrom['keyword']"
                :placeholder="$t('consult.请输入')"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 110px; margin-right: 0">
              <el-button
                class="el-button-icon"
                type="primary"
                size="large"
                icon="el-icon-search"
                @click="getList"
              ></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="innertable">
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="tablestyle.headercellstyle"
            :row-style="tablestyle.rowstyle"
            highlight-current-row
            @current-change="handleCurrentTableItem"
            max-height="500"
          >
            <el-table-column
              v-for="(item, index) in tableTitle"
              :label="$t('consult.' + item['label'])"
              :prop="item['prop']"
              :fixed="item['fixed']"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="df_sb">
          <PaginationInfo :paginationTotal="paginationTotal" />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
        <div class="df_center modal_footer">
          <el-button
            type="primary"
            size="medium"
            round
            @click="handleAddguardian"
            >{{ $t("consult.确定") }}</el-button
          >
          <el-button
            type="default"
            size="medium"
            round
            @click="closeInnerModal"
            >{{ $t("consult.取消") }}</el-button
          >
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { tableObj } from "@/const/tabledata/index";
import { consult } from "@/const/consult/index.js";
import { getStudentList, getStudentClue } from "@/api/consult/student.js";
import { bindStudentClue } from "@/api/consult/index.js";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
export default {
  name: "bindguardians",
  components: {
    Table,
    Pagination,
    PaginationInfo,
  },
  props: {},
  data() {
    return {
      tableTitle: [
        {
          label: "姓",
          prop: "lastName",
          width: "100px",
          fixed: true,
        },
        {
          label: "名",
          prop: "firstName",
          width: "100px",
        },
        {
          label: "性别",
          prop: "sexlabel",
          width: "100px",
        },
        {
          label: "在读学校",
          prop: "atSchool",
          width: "200px",
        },
        {
          label: "身份证/护照号",
          prop: "identityCard",
          width: "200px",
        },
        {
          label: "学号",
          prop: "studentNumber",
          width: "200px",
        },
      ],
      tablestyle: consult["tablestyle"],
      showModal: false,
      innerVisible: false,
      sexList: consult["sexList"],
      studentList: [],
      tableData: [],
      tableBtn: [],
      pagination: {
        pageSize: 50,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchFrom: { keyword: "" },
      currentRow: {},
      clueId: "",
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    getStudentClue(id) {
      this.clueId = id;
      getStudentClue({ clueId: id }).then((res) => {
        if (res.data.success) {
          this.showModal = true;
          this.studentList = [];
          let data = res.data.data;
          if (data && data.length > 0) {
            this.studentList = data.map((item) => {
              return {
                ...item["baseInfo"],
              };
            });
          }
          // this.getList();
        }
      });
    },
    getList() {
      getStudentList({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data || [];
          this.paginationTotal = Number(total);
          this.tableData.map((item) => {
            item["sexlabel"] = this.getDatastr(item.sex, this.sexList);
          });
        }
      });
    },
    bindStudentClue(data) {
      bindStudentClue(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.showModal = false;
          this.$emit("initData");
        }
      });
    },
    saveGuardianList() {
      // if (this.studentList.length == 0) {
      //   this.$message.warning("请先添加学生");
      // } else {
      let list = this.studentList.map((item) => {
        return item["id"];
      });
      let data = {
        clueId: this.clueId, //线索id
        studentIds: list, //监护人id
      };
      this.bindStudentClue(data);
      // }
    },
    getStudentList() {
      this.innerVisible = true;
    },
    delCurrentItem({ $index, row }) {
      console.log("row", $index, row);
      let _this = this;
      this.$confirm(_this.$t("consult.确定删除吗?"), _this.$t("consult.提示"), {
        confirmButtonText: _this.$t("consult.确定"),
        cancelButtonText: _this.$t("consult.取消"),
        type: "warning",
      })
        .then(() => {
          this.studentList = this.studentList.filter((item, index) => {
            return row["id"] != item["id"];
          });
          // this.$message({
          //   type: "success",
          //   message: _this.$t("consult.成功")
          // });
        })
        .catch(() => {});
    },
    handleCurrentChange(page) {
      this.pagination["pageNum"] = page;
      this.getList();
    },
    handleCurrentTableItem(val) {
      this.currentRow = val;
      console.log("handleCurrentChange", val);
    },
    handleAddguardian() {
      console.log("handleAddguardian", this.currentRow);
      if (!this.currentRow["id"]) {
        console.log("isHas", 22222222222);
        this.$message.warning(this.$t("consult.请选择"));
      } else {
        console.log("isHas", 111111);
        let isHas = false;
        this.studentList.map((item) => {
          if (item["id"] == this.currentRow["id"]) {
            isHas = true;
          }
        });
        console.log("isHas", isHas);
        if (isHas) {
          this.$message.warning("该学生已存在，请重新选择");
        } else {
          this.studentList.push(this.currentRow);
          this.closeInnerModal();
        }
      }
    },
    closeInnerModal() {
      this.innerVisible = false;
      this.currentRow = {};
      this.pagination["pageNum"] = 1;
      this.searchFrom = { keyword: "" };
      this.getList();
    },
    closeModal() {
      this.showModal = false;
    },
    getDatastr(id, data) {
      let str = "--";
      data.map((item) => {
        if (item.value == String(id)) {
          str = this.i18nlocel == "en" ? item.enLabel : item.label;
        }
      });
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal_top {
  text-align: right;
  margin-bottom: 20px;
}
.modal_footer {
  margin-top: 40px;
}
.guardianlist {
  width: 100%;
  .guardianlist_item {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    margin-bottom: 20px;
    .delguardian {
      font-size: 24px;
      color: #f56c6c;
    }
  }
}
</style>
