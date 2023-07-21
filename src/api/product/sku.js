// sku管理
import request from '@/utils/request'

// 获取SPU图片列表
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性列表
export const reqSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取平台属性列表
export const reqAttrInfoList = (c1Id, c2Id, c3Id) => request({ url: `/admin/product/attrInfoList/${c1Id}/${c2Id}/${c3Id}`, method: 'get' })

// 添加sku
export const reqAddSku = (data) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data })

// 获取sku列表
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })

// 获取sku列表分页
export const reqSkuListPage = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架sku
export const reqOnSale = (skuId) => request({ url: `/admin/product/noSale/${skuId}`, method: 'get' })
// 下架sku
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取sku信息
export const reqSkuInfo = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
