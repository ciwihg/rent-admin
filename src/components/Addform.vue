<template>
  <div class="add-from-wrap">
    <el-form label-width="70px" :model="house" label-position="top">
      <el-form-item label="房号">
        <el-input v-model="house.number"></el-input>
      </el-form-item>
      <el-form-item label="户型">
        <el-input v-model="house.type"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="house.address"></el-input>
      </el-form-item>
      <el-form-item label="租金">
        <el-input v-model="house.price"></el-input>
      </el-form-item>
      <el-form-item label="押金">
        <el-input v-model="house.subprice"></el-input>
      </el-form-item>
      <el-form-item label="是否收取电费">
        <el-switch
          v-model="house.eletric"
          active-text="收取"
          inactive-text="不收取">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否收取水费">
        <el-switch
          v-model="house.water"
          active-text="收取"
          inactive-text="不收取">
        </el-switch>
      </el-form-item>
      <el-form-item label="收费项目">
        <el-select v-model="house.chargeitems" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" round @click="handleAdd">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Addform',
  data() {
    return {
      inputdata: 'addpage',
      options: [],
      house: {
        number: '',
        type: '',
        address: '',
        price: '',
        subprice: '',
        chargeitems: [],
        eletric: false,
        water: false,
      },
      pagetitle: '新增租盘',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  props: {
    msg: String,
  },
  created () {
    const that=this;
    window.firebase.database().ref('chargeitems').once('value', (dataSnapshot) => {
      const temparray = [];

      for (let e in dataSnapshot.val()){
        if(dataSnapshot.val()[e]['type'] == 'universal'){
          temparray.push({
            label: dataSnapshot.val()[e]['name'],
            value: e,
          });
        }
      }
      that.options = temparray;
      console.log(temparray);
    });
  },
  methods: {
    handleAdd () {
      const newitem = window.firebase.database().ref('houses').push();
      newitem.set(this.house).then(() => {
        this.$confirm('是否立即为该房源初始化水电表数值?', '提示', {
            confirmButtonText: '立即初始化',
            cancelButtonText: '稍后再初始化',
            type: 'warning'
          }).then( () => {
            this.$router.push({
              path: '/initrecord/' + newitem.key,
            });
          }).catch( () => {
            this.$router.push({
              path: '/hi',
            });
          });

      }).catch(() => {
        console.log('write failed');
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add-from-wrap {
  padding: 50px 15px;

}

</style>
