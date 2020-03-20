<template>
  <div class="content-wrap">
    <el-form :model="formdata" label-width="80px">
      <div v-if="house.eletric">
        <div class="button-wrap">
          <el-button type="primary" round @click="handleAdde">增加电表</el-button>
        </div>
        <div>
          <div  class="row-wrap" v-for="(item,index) in formdata.eletrics">
            <el-form-item :label="'电表' + index + '数值'" >
              <el-input v-model="item.value"></el-input>
            </el-form-item>
            <el-form-item label="计量单价">
              <el-select v-model="item.unitprice" placeholder="请选择">
                <el-option
                  v-for="e in eletricoptions"
                  :key="e.id"
                  :label="e.name"
                  :value="e.id">
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-minus" circle style="margin-left:15px;" class="minus-button" @click="delete1eletric"></el-button>
            </el-form-item>
          </div>
        </div>
      </div>
      <div v-if="house.water">
        <div class="button-wrap">
          <el-button type="primary" round @click="handleAddw">增加水表</el-button>
        </div>
        <div>
          <div class="subrow-wrap" v-for="(item,index) in formdata.waters">
            <el-form-item :label="'水表' + index + '数值'" >
              <el-input v-model="item.value"></el-input>
            </el-form-item>
            <el-form-item label="计量单价">
              <el-select v-model="item.unitprice" placeholder="请选择">
                <el-option
                  v-for="e in wateroptions"
                  :key="e.id"
                  :label="e.name"
                  :value="e.id">
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-minus" circle style="margin-left:15px;" class="minus-button" @click="delete1water"></el-button>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="button-wrap">
        <el-button  round @click="handleAddw">取消</el-button>
        <el-button type="primary" round @click="handleInit">立即初始化</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Utils from '../utils.js';
export default {
  name: 'Initrecord',

  data () {
    return {
      formdata: {
        eletrics: [
          {
            value: '0',
            unitprice: '',
          },
        ],
        waters: [
          {
            value: '0',
            unitprice: '',
          },
        ],
      },
      wateroptions: [

      ],
      eletricoptions: [

      ],
      tables: {
        water: 'waterfees',
        eletric: 'eletricfees',
      },
      house: {},
    }
  },
  beforeRouteEnter (to, from, next) {
    next();
  },
  created () {
    const that = this;
    window.firebase.database().ref('chargeitems').once('value').then((dataSnapshot) => {
      for(let element in dataSnapshot.val()){
        if(dataSnapshot.val()[element].type == 'water'){
          that.wateroptions.push({
            id: element,
            name: dataSnapshot.val()[element].name,
          });
        }
        if(dataSnapshot.val()[element].type == 'eletric'){
          that.eletricoptions.push({
            id: element,
            name: dataSnapshot.val()[element].name,
          });
        }
      }
    }).then(() => {
      window.firebase.database().ref('houses/' + that.$route.params.id).once('value', (dataSnapshot) => {
        that.house = dataSnapshot.val();
      });
    });
  },
  methods: {
    handleAdde () {
      this.formdata.eletrics.push({
        value: '0',
      });
    },
    handleAddw () {
      this.formdata.waters.push({
        value: '0',
      });
    },
    delete1eletric (e) {
      this.formdata.eletrics.pop();
    },
    delete1water (e) {
      this.formdata.waters.pop();
    },
    handleInit () {
      if(this.house.eletric) {
        this.processRecord('eletric');
      }
      if(this.house.water) {
        this.processRecord('water');
      }
      this.$router.push({
        path: 'hi'
      });
    },
    processRecord (type) {
      const maps = {
        water: {
          monitors: this.formdata.waters,
          tablename: 'watermonitors',
        },
        eletric: {
          monitors: this.formdata.eletrics,
          tablename: 'eletricmonitors',
        },
      };
     const monitors = maps[type].monitors.map((e, index) => {
        let newitem = window.firebase.database().ref(maps[type].tablename).push();
        newitem.set({
          name: index,
          priceid: e.unitprice,
        }).then(() => {
          let newrecord = window.firebase.database().ref(maps[type].tablename + '/' + newitem.key + '/records').push();
          newrecord.set({
            value: e.value,
            date: Date.now(),
          });
        })
        return newitem.key;
      });
      window.firebase.database().ref('houses/' + this.$route.params.id + '/' + maps[type].tablename).set(monitors);
    },
  }
}
</script>

<style scoped>
.content-wrap{
    padding: 50px 0px;
}
.button-wrap{
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
}
.row-wrap,.subrow-wrap{
  padding: 22px 15px 1px 15px;
}
.row-wrap:nth-child(2n),.subrow-wrap:nth-child(2n){
  background-color: rgb(240,240,240);
}
.minus-button{
  display: none;
}

.row-wrap:last-child .minus-button,.subrow-wrap:last-child .minus-button{
 display: inline-block;
}
.row-wrap:first-child .minus-button,.subrow-wrap:first-child .minus-button{
 display: none !important;
}
</style>
