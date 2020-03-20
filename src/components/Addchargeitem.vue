<template>
  <div class="add-from-wrap">
    <el-form label-width="70px" :model="formdata" label-position="left">
      <el-form-item label="名称">
        <el-input v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="formdata.price"></el-input>
      </el-form-item>
      <el-form-item label="收费类型">
        <el-select v-model="formdata.type" placeholder="请选择">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" round @click="handleAdd" :disabled="saveavaliable">保存</el-button>
  </div>
</template>

<script>
export default {
  name: 'Addchargeitem',
  data () {
    return {
      options: [
        {
          label: '其他费用',
          value: 'universal',
        },
        {
          label: '水费',
          value: 'water',
        },
        {
          label: '电费',
          value: 'eletric',
        },
      ],
      units: [
        {
          label: 'KWH',
          vaule: 'KWH',
        },
        {
          label: 'm³',
          value: 'm³',
        }
      ],
     formdata: {
       name: '',
       price: '',
       type: '',
       unit: '',
     },
     pagetitle: '新增收费项目',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  computed: {
    saveavaliable () {
      return (this.formdata.name!==''&&this.formdata.price!=='') ? false:true;
    },
    unit () {
      const units = {
        universal: '月',
        water: 'm³',
        eletric: 'KWH',
      };
      return units[this.formdata.type];
    },
  },
  methods: {
    handleAdd () {
      const newitem = window.firebase.database().ref('chargeitems').push();
      this.formdata.unit = this.unit;
      newitem.set(this.formdata).then(() => {
        this.$router.push({
          path: '/chargeitems',
        });
      }).catch(() => {
        console.log('write failed');
      });
    },
    handleChange (a) {
      if(a){
        this.formdata.unit = '月';
      }else {
        this.formdata.unit = '';
      }
    },
  },
}
</script>

<style scoped>
.add-from-wrap {
  padding: 50px 15px;
  text-align: center;
}
</style>
