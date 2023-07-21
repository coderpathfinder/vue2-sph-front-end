<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80" />
      <el-table-column prop="price" label="价格" width="80" />
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button
            v-if="row.isSale == 0"
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            @click="sale(row)"
          />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页          -->
    <el-pagination
      style="text-align: center"
      :pager-count="5"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      @size-change="sizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
      @current-change="getDataPage"
      :total="total"
    />
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right:10px">{{
              attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      skuList: [],
      skuInfo: {},
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList() {
      const { page, limit } = this
      const result = await this.$productApi.sku.reqSkuListPage(page, limit)
      if (result.code == 200) {
        this.skuList = result.data.records
        this.total = result.data.total
        this.limit = result.data.size
        this.page = result.data.current
      } else {
        this.$message.error(result.message)
      }
    },
    getDataPage(page) {
      this.page = page
      this.getSkuList()
    },
    sizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    async sale(row) {
      const result = await this.$productApi.sku.reqOnSale(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '上架成功' })
        row.isSale = 1
      } else {
        this.$message.error(result.message)
      }
    },
    async cancel(row) {
      const result = await this.$productApi.sku.reqCancelSale(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '下架成功' })
        row.isSale = 0
      } else {
        this.$message.error(result.message)
      }
    },
    async getSkuInfo(row) {
      const result = await this.$productApi.sku.reqSkuInfo(row.id)
      if (result.code == 200) {
        this.skuInfo = result.data
        this.show = true
      } else {
        this.$message.error(result.message)
      }
    },
    edit() {
      this.$message('正在开发中')
    }
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

>>>.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
