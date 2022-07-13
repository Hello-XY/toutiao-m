<template>
  <div>
    <!-- 一级路由出口 -->
    <router-view> </router-view>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {}
  },
  created () {
    console.dir(request)
  }
}
</script>

<style>
.login {
  width: 694px;
  height: 88px;
  background-color: #6db4fb;
  border-radius: 10px;
  text-align: center;
}
</style>
