<template>
  <div class="thepool_page">
    <el-dialog
      :title="$t('consult.绑定')"
      :visible.sync="showModal"
      width="1200px"
      :before-close="closeModal"
      :close-on-click-modal="false"
      custom-class="pooldialog"
    >
      <div class="modal_top">
        <el-button type="primary" size="medium" round @click="getGuardianList">{{
          $t("consult.新增")
        }}</el-button>
      </div>
      <el-table
        :data="guardianList"
        style="width: 100%"
        :header-cell-style="tablestyle.headercellstyle"
        :row-style="tablestyle.rowstyle"
        max-height="500"
      >
        <el-table-column
          v-for="(item, index) in tableTitle"
          :key="index"
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
          :label="$t('consult.和申请人的关系')"
          prop="relationType"
          width="200px"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.isedit">{{
              getDatastr(scope.row.relationType, dictionary["enquiry_relation_type"])
            }}</span>
            <el-select
              v-else
              v-model="scope.row.relationType"
              :placeholder="$t('consult.请选择')"
              style="width: 100%"
            >
              <el-option
                v-for="item in dictionary['enquiry_relation_type']"
                :key="item.value"
                :label="i18nlocel == 'en' ? item.enLabel : item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否主监护人" prop="mark" width="200px">
          <template slot-scope="scope">
            <el-switch
              @change="changeMark(scope.row)"
              v-model="scope.row.mark"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" :label="$t('consult.操作')" width="150px">
          <template slot-scope="scope" class="df_center">
            <el-button
              style="padding: 0; min-width: 50px"
              @click.native.prevent="editCurrentItem(scope)"
              type="text"
              size="small"
            >
              <span>{{
                !scope.row.isedit ? $t("consult.编辑") : $t("consult.保存")
              }}</span>
            </el-button>
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
        <el-button type="primary" size="medium" round @click="saveGuardianList">{{
          $t("consult.保存")
        }}</el-button>
        <el-button type="default" size="medium" round @click="closeModal">{{
          $t("consult.取消")
        }}</el-button>
      </div>
      <el-dialog
        width="1000px"
        :title="$t('consult.家长列表')"
        :visible.sync="innerVisible"
        append-to-body
        custom-class="pooldialog"
      >
        <div class="searchFromBox search">
          <el-form
            ref="searchFrom"
            class="df_align_center searchFrom"
            :label-position="'top'"
            :inline="true"
            :model="searchFrom"
          >
            <el-form-item :label="$t('consult.电话')" prop="phone" style="width: 320px">
              <el-input
                v-model="searchFrom['phone']"
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
          <el-button type="primary" size="medium" round @click="handleAddguardian">{{
            $t("consult.确定")
          }}</el-button>
          <el-button type="default" size="medium" round @click="closeInnerModal">{{
            $t("consult.取消")
          }}</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { consult } from "@/const/consult/index.js";
import {
  addGuardian,
  getGuardianStudent,
  getGuardianList,
  bindGuardian,
} from "@/api/consult/student.js";
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
          label: "电话",
          prop: "phone",
          width: "100px",
        },
        {
          label: "微信号",
          prop: "wechat",
          width: "100px",
        },
        {
          label: "邮箱",
          prop: "email",
          width: "200px",
        },
        // {
        //   label: "国籍",
        //   prop: "nationality",
        //   width: "200px"
        // }
      ],
      tablestyle: consult["tablestyle"],
      showModal: false,
      innerVisible: false,
      sexList: consult["sexList"],
      guardianList: [],
      tableData: [],
      tableBtn: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      paginationTotal: 0,
      searchFrom: { phone: "" },
      currentRow: {},
      studentId: "",
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  methods: {
    getGuardianStudent(id) {
      this.studentId = id;
      getGuardianStudent({ studentId: id }).then((res) => {
        if (res.data.success) {
          this.showModal = true;
          this.guardianList = [];
          let data = res.data.data;
          if (data && data.length > 0) {
            this.guardianList = data.map((item) => {
              return {
                ...item.guardianInfo,
              };
            });
            this.guardianList.map((item) => {
              item["mark"] = item["mark"] == 1 ? true : false;
            });
          }
          // this.getList();
        }
      });
    },
    getList() {
      getGuardianList({
        ...this.pagination,
        ...this.searchFrom,
      }).then((res) => {
        console.log("res", res);
        if (res.data.success) {
          let { data, total } = res.data.data;
          this.tableData = data;
          this.paginationTotal = Number(total);
          this.tableData.map((item) => {
            item["sexlabel"] = this.getDatastr(item.sex, this.sexList);
          });
        }
      });
    },
    bindGuardian(data) {
      bindGuardian(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("consult.成功"));
          this.showModal = false;
          this.$emit("initData");
        }
      });
    },
    saveGuardianList() {
      // if (this.guardianList.length == 0) {
      //   this.$message.warning("请先添加家长");
      // } else {
      let list = this.guardianList.map((item, index) => {
        return {
          guardianId: item["id"],
          relationType: item["relationType"],
          mark: index == 0 ? 1 : 0,
        };
      });
      console.log("list", list);
      let data = {
        id: this.studentId,
        bindingList: list,
      };
      this.bindGuardian(data);
      // }
    },
    getGuardianList() {
      this.innerVisible = true;
    },
    changeMark(row) {
      console.log("row", row);
      this.guardianList.map((item) => {
        if (item["id"] == row["id"]) {
          item["mark"] = row["mark"];
        } else {
          item["mark"] = false;
        }
      });
    },
    editCurrentItem({ $index, row }) {
      console.log("row", $index, row);
      if (!row.isedit) {
        this.$set(this.guardianList, $index, {
          ...this.guardianList[$index],
          isedit: true,
        });
      } else {
        this.$set(this.guardianList, $index, {
          ...this.guardianList[$index],
          isedit: false,
        });
      }
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
          this.guardianList = this.guardianList.filter((item, index) => {
            return row["id"] != item["id"];
          });
          this.$message({
            type: "success",
            message: _this.$t("consult.成功"),
          });
        })
        .catch(() => {});
    },
    handleCurrentChange(page) {
      this.pagination["current"] = page;
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
        this.guardianList.map((item) => {
          if (item["id"] == this.currentRow["id"]) {
            isHas = true;
          }
        });
        console.log("isHas", isHas);
        if (isHas) {
          this.$message.warning("该家长已存在，请重新选择");
        } else {
          this.guardianList.push(this.currentRow);
          this.closeInnerModal();
        }
      }
    },
    closeInnerModal() {
      this.innerVisible = false;
      this.currentRow = {};
      this.pagination["current"] = 1;
      this.searchFrom = { phone: "" };
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
