<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        商品分类
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="分类名称" :label-width="80">
        <n-input
          v-model:value="queryItems._like_name"
          type="text"
          placeholder="请输入分类名称"
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
          label="分类名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入分类名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="免费次数"
          path="limit_number"
          :rule="{
            type: 'number',
            required: true,
            message: '请输入免费次数',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input-number :min="0"v-model:value="modalForm.limit_number" />
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
  name: '商品分类',
  initForm: { limit_number: 0 },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doDetail: api.detail,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  { title: '分类名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '免费次数', key: 'limit_number', width: 100 },

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

</script>
