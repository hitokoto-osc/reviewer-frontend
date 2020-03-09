<template>
  <a-row
    type="flex"
    justify="start"
  >
    <a-col
      :md="{ span: 12, offset: 6 }"
      :sm="{ span: 20, offset: 2 }"
      :xs="{ span: 22, offset: 1 }"
    >
      <a-back-top />
      <a-card
        class="mt-l poll"
      >
        <template v-slot:title>
          <div class="review-title">
            正在进行中的投票
          </div>
        </template>
        <a-list item-layout="vertical" size="large" :data-source="pollList">
          <a-list-item slot="renderItem" key="index" slot-scope="item, index">
            <template>
              <div class="poll-item-header">
                <span class="poll-item-id">#{{ item.id }}</span>
                <span class="poll-item-operated-at">发起于：{{ formatTime(item.created_at) }}</span>
              </div>

              <div class="text-wrapper sentence" style="font-size: 1.65em;" v-text="item.pending.hitokoto" />
              <ul
                class="mb-2"
                style=" margin: 0; padding: 0; list-style: none;"
              >
                <li>标识：{{ item.sentence_uuid }} </li>
                <li>
                  来源：<span class="text-wrapper">{{ item.pending.from }}</span>
                </li>
                <li>
                  作者：<span class="text-wrapper">{{ item.pending.from_who || '未填写' }}</span>
                </li>
                <li>分类：{{ formatType(item.pending.type) }}</li>
                <li>
                  提交者：<span class="text-wrapper">{{ item.pending.creator }}</span>
                </li>
                <li v-if="item.marks">
                  <b>此句被标记为：</b>
                  <template v-if="Array.isArray(item.marks) && item.marks.length > 0">
                    <a-tag
                      v-for="(mark, i) in item.marks"
                      v-show="!!formatMarkColor(mark)"
                      :key="i"
                      :color="formatMarkColor(mark)"
                      class="report-mark"
                    >
                      {{ formatMark(mark) }}
                    </a-tag>
                  </template>
                </li>
                <li v-if="item.isPolled[0]">
                  投票记录：您投了 <b style="color: #1a9e0f;">{{ formatPollType(item.isPolled[2]) }}</b> <i>{{ item.isPolled[1] }}</i> 票
                </li>
                <li v-if="user.role === '管理员'">
                  <b>当前投票：批准 {{ item.accept }} 票，驳回 {{ item.reject }} 票，需要更改 {{ item.need_edited }} 票</b>
                </li>
              </ul>
              <div v-if="!item.isPolled[0]" class="mt-xxs">
                <h3 style="color: rgb(159, 71, 0);">
                  在考察此句的内容、情感、结构后，请您对此句做出判断：
                </h3>
                <a-select
                  v-model="markList[index]"
                  mode="multiple"
                  style="width: 100%;"
                  placeholder="请选择您对此句的看法，部分选项会展示给其他审核员以辅助审核（选填，若选择“需要修改”则为必填）"
                  class="mb-xxs"
                >
                  <a-select-option
                    v-for="i in pollSelect"
                    :key="i.value"
                  >
                    {{ i.text }}
                  </a-select-option>
                </a-select>
                <a-textarea
                  v-show="commentListDisplay[index]"
                  v-model="commentList[index]"
                  placeholder="请输入您对于此句子的看法或建议，不超过 1000 字。（选填，若选择“需要更改”则为必填）"
                  :rows="2"
                  class="mb-xxs"
                />

                <div class="poll-operator mt-xxs">
                  <div class="main-operator">
                    <a-button
                      type="primary"
                      :disabled="!!globalLock || !!requestPollLock[index]"
                      :loading="!!requestPollLock[index]"
                      @click="requestPoll(item.sentence_uuid, 1, index)"
                    >
                      批准
                    </a-button>
                    <a-button
                      :disabled="!!globalLock || !!requestPollLock[index]"
                      :loading="!!requestPollLock[index]"
                      @click="requestPoll(item.sentence_uuid, 2, index)"
                    >
                      驳回
                    </a-button>
                    <a-button
                      :disabled="!!globalLock || !!requestPollLock[index]"
                      :loading="!!requestPollLock[index]"
                      @click="requestPoll(item.sentence_uuid, 3, index)"
                    >
                      需要更改
                    </a-button>
                  </div>
                  <div class="tool-operator">
                    <a-tooltip placement="bottom">
                      <template slot="title">
                        显示/隐藏输入框
                      </template>
                      <a-button
                        shape="circle"
                        icon="swap"
                        @click="$set(commentListDisplay, index, !commentListDisplay[index])"
                      />
                    </a-tooltip>

                    <a-tooltip placement="bottom">
                      <template slot="title">
                        使用搜索引擎搜索此句
                      </template>
                      <a-button
                        shape="circle"
                        icon="search"
                        @click="searchSentence(item.pending.hitokoto)"
                      />
                    </a-tooltip>
                  </div>
                </div>
              </div>
              <div v-else class="mt-xxs">
                <h3 style="color: rgb(159, 71, 0);" class="mb-xs">
                  您已对此句做出评判，但您可以：
                </h3>
                <a-button
                  type="primary"
                  :loading="!!requestPollLock[index]"
                  :disabled="!!globalLock || !!requestPollLock[index]"
                  @click="requestCancel(item.sentence_uuid, index)"
                >
                  撤回意见
                </a-button>
              </div>
            </template>
          </a-list-item>
        </a-list>
        <hr class="list" style="margin-bottom: 20px;">
        <a-button
          type="primary"
          shape="round"
          icon="plus-circle"
          :disabled="!!globalLock || !!refreshLock || !!requestNewPollLock"
          :loading="!!requestNewPollLock"
          @click="requestNewPoll"
        >
          发起新投票
        </a-button>
        <a-button
          shape="round"
          icon="retweet"
          :disabled="!!globalLock || !!refreshLock || !!requestNewPollLock"
          :loading="!!globalLock"
          @click="updatePollList"
        >
          刷新队列
        </a-button>
      </a-card>
    </a-col>
    <notifications
      group="request-result"
      position="bottom right"
    />
    <notifications
      group="top-notification"
      position="top center"
    />
    <search-modal :visible="searchModal" :sentence="searchSentenceText" @on-change-visible="changeVisible" />
  </a-row>
