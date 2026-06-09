<template>
  <div>
    <div style="text-align: right">
      <el-button
        v-loading="loading"
        style="margin-bottom: 20px"
        type="primary"
        size="small"
        @click="generatePdf"
        >{{ $t("consult.打印") }}</el-button
      >
    </div>

    <!-- 渲染节点：必须 visible，不能 display:none -->
    <div
      id="pdfDom"
      style="width: 210mm; background: #fff; font-family: 'Microsoft YaHei'"
    >
      <!-- 全文内容 -->
      <div class="pdf-content">
        <!-- 页眉区域：可通过div自定义样式 -->
        <div
          class="pdf-header"
          style="
            height: 26mm;
            padding: 10mm 10mm 5mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
          "
        >
          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 3mm 0 10mm;
              box-sizing: border-box;
              border-bottom: 0.5mm solid #1f4060;
            "
          >
            <img
              style="
                width: 15mm;
                height: 15mm;
                background: #1f4060;
                border-radius: 50%;
                border: 0.5mm solid #1f4060;
              "
              src="/thepool/other/isa_icon_liwan.png"
            />
            <div style="text-align: right">
              <div style="font-size: 5mm; font-weight: 600; color: #1f4060">
                Applicant Profile
              </div>
            </div>
          </div>
        </div>

        <!-- 内容区：严格一行两个字段，顶部对齐，label与value上下结构 -->
        <div
          class="pdf-body"
          style="
            padding: 0 10mm 4mm 10mm;
            color: #333;
            font-size: 4mm;
            line-height: 1.6;
          "
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 0 0 5mm;
              box-sizing: border-box;
              border-bottom: 0.5mm solid #1f4060;
              margin-bottom: 2mm;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              "
            >
              <img
                style="
                  width: 26mm;
                  height: 26mm;
                  border-radius: 50%;
                  margin-right: 5mm;
                  border: 0.5mm solid #1f4060;
                "
                :src="
                  studentBaseInfo.photoUrl || imgObj[studentData['photoId']]
                "
              />
              <div
                style="
                  display: flex;
                  align-items: flex-start;
                  flex-direction: column;
                "
              >
                <div
                  style="
                    font-size: 24px;
                    font-weight: bold;
                    color: #1f4060;
                    line-height: 1.5;
                  "
                >
                  {{
                    studentBaseInfo.studentNameEn +
                    "|" +
                    (studentBaseInfo.firstName + studentBaseInfo.lastName)
                  }}
                </div>
                <div style="font-size: 18px; line-height: 1.5">
                  {{ studentBaseInfo.birthday || "--" }}
                </div>
                <div style="font-size: 18px; line-height: 1.5">
                  {{ studentBaseInfo.sexlabel || "--" }} •
                  {{ studentBaseInfo.enrollLevelLabel || "--" }}
                </div>
              </div>
            </div>
            <div
              style="
                display: flex;
                align-items: flex-start;
                flex-direction: column;
              "
            >
              <div style="font-size: 18px; line-height: 1.5; margin-top: 3mm">
                <span style="color: #000">Applicant ID &nbsp;&nbsp;</span>
                <span style="color: rgb(0, 0, 0, 0.8)">{{
                  studentBaseInfo.id || "--"
                }}</span>
              </div>
              <div style="font-size: 18px; line-height: 1.5">
                <span style="color: #000">学生ID&nbsp;&nbsp;</span>
                <span style="color: rgb(0, 0, 0, 0.8)">{{
                  studentBaseInfo.studentNumber || "--"
                }}</span>
              </div>
              <div style="font-size: 18px; line-height: 1.5">
                <span style="color: #000"
                  >{{ studentBaseInfo.statusLabel || "" }}&nbsp;&nbsp;</span
                >
                <span style="color: rgb(0, 0, 0, 0.8)">{{
                  studentBaseInfo.enrolledDate || ""
                }}</span>
              </div>
            </div>
          </div>
          <div>
            <h3
              v-if="studentData['paySubject']"
              style="
                text-align: left;
                font-size: 6mm;
                margin: 0 0 3mm 0;
                color: #1f4060;
                font-weight: bold;
              "
            >
              {{
                studentData["formType"]
                  ? schoolName[studentData["formType"]]
                  : ""
              }}
            </h3>
            <h3
              style="
                text-align: left;
                font-size: 4.5mm;
                margin: 0 0 3mm 0;
                color: #1f4060;
                font-weight: bold;
                font-weight: 600;
              "
            >
              学生基本信息/Student Information
            </h3>

            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 5mm;
              "
            >
              <div
                style="
                  width: 45%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  margin-bottom: 3mm;
                "
              >
                <div style="font-weight: 600; margin-bottom: 1.5mm">
                  {{ $t("consult.校区") }}
                </div>
                <div style="color: #333">
                  {{ studentBaseInfo.applySchoolLabel || "--" }}
                </div>
              </div>
              <div
                style="
                  width: 45%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  margin-bottom: 3mm;
                "
              >
                <div style="font-weight: 600; margin-bottom: 1.5mm">
                  {{ $t("consult.方向") }}
                </div>
                <div style="color: #333">
                  {{ studentBaseInfo.directionLabel || "--" }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3
              style="
                text-align: left;
                font-size: 4.5mm;
                margin: 0 0 3mm 0;
                color: #1f4060;
                font-weight: bold;
                font-weight: 600;
              "
            >
              基本信息/Basic Detail
            </h3>
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 5mm;
              "
            >
              <div
                v-for="(item, index) in studentInfo"
                :key="index"
                style="
                  width: 45%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  margin-bottom: 3mm;
                "
              >
                <div style="font-weight: 600; margin-bottom: 1.5mm">
                  {{ item.label }}
                </div>
                <div v-if="!item.isImg" style="color: #333">
                  {{ studentData[item.prop] || "--" }}
                </div>
                <img
                  v-else
                  :src="imgObj[studentData[item.prop]]"
                  style="width: 30mm; height: auto; margin-top: 1mm"
                />
              </div>
            </div>
          </div>

          <div v-for="(parent, index) in parentData" :key="parent.idNumber">
            <h3
              style="
                font-size: 16px;
                margin: 3mm 0 3mm 0;
                color: #1f4060;
                font-weight: bold;
              "
            >
              {{ parentData.length > 1 ? index + 1 + "." : "" }} 家长信息/Parent
              Information
            </h3>
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 5mm;
              "
            >
              <div
                v-for="(item, p) in parentInfo"
                :key="index + 'parentInfo' + p"
                style="
                  width: 45%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                <div style="font-weight: bold; margin-bottom: 1mm">
                  {{ item.label }}
                </div>
                <div v-if="!item.isImg">
                  {{ parent[item.prop] || "--" }}
                </div>
                <img
                  v-else
                  :src="imgObj[parent[item.prop]]"
                  style="width: 30mm; height: auto; margin-top: 1mm"
                />
              </div>
            </div>
          </div>
          <div v-for="(sibling, index) in siblingData" :key="index">
            <h3
              style="
                font-size: 16px;
                margin: 3mm 0 3mm 0;
                color: #1f4060;
                font-weight: bold;
              "
            >
              {{ siblingData.length > 1 ? index + 1 + "." : "" }}
              兄弟姐妹信息/Sibling Information
            </h3>
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 5mm;
              "
            >
              <div
                v-for="(item, s) in siblingInfo"
                :key="index + 'siblingInfo' + s"
                style="
                  width: 45%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                <div style="font-weight: bold; margin-bottom: 1mm">
                  {{ item.label }}
                </div>
                <div>{{ sibling[item.prop] || "--" }}</div>
              </div>
            </div>
          </div>
          <div v-if="studentTemplate.length > 0">
            <div
              v-for="(dynamic, index) in studentTemplate"
              :key="dynamic.templateId"
            >
              <h3
                style="
                  font-size: 16px;
                  margin: 3mm 0 3mm 0;
                  color: #1f4060;
                  font-weight: bold;
                "
              >
                {{ dynamic["templateName"] + "/" + dynamic["templateNameEn"] }}
              </h3>
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-between;
                  gap: 5mm;
                "
              >
                <div
                  v-for="(item, d) in dynamic['templateFields']"
                  :key="d + 'dynamic' + item.fieldName"
                  :style="` width: ${
                    item.fieldType != 'upload' &&
                    item.fieldType != 'sign' &&
                    item.fieldType != 'protocol'
                      ? 45
                      : 100
                  }%;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;`"
                >
                  <div style="font-weight: bold; margin-bottom: 1mm">
                    {{
                      item.fieldName +
                      (item.fieldNameEn ? "/" + item.fieldNameEn : "")
                    }}
                  </div>
                  <div
                    v-if="item.fieldType == 'protocol'"
                    style="
                      font-weight: 400;
                      color: #999999;
                      white-space: pre-wrap;
                      word-break: break-all;
                      font-size: 3mm;
                      line-height: 1.4;
                    "
                    v-html="getplaceholder(item)"
                  ></div>
                  <div
                    v-if="
                      item.fieldType != 'upload' && item.fieldType != 'sign'
                    "
                  >
                    {{ item["fieldValue"] || "--" }}
                  </div>
                  <div
                    v-else
                    style="
                      display: flex;
                      flex-direction: column;
                      flex-wrap: wrap;
                      gap: 5mm;
                    "
                  >
                    <img
                      style="width: 30mm; height: auto; margin-top: 1mm"
                      v-for="imgId in item['fieldValue']"
                      :key="imgId"
                      :src="imgObj[imgId]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 页脚区域：可通过div自定义样式 -->
        <div
          class="pdf-footer"
          style="
            height: 15mm;
            padding: 2mm 10mm 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
          "
        >
          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-top: 0.5mm solid #1f4060;
              padding: 0 0 3mm;
              box-sizing: border-box;
            "
          >
            <div style="font-size: 14px; color: #000">
              {{ studentData.studentNameEn ? studentData.studentNameEn : "" }}
              |
              {{ studentData.lastName || "--" + studentData.firstName || "--" }}
            </div>
            <div style="font-size: 11px; color: #666"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  getOuterFile,
  getOuterFileName,
  downloadOuterFile,
} from "@/api/upload/index.js";
import { getOutDictItem } from "@/api/consult/collection.js";
export default {
  props: {
    studentBaseInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 边距配置变量
      margins: {
        top: 30, // 上边距
        bottom: 20, // 下边距
        left: 20, // 左边距
        right: 20, // 右边距
        header: 26, // 页眉高度
        footer: 15, // 页脚高度
      },
      // 内容配置
      contentConfig: {
        lineHeight: 7, // 行高
        sectionSpacing: 10, //  section间距
        fieldSpacing: 4, // 字段间距
      },
      // 加载状态
      loading: false,
      // 学生信息
      studentData: {},
      studentInfo: [
        {
          label: "证件照(白底)",
          prop: "photoId",
          isImg: true,
        },
        {
          label: "证件照(非白底)",
          prop: "otherPhotoId",
          isImg: true,
        },
        {
          label: "姓",
          prop: "lastName",
          isImg: false,
        },
        {
          label: "名",
          prop: "firstName",
          isImg: false,
        },
        {
          label: "英文名",
          prop: "studentNameEn",
          isImg: false,
        },
        {
          label: "其他姓名",
          prop: "otherName",
          isImg: false,
        },
        {
          label: "身份证/护照号",
          prop: "identityCard",
          isImg: false,
        },
        {
          label: "性别",
          prop: "sexLabel",
          isImg: false,
        },
        {
          label: "出生日期",
          prop: "birthday",
          isImg: false,
        },
        {
          label: "在读学校",
          prop: "atSchool",
          isImg: false,
        },
        {
          label: "入学年份",
          prop: "enrollYear",
          isImg: false,
        },
        {
          label: "入学年级",
          prop: "enrollLevelLabel",
          isImg: false,
        },
        {
          label: "国籍",
          prop: "nationality",
          isImg: false,
        },
        {
          label: "省",
          prop: "state",
          isImg: false,
        },
        {
          label: "市",
          prop: "city",
          isImg: false,
        },
        {
          label: "详细地址",
          prop: "address",
          isImg: false,
        },
        {
          label: "母语",
          prop: "language",
          isImg: false,
        },
        {
          label: "第二语言",
          prop: "secondLanguage",
          isImg: false,
        },
        {
          label: "第三语言",
          prop: "thirdLanguage",
          isImg: false,
        },
      ],
      // 家长信息
      parentData: [],
      parentInfo: [
        {
          label: "姓",
          prop: "lastName",
          isImg: false,
        },
        {
          label: "名",
          prop: "firstName",
          isImg: false,
        },
        {
          label: "其他姓名",
          prop: "otherName",
          isImg: false,
        },
        {
          label: "性别",
          prop: "sexLabel",
          isImg: false,
        },
        {
          label: "身份证/护照号",
          prop: "idNumber",
          isImg: false,
        },
        {
          label: "证件照(白底)",
          prop: "photoId",
          isImg: true,
        },
        {
          label: "和学生关系",
          prop: "relationTypeLabel",
          isImg: false,
        },
        {
          label: "手机号",
          prop: "phone",
          isImg: false,
        },
        {
          label: "邮箱",
          prop: "email",
          isImg: false,
        },
        {
          label: "工作单位",
          prop: "employer",
          isImg: false,
        },
        {
          label: "职务",
          prop: "jobTitle",
          isImg: false,
        },
        {
          label: "国籍",
          prop: "nationality",
          isImg: false,
        },
        {
          label: "省",
          prop: "state",
          isImg: false,
        },
        {
          label: "市",
          prop: "city",
          isImg: false,
        },
        {
          label: "母语",
          prop: "language",
          isImg: false,
        },
        {
          label: "第二语言",
          prop: "secondLanguage",
          isImg: false,
        },
        {
          label: "第三语言",
          prop: "thirdLanguage",
          isImg: false,
        },
        {
          label: "地址第一行",
          prop: "address",
          isImg: false,
        },
        {
          label: "地址第二行",
          prop: "addressIi",
          isImg: false,
        },
      ],
      // 兄弟姐妹信息
      siblingData: [],
      siblingInfo: [
        {
          label: "姓",
          prop: "lastName",
          isImg: false,
        },
        {
          label: "名",
          prop: "firstName",
          isImg: false,
        },
        {
          label: "其他姓名",
          prop: "otherName",
          isImg: false,
        },
        {
          label: "性别",
          prop: "sexLabel",
          isImg: false,
        },
        {
          label: "在读学校",
          prop: "atSchool",
          isImg: false,
        },
      ],
      // 动态表单信息
      dynamicFormData: {},
      dynamicFormInfo: [],
      studentTemplate: [],
      sexMap: {
        0: "女",
        1: "男",
      },
      imgObj: {},
      enrollLevelList: [], //入学年级
      relationTypeList: [], //关系类型
      schoolName: {
        7: "广州荔湾爱莎外籍人员子女学校意向学生登记表", //爱莎荔湾外籍学校
        6: "广州荔湾爱莎文华学校（国际部）意向学生登记表", //爱莎荔湾文华高中
        5: "广州荔湾爱莎文华学校（国内部）学生信息登记表", //荔湾爱莎文华学校
      },
      schoolEnName: {
        7: "ISALWIS Prospective Student Registration Form", //爱莎荔湾外籍学校
        6: "ISALW Wenhua  STUDENT REGISTRATION FORM", //爱莎荔湾文华高中
        5: "ISALW Wenhua  STUDENT REGISTRATION FORM (Domestic)", //荔湾爱莎文华学校
      },
    };
  },
  methods: {
    // 获取学生表模板，暂时写死荔湾校区id==5，后续根据学校id获取
    async getOutDictList() {
      // 获取字典数据
      let dictItem = await getOutDictItem(5);
      dictItem.forEach((item) => {
        switch (item["type"]) {
          case "enquiry_enroll_level":
            this.enrollLevelList = item["dictItems"] || [];
            break;
          case "enquiry_relation_type":
            this.relationTypeList = item["dictItems"] || [];
            break;
        }
      });
    },
    async initData(templateList, studentFillInfo) {
      await this.getOutDictList();
      let { phone, dynamicInfos, guardianInfos, studentInfo, studentSiblings } =
        studentFillInfo;

      // 学生信息
      this.studentData = this.formatStudentData(studentInfo || {});

      // 家长信息
      this.parentData = this.formatParentData(guardianInfos || []);
      // 兄弟姐妹信息
      this.siblingData = this.formatSiblingData(studentSiblings || []);
      // 动态表单信息
      this.dynamicFormInfo = dynamicInfos || [];

      console.log("学生信息:", this.studentData);
      console.log("家长信息:", this.parentData);
      console.log("兄弟姐妹信息:", this.siblingData);
      // 学生模板
      this.studentTemplate = templateList;
      // 异步处理动态表单字段
      for (const item of this.studentTemplate) {
        for (const field of item.templateFields) {
          let fieldValue = await this.formatDynamicFormInfo(
            item.templateId,
            field
          );
          this.$set(field, "fieldValue", fieldValue);
          // console.log("动态表单字段:", fieldValue);
          // console.log(" this.imgObj:", this.imgObj);
        }
      }
      // console.log("学生模板:", this.studentTemplate);
      let studentImgList = [];
      console.log("this.studentData:", this.studentData);

      if (this.studentData["photoId"]) {
        studentImgList.push(this.studentData["photoId"]);
      }
      if (this.studentData["otherPhotoId"]) {
        studentImgList.push(this.studentData["otherPhotoId"]);
      }
      console.log("this.studentImgList:", studentImgList);
      await this.getImagesList(studentImgList);
      let parentImgList = [];
      this.parentData.forEach((item) => {
        if (item.photoId) {
          parentImgList.push(item.photoId);
        }
      });
      console.log("this.parentImgList:", parentImgList);
      await this.getImagesList(parentImgList);
      console.log("this.imgObj:", this.imgObj);
    },
    // 格式化学生信息
    formatStudentData(data) {
      return {
        ...data,
        sexLabel: this.sexMap[data.sex] || "--",
        enrollLevelLabel: this.$getListLabel(
          this.enrollLevelList,
          data.enrollLevel
        ),
      };
    },
    // 格式化家长信息
    formatParentData(data) {
      return data.map((item) => {
        // console.log("家长信息:", this.sexMap[item.sex]);
        return {
          ...item,
          sexLabel: this.sexMap[item.sex] || "--",
          relationTypeLabel: this.$getListLabel(
            this.relationTypeList,
            item.relationType
          ),
        };
      });
    },
    // 格式化兄弟姐妹信息
    formatSiblingData(data) {
      return data.map((item) => {
        // console.log("兄弟姐妹信息:", this.sexMap[item.sex]);
        return {
          ...item,
          sexLabel: this.sexMap[item.sex] || "--",
        };
      });
    },
    // 格式化动态表单信息
    async formatDynamicFormInfo(templateId, fieldItem) {
      let { fieldType, properties, fieldId } = fieldItem;
      let value = "";
      let fieldValue = "";
      let arr = [];
      this.dynamicFormInfo.forEach((item) => {
        if (item.templateId == templateId) {
          let { fields } = item;
          fields.forEach((field) => {
            if (field.fieldId == fieldId) {
              value = field.value;
            }
          });
        }
      });
      switch (fieldType) {
        case "input":
          fieldValue = value || "--";
          break;
        case "textarea":
          fieldValue = value || "--";
          break;
        case "radio":
          value = value ? JSON.parse(value) : [];
          properties.map((o) => {
            if (value == o.id) {
              fieldValue = o.value;
            }
          });
          break;
        case "checkbox":
          value = value ? JSON.parse(value) : [];
          properties.map((o) => {
            if (value.includes(o.id)) {
              arr.push(o.value);
            }
          });
          fieldValue = String(arr);
          break;
        case "select":
          value = value ? JSON.parse(value) : [];
          properties.map((o) => {
            if (value.includes(o.id)) {
              arr.push(o.value);
            }
          });
          fieldValue = String(arr);
          break;
        case "datetimepicker":
          fieldValue = value ? JSON.parse(value)[0] : "--";
          break;
        case "upload":
          fieldValue = [];
          fieldValue = value ? JSON.parse(value) : [];
          await this.getImagesList(fieldValue);
          break;
        case "sign":
          fieldValue = [];
          let signIds = value ? JSON.parse(value) : [];
          fieldValue = signIds.map((item) => item["id"]);
          this.getImagesList(fieldValue);
          break;
        case "protocol":
          fieldValue = value == "1" ? "已同意/Agreed" : "--";
          break;
      }
      return fieldValue;
    },
    async generatePdf() {
      if (this.loading) {
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "正在生成PDF，请稍候...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.loading = true;
      try {
        console.log("开始生成PDF");
        const A4_WIDTH = 210;
        const A4_HEIGHT = 297;
        const { header, footer } = this.margins;
        const CONTENT_HEIGHT = A4_HEIGHT - header - footer;

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfDom = document.querySelector("#pdfDom");
        console.log("获取DOM元素成功");

        // 生成页眉图片
        console.log("开始生成页眉图片");
        const headerCanvas = await this.generateElementCanvas(".pdf-header");
        console.log("页眉图片生成成功:", headerCanvas);

        // 生成页脚图片
        console.log("开始生成页脚图片");
        const footerCanvas = await this.generateElementCanvas(".pdf-footer");
        console.log("页脚图片生成成功:", footerCanvas);

        // 生成内容图片
        console.log("开始生成内容图片");
        const contentElement = pdfDom.querySelector(".pdf-body");
        console.log("内容元素:", contentElement);
        const contentCanvas = await html2canvas(contentElement, {
          scale: 2.2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        console.log("内容图片生成成功:", contentCanvas);

        const contentWidth = contentCanvas.width;
        const contentHeight = contentCanvas.height;
        const imgRatio = A4_WIDTH / contentWidth;
        const imgFullHeight = contentHeight * imgRatio;
        const pageCount = Math.ceil(imgFullHeight / CONTENT_HEIGHT);
        console.log("内容尺寸:", {
          contentWidth,
          contentHeight,
          imgFullHeight,
          pageCount,
        });

        let position = 0;
        let pageIndex = 1;

        while (position < imgFullHeight) {
          console.log("处理第", pageIndex, "页");
          // 1. 添加页眉
          if (headerCanvas) {
            pdf.addImage(
              headerCanvas.toDataURL("image/jpeg", 0.95),
              "JPEG",
              0,
              0,
              A4_WIDTH,
              header
            );
          } else {
            // this.drawHeader(pdf, A4_WIDTH, header);
          }

          // 2. 计算当前页的内容区域
          const startY = position;
          const endY = Math.min(position + CONTENT_HEIGHT, imgFullHeight);
          const currentHeight = endY - startY;

          // 计算图片上的对应区域
          const imgStartY = startY / imgRatio;
          const imgEndY = endY / imgRatio;
          const imgCurrentHeight = imgEndY - imgStartY;

          // 创建一个新的画布来截取当前页的内容
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = contentWidth;
          pageCanvas.height = imgCurrentHeight;
          const ctx = pageCanvas.getContext("2d");
          ctx.drawImage(
            contentCanvas,
            0,
            imgStartY,
            contentWidth,
            imgCurrentHeight,
            0,
            0,
            contentWidth,
            imgCurrentHeight
          );

          // 3. 添加内容
          pdf.addImage(
            pageCanvas.toDataURL("image/jpeg", 0.95),
            "JPEG",
            0,
            header,
            A4_WIDTH,
            currentHeight
          );

          // 4. 添加页脚
          if (footerCanvas) {
            pdf.addImage(
              footerCanvas.toDataURL("image/jpeg", 0.95),
              "JPEG",
              0,
              A4_HEIGHT - footer,
              A4_WIDTH,
              footer
            );
          } else {
            this.drawFooter(
              pdf,
              A4_WIDTH,
              A4_HEIGHT,
              footer,
              pageIndex,
              pageCount
            );
          }

          // 5. 绘制页码
          this.drawPageNumber(
            pdf,
            A4_WIDTH,
            A4_HEIGHT,
            footer,
            pageIndex,
            pageCount
          );

          position += CONTENT_HEIGHT;
          if (position < imgFullHeight) {
            pdf.addPage();
            pageIndex++;
          }
        }
        // 调用浏览器打印功能
        console.log("PDF生成完成，准备处理");

        // 生成PDF的blob数据
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log("PDF Blob URL生成成功");

        // 先保存PDF
        pdf.save("广州荔湾爱莎文华学校（国内部）学生信息登记表.pdf");
        console.log("PDF保存成功");

        // 尝试使用新窗口打印
        this.tryPrintPdf(pdfUrl);

        this.loading = false;
        loading.close();
      } catch (error) {
        this.loading = false;
        loading.close();
        console.error("PDF生成失败:", error);
        alert("PDF生成失败，请查看控制台错误信息");
      }
    },

    // 生成元素的canvas
    async generateElementCanvas(selector) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          return await html2canvas(element, {
            scale: 2.2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });
        }
        console.warn(`未找到元素: ${selector}`);
        return null;
      } catch (error) {
        console.error(`生成元素canvas失败: ${error}`);
        return null;
      }
    },

    // 绘制页码
    drawPageNumber(
      pdf,
      pageWidth,
      pageHeight,
      footerHeight,
      currentPage,
      totalPages
    ) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(
        `${currentPage} / ${totalPages}`,
        pageWidth - 15,
        pageHeight - 6,
        { align: "right" }
      );
    },

    // 绘制页眉（后备方案）
    drawHeader(pdf, pageWidth, headerHeight) {
      // 设置字体
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      // 绘制边框
      pdf.setLineWidth(0.5);
      pdf.line(0, headerHeight, pageWidth, headerHeight);

      // 绘制LOGO
      pdf.setFillColor(31, 64, 96);
      pdf.rect(20, 8, 15, 15, "F");
      pdf.setFillColor(255, 255, 255);
      pdf.text("ISA LOGO", 27.5, 16, { align: "center" });

      // 绘制标题
      pdf.setFontSize(15);
      pdf.text("广州荔湾", pageWidth - 20, 12, {
        align: "right",
      });
      pdf.setFontSize(13);
      pdf.text(
        "意向学生登记表" + "-" + this.studentData.studentNameEn,
        pageWidth - 20,
        18,
        { align: "right" }
      );
    },

    // 绘制页脚（后备方案）
    drawFooter(
      pdf,
      pageWidth,
      pageHeight,
      footerHeight,
      currentPage,
      totalPages
    ) {
      // 绘制边框
      pdf.setLineWidth(0.5);
      pdf.line(
        0,
        pageHeight - footerHeight,
        pageWidth,
        pageHeight - footerHeight
      );

      // 绘制页脚内容
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text("广州荔湾爱莎文华学校", 20, pageHeight - 8);
    },
    // 尝试打印PDF
    tryPrintPdf(pdfUrl) {
      console.log("尝试打印PDF");

      // 方法1：尝试使用新窗口打印
      try {
        const printWindow = window.open(pdfUrl, "_blank");

        if (printWindow) {
          console.log("新窗口已打开");

          // 等待PDF加载完成后触发打印
          printWindow.onload = function () {
            console.log("新窗口加载完成，准备打印");
            setTimeout(function () {
              try {
                printWindow.print();
                console.log("打印功能已触发");
              } catch (e) {
                console.error("打印失败:", e);
              }
            }, 500);
          };

          // 设置超时处理
          setTimeout(function () {
            if (!printWindow.closed) {
              console.log("提示用户手动打印");
              printWindow.focus();
            }
          }, 3000);
        } else {
          // 新窗口被阻止，尝试其他方法
          console.warn("新窗口被阻止，尝试iframe方式");
          this.tryPrintWithIframe(pdfUrl);
        }
      } catch (error) {
        console.error("新窗口打印失败:", error);
        this.tryPrintWithIframe(pdfUrl);
      }
    },
    // 使用iframe方式打印（备选方案）
    tryPrintWithIframe(pdfUrl) {
      console.log("使用iframe方式打印");

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      iframe.src = pdfUrl;

      document.body.appendChild(iframe);

      iframe.onload = function () {
        console.log("iframe加载完成");
        try {
          iframe.contentWindow.print();
          console.log("iframe打印触发成功");

          setTimeout(function () {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(pdfUrl);
          }, 2000);
        } catch (error) {
          console.error("iframe打印失败:", error);
          document.body.removeChild(iframe);
          URL.revokeObjectURL(pdfUrl);
          alert("打印功能不可用，请打开下载的PDF文件手动打印");
        }
      };

      // 超时处理
      setTimeout(function () {
        if (document.body.contains(iframe)) {
          console.warn("iframe加载超时");
          document.body.removeChild(iframe);
          URL.revokeObjectURL(pdfUrl);
        }
      }, 10000);
    },
    // 获取图片Url
    async getImagesList(ids) {
      for (const imgId of ids) {
        try {
          let localUrl = await this.getImageUrl(imgId);
          if (localUrl) {
            // this.imgObj[imgId] = localUrl;
            this.$set(this.imgObj, imgId, localUrl);
          }
        } catch (error) {
          console.error("加载签名图片失败:", imgId, error);
        }
      }
    },
    async getImageUrl(id) {
      const file = await getOuterFile(id);
      const localUrl = URL.createObjectURL(file);
      console.log("获取图片Url", localUrl);
      return localUrl;
    },
    getplaceholder(item) {
      let placeholder = "";
      let properties = item.properties || [];
      properties.forEach((property) => {
        if (property.key == "placeholder") {
          placeholder = property.value;
        }
      });
      return placeholder;
    },
  },
};
</script>

<style></style>
