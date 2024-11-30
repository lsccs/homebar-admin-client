<template>
  <Detail title="配方" :api="api.detail" :columns="columns" />
</template>

<script setup>
import Detail from '@/components/detail/index.vue'
import api from '../api'
import EditTable from '@/components/editTable/index.vue'

import formulaColumns from '../formulaColumns.js'



const columns = [
  {
    label: '配方名称',
    key: 'name',
    span: 24
  },
  {
    label: '描述',
    key: 'remark',
    span: 24
  },
  {
    label: '原料',
    key: 'raw',
    span: 24,
    render(row) {
      return h(EditTable, {
        readonly: true,
        value: row.formula_raw_materials,
        columns: formulaColumns
      })
    }
  },
]
</script>
