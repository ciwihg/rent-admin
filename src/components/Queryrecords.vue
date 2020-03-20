<template>
  <div>
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
    </el-table>
  </div>
</template>

<script>
import Utils from '../utils.js';
export default {
  name: 'Queryrecords',
  data () {
    return {
      tableData: [],
    };
  },
  created () {
    const that = this;
    window.firebase.database().ref('houses').once('value', (dataSnapshot) => {
      that.tableData = Utils.Object2Array(dataSnapshot.val());
    });
  },
  methods: {
    handleRowclick (row) {
      this.$router.push({
        path: '/managerecord/' + JSON.stringify(row.eletricmonitors),
      });
    },
  },
}
</script>

<style scoped>
</style>
