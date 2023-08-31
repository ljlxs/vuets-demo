import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { ref } from 'vue'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/services/user'
export default function useLogin() {
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
  const onSubmit = async () => {
    console.log(route.query)
    if (!checked.value) {
      showToast('请勾选我已同意')
      return
    }
    try {
      const res = isPass.value
        ? await loginByPassword(
            loginForm.value.mobile,
            loginForm.value.password
          )
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
  let timeId = 0
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
  return {
    loginForm,
    checked,
    iconFlag,
    isPass,
    time,
    onSubmit,
    OnIcon,
    codeClisk
  }
}
