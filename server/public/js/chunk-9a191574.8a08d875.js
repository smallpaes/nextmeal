(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9a191574"],{"03c7":function(t,e,r){},"04e7":function(t,e,r){},"4a39":function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t._self._c;return e("section",{staticClass:"profile-container"},[e("UserNavbar"),t.isLoading?e("Loader",{attrs:{height:"100vh"}}):t._e(),e("transition",{attrs:{name:"slide"}},[t.isLoading?t._e():e("section",{staticClass:"container pt-4 pb-4 w-100"},[e("div",{staticClass:"profile-wrapper row profil"},[e("div",{staticClass:"profile-content-left col-12 col-md-3 p-2"},[e("UserProfileCard")],1),e("div",{staticClass:"col-12 col-md-9 p-2"},[e("UserProfileForm",{attrs:{"initial-user":t.user,categories:t.categories,"initial-processing":t.isProcessing},on:{"after-submit":t.handleAfterSubmit}})],1)])])]),e("Footer",{staticClass:"w-100"})],1)},a=[],n=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),i=(r("96cf"),r("3b8d")),c=r("1dc8"),o=r("fd2d"),l=r("555f"),u=r("c08a"),f=r("5cf3"),p=r("4cce"),b=r("2fa3");function d(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,s)}return r}function m(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?d(Object(r),!0).forEach((function(e){Object(n["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var h={components:{UserNavbar:c["a"],UserProfileCard:u["a"],UserProfileForm:f["a"],Footer:o["a"],Loader:l["a"]},data:function(){return{user:{name:"",email:"",role:"",prefer:"",dob:"",image:"",lng:"",lat:"",location:""},categories:[],isLoading:!0,isProcessing:!1}},created:function(){this.fetchUser()},methods:{fetchUser:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,p["a"].getProfile();case 3:if(e=t.sent,r=e.data,s=e.statusText,"success"===r.status&&"OK"===s){t.next=8;break}throw new Error(r.message);case 8:this.user=m(m(m({},this.user),r.user),{},{dob:r.user.dob.slice(0,10),image:r.user.avatar}),this.categories=r.categories||this.categories,this.isLoading=!1,t.next=17;break;case 13:t.prev=13,t.t0=t["catch"](0),this.isLoading=!1,b["a"].fire({type:"error",title:"無法取得資料，請稍後再試"});case 17:case"end":return t.stop()}}),t,this,[[0,13]])})));function e(){return t.apply(this,arguments)}return e}(),handleAfterSubmit:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(e){var r,s,a,n,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=e.formData,s=e.storedUserData,t.prev=1,this.isProcessing=!0,t.next=5,p["a"].putProfile({formData:r});case 5:if(a=t.sent,n=a.data,i=a.statusText,"success"===n.status&&"OK"===i){t.next=10;break}throw new Error(n.message);case 10:this.$store.commit("setCurrentUser",s),this.isProcessing=!1,b["a"].fire({type:"success",title:"成功更新資料"}),t.next=19;break;case 15:t.prev=15,t.t0=t["catch"](1),this.isProcessing=!1,b["a"].fire({type:"error",title:"無法更新資料，請稍後再試"});case 19:case"end":return t.stop()}}),t,this,[[1,15]])})));function e(e){return t.apply(this,arguments)}return e}()}},v=h,g=(r("e268"),r("2877")),O=Object(g["a"])(v,s,a,!1,null,"3f3c8c04",null);e["default"]=O.exports},c08a:function(t,e,r){"use strict";r("7f7f");var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"profile-card rounded-sm shadow-sm"},[e("div",{staticClass:"profile-card-top"},[e("SkelentonBox",{staticClass:"rounded-circle skelenton-box",attrs:{width:"120px",height:"120px"}}),e("img",{attrs:{src:t._f("placeholderAvatar")(t.currentUser.avatar),alt:"user avatar"}}),e("h5",{staticClass:"mt-3 profile-card-top-name"},[t._v("\n      "+t._s(t.currentUser.name)+"\n    ")]),e("small",{staticClass:"profile-top-balance"},[t._v("\n      "+t._s(t._f("getSubscriptionStatus")(t.currentUser.subscriptionStatus))+" | 剩餘 "+t._s(t.currentUser.subscriptionBalance)+" 餐\n    ")])],1),e("hr",{staticClass:"m-0"}),e("div",{staticClass:"profile-card-bottom"},[e("ul",{staticClass:"nav flex-column"},[e("li",{staticClass:"nav-item"},[e("router-link",{staticClass:"nav-link",attrs:{to:{name:"user-profile"}}},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-cog mr-1"})]),t._v("\n          帳戶設定\n        ")])],1),e("li",{staticClass:"nav-item"},[e("router-link",{staticClass:"nav-link",attrs:{to:{name:"user-order"},"active-class":"active"}},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fas fa-clipboard-list mr-1"})]),t._v("\n          訂單管理\n        ")])],1)])])])},a=[],n=(r("8e6e"),r("ac6a"),r("456d"),r("bd86")),i=r("d1b6"),c=r("2708"),o=r("2f62");function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,s)}return r}function u(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){Object(n["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var f={filters:{getSubscriptionStatus:function(t){return t?"訂閱中":"未訂閱"}},components:{SkelentonBox:i["a"]},mixins:[c["f"]],computed:u({},Object(o["c"])(["currentUser"]))},p=f,b=(r("d202"),r("2877")),d=Object(b["a"])(p,s,a,!1,null,"a9ba2c36",null);e["a"]=d.exports},d202:function(t,e,r){"use strict";r("04e7")},e268:function(t,e,r){"use strict";r("03c7")}}]);
//# sourceMappingURL=chunk-9a191574.8a08d875.js.map