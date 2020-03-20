<template>
  <div>
    <Mnavbar :itemdata="navdata" @select="handleSwitch"></Mnavbar>
    <div v-if="!autopage">
      <div class="search-input"style="display:flex; justify-content:center;">
        <div>
          <el-input v-model="filternum" placeholder="请输入房号"></el-input>
        </div>
        <div>
          <el-select v-model="filteraddr" placeholder="请选择地址">
            <el-option
              v-for="item in addroptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
             </el-option>
           </el-select>
       </div>
       </div>
         <div class="search-btn">
           <el-button size='small' round type='primary' @click="handleFind">查找</el-button><el-button size='small' round type='primary' @click="handleReset">重置</el-button>
         </div>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%" @row-click="handleRowclick">
      <el-table-column
        prop="number"
        label="房号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="min-width">
      </el-table-column>
      <el-table-column
        prop="date"
        label="起租日"
        width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Utils from '../utils.js';
import Mnavbar from './Mnavbar.vue';
export default {
  name: 'Checkout',
  components: {
    Mnavbar: Mnavbar,
  },
  data () {
    return {
      autopage: true,
      addroptions:[
        {
          label: '横潭大街32号',
          value: '横潭大街32号',
        },
        {
          label: '朝阳巷5号',
          value: '朝阳巷5号',
        },
        {
          label: '横潭市场',
          value: '横潭市场',
        },
      ],
      filteraddr: '',
      filternum: '',
      navdata: [
        {
          label: '自动推荐',
          key: 'auto',
        },
        {
          label: '自定义查找',
          key: 'search',
        }
      ],
      tableData: [],
      allData: [],
      autoData: [],
      filterData: [],
      pagetitle: '抄表及打印',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  created () {
    const that = this;
    window.firebase.database().ref('houses').once('value', (dataSnapshot) => {
      dataSnapshot.forEach((element) => {
        let obj = element.val();
        if(obj.rentdate){
        obj.id = element.key;
        obj.rentdate&&(obj.date = Utils.getDate(obj.rentdate));
        that.allData.push(obj);
        }
      });
      that.tableData =  that.autoData = that.filterDate(that.allData,3);
      console.log(that.tableData);
    });
  },
  methods: {
    handleRowclick (row) {
      this.$router.push({
        path: '/generatebill/' + row.id,
      });
    },
    filterDate (datas,radius) {
      let day = 1000*60*60*24;
      let arrange = [];
      for(let i = -radius;i<=radius;i++){
        let today = new Date(Date.now()+i*day);
        arrange.push(today.getDate());
      }
      return  datas.filter((item) => {
        let tempdate = new Date(item.rentdate);
        return item.active&&arrange.includes(tempdate.getDate());

      });
    },
    handleSwitch(action){
      if(action == 'auto'){
        this.autopage = true;
        this.tableData = this.autoData;
      }else{
        this.autopage = false;
        this.tableData = [];
      }
    },
    handleReset () {
      this.tableData = [];
    },
    handleFind () {
      const that = this;
      this.tableData = this.allData.filter((item) => {
        return (item.number == that.filternum)&&(item.address == that.filteraddr);
      });
    },
  },
}
</script>

<style scoped>
.search-input{
  display: flex;
  justify-content: center;
}
.search-input div{
  margin: 5px 2.5px 5px 5px;
}
.search-btn{
  text-align: center;
}
</style>
