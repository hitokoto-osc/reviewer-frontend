<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
const username = ref('')
const password = ref('')
</script>
<template>
  <div class="form-container">
    <div class="input-group">
      <AuthInput
        v-model="username"
        icon-class="i-solar-user-circle-linear"
        type="text"
        name="username"
        placeholder="用户名"
      />
    </div>
    <div class="input-group">
      <AuthInput
        v-model="password"
        icon-class="i-solar-lock-password-linear"
        type="password"
        name="password"
        placeholder="密码"
      />
    </div>
    <div class="mt-15">
      <button class="button">登 录</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form-container {
  @apply px-2 mt-8;
}

.input-group {
  @apply mb-4;
}

.button {
  @apply border-0 block w-full rounded-2 py-4 bg-purple-600 hover:bg-purple-500 hover:cursor-pointer text-white transition-all duration-300 ease-in-out;
}
</style>
