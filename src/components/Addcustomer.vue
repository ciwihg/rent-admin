<template>
  <div class="add-form">
    <el-form :model="formdata" label-width="80px" label-position="top">
      <el-form-item label="入住日期">
        <el-date-picker
        v-model="formdata.regisdate"
        type="date"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formdata.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="formdata.idnum"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formdata.phonenumber"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-wrap"><el-button size="small" round type="primary" @click="handleAdd">保存</el-button></div>
  </div>
</template>

<script>
export default {
  name: 'Addcustomer',
  data () {
    return {
      formdata:{
        regisdate:'',
        name:'',
        idnum:'',
        phonenumber:'',
      }
    };
  },
  methods: {
  handleAdd () {
    this.formdata.regisdate = this.formdata.regisdate.valueOf();
    if(this.$store.state.customertype == 'leader'){
    let newleader = window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/leaders').push();
    newleader.set(this.formdata);
    window.firebase.database().ref('houses/' + this.$store.state.house.id +'/rentdate').set(this.formdata.regisdate);
  }
    else{
      this.formdata.leader = this.$store.state.leader;
    let newCustomer = window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/members').push();
     newCustomer.set(this.formdata);
    }
    this.$router.push({
      path: '/history',
    });
  },
 },
}
</script>

<style scoped>
.add-form{
  padding: 15px 10px;
}
.btn-wrap{
  text-align: center;
}
</style>
