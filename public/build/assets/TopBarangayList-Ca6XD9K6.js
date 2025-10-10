<<<<<<<< HEAD:public/build/assets/TopBarangayList-DSmtpvCf.js
import{r as t,j as s}from"./app-D2VBHUnE.js";import{c as u}from"./createLucideIcon-qFzIO3KD.js";import{U as x,H as j}from"./users-round-CjEM6b0u.js";import{U as g}from"./users-ClGwy-B6.js";/**
========
import{r as t,j as s}from"./app-NONmr2q7.js";import{c as u}from"./createLucideIcon-BjswQhwn.js";import{U as x,H as j}from"./users-round-BQO22qvz.js";import{U as g}from"./users-C4psMonS.js";/**
>>>>>>>> d53c8cea29bc4990092d0f62d98f9c556a0a4818:public/build/assets/TopBarangayList-Ca6XD9K6.js
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],N=u("arrow-down",w);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],y=u("arrow-up",v);function _({data:f,selectedBarangayId:a}){const[r,h]=t.useState("population"),[n,l]=t.useState(!1),i=t.useRef(null),c=t.useRef({});t.useRef(!1);const p={population:s.jsx(g,{className:"w-4 h-4"}),households:s.jsx(j,{className:"w-4 h-4"}),families:s.jsx(x,{className:"w-4 h-4"})},m=[...f].sort((e,o)=>n?e[r]-o[r]:o[r]-e[r]),b=e=>{e===r?l(!n):(h(e),l(!1))};return t.useEffect(()=>{if(a&&i.current&&c.current[a]){const e=c.current[a],o=i.current,d=e.offsetTop-o.offsetTop-o.clientHeight/2+e.clientHeight/2;o.scrollTo({top:d,behavior:"smooth"}),e.classList.add("bg-blue-200","font-semibold"),setTimeout(()=>{e.classList.remove("bg-blue-200","font-semibold")},1500)}},[a]),s.jsxs("div",{className:"w-full p-2 bg-white rounded-xl border border-gray-200",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsx("div",{className:"flex gap-2",children:["population","households","families"].map(e=>s.jsx("button",{onClick:()=>b(e),className:`p-1 rounded border ${r===e?"border-blue-500 bg-blue-50":"border-gray-200"} hover:bg-gray-100 transition-colors`,title:e.charAt(0).toUpperCase()+e.slice(1),children:p[e]},e))}),s.jsx("button",{onClick:()=>l(!n),className:"p-1 rounded hover:bg-gray-100",title:n?"Show Descending":"Show Ascending",children:n?s.jsx(N,{className:"w-4 h-4 text-gray-600"}):s.jsx(y,{className:"w-4 h-4 text-gray-600"})})]}),s.jsx("div",{ref:i,className:"max-h-60 overflow-y-auto",children:s.jsx("ul",{className:"text-sm text-gray-600",children:m.map((e,o)=>s.jsxs("li",{ref:d=>c.current[e.id]=d,className:`flex justify-between py-1 border-b last:border-b-0 transition-colors duration-300
                                ${a===e.id?"bg-blue-50 font-semibold":""}`,children:[s.jsxs("span",{children:[o+1,". ",e.barangay_name]}),s.jsx("span",{children:e[r]})]},e.id))})})]})}export{_ as default};
