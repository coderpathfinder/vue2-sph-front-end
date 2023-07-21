<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search />
      </el-col>
      <el-col :span="12">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './search'
import Category from './category'
export default {
  name: 'Observe',
  components: {
    Search,
    Category
  }
}
</script>

<style scoped></style>
