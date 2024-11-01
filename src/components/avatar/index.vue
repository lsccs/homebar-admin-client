<template>
  <div class="avatar">
    <n-avatar round :size="size" :src="currentFile.url" />

    <div v-if="isEdit" class="upload-action" @click="handleUpload">
      <i class="edit-icon i-fe:edit text-18" />

      <FileSelector style="display: none" ref="fileRef" :multiple="false" :value="value" @update:file="onChange" />
    </div>
  </div>
</template>


<script setup>
import API from "@/api/file.js";
import FileSelector from "@/components/fileSelector/index.vue";

const emit = defineEmits(['change'])
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 100
  }
})

const fileRef = ref()
const isFetch = ref(true)
const currentFile = ref({})

watch(() => props.value, init)

onMounted(init)

function init() {
  if (!isFetch.value) {
    isFetch.value = true
    return;
  }
  API.fetchList({ page:1, filters: { id: props.value } }).then(res => {
    const fileList = res.data.list
    if (fileList.length) {
      currentFile.value = fileList[0]
    }
  })
}

function onChange(file) {
  isFetch.value = false
  currentFile.value = file
  emit('change', file.id)
}

function handleUpload() {
  fileRef.value.open([currentFile.value])
}
</script>
<style lang="scss">
.avatar {
  position: relative;
  display: flex;
  align-items: center;

  &:hover {
    .upload-action {
      display: block;
    }
  }

  .upload-action {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .6);
    animation: ani-show 0.3s;
    cursor: pointer;

    .edit-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }
  }


  @keyframes ani-show {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
