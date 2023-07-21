<template>
  <div>
    <el-form v-model="categoryForm" :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="categoryForm.selectedCategory1Id" placeholder="请选择" :disabled="disab" @change="handler1">
          <el-option v-for="c1 in category1List" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryForm.selectedCategory2Id" placeholder="请选择" :disabled="disab" @change="handler2">
          <el-option v-for="c2 in category2List" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryForm.selectedCategory3Id" placeholder="请选择" :disabled="disab" @change="handler3">
          <el-option v-for="c3 in category3List" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['disab'],
  data() {
    return {
      categoryForm: {
        selectedCategory1Id: '',
        selectedCategory2Id: '',
        selectedCategory3Id: ''
      },
      category1List: [],
      category2List: [],
      category3List: []
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$productApi.attr.reqCategory1List()
      if (result.code == 200) {
        this.category1List = result.data
      } else {
        this.$message.error('获取一级分类失败')
      }
    },
    async handler1() {
      this.categoryForm.selectedCategory2Id = ''
      this.categoryForm.selectedCategory3Id = ''
      this.$emit('getSelectCategoryId', { ...this.categoryForm })
      const result = await this.$productApi.attr.reqCategory2List(this.categoryForm.selectedCategory1Id)
      if (result.code == 200) {
        this.category2List = result.data
      } else {
        this.$message.error('获取二级分类失败')
      }
    },
    async handler2() {
      this.categoryForm.selectedCategory3Id = ''
      this.$emit('getSelectCategoryId', { ...this.categoryForm })
      const result = await this.$productApi.attr.reqCategory3List(this.categoryForm.selectedCategory2Id)
      if (result.code == 200) {
        this.category3List = result.data
      } else {
        this.$message.error('获取三级分类失败')
      }
    },
    handler3() {
      this.$emit('getSelectCategoryId', { ...this.categoryForm })
    }
  }

}
</script>

<style></style>
