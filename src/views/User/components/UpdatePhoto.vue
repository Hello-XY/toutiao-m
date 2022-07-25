<template>
  <div>
    <img :src="photo" alt="" ref="img" />
    <div class="btns">
      <div class="btn" @click="cancel">取消</div>
      <div class="btn" @click="confirm">完成</div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { editPhotoInfo } from '@/api'
export default {
  props: ['photo'],
  mounted () {
    const img = this.$refs.img
    this.myCropper = new Cropper(img, {})
  },
  methods: {
    cancel () {
      this.$emit('cancelUpdate')
    },
    confirm () {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob((blob) => {
        fm.append('photo', blob)
        editPhotoInfo(fm)
      })
      this.$emit('cancelUpdate')
    }
  }
}
</script>

<style lang="less" scoped>
.btns {
  position: fixed;
  bottom: 50px;
  left: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .btn {
    font-size: 36px;
  }
}
</style>
