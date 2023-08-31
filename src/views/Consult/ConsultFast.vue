<script setup lang="ts">
// import { ref } from 'vue'
import { useConsultStore } from '@/stores/consult'
import { IllnessType } from '@/enum'
const store = useConsultStore()
</script>
<template>
  <div class="consult-page">
    <cp-nav-bar title="极速问诊" right-text="问诊记录"></cp-nav-bar>
    <div class="consult-page-top">
      <img class="img" src="@/assets/consult-fast.png" alt="" />
      <p class="text"><span>20s</span> 快速匹配专业医生</p>
    </div>
    <div class="fast-type">
      <router-link
        to="/consult/dep"
        class="item"
        @click="store.setIllnessType(IllnessType.Trimethylate)"
      >
        <cp-icon class="pic" name="consult-doctor"></cp-icon>
        <div class="info">
          <p>三甲图文问诊</p>
          <p>三甲主治及以上级别医生</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </router-link>
      <router-link
        to="/consult/dep"
        class="item"
        @click="store.setIllnessType(IllnessType.Normal)"
      >
        <cp-icon class="pic" name="consult-message"></cp-icon>
        <div class="info">
          <p>普通图文问诊</p>
          <p>二甲主治及以上级别医生</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.consult-page {
  padding-top: 46px;
  &-top {
    padding: 30px 0;
    text-align: center;
    .img {
      width: 240px;
    }
    .text {
      font-size: 16px;
      margin-top: 10px;
      > span {
        color: var(--cp-primary);
      }
    }
  }
  .fast-type {
    padding: 15px;
    .item {
      border: 0.5px solid var(--cp-line);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 16px;
      margin-bottom: 16px;
      .pic {
        font-size: 40px;
      }
      .info {
        margin-left: 12px;
        flex: 1;

        > p:first-child {
          font-size: 16px;
          color: var(--cp-text1);
          margin-bottom: 4px;
        }
        > p:last-child {
          font-size: 13px;
          color: var(--cp-tag);
        }
      }
    }
    ::v-deep() {
      .van-icon {
        color: var(--cp-tip);
      }
    }
  }
}
</style>
