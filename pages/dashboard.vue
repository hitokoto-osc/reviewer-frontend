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
      <a-card class="mt-l">
        <img
          slot="cover"
          alt="Banner"
          src="https://piccdn.freejishu.com/images/2016/04/27/15fc1a3bafc5d8b6fad2f0557efb232c.jpg"
        >
        <a-card-meta>
          <template
            slot="title"
          >
            <h3>欢迎您使用审核员服务（内测版）</h3>
          </template>
          <template
            slot="description"
          >
            <p>由于本系统还处于研发阶段，因此部分功能还未实现。您可以通过“开始审核”页面下方的“发起新投票”按钮获取一个新的句子以开始审核，点击句子下方的相关按钮提交您的审核意见。</p>
            <p>
              <strong>如果您发现您此时无投票权限，可以通过 QQ 群组：734129102，申请权限。</strong>
              <br>
              请注意：系统会实时计算活跃审核员数目以生成基准票数；为了保护高阶审核员的权益，系统会自动 <strong>暂停</strong> 超过 14 天未操作过投票的审核员的投票权力。如果您因事，不幸被系统暂停了权限，可以再次向我们申请以开通权限。<strong>您的记录不会丢失。</strong>
            </p>
          </template>
        </a-card-meta>
      </a-card>

      <a-card
        class="mt-xl avatar-card"
      >
        <a-avatar class="card-top-avatar" :size="90" :src="getGravatarURLByEmail(user.email)" />
        <div class="mt-xs">
          <hr class="list">
          <div class="list-child">
            标识：{{ user.id }}
          </div>
          <hr class="list">
          <div class="list-child">
            名称：{{ user.name }}
          </div>
          <hr class="list">
          <div class="list-child">
            邮箱：{{ user.email }}
          </div>
          <hr class="list">
          <div class="list-child">
            身份：{{ user.role }}
          </div>
          <hr class="list">
          <div class="list-child">
            投票统计：
            <ul>
              <li>共计 {{ user.poll.points }} 票</li>
              <li>批准 {{ user.poll.accept }} 票</li>
              <li>驳回 {{ user.poll.reject }} 票</li>
              <li>需要修改 {{ user.poll.need_edited }} 票</li>
            </ul>
          </div>
          <hr class="list">
          <div class="list-child">
            建档时间：{{ formatTime(user.created_at) }}
          </div>
          <hr class="list">
          <div class="list-child" style="margin-bottom: 8px;">
            最后操作：{{ formatTime(user.updated_at) }}
          </div>
        </div>
        <template slot="actions" class="ant-card-actions">
          <a-tooltip placement="bottom">
            <template slot="title">
              用户设置
            </template>
            <a-icon type="setting" @click="viewSetting" />
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template slot="title">
              开始审核
            </template>
            <a-icon type="solution" @click="viewPoll" />
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template slot="title">
              结果与记录
            </template>
            <a-icon type="calendar" @click="viewResultAndLog" />
          </a-tooltip>
        </template>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import moment from 'moment'
import md5 from 'md5'
// import _ from 'lodash'
export default {
  async asyncData ({ app, store }) {
    const token = store.state.token.token || app.$cookies.get('token')
    const queue = []
    const user = app.$axios.get(`https://poll.hitokoto.cn/v1/user/${token}`)
    queue.push(user)
    const data = await Promise.all(queue)
    return {
      user: data[0].data.Data[0]
    }
  },
  data () {
    return {
    }
  },
  computed: {
    getToken () {
      return this.$store.state.token.token || this.$cookies.get('token')
    }
  },
  methods: {
    formatTime (input) {
      return moment(input).format('YYYY-MM-DD HH:mm')
    },
    viewSetting () {
      window.alert('尚未开放')
    },
    viewResultAndLog () {
      this.$router.push('report')
    },
    viewPoll () {
      this.$router.push('poll')
    },
    getGravatarURLByEmail (email) {
      return this.getGravatarURLByHash(md5(email))
    },
    getGravatarURLByHash (hash) {
      return 'https://fdn.geekzu.org/avatar/' + hash + '?d=mm&s=640'
    }
  },
  head () {
    return {
      title: '控制中心 | 一言审核员中心'
    }
  }
}
</script>
<style lang="scss">
.list {
  height: 0;
  border: 0;
  border-bottom: 1px solid #e8e8e8;
}

.list-child {
  padding: 0.3rem 1.25rem;
}

.avatar-card {
  .ant-card-body {
    padding: 0;
    padding-top: 24px;
  }
}
</style>
