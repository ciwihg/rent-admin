<template>
<div>
  <div class="houses-head-wrap">
    <el-button type="primary" size="small" round @click="handleToAdd">添加</el-button>
  </div>
  <div class="title-wrap">其他费用</div>
  <el-table
    :data="universal"
    stripe
    style="width: 100%">
    <el-table-column
      fixed
      prop="name"
      label="项目"
      width="80px">
    </el-table-column>
    <el-table-column
      prop="price"
      label="价格(单位:元)"
      width="min-width">
    </el-table-column>
    <el-table-column
      fixed="right"
      width="150px"
      label="操作">
      <template slot-scope="scope">
      <el-button
        size="mini"
        v-on:click="handleEdit(scope.row)">编辑</el-button>
      <el-button
        size="mini"
        type="danger"
        v-on:click="handleDelect(scope.row)">删除</el-button>
  </template>
</el-table-column>
  </el-table>
  <div class="title-wrap">水电费</div>
  <el-table
    :data="usage"
    stripe
    style="width: 100%">
    <el-table-column
      fixed
      prop="name"
      label="项目"
      width="80px">
    </el-table-column>
    <el-table-column
      prop="price"
      label="价格(单位:元)"
      width="min-width">
    </el-table-column>
    <el-table-column
      fixed="right"
      width="150px"
      label="操作">
      <template slot-scope="scope">
      <el-button
        size="mini"
        v-on:click="handleEdit(scope.row)">编辑</el-button>
      <el-button
        size="mini"
        type="danger"
        v-on:click="handleDelect(scope.row)">删除</el-button>
  </template>
</el-table-column>
  </el-table>
</div>
</template>
<script>
import Utils from '../utils.js';
export default {
  name: 'chargeitems',
  data () {
    return {
      universal: [],
      usage: [],
      pagetitle: '收费管理',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  created () {
    const table = {
      universal: '',
      water: '',
      eletric: '',
    };
    window.firebase.database().ref('chargeitems').on('value', (dataSnapshot) => {
      //that.tableData = dataSnapshot.val();
      table.universal = this.universal = [];
      table.eletric = table.water = this.usage = [];
      for (let e in dataSnapshot.val()){
        table[dataSnapshot.val()[e]['type']].push({
          id: e,
          name: dataSnapshot.val()[e]['name'],
          price: `${Utils.formatPrice(dataSnapshot.val()[e]['price'])}/${dataSnapshot.val()[e]['unit']}`,
        });
      }
    });
  },
  methods:{
    handleEdit(a) {
      //window.firebase.database().ref('chargeitems/' + a.id).set({

      //});
      this.$router.push({
        path: '/editchargeitem/'+a.id,
      });
    //  console.log(a);
    },
    handleDelect(a) {
      this.$confirm('删除' + a.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          window.firebase.database().ref('chargeitems/' + a.id).remove();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch( () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

    },
    handleToAdd() {
      this.$router.push({
        path: '/addchargeitem',
      });
    },
  },
}
</script>

<style scoped>
.houses-head-wrap{
  margin: 20px 0px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
.title-wrap{
  color: white;
  background-color: #049EFE;
  padding: 10px 15px;
}
</style>
