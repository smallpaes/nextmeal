(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-67edaa01"],{"0489":function(t,e,r){"use strict";r("7f7f");var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card shadow",attrs:{href:"#"}},[e("div",{staticClass:"card-img-top-container"},[e("img",{staticClass:"card-img-top",attrs:{src:t.order.meal.image,alt:"photo of the restaurant"}})]),e("div",{staticClass:"card-body"},[e("h5",{staticClass:"card-title m-0"},[t._v("\n      "+t._s(t.order.meal.name)+"\n    ")]),e("p",{staticClass:"card-text mt-1"},[e("span",{staticClass:"rating"},[t._v("★ "+t._s(t._f("padEnd")(t.order.restaurant.rating)))]),e("span",{staticClass:"mx-1"},[t._v("|")]),t._v(t._s(t._f("textTruncate")(t.order.restaurant.name,15))+"\n      "),t._t("distance")],2),t._t("indicator"),e("p",{staticClass:"card-text"},[t._v("\n      "+t._s(t._f("textTruncate")(t.order.meal.description))+"\n    ")])],2),e("div",{staticClass:"card-footer text-right"},[t._t("footer")],2)])},a=[],i=r("d1b6"),o=r("2708"),s={components:{SkelentonBox:i["a"]},mixins:[o["e"],o["g"]],props:{order:{type:Object,required:!0}}},c=s,u=(r("55d0"),r("2877")),d=Object(u["a"])(c,n,a,!1,null,"0b594ecd",null);e["a"]=d.exports},"1af6":function(t,e,r){var n=r("63b6");n(n.S,"Array",{isArray:r("9003")})},"20fd":function(t,e,r){"use strict";var n=r("d9f6"),a=r("aebd");t.exports=function(t,e,r){e in t?n.f(t,e,a(0,r)):t[e]=r}},"32a6":function(t,e,r){var n=r("241e"),a=r("c3a1");r("ce7e")("keys",(function(){return function(t){return a(n(t))}}))},"4ec4":function(t,e,r){"use strict";r.r(e);r("ac6a"),r("456d");var n=function(){var t=this,e=t._self._c;return e("section",[e("UserNavbar"),t.isLoading?e("Loader",{attrs:{height:"100vh"}}):t._e(),e("transition",{attrs:{name:"fade"}},[t.isLoading?t._e():e("header",[e("ImageHeaderBanner",{attrs:{"background-photo":t.banner.image,"banner-height":t.banner.height},scopedSlots:t._u([{key:"header",fn:function(){return[e("h1",{staticClass:"banner-content-title"},[t._v("\n            明日餐點\n          ")]),e("h3",{staticClass:"banner-content-description"},[t._v("\n            午餐免煩惱\n          ")])]},proxy:!0}],null,!1,3900986730)})],1)]),e("transition",{attrs:{name:"slide"}},[t.isLoading?t._e():e("section",{staticClass:"order-wrapper"},[e("div",{staticClass:"container order-container"},[e("div",{staticClass:"row order-content align-items-stretch"},t._l([t.lunch,t.dinner],(function(r){return e("div",{key:r.indicator,staticClass:"col-12 col-md-6 col-lg-5 mb-4 order-card"},[Object.keys(r.order).length&&!r.isCommingSoon?e("MealVerticalCard",{attrs:{"is-loading":t.isLoading,order:r.order},scopedSlots:t._u([{key:"indicator",fn:function(){return[e("span",{staticClass:"card-indicator"},[t._v(t._s(r.indicator))])]},proxy:!0},{key:"footer",fn:function(){return[e("router-link",{staticClass:"btn",attrs:{to:{name:"order",params:{order_id:r.order.id}}}},[t._v("\n                  查看訂單\n                ")])]},proxy:!0}],null,!0)}):e("NewOrderCard",{style:{backgroundImage:r.isCommingSoon?"url(".concat(t.image.commingSoon,")"):"url(".concat(t.image.order,")")},scopedSlots:t._u([r.isCommingSoon?{key:"content",fn:function(){return[e("h5",{staticClass:"card-title text-center"},[e("i",{staticClass:"fas fa-glass-cheers"}),e("span",{staticClass:"card-indicator d-block"},[t._v("Comming Soon")])])]},proxy:!0}:{key:"content",fn:function(){return[e("h5",{staticClass:"card-title"},[e("span",{staticClass:"card-indicator"},[t._v(t._s(r.indicator)+"餐")])]),t.currentUser.subscriptionBalance>0?e("router-link",{staticClass:"btn",attrs:{to:{name:"order-new"}}},[t._v("\n                  訂購\n                ")]):e("span",{staticClass:"card-warning"},[e("i",{staticClass:"far fa-surprise mr-1"}),t._v("無餘額囉")])]},proxy:!0}],null,!0)})],1)})),0)])])]),e("transition",{attrs:{name:"fade"}},[t.isLoading?t._e():e("Footer")],1)],1)},a=[],i=(r("8e6e"),r("a8db")),o=r("768b"),s=(r("96cf"),r("3b8d")),c=r("bd86"),u=r("1dc8"),d=r("fbbd"),l=r("0489"),f=r("f525"),p=r("fd2d"),b=r("555f"),h=r("4cce"),m=r("2fa3"),g=r("2f62"),v=["Restaurant"];function y(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function O(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?y(Object(r),!0).forEach((function(e){Object(c["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var _={components:{UserNavbar:u["a"],ImageHeaderBanner:d["a"],MealVerticalCard:l["a"],NewOrderCard:f["a"],Footer:p["a"],Loader:b["a"]},data:function(){return{banner:{image:"https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",height:550},lunch:{indicator:"午",isCommingSoon:!1,order:{}},dinner:{indicator:"晚",isCommingSoon:!0,order:{}},image:{order:"https://cdn.pixabay.com/photo/2017/06/11/17/03/dumplings-2392893_1280.jpg",commingSoon:"https://images.unsplash.com/photo-1549409466-c6449df8e23b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=4000&q=80"},isLoading:!0}},computed:O({},Object(g["c"])(["currentUser"])),created:function(){this.fetchOrders()},methods:{fetchOrders:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,r,n,a,s,c,u,d,l;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,h["a"].getOrdersTomorrow();case 3:if(e=t.sent,r=e.data,n=e.statusText,"OK"===n&&"success"===r.status){t.next=8;break}throw new Error(r.message);case 8:r.order.length>0&&(a=r.order[0],s=a.id,c=Object(o["a"])(a.meals,1),u=c[0],d=u.Restaurant,l=Object(i["a"])(u,v),this.lunch.order={id:s,restaurant:d,meal:l}),this.isLoading=!1,t.next=16;break;case 12:t.prev=12,t.t0=t["catch"](0),this.isLoading=!1,m["a"].fire({type:"error",title:"無法取得餐點資料，請稍後再試"});case 16:case"end":return t.stop()}}),t,this,[[0,12]])})));function e(){return t.apply(this,arguments)}return e}()}},C=_,x=(r("a54f"),r("2877")),j=Object(x["a"])(C,n,a,!1,null,"56b699f6",null);e["default"]=j.exports},"549b":function(t,e,r){"use strict";var n=r("d864"),a=r("63b6"),i=r("241e"),o=r("b0dc"),s=r("3702"),c=r("b447"),u=r("20fd"),d=r("7cd6");a(a.S+a.F*!r("4ee1")((function(t){Array.from(t)})),"Array",{from:function(t){var e,r,a,l,f=i(t),p="function"==typeof this?this:Array,b=arguments.length,h=b>1?arguments[1]:void 0,m=void 0!==h,g=0,v=d(f);if(m&&(h=n(h,b>2?arguments[2]:void 0,2)),void 0==v||p==Array&&s(v))for(e=c(f.length),r=new p(e);e>g;g++)u(r,g,m?h(f[g],g):f[g]);else for(l=v.call(f),r=new p;!(a=l.next()).done;g++)u(r,g,m?o(l,h,[a.value,g],!0):a.value);return r.length=g,r}})},"555f":function(t,e,r){"use strict";var n=function(){var t=this,e=t._self._c;return e("section",{staticClass:"icecream-container",style:{height:t.height}},[e("div",{staticClass:"icecream-content py-5"},[t._l(3,(function(t){return e("h1",{key:t,staticClass:"icecream"},[e("i",{staticClass:"fas fa-ice-cream"})])})),e("small",{staticClass:"icecream-description"},[t._v("\n      準備中\n    ")])],2)])},a=[],i={props:{height:{type:String,default:"100vh"}}},o=i,s=(r("db9a"),r("2877")),c=Object(s["a"])(o,n,a,!1,null,"2e263baa",null);e["a"]=c.exports},"55d0":function(t,e,r){"use strict";r("80e8")},"747a":function(t,e,r){"use strict";r("c710")},"768b":function(t,e,r){"use strict";r.d(e,"a",(function(){return p}));var n=r("a745"),a=r.n(n);function i(t){if(a()(t))return t}var o=r("67bb"),s=r.n(o),c=r("5d58"),u=r.n(c);function d(t,e){var r=null==t?null:"undefined"!=typeof s.a&&t[u.a]||t["@@iterator"];if(null!=r){var n,a,i,o,c=[],d=!0,l=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;d=!1}else for(;!(d=(n=i.call(r)).done)&&(c.push(n.value),c.length!==e);d=!0);}catch(f){l=!0,a=f}finally{try{if(!d&&null!=r["return"]&&(o=r["return"](),Object(o)!==o))return}finally{if(l)throw a}}return c}}var l=r("e630");function f(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function p(t,e){return i(t)||d(t,e)||Object(l["a"])(t,e)||f()}},"774e":function(t,e,r){t.exports=r("d2d5")},"7a46":function(t,e,r){},"80e8":function(t,e,r){},"8aae":function(t,e,r){r("32a6"),t.exports=r("584a").Object.keys},"9d9f":function(t,e,r){},a4bb:function(t,e,r){t.exports=r("8aae")},a54f:function(t,e,r){"use strict";r("7a46")},a745:function(t,e,r){t.exports=r("f410")},a8db:function(t,e,r){"use strict";r.d(e,"a",(function(){return c}));var n=r("e265"),a=r.n(n),i=r("a4bb"),o=r.n(i);function s(t,e){if(null==t)return{};var r,n,a={},i=o()(t);for(n=0;n<i.length;n++)r=i[n],e.indexOf(r)>=0||(a[r]=t[r]);return a}function c(t,e){if(null==t)return{};var r,n,i=s(t,e);if(a.a){var o=a()(t);for(n=0;n<o.length;n++)r=o[n],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(i[r]=t[r])}return i}},c710:function(t,e,r){},ce7e:function(t,e,r){var n=r("63b6"),a=r("584a"),i=r("294c");t.exports=function(t,e){var r=(a.Object||{})[t]||Object[t],o={};o[t]=e(r),n(n.S+n.F*i((function(){r(1)})),"Object",o)}},d2d5:function(t,e,r){r("1654"),r("549b"),t.exports=r("584a").Array.from},db2a:function(t,e,r){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}r.d(e,"a",(function(){return n}))},db9a:function(t,e,r){"use strict";r("9d9f")},e265:function(t,e,r){t.exports=r("ed33")},e630:function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));var n=r("774e"),a=r.n(n),i=r("db2a");function o(t,e){if(t){if("string"===typeof t)return Object(i["a"])(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?a()(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?Object(i["a"])(t,e):void 0}}},ed33:function(t,e,r){r("014b"),t.exports=r("584a").Object.getOwnPropertySymbols},f410:function(t,e,r){r("1af6"),t.exports=r("584a").Array.isArray},f525:function(t,e,r){"use strict";var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card shadow",attrs:{href:"#"}},[e("div",{staticClass:"card-overlay"}),e("div",{staticClass:"card-body"},[t._t("content")],2)])},a=[],i=(r("747a"),r("2877")),o={},s=Object(i["a"])(o,n,a,!1,null,"3b73e856",null);e["a"]=s.exports}}]);
//# sourceMappingURL=chunk-67edaa01.3f7fa71e.js.map