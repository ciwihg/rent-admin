<template>
  <div>
    <Mnavbar @select="handleSelect" :itemdata="navdata"></Mnavbar>
    <div v-if="history">
      <div class="history-select">
        <el-select v-model="historybill" placeholder="请选择" @change="handlebillselect">
         <el-option
           v-for="(item,index) in historybills"
           :key="index"
           :label="item.label"
           :value="index">
         </el-option>
       </el-select>
     </div>
       <Mbill :initdata="historydata" v-if="billon"></Mbill>
    </div>
    <div v-show="addnew">
    <el-form label-width="70px" :model="house" label-position="left">
    <div v-for="(item,index) in eletricmonitors" v-show="house.eletric">
      <h4 class="info-title">{{'电表'+item.name}}</h4>
      <div class="info-wrap">
        <div class="last-record-row">{{`末次记录 ${item.lastrecord}   ${item.lastdate}` }}</div>
        <el-form-item label="本次记录">
          <el-input v-model="item.current" @change="handleChange"></el-input>
        </el-form-item>
      </div>
    </div>
    <div v-for="(item,index) in watermonitors" v-show="house.water">
      <h4 class="info-title">{{'水表'+item.name}}</h4>
      <div class="info-wrap">
        <div class="last-record-row">{{`末次记录 ${item.lastrecord}   ${item.lastdate}` }}</div>
        <el-form-item label="本次记录">
          <el-input v-model="item.current" @change="handleChange"></el-input>
        </el-form-item>
      </div>
    </div>
    </el-form>
    <div class="generate-wrap"> <el-button type="primary" round @click="generate">生成账单</el-button></div>
    <Mbill v-if="billon" :initdata="historydata"></Mbill>

  </div>
  </div>
</template>

