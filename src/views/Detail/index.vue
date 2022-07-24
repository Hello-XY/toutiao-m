<template>
  <div>
    <div class="father">
      <!-- 导航栏 -->
      <van-nav-bar
        class="header"
        title="黑马头条"
        left-arrow
        :fixed="true"
        :placeholder="true"
        @click-left="onClickLeft"
      />
      <!-- 导航栏 -->
      <div class="main">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ newsDetailContent.title }}</h1>
        <!-- 文章标题 -->
        <!-- 用户信息 -->
        <van-cell :icon="newsDetailContent.aut_photo"
          ><!-- 头像 -->
          <template #title>
            <div class="username">{{ newsDetailContent.aut_name }}</div>
            <!-- 用户名 -->
            <div class="time">{{ timer }}</div>
            <!-- 时间 -->
          </template>
          <!--  -->
          <template #right-icon>
            <!-- 关注状态 -->
            <van-button
              class="follow-btn"
              :loading="loading"
              type="primary"
              v-if="newsDetailContent.is_followed"
              @click="followFn"
              >+ 关注</van-button
            >
            <van-button
              class="follow-btn"
              :loading="loading"
              type="primary"
              v-else
              @click="followFn"
              >已关注</van-button
            >
          </template>
        </van-cell>
        <!-- 用户信息 -->
      </div>
      <div
        class="article-content markdown-body"
        v-html="newsDetailContent.content"
      ></div>
      <van-divider>正文结束</van-divider>
      <!-- 用户信息 -->
      <!-- 评论区 -->
      <FirstLeveCommentContent :id="newsDetailContent.art_id" ref="onLoad" />
      <!-- 评论区 -->
      <!-- 评论文本框 -->
      <van-popup
        v-model="show"
        position="bottom"
        @isShow="showFn"
        :style="{ height: '120px' }"
      >
        <CommentTextBox @addComment="addCommentFn" />
      </van-popup>
      <!-- 评论文本框 -->
    </div>
    <van-tabbar placeholder style="height: 44px">
      <van-tabbar-item class="comment-btn" @click="showFn">
        <div>写评论</div>
      </van-tabbar-item>
      <van-tabbar-item icon="comment-o" :badge="totalCount"></van-tabbar-item>
      <van-tabbar-item
        icon="star-o"
        v-if="!newsDetailContent.is_collected"
        @click="collectionFn"
      ></van-tabbar-item>
      <van-tabbar-item
        class="good-job"
        icon="star"
        v-if="newsDetailContent.is_collected"
        @click="collectionFn"
      ></van-tabbar-item>
      <van-tabbar-item
        v-if="newsDetailContent.attitude == -1"
        icon="good-job-o"
        @click="likeFn"
      ></van-tabbar-item>
      <van-tabbar-item
        class="good-job"
        v-if="newsDetailContent.attitude == 1"
        icon="good-job"
        @click="likeFn"
      ></van-tabbar-item>
      <van-tabbar-item icon="share"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import './style/news.css'
