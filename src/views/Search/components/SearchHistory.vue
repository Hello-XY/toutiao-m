<template>
  <div>
    <van-cell title="搜索历史">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <template v-if="delShow">
          <span @click="delSetHistoryList">全部删除</span>
          &nbsp;&nbsp;
          <span @click="delShow = false">完成</span>
        </template>
        <span
          v-else
          class="toutiao toutiao-shanchu"
          @click="delShow = !delShow"
        ></span>
      </template>
    </van-cell>
    <!-- 搜索记录 -->
    <van-cell
      :title="item"
      v-for="(item, index) in setHistoryList"
      :key="index"
      @click="choiceItem(item, index)"
    >
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="close" v-if="delShow" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getMyHistoryByLocal } from '@/api'
export default {
  props: {
    setHistoryList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      delShow: false
    }
  },
  created () {
    getMyHistoryByLocal()
  },
  methods: {
    /* 删除全部搜索历史 */
    delSetHistoryList () {
      this.$parent.setHistoryList = []
    },
    /* 删除点击的搜索历史和点击历史记录去搜索 */
    choiceItem (item, index) {
      console.log(this.delShow)
      if (this.delShow) {
        this.$parent.setHistoryList.splice(index, 1)
      } else {
        this.$emit('search', item)
        this.$parent.value = item
      }
    }
  }
}
</script>

<style></style>
