<template>
  <div>
    <el-dialog title="详细信息" :visible.sync="showdetail">
      <div class="detail-label"><strong>姓名</strong></div>
      <div class="detail">{{detailData.name}}</div>
      <div class="detail-label"><strong>身份证</strong></div>
      <div class="detail">{{detailData.idnum}}</div>
      <div class="detail-label"><strong>联系电话</strong></div>
      <div class="detail">{{detailData.phonenumber}}</div>
    </el-dialog>
    <div class="info-title"><strong>{{$store.state.house.number + '   ' + $store.state.house.address}}</strong></div>
    <div class="btn-wrap"><el-button type="primary" size="small" round @click="handleAddleader">添加</el-button></div>
    <ul class="history-list">
      <li class="label-bar">
        <div style="width:30%">入住日期</div>
        <div style="width:20%">姓名</div>
        <div style="width:30%">离开日期</div>
        <div style="width:20%">操作</div>
      </li>
      <li v-for="(item,index) in listdata">
        <div :clickitem="item" class="leader-wrap" @click="handleClick(item)">
            <div style="width:30%">{{item.regisdate}}</div>
            <div style="width:20%" class="name-col">
              <span>{{item.name}}</span>
              <span @click="showDetail($event,item)">详细信息</span>
            </div>
            <div style="width:30%">{{item.leavedate?item.leavedate:'租赁中'}}</div>
            <div style="width:20%">
              <div class="cbtn-wrap"><el-button size="mini" @click="handleEditl($event,item)">编辑</el-button></div>
              <div class="cbtn-wrap"><el-button size="mini" type="danger" @click="handleDeleteleader($event,item)">删除</el-button></div>
            </div>
       </div>
       <div class="arrow-bar"><i :class="{'el-icon-arrow-down':!item.showmembers,'el-icon-arrow-down arrow-on':item.showmembers}"></i></div>
       <el-collapse-transition>
       <div class="members-wrap" v-if="item.showmembers">
         <div class="members-title">成员列表</div>
         <div  class="leader-wrap member-wrap" v-for="(subitem,index) in item.members">
             <div style="width:30%;" class="member-date">{{subitem.regisdate}}</div>
             <div style="width:20%" class="member-name-col">
               <span>{{subitem.name}}</span>
               <span @click="showDetail($event,subitem)">详细信息</span>
             </div>
             <div style="width:30%;" class="member-date">{{subitem.leavedate?subitem.leavedate:'居住中'}}</div>
             <div style="width:20%">
               <div class="mbtn-wrap"><span @click="handleEdit($event,subitem)">编辑</span></div>
               <div class="mbtn-wrap"><span @click="handleDelete(subitem)">删除</span></div>
             </div>
        </div>
        <div class="btn-wrap"><el-button type="primary" size="small" round @click="handleAddmember(item.idnum)">添加成员</el-button></div>
       </div>
     </el-collapse-transition>
      </li>
    </ul>
  </div>
</template>

