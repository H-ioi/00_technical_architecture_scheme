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
        <div class="searchFromBox">
          <div class="df_sb searchFromBox_header">
            <div class="searchFromBox_header_titel">轮播图</div>
          </div>
        </div>
        <el-scrollbar class="formItem">
          <div class="df_start_column">
            <el-form-item label="轮播图名称" prop="title">
              <el-input
                v-model="from.title"
                placeholder="请输入"
                :maxlength="20"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="上传用户" prop="username">
              <el-input
                v-model="from.username"
                placeholder="请输入"
                :maxlength="20"
              ></el-input>
            </el-form-item> -->
            <el-form-item
              style="width: 100%"
              label="轮播图素材"
              prop="coverFileIds"
            >
              <FileList
                ref="FileList"
                :scene="'isaic_banner_cover'"
                :limit="1"
              />
            </el-form-item>
            <el-form-item label="轮播图链接" prop="link">
              <el-input
                v-model="from.link"
                placeholder="请输入"
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="轮播图排序" prop="sort">
              <el-input
                v-model="from.sort"
                placeholder="请输入"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="自动上架时间"
              prop="autoReleaseUpTime"
              style="width: 22%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="from.autoReleaseUpTime"
                type="datetime"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                  }
                }"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="自动下架时间"
              prop="autoReleaseDownTime"
              style="width: 22%"
            >
              <el-date-picker
                style="width: 100%"
                v-model="from.autoReleaseDownTime"
                type="datetime"
                placeholder="选择时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                :picker-options="{
                  disabledDate: time => {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                  }
                }"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              style="width: 80%"
              label="轮播图说明"
              prop="description"
            >
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="150"
                show-word-limit
                v-model="from.description"
                placeholder="请输入"
              ></el-input>
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
import { addBanner, putBanner, getBannerDetail } from "@/api/academy/banner.js";
import FileList from "@/components/academy/FileList.vue";
export default {
  name: "PCOrderAddorder",
  components: { FileList },
  data() {
    const checkUpTime = async (rule, value, callback) => {
      if (
        !this.from["autoReleaseDownTime"] ||
        this.from["autoReleaseDownTime"] == "" ||
        value == ""
      ) {
        callback();
      } else {
        let downTime = new Date(this.from["autoReleaseDownTime"]).getTime();
        let upTime = new Date(value).getTime();
        if (downTime > upTime) {
          callback();
        } else {
          callback(new Error("自动上架时间应小于下架时间"));
        }
      }
    };
    const checkDownTime = async (rule, value, callback) => {
      if (
        !this.from["autoReleaseUpTime"] ||
        this.from["autoReleaseUpTime"] == "" ||
        value == ""
      ) {
        callback();
      } else {
        let upTime = new Date(this.from["autoReleaseUpTime"]).getTime();
        let downTime = new Date(value).getTime();
        if (downTime > upTime) {
          callback();
        } else {
          callback(new Error("自动下架时间应大于上架时间"));
        }
      }
    };
    return {
      minTime: new Date(),
      type: "",
      from: {
        title: "",
        // username: "",
        coverFileIds: "",
        link: "",
        sort: "",
        autoReleaseUpTime: "",
        autoReleaseDownTime: "",
        description: ""
      },
      rules: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        // username: [{ required: true, message: "请输入", trigger: "blur" }],
        coverFileIds: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        link: [{ required: false, message: "请输入", trigger: "blur" }],
        sort: [{ required: false, message: "请输入", trigger: "blur" }],
        autoReleaseUpTime: [
          { required: false, message: "请选择", trigger: "blur" },
          { validator: checkUpTime, trigger: "blur" }
        ],
        autoReleaseDownTime: [
          { required: false, message: "请选择", trigger: "blur" },
          { validator: checkDownTime, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.type = this.$route.query.type;
    if (this.type == "edit") {
      this.currentId = this.$route.query.id;
      this.getDetail(this.$route.query.id);
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(["dictionary", "userInfo"])
  },
  methods: {
    submitForm(formName) {
      this.from["coverFileIds"] = this.$refs["FileList"].filelist;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = _.cloneDeep({
            ...this.from
          });
          console.log("this.from", this.from);
          if (this.$route.query.type == "edit") {
            data["id"] = this.$route.query.id;
            putBanner(data).then(res => {
              if (res.data.success) {
                this.$message.success("保存成功");
                this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
                this.$router.push("/academy/consult/swiper");
              }
            });
          } else {
            addBanner(data).then(res => {
              if (res.data.success) {
                this.$message.success("新增成功");
                this.$store.commit("CLOSE_TAG_CURRENT", this.$route.fullPath);
                this.$router.push("/academy/consult/swiper");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    getDetail(id) {
      getBannerDetail(id).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.from = {
            title: data["title"],
            coverFileIds: data["coverFileIds"],
            link: data["link"],
            sort: data["sort"],
            autoReleaseUpTime: data["autoReleaseUpTime"],
            autoReleaseDownTime: data["autoReleaseDownTime"],
            description: data["description"]
          };
          this.$nextTick(() => {
            this.$refs["FileList"].getFileList(id);
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.searchFromBox {
  background-color: #fff;
  padding: 20px 20px 0;
  .searchFromBox_header {
    .searchFromBox_header_titel {
      font-size: 20px;
      font-family: AlibabaPuHuiTiM;
      color: #333333;
      line-height: 27px;
      padding-left: 15px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 0;
        width: 5px;
        background: #d4ab85 !important;
        border-radius: 3px;
      }
    }
  }
  .palyTableBox {
    padding-top: 10px;
  }
}
</style>
