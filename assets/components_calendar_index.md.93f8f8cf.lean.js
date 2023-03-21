import{V as D,_ as A,o as w,c as b,a as C,w as o,b as B,d as n,e as a,r as _}from"./app.8d219c14.js";const x={name:"component-doc",components:{"render-demo-0":function(){const{resolveComponent:g,createVNode:p,openBlock:l,createElementBlock:r}=D;function k(t,e){const c=g("c-calendar");return l(),r("div",null,[p(c,{modelValue:t.curDate,"onUpdate:modelValue":e[0]||(e[0]=m=>t.curDate=m),onChange:t.curDateChange},null,8,["modelValue","onChange"])])}const{defineComponent:h,ref:i}=D,s=h({setup(){return{curDate:i(new Date),curDateChange:c=>{console.log(c)}}}});return{render:k,...s}}(),"render-demo-1":function(){const{toDisplayString:g,createTextVNode:p,resolveComponent:l,withCtx:r,createVNode:k,createElementVNode:h,openBlock:i,createElementBlock:s}=D,t={class:"customize-header"},e=p("\u52A0\u4E00\u5929");function c(d,u){const y=l("c-button"),E=l("c-calendar");return i(),s("div",null,[k(E,{modelValue:d.curDate,"onUpdate:modelValue":u[0]||(u[0]=F=>d.curDate=F),onChange:d.curDateChange},{header:r(F=>[h("div",t,[p(" \u5F53\u524D\u65E5\u671F "+g(F)+" ",1),k(y,{type:"primary",plain:"",onClick:d.addADay},{default:r(()=>[e]),_:1},8,["onClick"])])]),_:1},8,["modelValue","onChange"])])}const{defineComponent:m,ref:f}=D,v=m({setup(){const d=E=>{console.log(E)},u=f(new Date);return{curDateChange:d,curDate:u,addADay:()=>{const E=new Date(u.value).getTime()+864e5;u.value=new Date(E)}}}});return{render:c,...v}}(),"render-demo-2":function(){const{toDisplayString:g,createTextVNode:p,resolveComponent:l,withCtx:r,createVNode:k,openBlock:h,createElementBlock:i}=D;function s(c,m){const f=l("c-calendar");return h(),i("div",null,[k(f,{onChange:c.curDateChange},{dateCell:r(({isSelected:v,date:d,day:u})=>[p(g(v?"\u5F53\u524D\u9009\u4E2D\u65E5\u671F":u),1)]),_:1},8,["onChange"])])}const{defineComponent:t}=D,e=t({setup(){return{curDateChange:m=>{console.log(m)}}}});return{render:s,...e}}()}},G=JSON.parse('{"title":"Calendar \u65E5\u5386","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F55\u65F6\u4F7F\u7528","slug":"\u4F55\u65F6\u4F7F\u7528"},{"level":2,"title":"\u57FA\u672C\u7528\u6CD5","slug":"\u57FA\u672C\u7528\u6CD5"},{"level":2,"title":"\u81EA\u5B9A\u4E49header","slug":"\u81EA\u5B9A\u4E49header"},{"level":2,"title":"\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9","slug":"\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9"},{"level":2,"title":"Calendar\u53C2\u6570","slug":"calendar\u53C2\u6570"},{"level":2,"title":"Calendar\u4E8B\u4EF6","slug":"calendar\u4E8B\u4EF6"},{"level":2,"title":"Calendar\u63D2\u69FD","slug":"calendar\u63D2\u69FD"}],"relativePath":"components/calendar/index.md","lastUpdated":1679388875000}');const V=B('<h1 id="calendar-\u65E5\u5386" tabindex="-1">Calendar \u65E5\u5386 <a class="header-anchor" href="#calendar-\u65E5\u5386" aria-hidden="true">#</a></h1><ul><li>\u65E5\u5386\u7EC4\u4EF6</li></ul><h2 id="\u4F55\u65F6\u4F7F\u7528" tabindex="-1">\u4F55\u65F6\u4F7F\u7528 <a class="header-anchor" href="#\u4F55\u65F6\u4F7F\u7528" aria-hidden="true">#</a></h2><ul><li>\u663E\u793A\u65E5\u671F</li></ul><h2 id="\u57FA\u672C\u7528\u6CD5" tabindex="-1">\u57FA\u672C\u7528\u6CD5 <a class="header-anchor" href="#\u57FA\u672C\u7528\u6CD5" aria-hidden="true">#</a></h2>',5),N=n("div",null,"Calendar \u793A\u4F8B",-1),T=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-calendar")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDate"),n("span",{class:"token punctuation"},'"')]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDateChange"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-calendar")]),n("span",{class:"token punctuation"},">")]),a(`
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
`)])])],-1),S=n("h2",{id:"\u81EA\u5B9A\u4E49header",tabindex:"-1"},[a("\u81EA\u5B9A\u4E49header "),n("a",{class:"header-anchor",href:"#\u81EA\u5B9A\u4E49header","aria-hidden":"true"},"#")],-1),q=n("div",null,"Calendar \u793A\u4F8B",-1),z=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-calendar")]),a(),n("span",{class:"token attr-name"},"v-model"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDate"),n("span",{class:"token punctuation"},'"')]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDateChange"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),a(),n("span",{class:"token attr-name"},"#header"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("date"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("div")]),a(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("customize-header"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
        \u5F53\u524D\u65E5\u671F {{date}}
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-button")]),a(),n("span",{class:"token attr-name"},"type"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("primary"),n("span",{class:"token punctuation"},'"')]),a(),n("span",{class:"token attr-name"},"plain"),a(),n("span",{class:"token attr-name"},"@click"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("addADay"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a("\u52A0\u4E00\u5929"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-button")]),n("span",{class:"token punctuation"},">")]),a(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("div")]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-calendar")]),n("span",{class:"token punctuation"},">")]),a(`
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

