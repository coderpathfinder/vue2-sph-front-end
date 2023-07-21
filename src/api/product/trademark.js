// 品牌管理
import request from '@/utils/request'

// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 新增或修改品牌信息
export const reqAddOrUpdateTrade = (tradeMark) => {
  if (tradeMark.id) {
    // 修改
    return request({ url: 'admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    // 新增
    return request({ url: 'admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

// 删除品牌
export const reqDeleteTrade = (tradeId) => request({ url: `/admin/product/baseTrademark/remove/${tradeId}`, method: 'delete' })
