<template>
  <MeModal ref="modalRef" title="请选择角色" class="p-12">
    <n-radio-group v-model:value="roleCode" class="cus-scroll-y max-h-420 w-full py-16">
      <n-space vertical :size="24" class="mx-12">
        <n-radio-button
          v-for="role in roles"
          :key="role.id"
          class="h-36 w-full text-center text-16 leading-36"
          :class="{ 'bg-primary! color-white!': role.id === roleCode }"
          :value="role.id"
        >
          {{ role.name }}
        </n-radio-button>
      </n-space>
    </n-radio-group>

    <template #footer>
      <div class="flex">
        <n-button class="flex-1" size="large" @click="close">
          取消
        </n-button>
        <n-button
          :loading="okLoading"
          class="ml-20 flex-1"
          type="primary"
          size="large"
          :disabled="userStore.currentRole?.id === roleCode"
          @click="setCurrentRole"
        >
          确认
        </n-button>
      </div>
    </template>
  </MeModal>
</template>

<script setup>
import api from '@/api'
import { MeModal } from '@/components'
import { useModal } from '@/composables'
import { useAuthStore, useUserStore } from '@/store'

const userStore = useUserStore()
const authStore = useAuthStore()

const roles = ref(userStore.roles || [])
const roleCode = ref(userStore.currentRole?.id)

const [modalRef, okLoading] = useModal()
function open(options) {
  modalRef.value?.open({
    ...options,
  })
}

function close() {
  modalRef.value.close()
}

async function setCurrentRole() {
  try {
    okLoading.value = true
    await api.switchCurrentRole(roleCode.value)

    await authStore.switchCurrentRole()
    okLoading.value = false
    $message.success('切换成功')
    modalRef.value?.handleOk()
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
    return false
  }
}


defineExpose({
  open,
})
</script>
