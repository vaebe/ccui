import{a4 as r,_,D as f,c as g,G as i,B as C,R as B,z as l,a as s,o as x}from"./chunks/framework.50008e6a.js";const{defineComponent:b}=r,k=b({name:"component-doc",components:{"render-demo-0":function(){const{resolveComponent:p,openBlock:n,createBlock:a}=r;function F(e,o){const c=p("c-rate");return n(),a(c,{modelValue:e.value1,"onUpdate:modelValue":o[0]||(o[0]=t=>e.value1=t),"read-only":!0},null,8,["modelValue"])}const{ref:D}=r;return{render:F,...{setup(){return{value1:D(3.5)}}}}}(),"render-demo-1":function(){const{resolveComponent:p,openBlock:n,createBlock:a}=r;function F(e,o){const c=p("c-rate");return n(),a(c,{modelValue:e.value,"onUpdate:modelValue":o[0]||(o[0]=t=>e.value=t),icon:"star-o"},null,8,["modelValue"])}const{ref:D}=r;return{render:F,...{setup(){return{value:D(2)}}}}}(),"render-demo-2":function(){const{createTextVNode:p,resolveComponent:n,withCtx:a,openBlock:F,createBlock:D}=r;function E(c,t){const d=n("c-rate");return F(),D(d,{color:"#ffa500",modelValue:c.value,"onUpdate:modelValue":t[0]||(t[0]=A=>c.value=A),count:6},{default:a(()=>[p("A")]),_:1},8,["modelValue"])}const{ref:e}=r;return{render:E,...{setup(){return{value:e(3)}}}}}(),"render-demo-3":function(){const{toDisplayString:p,createTextVNode:n,resolveComponent:a,withCtx:F,openBlock:D,createBlock:E}=r;function e(t,d){const A=a("c-rate");return D(),E(A,{modelValue:t.value,"onUpdate:modelValue":d[0]||(d[0]=v=>t.value=v),"allow-half":!0,onChange:t.change},{info:F(v=>[n(p(v),1)]),_:1},8,["modelValue","onChange"])}const{ref:o}=r;return{render:e,...{setup(){return{value:o(2.5),change:A=>{console.log(A)}}}}}}(),"render-demo-4":function(){const{resolveComponent:p,createVNode:n,createElementVNode:a,createTextVNode:F,withCtx:D,Fragment:E,openBlock:e,createElementBlock:o}=r,c={class:"mb20"},t={class:"mb20"},d={class:"mb20"};function A(y,u){const h=p("c-rate");return e(),o(E,null,[a("div",c,[n(h,{modelValue:y.value1,"onUpdate:modelValue":u[0]||(u[0]=m=>y.value1=m),"read-only":!0,color:"blue",count:5,icon:"star"},null,8,["modelValue"])]),a("div",t,[n(h,{modelValue:y.value2,"onUpdate:modelValue":u[1]||(u[1]=m=>y.value2=m),"read-only":!0,color:"orange",count:5,icon:"star"},null,8,["modelValue"])]),a("div",d,[n(h,{modelValue:y.value3,"onUpdate:modelValue":u[2]||(u[2]=m=>y.value3=m),"read-only":!0,color:"red",count:5},null,8,["modelValue"])]),a("div",null,[n(h,{modelValue:y.value4,"onUpdate:modelValue":u[3]||(u[3]=m=>y.value4=m),"read-only":!0,color:"#67c23a",count:5},{default:D(()=>[F("N")]),_:1},8,["modelValue"])])],64)}const{ref:v}=r;return{render:A,...{setup(){const y=v(3.5),u=v(2),h=v(3),m=v(1);return{value1:y,value2:u,value3:h,value4:m}}}}}()}}),j=JSON.parse('{"title":"Rate 评分","description":"","frontmatter":{},"headers":[],"relativePath":"components/rate/index.md","filePath":"components/rate/index.md","lastUpdated":1684202343000}');const V=B('<h1 id="rate-评分" tabindex="-1">Rate 评分 <a class="header-anchor" href="#rate-评分" aria-label="Permalink to &quot;Rate 评分&quot;">​</a></h1><p>等级评估。</p><h2 id="何时使用" tabindex="-1">何时使用 <a class="header-anchor" href="#何时使用" aria-label="Permalink to &quot;何时使用&quot;">​</a></h2><p>用户对一个产品进行评分时可以使用。</p><h2 id="只读模式" tabindex="-1">只读模式 <a class="header-anchor" href="#只读模式" aria-label="Permalink to &quot;只读模式&quot;">​</a></h2>',5),N=l("div",{class:"language-vue"},[l("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[l("code",null,[l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value1"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":read-only"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"true"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},"/>")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{"),l("span",{style:{color:"#A6ACCD"}},"ref"),l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"vue"),l("span",{style:{color:"#89DDFF"}},"'")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#F07178"}},"setup"),l("span",{style:{color:"#89DDFF"}},"()"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value1"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"3.5"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value1"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"  "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")])])])],-1),q=l("h2",{id:"动态模式",tabindex:"-1"},[s("动态模式 "),l("a",{class:"header-anchor",href:"#动态模式","aria-label":'Permalink to "动态模式"'},"​")],-1),P=l("div",{class:"language-vue"},[l("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[l("code",null,[l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"icon"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"star-o"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},"/>")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{"),l("span",{style:{color:"#A6ACCD"}},"ref"),l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"vue"),l("span",{style:{color:"#89DDFF"}},"'")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#F07178"}},"setup"),l("span",{style:{color:"#89DDFF"}},"()"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"  "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")])])])],-1),T=l("h2",{id:"动态模式-自定义",tabindex:"-1"},[s("动态模式-自定义 "),l("a",{class:"header-anchor",href:"#动态模式-自定义","aria-label":'Permalink to "动态模式-自定义"'},"​")],-1),R=l("div",{class:"language-vue"},[l("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[l("code",null,[l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"color"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"#ffa500"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":count"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"6"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">"),l("span",{style:{color:"#A6ACCD"}},"A"),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{"),l("span",{style:{color:"#A6ACCD"}},"ref"),l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"vue"),l("span",{style:{color:"#89DDFF"}},"'")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#F07178"}},"setup"),l("span",{style:{color:"#89DDFF"}},"()"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"3"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"  "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")])])])],-1),w=l("h2",{id:"半选模式",tabindex:"-1"},[s("半选模式 "),l("a",{class:"header-anchor",href:"#半选模式","aria-label":'Permalink to "半选模式"'},"​")],-1),U=l("div",{class:"language-vue"},[l("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[l("code",null,[l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":allow-half"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"true"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"@change"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"change"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"    "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#C792EA"}},"v-slot"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#C792EA"}},"info"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#A6ACCD"}},"info"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"      {{info}}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"    "),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{"),l("span",{style:{color:"#A6ACCD"}},"ref"),l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"vue"),l("span",{style:{color:"#89DDFF"}},"'")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#F07178"}},"setup"),l("span",{style:{color:"#89DDFF"}},"()"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"2.5"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"change"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"("),l("span",{style:{color:"#A6ACCD","font-style":"italic"}},"val"),l("span",{style:{color:"#89DDFF"}},")"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#C792EA"}},"=>"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"console"),l("span",{style:{color:"#89DDFF"}},"."),l("span",{style:{color:"#82AAFF"}},"log"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#A6ACCD"}},"val"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"change"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"  "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")])])])],-1),O=l("h2",{id:"使用color参数",tabindex:"-1"},[s("使用color参数 "),l("a",{class:"header-anchor",href:"#使用color参数","aria-label":'Permalink to "使用color参数"'},"​")],-1),S=l("div",{class:"language-vue"},[l("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[l("code",null,[l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"class"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"mb20"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"    "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value1"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},":read-only"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"true"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},"color"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"blue"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},":count"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"5"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},"icon"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"star"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"    />")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"class"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"mb20"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"    "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value2"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},":read-only"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"true"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},"color"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"orange"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},":count"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"5"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"        "),l("span",{style:{color:"#C792EA"}},"icon"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"star"),l("span",{style:{color:"#89DDFF"}},'"')]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"    />")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"class"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"mb20"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"    "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value3"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":read-only"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"true"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"color"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"red"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":count"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"5"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},"/>")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"    "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"v-model"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"value4"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":read-only"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"true"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},"color"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"#67c23a"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":count"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"5"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">"),l("span",{style:{color:"#A6ACCD"}},"N"),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"c-rate"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"div"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{"),l("span",{style:{color:"#A6ACCD"}},"ref"),l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"vue"),l("span",{style:{color:"#89DDFF"}},"'")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#F07178"}},"setup"),l("span",{style:{color:"#89DDFF"}},"()"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value1"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"3.5"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value2"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value3"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"3"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"value4"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"("),l("span",{style:{color:"#F78C6C"}},"1"),l("span",{style:{color:"#F07178"}},")")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value1"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value2"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value3"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"value4"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"  "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"style"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#C792EA"}},"scoped"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"."),l("span",{style:{color:"#FFCB6B"}},"mb20"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#B2CCD6"}},"margin-bottom"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#F78C6C"}},"20px"),l("span",{style:{color:"#89DDFF"}},";")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"style"),l("span",{style:{color:"#89DDFF"}},">")])])])],-1),$=B('<h3 id="rate参数" tabindex="-1">Rate参数 <a class="header-anchor" href="#rate参数" aria-label="Permalink to &quot;Rate参数&quot;">​</a></h3><table><thead><tr><th style="text-align:center;">参数</th><th style="text-align:center;">类型</th><th style="text-align:center;">默认值</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:center;">v-model</td><td style="text-align:center;"><code>number</code></td><td style="text-align:center;">0</td><td style="text-align:left;">必选，评分绑定的值</td></tr><tr><td style="text-align:center;">read-only</td><td style="text-align:center;"><code>boolean</code></td><td style="text-align:center;">false</td><td style="text-align:left;">可选，设置是否为只读模式，只读模式无法交互</td></tr><tr><td style="text-align:center;">count</td><td style="text-align:center;"><code>number</code></td><td style="text-align:center;">5</td><td style="text-align:left;">可选，设置总等级数</td></tr><tr><td style="text-align:center;">color</td><td style="text-align:center;"><code>string</code></td><td style="text-align:center;">--</td><td style="text-align:left;">可选，星星选中颜色</td></tr><tr><td style="text-align:center;">allow-half</td><td style="text-align:center;"><code>boolean</code></td><td style="text-align:center;">false</td><td style="text-align:left;">可选，动态模式下是否允许半选</td></tr></tbody></table><h2 id="rate事件" tabindex="-1">Rate事件 <a class="header-anchor" href="#rate事件" aria-label="Permalink to &quot;Rate事件&quot;">​</a></h2><table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>回调参数</th></tr></thead><tbody><tr><td>change</td><td><code>(value: number) =&gt; void</code></td><td>分值改变时触发</td><td>改变后的分值</td></tr></tbody></table><h2 id="rate类型定义" tabindex="-1">Rate类型定义 <a class="header-anchor" href="#rate类型定义" aria-label="Permalink to &quot;Rate类型定义&quot;">​</a></h2><h3 id="ontouchedtype" tabindex="-1">OnTouchedType <a class="header-anchor" href="#ontouchedtype" aria-label="Permalink to &quot;OnTouchedType&quot;">​</a></h3><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">OnTouchedType</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span></code></pre></div><h2 id="rate插槽" tabindex="-1">Rate插槽 <a class="header-anchor" href="#rate插槽" aria-label="Permalink to &quot;Rate插槽&quot;">​</a></h2><table><thead><tr><th>插槽名</th><th>说明</th></tr></thead><tbody><tr><td>default</td><td>支持传入一个文本字符或svg图标（可以被color、fill改变颜色的）</td></tr><tr><td>info</td><td>返回当前选中的值 可用于自定义评分描述</td></tr></tbody></table>',9);function z(p,n,a,F,D,E){const e=f("render-demo-0"),o=f("demo"),c=f("render-demo-1"),t=f("render-demo-2"),d=f("render-demo-3"),A=f("render-demo-4");return x(),g("div",null,[V,i(o,{customClass:"undefined",sourceCode:`
<template>
  <c-rate v-model="value1" :read-only="true"/>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value1 = ref(3.5)
    return {
      value1,
    }
  },
}
<\/script>
`},{highlight:C(()=>[N]),default:C(()=>[i(e)]),_:1}),q,i(o,{customClass:"undefined",sourceCode:`
<template>
  <c-rate v-model="value" icon="star-o"/>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value = ref(2)
    return {
      value,
    }
  },
}
<\/script>
`},{highlight:C(()=>[P]),default:C(()=>[i(c)]),_:1}),T,i(o,{customClass:"undefined",sourceCode:`
<template>
  <c-rate color="#ffa500" v-model="value" :count="6">A</c-rate>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value = ref(3)
    return {
      value,
    }
  },
}
<\/script>
`},{highlight:C(()=>[R]),default:C(()=>[i(t)]),_:1}),w,i(o,{customClass:"undefined",sourceCode:`
<template>
  <c-rate v-model="value" :allow-half="true" @change="change">
    <template v-slot:info="info">
      {{info}}
    </template>
  </c-rate>
</template>
<script>
import {ref} from 'vue'

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
`},{highlight:C(()=>[U]),default:C(()=>[i(d)]),_:1}),O,i(o,{customClass:"undefined",sourceCode:`
<template>
  <div class="mb20">
    <c-rate
        v-model="value1"
        :read-only="true"
        color="blue"
        :count="5"
        icon="star"
    />
  </div>
  <div class="mb20">
    <c-rate
        v-model="value2"
        :read-only="true"
        color="orange"
        :count="5"
        icon="star"
    />
  </div>
  <div class="mb20">
    <c-rate v-model="value3" :read-only="true" color="red" :count="5"/>
  </div>
  <div>
    <c-rate v-model="value4" :read-only="true" color="#67c23a" :count="5">N</c-rate>
  </div>
</template>
<script>
import {ref} from 'vue'

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
`},{highlight:C(()=>[S]),default:C(()=>[i(A)]),_:1}),$])}const H=_(k,[["render",z]]);export{j as __pageData,H as default};
