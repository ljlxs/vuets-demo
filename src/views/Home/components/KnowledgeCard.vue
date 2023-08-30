<script setup lang="ts">
import type { Knowledge } from '@/types/consult'
defineProps<{
  item: Knowledge
}>()
</script>

<template>
  <div class="knowledge-card-page">
    <div class="knowledge-card-page-header">
      <div class="top">
        <van-image round class="avatar" :src="item.creatorAvatar" />
        <div class="top-title">
          <p class="name">{{ item.creatorName }}</p>
          <p class="title van-ellipsis">
            {{ item.creatorTitles }}
          </p>
        </div>
        <van-button class="btn" size="small" round>{{
          item.likeFlag ? '已关注' : '+ 关注'
        }}</van-button>
      </div>
      <div class="box">
        <h3 class="h3">{{ item.title }}</h3>
        <p class="box-title van-multi-ellipsis--l2">
          {{ item.content.replace(/<[^>]+>/g, '') }}
        </p>
        <div class="image">
          <van-image v-for="(url, i) in item.coverUrl" :key="i" :src="url" />
        </div>
        <p class="box-bomm">
          <span>{{ item.collectionNumber }} 收藏</span>
          <span>{{ item.commentNumber }} 评论</span>
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.knowledge-card-page {
  &-header {
    .top {
      display: flex;
      margin-top: 10px;
      ::v-deep() {
        .avatar {
          width: 38px;
          height: 38px;
          margin-right: 10px;
        }
        .btn {
          padding: 0 12px;
          border-color: var(--cp-primary);
          color: var(--cp-primary);
          height: 28px;
          width: 72px;
        }
      }
      .top-title {
        width: 200px;
        margin-right: 10px;
        .name {
          color: var(--cp-text2);
        }

        .title {
          color: var(--cp-tip);
          font-size: 12px;
        }
      }
    }
    .box {
      .h3 {
        font-size: 16px;
        margin-top: 8px;
        font-weight: normal;
      }
      .box-title {
        margin-top: 7px;
        line-height: 2;
        color: var(--cp-text3);
      }
      .image {
        display: flex;
        .van-image {
          width: 106px;
          height: 106px;
          margin-right: 12px;
          border-radius: 12px;
          overflow: hidden;
          justify-content: center;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .box-bomm {
        margin-top: 10px;
        > span {
          color: var(--cp-tip);
          margin-right: 16px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
