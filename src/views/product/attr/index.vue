<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect @getSelectCategoryId="getSelectCategoryId" :disab="dialogFormVisible"/>
    </el-card>

    <el-card style="margin: 20px 0px;">

      <div v-show="!dialogFormVisible">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px;" @click="showAddAttrForm"
          :disabled="canAddAttr">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%;" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="attrValueList" label="属性名称" width="width">
            <template slot-scope="{row}">
              <el-tag type="success" v-for="item in row.attrValueList" :key="item.id" style="margin: 0 5px;">{{
                item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" @click="showUpdateAttrForm(row)" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <div v-show="dialogFormVisible">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
          :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="formClose">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                :ref="$index" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1">{{ fomSubmitText }}</el-button>
        <el-button @click="formClose">取消</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
//深拷贝方法引入                                                              
import cloneDeep from "lodash/cloneDeep";

export default {
  name: 'Attr',
  data() {
    return {
      attrList: [],
      dialogFormVisible: false,
      fomSubmitText: '',
      selectedAttrId: undefined,
      attrInfo: {
        attrName: '',
        attrValueList: [],
        // {attrId:0属性名的id而不是属性值的id,valueName:''}
        categoryId: 0,
        categoryLevel: 3
      },
      c1Id: 0,
      c2Id: 0,
      c3Id: 0,
    }
  },
  computed: {
    canAddAttr() {
      return (this.c1Id > 0 && this.c2Id > 0 && this.c3Id > 0) ? false : true
    },
  },
  methods: {
    getSelectCategoryId(cForm) {
      let { selectedCategory1Id, selectedCategory2Id, selectedCategory3Id } = cForm
      this.c1Id = selectedCategory1Id || 0
      this.c2Id = selectedCategory2Id || 0
      this.c3Id = selectedCategory3Id || 0
      if (selectedCategory3Id) {
        this.getData()
      } else {
        this.attrList = []
      }
    },
    async getData() {
      let result = await this.$productApi.attr.reqAttrList(this.c1Id, this.c2Id, this.c3Id)
      if (result.code == 200) {
        this.attrList = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    clearForm() {
      this.selectedAttrId = undefined
      this.attrInfo.attrName = ''
      this.attrInfo.attrValueList = []
      this.attrInfo.categoryId = 0
    },
    formClose() {
      this.clearForm()
      this.dialogFormVisible = false
    },
    showAddAttrForm() {
      this.clearForm()
      this.fomSubmitText = '添加'
      this.dialogFormVisible = true
    },
    showUpdateAttrForm(attr) {
      this.clearForm()
      this.fomSubmitText = '修改'
      this.selectedAttrId = attr.id
      this.attrInfo.attrName = attr.attrName
      this.attrInfo.attrValueList = attr.attrValueList
      this.attrInfo.attrValueList.forEach((item) => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, "flag", false);
      });
      this.attrInfo.categoryId = this.c3Id
      this.dialogFormVisible = true
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.selectedAttrId, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag: true,
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //失却焦点的事件---切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
       if(row.valueName.trim()==''){
         this.$message('请你输入一个正常的属性值');
         return;
       }
       //新增的属性值不能与已有的属性值重复
      let isRepat  = this.attrInfo.attrValueList.some(item=>{
          //需要将row从数组里面判断的时候去除
          //row最新新增的属性值【数组的最后一项元素】
          //判断的时候，需要把已有的数组当中新增的这个属性值去除
          if(row!==item){
            return row.valueName==item.valueName;
          }
       });

       if(isRepat) return;
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async addOrUpdateAttr(){
      let data = cloneDeep(this.attrInfo);
      //整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      //提交给服务器数据当中不应该出现flag字段
      data.attrValueList = data.attrValueList.filter(item=>{
          //过滤掉属性值不是空的
          if(item.valueName!=''){
            //删除掉flag属性
            delete item.flag;
            return true;
          }
      })
      data.attrValueList.forEach(item=>{
        if(typeof(item.attrId) == undefined) {
          delete item.attrId;
        }
      })
      data.categoryId = this.c3Id
      try {
         //发请求
        await this.$productApi.attr.reqAddAttrInfo(data);
        //展示平台属性的信号量进行切换
        this.dialogFormVisible = false;
        //提示消失
        this.$message({type:'success',message:'保存成功'});
        //保存成功以后需要再次获取平台属性进行展示
        this.getData();
      } catch (error) {
        this.$message.error('保存失败')
      }

    }
  },
}
</script>

<style></style>