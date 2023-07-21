<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" v-model="categoryForm">
            <el-form-item label="一级分类">
                <el-select placeholder="请选择" :disabled="disab" v-model="categoryForm.selectedCategory1Id" @change="handler1">
                    <el-option v-for="c1 in category1List" :label="c1.name" :value="c1.id" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" :disabled="disab" v-model="categoryForm.selectedCategory2Id" @change="handler2">
                    <el-option v-for="c2 in category2List" :label="c2.name" :value="c2.id" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="请选择" :disabled="disab" v-model="categoryForm.selectedCategory3Id" @change="handler3">
                    <el-option v-for="c3 in category3List" :label="c3.name" :value="c3.id" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelect',
    mounted() {
      this.getCategory1List()
    },
    props: ['disab'],
    data() {
      return {
        categoryForm: {
            selectedCategory1Id: '', 
            selectedCategory2Id: '', 
            selectedCategory3Id: '', 
        },
        category1List: [],
        category2List: [],
        category3List: [],
      }
    },
    methods: {
      async getCategory1List() {
        let result = await this.$productApi.attr.reqCategory1List()
        if(result.code ==200) {
          this.category1List = result.data
        }else {
          this.$message.error('获取一级分类失败');
        }
      },
      async handler1() {
        this.categoryForm.selectedCategory2Id = ''
        this.categoryForm.selectedCategory3Id = ''
        this.$emit('getSelectCategoryId', {...this.categoryForm})
        let result = await this.$productApi.attr.reqCategory2List(this.categoryForm.selectedCategory1Id)
        if(result.code ==200) {
          this.category2List = result.data
        }else {
          this.$message.error('获取二级分类失败');
        }
      },
      async handler2() {
        this.categoryForm.selectedCategory3Id = ''
        this.$emit('getSelectCategoryId', {...this.categoryForm})
        let result = await this.$productApi.attr.reqCategory3List(this.categoryForm.selectedCategory2Id)
        if(result.code ==200) {
          this.category3List = result.data
        }else {
          this.$message.error('获取三级分类失败');
        }
      },
      handler3() {
        this.$emit('getSelectCategoryId', {...this.categoryForm})
      },
    },
    
}
</script>

<style></style>