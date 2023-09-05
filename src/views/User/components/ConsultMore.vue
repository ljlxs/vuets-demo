<script lang="ts" setup>
import { ref, computed } from 'vue'
import useShowPrescription from '@/composable/index'
const props = defineProps<{
  disabled: boolean
}>()
const emits = defineEmits<{
  (e: 'on-delete'): void
  (e: 'on-preview'): void
}>()
const showPopover = ref(false)
const actions = computed(() => [
  { text: '查看处方', disabled: props.disabled },
  { text: '删除订单' }
])
const onSelect = (item: { text: string; disabled?: boolean }, i: number) => {
  console.log('item=>', item)
  console.log('i', i)
  if (i === 0) {
    emits('on-preview')
  }
  if (i === 1) {
    emits('on-delete')
  }
}
const { showPrescription } = useShowPrescription()
</script>
<template>
  <div class="more">
    <van-popover
      placement="top-start"
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>

<style scoped lang="scss">
.more {
  color: var(--cp-tag);
  flex: 1;
  font-size: 13px;
}
</style>
