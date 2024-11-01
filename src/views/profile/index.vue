<template>
  <AppPage show-footer>
    <n-card>
      <n-space align="center">
        <Avatar isEdit :value="userStore.avatar" @change="handleAvatarSave" />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>用户名:</span>
            <span class="ml-12 opacity-80">{{ userStore.username }}</span>
            <n-button class="ml-32" type="primary" text @click="pwdModalRef.open()">
              <i class="i-fe:edit mr-4" />
              修改密码
            </n-button>
          </div>
        </div>
      </n-space>
    </n-card>

    <n-card class="mt-20" title="个人资料信息">
      <template #header-extra>
        <n-button type="primary" text @click="profileModalRef.open()">
          <i class="i-fe:edit mr-4" />
          修改资料
        </n-button>
      </template>

      <n-descriptions
        label-placement="left"
        :label-style="{ width: '200px', textAlign: 'center' }"
        :column="1"
        bordered
      >
        <n-descriptions-item label="昵称">
          {{ userStore.nick_name }}
        </n-descriptions-item>
        <n-descriptions-item label="性别">
          {{ getDictMap('gender', userStore.userInfo?.gender) ?? '未知' }}
        </n-descriptions-item>
        <n-descriptions-item label="地址">
          {{ userStore.userInfo?.address }}
        </n-descriptions-item>
        <n-descriptions-item label="邮箱">
          {{ userStore.userInfo?.email }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>


    <MeModal ref="pwdModalRef" title="修改密码" width="420px" @ok="handlePwdSave()">
      <n-form
        ref="pwdFormRef"
        :model="pwdForm"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item label="原密码" path="old_password" :rule="required">
          <n-input v-model:value="pwdForm.old_password" type="password" placeholder="请输入原密码" />
        </n-form-item>
        <n-form-item label="新密码" path="password" :rule="required">
          <n-input v-model:value="pwdForm.password" type="password" placeholder="请输入新密码" />
        </n-form-item>
      </n-form>
    </MeModal>

    <MeModal ref="profileModalRef" title="修改资料" @ok="handleProfileSave()">
      <n-form ref="profileFormRef" :model="profileForm" label-placement="left">
        <n-form-item label="昵称" path="nick_name">
          <n-input v-model:value="profileForm.nick_name" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-select
            v-model:value="profileForm.gender"
            v-options="'gender'"
            placeholder="请选择性别"
          />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input v-model:value="profileForm.address" placeholder="请输入地址" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="profileForm.email" placeholder="请输入邮箱" />
        </n-form-item>
      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import { useUserStore } from '@/store'
import {getDictMap, getUserInfo} from '@/store/helper'
import api from './api'
import Avatar from '@/components/avatar/index.vue'

const userStore = useUserStore()
const required = {
  required: true,
  message: '此为必填项',
  trigger: ['blur', 'change'],
}

const [pwdModalRef] = useModal()
const [pwdFormRef, pwdForm, pwdValidation] = useForm()

async function handlePwdSave() {
  await pwdValidation()
  await api.changePassword(pwdForm.value)
  $message.success('密码修改成功')
  refreshUserInfo()
}

const newAvatar = ref(userStore.avatar)
const [avatarModalRef] = useModal()
async function handleAvatarSave(id) {
  if (!id) {
    $message.error('请选择头像')
    return false
  }
  profileForm.value.avatar = id;
  handleProfileSave();
}

const [profileModalRef] = useModal()
const [profileFormRef, profileForm, profileValidation] = useForm({
  id: userStore.userId,
  nick_name: userStore.nick_name,
  gender: userStore.userInfo?.gender ?? 0,
  address: userStore.userInfo?.address,
  email: userStore.userInfo?.email,
})
async function handleProfileSave() {
  await profileValidation()
  await api.updateProfile(profileForm.value)
  $message.success('修改成功')
  refreshUserInfo()
}

async function refreshUserInfo() {
  const user = await getUserInfo()
  userStore.setUser(user)
}
</script>
