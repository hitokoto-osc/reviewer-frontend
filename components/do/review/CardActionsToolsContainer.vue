<script setup lang="ts">
import type { Item } from '@/components/menu'
// import IconRoundSortHorizontalLinea from '~icons/solar/round-sort-horizontal-linear'
const emit = defineEmits<{
  switchCommentInput: []
  viewComments: []
  doSwiftModify: []
  doWebSearch: []
  doLocalSearch: []
}>()

const items: Item[] = reactive([
  {
    text: '切换回复框',
    onClick: () => {
      emit('switchCommentInput')
    }
  },
  {
    text: '查看评论',
    onClick: () => {
      emit('viewComments')
    }
  },
  {
    text: '句库查重',
    onClick: () => {
      emit('doLocalSearch')
    }
  },
  {
    text: '网络搜索',
    onClick: () => {
      emit('doWebSearch')
    }
  },
  {
    text: '快捷修改',
    onClick: () => {
      emit('doSwiftModify')
    }
  }
])
</script>
<template>
  <MenuContainer :items="items">
    <DoReviewCardActionsToolsButton />
  </MenuContainer>
</template>
