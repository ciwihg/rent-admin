import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import routes from './routes';
import storeobj from './store/index.js';
import Signin from './components/Signin.vue';

Vue.use(VueRouter);
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vuex);
const router = new VueRouter({
  routes
});
const store = new Vuex.Store(storeobj);
let app = document.getElementById('app');
let vm,loading;
window.firebase.auth().onAuthStateChanged((user) => {
  if(user){
    console.log('success');
    vm&&(app.removeChild(vm.$el),vm.$destroy());
    vm = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount();
    app.appendChild(vm.$el);
  }else{
    console.log('signout');
    vm&&(app.removeChild(vm.$el),vm.$destroy());
    vm = new Vue({
      render: h => h(Signin),
    }).$mount();
    app.appendChild(vm.$el);
  }
});
