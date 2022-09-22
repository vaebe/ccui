import{V as v,_ as C,o as x,c as A,a as g,w as F,d as n,e as t,b,r as B}from"./app.63a32048.js";const V={name:"component-doc",components:{"render-demo-0":function(){const{resolveComponent:c,createVNode:e,openBlock:o,createElementBlock:l}=v;function p(a,u){const h=c("k-rate");return o(),l("div",null,[e(h,{modelValue:a.value1,"onUpdate:modelValue":u[0]||(u[0]=s=>a.value1=s),"read-only":!0},null,8,["modelValue"])])}const{ref:r}=v;return{render:p,...{setup(){return{value1:r(3.5)}}}}}(),"render-demo-1":function(){const{resolveComponent:c,createVNode:e,openBlock:o,createElementBlock:l}=v;function p(a,u){const h=c("k-rate");return o(),l("div",null,[e(h,{modelValue:a.value,"onUpdate:modelValue":u[0]||(u[0]=s=>a.value=s),icon:"star-o"},null,8,["modelValue"])])}const{ref:r}=v;return{render:p,...{setup(){return{value:r(2)}}}}}(),"render-demo-2":function(){const{createTextVNode:c,resolveComponent:e,withCtx:o,createVNode:l,openBlock:p,createElementBlock:r}=v,f=c("A");function a(s,k){const i=e("k-rate");return p(),r("div",null,[l(i,{color:"#ffa500",modelValue:s.value,"onUpdate:modelValue":k[0]||(k[0]=y=>s.value=y),count:6},{default:o(()=>[f]),_:1},8,["modelValue"])])}const{ref:u}=v;return{render:a,...{setup(){return{value:u(3)}}}}}(),"render-demo-3":function(){const{toDisplayString:c,createTextVNode:e,resolveComponent:o,withCtx:l,createVNode:p,openBlock:r,createElementBlock:f}=v;function a(s,k){const i=o("k-rate");return r(),f("div",null,[p(i,{modelValue:s.value,"onUpdate:modelValue":k[0]||(k[0]=y=>s.value=y),"allow-half":!0,onChange:s.change},{info:l(y=>[e(c(y),1)]),_:1},8,["modelValue","onChange"])])}const{ref:u}=v;return{render:a,...{setup(){return{value:u(2.5),change:i=>{console.log(i)}}}}}}(),"render-demo-4":function(){const{resolveComponent:c,createVNode:e,createElementVNode:o,createTextVNode:l,withCtx:p,openBlock:r,createElementBlock:f}=v,a={class:"mb20"},u={class:"mb20"},h={class:"mb20"},s=l("N");function k(d,m){const E=c("k-rate");return r(),f("div",null,[o("div",a,[e(E,{modelValue:d.value1,"onUpdate:modelValue":m[0]||(m[0]=_=>d.value1=_),"read-only":!0,color:"blue",count:5,icon:"star"},null,8,["modelValue"])]),o("div",u,[e(E,{modelValue:d.value2,"onUpdate:modelValue":m[1]||(m[1]=_=>d.value2=_),"read-only":!0,color:"orange",count:5,icon:"star"},null,8,["modelValue"])]),o("div",h,[e(E,{modelValue:d.value3,"onUpdate:modelValue":m[2]||(m[2]=_=>d.value3=_),"read-only":!0,color:"red",count:5},null,8,["modelValue"])]),o("div",null,[e(E,{modelValue:d.value4,"onUpdate:modelValue":m[3]||(m[3]=_=>d.value4=_),"read-only":!0,color:"#67c23a",count:5},{default:p(()=>[s]),_:1},8,["modelValue"])])])}const{ref:i}=v;return{render:k,...{setup(){const d=i(3.5),m=i(2),E=i(3),_=i(1);return{value1:d,value2:m,value3:E,value4:_}}}}}()}},K=JSON.parse('{"title":"Rate \u8BC4\u5206","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F55\u65F6\u4F7F\u7528","slug":"\u4F55\u65F6\u4F7F\u7528"},{"level":2,"title":"\u52A8\u6001\u6A21\u5F0F","slug":"\u52A8\u6001\u6A21\u5F0F"},{"level":2,"title":"\u52A8\u6001\u6A21\u5F0F-\u81EA\u5B9A\u4E49","slug":"\u52A8\u6001\u6A21\u5F0F-\u81EA\u5B9A\u4E49"},{"level":2,"title":"\u534A\u9009\u6A21\u5F0F","slug":"\u534A\u9009\u6A21\u5F0F"},{"level":2,"title":"\u4F7F\u7528 color \u53C2\u6570","slug":"\u4F7F\u7528-color-\u53C2\u6570"},{"level":3,"title":"Rate \u53C2\u6570","slug":"rate-\u53C2\u6570"},{"level":2,"title":"Rate \u4E8B\u4EF6","slug":"rate-\u4E8B\u4EF6"},{"level":2,"title":"Rate \u63D2\u69FD","slug":"rate-\u63D2\u69FD"}],"relativePath":"components/rate/index.md","lastUpdated":1663859363000}');const w=n("h1",{id:"rate-\u8BC4\u5206",tabindex:"-1"},[t("Rate \u8BC4\u5206 "),n("a",{class:"header-anchor",href:"#rate-\u8BC4\u5206","aria-hidden":"true"},"#")],-1),q=n("p",null,"\u7B49\u7EA7\u8BC4\u4F30\u3002",-1),D=n("h2",{id:"\u4F55\u65F6\u4F7F\u7528",tabindex:"-1"},[t("\u4F55\u65F6\u4F7F\u7528 "),n("a",{class:"header-anchor",href:"#\u4F55\u65F6\u4F7F\u7528","aria-hidden":"true"},"#")],-1),N=n("p",null,"\u7528\u6237\u5BF9\u4E00\u4E2A\u4EA7\u54C1\u8FDB\u884C\u8BC4\u5206\u65F6\u53EF\u4EE5\u4F7F\u7528\u3002",-1),U=n("p",null,"###\u53EA\u8BFB\u6A21\u5F0F",-1),R=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value1"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":read-only"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("true"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[t(`
`),n("span",{class:"token keyword"},"import"),t(),n("span",{class:"token punctuation"},"{"),t(" ref "),n("span",{class:"token punctuation"},"}"),t(),n("span",{class:"token keyword"},"from"),t(),n("span",{class:"token string"},"'vue'"),t(`

