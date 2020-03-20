<template>
  <div id="app" @click="handleNavmenu">
    <div style="width:100%; height:50px; background-color:#545c64; display:flex; align-items:center; color:white;">
      <i class="el-icon-menu" style="padding:0px 20px; font-size:24px;" @click="handleSwitch"></i>
      <div style="flex-grow:1; text-align:center;">{{pagetitle}}</div>
    </div>
    <transition name="el-zoom-in-top">
    <div style="width:200px; position:absolute; left:0; top:50px; z-index:10;" v-show="isCollapse" @click="stopbubble">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          @select="handleSelect"
          width="200px">
          <el-menu-item index="/datacenter">
            <i class="el-icon-menu"></i>
            <span slot="title">数据中心</span>
          </el-menu-item>
          <el-menu-item index="/hi">
            <i class="el-icon-setting"></i>
            <span slot="title">租盘管理</span>
          </el-menu-item>
          <el-menu-item index="/chargeitems">
            <i class="el-icon-menu"></i>
            <span slot="title">收费管理</span>
          </el-menu-item>
          <el-menu-item index="/checkout">
            <i class="el-icon-menu"></i>
            <span slot="title">抄表及打印</span>
          </el-menu-item>
        </el-menu>
    </div>
    </transition>
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'app',
  components: {
    HelloWorld,
  },
  data() {
    return {
      isCollapse: true,
    };
  },
  computed: {
    pagetitle () {
      return this.$store.state.title;
    }
  },
  created () {
    window.loading.close();
  },
  methods: {
    handleSelect() {
    //  this.isCollapse = false;
    },
    handleNavmenu(d) {
      this.isCollapse = false;
    },
    stopbubble(e) {
      e.stopPropagation();
    },
    handleSwitch(e) {
      e.stopPropagation();
      this.isCollapse = !this.isCollapse;
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
