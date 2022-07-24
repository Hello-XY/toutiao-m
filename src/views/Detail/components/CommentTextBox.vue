<template>
  <!-- 发布评论栏 -->
  <van-field
    v-model="message"
    rows="2"
    autosize
    label="留言"
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
  >
    <template #button>
      <button @click="getTextFn(message)">发布</button>
    </template>
  </van-field>
  <!-- 发布评论栏 -->
</template>

<script>
export default {
  data () {
    return {
      message: ''
    }
  },
  methods: {
    /* 获取输入框的内容 */
    getTextFn (message) {
      if (message.trim() !== '') {
        this.$emit('addComment', message)
        this.message = ''
      } else {
        this.message = ''
      }
    }
  }
}
</script>

<style></style>
