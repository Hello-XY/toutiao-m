<template>
  <div>
    <van-cell
      v-if="articlesInfo.cover.type === 0"
      :title="articlesInfo.title"
      :label="articleDesc"
      :to="`/detail/${articleId}`"
    />
    <van-cell
      v-if="articlesInfo.cover.type === 1"
      :title="articlesInfo.title"
      :label="articleDesc"
      :to="`/detail/${articleId}`"
    >
      <van-image
        width="3rem"
        height="2rem"
        :src="articlesInfo.cover.images[0]"
      />
    </van-cell>
    <van-cell
      v-if="articlesInfo.cover.type === 3"
      :title="articlesInfo.title"
      :to="`/detail/${articleId}`"
    >
      <template #label>
        <div>
          <van-image
            width="3rem"
            height="2rem"
            v-for="(item, index) in articlesInfo.cover.images"
            :key="index"
            :src="item"
          />
        </div>
        <span>{{ articleDesc }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  props: {
    articlesInfo: {
      type: Object,
      required: true
    },
    articleId: {
      type: String,
      required: true
    }
  },
  computed: {
    articleDesc () {
      const relativeTime = dayjs(this.articlesInfo.pubdate).fromNow()
      return `${this.articlesInfo.aut_name} ${this.articlesInfo.comm_count}评论 ${relativeTime}`
    }
  }
}
</script>

<style lang="less" scoped></style>
