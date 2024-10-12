<template>
  <div class="table-container">
    <n-data-table size="small" :columns="newColumns" :data="value" :pagination="false" />
    <n-button v-if="!readonly" class="add-btn" size="small" type="primary" @click="handleAdd">添加</n-button>
  </div>
</template>

<script setup>
import RowRender from "./rowRender.vue";
import {isFunction} from "lodash-es";
const emit = defineEmits(['update:value'])

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  value: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  defaultRow: {
    type: Object,
    default: () => ({}),
  }
})


function handleAdd() {
  emit('update:value', [...props.value, { ...props.defaultRow }])
}


const newColumns = computed(() => {
  return props.columns.map(item => {
    return {
      ...item,
      render(row) {
        return h(RowRender, {
          model: row,
          readonly: props.readonly,
          value: row[item.key],
          renderValue: item.renderValue,
          componentProps: isFunction(item.componentProps) ? item.componentProps(row, item) : item.componentProps,
        })
      }
    }
  })
})

</script>

<style lang="scss" scoped>
.table-container {
  width: 100%;

  .add-btn {
    margin-top: 10px;
  }
}
</style>
