import{a4 as a,_ as C,D,c as E,G as i,B as n,R as d,o as A,z as l,a as s}from"./chunks/framework.50008e6a.js";const{defineComponent:h}=a,v=h({name:"component-doc",components:{"render-demo-0":function(){const{resolveComponent:c,openBlock:t,createBlock:p}=a;function F(o,B){const u=c("c-tree");return t(),p(u,{data:o.data},null,8,["data"])}const{defineComponent:r,ref:y}=a,e=r({setup(){return{data:y([{label:"一级 1",level:1,children:[{label:"二级 1-1",level:2,children:[{label:"三级 1-1-1",level:3}]}]},{label:"一级 2",level:1,open:!0,children:[{label:"二级 2-1",level:2,children:[{label:"三级 2-1-1",level:3}]},{label:"二级 2-2",level:2,children:[{label:"三级 2-2-1",level:3}]}]},{label:"一级 3",level:1,open:!0,children:[{label:"二级 3-1",level:2,children:[{label:"三级 3-1-1",level:3}]},{label:"二级 3-2",level:2,open:!0,children:[{label:"三级 3-2-1",level:3}]}]},{label:"一级 4",level:1}])}}});return{render:F,...e}}()}}),k=JSON.parse('{"title":"Tree 树","description":"","frontmatter":{},"headers":[],"relativePath":"components/tree/index.md","filePath":"components/tree/index.md","lastUpdated":1684159695000}'),b=d('<h1 id="tree-树" tabindex="-1">Tree 树 <a class="header-anchor" href="#tree-树" aria-label="Permalink to &quot;Tree 树&quot;">​</a></h1><ul><li>用清晰的层级结构展示信息，可展开或折叠。</li></ul><h2 id="何时使用" tabindex="-1">何时使用 <a class="header-anchor" href="#何时使用" aria-label="Permalink to &quot;何时使用&quot;">​</a></h2><ul><li>需要展示层级结构。</li></ul><h2 id="基本用法" tabindex="-1">基本用法 <a class="header-anchor" href="#基本用法" aria-label="Permalink to &quot;基本用法&quot;">​</a></h2>',5),m=l("div",null,"渲染一棵基本树",-1),f=l("div",{class:"language-vue"},[l("pre",{"v-pre":"",class:"shiki material-theme-palenight"},[l("code",null,[l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"c-tree"),l("span",{style:{color:"#89DDFF"}}," "),l("span",{style:{color:"#C792EA"}},":data"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"data"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},"></"),l("span",{style:{color:"#F07178"}},"c-tree"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"template"),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"<"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#C792EA"}},"lang"),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#C3E88D"}},"ts"),l("span",{style:{color:"#89DDFF"}},'"'),l("span",{style:{color:"#89DDFF"}},">")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"import"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"defineComponent"),l("span",{style:{color:"#89DDFF"}},","),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"ref"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"from"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"vue"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},";")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF","font-style":"italic"}},"export"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"default"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#82AAFF"}},"defineComponent"),l("span",{style:{color:"#A6ACCD"}},"("),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#A6ACCD"}},"  "),l("span",{style:{color:"#F07178"}},"setup"),l("span",{style:{color:"#89DDFF"}},"()"),l("span",{style:{color:"#A6ACCD"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#C792EA"}},"const"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#A6ACCD"}},"data"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"="),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#82AAFF"}},"ref"),l("span",{style:{color:"#F07178"}},"([")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"一级 1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"1"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"二级 1-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"三级 1-1-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"3")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"一级 2"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"1"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        open"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#FF9CAC"}},"true"),l("span",{style:{color:"#89DDFF"}},","),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#676E95","font-style":"italic"}},"// 新增")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"二级 2-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"三级 2-1-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"3")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"二级 2-2"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"三级 2-2-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"3")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"一级 3"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"1"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        open"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#FF9CAC"}},"true"),l("span",{style:{color:"#89DDFF"}},","),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#676E95","font-style":"italic"}},"// 新增")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"二级 3-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"三级 3-1-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"3")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"二级 3-2"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"2"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            open"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#FF9CAC"}},"true"),l("span",{style:{color:"#89DDFF"}},","),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#676E95","font-style":"italic"}},"// 新增")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            children"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," [")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"三级 3-2-1"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"                level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"3")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"              "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"            ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"          "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        ]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"},")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        label"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#C3E88D"}},"一级 4"),l("span",{style:{color:"#89DDFF"}},"'"),l("span",{style:{color:"#89DDFF"}},",")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"        level"),l("span",{style:{color:"#89DDFF"}},":"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#F78C6C"}},"1")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    ])"),l("span",{style:{color:"#89DDFF"}},";")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF","font-style":"italic"}},"return"),l("span",{style:{color:"#F07178"}}," "),l("span",{style:{color:"#89DDFF"}},"{")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"      "),l("span",{style:{color:"#A6ACCD"}},"data")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"    "),l("span",{style:{color:"#89DDFF"}},"};")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#F07178"}},"  "),l("span",{style:{color:"#89DDFF"}},"}")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"}"),l("span",{style:{color:"#A6ACCD"}},")"),l("span",{style:{color:"#89DDFF"}},";")]),s(`
`),l("span",{class:"line"},[l("span",{style:{color:"#89DDFF"}},"</"),l("span",{style:{color:"#F07178"}},"script"),l("span",{style:{color:"#89DDFF"}},">")])])])],-1);function _(c,t,p,F,r,y){const e=D("render-demo-0"),o=D("demo");return A(),E("div",null,[b,i(o,{customClass:"undefined",sourceCode:`<template>
  <c-tree :data="data"></c-tree>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const data = ref([
      {
        label: '一级 1',
        level: 1,
        children: [
          {
            label: '二级 1-1',
            level: 2,
            children: [
              {
                label: '三级 1-1-1',
                level: 3
              }
            ]
          }
        ]
      },
      {
        label: '一级 2',
        level: 1,
        open: true, // 新增
        children: [
          {
            label: '二级 2-1',
            level: 2,
            children: [
              {
                label: '三级 2-1-1',
                level: 3
              }
            ]
          },
          {
            label: '二级 2-2',
            level: 2,
            children: [
              {
                label: '三级 2-2-1',
                level: 3
              }
            ]
          }
        ]
      },
      {
        label: '一级 3',
        level: 1,
        open: true, // 新增
        children: [
          {
            label: '二级 3-1',
            level: 2,
            children: [
              {
                label: '三级 3-1-1',
                level: 3
              }
            ]
          },
          {
            label: '二级 3-2',
            level: 2,
            open: true, // 新增
            children: [
              {
                label: '三级 3-2-1',
                level: 3
              }
            ]
          }
        ]
      },
      {
        label: '一级 4',
        level: 1
      }
    ]);

    return {
      data
    };
  }
});
<\/script>
`},{description:n(()=>[m]),highlight:n(()=>[f]),default:n(()=>[i(e)]),_:1})])}const g=C(v,[["render",_]]);export{k as __pageData,g as default};
