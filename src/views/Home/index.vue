<template>
  <div>
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round @click="$router.push('/search')"
          ><van-icon name="search" />搜索</van-button
        >
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>
      <span class="toutiao toutiao-gengduo" @click="showPopup"></span>
    </van-tabs>
    <EditChannelPopup
      ref="popup"
      :myChannels="myChannels"
      @delMychannel="delMychannelFn"
      @change-active="changeActive"
      @add-mychannel="addMyChannel"
    ></EditChannelPopup>
  </div>
</template>

<script>
import {
  getMyChannels,
  getMyChannelsByLocal,
  setMyChannelByLocal,
  delMychannel,
  addMychannel
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import EditChannelPopup from './components/editChannelPopup.vue'
export default {
  data () {
    return {
      active: 0,
      myChannels: []
    }
  },
  created () {
    this.getMyChannels()
  },
  components: {
    ArticleList,
    EditChannelPopup
  },
  methods: {
    async getMyChannels () {
      try {
        if (!this.islogin) {
          const myChannels = getMyChannelsByLocal()
          if (myChannels) {
            this.myChannels = myChannels
          } else {
            const { data } = await getMyChannels()
            this.myChannels = data.data.channels
          }
        } else {
          //
        }
      } catch (error) {
        this.$toast.fail('请重新获取频道列表')
      }
    },
    showPopup () {
      this.$refs.popup.show = true
    },
    async delMychannelFn (id) {
      this.myChannels = this.myChannels.filter((item) => item.id !== id)
      if (!this.isLogin) {
        setMyChannelByLocal(this.myChannels)
      } else {
        try {
          await delMychannel(id)
        } catch (error) {
          return this.$toast.fail('删除用户频道失败')
        }
      }
      this.$toast.success('删除用户频道成功')
    },
    changeActive (id) {
      this.active = id
    },
    async addMyChannel (channel) {
      this.myChannels.push(channel)
      if (!this.isLogin) {
        setMyChannelByLocal(this.myChannels)
      } else {
        try {
          await addMychannel(channel.id, this.myChannels.length)
        } catch (error) {
          return this.$toast.fail('添加用户频道失败')
        }
      }
      this.$toast.success('添加用户频道成功')
    }
  },
  computed: {
    isLogin () {
      return !!this.$store.state.user.token
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;
  z-index: 999;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
}
.toutiao-gengduo {
  position: fixed;
  top: 92px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
</style>
