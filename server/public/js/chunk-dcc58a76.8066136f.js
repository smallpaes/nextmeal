(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dcc58a76"],{"06c5":function(t,e,a){"use strict";a.d(e,"a",(function(){return s}));a("fb6a"),a("d3b7"),a("b0c0"),a("a630"),a("3ca3"),a("ac1f"),a("00b4");var n=a("6b75");function s(t,e){if(t){if("string"===typeof t)return Object(n["a"])(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Object(n["a"])(t,e):void 0}}},"07e0":function(t,e,a){},"0a76":function(t,e,a){"use strict";a("b0c0");var n=function(){var t=this,e=t._self._c;return e("nav",{staticClass:"sidenav shadow",class:{opened:t.navIsOpen}},[e("div",{staticClass:"sidenav-brand-container text-center py-5"},[e("router-link",{staticClass:"sidenav-brand",attrs:{to:{name:"home"}}},[t._v(" NextMeal ")])],1),e("ul",{staticClass:"sidenav-nav px-0 text-center"},[e("li",{staticClass:"nav-item"},[e("router-link",{staticClass:"nav-link",attrs:{to:{name:"owner-info"}}},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-store"})]),e("span",{staticClass:"nav-link-description"},[t._v("餐廳")])])],1),e("li",{staticClass:"nav-item"},[e("router-link",{staticClass:"nav-link",class:{active:"owner-menu"===t.$route.name},attrs:{to:{name:"owner-dishes"},"active-class":"active"}},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-utensils"})]),e("span",{staticClass:"nav-link-description"},[t._v("餐點")])])],1),e("li",{staticClass:"nav-item"},[e("router-link",{staticClass:"nav-link",attrs:{to:{name:"owner-orders"},"active-class":"active"}},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-clipboard-list"})]),e("span",{staticClass:"nav-link-description"},[t._v("訂單")])])],1),e("li",{staticClass:"nav-item"},[e("router-link",{staticClass:"nav-link",attrs:{to:{name:"owner-dashboard"},"active-class":"active"}},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-chart-line"})]),e("span",{staticClass:"nav-link-description"},[t._v("分析")])])],1),e("li",{staticClass:"nav-divider"}),e("li",{staticClass:"nav-item"},[e("a",{staticClass:"nav-link",attrs:{href:"#",role:"button"},on:{click:t.logout}},[t._m(0),e("span",{staticClass:"nav-link-description"},[t._v("登出")])])])])])},s=[function(){var t=this,e=t._self._c;return e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-sign-out-alt"})])}],r=(a("14d9"),{props:{navIsOpen:{type:Boolean,required:!0}},methods:{logout:function(){this.$store.commit("revokeAuthentication"),this.$router.push("/")}}}),i=r,c=(a("dd72"),a("2877")),o=Object(c["a"])(i,n,s,!1,null,"be936cce",null);e["a"]=o.exports},"0a9b":function(t,e,a){},"159e":function(t,e,a){"use strict";a("07e0")},3835:function(t,e,a){"use strict";function n(t){if(Array.isArray(t))return t}a.d(e,"a",(function(){return c}));a("a4d3"),a("e01a"),a("d3b7"),a("d28b"),a("3ca3"),a("ddb0"),a("14d9");function s(t,e){var a=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=a){var n,s,r,i,c=[],o=!0,u=!1;try{if(r=(a=a.call(t)).next,0===e){if(Object(a)!==a)return;o=!1}else for(;!(o=(n=r.call(a)).done)&&(c.push(n.value),c.length!==e);o=!0);}catch(l){u=!0,s=l}finally{try{if(!o&&null!=a["return"]&&(i=a["return"](),Object(i)!==i))return}finally{if(u)throw s}}return c}}var r=a("06c5");a("d9e2");function i(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t,e){return n(t)||s(t,e)||Object(r["a"])(t,e)||i()}},"6b75":function(t,e,a){"use strict";function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,n=new Array(e);a<e;a++)n[a]=t[a];return n}a.d(e,"a",(function(){return n}))},a630:function(t,e,a){var n=a("23e7"),s=a("4df4"),r=a("1c7e"),i=!r((function(t){Array.from(t)}));n({target:"Array",stat:!0,forced:i},{from:s})},bcc2:function(t,e,a){"use strict";var n=a("2fa3");e["a"]={restaurants:{get:function(){return n["b"].get("/owner")},post:function(t){return n["b"].post("/owner",t)},put:function(t){return n["b"].put("/owner",t)}},dishes:{getDishes:function(){return n["b"].get("/owner/dishes")},postNew:function(t){return n["b"].post("/owner/dishes",t)},getEdit:function(t){var e=t.dishId;return n["b"].get("/owner/dishes/".concat(e))},putEdit:function(t){var e=t.dishId,a=t.formData;return n["b"].put("/owner/dishes/".concat(e,"/edit"),a)},deleteDish:function(t){var e=t.dishId;return n["b"].delete("/owner/dishes/".concat(e))}},menu:{getMenu:function(t){var e=t.ran;return n["b"].get("/owner/menu?ran=".concat(e))},putMenu:function(t){return n["b"].put("/owner/menu",t)}},orders:{getOrders:function(){return n["b"].get("/owner/orders")}},dashboard:{getDashboard:function(){return n["b"].get("/owner/dashboard")}}}},dd72:function(t,e,a){"use strict";a("0a9b")},e3fc:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t._self._c;return e("section",{staticClass:"wrapper d-flex vh-100"},[e("OwnerSideNavBar",{attrs:{"nav-is-open":t.navIsOpen}}),e("section",{staticClass:"info flex-fill"},[e("NavbarToggler",{attrs:{"nav-is-open":t.navIsOpen},on:{"toggle-navbar":function(e){t.navIsOpen=!t.navIsOpen}}}),e("h1",{staticClass:"info-title"},[t._v(" 餐廳資訊 ")]),e("hr",{staticClass:"info-divider"}),t.isLoading?e("Loader",{attrs:{height:"300px"}}):t._e(),e("transition",{attrs:{name:"slide"}},[t.isLoading?t._e():e("RestaurantInfoForm",{staticClass:"info-form",attrs:{"initial-restaurant":t.restaurant,categories:t.categories,"initial-processing":t.isProcessing},on:{"after-submit":function(e){t.hasRestaurantData?t.updateRestaurant(e):t.createRestaurant(e)}}})],1)],1)],1)},s=[],r=a("c7eb"),i=a("5530"),c=a("15fd"),o=a("3835"),u=a("1da1"),l=(a("d9e2"),a("0a76")),f=a("0f14d"),d=a("5073"),p=a("555f"),v=a("bcc2"),b=a("2fa3"),h=["opening_hour","closing_hour"],g={components:{OwnerSideNavBar:l["a"],NavbarToggler:f["a"],RestaurantInfoForm:d["a"],Loader:p["a"]},data:function(){return{restaurant:{},categories:[],hasRestaurantData:!1,isLoading:!0,isProcessing:!1,navIsOpen:!1}},created:function(){this.fetchRestaurantData()},methods:{fetchRestaurantData:function(t){var e=this;return Object(u["a"])(Object(r["a"])().mark((function t(){var a,n,s,u,l,f,d,p,g;return Object(r["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,v["a"].restaurants.get();case 3:if(a=t.sent,n=a.data,s=a.statusText,"success"===n.status&&"OK"===s){t.next=8;break}throw new Error(n.message);case 8:if(n.restaurant){t.next=13;break}return e.hasRestaurantData=!1,e.categories=n.categories,e.isLoading=!1,t.abrupt("return");case 13:u=Object(o["a"])(n.restaurant,1),l=u[0],f=l.opening_hour,d=l.closing_hour,p=Object(c["a"])(l,h),g=n.categories,e.restaurant=Object(i["a"])(Object(i["a"])({},e.restaurant),{},{openingHour:f,closingHour:d},p),e.categories=g,e.hasRestaurantData=!0,e.isLoading=!1,t.next=24;break;case 20:t.prev=20,t.t0=t["catch"](0),e.isLoading=!1,b["a"].fire({type:"error",title:"無法取得資料，請稍後再試"});case 24:case"end":return t.stop()}}),t,null,[[0,20]])})))()},createRestaurant:function(t){var e=this;return Object(u["a"])(Object(r["a"])().mark((function a(){var n,s,i;return Object(r["a"])().wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,e.isProcessing=!0,a.next=4,v["a"].restaurants.post(t);case 4:if(n=a.sent,s=n.data,i=n.statusText,"success"===s.status&&"OK"===i){a.next=9;break}throw new Error(s.message);case 9:e.$store.commit("setCurrentUser",{hasRestaurant:!0}),b["a"].fire({type:"success",title:"新增成功"}),e.isProcessing=!1,a.next=18;break;case 14:a.prev=14,a.t0=a["catch"](0),e.isProcessing=!1,b["a"].fire({type:"error",title:"無法新增資料，請稍後再試"});case 18:case"end":return a.stop()}}),a,null,[[0,14]])})))()},updateRestaurant:function(t){var e=this;return Object(u["a"])(Object(r["a"])().mark((function a(){var n,s,i;return Object(r["a"])().wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,e.isProcessing=!0,a.next=4,v["a"].restaurants.put(t);case 4:if(n=a.sent,s=n.data,i=n.statusText,"success"===s.status&&"OK"===i){a.next=9;break}throw new Error(s.message);case 9:b["a"].fire({type:"success",title:"更新成功"}),e.isProcessing=!1,a.next=17;break;case 13:a.prev=13,a.t0=a["catch"](0),e.isProcessing=!1,b["a"].fire({type:"error",title:"無法更新資料，請稍後再試"});case 17:case"end":return a.stop()}}),a,null,[[0,13]])})))()}}},m=g,w=(a("159e"),a("2877")),C=Object(w["a"])(m,n,s,!1,null,"b9226f22",null);e["default"]=C.exports}}]);
//# sourceMappingURL=chunk-dcc58a76.8066136f.js.map