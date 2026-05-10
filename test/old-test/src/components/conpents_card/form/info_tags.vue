<template>
  <div>
    <div class="df_sb">
      <div class="title_text">我的标签</div>
      <!-- <el-button
        v-if="isDisabled"
        class="btn_small button"
        type="primary"
        style="margin-bottom: 10px"
        @click="addtags"
      >
        新增
      </el-button> -->
    </div>
    <div class="tagsbox">
      <span class="text">已选标签：</span>
      <div class="tags">
        <el-tag
          effect="plain"
          v-for="(item, index) in selectionTags"
          :key="index"
        >
          {{ item.tag }}
          <i
            v-if="isDisabled"
            class="el-icon-close close"
            @click.stop="delTagsList(index, item)"
          ></i>
        </el-tag>
      </div>
    </div>
    <div class="tagsbox" v-if="isDisabled">
      <span class="text">全部标签：</span>
      <div class="tags" v-if="tagsList.length !== 0">
        <div v-for="(item, index) in tagsList" :key="index">
          <el-tag
            style="cursor: pointer"
            v-if="!item['edit']"
            effect="plain"
            @click="selectionTages(index, item)"
          >
            {{ item.tag }}
            <i
              class="el-icon-edit editicon"
              @click.stop="editTagsItem(item, index, true)"
            ></i>
            <i
              class="el-icon-close close"
              @click.stop="delTags(item.id, index)"
            ></i>
          </el-tag>
          <el-input
            v-else
            class="input-new-tag"
            v-model="item.tag"
            ref="editTagInput"
            size="small"
            @keyup.enter.native="changeTags(item, index)"
            @blur="editTagsItem(item, index, false)"
          >
          </el-input>
        </div>
      </div>
      <div>
        <el-input
          v-if="inputVisible"
          class="input-new-tag"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="inputVisible = !inputVisible"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ 新增标签</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTagList,
  addTags,
  editTags,
  delTags,
} from "@/api/card/cloud/cloundlist.js";
export default {
  name: "UniUiInfoTags",
  props: {
    isDisabled: Boolean,
  },
  data() {
    return {
      // 我的标签
      selectionTags: [],
      tagsList: [],
      tagsinput: [],
      tagsrform: {},
      inputVisible: false,
      inputValue: "",
      cardUserId: "",
    };
  },

  mounted() {},

  methods: {
    getTagList(data) {
      getTagList(data).then((res) => {
        console.log("res", res);
        this.tagsList = [];
        let data = res.data.data;
        let idsObj = this.getTagsId(this.selectionTags);
        console.log("idsObj", idsObj);
        data.map((item) => {
          if (!idsObj[item.id]) {
            this.tagsList.push(item);
          }
        });
      });
    },
    getTagsId(data) {
      let idsObj = {};
      data.map((item) => {
        idsObj[item.id] = item.id;
      });
      return idsObj;
    },
    getTagsIdList(data) {
      let idsArr = [];
      data.map((item) => {
        idsArr.push(item.id);
      });
      return idsArr;
    },
    addTags(data) {
      addTags(data).then((res) => {
        console.log("res", res);
        this.$message.success("新增标签成功");
        this.tagsList.push(res.data.data);
        // this.inputVisible = false;
        this.$nextTick((_) => {
          this.inputValue = "";
          this.$refs.saveTagInput.$refs.input.focus();
        });
      });
    },
    editTags(data, index) {
      editTags(data).then((res) => {
        console.log("res", res);
        // this.$message.success("修改标签成功");
        this.editTagsItem(data, index, false);
      });
    },
    delTags(id) {
      delTags(id).then((res) => {
        console.log("res", res);
        this.$message.success("已删除");
        this.tagsList.splice(index, 1);
      });
    },
    // 标签
    // selectionTags() {
    //   this.tagsinput.push(this.tagsinput.length + 1);
    // },
    canceltags(index, item) {
      this.tagsinput.splice(index, 1);
      delete this.tagsrform[item];
    },
    delTagsList(index, item) {
      console.log(111, index);
      this.selectionTags.splice(index, 1);
      this.tagsList.push(item);
    },
    selectionTages(index, item) {
      this.tagsList.splice(index, 1);
      this.selectionTags.push(item);
    },
    submitTagsForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(9999, this.tagsrform);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    changeTags(item, index) {
      console.log("item, index", item, index);
      this.editTags(item, index);
    },
    editTagsItem(item, index, type) {
      this.$set(this.tagsList, index, {
        ...this.tagsList[index],
        edit: type,
      });
    },

    // 切换新增标签按钮
    showInput() {
      this.inputVisible = true;
      this.inputValue = "";
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        let obj = {
          tag: inputValue,
          cardUserId: this.cardUserId,
        };
        this.addTags(obj);
      }
    },
    canceltagsform() {
      this.tagsinput = [];
      this.tagsrform = {};
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 20px;
}
/deep/.el-tag .el-icon-close {
  font-size: 16px;
  line-height: 18px;
}
/deep/.el-tag--small {
  height: 32px;
  padding: 0 15px;
  line-height: 22px;
  font-size: 14px;
}
.text {
  font-size: 16px;
  font-family: Source Han Sans CN-Normal, Source Han Sans CN;
  font-weight: 400;
  color: #333333;
}
.tagsbox {
  display: flex;
  margin-bottom: 20px;
  .tags {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-tag {
      margin-right: 10px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 10px;
  color: #175E67;
  border-color: #175E67;
}
.input-new-tag {
  width: 100px;
  margin-left: 10px;
  height: 32px;
  vertical-align: bottom;
  margin-bottom: 10px;
  /deep/.el-input__inner {
    height: 32px !important;
    line-height: 32px !important;
    font-size: 14px !important;
    color: #cdcdcd !important;
  }
}
.editicon {
  margin-left: 15px;
  border-radius: 50%;
  padding: 2px;
  &:hover {
    background: #175E67;
    color: #ffffff;
  }
}
.close {
  display: inline-block;
  margin-left: 5px;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 18px;
  &:hover {
    background: #175E67;
    color: #ffffff;
  }
}
/deep/.el-tag .el-icon-close {
  line-height: 25px;
}
</style>