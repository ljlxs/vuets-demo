<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
// import { defineProps } from 'vue'
const props = defineProps({
  title: String,
  rightText: String
})
const emit = defineEmits(['click-right'])
const onClickRight = () => {
  emit('click-right')
}
const onClickLeft = () => {
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
      :right-text="props.rightText"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </div>
</template>
<style scoped lang="scss">
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
      color: var(--cp-primary);
    }
  }
}
</style>
