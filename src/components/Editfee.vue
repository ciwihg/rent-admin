<template>
  <div class="add-from-wrap">
    <el-form label-width="70px" :model="formdata" label-position="left">
      <el-form-item label="名称">
        <el-input v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="formdata.price"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" round @click="handleSave">保存</el-button>
  </div>
</template>

<script>
export default {
  name: 'Editfee',
  data () {
    return {
      formdata: {
        name: '',
        price: '',
      },
      tables: {
        water: 'waterfees',
        eletric: 'eletricfees',
      },
      table: '',
      path: '',
    };
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.path = from.path;
      vm.table = vm.tables[from.path.match(/\/(.+)/)[1]];
      window.firebase.database().ref(vm.table + '/' + to.params.id).once('value',(dataSnapshot) => {
        vm.formdata = dataSnapshot.val();
      });

    });
  },
  created () {

  },
  methods: {
    handleSave () {
      window.firebase.database().ref(this.table + '/' + this.$route.params.id).set(this.formdata).then(() => {
        this.$router.push(this.path);
      }).catch( () => {
        console.log('write failed');
      });
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
