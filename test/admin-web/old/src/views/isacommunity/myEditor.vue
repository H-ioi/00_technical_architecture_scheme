<template>
    <div style="border: 1px solid #ccc;">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
        />
        <Editor
            style="height: 500px; overflow-y: hidden;"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            @onChange="onChange"
             @customPaste="handlePaste"
        />
    </div>
</template>
<script>
  import Vue from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

  export default Vue.extend({
    components: { Editor, Toolbar },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        editor: null,
        html: this.value || '<p></p>',
        toolbarConfig: {},
        editorConfig: {
          placeholder: '',
          MENU_CONF: {
            uploadImage: {
              base64LimitSize: 500000 * 1024 // 设置一个非常大的值 插入 base64
            }
          }
        },
        mode: 'default', // or 'simple'
        urlReg: /(https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/g
      }
    },
 watch: {
  value: {
    handler(newVal) {
      if (newVal !== this.html) {
        this.$nextTick(() => {
          // 如果是新增（newVal为空），直接赋值为<p></p>
          const htmlContent = newVal === '' ? '<p></p>' : (newVal || '')
          // 如果编辑器已创建，也更新编辑器内容
          if (this.editor) {
            this.editor.setHtml(htmlContent)
          }
        })
      }
    },
    immediate: true
  }
},
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        // 聚焦到编辑器
        this.editor.focus()
      },

      initEditor() {
        // 聚焦到编辑器
        this.editor.focus()
        this.editor.setHtml('<p></p>')
      },

     handlePaste(editor, event, callback) {
        let pasteText = event.clipboardData.getData('text/plain'); // 获取粘贴的纯文本
        let flag1 = pasteText.indexOf('<img') < 0;
        let flag2 = pasteText.indexOf('href') < 0;
        if (this.urlReg.test(pasteText) && flag1 && flag2) {
          let textArray = this.urlReg.exec(pasteText);

          let insertUrl = '';
          if (textArray) {
            insertUrl = textArray[0];
          }

          editor.dangerouslyInsertHtml(pasteText);

          // 返回 false ，阻止默认粘贴行为
          event.preventDefault();
          callback(false); // 返回值（注意，vue 事件的返回值，不能用 return）
        } else {
          callback(true);
        }
      },


      onChange(editor) {
        const html = editor.getHtml()
        this.$emit('input', html)
      }
    },
    mounted() {
     
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
    },
  })
</script>