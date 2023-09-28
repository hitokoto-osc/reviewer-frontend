<script lang="ts" setup>
const props = defineProps<{
  show: boolean
}>()
const emits = defineEmits<{
  'update:show': [value: boolean]
}>()

// 用户相关
const userStore = useUserStore()
</script>
<template>
  <div class="menu-drawer-wrapper">
    <van-popup
      :show="props.show"
      position="left"
      class="mobile-hamburger-drawer"
      @update:show="emits('update:show', $event)"
    >
      <div class="drawer-container">
        <div class="account-container">
          <NuxtImg
            :src="getAvatarURL(userStore.user?.email || '')"
            draggable="false"
            loading="lazy"
            placeholder
            class="avatar"
          />
          <div class="main">
            <span class="name"> {{ userStore.user?.name || '游客' }} </span>
            <span class="role"> {{ userStore.role }} </span>
          </div>
        </div>
        <slot />
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss">
.mobile-hamburger-drawer {
  @apply w-3/5 h-full;
  @apply dark:bg-#141414;
}
</style>

<style lang="scss" scoped>
.drawer-container {
  @apply min-h-full w-full;

  .account-container {
    @apply flex items-center h-16 py-2 w-full;
    @apply border-0 border-b-1 border-slate-100 border-solid;
    @apply dark:border-slate-800;

    .avatar {
      @apply w-10 h-10 ml-5 rounded-full;
    }

    .main {
      @apply ml-3 flex select-none flex-col justify-center;

      .name {
        @apply text-sm;
      }

      .role {
        @apply text-xs text-gray-500;
      }
    }
  }
}
</style>
