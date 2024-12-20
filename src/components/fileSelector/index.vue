<template>
  <div>
    <n-upload
      :file-list="fileList"
      list-type="image"
      show-download-button
      @remove="handleRemove"
    >
      <n-button @click="handleOpen">上传文件</n-button>
    </n-upload>

    <MeModal
      class="file-selector"
      ref="modalRef"
      title="选择文件"
      width="80%"
    >
      <div>
        <div class="file-lib-container" :style="{height}">
          <FileLib ref="fileLib" :multiple="multiple" select />
        </div>
      </div>
    </MeModal>
  </div>

</template>

<script>
import FileLib from "@/components/fileLib/index.vue";
import API from '@/api/file.js'
import { MeModal } from "@/components/me/index.js";
export default {
  components: {
    FileLib,
    MeModal
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Number, Array],
      default: 0
    },
    isWatch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      height: 0,
      // 文件列表
      fileList: [],
      // 是否根据id请求文件列表回显
      isFetch: true,
      originFileList: [],
    }
  },
  watch: {
    value() {
      if (!this.isWatch) {
        return;
      }
      if (!this.isFetch) {
        this.isFetch = true
        return;
      }
      this.getFileList(this.multiple ? this.value : [this.value]).then(data => {
        this.transferFileList(data);
      })
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
    open(fileList) {
      this.$refs.modalRef.open({
        onOk: this.onSubmit
      })
      this.$nextTick(() => {
        this.$refs.fileLib.setSelectRows(fileList || this.originFileList)
      })
    },
    onSubmit() {
      const rows = this.$refs.fileLib.getSelectRows()
      if (!rows || !rows.length) {
        $message.warning('请选择文件');
        throw ''
      }
      this.transferFileList(rows);
      this.$refs.modalRef.close()
      this.isFetch = false
      this.updateValue();
    },

    transferFileList(rows) {
      this.originFileList = rows;
      this.fileList = rows?.map(item => ({ id: item.id, name: item.file_name, type: item.type, url: item.url, thumbnailUrl: item.url, status: 'finished' })) || [];
    },

    handleRemove({ index }) {
      this.fileList.splice(index, 1)
      this.updateValue();
    },

    updateValue() {
      const ids = this.fileList.map(item => item.id);
      this.$emit('update:value', this.multiple ? ids : ids[0])
      this.$emit('update:file', this.multiple ? this.fileList : this.fileList[0])
    },
    handleOpen(e) {
      e.stopPropagation();
      this.open();
    },
    getFileList(ids) {
      return API.fetchList({ page:1, filters: { _in_id: ids } }).then(res => {
        return res.data.list
      })
    }
  }
}
</script>
<style lang="scss">
.file-selector {

  .file-lib-container {
    margin-bottom: 10px;
    .file-container {
      padding-top: 0;
      padding-bottom: 0;
    }

  }

  .n-card__content {
    padding: 0;
  }
}
</style>
