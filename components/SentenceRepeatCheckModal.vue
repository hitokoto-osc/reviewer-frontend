<template>
  <a-modal
    title="句子查重"
    :visible="Visible"
    wrap-class-name="sentence-repeat-check-modal"
    ok-text="好了"
    cancel-text="取消"
    @ok="Visible = false"
    @cancel="Visible = false"
  >
    <p :style="{ fontSize: '1.1em' }">
      <span :style="{ 'font-family': `'Noto Serif SC', serif` }">{{
        sentence
      }}</span>
    </p>
    <a-divider v-if="!loading && loadedStatus === 'ok'">
      {{ tips }}
    </a-divider>
    <a-divider v-else />
    <div v-if="loading" class="loading-box">
      <a-spin>
        <a-icon
          slot="indicator"
          type="loading"
          :style="{ fontSize: '2em' }"
          spin
        />
      </a-spin>
    </div>
    <template v-else>
      <div v-if="loadedStatus === 'failure'" class="loading-box">
        <a-icon
          type="close-circle"
          :style="{ fontSize: '2em', color: 'rgb(247 66 66)' }"
        />
      </div>
      <template v-else>
        <a-list :data-source="searchHits">
          <a-list-item slot="renderItem" slot-scope="item">
            <sentence-preview :sentence-info="item" />
          </a-list-item>
        </a-list>
        <a-divider :style="{ marginTop: 0 }" />
        <a-row type="flex" justify="center" class="mt-s">
          <a-pagination
            v-model="currentPage"
            :total="total"
            :page-size.sync="limit"
            show-less-items
          />
        </a-row>
      </template>
    </template>
  </a-modal>
</template>
<script>
import Vue from 'vue'
import { MeiliSearch } from 'meilisearch'
import SentencePreview from './SentencePreview.vue'
const searchClient = new MeiliSearch({
  host: 'https://search.api.hitokoto.cn',
  apiKey: '8bb67fe90b3c6df19f1f217605d5c0a5a5adf4d24ae5ea1e6a117ef0c7a8a0ad' // Public Key
})

function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), t)
  })
}

export default Vue.extend({
  components: {
    SentencePreview
  },
  props: {
    visible: Boolean,
    sentence: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      loadedStatus: 'failure',
      limit: 3,
      total: 0,
      currentPage: 0,
      searchHits: [],
      tips: undefined
    }
  },
  computed: {
    Visible: {
      get() {
        return this.visible
      },
      set(val) {
        // grants_改变由父组件控制
        this.$emit('on-change-visible', val)
      }
    }
  },
  watch: {
    Visible(target) {
      if (target) {
        this.doSearch().catch(this.handleError)
      } else {
        this.resetComponent()
      }
    },
    currentPage(newPage) {
      const offset = (newPage - 1) * this.limit
      this.doSearch(offset).catch(this.handleError)
    }
  },

  methods: {
    async doSearch(offset = 0) {
      this.loading = true
      const {
        hits,
        nbHits // 总匹配数 limit,
      } = await searchClient
        .index('sentences') // v1 句子集合
        .search(
          this.sentence, // 查询参数
          {
            limit: this.limit,
            offset
          }
        )
      this.loading = false
      this.loadedStatus = 'ok'
      this.searchHits = hits
      this.total = nbHits
      this.tips = `查询到 ${nbHits} 条记录`
      // console.log(data)
    },
    async resetComponent() {
      await sleep(100) // debug use
      this.loadedStatus = 'ok'
      this.searchHits = []
      this.currentPage = 0
      this.total = 0
      this.tips = undefined
    },
    handleError(err) {
      this.loading = false
      this.loadedStatus = 'failure'
      this.$emit('on-error', err) // emit error to parent components
    }
  }
})
</script>
<style lang="scss" scoped>
.loading-box {
  padding: 20px 50px;
  text-align: center;
}
</style>
