<template>
  <div>
    <!-- 用户信息 -->
    <van-list
      @load="onLoad"
      :immediate-check="false"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      error-text="加载失败点击重新加载"
      :error.sync="error"
    >
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
            <div class="reply" @click="typeFn(item.com_id)">
              回复{{ item.reply_count }}
            </div>
          </div>
          <!-- 时间 -->
        </template>
        <!--  -->
        <template #right-icon>
          <van-icon name="good-job-o" class="like-btn"> 赞</van-icon>
          <!-- 关注状态 -->
        </template>
      </van-cell>
      <!-- 用户信息 -->
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api'
import dayjs from '@/utils/dayjs'
export default {
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
      getReplyList: [],
      source: '',
      replyOffset: '',
      /* 存储时间 c */
      replyDaysFromNow: []
    }
  },
  created () {},
  methods: {
    /* 获取评论列表 */
    async onLoad () {
      try {
        if (this.type === 'a') {
          const { data } = await getComments(
            this.type,
            this.id,
            this.offset,
            this.limit
          )
          this.getCommentsList.push(...data.data.results)
          const pubdate = data.data.results
          console.log(this.getCommentsList)
          // console.log(data.data)
          // console.log('pubdate', pubdate)
          pubdate.forEach((item) => {
            this.daysFromNow.push(dayjs(item.pubdate).fromNow())
          })
          this.loading = true
          // console.log(data.data)
          if (data.data.results.length !== 0) {
            this.offset = data.data.last_id
            console.log(this.offset)
            this.onLoad()
          } else {
            this.finished = true
          }
        } else {
          const { data } = await getComments(
            this.type,
            this.source,
            this.replyOffset,
            this.limit
          )
          this.getReplyList.push(...data.data.results)
          const pubdate = data.data.results
          console.log(this.getReplyList)
          // console.log(data.data)
          // console.log('pubdate', pubdate)
          pubdate.forEach((item) => {
            this.replyDaysFromNow.push(dayjs(item.pubdate).fromNow())
          })
          this.loading = true
          // console.log(data.data)
          if (data.data.results.length !== 0) {
            this.replyOffset = data.data.last_id
            console.log(this.replyOffset)
            this.onLoad()
          } else {
            this.finished = true
          }
        }
      } catch (error) {
        this.error = true
        this.$toast.fail('评论加载失败')
      }
    },
    /* 点击回复获取二级评论列表 */
    typeFn (id) {
      this.type = 'c'
      this.source = id
      this.onLoad()
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
</style>
