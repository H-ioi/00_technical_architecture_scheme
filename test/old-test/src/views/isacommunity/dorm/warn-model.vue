<template>
  <el-dialog
    :title="dialogTitle || $t('dorm.确认删除')"
    :visible.sync="visible"
    width="400px"
    custom-class="delete-confirm-dialog"
    :show-close="true"
    center
    @close="handleClose"
  >
    <div class="delete-dialog-content">
      <div class="warning-icon">
        <img src="/img/isacommunity/warn.png" />
      </div>
      <div class="warning-title">{{ warningTitle }}</div>
      <div class="warning-text" v-if="warningText">{{ warningText }}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ cancelText || $t('btn.取消') }}</el-button>
      <el-button type="danger" @click="handleConfirm">{{ confirmText || $t('btn.删除') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'WarnModel',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    warningTitle: {
      type: String,
      required: true
    },
    warningText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: ''
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.$emit('cancel');
    },
    handleConfirm() {
      this.$emit('confirm');
    }
  }
};
</script>

<style scoped lang="scss">
.delete-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.warning-icon img {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}
.warning-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}
.warning-text {
  font-size: 14px;
  color: #606266;
}


::v-deep .delete-confirm-dialog {
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  
  .el-dialog__header {
    border-bottom: 0px solid #F2F6FC !important;
    .el-dialog__headerbtn {
      top: 15px;
      right: 15px;
    }
    .el-dialog__title{
      color: #303133;
      font-size: 22px;
      font-weight: 500;
    }
  }
  
  .el-dialog__body {
    padding: 30px 20px 10px;
  }
  
  .delete-dialog-content {
    text-align: center;
    
    .warning-icon {
      font-size: 48px;
      color: #F56C6C;
      margin-bottom: 15px;
    }
    
    .warning-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 10px;
    }
    
    .warning-text {
      font-size: 14px;
      color: #909399;
    }
  }

  
  .el-dialog__footer {
    padding-bottom: 30px;
    
    .el-button {
      min-width: 90px;
      border-radius: 4px;
      
      &--default {
        background-color: #FFFFFF !important;
        border-color: #DCDFE6 !important;
        color: #000000 !important;
        
        &:hover {
          color: #BA8E62 !important;
          border-color: #BA8E62 !important;
          background-color: #fcf6f1 !important; 
        }
      }
      
      &--danger {
        background-color: #FF0000 !important;
        border-color: #F56C6C !important; 
        color: #FFFFFF !important;
        
        &:hover {
          background-color: #f78989 !important;
          border-color: #f78989 !important;
          color: #FFFFFF !important;
        }
      }
    }
  }
}
</style>