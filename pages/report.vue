<template>
  <a-row type="flex" justify="start">
    <a-col
      :md="{ span: 12, offset: 6 }"
      :sm="{ span: 20, offset: 2 }"
      :xs="{ span: 22, offset: 1 }"
    >
      <a-back-top />
      <a-card class="mt-l poll-report">
        <template #title>
          <div class="report-title">您的投票报告</div>
        </template>
        <a-list item-layout="vertical" size="large" :data-source="list">
          <a-list-item slot="renderItem" key="index" slot-scope="item">
            <div class="report-item-header">
              <span class="report-item-id">#{{ item.id }}</span>
              <span class="report-item-operated-at"
                >操作于：{{ formatTime(item.created_at) }}</span
              >
            </div>
            <ul :style="{ margin: 0, padding: 0, 'list-style': 'none' }">
              <template v-if="getPollSentence(item)">
                <div
                  class="text-wrapper sentence"
                  v-text="xss(getPollSentence(item).hitokoto)"
                />
                <li>标识：{{ item.sentence_uuid }}</li>
                <li>来源：{{ getPollSentence(item).from }}</li>
                <li>作者：{{ getPollSentence(item).from_who || '未填写' }}</li>
                <li>分类：{{ formatType(getPollSentence(item).type) }}</li>
                <li>提交者：{{ getPollSentence(item).creator }}</li>
              </template>
              <template v-else>
                <li>标识：{{ item.sentence_uuid }}</li>
                <li><i>句子消失不见啦！</i></li>
              </template>
              <li>
                投票状态：<em
                  ><b :style="{ color: '#ef8719' }">{{
                    formatStatus(item.poll.status)
                  }}</b></em
                >
              </li>
              <li>
                投票记录：您投了
                <b :style="{ color: '#1a9e0f' }">{{
                  formatPollType(item.type)
                }}</b>
                <i>{{ item.point }}</i> 票
              </li>
              <li>
                您的标记：<template
                  v-if="Array.isArray(item.marks) && item.marks.length > 0"
                >
                  <a-tag
                    v-for="(mark, index) in item.marks"
                    :key="index"
                    :color="formatMarkColor(mark)"
                    class="report-mark"
                  >
                    {{ formatMark(mark) }}
                  </a-tag>
                </template>
                <template v-else> 未填写 </template>
              </li>
              <li>
                您的评论（仅管理员可见）：<span class="poll-comment">{{
                  item.comment || '未填写'
                }}</span>
              </li>
              <li v-if="item.status !== 1 || user.role === '管理员'">
                <b
                  >投票结果：批准 {{ item.poll.accept }} 票，驳回
                  {{ item.poll.reject }} 票，需要更改
                  {{ item.poll.need_edited }} 票</b
                >
              </li>
            </ul>
          </a-list-item>
        </a-list>
      </a-card>
      <a-row type="flex" justify="center" class="mt-s">
        <a-pagination
          v-model="currentPage"
          :total="total"
          :page-size.sync="pageSize"
        />
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import moment from 'moment'
import xss from 'xss'
const scrollTopSmooth = function (position) {
  // 不存在原生`requestAnimationFrame`，用`setTimeout`模拟替代
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (cb) {
      return setTimeout(cb, 17)
    }
  }
  // 当前滚动高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // step
  const step = function () {
    const distance = position - scrollTop
    scrollTop = scrollTop + distance / 5
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, position)
    } else {
      window.scrollTo(0, scrollTop)
      requestAnimationFrame(step)
    }
  }
  step()
}

export default {
  async asyncData({ app, store }) {
    const pageSize = 15
    const queue = []
    const token = store.state.token.token || app.$cookies.get('token')
    queue.push(
      app.$axios.get(
        `https://poll.hitokoto.cn/v1/user/result/poll/${token}?limit=${pageSize}`,
      ),
    ) // 获取投票结果
    queue.push(app.$axios.get(`https://poll.hitokoto.cn/v1/user/${token}`))
    queue.push(app.$axios.get(`https://poll.hitokoto.cn/v1/mark/${token}`))
    const result = await Promise.all(queue)
    return {
      // logs: result[0].data.Data,
      user: result[1].data.Data[0],
      total: result[0].data.Data[0].total,
      list: result[0].data.Data[0].collection,
      pageSize,
      pollMark: result[2].data.Data,
    }
  },
  data() {
    return {
      currentPage: 1,
    }
  },
  head() {
    return {
      title: '结果与记录 | 一言审核员中心',
    }
  },
  computed: {
    token() {
      return this.$store.state.token.token
    },
    markList() {
      const select = JSON.parse(JSON.stringify(this.pollMark))
      select.map((v) => {
        v.value = v.id
        return v
      })
      return select
    },
  },
  watch: {
    currentPage(v) {
      const offset = (v - 1) * 15
      this.$axios
        .get(
          `https://poll.hitokoto.cn/v1/user/result/poll/${this.token}?limit=${this.pageSize}&offset=${offset}`,
        )
        .then((response) => {
          scrollTopSmooth(0)
          return response
        })
        .then(({ data }) => {
          this.total = data.Data[0].total
          this.list = data.Data[0].collection
        })
    },
  },
  methods: {
    xss(html, options) {
      return xss(html, options)
    },
    formatStatus(statusNumber) {
      const desc = []
      desc[1] = '进行中'
      desc[2] = '处理中（停止投票）'
      desc[100] = '投票暂停'
      desc[101] = '投票关闭'
      desc[200] = '已入库'
      desc[201] = '已驳回'
      desc[202] = '需要修改'
      return desc[statusNumber]
    },
    formatTime(input) {
      return moment(input).format('YYYY-MM-DD HH:mm')
    },
    formatPollType(input) {
      const output = []
      output[1] = '批准'
      output[2] = '驳回'
      output[3] = '需要更改'
      output[4] = '需要用户补充投票'
      return output[input] || '未知操作'
    },
    formatType(input) {
      const output = {
        a: '动画',
        b: '漫画',
        c: '游戏',
        d: '文学',
        e: '原创',
        f: '来自网络',
        g: '其他',
        h: '影视',
        i: '诗词',
        j: '网易云音乐',
        k: '哲学',
        l: '抖机灵（笑话，脑筋急转弯，段子等）',
      }

      return output[input] || '未知分类'
    },
    getPollSentence(data) {
      if (data.pending) {
        return data.pending
      } else if (data.refuse) {
        return data.refuse
      } else if (data.sentence) {
        return data.sentence
      }
      return false
    },
    formatMark(markId) {
      return this.markList[markId - 1]
        ? this.markList[markId - 1].text
        : '未知标记'
    },
    formatMarkColor(markId) {
      const mark = this.markList[markId - 1]
      if (mark.level) {
        if (mark.level === 'danger') {
          return 'red'
        } else if (mark.level === 'warning') {
          return 'orange'
        } else if (mark.level === 'info') {
          return 'blue'
        }
        return null
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="scss">
.report-title {
  font-weight: 600;
}

.poll-comment {
  font-weight: 600;
}

.poll-report {
  .ant-card-body {
    padding-top: 0;
  }

  .ant-list {
    color: rgba(0, 0, 0, 0.8);
  }
}

.report-item-header {
  display: flex;
  align-items: center;

  .report-item-id {
    flex: 1;
    font-size: 1.6em;
  }

  .report-item-operated-at {
    justify-self: flex-end;
  }
}
</style>
