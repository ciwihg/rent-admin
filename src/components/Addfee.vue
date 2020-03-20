<template>
  <div class="add-from-wrap">
    <el-table :data="tableData"
    stripe
    style="width:100%;">
      <el-table-column
        fixed
        prop="number"
        label="ITEM NO."
        >
      </el-table-column>
      <el-table-column
        fixed
        prop="name"
        label="PRODUCT NAME"
        >
      </el-table-column>
      <el-table-column
        fixed
        prop="color"
        label="COLOR"
        >
      </el-table-column>
      <el-table-column
        fixed
        prop="size"
        label="SIZE"
        >
      </el-table-column>
      <el-table-column
        fixed
        prop="unit"
        label="UNIT"
        >
      </el-table-column>
      <el-table-column
        fixed
        prop="qty"
        label="QTY"
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Addfee',
  data () {
    return {
      formdata: {
        name: '',
        price: '',
      },
      table: {
        water: 'waterfees',
        eletric: 'eletricfees',
      },
      path: '',
      pagetitle: '新增收费项目',
      tableData:[
        {
          number: '1',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Crystal',
          size: '5mm stones',
          unit: 'pc',
          qty: '70',
        },
        {
          number: '2',
          name: 'Pearl 425pcs 5mm stones',
          color: 'Pearl',
          size: '5mm stones',
          unit: 'pc',
          qty: '98',
        },
        {
          number: '3',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Turquoise',
          size: '5mm stones',
          unit: 'pc',
          qty: '37',
        },
        {
          number: '4',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Pink',
          size: '5mm stones',
          unit: 'pc',
          qty: '48',
        },
        {
          number: '5',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Blue',
          size: '5mm stones',
          unit: 'pc',
          qty: '73',
        },
        {
          number: '6',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Red',
          size: '5mm stones',
          unit: 'pc',
          qty: '56',
        },
        {
          number: '7',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Champagne',
          size: '5mm stones',
          unit: 'pc',
          qty: '44',
        },
        {
          number: '8',
          name: '775pcs 3mm stones',
          color: 'Crystal',
          size: '3mm stones',
          unit: 'pc',
          qty: '100',
        },
        {
          number: '9',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Jelly white',
          size: '5mm stones',
          unit: 'pc',
          qty: '61',
        },
        {
          number: '10',
          name: 'GRUEN 468pcs 5mm stones',
          color: 'Black',
          size: '5mm stones',
          unit: 'pc',
          qty: '72',
        },
      ],
    };
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      vm.$store.commit('settitle', vm.pagetitle);
    });
  },
  beforeRouteEnter (to, from, next) {
    //console.log(this.table[from.path.match(/\/(.+)/)[1]]);
    next( (vm) => {
      vm.path = from.path;
      vm.table = vm.table[vm.path.match(/\/(.+)/)[1]];
      console.log(vm.table);
    });
  },
  methods: {
    handleAdd () {
      const newitem = window.firebase.database().ref(this.table).push();
      newitem.set(this.formdata).then(() => {
        this.$router.push({
          path: this.path,
        });
      }).catch(() => {
        console.log('write failed');
      });
    },
  }
}
</script>

<style scoped>
.add-from-wrap {
  padding: 50px 15px;
  text-align: center;
}
</style>