</template>
<script>
import moment from 'moment'
import _ from 'lodash'
import SearchModal from '../components/SearchModal.vue'

export default {
  components: {
    SearchModal
  },
  async asyncData ({ app, store }) {
    const token = store.state.token.token
    const queue = []
    const poll = app.$axios.get(`https://poll.hitokoto.cn/v1/poll/get/${token}?need_polled_flag=true`)
    const user = app.$axios.get(`https://poll.hitokoto.cn/v1/user/${token}`)
    queue.push(poll, user)
    const data = await Promise.all(queue)
    return {
      pollList: data[0].data.Data,
      user: data[1].data.Data[0]
    }
  },
  data () {
    return {
      requestNewPollLock: false,
      refreshLock: false,
      globalLock: false,
      requestPollLock: [],
      commentList: [],
      markList: [],
      commentListDisplay: [],
      searchModal: false,
      searchSentenceText: '',
      pollSelect: [
        { value: 1, text: '绝妙好词，字字珠玑。' },
        { value: 2, text: '不符合社会主义核心价值观', level: 'danger' },
        { value: 3, text: '语言低俗/庸俗/恶劣', level: 'danger' },
        { value: 4, text: '没有修改价值', level: 'warning' },
        { value: 5, text: '句子过长', level: 'info' },
        { value: 6, text: '存在标点符号缺失/错误使用', level: 'danger' },
        { value: 7, text: '存在换行/空格现象', level: 'danger' },
        { value: 8, text: '来源错误或误用', level: 'warning' },
        { value: 9, text: '作者错误或误用', level: 'warning' },
        { value: 10, text: '作者/来源填写有误（位置不对）', level: 'info' },
        { value: 11, text: '句子存在错误', level: 'danger' }
      ],
      // eslint-disable-next-line vue/no-reserved-keys
      _timer () { }
    }
  },
  computed: {
    getToken () {
      return this.$store.state.token.token
    }
  },
  watch: {

  },
  mounted () {
    // this.timer()
  },
  destroyed () {
    clearInterval(this._timer)
  },
  methods: {
    formatTime (input) {
      return moment(input).format('YYYY-MM-DD HH:mm')
    },
    formatPollType (input) {
      const output = []
      output[1] = '批准'
      output[2] = '驳回'
      output[3] = '需要更改'
      output[4] = '需要用户补充投票'
      return output[input] || '未知操作'
    },
    formatType (input) {
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
        l: '抖机灵（笑话，脑筋急转弯，段子等）'
      }

      return output[input] || '未知分类'
    },
    getPollSentence (data) {
      if (data.pending) {
        return data.pending
      } else if (data.refuse) {
        return data.refuse
      } else if (data.sentence) {
        return data.sentence
      }
      return false
    },
    async requestPoll (sentenceUUID, method, index) {
      if (this.requestPollLock[index]) { return }
      // 如果投票需要修改，检测是否填写评论
      if (method === 3 && !(this.commentList[index] || (Array.isArray(this.markList[index]) && this.markList[index].length !== 0))) {
        this.$notify({
          type: 'warn',
          group: 'request-result',
          title: '无法进行投票操作',
          text: '由于未填写原因，因此您无法对句子：' + sentenceUUID + ' 提交“需要修改”意见。'
        })
        return
      }
      this.$set(this.requestPollLock, index, true)
      this.refreshLock = true
      const token = this.$store.state.token.token
      const formData = new FormData()
      formData.append('sentence_uuid', sentenceUUID)
      formData.append('method', method)
      if (this.commentList[index]) {
        formData.append('comment', this.commentList[index])
      }
      if (this.markList[index] && this.markList[index].length > 0) {
        formData.append('marks', this.markList[index])
      }
      const { data } = await this.$axios.post(`https://poll.hitokoto.cn/v1/poll/${token}`, formData)
      if (data.Code === 403) {
        this.$notify({
          type: 'warn',
          group: 'request-result',
          title: '无法进行投票操作',
          text: '此令牌权限不足以对句子：' + sentenceUUID + ' 进行投票。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code === -2) {
        this.$notify({
          type: 'error',
          group: 'request-result',
          title: '无法进行投票操作',
          text: '您已经对句子：' + sentenceUUID + ' 投过票了，请勿重复投票。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code === -4) {
        this.$notify({
          type: 'error',
          group: 'request-result',
          title: '无法进行投票操作',
          text: '句子：' + sentenceUUID + ' 还未开放投票。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code === -3) {
        this.$notify({
          type: 'error',
          group: 'request-result',
          title: '无法进行投票操作',
          text: '句子：' + sentenceUUID + ' 要求您必须<b>填写理由</b>。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code !== 200) {
        this.$notify({
          type: 'error',
          group: 'request-result',
          title: '无法进行投票操作',
          text: '对句子：' + sentenceUUID + ' 发起投票时出现未知错误，建议联系管理员。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      }
      // 成功了
      const point = data.Data[0].pollData.point
      if (method === 1) { // 更新投票數據
        this.pollList[index].accept = this.pollList[index].accept + point
      } else if (method === 2) {
        this.pollList[index].reject = this.pollList[index].reject + point
      } else if (method === 3) {
        this.pollList[index].need_edited = this.pollList[index].need_edited + point
      }
      // 更新投票状态
      this.pollList[index].isPolled = [true, point, method]

      // 更新用戶數據
      this.user.poll.points += point
      if (method === 1) {
        this.user.poll.accept += point
      } else if (method === 2) {
        this.user.poll.reject += point
      } else if (method === 3) {
        this.user.poll.need_edited += point
      }
      this.user.updated_at = data.Data[0].updated_at
      this.$notify({
        type: 'success',
        group: 'request-result',
        title: '成功进行投票操作',
        text: '成功对句子：' + sentenceUUID + ' 投票，投票数据已经更新。'
      })
      this.$set(this.requestPollLock, index, false)
      this.refreshLock = false
    },
    async requestCancel (sentenceUUID, index) {
      if (this.requestPollLock[index]) { return }
      this.$set(this.requestPollLock, index, true)
      this.refreshLock = true
      const token = this.$store.state.token.token
      const { data } = await this.$axios.get(`https://poll.hitokoto.cn/v1/poll/cancel/${token}?sentence_uuid=${sentenceUUID}`)
      if (data.Code === -3) {
        this.$notify({
          type: 'danger',
          group: 'request-result',
          title: '无法撤回投票',
          text: '您尚未对此投票发表意见，无需撤回。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code === -4) {
        this.$notify({
          type: 'danger',
          group: 'request-result',
          title: '无法撤回投票',
          text: '此投票已结束投票阶段，无法撤回投票。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code === -6) {
        this.$notify({
          type: 'danger',
          group: 'request-result',
          title: '无法撤回投票',
          text: '投票不存在。可能是系统问题，建议联系管理员。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      } else if (data.Code !== 200) {
        window.console.log(data)
        this.$notify({
          type: 'danger',
          group: 'request-result',
          title: '无法撤回投票',
          text: '未知状态码。可能是系统问题，建议联系管理员。'
        })
        this.$set(this.requestPollLock, index, false)
        this.refreshLock = false
        return
      }
      window.console.log(data)
      // 更新数据
      const point = data.Data[0].cancelData.point
      const method = data.Data[0].cancelData.type
      // window.console.log(point, method)
      if (method === 1) { // 更新投票數據
        this.pollList[index].accept = this.pollList[index].accept - point
      } else if (method === 2) {
        this.pollList[index].reject = this.pollList[index].reject - point
      } else if (method === 3) {
        this.pollList[index].need_edited = this.pollList[index].need_edited - point
      }
      // 更新投票状态
      this.pollList[index].isPolled = [false]

      // 更新用戶數據
      this.user.poll.points = this.user.poll.points - point
      if (method === 1) {
        this.user.poll.accept = this.user.poll.accept - point
      } else if (method === 2) {
        this.user.poll.reject = this.user.poll.reject - point
      } else if (method === 3) {
        this.user.poll.need_edited = this.user.poll.need_edited - point
      }
      this.user.updated_at = data.Data[0].updated_at
      this.$notify({
        type: 'success',
        group: 'request-result',
        title: '成功撤回投票',
        text: '成功对句子：' + sentenceUUID + ' 撤回投票，投票数据已经更新。'
      })
      this.$set(this.requestPollLock, index, false)
      this.refreshLock = false
    },

    async requestNewPoll () {
      if (this.requestNewPollLock) { return }
      this.requestNewPollLock = true
      const token = this.$store.state.token.token
      const { data } = await this.$axios.get(`https://poll.hitokoto.cn/v1/poll/new/${token}`)
      if (data.Code === 403) {
        this.$notify({
          type: 'warn',
          group: 'request-result',
          title: '无法发起新投票',
          text: '此令牌虽然已经证明了您的身份，但是您当前无权发起投票。'
        })
        this.requestNewPollLock = false
        return
      } else if (data.Code === -1) {
        this.$notify({
          type: 'error',
          group: 'request-result',
          title: '无法发起新投票',
          text: '当前进行中的投票已经到达上限，暂时无法开启新投票。'
        })
        this.requestNewPollLock = false
        return
      } else if (data.Code === -2) {
        this.$notify({
          type: 'info',
          group: 'request-result',
          title: '无法发起新投票',
          text: '当前没有句子等待投票。十分感谢各位审核员的努力，一言有你才精彩！'
        })
        this.requestNewPollLock = false
        return
      }
      this.$notify({
        type: 'success',
        group: 'request-result',
        title: '您已成功发起新投票',
        text: '待投票队列还剩 ' + data.Data[0].remain_pending + '个。\n已将新投票添加到投票队列，您现在可以开始投票了。'
      })
      data.Data[0].isPolled = [false] // 手动添加 flag
      if (this.pollList.length === 0) { // 修复 Vue 监听问题
        this.pollList = [data.Data[0]]
      } else if (!_.find(this.pollList, { sentence_uuid: data.Data[0].sentence_uuid })) { // 尝试修复同步问题
        this.pollList.push(data.Data[0])
      }
      this.requestNewPollLock = false
    },
    timer () {
      this.$notify({
        // type: 'success',
        group: 'request-result',
        title: '已激活自动刷新任务',
        text: '为了保障数据的及时、有效，每 30 秒我们会更新投票队列。当前有 ' + this.pollList.length + ' 个句子正在投票。'
      })
      this._timer = setInterval(this.updatePollList, 1000 * 30)
    },
    updatePollList () {
      this.refreshLock = true
      this.globalLock = true
      const _this = this
      const token = this.$store.state.token.token
      this.$axios.get(`https://poll.hitokoto.cn/v1/poll/get/${token}?need_polled_flag=true`)
        .then(({ data }) => {
          if (data.Code !== 200) {
            _this.refreshLock = false
            _this.globalLock = false
            throw new Error(`${data.Code}：${data.Message}`)
          }
          // 验证数据
          const result = data.Data
          result.map((v) => {
            const r = _.find(_this.pollList, { sentence_uuid: v.sentence_uuid }) // 得到老列表的参数
            // 对比时间
            if (r) {
              const rTS = new Date(r.updated_at).getTime() // 本地记录更新记录的时间戳
              const vTS = new Date(v.updated_at).getTime() // 本次同步更新记录的时间戳
              if (rTS > vTS) {
                return r
              }
            }
            return v
          })
          _this.pollList = result
          _this.refreshLock = false
          _this.globalLock = false
          _this.$notify({
            type: 'success',
            group: 'request-result',
            title: '投票队列已更新',
            text: '已将投票队列数据更新，当前进行中的投票有 ' + data.Data.length + ' 个。'
          })
        })
    },
    searchSentence (sentence) {
      this.searchSentenceText = sentence
      this.searchModal = true
    },
    changeVisible (val) {
      this.searchModal = val
    },
    formatMark (markId) {
      return this.pollSelect[markId - 1] ? this.pollSelect[markId - 1].text : '未知标记'
    },
    formatMarkColor (markId) {
      const mark = this.pollSelect[markId - 1]
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
    }
  },
  head () {
    return {
      title: '审核句子 | 一言审核员中心'
    }
  }
}
</script>
<style lang="scss">
.report-title {
  font-weight: 600;
}

.poll {
  .ant-card-body {
    padding-top: 0;
    padding-bottom: 20px;
  }

  .ant-list {
    color: rgba(0, 0, 0, 0.8);
  }
}

.poll-item-header {
  display: flex;
  align-items: center;

  .poll-item-id {
    flex: 1;
    font-size: 1.6em;
  }

  .poll-item-operated-at {
    justify-self: flex-end;
  }
}

.list {
  height: 0;
  border: 0;
  border-bottom: 1px solid #e8e8e8;
}

.search-button {
  float: right;
}

.switch-button {
  float: right;
}

.poll-operator {
  display: flex;

  .main-operator {
    flex: 1;
  }

  .tool-operator {
    justify-self: end;
  }
}
</style>
