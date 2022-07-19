<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onLoad" success-text='刷新成功'>
      <van-list
        @load="onLoad"
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        error-text="加载失败点击重新加载"
        :error.sync="error"
      >
        <ArticleItem
          v-for="item in articlesList"
          :key="item.art_id"
          :articlesInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticlesList } from '@/api'
import ArticleItem from '@/views/Home/components/ArticleItem.vue'
export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      articlesList: [],
      pre_timestamp: '',
      loading: false,
      finished: false,
      error: false,
      isLoading: false
    }
  },
  created () {
    this.getArticlesList()
  },
  methods: {
    async getArticlesList () {
      try {
        const res = await getArticlesList(this.id, +new Date())
        this.articlesList = res.data.data.results
        this.pre_timestamp = res.data.data.pre_timestamp
        this.loading = false
        console.log(res)
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    async onLoad () {
      try {
        if (Math.random() < 0.7) {
          throw new Error('错误了')
        }
        const { data } = await getArticlesList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        if (this.isLoading) {
          this.articlesList.unshift(...data.data.results)
        } else {
          this.articlesList.push(...data.data.results)
        }
        this.pre_timestamp = data.data.pre_timestamp
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
