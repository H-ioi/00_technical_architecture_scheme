<template>
  <el-dialog
    title="详情"
    :visible.sync="isshow"
    width="30%"
    :before-close="Close"
  >
    <div>{{ "标题：" + data.title }}</div>
    <div>{{ "创建人：" + data.createUser }}</div>
    <div>{{ "创建时间：" + data.createTime }}</div>
    <div class="fileBox" v-if="messageItemType !== 4">
      <FileList ref="scene_message" :scene="scene_message" :isDisabled="true" />
    </div>
  </el-dialog>
</template>

<script>
import FileList from "@/components/conpents_card/FileList";
export default {
  name: "UniUiDel",
  props: {
    isshow: Boolean,
    data: Object,
  },
  data() {
    return {
      scene_message: "message_attachment",
      messageItemType: Number,
    };
  },

  mounted() {},

  methods: {
    Close() {
      this.$emit("Close", false);
      this.$refs["scene_message"].clearData();
    },
    getfilelist(id) {
      this.$refs["scene_message"].getFileList({
        scene: this.scene_message,
        outerId: id,
      });
    },
  },
  components: {
    FileList,
  },
};
</script>

<style lang="scss" scoped>
.fileBox {
  margin-top: 30px;
}
</style>