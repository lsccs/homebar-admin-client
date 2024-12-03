<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleToAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建活动
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="活动名称" :label-width="80">
        <n-input
          v-model:value="queryItems._like_name"
          type="text"
          placeholder="活动名称"
          clearable
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef">
      
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import Editor from '@/components/editor/index.vue'
import { useCrud } from '@/composables'
import { NButton, NSwitch } from 'naive-ui'
import api from './api'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  handleView
} = useCrud({
  name: '活动',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doDetail: api.detail,
  refresh: () => $table.value?.handleSearch(),
})

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.updateEnable({ id: row.id, enable: row.enable === 1 ? 0 : 1 })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  }
  catch (error) {
    console.error(error)
    row.enableLoading = false
  }
}

function handleToAdd() {
  router.push('/activity/add')
}

function handleToUpdate(id) {
  router.push('/activity/update/?id=' + id)
}


const columns = [
  { title: '活动名称', key: 'name', width: 100, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'enable',
    width: 120,
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          checkedValue: 1,
          unCheckedValue: 0,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '启用',
          unchecked: () => '停用',
        },
      ),
  },
  {
    title: '创建时间',
    key: 'create_time',
    width: 180,
  },

  {
    title: '操作',
    key: 'actions',
    width: 100,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => router.push("/activity/detail?id=" + row.id),
          },
          {
            icon: () => h('i', { class: 'i-material-symbols:info text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            style: 'margin-left: 12px;',
            type: 'primary',
            onClick: () => handleToUpdate(row.id),
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
