<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新店铺
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="店铺名称" :label-width="80">
        <n-input
          v-model:value="queryItems._like_name"
          type="text"
          placeholder="请输入店铺名称"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="状态" :label-width="80">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="店铺名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入店铺名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="店铺封面"
          path="cover"
          :rule="{
            required: true,
            message: '请输入店铺封面',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.cover" />
        </n-form-item>
        <n-form-item
          label="店铺地址"
          path="address"
          :rule="{
            required: true,
            message: '请输入店铺地址',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.address" type="textarea" />
        </n-form-item>
        <n-form-item
          label="经度"
          path="la"
          :rule="{
            type: 'number',
            required: true,
            message: '请输入经度',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input-number v-model:value="modalForm.la" :precision="4" />
        </n-form-item>
        <n-form-item
          label="纬度"
          path="lo"
          :rule="{
            type: 'number',
            required: true,
            message: '请输入纬度',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input-number v-model:value="modalForm.lo" :precision="4" />
        </n-form-item>
        <n-form-item label="用户" path="user_ids">
          <n-select
            v-model:value="modalForm.user_ids"
            :options="userList"
            label-field="nickname"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>

        <n-form-item v-if="modalAction === 'add'" label="状态" path="enable">
          <NSwitch v-model:value="modalForm.enable" :checked-value="1" :unchecked-value="0">
            <template #checked>
              启用
            </template>
            <template #unchecked>
              停用
            </template>
          </NSwitch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import { NAvatar, NButton, NSwitch } from 'naive-ui'
import userApi from '../pms/user/api'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const userList = ref([])

userApi.read({ page: 1, filters: { enable: 1 } }).then(({ data }) => {
  userList.value = data.list.map((item) => {
    item.nickname = item.profile?.nick_name || item.username
    return item
  })
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
  initForm: { enable: 1 },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doDetail: api.detail,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  { title: '店铺名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  {
    title: '店铺封面',
    key: 'cover',
    width: 80,
    render: ({ cover }) =>
      h(NAvatar, {
        size: 'medium',
        src: cover,
      }),
  },
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
</script>
