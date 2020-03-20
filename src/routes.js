import Addform from './components/Addform.vue';
import HelloWorld from './components/HelloWorld.vue';
import Chargeitems from './components/chargeitems.vue';
import Addchargeitem from './components/Addchargeitem.vue';
import Editchargeitem from './components/Editchargeitem.vue';
import Edithouse from './components/Edithouse.vue';
import Initrecord from './components/Initrecord.vue';
import Waterfee from './components/Waterfee.vue';
import Addfee from './components/Addfee.vue';
import Editfee from './components/Editfee.vue';
import Checkout from './components/Checkout.vue';
import Generatebill from './components/Generatebill.vue';
import Queryrecords from './components/Queryrecords.vue';
import Managerecord from './components/Managerecord.vue';
import Addrecord from './components/Addrecord.vue';
import Editrecord from './components/Editrecord.vue';
import Signin from './components/Signin.vue';
import History from './components/History.vue';
import Addcustomer from './components/Addcustomer.vue';
import Editcustomer from './components/Editcustomer.vue';

export default [
  {
    path: '/add',
    component: Addform,
  },
  {
    path: '/hi',
    component: HelloWorld,
  },
  {
    path: '/chargeitems',
    component: Chargeitems,
  },
  {
    path: '/addchargeitem',
    component: Addchargeitem,
  },
  {
    path: '/editchargeitem/:id',
    component: Editchargeitem,
  },
  {
    path: '/edithouse/:id',
    component: Edithouse,
  },
  {
    path: '/initrecord/:id',
    component: Initrecord,
  },
  {
    path: '/eletric',
    component: Waterfee,
  },
  {
    path: '/water',
    component: Waterfee,
  },
  {
    path: '/addfee',
    component: Addfee,
  },
  {
    path: '/editfee/:id',
    component: Editfee,
  },
  {
    path: '/checkout',
    component: Checkout,
  },
  {
    path: '/generatebill/:id',
    component: Generatebill,
  },
  {
    path: '/queryrecords',
    component: Queryrecords,
  },
  {
    path: '/managerecord',
    component: Managerecord,
  },
  {
    path: '/addrecord',
    component: Addrecord,
  },
  {
    path: '/editrecord',
    component: Editrecord,
  },
  {
    path: '/signin',
    component: Signin,
  },
  {
    path: '/history',
    component: History,
  },
  {
    path: '/addcustomer',
    component: Addcustomer,
  },
  {
    path: '/editcustomer',
    component: Editcustomer,
  },
]
