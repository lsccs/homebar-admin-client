<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建配方
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="配方名称" :label-width="80">
        <n-input
          v-model:value="queryItems._like_name"
          type="text"
          placeholder="请输入配方名称"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="原料" :label-width="80">
        <n-input
          v-model:value="queryItems[`formula_raw_material.raw_material._like_name`]"
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
          label="配方名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入配方名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item label="原料" path="formula_raw_materials" :rule="{
          type: 'array',
            required: true,
            message: '请选择原料',
            trigger: ['input', 'blur'],
          }">


          <EditTable v-model:value="modalForm.formula_raw_materials" :columns="formulaColumns" :defaultRow="defaultRow" />
        </n-form-item>

        <n-form-item
          label="描述"
          path="remark"
        >
          <n-input type="textarea" v-model:value="modalForm.remark" />
        </n-form-item>

      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import EditTable from '@/components/editTable/index.vue'
import { useCrud } from '@/composables'
import { NButton } from 'naive-ui'
import api from './api'
import rawApi from '../raw_material/api'
import {getDictMap, getDictOptions} from "@/store/helper.js";
import {router} from "@/router/index.js";
import formulaColumns from './formulaColumns.js'

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
  handleView
} = useCrud({
  name: '配方',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  doDetail: api.detail,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  { title: '配方名称', key: 'name', width: 100, ellipsis: { tooltip: true } },
  {
    title: '原料',
    key: 'formula_raw_materials',
    width: 150,
    render(row) {
      const value = row.formula_raw_materials.map(item => `${item.raw_material.name}(${item.number}/${getDictMap('unit', item.unit)})`) || [];

      return h("span", value.join('；'))
    }
  },
  { title: '描述', key: 'remark', width: 150, ellipsis: { tooltip: true }},
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
            onClick: () => router.push("/formula/detail?id=" + row.id),
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

const unitOptions = getDictOptions('unit')

const defaultRow = { unit: unitOptions[0].value };
</script>
