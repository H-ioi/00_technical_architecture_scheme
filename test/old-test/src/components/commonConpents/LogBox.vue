<template>
  <div>
    <div :class="['selectionItem']" v-if="showfilter">
      <div v-dragscroll class="df_cs filterbox">
        <span
          :style="`color:${
            currentrecord == item.value ? '#2c88f5' : '#999999'
          }`"
          v-for="(item, index) in logtype !== 'log'
            ? selectionRecord
            : playtypeobj"
          :key="index"
          @click="filter(item)"
          >{{ item.label }}</span
        >
      </div>
      <el-button
        v-if="showbtn"
        class="btn_small"
        type="primary"
        @click="showaddlog"
        >新增跟进记录</el-button
      >
    </div>
    <div class="contentBox_item" :key="index" v-for="(item, index) in logdata">
      <div class="stagebox">
        <div
          :class="['contentBox_item_title', 'df_center']"
          v-if="
            showtype
              ? index == 0
                ? true
                : item.moduleType == logdata[index - 1].moduleType
                ? false
                : true
              : false
          "
        >
          {{ moduletype[item.moduleType] }}
        </div>
      </div>
      <div :class="['contentBox_item_list', 'df_sb']">
        <div :class="{ line: index !== logdata.length - 1 }"></div>
        <div :class="['list_l']">
          <div class="listdate">{{ item.createTime }}</div>
          <div class="listtext">
            {{
              item.followType !== undefined
                ? followType[item.followType]
                : playtype[item.type]
            }}
          </div>
          <div class="listdesc">
            <div style="color: #999999">
              {{
                item.title == undefined ? "跟进人:" + item.username : item.title
              }}
            </div>
            <div class="dasc">
              {{
                item.description !== undefined
                  ? followType[item.followType] +
                    ":" +
                    (item.description == null ? "--" : item.description)
                  : item.details == undefined || item.details == null
                  ? ""
                  : item.details
              }}
            </div>
          </div>
        </div>
        <span
          @click="showdetaillog(item)"
          v-if="showdetail"
          style="color: #2c88f5; cursor: pointer"
          >详情</span
        >
      </div>
    </div>
    <div
      class="more df_center"
      v-if="total > 10 && total !== logdata.length"
      @click="more"
    >
      查看更多
    </div>
    <el-dialog
      title="日志详情"
      :visible.sync="isshowlog"
      width="30%"
      :before-close="
        () => {
          isshowlog = false;
        }
      "
    >
      <div v-if="checkdata(looklog.title)">{{ "标题：" + looklog.title }}</div>
      <div v-if="checkdata(looklog.createUser)">
        {{ "创建人：" + looklog.createUser }}
      </div>
      <div v-if="checkdata(looklog.createTime)">
        {{ "创建时间：" + looklog.createTime }}
      </div>
      <div v-if="checkdata(looklog.details)">
        {{ "详情：" + looklog.details }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LogModal from "@/components/commonConpents/commonModal/AddNewLog.vue";
import { getFiles } from "@/api/upload/index.js";
import { fetchTypeList } from "@/api/base/index";
import { getLogDetail } from "@/api/log/index";
import AddNewLog from "@/components/commonConpents/commonModal/AddNewLog";
export default {
  name: "UniUiLogbox",
  props: {
    logdata: Array,
    logobj: Object,
    total: Number,
    showbtn: Boolean,
    showfilter: Boolean,
    showtype: Boolean,
    showdetail: Boolean,
    logtype: String,
  },
  data() {
    return {
      isshowlog: false,
      looklog: {},
      showToOpportunity: false,
      selectionRecord: [{ label: "全部", value: "all" }],
      currentrecord: "all",
      selectionLog: [],
      followType: {},
      moduletype: {
        3: "线索阶段",
        4: "商机阶段",
        5: "合同阶段",
      },
      playtype: {
        1: "新增",
        2: "编辑",
        3: "关闭",
        4: "分配",
        5: "认领",
        6: "退回",
        7: "商机",
        8: "延期",
        9: "阶段",
        10: "签约",
        11: "变更",
        12: "协作",
        13: "删除",
        14: "审核",
      },
      playtypeobj: [
        { label: "全部", value: "all" },
        { label: "新增", value: "1" },
        { label: "编辑", value: "2" },
        { label: "关闭", value: "3" },
        { label: "分配", value: "4" },
        { label: "认领", value: "5" },
        { label: "退回", value: "6" },
        { label: "商机", value: "7" },
        { label: "延期", value: "8" },
        { label: "阶段", value: "9" },
        { label: "签约", value: "10" },
        { label: "变更", value: "11" },
        { label: "协作", value: "12" },
        { label: "删除", value: "13" },
        { label: "审核", value: "14" },
      ],
    };
  },
  created() {
    this.fetchtypelist();
  },
  mounted() {},

  methods: {
    fetchtypelist() {
      fetchTypeList("follow_type").then((res) => {
        let data = res.data.data;
        data.map((item) => {
          if (!item.archived && item.status) {
            let obj = {
              label: item.label,
              value: item.value,
            };
            this.selectionRecord.push(obj);
            this.followType[item.value] = item.label;
          }
        });
      });
    },
    getLogDetail(id) {
      getLogDetail(id).then((res) => {
        console.log("res", res);
        let data = res.data.data;
        if (data.file.length !== 0) {
          this.getFiles({ ids: data.file }, data);
        } else {
          this.$emit("showdetaillog", data);
        }
      });
    },
    getFiles(data, form) {
      getFiles(data).then((res) => {
        console.log(888, res);
        let data = res.data.data;
        let fileobj = [];
        data.map((item) => {
          let name = item.originalName.split(".");
          let obj = {
            name: item.originalName,
            type: name[1],
            id: item.id,
          };
          fileobj.push(obj);
        });
        this.$emit("showdetaillog", form, fileobj);
      });
    },
    closeModal(type) {
      this.showToOpportunity = type;
    },
    filter(item) {
      this.currentrecord = item.value;
      if (this.logtype == "log") {
        this.logobj = {
          ...this.logobj,
          type: item.value,
        };
      } else {
        this.logobj = {
          ...this.logobj,
          followType: item.value,
        };
      }
      if (
        item.value == "all" &&
        (this.logobj["followType"] || this.logobj["type"])
      ) {
        delete this.logobj.followType;
        delete this.logobj.type;
      }

      console.log(" this.logobj", this.logobj);
      this.$emit("getloglist", this.logobj, 1);
    },
    more() {
      this.logobj = {
        ...this.logobj,
        current: this.logobj["current"] + 1,
      };
      this.$emit("getloglist", this.logobj);
    },
    showaddlog() {
      this.$emit("showaddlog");
    },
    showdetaillog(item) {
      console.log("item", item);
      if (this.logtype == "log") {
        this.looklog = item;
        this.isshowlog = true;
      } else {
        this.getLogDetail(item.id);
      }
    },
    checkdata(data) {
      if (data == null || data == undefined) {
        return false;
      } else {
        return true;
      }
    },
  },
  components: {
    AddNewLog,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/formStyle";
.more {
  font-size: 16px;
  font-weight: 600;
  padding: 10px;
  color: #2c88f5;
  cursor: pointer;
}
.selectionItem {
  display: flex;
  align-items: center;

  .filterbox {
    overflow: scroll;
    flex: 1;
    margin-right: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  span {
    white-space: nowrap;
  }
}
</style>