class Storage {
  // localStorage.setItem('HEIMA_TOUTIAO_TOKEN', JSON.stringify(value))
  set (key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  }

  get (key) {
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }

  remove (key) {
    localStorage.removeItem(key)
  }
}

export default new Storage()
