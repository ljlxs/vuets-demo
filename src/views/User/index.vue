<script setup lang="ts">
import { ref } from 'vue'
import { getUserInfo } from '../../services/user'
import type { UserInfo } from '@/types/user'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
const user = ref<UserInfo>()
const store = useUserStore()
const router = useRouter()
const initUserInfo = async () => {
  let res = await getUserInfo()
  user.value = res.data
  console.log(user.value)
}
const iconList = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]
initUserInfo()
const retreat = async () => {
  const res = await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出优医问诊吗？'
  })
  console.log(res)
  store.delUser()
  router.push('/login')
}
</script>

<template>
  <div class="user-page" v-if="user">
    <div class="user-heander">
      <div class="top">
        <van-image
          width="70"
          height="70"
          round
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="heander-right">
          <p>{{ user.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>0</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>0</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>0</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>0</p>
          <p>优惠卷</p>
        </van-col>
      </van-row>
    </div>
    <!-- 药品订单 -->
    <div class="user-page-order">
      <div class="order_top">
        <p>药品订单</p>
        <p>
          全部订单
          <van-icon name="arrow" />
        </p>
      </div>
      <div class="order_bom">
        <van-row>
          <van-col span="6">
            <cp-icon name="user-paid" />
            <p>待付款</p>
          </van-col>
          <van-col span="6">
            <cp-icon name="user-shipped" />
            <p>代发货</p>
          </van-col>
          <van-col span="6">
            <cp-icon name="user-received" />
            <p>待收货</p>
          </van-col>
          <van-col span="6">
            <cp-icon name="user-received" />
            <p>已完成</p>
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 快捷工具 -->
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        v-for="(item, index) in iconList"
        :key="index"
        :title="item.label"
        is-link
        :border="false"
        :to="item.path"
      >
        <template #icon>
          <cp-icon :name="`user-tool-0${index + 1}`" />
        </template>
      </van-cell>
    </div>
    <div class="user-page-quit" @click="retreat">退出登录</div>
  </div>
</template>
<style lang="scss" scoped>
.user-page {
  min-height: calc(100vh - 50px);
  background: var(--cp-bg);
  padding: 0 15px 65px;
  .user-heander {
    margin: 0 -15px 20px;
    background: linear-gradient(
      180deg,
      rgba(44, 181, 165, 0.46),
      rgba(44, 181, 165, 0)
    );
    .top {
      display: flex;
      align-items: center;
      padding: 50px 15px 0;
    }
    .heander-right {
      margin-left: 15px;
      p {
        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }
        &:last-child {
          margin-top: 10px;
          color: var(--cp-primary);
          font-size: 16px;
        }
      }
    }
    .van-row {
      padding-top: 15px;
      .van-col {
        text-align: center;
      }
    }
  }
  &-order {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    .order_top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      p {
        &:first-child {
          font-weight: 900;
          font-size: 15px;
        }
        &:last-child {
          color: var(--cp-tag);
        }
      }
    }
    .van-row {
      text-align: center;
      font-size: 28px;
      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }
  &-group {
    background-color: #fff;
    border-radius: 8px;

    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    ::v-deep() {
      .van-cell {
        align-items: center;
      }
      .cp-icon {
        font-size: 17px;
        margin-right: 10px;
        margin-top: 6px;
      }
    }
  }
  &-quit {
    margin: 20px auto;
    width: 100px;
    text-align: center;
    color: var(--cp-price);
  }
}
</style>
