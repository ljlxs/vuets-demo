<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeList from './components/KnowledgeList.vue'
import type { KnowledgeType } from '@/types/consult.d.ts'
import FollowDoctor from './components/FollowDoctor.vue'
import { useConsultStore } from '@/stores/consult'
import { ConsultType } from '@/enum'
const active = ref<KnowledgeType>('recommend')
const store = useConsultStore()
</script>

<template>
  <div class="home-page">
    <div class="home-page-top">
      <div class="top">
        <p>优医</p>
        <div class="serch">
          <cp-icon name="home-search"></cp-icon>
          搜一搜：疾病/症状/医生/健康知识
        </div>
      </div>
    </div>
    <div class="home-page-icons">
      <van-row>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-doctor"></cp-icon>
            <p class="title">问医生</p>
            <p class="desc">按科室问医生</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link
            to="/consult/fast"
            class="nav"
            @click="store.setType(ConsultType.Fast)"
          >
            <cp-icon name="home-graphic"></cp-icon>
            <p class="title">极速问诊</p>
            <p class="desc">20s医生极速回复</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">开药门诊</p>
            <p class="desc">线上买药更方便</p>
          </router-link>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <router-link to="/" class="nav mas">
            <cp-icon name="home-doctor"></cp-icon>
            <p class="title">药品订单</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav mas">
            <cp-icon name="home-graphic"></cp-icon>
            <p class="title">健康档案</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav mas">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">我的处方</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav mas">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">疾病查询</p>
          </router-link>
        </van-col>
      </van-row>
    </div>
    <div class="home-page-banner">
      <van-swipe class="my-swipe" indicator-color="#fff">
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-tabs sticky shrink v-model:active="active">
      <van-tab name="like" title="关注">
        <FollowDoctor></FollowDoctor>
        <Knowledge-list type="like"></Knowledge-list>
      </van-tab>
      <van-tab name="recommend" title="推荐">
        <Knowledge-list type="recommend"></Knowledge-list>
      </van-tab>
      <van-tab name="fatReduction" title="减脂">
        <Knowledge-list type="fatReduction"></Knowledge-list>
      </van-tab>
      <van-tab name="food" title="饮食">
        <Knowledge-list type="food"></Knowledge-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 50px;
  &-top {
    padding: 0 15px;
    height: 100px;
    position: relative;
    &::before {
      content: '';
      width: 100%;
      height: 90px;
      background: linear-gradient(180deg, rgba(62, 206, 197, 0.85), #26bcc6);
      border-bottom-left-radius: 150px 20px;
      border-bottom-right-radius: 150px 20px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .top {
      position: relative;
      p {
        padding: 20px 0;
        color: #fff;
      }
      .serch {
        color: var(--cp-dark);
        background: #fff;
        border-radius: 20px;
        padding: 0 20px;
        display: flex;
        height: 40px;
        align-items: center;
        font-size: 13px;
        position: absolute;
        box-shadow: 0px 15px 22px -7px rgba(224, 236, 250, 0.8);
        width: 100%;
        box-sizing: border-box;
        ::v-deep() {
          .cp-icon {
            font-size: 16px;
            margin-right: 5px;
            margin-top: 3px;
          }
        }
      }
    }
  }
  &-icons {
    padding: 10px 15px 0 15px;
    .nav {
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-weight: 600;
        margin-top: 5px;
        color: var(--cp-text1);
      }
      .desc {
        font-size: 11px;
        margin-top: 2px;
        color: var(--cp-dark);
      }
      ::v-deep() {
        .cp-icon {
          font-size: 48px;
        }
      }
    }
    .mas {
      .title {
        font-weight: normal;
        margin-top: 5px;
        color: var(--cp-text1);
      }
      ::v-deep() {
        .cp-icon {
          font-size: 31px;
        }
      }
    }
  }
  &-banner {
    padding: 10px 15px;
    height: 100px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
