<template>
  <div class="content-wrap">
    <el-form label-width="70px" :model="record" label-position="top">
      <el-select v-model="monitorid" placeholder="请选择电表">
   <el-option
     v-for="item in options"
     :key="item.id"
     :label="item.name"
     :value="item.id">
   </el-option>
 </el-select>
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
  name: 'Addrecord',
  data () {
    return {
      record: {
        value: '',
        date: '',
      },
      monitorid: '',
      options: [],
      pagetitle: '新增水电表记录',
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  created () {
    console.log(this.$store.state.monitordetail);
    this.initOptions();
  },
  methods: {
    handleToAdd () {
      const newrecord = window.firebase.database().ref(this.$store.state.monitortype + '/' + this.monitorid + '/records').push();
      newrecord.set({
        value: this.record.value,
        date: this.record.date.valueOf(),
      });
      this.$router.push({
        path: '/managerecord',
      });
    },
    initOptions () {
      const table = {
        eletricmonitors: '电表',
        watermonitors: '水表',
      };
      const that = this;
      this.$store.state.monitordetail.forEach((e) => {
        that.options.push({
          name: table[that.$store.state.monitortype] + e.name,
          id: e.id,
        });
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
