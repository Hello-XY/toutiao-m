<template>
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '100%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <!-- 我的频道 -->
      <div class="my-channel">
        <!-- 我的频道标题 -->
        <van-cell title="我的频道">
          <van-button
            size="small"
            round
            class="edit-btn"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button
          >
        </van-cell>
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="(item, index) in myChannels"
            :key="item.id"
            :text="item.name"
            :class="{ 'active-channel': item.name === '推荐' }"
            @click="onClickMyChannel(item, index)"
          >
            <template #icon
              ><van-icon name="cross" v-show="isEdit && item.name !== '推荐'" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 推荐频道 -->
      <div class="recommend-channel">
        <van-cell title="推荐频道"></van-cell>
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
            @click="addMyChannel(item)"
          ></van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api'
export default {
  data () {
    return {
      show: false,
      allChannels: [],
      isEdit: false
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        console.log('@1111', this.allChannels)
      } catch (error) {
        console.log(error)
      }
    },
    onClickMyChannel (channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        this.$emit('delMychannel', channel.id)
      }
      if (!this.isEdit) {
        this.show = false
        this.$emit('change-active', index)
      }
    },
    addMyChannel (myChannel) {
      this.$emit('add-mychannel', { ...myChannel })
    }
  },
  computed: {
    recommendChannels () {
      return this.allChannels.filter((item) => {
        const result = this.myChannels.find((i) => i.id === item.id)
        if (result) {
          return false
        } else {
          return true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.popupMain {
  padding-top: 100px;
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }
}
.my-channel {
  :deep(.van-grid-item__content) {
    position: relative;
    background-color: #f4f5f6;

    .van-grid-item__icon-wrapper {
      position: absolute;
      top: 0;
      right: 0;

      .van-icon-cross {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(20%, -35%);
        border: 0.02667rem solid #000;
        border-radius: 50%;
        text-align: center;
        font-size: 16px;
      }
    }
  }
}
// 推荐频道的样式
.recommend-channel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;
    background-color: #f4f5f6;

    .van-grid-item__icon {
      font-size: 0.5rem;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
.active-channel {
  :deep(.van-grid-item__text) {
    color: red;
  }
}
</style>
