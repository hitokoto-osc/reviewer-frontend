<script lang="ts" setup>
import type { PopoverAction } from 'vant'
import type { AccountMenuItem } from './Container.vue'

const props = defineProps<{
  items: AccountMenuItem[]
}>()
const actions = computed(() => {
  return props.items.map(
    (item) =>
      ({
        text: item.text,
        icon: item.icon
      }) as PopoverAction
  )
})

const onSelect = (item: PopoverAction) => {
  const o = props.items.find((i) => i.text === item.text)
  if (!o) return
  if (o.href) {
    window.open(o.href, '_blank')
  } else if (o.onClick) {
    o.onClick()
  } else if (o.to) {
    navigateTo(o.to)
  }
}
</script>
<template>
  <div class="mobile-menu-wrapper">
    <van-popover
      :actions="actions"
      placement="bottom-end"
      :offset="[-5, 10]"
      @select="onSelect"
    >
      <template #reference>
        <LayoutHeaderAccountInfo class="account-mobile-menu" />
      </template>
    </van-popover>
  </div>
</template>

<style lang="scss">
.account-mobile-menu {
  @apply flex md:hidden mr-2;
}
</style>
