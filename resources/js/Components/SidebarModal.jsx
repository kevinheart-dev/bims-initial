// export default function SidebarModal({
//     isOpen,
//     onClose,
//     title = "Details",
//     children,
// }) {
//     if (!isOpen) return null;

//     return (
//         <>
//             {/* Overlay */}
//             <div
//                 className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[2px]"
//                 onClick={onClose}
//             />

//             {/* Sidebar Panel with Glassmorphism */}
//             <div
//                 className="fixed top-0 right-0 h-full w-[800px] z-[9999]
//                            bg-white/35 backdrop-blur-lg shadow-2xl border border-white/20
//                            rounded-l-2xl flex flex-col"
//             >
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-[14px] border-b border-white/30">
//                     <h2 className="text-lg font-semibold text-white">
//                         {title}
//                     </h2>
//                     <button
//                         onClick={onClose}
//                         className="text-2xl text-white hover:text-red-400 transition"
//                     >
//                         &times;
//                     </button>
//                 </div>

//                 {/* Scrollable Content */}
//                 <div className="p-6 text-sm text-white space-y-4 overflow-y-auto h-full">
//                     {children}
//                 </div>
//             </div>
//         </>
//     );
// }

// new no animation
import { X } from "lucide-react"; // optional if you use lucide-react


import React from "react";
export default function SidebarModal({
    isOpen,
    onClose,
    title = "Details",
    icon = null,
    children,
}) {
    // Return null if the modal is not open, preventing unnecessary rendering
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay: Full screen, semi-transparent black overlay */}
            <div
                className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Sidebar Panel: The main responsive changes are here */}
            <div
                className={`
                    fixed top-0 right-0 h-full z-[9999]
                    bg-white/90 backdrop-blur-md
                    shadow-[0_8px_30px_rgba(107,114,128,0.4)]
                    border border-gray-200 rounded-l-lg
                    flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    w-full                     /* Default: Full width on smallest screens (mobile) */
                    sm:w-[400px]               /* Sm: Width of 400px */
                    md:w-[600px]               /* Md: Width of 600px */
                    lg:w-[800px]               /* Lg: Width of 800px */

                    /* Transition state */
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-4 sm:px-6 py-4
                               bg-gradient-to-r from-blue-600 to-blue-500
                               border-b border-white/20 rounded-tl-lg shadow-md"
                >
                    {/* Title + optional icon */}
                    <div className="flex items-center gap-2">
                        {icon && (
                            <span className="text-white text-xl">{icon}</span>
                        )}
                        {/* Adjusted text size for better mobile fit */}
                        <h2 className="text-base sm:text-lg font-semibold text-white">
                            {title}
                        </h2>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center
                                   rounded-full bg-white/20 text-white text-lg
                                   hover:bg-red-500/80 hover:scale-105
                                   transition-all duration-200 ease-in-out"
                        aria-label="Close details sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                {/* Adjusted content padding for mobile */}
                <div className="p-4 sm:p-6 text-sm text-gray-800 overflow-y-auto h-full">
                    {children}
                </div>
            </div>
        </>
    );
}

// new with animation
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function SidebarModal({
//     isOpen,
//     onClose,
//     title = "Details",
//     icon = null,
//     children,
// }) {
//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     {/* Overlay */}
//                     <motion.div
//                         className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px]"
//                         onClick={onClose}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.25 }}
//                     />

//                     {/* Sidebar Panel */}
//                     <motion.div
//                         className="fixed top-0 right-0 h-full w-[800px] z-[9999]
//                        bg-white/70 backdrop-blur-sm
//                        shadow-[0_8px_30px_rgba(107,114,128,0.4)]
//                        border border-gray-300
//                        rounded-l-2xl flex flex-col"
//                         initial={{ x: "100%" }}
//                         animate={{ x: 0 }}
//                         exit={{ x: "100%" }}
//                         transition={{
//                             type: "spring",
//                             stiffness: 300,
//                             damping: 30,
//                         }}
//                     >
//                         {/* Header */}
//                         <div
//                             className="flex items-center justify-between px-6 py-4
//                          bg-gradient-to-r from-blue-600 to-blue-500
//                          border-b border-white/20
//                          rounded-tl-2xl shadow-sm"
//                         >
//                             {/* Title + optional icon */}
//                             <div className="flex items-center gap-2">
//                                 {icon && (
//                                     <span className="text-white text-xl">
//                                         {icon}
//                                     </span>
//                                 )}
//                                 <h2 className="text-lg font-semibold text-white">
//                                     {title}
//                                 </h2>
//                             </div>

//                             {/* Close Button */}
//                             <button
//                                 onClick={onClose}
//                                 className="w-8 h-8 flex items-center justify-center
//                            rounded-full bg-white/20 text-white text-lg
//                            hover:bg-red-500/80 hover:scale-105
//                            transition-all duration-200 ease-in-out"
//                             >
//                                 <X size={18} />
//                             </button>
//                         </div>

//                         {/* Scrollable Content */}
//                         <div className="p-6 text-sm text-gray-800 overflow-y-auto h-full">
//                             {children}
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }
