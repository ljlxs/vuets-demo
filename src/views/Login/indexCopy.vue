<script setup lang="ts">
// import type { loginParamsRules } from '../../services/types/user.d'
import { mobileRules, passRules, codeRules } from '../..//utils/rules'
import useLogin from '../../composable/useLogin'
const {
  loginForm,
  checked,
  iconFlag,
  isPass,
  onSubmit,
  OnIcon,
  codeClisk,
  time
} = useLogin()
// 表单提交验证
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
