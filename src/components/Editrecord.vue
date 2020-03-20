<template>
  <div class="content-wrap">
    <el-form label-width="70px" :model="record" label-position="top">
      <el-form-item label="数值">
        <el-input v-model="record.value"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="record.date"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="btn-wrap">
      <el-button type="primary" size="small" round @click="handleToAdd">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editrecord',
  data () {
    return {
      record: {
        value: '',
        date: '',
      },
      pagetitle: '修改水电表记录',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  created () {
    this.record.value = this.$store.state.clickeditem.value;
    this.record.date = new Date(this.$store.state.clickeditem.date);
  },
  methods: {
    handleToAdd () {
      window.firebase.database().ref(this.$store.state.monitortype + '/' + this.$store.state.clickeditem.parentid + '/records/' + this.$store.state.clickeditem.id).set({
        value: this.record.value,
        date: this.record.date.valueOf(),
      });
      this.$router.push({
        path: '/managerecord',
      });
    },
  },
}
</script>

<style scoped>
.content-wrap{
  padding: 20px 15px;
}
.btn-wrap{
  text-align: center;
}
</style>
