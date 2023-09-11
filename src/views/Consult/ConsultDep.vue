<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import type { DepList } from '@/types/consult'
import { ref, computed } from 'vue'
import { useConsultStore } from '@/stores/consult'
const store = useConsultStore()
const active = ref(0)
const list = ref<DepList>([])
const getAllDepList = async () => {
  const res = await getAllDep()
  list.value = res.data
}
getAllDepList()
const childList = computed(() => {
  return list.value[active.value]?.child
})
</script>
<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室"></cp-nav-bar>
    <div class="left">
      <van-sidebar v-model="active">
        <van-sidebar-item
          v-for="(item, index) in list"
          :key="index"
          :title="item.name"
        />
      </van-sidebar>
    </div>
    <div class="right">
      <router-link
        v-for="(ele, i) in childList"
        :key="i"
        @click="store.setDepId(ele.id)"
        to="/consult/illness"
        >{{ ele.name }}</router-link
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.consult-dep-page {
  padding-top: 46px;
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .left {
    height: 100%;
    overflow-y: auto;
  }
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
