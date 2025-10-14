import{j as e,S as n}from"./app-CSbLTV9t.js";import{A as t,a as o,b as r}from"./avatar-DBnd5X0z.js";import{D as h,a as p,b as u,f as g,g as c,i as j,c as d}from"./dropdown-menu-DsAxoPEU.js";import{u as f,b as N,c as b,d as y}from"./sidebar-EM1pc_Vu.js";import{c as a}from"./createLucideIcon-K65SoRPX.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],k=a("badge-check",w);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],v=a("chevrons-up-down",M);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],l=a("circle-user-round",D);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],_=a("log-out",C);function U({user:s}){const{isMobile:i}=f(),x=()=>{n.post(route("logout"))},m=()=>{n.get(route("profile.edit"))};return e.jsx(N,{className:"bg-blue-100 rounded-xl",children:e.jsx(b,{children:e.jsxs(h,{children:[e.jsx(p,{asChild:!0,children:e.jsxs(y,{size:"lg",className:"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",children:[e.jsxs(t,{className:"h-8 w-8 rounded-lg",children:[e.jsx(o,{src:s.avatar,alt:s.name}),e.jsx(r,{className:"rounded-lg",children:e.jsx(l,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.name}),e.jsx("span",{className:"truncate text-xs",children:s.email})]}),e.jsx(v,{className:"ml-auto size-4"})]})}),e.jsxs(u,{className:"w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",side:i?"bottom":"right",align:"end",sideOffset:4,children:[e.jsx(g,{className:"p-0 font-normal",children:e.jsxs("div",{className:"flex items-center gap-2 px-1 py-1.5 text-left text-sm",children:[e.jsxs(t,{className:"h-8 w-8 rounded-lg",children:[e.jsx(o,{src:s.avatar,alt:s.name}),e.jsx(r,{className:"rounded-lg",children:e.jsx(l,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.name}),e.jsx("span",{className:"truncate text-xs",children:s.email})]})]})}),e.jsx(c,{}),e.jsx(j,{children:e.jsxs(d,{onClick:m,children:[e.jsx(k,{}),"Profile"]})}),e.jsx(c,{}),e.jsxs(d,{onClick:x,children:[e.jsx(_,{}),"Log out"]})]})]})})})}export{v as C,U as N,l as a};
