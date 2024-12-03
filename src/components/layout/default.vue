<template>
    <div class="layout-container">
      <n-card size="small">
        <n-spin :show="show">
            <slot></slot>
        </n-spin>
      </n-card>
    </div>
</template>
 

<script setup>
import { ref } from 'vue';
const show = ref(true);
defineExpose({ setLoading })

function setLoading(value) {
    show.value = value;
}
</script>

<style lang="scss" scoped>

.layout-container {
    padding: 15px;
    flex: 1;
    height: 0;

    :deep(.n-card) {
        height: 100%;

        .n-card__content {
            height: 100%;
            .n-spin-container {
                height: 100%;
                .n-spin-content {
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .n-form {
                        height: 0;
                        flex: 1;
                        overflow-y: auto;
                    }
                }
            }

        }
    }
}
</style>
  