`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("style")]),a(),n("span",{class:"token attr-name"},"scoped"),n("span",{class:"token punctuation"},">")]),n("span",{class:"token style"},[n("span",{class:"token language-css"},[a(`
`),n("span",{class:"token selector"},".customize-header"),a(),n("span",{class:"token punctuation"},"{"),a(`
  `),n("span",{class:"token property"},"padding"),n("span",{class:"token punctuation"},":"),a(" 10px"),n("span",{class:"token punctuation"},";"),a(`
`),n("span",{class:"token punctuation"},"}"),a(`
`)])]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("style")]),n("span",{class:"token punctuation"},">")]),a(`
`)])])],-1),$=n("h2",{id:"\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9",tabindex:"-1"},[a("\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9 "),n("a",{class:"header-anchor",href:"#\u81EA\u5B9A\u4E49\u65E5\u671F\u5185\u5BB9","aria-hidden":"true"},"#")],-1),j=n("div",null,"Calendar \u793A\u4F8B",-1),U=n("div",{class:"language-vue"},[n("pre",null,[n("code",null,[a(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("c-calendar")]),a(),n("span",{class:"token attr-name"},"@change"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("curDateChange"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),a("template")]),a(),n("span",{class:"token attr-name"},"#dateCell"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),a("{isSelected, date, day}"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),a(`
      {{isSelected ? '\u5F53\u524D\u9009\u4E2D\u65E5\u671F' : day}}
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("template")]),n("span",{class:"token punctuation"},">")]),a(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),a("c-calendar")]),n("span",{class:"token punctuation"},">")]),a(`
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
`)])])],-1),J=B('<h2 id="calendar\u53C2\u6570" tabindex="-1">Calendar\u53C2\u6570 <a class="header-anchor" href="#calendar\u53C2\u6570" aria-hidden="true">#</a></h2><table><thead><tr><th>\u53C2\u6570</th><th>\u7C7B\u578B</th><th>\u9ED8\u8BA4</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>v-model</td><td><code>Date</code></td><td>--</td><td>\u5FC5\u9009\uFF0C\u7EC4\u4EF6\u7ED1\u5B9A\u7684\u503C</td></tr></tbody></table><h2 id="calendar\u4E8B\u4EF6" tabindex="-1">Calendar\u4E8B\u4EF6 <a class="header-anchor" href="#calendar\u4E8B\u4EF6" aria-hidden="true">#</a></h2><table><thead><tr><th>\u4E8B\u4EF6</th><th>\u7C7B\u578B</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>change</td><td><code>string</code></td><td>\u65E5\u671F\u6539\u53D8\u540E\u7684\u503C</td></tr></tbody></table><h2 id="calendar\u63D2\u69FD" tabindex="-1">Calendar\u63D2\u69FD <a class="header-anchor" href="#calendar\u63D2\u69FD" aria-hidden="true">#</a></h2><table><thead><tr><th>\u63D2\u69FD\u540D</th><th>\u8BF4\u660E</th></tr></thead><tbody><tr><td>header</td><td>\u81EA\u5B9A\u4E49\u65E5\u5386\u5934\u90E8\uFF0C\u53C2\u6570<code>date</code>\u5F53\u524D\u65E5\u671F</td></tr><tr><td>dateCell</td><td>\u8FD4\u56DE <code>data: { isSelected, date, day }</code>;<code>isSelected</code> \u662F\u5426\u9009\u4E2D\u3001<code>date</code> \u683C\u5F0F\u5316\u540E\u7684\u65E5\u671F\u3001 <code>day</code> \u5355\u5143\u683C\u7684\u65E5\u671F \u3002</td></tr></tbody></table>',6);function O(g,p,l,r,k,h){const i=_("render-demo-0"),s=_("demo"),t=_("render-demo-1"),e=_("render-demo-2");return w(),b("div",null,[V,C(s,{sourceCode:`
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
`},{description:o(()=>[N]),highlight:o(()=>[T]),default:o(()=>[C(i)]),_:1}),S,C(s,{sourceCode:`
<template>
  <c-calendar v-model="curDate" @change="curDateChange">
    <template #header="date">
      <div class="customize-header">
        \u5F53\u524D\u65E5\u671F {{date}}
        <c-button type="primary" plain @click="addADay">\u52A0\u4E00\u5929</c-button>
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
`},{description:o(()=>[q]),highlight:o(()=>[z]),default:o(()=>[C(t)]),_:1}),$,C(s,{sourceCode:`
<template>
  <c-calendar @change="curDateChange">
    <template #dateCell="{isSelected, date, day}">
      {{isSelected ? '\u5F53\u524D\u9009\u4E2D\u65E5\u671F' : day}}
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
`},{description:o(()=>[j]),highlight:o(()=>[U]),default:o(()=>[C(e)]),_:1}),J])}const H=A(x,[["render",O]]);export{G as __pageData,H as default};
