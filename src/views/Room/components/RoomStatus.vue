<script setup lang="ts"></script>
<template>
  <div class="bom">
    <van-notice-bar
      :scrollable="false"
      background=""
      text=" 已通知医生尽快接诊，24小时内医生未回复将自动退款 "
    />
  </div>
</template>
<style lang="scss" scoped>
.van-notice-bar {
  background: #eaf8f6;
  color: var(--cp-primary);
}
</style>
