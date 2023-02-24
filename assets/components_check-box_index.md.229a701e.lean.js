import{V as f,_ as M,o as Q,c as W,a as v,w as C,b as j,d as n,e as a,r as L}from"./app.60a7c56f.js";const X={name:"component-doc",components:{"render-demo-0":function(){const{toDisplayString:u,createTextVNode:e,resolveComponent:F,withCtx:t,createVNode:s,openBlock:B,createElementBlock:D}=f,g=e("\u7981\u7528 check-box"),E=e("\u6539\u53D8 icon \u7684\u989C\u8272"),A=e("checkBoxChange \u4E8B\u4EF6\uFF0C \u5173\u8054\u4E0B\u65B9beforeChange\u7684\u5207\u6362\u72B6\u6001 ");function y(o,l){const h=F("c-check-box");return B(),D("div",null,[s(h,{modelValue:o.checked,"onUpdate:modelValue":l[0]||(l[0]=k=>o.checked=k)},{default:t(()=>[e(u(o.msg),1)]),_:1},8,["modelValue"]),s(h,{modelValue:o.checked2,"onUpdate:modelValue":l[1]||(l[1]=k=>o.checked2=k),label:o.label},null,8,["modelValue","label"]),s(h,{modelValue:o.checked3,"onUpdate:modelValue":l[2]||(l[2]=k=>o.checked3=k),disabled:!0},{default:t(()=>[g]),_:1},8,["modelValue"]),s(h,{modelValue:o.checked4,"onUpdate:modelValue":l[3]||(l[3]=k=>o.checked4=k),color:"RGB(255, 193, 7)"},{default:t(()=>[E]),_:1},8,["modelValue"]),s(h,{modelValue:o.checked5,"onUpdate:modelValue":l[4]||(l[4]=k=>o.checked5=k),onChange:o.checkBoxChange},{default:t(()=>[A]),_:1},8,["modelValue","onChange"]),s(h,{modelValue:o.checked6,"onUpdate:modelValue":l[5]||(l[5]=k=>o.checked6=k),beforeChange:o.checkBoxBeforeChange},{default:t(()=>[e(" beforeChange \u8FD4\u56DE "+u(o.checked5)+" "+u(o.checked5?"\u53EF\u4EE5":"\u4E0D\u80FD")+" \u5207\u6362\u72B6\u6001 ",1)]),_:1},8,["modelValue","beforeChange"])])}const{defineComponent:_,ref:d}=f,V=_({setup(){const o=d(!0),l=d(!1),h=d(!0),k=d(!0),x=d(!1),q=m=>{console.log(m)},w=d(!1);return{msg:"\u8FD9\u662F\u9ED8\u8BA4\u7684\u63D2\u69FD",label:"\u8FD9\u662F\u4F7F\u7528 label \u5C5E\u6027",checked:o,checked2:l,checked3:h,checked4:k,checked5:x,checkBoxChange:q,checked6:w,checkBoxBeforeChange:m=>x.value}}});return{render:y,...V}}(),"render-demo-1":function(){const{createElementVNode:u,createTextVNode:e,resolveComponent:F,withCtx:t,createVNode:s,toDisplayString:B,openBlock:D,createElementBlock:g}=f,E=u("h4",null,"\u57FA\u7840\u793A\u4F8B",-1),A=e("\u5317\u4EAC"),y=e("\u4E0A\u6D77"),_=e("\u5E7F\u5DDE"),d={class:"mt10"},V=u("h4",null,"\u7981\u7528",-1),o=e("\u5317\u4EAC"),l=e("\u4E0A\u6D77"),h=e("\u5E7F\u5DDE"),k={class:"mt10"},x=u("h4",null,"\u6A2A\u5411\u6392\u5217",-1),q=e("\u5317\u4EAC"),w=e("\u4E0A\u6D77"),T=e("\u5E7F\u5DDE"),m={class:"mt10"},G=u("h4",null,"checkBoxChange \u548C color \u989C\u8272",-1),z=e("\u5317\u4EAC"),N=e("\u4E0A\u6D77"),U=e("\u5E7F\u5DDE"),R={class:"mt10"},S=e("\u5317\u4EAC"),$=e("\u4E0A\u6D77"),P=e("\u5E7F\u5DDE");function J(p,i){const c=F("c-check-box"),b=F("c-check-box-group");return D(),g("div",null,[u("div",null,[u("div",null,[E,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[0]||(i[0]=r=>p.checkedList=r)},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[A]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[y]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[_]),_:1})]),_:1},8,["modelValue"])]),u("div",d,[V,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[1]||(i[1]=r=>p.checkedList=r),disabled:!0},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[o]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[l]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[h]),_:1})]),_:1},8,["modelValue"])]),u("div",k,[x,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[2]||(i[2]=r=>p.checkedList=r),direction:"row"},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[q]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[w]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[T]),_:1})]),_:1},8,["modelValue"])]),u("div",m,[G,s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[3]||(i[3]=r=>p.checkedList=r),color:"RGB(255, 193, 7)",onChange:p.checkBoxChange},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[z]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[N]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[U]),_:1})]),_:1},8,["modelValue","onChange"])]),u("div",R,[u("h4",null,"beforeChange (\u9009\u4E2D\u4E0A\u6D77\u53EF\u4EE5\u5207\u6362) "+B(p.canChange?"\u53EF\u4EE5":"\u4E0D\u53EF\u4EE5")+"\u5207\u6362",1),s(b,{modelValue:p.checkedList,"onUpdate:modelValue":i[4]||(i[4]=r=>p.checkedList=r),beforeChange:p.checkBoxBeforeChange},{default:t(()=>[s(c,{label:"beijing"},{default:t(()=>[S]),_:1}),s(c,{label:"shanghai"},{default:t(()=>[$]),_:1}),s(c,{label:"guangzhou"},{default:t(()=>[P]),_:1})]),_:1},8,["modelValue","beforeChange"])])])])}const{defineComponent:O,ref:H,computed:I}=f,K=O({setup(){const p=H(["shanghai"]),i=r=>{console.log(r)},c=I(()=>p.value.includes("shanghai"));return{checkedList:p,checkBoxChange:i,canChange:c,checkBoxBeforeChange:(r,cn)=>c.value}}});return{render:J,...K}}()}},ln=JSON.parse('{"title":"CheckBox \u591A\u9009\u6846","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F55\u65F6\u4F7F\u7528","slug":"\u4F55\u65F6\u4F7F\u7528"},{"level":2,"title":"CheckBox\u57FA\u672C\u7528\u6CD5","slug":"checkbox\u57FA\u672C\u7528\u6CD5"},{"level":2,"title":"CheckBoxGroup\u57FA\u672C\u7528\u6CD5","slug":"checkboxgroup\u57FA\u672C\u7528\u6CD5"},{"level":2,"title":"CheckBox\u53C2\u6570","slug":"checkbox\u53C2\u6570"},{"level":2,"title":"CheckBox\u4E8B\u4EF6","slug":"checkbox\u4E8B\u4EF6"},{"level":2,"title":"CheckBox\u7C7B\u578B\u5B9A\u4E49","slug":"checkbox\u7C7B\u578B\u5B9A\u4E49"},{"level":3,"title":"LabelType","slug":"labeltype"},{"level":3,"title":"BeforeChangeType","slug":"beforechangetype"},{"level":2,"title":"CheckBox\u63D2\u69FD","slug":"checkbox\u63D2\u69FD"},{"level":2,"title":"CheckBoxGroup\u53C2\u6570","slug":"checkboxgroup\u53C2\u6570"},{"level":2,"title":"CheckBoxGroup\u7C7B\u578B\u5B9A\u4E49","slug":"checkboxgroup\u7C7B\u578B\u5B9A\u4E49"},{"level":3,"title":"DirectionType","slug":"directiontype"},{"level":2,"title":"CheckBoxGroup\u4E8B\u4EF6","slug":"checkboxgroup\u4E8B\u4EF6"},{"level":2,"title":"CheckBoxGroup\u63D2\u69FD","slug":"checkboxgroup\u63D2\u69FD"}],"relativePath":"components/check-box/index.md","lastUpdated":1677203044000}');const Y=j('<h1 id="checkbox-\u591A\u9009\u6846" tabindex="-1">CheckBox \u591A\u9009\u6846 <a class="header-anchor" href="#checkbox-\u591A\u9009\u6846" aria-hidden="true">#</a></h1><ul><li>\u4E00\u7EC4\u5907\u9009\u9879\u4E2D\u8FDB\u884C\u591A\u9009</li></ul><h2 id="\u4F55\u65F6\u4F7F\u7528" tabindex="-1">\u4F55\u65F6\u4F7F\u7528 <a class="header-anchor" href="#\u4F55\u65F6\u4F7F\u7528" aria-hidden="true">#</a></h2><ul><li>\u5728\u4E00\u7EC4\u9009\u9879\u4E2D\u8FDB\u884C\u591A\u9879\u9009\u62E9\uFF1B</li><li>\u5355\u72EC\u4F7F\u7528\u53EF\u4EE5\u8868\u793A\u4E24\u79CD\u72B6\u6001\u4E4B\u95F4\u7684\u5207\u6362\uFF0C\u5199\u5728\u6807\u7B7E\u4E2D\u7684\u5185\u5BB9\u4E3A checkbox \u6309\u94AE\u540E\u7684\u4ECB\u7ECD\u3002</li></ul><h2 id="checkbox\u57FA\u672C\u7528\u6CD5" tabindex="-1">CheckBox\u57FA\u672C\u7528\u6CD5 <a class="header-anchor" href="#checkbox\u57FA\u672C\u7528\u6CD5" aria-hidden="true">#</a></h2>',5),Z=n("div",null,"CheckBox\u793A\u4F8B",-1),nn=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("{{ msg }}"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked2"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("label"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked3"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":disabled"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("true"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u7981\u7528 check-box"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked4"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("RGB(255, 193, 7)"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u6539\u53D8 icon \u7684\u989C\u8272"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`

  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked5"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`checkBoxChange \u4E8B\u4EF6\uFF0C \u5173\u8054\u4E0B\u65B9beforeChange\u7684\u5207\u6362\u72B6\u6001
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checked6"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":beforeChange"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxBeforeChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
    beforeChange \u8FD4\u56DE {{checked5}} {{checked5 ? '\u53EF\u4EE5' : '\u4E0D\u80FD'}} \u5207\u6362\u72B6\u6001
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`

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
`)])])],-1),an=n("h2",{id:"checkboxgroup\u57FA\u672C\u7528\u6CD5",tabindex:"-1"},[a("CheckBoxGroup\u57FA\u672C\u7528\u6CD5 "),n("a",{class:"header-anchor",href:"#checkboxgroup\u57FA\u672C\u7528\u6CD5","aria-hidden":"true"},"#")],-1),sn=n("div",null,"CheckBoxGroup \u793A\u4F8B",-1),tn=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("\u57FA\u7840\u793A\u4F8B"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mt10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("\u7981\u7528"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":disabled"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("true"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mt10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("\u6A2A\u5411\u6392\u5217"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"direction"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("row"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mt10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("checkBoxChange \u548C color \u989C\u8272"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("RGB(255, 193, 7)"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`

    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("mt10"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("h4")]),n("span",{class:"token punctuation"},">")]),a("beforeChange (\u9009\u4E2D\u4E0A\u6D77\u53EF\u4EE5\u5207\u6362) {{canChange ? '\u53EF\u4EE5' : '\u4E0D\u53EF\u4EE5'}}\u5207\u6362"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("h4")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box-group")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkedList"),n("span",{class:"token punctuation"},"'")]),a(),n("span",{class:"token attr-name"},":beforeChange"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("checkBoxBeforeChange"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("beijing"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5317\u4EAC"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("shanghai"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u4E0A\u6D77"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-check-box")]),a(),n("span",{class:"token attr-name"},"label"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},"'"),a("guangzhou"),n("span",{class:"token punctuation"},"'")]),n("span",{class:"token punctuation"},">")]),a("\u5E7F\u5DDE"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-check-box-group")]),n("span",{class:"token punctuation"},">")]),a(`
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
`),n("span",{class:"token selector"},".mt10"),a(),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token property"},"margin-top"),n("span",{class:"token punctuation"},":"),a(" 10px"),n("span",{class:"token punctuation"},";"),a(`
`),n("span",{class:"token punctuation"},"}"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),en=j(`<h2 id="checkbox\u53C2\u6570" tabindex="-1">CheckBox\u53C2\u6570 <a class="header-anchor" href="#checkbox\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>v-model</td><td>boolean</td><td>--</td><td>\u5FC5\u9009\uFF0C\u9009\u4E2D\u9879\u7ED1\u5B9A\u503C</td></tr><tr><td>disabled</td><td>boolean</td><td>false</td><td>\u53EF\u9009\uFF0C\u662F\u5426\u7981\u7528</td></tr><tr><td>label</td><td><a href="#labeltype">LabelType</a></td><td>--</td><td>\u5355\u72EC\u4F7F\u7528 check-box \u4E14\u65E0\u9ED8\u8BA4\u63D2\u69FD\u65F6\u5F53\u4F5Cinfo\u5C55\u793A\uFF0C\u5B58\u5728\u63D2\u69FD\u5E2E\u5B9A\u5236\u65E0\u6548\uFF0C\u7ED3\u5408 check-box-group\u4F7F\u7528\u65F6\u4F5C\u4E3A\u9009\u4E2D\u9879\u7684\u503C\u3002</td></tr><tr><td>color</td><td>string</td><td>--</td><td>\u53EF\u9009\uFF0C\u590D\u9009\u6846\u989C\u8272</td></tr><tr><td>beforeChange</td><td><a href="#beforechangetype">BeforeChangeType</a></td><td>--</td><td>\u53EF\u9009\uFF0Ccheckbox \u5207\u6362\u524D\u7684\u56DE\u8C03\u51FD\u6570\uFF0C\u8FD4\u56DE boolean \u7C7B\u578B\uFF0C\u8FD4\u56DE false \u53EF\u4EE5\u963B\u6B62 checkbox \u5207\u6362</td></tr></tbody></table><h2 id="checkbox\u4E8B\u4EF6" tabindex="-1">CheckBox\u4E8B\u4EF6 <a class="header-anchor" href="#checkbox\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u4E8B\u4EF6</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>change</td><td>Function</td><td>\u590D\u9009\u6846\u7684\u503C\u6539\u53D8\u65F6\u53D1\u51FA\u7684\u4E8B\u4EF6\uFF0C\u503C\u662F\u5F53\u524D\u72B6\u6001</td></tr></tbody></table><h2 id="checkbox\u7C7B\u578B\u5B9A\u4E49" tabindex="-1">CheckBox\u7C7B\u578B\u5B9A\u4E49 <a class="header-anchor" href="#checkbox\u7C7B\u578B\u5B9A\u4E49" aria-hidden="true">#</a></h2><h3 id="labeltype" tabindex="-1">LabelType <a class="header-anchor" href="#labeltype" aria-hidden="true">#</a></h3><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">LabelType</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><h3 id="beforechangetype" tabindex="-1">BeforeChangeType <a class="header-anchor" href="#beforechangetype" aria-hidden="true">#</a></h3><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BeforeChangeType</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> (</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#A6ACCD;">isChecked</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#A6ACCD;">v</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#A6ACCD;">) </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">boolean</span><span style="color:#89DDFF;">&gt;;</span></span>
<span class="line"></span></code></pre></div><h2 id="checkbox\u63D2\u69FD" tabindex="-1">CheckBox\u63D2\u69FD <a class="header-anchor" href="#checkbox\u63D2\u69FD" aria-hidden="true">#</a></h2><p>\u9ED8\u8BA4\u63D2\u69FD</p><h2 id="checkboxgroup\u53C2\u6570" tabindex="-1">CheckBoxGroup\u53C2\u6570 <a class="header-anchor" href="#checkboxgroup\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>v-model</td><td>Array</td><td>[]</td><td>\u5FC5\u9009\uFF0C\u9009\u4E2D\u9879\u7ED1\u5B9A\u503C</td></tr><tr><td>disabled</td><td>boolean</td><td>false</td><td>\u53EF\u9009\uFF0C\u662F\u5426\u7981\u7528</td></tr><tr><td>color</td><td>string</td><td>--</td><td>\u53EF\u9009\uFF0C\u590D\u9009\u6846\u989C\u8272</td></tr><tr><td>direction</td><td><a href="#directiontype">DirectionType</a></td><td>&#39;column&#39;</td><td>\u53EF\u9009\uFF0C\u8BBE\u7F6E\u6A2A\u5411\u6216\u7EB5\u5411\u6392\u5217</td></tr><tr><td>beforeChange</td><td><a href="#beforechangetype">BeforeChangeType</a></td><td>--</td><td>\u53EF\u9009\uFF0Ccheckbox \u5207\u6362\u524D\u7684\u56DE\u8C03\u51FD\u6570\uFF0C\u8FD4\u56DE boolean \u7C7B\u578B\uFF0C\u8FD4\u56DE false \u53EF\u4EE5\u963B\u6B62 checkbox \u5207\u6362</td></tr></tbody></table><h2 id="checkboxgroup\u7C7B\u578B\u5B9A\u4E49" tabindex="-1">CheckBoxGroup\u7C7B\u578B\u5B9A\u4E49 <a class="header-anchor" href="#checkboxgroup\u7C7B\u578B\u5B9A\u4E49" aria-hidden="true">#</a></h2><h3 id="directiontype" tabindex="-1">DirectionType <a class="header-anchor" href="#directiontype" aria-hidden="true">#</a></h3><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">DirectionType</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">row</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">column</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="checkboxgroup\u4E8B\u4EF6" tabindex="-1">CheckBoxGroup\u4E8B\u4EF6 <a class="header-anchor" href="#checkboxgroup\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u4E8B\u4EF6</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>change</td><td>Function</td><td>\u590D\u9009\u6846\u7684\u503C\u6539\u53D8\u65F6\u53D1\u51FA\u7684\u4E8B\u4EF6\uFF0C\u503C\u662F\u5F53\u524D\u72B6\u6001</td></tr></tbody></table><h2 id="checkboxgroup\u63D2\u69FD" tabindex="-1">CheckBoxGroup\u63D2\u69FD <a class="header-anchor" href="#checkboxgroup\u63D2\u69FD" aria-hidden="true">#</a></h2><p>\u9ED8\u8BA4\u63D2\u69FD</p>`,20);function on(u,e,F,t,s,B){const D=L("render-demo-0"),g=L("demo"),E=L("render-demo-1");return Q(),W("div",null,[Y,v(g,{sourceCode:`
<template>
  <c-check-box v-model='checked'>{{ msg }}</c-check-box>
  <c-check-box v-model='checked2' :label='label'></c-check-box>
  <c-check-box v-model='checked3' :disabled='true'>\u7981\u7528 check-box</c-check-box>
  <c-check-box v-model='checked4' color='RGB(255, 193, 7)'>\u6539\u53D8 icon \u7684\u989C\u8272</c-check-box>

  <c-check-box v-model='checked5' @change='checkBoxChange'>checkBoxChange \u4E8B\u4EF6\uFF0C \u5173\u8054\u4E0B\u65B9beforeChange\u7684\u5207\u6362\u72B6\u6001
  </c-check-box>
  <c-check-box v-model='checked6' :beforeChange='checkBoxBeforeChange'>
    beforeChange \u8FD4\u56DE {{checked5}} {{checked5 ? '\u53EF\u4EE5' : '\u4E0D\u80FD'}} \u5207\u6362\u72B6\u6001
  </c-check-box>

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
`},{description:C(()=>[Z]),highlight:C(()=>[nn]),default:C(()=>[v(D)]),_:1}),an,v(g,{sourceCode:`
<template>
  <div>
    <div>
      <h4>\u57FA\u7840\u793A\u4F8B</h4>
      <c-check-box-group v-model='checkedList'>
        <c-check-box label='beijing'>\u5317\u4EAC</c-check-box>
        <c-check-box label='shanghai'>\u4E0A\u6D77</c-check-box>
        <c-check-box label='guangzhou'>\u5E7F\u5DDE</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>\u7981\u7528</h4>
      <c-check-box-group v-model='checkedList' :disabled='true'>
        <c-check-box label='beijing'>\u5317\u4EAC</c-check-box>
        <c-check-box label='shanghai'>\u4E0A\u6D77</c-check-box>
        <c-check-box label='guangzhou'>\u5E7F\u5DDE</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>\u6A2A\u5411\u6392\u5217</h4>
      <c-check-box-group v-model='checkedList' direction='row'>
        <c-check-box label='beijing'>\u5317\u4EAC</c-check-box>
        <c-check-box label='shanghai'>\u4E0A\u6D77</c-check-box>
        <c-check-box label='guangzhou'>\u5E7F\u5DDE</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>checkBoxChange \u548C color \u989C\u8272</h4>
      <c-check-box-group v-model='checkedList' color='RGB(255, 193, 7)' @change='checkBoxChange'>
        <c-check-box label='beijing'>\u5317\u4EAC</c-check-box>
        <c-check-box label='shanghai'>\u4E0A\u6D77</c-check-box>
        <c-check-box label='guangzhou'>\u5E7F\u5DDE</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>beforeChange (\u9009\u4E2D\u4E0A\u6D77\u53EF\u4EE5\u5207\u6362) {{canChange ? '\u53EF\u4EE5' : '\u4E0D\u53EF\u4EE5'}}\u5207\u6362</h4>
      <c-check-box-group v-model='checkedList' :beforeChange='checkBoxBeforeChange'>
        <c-check-box label='beijing'>\u5317\u4EAC</c-check-box>
        <c-check-box label='shanghai'>\u4E0A\u6D77</c-check-box>
        <c-check-box label='guangzhou'>\u5E7F\u5DDE</c-check-box>
      </c-check-box-group>
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
.mt10 {
  margin-top: 10px;
}
</style>
`},{description:C(()=>[sn]),highlight:C(()=>[tn]),default:C(()=>[v(E)]),_:1}),en])}const pn=M(X,[["render",on]]);export{ln as __pageData,pn as default};
