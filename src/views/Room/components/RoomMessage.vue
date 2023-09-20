<script setup lang="ts">
import type { Message } from '@/types/room'
import { MsgType } from '@/enum'
import { getIllnessTimeText, getConsultFlagText } from '@/utils/filter'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import useShowPrescription from '@/composable/index'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useUserStore()
defineProps<{
  list: Message[]
}>()
// 使用dayjs对时间进行处理显示
const formatTime = (val: string) => {
  return dayjs(val).format('HH:mm')
}
const { showPrescription } = useShowPrescription()
const buy = (id: string) => {
  router.push(`/order/pay?id=${id}`)
}
</script>
<template>
  <div class="message">
    <template v-for="(item, index) in list" :key="index">
      <div class="box" v-if="item.msgType === MsgType.CardPat">
        <div class="top van-hairline--bottom">
          <p>
            {{ item.msg.consultRecord?.patientInfo.name }}
            {{ item.msg.consultRecord?.patientInfo.genderValue }}
            {{ item.msg.consultRecord?.patientInfo.age }}岁
          </p>
          <p>
            {{
              getIllnessTimeText(
                item.msg.consultRecord?.patientInfo.illnessTime
              )
            }}
            |
            {{
              getConsultFlagText(
                item.msg.consultRecord?.patientInfo.illnessType
              )
            }}
          </p>
        </div>
        <van-row>
          <van-col span="6">病情描述</van-col>
          <van-col span="18">a</van-col>
          <van-col span="6">图片</van-col>
          <van-col span="18">点击查看</van-col>
        </van-row>
      </div>
      <!-- 通知-通用 -->
      <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
        <div class="content">
          <span>{{ item.msg.content }}</span>
        </div>
      </div>
      <!-- 通知-温馨提示 -->
      <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
        <div class="content">
          <span class="green">温馨提示：</span>
          <span>{{ item.msg.content }}</span>
        </div>
      </div>
      <!-- 通知-结束 -->
      <div class="msg msg-tip msg-tip-cancel" v-if="item.msgType === 33">
        <div class="content">
          <span>订单取消</span>
        </div>
      </div>
      <!-- 文字发送 -->
      <div
        class="text-to"
        v-if="item.msgType === 1 && item.from === store.user?.id"
      >
        <div class="content">
          <div class="trime">{{ formatTime(item.createTime) }}</div>
          <div class="txt">{{ item.msg.content }}</div>
        </div>
        <van-image :src="item.fromAvatar" />
      </div>
      <!-- // 图片 -->
      <div
        class="text-to"
        v-if="item.msgType === 4 && item.from === store.user?.id"
      >
        <div class="content">
          <div class="trime">{{ formatTime(item.createTime) }}</div>
          <van-image class="img" fit="contain" :src="item.msg.picture?.url" />
        </div>
        <van-image :src="item.fromAvatar" />
      </div>
      <!-- 文字接收 -->
      <div
        class="text"
        v-if="item.msgType === 1 && item.from !== store.user?.id"
      >
        <van-image :src="item.fromAvatar" />
        <div class="content">
          <div class="trime">{{ formatTime(item.createTime) }}</div>
          <div class="txt">{{ item.msg.content }}</div>
        </div>
      </div>
      <!-- // 图片接受 -->
      <div
        class="text"
        v-if="item.msgType === 4 && item.from !== store.user?.id"
      >
        <van-image :src="item.fromAvatar" />

        <div class="content">
          <div class="trime">{{ formatTime(item.createTime) }}</div>
          <van-image class="img" fit="contain" :src="item.msg.picture?.url" />
        </div>
      </div>
      <div class="recipe" v-if="item.msgType === MsgType.CardPre">
        <div class="content" v-if="item.msg.prescription">
          <div class="head van-hairline--bottom">
            <div class="head-tit">
              <h3>电子处方</h3>
              <p @click="showPrescription(item.msg.prescription?.id)">
                原始处方 <van-icon name="arrow"></van-icon>
              </p>
            </div>
            <p>
              {{ item.msg.prescription.name }}
              {{ item.msg.prescription.genderValue }}
              {{ item.msg.prescription.age }}岁
              {{ item.msg.prescription.diagnosis }}
            </p>
            <p>开方时间：{{ item.msg.prescription.createTime }}</p>
          </div>
          <div class="body">
            <div
              class="body-item"
              v-for="med in item.msg.prescription.medicines"
              :key="med.id"
            >
              <div class="durg">
                <p>{{ med.name }} {{ med.specs }}</p>
                <p>{{ med.usageDosag }}</p>
              </div>
              <div class="num">x{{ med.quantity }}</div>
            </div>
          </div>
          <div class="foot">
            <span @click="buy(item.msg.prescription.id)">购买药品</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.message {
  margin: 20px 15px;
  //   display: flex;
  //   flex-direction: column;
  .box {
    box-sizing: border-box;
    background: #fff;
    padding: 0 15px;
    border-radius: 8px;
    .top {
      padding: 10px 0;
      > p {
        &:first-child {
          font-size: 16px;
        }
        &:last-child {
          margin-top: 5px;
          color: var(--cp-tip);
        }
      }
    }
    .van-col {
      &:nth-child(-n + 2) {
        padding-top: 10px;
      }
      &:nth-child(2n) {
        color: var(--cp-tip);
        padding-bottom: 10px;
      }
    }
  }
  .msg {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
    font-size: 12px;
    .content {
      display: inline-block;
      background: #fff;
      border-radius: 25px;
      color: var(--cp-tip);
      text-align: center;
      padding: 10px;
    }
    .green {
      color: var(--cp-primary);
    }
  }
  .text {
    display: flex;
    .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 13px;
    }
    .content {
      max-width: 240px;
      min-width: 52px;
      .txt {
        border-radius: 8px;
        background-color: #fff;
        padding: 15px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: #fff;
          border-top-left-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          left: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-right-radius: 13px 13px;
        }
      }
      .img {
        height: 160px;
        width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
      .trime {
        color: #c3c6d2;
      }
    }
  }
  .text-to {
    display: flex;
    justify-content: flex-end;
    .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 13px;
    }
    .content {
      max-width: 240px;
      min-width: 52px;
      .txt {
        border-radius: 8px;
        background-color: var(--cp-primary);
        padding: 15px;
        color: #fff;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          right: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: var(--cp-primary);
          border-top-right-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          right: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-left-radius: 13px 13px;
        }
      }
      .img {
        height: 160px;
        width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
      .trime {
        color: #c3c6d2;
        text-align: right;
      }
    }
  }
  .recipe {
    padding: 15px;
    .content {
      background-color: #fff;
      border-radius: 8px;
      color: var(--cp-tip);
      font-size: 12px;
      flex: 1;
      .head {
        padding: 15px;
        .head-tit {
          display: flex;
          justify-content: space-between;
          > h3 {
            font-weight: normal;
            font-size: 16px;
            color: var(--cp-text1);
          }
        }
        p {
          margin-top: 5px;
        }
      }
      .body {
        padding: 15px 15px 0 15px;
        &-item {
          display: flex;
          margin-bottom: 15px;
          .durg {
            flex: 1;
            > p {
              &:first-child {
                font-size: 14px;
                color: var(--cp-text1);
                margin-bottom: 5px;
              }
            }
          }
          .num {
            color: var(--cp-text1);
          }
        }
      }
      .foot {
        background-color: var(--cp-plain);
        color: var(--cp-primary);
        font-size: 16px;
        text-align: center;
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>
