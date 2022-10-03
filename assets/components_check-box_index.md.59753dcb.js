import{V as f,_ as M,o as Q,c as W,a as v,w as C,b as z,d as n,e as a,r as L}from"./app.4c159084.js";const X={name:"component-doc",components:{"render-demo-0":function(){const{toDisplayString:u,createTextVNode:e,resolveComponent:E,withCtx:t,createVNode:s,openBlock:m,createElementBlock:F}=f,g=e("\u7981\u7528 check-box"),x=e("\u6539\u53D8 icon \u7684\u989C\u8272"),_=e("checkBoxChange \u4E8B\u4EF6\uFF0C \u5173\u8054\u4E0B\u65B9beforeChange\u7684\u5207\u6362\u72B6\u6001 ");function A(o,l){const r=E("k-check-box");return m(),F("div",null,[s(r,{modelValue:o.checked,"onUpdate:modelValue":l[0]||(l[0]=k=>o.checked=k)},{default:t(()=>[e(u(o.msg),1)]),_:1},8,["modelValue"]),s(r,{modelValue:o.checked2,"onUpdate:modelValue":l[1]||(l[1]=k=>o.checked2=k),label:o.label},null,8,["modelValue","label"]),s(r,{modelValue:o.checked3,"onUpdate:modelValue":l[2]||(l[2]=k=>o.checked3=k),disabled:!0},{default:t(()=>[g]),_:1},8,["modelValue"]),s(r,{modelValue:o.checked4,"onUpdate:modelValue":l[3]||(l[3]=k=>o.checked4=k),color:"RGB(255, 193, 7)"},{default:t(()=>[x]),_:1},8,["modelValue"]),s(r,{modelValue:o.checked5,"onUpdate:modelValue":l[4]||(l[4]=k=>o.checked5=k),onChange:o.checkBoxChange},{default:t(()=>[_]),_:1},8,["modelValue","onChange"]),s(r,{modelValue:o.checked6,"onUpdate:modelValue":l[5]||(l[5]=k=>o.checked6=k),beforeChange:o.checkBoxBeforeChange},{default:t(()=>[e(" beforeChange \u8FD4\u56DE "+u(o.checked5)+" "+u(o.checked5?"\u53EF\u4EE5":"\u4E0D\u80FD")+" \u5207\u6362\u72B6\u6001 ",1)]),_:1},8,["modelValue","beforeChange"])])}const{defineComponent:y,ref:d}=f,V=y({setup(){const o=d(!0),l=d(!1),r=d(!0),k=d(!0),D=d(!1),q=B=>{console.log(B)},w=d(!1);return{msg:"\u8FD9\u662F\u9ED8\u8BA4\u7684\u63D2\u69FD",label:"\u8FD9\u662F\u4F7F\u7528 label \u5C5E\u6027",checked:o,checked2:l,checked3:r,checked4:k,checked5:D,checkBoxChange:q,checked6:w,checkBoxBeforeChange:B=>D.value}}});return{render:A,...V}}(),"render-demo-1":function(){const{createElementVNode:u,createTextVNode:e,resolveComponent:E,withCtx:t,createVNode:s,toDisplayString:m,openBlock:F,createElementBlock:g}=f,x={class:"mb10"},_=u("h4",null,"\u57FA\u7840\u793A\u4F8B",-1),A=e("\u5317\u4EAC"),y=e("\u4E0A\u6D77"),d=e("\u5E7F\u5DDE"),V={class:"mb10"},o=u("h4",null,"\u7981\u7528",-1),l=e("\u5317\u4EAC"),r=e("\u4E0A\u6D77"),k=e("\u5E7F\u5DDE"),D={class:"mb10"},q=u("h4",null,"\u6A2A\u5411\u6392\u5217",-1),w=e("\u5317\u4EAC"),j=e("\u4E0A\u6D77"),B=e("\u5E7F\u5DDE"),N={class:"mb10"},U=u("h4",null,"checkBoxChange \u548C color \u989C\u8272",-1),G=e("\u5317\u4EAC"),R=e("\u4E0A\u6D77"),S=e("\u5E7F\u5DDE"),T=e("\u5317\u4EAC"),$=e("\u4E0A\u6D77"),P=e("\u5E7F\u5DDE");function J(p,i){const c=E("k-check-box"),b=E("k-check-box-group");return F(),g("div",null,[u("div",null,[u("div",x,[_,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[0]||(i[0]=h=>p.checkedList=h)},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[A]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[y]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[d]),_:1})]),_:1},8,["modelValue"])]),u("div",V,[o,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[1]||(i[1]=h=>p.checkedList=h),disabled:!0},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[l]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[r]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[k]),_:1})]),_:1},8,["modelValue"])]),u("div",D,[q,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[2]||(i[2]=h=>p.checkedList=h),direction:"row"},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[w]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[j]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[B]),_:1})]),_:1},8,["modelValue"])]),u("div",N,[U,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[3]||(i[3]=h=>p.checkedList=h),color:"RGB(255, 193, 7)",onChange:p.checkBoxChange},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[G]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[R]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[S]),_:1})]),_:1},8,["modelValue","onChange"])]),u("div",null,[u("h4",null,"beforeChange (\u9009\u4E2D\u4E0A\u6D77\u53EF\u4EE5\u5207\u6362) "+m(p.canChange?"\u53EF\u4EE5":"\u4E0D\u53EF\u4EE5")+"\u5207\u6362",1),s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[4]||(i[4]=h=>p.checkedList=h),beforeChange:p.checkBoxBeforeChange},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[T]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[$]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[P]),_:1})]),_:1},8,["modelValue","beforeChange"])])])])}const{defineComponent:O,ref:H,computed:I}=f,K=O({setup(){const p=H(["shanghai"]),i=h=>{console.log(h)},c=I(()=>p.value.includes("shanghai"));return{checkedList:p,checkBoxChange:i,canChange:c,checkBoxBeforeChange:(h,cn)=>c.value}}});return{render:J,...K}}()}},ln=JSON.parse('{"title":"CheckBox \u591A\u9009\u6846","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F55\u65F6\u4F7F\u7528","slug":"\u4F55\u65F6\u4F7F\u7528"},{"level":2,"title":"CheckBox \u57FA\u672C\u7528\u6CD5","slug":"checkbox-\u57FA\u672C\u7528\u6CD5"},{"level":2,"title":"CheckBoxGroup \u57FA\u672C\u7528\u6CD5","slug":"checkboxgroup-\u57FA\u672C\u7528\u6CD5"},{"level":2,"title":"Check-box \u53C2\u6570","slug":"check-box-\u53C2\u6570"},{"level":2,"title":"Check-box \u4E8B\u4EF6","slug":"check-box-\u4E8B\u4EF6"},{"level":2,"title":"Check-box \u63D2\u69FD","slug":"check-box-\u63D2\u69FD"},{"level":2,"title":"Check-box-group \u53C2\u6570","slug":"check-box-group-\u53C2\u6570"},{"level":2,"title":"Check-box-group \u4E8B\u4EF6","slug":"check-box-group-\u4E8B\u4EF6"},{"level":2,"title":"Check-box-group \u63D2\u69FD","slug":"check-box-group-\u63D2\u69FD"}],"relativePath":"components/check-box/index.md","lastUpdated":1664793709000}');const Y=z('<h1 id="checkbox-\u591A\u9009\u6846" tabindex="-1">CheckBox \u591A\u9009\u6846 <a class="header-anchor" href="#checkbox-\u591A\u9009\u6846" aria-hidden="true">#</a></h1><ul><li>\u4E00\u7EC4\u5907\u9009\u9879\u4E2D\u8FDB\u884C\u591A\u9009</li></ul><h2 id="\u4F55\u65F6\u4F7F\u7528" tabindex="-1">\u4F55\u65F6\u4F7F\u7528 <a class="header-anchor" href="#\u4F55\u65F6\u4F7F\u7528" aria-hidden="true">#</a></h2><ul><li>\u5728\u4E00\u7EC4\u9009\u9879\u4E2D\u8FDB\u884C\u591A\u9879\u9009\u62E9\uFF1B</li><li>\u5355\u72EC\u4F7F\u7528\u53EF\u4EE5\u8868\u793A\u4E24\u79CD\u72B6\u6001\u4E4B\u95F4\u7684\u5207\u6362\uFF0C\u5199\u5728\u6807\u7B7E\u4E2D\u7684\u5185\u5BB9\u4E3A checkbox \u6309\u94AE\u540E\u7684\u4ECB\u7ECD\u3002</li></ul><h2 id="checkbox-\u57FA\u672C\u7528\u6CD5" tabindex="-1">CheckBox \u57FA\u672C\u7528\u6CD5 <a class="header-anchor" href="#checkbox-\u57FA\u672C\u7528\u6CD5" aria-hidden="true">#</a></h2>',5),Z=n("div",null,"CheckBox\u793A\u4F8B",-1),nn=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("{{ msg }}"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked2"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("label"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked3"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":disabled"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("true"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u7981\u7528 check-box"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked4"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("RGB(255, 193, 7)"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u6539\u53D8 icon \u7684\u989C\u8272"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`

  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked5"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`checkBoxChange \u4E8B\u4EF6\uFF0C \u5173\u8054\u4E0B\u65B9beforeChange\u7684\u5207\u6362\u72B6\u6001
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked6"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":beforeChange"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxBeforeChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
    beforeChange \u8FD4\u56DE {{checked5}} {{checked5 ? '\u53EF\u4EE5' : '\u4E0D\u80FD'}} \u5207\u6362\u72B6\u6001
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[a(`
`),n("span",{class:"token keyword"},"import"),a(),n("span",{class:"token punctuation"},"{"),a("defineComponent"),n("span",{class:"token punctuation"},","),a(" ref"),n("span",{class:"token punctuation"},"}"),a(),n("span",{class:"token keyword"},"from"),a(),n("span",{class:"token string"},"'vue'"),a(`

`),n("span",{class:"token keyword"},"export"),a(),n("span",{class:"token keyword"},"default"),a(),n("span",{class:"token function"},"defineComponent"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token punctuation"},"{"),a(`
    `),n("span",{class:"token keyword"},"const"),a(" checked "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token keyword"},"const"),a(" checked2 "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token keyword"},"const"),a(" checked3 "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token keyword"},"const"),a(" checked4 "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"true"),n("span",{class:"token punctuation"},")"),a(`

    `),n("span",{class:"token keyword"},"const"),a(" checked5 "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"checkBoxChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),a("val"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`

    `),n("span",{class:"token keyword"},"const"),a(" checked6 "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"checkBoxBeforeChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      `),n("span",{class:"token keyword"},"return"),a(" checked5"),n("span",{class:"token punctuation"},"."),a(`value
    `),n("span",{class:"token punctuation"},"}"),a(`

    `),n("span",{class:"token keyword"},"return"),a(),n("span",{class:"token punctuation"},"{"),a(`
      `),n("span",{class:"token literal-property property"},"msg"),n("span",{class:"token operator"},":"),a(),n("span",{class:"token string"},"'\u8FD9\u662F\u9ED8\u8BA4\u7684\u63D2\u69FD'"),n("span",{class:"token punctuation"},","),a(`
      `),n("span",{class:"token literal-property property"},"label"),n("span",{class:"token operator"},":"),a(),n("span",{class:"token string"},"'\u8FD9\u662F\u4F7F\u7528 label \u5C5E\u6027'"),n("span",{class:"token punctuation"},","),a(`
      checked`),n("span",{class:"token punctuation"},","),a(`
      checked2`),n("span",{class:"token punctuation"},","),a(`
      checked3`),n("span",{class:"token punctuation"},","),a(`
      checked4`),n("span",{class:"token punctuation"},","),a(`
      checked5`),n("span",{class:"token punctuation"},","),a(`
      checkBoxChange`),n("span",{class:"token punctuation"},","),a(`
      checked6`),n("span",{class:"token punctuation"},","),a(`
      checkBoxBeforeChange`),n("span",{class:"token punctuation"},","),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`
  `),n("span",{class:"token punctuation"},"}"),a(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("script")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("style")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},`

`)]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),an=n("h2",{id:"checkboxgroup-\u57FA\u672C\u7528\u6CD5",tabindex:"-1"},[a("CheckBoxGroup \u57FA\u672C\u7528\u6CD5 "),n("a",{class:"header-anchor",href:"#checkboxgroup-\u57FA\u672C\u7528\u6CD5","aria-hidden":"true"},"#")],-1),sn=n("div",null,"CheckBoxGroup \u793A\u4F8B",-1),tn=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mb10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("\u57FA\u7840\u793A\u4F8B"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mb10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("\u7981\u7528"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":disabled"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("true"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mb10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("\u6A2A\u5411\u6392\u5217"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"direction"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("row"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mb10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("checkBoxChange \u548C color \u989C\u8272"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("RGB(255, 193, 7)"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("beforeChange (\u9009\u4E2D\u4E0A\u6D77\u53EF\u4EE5\u5207\u6362) {{canChange ? '\u53EF\u4EE5' : '\u4E0D\u53EF\u4EE5'}}\u5207\u6362"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":beforeChange"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxBeforeChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[a(`
`),n("span",{class:"token keyword"},"import"),a(),n("span",{class:"token punctuation"},"{"),a("defineComponent"),n("span",{class:"token punctuation"},","),a(" ref"),n("span",{class:"token punctuation"},","),a(" computed"),n("span",{class:"token punctuation"},"}"),a(),n("span",{class:"token keyword"},"from"),a(),n("span",{class:"token string"},"'vue'"),a(`

`),n("span",{class:"token keyword"},"export"),a(),n("span",{class:"token keyword"},"default"),a(),n("span",{class:"token function"},"defineComponent"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token punctuation"},"{"),a(`
    `),n("span",{class:"token keyword"},"const"),a(" checkedList "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"["),n("span",{class:"token string"},"'shanghai'"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},")"),a(`

    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"checkBoxChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),a("val"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`

    `),n("span",{class:"token keyword"},"const"),a(" canChange "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"computed"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      `),n("span",{class:"token keyword"},"return"),a(" checkedList"),n("span",{class:"token punctuation"},"."),a("value"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"includes"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'shanghai'"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),a(`

    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"checkBoxBeforeChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},[a("isChecked"),n("span",{class:"token punctuation"},","),a(" value")]),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      `),n("span",{class:"token keyword"},"return"),a(" canChange"),n("span",{class:"token punctuation"},"."),a(`value
    `),n("span",{class:"token punctuation"},"}"),a(`

    `),n("span",{class:"token keyword"},"return"),a(),n("span",{class:"token punctuation"},"{"),a(`
      checkedList`),n("span",{class:"token punctuation"},","),a(`
      checkBoxChange`),n("span",{class:"token punctuation"},","),a(`
      canChange`),n("span",{class:"token punctuation"},","),a(`
      checkBoxBeforeChange
    `),n("span",{class:"token punctuation"},"}"),a(`
  `),n("span",{class:"token punctuation"},"}"),a(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("script")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("style")]),a(),n("span",{class:"token attr-name"},"scoped"),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},[a(`
`),n("span",{class:"token selector"},".mb10"),a(),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token property"},"margin-bottom"),n("span",{class:"token punctuation"},":"),a(" 10px"),n("span",{class:"token punctuation"},";"),a(`
`),n("span",{class:"token punctuation"},"}"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),en=z('<h2 id="check-box-\u53C2\u6570" tabindex="-1">Check-box \u53C2\u6570 <a class="header-anchor" href="#check-box-\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>model-value / v-model</td><td>boolean</td><td>--</td><td>\u5FC5\u9009\uFF0C\u9009\u4E2D\u9879\u7ED1\u5B9A\u503C</td></tr><tr><td>disabled</td><td>boolean</td><td>false</td><td>\u53EF\u9009\uFF0C\u662F\u5426\u7981\u7528</td></tr><tr><td>label</td><td>string / number / boolean / object</td><td>--</td><td>\u5355\u72EC\u4F7F\u7528 check-box \u4E14\u65E0\u9ED8\u8BA4\u63D2\u69FD\u65F6\u5F53\u4F5Cinfo\u5C55\u793A\uFF0C\u5B58\u5728\u63D2\u69FD\u5E2E\u5B9A\u5236\u65E0\u6548\uFF0C\u7ED3\u5408 check-box-group\u4F7F\u7528\u65F6\u4F5C\u4E3A\u9009\u4E2D\u9879\u7684\u503C\u3002</td></tr><tr><td>color</td><td>string</td><td>--</td><td>\u53EF\u9009\uFF0C\u590D\u9009\u6846\u989C\u8272</td></tr><tr><td>beforeChange</td><td><code>Function / Promise&lt;boolean&gt;</code></td><td>--</td><td>\u53EF\u9009\uFF0Ccheckbox \u5207\u6362\u524D\u7684\u56DE\u8C03\u51FD\u6570\uFF0C\u8FD4\u56DE boolean \u7C7B\u578B\uFF0C\u8FD4\u56DE false \u53EF\u4EE5\u963B\u6B62 checkbox \u5207\u6362</td></tr></tbody></table><h2 id="check-box-\u4E8B\u4EF6" tabindex="-1">Check-box \u4E8B\u4EF6 <a class="header-anchor" href="#check-box-\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u4E8B\u4EF6</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>change</td><td>Function</td><td>\u590D\u9009\u6846\u7684\u503C\u6539\u53D8\u65F6\u53D1\u51FA\u7684\u4E8B\u4EF6\uFF0C\u503C\u662F\u5F53\u524D\u72B6\u6001</td></tr></tbody></table><h2 id="check-box-\u63D2\u69FD" tabindex="-1">Check-box \u63D2\u69FD <a class="header-anchor" href="#check-box-\u63D2\u69FD" aria-hidden="true">#</a></h2><p>\u9ED8\u8BA4\u63D2\u69FD</p><h2 id="check-box-group-\u53C2\u6570" tabindex="-1">Check-box-group \u53C2\u6570 <a class="header-anchor" href="#check-box-group-\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>model-value / v-model</td><td>boolean</td><td>--</td><td>\u5FC5\u9009\uFF0C\u9009\u4E2D\u9879\u7ED1\u5B9A\u503C</td></tr><tr><td>disabled</td><td>boolean</td><td>false</td><td>\u53EF\u9009\uFF0C\u662F\u5426\u7981\u7528</td></tr><tr><td>color</td><td>string</td><td>--</td><td>\u53EF\u9009\uFF0C\u590D\u9009\u6846\u989C\u8272</td></tr><tr><td>direction</td><td>&#39;row&#39;/&#39;column&#39;</td><td>&#39;column&#39;</td><td>\u53EF\u9009\uFF0C\u8BBE\u7F6E\u6A2A\u5411\u6216\u7EB5\u5411\u6392\u5217</td></tr><tr><td>beforeChange</td><td><code>Function / Promise&lt;boolean&gt;</code></td><td>--</td><td>\u53EF\u9009\uFF0Ccheckbox \u5207\u6362\u524D\u7684\u56DE\u8C03\u51FD\u6570\uFF0C\u8FD4\u56DE boolean \u7C7B\u578B\uFF0C\u8FD4\u56DE false \u53EF\u4EE5\u963B\u6B62 checkbox \u5207\u6362</td></tr></tbody></table><h2 id="check-box-group-\u4E8B\u4EF6" tabindex="-1">Check-box-group \u4E8B\u4EF6 <a class="header-anchor" href="#check-box-group-\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u4E8B\u4EF6</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>change</td><td>Function</td><td>\u590D\u9009\u6846\u7684\u503C\u6539\u53D8\u65F6\u53D1\u51FA\u7684\u4E8B\u4EF6\uFF0C\u503C\u662F\u5F53\u524D\u72B6\u6001</td></tr></tbody></table><h2 id="check-box-group-\u63D2\u69FD" tabindex="-1">Check-box-group \u63D2\u69FD <a class="header-anchor" href="#check-box-group-\u63D2\u69FD" aria-hidden="true">#</a></h2><p>\u9ED8\u8BA4\u63D2\u69FD</p>',12);function on(u,e,E,t,s,m){const F=L("render-demo-0"),g=L("demo"),x=L("render-demo-1");return Q(),W("div",null,[Y,v(g,{sourceCode:`
<template>
  <k-check-box v-model='checked'>{{ msg }}</k-check-box>
  <k-check-box v-model='checked2' :label='label'></k-check-box>
  <k-check-box v-model='checked3' :disabled='true'>\u7981\u7528 check-box</k-check-box>
  <k-check-box v-model='checked4' color='RGB(255, 193, 7)'>\u6539\u53D8 icon \u7684\u989C\u8272</k-check-box>

  <k-check-box v-model='checked5' @change='checkBoxChange'>checkBoxChange \u4E8B\u4EF6\uFF0C \u5173\u8054\u4E0B\u65B9beforeChange\u7684\u5207\u6362\u72B6\u6001
  </k-check-box>
  <k-check-box v-model='checked6' :beforeChange='checkBoxBeforeChange'>
    beforeChange \u8FD4\u56DE {{checked5}} {{checked5 ? '\u53EF\u4EE5' : '\u4E0D\u80FD'}} \u5207\u6362\u72B6\u6001
  </k-check-box>

</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  setup() {
    const checked = ref(true)
    const checked2 = ref(false)
    const checked3 = ref(true)
    const checked4 = ref(true)

    const checked5 = ref(false)
    const checkBoxChange = (val) => {
      console.log(val)
    }

    const checked6 = ref(false)
    const checkBoxBeforeChange = (val) => {
      return checked5.value
    }

    return {
      msg: '\u8FD9\u662F\u9ED8\u8BA4\u7684\u63D2\u69FD',
      label: '\u8FD9\u662F\u4F7F\u7528 label \u5C5E\u6027',
      checked,
      checked2,
      checked3,
      checked4,
      checked5,
      checkBoxChange,
      checked6,
      checkBoxBeforeChange,
    }
  }
})
<\/script>

<style>

</style>
`},{description:C(()=>[Z]),highlight:C(()=>[nn]),default:C(()=>[v(F)]),_:1}),an,v(g,{sourceCode:`
<template>
  <div>
    <div class="mb10">
      <h4>\u57FA\u7840\u793A\u4F8B</h4>
      <k-check-box-group v-model='checkedList'>
        <k-check-box label='beijing'>\u5317\u4EAC</k-check-box>
        <k-check-box label='shanghai'>\u4E0A\u6D77</k-check-box>
        <k-check-box label='guangzhou'>\u5E7F\u5DDE</k-check-box>
      </k-check-box-group>
    </div>

    <div class="mb10">
      <h4>\u7981\u7528</h4>
      <k-check-box-group v-model='checkedList' :disabled='true'>
        <k-check-box label='beijing'>\u5317\u4EAC</k-check-box>
        <k-check-box label='shanghai'>\u4E0A\u6D77</k-check-box>
        <k-check-box label='guangzhou'>\u5E7F\u5DDE</k-check-box>
      </k-check-box-group>
    </div>

    <div class="mb10">
      <h4>\u6A2A\u5411\u6392\u5217</h4>
      <k-check-box-group v-model='checkedList' direction='row'>
        <k-check-box label='beijing'>\u5317\u4EAC</k-check-box>
        <k-check-box label='shanghai'>\u4E0A\u6D77</k-check-box>
        <k-check-box label='guangzhou'>\u5E7F\u5DDE</k-check-box>
      </k-check-box-group>
    </div>

    <div class="mb10">
      <h4>checkBoxChange \u548C color \u989C\u8272</h4>
      <k-check-box-group v-model='checkedList' color='RGB(255, 193, 7)' @change='checkBoxChange'>
        <k-check-box label='beijing'>\u5317\u4EAC</k-check-box>
        <k-check-box label='shanghai'>\u4E0A\u6D77</k-check-box>
        <k-check-box label='guangzhou'>\u5E7F\u5DDE</k-check-box>
      </k-check-box-group>
    </div>

    <div>
      <h4>beforeChange (\u9009\u4E2D\u4E0A\u6D77\u53EF\u4EE5\u5207\u6362) {{canChange ? '\u53EF\u4EE5' : '\u4E0D\u53EF\u4EE5'}}\u5207\u6362</h4>
      <k-check-box-group v-model='checkedList' :beforeChange='checkBoxBeforeChange'>
        <k-check-box label='beijing'>\u5317\u4EAC</k-check-box>
        <k-check-box label='shanghai'>\u4E0A\u6D77</k-check-box>
        <k-check-box label='guangzhou'>\u5E7F\u5DDE</k-check-box>
      </k-check-box-group>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed} from 'vue'

export default defineComponent({
  setup() {
    const checkedList = ref(['shanghai'])

    const checkBoxChange = (val) => {
      console.log(val)
    }

    const canChange = computed(() => {
      return checkedList.value.includes('shanghai')
    })

    const checkBoxBeforeChange = (isChecked, value) => {
      return canChange.value
    }

    return {
      checkedList,
      checkBoxChange,
      canChange,
      checkBoxBeforeChange
    }
  }
})
<\/script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>
`},{description:C(()=>[sn]),highlight:C(()=>[tn]),default:C(()=>[v(x)]),_:1}),en])}const pn=M(X,[["render",on]]);export{ln as __pageData,pn as default};
