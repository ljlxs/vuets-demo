<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
// import { defineProps } from 'vue'
const props = defineProps<{
  title?: string
  rightText?: string
  bock?: () => void
}>()
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickRight = () => {
  emit('click-right')
}
const onClickLeft = () => {
  if (props.bock) {
    return props.bock()
  }
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div>
    <van-nav-bar
      :right-text="rightText"
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </div>
</template>
<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    .van-nav-bar__title {
      font-size: 15px;
      color: var(--cp-text1);
      font-weight: 500;
    }
    .van-nav-bar__text {
      font-size: 15px;
      color: var(--cp-primary);
      font-weight: 500;
    }
  }
}
</style>
