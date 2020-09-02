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
      <a-button @click="openBaidu"> 百度 </a-button>
      <a-button @click="openGoogle"> 谷歌 </a-button>
      <a-button @click="openBing"> 必应 </a-button>
      <a-button @click="openDuckDuckGo"> DuckDuckGo </a-button>
    </div>
  </a-modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

@Component
export default class SearchModal extends Vue {
  @Prop({ default: false }) private visible!: boolean
  @Prop({ default: '' }) private sentence!: string
  // Compute Visible
  public get Visible() {
    return this.visible
  }

  public set Visible(val) {
    this.$emit('on-change-visible', val)
  }

  public openBaidu(): void {
    window.open(
      'https://www.baidu.com/baidu?word=' + encodeURIComponent(this.sentence),
    )
  }

  public openGoogle(): void {
    window.open(
      'http://www.google.com/search?q=' + encodeURIComponent(this.sentence),
    )
  }

  public openBing(): void {
    window.open(
      'https://cn.bing.com/search?q=' + encodeURIComponent(this.sentence),
    )
  }

  public openDuckDuckGo(): void {
    window.open(
      'https://duckduckgo.com/?q=' + encodeURIComponent(this.sentence),
    )
  }
}
</script>
