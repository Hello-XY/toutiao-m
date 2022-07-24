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
    >
      <!-- 单个评论 -->
      <van-cell
        v-for="(item, index) in getCommentsList"
        :key="index"
        :icon="item.aut_photo"
        ><!-- 头像 -->
        <template #title>
          <div class="username">{{ item.aut_name }}</div>
          <div class="comment">{{ item.content }}</div>
          <!-- 用户名 -->
          <div class="comment-bottom">
            <div class="time">{{ daysFromNow[index] }}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="reply" @click="typeFn(item.com_id, item)">
              回复{{ item.reply_count }}
            </div>
          </div>
          <!-- 时间 -->
        </template>
        <!-- 一级点赞 -->
        <template #right-icon>
          <van-icon
            name="good-job-o"
            class="like-btn"
            @click="addLikeComment(item)"
            v-show="!item.is_liking"
          >
            {{ item.like_count == 0 ? '赞' : item.like_count }}</van-icon
          >
          <van-icon
            name="good-job"
            class="like-btn good-job"
            @click="addLikeComment(item)"
            v-show="item.is_liking"
          >
            {{ item.like_count == 0 ? '赞' : item.like_count }}</van-icon
          >
        </template>
        <!-- 一级点赞 -->
      </van-cell>
      <!-- 单个评论 -->
    </van-list>
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <SecondaryComment
        :source="source"
        :commentItem="commentItem"
        :show="show"
        :id="id"
      />
    </van-popup>
  </div>
</template>

<script>
import { getComments, addLikeComment, removeLikeComment } from '@/api'
import dayjs from '@/utils/dayjs'
import SecondaryComment from './SecondaryComment.vue'
export default {
  components: {
    SecondaryComment
  },
  props: {
    id: {
      required: true
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      error: false,
      /* 文章评论列表“a” */
      getCommentsList: [],
      type: 'a',
      offset: '',
      limit: 10,
      /* 存储时间 a */
      daysFromNow: [],
      /* 文章评论列表'c' */
      source: '',
      /* 存储时间 c */
      /* 控制二级评论弹出 */
      show: false,
      /* 存储当前点击的评论的数据 */
      commentItem: []
    }
  },
  created () {},
  methods: {
    /* 获取评论列表 */
    async onLoad (fromIndex) {
      try {
        const { data } = await getComments(
          this.type,
          this.id,
          this.offset,
          this.limit
        )
        if (fromIndex === 1) {
          this.getCommentsList = []
          this.daysFromNow = []
        }
        this.getCommentsList.push(...data.data.results)
        const pubdate = data.data.results
        // console.log(this.getCommentsList)
        // console.log(data.data)
        // console.log('pubdate', pubdate)
        pubdate.forEach((item) => {
          this.daysFromNow.push(dayjs(item.pubdate).fromNow())
        })
        this.loading = true
        // console.log(data.data)
        if (data.data.results.length === this.limit) {
          this.offset = data.data.last_id
          console.log(this.offset)
          this.onLoad()
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.$toast.fail('评论加载失败')
      }
    },
    /* 点击回复获取二级评论列表 */
    typeFn (id, item) {
      this.source = id
      this.commentItem = item
      this.show = true
    },
    /* 对评论点赞和取消点赞 */
    async addLikeComment (item) {
      try {
        if (item.is_liking) {
          await removeLikeComment(item.com_id)
          item.like_count = item.like_count - 1
          item.is_liking = false
          this.$toast.success('取消点赞')
        } else {
          await addLikeComment(item.com_id)
          item.like_count = item.like_count + 1
          item.is_liking = true
          this.$toast.success('点赞成功')
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('网络状态不稳定，请稍后再试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell__left-icon {
  width: 0.93333rem;
  height: 0.93333rem;
  // margin-right: 0.22667rem;
  .van-icon__image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    text-align: center;
    line-height: 0.93333rem;
  }
}
/deep/.van-cell__title {
  font-size: 0.32rem;
  color: #3a3a3a;
  .time {
    font-size: 0.30667rem;
    color: #b7b7b7;
    line-height: 0.48rem;
  }
}
/deep/.van-cell__title {
  font-size: 0.32rem;
  color: #3a3a3a;
  .time {
    height: 24px;
    font-size: 0.30667rem;
    color: #b7b7b7;
    line-height: 24px;
  }
  .reply {
    height: 24px;
  }
}

.like-btn {
  display: flex;
}
////////////////////////////////////////////////
.comment-bottom {
  display: flex;
  line-height: 24px;
  height: 24px;
  .time {
    height: 24px;
    line-height: 24px;
  }
}
.end {
  margin-bottom: 44px;
}
.good-job {
  color: #ff8d16;
}
</style>
