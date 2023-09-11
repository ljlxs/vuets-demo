<script setup lang="ts">
import { ref } from 'vue'
import { closeToast, showLoadingToast } from 'vant'
import { uploadImage } from '@/services/consult'
defineProps<{
  disabled: boolean
}>()
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-Img', text: { id: string; url: string }): void
}>()
const text = ref<string>('')
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}
// 图片上传
const afterRead = async (fill: any) => {
  if (!fill.file) return
  console.log('fill', fill)
  showLoadingToast('加载中')
  const res = await uploadImage(fill.file)
  emit('send-Img', res.data)
  closeToast() // 关闭加载
}
</script>
<template>
  <div class="bom">
    <van-field
      type="text"
      class="input"
      :border="false"
      :disabled="disabled"
      placeholder="问医生"
      autocomplete="off"
      v-model="text"
      @keyup.enter="sendText"
    ></van-field>
    <van-uploader
      :after-read="afterRead"
      :preview-image="false"
      :disabled="disabled"
    >
      <cp-icon name="consult-img"></cp-icon>
    </van-uploader>
  </div>
</template>
<style lang="scss" scoped>
.bom {
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  align-items: center;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
