import request from '@/utils/request'

/* 获取新闻详情 */
export const newsDetail = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}
/* 对文章点赞 */
export const addLike = (articleId) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/* 取消对文章点赞 */
export const removeLike = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}

/* 收藏文章 */
export const addCollection = (articleId) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}

/* 取消收藏文章 */
export const removeCollection = (articleId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${articleId}`
  })
}
