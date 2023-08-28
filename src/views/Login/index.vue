<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
// import type { loginParamsRules } from '../../services/types/user.d'
import { mobileRules, passRules, codeRules } from '../..//utils/rules'
import { showToast } from 'vant'
import {
  loginByPassword,
  sendMobileCode,
  loginByMobile
} from '../../services/user'
import { useUserStore } from '../..//stores/user'
const router = useRouter()
const route = useRoute()
const store = useUserStore()
const loginForm = ref({
  mobile: '13230000001',
  password: 'abc12345',
  code: ''
})
// 我已经同意是否勾选状态
const checked = ref<boolean>(false)
// 密码输入框眼睛明文暗文状态
const iconFlag = ref<boolean>(false)
// 短信验证状态
const isPass = ref<boolean>(true)
const OnIcon = () => {
  iconFlag.value = !iconFlag.value
}
// 表单提交验证
const onSubmit = async () => {
  console.log(route.query)
  if (!checked.value) {
    showToast('请勾选我已同意')
    return
  }
  try {
    let res = isPass.value
      ? await loginByPassword(loginForm.value.mobile, loginForm.value.password)
      : await loginByMobile(loginForm.value.mobile, loginForm.value.code)
    if (res.code == 10000) {
      console.log(res.data)
      // 逻辑：登录成功进入页面不可以反回登录
      // router.push会把记录存储 而 router.replace并不会保留而是替换
      store.setUser(res.data)
      router.replace((route.query.returnUrl as string) || '/user')
    }
  } catch (error) {
    console.log(error)
  }
}
const time = ref(0)
let timeId: number = 0

// 发送验证码
const codeClisk = async () => {
  if (time.value > 0) return
  const res = await sendMobileCode(loginForm.value.mobile, 'login')
  console.log(res.data)
  showToast('发送成功')
  time.value = 60
  clearInterval(timeId)
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timeId)
  }, 1000)
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass"
        >{{ !isPass ? '密码登录' : '短信验证码登录' }}<van-icon name="arrow"
      /></a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          :rules="mobileRules"
          type="tel"
        />
        <van-field
          v-if="isPass"
          v-model="loginForm.password"
          :type="iconFlag ? 'text' : 'password'"
          placeholder="请输入密码"
          :rules="passRules"
        >
          <template #button>
            <cp-icon
              :name="iconFlag ? 'login-eye-on' : 'login-eye-off'"
              @click="OnIcon"
            ></cp-icon>
          </template>
        </van-field>
        <van-field
          v-else
          v-model="loginForm.code"
          type="text"
          placeholder="短信验证码"
          :rules="codeRules"
        >
          <template #button>
            <span class="verification" @click="codeClisk">
              {{ time > 0 ? time + 's后再次发送' : '发送验证码' }}
            </span>
          </template>
        </van-field>
      </van-cell-group>
      <div class="cell">
        <van-checkbox v-model="checked">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cell">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
      <div class="cell">忘记密码？</div>
    </van-form>
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icons">
        <img src="../../assets/qq.svg" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    padding: 30px 30px 50px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icons {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
      }
    }
  }
}
.cell {
  height: 52px;
  line-height: 24px;
  padding: 14px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.van-checkbox {
  a {
    color: var(--cp-primary);
    padding: 0 5px;
  }
}
// 发送验证码
.verification {
  color: var(--cp-primary);
}
</style>
