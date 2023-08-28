<script setup lang="ts">
// import {CpIcon} from '../../components/cp-icon.vue'
</script>

<template>
  <div class="Layout-page">
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item to="/">
        首页
        <template #icon="{ active }">
          <cp-icon
            :name="`home-index-${active ? 'active' : 'default'}`"
          ></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article"> 健康百科</van-tabbar-item>
      <van-tabbar-item to="/notify">消息中心</van-tabbar-item>
      <van-tabbar-item to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped></style>
