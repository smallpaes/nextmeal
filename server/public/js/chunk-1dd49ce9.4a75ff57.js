(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1dd49ce9"],{"0489":function(t,e,a){"use strict";a("b0c0"),a("a4d3"),a("e01a");var r=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card shadow",attrs:{href:"#"}},[e("div",{staticClass:"card-img-top-container"},[e("img",{staticClass:"card-img-top",attrs:{src:t.order.meal.image,alt:"photo of the restaurant"}})]),e("div",{staticClass:"card-body"},[e("h5",{staticClass:"card-title m-0"},[t._v(" "+t._s(t.order.meal.name)+" ")]),e("p",{staticClass:"card-text mt-1"},[e("span",{staticClass:"rating"},[t._v("★ "+t._s(t._f("padEnd")(t.order.restaurant.rating)))]),e("span",{staticClass:"mx-1"},[t._v("|")]),t._v(t._s(t._f("textTruncate")(t.order.restaurant.name,15))+" "),t._t("distance")],2),t._t("indicator"),e("p",{staticClass:"card-text"},[t._v(" "+t._s(t._f("textTruncate")(t.order.meal.description))+" ")])],2),e("div",{staticClass:"card-footer text-right"},[t._t("footer")],2)])},s=[],n=a("2708"),i={mixins:[n["e"],n["g"]],props:{order:{type:Object,required:!0}}},o=i,c=(a("1667"),a("2877")),d=Object(c["a"])(o,r,s,!1,null,"5f5d27b6",null);e["a"]=d.exports},1667:function(t,e,a){"use strict";a("832e")},"747a":function(t,e,a){"use strict";a("aadc")},"832e":function(t,e,a){},"8a5f":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t._self._c;return e("section",[e("UserNavbar"),t.isLoading?e("Loader",{attrs:{height:"100vh"}}):t._e(),e("transition",{attrs:{name:"fade"}},[t.isLoading?t._e():e("header",[e("ImageHeaderBanner",{attrs:{"background-photo":t.banner.image,"banner-height":t.banner.height},scopedSlots:t._u([{key:"header",fn:function(){return[e("h1",{staticClass:"banner-content-title"},[t._v(" 訂購餐點 ")]),t.isChoosingMeal?e("h3",{staticClass:"banner-content-description"},[t._v(" 餐點二選一 ")]):e("h3",{staticClass:"banner-content-description"},[t._v(" 選擇數量與領餐時間 ")])]},proxy:!0}],null,!1,3451706756)})],1)]),e("transition",{attrs:{name:"slide",mode:"out-in"}},[t.isChoosingMeal&&!t.isLoading?e("section",{key:"meals",staticClass:"meal-wrapper"},[e("div",{staticClass:"container meal-container"},[e("div",{staticClass:"row meal-content align-items-stretch"},t._l(2,(function(a){return e("div",{key:a,staticClass:"col-12 col-md-6 col-lg-5 mb-4 meal-card"},[t.meals[a-1]?e("MealVerticalCard",{attrs:{order:t.meals[a-1]},scopedSlots:t._u([{key:"footer",fn:function(){return[e("button",{staticClass:"btn",attrs:{type:"button"},on:{click:function(e){return e.stopPropagation(),e.preventDefault(),t.handleOrder(t.meals[a-1])}}},[t._v(" 訂購餐點 ")])]},proxy:!0},{key:"distance",fn:function(){return[t._v(" ("+t._s(t.meals[a-1].restaurant.distance)+"公尺) ")]},proxy:!0}],null,!0)}):e("NewOrderCard",{style:{backgroundImage:"url(".concat(t.image,")")},scopedSlots:t._u([{key:"content",fn:function(){return[e("h5",{staticClass:"card-title"},[e("span",{staticClass:"card-indicator"},[t._v("附近無其他美食")])]),e("router-link",{staticClass:"btn",attrs:{to:{name:"user-profile"}}},[t._v(" 改地點 ")])]},proxy:!0}],null,!0)})],1)})),0)])]):t._e(),t.isChoosingMeal?t._e():e("section",{key:"form",staticClass:"order-wrapper"},[e("div",{staticClass:"container order-container"},[e("div",{staticClass:"row order-content p-3"},[e("MealHorizontalCard",{staticClass:"order-display",attrs:{order:t.chosenMeal}}),e("OrderForm",{staticClass:"order-display mt-3",attrs:{"order-info":{quantity:t.chosenMeal.meal.quantity,timeSlots:t.chosenMeal.timeSlots},"initial-processing":t.isProcessing,"current-user":t.currentUser},on:{"change-order":function(e){t.isChoosingMeal=!0},"after-submit":t.handleAfterSubmit}})],1)])])]),e("transition",{attrs:{name:"fade"}},[t.isLoading?t._e():e("Footer")],1)],1)},s=[],n=a("c7eb"),i=a("15fd"),o=a("1da1"),c=a("5530"),d=(a("d9e2"),a("d81d"),a("14d9"),a("1dc8")),l=a("fbbd"),u=a("0489"),p=a("52b6"),m=a("f525"),f=a("075c"),h=a("fd2d"),b=a("555f"),g=a("9b2a"),v=a("2fa3"),_=a("2f62"),C=["Meals","time_slots"],w={components:{UserNavbar:d["a"],ImageHeaderBanner:l["a"],MealVerticalCard:u["a"],NewOrderCard:m["a"],MealHorizontalCard:p["a"],OrderForm:f["a"],Footer:h["a"],Loader:b["a"]},data:function(){return{banner:{image:"https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",height:550},meals:[],isChoosingMeal:!0,chosenMeal:null,isLoading:!0,isProcessing:!1,image:"https://cdn.pixabay.com/photo/2017/06/11/17/03/dumplings-2392893_1280.jpg"}},computed:Object(c["a"])({},Object(_["c"])(["currentUser"])),created:function(){this.fetchMeals()},methods:{fetchMeals:function(){var t=this;return Object(o["a"])(Object(n["a"])().mark((function e(){var a,r,s;return Object(n["a"])().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,g["a"].getNewOrder();case 3:if(a=e.sent,r=a.data,s=a.statusText,"OK"===s&&"success"===r.status){e.next=8;break}throw new Error(r.message);case 8:t.meals=r.restaurants.map((function(t){var e=t.Meals,a=t.time_slots,r=Object(i["a"])(t,C);return{meal:e,timeSlots:a,restaurant:r}})),t.isLoading=!1,e.next=17;break;case 12:e.prev=12,e.t0=e["catch"](0),t.isLoading=!1,v["a"].fire({type:"error",title:"無法取得餐點資料，請稍後再試"}),t.$router.push({name:"order-tomorrow"});case 17:case"end":return e.stop()}}),e,null,[[0,12]])})))()},handleOrder:function(t){var e=this;return Object(o["a"])(Object(n["a"])().mark((function a(){return Object(n["a"])().wrap((function(a){while(1)switch(a.prev=a.next){case 0:e.isChoosingMeal=!1,e.chosenMeal=t;case 2:case"end":return a.stop()}}),a)})))()},handleAfterSubmit:function(t){var e=this;return Object(o["a"])(Object(n["a"])().mark((function a(){var r,s,i,o,d;return Object(n["a"])().wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,r=Object(c["a"])(Object(c["a"])({},t),{},{meal_id:e.chosenMeal.meal.id}),a.next=4,g["a"].postNewOrder(r);case 4:if(s=a.sent,i=s.data,o=s.statusText,"OK"===o&&"success"===i.status){a.next=9;break}throw new Error(i.message);case 9:d=-1*t.quantity,e.$store.commit("updateBalance",d),e.$router.push({name:"order",params:{order_id:i.order_id}}),a.next=18;break;case 14:a.prev=14,a.t0=a["catch"](0),e.isProcessing=!1,v["a"].fire({type:"error",title:"無法成功訂餐，請稍後再試"});case 18:case"end":return a.stop()}}),a,null,[[0,14]])})))()}}},x=w,O=(a("92e3"),a("2877")),y=Object(O["a"])(x,r,s,!1,null,"a86a53b2",null);e["default"]=y.exports},"92e3":function(t,e,a){"use strict";a("c5ba")},aadc:function(t,e,a){},c5ba:function(t,e,a){},d81d:function(t,e,a){"use strict";var r=a("23e7"),s=a("b727").map,n=a("1dde"),i=n("map");r({target:"Array",proto:!0,forced:!i},{map:function(t){return s(this,t,arguments.length>1?arguments[1]:void 0)}})},f525:function(t,e,a){"use strict";var r=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card shadow",attrs:{href:"#"}},[e("div",{staticClass:"card-overlay"}),e("div",{staticClass:"card-body"},[t._t("content")],2)])},s=[],n=(a("747a"),a("2877")),i={},o=Object(n["a"])(i,r,s,!1,null,"3b73e856",null);e["a"]=o.exports}}]);
//# sourceMappingURL=chunk-1dd49ce9.4a75ff57.js.map