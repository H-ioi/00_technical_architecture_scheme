<template>
  <div>
    <!-- 新增记录输入框 -->
    <div class="inputBox">
      <el-form-item label="跟进人" prop="userId" :style="formitem">
        <el-select
          filterable
          :style="`width:100%`"
          v-model="ruleForm.userId"
          placeholder="请选择"
          :disabled="islooklog"
        >
          <el-option
            v-for="(item, index) in userdata"
            :key="index"
            :label="item.deptName + '-' + item.username"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :style="formitem" label="跟进时间" prop="time">
        <el-date-picker
          :disabled="islooklog"
          :style="`width:100%`"
          v-model="ruleForm.time"
          type="datetime"
          placeholder="选择日期时间"
          :value-format="'yyyy-MM-dd HH:mm:ss'"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="跟进类型" prop="followType" :style="formitem">
        <el-select
          :disabled="islooklog"
          filterable
          :style="`width:100%`"
          v-model="ruleForm.followType"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :key="index"
            v-for="(item, index) in selectiondata['follow_type']"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="$route.path.indexOf('contacter') !== -1 ? false : true"
        label="关联联系人"
        prop="contacter"
        :style="formitem"
      >
        <el-select
          :disabled="islooklog"
          filterable
          multiple
          :style="`width:100%`"
          v-model="ruleForm.contacter"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in contacters"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="$route.path.indexOf('opportunity') !== -1"
        label="商机阶段"
        prop="stage"
        :style="formitem"
      >
        <el-select
          :disabled="islooklog"
          filterable
          :style="`width:100%`"
          v-model="ruleForm.stage"
          placeholder="请选择"
        >
          <el-option
            :disabled="Number(item.value) < stage"
            :label="item.label"
            :value="String(item.value)"
            :key="index"
            v-for="(item, index) in opportunitystageall"
          ></el-option>
        </el-select>
      </el-form-item>
    </div>
    <commonTextEare
      :ruleForm="ruleForm"
      :Texteare="cotactTexteare[0]"
      :isedit="!islooklog"
    />
    <el-form-item
      label="附件信息"
      v-if="(islooklog && filelistobj.length !== 0) || !islooklog"
    >
      <div class="filebox df_aw">
        <div
          class="fileboxitem"
          v-for="(item, index) in filelistobj"
          :key="index"
        >
          <div class="playfilebox">
            <i
              v-if="!islooklog"
              class="el-icon-delete"
              @click="deletefiles(item, index)"
            ></i>
            <i
              v-else
              class="el-icon-download"
              @click="downloadFile(item.id, item.name)"
            ></i>
          </div>
          <img
            width="70px"
            :src="`/menu_icon/fileimg/${item.type}.png`"
            alt=""
          />
          <span class="tips">{{ item.name }}</span>
        </div>
        <el-upload
          v-if="!islooklog"
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { download } from "@/util/download";
import { uploadFile, downloadFile, deleteFiles } from "@/api/upload/index.js";
import { fetchList } from "@/api/admin/user";
import { fetchTeamList } from "@/api/team/index.js";
import { fetchTypeList } from "@/api/base/index";
import commonInput from "@/components/commonConpents/commonFrom/AnyInput";
import commonTextEare from "@/components/commonConpents/commonFrom/Texteare";
export default {
  name: "UniUiClueform",
  props: {
    // ruleForm: Object,
    isedit: Boolean,
    contacters: Array,
    opportunitystageall: Array,
    ruleForm: Object,
    stage: Number,
    islooklog: Boolean,
  },
  data() {
    return {
      formitem: "width:50%;padding-right:20px",
      filelistobj: [],
      filelist: [],
      listQuery: {
        name: undefined,
      },
      // inputwidth: "50%",
      props: {
        multiple: true,
        value: "id",
        label: "name",
        children: "children",
      },
      userdata: [],
      teamdata: [],
      selectiondata: {},
      cotactTexteare: [
        {
          label: "跟进详情",
          prop: "description",
          placeholder: "请输入跟进详情",
        },
      ],
    };
  },
  created() {
    this.getuserList();
    this.fetchTeamList();
    this.fetchtypelist("opportunity_stage");
    this.fetchtypelist("follow_type");
  },
  mounted() {},

  methods: {
    fetchtypelist(type) {
      fetchTypeList(type).then((res) => {
        // this.selectiondata[type] = res.data.data;
        let data = res.data.data;
        let arr = [];
        data.map((item) => {
          if (!item.archived && item.status) {
            let obj = {
              label: item.label,
              value: item.value,
            };
            arr.push(obj);
          }
        });
        this.selectiondata[type] = arr;
      });
    },
    fetchTeamList() {
      fetchTeamList({ current: 1, size: 10000 }).then((res) => {
        this.teamdata = res.data.data.records;
      });
    },

    getuserList() {
      fetchList({ current: 1, size: 10000 }).then((res) => {
        this.userdata = res.data.data.records;
      });
    },
    uploadfile(data, name) {
      uploadFile(data).then((res) => {
        this.$message.success("上传成功");
        this.filelist.push(res.data.data);
        this.setfilename(name, res.data.data);
      });
    },
    downloadFile(id, name) {
      downloadFile(id).then((res) => {
        this.$message.success("下载成功");
        download(res.data, name);
      });
    },
    deletefiles(item, index) {
      console.log(999, item, index);
      deleteFiles({ ids: [item.id] }).then((res) => {
        // this.$message.success("删除成功");
        this.delfile(item, index);
      });
    },

    setfilename(name, id) {
      let arr = name.split(".");
      let obj = {
        name,
        type: arr[1],
        id,
      };
      this.filelistobj.push(obj);
      console.log(" this.filelistobj", this.filelistobj);
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const name = file.name;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
      let obj = new FormData();
      obj.append("file", file);
      obj.append("scene", "follow_record_attachment");
      this.uploadfile(obj, name);
    },
    delfile(item, index) {
      this.filelistobj.splice(index, 1);
      this.filelist.splice(index, 1);
    },
  },
  components: {
    commonInput,
    commonTextEare,
  },
};
</script>

<style lang="scss" scoped>
.fileboxitem {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-bottom: 20px;
  // border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  &:hover {
    .playfilebox {
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  span {
    font-size: 14px;
    font-weight: 600;
    color: #2c88f5;
    padding: 5px;
  }
  .playfilebox {
    display: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #cccccc;
    color: #fff;
    font-size: 18px;
    opacity: 0.8;
  }
}
/deep/.avatar-uploader-icon {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
/deep/.avatar-uploader {
  margin-right: 20px;
  margin-bottom: 20px;
}
.inputBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/deep/.el-input__inner {
  border: 1px solid #dcdfe6;
}
</style>