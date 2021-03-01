<template>
  <a-popover :title="sentenceInfo.uuid">
    <template slot="content">
      <p>
        分类：{{ formatType(sentenceInfo.type) }} <br />
        提交者：{{ sentenceInfo.creator }} <br />
        审核者：{{
          reviewerMapping[sentenceInfo.reviewer] || sentenceInfo.reviewer
        }}
        <br />
        提交时间：{{ formatTime(+(sentenceInfo.created_at + '000')) }}
      </p>
    </template>
    <div class="sentence-preview-block">
      <p>
        {{ sentenceInfo.hitokoto }}
      </p>
      <small>
        —— {{ sentenceInfo.from_who || '' }}「{{
          sentenceInfo.from || '未知'
        }}」
      </small>
    </div>
  </a-popover>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    sentenceInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      reviewerMapping: {
        0: '未知',
        4756: '众裁委员会',
        4711: '众裁委员会',
        1: 'freejishu',
        6: '酷儿',
        7: '皮皮',
        1044: 'a632079',
        1699: '小白',
        2171: 'Kagari',
        5198: '狐狸',
        6844: 'Yuina',
        8221: 'KUCIKISan'
      }
    }
  },
  methods: {
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
        l: '抖机灵（笑话，脑筋急转弯，段子等）'
      }

      return output[input] || '未知分类'
    },
    formatTime(input) {
      return moment(input).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>
<style lang="scss" scoped>
.sentence-preview-block {
  width: 100%;

  p,
  small {
    font-family: 'Noto Serif SC', serif;
  }

  small {
    display: block;
    text-align: right;
  }
}
</style>
