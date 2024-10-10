<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建原料
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="原料名称" :label-width="80">
        <n-input
          v-model:value="queryItems._like_name"
          type="text"
          placeholder="请输入原料名称"
          clearable
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="right"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="原料名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入原料名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="单价"
          path="amount"
          :rule="{
            type: 'number',
            required: true,
            message: '请输入单价',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input-number v-model:value="modalForm.amount" :precision="4" />
        </n-form-item>

        <n-form-item
          label="库存"
          path="number"
          :rule="{
            type: 'array',
            required: true,
            message: '请输入库存',
            trigger: ['input', 'blur'],
          }"
        >
          <InputSelect
            type="number"
            v-model:value="modalForm.number"
            v-options="'unit'"
          />
        </n-form-item>

        <n-form-item
          label="最低库存"
          path="min_number"
        >
          <InputSelect
            type="number"
            v-model:value="modalForm.min_number"
            v-options="'unit'"
            :max="modalForm.number?.[0]"
          />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import InputSelect from '@/components/inputSelect/index.vue'
import { useCrud } from '@/composables'
import { NButton } from 'naive-ui'
import api from './api'
import { getDictMap } from '@/store/helper'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleEdit,
} = useCrud({
  name: '店铺',
  initForm: {},
  doCreate: data => submitFilter(data, api.create),
  doDelete: api.delete,
  doUpdate: data => submitFilter(data, api.update),
  doDetail,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  { title: '原料名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '单价', key: 'amount', width: 100 },
  { title: '库存', key: 'number', width: 100, render(row) {
    return h('span', `${row.number}/${getDictMap('unit', row.unit)}`)
  } },
  { title: '最低库存', key: 'min_number', width: 100, render(row) {
    return h('span', `${row.min_number || 0}/${getDictMap('unit', row.unit)}`)
  } },

  {
    title: '创建时间',
    key: 'create_time',
    width: 180,
  },

  {
    title: '操作',
    key: 'actions',
    width: 80,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
          },
          {
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete([row.id]),
          },
          {
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]

function submitFilter(data, api) {
  const [min_number = 0, min_unit] = data.min_number || []
  data.min_number = min_number
  data.min_unit = min_unit

  const [number = 0, unit] = data.number || []
  data.number = number
  data.unit = unit
  return api(data)
}

function doDetail(data) {
  return api.detail(data).then((res) => {
    const data = res.data
    data.min_number = [data.min_number, data.min_unit]
    data.number = [data.number, data.unit]
    return res
  })
}
</script>
