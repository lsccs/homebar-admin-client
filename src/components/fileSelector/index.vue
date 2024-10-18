<template>
  <n-modal
    class="file-selector"
    title="选择文件"
    v-model:show="dialogVisible"
    size="huge"
    :bordered="false"
  >
    <div class="file-lib-container" :style="{height}">
      <FileLib ref="fileLib" :multiple="multiple" select />
    </div>
    <div class="modal-action">
      <n-button size="small" @click="dialogVisible = false">取 消</n-button>
      <n-button size="small" type="primary" @click="onSubmit">确 定</n-button>
    </div>
  </n-modal>
</template>

<script>
import FileLib from "@/components/file-lib";
export default {
  components: {
    FileLib,
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      height: 0
    }
  },
  mounted() {
    this.height = document.body.clientHeight * 0.8 + 'px'
    const dialog = document.querySelector('.file-selector .el-dialog')
    if (dialog) {
      // 剩余高度的一半 - 40
      dialog.style.marginTop = document.body.clientHeight * 0.2 / 2 - 40 + 'px'
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    onSubmit() {
      const rows = this.$refs.fileLib.getSelectRows()
      if (!rows || !rows.length) {
        return this.$message({
          type: "warning",
          message: "请选择文件"
        })
      }
      this.$emit('submit', this.multiple ? rows : rows[0])
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
.file-selector {
  .el-dialog__header {
    padding: 10px 20px;
    line-height: 15px;

    .el-dialog__title {
      font-size: 15px;
    }
    .el-dialog__headerbtn {
      top: 15px;
    }
  }

  .el-dialog__body {
    padding: 0;
    display: flex;
    flex-direction: column;

    .file-lib-container {

      .file-container {
        padding-top: 0;
      }
    }
  }

  .modal-action {
    padding: 0 20px 10px 20px;
    display: flex;
    justify-content: flex-end;

  }
}
</style>
