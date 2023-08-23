<script setup lang="ts">
import {
  SwapOutlined,
  SearchOutlined,
  SelectOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{
  isPolled: boolean
}>()

const marksStore = useMarksStore()

const isExpandCommentInput = ref(false)
</script>
<template>
  <div class="actions-container">
    <template v-if="!props.isPolled">
      <p class="tips">在考察此句的内容、情感、结构后，请您对此句做出判断：</p>
      <!-- 标记选择框 -->
      <a-select
        mode="multiple"
        :style="{ width: '100%' }"
        placeholder="请选择您对此句的看法，部分选项会展示给其他审核员以辅助审核（选填，若选择“需要修改”则为必填）"
      >
        <a-select-option v-for="i in marksStore.marks" :key="i.id">
          {{ i.text }}
        </a-select-option>
      </a-select>
      <!-- 评论框 -->
      <a-textarea
        v-show="isExpandCommentInput"
        placeholder="请输入您对于此句子的看法或建议，不超过 1000 字。（选填，若选择“需要更改”则为必填）"
        :rows="2"
        class="mb-xxs"
      />
      <div class="actions">
        <div class="main-actions">
          <a-button type="primary"> 批准 </a-button>
          <a-button> 驳回 </a-button>
          <a-button> 需要更改 </a-button>
        </div>
        <div class="md:flex-1"></div>
        <div class="tool-actions">
          <a-tooltip placement="bottom">
            <template #title> 显示/隐藏输入框 </template>
            <a-button
              shape="circle"
              :icon="h(SwapOutlined)"
              @click="isExpandCommentInput = !isExpandCommentInput"
            />
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template #title> 查看此句在库内是否重复 </template>
            <a-button shape="circle" :icon="h(SelectOutlined)" />
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template #title> 使用搜索引擎搜索此句 </template>
            <a-button shape="circle" :icon="h(SearchOutlined)" />
          </a-tooltip>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="tips">您已对此句做出评判，但您可以：</p>
      <a-button type="primary"> 撤回意见 </a-button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.actions-container {
  @apply mt-3;

  .tips {
    @apply text-base text-cyan-500;
  }

  .ant-select {
    @apply mb-3;
  }

  .actions {
    @apply block md:flex mt-2;

    .main-actions {
      @apply flex justify-between md:block;

      button.ant-btn {
        @apply mr-2 my-1;
      }
    }

    .tool-actions {
      @apply flex justify-end md:block;

      button.ant-btn {
        @apply mt-3  mx-1 md:my-1;
      }
    }
  }
}
</style>
