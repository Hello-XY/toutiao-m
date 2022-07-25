<template>
  <div>
    <!-- 总回复 -->
    <van-nav-bar>
      <template #title>
        <div>
          {{
            commentItem.reply_count == 0
              ? '暂无回复'
              : commentItem.reply_count + '条回复'
          }}
        </div>
      </template>
    </van-nav-bar>
    <!-- 总回复 -->
    <!-- 当前楼层 -->
    <van-cell :icon="commentItem.aut_photo"
      ><!-- 头像 -->
      <template #title>
        <div class="username">{{ commentItem.aut_name }}</div>
        <div class="comment">{{ commentItem.content }}</div>
        <!-- 用户名 -->
        <div class="comment-bottom">
          <div class="time">{{ commentItemFromNow }}</div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="reply">回复{{ commentItem.reply_count }}</div>
        </div>
        <!-- 时间 -->
      </template>
      <!--  -->
      <template #right-icon>
        <van-icon
          name="good-job-o"
          class="like-btn"
          @click="addLikeComment(commentItem)"
          v-show="!commentItem.is_liking"
        >
          {{
            commentItem.like_count == 0 ? '赞' : commentItem.like_count
          }}</van-icon
        >
        <van-icon
          name="good-job"
          class="like-btn good-job"
          @click="addLikeComment(commentItem)"
          v-show="commentItem.is_liking"
        >
          {{
            commentItem.like_count == 0 ? '赞' : commentItem.like_count
          }}</van-icon
        >
        <!-- 关注状态 -->
      </template>
    </van-cell>
    <!-- 当前楼层 -->
    <!-- 用户信息 -->
    <van-cell title="全部回复" />
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
            <div class="reply">回复{{ item.reply_count }}</div>
          </div>
          <!-- 时间 -->
        </template>
        <!-- 二级点赞 -->
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
        <!-- 二级点赞 -->
      </van-cell>
      <!-- 用户信息 -->
    </van-list>
    <van-tabbar class="post-warp">
      <van-tabbar-item @click="isshow = !isshow">
        <div class="button__text">评论</div>
      </van-tabbar-item>
    </van-tabbar>
    <!-- 评论文本框 -->
    <van-popup v-model="isshow" position="bottom" :style="{ height: '120px' }">
      <CommentTextBox @addComment="addCommentFn" />
    </van-popup>
    <!-- 评论文本框 -->
  </div>
</template>

<script>
import {
  getComments,
  addLikeComment,
  removeLikeComment,
  addComment
} from '@/api'
import dayjs from '@/utils/dayjs'
import CommentTextBox from './CommentTextBox.vue'
export default {
  props: {
    source: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    commentItem: {
      type: Object,
      required: true
    },
    props: {
      id: {
        type: String,
        required: true
      }
    }
  },
  components: {
    CommentTextBox
  },
  data () {
    return {
      loading: false,
      finished: false,
      error: false,
      /* 文章评论列表“c” */
      getCommentsList: [],
      type: 'c',
      offset: '',
      limit: 10,
      daysFromNow: [],
      isshow: false
    }
  },
  created () {
    if (this.show) {
      this.onLoad()
    }
  },
  methods: {
    /* 获取评论列表 */
    async onLoad (fromIndex) {
      if (fromIndex === 1) {
        this.getCommentsList = []
        this.daysFromNow = []
        this.offset = ''
      }
      try {
        const { data } = await getComments(
          this.type,
          this.source,
          this.offset,
          this.limit
        )
        this.getCommentsList.push(...data.data.results)
        const pubdate = data.data.results
        // console.log(data.data)
        // console.log('pubdate', pubdate)
        pubdate.forEach((item) => {
          this.daysFromNow.push(dayjs(item.pubdate).fromNow())
        })
        this.loading = true
        // console.log(data.data)
        if (data.data.results.length === this.limit) {
          this.offset = data.data.last_id
          this.onLoad()
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.$toast.fail('评论加载失败')
      }
    },
    /* 对评论的评论点赞和取消点赞 */
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
    },
    /* 发表对文章的评论 */
    async addCommentFn (message) {
      try {
        await addComment(
          this.commentItem.com_id,
          message,
          this.$parent.$parent.id,
          console.log('erji', this.$parent.$parent.id)
        )
        this.onLoad(1)
        this.$toast.success('发表评论成功')
        this.isshow = !this.isshow
      } catch (error) {
        console.log(error)
        this.$toast.fail('网络状态不稳定，请稍后再试')
      }
    }
  },
  computed: {
    commentItemFromNow () {
      return dayjs(this.commentItem.pubdate).fromNow()
    }
  }
  /* 点击回复获取二级评论列表 */
}
</script>

<style lang="less" scoped>
/deep/.replies-total {
  height: 46px;
}
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
.van-cell__title {
  color: #323233;
  font-size: 0.37333rem;
  line-height: 0.64rem;
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
.end {
  margin-bottom: 44px;
}
.post-warp {
  > .van-tabbar-item--active {
    background-color: #ff69b4;
    .button__text {
      background-color: #fff;
      width: 640px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      border-radius: 40px;
      color: #323233;
    }
  }
}
.good-job {
  color: #ff8d16;
}
</style>
