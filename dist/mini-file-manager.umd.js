var __defProp=Object.defineProperty,__hasOwnProp=Object.prototype.hasOwnProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(e,t,i)=>t in e?__defProp(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,__assign=(e,t)=>{for(var i in t||(t={}))__hasOwnProp.call(t,i)&&__defNormalProp(e,i,t[i]);if(__getOwnPropSymbols)for(var i of __getOwnPropSymbols(t))__propIsEnum.call(t,i)&&__defNormalProp(e,i,t[i]);return e};!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("vue"),require("vuex"),require("mini-notifier"),require("body-scroll-lock"),require("pentatrion-lib")):"function"==typeof define&&define.amd?define(["exports","vue","vuex","mini-notifier","body-scroll-lock","pentatrion-lib"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).miniFileManager={},e.Vue,e.Vuex,e.miniNotifier,e.bodyScrollLock,e.pentatrionLib)}(this,(function(e,t,i,o,l,n){"use strict";const r={data:()=>({sending:!1,uploadedFiles:0,filesToUpload:0,dropActive:!1,progressFilename:null,progressNumber:0}),computed:__assign(__assign(__assign({},i.mapState(["endPoints","currentEntryPoint","isAdmin"])),i.mapGetters(["completeDirectory"])),{canUpload(){return this.isAdmin||!this.currentEntryPoint.readOnly}}),methods:__assign(__assign({},i.mapMutations(["addFile","setFiles"])),{reset(){this.sending=!1,this.uploadedFiles=0,this.filesToUpload=0,this.progressNumber=0,this.progressFilename=null},highlight(){this.dropActive=!0},unhighlight(){this.dropActive=!1},handleDrop(e){this.unhighlight();let t=e.dataTransfer.files;this.handleFiles(t)},handleChange(e){let t=e.currentTarget.files;this.handleFiles(t)},async handleFiles(e){if(0!==e.length){this.filesToUpload=e.length,this.sending=!0;for(let t of e)await this.uploadFile(t)}},uploadFile(e){let t=this;return new Promise((i=>{let l=new FormData;l.append("file",e),l.append("directory",this.completeDirectory),l.append("origin",this.currentEntryPoint.origin),l.append("fileManager",!0),this.progressFilename=e.name,this.progressNumber=0;let n=new XMLHttpRequest;n.upload.onprogress=function(e){e.lengthComputable&&(t.progressNumber=Math.round(100*e.loaded/e.total))},n.open("POST",this.endPoints.uploadFile),n.onload=function(){let e;t.progressNumber=100;try{e=JSON.parse(this.responseText),200===this.status&&e&&e.files?t.setFiles(e.files):o.notify(e.title||e,{style:"error"})}catch(l){return void o.notify(this.responseText,{style:"error"})}finally{t.uploadedFiles++,t.checkFinished(),i()}},n.onerror=function(e){o.notify(e.target.statusText,{style:"error"}),t.uploadedFiles++,t.checkFinished(),i()},n.send(l)}))},checkFinished(){this.uploadedFiles<this.filesToUpload||this.reset()}})},s=t.withScopeId("data-v-0e2990ae");t.pushScopeId("data-v-0e2990ae");const a={key:0},c={key:0,class:"label",for:"fileElem"},d=t.createVNode("span",null,[t.createVNode("i",{class:"fa-doc-add"}),t.createTextVNode("Ajouter")],-1),p={key:1},u={class:"filename"},h={class:"counter ref"},m={key:1,class:"drop-area readonly"},f=t.createVNode("label",{class:"label"}," Répertoire en lecture seule. ",-1);t.popScopeId();const y=s(((e,i,o,l,n,r)=>null!==e.completeDirectory?(t.openBlock(),t.createBlock("div",a,[r.canUpload?(t.openBlock(),t.createBlock("div",{key:0,class:["drop-area",{highlight:n.dropActive,sending:n.sending}],onDragenter:i[2]||(i[2]=t.withModifiers(((...e)=>r.highlight&&r.highlight(...e)),["prevent","stop"])),onDragover:i[3]||(i[3]=t.withModifiers(((...e)=>r.highlight&&r.highlight(...e)),["prevent","stop"])),onDragleave:i[4]||(i[4]=t.withModifiers(((...e)=>r.unhighlight&&r.unhighlight(...e)),["prevent","stop"])),onDrop:i[5]||(i[5]=t.withModifiers(((...e)=>r.handleDrop&&r.handleDrop(...e)),["prevent","stop"]))},[t.createVNode("input",{type:"file",name:"upload",multiple:"",id:"fileElem",disabled:n.sending,accept:"image/*,text/*,video/*,audio/*,.rtf,.pdf,.xml,font/*,.ods,.odt,.docx,.doc,.xlsx,.xls,.json,.ai,.zip",onChange:i[1]||(i[1]=(...e)=>r.handleChange&&r.handleChange(...e))},null,40,["disabled"]),n.sending?n.progressFilename?(t.openBlock(),t.createBlock("div",p,[t.createVNode("div",{class:"progress-value",style:{width:n.progressNumber+"%"}},null,4),t.createVNode("div",u,t.toDisplayString(n.progressFilename),1),t.createVNode("div",h,t.toDisplayString(n.uploadedFiles+1)+" / "+t.toDisplayString(n.filesToUpload),1)])):t.createCommentVNode("",!0):(t.openBlock(),t.createBlock("label",c,[d]))],34)):(t.openBlock(),t.createBlock("div",m,[f]))])):t.createCommentVNode("",!0)));r.render=y,r.__scopeId="data-v-0e2990ae";const g={props:["files"],data:()=>({filename:"",ext:""}),computed:__assign(__assign({},i.mapState(["urlUploadFile","directory","editing","isAdmin","currentEntryPoint","endPoints","secondaryDirectories"])),{currentDirectoryName(){return this.secondaryDirectories.length>0?this.secondaryDirectories[this.secondaryDirectories.length-1]:this.currentEntryPoint.label},file(){return 1===this.files.length?this.files[0]:null}}),watch:{files(e){if(1===e.length){let t=e[0].filename,i=t.lastIndexOf(".");-1===i?(this.filename=t,this.ext=""):(this.filename=t.substring(0,i),this.ext=t.substring(i))}}},methods:__assign(__assign(__assign({},i.mapActions(["updateFilename","download","deleteSelectedFiles"])),i.mapMutations(["setEditing"])),{formatDate(e){let t=new Date(e);return t instanceof Date&&!isNaN(t)?new Intl.DateTimeFormat("fr-FR").format(t):""},canEdit(e){return!!this.isAdmin||!this.currentEntryPoint.readOnly&&!e.readOnly},copyToClipboard(){this.$refs.inputUrl.select(),document.execCommand("copy"),o.notify("URL copiée")},editFilename(){let e=this.filename+this.ext;this.editing?this.filename&&"."!==this.filename[0]?e!==this.file.filename&&this.updateFilename({file:this.file,filename:e}):o.notify("Nom de fichier non valide.",{style:"error"}):setTimeout((()=>{this.$refs.inputFilename.select()}),100),this.setEditing(!this.editing)},handleOpen(){this.file.url?window.open(this.file.url,"_blank"):window.open(`${window.location.origin}${this.endPoints.showFile}/show/${this.file.origin}/${this.file.uploadRelativePath}`,"_blank")},handleDownload(){let e=0===this.files.length?[this.directory]:this.files;this.download({files:e})}})},k=t.withScopeId("data-v-2e2faf06");t.pushScopeId("data-v-2e2faf06");const v={key:0,class:"infos"},b={key:0},F={class:"form-group"},S=t.createVNode("label",null,"Nom du dossier",-1),N={class:"form-group"},D=t.createVNode("label",null,"Accès",-1),V={key:0},B=t.createVNode("div",null,"Public",-1),C={key:1},w=t.createVNode("div",null,"Protégé",-1),_={class:"form-group"},P=t.createVNode("label",null,"Télécharger tout le dossier",-1),E=t.createVNode("i",{class:"fa-download"},null,-1),O={key:1},I={for:"name"},T=t.createTextVNode(" Nom "),x={key:0,class:"fa-ok"},M={key:1,class:"fa-pencil"},A={key:0},$={key:1},L={key:0,class:"input-with-button edit-filename"},U={class:"form-group compact"},j=t.createVNode("label",null,"Accès",-1),R={key:0},q={key:1},z={class:"form-group compact"},H=t.createVNode("label",null,"Ajouté le",-1),K={class:"form-group compact"},G=t.createVNode("label",null,"Taille",-1),J={key:0,class:"form-group compact"},X=t.createVNode("label",null,"URL",-1),Q={class:"file-url input-with-button"},W=t.createVNode("i",{class:"fa-clipboard"},null,-1),Y={class:"form-group btns"},Z=t.createVNode("i",{class:"fa-trash"},null,-1),ee=t.createVNode("i",{class:"fa-eye"},null,-1),te=t.createVNode("i",{class:"fa-download"},null,-1),ie={key:2};t.popScopeId();const oe=k(((e,i,o,l,n,r)=>e.directory?(t.openBlock(),t.createBlock("div",v,[0===o.files.length?(t.openBlock(),t.createBlock("div",b,[t.createVNode("div",F,[S,t.createVNode("div",null,t.toDisplayString(e.directory.filename),1)]),t.createVNode("div",N,[D,e.currentEntryPoint.url?(t.openBlock(),t.createBlock("div",V,[B])):(t.openBlock(),t.createBlock("div",C,[w]))]),t.createVNode("div",_,[P,t.createVNode("button",{class:"btn",onClick:i[1]||(i[1]=t.withModifiers(((...e)=>r.handleDownload&&r.handleDownload(...e)),["prevent"]))},[E])])])):1===o.files.length?(t.openBlock(),t.createBlock("div",O,[t.createVNode("form",{onSubmit:i[5]||(i[5]=t.withModifiers(((...e)=>r.editFilename&&r.editFilename(...e)),["prevent"])),class:"form-group filename"},[t.createVNode("label",I,[T,r.canEdit(r.file)?(t.openBlock(),t.createBlock("button",{key:0,href:"#",class:"with-icon btn-factice",onClick:i[2]||(i[2]=t.withModifiers(((...e)=>r.editFilename&&r.editFilename(...e)),["prevent"]))},[e.editing?(t.openBlock(),t.createBlock("i",x)):(t.openBlock(),t.createBlock("i",M))])):t.createCommentVNode("",!0)]),r.canEdit(r.file)?(t.openBlock(),t.createBlock("div",$,[e.editing?(t.openBlock(),t.createBlock("div",L,[t.withDirectives(t.createVNode("input",{type:"text",size:"1",class:"input-filename",ref:"inputFilename","onUpdate:modelValue":i[3]||(i[3]=t=>e.filename=t)},null,512),[[t.vModelText,e.filename]]),t.createVNode("span",null,t.toDisplayString(e.ext),1)])):(t.openBlock(),t.createBlock("div",{key:1,class:"div-filename",onClick:i[4]||(i[4]=t.withModifiers(((...e)=>r.editFilename&&r.editFilename(...e)),["prevent"]))},t.toDisplayString(r.file.filename),1))])):(t.openBlock(),t.createBlock("div",A,[t.createVNode("div",null,t.toDisplayString(r.file.filename),1)]))],32),t.createVNode("div",U,[j,r.canEdit(r.file)?(t.openBlock(),t.createBlock("div",R,"Lecture et modification")):(t.openBlock(),t.createBlock("div",q,"Lecture seule"))]),t.createVNode("div",z,[H,t.createVNode("div",null,t.toDisplayString(r.formatDate(r.file.createdAt)),1)]),t.createVNode("div",K,[G,t.createVNode("div",null,t.toDisplayString(r.file.humanSize),1)]),r.file.url?(t.openBlock(),t.createBlock("div",J,[X,t.createVNode("div",Q,[t.createVNode("input",{size:"1",class:"form-input",ref:"inputUrl",onFocus:i[6]||(i[6]=e=>e.target.select()),type:"text",readOnly:"",value:r.file.url},null,40,["value"]),t.createVNode("a",{href:"#",onClick:i[7]||(i[7]=t.withModifiers(((...e)=>r.copyToClipboard&&r.copyToClipboard(...e)),["prevent"])),class:"btn outlined btn-factice"},[W])])])):t.createCommentVNode("",!0),t.createVNode("div",Y,[r.canEdit(r.file)?(t.openBlock(),t.createBlock("button",{key:0,class:"btn btn-outlined",onClick:i[8]||(i[8]=t.withModifiers(((...t)=>e.deleteSelectedFiles&&e.deleteSelectedFiles(...t)),["prevent"]))},[Z])):t.createCommentVNode("",!0),r.file&&!r.file.isDir?(t.openBlock(),t.createBlock("button",{key:1,class:"btn btn-outlined",onClick:i[9]||(i[9]=t.withModifiers(((...e)=>r.handleOpen&&r.handleOpen(...e)),["prevent"]))},[ee])):t.createCommentVNode("",!0),t.createVNode("button",{class:"btn",onClick:i[10]||(i[10]=t.withModifiers(((...e)=>r.handleDownload&&r.handleDownload(...e)),["prevent"]))},[te])])])):o.files.length>1?(t.openBlock(),t.createBlock("div",ie,t.toDisplayString(o.files.length)+" éléments sélectionnés ",1)):t.createCommentVNode("",!0)])):t.createCommentVNode("",!0)));g.render=oe,g.__scopeId="data-v-2e2faf06";const le={props:["options","placeholder","modelValue","splitButton"],emit:["update:modelValue"],data:()=>({isOpen:!1,focusListener:null}),computed:{spinnerClass(){return this.isOpen?"fa-up-open":"fa-down-open"},valueLabel(){return this.modelValue?this.modelValue.label:this.placeholder}},methods:{handleClickOption(e){this.isOpen=!1,this.$emit("update:modelValue",e)},handleClickSelect(e){this.splitButton?this.$emit("click",this.modelValue):this.isOpen=!this.isOpen},handleClickContainer(e){this.isOpen=!1},handleClickSplit(e){this.isOpen=!this.isOpen}}},ne=t.withScopeId("data-v-2890adc0");t.pushScopeId("data-v-2890adc0");const re={key:0},se={key:1,class:"select-items"},ae={key:0};t.popScopeId();const ce=ne(((e,i,o,l,n,r)=>(t.openBlock(),t.createBlock("div",{class:["custom-select",{"is-open":e.isOpen,"with-split-button":o.splitButton&&o.options.length>1}],onClick:i[3]||(i[3]=(...e)=>r.handleClickContainer&&r.handleClickContainer(...e))},[t.createVNode("a",{href:"#",class:"select-selected",tabindex:"0",onClick:i[1]||(i[1]=t.withModifiers(((...e)=>r.handleClickSelect&&r.handleClickSelect(...e)),["stop","prevent"]))},[o.modelValue&&o.modelValue.icon?(t.openBlock(),t.createBlock("span",re,[t.createVNode("i",{class:o.modelValue.icon},null,2)])):t.createCommentVNode("",!0),t.createTextVNode(" "+t.toDisplayString(r.valueLabel),1)]),o.splitButton&&o.options.length>1?(t.openBlock(),t.createBlock("a",{key:0,href:"#",tabindex:"0",class:"split-button",onClick:i[2]||(i[2]=t.withModifiers(((...e)=>r.handleClickSplit&&r.handleClickSplit(...e)),["stop","prevent"]))},[t.createVNode("i",{class:r.spinnerClass},null,2)])):t.createCommentVNode("",!0),e.isOpen?(t.openBlock(),t.createBlock("div",se,[(t.openBlock(!0),t.createBlock(t.Fragment,null,t.renderList(o.options,(e=>(t.openBlock(),t.createBlock("a",{href:"#",onClick:t.withModifiers((t=>r.handleClickOption(e)),["stop","prevent"]),key:e.value,class:"select-item"},[e.icon?(t.openBlock(),t.createBlock("span",ae,[t.createVNode("i",{class:e.icon},null,2)])):t.createCommentVNode("",!0),t.createTextVNode(" "+t.toDisplayString(e.label),1)],8,["onClick"])))),128))])):t.createCommentVNode("",!0)],2))));le.render=ce,le.__scopeId="data-v-2890adc0";const de={props:["file"],methods:{formatDate(e){let t=new Date(e);return t instanceof Date&&!isNaN(t)?new Intl.DateTimeFormat("fr-FR").format(t):""}}},pe=t.withScopeId("data-v-2100a174");t.pushScopeId("data-v-2100a174");const ue={class:"filename"},he={class:"size ref"},me={class:"date ref"};t.popScopeId();const fe=pe(((e,i,o,l,n,r)=>(t.openBlock(),t.createBlock("a",{href:"#",class:"file",onClick:i[1]||(i[1]=t.withModifiers((t=>e.$emit("click",t)),["prevent"])),onDblclick:i[2]||(i[2]=t=>e.$emit("dblclick",t))},[t.createVNode("div",ue,t.toDisplayString(o.file.filename),1),t.createVNode("div",he,t.toDisplayString(o.file.humanSize),1),t.createVNode("div",me,t.toDisplayString(r.formatDate(o.file.createdAt)),1)],32))));de.render=fe,de.__scopeId="data-v-2100a174";const ye={props:["file"],computed:{},methods:{iconPath(e){var t;return(null==(t=e.thumbnails)?void 0:t.small)?e.thumbnails.small:e.icon},isIcon(e){var t;return!(null==(t=e.thumbnails)?void 0:t.small)},handleDragStart(e,t){t.url&&(e.dataTransfer.setData("text/html",`<img src="${t.url}">`),e.dataTransfer.setData("text/plain",t.url),e.dataTransfer.setData("application/x-editor-js",t.url))}}},ge=t.withScopeId("data-v-fc37bbba");t.pushScopeId("data-v-fc37bbba");const ke={class:"square"},ve={class:"filename"};t.popScopeId();const be=ge(((e,i,o,l,n,r)=>(t.openBlock(),t.createBlock("a",{href:"#",class:"file",onClick:i[2]||(i[2]=t.withModifiers((t=>e.$emit("click",t)),["prevent"])),onDblclick:i[3]||(i[3]=t=>e.$emit("dblclick",t))},[t.createVNode("div",ke,[t.createVNode("div",{class:["img-container",{"is-icon":r.isIcon(o.file),"is-not-icon":!r.isIcon(o.file)}]},[t.createVNode("img",{onDragstart:i[1]||(i[1]=e=>r.handleDragStart(e,o.file)),alt:o.file.filename,src:r.iconPath(o.file)},null,40,["alt","src"])],2)]),t.createVNode("div",ve,t.toDisplayString(o.file.label||o.file.filename),1)],32))));ye.render=be,ye.__scopeId="data-v-fc37bbba";const Fe={components:{Uploader:r,Infos:g,VSelect:le,Icon:ye,ListItem:de},props:{isModal:{type:Boolean,default:!1}},data:()=>({presentation:"icons",options:{}}),computed:__assign(__assign({},i.mapState(["editing","files","selectedFiles","entryPoints","secondaryDirectories","currentEntryPoint","isAdmin"])),{canEdit(){return!!this.isAdmin||this.currentEntryPoint&&!this.currentEntryPoint.readOnly},currentEntryPoint:{get(){return this.$store.state.currentEntryPoint},set(e){this.$store.dispatch("setCurrentEntryPoint",e)}},fileComponent(){return"list"===this.presentation?de:ye},presentationClass(){return`${this.presentation}-presentation`}}),methods:__assign(__assign(__assign({},i.mapMutations(["selectFile","unselectFiles","addFileToSelection","removeFileToSelection"])),i.mapActions(["init","setCurrentEntryPoint","download","deleteSelectedFiles","setSecondaryDirectoryFromFullDirectory","addDirectory"])),{toggleOrder(){this.presentation="list"===this.presentation?"icons":"list"},noDragging(e){e.dataTransfer.dropEffect="none"},isSelected(e){return this.selectedFiles.includes(e)},handleKeyPressed(e){46===e.keyCode&&this.selectedFiles.length>0&&!this.editing&&this.deleteSelectedFiles()},handleAddDirectory(){let e=this;o.prompt("Nom du dossier",{okHandler:function(t){t.length>128?o.notify("Le nom du dossier est trop long.",{style:"error"}):e.addDirectory(t)}})},handleClick(e,t){if(t&&2===t.detail)return;-1===this.selectedFiles.indexOf(e)&&this.addFileToSelection(e)},handleDblClick(e){switch(e.type){case"file":this.isModal?this.$emit("confirm"):this.download({files:[e]});break;case"dir":this.setSecondaryDirectoryFromFullDirectory(e.uploadRelativePath)}},handleChangeSecondaryDirectory(e){let t=[];for(let o=0;o<e;o++)t.push(this.secondaryDirectories[o]);let i=t.join("/");""!==i&&(i="/"+i),this.setSecondaryDirectoryFromFullDirectory(this.currentEntryPoint.directory+i)}}),mounted(){this.init(),window.addEventListener("keydown",this.handleKeyPressed)},unmounted(){window.removeEventListener("keydown",this.handleKeyPressed)}},Se=t.withScopeId("data-v-bb386868");t.pushScopeId("data-v-bb386868");const Ne={class:"action"},De={key:0,class:"fa-order-list"},Ve={key:1,class:"fa-order-icons"},Be=t.createVNode("i",{class:"fa-folder-add"},null,-1),Ce={class:"hierarchy"},we={class:"files"};t.popScopeId();const _e=Se(((e,i,o,l,n,r)=>{const s=t.resolveComponent("Uploader"),a=t.resolveComponent("VSelect"),c=t.resolveComponent("Infos");return t.openBlock(),t.createBlock("div",{class:"file-manager",onDragover:i[6]||(i[6]=(...e)=>r.noDragging&&r.noDragging(...e))},[t.createVNode("div",Ne,[t.createVNode("button",{class:"btn btn-outlined",onClick:i[1]||(i[1]=t.withModifiers((e=>r.toggleOrder()),["prevent"]))},["list"===n.presentation?(t.openBlock(),t.createBlock("i",De)):t.createCommentVNode("",!0),"icons"===n.presentation?(t.openBlock(),t.createBlock("i",Ve)):t.createCommentVNode("",!0)]),t.createVNode("button",{class:"btn btn-outlined",disabled:!r.canEdit,onClick:i[2]||(i[2]=(...e)=>r.handleAddDirectory&&r.handleAddDirectory(...e))},[Be],8,["disabled"])]),t.createVNode(s,{class:"dropzone"}),t.createVNode("div",Ce,[t.createVNode(a,{class:"directory-selector","split-button":!0,options:e.entryPoints,modelValue:r.currentEntryPoint,"onUpdate:modelValue":i[3]||(i[3]=e=>r.currentEntryPoint=e),onClick:i[4]||(i[4]=e=>r.handleChangeSecondaryDirectory(0)),placeholder:"Répertoire"},null,8,["options","modelValue"]),(t.openBlock(!0),t.createBlock(t.Fragment,null,t.renderList(e.secondaryDirectories,((e,i)=>(t.openBlock(),t.createBlock("button",{class:"btn btn-outlined",onClick:e=>r.handleChangeSecondaryDirectory(i+1),key:i},t.toDisplayString(e),9,["onClick"])))),128))]),t.createVNode("div",{class:["files-container",{[r.presentationClass]:!0}],onClick:i[5]||(i[5]=(...t)=>e.unselectFiles&&e.unselectFiles(...t))},[t.createVNode("div",we,[(t.openBlock(!0),t.createBlock(t.Fragment,null,t.renderList(e.files,(e=>(t.openBlock(),t.createBlock(t.resolveDynamicComponent(r.fileComponent),{key:e.id,class:["file",{selected:r.isSelected(e)}],file:e,onClick:t.withModifiers((t=>r.handleClick(e,t)),["stop"]),onDblclick:t.withModifiers((t=>r.handleDblClick(e)),["stop"])},null,8,["file","class","onClick","onDblclick"])))),128))])],2),t.createVNode(c,{class:"infos",files:e.selectedFiles},null,8,["files"])],32)}));Fe.render=_e,Fe.__scopeId="data-v-bb386868";const Pe={components:{FileManager:Fe},computed:__assign({},i.mapState(["selectedFiles"])),methods:{handleAbort(){let e=new CustomEvent("abortSelect");this.$el.dispatchEvent(e)},handleConfirm(){let e=new CustomEvent("selectFiles",{detail:this.selectedFiles});this.$el.dispatchEvent(e)}}},Ee=t.withScopeId("data-v-0633eb52");t.pushScopeId("data-v-0633eb52");const Oe={class:"file-manager-modal"},Ie={class:"box"},Te={class:"actions"};t.popScopeId();const xe=Ee(((e,i,o,l,n,r)=>{const s=t.resolveComponent("FileManager"),a=t.resolveDirective("body-scroll-lock");return t.openBlock(),t.createBlock("div",Oe,[t.createVNode("div",Ie,[t.withDirectives(t.createVNode(s,{class:"file-manager","is-modal":!0,onConfirm:r.handleConfirm},null,8,["onConfirm"]),[[a,!0,"reserve-scroll-bar-gap"]]),t.createVNode("div",Te,[t.createVNode("button",{class:"btn btn-outlined",onClick:i[1]||(i[1]=(...e)=>r.handleAbort&&r.handleAbort(...e))},"Annuler"),t.createVNode("button",{class:"btn",onClick:i[2]||(i[2]=(...e)=>r.handleConfirm&&r.handleConfirm(...e))},"Sélectionner")])]),t.createVNode("div",{class:"bg",onClick:i[3]||(i[3]=(...e)=>r.handleAbort&&r.handleAbort(...e))})])}));Pe.render=xe,Pe.__scopeId="data-v-0633eb52";const Me="reserve-scroll-bar-gap",Ae={reserveScrollBarGap:!0},$e={mounted:(e,t)=>{t.arg&&t.arg===Me&&t.value?l.disableBodyScroll(e,Ae):t.value&&l.disableBodyScroll(e)},updated:(e,t)=>{t.oldValue!==t.value&&(t.arg&&t.arg===Me&&t.value?l.disableBodyScroll(e,Ae):t.value?l.disableBodyScroll(e):l.enableBodyScroll(e))},unmounted:e=>{l.enableBodyScroll(e)}},{jsonFetchOrNotify:Le}=n.apiHelper;function Ue(e){return i.createStore({state:__assign(__assign({},e),{currentEntryPoint:null,secondaryDirectories:[],multiple:!1,directory:null,files:[],selectedFiles:[],editing:!1}),getters:{completeDirectory(e){let t="",i="";return e.currentEntryPoint?(e.secondaryDirectories.length>0&&(t=e.secondaryDirectories.join("/")),""!==e.currentEntryPoint.directory&&(i=e.currentEntryPoint.directory+"/"),i+t):null}},mutations:{setFiles(e,t){e.files=t},setDirectory(e,t){e.directory=t},setEntryPoints(e,t){e.entryPoints=t},addFile(e,t){e.files.splice(0,0,t)},addFileByIdToSelection(e,t){let i=e.files.find((e=>e.id===t));i&&(e.multiple?e.selectedFiles.push(i):e.selectedFiles=[i])},addFileToSelection(e,t){e.multiple?e.selectedFiles.push(t):e.selectedFiles=[t]},removeFileToSelection(e,t){let i=e.selectedFiles.indexOf(t);e.selectedFiles.splice(i,1)},selectFileByInode(e,t){let i=e.files.find((e=>e.inode===t));i&&(e.selectedFiles=[i])},unselectFiles(e){e.selectedFiles=[]},setEditing(e,t){e.editing=t},deleteSelectedFiles(e){for(let t of e.selectedFiles){let i=e.files.indexOf(t);-1!==i&&e.files.splice(i,1)}e.selectedFiles=[]},setCurrentEntryPoint(e,t){e.currentEntryPoint=t},setSecondaryDirectory(e,t){e.secondaryDirectories=t}},actions:{async addDirectory({state:e,getters:t,dispatch:i,commit:o},l){Le(e.endPoints.addDirectory,{method:"POST",body:{filename:l,directory:t.completeDirectory,origin:e.currentEntryPoint.origin}}).then((async({files:e,directory:t})=>{await i("setFiles",e),o("selectFileByInode",t.inode)}))},async updateFilename({commit:e,state:t,dispatch:i},{file:o,filename:l}){Le(t.endPoints.editFile,{method:"POST",body:{file:o,newFilename:l}}).then((async({files:t})=>{await i("setFiles",t),e("selectFileByInode",o.inode)}))},async download({state:e,getters:t},{files:i=[]}){if(1===i.length&&!i[0].isDir){let t=i[0];return void Le(`${e.endPoints.showFile}/download/${t.origin}/${t.uploadRelativePath}`,{},!1).then((e=>e.blob())).then((e=>n.downloadHelper.downloadFromBlob(e,t.filename)))}let o=e.directory.filename+"-"+n.dateHelper.toIsoString(new Date)+".zip";Le(e.endPoints.downloadArchive,{method:"POST",body:{files:i}},!1).then((e=>e.blob())).then((e=>{n.downloadHelper.downloadFromBlob(e,o)}))},async deleteSelectedFiles({commit:e,dispatch:t,state:i}){Le(i.endPoints.deleteFile,{method:"POST",body:i.selectedFiles}).catch((()=>{t("getFiles")})),e("deleteSelectedFiles")},async getFiles({dispatch:e,state:t,getters:i,commit:o}){Le(t.endPoints.getFiles,{method:"POST",body:{directory:i.completeDirectory,origin:t.currentEntryPoint.origin}}).then((({files:t,directory:i})=>{e("setFiles",t),i&&o("setDirectory",i)}))},async setFiles({commit:e},t){e("unselectFiles"),e("setFiles",t)},async setCurrentEntryPoint({commit:e,dispatch:t},i){e("setCurrentEntryPoint",i),t("setSecondaryDirectoryFromFullDirectory",i.directory)},async setSecondaryDirectoryFromFullDirectory({state:e,commit:t,dispatch:i},o){let l=e.currentEntryPoint.directory;if(0!==o.indexOf(l))return void console.error("répertoire inconnu");let n=o.substring(l.length),r=[];""!==n&&(n=n.replace(/^\//,""),r=n.split("/")),t("setSecondaryDirectory",r),i("getFiles")},async init({dispatch:e,state:t}){e("setCurrentEntryPoint",t.entryPoints[0])}}})}e.createFileManager=function(e,i){"string"==typeof e&&(e=document.querySelector(e)),i||(i=JSON.parse(e.dataset.props));const o=t.createApp(Fe);return o.directive("body-scroll-lock",$e),o.use(Ue(i)),o.mount(e),o},e.openFileManager=function(e,i,o){let l=document.createElement("div");function n(){c.$el.removeEventListener("selectFiles",r),c.$el.removeEventListener("abortSelect",s),a.unmount(),c.$el.remove()}function r(e){if(i){let o=[];for(let i=0;i<e.detail.length;i++)o.push(t.toRaw(e.detail[i]));i(t.toRaw(o))}n()}function s(e){o&&o(),n()}document.body.appendChild(l);const a=t.createApp(Pe);a.directive("body-scroll-lock",$e),a.use(Ue(e));const c=a.mount(l);c.$el.addEventListener("selectFiles",r),c.$el.addEventListener("abortSelect",s)},Object.defineProperty(e,"__esModule",{value:!0}),e[Symbol.toStringTag]="Module"}));
