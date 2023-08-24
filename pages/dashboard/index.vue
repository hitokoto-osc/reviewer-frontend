<script setup lang="ts">
useHead({
  title: '控制台'
})
import dayjs from 'dayjs'
// const score = ref(0)
// useCountTo(score, 10012300, 0.1)
const now = dayjs()
const userStore = useUserStore()
</script>
<template>
  <div>
    <h1>{{ userStore.user?.name }}，{{ greetingByTime(now) }}！</h1>
    <p>
      今日，{{ now.format('YYYY 年 MM 月 DD 日，dddd') }}，欢迎回到审核员中心。
    </p>

    <a-row :gutter="24" class="mt-13">
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard icon="i-solar-user-id-bold-duotone" color="bg-teal-200">
          <a-statistic title="身份" :value="userStore.role"> </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-money-bag-bold-duotone"
          color="bg-orange-200"
        >
          <a-statistic title="积分" :value="userStore.user?.poll.score">
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-cup-star-bold-duotone"
          color="bg-amber-200"
        >
          <a-statistic title="参与" :value="userStore.user?.poll.count">
            <template #suffix> 次 </template>
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard icon="i-solar-cat-bold-duotone" color="bg-gray-200">
          <a-statistic
            title="赞同"
            :value="userStore.user?.poll.points.approved"
          >
            <template #suffix> 票 </template>
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-forbidden-bold-duotone"
          color="bg-red-200"
          rotate="rotate-270"
        >
          <a-statistic
            title="驳回"
            :value="userStore.user?.poll.points.rejected"
          >
            <template #suffix> 票 </template>
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-document-add-bold-duotone"
          color="bg-indigo-200"
        >
          <a-statistic
            title="需要修改"
            :value="userStore.user?.poll.points.need_modify"
          >
            <template #suffix> 票 </template>
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-ghost-smile-bold-duotone"
          color="bg-sky-200"
        >
          <a-statistic
            title="采纳率"
            :value="(userStore.user?.poll.adoption_rate || 0) * 100"
            :precision="2"
          >
            <template #suffix> % </template>
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-hashtag-circle-bold-duotone"
          color="bg-cyan-200"
        >
          <a-statistic title="待审" :value="0">
            <template #suffix> 句 </template>
          </a-statistic>
        </DashboardCard>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8">
        <DashboardCard
          icon="i-solar-volleyball-bold-duotone"
          color="bg-gradient-to-r from-indigo-200 from-10% via-sky-200 via-30% to-emerald-200 to-90%"
        >
          <a-statistic
            title="最后活跃"
            :value="dayjs(userStore.user?.poll.updated_at).fromNow()"
            :precision="2"
          >
          </a-statistic>
        </DashboardCard>
      </a-col>
    </a-row>
  </div>
</template>
