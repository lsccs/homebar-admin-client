<template>
  <div class="detail-container">
    <n-card size="small">
      <n-descriptions label-placement="top" :title="title" size="small" :column="3">
        <n-descriptions-item v-for="item in columns" :key="item.key" :span="item.span">
          <template #label>
            {{ item.label }}
          </template>
          <component v-if="item.render && data" :is="item.render(data)"></component>
          <div v-else class="desc-item">
            <span v-if="data">{{ data[item.key] || '-' }}</span>
            <span v-else>-</span>
          </div>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>
<script setup>

import {useRoute} from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  api: {
    type: Function,
    default: null,
  },
  columns: {
    type: Array,
    default: () => []
  }
})

const data = ref()


const route = useRoute()

onMounted(init)

function init() {
  if (props.api && route.query.id) {
    props.api(route.query.id).then(res => {
      data.value = res.data;
    })
  }
}
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 15px;

  .desc-item {
    background: #f5f6f7;
    border-radius: 4px;
    padding: 0 0 0 12px;
    line-height: 32px;
    color: #bababb;
  }


  :deep(.n-descriptions-table) {

    border-spacing: 10px;
  }
}
</style>
