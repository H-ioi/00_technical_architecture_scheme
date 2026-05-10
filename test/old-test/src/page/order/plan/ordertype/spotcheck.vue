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
        <el-scrollbar class="formItem" style="padding: 20px 0;">
          <div class="fromTitle">点检工单基本信息</div>
          <div class="df_center_wrap">
            <el-form-item
              label="点检类型"
              prop="spotcheckType"
            >
              <el-select
                style="width: 100%"
                v-model="from.spotcheckType"
                placeholder="请选择"
              >
                <el-option
                  :key="k"
                  v-for="(i, k) in orderTypeList['order_spotcheck_type']"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联空间" prop="spaceId">
              <SpaceTree
                ref="SpaceTree"
                :schoolId="schoolId"
                @setSpace="setSpace"
              />
            </el-form-item>
            <el-form-item label="关联资产" prop="assetId">
              <AssetList
                ref="AssetList"
                :schoolId="schoolId"
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
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formrules } from "@/util/form.js";
import FileListOrder from "@/components/common/FileListOrder";
import { addOrderInspect } from "@/api/workorder/order/index.js";
import { getPublikTypeList } from "@/api/publik";
import SpaceTree from "../../modal/spacetree";
import AssetList from "../../modal/assetlist";
export default {
  name: "PCOrderAddorder",
  components: {
    FileListOrder,
    SpaceTree,
    AssetList
  },
  props: {
    schoolId: {
      default: "",
      type: String,
      require: true
    }
  },
  data() {
    var formrulesdata = formrules;
    return {
      from: {},
      rules: {
        description: [{ required: false, message: "请输入", trigger: "blur" }],
        spaceId: [{ required: false, message: "请输入", trigger: "blur" }],
        assetId: [{ required: false, message: "请输入", trigger: "blur" }],
        spotcheckType: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      orderTypeList: []
    };
  },
  created() {
    this.getPublikTypeList(this.schoolId);
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo", "dictpermissions"])
  },
  methods: {
    setData(data, outerId, files) {
      console.log("setData", data, files);
      this.from = {
        ...this.from,
        ...data
      };
      this.$refs["SpaceTree"].labelModel = data["spaceName"];
      this.$refs["SpaceTree"].currentNodeKey = data["spaceId"];
      this.$refs["SpaceTree"].defaultCheckedKeys = data["spaceId"]
        ? [data["spaceId"]]
        : [];
      this.$refs["AssetList"].assetStr = data["assetName"];
      this.$refs["AssetList"].assetId = data["assetId"];
      this.$refs["filelist"].filelistobj = [];
      this.$refs["filelist"].filelist = [];
      if (files !== null) {
        let ids = [];
        files.map(i => {
          ids.push(i.fileId);
          let obj = {
            outerId: outerId,
            scene: "order_periodic_plan_attachment"
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
    },
    submitForm() {
      this.$refs["from"].validate(valid => {
        if (valid) {
          console.log("from", this.from);
          let data = {
            ...this.from
          };
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["fileIds"] = fileIds;
          }
          this.$emit("setFormData", {
            type: true,
            data
          });
        } else {
          console.log("error submit!!");
          this.$emit("setFormData", {
            type: false,
            data: {}
          });
          return false;
        }
      });
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
      this.dictpermissions["order_school"].map(dict => {
        if (dict.value == item) {
          getPublikTypeList({
            pid: dict.id,
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
