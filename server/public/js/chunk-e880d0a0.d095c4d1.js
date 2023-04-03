(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e880d0a0"],{"075c":function(t,e,r){"use strict";var a=r("ade3"),i=(r("b0c0"),function(){var t=this,e=t._self._c;return e("section",{staticClass:"form"},[e("form",{ref:"form",staticClass:"form-wrapper rounded-sm shadow-sm p-3"},[e("h2",{staticClass:"form-title mb-4"},[t._v(" 訂購資料 ")]),e("fieldset",{staticClass:"form-group",attrs:{disabled:t.isProcessing}},[e("legend",{staticClass:"form-legend"},[t._v(" 預定領餐時間 "),t.errorMessage.time?e("span",{staticClass:"invalid-message"},[t._v("("+t._s(t.errorMessage.time)+")")]):t._e()]),t._l(t.orderInfo.timeSlots,(function(r){return e("div",{key:r,staticClass:"form-check form-check-inline"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.time,expression:"formData.time"}],staticClass:"form-check-input",attrs:{id:"radio"+r,type:"radio",name:"inlineRadioOptions",hidden:""},domProps:Object(a["a"])({value:r,checked:r===t.formData.time},"checked",t._q(t.formData.time,r)),on:{change:function(e){return t.$set(t.formData,"time",r)}}}),e("label",{staticClass:"form-check-label",attrs:{for:"radio"+r}},[t._v(t._s(r))])])}))],2),e("div",{staticClass:"form-group"},[e("label",{attrs:{for:"quantity"}},[t._v("預定數量")]),t.errorMessage.quantity?e("span",{staticClass:"invalid-message"},[t._v("("+t._s(t.errorMessage.quantity)+")")]):t._e(),e("div",{staticClass:"form-quantity"},[e("button",{staticClass:"btn btn-minus",class:{"disable-btn":t.formData.quantity<=1},attrs:{disabled:t.isProcessing||t.formData.quantity<=1},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.formData.quantity-=1}}},[t._v(" - ")]),e("input",{directives:[{name:"model",rawName:"v-model.number",value:t.formData.quantity,expression:"formData.quantity",modifiers:{number:!0}}],staticClass:"form-quantity-input text-center",attrs:{id:"quantity",type:"text",name:"quantity",size:"2",disabled:""},domProps:{value:t.formData.quantity},on:{input:function(e){e.target.composing||t.$set(t.formData,"quantity",t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}}),e("button",{staticClass:"btn btn-plus",class:{"disable-btn":t.orderInfo.quantity===t.formData.quantity||t.formData.quantity===t.currentUser.subscriptionBalance+t.initialOrder.quantity},attrs:{disabled:t.isProcessing||t.orderInfo.quantity===t.formData.quantity||t.formData.quantity===t.currentUser.subscriptionBalance+t.initialOrder.quantity},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.formData.quantity+=1}}},[t._v(" + ")])])]),e("hr",{staticClass:"form-divider mt-4"}),e("div",{staticClass:"btn-container"},[e("ProcessButton",{staticClass:"btn",attrs:{"is-processing":t.isProcessing,v:{},color:"tertiary","border-radius":".3rem"},on:{"after-click":function(e){"order-new"===t.$route.name?t.$emit("change-order"):t.$emit("to-last-page")}},scopedSlots:t._u([{key:"initial",fn:function(){return[t._v(" 回上一頁 ")]},proxy:!0}])}),e("ProcessButton",{staticClass:"btn",attrs:{"is-processing":t.isProcessing,v:{},color:"primary","border-radius":".3rem"},on:{"after-click":t.handleSubmit},scopedSlots:t._u([{key:"initial",fn:function(){return[t._t("submit",(function(){return[t._v(" 確認訂購 ")]}))]},proxy:!0}],null,!0)})],1)])])}),s=[],n=r("5530"),o=r("f0ce"),c={components:{ProcessButton:o["a"]},props:{orderInfo:{type:Object,required:!0},initialOrder:{type:Object,default:function(){return{time:"",quantity:0}}},initialProcessing:{type:Boolean,default:!1},currentUser:{type:Object,required:!0}},data:function(){return{formData:{time:"",quantity:1},errorMessage:{time:null,quantity:null},isProcessing:!1}},watch:{initialOrder:function(t){this.formData=Object(n["a"])(Object(n["a"])({},this.formData),t)},initialProcessing:function(t){this.isProcessing=t}},created:function(){this.formData=Object(n["a"])(Object(n["a"])({},this.formData),this.initialOrder),this.isProcessing=this.initialProcessing},methods:{handleSubmit:function(t){if(this.formData.time)if(this.errorMessage.time=null,this.formData.quantity<1)this.errorMessage.quantity="請選擇訂購數量";else{this.isProcessing=!0;var e={quantity:this.formData.quantity,require_date:this.formData.time};this.$emit("after-submit",e)}else this.errorMessage.time="請選擇領餐時間"}}},u=c,l=(r("743f"),r("2877")),d=Object(l["a"])(u,i,s,!1,null,"b86fa7aa",null);e["a"]=d.exports},"15fd":function(t,e,r){"use strict";r.d(e,"a",(function(){return i}));r("a4d3"),r("b64b");function a(t,e){if(null==t)return{};var r,a,i={},s=Object.keys(t);for(a=0;a<s.length;a++)r=s[a],e.indexOf(r)>=0||(i[r]=t[r]);return i}function i(t,e){if(null==t)return{};var r,i,s=a(t,e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);for(i=0;i<n.length;i++)r=n[i],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(s[r]=t[r])}return s}},"3cec":function(t,e,r){},"4c51":function(t,e,r){"use strict";r("7b7a")},"52b6":function(t,e,r){"use strict";r("b0c0"),r("a4d3"),r("e01a");var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card d-flex flex-row rounded-sm w-100 shadow-sm"},[e("div",{staticClass:"card-left"},[e("img",{staticClass:"card-img rounded-0 rounded-sm",attrs:{src:t.order.meal.image,alt:"photo of the restaurant"}})]),e("div",{staticClass:"card-right"},[e("div",{staticClass:"card-body px-3 py-0"},[e("h5",{staticClass:"card-title m-0"},[t._v(" "+t._s(t.order.meal.name)+" ")]),t.order.restaurant.rating?e("p",{staticClass:"card-text mt-1"},[e("span",{staticClass:"rating"},[t._v("★ "+t._s(t._f("padEnd")(t.order.restaurant.rating)))]),e("span",{staticClass:"mx-1"},[t._v("|")]),t._v(t._s(t.order.restaurant.name)+" ")]):t._e(),e("p",{staticClass:"card-text d-none d-md-block"},[t._v(" "+t._s(t._f("textTruncate")(t.order.meal.description))+" ")])])])])},i=[],s=r("2708"),n={mixins:[s["e"],s["g"]],props:{order:{type:Object,required:!0}}},o=n,c=(r("ff8c"),r("2877")),u=Object(c["a"])(o,a,i,!1,null,"13d79a95",null);e["a"]=u.exports},"555f":function(t,e,r){"use strict";var a=function(){var t=this,e=t._self._c;return e("section",{staticClass:"icecream-container",style:{height:t.height}},[e("div",{staticClass:"icecream-content py-5"},[t._l(3,(function(t){return e("h1",{key:t,staticClass:"icecream"},[e("i",{staticClass:"fas fa-ice-cream"})])})),e("small",{staticClass:"icecream-description"},[t._v(" 準備中 ")])],2)])},i=[],s={props:{height:{type:String,default:"100vh"}}},n=s,o=(r("db9a"),r("2877")),c=Object(o["a"])(n,a,i,!1,null,"2e263baa",null);e["a"]=c.exports},"743f":function(t,e,r){"use strict";r("b9e9")},"7b7a":function(t,e,r){},"9b2a":function(t,e,r){"use strict";var a=r("2fa3");e["a"]={getNewOrder:function(){return a["b"].get("/order/new")},postNewOrder:function(t){return a["b"].post("/order/new",t)},getOrder:function(t){var e=t.orderId;return a["b"].get("/order/".concat(e))},getEditOrder:function(t){var e=t.orderId;return a["b"].get("/order/".concat(e,"/edit"))},putEditOrder:function(t){var e=t.orderId,r=t.formData;return a["b"].put("/order/".concat(e),r)},putCancelOrder:function(t){var e=t.orderId;return a["b"].put("/order/".concat(e,"/cancel"),{})},getComment:function(t){var e=t.orderId;return a["b"].get("/order/".concat(e,"/comment"))},postComment:function(t){var e=t.orderId,r=t.formData;return a["b"].post("/order/".concat(e,"/comment"),r)}}},ad14:function(t,e,r){},b9e9:function(t,e,r){},db9a:function(t,e,r){"use strict";r("ad14")},f0ce:function(t,e,r){"use strict";var a=function(){var t=this,e=t._self._c;return e("button",{staticClass:"btn",class:"btn-"+t.color+"-color",style:{"border-radius":t.borderRadius},attrs:{disabled:t.isProcessing||t.v.$invalid},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("after-click"),t.isCurrentButton=!0}}},[!t.isProcessing||t.isProcessing&&!t.isCurrentButton?[t._t("initial")]:t._e(),t.isProcessing&&t.isCurrentButton?[t._v(" 處理中 ... ")]:t._e()],2)},i=[],s={props:{isProcessing:{type:Boolean,default:!1},v:{type:Object,required:!0},color:{type:String,default:"primary"},borderRadius:{type:String,default:"1rem"}},data:function(){return{isCurrentButton:!1}},watch:{isProcessing:function(t){t||(this.isCurrentButton=!1)}}},n=s,o=(r("4c51"),r("2877")),c=Object(o["a"])(n,a,i,!1,null,"35aea9ab",null);e["a"]=c.exports},ff8c:function(t,e,r){"use strict";r("3cec")}}]);
//# sourceMappingURL=chunk-e880d0a0.d095c4d1.js.map