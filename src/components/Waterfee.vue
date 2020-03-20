<template>
  <div>
    <div class="houses-head-wrap">
      <el-button type="primary" size="small" round @click="handleToAdd">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        prop="name"
        label="名称"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价"
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
  name: '',
  data () {
    return {
      tableData: [

      ],
      tables: {
        water: 'waterfees',
        eletric: 'eletricfees',
      },
      table: '',
    };
  },
  beforeRouteEnter (to, from, next) {
    next( (vm) => {
      vm.table = vm.tables[to.path.match(/\/(.+)/)[1]];
      window.firebase.database().ref(vm.table).on('value', (dataSnapshot) => {

         vm.tableData = Utils.Object2Array(dataSnapshot.val());

      });
    });
  },
  methods: {
    handleEdit (a) {
      this.$router.push({
        path:'/editfee/' + a.id,
      });
    },
    handleDelect (a) {
      this.$confirm(`删除 ${a.name} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          window.firebase.database().ref(this.table + '/' + a.id).remove();
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
    handleToAdd () {
      this.$router.push({
        path:'/addfee',
      });
    },
  }
}
</script>

<style scoped>
.houses-head-wrap{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
</style>
