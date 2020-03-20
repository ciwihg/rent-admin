<template>
  <ul class="nav-bar" @click="handleItemclick">
    <li :class="{'item-on':items.i1}"  mkey='i1' :iaction="itemdata[0].key">{{itemdata[0].label}}</li>
    <li :class="{'item-on':items.i2}"  mkey='i2' :iaction="itemdata[1].key">{{itemdata[1].label}}</li>
  </ul>
</template>

<script>
export default {
  name: 'Mnavbar',
  props: ['itemdata'],
  data () {
    return {
      items: {
        i1: true,
        i2: false,
      },
      active: 'i1',
    };
  },
  methods: {
    handleItemclick (e) {
      console.log(this.itemdata);
      (this.active != '')&&(this.items[this.active] = false);
      this.items[e.target.getAttribute('mkey')] = true;
      this.active = e.target.getAttribute('mkey');
      this.$emit('select',e.target.getAttribute('iaction'));
    }
  }
}
</script>

<style scoped>
.nav-bar{
  list-style: none;
  margin-bottom: 10px;
}
.nav-bar li {
  float: left;
  width: 50%;
  text-align: center;
  padding: 15px 0px;
  color: #9a9a9a;
  border-bottom: 2px solid #ffffff;
}
.item-on{
  color: #4a5a6a !important;
  border-bottom: 2px solid #049efe !important;
}
.nav-bar::after{
  content: '';
  display: block;
  clear: both;
}
</style>
