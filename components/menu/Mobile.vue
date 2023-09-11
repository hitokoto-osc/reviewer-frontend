<script lang="ts" setup>
import type { PopoverAction } from 'vant'
import type { Item } from './'

const props = defineProps<{
  items: Item[]
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
// FIXME: 如果 Vant 添加了点击事件，需要将以下方法移除
// 由于 Vant 不支持鼠标、指针事件，因此只能模拟一个事件传入进去
const { x, y } = usePointer()
const onSelect = (item: PopoverAction) => {
  const o = props.items.find((i) => i.text === item.text)
  if (!o) return
  if (o.href) {
    window.open(o.href, '_blank')
  } else if (o.onClick) {
    const event = new PointerEvent('pointerup', {
      clientX: x.value,
      clientY: y.value
    })
    o.onClick(event)
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
        <slot />
      </template>
    </van-popover>
  </div>
</template>

<style lang="scss">
.mobile-menu-wrapper,
.account-mobile-menu {
  @apply flex md:hidden mr-2;
}
</style>
