<template>
  <div class="hello">
    <div class="houses-head-wrap">
      <el-button type="primary" size="small" round @click="handleToAdd">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        prop="number"
        label="房号"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="type"
        label="户型"
        width="min-width">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :filters="[{text: '横潭大街32号', value: '横潭大街32号'}, {text: '朝阳巷5号', value: '朝阳巷5号'}, {text: '横潭市场', value: '横潭市场'}]"
        :filter-method="filterHandler"
        width="min-width">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="50px"
        label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="handleNmenuClick">
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{house:scope.row,action:'records'}">水电表记录</el-dropdown-item>
              <el-dropdown-item :command="{house:scope.row,action:'history'}">出租历史</el-dropdown-item>
              <el-dropdown-item :command="{house:scope.row,action:'edit'}">编辑</el-dropdown-item>
              <el-dropdown-item :command="{house:scope.row,action:'delete'}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        <!--<el-button
          size="mini"
          v-on:click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          v-on:click="handleDelect(scope.row)">删除</el-button>-->
    </template>
  </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Utils from '../utils.js';
export default {
  name: 'HelloWorld',
  data() {
    return {
      inputdata: '',
      tableData: [],
      pagetitle: '租盘管理',
    };
  },
  props: {
    msg: String,
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  created() {
    const ts = Date.now();
    const that = this;
    window.firebase.database().ref('houses').on('value', (dataSnapshot) => {
      let total = 0;
      dataSnapshot.forEach((e) => {
        total += Number(e.val().price);
      });
      console.log(total);
      that.tableData = Utils.Object2Array(dataSnapshot.val());
      console.log(Date.now()-ts);
    });
  },
  methods: {
    handleClick() {
      const temparray = this.tableData ? this.tableData.map(i => i) : [];
      temparray.push({
        number: this.inputdata,
        type: '一房一厅',
        address: '横潭大街32-1号',
      });
      window.firebase.database().ref('test').set(temparray);
      // console.log(window.firebase);
      // console.log(this.inputdata);
    },
    handleDelect(a) {
      this.$confirm(`删除 ${a.number}-${a.type}-${a.address} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          window.firebase.database().ref('houses/' + a.id).remove();
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
    handleEdit(a) {
      this.$router.push({
        path: '/edithouse/'+a.id,
      });
    },
    handleToAdd() {
      this.$router.push({
        path: '/add',
      });
    },
    handleNmenuClick (c) {
      switch (c.action) {
        case 'records': this.$store.commit('sethouse', c.house);this.$store.commit('setwatermonitors', c.house.watermonitors);
        this.$store.commit('seteletricmonitors', c.house.eletricmonitors);this.$router.push({path: '/managerecord'});break;
        case 'history': this.$router.push({path: '/history'});this.$store.commit('sethouse', c.house);break;
        case 'edit': this.handleEdit(c.house); break;
        case 'delete': this.handleDelect(c.house); break;
      }
    },
    filterHandler (value,row) {
      return row.address === value;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.houses-head-wrap{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
</style>
