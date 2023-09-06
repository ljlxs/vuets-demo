<script setup lang="ts"></script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室"></cp-nav-bar>
    聊天内容
    <button @click="$router.push('/order/pay?id=6938580501577728')">
      药品订单详情
    </button>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 46px;
}
</style>
