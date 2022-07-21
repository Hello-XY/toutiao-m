<template>
  <div>
    <van-cell
      v-for="(item, index) in highlight"
      :key="index"
      @click="clickItemFn(index)"
    >
      <!-- 使用 icon 插槽来自定义图标 -->
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSuggest } from '@/api/search'
export default {
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler () {
        this.getSuggest()
      }
    }
  },
  methods: {
    async getSuggest () {
      try {
        const res = await getSuggest(this.keywords)
        console.log(res)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestions = res.data.data.options.filter(Boolean)
        console.log(this.suggestions)
      } catch (error) {
        console.log(error)
      }
    },
    clickItemFn (index) {
      console.log(this.suggestions[index])
      this.$emit('search', this.suggestions[index])
      // this.$emit('search', this.suggestions[index])
    }
  },
  computed: {
    highlight () {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 10px;
}
</style>