<script>
import Utils from '../utils.js';
export default {
  name: 'History',
  data () {
    return {
      aon: false,
      listdata: [],
      detailData: {},
      showdetail: false,
    };
  },
  created () {
    const that = this;
    window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/leaders').on('value',(dataSnapshot) => {
      let temparr = [];
      dataSnapshot.forEach((e) => {
        console.log(e.val());
        let obj =  e.val();
        obj.id = e.key;
        obj.regisdate = Utils.getDate(e.val().regisdate);
        obj.showmembers = false;
        obj.leavedate&&(obj.leavedate = Utils.getDate(obj.leavedate));
       obj.members = [];
           temparr.push(obj);
      });
      that.listdata = temparr;
    });
  },
  methods:{
    handleClick (e) {
    //  this.aon = !this.aon;
      console.log(e);
      e.showmembers = !e.showmembers;
      (e.members.length == 0)&&(window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/members').orderByChild('leader').equalTo(e.idnum).on('value',(dataSnapshot) => {
        let temparr = [];
        dataSnapshot.forEach((i) => {
          let obj =  i.val();
          obj.id = i.key;
          obj.regisdate = Utils.getDate(i.val().regisdate);
          i.val().leavedate&&(obj.leavedate = Utils.getDate(i.val().leavedate));
          console.log(obj.leavedate);
            temparr.push(obj);
        });
        e.members = temparr;
      }));
    },
    handleSubClick(e,item) {
       console.log(arguments);
      e.stopPropagation()
      console.log(item);
    },
    handleEdit(e,item){
      e.stopPropagation()
      console.log(item);
      this.$store.commit('setcustomertype','members');
      this.$store.commit('setcustomer',item.id);
      this.$router.push({
        path:'/editcustomer',
      });
    },
    handleEditl(e,item){
      e.stopPropagation()
      console.log(item);
      this.$store.commit('setcustomertype','leaders');
      this.$store.commit('setcustomer',item.id);
      this.$router.push({
        path:'/editcustomer',
      });
    },
    showDetail(e,item) {
       console.log(arguments);
      e.stopPropagation()
      console.log(item);
      this.showdetail = true;
      this.detailData = item;
    },
    handleDelete(item) {
      console.log(item);
      this.$confirm(`删除 ${item.name} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/members/' + item.id).remove();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch( () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleDeleteleader(e,item) {
      e.stopPropagation()
      console.log(item);
      this.$confirm(`删除 ${item.name} 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          window.firebase.database().ref('renthistory/' + this.$store.state.house.id + '/leaders/' + item.id).remove();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch( () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleAddleader () {
      this.$store.commit('setcustomertype','leader');
      this.$router.push({
        path: 'addcustomer',
      });
    },
    handleAddmember (idnum) {
      this.$store.commit('setleader',idnum);
      this.$store.commit('setcustomertype','member');
      this.$router.push({
        path: 'addcustomer',
      });
    },
  }
}
</script>

<style scoped>
.info-title{
  color: #4a5a6a;
  text-align: center;
  padding-top: 15px;
}
.btn-wrap{
  display: flex;
  justify-content: flex-end;
  padding: 15px 15px;
}
.history-list{
  list-style: none;
}
.label-bar{
  display: flex;
  align-items: center;
}
.label-bar div{
  text-align: center;
  font-size: 15px;
  color: #4a5a6a;
}
.cbtn-wrap{
  padding: 5px 0px;
}
.name-col span{
  display: block;
}
.name-col span:last-child{
  color: #64b5f6;
}
.member-name-col span{
  display: block;
}
.member-name-col span:first-child{
  color:#7a8a9a;
}
.member-name-col span:last-child{
  color: #64b5f6;
}
.leader-wrap{
  display: flex;
  align-items: center;
}
.leader-wrap div {
  text-align: center;
  font-size: 14px;
  color: #4a5a6a;
}
.member-date {
  color: #7a8a9a;
}
.members-title{
  text-align: center;
  color: #7a8a9a;
  padding-top: 10px;
}
.members-wrap{
  background-color: rgba(250,250,250,1);
}
.mbtn-wrap{
  padding: 5px 0px;
}
.mbtn-wrap span{
  color: #64b5f6;
}
.arrow-bar{
  text-align: center;
  color:#7a8a9a;

}
.arrow-bar i{
  transition: transform .5s ease-out;
}
.arrow-on{
  transform: rotate(180deg);
}
.history-list li:first-child{
  box-shadow:0px 0px 0px 0px;
}
.history-list li{
   box-shadow:0px 2px 3px 0px rgba(240,240,240,.9);
}
.member-wrap{
  border-bottom: 1px solid rgba(235,235,235,.8);
}
.detail{
  color: #7a8a9a;
  margin-bottom: 10px;
}
.detail-label{
  color: #4a5a6a;
  margin-bottom: 10px;
}
</style>
