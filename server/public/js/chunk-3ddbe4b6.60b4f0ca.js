(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3ddbe4b6"],{"12af":function(e,t,r){},"5d30":function(e,t,r){"use strict";r("12af")},aa60:function(e,t,r){"use strict";r("e0de")},e0de:function(e,t,r){},ec5c:function(e,t,r){"use strict";r.r(t);r("a9e3");var a=function(){var e=this,t=e._self._c;return t("section",{staticClass:"wrapper d-flex vh-100"},[t("AdminSideNavBar",{attrs:{"nav-is-open":e.navIsOpen}}),t("section",{staticClass:"orders flex-fill"},[t("NavbarToggler",{attrs:{"nav-is-open":e.navIsOpen},on:{"toggle-navbar":function(t){e.navIsOpen=!e.navIsOpen}}}),t("h1",{staticClass:"orders-title"},[e._v(" 訂單管理 ")]),t("hr",{staticClass:"orders-divider"}),t("AdminFilterPanel",{attrs:{"has-date":!0,options:e.subscriptionStatus,"input-placeholder":"搜尋編號","is-loading":e.isLoading},on:{"after-search":function(t){return e.handleAfterFilter({order_id:t,order_status:e.$route.query.order_status,date:e.$route.query.date})},"after-filter":function(t){return e.handleAfterFilter({order_id:e.$route.query.order_id,order_status:t,date:e.$route.query.date})},"after-date-pick":function(t){return e.handleAfterFilter({order_id:e.$route.query.order_id,order_status:e.$route.query.order_status,date:t})}},scopedSlots:e._u([{key:"filterOption",fn:function(){return[e._v(" 訂單狀態 ")]},proxy:!0}])}),t("transition",{attrs:{name:"slide",appear:""}},[e.isLoading||!e.isLoading&&e.orders.length>0?t("AdminOrdersTable",{attrs:{orders:e.orders,"is-loading":e.isLoading},on:{"after-cancel":e.handleAfterCancel}}):e._e()],1),t("transition",{attrs:{name:"fade"}},[e.totalPage>1?t("Pagination",{staticClass:"mt-4",attrs:{"total-page":e.totalPage,"current-page":Number(e.$route.query.page)||1,query:{order_id:e.$route.query.order_id,order_status:e.$route.query.order_status,date:e.$route.query.date}}}):e._e()],1),e.isLoading||0!==e.orders.length?e._e():t("PlaceholderMessage",{staticClass:"orders-placeholder"},[t("i",{staticClass:"fas fa-search mr-2"}),e._v("沒有符合的結果 ")])],1)],1)},s=[],n=r("5530"),o=r("c7eb"),i=r("1da1"),d=(r("d9e2"),r("14d9"),r("d81d"),r("e9e5")),c=r("0f14d"),u=r("13ad"),l=(r("b0c0"),r("fb6a"),function(){var e=this,t=e._self._c;return t("div",{staticClass:"table-wrapper table-borderless table-hover rounded-sm"},[t("table",{staticClass:"table m-0"},[e._m(0),t("tbody",e._l(e.orderData,(function(r){return t("tr",{key:r.id},[t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"35px"}}):[e._v(" #"+e._s(r.id)+" ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"48px"}}):[e._v(" "+e._s(r.User.name)+" ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"112px"}}):[e._v(" "+e._s(e._f("textTruncate")(r.meals.Restaurant.name,10))+" ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"35px"}}):[e._v(" "+e._s(r.date.slice(2,6))+" ")]],2),t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"40px"}}):[e._v(" "+e._s(r.time)+" ")]],2),e.isLoading?t("td",[e.isLoading?t("SkelentonBox",{attrs:{width:"48px"}}):e._e()],1):["取消"===r.order_status?t("td",[e._v(" 已取消 ")]):t("td",{class:{pointer:!e.isProcessing,wait:e.isProcessing},on:{click:function(t){!e.isProcessing&&e.cancelOrder(r.id)}}},[e._v(" 未取消 "),t("i",{staticClass:"fas fa-trash ml-1"})])]],2)})),0)])])}),f=[function(){var e=this,t=e._self._c;return t("thead",[t("tr",[t("th",{attrs:{scope:"col"}},[e._v(" 編號 ")]),t("th",{attrs:{scope:"col"}},[e._v(" 訂餐人 ")]),t("th",{attrs:{scope:"col"}},[e._v(" 餐廳 ")]),t("th",{attrs:{scope:"col"}},[e._v(" 日期 ")]),t("th",{attrs:{scope:"col"}},[e._v(" 時段 ")]),t("th",{attrs:{scope:"col"}},[e._v(" 訂單狀態 ")])])])}],p=r("be6c"),h=r("d1b6"),g=r("2708"),_=r("2fa3"),v={components:{SkelentonBox:h["a"]},mixins:[g["g"]],props:{orders:{type:Array,required:!0},isLoading:{type:Boolean,default:!1}},data:function(){return{isProcessing:!1}},computed:{orderData:function(){return this.isLoading?10:this.orders}},methods:{cancelOrder:function(e){var t=this;return Object(i["a"])(Object(o["a"])().mark((function r(){var a,s,n;return Object(o["a"])().wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.prev=0,t.isProcessing=!0,r.next=4,p["a"].orders.putOrder({orderId:e});case 4:if(a=r.sent,s=a.data,n=a.statusText,"success"===s.status&&"OK"===n){r.next=9;break}throw new Error(s.message);case 9:t.$emit("after-cancel",e),t.isProcessing=!1,r.next=17;break;case 13:r.prev=13,r.t0=r["catch"](0),t.isProcessing=!1,_["a"].fire({type:"error",title:"無法取消訂單，請稍後再試"});case 17:case"end":return r.stop()}}),r,null,[[0,13]])})))()}}},b=v,m=(r("5d30"),r("2877")),x=Object(m["a"])(b,l,f,!1,null,"1ea9ac52",null),O=x.exports,w=r("d691"),y=r("1799"),k=r("c1df"),L=r.n(k),P={components:{AdminSideNavBar:d["a"],NavbarToggler:c["a"],AdminFilterPanel:u["a"],AdminOrdersTable:O,PlaceholderMessage:w["a"],Pagination:y["a"]},data:function(){return{orders:[],subscriptionStatus:["未取消","取消"],totalPage:null,isLoading:!0,navIsOpen:!1}},created:function(){var e=this.$route.query,t=e.order_id,r=e.order_status,a=e.date,s=e.page;this.fetchOrders(t,a,r,s)},beforeRouteUpdate:function(e,t,r){var a=e.query,s=a.order_id,n=a.order_status,o=a.date,i=a.page;this.fetchOrders(s,o,n,i),r()},methods:{fetchOrders:function(){var e=arguments,t=this;return Object(i["a"])(Object(o["a"])().mark((function r(){var a,s,n,i,d,c,u;return Object(o["a"])().wrap((function(r){while(1)switch(r.prev=r.next){case 0:return a=e.length>0&&void 0!==e[0]?e[0]:"",s=e.length>1&&void 0!==e[1]?e[1]:L()().format("YYYY-MM-DD"),n=e.length>2&&void 0!==e[2]?e[2]:"",i=e.length>3&&void 0!==e[3]?e[3]:1,r.prev=4,t.isLoading=!0,r.next=8,p["a"].orders.getOrders({id:a,date:s,status:n,page:i});case 8:if(d=r.sent,c=d.data,u=d.statusText,"success"===c.status&&"OK"===u){r.next=13;break}throw new Error(c.message);case 13:t.orders=c.orders,t.totalPage=c.pages,t.isLoading=!1,r.next=22;break;case 18:r.prev=18,r.t0=r["catch"](4),t.isLoading=!1,_["a"].fire({type:"error",title:"無法取得訂單資料，請稍後再試"});case 22:case"end":return r.stop()}}),r,null,[[4,18]])})))()},handleAfterFilter:function(e){this.$router.push({name:"admin-orders",query:e})},handleAfterCancel:function(e){this.orders=this.orders.map((function(t){return t.id!==e?t:Object(n["a"])(Object(n["a"])({},t),{},{order_status:"取消"})}))}}},q=P,A=(r("aa60"),Object(m["a"])(q,a,s,!1,null,"98fcd25a",null));t["default"]=A.exports}}]);
//# sourceMappingURL=chunk-3ddbe4b6.60b4f0ca.js.map