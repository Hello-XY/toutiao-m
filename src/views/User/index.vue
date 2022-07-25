<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    <input type="file" ref="file" hidden accept=".png,.jpg" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <template #right-icon>
        <van-image round width="30px" height="30px" :src="personalInfo.photo" />
        <van-icon name="arrow" size="0.42667rem" />
      </template>
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="personalInfo.name"
      @click="show = !show"
    />
    <van-cell title="性别" is-link :value="sex" @click="showSex = !showSex" />
    <van-cell
      title="生日"
      is-link
      :value="personalInfo.birthday"
      @click="showBirthday = !showBirthday"
    />
    <!-- 修改昵称弹出层 -->
    <van-popup
      class="user-name"
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-nav-bar
        title="更新昵称"
        left-text="取消"
        right-text="保存"
        @click-left="show = !show"
        @click-right="saveName"
      />
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新的昵称"
        show-word-limit
      />
    </van-popup>
    <!-- 修改昵称弹出层 -->
    <!-- 修改性别弹出层 -->
    <van-popup v-model="showSex" position="bottom" :style="{ height: '308px' }">
      <van-picker
        title="更新性别"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
    <!-- 修改性别弹出层 -->
    <!-- 修改生日弹出层 -->
    <van-popup
      v-model="showBirthday"
      position="bottom"
      :style="{ height: '308px' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmBirthday"
        @cancel="back"
      />
    </van-popup>
    <!-- 修改生日弹出层 -->
    <!-- 修改头像 -->
    <van-popup
      v-model="showPhoto"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdatePhoto :photo="photo" @cancelUpdate="cancelUpdateFn"></UpdatePhoto>
    </van-popup>
    <!-- 修改头像 -->
  </div>
</template>

<script>
import { getPersonalInfo, editPersonalInfo /* , editPhotoInfo */ } from '@/api'
import dayjs from '@/utils/dayjs'
import UpdatePhoto from './components/UpdatePhoto.vue'
export default {
  components: {
    UpdatePhoto
  },
  data () {
    return {
      personalInfo: '',
      /* 控制昵称弹出层显示隐藏 */
      show: false,
      /* 修改昵称获取文本框内容 */
      message: '',
      /* 性别 */
      columns: ['男', '女'],
      /* 控制修改性别弹出层 */
      showSex: false,
      /* 控制修改生日弹出层 */
      showBirthday: false,
      /* 可选择生日的最小值 */
      minDate: new Date(1900, 0, 1),
      /* 可选择生日的最大值 */
      maxDate: new Date(),
      /* 当前选择的生日 */
      currentDate: new Date(2021, 0, 17),
      /* 控制照片编辑弹出层 */
      showPhoto: false,
      /* 本地上传的照片文件 */
      photo: ''
    }
  },
  created () {
    this.getPersonalInfo()
  },
  /* 获取上传的图片文件 */
  mounted () {
    this.$refs.file.addEventListener('change', (e) => {
      const file = e.target.files[0]
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = (e) => {
        this.photo = e.target.result
        this.showPhoto = true
        console.log(this.photo)
      }
    })
  },
  methods: {
    /* 返回我的页面 */
    onClickLeft () {
      this.$router.push('/profile')
    },
    /* 获取个人信息 */
    async getPersonalInfo () {
      const { data } = await getPersonalInfo()
      this.personalInfo = data.data
      this.message = this.personalInfo.name
    },
    /* 保存更新的昵称 */
    saveName () {
      if (this.message.trim() !== '') {
        this.personalInfo.name = this.message
        this.show = false
        this.editPersonalInfo()
      }
    },
    /* 取消更新性别 */
    onCancel () {
      this.showSex = false
    },
    /* 确认更新性别 */
    onConfirm (value, index) {
      this.personalInfo.gender = index
      this.showSex = false
      this.editPersonalInfo()
    },
    /* 取消更新生日 */
    back () {
      this.showBirthday = false
    },
    /* 确认更新生日 */
    onConfirmBirthday (value) {
      const date = dayjs(value).format('YYYY-MM-DD')
      this.personalInfo.birthday = date
      this.showBirthday = false
      this.editPersonalInfo()
    },
    /* 更新个人资料接口 */
    async editPersonalInfo () {
      try {
        await editPersonalInfo(
          this.personalInfo.name,
          this.personalInfo.gender,
          this.personalInfo.birthday
        )
        this.$toast.success('资料更新成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('资料更新失败')
      }
    },
    /* 取消更新 */
    cancelUpdateFn () {
      console.log(111)
      this.showPhoto = !this.showPhoto
    },
    /* 获取上传的图片 */
    getPhoto () {
      this.$refs.file.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = (e) => {
          this.photo = e.target.result
          this.showPhoto = true
          console.log(this.photo)
        }
      })
    }
  },
  computed: {
    /* 接口返回数字转换性别 */
    sex () {
      return this.personalInfo.gender === 1 ? '女' : '男'
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #3296fa;
  /deep/.van-icon {
    color: #fff;
  }
  /deep/.van-nav-bar__title {
    color: #fff;
  }
}
.user-name {
  .van-nav-bar {
    background-color: #fff;
    /deep/.van-icon {
      color: #3296fa;
    }
    /deep/.van-nav-bar__title {
      color: #000;
    }
  }
}
</style>
