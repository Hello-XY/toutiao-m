<template>
  <div>
    <van-nav-bar class="navbar" title="登录" @click-left="onClickLeft">
      <template #left> <span class="toutiao toutiao-guanbi"></span> </template
    ></van-nav-bar>
    <van-form @submit="login" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
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
        :rules="codeRules"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <!-- 验证码 -->
        <template #right-icon>
          <van-count-down
            v-if="isShowCountDown"
            :time="3 * 1000"
            @finish="isShowCountDown = false"
          />
          <van-button
            v-else
            class="code-btn"
            size="mini"
            round
            @click.prevent="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <!-- ========================================== -->
    <!-- <h1>{{ $store.state.sum }}</h1>
    <button @click="sumFn">11111111111</button> -->
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
import { mobileRules, codeRules } from '@/views/login/rules'
export default {
  data () {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/profile')
    },
    async login () {
      this.$toast.loading({
        message: '登录中',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        console.log(res)
        /* 存储token */
        this.$store.commit('setUser', res.data.data)
        this.$router.push('/profile')
        this.$toast.success('登录成功')
      } catch (e) {
        console.log(e)
        const status = e.response.status
        let message = '登录错误，请刷新'
        if (status === 400) {
          message = e.response.data.message
        }
        this.$toast.fail(message)
        // if (status === 400) {
        //   this.$toast.fail(e.response.data.message)
        // } else if (status === 507) {
        //   this.$toast.fail('登录错误，请刷新')
        // } else {
        //   this.$toast.fail('登录错误，请刷新')
        // }
      }
    },
    async sendCode () {
      try {
        await this.$refs.form.validate('mobile')
        await sendCode(this.mobile)
        this.isShowCountDown = true
      } catch (e) {
        if (!e.response) {
          this.$toast.fail('手机号格式错误')
        } else {
          const status = e.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(e.response.data.message)
          }
        }
      }
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
