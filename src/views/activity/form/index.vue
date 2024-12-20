<template>
<LayoutDefault ref="layout">
    <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="right"
        :label-width="80"
        :model="modalForm"
    >
    <n-form-item
        label="活动名称"
        path="name"
        :rule="{
            required: true,
            message: '请输入配方名称',
            trigger: ['input', 'blur'],
        }"
    >
        <n-input v-model:value="modalForm.name" />
    </n-form-item>
    <n-form-item
        label="封面"
        path="cover"
        :rule="{
            type: 'number',
            required: true,
            message: '请选择封面',
            trigger: ['input', 'blur'],
        }"
    >
        <FileSelector :multiple="false" v-model:value="modalForm.cover" />
    </n-form-item>
    <n-form-item
        label="持续时间"
        path="timing"
        :rule="{
            type: 'array',
            required: true,
            message: '请选择持续时间',
            trigger: ['input', 'blur'],
        }"
    >
        <n-date-picker v-model:formatted-value="modalForm.timing" type="datetimerange" clearable />
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



    <n-form-item
        label="内容"
        path="content"
    >
        <Editor v-model:value="modalForm.content" />
    </n-form-item>

    </n-form>


    <div class="form-action">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="handleSubmit">提交</n-button>
    </div>
</LayoutDefault>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import LayoutDefault from '@/components/layout/default.vue'
import { useRouter, useRoute } from 'vue-router';
import api from '../api'

const layout = ref()
const router = useRouter()
const route = useRoute()

const modalFormRef = ref()
const modalForm = ref({ enable: 1 })

const updateId = route.query.id

onMounted(init)

function init() {
    if (updateId) {
        return api.detail(updateId).then((res) => {
            res.data.timing = [res.data.start_time, res.data.end_time]
            modalForm.value = res.data;
            layout.value.setLoading(false)
        })
    }
    layout.value.setLoading(false)
}


function handleCancel() {
    router.back()
}

function handleSubmit() {
    modalFormRef.value.validate().then(() => {
        layout.value.setLoading(true)
        const start_time = modalForm.value.timing[0]
        const end_time = modalForm.value.timing[1]

        const apiFunc = updateId ? api.update : api.create

        apiFunc({ ...modalForm.value, start_time, end_time }).then(() => {
            handleCancel()
        }).finally(() => {
            layout.value.setLoading(false)
        })
    })
}
</script>

<style scoped>
.form-action {
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    column-gap: 12px;
}
</style>
