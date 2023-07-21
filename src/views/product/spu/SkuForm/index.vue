<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元素)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" placeholder="规格描述" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="80" />
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault==0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else type="success">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售是属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定v-model收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类：需要自己书写代码
        // 默认图片
        skuDefaultImg: '',
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ]

      },
      spu: {},
      // 收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList: []
    }
  },
  methods: {
    async initData(c1Id, c2Id, c3Id, spuInfo) {
      this.spu = spuInfo
      this.skuInfo.spuId = spuInfo.id
      this.skuInfo.category3Id = c3Id
      this.skuInfo.tmId = spuInfo.tmId
      // 获取图片
      const result1 = await this.$productApi.sku.reqSpuImageList(spuInfo.id)
      if (result1.code == 200) {
        const list = result1.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性
      const result2 = await this.$productApi.sku.reqSaleAttrList(spuInfo.id)
      if (result2.code == 200) {
        this.spuSaleAttrList = result2.data
      }
      // 获取平台属性列表
      const result3 = await this.$productApi.sku.reqAttrInfoList(c1Id, c2Id, c3Id)
      if (result3.code == 200) {
        this.attrInfoList = result3.data
      }
    },
    changeDefault(img) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      img.isDefault = 1
      this.skuInfo.skuDefaultImg = img.imgUrl
    },
    async save() {
      // 组装数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      skuInfo.skuImageList = imageList.map(item => {
        return { imgName: item.imgName, imgUrl: item.imgUrl, isDefault: item.isDefault, spuImgId: item.id }
      })
      // 发送请求
      const result = await this.$productApi.sku.reqAddSku(skuInfo)
      if (result.code == 200) {
        // 提示
        this.$message({ type: 'success', message: '添加成功' })
        // 通知父组件回到场景0
        this.$emit('changeScene', 0)
        Object.assign(this._data, this.$options.data())
      } else {
        this.$message.error(result.message)
      }
    },
    cancel() {
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    handleSelectionChange(params) {
      this.imageList = params
    }
  }
}
</script>

<style scoped>

</style>
