import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import product from '@/api/product'
import acl from '@/api/acl'

import CategorySelect from '@/components/CategorySelect'

import './icons' // icon
import './permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

import HintButton from '@/components/HintButton';
Vue.component(HintButton.name,HintButton);

Vue.use(ElementUI, {
  locale: locale // 如果使用中文，无需设置，请删除
})

Vue.config.productionTip = false

//挂载商品模块API模块
Vue.prototype.$productApi = product

//挂载权限模块API模块
Vue.prototype.$aclApi = acl

Vue.component(CategorySelect.name, CategorySelect)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
