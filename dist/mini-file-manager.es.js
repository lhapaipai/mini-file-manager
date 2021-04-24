var e=Object.defineProperty,t=Object.prototype.hasOwnProperty,n=Object.getOwnPropertySymbols,i=Object.prototype.propertyIsEnumerable,o=(t,n,i)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[n]=i,r=(e,r)=>{for(var s in r||(r={}))t.call(r,s)&&o(e,s,r[s]);if(n)for(var s of n(r))i.call(r,s)&&o(e,s,r[s]);return e};import{watch as s,reactive as l,pushScopeId as a,popScopeId as c,openBlock as d,createBlock as u,withModifiers as h,createVNode as p,toDisplayString as f,createCommentVNode as m,withScopeId as y,createTextVNode as v,withDirectives as g,vModelText as b,Fragment as w,renderList as C,resolveComponent as F,resolveDynamicComponent as k,resolveDirective as _,createApp as E,toRaw as D}from"vue";
/*!
 * vuex v4.0.0
 * (c) 2021 Evan You
 * @license MIT
 */var P=("undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).__VUE_DEVTOOLS_GLOBAL_HOOK__;function O(e,t){Object.keys(e).forEach((function(n){return t(e[n],n)}))}function S(e){return null!==e&&"object"==typeof e}var L=function(e,t){this.runtime=t,this._children=Object.create(null),this._rawModule=e;var n=e.state;this.state=("function"==typeof n?n():n)||{}},T={namespaced:{configurable:!0}};T.namespaced.get=function(){return!!this._rawModule.namespaced},L.prototype.addChild=function(e,t){this._children[e]=t},L.prototype.removeChild=function(e){delete this._children[e]},L.prototype.getChild=function(e){return this._children[e]},L.prototype.hasChild=function(e){return e in this._children},L.prototype.update=function(e){this._rawModule.namespaced=e.namespaced,e.actions&&(this._rawModule.actions=e.actions),e.mutations&&(this._rawModule.mutations=e.mutations),e.getters&&(this._rawModule.getters=e.getters)},L.prototype.forEachChild=function(e){O(this._children,e)},L.prototype.forEachGetter=function(e){this._rawModule.getters&&O(this._rawModule.getters,e)},L.prototype.forEachAction=function(e){this._rawModule.actions&&O(this._rawModule.actions,e)},L.prototype.forEachMutation=function(e){this._rawModule.mutations&&O(this._rawModule.mutations,e)},Object.defineProperties(L.prototype,T);var x=function(e){this.register([],e,!1)};function A(e,t,n){if(t.update(n),n.modules)for(var i in n.modules){if(!t.getChild(i))return;A(e.concat(i),t.getChild(i),n.modules[i])}}x.prototype.get=function(e){return e.reduce((function(e,t){return e.getChild(t)}),this.root)},x.prototype.getNamespace=function(e){var t=this.root;return e.reduce((function(e,n){return e+((t=t.getChild(n)).namespaced?n+"/":"")}),"")},x.prototype.update=function(e){A([],this.root,e)},x.prototype.register=function(e,t,n){var i=this;void 0===n&&(n=!0);var o=new L(t,n);0===e.length?this.root=o:this.get(e.slice(0,-1)).addChild(e[e.length-1],o);t.modules&&O(t.modules,(function(t,o){i.register(e.concat(o),t,n)}))},x.prototype.unregister=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1],i=t.getChild(n);i&&i.runtime&&t.removeChild(n)},x.prototype.isRegistered=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1];return!!t&&t.hasChild(n)};var M=function(e){var t=this;void 0===e&&(e={});var n=e.plugins;void 0===n&&(n=[]);var i=e.strict;void 0===i&&(i=!1),this._committing=!1,this._actions=Object.create(null),this._actionSubscribers=[],this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new x(e),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._makeLocalGettersCache=Object.create(null);var o=this,r=this.dispatch,s=this.commit;this.dispatch=function(e,t){return r.call(o,e,t)},this.commit=function(e,t,n){return s.call(o,e,t,n)},this.strict=i;var l=this._modules.root.state;U(this,l,[],this._modules.root),I(this,l),n.forEach((function(e){return e(t)})),(void 0===e.devtools||e.devtools)&&function(e){P&&(e._devtoolHook=P,P.emit("vuex:init",e),P.on("vuex:travel-to-state",(function(t){e.replaceState(t)})),e.subscribe((function(e,t){P.emit("vuex:mutation",e,t)}),{prepend:!0}),e.subscribeAction((function(e,t){P.emit("vuex:action",e,t)}),{prepend:!0}))}(this)},j={state:{configurable:!0}};function $(e,t,n){return t.indexOf(e)<0&&(n&&n.prepend?t.unshift(e):t.push(e)),function(){var n=t.indexOf(e);n>-1&&t.splice(n,1)}}function N(e,t){e._actions=Object.create(null),e._mutations=Object.create(null),e._wrappedGetters=Object.create(null),e._modulesNamespaceMap=Object.create(null);var n=e.state;U(e,n,[],e._modules.root,!0),I(e,n,t)}function I(e,t,n){var i=e._state;e.getters={},e._makeLocalGettersCache=Object.create(null);var o=e._wrappedGetters,r={};O(o,(function(t,n){r[n]=function(e,t){return function(){return e(t)}}(t,e),Object.defineProperty(e.getters,n,{get:function(){return r[n]()},enumerable:!0})})),e._state=l({data:t}),e.strict&&function(e){s((function(){return e._state.data}),(function(){}),{deep:!0,flush:"sync"})}(e),i&&n&&e._withCommit((function(){i.data=null}))}function U(e,t,n,i,o){var r=!n.length,s=e._modules.getNamespace(n);if(i.namespaced&&(e._modulesNamespaceMap[s],e._modulesNamespaceMap[s]=i),!r&&!o){var l=R(t,n.slice(0,-1)),a=n[n.length-1];e._withCommit((function(){l[a]=i.state}))}var c=i.context=function(e,t,n){var i=""===t,o={dispatch:i?e.dispatch:function(n,i,o){var r=H(n,i,o),s=r.payload,l=r.options,a=r.type;return l&&l.root||(a=t+a),e.dispatch(a,s)},commit:i?e.commit:function(n,i,o){var r=H(n,i,o),s=r.payload,l=r.options,a=r.type;l&&l.root||(a=t+a),e.commit(a,s,l)}};return Object.defineProperties(o,{getters:{get:i?function(){return e.getters}:function(){return function(e,t){if(!e._makeLocalGettersCache[t]){var n={},i=t.length;Object.keys(e.getters).forEach((function(o){if(o.slice(0,i)===t){var r=o.slice(i);Object.defineProperty(n,r,{get:function(){return e.getters[o]},enumerable:!0})}})),e._makeLocalGettersCache[t]=n}return e._makeLocalGettersCache[t]}(e,t)}},state:{get:function(){return R(e.state,n)}}}),o}(e,s,n);i.forEachMutation((function(t,n){!function(e,t,n,i){(e._mutations[t]||(e._mutations[t]=[])).push((function(t){n.call(e,i.state,t)}))}(e,s+n,t,c)})),i.forEachAction((function(t,n){var i=t.root?n:s+n,o=t.handler||t;!function(e,t,n,i){(e._actions[t]||(e._actions[t]=[])).push((function(t){var o,r=n.call(e,{dispatch:i.dispatch,commit:i.commit,getters:i.getters,state:i.state,rootGetters:e.getters,rootState:e.state},t);return(o=r)&&"function"==typeof o.then||(r=Promise.resolve(r)),e._devtoolHook?r.catch((function(t){throw e._devtoolHook.emit("vuex:error",t),t})):r}))}(e,i,o,c)})),i.forEachGetter((function(t,n){!function(e,t,n,i){if(e._wrappedGetters[t])return;e._wrappedGetters[t]=function(e){return n(i.state,i.getters,e.state,e.getters)}}(e,s+n,t,c)})),i.forEachChild((function(i,r){U(e,t,n.concat(r),i,o)}))}function R(e,t){return t.reduce((function(e,t){return e[t]}),e)}function H(e,t,n){return S(e)&&e.type&&(n=t,t=e,e=e.type),{type:e,payload:t,options:n}}M.prototype.install=function(e,t){e.provide(t||"store",this),e.config.globalProperties.$store=this},j.state.get=function(){return this._state.data},j.state.set=function(e){},M.prototype.commit=function(e,t,n){var i=this,o=H(e,t,n),r=o.type,s=o.payload,l={type:r,payload:s},a=this._mutations[r];a&&(this._withCommit((function(){a.forEach((function(e){e(s)}))})),this._subscribers.slice().forEach((function(e){return e(l,i.state)})))},M.prototype.dispatch=function(e,t){var n=this,i=H(e,t),o=i.type,r=i.payload,s={type:o,payload:r},l=this._actions[o];if(l){try{this._actionSubscribers.slice().filter((function(e){return e.before})).forEach((function(e){return e.before(s,n.state)}))}catch(c){}var a=l.length>1?Promise.all(l.map((function(e){return e(r)}))):l[0](r);return new Promise((function(e,t){a.then((function(t){try{n._actionSubscribers.filter((function(e){return e.after})).forEach((function(e){return e.after(s,n.state)}))}catch(c){}e(t)}),(function(e){try{n._actionSubscribers.filter((function(e){return e.error})).forEach((function(t){return t.error(s,n.state,e)}))}catch(c){}t(e)}))}))}},M.prototype.subscribe=function(e,t){return $(e,this._subscribers,t)},M.prototype.subscribeAction=function(e,t){return $("function"==typeof e?{before:e}:e,this._actionSubscribers,t)},M.prototype.watch=function(e,t,n){var i=this;return s((function(){return e(i.state,i.getters)}),t,Object.assign({},n))},M.prototype.replaceState=function(e){var t=this;this._withCommit((function(){t._state.data=e}))},M.prototype.registerModule=function(e,t,n){void 0===n&&(n={}),"string"==typeof e&&(e=[e]),this._modules.register(e,t),U(this,this.state,e,this._modules.get(e),n.preserveState),I(this,this.state)},M.prototype.unregisterModule=function(e){var t=this;"string"==typeof e&&(e=[e]),this._modules.unregister(e),this._withCommit((function(){delete R(t.state,e.slice(0,-1))[e[e.length-1]]})),N(this)},M.prototype.hasModule=function(e){return"string"==typeof e&&(e=[e]),this._modules.isRegistered(e)},M.prototype.hotUpdate=function(e){this._modules.update(e),N(this,!0)},M.prototype._withCommit=function(e){var t=this._committing;this._committing=!0,e(),this._committing=t},Object.defineProperties(M.prototype,j);var B=X((function(e,t){var n={};return q(t).forEach((function(t){var i=t.key,o=t.val;n[i]=function(){var t=this.$store.state,n=this.$store.getters;if(e){var i=K(this.$store,"mapState",e);if(!i)return;t=i.context.state,n=i.context.getters}return"function"==typeof o?o.call(this,t,n):t[o]},n[i].vuex=!0})),n})),G=X((function(e,t){var n={};return q(t).forEach((function(t){var i=t.key,o=t.val;n[i]=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];var i=this.$store.commit;if(e){var r=K(this.$store,"mapMutations",e);if(!r)return;i=r.context.commit}return"function"==typeof o?o.apply(this,[i].concat(t)):i.apply(this.$store,[o].concat(t))}})),n})),V=X((function(e,t){var n={};return q(t).forEach((function(t){var i=t.key,o=t.val;o=e+o,n[i]=function(){if(!e||K(this.$store,"mapGetters",e))return this.$store.getters[o]},n[i].vuex=!0})),n})),z=X((function(e,t){var n={};return q(t).forEach((function(t){var i=t.key,o=t.val;n[i]=function(){for(var t=[],n=arguments.length;n--;)t[n]=arguments[n];var i=this.$store.dispatch;if(e){var r=K(this.$store,"mapActions",e);if(!r)return;i=r.context.dispatch}return"function"==typeof o?o.apply(this,[i].concat(t)):i.apply(this.$store,[o].concat(t))}})),n}));function q(e){return function(e){return Array.isArray(e)||S(e)}(e)?Array.isArray(e)?e.map((function(e){return{key:e,val:e}})):Object.keys(e).map((function(t){return{key:t,val:e[t]}})):[]}function X(e){return function(t,n){return"string"!=typeof t?(n=t,t=""):"/"!==t.charAt(t.length-1)&&(t+="/"),e(t,n)}}function K(e,t,n){return e._modulesNamespaceMap[n]}const W="pentatrion-notify",Y="pentatrion-notify__cross",J=function(e,t){let n=document.createElement("DIV"),i=document.createElement("DIV"),o=t.style,r=document.createElementNS("http://www.w3.org/2000/svg","svg");return r.innerHTML='<path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>',r.setAttribute("viewBox","0 0 352 512"),r.setAttribute("height",15),i.append(r),n.classList.add(W),o&&n.classList.add(W+"--"+o),n.innerHTML=e,i.classList.add(Y),i.addEventListener("click",n.remove.bind(n)),n.appendChild(i),n},Q="pentatrion-notify--bounce-in";let Z=[];function ee(e=document.body){if(e.dataset.miniNotifier)return Z[+e.dataset.miniNotifier];let t=function(){let e=document.createElement("DIV");return e.classList.add("pentatrion-notifies"),e}();e===document.body&&t.classList.add("fixed");let n=Z.push(t);return e.dataset.miniNotifier=n-1,e.appendChild(t),t}function te(e="",t={}){let n=ee(t.target);const i=t.time||5e3;let o=J(e,t);window.setTimeout((function(){o.remove()}),i),n.appendChild(o),o.classList.add(Q)}const ne={data:()=>({sending:!1,uploadedFiles:0,filesToUpload:0,dropActive:!1,progressFilename:null,progressNumber:0}),computed:r(r(r({},B(["endPoints","currentEntryPoint","isAdmin"])),V(["completeDirectory"])),{canUpload(){return this.isAdmin||!this.currentEntryPoint.readOnly}}),methods:r(r({},G(["addFile","setFiles"])),{reset(){this.sending=!1,this.uploadedFiles=0,this.filesToUpload=0,this.progressNumber=0,this.progressFilename=null},highlight(){this.dropActive=!0},unhighlight(){this.dropActive=!1},handleDrop(e){this.unhighlight();let t=e.dataTransfer.files;this.handleFiles(t)},handleChange(e){let t=e.currentTarget.files;this.handleFiles(t)},async handleFiles(e){if(0!==e.length){this.filesToUpload=e.length,this.sending=!0;for(let t of e)await this.uploadFile(t)}},uploadFile(e){let t=this;return new Promise((n=>{let i=new FormData;i.append("file",e),i.append("directory",this.completeDirectory),i.append("origin",this.currentEntryPoint.origin),i.append("fileManager",!0),this.progressFilename=e.name,this.progressNumber=0;let o=new XMLHttpRequest;o.upload.onprogress=function(e){e.lengthComputable&&(t.progressNumber=Math.round(100*e.loaded/e.total))},o.open("POST",this.endPoints.uploadFile),o.onload=function(){let e;t.progressNumber=100;try{e=JSON.parse(this.responseText),200===this.status&&e&&e.files?t.setFiles(e.files):te(e.title||e,{style:"error"})}catch(i){return void te(this.responseText,{style:"error"})}finally{t.uploadedFiles++,t.checkFinished(),n()}},o.onerror=function(e){te(e.target.statusText,{style:"error"}),t.uploadedFiles++,t.checkFinished(),n()},o.send(i)}))},checkFinished(){this.uploadedFiles<this.filesToUpload||this.reset()}})},ie=y("data-v-2056ba30");a("data-v-2056ba30");const oe={key:0},re={key:0,class:"label",for:"fileElem"},se=p("span",null,[p("i",{class:"fa-doc-add"}),v("Ajouter")],-1),le={key:1},ae={class:"filename"},ce={class:"counter ref"},de={key:1,class:"drop-area readonly"},ue=p("label",{class:"label"}," Répertoire en lecture seule. ",-1);c();const he=ie(((e,t,n,i,o,r)=>e.completeDirectory?(d(),u("div",oe,[r.canUpload?(d(),u("div",{key:0,class:["drop-area",{highlight:o.dropActive,sending:o.sending}],onDragenter:t[2]||(t[2]=h(((...e)=>r.highlight&&r.highlight(...e)),["prevent","stop"])),onDragover:t[3]||(t[3]=h(((...e)=>r.highlight&&r.highlight(...e)),["prevent","stop"])),onDragleave:t[4]||(t[4]=h(((...e)=>r.unhighlight&&r.unhighlight(...e)),["prevent","stop"])),onDrop:t[5]||(t[5]=h(((...e)=>r.handleDrop&&r.handleDrop(...e)),["prevent","stop"]))},[p("input",{type:"file",name:"upload",multiple:"",id:"fileElem",disabled:o.sending,accept:"image/*,text/*,video/*,audio/*,.rtf,.pdf,.xml,font/*,.ods,.odt,.docx,.doc,.xlsx,.xls,.json,.ai,.zip",onChange:t[1]||(t[1]=(...e)=>r.handleChange&&r.handleChange(...e))},null,40,["disabled"]),o.sending?o.progressFilename?(d(),u("div",le,[p("div",{class:"progress-value",style:{width:o.progressNumber+"%"}},null,4),p("div",ae,f(o.progressFilename),1),p("div",ce,f(o.uploadedFiles+1)+" / "+f(o.filesToUpload),1)])):m("",!0):(d(),u("label",re,[se]))],34)):(d(),u("div",de,[ue]))])):m("",!0)));ne.render=he,ne.__scopeId="data-v-2056ba30";const pe={props:["files"],data:()=>({filename:"",ext:""}),computed:r(r({},B(["urlUploadFile","directory","editing","isAdmin","currentEntryPoint","endPoints","secondaryDirectories"])),{currentDirectoryName(){return this.secondaryDirectories.length>0?this.secondaryDirectories[this.secondaryDirectories.length-1]:this.currentEntryPoint.label},file(){return 1===this.files.length?this.files[0]:null}}),watch:{files(e){if(1===e.length){let t=e[0].filename,n=t.lastIndexOf(".");-1===n?(this.filename=t,this.ext=""):(this.filename=t.substring(0,n),this.ext=t.substring(n))}}},methods:r(r(r({},z(["updateFilename","download","deleteSelectedFiles"])),G(["setEditing"])),{formatDate(e){let t=new Date(e);return t instanceof Date&&!isNaN(t)?new Intl.DateTimeFormat("fr-FR").format(t):""},canEdit(e){return!!this.isAdmin||!this.currentEntryPoint.readOnly&&!e.readOnly},copyToClipboard(){this.$refs.inputUrl.select(),document.execCommand("copy"),te("URL copiée")},editFilename(){let e=this.filename+this.ext;this.editing?this.filename&&"."!==this.filename[0]?e!==this.file.filename&&this.updateFilename({file:this.file,filename:e}):te("Nom de fichier non valide.",{style:"error"}):setTimeout((()=>{this.$refs.inputFilename.select()}),100),this.setEditing(!this.editing)},handleOpen(){this.file.url?window.open(this.file.url,"_blank"):window.open(`${window.location.origin}${this.endPoints.showFile}/show/${this.file.origin}/${this.file.uploadRelativePath}`,"_blank")},handleDownload(){let e=0===this.files.length?[this.directory]:this.files;this.download({files:e})}})},fe=y("data-v-813ef8ae");a("data-v-813ef8ae");const me={key:0,class:"infos"},ye={key:0},ve={class:"form-group"},ge=p("label",null,"Nom du dossier",-1),be={class:"form-group"},we=p("label",null,"Accès",-1),Ce={key:0},Fe=p("div",null,"Public",-1),ke={key:1},_e=p("div",null,"Protégé",-1),Ee={class:"form-group"},De=p("label",null,"Télécharger tout le dossier",-1),Pe=p("i",{class:"fa-download"},null,-1),Oe={key:1},Se={for:"name"},Le=v(" Nom "),Te={key:0,class:"fa-ok"},xe={key:1,class:"fa-pencil"},Ae={key:0},Me={key:1},je={key:0,class:"input-with-button edit-filename"},$e={class:"form-group compact"},Ne=p("label",null,"Accès",-1),Ie={key:0},Ue={key:1},Re={class:"form-group compact"},He=p("label",null,"Ajouté le",-1),Be={class:"form-group compact"},Ge=p("label",null,"Taille",-1),Ve={key:0,class:"form-group compact"},ze=p("label",null,"URL",-1),qe={class:"file-url input-with-button"},Xe=p("i",{class:"fa-clipboard"},null,-1),Ke={class:"form-group btns"},We=p("i",{class:"fa-trash"},null,-1),Ye=p("i",{class:"fa-eye"},null,-1),Je=p("i",{class:"fa-download"},null,-1),Qe={key:2};c();const Ze=fe(((e,t,n,i,o,r)=>e.directory?(d(),u("div",me,[0===n.files.length?(d(),u("div",ye,[p("div",ve,[ge,p("div",null,f(e.directory.filename),1)]),p("div",be,[we,e.currentEntryPoint.url?(d(),u("div",Ce,[Fe])):(d(),u("div",ke,[_e]))]),p("div",Ee,[De,p("button",{class:"btn",onClick:t[1]||(t[1]=h(((...e)=>r.handleDownload&&r.handleDownload(...e)),["prevent"]))},[Pe])])])):1===n.files.length?(d(),u("div",Oe,[p("form",{onSubmit:t[5]||(t[5]=h(((...e)=>r.editFilename&&r.editFilename(...e)),["prevent"])),class:"form-group filename"},[p("label",Se,[Le,r.canEdit(r.file)?(d(),u("button",{key:0,href:"#",class:"with-icon btn-factice",onClick:t[2]||(t[2]=h(((...e)=>r.editFilename&&r.editFilename(...e)),["prevent"]))},[e.editing?(d(),u("i",Te)):(d(),u("i",xe))])):m("",!0)]),r.canEdit(r.file)?(d(),u("div",Me,[e.editing?(d(),u("div",je,[g(p("input",{type:"text",size:"1",class:"input-filename",ref:"inputFilename","onUpdate:modelValue":t[3]||(t[3]=t=>e.filename=t)},null,512),[[b,e.filename]]),p("span",null,f(e.ext),1)])):(d(),u("div",{key:1,class:"div-filename",onClick:t[4]||(t[4]=h(((...e)=>r.editFilename&&r.editFilename(...e)),["prevent"]))},f(r.file.filename),1))])):(d(),u("div",Ae,[p("div",null,f(r.file.filename),1)]))],32),p("div",$e,[Ne,r.canEdit(r.file)?(d(),u("div",Ie,"Lecture et modification")):(d(),u("div",Ue,"Lecture seule"))]),p("div",Re,[He,p("div",null,f(r.formatDate(r.file.createdAt)),1)]),p("div",Be,[Ge,p("div",null,f(r.file.humanSize),1)]),r.file.url?(d(),u("div",Ve,[ze,p("div",qe,[p("input",{size:"1",class:"form-input",ref:"inputUrl",onFocus:t[6]||(t[6]=e=>e.target.select()),type:"text",readOnly:"",value:r.file.url},null,40,["value"]),p("a",{href:"#",onClick:t[7]||(t[7]=h(((...e)=>r.copyToClipboard&&r.copyToClipboard(...e)),["prevent"])),class:"btn outlined btn-factice"},[Xe])])])):m("",!0),p("div",Ke,[r.canEdit(r.file)?(d(),u("button",{key:0,class:"btn btn-outlined",onClick:t[8]||(t[8]=h(((...t)=>e.deleteSelectedFiles&&e.deleteSelectedFiles(...t)),["prevent"]))},[We])):m("",!0),r.file&&!r.file.isDir?(d(),u("button",{key:1,class:"btn btn-outlined",onClick:t[9]||(t[9]=h(((...e)=>r.handleOpen&&r.handleOpen(...e)),["prevent"]))},[Ye])):m("",!0),p("button",{class:"btn",onClick:t[10]||(t[10]=h(((...e)=>r.handleDownload&&r.handleDownload(...e)),["prevent"]))},[Je])])])):n.files.length>1?(d(),u("div",Qe,f(n.files.length)+" éléments sélectionnés ",1)):m("",!0)])):m("",!0)));pe.render=Ze,pe.__scopeId="data-v-813ef8ae";const et={props:["options","placeholder","value","splitButton"],data:()=>({isOpen:!1,focusListener:null}),computed:{spinnerClass(){return this.isOpen?"fa-up-open":"fa-down-open"},valueLabel(){return this.value?this.value.label:this.placeholder}},methods:{handleClickOption(e){this.isOpen=!1,this.$emit("input",e)},handleClickSelect(e){this.splitButton?this.$emit("click",this.value):this.isOpen=!this.isOpen},handleClickContainer(e){this.isOpen=!1},handleClickSplit(e){this.isOpen=!this.isOpen}}},tt=y("data-v-18e65654");a("data-v-18e65654");const nt={key:0},it={key:1,class:"select-items"},ot={key:0};c();const rt=tt(((e,t,n,i,o,r)=>(d(),u("div",{class:["custom-select",{"is-open":e.isOpen,"with-split-button":n.splitButton&&n.options.length>1}],onClick:t[3]||(t[3]=(...e)=>r.handleClickContainer&&r.handleClickContainer(...e))},[p("a",{href:"#",class:"   select-selected",tabindex:"0",onClick:t[1]||(t[1]=h(((...e)=>r.handleClickSelect&&r.handleClickSelect(...e)),["stop","prevent"]))},[n.value&&n.value.icon?(d(),u("span",nt,[p("i",{class:n.value.icon},null,2)])):m("",!0),v(" "+f(r.valueLabel),1)]),n.splitButton&&n.options.length>1?(d(),u("a",{key:0,href:"#",tabindex:"0",class:"split-button",onClick:t[2]||(t[2]=h(((...e)=>r.handleClickSplit&&r.handleClickSplit(...e)),["stop","prevent"]))},[p("i",{class:r.spinnerClass},null,2)])):m("",!0),e.isOpen?(d(),u("div",it,[(d(!0),u(w,null,C(n.options,(e=>(d(),u("a",{href:"#",onClick:h((t=>r.handleClickOption(e)),["stop","prevent"]),key:e.value,class:"select-item"},[e.icon?(d(),u("span",ot,[p("i",{class:e.icon},null,2)])):m("",!0),v(" "+f(e.label),1)],8,["onClick"])))),128))])):m("",!0)],2))));et.render=rt,et.__scopeId="data-v-18e65654";const st={props:["file"],methods:{formatDate(e){let t=new Date(e);return t instanceof Date&&!isNaN(t)?new Intl.DateTimeFormat("fr-FR").format(t):""}}},lt=y("data-v-91ad3fe8");a("data-v-91ad3fe8");const at={class:"filename"},ct={class:"size ref"},dt={class:"date ref"};c();const ut=lt(((e,t,n,i,o,r)=>(d(),u("a",{href:"#",class:"file",onClick:t[1]||(t[1]=h((t=>e.$emit("click",t)),["prevent"])),onDblclick:t[2]||(t[2]=t=>e.$emit("dblclick",t))},[p("div",at,f(n.file.filename),1),p("div",ct,f(n.file.humanSize),1),p("div",dt,f(r.formatDate(n.file.createdAt)),1)],32))));st.render=ut,st.__scopeId="data-v-91ad3fe8";const ht={props:["file"],computed:{},methods:{iconPath(e){var t;return(null==(t=e.thumbnails)?void 0:t.small)?e.thumbnails.small:e.icon},isIcon(e){var t;return!(null==(t=e.thumbnails)?void 0:t.small)},handleDragStart(e,t){t.url&&(e.dataTransfer.setData("text/html",`<img src="${t.url}">`),e.dataTransfer.setData("text/plain",t.url),e.dataTransfer.setData("application/x-editor-js",t.url))}}},pt=y("data-v-007f00e7");a("data-v-007f00e7");const ft={class:"square"},mt={class:"filename"};c();const yt=pt(((e,t,n,i,o,r)=>(d(),u("a",{href:"#",class:"file",onClick:t[2]||(t[2]=h((t=>e.$emit("click",t)),["prevent"])),onDblclick:t[3]||(t[3]=t=>e.$emit("dblclick",t))},[p("div",ft,[p("div",{class:["img-container",{"is-icon":r.isIcon(n.file),"is-not-icon":!r.isIcon(n.file)}]},[p("img",{onDragstart:t[1]||(t[1]=e=>r.handleDragStart(e,n.file)),alt:n.file.filename,src:r.iconPath(n.file)},null,40,["alt","src"])],2)]),p("div",mt,f(n.file.label||n.file.filename),1)],32))));ht.render=yt,ht.__scopeId="data-v-007f00e7";const vt={components:{Uploader:ne,Infos:pe,VSelect:et,Icon:ht,ListItem:st},props:{isModal:{type:Boolean,default:!1}},data:()=>({presentation:"icons",options:{}}),computed:r(r({},B(["editing","files","selectedFiles","entryPoints","secondaryDirectories","currentEntryPoint","isAdmin"])),{canEdit(){return!!this.isAdmin||this.currentEntryPoint&&!this.currentEntryPoint.readOnly},currentEntryPoint:{get(){return this.$store.state.currentEntryPoint},set(e){this.$store.dispatch("setCurrentEntryPoint",e)}},fileComponent(){return"list"===this.presentation?st:ht},presentationClass(){return`${this.presentation}-presentation`}}),methods:r(r(r({},G(["selectFile","unselectFiles","addFileToSelection","removeFileToSelection"])),z(["init","setCurrentEntryPoint","download","deleteSelectedFiles","setSecondaryDirectoryFromFullDirectory","addDirectory"])),{toggleOrder(){this.presentation="list"===this.presentation?"icons":"list"},noDragging(e){e.dataTransfer.dropEffect="none"},isSelected(e){return this.selectedFiles.includes(e)},handleKeyPressed(e){46===e.keyCode&&this.selectedFiles.length>0&&!this.editing&&this.deleteSelectedFiles()},handleAddDirectory(){let e=this;!function(e="",t={}){let n=ee(t.target),i=function(e,t){t.style="prompt";let n=J(e,t),i=document.createElement("form"),o=document.createElement("button"),r=document.createElement("input"),s=n.querySelector(`.${Y}`),l=t.cancelHandler,a=t.okHandler;return i.classList.add("pentatrion-notify__btns-wrapper"),o.innerHTML=t.okText||"Valider",o.classList.add("btn"),r.classList.add("form-input"),t.placeholder&&r.setAttribute("placeholder",t.placeholder),t.default&&(r.value=t.default),t.inputType&&(r.type=t.inputType),l&&"function"==typeof l&&s.addEventListener("click",l),i.addEventListener("submit",(function(e){e.preventDefault(),a&&"function"==typeof a&&a(r.value)})),a&&"function"==typeof a&&o.addEventListener("click",(function(){a(r.value)})),o.addEventListener("click",n.remove.bind(n)),i.appendChild(r),i.appendChild(o),n.appendChild(i),setTimeout((()=>{r.focus()}),100),n}(e,t);n.appendChild(i),i.classList.add(Q)}("Nom du dossier",{okHandler:function(t){t.length>128?te("Le nom du dossier est trop long.",{style:"error"}):e.addDirectory(t)}})},handleClick(e,t){if(t&&2===t.detail)return;-1===this.selectedFiles.indexOf(e)&&this.addFileToSelection(e)},handleDblClick(e){switch(e.type){case"file":this.isModal?this.$emit("confirm"):this.download({files:[e]});break;case"dir":this.setSecondaryDirectoryFromFullDirectory(e.uploadRelativePath)}},handleChangeSecondaryDirectory(e){let t=[];for(let i=0;i<e;i++)t.push(this.secondaryDirectories[i]);let n=t.join("/");""!==n&&(n="/"+n),this.setSecondaryDirectoryFromFullDirectory(this.currentEntryPoint.directory+n)}}),mounted(){this.init(),window.addEventListener("keydown",this.handleKeyPressed)},unmounted(){window.removeEventListener("keydown",this.handleKeyPressed)}},gt=y("data-v-3a9ccd80");a("data-v-3a9ccd80");const bt={class:"action"},wt={key:0,class:"fa-order-list"},Ct={key:1,class:"fa-order-icons"},Ft=p("i",{class:"fa-folder-add"},null,-1),kt={class:"hierarchy"},_t={class:"files"};c();const Et=gt(((e,t,n,i,o,r)=>{const s=F("Uploader"),l=F("VSelect"),a=F("Infos");return d(),u("div",{class:"file-manager",onDragover:t[6]||(t[6]=(...e)=>r.noDragging&&r.noDragging(...e))},[p("div",bt,[p("button",{class:"btn btn-outlined",onClick:t[1]||(t[1]=h((e=>r.toggleOrder()),["prevent"]))},["list"===o.presentation?(d(),u("i",wt)):m("",!0),"icons"===o.presentation?(d(),u("i",Ct)):m("",!0)]),p("button",{class:"btn btn-outlined",disabled:!r.canEdit,onClick:t[2]||(t[2]=(...e)=>r.handleAddDirectory&&r.handleAddDirectory(...e))},[Ft],8,["disabled"])]),p(s,{class:"dropzone"}),p("div",kt,[p(l,{class:"directory-selector","split-button":!0,options:e.entryPoints,modelValue:r.currentEntryPoint,"onUpdate:modelValue":t[3]||(t[3]=e=>r.currentEntryPoint=e),onClick:t[4]||(t[4]=e=>r.handleChangeSecondaryDirectory(0)),placeholder:"Répertoire"},null,8,["options","modelValue"]),(d(!0),u(w,null,C(e.secondaryDirectories,((e,t)=>(d(),u("button",{class:"btn btn-outlined",onClick:e=>r.handleChangeSecondaryDirectory(t+1),key:t},f(e),9,["onClick"])))),128))]),p("div",{class:["files-container",{[r.presentationClass]:!0}],onClick:t[5]||(t[5]=(...t)=>e.unselectFiles&&e.unselectFiles(...t))},[p("div",_t,[(d(!0),u(w,null,C(e.files,(e=>(d(),u(k(r.fileComponent),{key:e.id,class:["file",{selected:r.isSelected(e)}],file:e,onClick:h((t=>r.handleClick(e,t)),["stop"]),onDblclick:h((t=>r.handleDblClick(e)),["stop"])},null,8,["file","class","onClick","onDblclick"])))),128))])],2),p(a,{class:"infos",files:e.selectedFiles},null,8,["files"])],32)}));vt.render=Et,vt.__scopeId="data-v-3a9ccd80";const Dt={components:{FileManager:vt},computed:r({},B(["selectedFiles"])),methods:{handleAbort(){let e=new CustomEvent("abortSelect");this.$el.dispatchEvent(e)},handleConfirm(){let e=new CustomEvent("selectFiles",{detail:this.selectedFiles});this.$el.dispatchEvent(e)}}},Pt=y("data-v-44e6daa1");a("data-v-44e6daa1");const Ot={class:"file-manager-modal"},St={class:"box"},Lt={class:"actions"};c();const Tt=Pt(((e,t,n,i,o,r)=>{const s=F("FileManager"),l=_("body-scroll-lock");return d(),u("div",Ot,[p("div",St,[g(p(s,{class:"file-manager","is-modal":!0,onConfirm:r.handleConfirm},null,8,["onConfirm"]),[[l,!0,"reserve-scroll-bar-gap"]]),p("div",Lt,[p("button",{class:"btn btn-outlined",onClick:t[1]||(t[1]=(...e)=>r.handleAbort&&r.handleAbort(...e))},"Annuler"),p("button",{class:"btn",onClick:t[2]||(t[2]=(...e)=>r.handleConfirm&&r.handleConfirm(...e))},"Sélectionner")])]),p("div",{class:"bg",onClick:t[3]||(t[3]=(...e)=>r.handleAbort&&r.handleAbort(...e))})])}));Dt.render=Tt,Dt.__scopeId="data-v-44e6daa1";var xt=!1;if("undefined"!=typeof window){var At={get passive(){xt=!0}};window.addEventListener("testPassive",null,At),window.removeEventListener("testPassive",null,At)}var Mt="undefined"!=typeof window&&window.navigator&&window.navigator.platform&&(/iP(ad|hone|od)/.test(window.navigator.platform)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1),jt=[],$t=!1,Nt=-1,It=void 0,Ut=void 0,Rt=function(e){return jt.some((function(t){return!(!t.options.allowTouchMove||!t.options.allowTouchMove(e))}))},Ht=function(e){var t=e||window.event;return!!Rt(t.target)||(t.touches.length>1||(t.preventDefault&&t.preventDefault(),!1))},Bt=function(e,t){if(e){if(!jt.some((function(t){return t.targetElement===e}))){var n={targetElement:e,options:t||{}};jt=[].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(jt),[n]),Mt?(e.ontouchstart=function(e){1===e.targetTouches.length&&(Nt=e.targetTouches[0].clientY)},e.ontouchmove=function(t){1===t.targetTouches.length&&function(e,t){var n=e.targetTouches[0].clientY-Nt;!Rt(e.target)&&(t&&0===t.scrollTop&&n>0||function(e){return!!e&&e.scrollHeight-e.scrollTop<=e.clientHeight}(t)&&n<0?Ht(e):e.stopPropagation())}(t,e)},$t||(document.addEventListener("touchmove",Ht,xt?{passive:!1}:void 0),$t=!0)):function(e){if(void 0===Ut){var t=!!e&&!0===e.reserveScrollBarGap,n=window.innerWidth-document.documentElement.clientWidth;t&&n>0&&(Ut=document.body.style.paddingRight,document.body.style.paddingRight=n+"px")}void 0===It&&(It=document.body.style.overflow,document.body.style.overflow="hidden")}(t)}}else console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.")},Gt=function(e){e?(jt=jt.filter((function(t){return t.targetElement!==e})),Mt?(e.ontouchstart=null,e.ontouchmove=null,$t&&0===jt.length&&(document.removeEventListener("touchmove",Ht,xt?{passive:!1}:void 0),$t=!1)):jt.length||(void 0!==Ut&&(document.body.style.paddingRight=Ut,Ut=void 0),void 0!==It&&(document.body.style.overflow=It,It=void 0))):console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.")};const Vt={reserveScrollBarGap:!0},zt={mounted:(e,t)=>{t.arg&&"reserve-scroll-bar-gap"===t.arg&&t.value?Bt(e,Vt):t.value&&Bt(e)},updated:(e,t)=>{t.oldValue!==t.value&&(t.arg&&"reserve-scroll-bar-gap"===t.arg&&t.value?Bt(e,Vt):t.value?Bt(e):Gt(e))},unmounted:e=>{Gt(e)}};function qt(e,t){let n=document.createElement("a");n.href=URL.createObjectURL(e),n.download=t,document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})),document.body.removeChild(n)}function Xt(e){return e<10?"0"+e:e}const Kt="pentatrion-notify";let Wt=[];function Yt(e="",t={}){let n=function(e=document.body){if(e.dataset.miniNotifier)return Wt[+e.dataset.miniNotifier];let t=function(){let e=document.createElement("DIV");return e.classList.add("pentatrion-notifies"),e}();e===document.body&&t.classList.add("fixed");let n=Wt.push(t);return e.dataset.miniNotifier=n-1,e.appendChild(t),t}(t.target);const i=t.time||5e3;let o=function(e,t){let n=document.createElement("DIV"),i=document.createElement("DIV"),o=t.style,r=document.createElementNS("http://www.w3.org/2000/svg","svg");return r.innerHTML='<path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>',r.setAttribute("viewBox","0 0 352 512"),r.setAttribute("height",15),i.append(r),n.classList.add(Kt),o&&n.classList.add(Kt+"--"+o),n.innerHTML=e,i.classList.add("pentatrion-notify__cross"),i.addEventListener("click",n.remove.bind(n)),n.appendChild(i),n}(e,t);window.setTimeout((function(){o.remove()}),i),n.appendChild(o),o.classList.add("pentatrion-notify--bounce-in")}function Jt(e,t={},n=!1){var i;t.body instanceof FormData&&(t.body=(i=t.body,Object.fromEntries(i))),"object"==typeof t.body&&(t.body=JSON.stringify(t.body));let o=new Headers({"Content-Type":"application/json",Accept:"application/json"});return n&&o.append("X-Requested-With","XMLHttpRequest"),Zt(e,t=r({headers:o,method:"POST"},t))}function Qt(e,t={},n=!1){"object"==typeof t.body&&(t.body=function(e){const t=new FormData;for(let n in e)t.append(n,e[n]);return t}(t.body));let i=new Headers({Accept:"application/json"});return n&&i.append("X-Requested-With","XMLHttpRequest"),Zt(e,t=r({headers:i,method:"POST"},t))}async function Zt(e,t={}){let n,i;try{if(n=await fetch(e,t),204===n.status)return null}catch(o){throw new en("Erreur serveur.",401)}if(n.headers.has("Content-Type")&&"application/json"!==n.headers.get("Content-Type")){if(!n.ok)throw new en("Erreur serveur.",500);return n}try{i=await n.json()}catch(o){throw new en("Le contenu renvoyé est illisible.",500)}if(!n.ok){let e=i.err||i.title||i.detail||"Erreur serveur";throw new en(e,n.status)}return i}class en{constructor(e,t=500){this.title=e,this.status=t}}var tn=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",jsonFetchOrNotify:async function(e,t={},n=!1){try{return await Jt(e,t,n)}catch(i){throw Yt(i instanceof en?i.title:i,{style:"error",time:5e5}),i}},formFetchOrNotify:async function(e,t={},n=!1){try{return await Qt(e,t,n)}catch(i){throw Yt(i instanceof en?i.title:i,{style:"error",time:5e5}),i}},jsonFetch:Jt,formFetch:Qt,ApiError:en});const{jsonFetchOrNotify:nn}=tn;function on(e){return t={state:r(r({},e),{currentEntryPoint:null,secondaryDirectories:[],multiple:!1,directory:null,files:[],selectedFiles:[],editing:!1}),getters:{completeDirectory(e){let t="";if(e.currentEntryPoint)return e.secondaryDirectories.length>0&&(t="/"+e.secondaryDirectories.join("/")),e.currentEntryPoint.directory+t}},mutations:{setFiles(e,t){e.files=t},setDirectory(e,t){e.directory=t},setEntryPoints(e,t){e.entryPoints=t},addFile(e,t){e.files.splice(0,0,t)},addFileByIdToSelection(e,t){let n=e.files.find((e=>e.id===t));n&&(e.multiple?e.selectedFiles.push(n):e.selectedFiles=[n])},addFileToSelection(e,t){e.multiple?e.selectedFiles.push(t):e.selectedFiles=[t]},removeFileToSelection(e,t){let n=e.selectedFiles.indexOf(t);e.selectedFiles.splice(n,1)},selectFileByInode(e,t){let n=e.files.find((e=>e.inode===t));n&&(e.selectedFiles=[n])},unselectFiles(e){e.selectedFiles=[]},setEditing(e,t){e.editing=t},deleteSelectedFiles(e){for(let t of e.selectedFiles){let n=e.files.indexOf(t);-1!==n&&e.files.splice(n,1)}e.selectedFiles=[]},setCurrentEntryPoint(e,t){e.currentEntryPoint=t},setSecondaryDirectory(e,t){e.secondaryDirectories=t}},actions:{async addDirectory({state:e,getters:t,dispatch:n,commit:i},o){nn(e.endPoints.addDirectory,{method:"POST",body:{filename:o,directory:t.completeDirectory,origin:e.currentEntryPoint.origin}}).then((async({files:e,directory:t})=>{await n("setFiles",e),i("selectFileByInode",t.inode)}))},async updateFilename({commit:e,state:t,dispatch:n},{file:i,filename:o}){nn(t.endPoints.editFile,{method:"POST",body:{file:i,newFilename:o}}).then((async({files:t})=>{await n("setFiles",t),e("selectFileByInode",i.inode)}))},async download({state:e,getters:t},{files:n=[]}){if(1===n.length&&!n[0].isDir){let t=n[0];return void nn(`${e.endPoints.showFile}/download/${t.origin}/${t.uploadRelativePath}`,{},!1).then((e=>e.blob())).then((e=>qt(e,t.filename)))}let i=e.directory.filename+"-"+function(e,t=!1){let n=e.getUTCFullYear()+"-"+Xt(e.getUTCMonth()+1)+"-"+Xt(e.getUTCDate());return t?n+"T"+Xt(e.getUTCHours())+"-"+Xt(e.getUTCMinutes()):n}(new Date)+".zip";nn(e.endPoints.downloadArchive,{method:"POST",body:{files:n}},!1).then((e=>e.blob())).then((e=>{qt(e,i)}))},async deleteSelectedFiles({commit:e,dispatch:t,state:n}){nn(n.endPoints.deleteFile,{method:"POST",body:n.selectedFiles}).catch((()=>{t("getFiles")})),e("deleteSelectedFiles")},async getFiles({dispatch:e,state:t,getters:n,commit:i}){nn(t.endPoints.getFiles,{method:"POST",body:{directory:n.completeDirectory,origin:t.currentEntryPoint.origin}}).then((({files:t,directory:n})=>{e("setFiles",t),n&&i("setDirectory",n)}))},async setFiles({commit:e},t){e("unselectFiles"),e("setFiles",t)},async setCurrentEntryPoint({commit:e,dispatch:t},n){e("setCurrentEntryPoint",n),t("setSecondaryDirectoryFromFullDirectory",n.directory)},async setSecondaryDirectoryFromFullDirectory({state:e,commit:t,dispatch:n},i){let o=e.currentEntryPoint.directory;if(0!==i.indexOf(o))return void console.error("répertoire inconnu");let r=i.substring(o.length),s=[];""!==r&&(s=r.substring(1).split("/")),t("setSecondaryDirectory",s),n("getFiles")},async init({dispatch:e,state:t}){e("setCurrentEntryPoint",t.entryPoints[0])}}},new M(t);var t}function rn(e,t){const n=E(vt);return n.directive("body-scroll-lock",zt),n.use(on(e)),n.mount(t),n}function sn(e,t,n){let i=document.createElement("div");function o(){a.$el.removeEventListener("selectFiles",r),a.$el.removeEventListener("abortSelect",s),l.unmount(),a.$el.remove()}function r(e){if(t){let n=[];for(let t=0;t<e.detail.length;t++)n.push(D(e.detail[t]));t(D(n))}o()}function s(e){n&&n(),o()}document.body.appendChild(i);const l=E(Dt);l.directive("body-scroll-lock",zt),l.use(on(e));const a=l.mount(i);a.$el.addEventListener("selectFiles",r),a.$el.addEventListener("abortSelect",s)}export{rn as createFileManager,sn as openFileManager};
