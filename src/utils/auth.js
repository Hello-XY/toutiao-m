import storage from './storage'

const TKOEN_KEY = 'HEIMA_TOUTIAO_TOKEN'

export const setToken = (token) => storage.set(TKOEN_KEY, token)

export const getToken = () => storage.get(TKOEN_KEY)

export const removeToken = () => storage.remove(TKOEN_KEY)
