<template>
  <div class="community_page">
    <el-dialog
      :title="$t('isagroup')[typeObj[modalType]]"
      :visible.sync="showModal"
      width="1000px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <div class="moadlFromBox" v-if="showModal">
        <el-form
          :label-position="'top'"
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div
            class="df_center_wrap"
            style="max-height: 600px; overflow-y: auto"
          >
            <el-form-item
              :label="$t('isagroup.校区')"
              prop="schoolId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.schoolId"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in schoolList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.讨论标签')"
              prop="tagId"
              style="width: 50%"
            >
              <el-select
                clearable
                style="width: 100%"
                v-model="ruleForm.tagId"
                :placeholder="$t('isagroup.请选择')"
              >
                <el-option
                  v-for="(i, k) in tagList"
                  :label="i18nlocel == 'en' ? i.enName : i.cnName"
                  :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.公开范围')"
              prop="scope"
              style="width: 33.33%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['scope']">
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['scopeList']"
                  :label="i.value"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否可见')"
              prop="active"
              style="width: 33.33%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['active']">
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否推荐')"
              prop="recommended"
              style="width: 33.33%"
            >
              <el-radio-group
                style="width: 100%"
                v-model="ruleForm['recommended']"
              >
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.是否置顶')"
              prop="top"
              style="width: 33.33%"
            >
              <el-radio-group style="width: 100%" v-model="ruleForm['top']">
                <el-radio
                  :key="k"
                  v-for="(i, k) in consts['yesOrno']"
                  :label="i.boolean"
                  style="color: 999999"
                  >{{ i18nlocel == "en" ? i.enLabel : i.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>

            <el-form-item
              :label="$t('isagroup.中文内容')"
              prop="cnContent"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.cnContent"
                :placeholder="$t('consult.请输入')"
                maxlength="200"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.英文内容')"
              prop="enContent"
              style="width: 100%"
            >
              <el-input
                style="width: 100%"
                v-model="ruleForm.enContent"
                :placeholder="$t('consult.请输入')"
                maxlength="200"
                type="textarea"
                rows="5"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.主图')"
              prop="mainImg"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'mainImg')"
              >
                <img
                  v-if="ruleForm['mainImg']"
                  :src="ruleForm['mainImg']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第二张图')"
              prop="secondImg"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'secondImg')"
              >
                <img
                  v-if="ruleForm['secondImg']"
                  :src="ruleForm['secondImg']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第三张图')"
              prop="thirdImg"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'thirdImg')"
              >
                <img
                  v-if="ruleForm['thirdImg']"
                  :src="ruleForm['thirdImg']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第四张图')"
              prop="fourthImage"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'fourthImage')"
              >
                <img
                  v-if="ruleForm['fourthImage']"
                  :src="ruleForm['fourthImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第五张图')"
              prop="fifthImage"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'fifthImage')"
              >
                <img
                  v-if="ruleForm['fifthImage']"
                  :src="ruleForm['fifthImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第六张图')"
              prop="sixthImage"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'sixthImage')"
              >
                <img
                  v-if="ruleForm['sixthImage']"
                  :src="ruleForm['sixthImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item
              :label="$t('isagroup.第七张图')"
              prop="seventhImage"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'seventhImage')"
              >
                <img
                  v-if="ruleForm['seventhImage']"
                  :src="ruleForm['seventhImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第八张图')"
              prop="eighthImage"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'eighthImage')"
              >
                <img
                  v-if="ruleForm['eighthImage']"
                  :src="ruleForm['eighthImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              :label="$t('isagroup.第九张图')"
              prop="ninthImage"
              style="width: 25%"
            >
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="(file) => beforeUpload(file, 'ninthImage')"
              >
                <img
                  v-if="ruleForm['ninthImage']"
                  :src="ruleForm['ninthImage']"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              v-if="showModal"
              label="PDF"
              prop="pdfList"
              style="width: 100%"
            >
              <el-upload
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-upload="beforeUploadPdf"
                multiple
                :limit="10"
                :file-list="ruleForm['pdfList']"
              >
                <el-button size="small" type="primary">
                  {{ $t("isagroup.点击上传") }}
                </el-button>
                <div slot="tip" class="el-upload__tip">
                  {{ $t("isagroup.只能上传pdf文件，且不超过20M") }}
                </div>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item class="modalFromBtn">
            <el-button
              type="primary"
              size="medium"
              @click="submitForm('ruleForm')"
              >{{ $t("isagroup.确认") }}</el-button
            >
            <el-button type="default" size="medium" @click="closeModal">{{
              $t("isagroup.取消")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getContentSchoolList,
  getDiscussionTagList,
  addDiscussionContent,
  editDiscussionContent,
  getDiscussionContentDetail,
} from "@/api/isacommunity/content.js";
import myRequest from "@/router/axiosother.js";
import consts from "@/const/isacommunity/consts.js";
export default {
  name: "operation",
  components: {},
  props: {},
  data() {
    let that = this;
    return {
      consts: consts,
      typeObj: { add: "新增", edit: "编辑", look: "查看" },
      modalType: "add",
      showModal: false,
      ruleForm: {
        schoolId: "",
        tagId: "",
        active: false,
        recommended: false,
        top: false,
        cnContent: "",
        enContent: "",
        mainImg: "",
        secondImg: "",
        thirdImg: "",
        fourthImage: "",
        fifthImage: "",
        sixthImage: "",
        seventhImage: "",
        eighthImage: "",
        ninthImage: "",
        pdfList: [],
        scope: 1,
      },
      rules: {},
      isSubmitting: false,
      schoolList: [],
      tagList: [],
    };
  },
  created() {
    this.rules = this.initRules();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permissions", "dictionary", "i18nlocel"]),
  },
  watch: {
    i18nlocel: {
      handler(newVal, oldVal) {
        this.rules = this.initRules();
      },
    },
  },
  methods: {
    initRules() {
      let that = this;
      return {
        schoolId: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        tagId: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        active: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        recommended: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        top: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
        cnContent: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        enContent: [
          {
            required: true,
            message: that.$t("isagroup.请输入"),
            trigger: "blur",
          },
        ],
        mainImg: [
          {
            required: true,
            message: that.$t("isagroup.请上传"),
            trigger: "blur",
          },
        ],
        scope: [
          {
            required: true,
            message: that.$t("isagroup.请选择"),
            trigger: "blur",
          },
        ],
      };
    },
    // 打开
    async showForm(type = "add", item = {}) {
      this.schoolList = await getContentSchoolList();
      this.tagList = await getDiscussionTagList();
      this.modalType = type;
      this.showModal = true;
      if (type != "add") {
        this.getDetail(item["id"]);
      }
    },
    getDetail(id) {
      getDiscussionContentDetail(id).then(async (res) => {
        console.log("getDiscussionContentDetail", res);
        if (res.data.success) {
          let {
            cnName,
            enName,
            icon,
            index,
            active,
            recommended,
            cnContent,
            enContent,
            schoolId,
            tagId,
            pdfList,
            top,
            mainImg,
            secondImg,
            thirdImg,
            fourthImage,
            fifthImage,
            sixthImage,
            seventhImage,
            eighthImage,
            ninthImage,
            tagList,
            scope,
          } = res.data.data;
          this.$nextTick(() => {
            let tags = tagList || [];
            if (tags.length > 0) {
              console.log(tags);

              this.ruleForm = {
                ...this.ruleForm,
                tagId: tags[0].id,
              };
            }
            let resetPdfList = [];
            if (pdfList.length > 0) {
              pdfList.forEach((item) => {
                resetPdfList.push({
                  name: item.pdf,
                  url: item.pdf,
                  pdf: item.pdf,
                });
              });
            }

            this.ruleForm = {
              ...this.ruleForm,
              id,
              cnName,
              enName,
              icon,
              index,
              active,
              recommended,
              cnContent,
              enContent,
              schoolId,
              top,
              mainImg,
              secondImg,
              thirdImg,
              fourthImage,
              fifthImage,
              sixthImage,
              seventhImage,
              eighthImage,
              ninthImage,
              pdfList: resetPdfList,
              scope,
            };
          });
        }
      });
    },
    submitForm(formName) {
      if (this.isSubmitting) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置提交状态为true
          this.isSubmitting = true;
          let fromData = {
            ...this.ruleForm,
            active: this.ruleForm.active == "1" ? true : false,
          };
          if (this.modalType == "add") {
            this.addData(fromData);
          } else {
            this.editData(fromData);
          }
        }
      });
    },
    // 修改addData方法，确保重置提交状态
    addData(data) {
      addDiscussionContent(data)
        .then((res) => {
          this.isSubmitting = false; // 重置提交状态
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false; // 错误时也要重置提交状态
        });
    },

    editData(data) {
      editDiscussionContent(data)
        .then((res) => {
          this.isSubmitting = false;
          if (res.data.success) {
            this.$message.success(this.$t("isagroup.成功"));
            this.$emit("getList");
            this.closeModal();
          }
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },

    async beforeUpload(file, fromName) {
      console.log("beforeUpload", file, fromName);

      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      if (isJPG && isLt20M) {
        let url = await this.uploadfile(file);
        this.$set(this.ruleForm, fromName, url);
      }
    },
    async uploadfile(file) {
      let formData = new FormData();
      formData.append("prefix", "parent_weapp_upload");
      formData.append("file", file);
      const response = await myRequest.upload(formData);
      return response.data.url;
    },
    // pdf 上传
    async beforeUploadPdf(file) {
      const isPDF = file.type === "application/pdf";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isPDF) {
        this.$message.error("上传 PDF 文件只能是 PDF 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传 PDF 文件大小不能超过 20MB!");
      }
      if (isPDF && isLt20M) {
        let url = await this.uploadfile(file);
        let pdfObj = {
          name: file.name,
          url,
          pdf: url,
        };
        this.ruleForm.pdfList.push(pdfObj);
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.ruleForm.pdfList = fileList;
    },
    handlePreview(file) {
      console.log(file);
      window.open(file.url, "_blank");
    },
    // 关闭
    closeModal() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        schoolId: "",
        tagId: "",
        active: false,
        recommended: false,
        top: false,
        cnContent: "",
        enContent: "",
        mainImg: "",
        secondImg: "",
        thirdImg: "",
        fourthImage: "",
        fifthImage: "",
        sixthImage: "",
        seventhImage: "",
        eighthImage: "",
        ninthImage: "",
        pdfList: [],
        scope: 1,
      };
      this.isSubmitting = false;
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-right: 0px;
  padding-right: 20px;
  box-sizing: border-box;
}
</style>
