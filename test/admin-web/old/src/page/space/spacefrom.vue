<template>
  <div class="detail spacefrom">
    <div class="detail_content">
      <div class="df_sb detail_top">
        <div class="detail_top_left df_sb">
          <div class="back_btn" @click="back">
            <img src="/svg/other/fanhui.svg" alt="" />
          </div>
          <span>{{
            this.$route.path == "/space/edit" ? "编辑空间" : "新建空间"
          }}</span>
        </div>
      </div>
      <el-scrollbar class="spacefrom_content">
        <div class="detail_item">
          <div class="detail_item_title">基础信息</div>
          <div class="detail_baseinfo basefrom">
            <el-form
              :label-position="'top'"
              :inline="true"
              :model="basefrom"
              :rules="baserules"
              ref="basefrom"
            >
              <div class="df_center_wrap">
                <el-form-item label="空间名称" prop="name">
                  <el-input
                    v-model="basefrom.name"
                    placeholder="请输入"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>

                <el-form-item label="使用类型" prop="useType">
                  <el-select
                    style="width: 100%"
                    v-model="basefrom.useType"
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
                <el-form-item label="面积：㎡" prop="area">
                  <el-input
                    v-model="basefrom.area"
                    placeholder="请输入"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item label="空间标签" prop="type">
                  <el-select
                    class="selectSpace"
                    style="width: 100%"
                    filterable
                    clearable
                    multiple
                    v-model="basefrom.labelIds"
                    placeholder="请选择"
                  >
                    <el-option
                      :key="k"
                      v-for="(i, k) in spaceLabel"
                      :label="i.name"
                      :value="String(i.id)"
                      :disabled="i.status === 0"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="空间类型" prop="type">
                  <el-select
                    class="selectSpace"
                    style="width: 100%"
                    filterable
                    clearable
                    multiple
                    v-model="basefrom.type"
                    placeholder="请选择"
                    @change="changeSpaceType"
                  >
                    <el-option
                      :key="k"
                      v-for="(i, k) in spaceType"
                      :label="i.name"
                      :value="String(i.id)"
                      :disabled="i.status === 0"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="width: 100%" label="空间平面图">
                  <FileList
                    ref="filelist"
                    :limit="1"
                    :scene="'space_icon_attachment'"
                    :isDisabled="false"
                    :showDownload="false"
                  />
                </el-form-item>
              </div>
            </el-form>
            <!-- 层级属性 -->
            <FromItem ref="levelForm" />
          </div>
        </div>
        <div class="detail_item" v-for="item in spaceAttribute" :key="item.id">
          <div class="detail_item_title">{{ item.name }}</div>
          <div class="detail_baseinfo basefrom">
            <FromItem
              :ref="`spacetype${item.id}`"
              :id="`spacetype${item.id}`"
            />
          </div>
        </div>
        <!-- <div class="detail_item" v-if="spaceAttribute.length > 0">
          <div class="detail_item_title">{{ String(getSpaceName) }}</div>
          <div class="detail_baseinfo basefrom">
          
            <FromItem
              v-for="(item, index) in spaceAttribute"
              :key="index"
              :ref="`spacetype${item.id}`"
            />
          </div>
        </div> -->
      </el-scrollbar>
      <div style="margin-top: 20px; text-align: right">
        <el-button type="primary" size="medium" @click="saveSpace"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>
  
