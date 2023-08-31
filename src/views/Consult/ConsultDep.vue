<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室"></cp-nav-bar>
    <div class="left">
      <van-sidebar v-model="active">
        <van-sidebar-item title="内科" />
        <van-sidebar-item title="外科" />
        <van-sidebar-item title="皮肤科" />
        <van-sidebar-item title="骨科" />
      </van-sidebar>
    </div>
    <div class="right">
      <router-link to="/consult/illness">科室一</router-link>
      <router-link to="/consult/illness">科室二</router-link>
      <router-link to="/consult/illness">科室三</router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.consult-dep-page {
  padding-top: 46px;
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .right {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
  .van-sidebar {
    width: 114px;

    &-item {
      padding: 14px;
      color: var(--cp-tag);

      &--select {
        color: var(--cp-main);
        font-weight: normal;

        &::before {
          display: none;
        }
      }
    }
  }
}
</style>
