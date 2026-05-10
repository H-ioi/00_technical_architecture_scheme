<template>
  <div class="space">
    <el-scrollbar class="space_left tree_box">
      <div class="big_title">全部</div>
      <el-tree
        lazy
        class="tree"
        ref="tree"
        :default-expand-all="fasle"
        node-key="id"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        :default-expanded-keys="defaultExpanded"
        :load="loadNode"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
        <div class="custom-tree-node treeItem" slot-scope="{ node, data }">
          <div class="treeLabel" :title="node.label">
            {{ node.label}}
          </div>
          <i
            class="el-icon-picture"
            v-if="data.iconFileId != null && data.iconFileId != ''"
            @click.stop="showIconFileId(data.iconFileId)"
          ></i>
        </div>
      </el-tree>
    </el-scrollbar>
    <el-scrollbar
      v-loading="loadingTable"
      class="space_right"
      ref="space_right"
    >
      <div class="searchFromBox search">
        <el-form
          ref="searchFrom"
          class="df_align_center"
          :label-position="'top'"
          :inline="true"
          :model="searchFrom"
          :rules="searchRules"
        >
          <el-form-item label="空间类型" style="width: 10%">
            <el-select clearable v-model="searchFrom.type" placeholder="请选择">
              <el-option
                :key="k"
                v-for="(i, k) in spaceType"
                :label="i.name"
                :value="i.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="空间状态" style="width: 10%">
            <el-select
              clearable
              v-model="searchFrom.occupyStatus"
              placeholder="请选择"
            >
              <el-option
                :key="k"
                v-for="(i, k) in spaceStatus"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用类型" style="width: 10%">
            <el-select
              clearable
              v-model="searchFrom.useType"
              placeholder="请选择"
            >
              <el-option
                :key="k"
                v-for="(i, k) in spaceUseStatus"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间" style="width: 350px">
            <el-date-picker
              style="width: 100%"
              v-model="searchFrom.time"
              type="datetimerange"
              :clearable="false"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
              :value-format="'yyyy-MM-dd HH:mm'"
              :format="'yyyy-MM-dd HH:mm'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="面积：㎡" style="width: 12%">
            <div class="df_sb">
              <el-form-item style="width: 48%; margin: 0" prop="areaMin">
                <el-input
                  style="width: 100%"
                  v-model="searchFrom.areaMin"
                  placeholder="最小面积"
                ></el-input>
              </el-form-item>
              <span style="margin: 0 5px">—</span>
              <el-form-item style="width: 48%; margin: 0" prop="areaMax">
                <el-input
                  style="width: 100%"
                  v-model="searchFrom.areaMax"
                  placeholder="最大面积"
                ></el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item style="width: auto; margin-right: 0">
            <el-button
              class="el-button-icon"
              type="primary"
              size="large"
              icon="el-icon-search"
              @click="search"
            ></el-button>
            <el-button
              class="el-button-icon"
              type="defult"
              size="large"
              icon="el-icon-delete"
              @click="clear"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="df_sb paginationInfo">
        <div>
          <el-button
            v-if="permissions['space_add']"
            type="primary"
            size="medium"
            @click="$router.push(`/space/add?pid=${pagination['pid']}`)"
            >新增空间</el-button
          >
        </div>
        <PaginationInfo
          :paginationTotal="paginationTotal"
          :paginationSize="pagination.size"
        />
      </div>
      <div style="overflow-x: hidden">
        <div class="cardList">
          <div
            class="card"
            v-for="(item, index) in cardData"
            :key="index"
            @click="todetail(item)"
          >
            <span class="card_title tips" :title="item.name">{{
              item.name
            }}</span>
            <div
              class="cardLabel"
              v-dragscroll
              @click.stop="stopPropagation($event)"
            >
              <span
                class="cardLabelItem"
                :style="`background:${l.backgroundColor};color:${l.fontColor}`"
                v-for="(l, c) in item.labels"
                :key="c"
                >{{ l.name }}</span
              >
            </div>
            <div class="card_line"></div>
            <div class="df_sb">
              <div
                :class="[
                  'card_status',
                  { card_status_free: item.occupyStatus == 1 },
                ]"
              >
                <i
                  :class="
                    item.occupyStatus == 1
                      ? 'icon-weishiyong'
                      : 'icon-yishiyong'
                  "
                ></i>
                <span>{{ item.occupyStatus == 1 ? "空闲" : "占用" }}</span>
              </div>
              <div class="card_info">
                <div style="display: flex">
                  空间面积：<span class="tips" style="flex: 1">{{
                    item.area ? item.area + "㎡" : "--"
                  }}</span>
                </div>
                <div style="display: flex">
                  空间类型：<span class="tips" style="flex: 1">{{
                    String(item.typeNames)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          :total="paginationTotal"
          :pagination="pagination"
          @handleCurrentChange="handleCurrentChange"
        />
      </div>
    </el-scrollbar>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :top="'10vh'"
      title="平面图"
      width="60%"
    >
      <img width="100%" :src="currentIconImgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import { deepClone } from "@/util/util.js";
import { getSpaceTop, getAllSpaceType } from "@/api/space/spacetype.js";
import {
  getSpaceList,
  getSpacePage,
  getSpaceTree,
  getSpacePageBoard,
} from "@/api/space/spacelist.js";
import { spaceStatus } from "@/const/space/index.js";
import { getFormatDate } from "@/util/date.js";
import { spaceUseStatus } from "@/const/space/index.js";
import { downloadFile } from "@/api/upload/index.js";
export default {
  components: {
    PaginationInfo,
    Pagination,
  },
  data() {
    var checkNum = (rule, value, callback) => {
      if (value) {
        let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/;
        if (!exp.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      // 使用类型
      spaceUseStatus: spaceUseStatus,
      // 空间状态
      spaceStatus: spaceStatus,
      // 空间类型
      spaceType: [],
      // 查询条件
      searchFrom: {
        time: [],
        occupyStatus: "",
        type: "",
        areaMin: "",
        areaMax: "",
        useType: "",
      },
      searchRules: {
        areaMin: [{ validator: checkNum, trigger: "blur" }],
        areaMax: [{ validator: checkNum, trigger: "blur" }],
      },
      // 分页
      pagination: {
        size: 25,
        current: 1,
        pid: "",
      },
      paginationTotal: 0,
      cardData: [],

      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: (data) => {
          let isLeaf = true;
          if (data.children) {
            isLeaf = data.children.length === 0;
          }
          return isLeaf;
        },
      },
      defaultExpanded: [],
      loadingTable: false,
      dialogVisible: false,
      currentIconImgUrl: "",
    };
  },
  created() {},
  activated() {
    this.getSpacePage();
    this.refreshTreeNode();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getNowTime() {
      let start = getFormatDate("y-m-d h:i", new Date(), "00", "00");
      let end = getFormatDate("y-m-d h:i", new Date(), "23", "59");
      this.pagination["startTime"] = start;
      this.pagination["endTime"] = end;
      this.searchFrom["time"] = [start, end];
    },
    getSpaceTop() {
      return new Promise((resolve, reject) => {
        getSpaceTop().then((res) => {
          if (res.data.success) {
            this.defaultExpanded = [];
            res.data.data.map((item) => {
              let obj = {
                name: item.name,
                id: item.id,
                children: [],
              };
              this.defaultExpanded.push(item.id);
              this.treeData.push(obj);
            });
            this.pagination["pid"] = this.treeData[0].id;
            this.getNowTime();
            this.getSpacePage();
            this.getAllSpaceType(this.treeData[0].id);
            resolve(this.treeData);
          }
        });
      });
    },
    getSpacePage() {
      if (this.pagination.pid == "") return;
      this.loadingTable = true;
      getSpacePageBoard(this.pagination)
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data.records;
            this.cardData = data.filter((item) => {
              return item.status === 1;
            });
            this.paginationTotal = res.data.data.total;
            this.refreshTreeNode();
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.pagination.pid);
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
    refreshTreeNode() {
      this.$nextTick(() => {
        let node = this.$refs.tree.getNode(this.pagination.pid);
        if (node) {
          node.loaded = false;
          node.expand();
        }
      });
    },
    getSpaceTree(data) {
      return new Promise((resolve, reject) => {
        getSpaceTree(data).then((res) => {
          console.log("res", res.data.data);
          if (res.data.success) {
            let data = res.data.data;
            if (data == null) {
              this.checkTree([]);
              resolve([]);
            } else {
              this.checkTree(data);
              resolve(data);
            }
          }
        });
      });
    },
    checkTree(data) {
      // let child = data.child;
      let child = data;
      let newChild = child.filter((item, index) => {
        let allDisable = true; //item.child是否全部禁用
        if (item.children) {
          item.children.map((i, c) => {
            if (i.status) {
              allDisable = false;
            }
          });
        } else {
          item["children"] = [];
        }
        return item.children.length > 0 && item.status && !allDisable;
      });
      data["children"] = newChild;
      if (newChild.length > 0) {
        newChild.map((item) => {
          this.checkTree(item.children);
        });
      }
    },
    getSpaceList(data) {
      return new Promise((resolve, reject) => {
        getSpaceList(data).then((res) => {
          console.log("res", res.data.data);
          if (res.data.success) {
            let data = res.data.data;
            let list = [];
            data.map((item) => {
              if (item.status === 1) {
                let obj = {
                  label: item.name,
                  id: item.id,
                  child: [],
                };
                list.push(obj);
              }
            });

            resolve(list);
          }
        });
      });
    },
    getAllSpaceType(spaceId) {
      getAllSpaceType(spaceId).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.spaceType = data.filter((item) => {
            return item.status;
          });
        }
      });
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let data = await this.getSpaceTop();
        return resolve(data);
      }
      if (node.data.is_leaf) {
        resolve([]);
      } else {
        let categories = [];
        // categories = await this.getSpaceList({ pid: node.data.id });
        categories = await this.getSpaceTree({ pid: node.data.id });
        if (categories.length == 0) {
          if (
            node.data.children == undefined ||
            node.data.children.length == 0
          ) {
            resolve([]);
          } else {
            resolve(node.data.children);
          }
        } else {
          node.data.children = [...categories];
          resolve(categories);
        }
      }
    },
    // 筛选条件
    search() {
      this.$refs["searchFrom"].validate((valid) => {
        console.log("valid", this.searchFrom);
        if (valid) {
          if (
            Number(this.searchFrom.areaMax) < Number(this.searchFrom.areaMin)
          ) {
            this.$message.warning("最大面积应大于最小面积");
          } else {
            let data = deepClone(this.searchFrom);
            if (data["time"]) {
              this.pagination = {
                ...this.pagination,
                ...data,
                startTime: data["time"][0],
                endTime: data["time"][1],
                current: 1,
              };
              delete this.pagination.time;
            }
            this.getSpacePage();
          }
        }
      });
    },
    clear() {
      this.searchFrom = {};
      this.pagination["current"] = 1;
      delete this.pagination["occupyStatus"];
      delete this.pagination["type"];
      delete this.pagination["areaMin"];
      delete this.pagination["areaMax"];
      delete this.pagination["useType"];
      this.getNowTime();
      this.getSpacePage();
    },
    // 分页
    handleCurrentChange(page) {
      this.pagination["current"] = page;
      this.getSpacePage();
    },
    handleNodeClick(data, node, current) {
      console.log(data);
      this.pagination["pid"] = data.id;
      this.getAllSpaceType(data.id);
      this.getSpacePage();
    },
    todetail(item) {
      this.$router.push(
        `/space/boarddetail?pid=${this.pagination["pid"]}&id=${item.id}&startTime=${this.pagination.startTime}`
      );
    },
    stopPropagation(ev) {
      ev.stopPropagation();
    },
    showIconFileId(iconFileId) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        downloadFile(iconFileId).then((res) => {
          console.log("downloadFile", res);
          let blob = new Blob([res.data]); // 返回的文件流数据
          this.currentIconImgUrl = window.URL.createObjectURL(blob); // 将他转化为路径
        });
      });
    },
  },
};
</script>
 

<style lang = "scss" scoped>
.big_title {
  padding: 5px 20px !important;
  // margin: 15px 0 !important;
  // cursor: pointer;
}
.search {
  // margin: 20px;
  // box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.cardLabel {
  padding: 10px 0;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  height: 30px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
  .cardLabelItem {
    font-size: 12px;
    padding: 2px 5px;
    // background: rgba(54, 185, 120, 0.2);
    // color: #36b978;
    border-radius: 2px;
    margin-right: 10px;
    white-space: nowrap;
    word-break: normal;
  }
}
/deep/.el-tree-node__content {
  display: flex;
  .treeItem {
    flex: 1;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    padding-right: 10px;
    position: relative;
    text-align: right;
    height: 40px;
    line-height: 40px;
    .treeLabel {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 30px;
      line-height: 40px;
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: left;
    }
  }
}
</style>