<script>
import { spaceUseStatus } from "@/const/space/index.js";
import { getAllSpaceType } from "@/api/space/spacetype.js";
import { getSpaceLevelDeatil } from "@/api/space/spacehierarchy.js";
import { addSpace, editSpace, getSpaceDetail } from "@/api/space/spacelist.js";
import { getSpaceTypeForm } from "@/api/space/spacelist.js";
import { getAllSpaceLabel } from "@/api/space/spacelabel.js";
import FromItem from "@/page/space/from/fromitem.vue";
import { formrules } from "@/util/form.js";
import FileList from "@/components/common/FileList";
export default {
  components: {
    FromItem,
    FileList,
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
      // 空间类型
      spaceType: [],
      // 空间标签
      spaceLabel: [],
      // 空间类型属性
      spaceAttribute: [],
      // 校验表单
      formValid: {},
      // 当前层级
      hierarchyData: {},
      basefrom: { name: "", type: [], area: "", useType: "", labelIds: [] },
      baserules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: formrules["checkSpaceName"], trigger: "blur" },
        ],
        // type: [{ required: true, message: "请选择", trigger: "blur" }],
        useType: [{ required: true, message: "请选择", trigger: "blur" }],
        area: [
          { required: true, message: "请输入", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getAllSpaceType();
    this.getAllSpaceLabel();
    console.log('000this.$route.path',this.$route);
  },
  activated() {
    this.getAllSpaceLabel();
    this.getAllSpaceType(this.$route.query.pid).then((res) => {
      if (res.data.success) {
        let data = res.data.data;
        this.spaceType = data;
      }
    });
  },
  computed: {
    getSpaceName() {
      let spaceName = [];
      this.spaceAttribute.map((item) => {
        spaceName.push(item.name);
      });
      return spaceName;
    },
  },
  methods: {
    saveSpace() {
      if (!this.validateForm()) {
        this.$message.warning("请检查表单内容!");
      } else {
        this.getFormData();
      }
    },
    getFormData() {
      let sapcetype = [];
      this.spaceAttribute.map((item) => {
        let refsId = `spacetype${item.id}`;
        sapcetype.push(this.$refs[refsId][0].saveFormArrValue());
      });
      if (this.hierarchyData.templateFormId != null) {
        let hierarchyForm = this.$refs["levelForm"].saveFormArrValue();
        sapcetype.push(hierarchyForm);
      }
      Promise.all([...sapcetype])
        .then((result) => {
          console.log(result); //['成功了', 'success']
          // 层级数据id&&空间类型数据id
          let hierarchyFormId = "";
          let typeForms = [];
          result.map((item) => {
            if (item.templateFormId == this.hierarchyData.templateFormId) {
              hierarchyFormId = item.formId;
            } else {
              this.spaceAttribute.map((i) => {
                if (item.templateFormId == i.templateFormId) {
                  let obj = {
                    ...item,
                    typeId: i.id,
                    typeName: i.name,
                  };
                  typeForms.push(obj);
                }
              });
            }
          });
          console.log("hierarchyFormId", hierarchyFormId, typeForms);
          let data = {
            ...this.basefrom,
            pid: this.$route.query.pid,
            hierarchyFormId,
            typeForms,
          };
          delete data.type;
          console.log(999999, data);
          let fileIds = this.$refs["filelist"].filelist;
          if (fileIds.length > 0) {
            data["iconFileId"] = fileIds[0];
          } else {
            data["iconFileId"] = "";
          }
          if (this.$route.path == "/space/add") {
            this.addSpace(data);
          } else if (this.$route.path == "/space/edit") {
            data["id"] = this.$route.query.id;
            this.editSpace(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 校验表单
    validateForm() {
      let isCheck = true;
      this.$refs["basefrom"].validate((valid) => {
        this.formValid["basefrom"] = valid;
      });
      this.$refs["levelForm"].$refs["form"].validate((valid) => {
        this.formValid["levelForm"] = valid;
      });
      this.spaceAttribute.map((item) => {
        let refsId = `spacetype${item.id}`;
        this.$refs[refsId][0].$refs["form"].validate((valid) => {
          this.formValid[refsId] = valid;
        });
      });
      Object.keys(this.formValid).forEach((res) => {
        if (!this.formValid[res]) {
          isCheck = false;
        }
      });
      return isCheck;
    },
    // 动态查询绑定过的动态表单数据
    getSpaceTypeForm(id, templateFormId) {
      let obj = {
        id,
        spaceId: this.$route.query.id,
      };
      getSpaceTypeForm(obj).then((res) => {
        if (res.data.success) {
          console.log("getSpaceTypeForm", res.data);
          let data = res.data.data;
          // if (!data.formId) return;
          this.$nextTick(() => {
            let refsId = `spacetype${data.typeId}`;
            // this.$refs[refsId][0].getDynamicDetail(data.formId);
            this.$refs[refsId][0].getTemplateDetail(
              templateFormId,
              data.formId
            );
          });
        }
      });
    },
    addSpace(data) {
      addSpace(data).then((res) => {
        if (res.data.success) {
          this.$message.success("新增成功");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.back();
        }
      });
    },
    editSpace(data) {
      editSpace(data).then((res) => {
        if (res.data.success) {
          this.$message.success("已修改");
          this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
          this.$router.back();
        }
      });
    },
    getAllSpaceType() {
      getAllSpaceType(this.$route.query.pid).then((res) => {
        console.log('1111this.$route.path',this.$route);
        if (res.data.success) {
          console.log('222this.$route.path',this.$route);
          let data = res.data.data;
          this.spaceType = data;
          if (this.$route.path == "/space/edit") {
            this.getSpaceDetail();
          } else {
            this.getSpaceLevelDeatil(this.$route.query.pid, null);
          }
          // this.spaceType = data.filter((item) => {
          //   return item.status;
          // });
        }
      });
    },
    getAllSpaceLabel() {
      getAllSpaceLabel(this.$route.query.pid).then((res) => {
        if (res.data.success) {
          let data = res.data.data;
          this.spaceLabel = data;
        }
      });
    },
    getSpaceLevelDeatil(pid, hierarchyFormId) {
      getSpaceLevelDeatil(pid).then((res) => {
        if (res.data.success) {
          console.log("hierarchyData", res);
          this.hierarchyData = res.data.data;
          if (res.data.data.templateFormId != null) {
            this.$refs.levelForm.getTemplateDetail(
              res.data.data.templateFormId,
              hierarchyFormId
            );
          }
          // if (hierarchyFormId != null) {
          //   this.$refs.levelForm.getDynamicDetail(hierarchyFormId);
          // }
        }
      });
    },
    getSpaceDetail() {
      getSpaceDetail(this.$route.query.id).then((res) => {
        if (res.data.success) {
          console.log("res", res);
          this.spaceAttribute = [];
          let {
            area,
            name,
            useType,
            typeForms,
            hierarchyFormId,
            pid,
            labels,
            iconFileId,
          } = res.data.data;
          let type = [];
          let formId = [];
          let labelIds = [];
          typeForms.map((item) => {
            type.push(item.typeId);
            formId.push(item.formId);
          });
          labels.map((item) => {
            labelIds.push(item.id);
          });
          this.changeSpaceType(type);
          this.basefrom = { name, useType, area, type, labelIds };

          this.$nextTick(() => {
            this.getSpaceLevelDeatil(pid, hierarchyFormId);
            if (iconFileId != null && iconFileId != "") {
              let obj = {
                id: iconFileId,
                file: "",
                name: "平面图",
                type: "png",
              };
              this.$refs["filelist"].filelistobj[0] = obj;
              this.$refs["filelist"].getFile(iconFileId, obj);
            }
            // if (hierarchyFormId != null) {
            //   this.$refs.levelForm.getDynamicDetail(hierarchyFormId);
            // }
            // if (typeForms != null) {
            //   typeForms.map((item) => {
            //     this.$nextTick(() => {
            //       let refsId = `spacetype${item.typeId}`;
            //       this.$refs[refsId][0].getDynamicDetail(item.formId);
            //     });
            //   });
            // }
          });
        }
      });
    },

    changeSpaceType(e) {
      console.log("changeSpaceType", e);
      let arr = this.spaceType.filter((item) => {
        return e.includes(item.id);
      });
      let selectId = [];
      this.spaceAttribute.map((res) => {
        selectId.push(res.id);
      });
      // 减少
      this.spaceAttribute = this.spaceAttribute.filter((item, index) => {
        return e.includes(item.id);
      });
      // console.log(" this.spaceAttribute", this.spaceAttribute);
      // 增加
      arr.map((item) => {
        if (!selectId.includes(item.id)) {
          this.spaceAttribute.push(item);
          if (this.$route.path == "/space/edit") {
            this.$nextTick(() => {
              this.getSpaceTypeForm(item.id, item.templateFormId);
              // let refsId = `spacetype${item.id}`;
              // this.$refs[refsId][0].getTemplateDetail(
              //   item.templateFormId,
              //   null
              // );
            });
          } else {
            this.$nextTick(() => {
              let refsId = `spacetype${item.id}`;
              this.$refs[refsId][0].getTemplateDetail(
                item.templateFormId,
                null
              );
            });
          }
        }
      });
      this.spaceAttribute = JSON.parse(JSON.stringify(this.spaceAttribute));
    },
    back() {
      this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
      this.$router.back();
    },
  },
};
</script>
   
<style lang = "scss" scoped>
.selectSpace {
  /deep/.el-tag {
    display: flex;
    align-items: center;
  }
  /deep/.el-select__tags {
    .el-tag__close {
      display: block;
      top: 1px;
      line-height: 16.5px;
      color: #fff;
    }
  }
}
</style>