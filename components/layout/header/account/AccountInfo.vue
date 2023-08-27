<script lang="ts" setup>
const props = defineProps<{
  class?: string | Record<string, boolean>
}>()
const userStore = useUserStore()
</script>

<template>
  <div class="account" :class="props.class">
    <span class="username"> {{ userStore.user?.name }} </span>
    <div class="avatar-wrapper">
      <img
        :src="getAvatarURL(userStore.user?.email || '')"
        draggable="false"
        class="avatar"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account {
  @apply w-fit items-center px-3 py-1 hover:bg-gray-100 rounded-2;

  .username {
    @apply hidden md:inline text-sm mr-3;
  }

  .avatar-wrapper {
    @apply h-11 w-11 p-0.5 flex items-center justify-center rounded-full border-gray-200 border-1 border-solid;

    .avatar {
      @apply h-full w-full rounded-full;

      -webkit-user-drag: none;
    }
  }
}
</style>
