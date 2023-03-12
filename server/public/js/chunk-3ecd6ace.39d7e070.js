(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3ecd6ace"],{"075c":function(t,e,r){"use strict";r("7f7f");var n=r("bd86"),a=function(){var t=this,e=t._self._c;return e("section",{staticClass:"form"},[e("form",{ref:"form",staticClass:"form-wrapper rounded-sm shadow-sm p-3"},[e("h2",{staticClass:"form-title mb-4"},[t._v("\n      訂購資料\n    ")]),e("fieldset",{staticClass:"form-group",attrs:{disabled:t.isProcessing}},[e("legend",{staticClass:"form-legend"},[t._v("\n        預定領餐時間\n        "),t.errorMessage.time?e("span",{staticClass:"invalid-message"},[t._v("("+t._s(t.errorMessage.time)+")")]):t._e()]),t._l(t.orderInfo.timeSlots,(function(r){return e("div",{key:r,staticClass:"form-check form-check-inline"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.time,expression:"formData.time"}],staticClass:"form-check-input",attrs:{id:"radio"+r,type:"radio",name:"inlineRadioOptions",hidden:""},domProps:Object(n["a"])({value:r,checked:r===t.formData.time},"checked",t._q(t.formData.time,r)),on:{change:function(e){return t.$set(t.formData,"time",r)}}}),e("label",{staticClass:"form-check-label",attrs:{for:"radio"+r}},[t._v(t._s(r))])])}))],2),e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"quantity"}},[t._v("預定數量")]),t.errorMessage.quantity?e("span",{staticClass:"invalid-message"},[t._v("("+t._s(t.errorMessage.quantity)+")")]):t._e(),e("div",{staticClass:"form-quantity"},[e("button",{staticClass:"btn btn-minus",class:{"disable-btn":t.formData.quantity<=1},attrs:{disabled:t.isProcessing||t.formData.quantity<=1},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.formData.quantity-=1}}},[t._v("\n          -\n        ")]),e("input",{directives:[{name:"model",rawName:"v-model.number",value:t.formData.quantity,expression:"formData.quantity",modifiers:{number:!0}}],staticClass:"form-quantity-input text-center",attrs:{id:"quantity",type:"text",name:"quantity",size:"2",disabled:""},domProps:{value:t.formData.quantity},on:{input:function(e){e.target.composing||t.$set(t.formData,"quantity",t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}}),e("button",{staticClass:"btn btn-plus",class:{"disable-btn":t.orderInfo.quantity===t.formData.quantity||t.formData.quantity===t.currentUser.subscriptionBalance+t.initialOrder.quantity},attrs:{disabled:t.isProcessing||t.orderInfo.quantity===t.formData.quantity||t.formData.quantity===t.currentUser.subscriptionBalance+t.initialOrder.quantity},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.formData.quantity+=1}}},[t._v("\n          +\n        ")])])]),e("hr",{staticClass:"form-divider mt-4"}),e("div",{staticClass:"btn-container"},[e("ProcessButton",{staticClass:"btn",attrs:{"is-processing":t.isProcessing,v:{},color:"tertiary","border-radius":".3rem"},on:{"after-click":function(e){"order-new"===t.$route.name?t.$emit("change-order"):t.$emit("to-last-page")}},scopedSlots:t._u([{key:"initial",fn:function(){return[t._v("\n          回上一頁\n        ")]},proxy:!0}])}),e("ProcessButton",{staticClass:"btn",attrs:{"is-processing":t.isProcessing,v:{},color:"primary","border-radius":".3rem"},on:{"after-click":t.handleSubmit},scopedSlots:t._u([{key:"initial",fn:function(){return[t._t("submit",(function(){return[t._v("\n            確認訂購\n          ")]}))]},proxy:!0}],null,!0)})],1)])])},i=[],s=(r("8e6e"),r("ac6a"),r("456d"),r("f0ce"));function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function c(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach((function(e){Object(n["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var u={components:{ProcessButton:s["a"]},props:{orderInfo:{type:Object,required:!0},initialOrder:{type:Object,default:function(){return{time:"",quantity:0}}},initialProcessing:{type:Boolean,default:!1},currentUser:{type:Object,required:!0}},data:function(){return{formData:{time:"",quantity:1},errorMessage:{time:null,quantity:null},isProcessing:!1}},watch:{initialOrder:function(t){this.formData=c(c({},this.formData),t)},initialProcessing:function(t){this.isProcessing=t}},created:function(){this.formData=c(c({},this.formData),this.initialOrder),this.isProcessing=this.initialProcessing},methods:{handleSubmit:function(t){if(this.formData.time)if(this.errorMessage.time=null,this.formData.quantity<1)this.errorMessage.quantity="請選擇訂購數量";else{this.isProcessing=!0;var e={quantity:this.formData.quantity,require_date:this.formData.time};this.$emit("after-submit",e)}else this.errorMessage.time="請選擇領餐時間"}}},f=u,l=(r("743f"),r("2877")),d=Object(l["a"])(f,a,i,!1,null,"b86fa7aa",null);e["a"]=d.exports},"0e92":function(t,e,r){},"32a6":function(t,e,r){var n=r("241e"),a=r("c3a1");r("ce7e")("keys",(function(){return function(t){return a(n(t))}}))},"4c51":function(t,e,r){"use strict";r("f382")},"52b6":function(t,e,r){"use strict";r("7f7f");var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card d-flex flex-row rounded-sm w-100 shadow-sm"},[e("div",{staticClass:"card-left"},[e("img",{staticClass:"card-img rounded-0 rounded-sm",attrs:{src:t.order.meal.image,alt:"photo of the restaurant"}})]),e("div",{staticClass:"card-right"},[e("div",{staticClass:"card-body px-3 py-0"},[e("h5",{staticClass:"card-title m-0"},[t._v("\n        "+t._s(t.order.meal.name)+"\n      ")]),t.order.restaurant.rating?e("p",{staticClass:"card-text mt-1"},[e("span",{staticClass:"rating"},[t._v("★ "+t._s(t._f("padEnd")(t.order.restaurant.rating)))]),e("span",{staticClass:"mx-1"},[t._v("|")]),t._v(t._s(t.order.restaurant.name)+"\n      ")]):t._e(),e("p",{staticClass:"card-text d-none d-md-block"},[t._v("\n        "+t._s(t._f("textTruncate")(t.order.meal.description))+"\n      ")])])])])},a=[],i=r("2708"),s={mixins:[i["e"],i["g"]],props:{order:{type:Object,required:!0}}},o=s,c=(r("ff8c"),r("2877")),u=Object(c["a"])(o,n,a,!1,null,"13d79a95",null);e["a"]=u.exports},"555f":function(t,e,r){"use strict";var n=function(){var t=this,e=t._self._c;return e("section",{staticClass:"icecream-container",style:{height:t.height}},[e("div",{staticClass:"icecream-content py-5"},[t._l(3,(function(t){return e("h1",{key:t,staticClass:"icecream"},[e("i",{staticClass:"fas fa-ice-cream"})])})),e("small",{staticClass:"icecream-description"},[t._v("\n      準備中\n    ")])],2)])},a=[],i={props:{height:{type:String,default:"100vh"}}},s=i,o=(r("db9a"),r("2877")),c=Object(o["a"])(s,n,a,!1,null,"2e263baa",null);e["a"]=c.exports},"743f":function(t,e,r){"use strict";r("cae8")},"8aae":function(t,e,r){r("32a6"),t.exports=r("584a").Object.keys},"9b2a":function(t,e,r){"use strict";var n=r("2fa3");e["a"]={getNewOrder:function(){return n["b"].get("/order/new")},postNewOrder:function(t){return n["b"].post("/order/new",t)},getOrder:function(t){var e=t.orderId;return n["b"].get("/order/".concat(e))},getEditOrder:function(t){var e=t.orderId;return n["b"].get("/order/".concat(e,"/edit"))},putEditOrder:function(t){var e=t.orderId,r=t.formData;return n["b"].put("/order/".concat(e),r)},putCancelOrder:function(t){var e=t.orderId;return n["b"].put("/order/".concat(e,"/cancel"),{})},getComment:function(t){var e=t.orderId;return n["b"].get("/order/".concat(e,"/comment"))},postComment:function(t){var e=t.orderId,r=t.formData;return n["b"].post("/order/".concat(e,"/comment"),r)}}},"9d9f":function(t,e,r){},a4bb:function(t,e,r){t.exports=r("8aae")},a8db:function(t,e,r){"use strict";r.d(e,"a",(function(){return c}));var n=r("e265"),a=r.n(n),i=r("a4bb"),s=r.n(i);function o(t,e){if(null==t)return{};var r,n,a={},i=s()(t);for(n=0;n<i.length;n++)r=i[n],e.indexOf(r)>=0||(a[r]=t[r]);return a}function c(t,e){if(null==t)return{};var r,n,i=o(t,e);if(a.a){var s=a()(t);for(n=0;n<s.length;n++)r=s[n],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(i[r]=t[r])}return i}},cae8:function(t,e,r){},ce7e:function(t,e,r){var n=r("63b6"),a=r("584a"),i=r("294c");t.exports=function(t,e){var r=(a.Object||{})[t]||Object[t],s={};s[t]=e(r),n(n.S+n.F*i((function(){r(1)})),"Object",s)}},db9a:function(t,e,r){"use strict";r("9d9f")},e265:function(t,e,r){t.exports=r("ed33")},ed33:function(t,e,r){r("014b"),t.exports=r("584a").Object.getOwnPropertySymbols},f0ce:function(t,e,r){"use strict";var n=function(){var t=this,e=t._self._c;return e("button",{staticClass:"btn",class:"btn-"+t.color+"-color",style:{"border-radius":t.borderRadius},attrs:{disabled:t.isProcessing||t.v.$invalid},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("after-click"),t.isCurrentButton=!0}}},[!t.isProcessing||t.isProcessing&&!t.isCurrentButton?[t._t("initial")]:t._e(),t.isProcessing&&t.isCurrentButton?[t._v("\n    處理中 ...\n  ")]:t._e()],2)},a=[],i={props:{isProcessing:{type:Boolean,default:!1},v:{type:Object,required:!0},color:{type:String,default:"primary"},borderRadius:{type:String,default:"1rem"}},data:function(){return{isCurrentButton:!1}},watch:{isProcessing:function(t){t||(this.isCurrentButton=!1)}}},s=i,o=(r("4c51"),r("2877")),c=Object(o["a"])(s,n,a,!1,null,"35aea9ab",null);e["a"]=c.exports},f382:function(t,e,r){},ff8c:function(t,e,r){"use strict";r("0e92")}}]);
//# sourceMappingURL=chunk-3ecd6ace.39d7e070.js.map