`),n("span",{class:"token keyword"},"export"),t(),n("span",{class:"token keyword"},"default"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value1 "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"3.5"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"return"),t(),n("span",{class:"token punctuation"},"{"),t(`
      value1`),n("span",{class:"token punctuation"},","),t(`
    `),n("span",{class:"token punctuation"},"}"),t(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("script")]),n("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),T=n("h2",{id:"\u52A8\u6001\u6A21\u5F0F",tabindex:"-1"},[t("\u52A8\u6001\u6A21\u5F0F "),n("a",{class:"header-anchor",href:"#\u52A8\u6001\u6A21\u5F0F","aria-hidden":"true"},"#")],-1),j=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},"icon"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("star-o"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[t(`
`),n("span",{class:"token keyword"},"import"),t(),n("span",{class:"token punctuation"},"{"),t(" ref "),n("span",{class:"token punctuation"},"}"),t(),n("span",{class:"token keyword"},"from"),t(),n("span",{class:"token string"},"'vue'"),t(`

`),n("span",{class:"token keyword"},"export"),t(),n("span",{class:"token keyword"},"default"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"2"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"return"),t(),n("span",{class:"token punctuation"},"{"),t(`
      value`),n("span",{class:"token punctuation"},","),t(`
    `),n("span",{class:"token punctuation"},"}"),t(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("script")]),n("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),S=n("h2",{id:"\u52A8\u6001\u6A21\u5F0F-\u81EA\u5B9A\u4E49",tabindex:"-1"},[t("\u52A8\u6001\u6A21\u5F0F-\u81EA\u5B9A\u4E49 "),n("a",{class:"header-anchor",href:"#\u52A8\u6001\u6A21\u5F0F-\u81EA\u5B9A\u4E49","aria-hidden":"true"},"#")],-1),$=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("#ffa500"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":count"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("6"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t("A"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("k-rate")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[t(`
