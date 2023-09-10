<script lang="ts" setup>
import darkTheme from '@/assets/echarts/theme/dark'
import { use, registerTheme } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

const props = defineProps<{
  approve: number
  reject: number
  needModify: number
}>()
registerTheme('dark', darkTheme())
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])
const colorMode = useColorMode()
provide(THEME_KEY, colorMode.value)

const option = computed(() => {
  return {
    title: {
      text: '投票概览',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['赞同', '驳回', '需要修改']
    },
    color: ['#91cc75', '#ee6666', '#fac858'],
    series: [
      {
        name: '投票',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: props.approve, name: '赞同' },
          { value: props.reject, name: '驳回' },
          { value: props.needModify, name: '需要修改' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})
</script>

<template>
  <VChart class="chart" :option="option" autoresize />
</template>
