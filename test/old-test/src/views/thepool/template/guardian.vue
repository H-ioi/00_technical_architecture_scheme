<template>
  <div class="space thepool_page">
    <el-scrollbar
      class="space_right"
      ref="space_right"
      style="width: 100%; background: #ffffff"
    >
      <div class="df_fa" style="height: 100%">
        <div style="flex: 1; height: 100%">
          <div class="palyTableBox" style="margin-bottom: 20px">
            <el-button
              type="primary"
              size="medium"
              round
              @click="playTemplate({ type: 'add' })"
              >{{ $t("consult.新增") }}</el-button
            >
          </div>
          <div class="tableBox">
            <Table
              ref="Table"
              :tableTitle="tableTitle"
              :tableData="tableData"
              :tableBtn="tableBtn"
              :showSelection="false"
              @playTab="playTab"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getTemplateList,
  updateTemplateStatus,
  getTemplateHasList,
  delTemplate,
} from "@/api/consult/template.js";
import FormgeneratorPool from "@/page/space/from/formgenerator_pool.vue";
import Table from "@/components/thepoolcommon/Table.vue";
export default {
  components: {
    FormgeneratorPool,
    Table,
  },
  data() {
    return {
      currentSchool: "",
      formData: {
        type: 2,
        pageNum: 1,
        pageSize: 100,
      },
      tableTitle: [
        { label: "中文名", prop: "templateName" },
        { label: "英文名", prop: "templateNameEn" },
        { label: "状态", prop: "statusLabel" },
      ],
      tableData: [],
      tableBtn: [
        // {
        //   name: "查看",
        //   type: "look",
        //   permissions: "look",
        //   icon: "el-icon-view",
        // },
        {
          name: "编辑",
          type: "edit",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "启用",
          type: "enable",
          permissions: "look",
          icon: "el-icon-view",
        },
        {
          name: "禁用",
          type: "disable",
          permissions: "look",
          icon: "el-icon-view",
        },
        // {
        //   name: "删除",
        //   type: "del",
        //   permissions: "look",
        //   icon: "el-icon-view",
        // },
      ],
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.getTemplateList();
  },
  computed: {
    ...mapGetters(["permissions", "dictpermissions"]),
  },
  methods: {
    // 初始化数据
    initData() {
      this.getTemplateList();
    },
    getTemplateList() {
      getTemplateList(this.formData).then((res) => {
        console.log("getTemplateFormList", res);
        if (res.data.success) {
          this.tableData = res.data.data.data;
          this.tableData.map((item) => {
            item["statusLabel"] = item["status"]
              ? this.$t("consult.已启用")
              : this.$t("consult.已禁用");
          });
        } else {
          this.tableData = [];
        }
      });
    },
    delTemplate(id) {
      delTemplate(id).then((res) => {
        console.log("getTemplateList", res);
        if (res.data.success) {
          this.$message.success(this.$t("common.成功"));
          this.getTemplateList();
        } else {
          this.getTemplateList();
        }
      });
    },
    updateTemplateStatus(data) {
      updateTemplateStatus(data).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("common.成功"));
          this.getTemplateList();
        } else {
          this.getTemplateList();
        }
      });
    },
    // 表格操作
    async playTab(name, item, scope) {
      switch (name) {
        case "edit":
          this.playTemplate({ type: "edit", id: item.templateId });
          break;
        case "del":
          this.delTemplate(item.templateId);
          break;
        case "enable":
          this.updateTemplateStatus({
            ids: [item.templateId],
            status: 1,
          });
          break;
        case "disable":
          let hasList = await getTemplateHasList(item.templateId);
          if (hasList) {
            this.$alert(
              this.$t("consult.当前表单已有数据，确定要禁用吗？"),
              this.$t("consult.禁用"),
              {
                confirmButtonText: this.$t("consult.确定"),
              }
            ).then(() => {
              this.updateTemplateStatus({
                ids: [item.templateId],
                status: 0,
              });
            });
          } else {
            this.updateTemplateStatus({
              ids: [item.templateId],
              status: 0,
            });
          }

          break;
      }
    },
    playTemplate(data) {
      this.$router.push({
        path: "/thepool/template",
        query: {
          formType: data.type, //表单类型
          scene: 2, //场景类型
          templateId: data.id || null, //模板id
          typeId: null, //关联id
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formgenerator_left {
  margin-left: 0 !important;
}
.palyTableBox {
  text-align: right;
}
</style>
