<script setup lang="ts"></script>
<template>
  <div class="bom">
    <van-field
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
    ></van-field>
    <van-uploader :preview-image="false" :disabled="true">
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
