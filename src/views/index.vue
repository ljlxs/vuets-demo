<template>
  <div>
    {{ store.user?.id }}
    <button @click="btn" class="btn">登录</button>
    <van-button type="primary" class="btn">主要按钮</van-button>
    <van-icon name="chat-o" />
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores'
import { Button as VanButton } from 'vant'
import { Icon as vanIcon } from 'vant'
const store = useUserStore()
const info = {
  id: '3',
  token: '1',
  account: '1',
  mobile: '1',
  avatar: '1'
}
const btn = () => {
  store.setUser(info)
  localStorage.setItem('info', JSON.stringify(info))
}
</script>

<style scoped lang="scss">
.btn {
  width: 100px;
  font-size: 10px;
}
</style>
