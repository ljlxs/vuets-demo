<script setup lang="ts">
import RoomAction from './components/RoomAction.vue'
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { onMounted, ref, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enum'
import { getOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import dayjs from 'dayjs'
import { closeToast, showLoadingToast, showToast } from 'vant'
const route = useRoute()
const store = useUserStore()
const list = ref<Message[]>([])
let initialMsg = ref(true)
let socket: Socket
onMounted(() => {
  socket = io('https://consult-api.itheima.net', {
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
  socket.on('chatMsgList', async ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item, index) => {
      if (index === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    list.value.unshift(...arr)
    // console.log('arr', list.value)
    loading.value = false
    closeToast()
    if (!data.length) {
      closeToast()
      return showToast('没有聊天记录了')
    }

    if (initialMsg.value) {
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      await nextTick()
      window.scrollTo(0, document.body.scrollHeight)
      initialMsg.value = false
    }
  })
  // 监听顶单
  socket.on('statusChange', () => {
    initOrderDetail()
  })
  // 接收消息
  socket.on('receiveChatMsg', async (event) => {
    console.log('event', event)
    list.value?.push(event)
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
    console.log('text', list.value)
  })
})
const consult = ref<ConsultOrderItem>()
const initOrderDetail = async () => {
  const res = await getOrderDetail(route.query.orderId as string)
  consult.value = res.data
}
initOrderDetail()
//客户端消息发送给服务端
const sendText = async (text: string) => {
  socket.emit('sendChatMsg', {
    // 发送人
    from: store.user?.id,
    // 接收人
    to: consult.value?.docInfo?.id,
    // 发送消息的类型
    msgType: MsgType.MsgText,
    // 消息内容
    msg: {
      content: text
    }
  })
}
// 图片上传发送给服务端
const sendImg = (value: { id: string; url: string }) => {
  socket.emit('sendChatMsg', {
    // 发送人
    from: store.user?.id,
    // 接收人
    to: consult.value?.docInfo?.id,
    // 发送消息的类型
    msgType: MsgType.MsgImage,
    // 消息内容
    msg: {
      picture: value
    }
  })
}
const loading = ref(false)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  })
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室"></cp-nav-bar>
    <RoomStatus
      :status="consult?.status"
      :countdown="consult?.countdown!"
    ></RoomStatus>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <RoomMessage :list="list!"></RoomMessage>
    </van-pull-refresh>
    <RoomAction
      @send-text="sendText"
      @send-Img="sendImg"
      :disabled="consult?.status === OrderType.ConsultChat ? false : true"
    ></RoomAction>
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
