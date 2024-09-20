<template>
  <CommonPage>
    <div class="flex">
      <n-spin size="small" :show="treeLoading">
        <MenuTree
          :current-menu="currentMenu"
          class="w-320 shrink-0"
          :tree-data="treeData"
          @update:current-menu="onSelectMenu"
          @refresh="initData"
        />
      </n-spin>

      <div class="ml-40 w-0 flex-1">
        <template v-if="currentMenu">
          <n-spin size="small" :show="detailLoading">
            <div class="flex justify-between">
              <h3 class="mb-12">
                {{ currentMenu.name }}
              </h3>
              <NButton size="small" type="primary" @click="handleEdit(currentMenu)">
                <i class="i-material-symbols:edit-outline mr-4 text-14" />
                编辑
              </NButton>
            </div>
            <n-descriptions label-placement="left" bordered :column="2">
              <n-descriptions-item label="编码">
                {{ currentMenu.code }}
              </n-descriptions-item>
              <n-descriptions-item label="名称">
                {{ currentMenu.name }}
              </n-descriptions-item>
              <n-descriptions-item label="路由地址">
                {{ currentMenu.path ?? '--' }}
              </n-descriptions-item>
              <n-descriptions-item label="组件路径">
                {{ currentMenu.component ?? '--' }}
              </n-descriptions-item>
              <n-descriptions-item label="菜单图标">
                <span v-if="currentMenu.icon" class="flex items-center">
                  <i :class="`${currentMenu.icon}?mask text-22 mr-8`" />
                  <span class="opacity-50">{{ currentMenu.icon }}</span>
                </span>
                <span v-else>无</span>
              </n-descriptions-item>
              <n-descriptions-item label="layout">
                {{ currentMenu.layout || '跟随系统' }}
              </n-descriptions-item>
              <n-descriptions-item label="是否显示">
                {{ currentMenu.can_show ? '是' : '否' }}
              </n-descriptions-item>
              <n-descriptions-item label="是否启用">
                {{ currentMenu.enable ? '是' : '否' }}
              </n-descriptions-item>
              <n-descriptions-item label="Keep_alive">
                {{ currentMenu.keep_alive ? '是' : '否' }}
              </n-descriptions-item>
              <n-descriptions-item label="排序">
                {{ currentMenu.sort_order ?? '--' }}
              </n-descriptions-item>
            </n-descriptions>

            <div class="mt-32 flex justify-between">
              <h3 class="mb-12">
                按钮
              </h3>
              <NButton size="small" type="primary" @click="handleAddBtn">
                <i class="i-fe:plus mr-4 text-14" />
                新增
              </NButton>
            </div>

            <MeCrud
              ref="$table"
              :columns="btnsColumns"
              :scroll-x="-1"
              :get-data="api.getButtons"
              :query-items="{ parent_id: currentMenu.id }"
            />
          </n-spin>
        </template>
        <n-empty v-else class="h-450 f-c-c" size="large" description="请选择菜单查看详情" />
      </div>
    </div>
    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="initData" />
  </CommonPage>
</template>

<script setup>
import { MeCrud } from '@/components'
import { NButton, NSwitch } from 'naive-ui'
import { nextTick } from 'vue'
import api from './api'
import MenuTree from './components/MenuTree.vue'
import ResAddOrEdit from './components/ResAddOrEdit.vue'

const treeData = ref([])
const treeLoading = ref(false)
const detailLoading = ref(false)
const $table = ref(null)
const currentMenu = ref(null)
async function initData() {
  treeLoading.value = true
  const res = await api.getMenuTree()
  treeData.value = res?.data || []
  treeLoading.value = false
  onSelectMenu(currentMenu.value)
}
initData()

const modalRef = ref(null)
function handleEdit(item = {}) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: `编辑菜单 - ${item.name}`,
    row: item,
    okText: '保存',
  })
}

const btnsColumns = [
  { title: '名称', key: 'name' },
  { title: '编码', key: 'code' },
  {
    title: '状态',
    key: 'enable',
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
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEditBtn(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDeleteBtn([row.id]),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]

function onSelectMenu(node) {
  if (!node) {
    currentMenu.value = null
    return
  }
  detailLoading.value = true
  api.getMenuDetail(node.id).then((res) => {
    detailLoading.value = false
    currentMenu.value = res.data
    nextTick(() => {
      if ($table.value) {
        $table.value.handleSearch()
      }
    })
  })
}

function handleAddBtn() {
  modalRef.value?.handleOpen({
    action: 'add',
    title: '新增按钮',
    row: { type: 'BUTTON', parent_id: currentMenu.value.id },
    okText: '保存',
  })
}

function handleEditBtn(row) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: `编辑按钮 - ${row.name}`,
    row,
    okText: '保存',
  })
}

function handleDeleteBtn(id) {
  const d = $dialog.warning({
    content: '确定删除？',
    title: '提示',
    positiveText: '确定',
    negativeText: '取消',
    async onPositiveClick() {
      try {
        d.loading = true
        await api.deletePermission(id)
        $message.success('删除成功')
        initData()
        d.loading = false
      }
      catch (error) {
        console.error(error)
        d.loading = false
      }
    },
  })
}

async function handleEnable(item) {
  try {
    item.enableLoading = true
    await api.lineEditBtnPermission({
      id: item.id,
      enable: item.enable === 1 ? 0 : 1,
    })
    $message.success('操作成功')
    $table.value?.handleSearch()
    item.enableLoading = false
  }
  catch (error) {
    console.error(error)
    item.enableLoading = false
  }
}
</script>
