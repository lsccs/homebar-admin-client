<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建商品
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="商品名称" :label-width="80">
        <n-input
          v-model:value="queryItems._like_name"
          type="text"
          placeholder="请输入商品名称"
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
      >
        <n-form-item
          label="商品名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入商品名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />

        </n-form-item>

        <n-form-item
          label="封面"
          path="cover"
          :rule="{
            required: true,
            message: '请输入封面',
            trigger: ['input', 'blur'],
          }"
        >
          <Upload />
<!--          <n-input v-model:value="modalForm.cover" />-->
        </n-form-item>
        <n-form-item
          label="商品分类"
          path="type_id"
          :rule="{
            required: true,
            message: '请选择商品分类',
            trigger: ['input', 'blur'],
          }"
        >
          <Select
            v-model:value="modalForm.type_id"
            :load-api="typeApi.read"
          />
        </n-form-item>
        <n-form-item
          label="配方"
          path="formula_id"
          :rule="{
            required: true,
            message: '请选择配方',
            trigger: ['input', 'blur'],
          }"
        >
          <Select
            v-model:value="modalForm.formula_id"
            :load-api="formulaApi.read"
          />
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
          label="免费次数"
          path="limit_number"
        >
          <n-input-number v-model:value="modalForm.limit_number" :precision="4" />
        </n-form-item>
        <n-form-item
          label="积分比例"
          path="proportion"
        >
          <n-input-number v-model:value="modalForm.proportion" :precision="2" />
        </n-form-item>

        <n-form-item
          label="备注"
          path="remark"
        >
          <n-input type="textarea" v-model:value="modalForm.remark" />
        </n-form-item>

        <n-form-item label="状态" path="enable">
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
import {NButton, NSwitch} from 'naive-ui'
import api from './api'
import Select from "@/components/select/index.vue";
import typeApi from '../product_type/api'
import formulaApi from '../formula/api'
import Upload from '@/components/upload/index.vue'

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
  name: '商品',
  initForm: { limit_number: 0, proportion: 0 },
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
