<template>
  <n-upload
    :custom-request="customRequest"
  >
    <n-button>上传文件</n-button>
  </n-upload>
</template>

<script setup>
import { useMessage } from 'naive-ui'


const message = useMessage()
const customRequest = (params) => {
  const formData = new FormData()
  console.log(params, 'paramsparams')
}

</script>
