export default {
  state: {
    house: '',
    eletricmonitors: '',
    watermonitors: '',
    monitortype: 'eletricmonitors',
    monitordetail: '',
    clickeditem: '',
    title: '',
    customertype: '',
    leadername: '',
    leader: '',
    customer: '',
  },
  mutations: {
  sethouse (state, house) {
    state.house = house;
  },
  seteletricmonitors (state, monitors) {
    state.eletricmonitors = monitors;
  },
  setwatermonitors (state, monitors) {
    state.watermonitors = monitors;
  },
  setmonitortype (state, type) {
    state.monitortype = type;
  },
  setmonitordetail (state, data) {
    state.monitordetail = data ;
  },
  setclickeditem (state, data) {
    state.clickeditem = data;
  },
  settitle (state, data) {
    state.title = data;
  },
  setcustomertype (state, data) {
    state.customertype = data;
  },
  setleader (state, data) {
    state.leader = data;
  },
  setcustomer (state, data) {
    state.customer = data;
  },
},
};
