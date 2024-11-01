<template>
  <n-select
    v-bind="$attrs"
    :value="value"
    :label-field="labelField"
    :value-field="valueField"
    :options="currentOptions"
    @update:value="onSelect"
    :reset-menu-on-options-change="false"
    :loading="loading"
    clearable
    filterable
    :remote="!!loadApi"
    @scroll="handleScroll"
    @search="handleSearch"
  />
</template>


<script setup>
const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: [Number, String, Array],
  },
  options: {
    type: Array,
    default: () => []
  },
  loadApi: {
    type: Function,
    default: null
  },
  labelField: {
    type: String,
    default: 'name'
  },
  valueField: {
    type: String,
    default: 'id'
  },
  searchField: {
    type: String,
    default: ''
  },
})


const loading = ref(false)
const currentOptions = ref(props.options)
const page = ref({ page: 1, limit: 10, filters: {} })
let isLoadFinish = false;

onMounted(() => {
  load({ page: 1, filters: {} })
});

function onSelect(value) {
  page.value.filters = {}
  emit('update:value', value)
}

function handleScroll(e) {
  const currentTarget = e.currentTarget;
  if (
    currentTarget.scrollTop + currentTarget.offsetHeight
    >= currentTarget.scrollHeight
  ) {
    load();
  }
}


function handleSearch(keyword) {
  if (props.loadApi) {
    isLoadFinish = false
    const key = props.searchField || `_like_${props.labelField}`
    const defaultQuery = {
      page: 1,
      filters: {
        [key]: keyword
      }
    }
    load(defaultQuery).then((list) => {
      isLoadFinish = false
      currentOptions.value = list
    })
  }
}


function load(query) {
  if (!props.loadApi || isLoadFinish || loading.value) {
    return;
  }
  loading.value = true;
  return props.loadApi(query || page.value).then(res => {
    const list = res.data.list;
    currentOptions.value = [...currentOptions.value, ...list]
    if (!query) {
      page.value.page += 1
    }
    loading.value = false
    if (!res.data.total || !res.data.list.length) {
      isLoadFinish = true
    }
    return list
  }).catch(() => {
    loading.value = false

  })
}
</script>
