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
      <el-checkbox v-model="checkout">离开登记</el-checkbox>
      <transition name="el-zoom-in-top">
      <el-form-item label="离开日期" v-if="checkout">
        <el-date-picker
        v-model="leavedate"
        type="date"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </transition>
    </el-form>
    <div class="btn-wrap"><el-button size="small" round type="primary" @click="handleAdd">保存</el-button></div>
  </div>
</template>

<script>
export default {
  name: 'Editcustomer',
  data () {
    return {
      formdata: {},
      checkout: false,
      leavedate: '',
    };
  },
  created (){
    window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/' + this.$store.state.customertype + '/' + this.$store.state.customer).once('value',(dataSnapshot) => {
      this.formdata = dataSnapshot.val();
      if(this.formdata.leavedate){
        this.checkout = true;
        this.leavedate = this.formdata.leavedate;
      }else{
        this.checkout = false;
      }
    });
  },
  methods: {
    handleAdd () {
     if(this.checkout){
       this.formdata.leavedate = this.leavedate.valueOf();
       if(this.$store.state.customertype == 'leaders'){
         console.log(this.$store.state.house.id);
          window.firebase.database().ref('houses/' + this.$store.state.house.id + '/active').set(false);
          console.log(112);
       }
     }else{
       this.formdata.leavedate = null;
       if(this.$store.state.customertype == 'leaders'){
          window.firebase.database().ref('houses/' + this.$store.state.house.id + '/rentdate').set(this.formdata.regisdate.valueOf());
       }
     }
     this.formdata.regisdate = this.formdata.regisdate.valueOf();
     window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/' + this.$store.state.customertype + '/' + this.$store.state.customer).set(this.formdata);
     this.$router.push({
       path: '/history',
     });
    },
  }
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
