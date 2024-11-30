<template>
  <Detail title="活动" :api="api.detail" :columns="columns" />
</template>

<script setup>
import Detail from '@/components/detail/index.vue'
import api from '../api'
import { getDictMap } from '@/store/helper';
import { render } from 'vue';

const columns = [
  {
    label: '封面',
    key: 'cover',
    span: 8
  },
  {
    label: '活动名称',
    key: 'name',
    span: 8
  },
  {
    label: '状态',
    key: 'enable',
    span: 8,
    valueRender(row) {
      return getDictMap('status', row.enable)
    }
  },
 
  {
    label: '开始时间',
    key: 'start_time',
  },
  {
    label: '结束时间',
    key: 'end_time',
  },

  {
    label: '内容',
    key: 'content',
    span: 24,
    render(row) {
      return h('span', {
        class: 'mce-content-body',
        innerHTML: row.content
      })
    }
  },
]

</script>
