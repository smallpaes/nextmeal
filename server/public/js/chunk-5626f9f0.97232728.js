(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5626f9f0"],{"12be":function(e,s,t){},3204:function(e,s,t){"use strict";t("12be")},b8da:function(e,s,t){"use strict";t.r(s);var n=function(){var e=this,s=e._self._c;return s("section",{staticClass:"wrapper d-flex h-100"},[s("OwnerSideNavBar",{attrs:{"nav-is-open":e.navIsOpen}}),s("section",{staticClass:"dish flex-fill"},[s("NavbarToggler",{attrs:{"nav-is-open":e.navIsOpen},on:{"toggle-navbar":function(s){e.navIsOpen=!e.navIsOpen}}}),s("h1",{staticClass:"dish-title"},[e._v("\n      餐點資訊\n    ")]),s("OwnerDishNavPill",{staticClass:"mt-4 ml-1"}),s("hr",{staticClass:"dish-divider"}),s("transition",{attrs:{name:"slide",appear:""}},[s("div",{staticClass:"dish-form-container pb-4"},[s("OwnerDishForm",{attrs:{"initial-processing":e.isProcessing},on:{"after-submit":e.handleAfterSubmit},scopedSlots:e._u([{key:"header",fn:function(){return[s("span",[e._v("增添")])]},proxy:!0},{key:"submitBtn",fn:function(){return[s("span",[e._v("新增")])]},proxy:!0}])})],1)])],1)],1)},a=[],r=(t("96cf"),t("3b8d")),i=t("0a76"),c=t("0f14d"),o=t("fb59"),u=t("f7c4"),p=t("bcc2"),f=t("2fa3"),l={components:{OwnerSideNavBar:i["a"],NavbarToggler:c["a"],OwnerDishNavPill:o["a"],OwnerDishForm:u["a"]},data:function(){return{isProcessing:!1,navIsOpen:!1}},methods:{handleAfterSubmit:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(s){var t,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.isProcessing=!0,e.prev=1,e.next=4,p["a"].dishes.postNew(s);case 4:if(t=e.sent,n=t.data,a=t.statusText,"success"===n.status&&"OK"===a){e.next=9;break}throw new Error(n.message);case 9:this.$router.push({name:"owner-dishes"}),e.next=16;break;case 12:e.prev=12,e.t0=e["catch"](1),this.isProcessing=!1,f["a"].fire({type:"error",title:"無法建立餐點，請稍後再試"});case 16:case"end":return e.stop()}}),e,this,[[1,12]])})));function s(s){return e.apply(this,arguments)}return s}()}},h=l,d=(t("3204"),t("2877")),v=Object(d["a"])(h,n,a,!1,null,"4fcfad2c",null);s["default"]=v.exports}}]);
//# sourceMappingURL=chunk-5626f9f0.97232728.js.map