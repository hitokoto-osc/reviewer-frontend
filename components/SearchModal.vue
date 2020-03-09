<template>
  <a-modal
    title="使用搜索引擎确认句子"
    :visible="Visible"
    wrap-class-name="search-modal"
    ok-text="好了"
    cancel-text="取消"
    @ok="Visible = false"
    @cancel="Visible = false"
  >
    <p>句子：{{ sentence }}</p>
    <p><strong>单击下方的按钮以使用对应的搜索引擎进行搜索。</strong></p>
    <div class="search-button-group">
      <a-button
        @click="openBaidu"
      >
        百度
      </a-button>
      <a-button
        @click="openGoogle"
      >
        谷歌
      </a-button>
      <a-button
        @click="openBing"
      >
        必应
      </a-button>
      <a-button
        @click="openDuckDuckGo"
      >
        DuckDuckGo
      </a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    sentence: {
      type: String,
      default: ''
    }
  },
  computed: {
    Visible: {
      get () {
        return this.visible
      },
      set (val) {
      // grants_改变由父组件控制
        this.$emit('on-change-visible', val)
      }
    }
  },
  methods: {
    openBaidu () {
      window.open('https://www.baidu.com/baidu?word=' + encodeURIComponent(this.sentence))
    },
    openGoogle () {
      window.open('http://www.google.com/search?q=' + encodeURIComponent(this.sentence))
    },
    openBing () {
      window.open('https://cn.bing.com/search?q=' + encodeURIComponent(this.sentence))
    },
    openDuckDuckGo () {
      window.open('https://duckduckgo.com/?q=' + encodeURIComponent(this.sentence))
    }
  }
}
</script>
