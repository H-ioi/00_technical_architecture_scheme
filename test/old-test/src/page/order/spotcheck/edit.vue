<template>
  <div>
    <div class="editFromBox">
      <el-form
        :label-position="'top'"
        :inline="true"
        :model="from"
        :rules="rules"
        ref="from"
      >
        <el-scrollbar class="formItem">
          <div class="fromTitle">工单基本信息</div>

          <div class="df_center_wrap">
            <el-form-item label="所属校区" prop="school">
              <el-select
                v-model="from.school"
                placeholder="请选择"
                :disabled="true"
              >
                <el-option
                  v-for="(i, k) in dictpermissions['order_school']"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请人" prop="contact">
              <el-input
                v-model="from.contact"
                placeholder="请输入"
                :maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="from.email"
                placeholder="请输入"
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input
                v-model="from.phone"
                placeholder="请输入"
                :maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input
                v-model="from.department"
                placeholder="请输入"
                :maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime" style="width: 22%">
              <el-date-picker
                style="width: 100%"
                v-model="from.createTime"
                type="datetime"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="点检类型"
              prop="spotcheckType"
              v-if="from.school"
            >
              <el-select
                style="width: 100%"
                v-model="from.spotcheckType"
                placeholder="请选择"
                prop="spotcheckType"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in orderTypeList['order_spotcheck_type']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用(RMB)" prop="cost">
              <el-input-number
                style="width: 100%;"
                placeholder="请输入"
                v-model="from.cost"
                :precision="2"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="关联空间" prop="spaceId">
              <SpaceTree
                ref="SpaceTree"
                :schoolId="from['school']"
                @setSpace="setSpace"
              />
            </el-form-item>
            <el-form-item label="关联资产" prop="assetId">
              <AssetList
                ref="AssetList"
                :schoolId="from['school']"
                @setAsset="setAsset"
              />
            </el-form-item>
            <el-form-item
              style="width: 100%"
              label="明细信息"
              prop="description"
            >
              <el-input
                v-model="from.description"
                placeholder="请输入"
                type="textarea"
                show-word-limit
                :rows="5"
                :maxlength="500"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 60%" label="附件">
              <FileListOrder
                ref="filelist"
                :scene="'order_attachment'"
                :isDisabled="false"
              />
            </el-form-item>
          </div>
        </el-scrollbar>
        <el-form-item class="editFromBtn">
          <el-button type="primary" size="medium" @click="submitForm('from')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import FileListOrder from "@/components/common/FileListOrder";
import {
  addOrderSpotcheck,
  putOrderSpotcheck,
  getOrderDetail,
  getMyOrderDetail
} from "@/api/workorder/order/index.js";
import { getPublikTypeList } from "@/api/publik";
import SpaceTree from "../modal/spacetree";
import AssetList from "../modal/assetlist";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder,
    SpaceTree,
    AssetList
  },
  data() {
    var formrulesdata = formrules;
    return {
      from: {},
      rules: {
        school: [{ required: true, message: "请选择", trigger: "blur" }],
        contact: [{ required: true, message: "请输入", trigger: "blur" }],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrulesdata["isEmail"], trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入", trigger: "blur" }],
        department: [{ required: false, message: "请输入", trigger: "blur" }],
        description: [{ required: false, message: "请输入", trigger: "blur" }],
        spaceId: [{ required: false, message: "请输入", trigger: "blur" }],
        assetId: [{ required: false, message: "请输入", trigger: "blur" }],
        spotcheckType: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      currentOrderId: "",
      orderTypeList: [],
      isMy: null
    };
  },
  created() {
    this.isMy = this.$route.query.isMy;
    this.from["school"] = this.$route.query.schoolId;
    this.currentOrderId = this.$route.query.id;
    this.getPublikTypeList(this.from["school"]);
    this.getOrderDetail(this.currentOrderId);
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo", "dictpermissions"])
  },
  methods: {
    getOrderDetail(id) {
      if (this.isMy) {
        getMyOrderDetail(id).then(res => {
          this.setData(res, id);
        });
      } else {
        getOrderDetail(id).then(res => {
          this.setData(res, id);
        });
      }
    },
    // 重新发起新增
    addOrder(data) {
      addOrderSpotcheck(data).then(res => {
        if (res.data.success) {
          this.$message.success("重新发起成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          if (this.isMy) {
            this.$router.push("/order/mylist/index");
          } else {
            this.$router.push("/order/list/index");
          }
        }
      });
    },
    // 编辑工单
    putOrder(data) {
      putOrderSpotcheck(data).then(res => {
        if (res.data.success) {
          this.$message.success("编辑成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.push(
            `/order/repair/detail?id=${data.orderId}&isMy=${this.isMy}`
          );
        }
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("from", this.from);
          let data = {
            ...this.from
          };
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["fileIds"] = fileIds;
          }
          if (this.$route.query.type == "edit") {
            data["orderId"] = this.currentOrderId;
            this.putOrder(data);
          }
          if (this.$route.query.type == "reset") {
            data["isReissue"] = true;
            this.addOrder(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setData(res, id) {
      if (res.data.success) {
        let {
          files,
          orderSpotcheck,
          school,
          contact,
          phone,
          email,
          department,
          createTime,
          assetName,
          spaceName
        } = res.data.data;
        this.from = {
          school,
          contact,
          email,
          phone,
          department,
          createTime,
          spotcheckType: orderSpotcheck["spotcheckType"],
          cost: orderSpotcheck["cost"],
          spaceId: orderSpotcheck["spaceId"],
          assetId: orderSpotcheck["assetId"],
          description: orderSpotcheck["description"]
        };
        this.$nextTick(() => {
          this.$refs["SpaceTree"].labelModel = spaceName;
          this.$refs["SpaceTree"].currentNodeKey = orderSpotcheck["spaceId"];
          this.$refs["SpaceTree"].defaultCheckedKeys = orderSpotcheck["spaceId"]
            ? [orderSpotcheck["spaceId"]]
            : [];
          this.$refs["AssetList"].assetStr = assetName;
          this.$refs["AssetList"].assetId = orderSpotcheck["assetId"];
          this.$refs["filelist"].filelistobj = [];
          this.$refs["filelist"].filelist = [];
          if (files !== null) {
            let ids = [];
            files.map(i => {
              ids.push(i.fileId);
              let obj = {
                outerId: id,
                scene: "order_attachment"
              };
              let fileObj = {
                id: i.fileId,
                type: i.contentType,
                file: "",
                name: i.originalName
              };
              this.$refs["filelist"].filelist = ids;
              this.$refs["filelist"].filelistobj.push(fileObj);
              this.$refs["filelist"].getFile(i.fileId, obj);
            });
          }
        });
      }
    },

    // 设置空间id
    setSpace(spaceId) {
      this.from["spaceId"] = spaceId;
    },
    // 设置资产id
    setAsset(assetId) {
      this.from["assetId"] = assetId;
    },
    getPublikTypeList(item) {
      this.dictpermissions["order_school"].map(i => {
        if (i.value == item) {
          getPublikTypeList({
            pid: i.id,
            types: ["order_spotcheck_type"]
          }).then(res => {
            console.log("11111res", res);
            let dataDictValues = this.userInfo["dataDictValues"];
            this.orderTypeList = res.data.data;
            Object.keys(this.orderTypeList).forEach(res => {
              this.orderTypeList[res] = this.orderTypeList[res].filter(i => {
                return (
                  dataDictValues[res].includes(i.value) &&
                  i.status &&
                  !i.archived
                );
              });
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
