<template>
  <div >
    <div >
      <h5 class="bill-title">电费</h5>
      <el-table v-for="(item,index) in billdata.eletric" :data="item">
        <el-table-column
        prop="current"
        label="本次记录">
        </el-table-column>
        <el-table-column
        prop="lastrecord"
        label="末次记录">
        </el-table-column>
        <el-table-column
        prop="usage"
        label="度差">
        </el-table-column>
        <el-table-column
        prop="price"
        label="单价">
        </el-table-column>
        <el-table-column
        prop="total"
        label="价格">
        </el-table-column>
      </el-table>
    </div>
    <div >
      <h5 class="bill-title">水费</h5>
      <el-table v-for="(item,index) in billdata.water" :data="item">
        <el-table-column
        prop="current"
        label="本次记录">
        </el-table-column>
        <el-table-column
        prop="lastrecord"
        label="末次记录">
        </el-table-column>
        <el-table-column
        prop="usage"
        label="度差">
        </el-table-column>
        <el-table-column
        prop="price"
        label="单价">
        </el-table-column>
        <el-table-column
        prop="total"
        label="价格">
        </el-table-column>
      </el-table>
    </div>
    <el-table show-summary :data="billdata.chargeitems">
      <el-table-column
      prop="name"
      label="款项">
      </el-table-column>
      <el-table-column
      prop="price"
      label="价格">
      </el-table-column>
    </el-table>
    <div class="link-btn-wrap"><a class="link-button" :href="'mprint://myprint.ciwi/easyhome?'+billdata.print">打印</a></div>
  </div>
</template>

<script>
export default {
  name: 'Bill',
  props: ['initdata'],
  data () {
    return {
    };
  },
  computed: {
    billdata () {
      const tempbill = {
        eletric: [],
        water: [],
        chargeitems: [],
        print:'',
      };
      let str3 = '';
      this.initdata.chargeitems.forEach((e) => {
        str3 = str3 + '&' + e.name + '=' + e.price;
      });
      let eletricTotal = 0;
      let lastTotal = 0, currentTotal = 0, price;
      this.initdata.eletric.forEach((item) => {
        lastTotal += Number(item.lastrecord);
        currentTotal += Number(item.current);
        item.usage = item.current - item.lastrecord;
        item.total = (item.usage * item.price).toFixed(2);
        price = item.price;
        eletricTotal += parseFloat(item.total);
      });
      let str2 = '&ef=l' + lastTotal + 'c' + currentTotal + 'p' + price;
      tempbill.eletric = this.initdata.eletric.map((a) => {
        return [a];
      });
      tempbill.chargeitems.push({
        name: '电费',
        price: eletricTotal,
      });
      let waterTotal = 0;
      lastTotal = 0, currentTotal = 0, price = 0;
      this.initdata.water.forEach((item) => {
        lastTotal += Number(item.lastrecord);
        currentTotal += Number(item.current);
        item.usage = item.current - item.lastrecord;
        item.total = (item.usage * item.price).toFixed(2);
        price = item.price;
        waterTotal += parseFloat(item.total);
      });
      let str1 = 'wf=l' + lastTotal + 'c' + currentTotal + 'p' + price;
      tempbill.water = this.initdata.water.map((a) => {
        return [a];
      });
      tempbill.chargeitems.push({
        name: '水费',
        price: waterTotal,
      });
      this.initdata.chargeitems.forEach((item) => {
        tempbill.chargeitems.push(item);
      });
      tempbill.print = str1 + str2 + str3 + '&number=' +this.initdata.number;
      return tempbill;
    }
  }
}
</script>

<style scoped>
.bill-title{
  padding: 15px 10px;
  background-color: #f5f7fa;
}
.link-btn-wrap{
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.link-button{
  text-decoration: none;
  display: inline-block;
  padding: 5px 20px;
  font-size: 15px;
  color: white;
  background-color: #049efe;
  border-radius: 5px;
}
</style>
