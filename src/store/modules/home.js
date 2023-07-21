const data = require('./data.json')
const state = {
  list: {}
}
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}
const actions = {
  // 发请求获取首页的mock数据
  async getData({ commit }) {
    commit('GETDATA', data)
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
