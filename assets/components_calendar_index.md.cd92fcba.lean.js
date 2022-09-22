import{V as C,_ as y,o as B,c as A,a as E,w as o,b as v,d as n,e as a,r as f}from"./app.63a32048.js";const w={name:"component-doc",components:{"render-demo-0":function(){const{resolveComponent:h,createVNode:l,openBlock:r,createElementBlock:k}=C;function i(t,e){const c=h("k-calendar");return r(),k("div",null,[l(c,{modelValue:t.curDate,"onUpdate:modelValue":e[0]||(e[0]=D=>t.curDate=D),onChange:t.curDateChange},null,8,["modelValue","onChange"])])}const{defineComponent:m,ref:d}=C,s=m({setup(){return{curDate:d(new Date),curDateChange:c=>{console.log(c)}}}});return{render:i,...s}}(),"render-demo-1":function(){const{toDisplayString:h,createTextVNode:l,resolveComponent:r,withCtx:k,createVNode:i,openBlock:m,createElementBlock:d}=C,s=l("\u52A0\u4E00\u5929");function t(u,p){const F=r("k-button"),g=r("k-calendar");return m(),d("div",null,[i(g,{modelValue:u.curDate,"onUpdate:modelValue":p[0]||(p[0]=_=>u.curDate=_),onChange:u.curDateChange},{header:k(_=>[l(" \u5F53\u524D\u65E5\u671F "+h(_)+" ",1),i(F,{onClick:u.addADay},{default:k(()=>[s]),_:1},8,["onClick"])]),_:1},8,["modelValue","onChange"])])}const{defineComponent:e,ref:c}=C,D=e({setup(){const u=g=>{console.log(g)},p=c(new Date);return{curDateChange:u,curDate:p,addADay:()=>{const g=new Date(p.value).getTime()+864e5;p.value=new Date(g)}}}});return{render:t,...D}}(),"render-demo-2":function(){const{toDisplayString:h,createTextVNode:l,resolveComponent:r,withCtx:k,createVNode:i,openBlock:m,createElementBlock:d}=C;function s(c,D){const u=r("k-calendar");return m(),d("div",null,[i(u,{onChange:c.curDateChange},{dateCell:k(({isSelected:p,date:F,day:g})=>[l(h(p?"\u5F53\u524D\u9009\u4E2D\u65E5\u671F":g),1)]),_:1},8,["onChange"])])}const{defineComponent:t}=C,e=t({setup(){return{curDateChange:D=>{console.log(D)}}}});return{render:s,...e}}()}},J=JSON.parse('{"title":"Calendar \u65E5\u5386","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F55\u65F6\u4F7F\u7528","slug":"\u4F55\u65F6\u4F7F\u7528"},{"level":2,"title":"\u57FA\u672C\u7528\u6CD5","slug":"\u57FA\u672C\u7528\u6CD5"},{"level":2,"title":"\u81EA\u5B9A\u4E49 header","slug":"\u81EA\u5B9A\u4E49-header"},{"level":2,"title":"\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9","slug":"\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9"},{"level":2,"title":"Calendar \u53C2\u6570","slug":"calendar-\u53C2\u6570"},{"level":2,"title":"Calendar \u4E8B\u4EF6","slug":"calendar-\u4E8B\u4EF6"},{"level":2,"title":"Calendar \u63D2\u69FD","slug":"calendar-\u63D2\u69FD"}],"relativePath":"components/calendar/index.md","lastUpdated":1663859363000}'),b=v('<h1 id="calendar-\u65E5\u5386" tabindex="-1">Calendar \u65E5\u5386 <a class="header-anchor" href="#calendar-\u65E5\u5386" aria-hidden="true">#</a></h1><ul><li>\u65E5\u5386\u7EC4\u4EF6</li></ul><h2 id="\u4F55\u65F6\u4F7F\u7528" tabindex="-1">\u4F55\u65F6\u4F7F\u7528 <a class="header-anchor" href="#\u4F55\u65F6\u4F7F\u7528" aria-hidden="true">#</a></h2><ul><li>\u663E\u793A\u65E5\u671F</li></ul><h2 id="\u57FA\u672C\u7528\u6CD5" tabindex="-1">\u57FA\u672C\u7528\u6CD5 <a class="header-anchor" href="#\u57FA\u672C\u7528\u6CD5" aria-hidden="true">#</a></h2>',5),x=n("div",null,"Calendar \u793A\u4F8B",-1),V=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-calendar")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDate"),n("span",{class:"token punctuation"},'"')]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDateChange"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-calendar")]),n("span",{class:"token punctuation"},">")]),a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[a(`
`),n("span",{class:"token keyword"},"import"),a(),n("span",{class:"token punctuation"},"{"),a("defineComponent"),n("span",{class:"token punctuation"},","),a(" ref"),n("span",{class:"token punctuation"},"}"),a(),n("span",{class:"token keyword"},"from"),a(),n("span",{class:"token string"},"'vue'"),a(`

`),n("span",{class:"token keyword"},"export"),a(),n("span",{class:"token keyword"},"default"),a(),n("span",{class:"token function"},"defineComponent"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token punctuation"},"{"),a(`
    `),n("span",{class:"token keyword"},"const"),a(" curDate "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token keyword"},"new"),a(),n("span",{class:"token class-name"},"Date"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),a(`

    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"curDateChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),a("val"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`
    `),n("span",{class:"token keyword"},"return"),a(),n("span",{class:"token punctuation"},"{"),a(`
      curDate`),n("span",{class:"token punctuation"},","),a(`
      curDateChange
    `),n("span",{class:"token punctuation"},"}"),a(`
  `),n("span",{class:"token punctuation"},"}"),a(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("script")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("style")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},`

`)]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),N=n("h2",{id:"\u81EA\u5B9A\u4E49-header",tabindex:"-1"},[a("\u81EA\u5B9A\u4E49 header "),n("a",{class:"header-anchor",href:"#\u81EA\u5B9A\u4E49-header","aria-hidden":"true"},"#")],-1),T=n("div",null,"Calendar \u793A\u4F8B",-1),S=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-calendar")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDate"),n("span",{class:"token punctuation"},'"')]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDateChange"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),a(),n("span",{class:"token attr-name"},"#header"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("date"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      \u5F53\u524D\u65E5\u671F {{date}}
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-button")]),a(),n("span",{class:"token attr-name"},"@click"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("addADay"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a("\u52A0\u4E00\u5929"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-button")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-calendar")]),n("span",{class:"token punctuation"},">")]),a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[a(`
`),n("span",{class:"token keyword"},"import"),a(),n("span",{class:"token punctuation"},"{"),a("defineComponent"),n("span",{class:"token punctuation"},","),a(" ref"),n("span",{class:"token punctuation"},"}"),a(),n("span",{class:"token keyword"},"from"),a(),n("span",{class:"token string"},"'vue'"),a(`

`),n("span",{class:"token keyword"},"export"),a(),n("span",{class:"token keyword"},"default"),a(),n("span",{class:"token function"},"defineComponent"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token punctuation"},"{"),a(`
    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"curDateChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),a("val"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`

    `),n("span",{class:"token keyword"},"const"),a(" curDate "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token keyword"},"new"),a(),n("span",{class:"token class-name"},"Date"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),a(`

    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"addADay"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      `),n("span",{class:"token keyword"},"const"),a(" dateTime "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token keyword"},"new"),a(),n("span",{class:"token class-name"},"Date"),n("span",{class:"token punctuation"},"("),a("curDate"),n("span",{class:"token punctuation"},"."),a("value"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"getTime"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"+"),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"1000"),a(),n("span",{class:"token operator"},"*"),a(),n("span",{class:"token number"},"60"),a(),n("span",{class:"token operator"},"*"),a(),n("span",{class:"token number"},"60"),a(),n("span",{class:"token operator"},"*"),a(),n("span",{class:"token number"},"24"),n("span",{class:"token punctuation"},")"),a(`
      curDate`),n("span",{class:"token punctuation"},"."),a("value "),n("span",{class:"token operator"},"="),a(),n("span",{class:"token keyword"},"new"),a(),n("span",{class:"token class-name"},"Date"),n("span",{class:"token punctuation"},"("),a("dateTime"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`
    `),n("span",{class:"token keyword"},"return"),a(),n("span",{class:"token punctuation"},"{"),a(`
      curDateChange`),n("span",{class:"token punctuation"},","),a(`
      curDate`),n("span",{class:"token punctuation"},","),a(`
      addADay
    `),n("span",{class:"token punctuation"},"}"),a(`
  `),n("span",{class:"token punctuation"},"}"),a(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("script")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("style")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},`

`)]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),q=n("h2",{id:"\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9",tabindex:"-1"},[a("\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9 "),n("a",{class:"header-anchor",href:"#\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9","aria-hidden":"true"},"#")],-1),Y=n("div",null,"Calendar \u793A\u4F8B",-1),$=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("k-calendar")]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDateChange"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),a(),n("span",{class:"token attr-name"},"#dateCell"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("{isSelected, date, day}"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      {{isSelected ? '\u5F53\u524D\u9009\u4E2D\u65E5\u671F' : day}}
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("k-calendar")]),n("span",{class:"token punctuation"},">")]),a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("script")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token script"},[n("span",{class:"token language-javascript"},[a(`
`),n("span",{class:"token keyword"},"import"),a(),n("span",{class:"token punctuation"},"{"),a("defineComponent"),n("span",{class:"token punctuation"},"}"),a(),n("span",{class:"token keyword"},"from"),a(),n("span",{class:"token string"},"'vue'"),a(`

`),n("span",{class:"token keyword"},"export"),a(),n("span",{class:"token keyword"},"default"),a(),n("span",{class:"token function"},"defineComponent"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token punctuation"},"{"),a(`
    `),n("span",{class:"token keyword"},"const"),a(),n("span",{class:"token function-variable function"},"curDateChange"),a(),n("span",{class:"token operator"},"="),a(),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"val"),n("span",{class:"token punctuation"},")"),a(),n("span",{class:"token operator"},"=>"),a(),n("span",{class:"token punctuation"},"{"),a(`
      console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),a("val"),n("span",{class:"token punctuation"},")"),a(`
    `),n("span",{class:"token punctuation"},"}"),a(`
    `),n("span",{class:"token keyword"},"return"),a(),n("span",{class:"token punctuation"},"{"),a(`
      curDateChange
    `),n("span",{class:"token punctuation"},"}"),a(`
  `),n("span",{class:"token punctuation"},"}"),a(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("script")]),n("span",{class:"token punctuation"},">")]),a(`

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("style")]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},`

`)]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),j=v('<h2 id="calendar-\u53C2\u6570" tabindex="-1">Calendar \u53C2\u6570 <a class="header-anchor" href="#calendar-\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>v-model</td><td><code>Date</code></td><td>--</td><td>\u5FC5\u9009\uFF0C\u7EC4\u4EF6\u7ED1\u5B9A\u7684\u503C</td></tr></tbody></table><h2 id="calendar-\u4E8B\u4EF6" tabindex="-1">Calendar \u4E8B\u4EF6 <a class="header-anchor" href="#calendar-\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u4E8B\u4EF6</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>change</td><td><code>string</code></td><td>\u65E5\u671F\u6539\u53D8\u540E\u7684\u503C</td></tr></tbody></table><h2 id="calendar-\u63D2\u69FD" tabindex="-1">Calendar \u63D2\u69FD <a class="header-anchor" href="#calendar-\u63D2\u69FD" aria-hidden="true">#</a></h2><table><thead><tr><th>\u63D2\u69FD\u540D</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>header</td><td>\u81EA\u5B9A\u4E49\u65E5\u5386\u5934\u90E8\uFF0C\u53C2\u6570<code>date</code>\u5F53\u524D\u65E5\u671F</td></tr><tr><td>dateCell</td><td>\u8FD4\u56DE <code>data: { isSelected, date, day }</code> \u53C2\u6570 <code>isSelected</code> \u662F\u5426\u9009\u4E2D,<code>date</code> \u662F\u683C\u5F0F\u5316\u7684\u65E5\u671F\u683C\u5F0F\u4E3A YYYY-MM-DD, <code>day</code> \u5355\u5143\u683C\u7684\u65E5\u671F \u3002</td></tr></tbody></table>',6);function U(h,l,r,k,i,m){const d=f("render-demo-0"),s=f("demo"),t=f("render-demo-1"),e=f("render-demo-2");return B(),A("div",null,[b,E(s,{sourceCode:`
<template>
  <k-calendar v-model="curDate" @change="curDateChange"></k-calendar>
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
`},{description:o(()=>[x]),highlight:o(()=>[V]),default:o(()=>[E(d)]),_:1}),N,E(s,{sourceCode:`
<template>
  <k-calendar v-model="curDate" @change="curDateChange">
    <template #header="date">
      \u5F53\u524D\u65E5\u671F {{date}}
      <k-button @click="addADay">\u52A0\u4E00\u5929</k-button>
    </template>
  </k-calendar>
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

<style>

</style>
`},{description:o(()=>[T]),highlight:o(()=>[S]),default:o(()=>[E(t)]),_:1}),q,E(s,{sourceCode:`
<template>
  <k-calendar @change="curDateChange">
    <template #dateCell="{isSelected, date, day}">
      {{isSelected ? '\u5F53\u524D\u9009\u4E2D\u65E5\u671F' : day}}
    </template>
  </k-calendar>
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
`},{description:o(()=>[Y]),highlight:o(()=>[$]),default:o(()=>[E(e)]),_:1}),j])}const O=y(w,[["render",U]]);export{J as __pageData,O as default};
