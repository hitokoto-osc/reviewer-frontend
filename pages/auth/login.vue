<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  title: '登录'
})
const email = ref('')
const password = ref('')

// 验证器相关
const tips = ref('占位符')
const isTips = ref<boolean | null>(null)
const doValidate = () => {
  if (!email.value || !password.value) {
    tips.value = '邮箱或密码不能为空'
    return true
  }
  if (!/^\w+@\w+\.\w+$/.test(email.value)) {
    tips.value = '邮箱格式不正确'
    return true
  }
  tips.value = '占位符'
  return false
}
const disabled = computed(() => {
  return isTips.value == null || isTips.value
})

// 登录逻辑相关
const pending = ref(false)
const userStore = useUserStore()
const doLogin = async () => {
  pending.value = true
  try {
    const { data } = await doLoginReq({
      email: email.value,
      password: password.value
    })
    console.log(data)
    if (!data.value?.status || data.value?.status != 200) {
      // 登录失败
      tips.value = data.value?.message || '未知错误'
      isTips.value = true
      return
    }
    // 登录成功
    userStore.setToken(data.value?.data[0].token)
  } finally {
    pending.value = false
  }
  navigateTo('/dashboard')
}
onMounted(() => {
  if (!userStore.isExpired) {
    // 已登录
    navigateTo('/dashboard')
  }
})
</script>
<template>
  <p :style="{ visibility: !!isTips ? 'visible' : 'hidden' }" class="feedback">
    {{ tips }}
  </p>
  <div class="form-container">
    <div class="input-group">
      <AuthInput
        v-model="email"
        icon-class="i-solar-user-circle-linear"
        type="text"
        name="email"
        placeholder="邮箱"
        @blur="isTips = doValidate()"
      />
    </div>
    <div class="input-group">
      <AuthInput
        v-model="password"
        icon-class="i-solar-lock-password-linear"
        type="password"
        name="password"
        placeholder="密码"
        @blur="isTips = doValidate()"
      />
    </div>
    <div class="mt-15">
      <button class="button" :disabled="pending || disabled" @click="doLogin">
        登 录
        <div v-show="pending" class="loading"></div>
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.feedback {
  @apply text-pink-600 text-center text-sm font-bold;
}

.form-container {
  @apply px-2 mt-8;
}

.input-group {
  @apply mb-4;
}

.button {
  @apply border-0 block w-full rounded-2 py-4 bg-purple-600 text-white transition-all duration-300 ease-in-out;
  @apply hover:bg-purple-500 hover:cursor-pointer;
  @apply disabled:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed;

  .loading {
    @apply inline-block ml-2 i-line-md-loading-loop;
  }
}
</style>
