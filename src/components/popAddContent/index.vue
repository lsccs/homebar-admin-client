<template>
  <n-popover
    trigger="click"
    @positive-click="onSubmit"
    @negative-click="onCancel"
  >

    <template #trigger>
      <n-button>{{ title }}</n-button>
    </template>
    <div class="pop-action">
      <n-input
        v-model:value="input"
        class="input"
        :disabled="loading"
        size="small"
        maxlength="20"
        show-word-limit
      ></n-input>
      <n-button class="cancel-btn" size="small" :disabled="loading" @click="onCancel"
      >取消</n-button
      >
      <n-button
        type="primary"
        size="small"
        :loading="loading"
        @click="onSubmit"
      >确认</n-button
      >
    </div>

  </n-popover>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '添加'
    },
    defaultValue: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      input: '',
      visible: false,
      loading: false,
    }
  },
  methods: {
    onCancel() {
      this.input = ''
      this.visible = false
      this.loading = false
    },
    onSubmit() {
      this.loading = true
      this.$emit('submit', this.input, this.onCancel)
    }
  }
}
</script>
<style lang="scss" scoped>
.pop-action {
  display: flex;
  align-items: center;

  .cancel-btn {
    margin-right: 5px;
  }

  .input {
    margin-right: 10px;
  }
}
</style>