import dayjs from '@/utils/dayjs'
import {
  newsDetail,
  getComments,
  addFollowInfo,
  deleteFollowInfo,
  addLike,
  removeLike,
  addCollection,
  removeCollection,
  addComment
} from '@/api'
import FirstLeveCommentContent from './components/FirstLeveCommentContent.vue'
import CommentTextBox from './components/CommentTextBox.vue'
export default {
  components: {
    FirstLeveCommentContent,
    CommentTextBox
  },
  data () {
    return {
      follow: true,
      newsDetailContent: [],
      /* 评论框内容 */
      message: '',
      /* 控制评论框是否显示 */
      show: false,
      totalCount: '',
      loading: false
    }
  },
  created () {
    this.newsDetail(this.$route.params.article_id)
    this.getComments()
  },
  methods: {
    /* 路由返回上一页 */
    onClickLeft () {
      this.$router.push('/')
    },
    /* 获取文章 */
    async newsDetail (id) {
      try {
        const { data } = await newsDetail(id)
        this.newsDetailContent = data.data
        console.log(this.newsDetailContent)
      } catch (error) {
        this.$toast.fail('文章获取失败请返回重新加载')
      }
    },
    /* 获取评论总数 */
    async getComments () {
      try {
        const { data } = await getComments('a', this.$route.params.article_id)
        this.totalCount = data.data.total_count
      } catch (error) {}
    },
    /* 取消添加关注 */
    async followFn () {
      this.loading = true
      try {
        if (this.newsDetailContent.is_followed) {
          await deleteFollowInfo(this.newsDetailContent.aut_id)
        } else {
          await addFollowInfo(this.newsDetailContent.aut_id)
        }
        this.newsDetailContent.is_followed = !this.newsDetailContent.is_followed
      } catch (error) {
        console.log(error)
        this.$toast.fail('网络错误')
      } finally {
        this.loading = false
      }
    },
    /* 文章点赞取消赞 */
    async likeFn () {
      try {
        if (this.newsDetailContent.attitude === -1) {
          await addLike(this.newsDetailContent.art_id)
          this.newsDetailContent.attitude = 1
          this.$toast.success('点赞成功')
        } else if (this.newsDetailContent.attitude === 1) {
          await removeLike(this.newsDetailContent.art_id)
          this.newsDetailContent.attitude = -1
          this.$toast.success('取消点赞')
        }
      } catch {
        this.$toast.fail('网络状态不稳定，请稍后再试')
      }
    },
    /* 文章收藏取消收藏 */
    async collectionFn () {
      try {
        if (this.newsDetailContent.is_collected) {
          await removeCollection(this.newsDetailContent.art_id)
          this.$toast.success('取消收藏')
        } else {
          await addCollection(this.newsDetailContent.art_id)
          this.$toast.success('添加收藏')
        }
        this.newsDetailContent.is_collected =
          !this.newsDetailContent.is_collected
      } catch (error) {
        this.$toast.fail('网络状态不稳定，请稍后再试')
      }
    },
    /* 控制弹出层 */
    showFn () {
      console.log('show')
      this.show = !this.show
    },
    /* 发表对文章的评论 */
    async addCommentFn (message) {
      try {
        await addComment(this.$route.params.article_id, message)
        this.$refs.onLoad.onLoad(1)
        this.$toast.success('发表评论成功')
        this.show = !this.show
      } catch (error) {
        console.log(error)
        this.$toast.fail('网络状态不稳定，请稍后再试')
      }
    }
  },
  computed: {
    /* 文章发布时间转换 */
    timer () {
      return dayjs(this.newsDetailContent.pubdate).fromNow()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.header {
  width: 100%;
  color: #fff;
  .van-nav-bar__content {
    background-color: #3296fa;
    width: 100%;
    color: #fff;
  }
  .van-nav-bar__title {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.main {
  .article-title {
    color: #3a3a3a;
    font-size: 0.53333rem;
    display: flex;
    padding: 0.66667rem 0.42667rem;
    margin: 0;
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
  /deep/.van-cell__title {
    font-size: 0.32rem;
    color: #3a3a3a;
    .time {
      font-size: 0.30667rem;
      color: #b7b7b7;
      line-height: 0.48rem;
    }
  }
  .follow-btn {
    width: 2.26667rem;
    height: 0.77333rem;
    color: white;
    background: rgb(50, 150, 250);
    border-color: rgb(50, 150, 250);
    border-radius: 26.64rem;
    text-align: center;
    line-height: 0.77333rem;
  }
}
.markdown-body {
  padding: 0.73333rem 0.42667rem;
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
/deep/.comment-end {
  height: 50px;
  color: #969799;
  line-height: 50px;
  font-size: 14px;
  text-align: center;
}
//////////////////////////////////////////////

.van-tabbar--fixed {
  height: 44px;
  align-items: center;
  .comment-btn {
    flex: 3;
    color: #969799;
    width: 141px;
    border-radius: 70px;
    border: #969799 solid 1px;
    height: 50%;
    margin-top: 20px;
  }
  .van-button--normal {
    width: 3.76rem;
    height: 0.61333rem;
    border: 0.02667rem solid #eee;
    font-size: 0.4rem;
    line-height: 0.61333rem;
    color: #a7a7a7;
  }
  .van-icon {
    align-items: center;
  }
}
.good-job {
  color: #ff8d16;
}
</style>
