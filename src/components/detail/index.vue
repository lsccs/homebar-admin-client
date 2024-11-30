<template>
  <DefaultLayout ref="defaultLayoutRef" class="detail-layout-card">

    <div class="detail-container">
      <div class="detail-form-item" v-for="item in columns" :key="item.key" :style="{ flex: getFlex(item) }">
        <div class="label">{{ item.label }}</div>
        <component v-if="item.render && data" :is="item.render(data)"></component>
        <div v-else class="desc-item">
          <component v-if="item.valueRender && data" :is="h('span', item.valueRender(data))"></component>
          <span v-else-if="data">{{ data[item.key] || '-' }}</span>
          <span v-else>-</span>
        </div>
      </div>
    </div>

    <!-- <n-descriptions label-placement="top" :title="title" size="small" :column="3">
      <n-descriptions-item v-for="item in columns" :key="item.key" :span="item.span">
        <template #label>
          {{ item.label }}
        </template>
        
      </n-descriptions-item>
    </n-descriptions> -->
  </DefaultLayout>
</template>
<script setup>
import DefaultLayout from '@/components/layout/default.vue'
import { h, ref } from 'vue';
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
const defaultLayoutRef = ref()


const route = useRoute()

onMounted(init)

function init() {
  if (props.api && route.query.id) {
    props.api(route.query.id).then(res => {
      data.value = res.data;
      defaultLayoutRef.value.setLoading(false)
    })
  }
}
function getFlex(row) {
  const span = row.span || 12;

  return  '1 0 ' + (span / 24 * 100) + '%';
}
</script>
<style lang="scss" scoped>

.detail-layout-card {
  :deep(.n-card__content) {
    padding-right: 0;
  }
}
.detail-container {
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;

  .detail-form-item {
    padding-right: 12px;

    .desc-item {
      background: #f5f6f7;
      border-radius: 4px;
      padding: 0 0 0 12px;
      line-height: 32px;
      color: #bababb;
    }

  }
}

</style>
