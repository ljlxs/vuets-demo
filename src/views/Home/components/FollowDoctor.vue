<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
</script>
<template>
  <div class="follow-foctor-page">
    <div className="follow-foctor-page-header">
      <p>推荐关注</p>
      <p class="look">查看更多<i class="van-icon van-icon-arrow" /></p>
    </div>
    <div class="follow-foctor-page-header-body">
      <van-swipe :width="150" :show-indicators="false" :loop="false">
        <van-swipe-item>
          <DoctorCard></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.follow-foctor-page {
  background: var(--cp-bg);
  height: 250px;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 15px;
    font-size: 13px;
    .look {
      color: var(--cp-tip);
    }
  }
}
</style>
