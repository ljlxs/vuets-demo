<script setup lang="ts">
defineProps<{
  options: {
    label: string
    value: number | string
  }[]
  modelValue?: string | number
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()
const toggleItem = (value: number | string) => {
  emits('update:modelValue', value)
}
</script>

<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      :class="{ active: modelValue === item.value }"
      href="javascript:;"
      v-for="(item, index) in options"
      :key="index"
      @click="toggleItem(item.value)"
      >{{ item.label }}</a
    >
  </div>
</template>
<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;

  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    background-color: var(--cp-bg);
    border: 1px solid var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;

    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
