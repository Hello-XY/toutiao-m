import request from '@/utils/request'
// import store from '@/store'

export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/* 添加关注 */
export const addFollowInfo = (userId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/* 取消关注 */
export const deleteFollowInfo = (userId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

/* 获取用户个人资料 */
export const getPersonalInfo = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

/* 编辑用户个人资料 */
export const editPersonalInfo = (name, gender, birthday) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data: { name, gender, birthday }
  })
}

/* 编辑用户照片资料（头像、身份证照片） */
export const editPhotoInfo = (photo) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data: photo
  })
}
