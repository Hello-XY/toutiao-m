import request from '@/utils/request'
import storage from '@/utils/storage'

export const getMyChannels = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels'
  })
}

export const delMychannel = (target) => {
  return request({
    url: `/v1_0/channels/${target}`,
    method: 'DELETE'
  })
}

export const addMychannel = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}

const HEIMA_TOUTIAO_CHANNELS = 'HEIMA_TOUTIAO_CHANNELS'
export const getMyChannelsByLocal = () => storage.get(HEIMA_TOUTIAO_CHANNELS)
export const setMyChannelByLocal = (channel) =>
  storage.set(HEIMA_TOUTIAO_CHANNELS, channel)
