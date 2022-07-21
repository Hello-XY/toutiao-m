<template>
  <div class="search">
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="showSuggest"
        background="rgb(50, 150, 250)"
      />
    </form>
    <component
      :is="componentName"
      :keywords="keywords"
      :setHistoryList="setHistoryList"
      @search="onSearch"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory'
import SearchResult from './components/SearchResult'
import SearchSuggestion from './components/SearchSuggestion'
import { setMyHistoryToLocal, getMyHistoryByLocal } from '@/api'
export default {
  data () {
    return {
      keywords: '',
      showResult: false,
      /* 从本地存储获取搜索历史 */
      setHistoryList: getMyHistoryByLocal() || [],
      delHistory: false
      /* 搜索建议列表 */
      // searchResultList: []
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  methods: {
    onSearch (val) {
      // console.log(1)
      this.keywords = val
      this.showResult = true
      const index = this.setHistoryList.indexOf(val)
      if (index !== -1) {
        this.setHistoryList.splice(index, 1)
      }
      this.setHistoryList.unshift(val)
    },
    onCancel () {
      this.$router.go(-1)
    },
    showSuggest () {
      this.showResult = false
    }
    // /* 获取搜索建议数据 */
    // async searchResult (val) {
    //   const { data } = await searchResult(val, 10)
    //   this.searchResultList = data.data.results
    //   // this.searchResultList.push(data.data.results)
    //   console.log('搜索建议', data.data.results)
    // }
  },
  computed: {
    componentName () {
      if (this.keywords.trim() === '') return 'SearchHistory'
      if (this.showResult) return 'SearchResult'
      return 'SearchSuggestion'
    }
  },
  watch: {
    /* 把搜索历史存储到本地存储 */
    setHistoryList (val) {
      setMyHistoryToLocal(val)
    }
  }
}
</script>

<style lang="less" scoped></style>
