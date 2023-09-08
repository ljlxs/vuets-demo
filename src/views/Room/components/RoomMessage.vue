<script setup lang="ts">
import type { Message } from '@/types/room'
import { MsgType } from '@/enum'
import { getIllnessTimeText, getConsultFlagText } from '@/utils/filter'
defineProps<{
  list: Message[]
}>()
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
}
</style>
