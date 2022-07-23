import request from '@/utils/request'

/* 获取评论列表 */
export const getComments = (type, source, offset, limit) => {
  return request({
    url: '/v1_0/comments',
    params: { type, source, offset, limit }
  })
}
