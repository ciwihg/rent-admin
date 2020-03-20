<template>
  <div>
    <div class="info-title"><strong>{{$store.state.house.number + '   ' + $store.state.house.address}}</strong></div>
    <div class="houses-head-wrap">
      <el-switch
        v-model="monitortype"
        active-color="#13ce66"
        inactive-color="#409EFE"
        active-value="watermonitors"
        inactive-value="eletricmonitors"
        @change="handleTypeswitch"
        active-text="水表记录"
        inactive-text="电表记录">
      </el-switch>
      <div style="flex-grow: 1;"></div>
      <el-button type="primary" size="small" round @click="handleToAdd">添加</el-button>
    </div>
    <div style="margin-top:10px;" v-for="(item,index) in tableData">
      <div class="monitor-title">{{monitortype=='eletricmonitors'?`电表${item.name}`:`水表${item.name}`}}</div>
      <el-table :data="item.records">
        <el-table-column
          prop="value"
          label="数值"
          width="80">
        </el-table-column>
        <el-table-column
          prop="dateformate"
          label="日期"
          width="min-width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="min-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-on:click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-on:click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Utils from '../utils.js';
export default {
  name: 'Managerecord',
  data () {
    return {
     tableData: [],
     monitortype: '',
     eletricwatched: false,
     waterwatched: false,
     pagetitle: '水电表记录',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  created () {
    this.monitortype = this.$store.state.monitortype;
    this.init();
  },
  methods: {
    init () {
      const ts = Date.now();
      const that = this;
      Promise.all(this.getRecords()).then(() => {
        console.log(Date.now()-ts);
        if(this.monitortype === 'eletricmonitors'){
          (!that.eletricwatched)&&(that.watchRecords(), that.eletricwatched = true);
        }
        if(this.monitortype === 'watermonitors'){
          (!that.waterwatched)&&(that.watchRecords(), that.waterwatched = true);
        }
      });
    },
    watchRecords () {
      const that = this;
      this.$store.state[this.monitortype].map((e) => {
        return window.firebase.database().ref(this.monitortype + '/' + e).on('value', (dataSnapshot) => {
          let obj = {
            name: dataSnapshot.val().name,
            id: e,
            records: Utils.Object2Array(dataSnapshot.val().records, e),
          } ;
          that.tableData = that.tableData.map((e) => {
            if(e.name === obj.name){
              return obj;
            }else{
              return e;
            }
          });

        });
      });
    },
    getRecords () {
      const that = this;
      return this.$store.state[this.monitortype].map((e) => {
        return window.firebase.database().ref(this.monitortype + '/' + e).once('value', (dataSnapshot) => {
          console.log('k');
          let obj = {
            name: dataSnapshot.val().name,
            id: e,
            records: Utils.Object2Array(dataSnapshot.val().records, e),
          } ;
          that.tableData.push(obj);

        });
      });

    },
    handleEdit (a) {
     console.log(a);
     this.$store.commit('setclickeditem', a);
     this.$router.push({
       path: 'editrecord',
     })
    },
    handleDelete (a) {
      this.$confirm(`删除 ${a.value} - ${a.dateformate} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          window.firebase.database().ref(this.monitortype + '/' + a.parentid + '/records/' + a.id).remove();
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
    handleTypeswitch () {
      this.tableData = [];
      this.$store.commit('setmonitortype', this.monitortype);
      this.init();
    },
    handleToAdd () {
      this.$store.commit('setmonitordetail', this.tableData);
      this.$router.push({
        path: '/addrecord',
      })
    },
  },
}
</script>

<style scoped>
.info-title{
  color: #4a5a6a;
  text-align: center;
  padding-top: 15px;
}
.houses-head-wrap{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 0px 20px;
  align-items: center;
}
.monitor-title{
  color: white;
  background-color: #049EFE;
  padding: 10px 15px;
}
</style>
