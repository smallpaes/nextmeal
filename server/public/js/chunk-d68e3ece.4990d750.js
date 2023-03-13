(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d68e3ece"],{"521a":function(e,t,r){},"5d30":function(e,t,r){"use strict";r("521a")},aa60:function(e,t,r){"use strict";r("cc0f")},cc0f:function(e,t,r){},ec5c:function(e,t,r){"use strict";r.r(t);r("c5f6");var n=function(){var e=this,t=e._self._c;return t("section",{staticClass:"wrapper d-flex vh-100"},[t("AdminSideNavBar",{attrs:{"nav-is-open":e.navIsOpen}}),t("section",{staticClass:"orders flex-fill"},[t("NavbarToggler",{attrs:{"nav-is-open":e.navIsOpen},on:{"toggle-navbar":function(t){e.navIsOpen=!e.navIsOpen}}}),t("h1",{staticClass:"orders-title"},[e._v("\n      訂單管理\n    ")]),t("hr",{staticClass:"orders-divider"}),t("AdminFilterPanel",{attrs:{"has-date":!0,options:e.subscriptionStatus,"input-placeholder":"搜尋編號","is-loading":e.isLoading},on:{"after-search":function(t){return e.handleAfterFilter({order_id:t,order_status:e.$route.query.order_status,date:e.$route.query.date})},"after-filter":function(t){return e.handleAfterFilter({order_id:e.$route.query.order_id,order_status:t,date:e.$route.query.date})},"after-date-pick":function(t){return e.handleAfterFilter({order_id:e.$route.query.order_id,order_status:e.$route.query.order_status,date:t})}},scopedSlots:e._u([{key:"filterOption",fn:function(){return[e._v("\n        訂單狀態\n      ")]},proxy:!0}])}),t("transition",{attrs:{name:"slide",appear:""}},[e.isLoading||!e.isLoading&&e.orders.length>0?t("AdminOrdersTable",{attrs:{orders:e.orders,"is-loading":e.isLoading},on:{"after-cancel":e.handleAfterCancel}}):e._e()],1),t("transition",{attrs:{name:"fade"}},[e.totalPage>1?t("Pagination",{staticClass:"mt-4",attrs:{"total-page":e.totalPage,"current-page":Number(e.$route.query.page)||1,query:{order_id:e.$route.query.order_id,order_status:e.$route.query.order_status,date:e.$route.query.date}}}):e._e()],1),e.isLoading||0!==e.orders.length?e._e():t("PlaceholderMessage",{staticClass:"orders-placeholder"},[t("i",{staticClass:"fas fa-search mr-2"}),e._v("沒有符合的結果\n    ")])],1)],1)},a=[],s=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),o=(r("96cf"),r("3b8d")),i=r("e9e5"),d=r("0f14d"),c=r("13ad"),u=(r("7f7f"),function(){var e=this,t=e._self._c;return t("div",{staticClass:"table-wrapper table-borderless table-hover rounded-sm"},[t("table",{staticClass:"table m-0"},[e._m(0),t("tbody",e._l(e.orderData,(function(r){return t("tr",{key:r.id},[t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"35px"}}):[e._v("\n            #"+e._s(r.id)+"\n          ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"48px"}}):[e._v("\n            "+e._s(r.User.name)+"\n          ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"112px"}}):[e._v("\n            "+e._s(e._f("textTruncate")(r.meals.Restaurant.name,10))+"\n          ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"35px"}}):[e._v("\n            "+e._s(r.date.slice(2,6))+"\n          ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"40px"}}):[e._v("\n            "+e._s(r.time)+"\n          ")]],2),e.isLoading?t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"48px"}}):e._e()],1):["取消"===r.order_status?t("td",[e._v("\n            已取消\n          ")]):t("td",{class:{pointer:!e.isProcessing,wait:e.isProcessing},on:{click:function(t){!e.isProcessing&&e.cancelOrder(r.id)}}},[e._v("\n            未取消\n            "),t("i",{staticClass:"fas fa-trash ml-1"})])]],2)})),0)])])}),l=[function(){var e=this,t=e._self._c;return t("thead",[t("tr",[t("th",{attrs:{scope:"col"}},[e._v("\n          編號\n        ")]),t("th",{attrs:{scope:"col"}},[e._v("\n          訂餐人\n        ")]),t("th",{attrs:{scope:"col"}},[e._v("\n          餐廳\n        ")]),t("th",{attrs:{scope:"col"}},[e._v("\n          日期\n        ")]),t("th",{attrs:{scope:"col"}},[e._v("\n          時段\n        ")]),t("th",{attrs:{scope:"col"}},[e._v("\n          訂單狀態\n        ")])])])}],p=r("be6c"),f=r("d1b6"),h=r("2708"),g=r("2fa3"),v={components:{SkelentonBox:f["a"]},mixins:[h["g"]],props:{orders:{type:Array,required:!0},isLoading:{type:Boolean,default:!1}},data:function(){return{isProcessing:!1}},computed:{orderData:function(){return this.isLoading?10:this.orders}},methods:{cancelOrder:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var r,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,this.isProcessing=!0,e.next=4,p["a"].orders.putOrder({orderId:t});case 4:if(r=e.sent,n=r.data,a=r.statusText,"success"===n.status&&"OK"===a){e.next=9;break}throw new Error(n.message);case 9:this.$emit("after-cancel",t),this.isProcessing=!1,e.next=17;break;case 13:e.prev=13,e.t0=e["catch"](0),this.isProcessing=!1,g["a"].fire({type:"error",title:"無法取消訂單，請稍後再試"});case 17:case"end":return e.stop()}}),e,this,[[0,13]])})));function t(t){return e.apply(this,arguments)}return t}()}},_=v,b=(r("5d30"),r("2877")),m=Object(b["a"])(_,u,l,!1,null,"1ea9ac52",null),O=m.exports,y=r("d691"),w=r("1799"),x=r("c1df"),P=r.n(x);function k(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function L(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?k(Object(r),!0).forEach((function(t){Object(s["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):k(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var j={components:{AdminSideNavBar:i["a"],NavbarToggler:d["a"],AdminFilterPanel:c["a"],AdminOrdersTable:O,PlaceholderMessage:y["a"],Pagination:w["a"]},data:function(){return{orders:[],subscriptionStatus:["未取消","取消"],totalPage:null,isLoading:!0,navIsOpen:!1}},created:function(){var e=this.$route.query,t=e.order_id,r=e.order_status,n=e.date,a=e.page;this.fetchOrders(t,n,r,a)},beforeRouteUpdate:function(e,t,r){var n=e.query,a=n.order_id,s=n.order_status,o=n.date,i=n.page;this.fetchOrders(a,o,s,i),r()},methods:{fetchOrders:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a,s,o,i,d=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=d.length>0&&void 0!==d[0]?d[0]:"",r=d.length>1&&void 0!==d[1]?d[1]:P()().format("YYYY-MM-DD"),n=d.length>2&&void 0!==d[2]?d[2]:"",a=d.length>3&&void 0!==d[3]?d[3]:1,e.prev=4,this.isLoading=!0,e.next=8,p["a"].orders.getOrders({id:t,date:r,status:n,page:a});case 8:if(s=e.sent,o=s.data,i=s.statusText,"success"===o.status&&"OK"===i){e.next=13;break}throw new Error(o.message);case 13:this.orders=o.orders,this.totalPage=o.pages,this.isLoading=!1,e.next=22;break;case 18:e.prev=18,e.t0=e["catch"](4),this.isLoading=!1,g["a"].fire({type:"error",title:"無法取得訂單資料，請稍後再試"});case 22:case"end":return e.stop()}}),e,this,[[4,18]])})));function t(){return e.apply(this,arguments)}return t}(),handleAfterFilter:function(e){this.$router.push({name:"admin-orders",query:e})},handleAfterCancel:function(e){this.orders=this.orders.map((function(t){return t.id!==e?t:L(L({},t),{},{order_status:"取消"})}))}}},q=j,S=(r("aa60"),Object(b["a"])(q,n,a,!1,null,"98fcd25a",null));t["default"]=S.exports}}]);
//# sourceMappingURL=chunk-d68e3ece.4990d750.js.map