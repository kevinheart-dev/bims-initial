import{j as e,S as x}from"./app-DWLvIQdF.js";import{A as n,a as t,b as o}from"./avatar-xvo1q8ho.js";import{D as m,a as h,b as p,d as u,e as r,g,c}from"./dropdown-menu-301tgmQC.js";import{u as j,e as f,f as N,g as b}from"./sidebar-B55M1Lhe.js";import{c as a}from"./createLucideIcon-COg8xDid.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],w=a("badge-check",y);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],M=a("chevrons-up-down",k);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],d=a("circle-user-round",v);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],_=a("log-out",D);function I({user:s}){const{isMobile:l}=j(),i=()=>{x.post(route("logout"))};return e.jsx(f,{className:"bg-blue-100 rounded-xl",children:e.jsx(N,{children:e.jsxs(m,{children:[e.jsx(h,{asChild:!0,children:e.jsxs(b,{size:"lg",className:"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",children:[e.jsxs(n,{className:"h-8 w-8 rounded-lg",children:[e.jsx(t,{src:s.avatar,alt:s.name}),e.jsx(o,{className:"rounded-lg",children:e.jsx(d,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.name}),e.jsx("span",{className:"truncate text-xs",children:s.email})]}),e.jsx(M,{className:"ml-auto size-4"})]})}),e.jsxs(p,{className:"w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",side:l?"bottom":"right",align:"end",sideOffset:4,children:[e.jsx(u,{className:"p-0 font-normal",children:e.jsxs("div",{className:"flex items-center gap-2 px-1 py-1.5 text-left text-sm",children:[e.jsxs(n,{className:"h-8 w-8 rounded-lg",children:[e.jsx(t,{src:s.avatar,alt:s.name}),e.jsx(o,{className:"rounded-lg",children:e.jsx(d,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.name}),e.jsx("span",{className:"truncate text-xs",children:s.email})]})]})}),e.jsx(r,{}),e.jsx(g,{children:e.jsxs(c,{children:[e.jsx(w,{}),"Profile"]})}),e.jsx(r,{}),e.jsxs(c,{onClick:i,children:[e.jsx(_,{}),"Log out"]})]})]})})})}export{d as C,I as N,M as a};
