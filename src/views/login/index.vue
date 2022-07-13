<template>
  <div>
    <van-nav-bar class="navbar" title="登录" @click-left="onClickLeft">
      <template #left> <span class="toutiao toutiao-guanbi"></span> </template
    ></van-nav-bar>
    <van-form @submit="login" class="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        type="text"
        name="code"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-button class="code-btn" size="mini" round>发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { login } from '@/api/user'
export default {
  data () {
    return {
      mobile: '',
      code: ''
    }
  },
  methods: {
    onClickLeft () {
      Toast('返回')
    },
    async login () {
      const res = await login(this.mobile, this.code)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;

  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .toutiao-guanbi {
    color: #fff;
  }
}
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-field__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 0.49333rem;
  }
  .code-btn {
    background-color: #ededed;
    color: #666666;
    padding: 0 10px;
  }
}
</style>
