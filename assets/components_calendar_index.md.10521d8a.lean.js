import{a4 as y,_ as v,D as m,c as b,G as A,B as a,R as B,z as s,a as l,o as x}from"./chunks/framework.50008e6a.js";const{defineComponent:k}=y,V=k({name:"component-doc",components:{"render-demo-0":function(){const{resolveComponent:u,openBlock:c,createBlock:r}=y;function p(o,n){const e=u("c-calendar");return c(),r(e,{modelValue:o.curDate,"onUpdate:modelValue":n[0]||(n[0]=i=>o.curDate=i),onChange:o.curDateChange},null,8,["modelValue","onChange"])}const{defineComponent:C,ref:d}=y,F=C({setup(){return{curDate:d(new Date),curDateChange:e=>{console.log(e)}}}});return{render:p,...F}}(),"render-demo-1":function(){const{toDisplayString:u,createTextVNode:c,resolveComponent:r,withCtx:p,createVNode:C,createElementVNode:d,openBlock:F,createBlock:o}=y,n={class:"customize-header"};function e(D,t){const g=r("c-button"),h=r("c-calendar");return F(),o(h,{modelValue:D.curDate,"onUpdate:modelValue":t[0]||(t[0]=_=>D.curDate=_),onChange:D.curDateChange},{header:p(_=>[d("div",n,[c(" 当前日期 "+u(_)+" ",1),C(g,{type:"primary",plain:"",onClick:D.addADay},{default:p(()=>[c("加一天")]),_:1},8,["onClick"])])]),_:1},8,["modelValue","onChange"])}const{defineComponent:i,ref:E}=y,f=i({setup(){const D=h=>{console.log(h)},t=E(new Date);return{curDateChange:D,curDate:t,addADay:()=>{const h=new Date(t.value).getTime()+864e5;t.value=new Date(h)}}}});return{render:e,...f}}(),"render-demo-2":function(){const{toDisplayString:u,createTextVNode:c,resolveComponent:r,withCtx:p,openBlock:C,createBlock:d}=y;function F(e,i){const E=r("c-calendar");return C(),d(E,{onChange:e.curDateChange},{dateCell:p(({isSelected:f,date:D,day:t})=>[c(u(f?"当前选中日期":t),1)]),_:1},8,["onChange"])}const{defineComponent:o}=y,n=o({setup(){return{curDateChange:i=>{console.log(i)}}}});return{render:F,...n}}()}}),R=JSON.parse('{"title":"Calendar 日历","description":"","frontmatter":{},"headers":[],"relativePath":"components/calendar/index.md","filePath":"components/calendar/index.md","lastUpdated":1684202343000}');const w=B('<h1 id="calendar-日历" tabindex="-1">Calendar 日历 <a class="header-anchor" href="#calendar-日历" aria-label="Permalink to &quot;Calendar 日历&quot;">​</a></h1><ul><li>日历组件</li></ul><h2 id="何时使用" tabindex="-1">何时使用 <a class="header-anchor" href="#何时使用" aria-label="Permalink to &quot;何时使用&quot;">​</a></h2><ul><li>显示日期</li></ul><h2 id="基本用法" tabindex="-1">基本用法 <a class="header-anchor" href="#基本用法" aria-label="Permalink to &quot;基本用法&quot;">​</a></h2>',5),N=s("div",null,"Calendar 示例",-1),T=s("div",{class:"language-vue"},[s("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"c-calendar"),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"v-model"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"curDate"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"@change"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"curDateChange"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},"></"),s("span",{style:{color:"#F07178"}},"c-calendar"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"script"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{"),s("span",{style:{color:"#A6ACCD"}},"defineComponent"),s("span",{style:{color:"#89DDFF"}},","),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"ref"),s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"'"),s("span",{style:{color:"#C3E88D"}},"vue"),s("span",{style:{color:"#89DDFF"}},"'")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#82AAFF"}},"defineComponent"),s("span",{style:{color:"#A6ACCD"}},"("),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#F07178"}},"setup"),s("span",{style:{color:"#89DDFF"}},"()"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"curDate"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#82AAFF"}},"ref"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#89DDFF"}},"new"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#82AAFF"}},"Date"),s("span",{style:{color:"#F07178"}},"())")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"curDateChange"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"("),s("span",{style:{color:"#A6ACCD","font-style":"italic"}},"val"),s("span",{style:{color:"#89DDFF"}},")"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#C792EA"}},"=>"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"console"),s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#82AAFF"}},"log"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#A6ACCD"}},"val"),s("span",{style:{color:"#F07178"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"curDate"),s("span",{style:{color:"#89DDFF"}},",")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"curDateChange")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"  "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#A6ACCD"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"script"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"style"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"style"),s("span",{style:{color:"#89DDFF"}},">")])])])],-1),q=s("h2",{id:"自定义header",tabindex:"-1"},[l("自定义header "),s("a",{class:"header-anchor",href:"#自定义header","aria-label":'Permalink to "自定义header"'},"​")],-1),S=s("div",null,"Calendar 示例",-1),P=s("div",{class:"language-vue"},[s("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"c-calendar"),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"v-model"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"curDate"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"@change"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"curDateChange"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"    "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"#"),s("span",{style:{color:"#C792EA"}},"header"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#A6ACCD"}},"date"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"      "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"div"),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"class"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"customize-header"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"        当前日期 {{date}}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"        "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"c-button"),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"type"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"primary"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"plain"),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"@click"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"addADay"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},">"),s("span",{style:{color:"#A6ACCD"}},"加一天"),s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"c-button"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"      "),s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"div"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"    "),s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"c-calendar"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"script"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{"),s("span",{style:{color:"#A6ACCD"}},"defineComponent"),s("span",{style:{color:"#89DDFF"}},","),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"ref"),s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"'"),s("span",{style:{color:"#C3E88D"}},"vue"),s("span",{style:{color:"#89DDFF"}},"'")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#82AAFF"}},"defineComponent"),s("span",{style:{color:"#A6ACCD"}},"("),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#F07178"}},"setup"),s("span",{style:{color:"#89DDFF"}},"()"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"curDateChange"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"("),s("span",{style:{color:"#A6ACCD","font-style":"italic"}},"val"),s("span",{style:{color:"#89DDFF"}},")"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#C792EA"}},"=>"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"console"),s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#82AAFF"}},"log"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#A6ACCD"}},"val"),s("span",{style:{color:"#F07178"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"curDate"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#82AAFF"}},"ref"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#89DDFF"}},"new"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#82AAFF"}},"Date"),s("span",{style:{color:"#F07178"}},"())")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"addADay"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"()"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#C792EA"}},"=>"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"dateTime"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"new"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#82AAFF"}},"Date"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#A6ACCD"}},"curDate"),s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#A6ACCD"}},"value"),s("span",{style:{color:"#F07178"}},")"),s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#82AAFF"}},"getTime"),s("span",{style:{color:"#F07178"}},"() "),s("span",{style:{color:"#89DDFF"}},"+"),s("span",{style:{color:"#F07178"}}," ("),s("span",{style:{color:"#F78C6C"}},"1000"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"*"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#F78C6C"}},"60"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"*"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#F78C6C"}},"60"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"*"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#F78C6C"}},"24"),s("span",{style:{color:"#F07178"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"curDate"),s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#A6ACCD"}},"value"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"new"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#82AAFF"}},"Date"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#A6ACCD"}},"dateTime"),s("span",{style:{color:"#F07178"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"curDateChange"),s("span",{style:{color:"#89DDFF"}},",")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"curDate"),s("span",{style:{color:"#89DDFF"}},",")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"addADay")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"  "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#A6ACCD"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"script"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"style"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#C792EA"}},"scoped"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#FFCB6B"}},"customize-header"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#B2CCD6"}},"padding"),s("span",{style:{color:"#89DDFF"}},":"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#F78C6C"}},"10px"),s("span",{style:{color:"#89DDFF"}},";")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"style"),s("span",{style:{color:"#89DDFF"}},">")])])])],-1),z=s("h2",{id:"自定义日期内容",tabindex:"-1"},[l("自定义日期内容 "),s("a",{class:"header-anchor",href:"#自定义日期内容","aria-label":'Permalink to "自定义日期内容"'},"​")],-1),$=s("div",null,"Calendar 示例",-1),U=s("div",{class:"language-vue"},[s("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"c-calendar"),s("span",{style:{color:"#89DDFF"}}," "),s("span",{style:{color:"#C792EA"}},"@change"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#C3E88D"}},"curDateChange"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"    "),s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"#"),s("span",{style:{color:"#C792EA"}},"dateCell"),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},"{"),s("span",{style:{color:"#A6ACCD"}},"isSelected"),s("span",{style:{color:"#89DDFF"}},","),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"date"),s("span",{style:{color:"#89DDFF"}},","),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"day"),s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#89DDFF"}},'"'),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"      {{isSelected ? '当前选中日期' : day}}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"    "),s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"c-calendar"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"template"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"script"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{"),s("span",{style:{color:"#A6ACCD"}},"defineComponent"),s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"'"),s("span",{style:{color:"#C3E88D"}},"vue"),s("span",{style:{color:"#89DDFF"}},"'")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#82AAFF"}},"defineComponent"),s("span",{style:{color:"#A6ACCD"}},"("),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#A6ACCD"}},"  "),s("span",{style:{color:"#F07178"}},"setup"),s("span",{style:{color:"#89DDFF"}},"()"),s("span",{style:{color:"#A6ACCD"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#C792EA"}},"const"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#A6ACCD"}},"curDateChange"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"="),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"("),s("span",{style:{color:"#A6ACCD","font-style":"italic"}},"val"),s("span",{style:{color:"#89DDFF"}},")"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#C792EA"}},"=>"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"console"),s("span",{style:{color:"#89DDFF"}},"."),s("span",{style:{color:"#82AAFF"}},"log"),s("span",{style:{color:"#F07178"}},"("),s("span",{style:{color:"#A6ACCD"}},"val"),s("span",{style:{color:"#F07178"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),s("span",{style:{color:"#F07178"}}," "),s("span",{style:{color:"#89DDFF"}},"{")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"      "),s("span",{style:{color:"#A6ACCD"}},"curDateChange")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"    "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#F07178"}},"  "),s("span",{style:{color:"#89DDFF"}},"}")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"}"),s("span",{style:{color:"#A6ACCD"}},")")]),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"script"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"<"),s("span",{style:{color:"#F07178"}},"style"),s("span",{style:{color:"#89DDFF"}},">")]),l(`
`),s("span",{class:"line"}),l(`
`),s("span",{class:"line"},[s("span",{style:{color:"#89DDFF"}},"</"),s("span",{style:{color:"#F07178"}},"style"),s("span",{style:{color:"#89DDFF"}},">")])])])],-1),G=B('<h2 id="calendar参数" tabindex="-1">Calendar参数 <a class="header-anchor" href="#calendar参数" aria-label="Permalink to &quot;Calendar参数&quot;">​</a></h2><table><thead><tr><th>参数</th><th>类型</th><th>默认</th><th>说明</th></tr></thead><tbody><tr><td>v-model</td><td><code>Date</code></td><td>--</td><td>必选，组件绑定的值</td></tr></tbody></table><h2 id="calendar事件" tabindex="-1">Calendar事件 <a class="header-anchor" href="#calendar事件" aria-label="Permalink to &quot;Calendar事件&quot;">​</a></h2><table><thead><tr><th>事件</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>change</td><td><code>string</code></td><td>日期改变后的值</td></tr></tbody></table><h2 id="calendar插槽" tabindex="-1">Calendar插槽 <a class="header-anchor" href="#calendar插槽" aria-label="Permalink to &quot;Calendar插槽&quot;">​</a></h2><table><thead><tr><th>插槽名</th><th>说明</th></tr></thead><tbody><tr><td>header</td><td>自定义日历头部，参数<code>date</code>当前日期</td></tr><tr><td>dateCell</td><td>返回 <code>data: { isSelected, date, day }</code>;<code>isSelected</code> 是否选中、<code>date</code> 格式化后的日期、 <code>day</code> 单元格的日期 。</td></tr></tbody></table>',6);function J(u,c,r,p,C,d){const F=m("render-demo-0"),o=m("demo"),n=m("render-demo-1"),e=m("render-demo-2");return x(),b("div",null,[w,A(o,{customClass:"undefined",sourceCode:`
<template>
  <c-calendar v-model="curDate" @change="curDateChange"></c-calendar>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  setup() {
    const curDate = ref(new Date())

    const curDateChange = (val) => {
      console.log(val)
    }
    return {
      curDate,
      curDateChange
    }
  }
})
<\/script>

<style>

</style>
`},{description:a(()=>[N]),highlight:a(()=>[T]),default:a(()=>[A(F)]),_:1}),q,A(o,{customClass:"undefined",sourceCode:`
<template>
  <c-calendar v-model="curDate" @change="curDateChange">
    <template #header="date">
      <div class="customize-header">
        当前日期 {{date}}
        <c-button type="primary" plain @click="addADay">加一天</c-button>
      </div>
    </template>
  </c-calendar>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  setup() {
    const curDateChange = (val) => {
      console.log(val)
    }

    const curDate = ref(new Date())

    const addADay = () => {
      const dateTime = new Date(curDate.value).getTime() + (1000 * 60 * 60 * 24)
      curDate.value = new Date(dateTime)
    }
    return {
      curDateChange,
      curDate,
      addADay
    }
  }
})
<\/script>

<style scoped>
.customize-header {
  padding: 10px;
}
</style>
`},{description:a(()=>[S]),highlight:a(()=>[P]),default:a(()=>[A(n)]),_:1}),z,A(o,{customClass:"undefined",sourceCode:`
<template>
  <c-calendar @change="curDateChange">
    <template #dateCell="{isSelected, date, day}">
      {{isSelected ? '当前选中日期' : day}}
    </template>
  </c-calendar>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  setup() {
    const curDateChange = (val) => {
      console.log(val)
    }
    return {
      curDateChange
    }
  }
})
<\/script>

<style>

</style>
`},{description:a(()=>[$]),highlight:a(()=>[U]),default:a(()=>[A(e)]),_:1}),G])}const j=v(V,[["render",J]]);export{R as __pageData,j as default};