<script>
import Utils from '../utils.js'
import Mnavbar from './Mnavbar.vue'
import Bill from './Bill.vue'
export default {
  name: 'generatebill',
  components: {
    Mnavbar: Mnavbar,
    Mbill: Bill,
  },
  data () {
    return {
      navdata: [{
        label: '抄表',
        key: 'addnew',
      },
      {
        label: '历史记录',
        key: 'history',
      }],
      house: {},
      eletricmonitors: [],
      watermonitors: [],
      chargeitems: {},
      print: '',
      billon: false,
      addnew: true,
      history: false,
      active: 'addnew',
      historybills: [],
      historybill: '',
      historydata: {
        eletric: [],
        water: [],
        chargeitems: [],
      },
      mcookie:{},
    };
  },
  beforeRouteEnter (to,from,next) {
    next((vm) => {

    })
  },
  computed: {
    bill () {
      const that = this;
      const tempbill = {
        eletric: [],
        water: [],
        chargeitems: [
          {
            name: '租金',
            price: this.house.price?this.house.price:0,
         },
         {
           name: '电费',
           price: 0,
         },
         {
           name: '水费',
           price: 0,
         }
        ],
      };
      if(this.eletricmonitors.length > 0){
      this.eletricmonitors.forEach((e) => {
        e.usage = e.current - e.lastrecord;
        (e.usage<0)&&(e.usage += 10000);
        e.total = (e.usage * e.price).toFixed(2);
        tempbill.chargeitems[1].price += parseFloat(e.total);
      });
      tempbill.eletric = this.eletricmonitors.map((e) => {
        let k = [e];
        return k;
      });
    }
      if(this.watermonitors.length > 0){
      this.watermonitors.forEach((e) => {
        e.usage = e.current - e.lastrecord;
        (e.usage<0)&&(e.usage += 1000);
        e.total = (e.usage * e.price).toFixed(2);
        tempbill.chargeitems[2].price += parseFloat(e.total);
      });
      tempbill.water = this.watermonitors.map((e) => {
        let k = [e];
        return k;
      });
    }
      this.house.chargeitems&&(this.house.chargeitems.forEach((e) => {
        tempbill.chargeitems.push(this.chargeitems[e]);
      }));
    return tempbill;
    },
  },
  created () {
    this.mcookie = Utils.parseCookie();
    const that = this;
    let p0 = this.getChargeitems();
    let p = new Promise((resolve, reject) => {
      window.firebase.database().ref('houses/' + that.$route.params.id).once('value').then((dataSnapshot) => {
        that.house = dataSnapshot.val();
        resolve();
    })
  });
     Promise.all([p, p0]).then(() => {
       that.getMonitors();
     });
  },
  methods: {
    getMonitors () {
      if(this.house.eletric) {
        this.getRecorddata('eletric');
      }
      if(this.house.water) {
        this.getRecorddata('water');
      }
    },
    getChargeitems () {
      const that = this;
       let p = new Promise((resolve, reject) => {
        window.firebase.database().ref('chargeitems').once('value', (dataSnapshot) => {
           that.chargeitems = dataSnapshot.val();
           resolve()
         });
       });
      return p;
    },
    getRecorddata (type) {
      const that = this;
      const tables= {
        eletric: {
          tname: 'eletricmonitors',
          hmonitors: this.house.eletricmonitors,
        },
        water: {
          tname: 'watermonitors',
          hmonitors: this.house.watermonitors,
        },
      };
      const temparray = [];
      const ts = Date.now();
      let dataPromises = tables[type].hmonitors.map((e) => {
        let getdata = new Promise((resolve0, reject) => {
          let obj = {
            current: '',
          };
          let p1 = new Promise((resolve1,reject) => {
            window.firebase.database().ref(tables[type].tname + '/' + e).once('value', (dataSnapshot) => {
              let records = Object.keys(dataSnapshot.val().records).map((e) => {
                return dataSnapshot.val().records[e];
              });
               Utils.quicksort(records);
               obj.name = dataSnapshot.val().name;
               obj.lastrecord = records[records.length-1].value;
               obj.lastdate = Utils.getDate(records[records.length-1].date);
               obj.records = records;
               resolve1();
            });
          });
          let p2 = new Promise((resolve2,reject) => {
            window.firebase.database().ref(tables[type].tname + '/' + e + '/priceid').once('value', (dataSnapshot) => {
               obj.id = e;
               (that.mcookie[obj.id])&&(obj.current = that.mcookie[obj.id]);
               obj.price = that.chargeitems[dataSnapshot.val()].price;
               resolve2();
            });
          });
          Promise.all([p1, p2]).then(() => {
            temparray.push(obj);
            resolve0();
          })
        });
        return getdata;

        });
        Promise.all(dataPromises).then(() => {
          if(type == 'water'){
            this.watermonitors =  temparray;
          }else{
            this.eletricmonitors =  temparray;
          }
         console.log(Date.now()-ts);
        });
      },
      addrecord () {
        this.eletricmonitors.forEach((item) => {
          let newitem = window.firebase.database().ref('eletricmonitors/' + item.id + '/records').push();
          newitem.set({
            value: item.current,
            date: Date.now().valueOf(),
          });
        });

        this.watermonitors.forEach((item) => {
          let newitem = window.firebase.database().ref('watermonitors/' + item.id + '/records').push();
          newitem.set({
            value: item.current,
            date: Date.now().valueOf(),
          });
        });

      },
      generate () {

        const that = this;
        that.historydata.eletric = [];
        that.historydata.water = [];
        that.historydata.chargeitems = [];
        this.eletricmonitors.forEach((item) => {
          that.historydata.eletric.push({
            lastrecord: item.lastrecord,
            current: item.current,
            price: item.price,
          });
        });
        this.watermonitors.forEach((item) => {
          that.historydata.water.push({
            lastrecord: item.lastrecord,
            current: item.current,
            price: item.price,
          });
        });
        this.house.chargeitems.forEach((element) => {
          that.historydata.chargeitems.push(this.chargeitems[element]);
        });
        that.historydata.chargeitems.push({
          name: '租金',
          price: this.house.price,
        });
        this.addrecord();
        that.historydata.number = this.house.number;
        this.billon = true;
      },
      handleSelect (item) {
        this[this.active] = false;
        this[item] = true;
        this.active = item;
        const that = this;
          this.billon = false;
        if(this.active == 'history'){
          this.eletricmonitors[0].records.forEach((e) => {
            e.label = Utils.getDate(e.date);
          });
          this.historybills = this.eletricmonitors[0].records.slice(1);
        }
      },
      handlebillselect (e) {
        const that = this;
        that.historydata.number = this.house.number;
        that.historydata.eletric = [];
        that.historydata.water = [];
        if(this.historydata.chargeitems.length == 0) {
          this.house.chargeitems.forEach((element) => {
          that.historydata.chargeitems.push(this.chargeitems[element]);
        });
        that.historydata.chargeitems.push({
          name: '租金',
          price: this.house.price,
        });
      }
        this.eletricmonitors.forEach((item) => {
          that.historydata.eletric.push({
            lastrecord: item.records[e].value,
            current: item.records[e+1].value,
            price: item.price,
          });
        });
        this.watermonitors.forEach((item) => {
          that.historydata.water.push({
            lastrecord: item.records[e].value,
            current: item.records[e+1].value,
            price: item.price,
          });
        });

        this.billon = true;

      },
      handleChange () {
        let d = new Date(Date.now()+1000*60*60*24*7);
        this.eletricmonitors.forEach((e) => {
          document.cookie = e.id + '=' + e.current + ';expires=' + d.toGMTString();
        });
        this.watermonitors.forEach((e) => {
          document.cookie = e.id + '=' + e.current + ';expires=' + d.toGMTString();
        });
      },
  },
}
</script>

<style scoped>
.info-title{
  background-color: rgb(64, 158, 255);
  color: white;
  padding: 10px 15px;
}
.last-record-row{
  color: rgb(200,200,200);
  font-size: 15px;
  margin: 15px 0px;
}
.info-wrap{
  padding: 0px 15px;
}
.bill-title{
  padding: 15px 10px;
  background-color: #f5f7fa;
}

.generate-wrap{
  text-align: center;
}
.history-select{
  text-align: center;
}
</style>
