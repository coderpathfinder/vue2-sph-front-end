<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect :disab="scene != 0" @getSelectCategoryId="getSelectCategoryId" />
    </el-card>

    <el-card style="margin: 20px 0px;">
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              />
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              />
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              />
              <el-popconfirm title="确定删除这个SPU吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; text-align: center;"
          :current-page="page"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          :pager-count="7"
          layout="prev, pager, next, jumper, ->, sizes,total"
          :total="total"
          @current-change="getDataPage"
          @size-change="sizeChange"
        />
      </div>
      <!-- 使用v-if就不能使用ref获取到该组件实例，除非使用nextTick-->
      <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScene" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示sku列表-->
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width" />
        <el-table-column prop="price" label="价格" width="width" />
        <el-table-column prop="weight" label="重量" width="width" />
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogTableVisible: false,
      scene: 0,
      c1Id: 0,
      c2Id: 0,
      c3Id: 0,
      spuList: [],
      page: 1,
      pageSize: 5,
      total: 0,
      skuList: [],
      spu: {},
      loading: true
    }
  },
  methods: {
    getSelectCategoryId(cForm) {
      const { selectedCategory1Id, selectedCategory2Id, selectedCategory3Id } = cForm
      this.c1Id = selectedCategory1Id || 0
      this.c2Id = selectedCategory2Id || 0
      this.c3Id = selectedCategory3Id || 0
      if (selectedCategory3Id) {
        this.getData()
      } else {
        this.spuList = []
      }
    },
    getDataPage(page) {
      this.page = page
      this.getData()
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    changeScene(scene) {
      this.scene = scene
      if (scene == 0) {
        this.getData()
      }
    },
    async getData() {
      const result = await this.$productApi.spu.reqSpuList(this.page, this.pageSize, this.c3Id)
      if (result.code == 200) {
        this.spuList = result.data.records
      } else {
        this.$message.error(result.message)
      }
    },
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    addSpu() {
      this.scene = 1
      this.$refs.spu.initAddSpuData(this.c3Id)
    },
    async deleteSpu(row) {
      const result = await this.$productApi.spu.reqRemoveSpu(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getData()
      } else {
        this.$message.error(result.message)
      }
    },
    addSku(row) {
      this.scene = 2
      this.$refs.sku.initData(this.c1Id, this.c2Id, this.c3Id, row)
    },
    async handler(row) {
      this.spu = row
      this.dialogTableVisible = true
      const result = await this.$productApi.sku.reqSkuList(row.id)
      if (result.code == 200) {
        this.loading = false
        this.skuList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    close(done) {
      this.spu = {}
      this.loading = true
      done()
    }
  }
}
</script>

<style></style>
