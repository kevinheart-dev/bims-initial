import{j as e}from"./app-CAI_Xi7A.js";function m({label:a,name:n,options:c=[],selectedValue:o,onChange:x,disabled:r,required:l}){return e.jsxs("div",{className:"relative mt-4",children:[a&&e.jsxs("label",{className:`block text-sm font-semibold mb-3
                    ${r?" text-gray-400":" text-gray-700"} `,children:[a,l&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsx("div",{className:"flex space-x-0.5",children:c.map(s=>{const t=String(o)===String(s.value);return e.jsxs("label",{className:`inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors duration-200
                                ${t?"bg-blue-600 text-white":"bg-white"}
                                ${r?"opacity-50 text-gray-400 cursor-not-allowed pointer-events-none":"text-gray-700 cursor-pointer"}
                            `,children:[e.jsx("input",{type:"radio",name:n,value:s.value,checked:t,onChange:x,disabled:r,required:l,className:"sr-only"}),e.jsx("span",{className:`w-4 h-4 mr-2 rounded-full flex items-center justify-center
                                    ${t?"bg-blue-200 border-2 border-blue-600":"border border-gray-400"}
                                    ${r?" text-gray-400":" text-gray-700"}
                                `,children:t&&e.jsx("span",{className:"w-2 h-2 bg-blue-600 rounded-full"})}),e.jsx("span",{className:"select-none",children:s.label})]},s.value)})})]})}export{m as R};
