// spu管理
import request from '@/utils/request'

// 分页获取SPU列表
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})

// 获取所有品牌
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取所有销售属性
export const reqSaleList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 根据id获取spu信息
export const reqSpuInfoById = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取SPU图片墙
export const reqSpuImgListById = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 添加或修改SPU
export const reqAddOrUpdateSpu = (data) => {
  if (data.id) {
    // 修改
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data })
  } else {
    // 添加
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data })
  }
}

// 删除SPU
export const reqRemoveSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