`),n("span",{class:"token keyword"},"import"),t(),n("span",{class:"token punctuation"},"{"),t(" ref "),n("span",{class:"token punctuation"},"}"),t(),n("span",{class:"token keyword"},"from"),t(),n("span",{class:"token string"},"'vue'"),t(`

`),n("span",{class:"token keyword"},"export"),t(),n("span",{class:"token keyword"},"default"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"3"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"return"),t(),n("span",{class:"token punctuation"},"{"),t(`
      value`),n("span",{class:"token punctuation"},","),t(`
    `),n("span",{class:"token punctuation"},"}"),t(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("script")]),n("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),J=n("h2",{id:"\u534A\u9009\u6A21\u5F0F",tabindex:"-1"},[t("\u534A\u9009\u6A21\u5F0F "),n("a",{class:"header-anchor",href:"#\u534A\u9009\u6A21\u5F0F","aria-hidden":"true"},"#")],-1),O=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":allow-half"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("true"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("change"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),t(),n("span",{class:"token attr-name"},[n("span",{class:"token namespace"},"v-slot:"),t("info")]),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("info"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t(`
      {{info}}
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("k-rate")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[t(`
`),n("span",{class:"token keyword"},"import"),t(),n("span",{class:"token punctuation"},"{"),t(" ref "),n("span",{class:"token punctuation"},"}"),t(),n("span",{class:"token keyword"},"from"),t(),n("span",{class:"token string"},"'vue'"),t(`

`),n("span",{class:"token keyword"},"export"),t(),n("span",{class:"token keyword"},"default"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"2.5"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"const"),t(),n("span",{class:"token function-variable function"},"change"),t(),n("span",{class:"token operator"},"="),t(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token operator"},"=>"),t(),n("span",{class:"token punctuation"},"{"),t(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),t("val"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token punctuation"},"}"),t(`
    `),n("span",{class:"token keyword"},"return"),t(),n("span",{class:"token punctuation"},"{"),t(`
      value`),n("span",{class:"token punctuation"},","),t(`
      change`),n("span",{class:"token punctuation"},","),t(`
    `),n("span",{class:"token punctuation"},"}"),t(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("script")]),n("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),P=n("h2",{id:"\u4F7F\u7528-color-\u53C2\u6570",tabindex:"-1"},[t("\u4F7F\u7528 color \u53C2\u6570 "),n("a",{class:"header-anchor",href:"#\u4F7F\u7528-color-\u53C2\u6570","aria-hidden":"true"},"#")],-1),z=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),t(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("mb20"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(`
      `),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value1"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},":read-only"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("true"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("blue"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},":count"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("5"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},"icon"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("star"),n("span",{class:"token punctuation"},'"')]),t(`
    `),n("span",{class:"token punctuation"},"/>")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),t(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("mb20"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(`
      `),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value2"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},":read-only"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("true"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("orange"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},":count"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("5"),n("span",{class:"token punctuation"},'"')]),t(`
      `),n("span",{class:"token attr-name"},"icon"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("star"),n("span",{class:"token punctuation"},'"')]),t(`
    `),n("span",{class:"token punctuation"},"/>")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),t(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("mb20"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value3"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":read-only"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("true"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("red"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":count"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("5"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token punctuation"},"/>")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("k-rate")]),t(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("value4"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":read-only"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("true"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("#67c23a"),n("span",{class:"token punctuation"},'"')]),t(),n("span",{class:"token attr-name"},":count"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),t("5"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),t("N"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("k-rate")]),n("span",{class:"token punctuation"},">")]),t(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("div")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("template")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[t(`
`),n("span",{class:"token keyword"},"import"),t(),n("span",{class:"token punctuation"},"{"),t(" ref "),n("span",{class:"token punctuation"},"}"),t(),n("span",{class:"token keyword"},"from"),t(),n("span",{class:"token string"},"'vue'"),t(`

`),n("span",{class:"token keyword"},"export"),t(),n("span",{class:"token keyword"},"default"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),t(),n("span",{class:"token punctuation"},"{"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value1 "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"3.5"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value2 "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"2"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value3 "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"3"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"const"),t(" value4 "),n("span",{class:"token operator"},"="),t(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},")"),t(`
    `),n("span",{class:"token keyword"},"return"),t(),n("span",{class:"token punctuation"},"{"),t(`
      value1`),n("span",{class:"token punctuation"},","),t(`
      value2`),n("span",{class:"token punctuation"},","),t(`
      value3`),n("span",{class:"token punctuation"},","),t(`
      value4`),n("span",{class:"token punctuation"},","),t(`
    `),n("span",{class:"token punctuation"},"}"),t(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("script")]),n("span",{class:"token punctuation"},">")]),t(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),t("style")]),t(),n("span",{class:"token attr-name"},"scoped"),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},[t(`
`),n("span",{class:"token selector"},".mb20"),t(),n("span",{class:"token punctuation"},"{"),t(`
  `),n("span",{class:"token property"},"margin-bottom"),n("span",{class:"token punctuation"},":"),t(" 20px"),n("span",{class:"token punctuation"},";"),t(`
`),n("span",{class:"token punctuation"},"}"),t(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),t("style")]),n("span",{class:"token punctuation"},">")]),t(`
`)])])],-1),G=b('<h3 id="rate-\u53C2\u6570" tabindex="-1">Rate \u53C2\u6570 <a class="header-anchor" href="#rate-\u53C2\u6570" aria-hidden="true">#</a></h3><table><thead><tr><th style="text-align:center;">\u53C2\u6570</th><th style="text-align:center;">\u7C7B\u578B</th><th style="text-align:center;">\u9ED8\u8BA4\u503C</th><th style="text-align:left;">\u63CF\u8FF0</th></tr></thead><tbody><tr><td style="text-align:center;">v-model</td><td style="text-align:center;"><code>number</code></td><td style="text-align:center;">0</td><td style="text-align:left;">\u5FC5\u9009\uFF0C\u8BC4\u5206\u7ED1\u5B9A\u7684\u503C</td></tr><tr><td style="text-align:center;">read-only</td><td style="text-align:center;"><code>boolean</code></td><td style="text-align:center;">false</td><td style="text-align:left;">\u53EF\u9009\uFF0C\u8BBE\u7F6E\u662F\u5426\u4E3A\u53EA\u8BFB\u6A21\u5F0F\uFF0C\u53EA\u8BFB\u6A21\u5F0F\u65E0\u6CD5\u4EA4\u4E92</td></tr><tr><td style="text-align:center;">count</td><td style="text-align:center;"><code>number</code></td><td style="text-align:center;">5</td><td style="text-align:left;">\u53EF\u9009\uFF0C\u8BBE\u7F6E\u603B\u7B49\u7EA7\u6570</td></tr><tr><td style="text-align:center;">color</td><td style="text-align:center;"><code>string</code></td><td style="text-align:center;">--</td><td style="text-align:left;">\u53EF\u9009\uFF0C\u661F\u661F\u9009\u4E2D\u989C\u8272</td></tr><tr><td style="text-align:center;">allow-half</td><td style="text-align:center;"><code>boolean</code></td><td style="text-align:center;">false</td><td style="text-align:left;">\u53EF\u9009\uFF0C\u52A8\u6001\u6A21\u5F0F\u4E0B\u662F\u5426\u5141\u8BB8\u534A\u9009</td></tr></tbody></table><h2 id="rate-\u4E8B\u4EF6" tabindex="-1">Rate \u4E8B\u4EF6 <a class="header-anchor" href="#rate-\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th><th>\u56DE\u8C03\u53C2\u6570</th></tr></thead><tbody><tr><td>change</td><td><code>number</code></td><td>\u5206\u503C\u6539\u53D8\u65F6\u89E6\u53D1</td><td>\u6539\u53D8\u540E\u7684\u5206\u503C</td></tr></tbody></table><h2 id="rate-\u63D2\u69FD" tabindex="-1">Rate \u63D2\u69FD <a class="header-anchor" href="#rate-\u63D2\u69FD" aria-hidden="true">#</a></h2><table><thead><tr><th>\u63D2\u69FD\u540D</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>default</td><td>\u652F\u6301\u4F20\u5165\u4E00\u4E2A\u6587\u672C\u5B57\u7B26\u6216svg\u56FE\u6807\uFF08\u53EF\u4EE5\u88ABcolor\u3001fill\u6539\u53D8\u989C\u8272\u7684\uFF09</td></tr><tr><td>info</td><td>\u8FD4\u56DE\u5F53\u524D\u9009\u4E2D\u7684\u503C \u53EF\u7528\u4E8E\u81EA\u5B9A\u4E49\u8BC4\u5206\u63CF\u8FF0</td></tr></tbody></table>',6);function H(c,e,o,l,p,r){const f=B("render-demo-0"),a=B("demo"),u=B("render-demo-1"),h=B("render-demo-2"),s=B("render-demo-3"),k=B("render-demo-4");return x(),A("div",null,[w,q,D,N,U,g(a,{sourceCode:`
<template>
  <k-rate v-model="value1" :read-only="true" />
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const value1 = ref(3.5)
    return {
      value1,
    }
  },
}
<\/script>
`},{highlight:F(()=>[R]),default:F(()=>[g(f)]),_:1}),T,g(a,{sourceCode:`
<template>
  <k-rate v-model="value" icon="star-o" />
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const value = ref(2)
    return {
      value,
    }
  },
}
<\/script>
`},{highlight:F(()=>[j]),default:F(()=>[g(u)]),_:1}),S,g(a,{sourceCode:`
<template>
  <k-rate color="#ffa500" v-model="value" :count="6">A</k-rate>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const value = ref(3)
    return {
      value,
    }
  },
}
<\/script>
`},{highlight:F(()=>[$]),default:F(()=>[g(h)]),_:1}),J,g(a,{sourceCode:`
<template>
  <k-rate v-model="value" :allow-half="true" @change="change">
    <template v-slot:info="info">
      {{info}}
    </template>
  </k-rate>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const value = ref(2.5)
    const change = (val) => {
      console.log(val)
    }
    return {
      value,
      change,
    }
  },
}
<\/script>
`},{highlight:F(()=>[O]),default:F(()=>[g(s)]),_:1}),P,g(a,{sourceCode:`
<template>
  <div class="mb20">
    <k-rate
      v-model="value1"
      :read-only="true"
      color="blue"
      :count="5"
      icon="star"
    />
  </div>
  <div class="mb20">
    <k-rate
      v-model="value2"
      :read-only="true"
      color="orange"
      :count="5"
      icon="star"
    />
  </div>
  <div class="mb20">
    <k-rate v-model="value3" :read-only="true" color="red" :count="5" />
  </div>
  <div>
    <k-rate v-model="value4" :read-only="true" color="#67c23a" :count="5">N</k-rate>
  </div>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const value1 = ref(3.5)
    const value2 = ref(2)
    const value3 = ref(3)
    const value4 = ref(1)
    return {
      value1,
      value2,
      value3,
      value4,
    }
  },
}
<\/script>
<style scoped>
.mb20 {
  margin-bottom: 20px;
}
</style>
`},{highlight:F(()=>[z]),default:F(()=>[g(k)]),_:1}),G])}const L=C(V,[["render",H]]);export{K as __pageData,L as default};
