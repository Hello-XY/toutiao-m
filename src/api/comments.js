import request from '@/utils/request'

/* 获取评论列表 */
export const getComments = (type, source, offset, limit) => {
  return request({
    url: '/v1_0/comments',
    params: { type, source, offset, limit }
  })
}

/* 对文章或者评论进行评论 */
export const addComment = (articleId, content, artId) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: { target: articleId, content, art_id: artId }
  })
}

/* 对评论或评论回复点赞 */
export const addLikeComment = (comId) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: comId
    }
  })
}

/* 取消对评论或评论回复点赞 */
export const removeLikeComment = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${id}`
  })
}
