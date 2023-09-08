<script setup lang="ts">
import RoomAction from './components/RoomAction.vue'
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import { io } from 'socket.io-client'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType } from '@/enum'
const route = useRoute()
const store = useUserStore()
const list = ref<Message[]>()
onMounted(() => {
  const socket = io('https://consult-api.itheima.net', {
    auth: {
      token: 'Bearer ' + store.user?.token
    },
    query: {
      orderId: route.query.orderId
    }
  })
  // 是否连接成功
  socket.on('connect', () => {
    console.log('连接成功')
  })
  // 是否断开连接
  socket.on('disconnect', () => {
    console.log('断开链接')
  })
  // 连接失败
  socket.on('error', (err) => {
    console.log('err', err)
  })
  // 聊天信息
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    console.log(arr)
    list.value = arr
  })
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室"></cp-nav-bar>
    <RoomStatus></RoomStatus>
    <RoomMessage :list="list!"></RoomMessage>
    <RoomAction></RoomAction>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 46px;
  padding-bottom: 16vw;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
}
</style>
