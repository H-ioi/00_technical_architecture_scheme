<template>
  <div class="space">
    <!-- <el-scrollbar class="space_left"> </el-scrollbar> -->
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="background: #ffffff; padding: 30px"
    >
      <div class="title">空间标签配置</div>
      <div class="df_fa" style="height: calc(100% - 54px)">
        <el-scrollbar class="areaList">
          <div
            @click="changeSchool(i)"
            :class="[
              'areaItem',
              {
                areaItem_active: currentSchool == i.id,
              },
            ]"
            v-for="(i, k) in spaceTop"
            :key="k"
          >
            {{ i.name }}
          </div>
        </el-scrollbar>
        <div style="flex: 1">
          <div class="df_sb paginationInfo" style="margin-top: 0px">
            <div>
              <el-button
                v-if="permissions['space_label_add']"
                type="primary"
                size="medium"
                @click="changeLabel('add')"
                >新增</el-button
              >
            </div>
            <PaginationInfo :paginationTotal="paginationTotal" />
          </div>
          <Table
            v-loading="loadingTable"
            ref="Table"
            :tableTitle="tableTitle"
            :tableData="tableData"
            :tableBtn="tableBtn"
            :showSelection="false"
            @playTab="playTab"
          />
          <Pagination
            :total="paginationTotal"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </div>
    </el-scrollbar>
    <BindSpaceLabel
      ref="BindSpace"
      :showBindSpace="showBindSpace"
      :treeTopData="treeTopData"
      :currentSpace="currentSpace"
      :pid="currentSchool"
      @changeModal="changeModal"
    />
    <el-dialog
      :title="labelTitle[labelType]"
      :visible.sync="showLabel"
      width="500px"
      :before-close="closeLabe"
      ><div class="moadlFromBox">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="df_center_wrap" v-if="labelType == 'look'">
            <div class="info">
              <div class="info_label">标签名称</div>
              <div class="info_value">{{ ruleForm.name }}</div>
            </div>
            <div class="info">
              <div class="info_label">背景颜色</div>
              <div class="info_value">{{ ruleForm.backgroundColor }}</div>
            </div>
            <div class="info">
              <div class="info_label">字体颜色</div>
              <div class="info_value">{{ ruleForm.fontColor }}</div>
            </div>
            <div class="info">
              <div class="info_label">备注</div>
              <div class="info_value">{{ ruleForm.remark }}</div>
            </div>
          </div>
          <div class="df_center_wrap" v-else>
            <el-form-item label="标签名称" style="width: 100%" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
                maxlength="7"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="背景颜色"
              style="width: 100%"
              prop="backgroundColor"
            >
              <el-color-picker
                v-model="ruleForm.backgroundColor"
                show-alpha
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="字体颜色" style="width: 100%" prop="fontColor">
              <el-color-picker v-model="ruleForm.fontColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="备注" style="width: 100%" prop="remark">
              <el-input
                type="textarea"
                :rows="5"
                v-model="ruleForm.remark"
                placeholder="请输入内容"
                maxlength="300"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item
            v-if="labelType != 'look'"
            class="modalFromBtn"
            style="margin-top: 20px"
          >
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button type="default" size="medium" @click="closeLabe"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import { mapGetters } from "vuex";
import Table from "@/components/common/Table.vue";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import BindSpaceLabel from "@/page/space/modal/bindspacelabel.vue";
import {
  getSpaceTop,
  getSpaceLabelList,
  disableSpaceLabel,
  enableSpaceLabel,
  addSpaceLabel,
  editSpaceLabel,
} from "@/api/space/spacelabel.js";
export default {
  components: {
    Table,
    PaginationInfo,
    Pagination,
    BindSpaceLabel,
  },
  data() {
    return {
      labelType: "",
      labelTitle: {
        add: "新增标签",
        edit: "编辑标签",
        look: "查看标签",
      },
      ruleForm: {
        name: "",
        backgroundColor: "rgba(54, 185, 120, 0.2)",
        fontColor: "#36B978",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        backgroundColor: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        fontColor: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      showLabel: false,
      treeTopData: [],
      showBindSpace: false,
      spaceTop: [],
      currentSchool: "",
      currentSpace: {},
      // 分页
      pagination: {
        size: 10,
        // status: 1,
        current: 1,
      },
      paginationTotal: 0,
      // 表格
      tableTitle: [
        { label: "标签名称", prop: "labelName", width: "" },
        { label: "背景颜色", prop: "backgroundColor", width: "" },
        { label: "字体颜色", prop: "fontColor", width: "" },
        { label: "最后更新", prop: "updateTime", width: "" },
        { label: "启用状态", prop: "isEnable", width: "" },
      ],
      tableData: [],
      tableBtn: [
        {
          name: "启用",
          type: "enable",
          permissions: "space_label_enable",
          color: "",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "space_label_disable",
          color: "#F56C6C",
        },
        {
          name: "编辑",
          type: "edit",
          permissions: "space_label_edit",
          color: "",
        },
        {
          name: "查看",
          type: "look",
          permissions: "look",
          color: "",
        },
        {
          name: "绑定空间",
          type: "bindspace",
          permissions: "space_label_binging",
          color: "",
        },
      ],
      loadingTable: false,
    };
  },

  computed: {
    ...mapGetters(["dictionary", "permissions"]),
  },

  created() {
    this.getSpaceTop();
    this.tableBtn = this.tableBtn.filter((res) => {
      return (
        res["permissions"] == "look" || this.permissions[res["permissions"]]
      );
    });
  },
  activated() {
    this.getSpaceLabelList(this.pagination, this.currentSchool);
  },
  methods: {
    getSpaceLabelList(data, id) {
      if (id == "") return;
      this.loadingTable = true;
      getSpaceLabelList(data, id)
        .then((res) => {
          if (res.data.success) {
            this.tableData = res.data.data.records;
            this.paginationTotal = res.data.data.total;
            this.tableData.map((item) => {
              item["isEnable"] = item.status;
              item["labelName"] = item.name;
            });
            this.loadingTable = false;
          } else {
            this.loadingTable = false;
          }
        })
        .catch(() => {
          this.loadingTable = false;
        });
    },
    getSpaceTop() {
      getSpaceTop().then((res) => {
        if (res.data.success) {
          this.spaceTop = res.data.data;
          this.changeSchool(this.spaceTop[0]);
        }
      });
    },
    addSpaceLabel(data) {
      addSpaceLabel(data).then((res) => {
        if (res.data.success) {
          this.closeLabe();
          this.$message.success("新增成功");
          this.getSpaceLabelList(this.pagination, this.currentSchool);
        }
      });
    },
    editSpaceLabel(data) {
      editSpaceLabel(data).then((res) => {
        if (res.data.success) {
          this.closeLabe();
          this.$message.success("编辑成功");
          this.getSpaceLabelList(this.pagination, this.currentSchool);
        }
      });
    },
    disableSpaceLabel(id) {
      disableSpaceLabel(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已禁用");
          this.getSpaceLabelList(this.pagination, this.currentSchool);
        }
      });
    },

    enableSpaceLabel(id) {
      enableSpaceLabel(id).then((res) => {
        if (res.data.success) {
          this.$message.success("已启用");
          this.getSpaceLabelList(this.pagination, this.currentSchool);
        }
      });
    },
    changeSchool(i) {
      this.currentSchool = i.id;
      this.spaceTop.map((item) => {
        if (item.id == this.currentSchool) {
          let obj = {
            label: item.name,
            id: item.id,
            children: [],
          };
          this.treeTopData = [obj];
        }
      });
      this.getSpaceLabelList(this.pagination, this.currentSchool);
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getSpaceLabelList(this.pagination, this.currentSchool);
    },
    playTab(name, item, scope) {
      switch (name) {
        case "enable":
          this.enableSpaceLabel(item.id);
          break;
        case "disable":
          this.disableSpaceLabel(item.id);
          break;
        case "edit":
          this.changeLabel("edit", item);
          break;
        case "look":
          this.changeLabel("look", item);
          break;
        case "bindspace":
          this.currentSpace = item;
          this.showBindSpace = true;
          this.$nextTick(() => {
            this.$refs.BindSpace.getSpaceTree({ pid: this.currentSchool });
          });
          break;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("ruleForm", this.ruleForm);

          if (this.labelType == "add") {
            this.addSpaceLabel({
              ...this.ruleForm,
              spaceTopId: this.currentSchool,
            });
          } else if (this.labelType == "edit") {
            this.editSpaceLabel(this.ruleForm);
          }
        } else {
          return false;
        }
      });
    },
    changeLabel(type, row) {
      this.labelType = type;
      this.showLabel = true;
      if (row) {
        let { name, backgroundColor, fontColor, remark, id } = row;
        this.$nextTick(() => {
          this.ruleForm = {
            name,
            backgroundColor,
            fontColor,
            remark,
            id,
          };
        });
      }
    },
    closeLabe() {
      this.$refs["ruleForm"].resetFields();
      this.ruleForm = {
        name: "",
        backgroundColor: "rgba(54, 185, 120, 0.2)",
        fontColor: "#36B978",
        remark: "",
      };
      this.showLabel = false;
    },
    changeModal(type) {
      this.showBindSpace = type;
    },
  },
};
</script>
     
<style lang = "scss" scoped>
.info {
  width: 100%;
  margin-bottom: 20px;
  .info_label {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    margin-bottom: 8px;
    -webkit-background-clip: text;
  }
  .info_value {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    -webkit-background-clip: text;
  }
}
</style>