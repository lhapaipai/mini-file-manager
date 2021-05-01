var e=Object.defineProperty,t=Object.prototype.hasOwnProperty,i=Object.getOwnPropertySymbols,l=Object.prototype.propertyIsEnumerable,n=(t,i,l)=>i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[i]=l,s=(e,s)=>{for(var o in s||(s={}))t.call(s,o)&&n(e,o,s[o]);if(i)for(var o of i(s))l.call(s,o)&&n(e,o,s[o]);return e};import{pushScopeId as o,popScopeId as r,openBlock as a,createBlock as d,withModifiers as c,createVNode as u,toDisplayString as h,createCommentVNode as p,withScopeId as f,createTextVNode as m,withDirectives as y,vModelText as g,Fragment as v,renderList as b,resolveComponent as F,resolveDynamicComponent as k,resolveDirective as D,createApp as C,toRaw as P}from"vue";import{mapState as w,mapGetters as E,mapMutations as S,mapActions as O,createStore as T}from"vuex";import{notify as x,prompt as $}from"mini-notifier";import{disableBodyScroll as A,enableBodyScroll as I}from"body-scroll-lock";import{downloadHelper as N,dateHelper as L,apiHelper as U}from"pentatrion-lib";const V={data:()=>({sending:!1,uploadedFiles:0,filesToUpload:0,dropActive:!1,progressFilename:null,progressNumber:0}),computed:s(s(s({},w(["endPoints","currentEntryPoint","isAdmin"])),E(["completeDirectory"])),{canUpload(){return this.isAdmin||!this.currentEntryPoint.readOnly}}),methods:s(s({},S(["addFile","setFiles"])),{reset(){this.sending=!1,this.uploadedFiles=0,this.filesToUpload=0,this.progressNumber=0,this.progressFilename=null},highlight(){this.dropActive=!0},unhighlight(){this.dropActive=!1},handleDrop(e){this.unhighlight();let t=e.dataTransfer.files;this.handleFiles(t)},handleChange(e){let t=e.currentTarget.files;this.handleFiles(t)},async handleFiles(e){if(0!==e.length){this.filesToUpload=e.length,this.sending=!0;for(let t of e)await this.uploadFile(t)}},uploadFile(e){let t=this;return new Promise((i=>{let l=new FormData;l.append("file",e),l.append("directory",this.completeDirectory),l.append("origin",this.currentEntryPoint.origin),l.append("fileManager",!0),this.progressFilename=e.name,this.progressNumber=0;let n=new XMLHttpRequest;n.upload.onprogress=function(e){e.lengthComputable&&(t.progressNumber=Math.round(100*e.loaded/e.total))},n.open("POST",this.endPoints.uploadFile),n.onload=function(){let e;t.progressNumber=100;try{e=JSON.parse(this.responseText),200===this.status&&e&&e.files?t.setFiles(e.files):x(e.title||e,{style:"error"})}catch(l){return void x(this.responseText,{style:"error"})}finally{t.uploadedFiles++,t.checkFinished(),i()}},n.onerror=function(e){x(e.target.statusText,{style:"error"}),t.uploadedFiles++,t.checkFinished(),i()},n.send(l)}))},checkFinished(){this.uploadedFiles<this.filesToUpload||this.reset()}})},_=f("data-v-0e2990ae");o("data-v-0e2990ae");const B={key:0},j={key:0,class:"label",for:"fileElem"},R=u("span",null,[u("i",{class:"fa-doc-add"}),m("Ajouter")],-1),z={key:1},M={class:"filename"},q={class:"counter ref"},K={key:1,class:"drop-area readonly"},H=u("label",{class:"label"}," Répertoire en lecture seule. ",-1);r();const J=_(((e,t,i,l,n,s)=>null!==e.completeDirectory?(a(),d("div",B,[s.canUpload?(a(),d("div",{key:0,class:["drop-area",{highlight:n.dropActive,sending:n.sending}],onDragenter:t[2]||(t[2]=c(((...e)=>s.highlight&&s.highlight(...e)),["prevent","stop"])),onDragover:t[3]||(t[3]=c(((...e)=>s.highlight&&s.highlight(...e)),["prevent","stop"])),onDragleave:t[4]||(t[4]=c(((...e)=>s.unhighlight&&s.unhighlight(...e)),["prevent","stop"])),onDrop:t[5]||(t[5]=c(((...e)=>s.handleDrop&&s.handleDrop(...e)),["prevent","stop"]))},[u("input",{type:"file",name:"upload",multiple:"",id:"fileElem",disabled:n.sending,accept:"image/*,text/*,video/*,audio/*,.rtf,.pdf,.xml,font/*,.ods,.odt,.docx,.doc,.xlsx,.xls,.json,.ai,.zip",onChange:t[1]||(t[1]=(...e)=>s.handleChange&&s.handleChange(...e))},null,40,["disabled"]),n.sending?n.progressFilename?(a(),d("div",z,[u("div",{class:"progress-value",style:{width:n.progressNumber+"%"}},null,4),u("div",M,h(n.progressFilename),1),u("div",q,h(n.uploadedFiles+1)+" / "+h(n.filesToUpload),1)])):p("",!0):(a(),d("label",j,[R]))],34)):(a(),d("div",K,[H]))])):p("",!0)));V.render=J,V.__scopeId="data-v-0e2990ae";const G={props:["files"],data:()=>({filename:"",ext:""}),computed:s(s({},w(["urlUploadFile","directory","editing","isAdmin","currentEntryPoint","endPoints","secondaryDirectories"])),{currentDirectoryName(){return this.secondaryDirectories.length>0?this.secondaryDirectories[this.secondaryDirectories.length-1]:this.currentEntryPoint.label},file(){return 1===this.files.length?this.files[0]:null}}),watch:{files(e){if(1===e.length){let t=e[0].filename,i=t.lastIndexOf(".");-1===i?(this.filename=t,this.ext=""):(this.filename=t.substring(0,i),this.ext=t.substring(i))}}},methods:s(s(s({},O(["updateFilename","download","deleteSelectedFiles"])),S(["setEditing"])),{formatDate(e){let t=new Date(e);return t instanceof Date&&!isNaN(t)?new Intl.DateTimeFormat("fr-FR").format(t):""},canEdit(e){return!!this.isAdmin||!this.currentEntryPoint.readOnly&&!e.readOnly},copyToClipboard(){this.$refs.inputUrl.select(),document.execCommand("copy"),x("URL copiée")},editFilename(){let e=this.filename+this.ext;this.editing?this.filename&&"."!==this.filename[0]?e!==this.file.filename&&this.updateFilename({file:this.file,filename:e}):x("Nom de fichier non valide.",{style:"error"}):setTimeout((()=>{this.$refs.inputFilename.select()}),100),this.setEditing(!this.editing)},handleOpen(){this.file.url?window.open(this.file.url,"_blank"):window.open(`${window.location.origin}${this.endPoints.showFile}/show/${this.file.origin}/${this.file.uploadRelativePath}`,"_blank")},handleDownload(){let e=0===this.files.length?[this.directory]:this.files;this.download({files:e})}})},X=f("data-v-2e2faf06");o("data-v-2e2faf06");const Q={key:0,class:"infos"},W={key:0},Y={class:"form-group"},Z=u("label",null,"Nom du dossier",-1),ee={class:"form-group"},te=u("label",null,"Accès",-1),ie={key:0},le=u("div",null,"Public",-1),ne={key:1},se=u("div",null,"Protégé",-1),oe={class:"form-group"},re=u("label",null,"Télécharger tout le dossier",-1),ae=u("i",{class:"fa-download"},null,-1),de={key:1},ce={for:"name"},ue=m(" Nom "),he={key:0,class:"fa-ok"},pe={key:1,class:"fa-pencil"},fe={key:0},me={key:1},ye={key:0,class:"input-with-button edit-filename"},ge={class:"form-group compact"},ve=u("label",null,"Accès",-1),be={key:0},Fe={key:1},ke={class:"form-group compact"},De=u("label",null,"Ajouté le",-1),Ce={class:"form-group compact"},Pe=u("label",null,"Taille",-1),we={key:0,class:"form-group compact"},Ee=u("label",null,"URL",-1),Se={class:"file-url input-with-button"},Oe=u("i",{class:"fa-clipboard"},null,-1),Te={class:"form-group btns"},xe=u("i",{class:"fa-trash"},null,-1),$e=u("i",{class:"fa-eye"},null,-1),Ae=u("i",{class:"fa-download"},null,-1),Ie={key:2};r();const Ne=X(((e,t,i,l,n,s)=>e.directory?(a(),d("div",Q,[0===i.files.length?(a(),d("div",W,[u("div",Y,[Z,u("div",null,h(e.directory.filename),1)]),u("div",ee,[te,e.currentEntryPoint.url?(a(),d("div",ie,[le])):(a(),d("div",ne,[se]))]),u("div",oe,[re,u("button",{class:"btn",onClick:t[1]||(t[1]=c(((...e)=>s.handleDownload&&s.handleDownload(...e)),["prevent"]))},[ae])])])):1===i.files.length?(a(),d("div",de,[u("form",{onSubmit:t[5]||(t[5]=c(((...e)=>s.editFilename&&s.editFilename(...e)),["prevent"])),class:"form-group filename"},[u("label",ce,[ue,s.canEdit(s.file)?(a(),d("button",{key:0,href:"#",class:"with-icon btn-factice",onClick:t[2]||(t[2]=c(((...e)=>s.editFilename&&s.editFilename(...e)),["prevent"]))},[e.editing?(a(),d("i",he)):(a(),d("i",pe))])):p("",!0)]),s.canEdit(s.file)?(a(),d("div",me,[e.editing?(a(),d("div",ye,[y(u("input",{type:"text",size:"1",class:"input-filename",ref:"inputFilename","onUpdate:modelValue":t[3]||(t[3]=t=>e.filename=t)},null,512),[[g,e.filename]]),u("span",null,h(e.ext),1)])):(a(),d("div",{key:1,class:"div-filename",onClick:t[4]||(t[4]=c(((...e)=>s.editFilename&&s.editFilename(...e)),["prevent"]))},h(s.file.filename),1))])):(a(),d("div",fe,[u("div",null,h(s.file.filename),1)]))],32),u("div",ge,[ve,s.canEdit(s.file)?(a(),d("div",be,"Lecture et modification")):(a(),d("div",Fe,"Lecture seule"))]),u("div",ke,[De,u("div",null,h(s.formatDate(s.file.createdAt)),1)]),u("div",Ce,[Pe,u("div",null,h(s.file.humanSize),1)]),s.file.url?(a(),d("div",we,[Ee,u("div",Se,[u("input",{size:"1",class:"form-input",ref:"inputUrl",onFocus:t[6]||(t[6]=e=>e.target.select()),type:"text",readOnly:"",value:s.file.url},null,40,["value"]),u("a",{href:"#",onClick:t[7]||(t[7]=c(((...e)=>s.copyToClipboard&&s.copyToClipboard(...e)),["prevent"])),class:"btn outlined btn-factice"},[Oe])])])):p("",!0),u("div",Te,[s.canEdit(s.file)?(a(),d("button",{key:0,class:"btn btn-outlined",onClick:t[8]||(t[8]=c(((...t)=>e.deleteSelectedFiles&&e.deleteSelectedFiles(...t)),["prevent"]))},[xe])):p("",!0),s.file&&!s.file.isDir?(a(),d("button",{key:1,class:"btn btn-outlined",onClick:t[9]||(t[9]=c(((...e)=>s.handleOpen&&s.handleOpen(...e)),["prevent"]))},[$e])):p("",!0),u("button",{class:"btn",onClick:t[10]||(t[10]=c(((...e)=>s.handleDownload&&s.handleDownload(...e)),["prevent"]))},[Ae])])])):i.files.length>1?(a(),d("div",Ie,h(i.files.length)+" éléments sélectionnés ",1)):p("",!0)])):p("",!0)));G.render=Ne,G.__scopeId="data-v-2e2faf06";const Le={props:["options","placeholder","modelValue","splitButton"],emit:["update:modelValue"],data:()=>({isOpen:!1,focusListener:null}),computed:{spinnerClass(){return this.isOpen?"fa-up-open":"fa-down-open"},valueLabel(){return this.modelValue?this.modelValue.label:this.placeholder}},methods:{handleClickOption(e){this.isOpen=!1,this.$emit("update:modelValue",e)},handleClickSelect(e){this.splitButton?this.$emit("click",this.modelValue):this.isOpen=!this.isOpen},handleClickContainer(e){this.isOpen=!1},handleClickSplit(e){this.isOpen=!this.isOpen}}},Ue=f("data-v-2890adc0");o("data-v-2890adc0");const Ve={key:0},_e={key:1,class:"select-items"},Be={key:0};r();const je=Ue(((e,t,i,l,n,s)=>(a(),d("div",{class:["custom-select",{"is-open":e.isOpen,"with-split-button":i.splitButton&&i.options.length>1}],onClick:t[3]||(t[3]=(...e)=>s.handleClickContainer&&s.handleClickContainer(...e))},[u("a",{href:"#",class:"select-selected",tabindex:"0",onClick:t[1]||(t[1]=c(((...e)=>s.handleClickSelect&&s.handleClickSelect(...e)),["stop","prevent"]))},[i.modelValue&&i.modelValue.icon?(a(),d("span",Ve,[u("i",{class:i.modelValue.icon},null,2)])):p("",!0),m(" "+h(s.valueLabel),1)]),i.splitButton&&i.options.length>1?(a(),d("a",{key:0,href:"#",tabindex:"0",class:"split-button",onClick:t[2]||(t[2]=c(((...e)=>s.handleClickSplit&&s.handleClickSplit(...e)),["stop","prevent"]))},[u("i",{class:s.spinnerClass},null,2)])):p("",!0),e.isOpen?(a(),d("div",_e,[(a(!0),d(v,null,b(i.options,(e=>(a(),d("a",{href:"#",onClick:c((t=>s.handleClickOption(e)),["stop","prevent"]),key:e.value,class:"select-item"},[e.icon?(a(),d("span",Be,[u("i",{class:e.icon},null,2)])):p("",!0),m(" "+h(e.label),1)],8,["onClick"])))),128))])):p("",!0)],2))));Le.render=je,Le.__scopeId="data-v-2890adc0";const Re={props:["file"],methods:{formatDate(e){let t=new Date(e);return t instanceof Date&&!isNaN(t)?new Intl.DateTimeFormat("fr-FR").format(t):""}}},ze=f("data-v-2100a174");o("data-v-2100a174");const Me={class:"filename"},qe={class:"size ref"},Ke={class:"date ref"};r();const He=ze(((e,t,i,l,n,s)=>(a(),d("a",{href:"#",class:"file",onClick:t[1]||(t[1]=c((t=>e.$emit("click",t)),["prevent"])),onDblclick:t[2]||(t[2]=t=>e.$emit("dblclick",t))},[u("div",Me,h(i.file.filename),1),u("div",qe,h(i.file.humanSize),1),u("div",Ke,h(s.formatDate(i.file.createdAt)),1)],32))));Re.render=He,Re.__scopeId="data-v-2100a174";const Je={props:["file"],computed:{},methods:{iconPath(e){var t;return(null==(t=e.thumbnails)?void 0:t.small)?e.thumbnails.small:e.icon},isIcon(e){var t;return!(null==(t=e.thumbnails)?void 0:t.small)},handleDragStart(e,t){t.url&&(e.dataTransfer.setData("text/html",`<img src="${t.url}">`),e.dataTransfer.setData("text/plain",t.url),e.dataTransfer.setData("application/x-editor-js",t.url))}}},Ge=f("data-v-fc37bbba");o("data-v-fc37bbba");const Xe={class:"square"},Qe={class:"filename"};r();const We=Ge(((e,t,i,l,n,s)=>(a(),d("a",{href:"#",class:"file",onClick:t[2]||(t[2]=c((t=>e.$emit("click",t)),["prevent"])),onDblclick:t[3]||(t[3]=t=>e.$emit("dblclick",t))},[u("div",Xe,[u("div",{class:["img-container",{"is-icon":s.isIcon(i.file),"is-not-icon":!s.isIcon(i.file)}]},[u("img",{onDragstart:t[1]||(t[1]=e=>s.handleDragStart(e,i.file)),alt:i.file.filename,src:s.iconPath(i.file)},null,40,["alt","src"])],2)]),u("div",Qe,h(i.file.label||i.file.filename),1)],32))));Je.render=We,Je.__scopeId="data-v-fc37bbba";const Ye={components:{Uploader:V,Infos:G,VSelect:Le,Icon:Je,ListItem:Re},props:{isModal:{type:Boolean,default:!1}},data:()=>({presentation:"icons",options:{}}),computed:s(s({},w(["editing","files","selectedFiles","entryPoints","secondaryDirectories","currentEntryPoint","isAdmin"])),{canEdit(){return!!this.isAdmin||this.currentEntryPoint&&!this.currentEntryPoint.readOnly},currentEntryPoint:{get(){return this.$store.state.currentEntryPoint},set(e){this.$store.dispatch("setCurrentEntryPoint",e)}},fileComponent(){return"list"===this.presentation?Re:Je},presentationClass(){return`${this.presentation}-presentation`}}),methods:s(s(s({},S(["selectFile","unselectFiles","addFileToSelection","removeFileToSelection"])),O(["init","setCurrentEntryPoint","download","deleteSelectedFiles","setSecondaryDirectoryFromFullDirectory","addDirectory"])),{toggleOrder(){this.presentation="list"===this.presentation?"icons":"list"},noDragging(e){e.dataTransfer.dropEffect="none"},isSelected(e){return this.selectedFiles.includes(e)},handleKeyPressed(e){46===e.keyCode&&this.selectedFiles.length>0&&!this.editing&&this.deleteSelectedFiles()},handleAddDirectory(){let e=this;$("Nom du dossier",{okHandler:function(t){t.length>128?x("Le nom du dossier est trop long.",{style:"error"}):e.addDirectory(t)}})},handleClick(e,t){if(t&&2===t.detail)return;-1===this.selectedFiles.indexOf(e)&&this.addFileToSelection(e)},handleDblClick(e){switch(e.type){case"file":this.isModal?this.$emit("confirm"):this.download({files:[e]});break;case"dir":this.setSecondaryDirectoryFromFullDirectory(e.uploadRelativePath)}},handleChangeSecondaryDirectory(e){let t=[];for(let l=0;l<e;l++)t.push(this.secondaryDirectories[l]);let i=t.join("/");""!==i&&(i="/"+i),this.setSecondaryDirectoryFromFullDirectory(this.currentEntryPoint.directory+i)}}),mounted(){this.init(),window.addEventListener("keydown",this.handleKeyPressed)},unmounted(){window.removeEventListener("keydown",this.handleKeyPressed)}},Ze=f("data-v-bb386868");o("data-v-bb386868");const et={class:"action"},tt={key:0,class:"fa-order-list"},it={key:1,class:"fa-order-icons"},lt=u("i",{class:"fa-folder-add"},null,-1),nt={class:"hierarchy"},st={class:"files"};r();const ot=Ze(((e,t,i,l,n,s)=>{const o=F("Uploader"),r=F("VSelect"),f=F("Infos");return a(),d("div",{class:"file-manager",onDragover:t[6]||(t[6]=(...e)=>s.noDragging&&s.noDragging(...e))},[u("div",et,[u("button",{class:"btn btn-outlined",onClick:t[1]||(t[1]=c((e=>s.toggleOrder()),["prevent"]))},["list"===n.presentation?(a(),d("i",tt)):p("",!0),"icons"===n.presentation?(a(),d("i",it)):p("",!0)]),u("button",{class:"btn btn-outlined",disabled:!s.canEdit,onClick:t[2]||(t[2]=(...e)=>s.handleAddDirectory&&s.handleAddDirectory(...e))},[lt],8,["disabled"])]),u(o,{class:"dropzone"}),u("div",nt,[u(r,{class:"directory-selector","split-button":!0,options:e.entryPoints,modelValue:s.currentEntryPoint,"onUpdate:modelValue":t[3]||(t[3]=e=>s.currentEntryPoint=e),onClick:t[4]||(t[4]=e=>s.handleChangeSecondaryDirectory(0)),placeholder:"Répertoire"},null,8,["options","modelValue"]),(a(!0),d(v,null,b(e.secondaryDirectories,((e,t)=>(a(),d("button",{class:"btn btn-outlined",onClick:e=>s.handleChangeSecondaryDirectory(t+1),key:t},h(e),9,["onClick"])))),128))]),u("div",{class:["files-container",{[s.presentationClass]:!0}],onClick:t[5]||(t[5]=(...t)=>e.unselectFiles&&e.unselectFiles(...t))},[u("div",st,[(a(!0),d(v,null,b(e.files,(e=>(a(),d(k(s.fileComponent),{key:e.id,class:["file",{selected:s.isSelected(e)}],file:e,onClick:c((t=>s.handleClick(e,t)),["stop"]),onDblclick:c((t=>s.handleDblClick(e)),["stop"])},null,8,["file","class","onClick","onDblclick"])))),128))])],2),u(f,{class:"infos",files:e.selectedFiles},null,8,["files"])],32)}));Ye.render=ot,Ye.__scopeId="data-v-bb386868";const rt={components:{FileManager:Ye},computed:s({},w(["selectedFiles"])),methods:{handleAbort(){let e=new CustomEvent("abortSelect");this.$el.dispatchEvent(e)},handleConfirm(){let e=new CustomEvent("selectFiles",{detail:this.selectedFiles});this.$el.dispatchEvent(e)}}},at=f("data-v-0633eb52");o("data-v-0633eb52");const dt={class:"file-manager-modal"},ct={class:"box"},ut={class:"actions"};r();const ht=at(((e,t,i,l,n,s)=>{const o=F("FileManager"),r=D("body-scroll-lock");return a(),d("div",dt,[u("div",ct,[y(u(o,{class:"file-manager","is-modal":!0,onConfirm:s.handleConfirm},null,8,["onConfirm"]),[[r,!0,"reserve-scroll-bar-gap"]]),u("div",ut,[u("button",{class:"btn btn-outlined",onClick:t[1]||(t[1]=(...e)=>s.handleAbort&&s.handleAbort(...e))},"Annuler"),u("button",{class:"btn",onClick:t[2]||(t[2]=(...e)=>s.handleConfirm&&s.handleConfirm(...e))},"Sélectionner")])]),u("div",{class:"bg",onClick:t[3]||(t[3]=(...e)=>s.handleAbort&&s.handleAbort(...e))})])}));rt.render=ht,rt.__scopeId="data-v-0633eb52";const pt={reserveScrollBarGap:!0},ft={mounted:(e,t)=>{t.arg&&"reserve-scroll-bar-gap"===t.arg&&t.value?A(e,pt):t.value&&A(e)},updated:(e,t)=>{t.oldValue!==t.value&&(t.arg&&"reserve-scroll-bar-gap"===t.arg&&t.value?A(e,pt):t.value?A(e):I(e))},unmounted:e=>{I(e)}},{jsonFetchOrNotify:mt}=U;function yt(e){return T({state:s(s({},e),{currentEntryPoint:null,secondaryDirectories:[],multiple:!1,directory:null,files:[],selectedFiles:[],editing:!1}),getters:{completeDirectory(e){let t="",i="";return e.currentEntryPoint?(e.secondaryDirectories.length>0&&(t=e.secondaryDirectories.join("/")),""!==e.currentEntryPoint.directory&&(i=e.currentEntryPoint.directory+"/"),i+t):null}},mutations:{setFiles(e,t){e.files=t},setDirectory(e,t){e.directory=t},setEntryPoints(e,t){e.entryPoints=t},addFile(e,t){e.files.splice(0,0,t)},addFileByIdToSelection(e,t){let i=e.files.find((e=>e.id===t));i&&(e.multiple?e.selectedFiles.push(i):e.selectedFiles=[i])},addFileToSelection(e,t){e.multiple?e.selectedFiles.push(t):e.selectedFiles=[t]},removeFileToSelection(e,t){let i=e.selectedFiles.indexOf(t);e.selectedFiles.splice(i,1)},selectFileByInode(e,t){let i=e.files.find((e=>e.inode===t));i&&(e.selectedFiles=[i])},unselectFiles(e){e.selectedFiles=[]},setEditing(e,t){e.editing=t},deleteSelectedFiles(e){for(let t of e.selectedFiles){let i=e.files.indexOf(t);-1!==i&&e.files.splice(i,1)}e.selectedFiles=[]},setCurrentEntryPoint(e,t){e.currentEntryPoint=t},setSecondaryDirectory(e,t){e.secondaryDirectories=t}},actions:{async addDirectory({state:e,getters:t,dispatch:i,commit:l},n){mt(e.endPoints.addDirectory,{method:"POST",body:{filename:n,directory:t.completeDirectory,origin:e.currentEntryPoint.origin}}).then((async({files:e,directory:t})=>{await i("setFiles",e),l("selectFileByInode",t.inode)}))},async updateFilename({commit:e,state:t,dispatch:i},{file:l,filename:n}){mt(t.endPoints.editFile,{method:"POST",body:{file:l,newFilename:n}}).then((async({files:t})=>{await i("setFiles",t),e("selectFileByInode",l.inode)}))},async download({state:e,getters:t},{files:i=[]}){if(1===i.length&&!i[0].isDir){let t=i[0];return void mt(`${e.endPoints.showFile}/download/${t.origin}/${t.uploadRelativePath}`,{},!1).then((e=>e.blob())).then((e=>N.downloadFromBlob(e,t.filename)))}let l=e.directory.filename+"-"+L.toIsoString(new Date)+".zip";mt(e.endPoints.downloadArchive,{method:"POST",body:{files:i}},!1).then((e=>e.blob())).then((e=>{N.downloadFromBlob(e,l)}))},async deleteSelectedFiles({commit:e,dispatch:t,state:i}){mt(i.endPoints.deleteFile,{method:"POST",body:i.selectedFiles}).catch((()=>{t("getFiles")})),e("deleteSelectedFiles")},async getFiles({dispatch:e,state:t,getters:i,commit:l}){mt(t.endPoints.getFiles,{method:"POST",body:{directory:i.completeDirectory,origin:t.currentEntryPoint.origin}}).then((({files:t,directory:i})=>{e("setFiles",t),i&&l("setDirectory",i)}))},async setFiles({commit:e},t){e("unselectFiles"),e("setFiles",t)},async setCurrentEntryPoint({commit:e,dispatch:t},i){e("setCurrentEntryPoint",i),t("setSecondaryDirectoryFromFullDirectory",i.directory)},async setSecondaryDirectoryFromFullDirectory({state:e,commit:t,dispatch:i},l){let n=e.currentEntryPoint.directory;if(0!==l.indexOf(n))return void console.error("répertoire inconnu");let s=l.substring(n.length),o=[];""!==s&&(s=s.replace(/^\//,""),o=s.split("/")),t("setSecondaryDirectory",o),i("getFiles")},async init({dispatch:e,state:t}){e("setCurrentEntryPoint",t.entryPoints[0])}}})}function gt(e,t){"string"==typeof e&&(e=document.querySelector(e)),t||(t=JSON.parse(e.dataset.props));const i=C(Ye);return i.directive("body-scroll-lock",ft),i.use(yt(t)),i.mount(e),i}function vt(e,t,i){let l=document.createElement("div");function n(){a.$el.removeEventListener("selectFiles",s),a.$el.removeEventListener("abortSelect",o),r.unmount(),a.$el.remove()}function s(e){if(t){let i=[];for(let t=0;t<e.detail.length;t++)i.push(P(e.detail[t]));t(P(i))}n()}function o(e){i&&i(),n()}document.body.appendChild(l);const r=C(rt);r.directive("body-scroll-lock",ft),r.use(yt(e));const a=r.mount(l);a.$el.addEventListener("selectFiles",s),a.$el.addEventListener("abortSelect",o)}export{gt as createFileManager,vt as openFileManager};
