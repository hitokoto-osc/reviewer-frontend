<script setup lang="ts">
useHead({
  title: '申请权限'
})

const timeoutTick = ref(60)
const timer = ref<NodeJS.Timeout | null>(null)
onMounted(() => {
  timeoutTick.value = 60
  timer.value = setInterval(() => {
    timeoutTick.value--
    if (timeoutTick.value <= 0) {
      clearInterval(timer.value!)
      timer.value = null
    }
  }, 1000)
})

const { data } = await useUserApplyToken()
const verificationToken = computed(() => {
  return data.value?.data.verification_token || null
})

const apply = async () => {
  if (!verificationToken.value) return
  const { error } = await doApplyReviewer({
    verification_token: verificationToken.value
  })
  if (error.value || !data.value) {
    console.error(error.value)
    return
  }
  message.success('申请成功成功！即将为您跳转到首页。')
  await sleep(500)
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="score-records">
    <a-page-header title="申请权限" />
    <div class="apply-reviewer">
      <p>
        一言众裁委员会欢迎您的加入！在开始之前，我们需向您阐述众裁的基本逻辑以及必要规则。
      </p>
      <p>准备好了吗？让我们开始吧。</p>
      <h3>基本规则</h3>
      <p>
        审核系统采用 <b>投票制</b>，在票数争议不大的情况下，默认 4
        票即为通过。当票数争议过大时，我们会通过基于总票数比例的阈值来确定准入票数。
      </p>
      <p>
        默认开放了三个投票选项：<b>赞同</b>、<b>驳回</b>、<b>需要修改</b>。“需要修改”
        意味着句子在经过简单修改后能够符合审核标准。
      </p>
      <p>
        投票裁决并非即使裁决，目前每 15
        分钟会对所有进行中的投票进行一次裁决。每小时会计算一次个人采纳率。
      </p>
      <p>
        审核系统默认 <b>启用</b> 每日报告，<b>禁用</b>
        投票创建通知，投票完成通知。如有需要，请自行前往设置 <u>开启/关闭</u>。
      </p>
      <p>
        请注意：为了避免系统资源的浪费，当您 <b>不活跃时长</b> 达到了
        <b>30 天</b>，将被系统 <b>回收权限</b>。
      </p>
      <h3>系统相关</h3>
      <a
        href="https://cdn.a632079.me/assets/images/202309040813220.png"
        target="_blank"
      >
        <NuxtImg
          src="https://cdn.a632079.me/assets/images/202309040813220.png"
          draggable="false"
          class="w-full md:w-90% mx-auto block"
          loading="lazy"
          placeholder
        />
      </a>
      <p>
        审核员模块
        <a
          href="https://github.com/hitokoto-osc/reviewer-frontend"
          target="_blank"
        >
          前端
        </a>
        以及
        <a href="https://github.com/hitokoto-osc/reviewer" target="_blank">
          后端
        </a>
        都是开源的。前端采用 Nuxt 3，后端采用
        Go。如果有功能上的建议，欢迎提出或者贡献 PR。
      </p>
      <h3>审核细则</h3>
      <p>
        很显然，每个人的价值观和准入灵感都是存在差异的。因此一份共通的审核标准十分必要。我们目前将此份标准托管在语雀，您可以点击旁边的地址打开：
        <a href="https://www.yuque.com/freejishu/rfoxeq/xz3u2x" target="_blank">
          https://www.yuque.com/freejishu/rfoxeq/xz3u2x </a
        >。
      </p>
      <p>
        以上，就是全部了。我们希望您能理解并遵守这些规范。最后，再次欢迎您加入一言众裁委员。
      </p>
      <div class="copyright">
        <p>萌创团队 - 一言项目组</p>
        <p>2023 年 9 月 4 日</p>
      </div>

      <div class="actions-container">
        <a-button
          type="primary"
          :disabled="!!timeoutTick || !verificationToken"
          @click="apply"
        >
          {{ timeoutTick > 0 ? `${timeoutTick} 秒后可申请` : '同意，申请加入' }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.apply-reviewer {
  img {
    @apply w-full md:w-90% mx-auto block;
  }

  p {
    @apply text-base indent-8 underline-offset-4;
  }

  h3 {
    @apply text-lg;
  }

  .copyright {
    @apply mt-10 text-sm;

    p {
      @apply indent-0 my-1 text-right;
    }
  }

  .actions-container {
    @apply mt-10 my-5 flex justify-end;
  }
}

.ant-page-header {
  @apply mx-0 px-0;
}
</style>
