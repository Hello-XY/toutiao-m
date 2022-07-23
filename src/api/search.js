import request from '@/utils/request'
import storage from '@/utils/storage'

export const getSuggest = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: { q }
  })
}

/* 存储搜索历史 */
const HEIMA_TOUTIAO_HISTORY = 'HEIMA_TOUTIAO_HISTORY'
export const getMyHistoryByLocal = () => storage.get(HEIMA_TOUTIAO_HISTORY)
export const setMyHistoryToLocal = (history) =>
  storage.set(HEIMA_TOUTIAO_HISTORY, history)

/* 获取搜索结果 */
export const searchResult = (q, perPage, page) => {
  return request({
    url: '/v1_0/search',
    params: { q, per_page: perPage, page }
  })
}
