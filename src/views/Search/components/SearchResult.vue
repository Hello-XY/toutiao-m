<template>
  <div>
    <van-list
      @load="onLoad"
      :immediate-check="false"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      error-text="加载失败点击重新加载"
      :error.sync="error"
      ><van-cell
        v-for="(item, index) in searchResultList"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { searchResult } from '@/api'
export default {
  props: {
    keywords: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      error: false,
      /* 搜索建议列表 */
      searchResultList: [],
      page: 1,
      perPage: 15
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await searchResult(
          this.keywords,
          this.perPage,
          this.page
        )
        // console.log('@@@@@@@@@@@@@@@@@@@@@@', data.data.results)
        this.searchResultList.push(...data.data.results)
        this.loading = false
        if (data.data.results.length !== 0) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (e) {
        this.error = true
      }
    }
  }
}
</script>

<style></style>
