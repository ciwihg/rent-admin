const utils = {
  formatPrice (p) {
    return p.replace(/^(\d+)($|\.\d+)/, (match,p1,p2) => {
      return p2===""?match+".00":p1 + (p2 += '00').match(/^\.\d{2}/)[0];
    });
  },
  Object2Array (o, pid) {
    const that = this;
    return Object.keys(o).map((e) => {
      o[e].id = e;
      o[e].date&&(o[e].dateformate = that.getDate(o[e].date));
      pid&&(o[e].parentid = pid);
      return o[e];
    });
  },
  getDate (s) {
    const now = new Date(s);
    const month = (('0' + (now.getMonth() + 1)).match(/.*(\d{2})$/)[1]);
    const day = (('0' + now.getDate()).match(/.*(\d{2})$/)[1]);
    return now.getFullYear() + '-' + month + '-' + day;
  },
  quicksort (a) {
    function quick (a,l,r) {
      if(l>=r){
        return;
      }
      let mid = a[l], midv = a[l].date,temp,le=l,re=r;
      while(l<r){
        while(a[l].date<midv){
          l=l+1;
        }
        while(a[r].date>midv){
          r=r-1;
        }
        if(l<r){
          temp = a[l];
          a[l] = a[r];
          a[r] = temp;
        }

      }
      quick(a,le,l-1);
      quick(a,l+1,re);
    }
    quick (a,0,a.length-1);
  },
  writeCookie(k,v){

  },
  parseCookie(){
    let aa = document.cookie.match(/[^;]+(;|$)/g);
    const obj = {};
    if (aa) {
      aa.forEach((e) => {
      let result = e.match(/([^\s]+)=([^;]*)/);
      console.log(result);
      obj[result[1]] = result[2];
    });
    }
   return obj;
  },
};

export default utils;
